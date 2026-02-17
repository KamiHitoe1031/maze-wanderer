/**
 * dungeon.js - BSP法によるダンジョン自動生成
 */

// タイル定数
export const TILE = {
  WALL: 0,
  FLOOR: 1,
  CORRIDOR: 2,
  STAIRS: 3,
  WATER: 4,
  TRAP: 5,
  SHOP: 6
};

// マップサイズ
export const MAP_WIDTH = 40;
export const MAP_HEIGHT = 30;

// 部屋サイズ制限
const MIN_ROOM_SIZE = 4;
const MAX_ROOM_WIDTH = 10;
const MAX_ROOM_HEIGHT = 8;

// 区画最小サイズ（部屋＋マージン）
const MIN_LEAF_SIZE = MIN_ROOM_SIZE + 3;

/**
 * BSPノード（区画）
 */
class BSPNode {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.left = null;
    this.right = null;
    this.room = null;
  }

  /**
   * 区画を分割
   */
  split(rng) {
    // すでに分割済みなら終了
    if (this.left !== null || this.right !== null) {
      return false;
    }

    // 分割方向を決定（縦長なら水平、横長なら垂直）
    let splitH;
    if (this.width > this.height && this.width / this.height >= 1.25) {
      splitH = false; // 垂直分割
    } else if (this.height > this.width && this.height / this.width >= 1.25) {
      splitH = true; // 水平分割
    } else {
      splitH = rng.chance(0.5);
    }

    const max = (splitH ? this.height : this.width) - MIN_LEAF_SIZE;
    if (max <= MIN_LEAF_SIZE) {
      return false; // これ以上分割できない
    }

    const split = rng.nextInt(MIN_LEAF_SIZE, max);

    if (splitH) {
      this.left = new BSPNode(this.x, this.y, this.width, split);
      this.right = new BSPNode(this.x, this.y + split, this.width, this.height - split);
    } else {
      this.left = new BSPNode(this.x, this.y, split, this.height);
      this.right = new BSPNode(this.x + split, this.y, this.width - split, this.height);
    }

    return true;
  }

  /**
   * 区画内に部屋を生成
   */
  createRoom(rng) {
    if (this.left !== null || this.right !== null) {
      // 子ノードがある場合は再帰
      if (this.left !== null) this.left.createRoom(rng);
      if (this.right !== null) this.right.createRoom(rng);
      return;
    }

    // リーフノード：部屋を生成
    const maxW = Math.min(this.width - 2, MAX_ROOM_WIDTH);
    const maxH = Math.min(this.height - 2, MAX_ROOM_HEIGHT);

    if (maxW < MIN_ROOM_SIZE || maxH < MIN_ROOM_SIZE) {
      return; // 部屋を配置できない
    }

    const roomW = rng.nextInt(MIN_ROOM_SIZE, maxW);
    const roomH = rng.nextInt(MIN_ROOM_SIZE, maxH);
    const roomX = this.x + rng.nextInt(1, this.width - roomW - 1);
    const roomY = this.y + rng.nextInt(1, this.height - roomH - 1);

    this.room = { x: roomX, y: roomY, width: roomW, height: roomH };
  }

  /**
   * この区画（またはその子孫）の部屋を取得
   */
  getRoom() {
    if (this.room !== null) {
      return this.room;
    }
    if (this.left !== null) {
      const leftRoom = this.left.getRoom();
      if (leftRoom !== null) return leftRoom;
    }
    if (this.right !== null) {
      const rightRoom = this.right.getRoom();
      if (rightRoom !== null) return rightRoom;
    }
    return null;
  }

  /**
   * 全ての部屋を収集
   */
  getAllRooms() {
    const rooms = [];
    this._collectRooms(rooms);
    return rooms;
  }

  _collectRooms(rooms) {
    if (this.room !== null) {
      rooms.push(this.room);
    }
    if (this.left !== null) this.left._collectRooms(rooms);
    if (this.right !== null) this.right._collectRooms(rooms);
  }
}

/**
 * ダンジョンクラス
 */
export class Dungeon {
  constructor(floor, rng, theme = 'stone') {
    this.floor = floor;
    this.rng = rng;
    this.theme = theme;
    this.map = this.createEmptyMap();
    this.rooms = [];
    this.stairsPos = null;
    this.playerStartPos = null;
    this.explored = this.createExploredMap();
  }

  /**
   * 空のマップを生成（全て壁）
   */
  createEmptyMap() {
    const map = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      map.push(new Array(MAP_WIDTH).fill(TILE.WALL));
    }
    return map;
  }

  /**
   * 探索済みマップを生成（全て未探索）
   */
  createExploredMap() {
    const explored = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      explored.push(new Array(MAP_WIDTH).fill(false));
    }
    return explored;
  }

  /**
   * ダンジョンを生成
   */
  generate() {
    // BSP木を構築
    const root = new BSPNode(0, 0, MAP_WIDTH, MAP_HEIGHT);
    const nodes = [root];

    // 分割を4～8回繰り返す
    const targetSplits = this.rng.nextInt(4, 8);
    let splits = 0;

    while (splits < targetSplits && nodes.length > 0) {
      const shuffled = this.rng.shuffle(nodes);
      for (const node of shuffled) {
        if (node.split(this.rng)) {
          nodes.push(node.left);
          nodes.push(node.right);
          splits++;
          if (splits >= targetSplits) break;
        }
      }
    }

    // 各区画に部屋を生成
    root.createRoom(this.rng);

    // 部屋をマップに描画
    this.rooms = root.getAllRooms();
    for (const room of this.rooms) {
      this.carveRoom(room);
    }

    // 隣接する区画の部屋同士を通路で接続
    this.connectRooms(root);

    // 全ての部屋が到達可能であることを確認
    if (!this.verifyConnectivity()) {
      // 接続できていない場合は追加で通路を掘る
      this.forceConnectivity();
    }

    // 海テーマ：一部の通路を水路に変換
    if (this.theme === 'ocean') {
      this.generateWaterCorridors();
    }

    // プレイヤー開始位置を設定
    const startRoom = this.rng.pick(this.rooms);
    this.playerStartPos = this.getRandomPointInRoom(startRoom);

    // 階段を別の部屋に配置
    const otherRooms = this.rooms.filter(r => r !== startRoom);
    const stairsRoom = this.rng.pick(otherRooms) || startRoom;
    this.stairsPos = this.getRandomPointInRoom(stairsRoom);
    this.map[this.stairsPos.y][this.stairsPos.x] = TILE.STAIRS;

    return this;
  }

  /**
   * 部屋をマップに描画
   */
  carveRoom(room) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
          this.map[y][x] = TILE.FLOOR;
        }
      }
    }
  }

  /**
   * 2つの部屋を通路で接続
   */
  connectRooms(node) {
    if (node.left === null || node.right === null) return;

    // 子ノードを再帰的に接続
    this.connectRooms(node.left);
    this.connectRooms(node.right);

    // 左右の部屋を接続
    const leftRoom = node.left.getRoom();
    const rightRoom = node.right.getRoom();

    if (leftRoom && rightRoom) {
      // 各部屋の中心点を取得
      const p1 = {
        x: Math.floor(leftRoom.x + leftRoom.width / 2),
        y: Math.floor(leftRoom.y + leftRoom.height / 2)
      };
      const p2 = {
        x: Math.floor(rightRoom.x + rightRoom.width / 2),
        y: Math.floor(rightRoom.y + rightRoom.height / 2)
      };

      // L字型の通路を掘る
      if (this.rng.chance(0.5)) {
        this.carveHCorridor(p1.x, p2.x, p1.y);
        this.carveVCorridor(p1.y, p2.y, p2.x);
      } else {
        this.carveVCorridor(p1.y, p2.y, p1.x);
        this.carveHCorridor(p1.x, p2.x, p2.y);
      }
    }
  }

  /**
   * 水平通路を掘る
   */
  carveHCorridor(x1, x2, y) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    for (let x = minX; x <= maxX; x++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        if (this.map[y][x] === TILE.WALL) {
          this.map[y][x] = TILE.CORRIDOR;
        }
      }
    }
  }

  /**
   * 垂直通路を掘る
   */
  carveVCorridor(y1, y2, x) {
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    for (let y = minY; y <= maxY; y++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        if (this.map[y][x] === TILE.WALL) {
          this.map[y][x] = TILE.CORRIDOR;
        }
      }
    }
  }

  /**
   * 全ての部屋が到達可能か確認（BFS）
   */
  verifyConnectivity() {
    if (this.rooms.length === 0) return true;

    const startRoom = this.rooms[0];
    const startX = Math.floor(startRoom.x + startRoom.width / 2);
    const startY = Math.floor(startRoom.y + startRoom.height / 2);

    const visited = this.createExploredMap();
    const queue = [{ x: startX, y: startY }];
    visited[startY][startX] = true;

    while (queue.length > 0) {
      const { x, y } = queue.shift();

      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
          if (!visited[ny][nx] && this.map[ny][nx] !== TILE.WALL) {
            visited[ny][nx] = true;
            queue.push({ x: nx, y: ny });
          }
        }
      }
    }

    // 全ての部屋の中心が到達可能か確認
    for (const room of this.rooms) {
      const cx = Math.floor(room.x + room.width / 2);
      const cy = Math.floor(room.y + room.height / 2);
      if (!visited[cy][cx]) {
        return false;
      }
    }

    return true;
  }

  /**
   * 強制的に全ての部屋を接続
   */
  forceConnectivity() {
    for (let i = 1; i < this.rooms.length; i++) {
      const p1 = {
        x: Math.floor(this.rooms[i - 1].x + this.rooms[i - 1].width / 2),
        y: Math.floor(this.rooms[i - 1].y + this.rooms[i - 1].height / 2)
      };
      const p2 = {
        x: Math.floor(this.rooms[i].x + this.rooms[i].width / 2),
        y: Math.floor(this.rooms[i].y + this.rooms[i].height / 2)
      };

      this.carveHCorridor(p1.x, p2.x, p1.y);
      this.carveVCorridor(p1.y, p2.y, p2.x);
    }
  }

  /**
   * 通路の一部を水路に変換（海テーマ用）
   */
  generateWaterCorridors() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (this.map[y][x] === TILE.CORRIDOR && this.rng.chance(0.3)) {
          this.map[y][x] = TILE.WATER;
        }
      }
    }
  }

  /**
   * 部屋内のランダムな点を取得
   */
  getRandomPointInRoom(room) {
    return {
      x: this.rng.nextInt(room.x, room.x + room.width - 1),
      y: this.rng.nextInt(room.y, room.y + room.height - 1)
    };
  }

  /**
   * 指定座標が通行可能か
   */
  isWalkable(x, y) {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
      return false;
    }
    const tile = this.map[y][x];
    return tile === TILE.FLOOR || tile === TILE.CORRIDOR || tile === TILE.STAIRS || tile === TILE.WATER;
  }

  /**
   * 指定座標が壁か
   */
  isWall(x, y) {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
      return true;
    }
    return this.map[y][x] === TILE.WALL;
  }

  /**
   * 指定座標が部屋内か
   */
  isInRoom(x, y) {
    return this.map[y]?.[x] === TILE.FLOOR;
  }

  /**
   * 指定座標がどの部屋に属するか
   */
  getRoomAt(x, y) {
    for (const room of this.rooms) {
      if (x >= room.x && x < room.x + room.width &&
          y >= room.y && y < room.y + room.height) {
        return room;
      }
    }
    return null;
  }

  /**
   * タイルのスプライトキーを取得
   */
  getTileSpriteKey(x, y) {
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) {
      return this.theme !== 'stone' ? `tile.${this.theme}.wall` : 'tile.wall';
    }

    const tile = this.map[y][x];
    const prefix = this.theme !== 'stone' ? `tile.${this.theme}.` : 'tile.';

    switch (tile) {
      case TILE.WALL: return `${prefix}wall`;
      case TILE.FLOOR: return `${prefix}floor`;
      case TILE.CORRIDOR: return `${prefix}corridor`;
      case TILE.STAIRS: return 'tile.stairs'; // 階段は共通
      case TILE.WATER: return `${prefix}water`;
      case TILE.SHOP: return 'tile.shop'; // 店は共通
      default: return `${prefix}floor`;
    }
  }

  /**
   * ランダムな歩行可能位置を取得
   */
  getRandomWalkablePosition() {
    const room = this.rng.pick(this.rooms);
    if (room) {
      return this.getRandomPointInRoom(room);
    }
    return null;
  }
}
