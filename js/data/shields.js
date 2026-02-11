/**
 * shields.js - 盾データ定義
 */

export const SHIELD_DATA = [
  {
    id: 'wooden_shield',
    name: '木の盾',
    spriteKey: 'item.shield',
    baseDef: 2,
    buyPrice: 300,
    sellPrice: 90,
    slots: 3,
    effect: null,
    description: '木製の盾。'
  },
  {
    id: 'copper_shield',
    name: '銅の盾',
    spriteKey: 'item.shield',
    baseDef: 4,
    buyPrice: 600,
    sellPrice: 180,
    slots: 3,
    effect: null,
    description: '銅製の盾。'
  },
  {
    id: 'iron_shield',
    name: '鉄の盾',
    spriteKey: 'item.shield',
    baseDef: 6,
    buyPrice: 1500,
    sellPrice: 450,
    slots: 4,
    effect: null,
    description: '鉄の盾。頑丈。'
  },
  {
    id: 'steel_shield',
    name: '鋼鉄の盾',
    spriteKey: 'item.shield',
    baseDef: 9,
    buyPrice: 3000,
    sellPrice: 900,
    slots: 5,
    effect: null,
    description: '鋼鉄製の盾。'
  },
  {
    id: 'evasion_shield',
    name: '見切りの盾',
    spriteKey: 'item.shield',
    baseDef: 3,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    effect: 'evasion',
    description: '敵の攻撃回避率+22%。'
  },
  {
    id: 'antidote_shield',
    name: '毒消しの盾',
    spriteKey: 'item.shield',
    baseDef: 3,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    effect: 'antidote',
    description: 'ちから下げ攻撃を無効化。'
  },
  {
    id: 'rustproof_shield',
    name: '錆止めの盾',
    spriteKey: 'item.shield',
    baseDef: 3,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    effect: 'rustproof',
    description: '強化値を下げられない。'
  },
  {
    id: 'blast_shield',
    name: '爆発防御の盾',
    spriteKey: 'item.shield',
    baseDef: 4,
    buyPrice: 6000,
    sellPrice: 1800,
    slots: 4,
    effect: 'blast_guard',
    description: '爆発ダメージ半減。'
  },
  {
    id: 'fullness_shield',
    name: '満腹の盾',
    spriteKey: 'item.shield',
    baseDef: 4,
    buyPrice: 5000,
    sellPrice: 1500,
    slots: 4,
    effect: 'fullness',
    description: '満腹度減少速度が半分。'
  },
  {
    id: 'legendary_shield',
    name: '伝説の盾',
    spriteKey: 'item.shield',
    baseDef: 15,
    buyPrice: 15000,
    sellPrice: 5000,
    slots: 8,
    effect: null,
    description: '最強の盾。'
  }
];

/**
 * IDから盾データを取得
 */
export function getShieldData(id) {
  return SHIELD_DATA.find(s => s.id === id);
}
