/**
 * ui.js - UI（メニュー・メッセージログ・ステータスバー）
 */

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
    this.addMessage('操作: WASD/矢印で移動、Fで攻撃、Enterで階段を降りる', 'info');
  }
}
