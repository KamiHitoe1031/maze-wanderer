/**
 * food.js - 食料データ定義
 */

export const FOOD_DATA = [
  {
    id: 'riceball',
    name: 'おにぎり',
    spriteKey: 'item.food',
    buyPrice: 100,
    sellPrice: 35,
    fullnessRestore: 50,
    hpRestore: 0,
    maxFullnessUp: 0,
    strengthChange: 0,
    damage: 0,
    description: '満腹度を50回復する。'
  },
  {
    id: 'big_riceball',
    name: '大きいおにぎり',
    spriteKey: 'item.food',
    buyPrice: 200,
    sellPrice: 70,
    fullnessRestore: 100,
    hpRestore: 0,
    maxFullnessUp: 0,
    strengthChange: 0,
    damage: 0,
    description: '満腹度を100回復する。'
  },
  {
    id: 'huge_riceball',
    name: '特大おにぎり',
    spriteKey: 'item.food',
    buyPrice: 300,
    sellPrice: 105,
    fullnessRestore: 100,
    hpRestore: 0,
    maxFullnessUp: 5,
    strengthChange: 0,
    damage: 0,
    description: '満腹度を100回復し、最大満腹度+5。'
  },
  {
    id: 'grilled_riceball',
    name: '焼きおにぎり',
    spriteKey: 'item.food',
    buyPrice: 200,
    sellPrice: 70,
    fullnessRestore: 60,
    hpRestore: 40,
    maxFullnessUp: 0,
    strengthChange: 0,
    damage: 0,
    description: '満腹度を60、HPを40回復する。'
  },
  {
    id: 'rotten_riceball',
    name: '腐ったおにぎり',
    spriteKey: 'item.food',
    buyPrice: 50,
    sellPrice: 17,
    fullnessRestore: 30,
    hpRestore: 0,
    maxFullnessUp: 0,
    strengthChange: -1,
    damage: 5,
    description: '満腹度30回復、ちから-1、5ダメージ。'
  }
];

/**
 * IDから食料データを取得
 */
export function getFoodData(id) {
  return FOOD_DATA.find(f => f.id === id);
}
