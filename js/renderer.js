/**
 * renderer.js - Canvas描画
 * 全ての描画はSpriteManager経由で行う
 */

import { SpriteManager } from './sprite-manager.js';
import { MAP_WIDTH, MAP_HEIGHT, TILE } from './dungeon.js';

// 描画設定
const TILE_SIZE = 24;
const VIEWPORT_TILES_X = 21; // 表示する横タイル数（奇数で中央にプレイヤー）
const VIEWPORT_TILES_Y = 17; // 表示する縦タイル数（奇数で中央にプレイヤー）

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.tileSize = TILE_SIZE;
    this.viewportWidth = VIEWPORT_TILES_X;
    this.viewportHeight = VIEWPORT_TILES_Y;

    // キャンバスサイズを設定
    this.canvas.width = this.viewportWidth * this.tileSize;
    this.canvas.height = this.viewportHeight * this.tileSize;

    // SpriteManager初期化
    this.spriteManager = new SpriteManager(this.tileSize);

    // カメラオフセット
    this.cameraX = 0;
    this.cameraY = 0;
  }

  /**
   * カメラ位置を更新（プレイヤー中心）
   */
  updateCamera(playerX, playerY) {
    this.cameraX = playerX - Math.floor(this.viewportWidth / 2);
    this.cameraY = playerY - Math.floor(this.viewportHeight / 2);
  }

  /**
   * 全体を描画
   */
  render(gameState) {
    // アニメーション完了後の再描画用にゲーム状態を保持
    this._lastGameState = gameState;

    // 画面クリア
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // カメラ位置更新
    this.updateCamera(gameState.player.x, gameState.player.y);

    // マップ描画
    this.renderMap(gameState.dungeon);

    // 罠描画
    if (gameState.trapManager) {
      this.renderTraps(gameState.trapManager.getVisibleTraps(gameState.player), gameState.dungeon);
    }

    // アイテム描画
    this.renderItems(gameState.floorItems, gameState.dungeon);

    // モンスター描画
    this.renderMonsters(gameState.monsters, gameState.dungeon);

    // プレイヤー描画
    this.renderPlayer(gameState.player, gameState.dungeon);
  }

  /**
   * マップを描画
   */
  renderMap(dungeon) {
    for (let vy = 0; vy < this.viewportHeight; vy++) {
      for (let vx = 0; vx < this.viewportWidth; vx++) {
        const mapX = this.cameraX + vx;
        const mapY = this.cameraY + vy;
        const screenX = vx * this.tileSize;
        const screenY = vy * this.tileSize;

        // マップ範囲外チェック
        if (mapX < 0 || mapX >= MAP_WIDTH || mapY < 0 || mapY >= MAP_HEIGHT) {
          this.spriteManager.draw(this.ctx, 'tile.wall', screenX, screenY);
          continue;
        }

        // 探索済みかチェック
        if (!dungeon.explored[mapY][mapX]) {
          this.spriteManager.draw(this.ctx, 'tile.unexplored', screenX, screenY);
          continue;
        }

        // タイルを描画
        const spriteKey = dungeon.getTileSpriteKey(mapX, mapY);
        this.spriteManager.draw(this.ctx, spriteKey, screenX, screenY);
      }
    }
  }

  /**
   * フロアアイテムを描画
   */
  renderItems(floorItems, dungeon) {
    if (!floorItems) return;

    for (const item of floorItems) {
      // 探索済みでなければ表示しない
      if (!dungeon.explored[item.y]?.[item.x]) continue;

      const screenX = (item.x - this.cameraX) * this.tileSize;
      const screenY = (item.y - this.cameraY) * this.tileSize;

      // ビューポート内かチェック
      if (screenX < 0 || screenX >= this.canvas.width ||
          screenY < 0 || screenY >= this.canvas.height) {
        continue;
      }

      this.spriteManager.draw(this.ctx, item.spriteKey, screenX, screenY);
    }
  }

  /**
   * 可視罠を描画
   */
  renderTraps(visibleTraps, dungeon) {
    if (!visibleTraps) return;

    for (const trap of visibleTraps) {
      if (!dungeon.explored[trap.y]?.[trap.x]) continue;

      const screenX = (trap.x - this.cameraX) * this.tileSize;
      const screenY = (trap.y - this.cameraY) * this.tileSize;

      if (screenX < 0 || screenX >= this.canvas.width ||
          screenY < 0 || screenY >= this.canvas.height) {
        continue;
      }

      this.spriteManager.draw(this.ctx, trap.spriteKey || 'trap.default', screenX, screenY);
    }
  }

  /**
   * モンスターを描画
   */
  renderMonsters(monsters, dungeon) {
    for (const monster of monsters) {
      if (!monster.isAlive) continue;

      // 探索済みでなければ表示しない
      if (!dungeon.explored[monster.y]?.[monster.x]) continue;

      const screenX = (monster.x - this.cameraX) * this.tileSize;
      const screenY = (monster.y - this.cameraY) * this.tileSize;

      // ビューポート内かチェック
      if (screenX < 0 || screenX >= this.canvas.width ||
          screenY < 0 || screenY >= this.canvas.height) {
        continue;
      }

      this.spriteManager.draw(this.ctx, monster.spriteKey, screenX, screenY);
    }
  }

  /**
   * プレイヤーを描画
   */
  renderPlayer(player, dungeon) {
    const screenX = (player.x - this.cameraX) * this.tileSize;
    const screenY = (player.y - this.cameraY) * this.tileSize;

    this.spriteManager.draw(this.ctx, 'char.player', screenX, screenY);
  }

  /**
   * 視界を更新（部屋内は全体、通路は周囲1マス）
   */
  updateVisibility(player, dungeon) {
    const px = player.x;
    const py = player.y;

    // プレイヤーが部屋にいるか
    const room = dungeon.getRoomAt(px, py);

    if (room) {
      // 部屋全体を可視化
      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
          dungeon.explored[y][x] = true;
        }
      }
      // 部屋の周囲1マス（壁）も可視化
      for (let y = room.y - 1; y <= room.y + room.height; y++) {
        for (let x = room.x - 1; x <= room.x + room.width; x++) {
          if (y >= 0 && y < MAP_HEIGHT && x >= 0 && x < MAP_WIDTH) {
            dungeon.explored[y][x] = true;
          }
        }
      }
    }

    // 周囲1マスを可視化（通路や部屋の出入り口付近）
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = px + dx;
        const ny = py + dy;
        if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
          dungeon.explored[ny][nx] = true;
        }
      }
    }
  }

  /**
   * 攻撃エフェクトを描画（アニメーション対応）
   * @param {number} x - ワールドX
   * @param {number} y - ワールドY
   * @param {function} callback - 完了時コールバック
   * @param {string} effectKey - エフェクト種別（'attack','slash','blunt'等）
   */
  drawAttackEffect(x, y, callback, effectKey = 'attack') {
    const screenX = (x - this.cameraX) * this.tileSize;
    const screenY = (y - this.cameraY) * this.tileSize;

    const animKey = `anim.${effectKey}`;
    const hasSheet = this.spriteManager.sheets.has(animKey);

    if (hasSheet) {
      // スプライトシートアニメーション再生
      this.spriteManager.playAnimation(animKey, screenX, screenY, {
        frameDuration: 60,
        onComplete: () => {
          if (callback) callback();
        }
      });

      // アニメーションループ開始（まだ動いていなければ）
      if (!this._animLoopRunning) {
        this._startAnimLoop();
      }
    } else {
      // フォールバック：静止画フラッシュ
      const staticKey = `effect.${effectKey}`;
      this.spriteManager.draw(this.ctx, staticKey, screenX, screenY);
      setTimeout(() => {
        if (callback) callback();
      }, 100);
    }
  }

  /**
   * アニメーションループ（requestAnimationFrame）
   */
  _startAnimLoop() {
    if (this._animLoopRunning) return;
    this._animLoopRunning = true;
    let lastTime = performance.now();

    const loop = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (this.spriteManager.hasActiveAnimations()) {
        // アニメーションフレームだけ重ね描画
        this.spriteManager.updateAnimations(this.ctx, delta);
        requestAnimationFrame(loop);
      } else {
        this._animLoopRunning = false;
        // アニメーション完了後に画面を再描画して残像を消す
        if (this._lastGameState) {
          this.render(this._lastGameState);
        }
      }
    };

    requestAnimationFrame(loop);
  }

  /**
   * ダメージ数値を表示
   */
  drawDamageNumber(x, y, damage) {
    const screenX = (x - this.cameraX) * this.tileSize + this.tileSize / 2;
    const screenY = (y - this.cameraY) * this.tileSize;

    this.ctx.fillStyle = '#FF4444';
    this.ctx.font = 'bold 14px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'bottom';
    this.ctx.fillText(`-${damage}`, screenX, screenY);
  }

  /**
   * ワールド座標からスクリーン座標への変換
   */
  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.cameraX) * this.tileSize,
      y: (worldY - this.cameraY) * this.tileSize
    };
  }

  /**
   * スクリーン座標からワールド座標への変換
   */
  screenToWorld(screenX, screenY) {
    return {
      x: Math.floor(screenX / this.tileSize) + this.cameraX,
      y: Math.floor(screenY / this.tileSize) + this.cameraY
    };
  }
}
