/**
 * minimap.js - ミニマップ描画（プレイヤー中心スクロール）
 */

import { MAP_WIDTH, MAP_HEIGHT, TILE } from './dungeon.js';

// ミニマップの色定義
const COLORS = {
  UNEXPLORED: '#000000',
  WALL: '#2a2520',
  FLOOR: '#5a5550',
  CORRIDOR: '#4a4540',
  STAIRS: '#ffd700',
  WATER: '#224488',
  TRAP: '#883333',
  SHOP: '#886622',
  PLAYER: '#00ff88',
  MONSTER: '#ff4444',
  ITEM: '#4488ff',
};

// ビューポートサイズ（タイル数）
const VIEW_W = 37;
const VIEW_H = 28;

export class Minimap {
  constructor(canvas) {
    this.canvas = canvas;
    this.pixelSize = 4;
    this.canvas.width = VIEW_W * this.pixelSize;
    this.canvas.height = VIEW_H * this.pixelSize;
    this.ctx = canvas.getContext('2d');
  }

  /**
   * ミニマップを描画（プレイヤー中心）
   */
  render(gameState) {
    const { dungeon, player, monsters, floorItems } = gameState;
    const ctx = this.ctx;
    const ps = this.pixelSize;

    // プレイヤーを中心にしたカメラオフセット
    const camX = player.x - Math.floor(VIEW_W / 2);
    const camY = player.y - Math.floor(VIEW_H / 2);

    // 全面クリア（マップ外も未探索と同じ黒）
    ctx.fillStyle = COLORS.UNEXPLORED;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // マップタイル描画
    for (let vy = 0; vy < VIEW_H; vy++) {
      for (let vx = 0; vx < VIEW_W; vx++) {
        const mapX = camX + vx;
        const mapY = camY + vy;

        // マップ範囲外は黒のまま（端が分からない）
        if (mapX < 0 || mapX >= MAP_WIDTH || mapY < 0 || mapY >= MAP_HEIGHT) continue;

        if (!dungeon.explored[mapY][mapX]) continue;

        const tile = dungeon.map[mapY][mapX];
        let color;
        switch (tile) {
          case TILE.WALL:     color = COLORS.WALL; break;
          case TILE.FLOOR:    color = COLORS.FLOOR; break;
          case TILE.CORRIDOR: color = COLORS.CORRIDOR; break;
          case TILE.STAIRS:   color = COLORS.STAIRS; break;
          case TILE.WATER:    color = COLORS.WATER; break;
          case TILE.TRAP:     color = COLORS.FLOOR; break;
          case TILE.SHOP:     color = COLORS.SHOP; break;
          default:            color = COLORS.UNEXPLORED; break;
        }

        ctx.fillStyle = color;
        ctx.fillRect(vx * ps, vy * ps, ps, ps);
      }
    }

    // アイテム描画
    if (floorItems) {
      ctx.fillStyle = COLORS.ITEM;
      for (const item of floorItems) {
        if (!dungeon.explored[item.y]?.[item.x]) continue;
        const sx = (item.x - camX) * ps;
        const sy = (item.y - camY) * ps;
        if (sx < 0 || sx >= this.canvas.width || sy < 0 || sy >= this.canvas.height) continue;
        ctx.fillRect(sx, sy, ps, ps);
      }
    }

    // モンスター描画
    ctx.fillStyle = COLORS.MONSTER;
    for (const monster of monsters) {
      if (!monster.isAlive) continue;
      if (!dungeon.explored[monster.y]?.[monster.x]) continue;
      const sx = (monster.x - camX) * ps;
      const sy = (monster.y - camY) * ps;
      if (sx < 0 || sx >= this.canvas.width || sy < 0 || sy >= this.canvas.height) continue;
      ctx.fillRect(sx, sy, ps, ps);
    }

    // プレイヤー描画（常に中央、少し大きめ）
    const px = Math.floor(VIEW_W / 2) * ps;
    const py = Math.floor(VIEW_H / 2) * ps;
    ctx.fillStyle = COLORS.PLAYER;
    ctx.fillRect(px - 1, py - 1, ps + 2, ps + 2);
  }
}
