/**
 * combat.js - ダメージ計算・戦闘処理
 */

// 命中率
const HIT_RATE = {
  PLAYER_ATTACK: 0.92,    // プレイヤーの通常攻撃
  PLAYER_RANGED: 0.84,    // 矢・投擲
  MONSTER_ATTACK: 0.88    // 敵の攻撃
};

export class Combat {
  constructor(rng) {
    this.rng = rng;
  }

  /**
   * ダメージ計算
   * @param {number} attack - 攻撃側の攻撃力
   * @param {number} defense - 防御側の防御力
   * @returns {number} - 計算されたダメージ
   */
  calculateDamage(attack, defense) {
    // 基本ダメージ = max(1, 攻撃力 - 防御力 + 1)
    const baseDamage = Math.max(1, attack - defense + 1);

    // 乱数補正 = 87.5% ～ 112.5%
    const randomMod = 0.875 + this.rng.next() * 0.25;

    // 最終ダメージ（最低保証1）
    const finalDamage = Math.max(1, Math.floor(baseDamage * randomMod));

    return finalDamage;
  }

  /**
   * 命中判定
   * @param {number} hitRate - 命中率（0.0 ～ 1.0）
   * @returns {boolean} - 命中したか
   */
  checkHit(hitRate) {
    return this.rng.chance(hitRate);
  }

  /**
   * プレイヤーがモンスターを攻撃
   */
  playerAttack(player, monster) {
    const result = {
      success: false,
      hit: false,
      damage: 0,
      critical: false,
      killed: false,
      exp: 0,
      message: ''
    };

    // 命中判定
    if (!this.checkHit(HIT_RATE.PLAYER_ATTACK)) {
      result.message = `${monster.name}に攻撃を外した！`;
      return result;
    }

    result.hit = true;

    // ダメージ計算
    const attack = player.getAttack();
    const defense = monster.getDefense();
    const damage = this.calculateDamage(attack, defense);

    // ダメージ適用
    monster.takeDamage(damage);
    result.damage = damage;
    result.success = true;
    result.message = `${monster.name}に${damage}のダメージを与えた！`;

    // 撃破判定
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
  monsterAttack(monster, player) {
    const result = {
      success: false,
      hit: false,
      damage: 0,
      killed: false,
      message: ''
    };

    // 命中判定
    if (!this.checkHit(HIT_RATE.MONSTER_ATTACK)) {
      result.message = `${monster.name}の攻撃を避けた！`;
      return result;
    }

    result.hit = true;

    // ダメージ計算
    const attack = monster.getAttack();
    const defense = player.getDefense();
    const damage = this.calculateDamage(attack, defense);

    // ダメージ適用
    player.takeDamage(damage);
    result.damage = damage;
    result.success = true;
    result.message = `${monster.name}から${damage}のダメージを受けた！`;

    // 死亡判定
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

    return monsters.find(m =>
      m.isAlive && m.x === targetX && m.y === targetY
    );
  }

  /**
   * プレイヤーの向いている方向に攻撃
   */
  attackInDirection(player, monsters) {
    const target = this.getAttackTarget(player, player.direction, monsters);

    if (!target) {
      // 空振り
      return {
        success: false,
        message: '空振りした！',
        damage: 0,
        killed: false,
        exp: 0
      };
    }

    return this.playerAttack(player, target);
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
