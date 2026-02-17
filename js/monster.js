/**
 * monster.js - モンスターAI・行動処理（特殊能力対応）
 */

import { MONSTER_DATA, getSpawnableMonsters, getMonsterData, getFloorBoss } from './data/monsters.js';
import { DIRECTION } from './input.js';
import { MAP_WIDTH, MAP_HEIGHT, TILE } from './dungeon.js';

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

    // 分裂回数カウンター
    this.splitCount = 0;

    // 倍速行動のためのフラグ
    this.actedThisTurn = false;

    // 状態異常
    this.statusEffects = [];

    // 鈍足トグル（鈍足状態で行動スキップ用）
    this.slowToggle = false;
  }

  /**
   * 攻撃力を取得
   */
  getAttack() {
    let atk = this.atk;
    // 火傷状態: 攻撃力-20%
    if (this.hasStatusEffect('burn')) {
      atk = Math.floor(atk * 0.8);
    }
    return atk;
  }

  /**
   * 防御力を取得
   */
  getDefense() {
    return this.def;
  }

  /**
   * 状態異常を持っているか
   */
  hasStatusEffect(type) {
    return this.statusEffects.some(e => e.type === type);
  }

  /**
   * 状態異常ターン経過（毎ターン呼ぶ）
   */
  tickStatusEffects() {
    const tickResults = [];
    this.statusEffects = this.statusEffects.filter(effect => {
      if (effect.remaining === -1) return true; // 永続

      // 毒：毎ターンダメージ
      if (effect.type === 'poison' && this.isAlive) {
        const dmg = effect.damage || 1;
        this.hp -= dmg;
        if (this.hp <= 0) {
          this.hp = 0;
          this.isAlive = false;
        }
        tickResults.push({ type: 'poison', monster: this, damage: dmg });
      }

      // 火傷：毎ターンダメージ
      if (effect.type === 'burn' && this.isAlive) {
        const dmg = effect.damage || 2;
        this.hp -= dmg;
        if (this.hp <= 0) {
          this.hp = 0;
          this.isAlive = false;
        }
        tickResults.push({ type: 'burn', monster: this, damage: dmg });
      }

      effect.remaining--;
      return effect.remaining > 0;
    });
    return tickResults;
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

    // ダメージで睡眠から覚める
    if (amount > 0 && this.hasStatusEffect('sleep')) {
      this.statusEffects = this.statusEffects.filter(e => e.type !== 'sleep');
    }

    return amount;
  }

  /**
   * 壁抜け能力を持っているか
   */
  hasAbility(abilityPrefix) {
    return this.abilities.some(a => a === abilityPrefix || a.startsWith(abilityPrefix));
  }

  /**
   * 倍速移動か
   */
  isDoubleSpeed() {
    return this.hasAbility('double_speed');
  }

  /**
   * AIによる行動決定
   */
  decideAction(player, dungeon, monsters, gameState) {
    if (!this.isAlive) return null;

    // --- 状態異常による行動制限 ---

    // 金縛り: 行動不能
    if (this.hasStatusEffect('paralyze')) {
      return { type: 'wait' };
    }

    // 睡眠: 行動不能
    if (this.hasStatusEffect('sleep')) {
      return { type: 'wait' };
    }

    // 鈍足: 2ターンに1回行動スキップ
    if (this.hasStatusEffect('slow')) {
      this.slowToggle = !this.slowToggle;
      if (this.slowToggle) {
        return { type: 'wait' };
      }
    }

    // 混乱: ランダム方向に移動 or 攻撃
    if (this.hasStatusEffect('confusion')) {
      const randomDir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const tx = this.x + randomDir.dx;
      const ty = this.y + randomDir.dy;

      // ランダム方向にプレイヤーがいたら攻撃
      if (player.x === tx && player.y === ty) {
        return { type: 'attack', target: player };
      }

      // 移動可能なら移動
      if (this.canMoveTo(tx, ty, dungeon, monsters, player)) {
        return { type: 'move', dx: randomDir.dx, dy: randomDir.dy };
      }

      return { type: 'wait' };
    }

    // 封印: 特殊能力を使えない（通常攻撃と移動のみ）
    const isSealed = this.hasStatusEffect('seal');

    // プレイヤーが同じ部屋にいるか確認
    const myRoom = dungeon.getRoomAt(this.x, this.y);
    const playerRoom = dungeon.getRoomAt(player.x, player.y);
    const inSameRoom = myRoom && playerRoom && myRoom === playerRoom;

    // プレイヤーとの距離
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.abs(dx) + Math.abs(dy);

    // --- 特殊能力チェック（攻撃の前に） ---

    if (!isSealed) {
    // 爆発系: HP半分以下で爆発
    if (this.hp <= this.maxHp / 2) {
      if (this.hasAbility('explode_30') && distance <= 1) {
        return { type: 'ability', ability: 'explode', damage: 30, range: 1 };
      }
      if (this.hasAbility('explode_50') && distance <= 2) {
        return { type: 'ability', ability: 'explode', damage: 50, range: 2 };
      }
      if (this.hasAbility('explode_fatal') && distance <= 2) {
        return { type: 'ability', ability: 'explode', damage: 'fatal', range: 2 };
      }
    }

    // 炎ブレス
    if (this.hasAbility('fire_breath_20')) {
      // 小竜: 正面の直線上にいる場合（隣接時）
      if (distance <= 2 && this.isInLineOfSight(player)) {
        if (Math.random() < 0.3) {
          return { type: 'ability', ability: 'fire_breath', damage: 20 };
        }
      }
    }
    if (this.hasAbility('fire_breath_30') && inSameRoom) {
      // 火竜: 同じ部屋ならどこからでも
      if (Math.random() < 0.3) {
        return { type: 'ability', ability: 'fire_breath', damage: 30 };
      }
    }
    if (this.hasAbility('fire_breath_40')) {
      // 天竜: フロアどこからでも
      if (Math.random() < 0.25) {
        return { type: 'ability', ability: 'fire_breath', damage: 40 };
      }
    }

    // 遠距離攻撃（戦車系）
    if (this.hasAbility('ranged_10') && distance <= 2 && distance > 1) {
      if (this.isInLineOfSight(player)) {
        return { type: 'ability', ability: 'ranged', damage: 10 };
      }
    }
    if (this.hasAbility('ranged_20') && inSameRoom && distance > 1) {
      return { type: 'ability', ability: 'ranged', damage: 20 };
    }
    if (this.hasAbility('ranged_30')) {
      // 超戦車: 壁を貫通して弾
      if (distance <= 10 && distance > 1) {
        if (Math.random() < 0.4) {
          return { type: 'ability', ability: 'ranged', damage: 30 };
        }
      }
    }

    // 催眠術（一つ目系）- 隣接時
    if (distance <= 1 || (Math.abs(dx) === 1 && Math.abs(dy) === 1)) {
      if (this.hasAbility('hypnosis_50') && Math.random() < 0.5) {
        return { type: 'ability', ability: 'hypnosis' };
      }
      if (this.hasAbility('hypnosis_60') && Math.random() < 0.6) {
        return { type: 'ability', ability: 'hypnosis' };
      }
    }

    // 全画面攻撃（魔王）
    if (this.hasAbility('aoe_30') && Math.random() < 0.2) {
      return { type: 'ability', ability: 'aoe', damage: 30 };
    }

    // 召喚（魔王）
    if (this.hasAbility('summon') && Math.random() < 0.15) {
      return { type: 'ability', ability: 'summon' };
    }
    } // end if (!isSealed)

    // --- 通常行動 ---

    // 隣接している場合は攻撃（特殊攻撃付き）
    if (distance === 1 || (Math.abs(dx) === 1 && Math.abs(dy) === 1)) {
      return { type: 'attack', target: player };
    }

    // 同じ部屋にいる場合はプレイヤーに向かって移動
    if (inSameRoom) {
      return this.moveTowardsPlayer(player, dungeon, monsters);
    }

    // 通路にいる場合
    // プレイヤーが視界内（周囲2マス）にいるか
    if (distance <= 2) {
      return this.moveTowardsPlayer(player, dungeon, monsters);
    }

    // アイテム盗み系: 同じ部屋で接近→盗み（隣接時は攻撃より盗みを優先する場合あり）
    // 実際の盗みはattack結果のon-hitで処理

    // ランダム移動
    return this.moveRandomly(dungeon, monsters);
  }

  /**
   * プレイヤーが直線上にいるか（壁なし）
   */
  isInLineOfSight(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;

    // 4方向 or 8方向の直線
    if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) {
      return false;
    }

    const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
    const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
    let cx = this.x + stepX;
    let cy = this.y + stepY;

    while (cx !== player.x || cy !== player.y) {
      if (cx < 0 || cx >= MAP_WIDTH || cy < 0 || cy >= MAP_HEIGHT) return false;
      cx += stepX;
      cy += stepY;
    }

    return true;
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
    // 壁抜け能力チェック
    if (this.hasAbility('wall_pass')) {
      // 壁でもマップ範囲内なら移動可能（ただし範囲外は不可）
      if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
        return false;
      }
    } else {
      // 通常の移動可能判定
      if (!dungeon.isWalkable(x, y)) {
        return false;
      }
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
  initFloor(floor, dungeon, rng, player, dungeonId = 'dungeon_1') {
    this.monsters = [];
    this.spawnTimer = 0;

    // 出現可能なモンスターリスト
    const spawnableIds = getSpawnableMonsters(floor, dungeonId);
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

    // フロアボスを配置
    const boss = getFloorBoss(floor, dungeonId);
    if (boss) {
      // 階段の近くにボスを配置
      const stairsPos = dungeon.stairsPos;
      if (stairsPos) {
        // 階段周囲の空きマスに配置
        for (const dir of DIRECTIONS) {
          const bx = stairsPos.x + dir.dx;
          const by = stairsPos.y + dir.dy;
          if (dungeon.isWalkable(bx, by) &&
              !(bx === player.x && by === player.y) &&
              !this.getMonsterAt(bx, by)) {
            this.spawn(boss.id, bx, by);
            break;
          }
        }
      }
    }
  }

  /**
   * 自然発生チェック
   */
  tickSpawn(floor, dungeon, rng, player, dungeonId = 'dungeon_1') {
    this.spawnTimer++;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;

      if (this.monsters.length < this.maxMonsters) {
        const spawnableIds = getSpawnableMonsters(floor, dungeonId);
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
  processActions(player, dungeon, combat, gameState) {
    // プレイヤーからの距離が近い順にソート
    const sorted = this.getAliveMonsters().sort((a, b) => {
      return a.distanceTo(player) - b.distanceTo(player);
    });

    const results = [];

    for (const monster of sorted) {
      if (!monster.isAlive) continue;
      if (!player.isAlive) break;

      // 倍速モンスターは2回行動
      const actionCount = monster.isDoubleSpeed() ? 2 : 1;

      for (let i = 0; i < actionCount; i++) {
        if (!monster.isAlive || !player.isAlive) break;

        const action = monster.decideAction(player, dungeon, this.monsters, gameState);
        if (!action) continue;

        switch (action.type) {
          case 'attack': {
            const attackResult = combat.monsterAttack(monster, player, dungeon);

            // 通常攻撃に追加される特殊効果
            if (attackResult.hit) {
              const specialResults = this.applyOnHitAbilities(monster, player, gameState);
              for (const sr of specialResults) {
                results.push(sr);
              }
            }

            results.push(attackResult);
            break;
          }

          case 'ability': {
            const abilityResult = this.processAbility(monster, player, dungeon, action, gameState);
            if (abilityResult) {
              results.push(abilityResult);
            }
            break;
          }

          case 'move':
            monster.move(action.dx, action.dy);
            break;

          case 'wait':
            break;
        }
      }
    }

    return results;
  }

  /**
   * 攻撃命中時の特殊効果を適用
   */
  applyOnHitAbilities(monster, player, gameState) {
    const results = [];
    const hasAntidote = player.hasShieldEffect && player.hasShieldEffect('antidote');

    // ちから下げ（吸血コウモリ・毒サソリ系）
    if (monster.hasAbility('drain_strength_1')) {
      if (hasAntidote) {
        results.push({
          hit: true,
          message: `毒消しの盾がちから下げを防いだ！`,
          damage: 0
        });
      } else if (player.strength > 1) {
        player.strength -= 1;
        results.push({
          hit: true,
          message: `${monster.name}の攻撃でちからが1下がった！`,
          damage: 0
        });
      }
    }
    if (monster.hasAbility('drain_strength_2')) {
      if (hasAntidote) {
        results.push({
          hit: true,
          message: `毒消しの盾がちから下げを防いだ！`,
          damage: 0
        });
      } else {
        const drain = Math.min(2, player.strength - 1);
        if (drain > 0) {
          player.strength -= drain;
          results.push({
            hit: true,
            message: `${monster.name}の攻撃でちからが${drain}下がった！`,
            damage: 0
          });
        }
      }
    }

    // レベル下げ（経験吸い）
    if (monster.hasAbility('drain_level')) {
      if (player.level > 1) {
        player.level--;
        // maxHPの再計算は簡易的にする（-5程度）
        const hpLoss = 3 + Math.floor(player.level / 5);
        player.maxHp = Math.max(15, player.maxHp - hpLoss);
        player.hp = Math.min(player.hp, player.maxHp);
        results.push({
          hit: true,
          message: `${monster.name}の攻撃でレベルが下がった！（Lv${player.level}）`,
          damage: 0
        });
      }
    }

    // アイテム盗み（こそ泥タヌキ）
    if (monster.hasAbility('steal_item') && player.inventory.length > 0) {
      if (Math.random() < 0.3) {
        // 非装備品からランダムに盗む
        const stealable = player.inventory.filter(
          it => it !== player.weapon && it !== player.shield
        );
        if (stealable.length > 0) {
          const stolen = stealable[Math.floor(Math.random() * stealable.length)];
          const idx = player.inventory.indexOf(stolen);
          if (idx >= 0) {
            player.inventory.splice(idx, 1);
            results.push({
              hit: true,
              message: `${monster.name}に${stolen.name || 'アイテム'}を盗まれた！`,
              damage: 0,
              effectKey: 'steal'
            });
            // タヌキはワープする
            this.warpMonster(monster, gameState);
          }
        }
      }
    }

    // 装備品盗み（大泥棒タヌキ）
    if (monster.hasAbility('steal_equip') && player.inventory.length > 0) {
      if (Math.random() < 0.3) {
        const stolen = player.inventory[Math.floor(Math.random() * player.inventory.length)];
        const idx = player.inventory.indexOf(stolen);
        if (idx >= 0) {
          // 装備中なら外す
          if (player.weapon === stolen) player.weapon = null;
          if (player.shield === stolen) player.shield = null;
          player.inventory.splice(idx, 1);
          results.push({
            hit: true,
            message: `${monster.name}に${stolen.name || 'アイテム'}を盗まれた！`,
            damage: 0,
            effectKey: 'steal'
          });
          this.warpMonster(monster, gameState);
        }
      }
    }

    // おにぎり変化（おにぎり狸）
    if (monster.hasAbility('riceball_transform') && player.inventory.length > 0) {
      if (Math.random() < 0.25) {
        const targets = player.inventory.filter(
          it => it !== player.weapon && it !== player.shield
        );
        if (targets.length > 0) {
          const target = targets[Math.floor(Math.random() * targets.length)];
          const oldName = target.name || 'アイテム';
          // おにぎりに変化
          target.id = 'riceball';
          target.name = 'おにぎり';
          target.category = 'food';
          target.spriteKey = 'item.food';
          target.fullnessRestore = 50;
          results.push({
            hit: true,
            message: `${monster.name}の攻撃で${oldName}がおにぎりに変わった！`,
            damage: 0
          });
        }
      }
    }

    // 盾の錆（錆カビ）
    const isRustproof = player.shield && (player.shield.rustproof || (player.hasShieldEffect && player.hasShieldEffect('rustproof')));
    if (monster.hasAbility('rust_shield_1') && player.shield) {
      if (!isRustproof && (player.shield.enhance || 0) > 0) {
        player.shield.enhance -= 1;
        results.push({
          hit: true,
          message: `${monster.name}の攻撃で${player.shield.name}の強化値が1下がった！`,
          damage: 0
        });
      }
    }
    if (monster.hasAbility('rust_shield_2') && player.shield) {
      if (!isRustproof && (player.shield.enhance || 0) > 0) {
        const drain = Math.min(2, player.shield.enhance);
        player.shield.enhance -= drain;
        results.push({
          hit: true,
          message: `${monster.name}の攻撃で${player.shield.name}の強化値が${drain}下がった！`,
          damage: 0
        });
      }
    }

    return results;
  }

  /**
   * 特殊能力を処理
   */
  processAbility(monster, player, dungeon, action, gameState) {
    switch (action.ability) {
      case 'fire_breath': {
        let damage = action.damage;
        // 魔法弾よけの盾: 反射
        if (player.hasShieldEffect && player.hasShieldEffect('magic_reflect')) {
          monster.takeDamage(damage);
          return {
            hit: true,
            damage: damage,
            effectKey: 'fire_breath',
            message: `${monster.name}が炎を吐いた！しかし跳ね返した！${monster.name}に${damage}のダメージ！`
          };
        }
        // 爆発半減の盾
        if (player.hasShieldEffect && player.hasShieldEffect('blast_guard')) {
          damage = Math.floor(damage / 2);
        }
        player.takeDamage(damage);
        return {
          hit: true,
          damage: damage,
          effectKey: 'fire_breath',
          message: `${monster.name}が炎を吐いた！${damage}のダメージ！`
        };
      }

      case 'ranged': {
        const damage = action.damage;
        // 魔法弾よけの盾: 反射
        if (player.hasShieldEffect && player.hasShieldEffect('magic_reflect')) {
          monster.takeDamage(damage);
          return {
            hit: true,
            damage: damage,
            effectKey: 'bullet',
            message: `${monster.name}が弾を撃ってきた！しかし跳ね返した！${monster.name}に${damage}のダメージ！`
          };
        }
        player.takeDamage(damage);
        return {
          hit: true,
          damage: damage,
          effectKey: 'bullet',
          message: `${monster.name}が弾を撃ってきた！${damage}のダメージ！`
        };
      }

      case 'explode': {
        let damage = action.damage;
        const range = action.range;
        const isFatal = damage === 'fatal';
        const hasBlastGuard = player.hasShieldEffect && player.hasShieldEffect('blast_guard');

        // 爆発ダメージをプレイヤーに与える
        const dist = monster.distanceTo(player);
        if (dist <= range) {
          if (isFatal) {
            // HP1にする
            damage = player.hp - 1;
            // 爆発半減の盾（致死ダメージでない場合のみ半減）
            if (hasBlastGuard && damage > 0) {
              damage = Math.floor(damage / 2);
            }
            if (damage > 0) {
              player.takeDamage(damage);
            }
          } else {
            // 爆発半減の盾
            let playerDamage = hasBlastGuard ? Math.floor(damage / 2) : damage;
            player.takeDamage(playerDamage);
          }
        }

        // 周囲のモンスターにもダメージ
        for (const other of this.monsters) {
          if (other === monster || !other.isAlive) continue;
          const d = Math.abs(other.x - monster.x) + Math.abs(other.y - monster.y);
          if (d <= range) {
            if (isFatal) {
              other.takeDamage(other.hp);
            } else {
              other.takeDamage(damage);
            }
          }
        }

        // 自分は死亡
        monster.isAlive = false;
        monster.hp = 0;

        const dmgText = isFatal ? 'HPが1になった' : `${action.damage}のダメージ`;
        return {
          hit: dist <= range,
          damage: typeof damage === 'number' ? damage : 0,
          effectKey: 'explosion',
          message: `${monster.name}が爆発した！${dist <= range ? dmgText + '！' : ''}`
        };
      }

      case 'hypnosis': {
        // ランダムなアイテムを強制使用
        if (player.inventory.length > 0) {
          const usable = player.inventory.filter(
            it => it.category === 'grass' || it.category === 'scroll' || it.category === 'food'
          );
          if (usable.length > 0) {
            const item = usable[Math.floor(Math.random() * usable.length)];
            const idx = player.inventory.indexOf(item);
            if (idx >= 0) {
              player.inventory.splice(idx, 1);
              return {
                hit: true,
                damage: 0,
                message: `${monster.name}の催眠術で${item.name || 'アイテム'}を勝手に使ってしまった！`
              };
            }
          }
        }
        return {
          hit: false,
          damage: 0,
          message: `${monster.name}が催眠術をかけてきた！しかし何も起こらなかった。`
        };
      }

      case 'aoe': {
        // 全画面攻撃（魔王）
        const damage = action.damage;
        // 魔法弾よけの盾: 反射
        if (player.hasShieldEffect && player.hasShieldEffect('magic_reflect')) {
          monster.takeDamage(damage);
          return {
            hit: true,
            damage: damage,
            effectKey: 'magic',
            message: `${monster.name}が暗黒の力を放った！しかし跳ね返した！${monster.name}に${damage}のダメージ！`
          };
        }
        player.takeDamage(damage);
        return {
          hit: true,
          damage: damage,
          effectKey: 'magic',
          message: `${monster.name}が暗黒の力を放った！${damage}のダメージ！`
        };
      }

      case 'summon': {
        // 周囲に味方モンスターを召喚
        let summoned = 0;
        const spawnableIds = getSpawnableMonsters(gameState ? gameState.floor : 20, gameState?.dungeonDef?.id);
        if (spawnableIds.length > 0) {
          for (const dir of DIRECTIONS) {
            if (summoned >= 3) break;
            const sx = monster.x + dir.dx;
            const sy = monster.y + dir.dy;
            if (dungeon.isWalkable(sx, sy) &&
                !(sx === player.x && sy === player.y) &&
                !this.getMonsterAt(sx, sy)) {
              const id = spawnableIds[Math.floor(Math.random() * spawnableIds.length)];
              this.spawn(id, sx, sy);
              summoned++;
            }
          }
        }
        return {
          hit: false,
          damage: 0,
          message: summoned > 0
            ? `${monster.name}が仲間を${summoned}体呼び出した！`
            : `${monster.name}が仲間を呼ぼうとしたが、来なかった。`
        };
      }

      default:
        return null;
    }
  }

  /**
   * モンスターをランダム位置にワープ
   */
  warpMonster(monster, gameState) {
    if (!gameState) return;
    const dungeon = gameState.dungeon;
    for (let i = 0; i < 20; i++) {
      const pos = dungeon.getRandomWalkablePosition();
      if (!pos) continue;
      if (pos.x === gameState.player.x && pos.y === gameState.player.y) continue;
      if (this.getMonsterAt(pos.x, pos.y)) continue;
      monster.x = pos.x;
      monster.y = pos.y;
      break;
    }
  }

  /**
   * 死亡時の乗り移り処理（亡霊武者・悪霊武者）
   */
  handlePossessOnDeath(deadMonster, player) {
    if (!deadMonster.hasAbility('possess_on_death')) return null;

    // 近くのモンスターを探す
    let closest = null;
    let closestDist = Infinity;
    for (const m of this.monsters) {
      if (m === deadMonster || !m.isAlive || m.type === 'boss') continue;
      const dist = Math.abs(m.x - deadMonster.x) + Math.abs(m.y - deadMonster.y);
      if (dist < closestDist && dist <= 5) {
        closest = m;
        closestDist = dist;
      }
    }

    if (closest) {
      // レベルアップ相当の強化
      closest.atk = Math.floor(closest.atk * 1.5);
      closest.hp = Math.floor(closest.hp * 1.5);
      closest.maxHp = Math.floor(closest.maxHp * 1.5);
      closest.exp = Math.floor(closest.exp * 2);
      return {
        message: `${deadMonster.name}が${closest.name}に乗り移った！${closest.name}が強化された！`,
        hit: false,
        damage: 0
      };
    }

    return null;
  }

  /**
   * 分裂処理
   */
  handleSplit(monster, dungeon, player) {
    // split_1: 1回のみ分裂
    if (monster.hasAbility('split_1') && monster.splitCount < 1) {
      return this.doSplit(monster, dungeon, player);
    }
    // split_2: 2回まで分裂
    if (monster.hasAbility('split_2') && monster.splitCount < 2) {
      return this.doSplit(monster, dungeon, player);
    }
    return null;
  }

  /**
   * 分裂実行
   */
  doSplit(monster, dungeon, player) {
    // 周囲の空きマスに分裂
    for (const dir of DIRECTIONS) {
      const nx = monster.x + dir.dx;
      const ny = monster.y + dir.dy;
      if (dungeon.isWalkable(nx, ny) &&
          !(nx === player.x && ny === player.y) &&
          !this.getMonsterAt(nx, ny)) {
        const newMonster = this.spawn(monster.id, nx, ny);
        if (newMonster) {
          newMonster.hp = monster.hp;
          newMonster.splitCount = monster.splitCount + 1;
          monster.splitCount++;
          return {
            message: `${monster.name}が分裂した！`,
            hit: false,
            damage: 0
          };
        }
      }
    }
    return null;
  }
}
