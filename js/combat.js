/**
 * combat.js - ダメージ計算・戦闘処理
 */

import { TILE } from './dungeon.js';

// 命中率
const HIT_RATE = {
  PLAYER_ATTACK: 0.92,    // プレイヤーの通常攻撃
  PLAYER_RANGED: 0.84,    // 矢・投擲
  MONSTER_ATTACK: 0.88    // 敵の攻撃
};

// 方向定義（3方向攻撃用）
const DIRECTIONS = [
  { dx: 0, dy: -1 },  // 上
  { dx: 1, dy: -1 },  // 右上
  { dx: 1, dy: 0 },   // 右
  { dx: 1, dy: 1 },   // 右下
  { dx: 0, dy: 1 },   // 下
  { dx: -1, dy: 1 },  // 左下
  { dx: -1, dy: 0 },  // 左
  { dx: -1, dy: -1 }  // 左上
];

/**
 * 方向インデックスを取得
 */
function getDirIndex(dir) {
  return DIRECTIONS.findIndex(d => d.dx === dir.dx && d.dy === dir.dy);
}

/**
 * 前方3方向を取得（正面 + 左斜め + 右斜め）
 */
function getThreeDirections(dir) {
  const idx = getDirIndex(dir);
  if (idx < 0) return [dir];
  return [
    DIRECTIONS[idx],
    DIRECTIONS[(idx + 7) % 8], // 左
    DIRECTIONS[(idx + 1) % 8]  // 右
  ];
}

// 特効マッピング（effect名 → 対応するモンスターtype）
const SLAYER_MAP = {
  'ghost_slayer': 'ghost',
  'dragon_slayer': 'dragon',
  'cyclops_slayer': 'cyclops',
  'drain_slayer': 'drain',
  'aqua_slayer': 'aquatic'
};

/**
 * 武器の全効果を取得（固有effect + 印seals）
 */
function getWeaponEffects(weapon) {
  if (!weapon) return [];
  const effects = [];
  if (weapon.effect) effects.push(weapon.effect);
  if (weapon.seals) {
    for (const seal of weapon.seals) {
      if (!seal.startsWith('attackType:')) {
        effects.push(seal);
      }
    }
  }
  return effects;
}

/**
 * 武器の有効な攻撃タイプを取得（印由来の攻撃タイプも考慮）
 */
function getEffectiveAttackType(weapon) {
  if (!weapon) return 'melee';
  // 武器本来のattackType
  const baseType = weapon.attackType || 'melee';
  if (baseType !== 'melee') return baseType;

  // melee武器の場合、印に攻撃タイプがあればそれを使う
  if (weapon.seals) {
    for (const seal of weapon.seals) {
      if (seal.startsWith('attackType:')) {
        return seal.split(':')[1];
      }
    }
  }
  return baseType;
}

export class Combat {
  constructor(rng) {
    this.rng = rng;
  }

  /**
   * ダメージ計算
   */
  calculateDamage(attack, defense) {
    const baseDamage = Math.max(1, attack - defense + 1);
    const randomMod = 0.875 + this.rng.next() * 0.25;
    return Math.max(1, Math.floor(baseDamage * randomMod));
  }

  /**
   * 命中判定
   */
  checkHit(hitRate) {
    return this.rng.chance(hitRate);
  }

  /**
   * プレイヤーがモンスターを攻撃（基本処理）
   */
  playerAttack(player, monster, hitRate = HIT_RATE.PLAYER_ATTACK) {
    const result = {
      success: false,
      hit: false,
      damage: 0,
      critical: false,
      killed: false,
      exp: 0,
      message: '',
      target: monster
    };

    if (!this.checkHit(hitRate)) {
      result.message = `${monster.name}に攻撃を外した！`;
      return result;
    }

    result.hit = true;

    const attack = player.getAttack();
    const defense = monster.getDefense();
    let damage = this.calculateDamage(attack, defense);

    // 武器特効チェック（固有effect + 印）
    const effects = getWeaponEffects(player.weapon);
    let slayerApplied = false;
    for (const eff of effects) {
      const targetType = SLAYER_MAP[eff];
      if (targetType && monster.type === targetType) {
        damage = Math.floor(damage * 2);
        slayerApplied = true;
        break;
      }
    }

    monster.takeDamage(damage);
    result.damage = damage;
    result.success = true;
    result.message = `${monster.name}に${damage}のダメージを与えた！`;
    if (slayerApplied) {
      result.message = `弱点を突いた！${monster.name}に${damage}のダメージ！`;
    }

    // 麻痺効果チェック（paralyze_10: 10%で麻痺）
    if (monster.isAlive && effects.includes('paralyze_10')) {
      if (this.rng.chance(0.1)) {
        monster.statusEffects = monster.statusEffects || [];
        monster.statusEffects.push({ type: 'paralyze', remaining: 5 });
        result.message += `\n${monster.name}は金縛りになった！`;
      }
    }

    if (!monster.isAlive) {
      result.killed = true;
      result.exp = monster.exp;
      result.message += `\n${monster.name}を倒した！経験値${monster.exp}を獲得！`;
    }

    return result;
  }

  /**
   * モンスターがプレイヤーを攻撃
   */
  monsterAttack(monster, player, dungeon = null) {
    const result = {
      success: false,
      hit: false,
      damage: 0,
      killed: false,
      message: ''
    };

    if (!this.checkHit(HIT_RATE.MONSTER_ATTACK)) {
      result.message = `${monster.name}の攻撃を避けた！`;
      return result;
    }

    result.hit = true;

    let attack = monster.getAttack();

    // 水棲モンスター：水タイル上で攻撃力+30%
    if (dungeon && monster.type === 'aquatic' &&
        dungeon.map[monster.y]?.[monster.x] === TILE.WATER) {
      attack = Math.floor(attack * 1.3);
    }

    const defense = player.getDefense();
    const damage = this.calculateDamage(attack, defense);

    player.takeDamage(damage);
    result.damage = damage;
    result.success = true;
    result.message = `${monster.name}から${damage}のダメージを受けた！`;

    if (!player.isAlive) {
      result.killed = true;
      result.message += `\n力尽きた...`;
    }

    return result;
  }

  /**
   * 攻撃対象の方向にいるモンスターを取得
   */
  getAttackTarget(player, direction, monsters) {
    const targetX = player.x + direction.dx;
    const targetY = player.y + direction.dy;
    return monsters.find(m => m.isAlive && m.x === targetX && m.y === targetY);
  }

  /**
   * 武器タイプに応じた攻撃を解決
   * @returns {Array<object>} 攻撃結果の配列
   */
  resolveWeaponAttack(player, monsters, dungeon) {
    const weapon = player.weapon;
    const attackType = getEffectiveAttackType(weapon);

    switch (attackType) {
      case 'melee':
        return [this.attackInDirection(player, monsters)];

      case 'bow':
        return [this.rangedAttack(player, monsters, dungeon, weapon.range || 4, false)];

      case 'spear':
        return this.piercingAttack(player, monsters, dungeon, weapon.range || 2);

      case 'whip':
        return [this.rangedAttack(player, monsters, dungeon, weapon.range || 3, false)];

      case 'hammer':
        return [this.hammerAttack(player, monsters, dungeon)];

      case 'dagger':
        return [this.backstabAttack(player, monsters)];

      case 'boomerang':
        return [this.rangedAttack(player, monsters, dungeon, weapon.range || 5, false)];

      case 'kamaitachi':
        return this.tripleAttack(player, monsters);

      default:
        return [this.attackInDirection(player, monsters)];
    }
  }

  /**
   * プレイヤーの向いている方向に攻撃（近接）
   */
  attackInDirection(player, monsters) {
    const target = this.getAttackTarget(player, player.direction, monsters);

    if (!target) {
      return {
        success: false,
        hit: false,
        message: '空振りした！',
        damage: 0,
        killed: false,
        exp: 0,
        target: null
      };
    }

    return this.playerAttack(player, target);
  }

  /**
   * 遠距離攻撃（弓・鞭・ブーメラン）
   */
  rangedAttack(player, monsters, dungeon, maxRange, pierce = false) {
    const dir = player.direction;
    const targets = [];

    for (let i = 1; i <= maxRange; i++) {
      const tx = player.x + dir.dx * i;
      const ty = player.y + dir.dy * i;

      // 壁に当たったら止まる
      if (dungeon.isWall(tx, ty)) break;

      const m = monsters.find(m => m.isAlive && m.x === tx && m.y === ty);
      if (m) {
        targets.push(m);
        if (!pierce) break;
      }
    }

    if (targets.length === 0) {
      return {
        success: false,
        hit: false,
        message: '矢は何にも当たらなかった。',
        damage: 0,
        killed: false,
        exp: 0,
        target: null
      };
    }

    // 最初のターゲットに攻撃（遠距離命中率）
    return this.playerAttack(player, targets[0], HIT_RATE.PLAYER_RANGED);
  }

  /**
   * 貫通攻撃（槍）- 前方N マスの敵全てにダメージ
   */
  piercingAttack(player, monsters, dungeon, maxRange) {
    const dir = player.direction;
    const results = [];

    for (let i = 1; i <= maxRange; i++) {
      const tx = player.x + dir.dx * i;
      const ty = player.y + dir.dy * i;

      if (dungeon.isWall(tx, ty)) break;

      const m = monsters.find(m => m.isAlive && m.x === tx && m.y === ty);
      if (m) {
        results.push(this.playerAttack(player, m));
      }
    }

    if (results.length === 0) {
      results.push({
        success: false,
        hit: false,
        message: '空振りした！',
        damage: 0,
        killed: false,
        exp: 0,
        target: null
      });
    }

    return results;
  }

  /**
   * 鉄槌攻撃（隣接 + ノックバック + 壁破壊）
   */
  hammerAttack(player, monsters, dungeon) {
    const target = this.getAttackTarget(player, player.direction, monsters);

    if (!target) {
      // 壁を壊す試行
      const wallX = player.x + player.direction.dx;
      const wallY = player.y + player.direction.dy;
      if (dungeon.isWall(wallX, wallY) &&
          wallX > 0 && wallX < dungeon.map[0].length - 1 &&
          wallY > 0 && wallY < dungeon.map.length - 1) {
        dungeon.map[wallY][wallX] = TILE.CORRIDOR;
        return {
          success: true,
          hit: false,
          message: '壁を砕いた！',
          damage: 0,
          killed: false,
          exp: 0,
          target: null
        };
      }
      return {
        success: false,
        hit: false,
        message: '空振りした！',
        damage: 0,
        killed: false,
        exp: 0,
        target: null
      };
    }

    const result = this.playerAttack(player, target);

    // ノックバック（敵が生きていれば）
    if (result.hit && target.isAlive) {
      const kx = target.x + player.direction.dx;
      const ky = target.y + player.direction.dy;
      const blocked = monsters.find(m => m.isAlive && m.x === kx && m.y === ky);

      if (!blocked && dungeon.isWalkable(kx, ky)) {
        target.x = kx;
        target.y = ky;
        result.message += ' 吹き飛ばした！';
      } else if (dungeon.isWall(kx, ky)) {
        // 壁にぶつけてダメージ
        const wallDmg = 5;
        target.takeDamage(wallDmg);
        result.message += ` 壁にぶつかり${wallDmg}のダメージ！`;
        if (!target.isAlive) {
          result.killed = true;
          result.exp = target.exp;
          result.message += `\n${target.name}を倒した！経験値${target.exp}を獲得！`;
        }
      }
    }

    return result;
  }

  /**
   * 短剣攻撃（背後から2倍ダメージ）
   */
  backstabAttack(player, monsters) {
    const target = this.getAttackTarget(player, player.direction, monsters);

    if (!target) {
      return {
        success: false,
        hit: false,
        message: '空振りした！',
        damage: 0,
        killed: false,
        exp: 0,
        target: null
      };
    }

    // 背後判定: プレイヤーの向きとモンスターの向きが同じなら背後
    const isBehind = target.direction &&
      player.direction.dx === target.direction.dx &&
      player.direction.dy === target.direction.dy;

    if (isBehind) {
      // 一時的に攻撃力を2倍にして攻撃
      const origStrength = player.strength;
      const origWeaponAtk = player.weapon?.baseAtk || 0;

      // 背後ボーナスとしてダメージ2倍を適用
      if (!this.checkHit(HIT_RATE.PLAYER_ATTACK)) {
        return {
          success: false,
          hit: false,
          message: `${target.name}に攻撃を外した！`,
          damage: 0,
          killed: false,
          exp: 0,
          target
        };
      }

      const attack = player.getAttack() * 2;
      const defense = target.getDefense();
      const damage = this.calculateDamage(attack, defense);

      target.takeDamage(damage);
      const result = {
        success: true,
        hit: true,
        damage,
        critical: true,
        killed: !target.isAlive,
        exp: target.isAlive ? 0 : target.exp,
        message: `背後から${target.name}に${damage}のダメージ！`,
        target
      };

      if (!target.isAlive) {
        result.message += `\n${target.name}を倒した！経験値${target.exp}を獲得！`;
      }

      return result;
    }

    // 通常攻撃
    return this.playerAttack(player, target);
  }

  /**
   * 3方向同時攻撃（かまいたち）
   */
  tripleAttack(player, monsters) {
    const dirs = getThreeDirections(player.direction);
    const results = [];

    for (const d of dirs) {
      const tx = player.x + d.dx;
      const ty = player.y + d.dy;
      const target = monsters.find(m => m.isAlive && m.x === tx && m.y === ty);
      if (target) {
        results.push(this.playerAttack(player, target));
      }
    }

    if (results.length === 0) {
      results.push({
        success: false,
        hit: false,
        message: '空振りした！',
        damage: 0,
        killed: false,
        exp: 0,
        target: null
      });
    }

    return results;
  }

  /**
   * 隣接する敵を自動で攻撃（移動先に敵がいる場合）
   */
  attackAdjacent(player, monsters, dx, dy) {
    const targetX = player.x + dx;
    const targetY = player.y + dy;

    const target = monsters.find(m =>
      m.isAlive && m.x === targetX && m.y === targetY
    );

    if (target) {
      return this.playerAttack(player, target);
    }

    return null;
  }
}
