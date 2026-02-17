/**
 * main.js - 初期化・ゲームループ制御
 */

import { GameState, GAME_STATE } from './game.js';
import { Renderer } from './renderer.js';
import { InputHandler, ACTION } from './input.js';
import { UI } from './ui.js';
import { ITEM_CATEGORY } from './item.js';
import { SoundManager, SOUND } from './sound-manager.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new Renderer(this.canvas);
    this.input = new InputHandler();
    this.ui = new UI();
    this.sound = new SoundManager();
    this.gameState = null;

    this.isRunning = false;
    this.inventoryBusy = false;
    this.soundInitialized = false;
  }

  /**
   * ゲームを初期化
   */
  init() {
    this.gameState = new GameState();

    // メッセージコールバックを設定
    this.gameState.onMessage = ({ text, type }) => {
      this.ui.addMessage(text, type);
    };

    // 状態変更コールバック
    this.gameState.onStateChange = (state) => {
      this.handleStateChange(state);
    };

    // サウンドコールバック
    this.gameState.onSound = (soundKey) => {
      this.sound.play(soundKey);
    };

    // 初期視界を更新
    this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);

    // UI更新
    this.ui.updateStatus(this.gameState);
    this.ui.showStartMessage();

    // デバッグコマンドをグローバルに公開
    window.debug = this.gameState.debug;

    this.isRunning = true;
    this.inventoryBusy = false;
    this.render();
  }

  /**
   * メインループ
   */
  update() {
    if (!this.isRunning) return;
    if (this.gameState.state !== GAME_STATE.PLAYING) return;
    if (this.inventoryBusy) return;

    // 最初のユーザー操作でサウンドシステムを初期化
    if (!this.soundInitialized) {
      this.sound.init();
      this.soundInitialized = true;
    }

    // 入力チェック
    if (this.input.hasAction()) {
      const { action, direction } = this.input.getAction();

      if (action === ACTION.TOGGLE_MUTE) {
        const muted = this.sound.toggleMute();
        this.ui.addMessage(muted ? '音をミュートしました。' : 'ミュートを解除しました。', 'info');
        return;
      }

      if (action === ACTION.INVENTORY) {
        this.openInventory();
        return;
      }

      if (action) {
        // アクション処理
        const turnConsumed = this.gameState.processPlayerAction(action, direction);

        if (turnConsumed) {
          // 視界を更新
          this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);
        }

        // UI更新
        this.ui.updateStatus(this.gameState);

        // 描画
        this.render();
      }
    }
  }

  /**
   * インベントリを開く
   */
  async openInventory() {
    if (this.inventoryBusy) return;
    this.inventoryBusy = true;

    const result = await this.ui.openInventory(this.gameState.player, this.gameState);

    this.inventoryBusy = false;

    if (result) {
      const turnConsumed = this.gameState.processInventoryAction(result);

      if (turnConsumed) {
        this.gameState.processTurn();
        this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);
      }

      this.ui.updateStatus(this.gameState);
      this.render();
    }
  }

  /**
   * 描画
   */
  render() {
    this.renderer.render(this.gameState);
  }

  /**
   * ゲーム状態変更ハンドラ
   */
  async handleStateChange(state) {
    if (state === GAME_STATE.GAME_OVER) {
      const retry = await this.ui.showGameOver(
        this.gameState.floor,
        this.gameState.turnCount
      );
      if (retry) {
        this.restart();
      }
    } else if (state === GAME_STATE.VICTORY) {
      const restart = await this.ui.showVictory(this.gameState.turnCount);
      if (restart) {
        this.restart();
      }
    }
  }

  /**
   * ゲームを再開
   */
  restart() {
    this.ui.clearMessages();
    this.init();
  }

  /**
   * ゲームループ開始
   */
  start() {
    this.init();

    // 入力イベントベースのループ
    const gameLoop = () => {
      this.update();
      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }
}

// ページ読み込み完了後にゲーム開始
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.start();

  // グローバルにゲームインスタンスを公開（デバッグ用）
  window.game = game;
});
