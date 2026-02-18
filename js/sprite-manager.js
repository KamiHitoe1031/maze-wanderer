/**
 * sprite-manager.js - スプライト管理（画像/フォールバック統合描画）
 * 全ての描画はこのクラスを経由する
 */

import { SPRITE_DEFS } from './data/sprites.js';

export class SpriteManager {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.sprites = new Map();  // key -> { image, loaded } | null
    this.fallbacks = new Map(); // key -> { char, color, bgColor }
    this.sheets = new Map();   // key -> { image, loaded, frames, frameWidth, frameHeight }
    this.pendingLoads = 0;
    this.onAllLoaded = null; // 全画像ロード完了時のコールバック

    // アクティブなアニメーション
    this.activeAnimations = []; // { key, x, y, frame, totalFrames, frameDuration, elapsed, onComplete }

    // グローバルアニメーション時計（ループアニメーション用）
    this.animTimestamp = 0;

    // 全スプライト定義を登録
    this.registerAll();
  }

  /**
   * SPRITE_DEFSから全スプライトを登録
   */
  registerAll() {
    for (const [key, def] of Object.entries(SPRITE_DEFS)) {
      if (def.sheetPath) {
        this.registerSheet(key, def);
      } else {
        this.register(key, def);
      }
    }
  }

  /**
   * アセット定義を1つ登録
   */
  register(key, { imagePath, fallbackChar, fallbackColor, fallbackBg }) {
    // フォールバック（プレースホルダー）は必ず登録
    this.fallbacks.set(key, {
      char: fallbackChar,
      color: fallbackColor || '#FFFFFF',
      bgColor: fallbackBg || null
    });

    // imagePath があれば非同期で画像ロード試行
    if (imagePath) {
      this.pendingLoads++;
      const img = new Image();
      img.src = imagePath;
      img.onload = () => {
        this.sprites.set(key, { image: img, loaded: true });
        this._onLoadComplete();
      };
      img.onerror = () => {
        this.sprites.set(key, null); // 失敗→フォールバック維持
        this._onLoadComplete();
      };
    }
  }

  /**
   * スプライトシートを登録
   */
  registerSheet(key, { sheetPath, frames, fallbackChar, fallbackColor, fallbackBg }) {
    // フォールバックも登録
    this.fallbacks.set(key, {
      char: fallbackChar || '*',
      color: fallbackColor || '#FFFFFF',
      bgColor: fallbackBg || null
    });

    if (sheetPath) {
      this.pendingLoads++;
      const img = new Image();
      img.src = sheetPath;
      img.onload = () => {
        const frameWidth = Math.floor(img.width / frames);
        this.sheets.set(key, {
          image: img,
          loaded: true,
          frames: frames,
          frameWidth: frameWidth,
          frameHeight: img.height
        });
        this._onLoadComplete();
      };
      img.onerror = () => {
        this.sheets.set(key, null);
        this._onLoadComplete();
      };
    }
  }

  /**
   * 描画（画像があれば画像、なければフォールバック）
   */
  draw(ctx, key, x, y) {
    const sprite = this.sprites.get(key);
    if (sprite?.loaded) {
      ctx.drawImage(sprite.image, x, y, this.tileSize, this.tileSize);
      return;
    }

    // フォールバック描画
    this.drawFallback(ctx, key, x, y);
  }

  /**
   * スプライトシートの特定フレームを描画
   */
  drawFrame(ctx, key, x, y, frameIndex) {
    const sheet = this.sheets.get(key);
    if (sheet?.loaded) {
      const sx = frameIndex * sheet.frameWidth;
      ctx.drawImage(
        sheet.image,
        sx, 0, sheet.frameWidth, sheet.frameHeight,
        x, y, this.tileSize, this.tileSize
      );
      return;
    }

    // シートがなければ通常スプライトにフォールバック
    this.draw(ctx, key, x, y);
  }

  /**
   * アニメーションを開始
   * @param {string} key - スプライトシートのキー
   * @param {number} x - スクリーンX座標
   * @param {number} y - スクリーンY座標
   * @param {object} options - { frameDuration, onComplete }
   */
  playAnimation(key, x, y, options = {}) {
    const sheet = this.sheets.get(key);
    const totalFrames = sheet?.loaded ? sheet.frames : 4;
    const frameDuration = options.frameDuration || 60; // ms per frame

    const anim = {
      key,
      x,
      y,
      frame: 0,
      totalFrames,
      frameDuration,
      elapsed: 0,
      onComplete: options.onComplete || null
    };

    this.activeAnimations.push(anim);
    return anim;
  }

  /**
   * アクティブなアニメーションを更新・描画
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} deltaMs - 前フレームからの経過時間(ms)
   */
  updateAnimations(ctx, deltaMs) {
    const completed = [];

    for (const anim of this.activeAnimations) {
      anim.elapsed += deltaMs;
      anim.frame = Math.floor(anim.elapsed / anim.frameDuration);

      if (anim.frame >= anim.totalFrames) {
        completed.push(anim);
        continue;
      }

      this.drawFrame(ctx, anim.key, anim.x, anim.y, anim.frame);
    }

    // 完了したアニメーションを除去しコールバック発火
    for (const anim of completed) {
      const idx = this.activeAnimations.indexOf(anim);
      if (idx >= 0) this.activeAnimations.splice(idx, 1);
      if (anim.onComplete) anim.onComplete();
    }
  }

  /**
   * アクティブなアニメーションがあるか
   */
  hasActiveAnimations() {
    return this.activeAnimations.length > 0;
  }

  /**
   * グローバルアニメーション時計を進める
   * @param {number} deltaMs - 前フレームからの経過時間(ms)
   */
  tick(deltaMs) {
    this.animTimestamp += deltaMs;
  }

  /**
   * ループアニメーションを描画（グローバル時計ベース）
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} key - スプライトシートのキー
   * @param {number} x - スクリーンX座標
   * @param {number} y - スクリーンY座標
   * @param {number} frameDuration - 1フレームの表示時間(ms)
   */
  drawLooping(ctx, key, x, y, frameDuration = 200) {
    const sheet = this.sheets.get(key);
    if (!sheet?.loaded) {
      this.draw(ctx, key, x, y);
      return;
    }

    const totalFrames = sheet.frames;
    const frameIndex = Math.floor(this.animTimestamp / frameDuration) % totalFrames;
    const sx = frameIndex * sheet.frameWidth;
    ctx.drawImage(
      sheet.image,
      sx, 0, sheet.frameWidth, sheet.frameHeight,
      x, y, this.tileSize, this.tileSize
    );
  }

  /**
   * 位置ベースオフセット付きループアニメーション描画
   * 隣接タイルが微妙にずれて自然な揺れに
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} key - スプライトシートのキー
   * @param {number} x - スクリーンX座標
   * @param {number} y - スクリーンY座標
   * @param {number} mapX - マップX座標（オフセット計算用）
   * @param {number} mapY - マップY座標（オフセット計算用）
   * @param {number} frameDuration - 1フレームの表示時間(ms)
   */
  drawLoopingOffset(ctx, key, x, y, mapX, mapY, frameDuration = 200) {
    const sheet = this.sheets.get(key);
    if (!sheet?.loaded) {
      this.draw(ctx, key, x, y);
      return;
    }

    const totalFrames = sheet.frames;
    // 位置ベースのオフセットで隣接タイルをずらす
    const offset = ((mapX * 7 + mapY * 13) % totalFrames);
    const frameIndex = (Math.floor(this.animTimestamp / frameDuration) + offset) % totalFrames;
    const sx = frameIndex * sheet.frameWidth;
    ctx.drawImage(
      sheet.image,
      sx, 0, sheet.frameWidth, sheet.frameHeight,
      x, y, this.tileSize, this.tileSize
    );
  }

  /**
   * フォールバック描画（記号＋色）
   */
  drawFallback(ctx, key, x, y) {
    const fb = this.fallbacks.get(key);
    if (!fb) return;

    // 背景色があれば塗る
    if (fb.bgColor) {
      ctx.fillStyle = fb.bgColor;
      ctx.fillRect(x, y, this.tileSize, this.tileSize);
    }

    // 文字を描画
    ctx.fillStyle = fb.color;
    ctx.font = `${this.tileSize - 4}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fb.char, x + this.tileSize / 2, y + this.tileSize / 2);
  }

  /**
   * 暗い状態で描画（Fog of War用）
   */
  drawDim(ctx, key, x, y, dimFactor = 0.4) {
    // まず通常描画
    this.draw(ctx, key, x, y);

    // その上に半透明の黒を重ねる
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - dimFactor})`;
    ctx.fillRect(x, y, this.tileSize, this.tileSize);
  }

  /**
   * 画像ロード完了カウント処理
   */
  _onLoadComplete() {
    this.pendingLoads--;
    if (this.pendingLoads <= 0 && this.onAllLoaded) {
      this.onAllLoaded();
    }
  }

  /**
   * タイルサイズを変更
   */
  setTileSize(size) {
    this.tileSize = size;
  }

  /**
   * 画像のロード状態を確認
   */
  isLoaded(key) {
    const sprite = this.sprites.get(key);
    return sprite?.loaded || false;
  }
}
