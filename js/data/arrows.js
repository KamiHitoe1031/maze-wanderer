/**
 * arrows.js - 矢データ定義
 */

export const ARROW_DATA = [
  {
    id: 'wood_arrow',
    name: '木の矢',
    spriteKey: 'item.arrow.wood_arrow',
    buyPrice: 30,
    sellPrice: 10,
    baseDamage: 5,
    arrowEffect: null,
    description: '基本的な矢。'
  },
  {
    id: 'iron_arrow',
    name: '鉄の矢',
    spriteKey: 'item.arrow.iron_arrow',
    buyPrice: 80,
    sellPrice: 25,
    baseDamage: 10,
    arrowEffect: null,
    description: '鉄製の矢。威力が高い。'
  },
  {
    id: 'silver_arrow',
    name: '銀の矢',
    spriteKey: 'item.arrow.silver_arrow',
    buyPrice: 200,
    sellPrice: 65,
    baseDamage: 20,
    arrowEffect: null,
    description: '銀製の矢。威力がとても高い。'
  },
  {
    id: 'poison_arrow',
    name: '毒矢',
    spriteKey: 'item.arrow.poison_arrow',
    buyPrice: 60,
    sellPrice: 20,
    baseDamage: 5,
    arrowEffect: 'poison',
    description: '当たるとちからが1下がる。'
  },
  {
    id: 'knockback_arrow',
    name: 'かなしばりの矢',
    spriteKey: 'item.arrow.knockback_arrow',
    buyPrice: 100,
    sellPrice: 30,
    baseDamage: 3,
    arrowEffect: 'paralyze',
    description: '当たると金縛り状態にする。'
  }
];

/**
 * IDから矢データを取得
 */
export function getArrowData(id) {
  return ARROW_DATA.find(a => a.id === id);
}
