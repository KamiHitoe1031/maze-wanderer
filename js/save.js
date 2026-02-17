/**
 * save.js - セーブ・ロード（localStorage永続化）
 */

const SAVE_KEY = 'maze_wanderer_save';
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
