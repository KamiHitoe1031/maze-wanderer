/**
 * monster.js - モンスターAI・行動処理
 */

import { MONSTER_DATA, getSpawnableMonsters, getMonsterData } from './data/monsters.js';
import { DIRECTION } from './input.js';

// 8方向の差分
const DIRECTIONS = [
  { dx: 0, dy: -1 },  // 上
  { dx: 0, dy: 1 },   // 下
  { dx: -1, dy: 0 },  // 左
  { dx: 1, dy: 0 },   // 右
  { dx: -1, dy: -1 }, // 左上
  { dx: 1, dy: -1 },  // 右上
  { dx: -1, dy: 1 },  // 左下
  { dx: 1, dy: 1 }    // 右下
];

export class Monster {
  constructor(id, x, y) {
    const data = getMonsterData(id);
    if (!data) {
      throw new Error(`Unknown monster ID: ${id}`);
    }

    this.id = id;
    this.x = x;
    this.y = y;

    // データからステータスをコピー
    this.name = data.name;
    this.spriteKey = data.spriteKey;
    this.hp = data.hp;
    this.maxHp = data.hp;
    this.atk = data.atk;
    this.def = data.def;
    this.exp = data.exp;
    this.type = data.type;
    this.abilities = [...data.abilities];

    // 状態
    this.isAlive = true;
    this.direction = DIRECTIONS[Math.floor(Math.random() * 4)]; // 初期向きはランダム
  }

  /**
   * 攻撃力を取得
   */
  getAttack() {
    return this.atk;
  }

  /**
   * 防御力を取得
   */
  getDefense() {
    return this.def;
  }

  /**
   * ダメージを受ける
   */
  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
    }
    return amount;
  }

  /**
   * AIによる行動決定
   */
  decideAction(player, dungeon, monsters) {
    if (!this.isAlive) return null;

    // プレイヤーが同じ部屋にいるか確認
    const myRoom = dungeon.getRoomAt(this.x, this.y);
    const playerRoom = dungeon.getRoomAt(player.x, player.y);
    const inSameRoom = myRoom && playerRoom && myRoom === playerRoom;

    // プレイヤーとの距離
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.abs(dx) + Math.abs(dy);

    // 隣接している場合は攻撃
    if (distance === 1 || (Math.abs(dx) === 1 && Math.abs(dy) === 1)) {
      return { type: 'attack', target: player };
    }

    // 同じ部屋にいる場合はプレイヤーに向かって移動
    if (inSameRoom) {
      return this.moveTowardsPlayer(player, dungeon, monsters);
    }

    // 通路にいる場合
    // プレイヤーが視界内（周囲1マス）にいるか
    if (distance <= 2) {
      return this.moveTowardsPlayer(player, dungeon, monsters);
    }

    // ランダム移動
    return this.moveRandomly(dungeon, monsters);
  }

  /**
   * プレイヤーに向かって移動
   */
  moveTowardsPlayer(player, dungeon, monsters) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;

    // 方向を正規化
    const ndx = dx === 0 ? 0 : dx / Math.abs(dx);
    const ndy = dy === 0 ? 0 : dy / Math.abs(dy);

    // 優先順位: 直線 > 斜め > 水平/垂直
    const moves = [];

    // 斜め移動を優先（両方向に差がある場合）
    if (ndx !== 0 && ndy !== 0) {
      moves.push({ dx: ndx, dy: ndy });
    }
    if (ndx !== 0) {
      moves.push({ dx: ndx, dy: 0 });
    }
    if (ndy !== 0) {
      moves.push({ dx: 0, dy: ndy });
    }

    // 移動可能な場所を探す
    for (const move of moves) {
      const newX = this.x + move.dx;
      const newY = this.y + move.dy;

      if (this.canMoveTo(newX, newY, dungeon, monsters, player)) {
        return { type: 'move', dx: move.dx, dy: move.dy };
      }
    }

    // 移動できない場合は待機
    return { type: 'wait' };
  }

  /**
   * ランダム移動
   */
  moveRandomly(dungeon, monsters) {
    // ランダムな順序で方向を試す
    const shuffled = [...DIRECTIONS].sort(() => Math.random() - 0.5);

    for (const dir of shuffled) {
      const newX = this.x + dir.dx;
      const newY = this.y + dir.dy;

      if (this.canMoveTo(newX, newY, dungeon, monsters, null)) {
        return { type: 'move', dx: dir.dx, dy: dir.dy };
      }
    }

    // 移動できない場合は待機
    return { type: 'wait' };
  }

  /**
   * 指定位置に移動可能か
   */
  canMoveTo(x, y, dungeon, monsters, player) {
    // マップ範囲チェック
    if (!dungeon.isWalkable(x, y)) {
      return false;
    }

    // プレイヤーとの衝突チェック
    if (player && player.x === x && player.y === y) {
      return false;
    }

    // 他のモンスターとの衝突チェック
    for (const monster of monsters) {
      if (monster !== this && monster.isAlive && monster.x === x && monster.y === y) {
        return false;
      }
    }

    return true;
  }

  /**
   * 移動実行
   */
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    if (dx !== 0 || dy !== 0) {
      this.direction = { dx, dy };
    }
  }

  /**
   * プレイヤーまでのマンハッタン距離
   */
  distanceTo(player) {
    return Math.abs(this.x - player.x) + Math.abs(this.y - player.y);
  }
}

/**
 * モンスター管理クラス
 */
export class MonsterManager {
  constructor() {
    this.monsters = [];
    this.maxMonsters = 20;
    this.spawnTimer = 0;
    this.spawnInterval = 30; // 30ターンごとに自然発生
  }

  /**
   * モンスターを生成
   */
  spawn(id, x, y) {
    if (this.monsters.length >= this.maxMonsters) {
      return null;
    }
    const monster = new Monster(id, x, y);
    this.monsters.push(monster);
    return monster;
  }

  /**
   * フロア初期化時にモンスターを配置
   */
  initFloor(floor, dungeon, rng, player) {
    this.monsters = [];
    this.spawnTimer = 0;

    // 出現可能なモンスターリスト
    const spawnableIds = getSpawnableMonsters(floor);
    if (spawnableIds.length === 0) return;

    // 各部屋に1～2体配置
    for (const room of dungeon.rooms) {
      const count = rng.nextInt(1, 2);
      for (let i = 0; i < count; i++) {
        const pos = dungeon.getRandomPointInRoom(room);

        // プレイヤーと同じ位置を避ける
        if (pos.x === player.x && pos.y === player.y) continue;

        // 他のモンスターと同じ位置を避ける
        if (this.getMonsterAt(pos.x, pos.y)) continue;

        const monsterId = rng.pick(spawnableIds);
        this.spawn(monsterId, pos.x, pos.y);
      }
    }
  }

  /**
   * 自然発生チェック
   */
  tickSpawn(floor, dungeon, rng, player) {
    this.spawnTimer++;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;

      if (this.monsters.length < this.maxMonsters) {
        const spawnableIds = getSpawnableMonsters(floor);
        if (spawnableIds.length > 0) {
          // プレイヤーから離れた位置に生成
          for (let attempt = 0; attempt < 10; attempt++) {
            const pos = dungeon.getRandomWalkablePosition();
            if (!pos) continue;

            // プレイヤーから一定距離離れているか
            const dist = Math.abs(pos.x - player.x) + Math.abs(pos.y - player.y);
            if (dist < 10) continue;

            // 他のエンティティとの衝突チェック
            if (pos.x === player.x && pos.y === player.y) continue;
            if (this.getMonsterAt(pos.x, pos.y)) continue;

            const monsterId = rng.pick(spawnableIds);
            this.spawn(monsterId, pos.x, pos.y);
            break;
          }
        }
      }
    }
  }

  /**
   * 指定位置のモンスターを取得
   */
  getMonsterAt(x, y) {
    return this.monsters.find(m => m.isAlive && m.x === x && m.y === y);
  }

  /**
   * 生存モンスターリスト
   */
  getAliveMonsters() {
    return this.monsters.filter(m => m.isAlive);
  }

  /**
   * 死亡モンスターを除去
   */
  removeDeadMonsters() {
    this.monsters = this.monsters.filter(m => m.isAlive);
  }

  /**
   * 全モンスターの行動を実行
   */
  processActions(player, dungeon, combat) {
    // プレイヤーからの距離が近い順にソート
    const sorted = this.getAliveMonsters().sort((a, b) => {
      return a.distanceTo(player) - b.distanceTo(player);
    });

    const results = [];

    for (const monster of sorted) {
      if (!monster.isAlive) continue;

      const action = monster.decideAction(player, dungeon, this.monsters);
      if (!action) continue;

      switch (action.type) {
        case 'attack':
          const attackResult = combat.monsterAttack(monster, player);
          results.push(attackResult);
          break;

        case 'move':
          monster.move(action.dx, action.dy);
          break;

        case 'wait':
          // 何もしない
          break;
      }
    }

    return results;
  }
}
