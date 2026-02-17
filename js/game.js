/**
 * game.js - ゲーム全体の状態管理・ターン制ループ制御
 */

import { RNG, generateSeed } from './rng.js';
import { Dungeon, TILE } from './dungeon.js';
import { Player } from './player.js';
import { MonsterManager } from './monster.js';
import { Combat } from './combat.js';
import { ACTION } from './input.js';
import {
  ITEM_CATEGORY,
  createItem,
  getItemDisplayName,
  generateRandomItem,
  placeItemsOnFloor,
  applyGrassEffect,
  applyFoodEffect,
  applyScrollEffect,
  applyEnhanceScroll
} from './item.js';

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

    // フロアアイテム
    this.floorItems = [];
    placeItemsOnFloor(this.floor, this.dungeon, this.rng, this.floorItems);

    // 戦闘システム
    this.combat = new Combat(this.rng);

    // コールバック
    this.onMessage = null;
    this.onStateChange = null;
    this.onFloorChange = null;
    this.onSound = null;
  }

  /**
   * ゲッター
   */
  get monsters() {
    return this.monsterManager.monsters;
  }

  /**
   * サウンドイベントを発火
   * @param {string} soundKey - SOUND定数のキー
   */
  emitSound(soundKey) {
    if (this.onSound) {
      this.onSound(soundKey);
    }
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
        // インベントリはmain.jsのUI側で処理
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
      this.emitSound(result.hit ? 'slash' : 'miss');

      // 分裂チェック（攻撃が命中し、まだ生きている場合）
      if (result.hit && monster.isAlive) {
        const splitResult = this.monsterManager.handleSplit(monster, this.dungeon, this.player);
        if (splitResult) {
          this.addMessage(splitResult.message, 'info');
        }
      }

      if (result.killed) {
        this.emitSound('monster_death');

        // 乗り移りチェック（亡霊武者・悪霊武者）
        const possessResult = this.monsterManager.handlePossessOnDeath(monster, this.player);
        if (possessResult) {
          this.addMessage(possessResult.message, 'important');
        }

        const prevLevel = this.player.level;
        this.player.gainExp(result.exp);
        if (this.player.level > prevLevel) {
          this.emitSound('levelup');
          this.addMessage(`レベルが${this.player.level}に上がった！`, 'important');
        }
        this.monsterManager.removeDeadMonsters();

        // ドロップ判定（10%）
        if (this.rng.chance(0.1)) {
          const dropItem = generateRandomItem(this.floor, this.rng, {
            x: monster.x,
            y: monster.y,
            onFloor: true
          });
          if (dropItem) {
            this.floorItems.push(dropItem);
          }
        }
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
    this.emitSound('footstep');

    // 移動先にアイテムがあるか通知
    const itemOnFloor = this.floorItems.find(
      it => it.x === this.player.x && it.y === this.player.y
    );
    if (itemOnFloor) {
      this.addMessage(`足元に${getItemDisplayName(itemOnFloor)}がある。`, 'info');
    }

    return true;
  }

  /**
   * 攻撃処理（向いている方向）
   */
  handleAttack() {
    // 攻撃対象を取得
    const target = this.combat.getAttackTarget(this.player, this.player.direction, this.monsters);
    const result = this.combat.attackInDirection(this.player, this.monsters);
    this.addMessage(result.message, result.hit ? 'damage' : 'info');

    // 分裂チェック
    if (target && result.hit && target.isAlive) {
      const splitResult = this.monsterManager.handleSplit(target, this.dungeon, this.player);
      if (splitResult) {
        this.addMessage(splitResult.message, 'info');
      }
    }

    if (result.killed && target) {
      this.emitSound('monster_death');

      // 乗り移りチェック
      const possessResult = this.monsterManager.handlePossessOnDeath(target, this.player);
      if (possessResult) {
        this.addMessage(possessResult.message, 'important');
      }

      const prevLevel = this.player.level;
      this.player.gainExp(result.exp);
      if (this.player.level > prevLevel) {
        this.emitSound('levelup');
        this.addMessage(`レベルが${this.player.level}に上がった！`, 'important');
      }
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

    // 足元のアイテムをチェック
    const itemIndex = this.floorItems.findIndex(it => it.x === px && it.y === py);
    if (itemIndex >= 0) {
      const item = this.floorItems[itemIndex];

      // お金の場合は直接加算
      if (item.category === ITEM_CATEGORY.GOLD) {
        this.player.gold += item.amount;
        this.floorItems.splice(itemIndex, 1);
        this.addMessage(`${item.amount}銭を拾った！`, 'info');
        this.emitSound('gold_pickup');
        return true;
      }

      // インベントリ上限チェック
      if (this.player.inventory.length >= this.player.maxInventory) {
        this.addMessage('持ち物がいっぱいで拾えない！', 'info');
        return false;
      }

      // 拾う
      item.onFloor = false;
      item.x = -1;
      item.y = -1;
      this.player.inventory.push(item);
      this.floorItems.splice(itemIndex, 1);
      this.addMessage(`${getItemDisplayName(item)}を拾った。`, 'info');
      this.emitSound('item_pickup');
      return true;
    }

    // 階段チェック
    if (this.dungeon.map[py][px] === TILE.STAIRS) {
      this.emitSound('stairs');
      this.descendStairs();
      return true;
    }

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
      this.emitSound('levelup');
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

    // アイテムを再配置
    this.floorItems = [];
    placeItemsOnFloor(this.floor, this.dungeon, this.rng, this.floorItems);

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
      return;
    }

    const item = this.floorItems.find(it => it.x === px && it.y === py);
    if (item) {
      this.addMessage(`足元に${getItemDisplayName(item)}がある。`, 'info');
      return;
    }

    this.addMessage('特に何もない。', 'info');
  }

  /**
   * インベントリアクションを処理
   * @returns {boolean} ターン消費したか
   */
  processInventoryAction(result) {
    if (!result) return false;

    const { action, item, targetItem } = result;

    switch (action) {
      case 'equip':
        return this.equipItem(item);

      case 'unequip':
        return this.unequipItem(item);

      case 'use':
        return this.useItem(item, targetItem);

      case 'drop':
        return this.dropItem(item);
    }

    return false;
  }

  /**
   * 装備する
   */
  equipItem(item) {
    if (item.category === ITEM_CATEGORY.WEAPON) {
      // 現在装備中の武器があれば外す
      if (this.player.weapon && this.player.weapon.cursed) {
        this.addMessage('呪われていて外せない！', 'damage');
        return false;
      }
      this.player.weapon = item;
      this.addMessage(`${getItemDisplayName(item)}を装備した。`, 'info');
      this.emitSound('equip');
      return true;
    }

    if (item.category === ITEM_CATEGORY.SHIELD) {
      if (this.player.shield && this.player.shield.cursed) {
        this.addMessage('呪われていて外せない！', 'damage');
        return false;
      }
      this.player.shield = item;
      this.addMessage(`${getItemDisplayName(item)}を装備した。`, 'info');
      this.emitSound('equip');
      return true;
    }

    return false;
  }

  /**
   * 装備を外す
   */
  unequipItem(item) {
    if (item.cursed) {
      this.addMessage('呪われていて外せない！', 'damage');
      return false;
    }

    if (this.player.weapon === item) {
      this.player.weapon = null;
      this.addMessage(`${getItemDisplayName(item)}を外した。`, 'info');
      this.emitSound('unequip');
      return true;
    }

    if (this.player.shield === item) {
      this.player.shield = null;
      this.addMessage(`${getItemDisplayName(item)}を外した。`, 'info');
      this.emitSound('unequip');
      return true;
    }

    return false;
  }

  /**
   * アイテムを使用
   */
  useItem(item, targetItem) {
    const removeFromInventory = () => {
      const idx = this.player.inventory.indexOf(item);
      if (idx >= 0) this.player.inventory.splice(idx, 1);
      // 装備中のものを消費した場合
      if (this.player.weapon === item) this.player.weapon = null;
      if (this.player.shield === item) this.player.shield = null;
    };

    let messages = [];

    switch (item.category) {
      case ITEM_CATEGORY.GRASS:
        messages = applyGrassEffect(item, this.player, this);
        removeFromInventory();
        this.emitSound('grass_use');
        break;

      case ITEM_CATEGORY.FOOD:
        messages = applyFoodEffect(item, this.player);
        removeFromInventory();
        this.emitSound('food_eat');
        break;

      case ITEM_CATEGORY.SCROLL:
        if (item.effect === 'enhance' && targetItem) {
          messages = applyEnhanceScroll(item, targetItem);
          removeFromInventory();
        } else if (item.effect === 'plating' && targetItem) {
          targetItem.rustproof = true;
          messages = [`${getItemDisplayName(targetItem)}に錆止めを付けた！`];
          removeFromInventory();
        } else {
          messages = applyScrollEffect(item, this.player, this);
          // 対象選択が必要な巻物はまだ消費しない
          if (!messages.includes('_NEED_TARGET_EQUIP') && !messages.includes('_NEED_TARGET_ITEM')) {
            removeFromInventory();
          } else {
            // 対象選択が必要 - UI側で処理
            return false;
          }
        }
        this.emitSound('scroll_use');
        break;

      default:
        this.addMessage('それは使えない。', 'info');
        return false;
    }

    for (const msg of messages) {
      this.addMessage(msg, msg.includes('ダメージ') || msg.includes('下がった') ? 'damage' : 'info');
    }

    // 復活の種チェック: 使用後に死亡していないか
    this.checkPlayerDeath();

    return true;
  }

  /**
   * アイテムを置く
   */
  dropItem(item) {
    // 呪われた装備は外せない
    if ((this.player.weapon === item || this.player.shield === item) && item.cursed) {
      this.addMessage('呪われていて置けない！', 'damage');
      return false;
    }

    // 装備中なら外す
    if (this.player.weapon === item) this.player.weapon = null;
    if (this.player.shield === item) this.player.shield = null;

    // インベントリから除去
    const idx = this.player.inventory.indexOf(item);
    if (idx >= 0) this.player.inventory.splice(idx, 1);

    // フロアに置く
    item.x = this.player.x;
    item.y = this.player.y;
    item.onFloor = true;
    this.floorItems.push(item);

    this.addMessage(`${getItemDisplayName(item)}を足元に置いた。`, 'info');
    return true;
  }

  /**
   * プレイヤー死亡チェック（復活の種対応）
   */
  checkPlayerDeath() {
    if (!this.player.isAlive && this.player.hasRevival) {
      this.player.hasRevival = false;
      this.player.hp = this.player.maxHp;
      this.player.isAlive = true;
      this.addMessage('復活の種の力で蘇った！', 'important');
    }
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
      this.combat,
      this
    );

    for (const result of results) {
      if (result.message) {
        this.addMessage(result.message, result.hit ? 'damage' : 'info');
      }
      if (result.hit) {
        this.emitSound('player_hit');
      }
    }

    // プレイヤー死亡チェック（復活の種対応）
    this.checkPlayerDeath();
    if (!this.player.isAlive) {
      this.state = GAME_STATE.GAME_OVER;
      this.addMessage('冒険は失敗に終わった...', 'important');
      this.emitSound('player_death');
      if (this.onStateChange) {
        this.onStateChange(this.state);
      }
      return;
    }

    // 満腹度減少（10ターンに1）
    // 満腹の盾装備時は20ターンに1
    const fullnessInterval = this.player.hasFullnessShield() ? 20 : 10;
    if (this.turnCount % fullnessInterval === 0) {
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
      this.player.naturalHeal();
    }

    // 状態異常ターン経過
    this.player.tickStatusEffects();

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
    },

    giveItem: (id, category) => {
      const item = createItem(id, category);
      if (item) {
        this.player.inventory.push(item);
        this.addMessage(`[DEBUG] ${getItemDisplayName(item)}を入手した。`, 'info');
      }
    }
  };
}
