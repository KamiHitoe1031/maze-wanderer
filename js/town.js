/**
 * town.js - 町シーン（始まりの里）
 * Canvas描画で歩き回れる町マップ。NPCに話しかけてショップ・倉庫・ダンジョン選択。
 */

import { DUNGEON_DEFS, getDungeonDef, getShopStock } from './data/dungeons.js';
import { createItem, getItemDisplayName, ITEM_CATEGORY } from './item.js';
import { TownMap, PLAYER_START } from './town-map.js';
import { ACTION } from './input.js';

export class TownScene {
  /**
   * @param {object} sceneManager
   * @param {object} saveManager
   * @param {object} renderer
   * @param {object} input
   */
  constructor(sceneManager, saveManager, renderer, input) {
    this.sceneManager = sceneManager;
    this.saveManager = saveManager;
    this.renderer = renderer;
    this.input = input;

    // 町マップ
    this.townMap = null;

    // 町プレイヤー（描画用の簡易オブジェクト）
    this.townPlayer = null;

    // ダンジョンに持ち込むアイテム
    this.carryItems = [];
    this.carryGold = 0;

    // ショップ状態
    this.shopTab = 'buy';

    // オーバーレイ状態
    this.overlayOpen = false;

    // UI要素
    this.townScreen = document.getElementById('town-screen');
    this.gameWrapper = document.getElementById('game-wrapper');
    this.gameContainer = document.getElementById('game-container');
    this.sidePanel = document.getElementById('side-panel');
    this.messageLog = document.getElementById('message-log');
    this.messagesEl = document.getElementById('messages');
    this.statusBar = document.getElementById('status-bar');

    // Escキーリスナー
    this._escHandler = (e) => {
      if (e.code === 'Escape' && this.overlayOpen) {
        e.preventDefault();
        this._closeOverlay();
      }
    };
  }

  /**
   * 町シーンに入る
   */
  enter(data = {}) {
    // ダンジョンからの帰還データを処理
    if (data.victory && data.returnItems) {
      this.saveManager.addToWarehouse(data.returnItems);
      this.saveManager.data.gold += (data.returnGold || 0);
      this.saveManager.save();
    }

    // 町マップ生成
    this.townMap = new TownMap();

    // プレイヤー配置
    this.townPlayer = {
      x: PLAYER_START.x,
      y: PLAYER_START.y,
      direction: { dx: 0, dy: 1 }
    };

    // 持ち込み状態リセット
    this.carryItems = [];
    this.carryGold = this.saveManager.getGold();
    this.shopTab = 'buy';
    this.overlayOpen = false;

    // UI切替: Canvas表示、ステータスバーは非表示
    if (this.townScreen) this.townScreen.style.display = 'none';
    if (this.gameWrapper) this.gameWrapper.style.display = '';
    if (this.gameContainer) this.gameContainer.style.display = '';
    if (this.sidePanel) this.sidePanel.style.display = '';
    if (this.statusBar) this.statusBar.style.display = 'none';

    // メッセージログ表示
    this._clearMessages();
    if (data.victory) {
      this._addMessage('ダンジョンを踏破して帰還した！');
    } else if (data.death) {
      this._addMessage('力尽きて町に戻された…');
    } else {
      this._addMessage('始まりの里へようこそ。');
    }
    this._addMessage('NPCに向かってEnterで話しかけられます。');

    // Escキーリスナー登録
    document.addEventListener('keydown', this._escHandler);

    // 初回描画
    this.render();
  }

  /**
   * 町シーンを退出
   */
  exit() {
    if (this.statusBar) this.statusBar.style.display = '';
    this._closeOverlay();
    document.removeEventListener('keydown', this._escHandler);
  }

  /**
   * 毎フレーム呼ばれる更新処理
   */
  update() {
    if (!this.townMap || !this.townPlayer) return;
    if (this.overlayOpen) return;

    if (this.input.hasAction()) {
      const { action, direction } = this.input.getAction();

      if (action === ACTION.MOVE && direction) {
        this._movePlayer(direction.dx, direction.dy);
        this.render();
      } else if (action === ACTION.PICKUP || action === ACTION.DESCEND) {
        // Enter: NPCに話しかける
        this._tryInteract();
      } else if (action === ACTION.TOGGLE_MUTE) {
        // M: ミュート切替は main.js 側で処理されないので自前で
      }
    }
  }

  /**
   * 描画
   */
  render() {
    if (!this.townMap || !this.townPlayer) return;

    // Rendererが期待するGameState互換オブジェクトを作成
    const pseudoState = {
      player: this.townPlayer,
      dungeon: this.townMap,
      monsters: this.townMap.npcs,
      floorItems: [],
      trapManager: null,
    };

    this.renderer.render(pseudoState);
  }

  // ========== 移動 ==========

  /**
   * プレイヤーを移動
   */
  _movePlayer(dx, dy) {
    // 向きを更新
    this.townPlayer.direction = { dx, dy };

    const nx = this.townPlayer.x + dx;
    const ny = this.townPlayer.y + dy;

    // マップ歩行可能チェック
    if (!this.townMap.isWalkable(nx, ny)) return;

    // NPC衝突チェック
    const npc = this.townMap.getNpcAt(nx, ny);
    if (npc) {
      this._addMessage(`${npc.name}がいる。Enterで話しかけよう。`);
      return;
    }

    this.townPlayer.x = nx;
    this.townPlayer.y = ny;
  }

  // ========== NPC対話 ==========

  /**
   * プレイヤーの向いている方向のNPCに話しかける
   */
  _tryInteract() {
    const { x, y, direction } = this.townPlayer;
    const targetX = x + direction.dx;
    const targetY = y + direction.dy;

    const npc = this.townMap.getNpcAt(targetX, targetY);
    if (!npc) {
      // 隣接8方向のNPCも探す
      const adjacent = this._getAdjacentNpc();
      if (adjacent) {
        this._interactWith(adjacent);
      } else {
        this._addMessage('話しかける相手がいない。');
      }
      return;
    }

    this._interactWith(npc);
  }

  /**
   * 隣接NPCを取得
   */
  _getAdjacentNpc() {
    const { x, y } = this.townPlayer;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const npc = this.townMap.getNpcAt(x + dx, y + dy);
        if (npc) return npc;
      }
    }
    return null;
  }

  /**
   * NPCとの対話を開始
   */
  _interactWith(npc) {
    switch (npc.id) {
      case 'shop':
        this._addMessage('道具屋「いらっしゃい！何をお探しかな？」');
        this._showShopOverlay();
        break;
      case 'warehouse':
        this._addMessage('倉庫番「アイテムを預かるよ。」');
        this._showWarehouseOverlay();
        break;
      case 'dungeon_gate':
        this._addMessage('冒険者ギルド「どのダンジョンに挑む？」');
        this._showDungeonOverlay();
        break;
    }
  }

  // ========== オーバーレイ共通 ==========

  _showOverlay(html) {
    let overlay = document.getElementById('town-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'town-overlay';
      overlay.className = 'town-overlay';
      this.gameWrapper.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="town-overlay-panel">
        ${html}
        <div class="town-overlay-footer">
          <button class="town-overlay-close" id="overlay-close-btn">閉じる (Esc)</button>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
    this.overlayOpen = true;

    document.getElementById('overlay-close-btn').addEventListener('click', () => this._closeOverlay());
  }

  _closeOverlay() {
    const overlay = document.getElementById('town-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
    this.overlayOpen = false;
  }

  // ========== ショップ ==========

  _showShopOverlay() {
    const gold = this.saveManager.getGold();
    const shopLevel = this.saveManager.data.shopUnlockLevel;

    const html = `
      <div class="town-overlay-title">道具屋 (Lv.${shopLevel})</div>
      <div class="town-overlay-gold">所持金: ${gold}銭</div>
      <div class="shop-tabs">
        <button class="shop-tab ${this.shopTab === 'buy' ? 'active' : ''}" data-tab="buy">購入</button>
        <button class="shop-tab ${this.shopTab === 'sell' ? 'active' : ''}" data-tab="sell">売却</button>
      </div>
      <div class="shop-content">
        ${this.shopTab === 'buy' ? this._renderShopBuy(shopLevel, gold) : this._renderShopSell()}
      </div>
    `;

    this._showOverlay(html);
    this._bindShopEvents();
  }

  _renderShopBuy(shopLevel, gold) {
    const stock = getShopStock(shopLevel);
    if (stock.length === 0) return '<div class="shop-empty">商品はありません</div>';

    return `<div class="shop-grid">${stock.map((entry, idx) => {
      const canAfford = gold >= entry.price;
      return `
        <div class="shop-item ${canAfford ? '' : 'too-expensive'}" data-shop-idx="${idx}">
          <span class="shop-item-name">${this._getShopItemName(entry)}</span>
          <span class="shop-item-price">${entry.price}銭</span>
        </div>
      `;
    }).join('')}</div>`;
  }

  _renderShopSell() {
    const warehouse = this.saveManager.getWarehouse();
    if (warehouse.length === 0) return '<div class="shop-empty">売れるアイテムがありません</div>';

    return `<div class="shop-grid">${warehouse.map(item => {
      const sellPrice = item.sellPrice || Math.floor((item.buyPrice || 100) / 3);
      return `
        <div class="shop-item sellable" data-sell-uid="${item.uid}">
          <span class="shop-item-name">${getItemDisplayName(item)}</span>
          <span class="shop-item-price sell-price">${sellPrice}銭</span>
        </div>
      `;
    }).join('')}</div>`;
  }

  _getShopItemName(entry) {
    const category = ITEM_CATEGORY[entry.category];
    if (!category) return entry.id;
    const item = createItem(entry.id, category);
    if (!item) return entry.id;
    return item.name;
  }

  _bindShopEvents() {
    const overlay = document.getElementById('town-overlay');
    if (!overlay) return;

    // タブ切替
    overlay.querySelectorAll('.shop-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.shopTab = tab.dataset.tab;
        this._showShopOverlay();
      });
    });

    // 購入
    if (this.shopTab === 'buy') {
      overlay.querySelectorAll('.shop-item:not(.too-expensive)').forEach(el => {
        el.addEventListener('click', () => {
          this._buyItem(parseInt(el.dataset.shopIdx));
        });
      });
    }

    // 売却
    if (this.shopTab === 'sell') {
      overlay.querySelectorAll('.shop-item.sellable').forEach(el => {
        el.addEventListener('click', () => {
          this._sellItem(parseInt(el.dataset.sellUid));
        });
      });
    }
  }

  _buyItem(stockIdx) {
    const shopLevel = this.saveManager.data.shopUnlockLevel;
    const stock = getShopStock(shopLevel);
    const entry = stock[stockIdx];
    if (!entry) return;

    const gold = this.saveManager.getGold();
    if (gold < entry.price) return;

    const category = ITEM_CATEGORY[entry.category];
    if (!category) return;
    const item = createItem(entry.id, category);
    if (!item) return;

    if (category === ITEM_CATEGORY.ARROW) {
      item.count = item.count || 5;
    }

    this.saveManager.setGold(gold - entry.price);
    this.saveManager.addToWarehouse([item]);
    this._addMessage(`${item.name}を購入した。`);
    this._showShopOverlay();
  }

  _sellItem(uid) {
    const warehouse = this.saveManager.getWarehouse();
    const item = warehouse.find(i => i.uid === uid);
    if (!item) return;

    if (this.carryItems.some(ci => ci.uid === uid)) return;

    const sellPrice = item.sellPrice || Math.floor((item.buyPrice || 100) / 3);
    this.saveManager.removeFromWarehouse(uid);
    this.saveManager.setGold(this.saveManager.getGold() + sellPrice);
    this._addMessage(`${getItemDisplayName(item)}を${sellPrice}銭で売却した。`);
    this._showShopOverlay();
  }

  // ========== 倉庫 ==========

  _showWarehouseOverlay() {
    const warehouse = this.saveManager.getWarehouse();

    const html = `
      <div class="town-overlay-title">倉庫 (${warehouse.length}個)</div>
      <div class="warehouse-info">持ち出すアイテムを選択してダンジョンに持ち込めます（最大20個）</div>
      <div class="warehouse-grid">
        ${warehouse.length === 0
          ? '<div class="warehouse-empty">倉庫は空です</div>'
          : warehouse.map(item => {
              const isSelected = this.carryItems.some(ci => ci.uid === item.uid);
              return `
                <div class="warehouse-item ${isSelected ? 'selected' : ''}" data-uid="${item.uid}">
                  ${getItemDisplayName(item)}
                </div>
              `;
            }).join('')
        }
      </div>
      <div class="carry-info">持ち出し: ${this.carryItems.length}/20個</div>
    `;

    this._showOverlay(html);
    this._bindWarehouseEvents();
  }

  _bindWarehouseEvents() {
    const overlay = document.getElementById('town-overlay');
    if (!overlay) return;

    overlay.querySelectorAll('.warehouse-item').forEach(el => {
      el.addEventListener('click', () => {
        const uid = parseInt(el.dataset.uid);
        this._toggleCarryItem(uid);
      });
    });
  }

  _toggleCarryItem(uid) {
    const idx = this.carryItems.findIndex(ci => ci.uid === uid);
    if (idx >= 0) {
      this.carryItems.splice(idx, 1);
    } else {
      if (this.carryItems.length >= 20) {
        this._addMessage('持ち出しは最大20個までです。');
        return;
      }
      const item = this.saveManager.getWarehouse().find(i => i.uid === uid);
      if (item) this.carryItems.push(item);
    }
    this._showWarehouseOverlay();
  }

  // ========== ダンジョン選択 ==========

  _showDungeonOverlay() {
    const clearedDungeons = this.saveManager.data.clearedDungeons;

    const dungeonList = Object.values(DUNGEON_DEFS).map(def => {
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

    const html = `
      <div class="town-overlay-title">冒険者ギルド</div>
      <div class="dungeon-list">${dungeonList}</div>
      <div class="carry-info">持ち出しアイテム: ${this.carryItems.length}個 / 所持金: ${this.saveManager.getGold()}銭</div>
    `;

    this._showOverlay(html);
    this._bindDungeonEvents();
  }

  _bindDungeonEvents() {
    const overlay = document.getElementById('town-overlay');
    if (!overlay) return;

    overlay.querySelectorAll('.dungeon-button:not(.locked)').forEach(btn => {
      btn.addEventListener('click', () => {
        const dungeonId = btn.dataset.dungeon;
        if (dungeonId) {
          this._enterDungeon(dungeonId);
        }
      });
    });
  }

  /**
   * ダンジョンに入る
   */
  _enterDungeon(dungeonId) {
    // 持ち出しアイテムを倉庫から除去
    const itemsToCarry = [];
    for (const item of this.carryItems) {
      const removed = this.saveManager.removeFromWarehouse(item.uid);
      if (removed) itemsToCarry.push(removed);
    }

    // 所持金
    const gold = this.saveManager.getGold();
    this.saveManager.setGold(0);

    this._closeOverlay();

    // ダンジョンシーンに遷移
    this.sceneManager.transition('dungeon', {
      dungeonId,
      carryItems: itemsToCarry,
      carryGold: gold
    });
  }

  // ========== メッセージ ==========

  _addMessage(text) {
    if (!this.messagesEl) return;
    const el = document.createElement('div');
    el.className = 'message';
    el.textContent = text;
    this.messagesEl.appendChild(el);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  _clearMessages() {
    if (this.messagesEl) this.messagesEl.innerHTML = '';
  }
}
