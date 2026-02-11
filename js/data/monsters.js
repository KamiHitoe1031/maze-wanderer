/**
 * monsters.js - モンスターデータ定義
 */

export const MONSTER_DATA = {
  // ノーマル系（Phase 1: 最初の3種）
  green_slime: {
    id: 'green_slime',
    name: '緑スライム',
    spriteKey: 'monster.green_slime',
    hp: 6,
    atk: 3,
    def: 2,
    exp: 2,
    minFloor: 1,
    maxFloor: 3,
    type: 'normal',
    abilities: []
  },

  blue_slime: {
    id: 'blue_slime',
    name: '青スライム',
    spriteKey: 'monster.blue_slime',
    hp: 15,
    atk: 8,
    def: 5,
    exp: 8,
    minFloor: 3,
    maxFloor: 6,
    type: 'normal',
    abilities: []
  },

  rat: {
    id: 'rat',
    name: 'ネズミ小僧',
    spriteKey: 'monster.rat',
    hp: 8,
    atk: 5,
    def: 3,
    exp: 4,
    minFloor: 1,
    maxFloor: 4,
    type: 'normal',
    abilities: []
  },

  // 将来実装用（参照のみ）
  red_slime: {
    id: 'red_slime',
    name: '赤スライム',
    spriteKey: 'monster.red_slime',
    hp: 40,
    atk: 18,
    def: 12,
    exp: 30,
    minFloor: 7,
    maxFloor: 10,
    type: 'normal',
    abilities: []
  },

  rat_boss: {
    id: 'rat_boss',
    name: 'ネズミ大将',
    spriteKey: 'monster.rat',
    hp: 30,
    atk: 15,
    def: 10,
    exp: 20,
    minFloor: 5,
    maxFloor: 9,
    type: 'normal',
    abilities: []
  }
};

/**
 * 指定フロアで出現可能なモンスターIDリストを取得
 */
export function getSpawnableMonsters(floor) {
  return Object.values(MONSTER_DATA)
    .filter(m => floor >= m.minFloor && floor <= m.maxFloor)
    .map(m => m.id);
}

/**
 * モンスターIDからデータを取得
 */
export function getMonsterData(id) {
  return MONSTER_DATA[id];
}
