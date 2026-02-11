/**
 * grasses.js - 草・種データ定義
 */

export const GRASS_DATA = [
  {
    id: 'heal_grass',
    name: '回復草',
    spriteKey: 'item.grass',
    buyPrice: 200,
    sellPrice: 70,
    effect: 'heal',
    healAmount: 50,
    description: 'HPを50回復する草。'
  },
  {
    id: 'great_heal_grass',
    name: '上回復草',
    spriteKey: 'item.grass',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'great_heal',
    healAmount: 100,
    maxHpUp: 4,
    description: 'HPを100回復し、最大HP+4。'
  },
  {
    id: 'herb',
    name: '薬草',
    spriteKey: 'item.grass',
    buyPrice: 100,
    sellPrice: 35,
    effect: 'herb',
    healAmount: 25,
    description: 'HPを25回復する草。'
  },
  {
    id: 'antidote_grass',
    name: '毒消し草',
    spriteKey: 'item.grass',
    buyPrice: 200,
    sellPrice: 70,
    effect: 'antidote',
    description: 'ちから現在値を最大値に回復。'
  },
  {
    id: 'power_seed',
    name: 'ちからの種',
    spriteKey: 'item.grass',
    buyPrice: 700,
    sellPrice: 245,
    effect: 'power_up',
    description: 'ちから最大値+1。'
  },
  {
    id: 'happy_seed',
    name: 'しあわせの種',
    spriteKey: 'item.grass',
    buyPrice: 1000,
    sellPrice: 350,
    effect: 'level_up',
    levelUp: 1,
    description: 'レベル+1。'
  },
  {
    id: 'angel_seed',
    name: '天使の種',
    spriteKey: 'item.grass',
    buyPrice: 3000,
    sellPrice: 1050,
    effect: 'level_up',
    levelUp: 3,
    description: 'レベル+3。'
  },
  {
    id: 'speed_seed',
    name: 'すばやさの種',
    spriteKey: 'item.grass',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'speed',
    duration: 10,
    description: '10ターン倍速になる。'
  },
  {
    id: 'wakeup_grass',
    name: '目覚まし草',
    spriteKey: 'item.grass',
    buyPrice: 200,
    sellPrice: 70,
    effect: 'wakeup',
    description: '睡眠から回復する。'
  },
  {
    id: 'confusion_grass',
    name: '混乱草',
    spriteKey: 'item.grass',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'confusion',
    duration: 10,
    description: '10ターン混乱状態になる。'
  },
  {
    id: 'sleep_grass',
    name: '睡眠草',
    spriteKey: 'item.grass',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'sleep',
    duration: 5,
    description: '5ターン睡眠状態になる。'
  },
  {
    id: 'poison_grass',
    name: '毒草',
    spriteKey: 'item.grass',
    buyPrice: 200,
    sellPrice: 70,
    effect: 'poison',
    description: 'ちから-1、5ダメージ。'
  },
  {
    id: 'berserk_grass',
    name: '暴走草',
    spriteKey: 'item.grass',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'berserk',
    description: '狂戦士状態になる。'
  },
  {
    id: 'invincible_grass',
    name: '無敵草',
    spriteKey: 'item.grass',
    buyPrice: 1000,
    sellPrice: 350,
    effect: 'invincible',
    duration: 15,
    description: '15ターン無敵状態になる。'
  },
  {
    id: 'revival_seed',
    name: '復活の種',
    spriteKey: 'item.grass',
    buyPrice: 2000,
    sellPrice: 700,
    effect: 'revival',
    description: '倒れた時にHP全回復で復活する。'
  },
  {
    id: 'dragon_grass',
    name: '竜の炎草',
    spriteKey: 'item.grass',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'dragon_fire',
    damage: 40,
    description: '正面に炎を吐く(40ダメージ)。'
  },
  {
    id: 'amnesia_seed',
    name: '物忘れの種',
    spriteKey: 'item.grass',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'amnesia',
    description: 'フロアの地図情報が消える。'
  }
];

// 未識別用の仮名テーブル
export const GRASS_FAKE_NAMES = [
  '赤い草', '青い草', '黄色い草', '緑の草',
  '紫の草', '白い草', '黒い草', '光る草',
  '苦い草', '甘い草', '辛い草', '酸っぱい草',
  '柔らかい草', '硬い草', '薄い草', '太い草',
  '丸い種', '細長い種', '角張った種'
];

/**
 * IDから草データを取得
 */
export function getGrassData(id) {
  return GRASS_DATA.find(g => g.id === id);
}
