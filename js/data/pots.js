/**
 * pots.js - 壺データ定義
 */

export const POT_DATA = [
  {
    id: 'storage_pot',
    name: '保存の壺',
    spriteKey: 'item.pot.storage_pot',
    buyPrice: 1000,
    sellPrice: 300,
    capacity: 5,
    effect: 'storage',
    description: 'アイテムを入れて保管できる。'
  },
  {
    id: 'identify_pot',
    name: '識別の壺',
    spriteKey: 'item.pot.identify_pot',
    buyPrice: 1500,
    sellPrice: 450,
    capacity: 3,
    effect: 'identify',
    description: '入れたアイテムが識別される。'
  },
  {
    id: 'synthesis_pot',
    name: '合成の壺',
    spriteKey: 'item.pot.synthesis_pot',
    buyPrice: 5000,
    sellPrice: 1500,
    capacity: 3,
    effect: 'synthesis',
    description: '同種装備を入れると合成される。'
  },
  {
    id: 'heal_pot',
    name: '回復の壺',
    spriteKey: 'item.pot.heal_pot',
    buyPrice: 2000,
    sellPrice: 600,
    capacity: 3,
    effect: 'heal',
    description: '入れた数に応じてHP回復。割ると周囲も回復。'
  },
  {
    id: 'warehouse_pot',
    name: '倉庫の壺',
    spriteKey: 'item.pot.warehouse_pot',
    buyPrice: 3000,
    sellPrice: 900,
    capacity: 5,
    effect: 'warehouse',
    description: '中身が自動で倉庫に送られる。'
  },
  {
    id: 'curse_pot',
    name: '呪いの壺',
    spriteKey: 'item.pot.curse_pot',
    buyPrice: 500,
    sellPrice: 150,
    capacity: 3,
    effect: 'curse',
    description: '入れたアイテムが呪われてしまう。'
  },
  {
    id: 'transform_pot',
    name: '変化の壺',
    spriteKey: 'item.pot.transform_pot',
    buyPrice: 1000,
    sellPrice: 350,
    capacity: 3,
    effect: 'transform',
    description: '入れたアイテムが別のアイテムに変化する。'
  },
  {
    id: 'upgrade_pot',
    name: '強化の壺',
    spriteKey: 'item.pot.upgrade_pot',
    buyPrice: 5000,
    sellPrice: 1750,
    capacity: 3,
    effect: 'upgrade',
    description: '入れた武器/盾の強化値+1（フロア移動時）。'
  },
  {
    id: 'downgrade_pot',
    name: '弱化の壺',
    spriteKey: 'item.pot.downgrade_pot',
    buyPrice: 1000,
    sellPrice: 350,
    capacity: 3,
    effect: 'downgrade',
    description: '入れた武器/盾の強化値-3。'
  },
  {
    id: 'evade_pot',
    name: 'やりすごしの壺',
    spriteKey: 'item.pot.evade_pot',
    buyPrice: 800,
    sellPrice: 280,
    capacity: 2,
    effect: 'evade',
    description: '使うと壺に隠れてやり過ごし（20ターン）。'
  },
  {
    id: 'bottomless_pot',
    name: '底抜けの壺',
    spriteKey: 'item.pot.bottomless_pot',
    buyPrice: 1000,
    sellPrice: 350,
    capacity: 3,
    effect: 'bottomless',
    description: '入れたアイテムが消滅してしまう。'
  },
  {
    id: 'unbreakable_pot',
    name: '割れない壺',
    spriteKey: 'item.pot.unbreakable_pot',
    buyPrice: 3000,
    sellPrice: 1050,
    capacity: 3,
    effect: 'unbreakable',
    description: '投げても割れない保存壺。'
  }
];

// 未識別時の仮名テーブル
export const POT_FAKE_NAMES = [
  '赤い壺', '青い壺', '黄色い壺', '緑の壺',
  '白い壺', '黒い壺', '光る壺', '丸い壺',
  '細長い壺', '四角い壺', '模様の壺', '古びた壺',
  '透明な壺', '重い壺', '軽い壺'
];

/**
 * IDから壺データを取得
 */
export function getPotData(id) {
  return POT_DATA.find(p => p.id === id);
}
