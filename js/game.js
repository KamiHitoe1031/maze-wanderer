/**
 * game.js - ゲーム全体の状態管理・ターン制ループ制御
 */

import { RNG, generateSeed } from './rng.js';
import { Dungeon, TILE } from './dungeon.js';
import { Player } from './player.js';
import { MonsterManager } from './monster.js';
import { Combat } from './combat.js';
import { ACTION } from './input.js';

// ゲーム状態
export const GAME_STATE = {
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
  VICTORY: 'victory',
  PAUSED: 'paused'
};

export class GameState {
  constructor() {
    this.seed = generateSeed();
    this.rng = new RNG(this.seed);

    this.floor = 1;
    this.maxFloor = 20;
    this.turnCount = 0;

    this.state = GAME_STATE.PLAYING;
    this.messages = [];
    this.maxMessages = 5;

    // ダンジョン生成
    this.dungeon = new Dungeon(this.floor, this.rng).generate();

    // プレイヤー生成
    const startPos = this.dungeon.playerStartPos;
    this.player = new Player(startPos.x, startPos.y);

    // モンスター管理
    this.monsterManager = new MonsterManager();
    this.monsterManager.initFloor(this.floor, this.dungeon, this.rng, this.player);

    // 戦闘システム
    this.combat = new Combat(this.rng);

    // コールバック
    this.onMessage = null;
    this.onStateChange = null;
    this.onFloorChange = null;
  }

  /**
   * ゲッター
   */
  get monsters() {
    return this.monsterManager.monsters;
  }

  /**
   * メッセージを追加
   */
  addMessage(text, type = 'normal') {
    this.messages.push({ text, type, turn: this.turnCount });
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }
    if (this.onMessage) {
      this.onMessage({ text, type });
    }
  }

  /**
   * プレイヤーアクションを処理
   */
  processPlayerAction(action, direction) {
    if (this.state !== GAME_STATE.PLAYING) return false;

    let turnConsumed = false;

    switch (action) {
      case ACTION.MOVE:
        turnConsumed = this.handleMove(direction);
        break;

      case ACTION.ATTACK:
        turnConsumed = this.handleAttack();
        break;

      case ACTION.WAIT:
        turnConsumed = this.handleWait();
        break;

      case ACTION.PICKUP:
        turnConsumed = this.handlePickup();
        break;

      case ACTION.EXAMINE:
        this.handleExamine();
        break;

      case ACTION.INVENTORY:
        this.handleInventory();
        break;
    }

    if (turnConsumed) {
      this.processTurn();
    }

    return turnConsumed;
  }

  /**
   * 移動処理
   */
  handleMove(direction) {
    if (!direction) return false;

    const newX = this.player.x + direction.dx;
    const newY = this.player.y + direction.dy;

    // モンスターがいる場合は攻撃
    const monster = this.monsterManager.getMonsterAt(newX, newY);
    if (monster) {
      const result = this.combat.playerAttack(this.player, monster);
      this.addMessage(result.message, result.hit ? 'damage' : 'info');

      if (result.killed) {
        this.player.gainExp(result.exp);
        this.monsterManager.removeDeadMonsters();
      }

      // 向きを更新
      this.player.direction = direction;
      return true;
    }

    // 移動可能かチェック
    if (!this.dungeon.isWalkable(newX, newY)) {
      return false;
    }

    // 移動
    this.player.move(direction.dx, direction.dy);
    return true;
  }

  /**
   * 攻撃処理（向いている方向）
   */
  handleAttack() {
    const result = this.combat.attackInDirection(this.player, this.monsters);
    this.addMessage(result.message, result.hit ? 'damage' : 'info');

    if (result.killed) {
      this.player.gainExp(result.exp);
      this.monsterManager.removeDeadMonsters();
    }

    return true;
  }

  /**
   * 待機処理
   */
  handleWait() {
    this.addMessage('足踏みした。', 'info');
    return true;
  }

  /**
   * 拾う/階段を降りる処理
   */
  handlePickup() {
    const px = this.player.x;
    const py = this.player.y;

    // 階段チェック
    if (this.dungeon.map[py][px] === TILE.STAIRS) {
      this.descendStairs();
      return true;
    }

    // アイテム拾い（Phase 2で実装）
    this.addMessage('足元には何もない。', 'info');
    return false;
  }

  /**
   * 階段を降りる
   */
  descendStairs() {
    this.floor++;

    if (this.floor > this.maxFloor) {
      // クリア
      this.state = GAME_STATE.VICTORY;
      this.addMessage('霧幻の塔を踏破した！おめでとう！', 'important');
      if (this.onStateChange) {
        this.onStateChange(this.state);
      }
      return;
    }

    this.addMessage(`${this.floor}階に降りた。`, 'important');

    // 新しいフロアを生成
    this.dungeon = new Dungeon(this.floor, this.rng).generate();

    // プレイヤー位置をリセット
    const startPos = this.dungeon.playerStartPos;
    this.player.setPosition(startPos.x, startPos.y);

    // モンスターを再配置
    this.monsterManager.initFloor(this.floor, this.dungeon, this.rng, this.player);

    if (this.onFloorChange) {
      this.onFloorChange(this.floor);
    }
  }

  /**
   * 足元を調べる
   */
  handleExamine() {
    const px = this.player.x;
    const py = this.player.y;
    const tile = this.dungeon.map[py][px];

    if (tile === TILE.STAIRS) {
      this.addMessage('階段がある。', 'info');
    } else {
      this.addMessage('特に何もない。', 'info');
    }
  }

  /**
   * インベントリを開く（Phase 2で実装）
   */
  handleInventory() {
    this.addMessage('持ち物（未実装）', 'info');
  }

  /**
   * ターン終了処理
   */
  processTurn() {
    this.turnCount++;

    // モンスター行動
    const results = this.monsterManager.processActions(
      this.player,
      this.dungeon,
      this.combat
    );

    for (const result of results) {
      if (result.message) {
        this.addMessage(result.message, result.hit ? 'damage' : 'info');
      }
    }

    // プレイヤー死亡チェック
    if (!this.player.isAlive) {
      this.state = GAME_STATE.GAME_OVER;
      this.addMessage('冒険は失敗に終わった...', 'important');
      if (this.onStateChange) {
        this.onStateChange(this.state);
      }
      return;
    }

    // 満腹度減少（10ターンに1）
    if (this.turnCount % 10 === 0) {
      this.player.reduceFullness(1);
    }

    // 飢餓ダメージ
    if (this.player.fullness <= 0) {
      this.player.starvationDamage();
      if (this.turnCount % 5 === 0) {
        this.addMessage('お腹が空いて力が出ない...', 'damage');
      }
    }

    // HP自然回復（部屋にいるとき）
    if (this.dungeon.isInRoom(this.player.x, this.player.y)) {
      const healed = this.player.naturalHeal();
      // 回復メッセージは省略
    }

    // モンスター自然発生
    this.monsterManager.tickSpawn(this.floor, this.dungeon, this.rng, this.player);
  }

  /**
   * デバッグコマンド
   */
  debug = {
    revealMap: () => {
      for (let y = 0; y < this.dungeon.explored.length; y++) {
        for (let x = 0; x < this.dungeon.explored[y].length; x++) {
          this.dungeon.explored[y][x] = true;
        }
      }
    },

    setFloor: (n) => {
      this.floor = n - 1;
      this.descendStairs();
    },

    setLevel: (n) => {
      while (this.player.level < n) {
        this.player.gainExp(1000);
      }
    },

    killAll: () => {
      for (const monster of this.monsters) {
        monster.isAlive = false;
      }
      this.monsterManager.removeDeadMonsters();
    },

    heal: () => {
      this.player.hp = this.player.maxHp;
    },

    spawnMonster: (id) => {
      const pos = this.dungeon.getRandomWalkablePosition();
      if (pos) {
        this.monsterManager.spawn(id, pos.x, pos.y);
      }
    }
  };
}
