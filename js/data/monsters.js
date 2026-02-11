/**
 * monsters.js - 全モンスターデータ定義
 */

export const MONSTER_DATA = {
  // === ノーマル系 ===
  green_slime: {
    id: 'green_slime', name: '緑スライム', spriteKey: 'monster.green_slime',
    hp: 6, atk: 3, def: 2, exp: 2, minFloor: 1, maxFloor: 3,
    type: 'normal', abilities: []
  },
  blue_slime: {
    id: 'blue_slime', name: '青スライム', spriteKey: 'monster.blue_slime',
    hp: 15, atk: 8, def: 5, exp: 8, minFloor: 3, maxFloor: 6,
    type: 'normal', abilities: []
  },
  red_slime: {
    id: 'red_slime', name: '赤スライム', spriteKey: 'monster.red_slime',
    hp: 40, atk: 18, def: 12, exp: 30, minFloor: 7, maxFloor: 10,
    type: 'normal', abilities: []
  },
  rat: {
    id: 'rat', name: 'ネズミ小僧', spriteKey: 'monster.rat',
    hp: 8, atk: 5, def: 3, exp: 4, minFloor: 1, maxFloor: 4,
    type: 'normal', abilities: []
  },
  rat_boss: {
    id: 'rat_boss', name: 'ネズミ大将', spriteKey: 'monster.rat_boss',
    hp: 30, atk: 15, def: 10, exp: 20, minFloor: 5, maxFloor: 9,
    type: 'normal', abilities: []
  },
  rock_golem: {
    id: 'rock_golem', name: '岩ゴーレム', spriteKey: 'monster.rock_golem',
    hp: 50, atk: 20, def: 18, exp: 40, minFloor: 8, maxFloor: 12,
    type: 'normal', abilities: []
  },
  iron_golem: {
    id: 'iron_golem', name: '鉄ゴーレム', spriteKey: 'monster.iron_golem',
    hp: 80, atk: 35, def: 25, exp: 100, minFloor: 13, maxFloor: 17,
    type: 'normal', abilities: []
  },
  diamond_golem: {
    id: 'diamond_golem', name: 'ダイヤゴーレム', spriteKey: 'monster.diamond_golem',
    hp: 120, atk: 50, def: 35, exp: 250, minFloor: 17, maxFloor: 20,
    type: 'normal', abilities: []
  },

  // === 幽霊系 ===
  ghost: {
    id: 'ghost', name: '幽霊', spriteKey: 'monster.ghost',
    hp: 10, atk: 5, def: 0, exp: 5, minFloor: 2, maxFloor: 5,
    type: 'ghost', abilities: ['wall_pass']
  },
  vengeful_spirit: {
    id: 'vengeful_spirit', name: '怨霊', spriteKey: 'monster.vengeful_spirit',
    hp: 30, atk: 15, def: 0, exp: 25, minFloor: 6, maxFloor: 10,
    type: 'ghost', abilities: ['wall_pass']
  },
  ghost_warrior: {
    id: 'ghost_warrior', name: '亡霊武者', spriteKey: 'monster.ghost_warrior',
    hp: 25, atk: 12, def: 5, exp: 15, minFloor: 5, maxFloor: 9,
    type: 'ghost', abilities: ['possess_on_death']
  },
  evil_warrior: {
    id: 'evil_warrior', name: '悪霊武者', spriteKey: 'monster.evil_warrior',
    hp: 50, atk: 25, def: 10, exp: 60, minFloor: 10, maxFloor: 15,
    type: 'ghost', abilities: ['possess_on_death']
  },

  // === ドレイン系 ===
  vampire_bat: {
    id: 'vampire_bat', name: '吸血コウモリ', spriteKey: 'monster.vampire_bat',
    hp: 12, atk: 6, def: 3, exp: 6, minFloor: 2, maxFloor: 5,
    type: 'drain', abilities: ['drain_strength_1']
  },
  big_vampire_bat: {
    id: 'big_vampire_bat', name: '大吸血コウモリ', spriteKey: 'monster.big_vampire_bat',
    hp: 35, atk: 18, def: 8, exp: 35, minFloor: 7, maxFloor: 11,
    type: 'drain', abilities: ['drain_strength_2']
  },
  poison_scorpion: {
    id: 'poison_scorpion', name: '毒サソリ', spriteKey: 'monster.poison_scorpion',
    hp: 20, atk: 10, def: 5, exp: 12, minFloor: 4, maxFloor: 7,
    type: 'drain', abilities: ['drain_strength_1']
  },
  deadly_scorpion: {
    id: 'deadly_scorpion', name: '猛毒サソリ', spriteKey: 'monster.deadly_scorpion',
    hp: 55, atk: 25, def: 15, exp: 80, minFloor: 11, maxFloor: 15,
    type: 'drain', abilities: ['drain_strength_2']
  },
  exp_drainer: {
    id: 'exp_drainer', name: '経験吸い', spriteKey: 'monster.exp_drainer',
    hp: 20, atk: 8, def: 5, exp: 10, minFloor: 3, maxFloor: 6,
    type: 'drain', abilities: ['drain_level']
  },
  big_exp_drainer: {
    id: 'big_exp_drainer', name: '大経験吸い', spriteKey: 'monster.big_exp_drainer',
    hp: 45, atk: 20, def: 12, exp: 50, minFloor: 8, maxFloor: 12,
    type: 'drain', abilities: ['drain_level']
  },

  // === 竜系 ===
  small_dragon: {
    id: 'small_dragon', name: '小竜', spriteKey: 'monster.small_dragon',
    hp: 30, atk: 15, def: 10, exp: 20, minFloor: 5, maxFloor: 8,
    type: 'dragon', abilities: ['fire_breath_20']
  },
  fire_dragon: {
    id: 'fire_dragon', name: '火竜', spriteKey: 'monster.fire_dragon',
    hp: 60, atk: 30, def: 18, exp: 80, minFloor: 10, maxFloor: 14,
    type: 'dragon', abilities: ['fire_breath_30']
  },
  sky_dragon: {
    id: 'sky_dragon', name: '天竜', spriteKey: 'monster.sky_dragon',
    hp: 100, atk: 45, def: 25, exp: 200, minFloor: 15, maxFloor: 20,
    type: 'dragon', abilities: ['fire_breath_40']
  },

  // === 一つ目系 ===
  cyclops_kid: {
    id: 'cyclops_kid', name: '一つ目小僧', spriteKey: 'monster.cyclops_kid',
    hp: 15, atk: 8, def: 5, exp: 8, minFloor: 2, maxFloor: 5,
    type: 'cyclops', abilities: []
  },
  hypno_eye: {
    id: 'hypno_eye', name: '催眠目玉', spriteKey: 'monster.hypno_eye',
    hp: 25, atk: 12, def: 7, exp: 18, minFloor: 4, maxFloor: 8,
    type: 'cyclops', abilities: ['hypnosis_50']
  },
  evil_eye: {
    id: 'evil_eye', name: '邪眼目玉', spriteKey: 'monster.evil_eye',
    hp: 50, atk: 25, def: 14, exp: 60, minFloor: 9, maxFloor: 14,
    type: 'cyclops', abilities: ['hypnosis_50']
  },
  demon_eye: {
    id: 'demon_eye', name: '魔眼目玉', spriteKey: 'monster.demon_eye',
    hp: 80, atk: 40, def: 20, exp: 150, minFloor: 15, maxFloor: 20,
    type: 'cyclops', abilities: ['hypnosis_60']
  },

  // === 爆発系 ===
  bomb_urchin: {
    id: 'bomb_urchin', name: '爆弾ウニ', spriteKey: 'monster.bomb_urchin',
    hp: 20, atk: 10, def: 5, exp: 10, minFloor: 3, maxFloor: 6,
    type: 'bomb', abilities: ['explode_30']
  },
  big_bomb_urchin: {
    id: 'big_bomb_urchin', name: '大爆弾ウニ', spriteKey: 'monster.big_bomb_urchin',
    hp: 40, atk: 20, def: 12, exp: 40, minFloor: 8, maxFloor: 12,
    type: 'bomb', abilities: ['explode_50']
  },
  mine_urchin: {
    id: 'mine_urchin', name: '地雷ウニ', spriteKey: 'monster.mine_urchin',
    hp: 60, atk: 35, def: 18, exp: 100, minFloor: 14, maxFloor: 18,
    type: 'bomb', abilities: ['explode_fatal']
  },

  // === 特殊行動系 ===
  thief_tanuki: {
    id: 'thief_tanuki', name: 'こそ泥タヌキ', spriteKey: 'monster.thief_tanuki',
    hp: 15, atk: 5, def: 3, exp: 7, minFloor: 2, maxFloor: 5,
    type: 'special', abilities: ['steal_item']
  },
  big_thief_tanuki: {
    id: 'big_thief_tanuki', name: '大泥棒タヌキ', spriteKey: 'monster.big_thief_tanuki',
    hp: 35, atk: 15, def: 8, exp: 30, minFloor: 7, maxFloor: 11,
    type: 'special', abilities: ['steal_equip']
  },
  riceball_tanuki: {
    id: 'riceball_tanuki', name: 'おにぎり狸', spriteKey: 'monster.riceball_tanuki',
    hp: 20, atk: 10, def: 5, exp: 12, minFloor: 4, maxFloor: 7,
    type: 'special', abilities: ['riceball_transform']
  },
  rust_mold: {
    id: 'rust_mold', name: '錆カビ', spriteKey: 'monster.rust_mold',
    hp: 10, atk: 3, def: 2, exp: 4, minFloor: 3, maxFloor: 5,
    type: 'special', abilities: ['rust_shield_1']
  },
  big_rust_mold: {
    id: 'big_rust_mold', name: '大錆カビ', spriteKey: 'monster.big_rust_mold',
    hp: 25, atk: 8, def: 5, exp: 15, minFloor: 7, maxFloor: 10,
    type: 'special', abilities: ['rust_shield_2']
  },
  grass_frog: {
    id: 'grass_frog', name: '草投げ蛙', spriteKey: 'monster.grass_frog',
    hp: 15, atk: 6, def: 4, exp: 8, minFloor: 3, maxFloor: 6,
    type: 'special', abilities: ['throw_grass']
  },
  tank: {
    id: 'tank', name: '戦車', spriteKey: 'monster.tank',
    hp: 35, atk: 15, def: 10, exp: 25, minFloor: 6, maxFloor: 10,
    type: 'special', abilities: ['ranged_10']
  },
  heavy_tank: {
    id: 'heavy_tank', name: '重戦車', spriteKey: 'monster.heavy_tank',
    hp: 60, atk: 25, def: 18, exp: 70, minFloor: 11, maxFloor: 15,
    type: 'special', abilities: ['ranged_20']
  },
  super_tank: {
    id: 'super_tank', name: '超戦車', spriteKey: 'monster.super_tank',
    hp: 90, atk: 40, def: 25, exp: 150, minFloor: 16, maxFloor: 20,
    type: 'special', abilities: ['ranged_30']
  },
  split_slime: {
    id: 'split_slime', name: '分裂スライム', spriteKey: 'monster.split_slime',
    hp: 20, atk: 8, def: 4, exp: 5, minFloor: 5, maxFloor: 9,
    type: 'special', abilities: ['split_1']
  },
  big_split_slime: {
    id: 'big_split_slime', name: '大分裂スライム', spriteKey: 'monster.big_split_slime',
    hp: 45, atk: 20, def: 10, exp: 15, minFloor: 10, maxFloor: 15,
    type: 'special', abilities: ['split_2']
  },

  // === フロアボス ===
  gargoyle: {
    id: 'gargoyle', name: 'ガーゴイル', spriteKey: 'monster.gargoyle',
    hp: 80, atk: 20, def: 15, exp: 100, minFloor: 5, maxFloor: 5,
    type: 'boss', abilities: ['double_speed']
  },
  chimera: {
    id: 'chimera', name: 'キマイラ', spriteKey: 'monster.chimera',
    hp: 150, atk: 35, def: 20, exp: 300, minFloor: 10, maxFloor: 10,
    type: 'boss', abilities: ['fire_breath_30', 'drain_strength_1']
  },
  wyvern: {
    id: 'wyvern', name: 'ワイバーン', spriteKey: 'monster.wyvern',
    hp: 250, atk: 50, def: 30, exp: 700, minFloor: 15, maxFloor: 15,
    type: 'boss', abilities: ['fire_breath_40', 'double_speed']
  },
  demon_king: {
    id: 'demon_king', name: '魔王', spriteKey: 'monster.demon_king',
    hp: 500, atk: 70, def: 40, exp: 2000, minFloor: 20, maxFloor: 20,
    type: 'boss', abilities: ['aoe_30', 'summon']
  }
};

/**
 * 指定フロアで出現可能なモンスターIDリストを取得
 */
export function getSpawnableMonsters(floor) {
  return Object.values(MONSTER_DATA)
    .filter(m => floor >= m.minFloor && floor <= m.maxFloor && m.type !== 'boss')
    .map(m => m.id);
}

/**
 * モンスターIDからデータを取得
 */
export function getMonsterData(id) {
  return MONSTER_DATA[id];
}

/**
 * 指定フロアのボスを取得
 */
export function getFloorBoss(floor) {
  return Object.values(MONSTER_DATA)
    .find(m => m.type === 'boss' && m.minFloor === floor);
}
