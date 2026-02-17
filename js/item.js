/**
 * item.js - アイテム生成・効果適用
 */

import { WEAPON_DATA } from './data/weapons.js';
import { SHIELD_DATA } from './data/shields.js';
import { GRASS_DATA } from './data/grasses.js';
import { SCROLL_DATA } from './data/scrolls.js';
import { FOOD_DATA } from './data/food.js';
import { RING_DATA } from './data/rings.js';
import { POT_DATA } from './data/pots.js';
import { ARROW_DATA } from './data/arrows.js';
import { WAND_DATA } from './data/wands.js';
import { SEAL_DATA, getSealDisplayChar } from './data/seals.js';

// アイテムカテゴリ
export const ITEM_CATEGORY = {
  WEAPON: 'weapon',
  SHIELD: 'shield',
  GRASS: 'grass',
  SCROLL: 'scroll',
  FOOD: 'food',
  RING: 'ring',
  POT: 'pot',
  ARROW: 'arrow',
  WAND: 'wand',
  GOLD: 'gold'
};

// ユニークID生成用カウンタ
let itemIdCounter = 0;

/**
 * アイテムIDカウンタを取得（セーブ用）
 */
export function getItemIdCounter() {
  return itemIdCounter;
}

/**
 * アイテムIDカウンタを設定（ロード用、衝突回避）
 */
export function setItemIdCounter(n) {
  itemIdCounter = n;
}

/**
 * アイテムインスタンスを生成
 */
export function createItem(dataId, category, options = {}) {
  const data = getItemDataByCategory(dataId, category);
  if (!data) return null;

  const item = {
    uid: ++itemIdCounter,
    id: data.id,
    category: category,
    name: data.name,
    spriteKey: data.spriteKey,
    buyPrice: data.buyPrice,
    sellPrice: data.sellPrice,
    description: data.description,
    cursed: false,

    // 位置（フロア上の場合）
    x: options.x ?? -1,
    y: options.y ?? -1,
    onFloor: options.onFloor ?? false
  };

  // カテゴリ別プロパティ
  switch (category) {
    case ITEM_CATEGORY.WEAPON:
      item.baseAtk = data.baseAtk;
      item.enhance = options.enhance ?? 0;
      item.slots = data.slots;
      item.effect = data.effect;
      item.attackType = data.attackType || 'melee';
      if (data.range) item.range = data.range;
      item.seals = [];
      break;

    case ITEM_CATEGORY.SHIELD:
      item.baseDef = data.baseDef;
      item.enhance = options.enhance ?? 0;
      item.slots = data.slots;
      item.effect = data.effect;
      item.seals = [];
      break;

    case ITEM_CATEGORY.GRASS:
      item.effect = data.effect;
      item.healAmount = data.healAmount || 0;
      item.maxHpUp = data.maxHpUp || 0;
      item.levelUp = data.levelUp || 0;
      item.duration = data.duration || 0;
      item.damage = data.damage || 0;
      break;

    case ITEM_CATEGORY.SCROLL:
      item.effect = data.effect;
      item.enhanceAmount = data.enhanceAmount || 0;
      item.damage = data.damage || 0;
      break;

    case ITEM_CATEGORY.FOOD:
      item.fullnessRestore = data.fullnessRestore;
      item.hpRestore = data.hpRestore;
      item.maxFullnessUp = data.maxFullnessUp;
      item.strengthChange = data.strengthChange;
      item.damage = data.damage;
      break;

    case ITEM_CATEGORY.RING:
      item.effect = data.effect;
      item.bonusAmount = data.bonusAmount || 0;
      break;

    case ITEM_CATEGORY.POT:
      item.effect = data.effect;
      item.capacity = data.capacity;
      item.contents = options.contents ?? [];
      break;

    case ITEM_CATEGORY.ARROW:
      item.baseDamage = data.baseDamage;
      item.arrowEffect = data.arrowEffect;
      item.count = options.count ?? 1;
      break;

    case ITEM_CATEGORY.WAND:
      item.effect = data.effect;
      item.charges = options.charges ?? options.rng?.nextInt(data.chargeRange[0], data.chargeRange[1]) ?? data.chargeRange[0];
      item.maxCharges = item.charges;
      break;

    case ITEM_CATEGORY.GOLD:
      item.amount = options.amount ?? 100;
      item.name = `${item.amount}銭`;
      item.spriteKey = 'item.gold';
      break;
  }

  return item;
}

/**
 * カテゴリ別のデータ取得
 */
function getItemDataByCategory(id, category) {
  switch (category) {
    case ITEM_CATEGORY.WEAPON: return WEAPON_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.SHIELD: return SHIELD_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.GRASS: return GRASS_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.SCROLL: return SCROLL_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.FOOD: return FOOD_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.RING: return RING_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.POT: return POT_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.ARROW: return ARROW_DATA.find(d => d.id === id);
    case ITEM_CATEGORY.WAND: return WAND_DATA.find(d => d.id === id);
    default: return null;
  }
}

/**
 * アイテムの表示名を取得（強化値込み）
 */
export function getItemDisplayName(item) {
  if (item.category === ITEM_CATEGORY.GOLD) {
    return item.name;
  }

  let name = item.name;

  // 強化値
  if (item.enhance !== undefined && item.enhance !== 0) {
    const sign = item.enhance >= 0 ? '+' : '';
    name += `${sign}${item.enhance}`;
  }

  // 矢の本数
  if (item.category === ITEM_CATEGORY.ARROW && item.count !== undefined) {
    name += `×${item.count}`;
  }

  // 杖の回数
  if (item.category === ITEM_CATEGORY.WAND && item.charges !== undefined) {
    name += `[${item.charges}]`;
  }

  // 壺の容量
  if (item.category === ITEM_CATEGORY.POT && item.capacity !== undefined) {
    name += `[${item.contents ? item.contents.length : 0}/${item.capacity}]`;
  }

  // 印表示（武器・盾）
  if ((item.category === ITEM_CATEGORY.WEAPON || item.category === ITEM_CATEGORY.SHIELD) && item.seals && item.seals.length > 0) {
    const sealChars = item.seals.map(s => getSealDisplayChar(s)).join('');
    name += `【${sealChars}】`;
  }

  // 呪い
  if (item.cursed) {
    name += '【呪】';
  }

  return name;
}

// フロア別アイテム出現テーブル
const FLOOR_ITEM_TABLE = {
  // 1-5F: 食料多め、低級武器盾、薬草
  early: {
    maxFloor: 5,
    items: [
      { id: 'herb', category: ITEM_CATEGORY.GRASS, weight: 15 },
      { id: 'heal_grass', category: ITEM_CATEGORY.GRASS, weight: 10 },
      { id: 'antidote_grass', category: ITEM_CATEGORY.GRASS, weight: 5 },
      { id: 'poison_grass', category: ITEM_CATEGORY.GRASS, weight: 5 },
      { id: 'confusion_grass', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'sleep_grass', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'power_seed', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'riceball', category: ITEM_CATEGORY.FOOD, weight: 12 },
      { id: 'big_riceball', category: ITEM_CATEGORY.FOOD, weight: 5 },
      { id: 'wooden_stick', category: ITEM_CATEGORY.WEAPON, weight: 6 },
      { id: 'copper_sword', category: ITEM_CATEGORY.WEAPON, weight: 4 },
      { id: 'wooden_shield', category: ITEM_CATEGORY.SHIELD, weight: 6 },
      { id: 'copper_shield', category: ITEM_CATEGORY.SHIELD, weight: 4 },
      { id: 'farsight_scroll', category: ITEM_CATEGORY.SCROLL, weight: 3 },
      { id: 'identify_scroll', category: ITEM_CATEGORY.SCROLL, weight: 4 },
      { id: 'warp_scroll', category: ITEM_CATEGORY.SCROLL, weight: 3 },
      { id: 'enhance_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'vacuum_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'wood_arrow', category: ITEM_CATEGORY.ARROW, weight: 5 },
      { id: 'iron_arrow', category: ITEM_CATEGORY.ARROW, weight: 2 }
    ]
  },
  // 6-12F: バランス良く出現
  mid: {
    maxFloor: 12,
    items: [
      { id: 'heal_grass', category: ITEM_CATEGORY.GRASS, weight: 10 },
      { id: 'great_heal_grass', category: ITEM_CATEGORY.GRASS, weight: 5 },
      { id: 'antidote_grass', category: ITEM_CATEGORY.GRASS, weight: 5 },
      { id: 'power_seed', category: ITEM_CATEGORY.GRASS, weight: 4 },
      { id: 'happy_seed', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'speed_seed', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'confusion_grass', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'sleep_grass', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'invincible_grass', category: ITEM_CATEGORY.GRASS, weight: 1 },
      { id: 'riceball', category: ITEM_CATEGORY.FOOD, weight: 8 },
      { id: 'big_riceball', category: ITEM_CATEGORY.FOOD, weight: 5 },
      { id: 'grilled_riceball', category: ITEM_CATEGORY.FOOD, weight: 3 },
      { id: 'iron_katana', category: ITEM_CATEGORY.WEAPON, weight: 5 },
      { id: 'copper_sword', category: ITEM_CATEGORY.WEAPON, weight: 3 },
      { id: 'spirit_sword', category: ITEM_CATEGORY.WEAPON, weight: 1 },
      { id: 'dragon_sword', category: ITEM_CATEGORY.WEAPON, weight: 1 },
      { id: 'poison_dagger', category: ITEM_CATEGORY.WEAPON, weight: 1 },
      { id: 'confusion_staff', category: ITEM_CATEGORY.WEAPON, weight: 1 },
      { id: 'iron_shield', category: ITEM_CATEGORY.SHIELD, weight: 5 },
      { id: 'copper_shield', category: ITEM_CATEGORY.SHIELD, weight: 3 },
      { id: 'evasion_shield', category: ITEM_CATEGORY.SHIELD, weight: 1 },
      { id: 'antidote_shield', category: ITEM_CATEGORY.SHIELD, weight: 1 },
      { id: 'farsight_scroll', category: ITEM_CATEGORY.SCROLL, weight: 3 },
      { id: 'identify_scroll', category: ITEM_CATEGORY.SCROLL, weight: 4 },
      { id: 'enhance_scroll', category: ITEM_CATEGORY.SCROLL, weight: 3 },
      { id: 'vacuum_scroll', category: ITEM_CATEGORY.SCROLL, weight: 3 },
      { id: 'confusion_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'sleep_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'purify_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'wood_arrow', category: ITEM_CATEGORY.ARROW, weight: 4 },
      { id: 'iron_arrow', category: ITEM_CATEGORY.ARROW, weight: 3 },
      { id: 'poison_arrow', category: ITEM_CATEGORY.ARROW, weight: 2 },
      { id: 'strength_ring', category: ITEM_CATEGORY.RING, weight: 1 },
      { id: 'recovery_ring', category: ITEM_CATEGORY.RING, weight: 1 },
      { id: 'sleep_resist_ring', category: ITEM_CATEGORY.RING, weight: 1 },
      { id: 'confusion_resist_ring', category: ITEM_CATEGORY.RING, weight: 1 },
      { id: 'storage_pot', category: ITEM_CATEGORY.POT, weight: 2 },
      { id: 'identify_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'heal_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'transform_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'evade_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'bottomless_pot', category: ITEM_CATEGORY.POT, weight: 0.5 },
      { id: 'sleep_wand', category: ITEM_CATEGORY.WAND, weight: 2 },
      { id: 'confusion_wand', category: ITEM_CATEGORY.WAND, weight: 2 },
      { id: 'slow_wand', category: ITEM_CATEGORY.WAND, weight: 2 },
      { id: 'seal_wand', category: ITEM_CATEGORY.WAND, weight: 1 },
      { id: 'knockback_wand', category: ITEM_CATEGORY.WAND, weight: 1 },
      { id: 'swap_wand', category: ITEM_CATEGORY.WAND, weight: 1 }
    ]
  },
  // 13-20F: 高級品がまれに出現
  late: {
    maxFloor: 20,
    items: [
      { id: 'great_heal_grass', category: ITEM_CATEGORY.GRASS, weight: 8 },
      { id: 'heal_grass', category: ITEM_CATEGORY.GRASS, weight: 5 },
      { id: 'power_seed', category: ITEM_CATEGORY.GRASS, weight: 4 },
      { id: 'happy_seed', category: ITEM_CATEGORY.GRASS, weight: 3 },
      { id: 'angel_seed', category: ITEM_CATEGORY.GRASS, weight: 1 },
      { id: 'invincible_grass', category: ITEM_CATEGORY.GRASS, weight: 2 },
      { id: 'revival_seed', category: ITEM_CATEGORY.GRASS, weight: 1 },
      { id: 'dragon_grass', category: ITEM_CATEGORY.GRASS, weight: 2 },
      { id: 'big_riceball', category: ITEM_CATEGORY.FOOD, weight: 5 },
      { id: 'huge_riceball', category: ITEM_CATEGORY.FOOD, weight: 3 },
      { id: 'grilled_riceball', category: ITEM_CATEGORY.FOOD, weight: 3 },
      { id: 'steel_tachi', category: ITEM_CATEGORY.WEAPON, weight: 4 },
      { id: 'iron_katana', category: ITEM_CATEGORY.WEAPON, weight: 3 },
      { id: 'kamaitachi', category: ITEM_CATEGORY.WEAPON, weight: 1 },
      { id: 'legendary_sword', category: ITEM_CATEGORY.WEAPON, weight: 0.3 },
      { id: 'flame_sword', category: ITEM_CATEGORY.WEAPON, weight: 1 },
      { id: 'sleep_mace', category: ITEM_CATEGORY.WEAPON, weight: 1 },
      { id: 'seal_blade', category: ITEM_CATEGORY.WEAPON, weight: 0.8 },
      { id: 'critical_axe', category: ITEM_CATEGORY.WEAPON, weight: 0.8 },
      { id: 'life_drain_sword', category: ITEM_CATEGORY.WEAPON, weight: 0.6 },
      { id: 'bonus_blade', category: ITEM_CATEGORY.WEAPON, weight: 0.8 },
      { id: 'slow_whip', category: ITEM_CATEGORY.WEAPON, weight: 0.8 },
      { id: 'steel_shield', category: ITEM_CATEGORY.SHIELD, weight: 4 },
      { id: 'iron_shield', category: ITEM_CATEGORY.SHIELD, weight: 3 },
      { id: 'fullness_shield', category: ITEM_CATEGORY.SHIELD, weight: 1 },
      { id: 'legendary_shield', category: ITEM_CATEGORY.SHIELD, weight: 0.3 },
      { id: 'enhance_scroll', category: ITEM_CATEGORY.SCROLL, weight: 4 },
      { id: 'great_enhance_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'identify_all_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'vacuum_scroll', category: ITEM_CATEGORY.SCROLL, weight: 3 },
      { id: 'annihilation_scroll', category: ITEM_CATEGORY.SCROLL, weight: 1 },
      { id: 'plating_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'purify_scroll', category: ITEM_CATEGORY.SCROLL, weight: 2 },
      { id: 'iron_arrow', category: ITEM_CATEGORY.ARROW, weight: 3 },
      { id: 'silver_arrow', category: ITEM_CATEGORY.ARROW, weight: 1 },
      { id: 'knockback_arrow', category: ITEM_CATEGORY.ARROW, weight: 2 },
      { id: 'clairvoyance_ring', category: ITEM_CATEGORY.RING, weight: 1 },
      { id: 'trap_sight_ring', category: ITEM_CATEGORY.RING, weight: 1 },
      { id: 'wall_pass_ring', category: ITEM_CATEGORY.RING, weight: 0.5 },
      { id: 'curse_resist_ring', category: ITEM_CATEGORY.RING, weight: 1 },
      { id: 'storage_pot', category: ITEM_CATEGORY.POT, weight: 2 },
      { id: 'synthesis_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'heal_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'warehouse_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'upgrade_pot', category: ITEM_CATEGORY.POT, weight: 0.8 },
      { id: 'transform_pot', category: ITEM_CATEGORY.POT, weight: 1 },
      { id: 'unbreakable_pot', category: ITEM_CATEGORY.POT, weight: 0.5 },
      { id: 'downgrade_pot', category: ITEM_CATEGORY.POT, weight: 0.5 },
      { id: 'curse_pot', category: ITEM_CATEGORY.POT, weight: 0.3 },
      { id: 'paralyze_wand', category: ITEM_CATEGORY.WAND, weight: 2 },
      { id: 'seal_wand', category: ITEM_CATEGORY.WAND, weight: 2 },
      { id: 'evasion_wand', category: ITEM_CATEGORY.WAND, weight: 1 },
      { id: 'decoy_wand', category: ITEM_CATEGORY.WAND, weight: 1 },
      { id: 'misfortune_wand', category: ITEM_CATEGORY.WAND, weight: 1 },
      { id: 'haste_wand', category: ITEM_CATEGORY.WAND, weight: 1 },
      { id: 'stumble_wand', category: ITEM_CATEGORY.WAND, weight: 1 }
    ]
  }
};

/**
 * フロアに応じたアイテムテーブルを取得
 */
function getItemTableForFloor(floor) {
  if (floor <= FLOOR_ITEM_TABLE.early.maxFloor) return FLOOR_ITEM_TABLE.early.items;
  if (floor <= FLOOR_ITEM_TABLE.mid.maxFloor) return FLOOR_ITEM_TABLE.mid.items;
  return FLOOR_ITEM_TABLE.late.items;
}

/**
 * 重み付きランダム選択
 */
function weightedPick(table, rng) {
  const totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = rng.next() * totalWeight;

  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }

  return table[table.length - 1];
}

/**
 * ランダムにアイテムを1つ生成
 */
export function generateRandomItem(floor, rng, options = {}) {
  const table = getItemTableForFloor(floor);
  const entry = weightedPick(table, rng);

  const itemOptions = { ...options };

  // 武器盾は強化値をランダム付与
  if (entry.category === ITEM_CATEGORY.WEAPON || entry.category === ITEM_CATEGORY.SHIELD) {
    if (rng.chance(0.3)) {
      itemOptions.enhance = rng.nextInt(1, Math.min(3, Math.floor(floor / 3) + 1));
    }
    // 低確率で呪い付き
    if (rng.chance(0.1)) {
      itemOptions.enhance = -rng.nextInt(1, 2);
    }
  }

  // 矢は本数をランダム付与
  if (entry.category === ITEM_CATEGORY.ARROW) {
    itemOptions.count = rng.nextInt(3, 8 + Math.floor(floor / 3));
  }

  const item = createItem(entry.id, entry.category, itemOptions);

  // 呪い判定（武器盾で強化値がマイナスなら呪い）
  if (item && (item.enhance !== undefined) && item.enhance < 0) {
    item.cursed = true;
  }

  return item;
}

/**
 * フロアにアイテムを配置
 */
export function placeItemsOnFloor(floor, dungeon, rng, existingItems) {
  const items = existingItems || [];
  const itemsPerRoom = floor <= 5 ? { min: 0, max: 2 } : { min: 0, max: 3 };

  for (const room of dungeon.rooms) {
    const count = rng.nextInt(itemsPerRoom.min, itemsPerRoom.max);

    for (let i = 0; i < count; i++) {
      const pos = dungeon.getRandomPointInRoom(room);

      // 階段やプレイヤー開始位置には置かない
      if (dungeon.map[pos.y][pos.x] === 3) continue; // TILE.STAIRS

      // 同じ位置にアイテムがないか確認
      if (items.some(it => it.x === pos.x && it.y === pos.y)) continue;

      const item = generateRandomItem(floor, rng, {
        x: pos.x,
        y: pos.y,
        onFloor: true
      });

      if (item) items.push(item);
    }
  }

  // 金もドロップ
  for (const room of dungeon.rooms) {
    if (rng.chance(0.3)) {
      const pos = dungeon.getRandomPointInRoom(room);
      if (dungeon.map[pos.y][pos.x] === 3) continue;
      if (items.some(it => it.x === pos.x && it.y === pos.y)) continue;

      const goldAmount = rng.nextInt(50, 100 + floor * 30);
      const gold = createItem('gold', ITEM_CATEGORY.GOLD, {
        x: pos.x,
        y: pos.y,
        onFloor: true,
        amount: goldAmount
      });
      if (gold) items.push(gold);
    }
  }

  // モンスターハウス: 追加アイテムを密集配置
  if (dungeon.monsterHouseRoom) {
    const mhRoom = dungeon.monsterHouseRoom;
    const mhItemCount = rng.nextInt(5, 10);
    for (let i = 0; i < mhItemCount; i++) {
      const pos = dungeon.getRandomPointInRoom(mhRoom);
      if (dungeon.map[pos.y][pos.x] === 3) continue;
      if (items.some(it => it.x === pos.x && it.y === pos.y)) continue;

      const item = generateRandomItem(floor, rng, {
        x: pos.x,
        y: pos.y,
        onFloor: true
      });
      if (item) items.push(item);
    }
  }

  return items;
}

/**
 * 草の効果を適用
 */
export function applyGrassEffect(item, player, gameState) {
  const messages = [];

  // 全ての草は満腹度+5
  player.restoreFullness(5);

  switch (item.effect) {
    case 'heal':
      player.heal(item.healAmount);
      messages.push(`HPが${item.healAmount}回復した！`);
      break;

    case 'great_heal':
      player.heal(item.healAmount);
      player.maxHp += item.maxHpUp;
      player.hp = Math.min(player.hp, player.maxHp);
      messages.push(`HPが${item.healAmount}回復し、最大HP+${item.maxHpUp}！`);
      break;

    case 'herb':
      player.heal(item.healAmount);
      messages.push(`HPが${item.healAmount}回復した。`);
      break;

    case 'antidote':
      player.strength = player.maxStrength;
      messages.push('ちからが回復した！');
      break;

    case 'power_up':
      player.maxStrength += 1;
      player.strength += 1;
      messages.push('ちからの最大値が1上がった！');
      break;

    case 'level_up':
      for (let i = 0; i < item.levelUp; i++) {
        if (player.level < 50) {
          const result = player.levelUp();
          messages.push(`レベルが${result.level}に上がった！最大HP+${result.hpGain}`);
        }
      }
      break;

    case 'speed':
      player.statusEffects = player.statusEffects || [];
      player.statusEffects.push({ type: 'speed', remaining: item.duration });
      messages.push(`${item.duration}ターンの間、倍速になった！`);
      break;

    case 'wakeup':
      if (player.statusEffects) {
        player.statusEffects = player.statusEffects.filter(e => e.type !== 'sleep');
      }
      messages.push('目が覚めた！');
      break;

    case 'confusion':
      player.statusEffects = player.statusEffects || [];
      player.statusEffects.push({ type: 'confusion', remaining: item.duration });
      messages.push('混乱してしまった！');
      break;

    case 'sleep':
      player.statusEffects = player.statusEffects || [];
      player.statusEffects.push({ type: 'sleep', remaining: item.duration });
      messages.push('眠ってしまった！');
      break;

    case 'poison':
      player.strength = Math.max(0, player.strength - 1);
      player.takeDamage(5);
      messages.push('ちからが1下がり、5のダメージ！');
      break;

    case 'berserk':
      player.statusEffects = player.statusEffects || [];
      player.statusEffects.push({ type: 'berserk', remaining: -1 });
      messages.push('狂戦士状態になった！');
      break;

    case 'invincible':
      player.statusEffects = player.statusEffects || [];
      player.statusEffects.push({ type: 'invincible', remaining: item.duration });
      messages.push(`${item.duration}ターンの間、無敵になった！`);
      break;

    case 'revival':
      player.hasRevival = true;
      messages.push('復活の種を飲み込んだ。倒れても一度だけ復活する。');
      break;

    case 'dragon_fire':
      // 正面に炎を吐く - game.jsで方向処理
      messages.push('炎を吐いた！');
      break;

    case 'amnesia':
      if (gameState && gameState.dungeon) {
        for (let y = 0; y < gameState.dungeon.explored.length; y++) {
          for (let x = 0; x < gameState.dungeon.explored[y].length; x++) {
            gameState.dungeon.explored[y][x] = false;
          }
        }
      }
      messages.push('フロアの記憶が消えた...');
      break;

    case 'forest_heal':
      player.heal(item.healAmount);
      if (item.maxHpUp) {
        player.maxHp += item.maxHpUp;
        player.hp = Math.min(player.hp, player.maxHp);
      }
      messages.push(`HPが${item.healAmount}回復し、最大HP+${item.maxHpUp || 0}！`);
      break;

    case 'sea_heal':
      player.heal(item.healAmount);
      if (item.maxHpUp) {
        player.maxHp += item.maxHpUp;
        player.hp = Math.min(player.hp, player.maxHp);
      }
      messages.push(`HPが${item.healAmount}回復し、最大HP+${item.maxHpUp || 0}！`);
      break;

    case 'invisible':
      player.statusEffects = player.statusEffects || [];
      player.statusEffects.push({ type: 'invisible', remaining: item.duration });
      messages.push(`${item.duration}ターンの間、透明になった！`);
      break;
  }

  return messages;
}

/**
 * 食料の効果を適用
 */
export function applyFoodEffect(item, player) {
  const messages = [];

  player.restoreFullness(item.fullnessRestore);
  messages.push(`満腹度が${item.fullnessRestore}回復した。`);

  if (item.maxFullnessUp > 0) {
    player.maxFullness = Math.min(200, player.maxFullness + item.maxFullnessUp);
    messages.push(`最大満腹度が${item.maxFullnessUp}上がった！`);
  }

  if (item.hpRestore > 0) {
    player.heal(item.hpRestore);
    messages.push(`HPが${item.hpRestore}回復した。`);
  }

  if (item.strengthChange < 0) {
    player.strength = Math.max(0, player.strength + item.strengthChange);
    messages.push(`ちからが${Math.abs(item.strengthChange)}下がった...`);
  }

  if (item.damage > 0) {
    player.takeDamage(item.damage);
    messages.push(`${item.damage}のダメージ！`);
  }

  return messages;
}

/**
 * 巻物の効果を適用
 */
export function applyScrollEffect(item, player, gameState) {
  const messages = [];

  switch (item.effect) {
    case 'farsight':
      if (gameState && gameState.dungeon) {
        for (let y = 0; y < gameState.dungeon.explored.length; y++) {
          for (let x = 0; x < gameState.dungeon.explored[y].length; x++) {
            gameState.dungeon.explored[y][x] = true;
          }
        }
      }
      messages.push('フロア全体が見渡せるようになった！');
      break;

    case 'identify':
      if (gameState) {
        // 未識別アイテムを1つ識別
        const unidentified = player.inventory.filter(it => !gameState.isIdentified(it));
        if (unidentified.length > 0) {
          const target = unidentified[0];
          gameState.identifyItem(target);
          messages.push(`${getItemDisplayName(target)}を識別した！`);
        } else {
          messages.push('鑑定の巻物を読んだが、すべて識別済みだった。');
        }
      }
      break;

    case 'identify_all':
      if (gameState) {
        let identifiedCount = 0;
        for (const it of player.inventory) {
          if (!gameState.isIdentified(it)) {
            gameState.identifyItem(it);
            identifiedCount++;
          }
        }
        if (identifiedCount > 0) {
          messages.push(`全鑑定の巻物を読んだ！${identifiedCount}個のアイテムを識別した！`);
        } else {
          messages.push('全鑑定の巻物を読んだが、すべて識別済みだった。');
        }
      }
      break;

    case 'warp': {
      if (gameState && gameState.dungeon) {
        const pos = gameState.dungeon.getRandomWalkablePosition();
        if (pos) {
          player.setPosition(pos.x, pos.y);
          messages.push('別の場所にワープした！');
        }
      }
      break;
    }

    case 'confuse_room':
      if (gameState) {
        const room = gameState.dungeon.getRoomAt(player.x, player.y);
        if (room) {
          let count = 0;
          for (const monster of gameState.monsters) {
            if (monster.isAlive &&
                monster.x >= room.x && monster.x < room.x + room.width &&
                monster.y >= room.y && monster.y < room.y + room.height) {
              monster.statusEffects = monster.statusEffects || [];
              monster.statusEffects.push({ type: 'confusion', remaining: 10 });
              count++;
            }
          }
          messages.push(count > 0 ? `部屋のモンスター${count}体を混乱させた！` : '効果がなかった。');
        } else {
          messages.push('部屋の外では効果がなかった。');
        }
      }
      break;

    case 'sleep_room':
      if (gameState) {
        const room = gameState.dungeon.getRoomAt(player.x, player.y);
        if (room) {
          let count = 0;
          for (const monster of gameState.monsters) {
            if (monster.isAlive &&
                monster.x >= room.x && monster.x < room.x + room.width &&
                monster.y >= room.y && monster.y < room.y + room.height) {
              monster.statusEffects = monster.statusEffects || [];
              monster.statusEffects.push({ type: 'sleep', remaining: 5 });
              count++;
            }
          }
          messages.push(count > 0 ? `部屋のモンスター${count}体を眠らせた！` : '効果がなかった。');
        } else {
          messages.push('部屋の外では効果がなかった。');
        }
      }
      break;

    case 'vacuum_slash':
      if (gameState) {
        const room = gameState.dungeon.getRoomAt(player.x, player.y);
        if (room) {
          let count = 0;
          for (const monster of gameState.monsters) {
            if (monster.isAlive &&
                monster.x >= room.x && monster.x < room.x + room.width &&
                monster.y >= room.y && monster.y < room.y + room.height) {
              monster.takeDamage(item.damage);
              count++;
            }
          }
          if (gameState.monsterManager) {
            gameState.monsterManager.removeDeadMonsters();
          }
          messages.push(count > 0 ? `部屋のモンスター${count}体に${item.damage}のダメージ！` : '効果がなかった。');
        } else {
          messages.push('部屋の外では効果がなかった。');
        }
      }
      break;

    case 'annihilate':
      if (gameState && gameState.monsterManager) {
        for (const monster of gameState.monsters) {
          monster.isAlive = false;
        }
        gameState.monsterManager.removeDeadMonsters();
        messages.push('フロアの全モンスターが消滅した！');
      }
      break;

    case 'enhance':
      // 強化対象はインベントリUIで選択 - ここでは最初の武器or盾を強化
      messages.push('_NEED_TARGET_EQUIP');
      break;

    case 'plating':
      messages.push('_NEED_TARGET_EQUIP');
      break;

    case 'purify':
      messages.push('_NEED_TARGET_ITEM');
      break;

    case 'curse':
      if (player.inventory && player.inventory.length > 0) {
        const idx = gameState.rng.nextInt(0, player.inventory.length - 1);
        player.inventory[idx].cursed = true;
        messages.push('持ち物のどれかが呪われた...');
      } else {
        messages.push('持ち物がないので効果がなかった。');
      }
      break;

    case 'lost':
      if (gameState && gameState.dungeon) {
        for (let y = 0; y < gameState.dungeon.explored.length; y++) {
          for (let x = 0; x < gameState.dungeon.explored[y].length; x++) {
            gameState.dungeon.explored[y][x] = false;
          }
        }
        messages.push('フロアの地図記憶が消去された...');
      }
      break;

    case 'fire':
      player.hp = 1;
      // 周囲のモンスターにもダメージ
      if (gameState) {
        for (const monster of gameState.monsters) {
          if (monster.isAlive) {
            const dx = Math.abs(monster.x - player.x);
            const dy = Math.abs(monster.y - player.y);
            if (dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
              monster.takeDamage(Math.floor(monster.hp / 2));
            }
          }
        }
        if (gameState.monsterManager) {
          gameState.monsterManager.removeDeadMonsters();
        }
      }
      messages.push('大爆発！HPが1になった！');
      break;

    case 'sanctuary':
      messages.push('聖域の巻物は床に置いて使う。（Phase 4で実装）');
      break;
  }

  return messages;
}

/**
 * 装備強化の巻物効果
 */
export function applyEnhanceScroll(item, targetItem) {
  if (!targetItem) return [];
  if (targetItem.enhance === undefined) return ['その対象には使えない。'];

  targetItem.enhance += item.enhanceAmount;
  if (targetItem.enhance > 99) targetItem.enhance = 99;

  return [`${getItemDisplayName(targetItem)}の強化値が${item.enhanceAmount}上がった！`];
}
