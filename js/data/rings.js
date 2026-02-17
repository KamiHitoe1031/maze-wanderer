/**
 * rings.js - 腕輪データ定義
 */

export const RING_DATA = [
  {
    id: 'strength_ring',
    name: 'ちからの腕輪',
    spriteKey: 'item.ring.strength_ring',
    buyPrice: 5000,
    sellPrice: 1500,
    effect: 'strength',
    bonusAmount: 3,
    description: '装備中ちから+3。'
  },
  {
    id: 'clairvoyance_ring',
    name: '千里眼の腕輪',
    spriteKey: 'item.ring.clairvoyance_ring',
    buyPrice: 4000,
    sellPrice: 1200,
    effect: 'clairvoyance',
    bonusAmount: 0,
    description: 'フロアのモンスター位置が見える。'
  },
  {
    id: 'trap_sight_ring',
    name: 'ワナ見えの腕輪',
    spriteKey: 'item.ring.trap_sight_ring',
    buyPrice: 4000,
    sellPrice: 1200,
    effect: 'trap_sight',
    bonusAmount: 0,
    description: 'フロアの罠が見える。'
  },
  {
    id: 'far_throw_ring',
    name: '遠投の腕輪',
    spriteKey: 'item.ring.far_throw_ring',
    buyPrice: 3000,
    sellPrice: 900,
    effect: 'far_throw',
    bonusAmount: 0,
    description: '投げたアイテムが壁を貫通する。'
  },
  {
    id: 'recovery_ring',
    name: '回復の腕輪',
    spriteKey: 'item.ring.recovery_ring',
    buyPrice: 5000,
    sellPrice: 1500,
    effect: 'recovery',
    bonusAmount: 0,
    description: 'HP自然回復量が2倍。満腹度消費も2倍。'
  },
  {
    id: 'sleep_resist_ring',
    name: '眠りよけの腕輪',
    spriteKey: 'item.ring.sleep_resist_ring',
    buyPrice: 3500,
    sellPrice: 1050,
    effect: 'sleep_resist',
    bonusAmount: 0,
    description: '睡眠状態にならない。'
  },
  {
    id: 'confusion_resist_ring',
    name: '混乱よけの腕輪',
    spriteKey: 'item.ring.confusion_resist_ring',
    buyPrice: 3500,
    sellPrice: 1050,
    effect: 'confusion_resist',
    bonusAmount: 0,
    description: '混乱状態にならない。'
  },
  {
    id: 'curse_resist_ring',
    name: '呪いよけの腕輪',
    spriteKey: 'item.ring.curse_resist_ring',
    buyPrice: 4500,
    sellPrice: 1350,
    effect: 'curse_resist',
    bonusAmount: 0,
    description: 'アイテムが呪われなくなる。'
  },
  {
    id: 'wall_pass_ring',
    name: '壁抜けの腕輪',
    spriteKey: 'item.ring.wall_pass_ring',
    buyPrice: 10000,
    sellPrice: 3000,
    effect: 'wall_pass',
    bonusAmount: 0,
    description: '壁の中を移動できる。壁中は毎ターンHP-5。'
  },
  {
    id: 'curve_ring',
    name: '曲投げの腕輪',
    spriteKey: 'item.ring.curve_ring',
    buyPrice: 2000,
    sellPrice: 600,
    effect: 'curve',
    bonusAmount: 0,
    description: '投擲が壁に当たると曲がる。'
  },
  {
    id: 'swimmer_ring',
    name: '水グモの腕輪',
    spriteKey: 'item.ring.swimmer_ring',
    buyPrice: 3500,
    sellPrice: 1050,
    effect: 'swimmer',
    bonusAmount: 0,
    description: '水路の上を歩ける。'
  },
  {
    id: 'forest_ring',
    name: '森渡りの腕輪',
    spriteKey: 'item.ring.forest_ring',
    buyPrice: 3500,
    sellPrice: 1050,
    effect: 'forest',
    bonusAmount: 0,
    description: '深緑の迷宮で植物回復量が2倍。'
  }
];

// 未識別時の仮名テーブル
export const RING_FAKE_NAMES = [
  '金の腕輪', '銀の腕輪', '銅の腕輪', '鉄の腕輪',
  '木の腕輪', '石の腕輪', '骨の腕輪', 'ガラスの腕輪',
  '革の腕輪', '布の腕輪', '光る腕輪', '黒い腕輪',
  '白い腕輪', '錆びた腕輪'
];

/**
 * IDから腕輪データを取得
 */
export function getRingData(id) {
  return RING_DATA.find(r => r.id === id);
}
