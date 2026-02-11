/**
 * ui.js - UI（メニュー・メッセージログ・ステータスバー・インベントリ）
 */

import { ITEM_CATEGORY, getItemDisplayName, applyGrassEffect, applyFoodEffect, applyScrollEffect, applyEnhanceScroll } from './item.js';

export class UI {
  constructor() {
    // DOM要素の取得
    this.floorDisplay = document.getElementById('floor-display');
    this.levelDisplay = document.getElementById('level-display');
    this.hpDisplay = document.getElementById('hp-display');
    this.strengthDisplay = document.getElementById('strength-display');
    this.fullnessDisplay = document.getElementById('fullness-display');
    this.goldDisplay = document.getElementById('gold-display');
    this.messagesContainer = document.getElementById('messages');

    // メッセージログ
    this.maxMessages = 5;

    // インベントリUI
    this.inventoryOpen = false;
    this.inventoryOverlay = null;
    this.selectedIndex = 0;
    this.inventoryMode = 'main'; // 'main' | 'action' | 'enhance_target'
    this.pendingScrollItem = null; // 強化巻物の対象選択待ち
    this.resolveInventory = null;
  }

  /**
   * ステータスバーを更新
   */
  updateStatus(gameState) {
    const player = gameState.player;

    // フロア
    if (this.floorDisplay) {
      this.floorDisplay.textContent = `フロア: ${gameState.floor}F`;
    }

    // レベル
    if (this.levelDisplay) {
      this.levelDisplay.textContent = `Lv: ${player.level}`;
    }

    // HP
    if (this.hpDisplay) {
      this.hpDisplay.textContent = `HP: ${player.hp}/${player.maxHp}`;
      // HPが低い時は色を変える
      if (player.hp <= player.maxHp * 0.25) {
        this.hpDisplay.style.color = '#ff4444';
      } else if (player.hp <= player.maxHp * 0.5) {
        this.hpDisplay.style.color = '#ffaa44';
      } else {
        this.hpDisplay.style.color = '#66ff66';
      }
    }

    // ちから
    if (this.strengthDisplay) {
      this.strengthDisplay.textContent = `ちから: ${player.strength}`;
      if (player.strength < player.maxStrength) {
        this.strengthDisplay.style.color = '#ff8888';
      } else {
        this.strengthDisplay.style.color = '#e0e0e0';
      }
    }

    // 満腹度
    if (this.fullnessDisplay) {
      this.fullnessDisplay.textContent = `満腹度: ${player.fullness}/${player.maxFullness}`;
      if (player.fullness <= 0) {
        this.fullnessDisplay.style.color = '#ff4444';
      } else if (player.fullness <= 20) {
        this.fullnessDisplay.style.color = '#ff8844';
      } else {
        this.fullnessDisplay.style.color = '#ffcc00';
      }
    }

    // 銭
    if (this.goldDisplay) {
      this.goldDisplay.textContent = `銭: ${player.gold}`;
    }
  }

  /**
   * メッセージを追加
   */
  addMessage(text, type = 'normal') {
    if (!this.messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = `> ${text}`;

    this.messagesContainer.appendChild(messageElement);

    // 古いメッセージを削除
    while (this.messagesContainer.children.length > this.maxMessages) {
      this.messagesContainer.removeChild(this.messagesContainer.firstChild);
    }

    // スクロールを最下部に
    this.messagesContainer.parentElement.scrollTop =
      this.messagesContainer.parentElement.scrollHeight;
  }

  /**
   * メッセージログをクリア
   */
  clearMessages() {
    if (this.messagesContainer) {
      this.messagesContainer.innerHTML = '';
    }
  }

  /**
   * ゲームオーバー画面を表示
   */
  showGameOver(floor, turnCount) {
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';
    overlay.innerHTML = `
      <div class="game-overlay-content">
        <h2>GAME OVER</h2>
        <p>冒険は${floor}階で終わった...</p>
        <p>総ターン数: ${turnCount}</p>
        <button id="retry-button">リトライ</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // スタイルを追加
    this.addOverlayStyles();

    return new Promise((resolve) => {
      document.getElementById('retry-button').addEventListener('click', () => {
        overlay.remove();
        resolve(true);
      });
    });
  }

  /**
   * クリア画面を表示
   */
  showVictory(turnCount) {
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay victory';
    overlay.innerHTML = `
      <div class="game-overlay-content">
        <h2>CONGRATULATIONS!</h2>
        <p>霧幻の塔を踏破した！</p>
        <p>総ターン数: ${turnCount}</p>
        <button id="restart-button">もう一度</button>
      </div>
    `;

    document.body.appendChild(overlay);
    this.addOverlayStyles();

    return new Promise((resolve) => {
      document.getElementById('restart-button').addEventListener('click', () => {
        overlay.remove();
        resolve(true);
      });
    });
  }

  /**
   * オーバーレイ用のスタイルを追加
   */
  addOverlayStyles() {
    if (document.getElementById('overlay-styles')) return;

    const style = document.createElement('style');
    style.id = 'overlay-styles';
    style.textContent = `
      .game-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .game-overlay-content {
        background-color: #16213e;
        border: 2px solid #4a5568;
        border-radius: 8px;
        padding: 32px;
        text-align: center;
        color: #e0e0e0;
      }

      .game-overlay-content h2 {
        font-size: 32px;
        margin-bottom: 16px;
        color: #ff4444;
      }

      .game-overlay.victory .game-overlay-content h2 {
        color: #66ff66;
      }

      .game-overlay-content p {
        margin-bottom: 12px;
        font-size: 16px;
      }

      .game-overlay-content button {
        margin-top: 16px;
        padding: 12px 24px;
        font-size: 16px;
        background-color: #4a5568;
        color: #e0e0e0;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
      }

      .game-overlay-content button:hover {
        background-color: #5a6578;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * 開始メッセージを表示
   */
  showStartMessage() {
    this.addMessage('霧幻の塔に足を踏み入れた。', 'important');
    this.addMessage('操作: WASD/矢印で移動、Fで攻撃、Iで持ち物、Enterで拾う/階段', 'info');
  }

  /**
   * インベントリ画面を表示
   * @returns {Promise<{action: string, item: object, targetItem: object}|null>}
   */
  openInventory(player, gameState) {
    if (this.inventoryOpen) return Promise.resolve(null);

    this.inventoryOpen = true;
    this.selectedIndex = 0;
    this.inventoryMode = 'main';
    this.pendingScrollItem = null;

    return new Promise((resolve) => {
      this.resolveInventory = resolve;
      this.renderInventory(player, gameState);
    });
  }

  /**
   * インベントリを描画
   */
  renderInventory(player, gameState) {
    // 既存のオーバーレイを除去
    if (this.inventoryOverlay) {
      this.inventoryOverlay.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'inventory-overlay';

    const panel = document.createElement('div');
    panel.className = 'inventory-panel';

    // ヘッダー
    const header = document.createElement('div');
    header.className = 'inventory-header';

    if (this.inventoryMode === 'enhance_target') {
      header.textContent = '--- 強化する装備を選べ ---';
    } else {
      header.textContent = `--- 持ち物 (${player.inventory.length}/${player.maxInventory}) ---`;
    }
    panel.appendChild(header);

    // 装備表示
    const equipInfo = document.createElement('div');
    equipInfo.className = 'equip-info';
    const weaponName = player.weapon ? getItemDisplayName(player.weapon) : 'なし';
    const shieldName = player.shield ? getItemDisplayName(player.shield) : 'なし';
    equipInfo.innerHTML = `<span>武器: ${weaponName}</span> <span>盾: ${shieldName}</span>`;
    panel.appendChild(equipInfo);

    // アイテムリスト
    const list = document.createElement('div');
    list.className = 'inventory-list';

    const itemsToShow = this.inventoryMode === 'enhance_target'
      ? player.inventory.filter(it => it.category === ITEM_CATEGORY.WEAPON || it.category === ITEM_CATEGORY.SHIELD)
      : player.inventory;

    if (itemsToShow.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'inventory-item';
      empty.textContent = '（何も持っていない）';
      list.appendChild(empty);
    } else {
      itemsToShow.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'inventory-item' + (i === this.selectedIndex ? ' selected' : '');

        // 装備中マーク
        let prefix = '  ';
        if (item === player.weapon || item === player.shield) {
          prefix = 'E ';
        }

        // カテゴリ記号
        const catSymbol = getCategorySymbol(item.category);

        row.textContent = `${prefix}${catSymbol} ${getItemDisplayName(item)}`;
        row.dataset.index = i;
        row.addEventListener('click', () => {
          this.selectedIndex = i;
          if (this.inventoryMode === 'enhance_target') {
            this.handleEnhanceTarget(player, itemsToShow[i], gameState);
          } else {
            this.inventoryMode = 'action';
            this.renderInventory(player, gameState);
          }
        });
        list.appendChild(row);
      });
    }
    panel.appendChild(list);

    // アクションメニュー（アイテム選択後）
    if (this.inventoryMode === 'action' && itemsToShow.length > 0) {
      const actionMenu = document.createElement('div');
      actionMenu.className = 'action-menu';

      const item = itemsToShow[this.selectedIndex];
      const actions = this.getAvailableActions(item, player);

      actions.forEach((act) => {
        const btn = document.createElement('button');
        btn.className = 'action-button';
        btn.textContent = act.label;
        btn.addEventListener('click', () => {
          this.handleItemAction(act.action, item, player, gameState);
        });
        actionMenu.appendChild(btn);
      });

      // 戻るボタン
      const backBtn = document.createElement('button');
      backBtn.className = 'action-button';
      backBtn.textContent = '戻る';
      backBtn.addEventListener('click', () => {
        this.inventoryMode = 'main';
        this.renderInventory(player, gameState);
      });
      actionMenu.appendChild(backBtn);

      panel.appendChild(actionMenu);
    }

    // フッター
    const footer = document.createElement('div');
    footer.className = 'inventory-footer';
    footer.textContent = 'Escまたは再度Iで閉じる';
    panel.appendChild(footer);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    this.inventoryOverlay = overlay;

    // キーボード操作のリスナー（重複登録を防ぐ）
    // 古いリスナーがあれば先に除去
    if (this._inventoryKeyHandler) {
      document.removeEventListener('keydown', this._inventoryKeyHandler, true);
    }
    // 現在のitemリストをクロージャでキャプチャした新しいハンドラを作成
    this._inventoryKeyHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleInventoryKey(e, player, gameState, itemsToShow);
    };
    document.addEventListener('keydown', this._inventoryKeyHandler, true);
  }

  /**
   * インベントリのキー操作
   */
  handleInventoryKey(e, player, gameState, itemsToShow) {
    const key = e.code;

    if (key === 'Escape' || key === 'KeyI') {
      this.closeInventory(null);
      return;
    }

    if (this.inventoryMode === 'action') {
      if (key === 'Escape' || key === 'Backspace') {
        this.inventoryMode = 'main';
        this.renderInventory(player, gameState);
        return;
      }
    }

    if (key === 'ArrowUp' || key === 'KeyW' || key === 'Numpad8') {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      this.renderInventory(player, gameState);
    } else if (key === 'ArrowDown' || key === 'KeyS' || key === 'Numpad2') {
      this.selectedIndex = Math.min(itemsToShow.length - 1, this.selectedIndex + 1);
      this.renderInventory(player, gameState);
    } else if (key === 'Enter' || key === 'Space') {
      if (itemsToShow.length === 0) return;

      if (this.inventoryMode === 'enhance_target') {
        this.handleEnhanceTarget(player, itemsToShow[this.selectedIndex], gameState);
      } else if (this.inventoryMode === 'main') {
        this.inventoryMode = 'action';
        this.renderInventory(player, gameState);
      }
    }
  }

  /**
   * カテゴリに応じた使用可能アクションを返す
   */
  getAvailableActions(item, player) {
    const actions = [];

    switch (item.category) {
      case ITEM_CATEGORY.WEAPON:
        if (player.weapon === item) {
          if (!item.cursed) actions.push({ action: 'unequip', label: '外す' });
        } else {
          actions.push({ action: 'equip', label: '装備する' });
        }
        break;

      case ITEM_CATEGORY.SHIELD:
        if (player.shield === item) {
          if (!item.cursed) actions.push({ action: 'unequip', label: '外す' });
        } else {
          actions.push({ action: 'equip', label: '装備する' });
        }
        break;

      case ITEM_CATEGORY.GRASS:
        actions.push({ action: 'use', label: '飲む' });
        break;

      case ITEM_CATEGORY.SCROLL:
        actions.push({ action: 'use', label: '読む' });
        break;

      case ITEM_CATEGORY.FOOD:
        actions.push({ action: 'use', label: '食べる' });
        break;
    }

    actions.push({ action: 'drop', label: '置く' });
    return actions;
  }

  /**
   * アイテムアクションを実行
   */
  handleItemAction(action, item, player, gameState) {
    switch (action) {
      case 'equip':
        this.closeInventory({ action: 'equip', item });
        break;

      case 'unequip':
        this.closeInventory({ action: 'unequip', item });
        break;

      case 'use':
        if (item.category === ITEM_CATEGORY.SCROLL &&
            (item.effect === 'enhance' || item.effect === 'plating')) {
          // 強化/メッキ巻物は対象選択モードに
          this.pendingScrollItem = item;
          this.inventoryMode = 'enhance_target';
          this.selectedIndex = 0;
          this.renderInventory(player, gameState);
          return;
        }
        this.closeInventory({ action: 'use', item });
        break;

      case 'drop':
        this.closeInventory({ action: 'drop', item });
        break;
    }
  }

  /**
   * 強化対象選択の処理
   */
  handleEnhanceTarget(player, targetItem, gameState) {
    this.closeInventory({
      action: 'use',
      item: this.pendingScrollItem,
      targetItem
    });
  }

  /**
   * インベントリを閉じる
   */
  closeInventory(result) {
    this.inventoryOpen = false;
    this.inventoryMode = 'main';
    this.pendingScrollItem = null;

    if (this.inventoryOverlay) {
      this.inventoryOverlay.remove();
      this.inventoryOverlay = null;
    }

    if (this._inventoryKeyHandler) {
      document.removeEventListener('keydown', this._inventoryKeyHandler, true);
      this._inventoryKeyHandler = null;
    }

    if (this.resolveInventory) {
      this.resolveInventory(result);
      this.resolveInventory = null;
    }
  }
}

/**
 * カテゴリ記号を返す
 */
function getCategorySymbol(category) {
  switch (category) {
    case ITEM_CATEGORY.WEAPON: return ')';
    case ITEM_CATEGORY.SHIELD: return '[';
    case ITEM_CATEGORY.GRASS: return '"';
    case ITEM_CATEGORY.SCROLL: return '?';
    case ITEM_CATEGORY.FOOD: return '%';
    case ITEM_CATEGORY.GOLD: return '$';
    default: return ' ';
  }
}
