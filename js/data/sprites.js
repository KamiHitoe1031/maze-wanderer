/**
 * sprites.js - 全スプライト定義（画像パス＋フォールバック記号・色）
 */

export const SPRITE_DEFS = {
  // --- タイル ---
  'tile.wall':        { imagePath: 'assets/tiles/wall.png',      fallbackChar: '#', fallbackColor: '#8B8682', fallbackBg: '#3B3530' },
  'tile.floor':       { imagePath: 'assets/tiles/floor.png',     fallbackChar: '·', fallbackColor: '#6B6560', fallbackBg: '#1A1815' },
  'tile.corridor':    { imagePath: 'assets/tiles/corridor.png',  fallbackChar: '·', fallbackColor: '#5A5550', fallbackBg: '#121010' },
  'tile.stairs':      { imagePath: 'assets/tiles/stairs.png',    fallbackChar: '>', fallbackColor: '#FFD700', fallbackBg: '#1A1815' },
  'tile.water':       { imagePath: 'assets/tiles/water.png',     fallbackChar: '~', fallbackColor: '#4488CC', fallbackBg: '#112244' },
  'tile.shop':        { imagePath: 'assets/tiles/shop.png',      fallbackChar: '$', fallbackColor: '#FFD700', fallbackBg: '#2A2520' },

  // --- キャラクター ---
  'char.player':      { imagePath: 'assets/characters/player.png',    fallbackChar: '@', fallbackColor: '#00FF88', fallbackBg: null },
  'char.shopkeeper':  { imagePath: 'assets/characters/shopkeeper.png', fallbackChar: 'S', fallbackColor: '#FFD700', fallbackBg: null },

  // --- モンスター（Phase 1: ノーマル系3種） ---
  'monster.green_slime':  { imagePath: 'assets/monsters/green_slime.png',  fallbackChar: 's', fallbackColor: '#44FF44' },
  'monster.blue_slime':   { imagePath: 'assets/monsters/blue_slime.png',   fallbackChar: 's', fallbackColor: '#4488FF' },
  'monster.rat':          { imagePath: 'assets/monsters/rat.png',          fallbackChar: 'r', fallbackColor: '#AA8855' },

  // --- 将来用モンスター ---
  'monster.red_slime':    { imagePath: 'assets/monsters/red_slime.png',    fallbackChar: 'S', fallbackColor: '#FF4444' },
  'monster.ghost':        { imagePath: 'assets/monsters/ghost.png',        fallbackChar: 'G', fallbackColor: '#CC88FF' },
  'monster.bat':          { imagePath: 'assets/monsters/bat.png',          fallbackChar: 'b', fallbackColor: '#8844AA' },
  'monster.fire_dragon':  { imagePath: 'assets/monsters/fire_dragon.png',  fallbackChar: 'D', fallbackColor: '#FF4422' },
  'monster.demon_king':   { imagePath: 'assets/monsters/demon_king.png',   fallbackChar: 'W', fallbackColor: '#FF0000' },

  // --- アイテム ---
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

  // --- 罠 ---
  'trap.default':     { imagePath: 'assets/tiles/trap.png',      fallbackChar: '^', fallbackColor: '#FF4444', fallbackBg: '#1A1815' },

  // --- エフェクト ---
  'effect.attack':    { imagePath: 'assets/effects/attack.png',  fallbackChar: '*', fallbackColor: '#FFFFFF' },
  'effect.magic':     { imagePath: 'assets/effects/magic.png',   fallbackChar: '*', fallbackColor: '#AA44FF' },
  'effect.damage':    { imagePath: 'assets/effects/damage.png',  fallbackChar: '!', fallbackColor: '#FF4444' },

  // --- 不可視タイル（Fog of War） ---
  'tile.unexplored':  { imagePath: null, fallbackChar: ' ', fallbackColor: '#000000', fallbackBg: '#000000' },
  'tile.fog':         { imagePath: null, fallbackChar: ' ', fallbackColor: '#222222', fallbackBg: '#111111' },
};
