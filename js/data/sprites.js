/**
 * sprites.js - 全スプライト定義（画像パス＋フォールバック記号・色）
 */

export const SPRITE_DEFS = {
  // --- タイル ---
  'tile.wall':        { imagePath: 'assets/tiles/wall.png',      fallbackChar: '#', fallbackColor: '#8B8682', fallbackBg: '#3B3530' },
  'tile.floor':       { imagePath: 'assets/tiles/floor.png',     fallbackChar: '·', fallbackColor: '#6B6560', fallbackBg: '#1A1815' },
  'tile.corridor':    { imagePath: 'assets/tiles/corridor.png',  fallbackChar: '·', fallbackColor: '#8A8580', fallbackBg: '#2A2520' },
  'tile.stairs':      { imagePath: 'assets/tiles/stairs.png',    fallbackChar: '>', fallbackColor: '#FFD700', fallbackBg: '#1A1815' },
  'tile.water':       { imagePath: 'assets/tiles/water.png',     fallbackChar: '~', fallbackColor: '#4488CC', fallbackBg: '#112244' },
  'tile.shop':        { imagePath: 'assets/tiles/shop.png',      fallbackChar: '$', fallbackColor: '#FFD700', fallbackBg: '#2A2520' },
  'tile.unexplored':  { imagePath: null,                         fallbackChar: ' ', fallbackColor: '#000000', fallbackBg: '#000000' },

  // --- 森テーマタイル ---
  'tile.forest.wall':     { imagePath: 'assets/tiles/forest_wall.png',     fallbackChar: '#', fallbackColor: '#2D5A1E', fallbackBg: '#1A3310' },
  'tile.forest.floor':    { imagePath: 'assets/tiles/forest_floor.png',    fallbackChar: '·', fallbackColor: '#4A7A3A', fallbackBg: '#1E2B15' },
  'tile.forest.corridor': { imagePath: 'assets/tiles/forest_corridor.png', fallbackChar: '·', fallbackColor: '#3A6A2A', fallbackBg: '#152210' },
  'tile.forest.water':    { imagePath: 'assets/tiles/forest_water.png',    fallbackChar: '~', fallbackColor: '#33AA66', fallbackBg: '#0A2215' },

  // --- 海テーマタイル ---
  'tile.ocean.wall':     { imagePath: 'assets/tiles/ocean_wall.png',     fallbackChar: '#', fallbackColor: '#3A5577', fallbackBg: '#1A2A44' },
  'tile.ocean.floor':    { imagePath: 'assets/tiles/ocean_floor.png',    fallbackChar: '·', fallbackColor: '#5577AA', fallbackBg: '#151E2B' },
  'tile.ocean.corridor': { imagePath: 'assets/tiles/ocean_corridor.png', fallbackChar: '·', fallbackColor: '#4466AA', fallbackBg: '#101A28' },
  'tile.ocean.water':    { imagePath: 'assets/tiles/ocean_water.png',    fallbackChar: '~', fallbackColor: '#3399DD', fallbackBg: '#0A1533' },

  // --- 町タイル ---
  'tile.town.grass':  { imagePath: 'assets/tiles/town_grass.png',  fallbackChar: '.', fallbackColor: '#3A7A2A', fallbackBg: '#1A3A10' },
  'tile.town.path':   { imagePath: 'assets/tiles/town_path.png',   fallbackChar: '·', fallbackColor: '#AA9977', fallbackBg: '#554433' },
  'tile.town.water':  { imagePath: 'assets/tiles/town_water.png',  fallbackChar: '~', fallbackColor: '#4499DD', fallbackBg: '#112244' },
  'tile.town.tree':   { imagePath: 'assets/tiles/town_tree.png',   fallbackChar: '♣', fallbackColor: '#228833', fallbackBg: '#1A3A10' },
  'tile.town.wall':   { imagePath: 'assets/tiles/town_wall.png',   fallbackChar: '#', fallbackColor: '#887766', fallbackBg: '#443322' },
  'tile.town.roof':   { imagePath: 'assets/tiles/town_roof.png',   fallbackChar: '▲', fallbackColor: '#AA5533', fallbackBg: '#663322' },
  'tile.town.fence':  { imagePath: 'assets/tiles/town_fence.png',  fallbackChar: '=', fallbackColor: '#AA8855', fallbackBg: '#1A3A10' },
  'tile.town.flower': { imagePath: 'assets/tiles/town_flower.png', fallbackChar: '*', fallbackColor: '#FF88AA', fallbackBg: '#1A3A10' },

  // --- キャラクター ---
  'char.player':           { imagePath: 'assets/characters/player.png',           fallbackChar: '@', fallbackColor: '#00FF88', fallbackBg: null },
  'char.shopkeeper':       { imagePath: 'assets/characters/shopkeeper.png',       fallbackChar: 'S', fallbackColor: '#FFD700', fallbackBg: null },
  'char.warehouse_keeper': { imagePath: 'assets/characters/warehouse_keeper.png', fallbackChar: 'W', fallbackColor: '#88AAFF', fallbackBg: null },
  'char.dungeon_guide':    { imagePath: 'assets/characters/dungeon_guide.png',    fallbackChar: 'G', fallbackColor: '#FF8844', fallbackBg: null },

  // --- ノーマル系モンスター ---
  'monster.green_slime':   { imagePath: 'assets/monsters/green_slime.png',   fallbackChar: 's', fallbackColor: '#44FF44' },
  'monster.blue_slime':    { imagePath: 'assets/monsters/blue_slime.png',    fallbackChar: 's', fallbackColor: '#4488FF' },
  'monster.red_slime':     { imagePath: 'assets/monsters/red_slime.png',     fallbackChar: 'S', fallbackColor: '#FF4444' },
  'monster.rat':           { imagePath: 'assets/monsters/rat.png',           fallbackChar: 'r', fallbackColor: '#AA8855' },
  'monster.rat_boss':      { imagePath: 'assets/monsters/rat_boss.png',      fallbackChar: 'R', fallbackColor: '#CC6633' },
  'monster.rock_golem':    { imagePath: 'assets/monsters/rock_golem.png',    fallbackChar: 'G', fallbackColor: '#888888' },
  'monster.iron_golem':    { imagePath: 'assets/monsters/iron_golem.png',    fallbackChar: 'G', fallbackColor: '#AAAACC' },
  'monster.diamond_golem': { imagePath: 'assets/monsters/diamond_golem.png', fallbackChar: 'G', fallbackColor: '#88FFFF' },

  // --- 幽霊系 ---
  'monster.ghost':           { imagePath: 'assets/monsters/ghost.png',           fallbackChar: 'g', fallbackColor: '#CC88FF' },
  'monster.vengeful_spirit': { imagePath: 'assets/monsters/vengeful_spirit.png', fallbackChar: 'g', fallbackColor: '#AA44DD' },
  'monster.ghost_warrior':   { imagePath: 'assets/monsters/ghost_warrior.png',   fallbackChar: 'W', fallbackColor: '#8866CC' },
  'monster.evil_warrior':    { imagePath: 'assets/monsters/evil_warrior.png',    fallbackChar: 'W', fallbackColor: '#6644AA' },

  // --- ドレイン系 ---
  'monster.vampire_bat':     { imagePath: 'assets/monsters/vampire_bat.png',     fallbackChar: 'b', fallbackColor: '#8844AA' },
  'monster.big_vampire_bat': { imagePath: 'assets/monsters/big_vampire_bat.png', fallbackChar: 'B', fallbackColor: '#6622AA' },
  'monster.poison_scorpion': { imagePath: 'assets/monsters/poison_scorpion.png', fallbackChar: 'p', fallbackColor: '#AA44CC' },
  'monster.deadly_scorpion': { imagePath: 'assets/monsters/deadly_scorpion.png', fallbackChar: 'P', fallbackColor: '#882288' },
  'monster.exp_drainer':     { imagePath: 'assets/monsters/exp_drainer.png',     fallbackChar: 'e', fallbackColor: '#DD88AA' },
  'monster.big_exp_drainer': { imagePath: 'assets/monsters/big_exp_drainer.png', fallbackChar: 'E', fallbackColor: '#CC4488' },

  // --- 竜系 ---
  'monster.small_dragon': { imagePath: 'assets/monsters/small_dragon.png', fallbackChar: 'd', fallbackColor: '#FF8844' },
  'monster.fire_dragon':  { imagePath: 'assets/monsters/fire_dragon.png',  fallbackChar: 'D', fallbackColor: '#FF4422' },
  'monster.sky_dragon':   { imagePath: 'assets/monsters/sky_dragon.png',   fallbackChar: 'D', fallbackColor: '#88CCFF' },

  // --- 一つ目系 ---
  'monster.cyclops_kid': { imagePath: 'assets/monsters/cyclops_kid.png', fallbackChar: 'o', fallbackColor: '#CCAA44' },
  'monster.hypno_eye':   { imagePath: 'assets/monsters/hypno_eye.png',   fallbackChar: 'O', fallbackColor: '#FFDD44' },
  'monster.evil_eye':    { imagePath: 'assets/monsters/evil_eye.png',    fallbackChar: 'O', fallbackColor: '#FF8844' },
  'monster.demon_eye':   { imagePath: 'assets/monsters/demon_eye.png',   fallbackChar: 'O', fallbackColor: '#FF4444' },

  // --- 爆発系 ---
  'monster.bomb_urchin':     { imagePath: 'assets/monsters/bomb_urchin.png',     fallbackChar: 'u', fallbackColor: '#FF8800' },
  'monster.big_bomb_urchin': { imagePath: 'assets/monsters/big_bomb_urchin.png', fallbackChar: 'U', fallbackColor: '#FF6600' },
  'monster.mine_urchin':     { imagePath: 'assets/monsters/mine_urchin.png',     fallbackChar: 'U', fallbackColor: '#FF0000' },

  // --- 特殊行動系 ---
  'monster.thief_tanuki':     { imagePath: 'assets/monsters/thief_tanuki.png',     fallbackChar: 't', fallbackColor: '#88AA44' },
  'monster.big_thief_tanuki': { imagePath: 'assets/monsters/big_thief_tanuki.png', fallbackChar: 'T', fallbackColor: '#668822' },
  'monster.riceball_tanuki':  { imagePath: 'assets/monsters/riceball_tanuki.png',  fallbackChar: 't', fallbackColor: '#CCAA66' },
  'monster.rust_mold':        { imagePath: 'assets/monsters/rust_mold.png',        fallbackChar: 'c', fallbackColor: '#886644' },
  'monster.big_rust_mold':    { imagePath: 'assets/monsters/big_rust_mold.png',    fallbackChar: 'C', fallbackColor: '#664422' },
  'monster.grass_frog':       { imagePath: 'assets/monsters/grass_frog.png',       fallbackChar: 'f', fallbackColor: '#44CC44' },
  'monster.tank':             { imagePath: 'assets/monsters/tank.png',             fallbackChar: 'k', fallbackColor: '#AAAAAA' },
  'monster.heavy_tank':       { imagePath: 'assets/monsters/heavy_tank.png',       fallbackChar: 'K', fallbackColor: '#888888' },
  'monster.super_tank':       { imagePath: 'assets/monsters/super_tank.png',       fallbackChar: 'K', fallbackColor: '#CC4444' },
  'monster.split_slime':      { imagePath: 'assets/monsters/split_slime.png',      fallbackChar: 'x', fallbackColor: '#88FF88' },
  'monster.big_split_slime':  { imagePath: 'assets/monsters/big_split_slime.png',  fallbackChar: 'X', fallbackColor: '#44CC44' },

  // --- フロアボス ---
  'monster.gargoyle':    { imagePath: 'assets/monsters/gargoyle.png',    fallbackChar: 'V', fallbackColor: '#AA88CC' },
  'monster.chimera':     { imagePath: 'assets/monsters/chimera.png',     fallbackChar: 'H', fallbackColor: '#FF8844' },
  'monster.wyvern':      { imagePath: 'assets/monsters/wyvern.png',      fallbackChar: 'Y', fallbackColor: '#44AAFF' },
  'monster.demon_king':  { imagePath: 'assets/monsters/demon_king.png',  fallbackChar: 'M', fallbackColor: '#FF0000' },

  // --- dungeon_2: 深緑の迷宮モンスター ---
  // Weak (F1-7)
  'monster.tree_sprite':    { imagePath: 'assets/monsters/tree_sprite.png',    fallbackChar: 't', fallbackColor: '#44AA44' },
  'monster.mushroom':       { imagePath: 'assets/monsters/mushroom.png',       fallbackChar: 'm', fallbackColor: '#AA6644' },
  'monster.poison_ivy':     { imagePath: 'assets/monsters/poison_ivy.png',     fallbackChar: 'i', fallbackColor: '#66CC44' },
  'monster.wild_boar':      { imagePath: 'assets/monsters/wild_boar.png',      fallbackChar: 'w', fallbackColor: '#886644' },
  'monster.thorn_bug':      { imagePath: 'assets/monsters/thorn_bug.png',      fallbackChar: 'n', fallbackColor: '#778844' },
  'monster.forest_bat':     { imagePath: 'assets/monsters/forest_bat.png',     fallbackChar: 'b', fallbackColor: '#447744' },
  // Mid (F6-14)
  'monster.dryad':          { imagePath: 'assets/monsters/dryad.png',          fallbackChar: 'd', fallbackColor: '#55BB55' },
  'monster.vine_creeper':   { imagePath: 'assets/monsters/vine_creeper.png',   fallbackChar: 'v', fallbackColor: '#338833' },
  'monster.giant_spider':   { imagePath: 'assets/monsters/giant_spider.png',   fallbackChar: 'j', fallbackColor: '#665544' },
  'monster.forest_wolf':    { imagePath: 'assets/monsters/forest_wolf.png',    fallbackChar: 'w', fallbackColor: '#667755' },
  'monster.moss_golem':     { imagePath: 'assets/monsters/moss_golem.png',     fallbackChar: 'g', fallbackColor: '#448844' },
  'monster.hornet':         { imagePath: 'assets/monsters/hornet.png',         fallbackChar: 'h', fallbackColor: '#CCAA22' },
  // Strong (F12-20)
  'monster.ancient_treant': { imagePath: 'assets/monsters/ancient_treant.png', fallbackChar: 'A', fallbackColor: '#336622' },
  'monster.shadow_panther': { imagePath: 'assets/monsters/shadow_panther.png', fallbackChar: 'p', fallbackColor: '#445533' },
  'monster.forest_dragon':  { imagePath: 'assets/monsters/forest_dragon.png',  fallbackChar: 'D', fallbackColor: '#44CC44' },
  'monster.poison_bloom':   { imagePath: 'assets/monsters/poison_bloom.png',   fallbackChar: 'l', fallbackColor: '#CC44CC' },
  'monster.stone_bear':     { imagePath: 'assets/monsters/stone_bear.png',     fallbackChar: 'a', fallbackColor: '#997755' },
  'monster.bark_beetle':    { imagePath: 'assets/monsters/bark_beetle.png',    fallbackChar: 'q', fallbackColor: '#776644' },
  // Very Strong (F18-25)
  'monster.elder_dryad':    { imagePath: 'assets/monsters/elder_dryad.png',    fallbackChar: 'E', fallbackColor: '#44DD44' },
  'monster.king_spider':    { imagePath: 'assets/monsters/king_spider.png',    fallbackChar: 'J', fallbackColor: '#553322' },
  'monster.forest_hydra':   { imagePath: 'assets/monsters/forest_hydra.png',   fallbackChar: 'Z', fallbackColor: '#33AA33' },
  'monster.dark_wolf':      { imagePath: 'assets/monsters/dark_wolf.png',      fallbackChar: 'W', fallbackColor: '#334433' },
  'monster.crystal_treant': { imagePath: 'assets/monsters/crystal_treant.png', fallbackChar: 'T', fallbackColor: '#88FFAA' },
  'monster.dire_stag':      { imagePath: 'assets/monsters/dire_stag.png',      fallbackChar: 'N', fallbackColor: '#BBAA66' },
  // Forest Bosses
  'monster.boss_forest_5f':  { imagePath: 'assets/monsters/boss_forest_5f.png',  fallbackChar: 'F', fallbackColor: '#DD8844' },
  'monster.boss_forest_10f': { imagePath: 'assets/monsters/boss_forest_10f.png', fallbackChar: 'Q', fallbackColor: '#AA3366' },
  'monster.boss_forest_15f': { imagePath: 'assets/monsters/boss_forest_15f.png', fallbackChar: 'L', fallbackColor: '#44FF88' },
  'monster.boss_forest_20f': { imagePath: 'assets/monsters/boss_forest_20f.png', fallbackChar: 'I', fallbackColor: '#66DD66' },
  'monster.boss_forest_25f': { imagePath: 'assets/monsters/boss_forest_25f.png', fallbackChar: 'R', fallbackColor: '#00FF44' },

  // --- dungeon_3: 海淵の洞窟モンスター ---
  // Weak (F1-7)
  'monster.hermit_crab':    { imagePath: 'assets/monsters/hermit_crab.png',    fallbackChar: 'h', fallbackColor: '#CC8866' },
  'monster.jellyfish':      { imagePath: 'assets/monsters/jellyfish.png',      fallbackChar: 'j', fallbackColor: '#88CCEE' },
  'monster.sea_slug':       { imagePath: 'assets/monsters/sea_slug.png',       fallbackChar: 'l', fallbackColor: '#66AAAA' },
  'monster.sand_worm':      { imagePath: 'assets/monsters/sand_worm.png',      fallbackChar: 'w', fallbackColor: '#CCAA66' },
  'monster.coral_imp':      { imagePath: 'assets/monsters/coral_imp.png',      fallbackChar: 'i', fallbackColor: '#FF8888' },
  'monster.sea_urchin':     { imagePath: 'assets/monsters/sea_urchin.png',     fallbackChar: 'u', fallbackColor: '#6688AA' },
  // Mid (F6-14)
  'monster.shark_man':      { imagePath: 'assets/monsters/shark_man.png',      fallbackChar: 's', fallbackColor: '#4488AA' },
  'monster.octopus':        { imagePath: 'assets/monsters/octopus.png',        fallbackChar: 'o', fallbackColor: '#CC4466' },
  'monster.sea_horse':      { imagePath: 'assets/monsters/sea_horse.png',      fallbackChar: 'e', fallbackColor: '#44AACC' },
  'monster.water_elemental': { imagePath: 'assets/monsters/water_elemental.png', fallbackChar: 'a', fallbackColor: '#44BBFF' },
  'monster.electric_eel':   { imagePath: 'assets/monsters/electric_eel.png',   fallbackChar: 'z', fallbackColor: '#FFEE44' },
  'monster.piranha':        { imagePath: 'assets/monsters/piranha.png',        fallbackChar: 'p', fallbackColor: '#4466AA' },
  // Strong (F12-20)
  'monster.deep_angler':    { imagePath: 'assets/monsters/deep_angler.png',    fallbackChar: 'd', fallbackColor: '#224466' },
  'monster.kraken_arm':     { imagePath: 'assets/monsters/kraken_arm.png',     fallbackChar: 'k', fallbackColor: '#446688' },
  'monster.sea_serpent':    { imagePath: 'assets/monsters/sea_serpent.png',     fallbackChar: 'n', fallbackColor: '#3388AA' },
  'monster.tsunami_crab':   { imagePath: 'assets/monsters/tsunami_crab.png',   fallbackChar: 'c', fallbackColor: '#2266CC' },
  'monster.coral_golem':    { imagePath: 'assets/monsters/coral_golem.png',    fallbackChar: 'g', fallbackColor: '#FF6677' },
  'monster.siren':          { imagePath: 'assets/monsters/siren.png',          fallbackChar: 'r', fallbackColor: '#66CCDD' },
  // Very Strong (F18-25)
  'monster.abyssal_fish':   { imagePath: 'assets/monsters/abyssal_fish.png',   fallbackChar: 'A', fallbackColor: '#223355' },
  'monster.leviathan_spawn': { imagePath: 'assets/monsters/leviathan_spawn.png', fallbackChar: 'L', fallbackColor: '#2244CC' },
  'monster.sea_witch':      { imagePath: 'assets/monsters/sea_witch.png',      fallbackChar: 'W', fallbackColor: '#8844CC' },
  'monster.storm_ray':      { imagePath: 'assets/monsters/storm_ray.png',      fallbackChar: 'R', fallbackColor: '#44AAEE' },
  'monster.tidal_drake':    { imagePath: 'assets/monsters/tidal_drake.png',    fallbackChar: 'D', fallbackColor: '#2288DD' },
  'monster.depth_lurker':   { imagePath: 'assets/monsters/depth_lurker.png',   fallbackChar: 'X', fallbackColor: '#112244' },
  // Ocean Bosses
  'monster.boss_sea_5f':    { imagePath: 'assets/monsters/boss_sea_5f.png',    fallbackChar: 'C', fallbackColor: '#FF4444' },
  'monster.boss_sea_10f':   { imagePath: 'assets/monsters/boss_sea_10f.png',   fallbackChar: 'K', fallbackColor: '#2266AA' },
  'monster.boss_sea_15f':   { imagePath: 'assets/monsters/boss_sea_15f.png',   fallbackChar: 'S', fallbackColor: '#44CCFF' },
  'monster.boss_sea_20f':   { imagePath: 'assets/monsters/boss_sea_20f.png',   fallbackChar: 'V', fallbackColor: '#0088FF' },
  'monster.boss_sea_25f':   { imagePath: 'assets/monsters/boss_sea_25f.png',   fallbackChar: 'Z', fallbackColor: '#0044DD' },

  // --- アイテム（カテゴリ共通） ---
  'item.weapon':              { imagePath: 'assets/items/weapon.png',       fallbackChar: ')', fallbackColor: '#CCCCCC' },
  'item.shield':              { imagePath: 'assets/items/shield.png',       fallbackChar: '[', fallbackColor: '#88AAFF' },
  'item.grass':               { imagePath: 'assets/items/grass.png',        fallbackChar: '"', fallbackColor: '#44DD44' },
  'item.scroll':              { imagePath: 'assets/items/scroll.png',       fallbackChar: '?', fallbackColor: '#FFFFAA' },
  'item.wand':                { imagePath: 'assets/items/wand.png',         fallbackChar: '/', fallbackColor: '#CC88FF' },
  'item.pot':                 { imagePath: 'assets/items/pot.png',          fallbackChar: '{', fallbackColor: '#DD8844' },
  'item.arrow':               { imagePath: 'assets/items/arrow.png',        fallbackChar: '-', fallbackColor: '#CCAA77' },
  'item.food':                { imagePath: 'assets/items/food.png',         fallbackChar: '%', fallbackColor: '#FFAA44' },
  'item.ring':                { imagePath: 'assets/items/ring.png',         fallbackChar: '=', fallbackColor: '#FFDD00' },
  'item.gold':                { imagePath: 'assets/items/gold.png',         fallbackChar: '$', fallbackColor: '#FFD700' },

  // --- 武器（個別） ---
  'item.weapon.wooden_stick':    { imagePath: 'assets/items/wooden_stick.png',    fallbackChar: ')', fallbackColor: '#AA8855' },
  'item.weapon.copper_sword':    { imagePath: 'assets/items/copper_sword.png',    fallbackChar: ')', fallbackColor: '#CC8844' },
  'item.weapon.iron_katana':     { imagePath: 'assets/items/iron_katana.png',     fallbackChar: ')', fallbackColor: '#CCCCCC' },
  'item.weapon.steel_tachi':     { imagePath: 'assets/items/steel_tachi.png',     fallbackChar: ')', fallbackColor: '#DDDDEE' },
  'item.weapon.spirit_sword':    { imagePath: 'assets/items/spirit_sword.png',    fallbackChar: ')', fallbackColor: '#AA66DD' },
  'item.weapon.dragon_sword':    { imagePath: 'assets/items/dragon_sword.png',    fallbackChar: ')', fallbackColor: '#FF6644' },
  'item.weapon.cyclops_sword':   { imagePath: 'assets/items/cyclops_sword.png',   fallbackChar: ')', fallbackColor: '#CCAA44' },
  'item.weapon.drain_sword':     { imagePath: 'assets/items/drain_sword.png',     fallbackChar: ')', fallbackColor: '#8844AA' },
  'item.weapon.pickaxe':         { imagePath: 'assets/items/pickaxe.png',         fallbackChar: ')', fallbackColor: '#888888' },
  'item.weapon.kamaitachi':      { imagePath: 'assets/items/kamaitachi.png',      fallbackChar: ')', fallbackColor: '#44CC88' },
  'item.weapon.legendary_sword': { imagePath: 'assets/items/legendary_sword.png', fallbackChar: ')', fallbackColor: '#FFD700' },
  'item.weapon.coral_blade':     { imagePath: 'assets/items/coral_blade.png',     fallbackChar: ')', fallbackColor: '#FF8899' },
  'item.weapon.thunder_staff':   { imagePath: 'assets/items/thunder_staff.png',   fallbackChar: ')', fallbackColor: '#FFFF44' },
  'item.weapon.shadow_dagger':   { imagePath: 'assets/items/shadow_dagger.png',   fallbackChar: ')', fallbackColor: '#6644AA' },
  'item.weapon.bronze_spear':    { imagePath: 'assets/items/bronze_spear.png',    fallbackChar: ')', fallbackColor: '#CC9944' },
  'item.weapon.iron_spear':      { imagePath: 'assets/items/iron_spear.png',      fallbackChar: ')', fallbackColor: '#BBBBCC' },
  'item.weapon.short_bow':       { imagePath: 'assets/items/short_bow.png',       fallbackChar: ')', fallbackColor: '#AA7744' },
  'item.weapon.long_bow':        { imagePath: 'assets/items/long_bow.png',        fallbackChar: ')', fallbackColor: '#886633' },
  'item.weapon.vine_whip':       { imagePath: 'assets/items/vine_whip.png',       fallbackChar: ')', fallbackColor: '#44AA44' },
  'item.weapon.war_hammer':      { imagePath: 'assets/items/war_hammer.png',      fallbackChar: ')', fallbackColor: '#888899' },
  'item.weapon.boomerang':       { imagePath: 'assets/items/boomerang.png',       fallbackChar: ')', fallbackColor: '#44AACC' },
  'item.weapon.poison_dagger':   { imagePath: 'assets/items/poison_dagger.png',   fallbackChar: ')', fallbackColor: '#88CC44' },
  'item.weapon.flame_sword':     { imagePath: 'assets/items/flame_sword.png',     fallbackChar: ')', fallbackColor: '#FF6622' },
  'item.weapon.sleep_mace':      { imagePath: 'assets/items/sleep_mace.png',      fallbackChar: ')', fallbackColor: '#6688CC' },
  'item.weapon.confusion_staff': { imagePath: 'assets/items/confusion_staff.png', fallbackChar: ')', fallbackColor: '#CC66CC' },
  'item.weapon.slow_whip':       { imagePath: 'assets/items/slow_whip.png',       fallbackChar: ')', fallbackColor: '#8888AA' },
  'item.weapon.seal_blade':      { imagePath: 'assets/items/seal_blade.png',      fallbackChar: ')', fallbackColor: '#4488AA' },
  'item.weapon.critical_axe':    { imagePath: 'assets/items/critical_axe.png',    fallbackChar: ')', fallbackColor: '#DD4444' },
  'item.weapon.life_drain_sword':{ imagePath: 'assets/items/life_drain_sword.png',fallbackChar: ')', fallbackColor: '#CC2244' },
  'item.weapon.bonus_blade':     { imagePath: 'assets/items/bonus_blade.png',     fallbackChar: ')', fallbackColor: '#DDAA44' },

  // --- 盾（個別） ---
  'item.shield.wooden_shield':    { imagePath: 'assets/items/wooden_shield.png',    fallbackChar: '[', fallbackColor: '#AA8855' },
  'item.shield.copper_shield':    { imagePath: 'assets/items/copper_shield.png',    fallbackChar: '[', fallbackColor: '#CC8844' },
  'item.shield.iron_shield':      { imagePath: 'assets/items/iron_shield.png',      fallbackChar: '[', fallbackColor: '#CCCCCC' },
  'item.shield.steel_shield':     { imagePath: 'assets/items/steel_shield.png',     fallbackChar: '[', fallbackColor: '#DDDDEE' },
  'item.shield.evasion_shield':   { imagePath: 'assets/items/evasion_shield.png',   fallbackChar: '[', fallbackColor: '#6688CC' },
  'item.shield.antidote_shield':  { imagePath: 'assets/items/antidote_shield.png',  fallbackChar: '[', fallbackColor: '#44AA66' },
  'item.shield.rustproof_shield': { imagePath: 'assets/items/rustproof_shield.png', fallbackChar: '[', fallbackColor: '#AAAA88' },
  'item.shield.blast_shield':     { imagePath: 'assets/items/blast_shield.png',     fallbackChar: '[', fallbackColor: '#CC4444' },
  'item.shield.fullness_shield':  { imagePath: 'assets/items/fullness_shield.png',  fallbackChar: '[', fallbackColor: '#FFAA44' },
  'item.shield.legendary_shield': { imagePath: 'assets/items/legendary_shield.png', fallbackChar: '[', fallbackColor: '#FFD700' },
  'item.shield.bark_shield':      { imagePath: 'assets/items/bark_shield.png',      fallbackChar: '[', fallbackColor: '#66AA44' },
  'item.shield.coral_shield':     { imagePath: 'assets/items/coral_shield.png',     fallbackChar: '[', fallbackColor: '#FF8899' },
  'item.shield.mirror_shield':    { imagePath: 'assets/items/mirror_shield.png',    fallbackChar: '[', fallbackColor: '#CCDDFF' },
  'item.shield.thorn_shield':     { imagePath: 'assets/items/thorn_shield.png',     fallbackChar: '[', fallbackColor: '#CC4444' },

  // --- 腕輪（個別） ---
  'item.ring.strength_ring':         { imagePath: 'assets/items/strength_ring.png',         fallbackChar: '=', fallbackColor: '#FF6644' },
  'item.ring.clairvoyance_ring':     { imagePath: 'assets/items/clairvoyance_ring.png',     fallbackChar: '=', fallbackColor: '#44AAFF' },
  'item.ring.trap_sight_ring':       { imagePath: 'assets/items/trap_sight_ring.png',       fallbackChar: '=', fallbackColor: '#FF4488' },
  'item.ring.far_throw_ring':        { imagePath: 'assets/items/far_throw_ring.png',        fallbackChar: '=', fallbackColor: '#88CC44' },
  'item.ring.recovery_ring':         { imagePath: 'assets/items/recovery_ring.png',         fallbackChar: '=', fallbackColor: '#44FF88' },
  'item.ring.sleep_resist_ring':     { imagePath: 'assets/items/sleep_resist_ring.png',     fallbackChar: '=', fallbackColor: '#AABB44' },
  'item.ring.confusion_resist_ring': { imagePath: 'assets/items/confusion_resist_ring.png', fallbackChar: '=', fallbackColor: '#CC88CC' },
  'item.ring.curse_resist_ring':     { imagePath: 'assets/items/curse_resist_ring.png',     fallbackChar: '=', fallbackColor: '#DDDD44' },
  'item.ring.wall_pass_ring':        { imagePath: 'assets/items/wall_pass_ring.png',        fallbackChar: '=', fallbackColor: '#FFFFFF' },
  'item.ring.curve_ring':            { imagePath: 'assets/items/curve_ring.png',            fallbackChar: '=', fallbackColor: '#88AACC' },
  'item.ring.swimmer_ring':          { imagePath: 'assets/items/swimmer_ring.png',          fallbackChar: '=', fallbackColor: '#4488CC' },
  'item.ring.forest_ring':           { imagePath: 'assets/items/forest_ring.png',           fallbackChar: '=', fallbackColor: '#44AA44' },

  // --- 壺（個別） ---
  'item.pot.storage_pot':   { imagePath: 'assets/items/storage_pot.png',   fallbackChar: '{', fallbackColor: '#CC8844' },
  'item.pot.identify_pot':  { imagePath: 'assets/items/identify_pot.png',  fallbackChar: '{', fallbackColor: '#44AACC' },
  'item.pot.synthesis_pot': { imagePath: 'assets/items/synthesis_pot.png', fallbackChar: '{', fallbackColor: '#FF8800' },
  'item.pot.heal_pot':      { imagePath: 'assets/items/heal_pot.png',      fallbackChar: '{', fallbackColor: '#44FF44' },
  'item.pot.warehouse_pot': { imagePath: 'assets/items/warehouse_pot.png', fallbackChar: '{', fallbackColor: '#AABB88' },
  'item.pot.curse_pot':       { imagePath: 'assets/items/curse_pot.png',       fallbackChar: '{', fallbackColor: '#8844AA' },
  'item.pot.transform_pot':   { imagePath: 'assets/items/transform_pot.png',   fallbackChar: '{', fallbackColor: '#CC44CC' },
  'item.pot.upgrade_pot':     { imagePath: 'assets/items/upgrade_pot.png',     fallbackChar: '{', fallbackColor: '#44CCFF' },
  'item.pot.downgrade_pot':   { imagePath: 'assets/items/downgrade_pot.png',   fallbackChar: '{', fallbackColor: '#886644' },
  'item.pot.evade_pot':       { imagePath: 'assets/items/evade_pot.png',       fallbackChar: '{', fallbackColor: '#AABB88' },
  'item.pot.bottomless_pot':  { imagePath: 'assets/items/bottomless_pot.png',  fallbackChar: '{', fallbackColor: '#222222' },
  'item.pot.unbreakable_pot': { imagePath: 'assets/items/unbreakable_pot.png', fallbackChar: '{', fallbackColor: '#DDDDFF' },

  // --- 矢（個別） ---
  'item.arrow.wood_arrow':      { imagePath: 'assets/items/wood_arrow.png',      fallbackChar: '-', fallbackColor: '#AA8855' },
  'item.arrow.iron_arrow':      { imagePath: 'assets/items/iron_arrow.png',      fallbackChar: '-', fallbackColor: '#CCCCCC' },
  'item.arrow.silver_arrow':    { imagePath: 'assets/items/silver_arrow.png',    fallbackChar: '-', fallbackColor: '#DDDDFF' },
  'item.arrow.poison_arrow':    { imagePath: 'assets/items/poison_arrow.png',    fallbackChar: '-', fallbackColor: '#AA44CC' },
  'item.arrow.knockback_arrow': { imagePath: 'assets/items/knockback_arrow.png', fallbackChar: '-', fallbackColor: '#FFAA44' },

  // --- 罠 ---
  'trap.default':       { imagePath: 'assets/tiles/trap.png',          fallbackChar: '^', fallbackColor: '#FF4444', fallbackBg: '#1A1815' },
  'trap.poison_arrow':  { imagePath: 'assets/tiles/trap_poison.png',   fallbackChar: '^', fallbackColor: '#AA44CC', fallbackBg: '#1A1815' },
  'trap.pitfall':       { imagePath: 'assets/tiles/trap_pitfall.png',  fallbackChar: '^', fallbackColor: '#886644', fallbackBg: '#1A1815' },
  'trap.landmine':      { imagePath: 'assets/tiles/trap_landmine.png', fallbackChar: '^', fallbackColor: '#FF8800', fallbackBg: '#1A1815' },
  'trap.sleep':         { imagePath: 'assets/tiles/trap_sleep.png',    fallbackChar: '^', fallbackColor: '#4488FF', fallbackBg: '#1A1815' },
  'trap.confusion':     { imagePath: 'assets/tiles/trap_confuse.png',  fallbackChar: '^', fallbackColor: '#FFAA44', fallbackBg: '#1A1815' },
  'trap.spin':          { imagePath: 'assets/tiles/trap_spin.png',     fallbackChar: '^', fallbackColor: '#88CCFF', fallbackBg: '#1A1815' },
  'trap.rust':          { imagePath: 'assets/tiles/trap_rust.png',     fallbackChar: '^', fallbackColor: '#886644', fallbackBg: '#1A1815' },
  'trap.hunger':        { imagePath: 'assets/tiles/trap_hunger.png',   fallbackChar: '^', fallbackColor: '#CCAA44', fallbackBg: '#1A1815' },
  'trap.warp':          { imagePath: 'assets/tiles/trap_warp.png',     fallbackChar: '^', fallbackColor: '#CC44FF', fallbackBg: '#1A1815' },
  'trap.monster':       { imagePath: 'assets/tiles/trap_monster.png',  fallbackChar: '^', fallbackColor: '#FF4444', fallbackBg: '#1A1815' },
  'trap.vine':          { imagePath: 'assets/tiles/trap_vine.png',     fallbackChar: '^', fallbackColor: '#44AA44', fallbackBg: '#1A1815' },
  'trap.spore':         { imagePath: 'assets/tiles/trap_spore.png',    fallbackChar: '^', fallbackColor: '#88CC44', fallbackBg: '#1A1815' },
  'trap.whirlpool':     { imagePath: 'assets/tiles/trap_whirl.png',    fallbackChar: '^', fallbackColor: '#4488CC', fallbackBg: '#1A1815' },
  'trap.flood':         { imagePath: 'assets/tiles/trap_flood.png',    fallbackChar: '^', fallbackColor: '#4466AA', fallbackBg: '#1A1815' },

  // --- エフェクト（静止画） ---
  'effect.attack':      { imagePath: 'assets/effects/attack.png',      fallbackChar: '*', fallbackColor: '#FFFFFF' },
  'effect.magic':       { imagePath: 'assets/effects/magic.png',       fallbackChar: '*', fallbackColor: '#AA44FF' },
  'effect.damage':      { imagePath: 'assets/effects/damage.png',      fallbackChar: '!', fallbackColor: '#FF4444' },
  'effect.slash':       { imagePath: 'assets/effects/slash.png',       fallbackChar: '/', fallbackColor: '#FFFFFF' },
  'effect.blunt':       { imagePath: 'assets/effects/blunt.png',       fallbackChar: '*', fallbackColor: '#FFDD44' },
  'effect.wind':        { imagePath: 'assets/effects/wind.png',        fallbackChar: '~', fallbackColor: '#44CC88' },
  'effect.fire_breath': { imagePath: 'assets/effects/fire_breath.png', fallbackChar: '*', fallbackColor: '#FF4422' },
  'effect.explosion':   { imagePath: 'assets/effects/explosion.png',   fallbackChar: '*', fallbackColor: '#FF8800' },
  'effect.heal':        { imagePath: 'assets/effects/heal.png',        fallbackChar: '+', fallbackColor: '#44FF44' },
  'effect.levelup':     { imagePath: 'assets/effects/levelup.png',     fallbackChar: '!', fallbackColor: '#FFD700' },
  'effect.steal':       { imagePath: 'assets/effects/steal.png',       fallbackChar: '>', fallbackColor: '#FF88AA' },
  'effect.bullet':      { imagePath: 'assets/effects/bullet.png',      fallbackChar: 'o', fallbackColor: '#CCCCCC' },

  // --- エフェクト（スプライトシートアニメーション） ---
  'anim.attack':      { sheetPath: 'assets/effects/attack_sheet.png',      frames: 4, fallbackChar: '*', fallbackColor: '#FFFFFF' },
  'anim.slash':       { sheetPath: 'assets/effects/slash_sheet.png',       frames: 4, fallbackChar: '/', fallbackColor: '#FFFFFF' },
  'anim.blunt':       { sheetPath: 'assets/effects/blunt_sheet.png',       frames: 4, fallbackChar: '*', fallbackColor: '#FFDD44' },
  'anim.magic':       { sheetPath: 'assets/effects/magic_sheet.png',       frames: 4, fallbackChar: '*', fallbackColor: '#AA44FF' },
  'anim.fire_breath': { sheetPath: 'assets/effects/fire_breath_sheet.png', frames: 4, fallbackChar: '*', fallbackColor: '#FF4422' },
  'anim.explosion':   { sheetPath: 'assets/effects/explosion_sheet.png',   frames: 4, fallbackChar: '*', fallbackColor: '#FF8800' },
  'anim.wind':        { sheetPath: 'assets/effects/wind_sheet.png',        frames: 4, fallbackChar: '~', fallbackColor: '#44CC88' },
  'anim.heal':        { sheetPath: 'assets/effects/heal_sheet.png',        frames: 4, fallbackChar: '+', fallbackColor: '#44FF44' },
  'anim.levelup':     { sheetPath: 'assets/effects/levelup_sheet.png',     frames: 4, fallbackChar: '!', fallbackColor: '#FFD700' },
  'anim.damage':      { sheetPath: 'assets/effects/damage_sheet.png',      frames: 4, fallbackChar: '!', fallbackColor: '#FF4444' },
  'anim.bullet':      { sheetPath: 'assets/effects/bullet_sheet.png',      frames: 4, fallbackChar: 'o', fallbackColor: '#CCCCCC' },
  'anim.steal':       { sheetPath: 'assets/effects/steal_sheet.png',       frames: 4, fallbackChar: '>', fallbackColor: '#FF88AA' },

  // --- ループアニメーション用スプライトシート（町タイル） ---
  'anim.tile.town.tree':   { sheetPath: 'assets/tiles/town_tree_sheet.png',   frames: 4, fallbackChar: '♣', fallbackColor: '#228833' },
  'anim.tile.town.water':  { sheetPath: 'assets/tiles/town_water_sheet.png',  frames: 4, fallbackChar: '~', fallbackColor: '#4499DD' },
  'anim.tile.town.flower': { sheetPath: 'assets/tiles/town_flower_sheet.png', frames: 4, fallbackChar: '*', fallbackColor: '#FF88AA' },

  // --- ループアニメーション用スプライトシート（キャラクターアイドル） ---
  'anim.char.player.idle':           { sheetPath: 'assets/characters/player_idle_sheet.png',           frames: 4, fallbackChar: '@', fallbackColor: '#00FF88' },
  'anim.char.warehouse_keeper.idle': { sheetPath: 'assets/characters/warehouse_keeper_idle_sheet.png', frames: 2, fallbackChar: 'W', fallbackColor: '#88AAFF' },
  'anim.char.dungeon_guide.idle':    { sheetPath: 'assets/characters/dungeon_guide_idle_sheet.png',    frames: 2, fallbackChar: 'G', fallbackColor: '#FF8844' },

  // --- 不可視タイル（Fog of War） ---
  'tile.fog':         { imagePath: null, fallbackChar: ' ', fallbackColor: '#222222', fallbackBg: '#111111' },
};

// タイルスプライトキー → アニメーションシートキーのマッピング
export const ANIMATED_TILE_MAP = {
  'tile.town.tree':   'anim.tile.town.tree',
  'tile.town.water':  'anim.tile.town.water',
  'tile.town.flower': 'anim.tile.town.flower',
};

// キャラクタースプライトキー → アイドルアニメーションシートキーのマッピング
export const ANIMATED_CHAR_MAP = {
  'char.player':           'anim.char.player.idle',
  'char.warehouse_keeper': 'anim.char.warehouse_keeper.idle',
  'char.dungeon_guide':    'anim.char.dungeon_guide.idle',
};
