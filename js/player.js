/**
 * player.js - プレイヤー状態・行動
 */

// 経験値テーブル: 必要経験値 = floor(4 * Lv^1.6)
function calcRequiredExp(level) {
  return Math.floor(4 * Math.pow(level, 1.6));
}

// 最大HP計算: Lv1=15, Lv2～: 前レベルのHP + (3 + floor(Lv / 5))
function calcMaxHp(level) {
  if (level <= 1) return 15;
  let hp = 15;
  for (let lv = 2; lv <= level; lv++) {
    hp += 3 + Math.floor(lv / 5);
  }
  return hp;
}

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    // 基本ステータス
    this.level = 1;
    this.exp = 0;
    this.hp = 15;
    this.maxHp = 15;
    this.strength = 8;
    this.maxStrength = 8;
    this.fullness = 100;
    this.maxFullness = 100;
    this.gold = 0;

    // 装備
    this.weapon = null;
    this.shield = null;
    this.ring1 = null;
    this.ring2 = null;

    // インベントリ
    this.inventory = [];
    this.maxInventory = 20;

    // 向き（最後に移動した方向）
    this.direction = { dx: 0, dy: 1 };

    // 状態フラグ
    this.isAlive = true;
    this.hasRevival = false;

    // 状態異常
    this.statusEffects = [];
  }

  /**
   * 攻撃力を計算
   */
  getAttack() {
    // レベル補正
    let lvBonus;
    if (this.level <= 5) {
      lvBonus = Math.floor(this.level * 1.5);
    } else if (this.level <= 13) {
      lvBonus = 7 + (this.level - 5);
    } else {
      lvBonus = 15 + Math.floor((this.level - 13) * 0.5);
    }

    // 武器の強さ
    let weaponStr = 0;
    if (this.weapon) {
      weaponStr = this.weapon.baseAtk + (this.weapon.enhance || 0);
    }

    return lvBonus + this.strength + weaponStr;
  }

  /**
   * 防御力を計算
   */
  getDefense() {
    if (!this.shield) return 0;

    const shieldStr = this.shield.baseDef + (this.shield.enhance || 0);
    if (shieldStr <= 20) {
      return Math.floor(shieldStr / 2);
    } else {
      return 10 + Math.floor((shieldStr - 20) * 0.3);
    }
  }

  /**
   * 満腹の盾を装備しているか
   */
  hasFullnessShield() {
    return this.shield && this.shield.effect === 'fullness';
  }

  /**
   * 経験値を獲得
   */
  gainExp(amount) {
    this.exp += amount;

    // レベルアップ判定
    while (this.level < 50 && this.exp >= calcRequiredExp(this.level + 1)) {
      this.levelUp();
    }
  }

  /**
   * レベルアップ
   */
  levelUp() {
    this.level++;
    const newMaxHp = calcMaxHp(this.level);
    const hpGain = newMaxHp - this.maxHp;
    this.maxHp = newMaxHp;
    this.hp = Math.min(this.hp + hpGain, this.maxHp);

    return {
      level: this.level,
      hpGain: hpGain
    };
  }

  /**
   * ダメージを受ける
   */
  takeDamage(amount) {
    // 無敵チェック
    if (this.hasStatusEffect('invincible')) return 0;

    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isAlive = false;
    }
    return amount;
  }

  /**
   * HPを回復
   */
  heal(amount) {
    const healed = Math.min(amount, this.maxHp - this.hp);
    this.hp += healed;
    return healed;
  }

  /**
   * 満腹度を減らす
   */
  reduceFullness(amount = 1) {
    this.fullness -= amount;
    if (this.fullness < 0) {
      this.fullness = 0;
    }
  }

  /**
   * 満腹度を回復
   */
  restoreFullness(amount) {
    this.fullness = Math.min(this.fullness + amount, this.maxFullness);
  }

  /**
   * 自然回復
   */
  naturalHeal() {
    if (this.fullness <= 0 || this.hp >= this.maxHp) return 0;

    const healAmount = Math.max(1, Math.floor(this.maxHp / 150));
    return this.heal(healAmount);
  }

  /**
   * 飢餓ダメージ
   */
  starvationDamage() {
    if (this.fullness <= 0) {
      // starvationは無敵でも受ける - 直接HP減算
      this.hp -= 1;
      if (this.hp <= 0) {
        this.hp = 0;
        this.isAlive = false;
      }
      return true;
    }
    return false;
  }

  /**
   * 移動
   */
  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    if (dx !== 0 || dy !== 0) {
      this.direction = { dx, dy };
    }
  }

  /**
   * 位置を設定
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 次のレベルまでの経験値
   */
  getExpToNextLevel() {
    if (this.level >= 50) return 0;
    return calcRequiredExp(this.level + 1) - this.exp;
  }

  /**
   * 状態異常を持っているか
   */
  hasStatusEffect(type) {
    return this.statusEffects.some(e => e.type === type);
  }

  /**
   * 状態異常ターン経過
   */
  tickStatusEffects() {
    this.statusEffects = this.statusEffects.filter(effect => {
      if (effect.remaining === -1) return true; // 永続
      effect.remaining--;
      return effect.remaining > 0;
    });
  }

  /**
   * ステータス情報を取得
   */
  getStats() {
    return {
      level: this.level,
      hp: this.hp,
      maxHp: this.maxHp,
      strength: this.strength,
      maxStrength: this.maxStrength,
      fullness: this.fullness,
      maxFullness: this.maxFullness,
      gold: this.gold,
      attack: this.getAttack(),
      defense: this.getDefense(),
      exp: this.exp,
      expToNext: this.getExpToNextLevel()
    };
  }
}
