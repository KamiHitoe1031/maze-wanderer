/**
 * wands.js - 杖データ定義
 */

export const WAND_DATA = [
  {
    id: 'seal_wand',
    name: '封印の杖',
    spriteKey: 'item.wand',
    buyPrice: 700,
    sellPrice: 245,
    chargeRange: [4, 6],
    effect: 'seal',
    description: '敵の特殊能力を封印する。'
  },
  {
    id: 'paralyze_wand',
    name: 'かなしばりの杖',
    spriteKey: 'item.wand',
    buyPrice: 700,
    sellPrice: 245,
    chargeRange: [4, 6],
    effect: 'paralyze',
    description: '敵をその場に固定する。攻撃されるまで動けない。'
  },
  {
    id: 'sleep_wand',
    name: '睡眠の杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [4, 6],
    effect: 'sleep',
    description: '敵を5ターン眠らせる。'
  },
  {
    id: 'confusion_wand',
    name: '混乱の杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [4, 6],
    effect: 'confusion',
    description: '敵を10ターン混乱させる。'
  },
  {
    id: 'slow_wand',
    name: '鈍足の杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [4, 6],
    effect: 'slow',
    description: '敵を2ターンに1回行動にする。'
  },
  {
    id: 'haste_wand',
    name: '加速の杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [4, 6],
    effect: 'haste',
    description: '対象を倍速にする。1ターン2回行動。'
  },
  {
    id: 'knockback_wand',
    name: '吹き飛ばしの杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [4, 6],
    effect: 'knockback',
    description: '敵を10マス吹き飛ばす。壁に当たると10ダメージ。'
  },
  {
    id: 'swap_wand',
    name: '場所替えの杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [4, 6],
    effect: 'swap',
    description: '敵と位置を入れ替える。'
  },
  {
    id: 'decoy_wand',
    name: '身代わりの杖',
    spriteKey: 'item.wand',
    buyPrice: 1000,
    sellPrice: 350,
    chargeRange: [3, 5],
    effect: 'decoy',
    description: '敵を身代わり状態にする。他の敵がそいつを攻撃する。'
  },
  {
    id: 'misfortune_wand',
    name: '不幸の杖',
    spriteKey: 'item.wand',
    buyPrice: 700,
    sellPrice: 245,
    chargeRange: [3, 5],
    effect: 'misfortune',
    description: '敵のレベルを1下げる。'
  },
  {
    id: 'fortune_wand',
    name: 'しあわせの杖',
    spriteKey: 'item.wand',
    buyPrice: 1000,
    sellPrice: 350,
    chargeRange: [3, 5],
    effect: 'fortune',
    description: '対象のレベルを1上げる。'
  },
  {
    id: 'evasion_wand',
    name: '一時しのぎの杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [4, 6],
    effect: 'temp_escape',
    description: '敵を階段の上にワープさせ金縛りにする。'
  },
  {
    id: 'stumble_wand',
    name: '転ばぬ先の杖',
    spriteKey: 'item.wand',
    buyPrice: 500,
    sellPrice: 175,
    chargeRange: [3, 5],
    effect: 'stumble_guard',
    description: '持っているだけで転び罠を無効化する。'
  }
];

// 未識別時の仮名テーブル
export const WAND_FAKE_NAMES = [
  '杉の杖', '桜の杖', '竹の杖', '楓の杖',
  '柳の杖', '松の杖', '樫の杖', '梅の杖',
  '桐の杖', '栗の杖', '檜の杖', '椿の杖',
  '柊の杖', '榊の杖', '藤の杖'
];

/**
 * IDから杖データを取得
 */
export function getWandData(id) {
  return WAND_DATA.find(w => w.id === id);
}
