/**
 * main.js - 初期化・ゲームループ制御
 */

import { GameState, GAME_STATE } from './game.js';
import { Renderer } from './renderer.js';
import { InputHandler, ACTION } from './input.js';
import { UI } from './ui.js';
import { ITEM_CATEGORY } from './item.js';
import { SoundManager, SOUND } from './sound-manager.js';
import { Minimap } from './minimap.js';
import { SceneManager, SCENE } from './scene-manager.js';
import { getDungeonDef } from './data/dungeons.js';
import { SaveManager } from './save.js';
import { TownScene } from './town.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new Renderer(this.canvas);
    this.input = new InputHandler();
    this.ui = new UI();
    this.sound = new SoundManager();
    this.minimap = new Minimap(document.getElementById('minimap-canvas'));
    this.gameState = null;

    this.isRunning = false;
    this.inventoryBusy = false;
    this.soundInitialized = false;

    // セーブマネージャ
    this.saveManager = new SaveManager();

    // シーンマネージャ
    this.sceneManager = new SceneManager();

    // タウンシーン
    this.townScene = new TownScene(this.sceneManager, this.saveManager);

    this.setupScenes();
  }

  /**
   * シーンを登録
   */
  setupScenes() {
    // ダンジョンシーン
    this.sceneManager.register(SCENE.DUNGEON, {
      enter: (data) => this.enterDungeon(data),
      exit: () => this.exitDungeon(),
      update: () => this.updateDungeon(),
      render: () => this.renderDungeon()
    });

    // タウンシーン
    this.sceneManager.register(SCENE.TOWN, {
      enter: (data) => this.townScene.enter(data),
      exit: () => this.townScene.exit(),
      update: () => {},
      render: () => {}
    });
  }

  /**
   * ダンジョンシーンに入る
   */
  enterDungeon(data = {}) {
    const dungeonDef = data.dungeonId
      ? getDungeonDef(data.dungeonId)
      : getDungeonDef('dungeon_1');

    this.ui.clearMessages();

    this.gameState = new GameState(dungeonDef, {
      carryItems: data.carryItems || [],
      carryGold: data.carryGold || 0
    });

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

    // 全画像ロード完了時に再描画
    this.renderer.spriteManager.onAllLoaded = () => {
      this.renderDungeon();
    };

    // 初期視界を更新
    this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);

    // UI更新
    this.ui.updateStatus(this.gameState);
    this.ui.showStartMessage(dungeonDef.name);

    // ゲーム画面を表示
    const gameContainer = document.getElementById('game-container');
    const sidePanel = document.getElementById('side-panel');
    if (gameContainer) gameContainer.style.display = '';
    if (sidePanel) sidePanel.style.display = '';

    // デバッグコマンドをグローバルに公開
    window.debug = this.gameState.debug;

    this.isRunning = true;
    this.inventoryBusy = false;
    this.renderDungeon();
  }

  /**
   * ダンジョンシーンを退出
   */
  exitDungeon() {
    this.isRunning = false;
    this.gameState = null;
  }

  /**
   * ダンジョンシーンの更新
   */
  updateDungeon() {
    if (!this.isRunning) return;
    if (!this.gameState || this.gameState.state !== GAME_STATE.PLAYING) return;
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
          // 最高到達階を更新
          this.saveManager.updateBestFloor(
            this.gameState.dungeonDef.id,
            this.gameState.floor
          );

          // 視界を更新
          this.renderer.updateVisibility(this.gameState.player, this.gameState.dungeon);
        }

        // UI更新
        this.ui.updateStatus(this.gameState);

        // 描画
        this.renderDungeon();
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
      this.renderDungeon();
    }
  }

  /**
   * ダンジョンシーンの描画
   */
  renderDungeon() {
    if (!this.gameState) return;
    this.renderer.render(this.gameState);
    this.minimap.render(this.gameState);
  }

  /**
   * ゲーム状態変更ハンドラ
   */
  async handleStateChange(state) {
    if (state === GAME_STATE.GAME_OVER) {
      const result = await this.ui.showGameOver(
        this.gameState.floor,
        this.gameState.turnCount
      );

      if (result === 'town') {
        this.sceneManager.transition(SCENE.TOWN, { death: true });
      } else {
        // retry
        const dungeonId = this.gameState?.dungeonDef?.id || 'dungeon_1';
        this.sceneManager.transition(SCENE.DUNGEON, { dungeonId });
      }
    } else if (state === GAME_STATE.VICTORY) {
      const dungeonDef = this.gameState.dungeonDef;
      const result = await this.ui.showVictory(
        this.gameState.turnCount,
        dungeonDef.victoryMessage
      );

      // クリア記録
      this.saveManager.markDungeonCleared(dungeonDef.id);

      if (result === 'town') {
        this.sceneManager.transition(SCENE.TOWN, {
          victory: true,
          returnItems: [...this.gameState.player.inventory],
          returnGold: this.gameState.player.gold
        });
      } else {
        // retry
        this.sceneManager.transition(SCENE.DUNGEON, { dungeonId: dungeonDef.id });
      }
    }
  }

  /**
   * ゲームループ開始
   */
  start() {
    // 町からスタート
    this.sceneManager.transition(SCENE.TOWN, {});

    // 入力イベントベースのループ
    const gameLoop = () => {
      this.sceneManager.update();
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
