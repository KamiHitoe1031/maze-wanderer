/**
 * town.js - 町シーン（始まりの里）
 */

import { DUNGEON_DEFS, getDungeonDef, getShopStock } from './data/dungeons.js';
import { createItem, getItemDisplayName, ITEM_CATEGORY } from './item.js';

export class TownScene {
  /**
   * @param {object} sceneManager - SceneManager
   * @param {object} saveManager - SaveManager
   */
  constructor(sceneManager, saveManager) {
    this.sceneManager = sceneManager;
    this.saveManager = saveManager;

    // 町に持ち込んだ（ダンジョンから持ち帰った）アイテム
    this.carryItems = [];
    this.carryGold = 0;

    // ショップ状態
    this.shopTab = 'buy'; // 'buy' | 'sell'
    this.sellItems = []; // 売却用アイテム（倉庫から選択）

    // UI要素
    this.townScreen = document.getElementById('town-screen');
    this.gameContainer = document.getElementById('game-container');
    this.sidePanel = document.getElementById('side-panel');
  }

  /**
   * 町シーンに入る
   */
  enter(data = {}) {
    // ダンジョンからの帰還データを処理
    if (data.victory && data.returnItems) {
      // クリア: アイテムを倉庫に自動格納
      this.saveManager.addToWarehouse(data.returnItems);
      this.saveManager.data.gold += (data.returnGold || 0);
      this.saveManager.save();
    } else if (data.death) {
      // 死亡: アイテム全喪失、ゴールドも失う
      // （何もしない = 持ち物なし）
    }

    // UI切替
    if (this.gameContainer) this.gameContainer.style.display = 'none';
    if (this.sidePanel) this.sidePanel.style.display = 'none';
    if (this.townScreen) this.townScreen.style.display = 'flex';

    this.carryItems = [];
    this.carryGold = this.saveManager.getGold();
    this.shopTab = 'buy';
    this.sellItems = [];

    this.render();
  }

  /**
   * 町シーンを退出
   */
  exit() {
    if (this.townScreen) this.townScreen.style.display = 'none';
    if (this.gameContainer) this.gameContainer.style.display = '';
    if (this.sidePanel) this.sidePanel.style.display = '';
  }

  /**
   * 町画面を描画
   */
  render() {
    if (!this.townScreen) return;

    const clearedDungeons = this.saveManager.data.clearedDungeons;
    const gold = this.saveManager.getGold();
    const warehouse = this.saveManager.getWarehouse();
    const shopLevel = this.saveManager.data.shopUnlockLevel;

    this.townScreen.innerHTML = `
      <div class="town-container">
        <div class="town-header">
          <h1 class="town-title">始まりの里</h1>
          <div class="town-gold">所持金: ${gold}銭</div>
        </div>

        <div class="town-main">
          <!-- ダンジョン選択 -->
          <div class="town-panel">
            <div class="town-panel-title">冒険に出る</div>
            <div class="dungeon-list">
              ${this.renderDungeonButtons(clearedDungeons)}
            </div>
          </div>

          <!-- ショップ -->
          <div class="town-panel">
            <div class="town-panel-title">ショップ (Lv.${shopLevel})</div>
            <div class="shop-tabs">
              <button class="shop-tab ${this.shopTab === 'buy' ? 'active' : ''}" data-tab="buy">購入</button>
              <button class="shop-tab ${this.shopTab === 'sell' ? 'active' : ''}" data-tab="sell">売却</button>
            </div>
            <div class="shop-content">
              ${this.shopTab === 'buy' ? this.renderShopBuy(shopLevel, gold) : this.renderShopSell(warehouse)}
            </div>
          </div>

          <!-- 倉庫 -->
          <div class="town-panel">
            <div class="town-panel-title">倉庫 (${warehouse.length}個)</div>
            <div class="warehouse-info">持ち出すアイテムを選択してダンジョンに持ち込めます</div>
            <div class="warehouse-grid" id="warehouse-grid">
              ${this.renderWarehouse(warehouse)}
            </div>
            <div class="carry-info" id="carry-info">
              持ち出し: ${this.carryItems.length}個
            </div>
          </div>
        </div>

        <div class="town-footer">
          ${clearedDungeons.length > 0
            ? `<span class="clear-status">踏破: ${clearedDungeons.map(id => getDungeonDef(id).name).join(', ')}</span>`
            : '<span class="clear-status">まだダンジョンを踏破していない</span>'
          }
        </div>
      </div>
    `;

    // イベント登録
    this.bindEvents();
  }

  /**
   * ダンジョンボタンを描画
   */
  renderDungeonButtons(clearedDungeons) {
    return Object.values(DUNGEON_DEFS).map(def => {
      const unlocked = !def.unlockCondition || clearedDungeons.includes(def.unlockCondition);
      const cleared = clearedDungeons.includes(def.id);
      const bestFloor = this.saveManager.data.bestFloors[def.id] || 0;

      if (!unlocked) {
        return `
          <div class="dungeon-button locked">
            <div class="dungeon-name">？？？</div>
            <div class="dungeon-desc">${def.unlockCondition ? getDungeonDef(def.unlockCondition).name + 'を踏破すると解放' : ''}</div>
          </div>
        `;
      }

      return `
        <div class="dungeon-button ${cleared ? 'cleared' : ''}" data-dungeon="${def.id}">
          <div class="dungeon-name">${def.name} ${cleared ? '(踏破済)' : ''}</div>
          <div class="dungeon-desc">${def.description}</div>
          <div class="dungeon-info">全${def.maxFloor}階 ${bestFloor > 0 ? `最高到達: ${bestFloor}F` : ''}</div>
        </div>
      `;
    }).join('');
  }

  /**
   * ショップ購入タブを描画
   */
  renderShopBuy(shopLevel, gold) {
    const stock = getShopStock(shopLevel);

    if (stock.length === 0) {
      return '<div class="shop-empty">商品はありません</div>';
    }

    return `
      <div class="shop-grid">
        ${stock.map((entry, idx) => {
          const canAfford = gold >= entry.price;
          return `
            <div class="shop-item ${canAfford ? '' : 'too-expensive'}" data-shop-idx="${idx}">
              <span class="shop-item-name">${this.getShopItemName(entry)}</span>
              <span class="shop-item-price">${entry.price}銭</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * ショップ売却タブを描画
   */
  renderShopSell(warehouse) {
    if (warehouse.length === 0) {
      return '<div class="shop-empty">売れるアイテムがありません</div>';
    }

    return `
      <div class="shop-grid">
        ${warehouse.map(item => {
          const sellPrice = item.sellPrice || Math.floor((item.buyPrice || 100) / 3);
          return `
            <div class="shop-item sellable" data-sell-uid="${item.uid}">
              <span class="shop-item-name">${getItemDisplayName(item)}</span>
              <span class="shop-item-price sell-price">${sellPrice}銭</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /**
   * ショップ在庫のアイテム名を取得
   */
  getShopItemName(entry) {
    const category = ITEM_CATEGORY[entry.category];
    if (!category) return entry.id;
    const item = createItem(entry.id, category);
    if (!item) return entry.id;
    return item.name;
  }

  /**
   * 倉庫アイテムを描画
   */
  renderWarehouse(warehouse) {
    if (warehouse.length === 0) {
      return '<div class="warehouse-empty">倉庫は空です</div>';
    }

    return warehouse.map(item => {
      const isSelected = this.carryItems.some(ci => ci.uid === item.uid);
      return `
        <div class="warehouse-item ${isSelected ? 'selected' : ''}" data-uid="${item.uid}">
          ${getItemDisplayName(item)}
        </div>
      `;
    }).join('');
  }

  /**
   * イベントバインド
   */
  bindEvents() {
    // ダンジョン選択ボタン
    const dungeonButtons = this.townScreen.querySelectorAll('.dungeon-button:not(.locked)');
    dungeonButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const dungeonId = btn.dataset.dungeon;
        if (dungeonId) {
          this.enterDungeon(dungeonId);
        }
      });
    });

    // ショップタブ切替
    const shopTabs = this.townScreen.querySelectorAll('.shop-tab');
    shopTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.shopTab = tab.dataset.tab;
        this.render();
      });
    });

    // ショップ購入
    if (this.shopTab === 'buy') {
      const buyItems = this.townScreen.querySelectorAll('.shop-item:not(.too-expensive)');
      buyItems.forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.shopIdx);
          this.buyItem(idx);
        });
      });
    }

    // ショップ売却
    if (this.shopTab === 'sell') {
      const sellItems = this.townScreen.querySelectorAll('.shop-item.sellable');
      sellItems.forEach(el => {
        el.addEventListener('click', () => {
          const uid = parseInt(el.dataset.sellUid);
          this.sellItem(uid);
        });
      });
    }

    // 倉庫アイテム（持ち出し選択トグル）
    const warehouseItems = this.townScreen.querySelectorAll('.warehouse-item');
    warehouseItems.forEach(el => {
      el.addEventListener('click', () => {
        const uid = parseInt(el.dataset.uid);
        this.toggleCarryItem(uid);
      });
    });
  }

  /**
   * アイテムを購入
   */
  buyItem(stockIdx) {
    const shopLevel = this.saveManager.data.shopUnlockLevel;
    const stock = getShopStock(shopLevel);
    const entry = stock[stockIdx];
    if (!entry) return;

    const gold = this.saveManager.getGold();
    if (gold < entry.price) return;

    // アイテムを生成
    const category = ITEM_CATEGORY[entry.category];
    if (!category) return;
    const item = createItem(entry.id, category);
    if (!item) return;

    // 矢は一定本数で購入
    if (category === ITEM_CATEGORY.ARROW) {
      item.count = item.count || 5;
    }

    // 金銭を減らしてアイテムを倉庫に追加
    this.saveManager.setGold(gold - entry.price);
    this.saveManager.addToWarehouse([item]);

    this.render();
  }

  /**
   * アイテムを売却
   */
  sellItem(uid) {
    const warehouse = this.saveManager.getWarehouse();
    const item = warehouse.find(i => i.uid === uid);
    if (!item) return;

    // 持ち出し選択中のアイテムは売れない
    if (this.carryItems.some(ci => ci.uid === uid)) return;

    const sellPrice = item.sellPrice || Math.floor((item.buyPrice || 100) / 3);

    // アイテムを倉庫から除去して売却金を加算
    this.saveManager.removeFromWarehouse(uid);
    const gold = this.saveManager.getGold();
    this.saveManager.setGold(gold + sellPrice);

    this.render();
  }

  /**
   * 持ち出しアイテムを切り替え
   */
  toggleCarryItem(uid) {
    const idx = this.carryItems.findIndex(ci => ci.uid === uid);
    if (idx >= 0) {
      // 選択解除
      this.carryItems.splice(idx, 1);
    } else {
      // 選択（最大20個）
      if (this.carryItems.length >= 20) return;
      const item = this.saveManager.getWarehouse().find(i => i.uid === uid);
      if (item) {
        this.carryItems.push(item);
      }
    }
    this.render();
  }

  /**
   * ダンジョンに入る
   */
  enterDungeon(dungeonId) {
    // 持ち出しアイテムを倉庫から除去
    const itemsToCarry = [];
    for (const item of this.carryItems) {
      const removed = this.saveManager.removeFromWarehouse(item.uid);
      if (removed) {
        itemsToCarry.push(removed);
      }
    }

    // 所持金をセーブから取得
    const gold = this.saveManager.getGold();
    this.saveManager.setGold(0);

    // ダンジョンシーンに遷移
    this.sceneManager.transition('dungeon', {
      dungeonId,
      carryItems: itemsToCarry,
      carryGold: gold
    });
  }
}
