/**
 * town-map.js - 町マップデータ（始まりの里）
 *
 * Dungeonクラスと同じインターフェースを提供し、
 * 既存のRendererでそのまま描画できる。
 */

// 町タイル定数
const T = {
  VOID:   0,  // 黒（マップ外）
  GRASS:  1,  // 歩ける草地
  PATH:   2,  // 歩ける石畳
  WATER:  3,  // 通行不可の泉
  TREE:   4,  // 通行不可の木
  WALL:   5,  // 通行不可の建物壁
  ROOF:   6,  // 通行不可の屋根
  FENCE:  7,  // 通行不可の柵
  FLOWER: 8,  // 歩ける花壇
};

// タイル → スプライトキー対応表
const TILE_SPRITE_MAP = {
  [T.VOID]:   'tile.unexplored',
  [T.GRASS]:  'tile.town.grass',
  [T.PATH]:   'tile.town.path',
  [T.WATER]:  'tile.town.water',
  [T.TREE]:   'tile.town.tree',
  [T.WALL]:   'tile.town.wall',
  [T.ROOF]:   'tile.town.roof',
  [T.FENCE]:  'tile.town.fence',
  [T.FLOWER]: 'tile.town.flower',
};

// 歩行可能なタイル
const WALKABLE = new Set([T.GRASS, T.PATH, T.FLOWER]);

// 町マップ定義 (30x22)
// prettier-ignore
const MAP_DATA = [
  //0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0], // 1
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 2
  [0, 4, 1, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 1, 1, 1, 4, 0], // 3  roofs
  [0, 4, 1, 5, 5, 5, 5, 5, 1, 1, 8, 2, 2, 8, 1, 1, 8, 2, 2, 5, 5, 5, 5, 5, 5, 1, 1, 1, 4, 0], // 4  walls
  [0, 4, 1, 5, 1, 1, 1, 5, 1, 1, 8, 2, 2, 8, 1, 1, 8, 2, 2, 5, 1, 1, 1, 1, 5, 1, 1, 1, 4, 0], // 5  inner/door
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 6  NPC row
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 7
  [0, 4, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 8  main path
  [0, 4, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 9  fountain
  [0, 4, 1, 1, 1, 8, 8, 1, 2, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 2, 1, 8, 8, 1, 1, 1, 1, 4, 0], // 10
  [0, 4, 1, 1, 1, 8, 8, 1, 2, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 2, 1, 8, 8, 1, 1, 1, 1, 4, 0], // 11 center
  [0, 4, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 12
  [0, 4, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 13 main path
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 14
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 2, 7, 7, 7, 7, 2, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 15 fence
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 7, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 7, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 16 guild area
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 7, 1, 6, 6, 6, 6, 6, 6, 6, 6, 1, 7, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 17 guild roof
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 7, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 7, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 18 guild wall
  [0, 4, 1, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 1, 4, 0], // 19 fence
  [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0], // 20
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 21
];

// NPC定義
const NPC_DEFS = [
  {
    id: 'shop',
    x: 5,
    y: 6,
    spriteKey: 'char.shopkeeper',
    name: '道具屋',
    message: '道具屋だ。話しかけてみよう。',
    isAlive: true
  },
  {
    id: 'warehouse',
    x: 22,
    y: 6,
    spriteKey: 'char.warehouse_keeper',
    name: '倉庫番',
    message: '倉庫番がいる。アイテムを預けられそうだ。',
    isAlive: true
  },
  {
    id: 'dungeon_gate',
    x: 14,
    y: 16,
    spriteKey: 'char.dungeon_guide',
    name: '冒険者ギルド',
    message: '冒険者ギルドだ。ダンジョンに出発できる。',
    isAlive: true
  }
];

// プレイヤー初期位置
const PLAYER_START = { x: 14, y: 11 };

export class TownMap {
  constructor() {
    this.width = MAP_DATA[0].length;   // 30
    this.height = MAP_DATA.length;     // 22
    this.map = MAP_DATA.map(row => [...row]);
    this.explored = MAP_DATA.map(row => row.map(() => true)); // 全て探索済み
    this.rooms = []; // 部屋概念なし
    this.stairsPos = null;
    this.playerStartPos = { ...PLAYER_START };
    this.monsterHouseRoom = null;

    // NPC（モンスターと同じインターフェースで描画される）
    this.npcs = NPC_DEFS.map(def => ({ ...def }));
  }

  /**
   * タイルのスプライトキーを返す
   */
  getTileSpriteKey(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 'tile.unexplored';
    }
    const tile = this.map[y][x];
    return TILE_SPRITE_MAP[tile] || 'tile.unexplored';
  }

  /**
   * 歩行可能か（NPCは別途チェック）
   */
  isWalkable(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    return WALKABLE.has(this.map[y][x]);
  }

  /**
   * 指定座標にNPCがいるか
   */
  getNpcAt(x, y) {
    return this.npcs.find(npc => npc.x === x && npc.y === y) || null;
  }

  /**
   * 部屋取得（町では常にnull）
   */
  getRoomAt() {
    return null;
  }
}

export { PLAYER_START };
