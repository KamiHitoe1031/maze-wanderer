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

  // --- キャラクター ---
  'char.player':      { imagePath: 'assets/characters/player.png',    fallbackChar: '@', fallbackColor: '#00FF88', fallbackBg: null },
  'char.shopkeeper':  { imagePath: 'assets/characters/shopkeeper.png', fallbackChar: 'S', fallbackColor: '#FFD700', fallbackBg: null },

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

  // --- 罠 ---
  'trap.default':     { imagePath: 'assets/tiles/trap.png',      fallbackChar: '^', fallbackColor: '#FF4444', fallbackBg: '#1A1815' },

  // --- エフェクト ---
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

  // --- 不可視タイル（Fog of War） ---
  'tile.unexplored':  { imagePath: null, fallbackChar: ' ', fallbackColor: '#000000', fallbackBg: '#000000' },
  'tile.fog':         { imagePath: null, fallbackChar: ' ', fallbackColor: '#222222', fallbackBg: '#111111' },
};
