/**
 * trap.js - 罠の配置・発動処理
 */

import { getAvailableTraps } from './data/traps.js';
import { getSpawnableMonsters } from './data/monsters.js';

export class TrapManager {
  constructor() {
    this.traps = [];
  }

  /**
   * フロアに罠を配置
   */
  placeTraps(dungeon, rng, floor, dungeonId = 'dungeon_1') {
    this.traps = [];

    const available = getAvailableTraps(floor, dungeonId);
    if (available.length === 0) return;

    // 各部屋に0～1個の罠
    for (const room of dungeon.rooms) {
      if (!rng.chance(0.4)) continue; // 40%の確率で罠を配置

      const pos = dungeon.getRandomPointInRoom(room);

      // 階段位置には置かない
      if (dungeon.map[pos.y][pos.x] === 3) continue; // TILE.STAIRS

      // 同じ位置に罠がないか確認
      if (this.getTrapAt(pos.x, pos.y)) continue;

      const trapData = rng.pick(available);
      this.traps.push({
        ...trapData,
        x: pos.x,
        y: pos.y,
        visible: false,
        triggered: false
      });
    }
  }

  /**
   * 指定位置の罠を取得
   */
  getTrapAt(x, y) {
    return this.traps.find(t => t.x === x && t.y === y && !t.triggered);
  }

  /**
   * プレイヤーが踏んだ罠を発動
   */
  checkTrap(x, y, player, gameState) {
    const trap = this.getTrapAt(x, y);
    if (!trap) return null;

    // ワナ見えの腕輪で既に見えている場合も発動する（シレン仕様）
    trap.visible = true;

    return this.activateTrap(trap, player, gameState);
  }

  /**
   * 罠を発動
   */
  activateTrap(trap, player, gameState) {
    const result = {
      activated: true,
      message: '',
      type: 'damage'
    };

    switch (trap.effect) {
      case 'poison_arrow':
        player.takeDamage(trap.damage);
        player.strength = Math.max(0, player.strength - 1);
        result.message = `毒矢の罠！${trap.damage}のダメージ、ちからが1下がった！`;
        result.type = 'damage';
        break;

      case 'pitfall':
        player.takeDamage(trap.damage);
        result.message = `落とし穴！${trap.damage}のダメージ！下の階に落ちた！`;
        result.type = 'damage';
        result.floorSkip = true;
        trap.triggered = true;
        break;

      case 'landmine': {
        player.takeDamage(trap.damage);
        result.message = `地雷！${trap.damage}のダメージ！`;
        result.type = 'damage';
        // 周囲のモンスターにもダメージ
        if (gameState && gameState.monsters) {
          for (const monster of gameState.monsters) {
            if (monster.isAlive) {
              const dx = Math.abs(monster.x - player.x);
              const dy = Math.abs(monster.y - player.y);
              if (dx <= 1 && dy <= 1) {
                monster.takeDamage(trap.damage);
              }
            }
          }
          if (gameState.monsterManager) {
            gameState.monsterManager.removeDeadMonsters();
          }
        }
        trap.triggered = true;
        break;
      }

      case 'sleep':
        player.statusEffects = player.statusEffects || [];
        player.statusEffects.push({ type: 'sleep', remaining: trap.duration });
        result.message = `睡眠の罠！${trap.duration}ターン眠ってしまった！`;
        result.type = 'info';
        break;

      case 'confusion':
        player.statusEffects = player.statusEffects || [];
        player.statusEffects.push({ type: 'confusion', remaining: trap.duration });
        result.message = `混乱の罠！${trap.duration}ターン混乱してしまった！`;
        result.type = 'info';
        break;

      case 'spin': {
        const dirs = [
          { dx: 0, dy: -1 }, { dx: 1, dy: 0 },
          { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
        ];
        player.direction = dirs[Math.floor(Math.random() * dirs.length)];
        result.message = '回転の罠！向きが変わった！';
        result.type = 'info';
        break;
      }

      case 'rust':
        if (player.shield && !player.shield.rustproof) {
          player.shield.enhance = Math.max(-10, (player.shield.enhance || 0) - 1);
          result.message = `錆の罠！盾の強化値が下がった！`;
          result.type = 'damage';
        } else {
          result.message = '錆の罠！しかし影響はなかった。';
          result.type = 'info';
        }
        break;

      case 'hunger':
        player.reduceFullness(trap.amount);
        result.message = `空腹の罠！満腹度が${trap.amount}減った！`;
        result.type = 'damage';
        break;

      case 'warp':
        if (gameState && gameState.dungeon) {
          const pos = gameState.dungeon.getRandomWalkablePosition();
          if (pos) {
            player.setPosition(pos.x, pos.y);
            result.message = 'ワープの罠！別の場所に飛ばされた！';
          }
        }
        result.type = 'info';
        break;

      case 'summon_monsters':
        if (gameState && gameState.monsterManager) {
          const dungeonId = gameState.dungeonDef?.id || 'dungeon_1';
          const spawnableIds = getSpawnableMonsters(gameState.floor, dungeonId);
          let summoned = 0;
          const dirs = [
            { dx: 0, dy: -1 }, { dx: 1, dy: -1 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 },
            { dx: 0, dy: 1 }, { dx: -1, dy: 1 }, { dx: -1, dy: 0 }, { dx: -1, dy: -1 }
          ];
          for (const dir of dirs) {
            if (summoned >= trap.count) break;
            const sx = player.x + dir.dx;
            const sy = player.y + dir.dy;
            if (gameState.dungeon.isWalkable(sx, sy) &&
                !gameState.monsterManager.getMonsterAt(sx, sy) &&
                spawnableIds.length > 0) {
              const id = spawnableIds[Math.floor(Math.random() * spawnableIds.length)];
              gameState.monsterManager.spawn(id, sx, sy);
              summoned++;
            }
          }
          result.message = `モンスターの罠！${summoned}体のモンスターが現れた！`;
        }
        result.type = 'damage';
        break;

      // 深緑の迷宮限定
      case 'immobilize':
        player.statusEffects = player.statusEffects || [];
        player.statusEffects.push({ type: 'immobilize', remaining: trap.duration });
        result.message = `蔦の罠！${trap.duration}ターン動けない！`;
        result.type = 'info';
        break;

      case 'spore':
        player.statusEffects = player.statusEffects || [];
        player.statusEffects.push({ type: 'confusion', remaining: trap.duration });
        player.strength = Math.max(0, player.strength - 1);
        result.message = `胞子の罠！混乱し、ちからが1下がった！`;
        result.type = 'damage';
        break;

      // 海淵の洞窟限定
      case 'whirlpool':
        player.takeDamage(trap.damage);
        if (gameState && gameState.dungeon) {
          const pos = gameState.dungeon.getRandomWalkablePosition();
          if (pos) {
            player.setPosition(pos.x, pos.y);
          }
        }
        result.message = `渦潮の罠！${trap.damage}のダメージ＋ワープ！`;
        result.type = 'damage';
        break;

      case 'flood':
        if (player.inventory) {
          const scrolls = player.inventory.filter(it => it.category === 'scroll' && !it.wet);
          if (scrolls.length > 0) {
            const target = scrolls[Math.floor(Math.random() * scrolls.length)];
            target.wet = true;
            result.message = `浸水の罠！${target.name}が濡れて使えなくなった！`;
          } else {
            result.message = '浸水の罠！しかし影響はなかった。';
          }
        }
        result.type = 'damage';
        break;

      default:
        result.activated = false;
        result.message = '罠を踏んだが何も起きなかった。';
        result.type = 'info';
    }

    return result;
  }

  /**
   * 全罠の可視状態を返す（描画用）
   */
  getVisibleTraps(player) {
    // ワナ見えの腕輪チェック
    const trapSight = player.hasRingEffect && player.hasRingEffect('trap_sight');

    return this.traps.filter(t => !t.triggered && (t.visible || trapSight));
  }
}
