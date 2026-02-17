/**
 * traps.js - 罠データ定義
 */

export const TRAP_DATA = {
  // === 共通罠（全ダンジョン） ===
  poison_arrow: {
    id: 'poison_arrow',
    name: '毒矢の罠',
    spriteKey: 'trap.poison_arrow',
    effect: 'poison_arrow',
    damage: 5,
    dungeonId: null, // null = 全ダンジョン
    minFloor: 1,
    description: '毒矢が飛んでくる。5ダメージ＋ちから-1。'
  },
  pitfall: {
    id: 'pitfall',
    name: '落とし穴',
    spriteKey: 'trap.pitfall',
    effect: 'pitfall',
    damage: 10,
    dungeonId: null,
    minFloor: 3,
    description: '落ちて10ダメージ。次のフロアに落ちる。'
  },
  landmine: {
    id: 'landmine',
    name: '地雷',
    spriteKey: 'trap.landmine',
    effect: 'landmine',
    damage: 30,
    dungeonId: null,
    minFloor: 5,
    description: '大爆発。周囲を巻き込む。'
  },
  sleep_trap: {
    id: 'sleep_trap',
    name: '睡眠の罠',
    spriteKey: 'trap.sleep',
    effect: 'sleep',
    duration: 5,
    dungeonId: null,
    minFloor: 2,
    description: '5ターン眠ってしまう。'
  },
  confusion_trap: {
    id: 'confusion_trap',
    name: '混乱の罠',
    spriteKey: 'trap.confusion',
    effect: 'confusion',
    duration: 10,
    dungeonId: null,
    minFloor: 3,
    description: '10ターン混乱してしまう。'
  },
  spin_trap: {
    id: 'spin_trap',
    name: '回転の罠',
    spriteKey: 'trap.spin',
    effect: 'spin',
    dungeonId: null,
    minFloor: 1,
    description: '向きがランダムに変わる。'
  },
  rust_trap: {
    id: 'rust_trap',
    name: '錆の罠',
    spriteKey: 'trap.rust',
    effect: 'rust',
    dungeonId: null,
    minFloor: 4,
    description: '装備中の盾の強化値-1。'
  },
  hunger_trap: {
    id: 'hunger_trap',
    name: '空腹の罠',
    spriteKey: 'trap.hunger',
    effect: 'hunger',
    amount: 30,
    dungeonId: null,
    minFloor: 3,
    description: '満腹度が30減る。'
  },
  warp_trap: {
    id: 'warp_trap',
    name: 'ワープの罠',
    spriteKey: 'trap.warp',
    effect: 'warp',
    dungeonId: null,
    minFloor: 2,
    description: 'ランダムな位置にワープする。'
  },
  monster_trap: {
    id: 'monster_trap',
    name: 'モンスターの罠',
    spriteKey: 'trap.monster',
    effect: 'summon_monsters',
    count: 3,
    dungeonId: null,
    minFloor: 5,
    description: '周囲にモンスターが出現する。'
  },

  // === 深緑の迷宮限定 ===
  vine_trap: {
    id: 'vine_trap',
    name: '蔦の罠',
    spriteKey: 'trap.vine',
    effect: 'immobilize',
    duration: 3,
    dungeonId: 'dungeon_2',
    minFloor: 1,
    description: '3ターン動けなくなる。'
  },
  spore_trap: {
    id: 'spore_trap',
    name: '胞子の罠',
    spriteKey: 'trap.spore',
    effect: 'spore',
    duration: 5,
    dungeonId: 'dungeon_2',
    minFloor: 3,
    description: '5ターン混乱＋ちから-1。'
  },

  // === 海淵の洞窟限定 ===
  whirlpool_trap: {
    id: 'whirlpool_trap',
    name: '渦潮の罠',
    spriteKey: 'trap.whirlpool',
    effect: 'whirlpool',
    damage: 15,
    dungeonId: 'dungeon_3',
    minFloor: 1,
    description: '渦に巻き込まれ15ダメージ＋ワープ。'
  },
  flood_trap: {
    id: 'flood_trap',
    name: '浸水の罠',
    spriteKey: 'trap.flood',
    effect: 'flood',
    dungeonId: 'dungeon_3',
    minFloor: 3,
    description: '持ち物の巻物が1枚濡れて使えなくなる。'
  }
};

/**
 * ダンジョンとフロアに応じた罠リストを取得
 */
export function getAvailableTraps(floor, dungeonId = 'dungeon_1') {
  return Object.values(TRAP_DATA).filter(t =>
    floor >= t.minFloor &&
    (t.dungeonId === null || t.dungeonId === dungeonId)
  );
}
