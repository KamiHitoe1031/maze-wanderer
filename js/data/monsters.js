/**
 * monsters.js - 全モンスターデータ定義
 */

export const MONSTER_DATA = {
  // ============================================================
  // === dungeon_1: 迷いの洞窟 (20 floors) =====================
  // ============================================================

  // === ノーマル系 ===
  green_slime: {
    id: 'green_slime', name: '緑スライム', spriteKey: 'monster.green_slime',
    hp: 6, atk: 3, def: 2, exp: 2, minFloor: 1, maxFloor: 3,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },
  blue_slime: {
    id: 'blue_slime', name: '青スライム', spriteKey: 'monster.blue_slime',
    hp: 15, atk: 8, def: 5, exp: 8, minFloor: 3, maxFloor: 6,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },
  red_slime: {
    id: 'red_slime', name: '赤スライム', spriteKey: 'monster.red_slime',
    hp: 40, atk: 18, def: 12, exp: 30, minFloor: 7, maxFloor: 10,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },
  rat: {
    id: 'rat', name: 'ネズミ小僧', spriteKey: 'monster.rat',
    hp: 8, atk: 5, def: 3, exp: 4, minFloor: 1, maxFloor: 4,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },
  rat_boss: {
    id: 'rat_boss', name: 'ネズミ大将', spriteKey: 'monster.rat_boss',
    hp: 30, atk: 15, def: 10, exp: 20, minFloor: 5, maxFloor: 9,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },
  rock_golem: {
    id: 'rock_golem', name: '岩ゴーレム', spriteKey: 'monster.rock_golem',
    hp: 50, atk: 20, def: 18, exp: 40, minFloor: 8, maxFloor: 12,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },
  iron_golem: {
    id: 'iron_golem', name: '鉄ゴーレム', spriteKey: 'monster.iron_golem',
    hp: 80, atk: 35, def: 25, exp: 100, minFloor: 13, maxFloor: 17,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },
  diamond_golem: {
    id: 'diamond_golem', name: 'ダイヤゴーレム', spriteKey: 'monster.diamond_golem',
    hp: 120, atk: 50, def: 35, exp: 250, minFloor: 17, maxFloor: 20,
    type: 'normal', abilities: [], dungeonId: 'dungeon_1'
  },

  // === 幽霊系 ===
  ghost: {
    id: 'ghost', name: '幽霊', spriteKey: 'monster.ghost',
    hp: 10, atk: 5, def: 0, exp: 5, minFloor: 2, maxFloor: 5,
    type: 'ghost', abilities: ['wall_pass'], dungeonId: 'dungeon_1'
  },
  vengeful_spirit: {
    id: 'vengeful_spirit', name: '怨霊', spriteKey: 'monster.vengeful_spirit',
    hp: 30, atk: 15, def: 0, exp: 25, minFloor: 6, maxFloor: 10,
    type: 'ghost', abilities: ['wall_pass'], dungeonId: 'dungeon_1'
  },
  ghost_warrior: {
    id: 'ghost_warrior', name: '亡霊武者', spriteKey: 'monster.ghost_warrior',
    hp: 25, atk: 12, def: 5, exp: 15, minFloor: 5, maxFloor: 9,
    type: 'ghost', abilities: ['possess_on_death'], dungeonId: 'dungeon_1'
  },
  evil_warrior: {
    id: 'evil_warrior', name: '悪霊武者', spriteKey: 'monster.evil_warrior',
    hp: 50, atk: 25, def: 10, exp: 60, minFloor: 10, maxFloor: 15,
    type: 'ghost', abilities: ['possess_on_death'], dungeonId: 'dungeon_1'
  },

  // === ドレイン系 ===
  vampire_bat: {
    id: 'vampire_bat', name: '吸血コウモリ', spriteKey: 'monster.vampire_bat',
    hp: 12, atk: 6, def: 3, exp: 6, minFloor: 2, maxFloor: 5,
    type: 'drain', abilities: ['drain_strength_1'], dungeonId: 'dungeon_1'
  },
  big_vampire_bat: {
    id: 'big_vampire_bat', name: '大吸血コウモリ', spriteKey: 'monster.big_vampire_bat',
    hp: 35, atk: 18, def: 8, exp: 35, minFloor: 7, maxFloor: 11,
    type: 'drain', abilities: ['drain_strength_2'], dungeonId: 'dungeon_1'
  },
  poison_scorpion: {
    id: 'poison_scorpion', name: '毒サソリ', spriteKey: 'monster.poison_scorpion',
    hp: 20, atk: 10, def: 5, exp: 12, minFloor: 4, maxFloor: 7,
    type: 'drain', abilities: ['drain_strength_1'], dungeonId: 'dungeon_1'
  },
  deadly_scorpion: {
    id: 'deadly_scorpion', name: '猛毒サソリ', spriteKey: 'monster.deadly_scorpion',
    hp: 55, atk: 25, def: 15, exp: 80, minFloor: 11, maxFloor: 15,
    type: 'drain', abilities: ['drain_strength_2'], dungeonId: 'dungeon_1'
  },
  exp_drainer: {
    id: 'exp_drainer', name: '経験吸い', spriteKey: 'monster.exp_drainer',
    hp: 20, atk: 8, def: 5, exp: 10, minFloor: 3, maxFloor: 6,
    type: 'drain', abilities: ['drain_level'], dungeonId: 'dungeon_1'
  },
  big_exp_drainer: {
    id: 'big_exp_drainer', name: '大経験吸い', spriteKey: 'monster.big_exp_drainer',
    hp: 45, atk: 20, def: 12, exp: 50, minFloor: 8, maxFloor: 12,
    type: 'drain', abilities: ['drain_level'], dungeonId: 'dungeon_1'
  },

  // === 竜系 ===
  small_dragon: {
    id: 'small_dragon', name: '小竜', spriteKey: 'monster.small_dragon',
    hp: 30, atk: 15, def: 10, exp: 20, minFloor: 5, maxFloor: 8,
    type: 'dragon', abilities: ['fire_breath_20'], dungeonId: 'dungeon_1'
  },
  fire_dragon: {
    id: 'fire_dragon', name: '火竜', spriteKey: 'monster.fire_dragon',
    hp: 60, atk: 30, def: 18, exp: 80, minFloor: 10, maxFloor: 14,
    type: 'dragon', abilities: ['fire_breath_30'], dungeonId: 'dungeon_1'
  },
  sky_dragon: {
    id: 'sky_dragon', name: '天竜', spriteKey: 'monster.sky_dragon',
    hp: 100, atk: 45, def: 25, exp: 200, minFloor: 15, maxFloor: 20,
    type: 'dragon', abilities: ['fire_breath_40'], dungeonId: 'dungeon_1'
  },

  // === 一つ目系 ===
  cyclops_kid: {
    id: 'cyclops_kid', name: '一つ目小僧', spriteKey: 'monster.cyclops_kid',
    hp: 15, atk: 8, def: 5, exp: 8, minFloor: 2, maxFloor: 5,
    type: 'cyclops', abilities: [], dungeonId: 'dungeon_1'
  },
  hypno_eye: {
    id: 'hypno_eye', name: '催眠目玉', spriteKey: 'monster.hypno_eye',
    hp: 25, atk: 12, def: 7, exp: 18, minFloor: 4, maxFloor: 8,
    type: 'cyclops', abilities: ['hypnosis_50'], dungeonId: 'dungeon_1'
  },
  evil_eye: {
    id: 'evil_eye', name: '邪眼目玉', spriteKey: 'monster.evil_eye',
    hp: 50, atk: 25, def: 14, exp: 60, minFloor: 9, maxFloor: 14,
    type: 'cyclops', abilities: ['hypnosis_50'], dungeonId: 'dungeon_1'
  },
  demon_eye: {
    id: 'demon_eye', name: '魔眼目玉', spriteKey: 'monster.demon_eye',
    hp: 80, atk: 40, def: 20, exp: 150, minFloor: 15, maxFloor: 20,
    type: 'cyclops', abilities: ['hypnosis_60'], dungeonId: 'dungeon_1'
  },

  // === 爆発系 ===
  bomb_urchin: {
    id: 'bomb_urchin', name: '爆弾ウニ', spriteKey: 'monster.bomb_urchin',
    hp: 20, atk: 10, def: 5, exp: 10, minFloor: 3, maxFloor: 6,
    type: 'bomb', abilities: ['explode_30'], dungeonId: 'dungeon_1'
  },
  big_bomb_urchin: {
    id: 'big_bomb_urchin', name: '大爆弾ウニ', spriteKey: 'monster.big_bomb_urchin',
    hp: 40, atk: 20, def: 12, exp: 40, minFloor: 8, maxFloor: 12,
    type: 'bomb', abilities: ['explode_50'], dungeonId: 'dungeon_1'
  },
  mine_urchin: {
    id: 'mine_urchin', name: '地雷ウニ', spriteKey: 'monster.mine_urchin',
    hp: 60, atk: 35, def: 18, exp: 100, minFloor: 14, maxFloor: 18,
    type: 'bomb', abilities: ['explode_fatal'], dungeonId: 'dungeon_1'
  },

  // === 特殊行動系 ===
  thief_tanuki: {
    id: 'thief_tanuki', name: 'こそ泥タヌキ', spriteKey: 'monster.thief_tanuki',
    hp: 15, atk: 5, def: 3, exp: 7, minFloor: 2, maxFloor: 5,
    type: 'special', abilities: ['steal_item'], dungeonId: 'dungeon_1'
  },
  big_thief_tanuki: {
    id: 'big_thief_tanuki', name: '大泥棒タヌキ', spriteKey: 'monster.big_thief_tanuki',
    hp: 35, atk: 15, def: 8, exp: 30, minFloor: 7, maxFloor: 11,
    type: 'special', abilities: ['steal_equip'], dungeonId: 'dungeon_1'
  },
  riceball_tanuki: {
    id: 'riceball_tanuki', name: 'おにぎり狸', spriteKey: 'monster.riceball_tanuki',
    hp: 20, atk: 10, def: 5, exp: 12, minFloor: 4, maxFloor: 7,
    type: 'special', abilities: ['riceball_transform'], dungeonId: 'dungeon_1'
  },
  rust_mold: {
    id: 'rust_mold', name: '錆カビ', spriteKey: 'monster.rust_mold',
    hp: 10, atk: 3, def: 2, exp: 4, minFloor: 3, maxFloor: 5,
    type: 'special', abilities: ['rust_shield_1'], dungeonId: 'dungeon_1'
  },
  big_rust_mold: {
    id: 'big_rust_mold', name: '大錆カビ', spriteKey: 'monster.big_rust_mold',
    hp: 25, atk: 8, def: 5, exp: 15, minFloor: 7, maxFloor: 10,
    type: 'special', abilities: ['rust_shield_2'], dungeonId: 'dungeon_1'
  },
  grass_frog: {
    id: 'grass_frog', name: '草投げ蛙', spriteKey: 'monster.grass_frog',
    hp: 15, atk: 6, def: 4, exp: 8, minFloor: 3, maxFloor: 6,
    type: 'special', abilities: ['throw_grass'], dungeonId: 'dungeon_1'
  },
  tank: {
    id: 'tank', name: '戦車', spriteKey: 'monster.tank',
    hp: 35, atk: 15, def: 10, exp: 25, minFloor: 6, maxFloor: 10,
    type: 'special', abilities: ['ranged_10'], dungeonId: 'dungeon_1'
  },
  heavy_tank: {
    id: 'heavy_tank', name: '重戦車', spriteKey: 'monster.heavy_tank',
    hp: 60, atk: 25, def: 18, exp: 70, minFloor: 11, maxFloor: 15,
    type: 'special', abilities: ['ranged_20'], dungeonId: 'dungeon_1'
  },
  super_tank: {
    id: 'super_tank', name: '超戦車', spriteKey: 'monster.super_tank',
    hp: 90, atk: 40, def: 25, exp: 150, minFloor: 16, maxFloor: 20,
    type: 'special', abilities: ['ranged_30'], dungeonId: 'dungeon_1'
  },
  split_slime: {
    id: 'split_slime', name: '分裂スライム', spriteKey: 'monster.split_slime',
    hp: 20, atk: 8, def: 4, exp: 5, minFloor: 5, maxFloor: 9,
    type: 'special', abilities: ['split_1'], dungeonId: 'dungeon_1'
  },
  big_split_slime: {
    id: 'big_split_slime', name: '大分裂スライム', spriteKey: 'monster.big_split_slime',
    hp: 45, atk: 20, def: 10, exp: 15, minFloor: 10, maxFloor: 15,
    type: 'special', abilities: ['split_2'], dungeonId: 'dungeon_1'
  },

  // === フロアボス (dungeon_1) ===
  gargoyle: {
    id: 'gargoyle', name: 'ガーゴイル', spriteKey: 'monster.gargoyle',
    hp: 80, atk: 20, def: 15, exp: 100, minFloor: 5, maxFloor: 5,
    type: 'boss', abilities: ['double_speed'], dungeonId: 'dungeon_1'
  },
  chimera: {
    id: 'chimera', name: 'キマイラ', spriteKey: 'monster.chimera',
    hp: 150, atk: 35, def: 20, exp: 300, minFloor: 10, maxFloor: 10,
    type: 'boss', abilities: ['fire_breath_30', 'drain_strength_1'], dungeonId: 'dungeon_1'
  },
  wyvern: {
    id: 'wyvern', name: 'ワイバーン', spriteKey: 'monster.wyvern',
    hp: 250, atk: 50, def: 30, exp: 700, minFloor: 15, maxFloor: 15,
    type: 'boss', abilities: ['fire_breath_40', 'double_speed'], dungeonId: 'dungeon_1'
  },
  demon_king: {
    id: 'demon_king', name: '魔王', spriteKey: 'monster.demon_king',
    hp: 500, atk: 70, def: 40, exp: 2000, minFloor: 20, maxFloor: 20,
    type: 'boss', abilities: ['aoe_30', 'summon'], dungeonId: 'dungeon_1'
  },

  // ============================================================
  // === dungeon_2: 深緑の迷宮 (25 floors) =====================
  // ============================================================

  // --- Weak (F1-7) ---
  tree_sprite: {
    id: 'tree_sprite', name: '木の精霊', spriteKey: 'monster.tree_sprite',
    hp: 8, atk: 4, def: 3, exp: 3, minFloor: 1, maxFloor: 4,
    type: 'plant', abilities: [], dungeonId: 'dungeon_2'
  },
  mushroom: {
    id: 'mushroom', name: '毒キノコ', spriteKey: 'monster.mushroom',
    hp: 10, atk: 5, def: 2, exp: 4, minFloor: 1, maxFloor: 5,
    type: 'plant', abilities: ['poison_30'], dungeonId: 'dungeon_2'
  },
  poison_ivy: {
    id: 'poison_ivy', name: '毒蔦', spriteKey: 'monster.poison_ivy',
    hp: 12, atk: 6, def: 3, exp: 5, minFloor: 2, maxFloor: 5,
    type: 'plant', abilities: ['vine_grab'], dungeonId: 'dungeon_2'
  },
  wild_boar: {
    id: 'wild_boar', name: '野猪', spriteKey: 'monster.wild_boar',
    hp: 16, atk: 8, def: 4, exp: 7, minFloor: 2, maxFloor: 6,
    type: 'beast', abilities: [], dungeonId: 'dungeon_2'
  },
  thorn_bug: {
    id: 'thorn_bug', name: '棘虫', spriteKey: 'monster.thorn_bug',
    hp: 14, atk: 7, def: 5, exp: 6, minFloor: 3, maxFloor: 7,
    type: 'insect', abilities: [], dungeonId: 'dungeon_2'
  },
  forest_bat: {
    id: 'forest_bat', name: '森コウモリ', spriteKey: 'monster.forest_bat',
    hp: 7, atk: 4, def: 2, exp: 3, minFloor: 1, maxFloor: 4,
    type: 'beast', abilities: [], dungeonId: 'dungeon_2'
  },

  // --- Mid (F6-14) ---
  dryad: {
    id: 'dryad', name: 'ドリアード', spriteKey: 'monster.dryad',
    hp: 28, atk: 12, def: 8, exp: 15, minFloor: 6, maxFloor: 10,
    type: 'plant', abilities: ['plant_heal'], dungeonId: 'dungeon_2'
  },
  vine_creeper: {
    id: 'vine_creeper', name: '蔦這い', spriteKey: 'monster.vine_creeper',
    hp: 32, atk: 14, def: 7, exp: 18, minFloor: 6, maxFloor: 11,
    type: 'plant', abilities: ['vine_grab'], dungeonId: 'dungeon_2'
  },
  giant_spider: {
    id: 'giant_spider', name: '大蜘蛛', spriteKey: 'monster.giant_spider',
    hp: 35, atk: 16, def: 9, exp: 22, minFloor: 7, maxFloor: 12,
    type: 'insect', abilities: ['poison_30'], dungeonId: 'dungeon_2'
  },
  forest_wolf: {
    id: 'forest_wolf', name: '森狼', spriteKey: 'monster.forest_wolf',
    hp: 38, atk: 18, def: 10, exp: 25, minFloor: 8, maxFloor: 13,
    type: 'beast', abilities: ['double_speed'], dungeonId: 'dungeon_2'
  },
  moss_golem: {
    id: 'moss_golem', name: '苔ゴーレム', spriteKey: 'monster.moss_golem',
    hp: 45, atk: 15, def: 14, exp: 28, minFloor: 8, maxFloor: 14,
    type: 'plant', abilities: ['self_heal'], dungeonId: 'dungeon_2'
  },
  hornet: {
    id: 'hornet', name: '大スズメバチ', spriteKey: 'monster.hornet',
    hp: 25, atk: 13, def: 6, exp: 16, minFloor: 6, maxFloor: 10,
    type: 'insect', abilities: ['poison_30'], dungeonId: 'dungeon_2'
  },

  // --- Strong (F12-20) ---
  ancient_treant: {
    id: 'ancient_treant', name: '古代樹人', spriteKey: 'monster.ancient_treant',
    hp: 65, atk: 24, def: 18, exp: 55, minFloor: 12, maxFloor: 17,
    type: 'plant', abilities: ['self_heal', 'vine_grab'], dungeonId: 'dungeon_2'
  },
  shadow_panther: {
    id: 'shadow_panther', name: '影豹', spriteKey: 'monster.shadow_panther',
    hp: 55, atk: 28, def: 14, exp: 60, minFloor: 12, maxFloor: 18,
    type: 'beast', abilities: ['double_speed'], dungeonId: 'dungeon_2'
  },
  forest_dragon: {
    id: 'forest_dragon', name: '森竜', spriteKey: 'monster.forest_dragon',
    hp: 75, atk: 32, def: 20, exp: 85, minFloor: 14, maxFloor: 19,
    type: 'dragon', abilities: ['fire_breath_30'], dungeonId: 'dungeon_2'
  },
  poison_bloom: {
    id: 'poison_bloom', name: '猛毒花', spriteKey: 'monster.poison_bloom',
    hp: 50, atk: 22, def: 15, exp: 50, minFloor: 12, maxFloor: 17,
    type: 'plant', abilities: ['spore_cloud', 'poison_30'], dungeonId: 'dungeon_2'
  },
  stone_bear: {
    id: 'stone_bear', name: '岩熊', spriteKey: 'monster.stone_bear',
    hp: 80, atk: 35, def: 22, exp: 90, minFloor: 14, maxFloor: 20,
    type: 'beast', abilities: [], dungeonId: 'dungeon_2'
  },
  bark_beetle: {
    id: 'bark_beetle', name: '樹皮甲虫', spriteKey: 'monster.bark_beetle',
    hp: 60, atk: 25, def: 20, exp: 45, minFloor: 13, maxFloor: 18,
    type: 'insect', abilities: [], dungeonId: 'dungeon_2'
  },

  // --- Very Strong (F18-25) ---
  elder_dryad: {
    id: 'elder_dryad', name: '長老ドリアード', spriteKey: 'monster.elder_dryad',
    hp: 110, atk: 48, def: 28, exp: 220, minFloor: 18, maxFloor: 23,
    type: 'plant', abilities: ['plant_heal', 'spore_cloud'], dungeonId: 'dungeon_2'
  },
  king_spider: {
    id: 'king_spider', name: '蜘蛛王', spriteKey: 'monster.king_spider',
    hp: 120, atk: 50, def: 30, exp: 250, minFloor: 19, maxFloor: 24,
    type: 'insect', abilities: ['poison_30', 'vine_grab'], dungeonId: 'dungeon_2'
  },
  forest_hydra: {
    id: 'forest_hydra', name: '森のヒュドラ', spriteKey: 'monster.forest_hydra',
    hp: 150, atk: 55, def: 32, exp: 350, minFloor: 20, maxFloor: 25,
    type: 'dragon', abilities: ['self_heal', 'fire_breath_30'], dungeonId: 'dungeon_2'
  },
  dark_wolf: {
    id: 'dark_wolf', name: '闇狼', spriteKey: 'monster.dark_wolf',
    hp: 130, atk: 52, def: 27, exp: 280, minFloor: 19, maxFloor: 24,
    type: 'beast', abilities: ['double_speed'], dungeonId: 'dungeon_2'
  },
  crystal_treant: {
    id: 'crystal_treant', name: '水晶樹人', spriteKey: 'monster.crystal_treant',
    hp: 160, atk: 58, def: 35, exp: 400, minFloor: 21, maxFloor: 25,
    type: 'plant', abilities: ['self_heal', 'vine_grab', 'spore_cloud'], dungeonId: 'dungeon_2'
  },
  dire_stag: {
    id: 'dire_stag', name: '魔鹿', spriteKey: 'monster.dire_stag',
    hp: 140, atk: 50, def: 30, exp: 300, minFloor: 20, maxFloor: 25,
    type: 'beast', abilities: [], dungeonId: 'dungeon_2'
  },

  // --- Forest Bosses ---
  boss_forest_5f: {
    id: 'boss_forest_5f', name: '巨大キノコ', spriteKey: 'monster.boss_forest_5f',
    hp: 90, atk: 22, def: 14, exp: 120, minFloor: 5, maxFloor: 5,
    type: 'boss', abilities: ['spore_cloud', 'poison_30'], dungeonId: 'dungeon_2'
  },
  boss_forest_10f: {
    id: 'boss_forest_10f', name: '女王蜘蛛', spriteKey: 'monster.boss_forest_10f',
    hp: 160, atk: 35, def: 20, exp: 350, minFloor: 10, maxFloor: 10,
    type: 'boss', abilities: ['poison_30', 'vine_grab', 'summon'], dungeonId: 'dungeon_2'
  },
  boss_forest_15f: {
    id: 'boss_forest_15f', name: '古代ドリアード', spriteKey: 'monster.boss_forest_15f',
    hp: 260, atk: 48, def: 28, exp: 750, minFloor: 15, maxFloor: 15,
    type: 'boss', abilities: ['plant_heal', 'spore_cloud', 'summon'], dungeonId: 'dungeon_2'
  },
  boss_forest_20f: {
    id: 'boss_forest_20f', name: '森のワイアーム', spriteKey: 'monster.boss_forest_20f',
    hp: 400, atk: 62, def: 35, exp: 1500, minFloor: 20, maxFloor: 20,
    type: 'boss', abilities: ['fire_breath_40', 'double_speed', 'self_heal'], dungeonId: 'dungeon_2'
  },
  boss_forest_25f: {
    id: 'boss_forest_25f', name: '翠緑王', spriteKey: 'monster.boss_forest_25f',
    hp: 600, atk: 80, def: 45, exp: 3000, minFloor: 25, maxFloor: 25,
    type: 'boss', abilities: ['aoe_30', 'summon', 'self_heal', 'spore_cloud'], dungeonId: 'dungeon_2'
  },

  // ============================================================
  // === dungeon_3: 海淵の洞窟 (25 floors) =====================
  // ============================================================

  // --- Weak (F1-7) ---
  hermit_crab: {
    id: 'hermit_crab', name: 'ヤドカリ', spriteKey: 'monster.hermit_crab',
    hp: 10, atk: 4, def: 4, exp: 3, minFloor: 1, maxFloor: 4,
    type: 'aquatic', abilities: ['shell_guard'], dungeonId: 'dungeon_3'
  },
  jellyfish: {
    id: 'jellyfish', name: 'クラゲ', spriteKey: 'monster.jellyfish',
    hp: 7, atk: 5, def: 2, exp: 3, minFloor: 1, maxFloor: 4,
    type: 'aquatic', abilities: ['poison_30'], dungeonId: 'dungeon_3'
  },
  sea_slug: {
    id: 'sea_slug', name: 'ウミウシ', spriteKey: 'monster.sea_slug',
    hp: 12, atk: 3, def: 3, exp: 4, minFloor: 1, maxFloor: 5,
    type: 'aquatic', abilities: [], dungeonId: 'dungeon_3'
  },
  sand_worm: {
    id: 'sand_worm', name: '砂蟲', spriteKey: 'monster.sand_worm',
    hp: 15, atk: 7, def: 3, exp: 6, minFloor: 2, maxFloor: 6,
    type: 'normal', abilities: [], dungeonId: 'dungeon_3'
  },
  coral_imp: {
    id: 'coral_imp', name: '珊瑚小鬼', spriteKey: 'monster.coral_imp',
    hp: 13, atk: 6, def: 4, exp: 5, minFloor: 2, maxFloor: 7,
    type: 'aquatic', abilities: [], dungeonId: 'dungeon_3'
  },
  sea_urchin: {
    id: 'sea_urchin', name: 'ウニ兵', spriteKey: 'monster.sea_urchin',
    hp: 9, atk: 5, def: 5, exp: 4, minFloor: 3, maxFloor: 7,
    type: 'aquatic', abilities: [], dungeonId: 'dungeon_3'
  },

  // --- Mid (F6-14) ---
  shark_man: {
    id: 'shark_man', name: '鮫人', spriteKey: 'monster.shark_man',
    hp: 30, atk: 15, def: 8, exp: 18, minFloor: 6, maxFloor: 11,
    type: 'aquatic', abilities: ['water_boost'], dungeonId: 'dungeon_3'
  },
  octopus: {
    id: 'octopus', name: '大蛸', spriteKey: 'monster.octopus',
    hp: 35, atk: 14, def: 9, exp: 20, minFloor: 6, maxFloor: 12,
    type: 'aquatic', abilities: ['pull_attack'], dungeonId: 'dungeon_3'
  },
  sea_horse: {
    id: 'sea_horse', name: '海馬', spriteKey: 'monster.sea_horse',
    hp: 28, atk: 12, def: 7, exp: 15, minFloor: 7, maxFloor: 11,
    type: 'aquatic', abilities: ['water_boost'], dungeonId: 'dungeon_3'
  },
  water_elemental: {
    id: 'water_elemental', name: '水精霊', spriteKey: 'monster.water_elemental',
    hp: 40, atk: 16, def: 10, exp: 25, minFloor: 8, maxFloor: 13,
    type: 'aquatic', abilities: ['water_breath_30'], dungeonId: 'dungeon_3'
  },
  electric_eel: {
    id: 'electric_eel', name: '電気ウナギ', spriteKey: 'monster.electric_eel',
    hp: 32, atk: 18, def: 7, exp: 22, minFloor: 7, maxFloor: 12,
    type: 'aquatic', abilities: ['ranged_10'], dungeonId: 'dungeon_3'
  },
  piranha: {
    id: 'piranha', name: 'ピラニア', spriteKey: 'monster.piranha',
    hp: 25, atk: 16, def: 6, exp: 16, minFloor: 6, maxFloor: 10,
    type: 'aquatic', abilities: [], dungeonId: 'dungeon_3'
  },

  // --- Strong (F12-20) ---
  deep_angler: {
    id: 'deep_angler', name: '深海アンコウ', spriteKey: 'monster.deep_angler',
    hp: 55, atk: 25, def: 15, exp: 50, minFloor: 12, maxFloor: 17,
    type: 'aquatic', abilities: ['pull_attack'], dungeonId: 'dungeon_3'
  },
  kraken_arm: {
    id: 'kraken_arm', name: 'クラーケンの腕', spriteKey: 'monster.kraken_arm',
    hp: 65, atk: 28, def: 16, exp: 65, minFloor: 13, maxFloor: 18,
    type: 'aquatic', abilities: ['pull_attack', 'vine_grab'], dungeonId: 'dungeon_3'
  },
  sea_serpent: {
    id: 'sea_serpent', name: '海蛇', spriteKey: 'monster.sea_serpent',
    hp: 70, atk: 30, def: 18, exp: 75, minFloor: 13, maxFloor: 19,
    type: 'aquatic', abilities: ['water_breath_30', 'poison_30'], dungeonId: 'dungeon_3'
  },
  tsunami_crab: {
    id: 'tsunami_crab', name: '津波蟹', spriteKey: 'monster.tsunami_crab',
    hp: 80, atk: 32, def: 22, exp: 85, minFloor: 14, maxFloor: 20,
    type: 'aquatic', abilities: ['shell_guard', 'water_boost'], dungeonId: 'dungeon_3'
  },
  coral_golem: {
    id: 'coral_golem', name: '珊瑚ゴーレム', spriteKey: 'monster.coral_golem',
    hp: 75, atk: 26, def: 24, exp: 70, minFloor: 14, maxFloor: 19,
    type: 'aquatic', abilities: ['self_heal'], dungeonId: 'dungeon_3'
  },
  siren: {
    id: 'siren', name: 'セイレーン', spriteKey: 'monster.siren',
    hp: 50, atk: 22, def: 13, exp: 55, minFloor: 12, maxFloor: 17,
    type: 'aquatic', abilities: ['hypnosis_50', 'curse_item'], dungeonId: 'dungeon_3'
  },

  // --- Very Strong (F18-25) ---
  abyssal_fish: {
    id: 'abyssal_fish', name: '深淵魚', spriteKey: 'monster.abyssal_fish',
    hp: 120, atk: 48, def: 26, exp: 230, minFloor: 18, maxFloor: 23,
    type: 'aquatic', abilities: ['pull_attack', 'water_boost'], dungeonId: 'dungeon_3'
  },
  leviathan_spawn: {
    id: 'leviathan_spawn', name: 'リヴァイアサンの子', spriteKey: 'monster.leviathan_spawn',
    hp: 150, atk: 55, def: 32, exp: 350, minFloor: 20, maxFloor: 25,
    type: 'aquatic', abilities: ['water_breath_30', 'double_speed'], dungeonId: 'dungeon_3'
  },
  sea_witch: {
    id: 'sea_witch', name: '海の魔女', spriteKey: 'monster.sea_witch',
    hp: 110, atk: 45, def: 25, exp: 240, minFloor: 18, maxFloor: 23,
    type: 'aquatic', abilities: ['curse_item', 'hypnosis_50'], dungeonId: 'dungeon_3'
  },
  storm_ray: {
    id: 'storm_ray', name: '嵐エイ', spriteKey: 'monster.storm_ray',
    hp: 130, atk: 52, def: 28, exp: 300, minFloor: 19, maxFloor: 24,
    type: 'aquatic', abilities: ['ranged_20', 'water_boost'], dungeonId: 'dungeon_3'
  },
  tidal_drake: {
    id: 'tidal_drake', name: '潮竜', spriteKey: 'monster.tidal_drake',
    hp: 160, atk: 60, def: 35, exp: 420, minFloor: 21, maxFloor: 25,
    type: 'dragon', abilities: ['water_breath_30', 'double_speed'], dungeonId: 'dungeon_3'
  },
  depth_lurker: {
    id: 'depth_lurker', name: '深海の潜伏者', spriteKey: 'monster.depth_lurker',
    hp: 140, atk: 50, def: 30, exp: 320, minFloor: 20, maxFloor: 25,
    type: 'aquatic', abilities: ['pull_attack'], dungeonId: 'dungeon_3'
  },

  // --- Ocean Bosses ---
  boss_sea_5f: {
    id: 'boss_sea_5f', name: '巨大蟹', spriteKey: 'monster.boss_sea_5f',
    hp: 95, atk: 20, def: 16, exp: 130, minFloor: 5, maxFloor: 5,
    type: 'boss', abilities: ['shell_guard', 'water_boost'], dungeonId: 'dungeon_3'
  },
  boss_sea_10f: {
    id: 'boss_sea_10f', name: 'クラーケン', spriteKey: 'monster.boss_sea_10f',
    hp: 170, atk: 38, def: 22, exp: 380, minFloor: 10, maxFloor: 10,
    type: 'boss', abilities: ['pull_attack', 'vine_grab', 'summon'], dungeonId: 'dungeon_3'
  },
  boss_sea_15f: {
    id: 'boss_sea_15f', name: '海竜', spriteKey: 'monster.boss_sea_15f',
    hp: 280, atk: 52, def: 30, exp: 800, minFloor: 15, maxFloor: 15,
    type: 'boss', abilities: ['water_breath_30', 'double_speed', 'aoe_30'], dungeonId: 'dungeon_3'
  },
  boss_sea_20f: {
    id: 'boss_sea_20f', name: '渦潮の主', spriteKey: 'monster.boss_sea_20f',
    hp: 420, atk: 65, def: 38, exp: 1600, minFloor: 20, maxFloor: 20,
    type: 'boss', abilities: ['aoe_30', 'pull_attack', 'water_boost', 'summon'], dungeonId: 'dungeon_3'
  },
  boss_sea_25f: {
    id: 'boss_sea_25f', name: '深淵王', spriteKey: 'monster.boss_sea_25f',
    hp: 650, atk: 85, def: 48, exp: 3500, minFloor: 25, maxFloor: 25,
    type: 'boss', abilities: ['aoe_30', 'summon', 'water_breath_30', 'curse_item'], dungeonId: 'dungeon_3'
  }
};

/**
 * 指定フロアで出現可能なモンスターIDリストを取得
 * @param {number} floor - フロア番号
 * @param {string} dungeonId - ダンジョンID (default: 'dungeon_1')
 */
export function getSpawnableMonsters(floor, dungeonId = 'dungeon_1') {
  return Object.values(MONSTER_DATA)
    .filter(m => m.dungeonId === dungeonId && floor >= m.minFloor && floor <= m.maxFloor && m.type !== 'boss')
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
 * @param {number} floor - フロア番号
 * @param {string} dungeonId - ダンジョンID (default: 'dungeon_1')
 */
export function getFloorBoss(floor, dungeonId = 'dungeon_1') {
  return Object.values(MONSTER_DATA)
    .find(m => m.dungeonId === dungeonId && m.type === 'boss' && m.minFloor === floor);
}
