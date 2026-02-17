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
    this.pendingLoads = 0;
    this.onAllLoaded = null; // 全画像ロード完了時のコールバック

    // 全スプライト定義を登録
    this.registerAll();
  }

  /**
   * SPRITE_DEFSから全スプライトを登録
   */
  registerAll() {
    for (const [key, def] of Object.entries(SPRITE_DEFS)) {
      this.register(key, def);
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
