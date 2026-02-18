/**
 * main.js - 初期化・ゲームループ制御
 */

import { GameState, GAME_STATE } from './game.js';
import { Renderer } from './renderer.js';
import { InputHandler, ACTION } from './input.js';
import { UI } from './ui.js';
import { ITEM_CATEGORY } from './item.js';
import { SoundManager, SOUND } from './sound-manager.js';
import { Minimap } from './minimap.js';
import { SceneManager, SCENE } from './scene-manager.js';
import { getDungeonDef } from './data/dungeons.js';
import { SaveManager } from './save.js';
import { TownScene } from './town.js';
import { CloudSaveManager } from './cloud-save.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './data/config.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new Renderer(this.canvas);
    this.input = new InputHandler();
    this.ui = new UI();
    this.sound = new SoundManager();
    this.minimap = new Minimap(document.getElementById('minimap-canvas'));
    this.gameState = null;

    this.isRunning = false;
    this.inventoryBusy = false;
    this.soundInitialized = false;

    // セーブマネージャ
    this.saveManager = new SaveManager();

    // クラウドセーブマネージャ
    this.cloudSave = new CloudSaveManager(SUPABASE_URL, SUPABASE_ANON_KEY);

    // シーンマネージャ
    this.sceneManager = new SceneManager();

    // タウンシーン
    this.townScene = new TownScene(this.sceneManager, this.saveManager);

    this.setupScenes();
  }

  /**
   * シーンを登録
   */
  setupScenes() {
    // タイトルシーン
    this.sceneManager.register(SCENE.TITLE, {
      enter: () => this.enterTitle(),
      exit: () => this.exitTitle(),
      update: () => {},
      render: () => {}
    });

    // ダンジョンシーン
    this.sceneManager.register(SCENE.DUNGEON, {
      enter: (data) => this.enterDungeon(data),
      exit: () => this.exitDungeon(),
      update: () => this.updateDungeon(),
      render: () => this.renderDungeon()
    });

    // タウンシーン
    this.sceneManager.register(SCENE.TOWN, {
      enter: (data) => this.townScene.enter(data),
      exit: () => this.townScene.exit(),
      update: () => {},
      render: () => {}
    });
  }

  /**
   * タイトル画面に入る
   */
  enterTitle() {
    const titleScreen = document.getElementById('title-screen');
    const townScreen = document.getElementById('town-screen');
    const gameWrapper = document.getElementById('game-wrapper');

    if (titleScreen) titleScreen.style.display = 'flex';
    if (townScreen) townScreen.style.display = 'none';
    if (gameWrapper) gameWrapper.style.display = 'none';

    // 中断セーブがあるかチェック
    const hasSuspend = this.saveManager.hasSuspendData();

    // つづきからボタンの有効/無効
    const continueBtn = document.getElementById('continue-btn');
    const hasSaveData = hasSuspend ||
      this.saveManager.data.clearedDungeons.length > 0 ||
      this.saveManager.data.warehouse.length > 0 ||
      this.saveManager.data.gold > 0 ||
      Object.keys(this.saveManager.data.bestFloors).length > 0;

    if (continueBtn) {
      continueBtn.disabled = !hasSaveData;
    }

    // ボタンイベント（重複防止のためクローン置換）
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
      const freshNewBtn = newGameBtn.cloneNode(true);
      newGameBtn.parentNode.replaceChild(freshNewBtn, newGameBtn);
      freshNewBtn.addEventListener('click', () => {
        // 中断セーブがある場合は警告
        if (hasSuspend) {
          if (confirm('中断セーブがあります。新しく始めると中断セーブは消えます。よろしいですか？')) {
            this.saveManager.deleteSuspend();
            this.sceneManager.transition(SCENE.TOWN, {});
          }
        } else {
          this.sceneManager.transition(SCENE.TOWN, {});
        }
      });
    }

    if (continueBtn) {
      const freshContinueBtn = continueBtn.cloneNode(true);
      continueBtn.parentNode.replaceChild(freshContinueBtn, continueBtn);
      freshContinueBtn.disabled = !hasSaveData;
      freshContinueBtn.addEventListener('click', () => {
        if (!hasSaveData) return;
        // 中断セーブがあればダンジョン再開、なければ町へ
        if (hasSuspend) {
          this.sceneManager.transition(SCENE.DUNGEON, { resumeSuspend: true });
        } else {
          this.sceneManager.transition(SCENE.TOWN, {});
        }
      });
    }

    // アカウントセクションを描画
    this._renderAccountSection();
  }

  /**
   * アカウントセクションを描画
   */
  _renderAccountSection() {
    const section = document.getElementById('account-section');
    if (!section) return;

    if (this.cloudSave.isLoggedIn) {
      section.innerHTML = `
        <div class="account-info">
          <div class="account-user">
            <span class="cloud-icon">&#9729;</span>
            ログイン中: ${this.cloudSave.currentUserId}
          </div>
          <div class="account-actions">
            <button class="login-btn" id="sync-btn">データ同期</button>
            <button class="login-btn" id="logout-btn">ログアウト</button>
          </div>
          <div class="sync-status" id="sync-status"></div>
        </div>
      `;

      document.getElementById('sync-btn').addEventListener('click', () => this._syncData());
      document.getElementById('logout-btn').addEventListener('click', () => this._handleLogout());
    } else {
      section.innerHTML = `
        <div class="login-form">
          <div class="login-field">
            <span class="login-label">ID</span>
            <input type="text" class="login-input" id="login-id"
                   placeholder="3〜20文字 英数字" maxlength="20" autocomplete="username">
          </div>
          <div class="login-field">
            <span class="login-label">PW</span>
            <input type="password" class="login-input" id="login-pw"
                   placeholder="8文字以上" maxlength="72" autocomplete="current-password">
          </div>
          <div class="login-error" id="login-error"></div>
          <div class="login-buttons">
            <button class="login-btn" id="login-btn">ログイン</button>
            <button class="login-btn" id="register-btn">新規登録</button>
          </div>
          <div class="login-note">
            ※ログインでセーブデータをクラウドに保存できます<br>
            ※パスワードは復旧できません。忘れないでください
          </div>
        </div>
      `;

      document.getElementById('login-btn').addEventListener('click', () => this._handleLogin());
      document.getElementById('register-btn').addEventListener('click', () => this._handleRegister());

      // Enterキーでログイン
      const pwInput = document.getElementById('login-pw');
      if (pwInput) {
        pwInput.addEventListener('keydown', (e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            this._handleLogin();
          }
        });
      }
    }
  }

  /**
   * ログイン処理
   */
  async _handleLogin() {
    const idInput = document.getElementById('login-id');
    const pwInput = document.getElementById('login-pw');
    const errorEl = document.getElementById('login-error');
    if (!idInput || !pwInput) return;

    const userId = idInput.value.trim();
    const password = pwInput.value;

    errorEl.textContent = '';
    const result = await this.cloudSave.login(userId, password);

    if (result.ok) {
      // ログイン成功 → データ同期してUI更新
      await this._syncData();
      this._renderAccountSection();
      this._refreshContinueButton();
    } else {
      errorEl.textContent = result.error;
    }
  }

  /**
   * 新規登録処理
   */
  async _handleRegister() {
    const idInput = document.getElementById('login-id');
    const pwInput = document.getElementById('login-pw');
    const errorEl = document.getElementById('login-error');
    if (!idInput || !pwInput) return;

    const userId = idInput.value.trim();
    const password = pwInput.value;

    errorEl.textContent = '';
    const result = await this.cloudSave.register(userId, password);

    if (result.ok) {
      // 登録成功 → ローカルデータをサーバーにpush
      await this._pushToCloud();
      this._renderAccountSection();
    } else {
      errorEl.textContent = result.error;
    }
  }

  /**
   * ログアウト処理
   */
  async _handleLogout() {
    await this.cloudSave.logout();
    this._renderAccountSection();
  }

  /**
   * クラウドとデータ同期
   */
  async _syncData() {
    const statusEl = document.getElementById('sync-status');
    if (statusEl) statusEl.textContent = '同期中...';

    const pullResult = await this.cloudSave.pullSave();

    if (pullResult.ok && pullResult.data) {
      const serverPerm = pullResult.data.permanent;
      const serverSuspend = pullResult.data.suspend;
      const localPerm = this.saveManager.exportPermanentData();

      if (serverPerm && Object.keys(serverPerm).length > 0) {
        // マージ: clearedDungeonsは和集合、bestFloorsは最大値
        const merged = { ...localPerm };

        // clearedDungeons: 和集合
        const allCleared = new Set([
          ...(localPerm.clearedDungeons || []),
          ...(serverPerm.clearedDungeons || [])
        ]);
        merged.clearedDungeons = [...allCleared];

        // bestFloors: 各ダンジョンの最大値
        const allFloors = { ...(localPerm.bestFloors || {}), ...(serverPerm.bestFloors || {}) };
        for (const key of Object.keys(serverPerm.bestFloors || {})) {
          allFloors[key] = Math.max(allFloors[key] || 0, serverPerm.bestFloors[key] || 0);
        }
        for (const key of Object.keys(localPerm.bestFloors || {})) {
          allFloors[key] = Math.max(allFloors[key] || 0, localPerm.bestFloors[key] || 0);
        }
        merged.bestFloors = allFloors;

        // warehouse, gold: サーバー側を優先
        if (serverPerm.warehouse && serverPerm.warehouse.length > 0) {
          merged.warehouse = serverPerm.warehouse;
        }
        if (serverPerm.gold != null) {
          merged.gold = Math.max(localPerm.gold || 0, serverPerm.gold || 0);
        }

        this.saveManager.importPermanentData(merged);
      }

      // 中断セーブ: サーバーにあってローカルになければ復元
      if (serverSuspend && !this.saveManager.hasSuspendData()) {
        this.saveManager.importSuspendData(serverSuspend);
      }
    }

    // マージ結果をサーバーにpush
    await this._pushToCloud();

    if (statusEl) {
      statusEl.textContent = '同期完了 ' + new Date().toLocaleTimeString();
    }

    // つづきからボタンの状態を更新
    this._refreshContinueButton();
  }

  /**
   * ローカルデータをクラウドにpush
   */
  async _pushToCloud() {
    if (!this.cloudSave.isLoggedIn) return;
    const perm = this.saveManager.exportPermanentData();
    const suspend = this.saveManager.exportSuspendData();
    await this.cloudSave.pushSave(perm, suspend);
  }

  /**
   * つづきからボタンの有効/無効を更新
   */
  _refreshContinueButton() {
    const continueBtn = document.getElementById('continue-btn');
    if (!continueBtn) return;
    const hasSuspend = this.saveManager.hasSuspendData();
    const hasSaveData = hasSuspend ||
      this.saveManager.data.clearedDungeons.length > 0 ||
      this.saveManager.data.warehouse.length > 0 ||
      this.saveManager.data.gold > 0 ||
      Object.keys(this.saveManager.data.bestFloors).length > 0;
    continueBtn.disabled = !hasSaveData;
  }

  /**
   * タイトル画面を退出
   */
  exitTitle() {
    const titleScreen = document.getElementById('title-screen');
    if (titleScreen) titleScreen.style.display = 'none';
  }

  /**
   * ダンジョンシーンに入る
   */
  enterDungeon(data = {}) {
    this.ui.clearMessages();

    // 中断セーブからの再開
    if (data.resumeSuspend) {
      const saveData = this.saveManager.loadSuspend();
      if (saveData) {
        this.gameState = GameState.restore(saveData);
        this._setupDungeonCallbacks();

        // 保存されていたメッセージを復元
        if (saveData.messages) {
          for (const msg of saveData.messages) {
            this.ui.addMessage(msg.text || msg, msg.type || 'normal');
          }
        }
        this.ui.addMessage('冒険を再開した。', 'important');

        this._showDungeonUI();
        return;
      }
      // 中断セーブが読めなかった場合は通常開始にフォールバック
    }

    const dungeonDef = data.dungeonId
      ? getDungeonDef(data.dungeonId)
      : getDungeonDef('dungeon_1');

    this.gameState = new GameState(dungeonDef, {
      carryItems: data.carryItems || [],
      carryGold: data.carryGold || 0
    });

    this._setupDungeonCallbacks();
    this.ui.showStartMessage(dungeonDef.name);
    this._showDungeonUI();
  }

  /**
   * ダンジョン用コールバックを設定
   */
  _setupDungeonCallbacks() {
    this.gameState.onMessage = ({ text, type }) => {
      this.ui.addMessage(text, type);
    };
    this.gameState.onStateChange = (state) => {
      this.handleStateChange(state);
    };
    this.gameState.onSound = (soundKey) => {
      this.sound.play(soundKey);
    };
    this.gameState.onEffect = ({ effectKey, x, y }) => {
      this.renderer.drawAttackEffect(x, y, null, effectKey);
    };
    this.renderer.spriteManager.onAllLoaded = () => {
      this.renderDungeon();
    };
  }

  /**
   * ダンジョンUI表示・初期描画
   */
  _showDungeonUI() {
    this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);
    this.ui.updateStatus(this.gameState);

    const gameWrapper = document.getElementById('game-wrapper');
    const gameContainer = document.getElementById('game-container');
    const sidePanel = document.getElementById('side-panel');
    if (gameWrapper) gameWrapper.style.display = '';
    if (gameContainer) gameContainer.style.display = '';
    if (sidePanel) sidePanel.style.display = '';

    window.debug = this.gameState.debug;
    this.isRunning = true;
    this.inventoryBusy = false;
    this.renderDungeon();
  }

  /**
   * ダンジョンシーンを退出
   */
  exitDungeon() {
    this.isRunning = false;
    this.gameState = null;
  }

  /**
   * ダンジョンシーンの更新
   */
  updateDungeon() {
    if (!this.isRunning) return;
    if (!this.gameState) return;

    // デバッグ復活（F9）: ゲームオーバー中でも受け付ける
    if (this.input.hasAction()) {
      const peeked = this.input.pendingAction;
      if (peeked === ACTION.DEBUG_REVIVE && this.gameState.state === GAME_STATE.GAME_OVER) {
        this.input.getAction(); // consume
        this.gameState.player.hp = this.gameState.player.maxHp;
        this.gameState.player.isAlive = true;
        this.gameState.player.fullness = Math.max(this.gameState.player.fullness, 50);
        this.gameState.state = GAME_STATE.PLAYING;
        this.ui.addMessage('[DEBUG] その場で復活した！', 'important');
        this.ui.updateStatus(this.gameState);
        // ゲームオーバーオーバーレイを除去
        const overlay = document.querySelector('.game-overlay');
        if (overlay) overlay.remove();
        this.renderDungeon();
        return;
      }
    }

    if (this.gameState.state !== GAME_STATE.PLAYING) return;
    if (this.inventoryBusy) return;

    // 最初のユーザー操作でサウンドシステムを初期化
    if (!this.soundInitialized) {
      this.sound.init();
      this.soundInitialized = true;
    }

    // 入力チェック
    if (this.input.hasAction()) {
      const { action, direction } = this.input.getAction();

      if (action === ACTION.SUSPEND) {
        this.suspendAndReturnToTitle();
        return;
      }

      if (action === ACTION.TOGGLE_MUTE) {
        const muted = this.sound.toggleMute();
        this.ui.addMessage(muted ? '音をミュートしました。' : 'ミュートを解除しました。', 'info');
        return;
      }

      if (action === ACTION.INVENTORY) {
        this.openInventory();
        return;
      }

      if (action) {
        // アクション処理
        const turnConsumed = this.gameState.processPlayerAction(action, direction);

        if (turnConsumed) {
          // 最高到達階を更新
          this.saveManager.updateBestFloor(
            this.gameState.dungeonDef.id,
            this.gameState.floor
          );

          // 視界を更新
          this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);
        }

        // UI更新
        this.ui.updateStatus(this.gameState);

        // 描画
        this.renderDungeon();
      }
    }
  }

  /**
   * インベントリを開く
   */
  async openInventory() {
    if (this.inventoryBusy) return;
    this.inventoryBusy = true;

    const result = await this.ui.openInventory(this.gameState.player, this.gameState);

    this.inventoryBusy = false;

    if (result) {
      const turnConsumed = this.gameState.processInventoryAction(result);

      if (turnConsumed) {
        this.gameState.processTurn();
        this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);
      }

      this.ui.updateStatus(this.gameState);
      this.renderDungeon();
    }
  }

  /**
   * ダンジョンシーンの描画
   */
  renderDungeon() {
    if (!this.gameState) return;
    this.renderer.render(this.gameState);
    this.minimap.render(this.gameState);
  }

  /**
   * ゲーム状態変更ハンドラ
   */
  async handleStateChange(state) {
    if (state === GAME_STATE.GAME_OVER) {
      // 死亡時は中断セーブを削除
      this.saveManager.deleteSuspend();
      // クラウド同期（fire-and-forget）
      this._pushToCloud();

      const result = await this.ui.showGameOver(
        this.gameState.floor,
        this.gameState.turnCount,
        this.gameState.stats
      );

      if (result === 'town') {
        this.sceneManager.transition(SCENE.TOWN, { death: true });
      } else {
        // retry
        const dungeonId = this.gameState?.dungeonDef?.id || 'dungeon_1';
        this.sceneManager.transition(SCENE.DUNGEON, { dungeonId });
      }
    } else if (state === GAME_STATE.VICTORY) {
      // クリア時は中断セーブを削除
      this.saveManager.deleteSuspend();

      const dungeonDef = this.gameState.dungeonDef;
      const result = await this.ui.showVictory(
        this.gameState.turnCount,
        dungeonDef.victoryMessage,
        this.gameState.stats
      );

      // クリア記録
      this.saveManager.markDungeonCleared(dungeonDef.id);
      // クラウド同期（fire-and-forget）
      this._pushToCloud();

      if (result === 'town') {
        this.sceneManager.transition(SCENE.TOWN, {
          victory: true,
          returnItems: [...this.gameState.player.inventory],
          returnGold: this.gameState.player.gold
        });
      } else {
        // retry
        this.sceneManager.transition(SCENE.DUNGEON, { dungeonId: dungeonDef.id });
      }
    }
  }

  /**
   * 中断セーブしてタイトルに戻る
   */
  suspendAndReturnToTitle() {
    if (!this.gameState) return;

    const success = this.saveManager.saveSuspend(this.gameState);
    if (success) {
      this.ui.addMessage('中断セーブしました。', 'important');
      // クラウド同期（fire-and-forget）
      this._pushToCloud();
      this.isRunning = false;
      // 少し待ってからタイトルに遷移
      setTimeout(() => {
        this.sceneManager.transition(SCENE.TITLE, {});
      }, 500);
    } else {
      this.ui.addMessage('中断セーブに失敗しました。', 'warning');
    }
  }

  /**
   * ゲームループ開始
   */
  start() {
    // タイトル画面からスタート
    this.sceneManager.transition(SCENE.TITLE, {});

    // 入力イベントベースのループ
    const gameLoop = () => {
      this.sceneManager.update();
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }
}

// ページ読み込み完了後にゲーム開始
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();

  // グローバルにゲームインスタンスを公開（デバッグ用）
  window.game = game;
});
