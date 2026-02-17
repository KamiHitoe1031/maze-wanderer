/**
 * weapons.js - 武器データ定義
 */

export const WEAPON_DATA = [
  {
    id: 'wooden_stick',
    name: '木の棒',
    spriteKey: 'item.weapon.wooden_stick',
    baseAtk: 2,
    buyPrice: 300,
    sellPrice: 90,
    slots: 3,
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
    effect: null,
    description: '鋼鉄の太刀。切れ味が鋭い。'
  },
  {
    id: 'spirit_sword',
    name: '霊刀',
    spriteKey: 'item.weapon.spirit_sword',
    baseAtk: 5,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
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
    effect: 'drain_slayer',
    description: 'ドレイン系に2倍ダメージ。'
  },
  {
    id: 'pickaxe',
    name: 'つるはし',
    spriteKey: 'item.weapon.pickaxe',
    baseAtk: 3,
    buyPrice: 700,
    sellPrice: 350,
    slots: 3,
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
    effect: 'triple_attack',
    description: '正面3方向を同時に攻撃する。'
  },
  {
    id: 'legendary_sword',
    name: '伝説の剣',
    spriteKey: 'item.weapon.legendary_sword',
    baseAtk: 15,
    buyPrice: 15000,
    sellPrice: 5000,
    slots: 8,
    effect: null,
    description: '最強の剣。'
  }
];

/**
 * IDから武器データを取得
 */
export function getWeaponData(id) {
  return WEAPON_DATA.find(w => w.id === id);
}
