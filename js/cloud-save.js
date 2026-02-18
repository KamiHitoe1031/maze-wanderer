/**
 * cloud-save.js - Supabaseクラウドセーブ管理
 *
 * Supabase REST API を fetch() で直接呼び出す。
 * 外部ライブラリ不使用。
 */

const SESSION_KEY = 'maze_wanderer_cloud_session';
const EMAIL_DOMAIN = 'maze-wanderer.game';

export class CloudSaveManager {
  /**
   * @param {string} supabaseUrl - Supabase Project URL
   * @param {string} anonKey - Supabase anon (public) key
   */
  constructor(supabaseUrl, anonKey) {
    this.supabaseUrl = supabaseUrl;
    this.anonKey = anonKey;
    this.accessToken = null;
    this.refreshToken = null;
    this.userId = null;     // display ID (without @domain)
    this.userUuid = null;   // Supabase auth UUID
    this.expiresAt = 0;     // access_token expiry timestamp
    this.syncing = false;

    this._loadSession();
  }

  /**
   * ログイン中かどうか
   */
  get isLoggedIn() {
    return this.accessToken !== null && this.userUuid !== null;
  }

  /**
   * 表示用ユーザーID
   */
  get currentUserId() {
    return this.userId;
  }

  // ========== 認証 ==========

  /**
   * 新規登録
   * @param {string} userId - 3〜20文字の英数字・アンダースコア
   * @param {string} password - 8文字以上
   * @returns {{ ok: boolean, error?: string }}
   */
  async register(userId, password) {
    const validation = this._validateInput(userId, password);
    if (validation) return { ok: false, error: validation };

    const email = this._toEmail(userId);

    try {
      const res = await fetch(`${this.supabaseUrl}/auth/v1/signup`, {
        method: 'POST',
        headers: this._authHeaders(),
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        // Supabase returns various error formats
        const msg = data.error_description || data.msg || data.error || '登録に失敗しました';
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          return { ok: false, error: 'このIDは既に使われています' };
        }
        return { ok: false, error: msg };
      }

      // signup with email confirmation disabled returns session immediately
      if (data.access_token) {
        this._setSession(data, userId);
        return { ok: true };
      }

      // If session is nested in data.session
      if (data.session && data.session.access_token) {
        this._setSession(data.session, userId);
        return { ok: true };
      }

      // User created but no session (email confirmation might be on)
      if (data.user || data.id) {
        // Try logging in immediately
        return await this.login(userId, password);
      }

      return { ok: false, error: '登録は完了しましたが、ログインに失敗しました' };
    } catch (e) {
      return { ok: false, error: 'ネットワークエラー: サーバーに接続できません' };
    }
  }

  /**
   * ログイン
   * @param {string} userId
   * @param {string} password
   * @returns {{ ok: boolean, error?: string }}
   */
  async login(userId, password) {
    const validation = this._validateInput(userId, password);
    if (validation) return { ok: false, error: validation };

    const email = this._toEmail(userId);

    try {
      const res = await fetch(
        `${this.supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: this._authHeaders(),
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error_description || data.msg || data.error || '';
        if (res.status === 400 || res.status === 401) {
          return { ok: false, error: 'IDまたはパスワードが正しくありません' };
        }
        return { ok: false, error: msg || 'ログインに失敗しました' };
      }

      this._setSession(data, userId);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'ネットワークエラー: サーバーに接続できません' };
    }
  }

  /**
   * ログアウト
   */
  async logout() {
    if (this.accessToken) {
      try {
        await fetch(`${this.supabaseUrl}/auth/v1/logout`, {
          method: 'POST',
          headers: {
            ...this._authHeaders(),
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
      } catch (e) {
        // ログアウト失敗してもローカルセッションは消す
      }
    }

    this.accessToken = null;
    this.refreshToken = null;
    this.userId = null;
    this.userUuid = null;
    this.expiresAt = 0;
    this._saveSession();
  }

  // ========== データ同期 ==========

  /**
   * セーブデータをサーバーにアップロード
   * @param {object} permanentData - 永続セーブデータ
   * @param {object|null} suspendData - 中断セーブデータ
   * @returns {{ ok: boolean, error?: string }}
   */
  async pushSave(permanentData, suspendData = null) {
    if (!this.isLoggedIn) return { ok: false, error: 'ログインしていません' };
    if (this.syncing) return { ok: false, error: '同期中です' };

    this.syncing = true;
    try {
      await this._ensureValidToken();

      const payload = {
        user_id: this.userUuid,
        permanent: permanentData,
        suspend: suspendData,
        updated_at: new Date().toISOString()
      };

      // UPSERT: 既存ならupdate、なければinsert
      const res = await fetch(
        `${this.supabaseUrl}/rest/v1/saves`,
        {
          method: 'POST',
          headers: {
            ...this._dataHeaders(),
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: false, error: data.message || 'セーブの同期に失敗しました' };
      }

      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'ネットワークエラー' };
    } finally {
      this.syncing = false;
    }
  }

  /**
   * セーブデータをサーバーからダウンロード
   * @returns {{ ok: boolean, data?: { permanent, suspend }, error?: string }}
   */
  async pullSave() {
    if (!this.isLoggedIn) return { ok: false, error: 'ログインしていません' };

    try {
      await this._ensureValidToken();

      const res = await fetch(
        `${this.supabaseUrl}/rest/v1/saves?user_id=eq.${this.userUuid}&select=permanent,suspend,updated_at`,
        {
          method: 'GET',
          headers: this._dataHeaders()
        }
      );

      if (!res.ok) {
        return { ok: false, error: 'データの読み込みに失敗しました' };
      }

      const rows = await res.json();

      if (!rows || rows.length === 0) {
        return { ok: true, data: { permanent: null, suspend: null } };
      }

      const row = rows[0];
      return {
        ok: true,
        data: {
          permanent: row.permanent,
          suspend: row.suspend,
          updatedAt: row.updated_at
        }
      };
    } catch (e) {
      return { ok: false, error: 'ネットワークエラー' };
    }
  }

  // ========== 内部メソッド ==========

  /**
   * ユーザーIDをメールアドレス形式に変換
   */
  _toEmail(userId) {
    return `${userId.toLowerCase()}@${EMAIL_DOMAIN}`;
  }

  /**
   * メールアドレスからユーザーIDを抽出
   */
  _fromEmail(email) {
    return email.split('@')[0];
  }

  /**
   * 入力バリデーション
   * @returns {string|null} エラーメッセージ or null
   */
  _validateInput(userId, password) {
    if (!userId || typeof userId !== 'string') {
      return 'IDを入力してください';
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(userId)) {
      return 'IDは3〜20文字の英数字・アンダースコアで入力してください';
    }
    if (!password || typeof password !== 'string') {
      return 'パスワードを入力してください';
    }
    if (password.length < 8) {
      return 'パスワードは8文字以上で入力してください';
    }
    if (password.length > 72) {
      return 'パスワードは72文字以下で入力してください';
    }
    return null;
  }

  /**
   * 認証用ヘッダー（apikey のみ）
   */
  _authHeaders() {
    return {
      'apikey': this.anonKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * データ操作用ヘッダー（apikey + Bearer token）
   */
  _dataHeaders() {
    return {
      'apikey': this.anonKey,
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * セッション情報をセット
   */
  _setSession(data, userId) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.userId = userId.toLowerCase();
    this.expiresAt = Date.now() + (data.expires_in || 3600) * 1000;

    // UUIDはJWTのsub claimから取得
    if (data.user && data.user.id) {
      this.userUuid = data.user.id;
    } else {
      // JWTをデコードしてsubを取得
      try {
        const payload = JSON.parse(atob(this.accessToken.split('.')[1]));
        this.userUuid = payload.sub;
      } catch (e) {
        this.userUuid = null;
      }
    }

    this._saveSession();
  }

  /**
   * セッションをlocalStorageに保存
   */
  _saveSession() {
    if (this.accessToken && this.userUuid) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        userId: this.userId,
        userUuid: this.userUuid,
        expiresAt: this.expiresAt
      }));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  /**
   * セッションをlocalStorageから復元
   */
  _loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const session = JSON.parse(raw);
      this.accessToken = session.accessToken;
      this.refreshToken = session.refreshToken;
      this.userId = session.userId;
      this.userUuid = session.userUuid;
      this.expiresAt = session.expiresAt || 0;
    } catch (e) {
      // 破損データは無視
    }
  }

  /**
   * access_tokenが有効期限内か確認し、期限切れならリフレッシュ
   */
  async _ensureValidToken() {
    // 期限の5分前にリフレッシュ
    if (this.expiresAt > Date.now() + 5 * 60 * 1000) return;
    if (!this.refreshToken) return;

    try {
      const res = await fetch(
        `${this.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
        {
          method: 'POST',
          headers: this._authHeaders(),
          body: JSON.stringify({ refresh_token: this.refreshToken })
        }
      );

      if (!res.ok) {
        // リフレッシュ失敗 → ログアウト状態に
        this.accessToken = null;
        this.refreshToken = null;
        this.userUuid = null;
        this.expiresAt = 0;
        this._saveSession();
        return;
      }

      const data = await res.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresAt = Date.now() + (data.expires_in || 3600) * 1000;

      if (data.user && data.user.id) {
        this.userUuid = data.user.id;
      }

      this._saveSession();
    } catch (e) {
      // ネットワークエラー時はそのまま（古いトークンで試行）
    }
  }
}
