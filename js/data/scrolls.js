/**
 * scrolls.js - 巻物データ定義
 */

export const SCROLL_DATA = [
  {
    id: 'farsight_scroll',
    name: '見通しの巻物',
    spriteKey: 'item.scroll',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'farsight',
    description: 'フロア全体の地形・敵・アイテムが見える。'
  },
  {
    id: 'identify_scroll',
    name: '鑑定の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'identify',
    description: '所持品1つを識別する。'
  },
  {
    id: 'identify_all_scroll',
    name: '全鑑定の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 1500,
    sellPrice: 525,
    effect: 'identify_all',
    description: '全所持品を識別する。'
  },
  {
    id: 'warp_scroll',
    name: 'ワープの巻物',
    spriteKey: 'item.scroll',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'warp',
    description: 'ランダムな場所にワープする。'
  },
  {
    id: 'confusion_scroll',
    name: '混乱の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'confuse_room',
    description: '部屋内の敵全員を混乱させる。'
  },
  {
    id: 'sleep_scroll',
    name: '睡眠の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'sleep_room',
    description: '部屋内の敵全員を睡眠させる。'
  },
  {
    id: 'vacuum_scroll',
    name: '真空切りの巻物',
    spriteKey: 'item.scroll',
    buyPrice: 800,
    sellPrice: 280,
    effect: 'vacuum_slash',
    damage: 30,
    description: '部屋内の敵全員に30ダメージ。'
  },
  {
    id: 'annihilation_scroll',
    name: '全滅の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 3000,
    sellPrice: 1050,
    effect: 'annihilate',
    description: 'フロア内の全敵消滅（経験値なし）。'
  },
  {
    id: 'enhance_scroll',
    name: '強化の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 1000,
    sellPrice: 350,
    effect: 'enhance',
    enhanceAmount: 1,
    description: '選んだ武器or盾の強化値+1。'
  },
  {
    id: 'great_enhance_scroll',
    name: '大強化の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 3000,
    sellPrice: 1050,
    effect: 'enhance',
    enhanceAmount: 3,
    description: '選んだ武器or盾の強化値+3。'
  },
  {
    id: 'plating_scroll',
    name: 'メッキの巻物',
    spriteKey: 'item.scroll',
    buyPrice: 1000,
    sellPrice: 350,
    effect: 'plating',
    description: '選んだ武器or盾に錆止め付与。'
  },
  {
    id: 'purify_scroll',
    name: 'おはらいの巻物',
    spriteKey: 'item.scroll',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'purify',
    description: '選んだアイテムの呪いを解除。'
  },
  {
    id: 'curse_scroll',
    name: '呪いの巻物',
    spriteKey: 'item.scroll',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'curse',
    description: 'ランダムに所持品が呪われる。'
  },
  {
    id: 'lost_scroll',
    name: '迷子の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 300,
    sellPrice: 105,
    effect: 'lost',
    description: 'フロアの地図記憶が消去される。'
  },
  {
    id: 'fire_scroll',
    name: '炎上の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 500,
    sellPrice: 175,
    effect: 'fire',
    description: '周囲8マスに爆発（HP1になる）。'
  },
  {
    id: 'sanctuary_scroll',
    name: '聖域の巻物',
    spriteKey: 'item.scroll',
    buyPrice: 1000,
    sellPrice: 350,
    effect: 'sanctuary',
    description: '床に置くとその上にいる間、敵の直接攻撃無効。'
  }
];

// 未識別用の仮名テーブル
export const SCROLL_FAKE_NAMES = [
  'はがねの巻物', 'あかがねの巻物', 'しろがねの巻物', 'くろがねの巻物',
  'もえる巻物', 'しずかな巻物', 'あやしい巻物', 'やわらかい巻物',
  'きらめく巻物', 'かたい巻物', 'ぬるぬる巻物', 'つるつる巻物',
  'ざらざら巻物', 'ふわふわ巻物', 'ねばねば巻物', 'どくどく巻物'
];

/**
 * IDから巻物データを取得
 */
export function getScrollData(id) {
  return SCROLL_DATA.find(s => s.id === id);
}
