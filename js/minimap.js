/**
 * minimap.js - ミニマップ描画
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

export class Minimap {
  constructor(canvas) {
    this.canvas = canvas;
    // ピクセルサイズ: マップ40x30をキャンバスに収める
    // 各タイル = 約3.75px → 4px横, 4px縦でちょうど 160x120
    this.pixelSize = 4;
    this.canvas.width = MAP_WIDTH * this.pixelSize;
    this.canvas.height = MAP_HEIGHT * this.pixelSize;
    this.ctx = canvas.getContext('2d');
  }

  /**
   * ミニマップを描画
   */
  render(gameState) {
    const { dungeon, player, monsters, floorItems } = gameState;
    const ctx = this.ctx;
    const ps = this.pixelSize;

    // 全面クリア
    ctx.fillStyle = COLORS.UNEXPLORED;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // マップタイル描画
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (!dungeon.explored[y][x]) continue;

        const tile = dungeon.map[y][x];
        let color;
        switch (tile) {
          case TILE.WALL:     color = COLORS.WALL; break;
          case TILE.FLOOR:    color = COLORS.FLOOR; break;
          case TILE.CORRIDOR: color = COLORS.CORRIDOR; break;
          case TILE.STAIRS:   color = COLORS.STAIRS; break;
          case TILE.WATER:    color = COLORS.WATER; break;
          case TILE.TRAP:     color = COLORS.FLOOR; break; // 罠は床と同じ色で隠す
          case TILE.SHOP:     color = COLORS.SHOP; break;
          default:            color = COLORS.UNEXPLORED; break;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x * ps, y * ps, ps, ps);
      }
    }

    // アイテム描画
    if (floorItems) {
      ctx.fillStyle = COLORS.ITEM;
      for (const item of floorItems) {
        if (!dungeon.explored[item.y]?.[item.x]) continue;
        ctx.fillRect(item.x * ps, item.y * ps, ps, ps);
      }
    }

    // モンスター描画（探索済みの位置のみ）
    ctx.fillStyle = COLORS.MONSTER;
    for (const monster of monsters) {
      if (!monster.isAlive) continue;
      if (!dungeon.explored[monster.y]?.[monster.x]) continue;
      ctx.fillRect(monster.x * ps, monster.y * ps, ps, ps);
    }

    // プレイヤー描画（少し大きめで目立たせる）
    ctx.fillStyle = COLORS.PLAYER;
    ctx.fillRect(
      player.x * ps - 1,
      player.y * ps - 1,
      ps + 2,
      ps + 2
    );
  }
}
