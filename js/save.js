/**
 * save.js - セーブ・ロード（localStorage永続化）
 */

const SAVE_KEY = 'maze_wanderer_save';
const SUSPEND_KEY = 'maze_wanderer_suspend';
const SAVE_VERSION = 1;

const DEFAULT_SAVE = {
  version: SAVE_VERSION,
  clearedDungeons: [],
  warehouse: [],
  gold: 0,
  shopUnlockLevel: 1,
  bestFloors: {}
};

export class SaveManager {
  constructor() {
    this.data = this.load();
  }

  /**
   * セーブデータをロード
   */
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version === SAVE_VERSION) {
          return { ...DEFAULT_SAVE, ...parsed };
        }
      }
    } catch (e) {
      // データ破損時はデフォルトに戻す
    }
    return { ...DEFAULT_SAVE, clearedDungeons: [], warehouse: [], bestFloors: {} };
  }

  /**
   * セーブデータを保存
   */
  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      // localStorage容量不足等
    }
  }

  /**
   * ダンジョンクリアを記録
   */
  markDungeonCleared(dungeonId) {
    if (!this.data.clearedDungeons.includes(dungeonId)) {
      this.data.clearedDungeons.push(dungeonId);
    }
    this.updateShopUnlockLevel();
    this.save();
  }

  /**
   * 最高到達階を更新
   */
  updateBestFloor(dungeonId, floor) {
    const current = this.data.bestFloors[dungeonId] || 0;
    if (floor > current) {
      this.data.bestFloors[dungeonId] = floor;
      this.updateShopUnlockLevel();
      this.save();
    }
  }

  /**
   * ダンジョンがアンロック済みか
   */
  isDungeonUnlocked(dungeonId) {
    const { DUNGEON_DEFS } = this._getDungeonDefs();
    const def = DUNGEON_DEFS[dungeonId];
    if (!def || !def.unlockCondition) return true;
    return this.data.clearedDungeons.includes(def.unlockCondition);
  }

  /**
   * 倉庫にアイテムを追加
   */
  addToWarehouse(items) {
    for (const item of items) {
      // 位置情報をリセット
      const stored = { ...item, onFloor: false, x: -1, y: -1 };
      this.data.warehouse.push(stored);
    }
    this.save();
  }

  /**
   * 倉庫からアイテムを取り出す
   */
  removeFromWarehouse(uid) {
    const idx = this.data.warehouse.findIndex(item => item.uid === uid);
    if (idx >= 0) {
      const item = this.data.warehouse.splice(idx, 1)[0];
      this.save();
      return item;
    }
    return null;
  }

  /**
   * 倉庫のアイテム一覧を取得
   */
  getWarehouse() {
    return this.data.warehouse;
  }

  /**
   * 所持金を更新
   */
  setGold(amount) {
    this.data.gold = amount;
    this.save();
  }

  /**
   * 所持金を取得
   */
  getGold() {
    return this.data.gold;
  }

  /**
   * ショップアンロックレベルを更新
   */
  updateShopUnlockLevel() {
    let level = 1;
    const bestD1 = this.data.bestFloors['dungeon_1'] || 0;
    const clearedD1 = this.data.clearedDungeons.includes('dungeon_1');
    const clearedD2 = this.data.clearedDungeons.includes('dungeon_2');
    const clearedD3 = this.data.clearedDungeons.includes('dungeon_3');

    if (bestD1 >= 10) level = 2;
    if (clearedD1) level = 3;
    if (clearedD2 || clearedD3) level = 4;
    if (clearedD1 && clearedD2 && clearedD3) level = 5;

    this.data.shopUnlockLevel = level;
  }

  /**
   * セーブデータをリセット（デバッグ用）
   */
  reset() {
    this.data = { ...DEFAULT_SAVE, clearedDungeons: [], warehouse: [], bestFloors: {} };
    this.save();
  }

  // ========== クラウド同期用 ==========

  /**
   * 永続セーブデータをプレーンオブジェクトとしてエクスポート
   */
  exportPermanentData() {
    return JSON.parse(JSON.stringify(this.data));
  }

  /**
   * サーバーの永続セーブデータをlocalStorageに反映
   */
  importPermanentData(serverData) {
    if (!serverData) return;
    this.data = {
      ...DEFAULT_SAVE,
      clearedDungeons: [],
      warehouse: [],
      bestFloors: {},
      ...serverData
    };
    this.updateShopUnlockLevel();
    this.save();
  }

  /**
   * 中断セーブデータをオブジェクトとしてエクスポート
   */
  exportSuspendData() {
    try {
      const raw = localStorage.getItem(SUSPEND_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * サーバーの中断セーブデータをlocalStorageに書き込み
   */
  importSuspendData(suspendData) {
    if (suspendData) {
      try {
        localStorage.setItem(SUSPEND_KEY, JSON.stringify(suspendData));
      } catch (e) {
        // localStorage容量不足等
      }
    }
  }

  // ========== 中断セーブ ==========

  /**
   * ダンジョン中断セーブ
   */
  saveSuspend(gameState) {
    try {
      const data = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        dungeonDefId: gameState.dungeonDef.id,
        seed: gameState.seed,
        floor: gameState.floor,
        maxFloor: gameState.maxFloor,
        turnCount: gameState.turnCount,
        monsterHouseTriggered: gameState.monsterHouseTriggered,
        stats: { ...gameState.stats },
        identifiedMap: JSON.parse(JSON.stringify(gameState.identifiedMap)),
        fakeNameMap: JSON.parse(JSON.stringify(gameState.fakeNameMap)),
        rngState: [...gameState.rng.state],
        player: this._serializePlayer(gameState.player),
        dungeon: this._serializeDungeon(gameState.dungeon),
        monsters: gameState.monsterManager.getAliveMonsters().map(m => this._serializeMonster(m)),
        floorItems: gameState.floorItems.map(it => this._serializeItem(it)),
        traps: gameState.trapManager.traps.map(t => ({ ...t })),
        messages: gameState.messages.slice(-10)
      };
      localStorage.setItem(SUSPEND_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 中断セーブがあるか
   */
  hasSuspendData() {
    return localStorage.getItem(SUSPEND_KEY) !== null;
  }

  /**
   * 中断セーブデータを読み込む（読み込み後削除）
   */
  loadSuspend() {
    try {
      const raw = localStorage.getItem(SUSPEND_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.version !== SAVE_VERSION) return null;
      // ロード成功したら削除（ローグライクの中断セーブは1回限り）
      localStorage.removeItem(SUSPEND_KEY);
      return data;
    } catch (e) {
      localStorage.removeItem(SUSPEND_KEY);
      return null;
    }
  }

  /**
   * 中断セーブを削除
   */
  deleteSuspend() {
    localStorage.removeItem(SUSPEND_KEY);
  }

  // ========== シリアライズ ==========

  _serializePlayer(player) {
    return {
      x: player.x,
      y: player.y,
      level: player.level,
      exp: player.exp,
      hp: player.hp,
      maxHp: player.maxHp,
      strength: player.strength,
      maxStrength: player.maxStrength,
      fullness: player.fullness,
      maxFullness: player.maxFullness,
      gold: player.gold,
      weapon: player.weapon ? this._serializeItem(player.weapon) : null,
      shield: player.shield ? this._serializeItem(player.shield) : null,
      ring1: player.ring1 ? this._serializeItem(player.ring1) : null,
      ring2: player.ring2 ? this._serializeItem(player.ring2) : null,
      inventory: player.inventory.map(it => this._serializeItem(it)),
      direction: { ...player.direction },
      isAlive: player.isAlive,
      hasRevival: player.hasRevival,
      statusEffects: player.statusEffects.map(e => ({ ...e }))
    };
  }

  _serializeItem(item) {
    if (!item) return null;
    // プレーンオブジェクトにコピー（クラスメソッド除去）
    const serialized = {};
    for (const key of Object.keys(item)) {
      if (key === 'contents' && Array.isArray(item.contents)) {
        serialized.contents = item.contents.map(c => c ? this._serializeItem(c) : null);
      } else {
        serialized[key] = item[key];
      }
    }
    return serialized;
  }

  _serializeDungeon(dungeon) {
    return {
      width: dungeon.width,
      height: dungeon.height,
      map: dungeon.map.map(row => [...row]),
      rooms: dungeon.rooms.map(r => ({ x: r.x, y: r.y, width: r.width, height: r.height })),
      stairsPos: { ...dungeon.stairsPos },
      playerStartPos: { ...dungeon.playerStartPos },
      explored: dungeon.explored.map(row => [...row]),
      monsterHouseRoom: dungeon.monsterHouseRoom
        ? { x: dungeon.monsterHouseRoom.x, y: dungeon.monsterHouseRoom.y, width: dungeon.monsterHouseRoom.width, height: dungeon.monsterHouseRoom.height }
        : null
    };
  }

  _serializeMonster(monster) {
    return {
      id: monster.id,
      x: monster.x,
      y: monster.y,
      hp: monster.hp,
      maxHp: monster.maxHp,
      atk: monster.atk,
      def: monster.def,
      isAlive: monster.isAlive,
      splitCount: monster.splitCount,
      slowToggle: monster.slowToggle,
      statusEffects: monster.statusEffects.map(e => ({ ...e }))
    };
  }

  /**
   * ダンジョン定義を遅延ロード（循環参照回避）
   */
  _getDungeonDefs() {
    // 動的importの代わりにグローバル参照を使う
    // Step 3でtown.jsが直接チェックするのでここは簡易実装
    return {
      DUNGEON_DEFS: {
        dungeon_1: { unlockCondition: null },
        dungeon_2: { unlockCondition: 'dungeon_1' },
        dungeon_3: { unlockCondition: 'dungeon_1' }
      }
    };
  }
}
