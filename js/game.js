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
import { getDungeonDef } from './data/dungeons.js';
import { TrapManager } from './trap.js';

// ゲーム状態
export const GAME_STATE = {
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
  VICTORY: 'victory',
  PAUSED: 'paused'
};

export class GameState {
  /**
   * @param {object} dungeonDef - ダンジョン定義（data/dungeons.js）
   * @param {object} options - { carryItems, carryGold }
   */
  constructor(dungeonDef = null, options = {}) {
    this.dungeonDef = dungeonDef || getDungeonDef('dungeon_1');

    this.seed = generateSeed();
    this.rng = new RNG(this.seed);

    this.floor = 1;
    this.maxFloor = this.dungeonDef.maxFloor;
    this.turnCount = 0;

    this.state = GAME_STATE.PLAYING;
    this.messages = [];
    this.maxMessages = 5;

    // ダンジョン生成
    this.dungeon = new Dungeon(this.floor, this.rng, this.dungeonDef.theme).generate();

    // プレイヤー生成
    const startPos = this.dungeon.playerStartPos;
    this.player = new Player(startPos.x, startPos.y);

    // 町から持ち込んだアイテム・お金を反映
    if (options.carryItems && options.carryItems.length > 0) {
      for (const item of options.carryItems) {
        item.onFloor = false;
        item.x = -1;
        item.y = -1;
        this.player.inventory.push(item);
      }
    }
    if (options.carryGold) {
      this.player.gold += options.carryGold;
    }

    // モンスター管理
    this.monsterManager = new MonsterManager();
    this.monsterManager.initFloor(this.floor, this.dungeon, this.rng, this.player, this.dungeonDef.id);

    // フロアアイテム
    this.floorItems = [];
    placeItemsOnFloor(this.floor, this.dungeon, this.rng, this.floorItems);

    // 戦闘システム
    this.combat = new Combat(this.rng);

    // 罠管理
    this.trapManager = new TrapManager();
    this.trapManager.placeTraps(this.dungeon, this.rng, this.floor, this.dungeonDef.id);

    // コールバック
    this.onMessage = null;
    this.onStateChange = null;
    this.onFloorChange = null;
    this.onSound = null;
    this.onEffect = null;
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
   * エフェクトイベントを発火
   * @param {string} effectKey - エフェクトキー（'slash','damage','fire_breath'等）
   * @param {number} x - ワールドX座標
   * @param {number} y - ワールドY座標
   */
  emitEffect(effectKey, x, y) {
    if (this.onEffect) {
      this.onEffect({ effectKey, x, y });
    }
  }

  /**
   * 装備中武器に対応するエフェクトキーを取得
   */
  getWeaponEffectKey() {
    const weapon = this.player.weapon;
    if (!weapon) return 'slash';

    // 印由来の攻撃タイプも考慮
    let attackType = weapon.attackType || 'melee';
    if (attackType === 'melee' && weapon.seals) {
      for (const seal of weapon.seals) {
        if (seal.startsWith('attackType:')) {
          attackType = seal.split(':')[1];
          break;
        }
      }
    }

    switch (attackType) {
      case 'bow':       return 'bullet';
      case 'spear':     return 'slash';
      case 'whip':      return 'wind';
      case 'hammer':    return 'blunt';
      case 'dagger':    return 'slash';
      case 'boomerang': return 'wind';
      case 'kamaitachi': return 'wind';
      default:          return 'slash';
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

      if (result.hit) {
        this.emitEffect(this.getWeaponEffectKey(), monster.x, monster.y);
      }

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
          this.emitEffect('levelup', this.player.x, this.player.y);
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

    // 罠チェック
    const trapResult = this.trapManager.checkTrap(this.player.x, this.player.y, this.player, this);
    if (trapResult && trapResult.activated) {
      this.addMessage(trapResult.message, trapResult.type);
      this.emitSound('trap');

      // 落とし穴で次のフロアへ
      if (trapResult.floorSkip) {
        this.nextFloor();
        return true;
      }

      this.checkPlayerDeath();
    }

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
    // 武器タイプに応じた攻撃を解決
    const results = this.combat.resolveWeaponAttack(this.player, this.monsters, this.dungeon);

    let anyKilled = false;
    let totalExp = 0;

    for (const result of results) {
      this.addMessage(result.message, result.hit ? 'damage' : 'info');

      const target = result.target;

      if (result.hit && target) {
        this.emitEffect(this.getWeaponEffectKey(), target.x, target.y);
      }

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

        anyKilled = true;
        totalExp += result.exp;
      }
    }

    if (anyKilled) {
      const prevLevel = this.player.level;
      this.player.gainExp(totalExp);
      if (this.player.level > prevLevel) {
        this.emitSound('levelup');
        this.emitEffect('levelup', this.player.x, this.player.y);
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
      this.addMessage(this.dungeonDef.victoryMessage, 'important');
      this.emitSound('levelup');
      if (this.onStateChange) {
        this.onStateChange(this.state);
      }
      return;
    }

    this.addMessage(`${this.floor}階に降りた。`, 'important');

    // 新しいフロアを生成
    this.dungeon = new Dungeon(this.floor, this.rng, this.dungeonDef.theme).generate();

    // プレイヤー位置をリセット
    const startPos = this.dungeon.playerStartPos;
    this.player.setPosition(startPos.x, startPos.y);

    // モンスターを再配置
    this.monsterManager.initFloor(this.floor, this.dungeon, this.rng, this.player, this.dungeonDef.id);

    // アイテムを再配置
    this.floorItems = [];
    placeItemsOnFloor(this.floor, this.dungeon, this.rng, this.floorItems);

    // 罠を再配置
    this.trapManager.placeTraps(this.dungeon, this.rng, this.floor, this.dungeonDef.id);

    if (this.onFloorChange) {
      this.onFloorChange(this.floor);
    }
  }

  /**
   * 次のフロアへ進む（落とし穴用）
   */
  nextFloor() {
    this.descendStairs();
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

      case 'pot_insert':
        return this.potInsert(item, targetItem);

      case 'pot_extract':
        return this.potExtract(item);

      case 'shoot':
        return this.shootArrow(item);
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

    if (item.category === ITEM_CATEGORY.RING) {
      // 空きスロットに装備、なければring1を上書き
      if (!this.player.ring1) {
        this.player.ring1 = item;
      } else if (!this.player.ring2) {
        this.player.ring2 = item;
      } else {
        // 両方埋まっている場合、ring1の呪い確認
        if (this.player.ring1.cursed) {
          if (this.player.ring2.cursed) {
            this.addMessage('腕輪が外せない！', 'damage');
            return false;
          }
          this.player.ring2 = item;
        } else {
          this.player.ring1 = item;
        }
      }
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

    if (this.player.ring1 === item) {
      this.player.ring1 = null;
      this.addMessage(`${getItemDisplayName(item)}を外した。`, 'info');
      this.emitSound('unequip');
      return true;
    }

    if (this.player.ring2 === item) {
      this.player.ring2 = null;
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
        // 回復系の草はヒールエフェクト
        if (['heal_grass', 'good_grass', 'revival_grass', 'forest_herb', 'sea_kelp'].includes(item.id)) {
          this.emitEffect('heal', this.player.x, this.player.y);
        }
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

      case ITEM_CATEGORY.POT:
        if (item.effect === 'heal') {
          const healAmount = 50 + item.contents.length * 30;
          this.player.heal(healAmount);
          messages = [`回復の壺を割った！HPが${healAmount}回復した！`];
          this.emitEffect('heal', this.player.x, this.player.y);
          removeFromInventory();
        } else {
          this.addMessage('それは使えない。', 'info');
          return false;
        }
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
    const isEquipped = item === this.player.weapon || item === this.player.shield ||
      item === this.player.ring1 || item === this.player.ring2;
    if (isEquipped && item.cursed) {
      this.addMessage('呪われていて置けない！', 'damage');
      return false;
    }

    // 装備中なら外す
    if (this.player.weapon === item) this.player.weapon = null;
    if (this.player.shield === item) this.player.shield = null;
    if (this.player.ring1 === item) this.player.ring1 = null;
    if (this.player.ring2 === item) this.player.ring2 = null;

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
   * 壺にアイテムを入れる
   */
  potInsert(pot, targetItem) {
    if (!pot || !targetItem) return false;
    if (pot.contents.length >= pot.capacity) {
      this.addMessage('壺がいっぱいだ。', 'info');
      return false;
    }

    // インベントリからターゲットを除去
    const idx = this.player.inventory.indexOf(targetItem);
    if (idx >= 0) this.player.inventory.splice(idx, 1);

    // 壺の効果を適用
    switch (pot.effect) {
      case 'storage':
        pot.contents.push(targetItem);
        this.addMessage(`${getItemDisplayName(targetItem)}を${getItemDisplayName(pot)}に入れた。`, 'info');
        break;

      case 'identify':
        // 未識別システム用（Phase 3）- 現時点では保存のみ
        pot.contents.push(targetItem);
        this.addMessage(`${getItemDisplayName(targetItem)}を識別した！`, 'info');
        break;

      case 'synthesis': {
        pot.contents.push(targetItem);
        this.addMessage(`${getItemDisplayName(targetItem)}を${getItemDisplayName(pot)}に入れた。`, 'info');

        // 同種装備が2つ以上入ったら合成を実行
        const weapons = pot.contents.filter(it => it.category === ITEM_CATEGORY.WEAPON);
        const shields = pot.contents.filter(it => it.category === ITEM_CATEGORY.SHIELD);

        const synthesize = (items) => {
          if (items.length < 2) return;
          const base = items[0];
          base.seals = base.seals || [];
          const maxSeals = base.slots || 4;
          const sealsBefore = base.seals.length;

          for (let i = 1; i < items.length; i++) {
            const material = items[i];
            // 強化値を合算
            base.enhance = (base.enhance || 0) + (material.enhance || 0);

            // 素材の固有効果（effect）を印として移植
            if (material.effect && material.effect !== base.effect) {
              if (base.seals.length < maxSeals && !base.seals.includes(material.effect)) {
                base.seals.push(material.effect);
              }
            }

            // 素材の特殊攻撃タイプを印として移植（kamaitachi, dagger等）
            if (material.attackType && material.attackType !== 'melee' && material.attackType !== base.attackType) {
              const atkSeal = `attackType:${material.attackType}`;
              if (base.seals.length < maxSeals && !base.seals.includes(atkSeal)) {
                base.seals.push(atkSeal);
              }
            }

            // 素材が既に持っている印も移植
            if (material.seals && material.seals.length > 0) {
              for (const seal of material.seals) {
                if (base.seals.length < maxSeals && !base.seals.includes(seal)) {
                  base.seals.push(seal);
                }
              }
            }

            // 特殊プロパティの移植（錆止め等）
            if (material.rustproof) base.rustproof = true;
          }

          const newSeals = base.seals.length - sealsBefore;
          let msg = `${getItemDisplayName(base)}に合成された！（強化値+${base.enhance}`;
          if (newSeals > 0) msg += `、印${newSeals}個移植`;
          msg += '）';
          this.addMessage(msg, 'important');
          this.emitEffect('levelup', this.player.x, this.player.y);
          // 壺の中身をベースだけに
          pot.contents = [base];
        };

        if (weapons.length >= 2) synthesize(weapons);
        if (shields.length >= 2) synthesize(shields);
        break;
      }

      case 'warehouse':
        // 直接倉庫に送る（SaveManager経由）
        this.addMessage(`${getItemDisplayName(targetItem)}を倉庫に送った！`, 'important');
        break;

      case 'curse':
        targetItem.cursed = true;
        pot.contents.push(targetItem);
        this.addMessage(`${getItemDisplayName(targetItem)}は呪われてしまった...`, 'damage');
        break;

      default:
        pot.contents.push(targetItem);
        break;
    }

    return true;
  }

  /**
   * 壺からアイテムを出す（保存の壺のみ）
   */
  potExtract(pot) {
    if (!pot || pot.contents.length === 0) {
      this.addMessage('壺の中は空だ。', 'info');
      return false;
    }

    if (this.player.inventory.length >= this.player.maxInventory) {
      this.addMessage('持ち物がいっぱいで出せない。', 'info');
      return false;
    }

    // 最後のアイテムを取り出す
    const extracted = pot.contents.pop();
    this.player.inventory.push(extracted);
    this.addMessage(`${getItemDisplayName(extracted)}を取り出した。`, 'info');
    return true;
  }

  /**
   * 矢を撃つ
   */
  shootArrow(item) {
    if (!item || item.count <= 0) return false;

    const dir = this.player.direction;
    let target = null;

    // 直線上のモンスターを探す
    for (let i = 1; i <= 10; i++) {
      const tx = this.player.x + dir.dx * i;
      const ty = this.player.y + dir.dy * i;

      if (this.dungeon.isWall(tx, ty)) break;

      const m = this.monsters.find(m => m.isAlive && m.x === tx && m.y === ty);
      if (m) {
        target = m;
        break;
      }
    }

    // 矢を消費
    item.count--;
    if (item.count <= 0) {
      const idx = this.player.inventory.indexOf(item);
      if (idx >= 0) this.player.inventory.splice(idx, 1);
    }

    if (!target) {
      this.addMessage(`${item.name}は何にも当たらなかった。`, 'info');
      return true;
    }

    // ダメージ計算
    const damage = Math.max(1, item.baseDamage);
    target.takeDamage(damage);
    this.addMessage(`${target.name}に${item.name}が当たり${damage}のダメージ！`, 'damage');
    this.emitEffect('bullet', target.x, target.y);

    // 矢の特殊効果
    if (item.arrowEffect === 'poison' && target.isAlive) {
      target.statusEffects = target.statusEffects || [];
      // モンスターのちから低下（攻撃力ダウン）
      this.addMessage(`${target.name}は毒を受けた！`, 'damage');
    }

    if (item.arrowEffect === 'paralyze' && target.isAlive) {
      target.statusEffects = target.statusEffects || [];
      target.statusEffects.push({ type: 'paralyze', remaining: 5 });
      this.addMessage(`${target.name}は金縛りになった！`, 'info');
    }

    if (!target.isAlive) {
      this.emitSound('monster_death');
      const prevLevel = this.player.level;
      this.player.gainExp(target.exp);
      this.addMessage(`${target.name}を倒した！経験値${target.exp}を獲得！`, 'important');
      if (this.player.level > prevLevel) {
        this.emitSound('levelup');
        this.emitEffect('levelup', this.player.x, this.player.y);
        this.addMessage(`レベルが${this.player.level}に上がった！`, 'important');
      }
      this.monsterManager.removeDeadMonsters();
    }

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
        this.emitEffect(result.effectKey || 'damage', this.player.x, this.player.y);
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

    // 深緑の迷宮：床タイル上で植物回復（+1 HP/ターン）
    if (this.dungeonDef.theme === 'forest' && this.dungeon.isInRoom(this.player.x, this.player.y)) {
      if (this.player.hp < this.player.maxHp) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 1);
      }
    }

    // 状態異常ターン経過
    this.player.tickStatusEffects();

    // モンスター状態異常ターン経過
    for (const monster of this.monsters) {
      if (!monster.isAlive) continue;
      const tickResults = monster.tickStatusEffects();
      for (const result of tickResults) {
        if (result.type === 'poison') {
          this.addMessage(`${monster.name}は毒で${result.damage}ダメージを受けた！`);
        } else if (result.type === 'burn') {
          this.addMessage(`${monster.name}は火傷で${result.damage}ダメージを受けた！`);
        }
      }
      if (!monster.isAlive) {
        this.addMessage(`${monster.name}は倒れた！`);
      }
    }
    this.monsterManager.removeDeadMonsters();

    // モンスター自然発生
    this.monsterManager.tickSpawn(this.floor, this.dungeon, this.rng, this.player, this.dungeonDef.id);
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
