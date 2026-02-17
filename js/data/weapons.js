/**
 * weapons.js - 武器データ定義
 */

export const WEAPON_DATA = [
  // === 通常近接武器 ===
  {
    id: 'wooden_stick',
    name: '木の棒',
    spriteKey: 'item.weapon.wooden_stick',
    baseAtk: 2,
    buyPrice: 300,
    sellPrice: 90,
    slots: 3,
    attackType: 'melee',
    effect: null,
    description: '何の変哲もない木の棒。'
  },
  {
    id: 'copper_sword',
    name: '銅の剣',
    spriteKey: 'item.weapon.copper_sword',
    baseAtk: 4,
    buyPrice: 600,
    sellPrice: 180,
    slots: 3,
    attackType: 'melee',
    effect: null,
    description: '銅で作られた剣。'
  },
  {
    id: 'iron_katana',
    name: '鉄の刀',
    spriteKey: 'item.weapon.iron_katana',
    baseAtk: 6,
    buyPrice: 1000,
    sellPrice: 300,
    slots: 4,
    attackType: 'melee',
    effect: null,
    description: '鉄で鍛えられた刀。'
  },
  {
    id: 'steel_tachi',
    name: '鋼の太刀',
    spriteKey: 'item.weapon.steel_tachi',
    baseAtk: 8,
    buyPrice: 2000,
    sellPrice: 600,
    slots: 5,
    attackType: 'melee',
    effect: null,
    description: '鋼鉄の太刀。切れ味が鋭い。'
  },
  {
    id: 'legendary_sword',
    name: '伝説の剣',
    spriteKey: 'item.weapon.legendary_sword',
    baseAtk: 15,
    buyPrice: 15000,
    sellPrice: 5000,
    slots: 8,
    attackType: 'melee',
    effect: null,
    description: '最強の剣。'
  },

  // === 特効武器（近接） ===
  {
    id: 'spirit_sword',
    name: '霊刀',
    spriteKey: 'item.weapon.spirit_sword',
    baseAtk: 5,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    attackType: 'melee',
    effect: 'ghost_slayer',
    description: '幽霊系に2倍ダメージ。'
  },
  {
    id: 'dragon_sword',
    name: '竜斬りの剣',
    spriteKey: 'item.weapon.dragon_sword',
    baseAtk: 5,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    attackType: 'melee',
    effect: 'dragon_slayer',
    description: '竜系に2倍ダメージ。'
  },
  {
    id: 'cyclops_sword',
    name: '一つ目斬り',
    spriteKey: 'item.weapon.cyclops_sword',
    baseAtk: 5,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    attackType: 'melee',
    effect: 'cyclops_slayer',
    description: '一つ目系に2倍ダメージ。'
  },
  {
    id: 'drain_sword',
    name: 'ドレイン斬り',
    spriteKey: 'item.weapon.drain_sword',
    baseAtk: 5,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    attackType: 'melee',
    effect: 'drain_slayer',
    description: 'ドレイン系に2倍ダメージ。'
  },
  {
    id: 'coral_blade',
    name: '珊瑚の刃',
    spriteKey: 'item.weapon.coral_blade',
    baseAtk: 6,
    buyPrice: 3500,
    sellPrice: 1050,
    slots: 4,
    attackType: 'melee',
    effect: 'aqua_slayer',
    description: '水棲系に2倍ダメージ。'
  },

  // === 特殊近接武器 ===
  {
    id: 'pickaxe',
    name: 'つるはし',
    spriteKey: 'item.weapon.pickaxe',
    baseAtk: 3,
    buyPrice: 700,
    sellPrice: 350,
    slots: 3,
    attackType: 'melee',
    effect: 'dig',
    description: '壁を掘ることができる。'
  },
  {
    id: 'kamaitachi',
    name: '妖刀かまいたち',
    spriteKey: 'item.weapon.kamaitachi',
    baseAtk: 7,
    buyPrice: 8000,
    sellPrice: 2400,
    slots: 5,
    attackType: 'kamaitachi',
    effect: null,
    description: '正面3方向を同時に攻撃する。'
  },
  {
    id: 'thunder_staff',
    name: '雷光の杖剣',
    spriteKey: 'item.weapon.thunder_staff',
    baseAtk: 7,
    buyPrice: 6000,
    sellPrice: 1800,
    slots: 5,
    attackType: 'melee',
    effect: 'paralyze_10',
    description: '10%の確率で敵を麻痺させる。'
  },
  {
    id: 'shadow_dagger',
    name: '影の短剣',
    spriteKey: 'item.weapon.shadow_dagger',
    baseAtk: 4,
    buyPrice: 4000,
    sellPrice: 1200,
    slots: 4,
    attackType: 'dagger',
    effect: null,
    description: '背後からの攻撃で2倍ダメージ。'
  },

  // === 槍（貫通） ===
  {
    id: 'bronze_spear',
    name: '青銅の槍',
    spriteKey: 'item.weapon.bronze_spear',
    baseAtk: 4,
    buyPrice: 900,
    sellPrice: 270,
    slots: 3,
    attackType: 'spear',
    range: 2,
    effect: null,
    description: '前方2マスを貫通攻撃。'
  },
  {
    id: 'iron_spear',
    name: '鉄の槍',
    spriteKey: 'item.weapon.iron_spear',
    baseAtk: 6,
    buyPrice: 1800,
    sellPrice: 540,
    slots: 4,
    attackType: 'spear',
    range: 2,
    effect: null,
    description: '前方2マスを貫通攻撃。'
  },

  // === 弓（遠距離） ===
  {
    id: 'short_bow',
    name: '短弓',
    spriteKey: 'item.weapon.short_bow',
    baseAtk: 3,
    buyPrice: 800,
    sellPrice: 240,
    slots: 3,
    attackType: 'bow',
    range: 4,
    effect: null,
    description: '前方4マス先まで矢を撃てる。'
  },
  {
    id: 'long_bow',
    name: '長弓',
    spriteKey: 'item.weapon.long_bow',
    baseAtk: 5,
    buyPrice: 2500,
    sellPrice: 750,
    slots: 4,
    attackType: 'bow',
    range: 6,
    effect: null,
    description: '前方6マス先まで矢を撃てる。'
  },

  // === 鞭 ===
  {
    id: 'vine_whip',
    name: '蔦の鞭',
    spriteKey: 'item.weapon.vine_whip',
    baseAtk: 5,
    buyPrice: 2500,
    sellPrice: 750,
    slots: 4,
    attackType: 'whip',
    range: 3,
    effect: null,
    description: '前方3マスの敵を攻撃。'
  },

  // === 鉄槌 ===
  {
    id: 'war_hammer',
    name: '戦鎚',
    spriteKey: 'item.weapon.war_hammer',
    baseAtk: 9,
    buyPrice: 4000,
    sellPrice: 1200,
    slots: 5,
    attackType: 'hammer',
    effect: null,
    description: '敵を吹き飛ばし、壁を壊す。'
  },

  // === ブーメラン ===
  {
    id: 'boomerang',
    name: 'ブーメラン',
    spriteKey: 'item.weapon.boomerang',
    baseAtk: 3,
    buyPrice: 1500,
    sellPrice: 450,
    slots: 3,
    attackType: 'boomerang',
    range: 5,
    effect: null,
    description: '投げて戻ってくる。射程5マス。'
  },

  // === 状態異常付与武器 ===
  {
    id: 'poison_dagger',
    name: '毒の短剣',
    spriteKey: 'item.weapon.poison_dagger',
    baseAtk: 4, buyPrice: 3500, sellPrice: 1050, slots: 4,
    attackType: 'melee', effect: 'poison_hit',
    description: '15%の確率で毒を与える。'
  },
  {
    id: 'flame_sword',
    name: '炎の剣',
    spriteKey: 'item.weapon.flame_sword',
    baseAtk: 6, buyPrice: 5000, sellPrice: 1500, slots: 4,
    attackType: 'melee', effect: 'burn_hit',
    description: '15%の確率で火傷を与える。'
  },
  {
    id: 'sleep_mace',
    name: '眠りの鉄槌',
    spriteKey: 'item.weapon.sleep_mace',
    baseAtk: 5, buyPrice: 4000, sellPrice: 1200, slots: 4,
    attackType: 'melee', effect: 'sleep_hit',
    description: '10%の確率で眠らせる。'
  },
  {
    id: 'confusion_staff',
    name: '混乱の杖剣',
    spriteKey: 'item.weapon.confusion_staff',
    baseAtk: 5, buyPrice: 4000, sellPrice: 1200, slots: 4,
    attackType: 'melee', effect: 'confuse_hit',
    description: '12%の確率で混乱させる。'
  },
  {
    id: 'slow_whip',
    name: '鈍足の鞭',
    spriteKey: 'item.weapon.slow_whip',
    baseAtk: 5, buyPrice: 4000, sellPrice: 1200, slots: 4,
    attackType: 'whip', range: 3, effect: 'slow_hit',
    description: '12%の確率で鈍足にする。射程3マス。'
  },
  {
    id: 'seal_blade',
    name: '封印の刃',
    spriteKey: 'item.weapon.seal_blade',
    baseAtk: 5, buyPrice: 5000, sellPrice: 1500, slots: 4,
    attackType: 'melee', effect: 'seal_hit',
    description: '10%の確率で特殊能力を封印する。'
  },
  // === ダメージ系特殊武器 ===
  {
    id: 'critical_axe',
    name: '必殺の斧',
    spriteKey: 'item.weapon.critical_axe',
    baseAtk: 7, buyPrice: 6000, sellPrice: 1800, slots: 5,
    attackType: 'melee', effect: 'critical_hit',
    description: '25%の確率で会心の一撃。'
  },
  {
    id: 'life_drain_sword',
    name: '吸血の剣',
    spriteKey: 'item.weapon.life_drain_sword',
    baseAtk: 5, buyPrice: 6000, sellPrice: 1800, slots: 4,
    attackType: 'melee', effect: 'hp_drain',
    description: 'ダメージの1/4のHP吸収。'
  },
  {
    id: 'bonus_blade',
    name: '重撃の剣',
    spriteKey: 'item.weapon.bonus_blade',
    baseAtk: 3, buyPrice: 5000, sellPrice: 1500, slots: 5,
    attackType: 'melee', effect: 'bonus_damage',
    description: '強化値に応じた追加ダメージ。'
  }
];

/**
 * IDから武器データを取得
 */
export function getWeaponData(id) {
  return WEAPON_DATA.find(w => w.id === id);
}
