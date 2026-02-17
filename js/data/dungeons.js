/**
 * dungeons.js - ダンジョン定義データ
 */

export const DUNGEON_DEFS = {
  dungeon_1: {
    id: 'dungeon_1',
    name: '霧幻の塔',
    maxFloor: 20,
    theme: 'stone',
    unlockCondition: null,
    bossFloors: { 5: 'gargoyle', 10: 'chimera', 15: 'wyvern', 20: 'demon_king' },
    specialRules: {},
    victoryMessage: '霧幻の塔を踏破した！おめでとう！',
    description: '霧に包まれた石造りの塔。冒険の始まりの場所。'
  },
  dungeon_2: {
    id: 'dungeon_2',
    name: '深緑の迷宮',
    maxFloor: 25,
    theme: 'forest',
    unlockCondition: 'dungeon_1',
    bossFloors: {
      5: 'boss_forest_5f',
      10: 'boss_forest_10f',
      15: 'boss_forest_15f',
      20: 'boss_forest_20f',
      25: 'boss_forest_25f'
    },
    specialRules: { plantAutoHeal: true },
    victoryMessage: '深緑の迷宮を踏破した！おめでとう！',
    description: '危険な植物と獣が棲む深い森の迷宮。'
  },
  dungeon_3: {
    id: 'dungeon_3',
    name: '海淵の洞窟',
    maxFloor: 25,
    theme: 'ocean',
    unlockCondition: 'dungeon_1',
    bossFloors: {
      5: 'boss_sea_5f',
      10: 'boss_sea_10f',
      15: 'boss_sea_15f',
      20: 'boss_sea_20f',
      25: 'boss_sea_25f'
    },
    specialRules: { waterCorridors: true, aquaticAtkBonus: 0.3 },
    victoryMessage: '海淵の洞窟を踏破した！おめでとう！',
    description: '海底に広がる洞窟。強力な海の魔物が待ち受ける。'
  }
};

/**
 * ダンジョン定義を取得
 */
export function getDungeonDef(id) {
  return DUNGEON_DEFS[id] || DUNGEON_DEFS.dungeon_1;
}

/**
 * ショップ在庫定義（アンロックレベル別）
 * 各エントリ: { id, category, price }
 * Level 1: 基本アイテム
 * Level 2: 中級アイテム（D1 10F到達）
 * Level 3: 遠距離武器・腕輪（D1踏破）
 * Level 4: 上級アイテム（D2またはD3踏破）
 * Level 5: レアアイテム（全ダンジョン踏破）
 */
export const SHOP_STOCK = {
  1: [
    { id: 'wooden_stick', category: 'WEAPON', price: 300 },
    { id: 'wooden_shield', category: 'SHIELD', price: 300 },
    { id: 'heal_grass', category: 'GRASS', price: 100 },
    { id: 'antidote_grass', category: 'GRASS', price: 120 },
    { id: 'riceball', category: 'FOOD', price: 100 },
    { id: 'big_riceball', category: 'FOOD', price: 200 },
    { id: 'wood_arrow', category: 'ARROW', price: 50 },
  ],
  2: [
    { id: 'copper_sword', category: 'WEAPON', price: 600 },
    { id: 'copper_shield', category: 'SHIELD', price: 600 },
    { id: 'power_seed', category: 'GRASS', price: 400 },
    { id: 'identify_scroll', category: 'SCROLL', price: 300 },
    { id: 'confusion_scroll', category: 'SCROLL', price: 250 },
    { id: 'iron_arrow', category: 'ARROW', price: 100 },
    { id: 'storage_pot', category: 'POT', price: 600 },
  ],
  3: [
    { id: 'iron_katana', category: 'WEAPON', price: 1000 },
    { id: 'iron_shield', category: 'SHIELD', price: 1000 },
    { id: 'short_bow', category: 'WEAPON', price: 800 },
    { id: 'bronze_spear', category: 'WEAPON', price: 900 },
    { id: 'strength_ring', category: 'RING', price: 3000 },
    { id: 'recovery_ring', category: 'RING', price: 2500 },
    { id: 'identify_pot', category: 'POT', price: 800 },
    { id: 'enhance_scroll', category: 'SCROLL', price: 1000 },
  ],
  4: [
    { id: 'steel_tachi', category: 'WEAPON', price: 3000 },
    { id: 'steel_shield', category: 'SHIELD', price: 3000 },
    { id: 'long_bow', category: 'WEAPON', price: 2500 },
    { id: 'iron_spear', category: 'WEAPON', price: 2000 },
    { id: 'vine_whip', category: 'WEAPON', price: 1800 },
    { id: 'trap_sight_ring', category: 'RING', price: 3000 },
    { id: 'clairvoyance_ring', category: 'RING', price: 3500 },
    { id: 'synthesis_pot', category: 'POT', price: 2000 },
    { id: 'silver_arrow', category: 'ARROW', price: 300 },
    { id: 'revival_grass', category: 'GRASS', price: 2000 },
  ],
  5: [
    { id: 'dragon_sword', category: 'WEAPON', price: 8000 },
    { id: 'legendary_shield', category: 'SHIELD', price: 8000 },
    { id: 'war_hammer', category: 'WEAPON', price: 5000 },
    { id: 'kamaitachi', category: 'WEAPON', price: 6000 },
    { id: 'wall_pass_ring', category: 'RING', price: 5000 },
    { id: 'golden_apple', category: 'FOOD', price: 3000 },
    { id: 'great_enhance_scroll', category: 'SCROLL', price: 3000 },
    { id: 'plating_scroll', category: 'SCROLL', price: 3000 },
  ]
};

/**
 * 指定レベルまでの全ショップ在庫を取得
 */
export function getShopStock(unlockLevel) {
  const stock = [];
  for (let level = 1; level <= unlockLevel; level++) {
    if (SHOP_STOCK[level]) {
      stock.push(...SHOP_STOCK[level]);
    }
  }
  return stock;
}
