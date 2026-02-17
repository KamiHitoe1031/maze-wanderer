/**
 * seals.js - 印（シール）定義データ
 *
 * 武器・盾に付与される印の表示名・説明・合成可否を管理
 */

export const SEAL_DATA = {
  // === 特効印（武器） ===
  ghost_slayer:    { name: '仏', description: '幽霊系に2倍ダメージ', transferable: true },
  dragon_slayer:   { name: '竜', description: '竜系に2倍ダメージ', transferable: true },
  cyclops_slayer:  { name: '目', description: '一つ目系に2倍ダメージ', transferable: true },
  drain_slayer:    { name: '吸', description: 'ドレイン系に2倍ダメージ', transferable: true },
  aqua_slayer:     { name: '水', description: '水棲系に2倍ダメージ', transferable: true },

  // === 状態異常付与印（武器） ===
  paralyze_10:     { name: '金', description: '10%の確率で金縛り', transferable: true },
  poison_hit:      { name: '毒', description: '15%の確率で毒付与', transferable: true },
  burn_hit:        { name: '火', description: '15%の確率で火傷付与', transferable: true },
  confuse_hit:     { name: '混', description: '12%の確率で混乱付与', transferable: true },
  sleep_hit:       { name: '眠', description: '10%の確率で睡眠付与', transferable: true },
  slow_hit:        { name: '鈍', description: '12%の確率で鈍足付与', transferable: true },
  seal_hit:        { name: '封', description: '10%の確率で封印付与', transferable: true },

  // === ダメージ系印（武器） ===
  bonus_damage:    { name: '重', description: '強化値に応じた追加ダメージ', transferable: true },
  critical_hit:    { name: '必', description: '25%の確率で会心の一撃', transferable: true },
  hp_drain:        { name: '回', description: 'ダメージの1/4のHP吸収', transferable: true },

  // === 特殊印（武器） ===
  dig:             { name: '掘', description: '壁を掘ることができる', transferable: true },

  // === 攻撃タイプ印（武器・合成時にattackType:xxxとして格納） ===
  'attackType:kamaitachi': { name: '三', description: '正面3方向を同時攻撃', transferable: true },
  'attackType:spear':      { name: '槍', description: '前方2マス貫通攻撃', transferable: true },
  'attackType:hammer':     { name: '鉄', description: '吹き飛ばし+壁破壊', transferable: true },
  'attackType:dagger':     { name: '背', description: '背後から2倍ダメージ', transferable: true },
  'attackType:bow':        { name: '弓', description: '遠距離射撃', transferable: true },
  'attackType:whip':       { name: '鞭', description: '遠距離攻撃', transferable: true },
  'attackType:boomerang':  { name: '戻', description: '投げて戻る攻撃', transferable: true },

  // === 盾印 ===
  evasion:         { name: '見', description: '敵の攻撃回避率+22%', transferable: true },
  antidote:        { name: '消', description: 'ちから下げ攻撃を無効化', transferable: true },
  rustproof:       { name: '金', description: '強化値を下げられない', transferable: false },
  blast_guard:     { name: '爆', description: '爆発ダメージ半減', transferable: true },
  counter:         { name: '返', description: '受けたダメージの1/4を反射', transferable: true },
  magic_reflect:   { name: '魔', description: '魔法攻撃を反射', transferable: true },
  forest_resist:   { name: '林', description: '植物攻撃ダメージ半減', transferable: true },
  water_resist:    { name: '海', description: '水棲攻撃ダメージ半減', transferable: true },
  fullness:        { name: '腹', description: '満腹度減少速度が半分', transferable: true },
};

/**
 * 印キーから表示用の漢字1文字を取得
 */
export function getSealDisplayChar(sealKey) {
  const seal = SEAL_DATA[sealKey];
  return seal ? seal.name : '?';
}

/**
 * 印キーから説明文を取得
 */
export function getSealDescription(sealKey) {
  const seal = SEAL_DATA[sealKey];
  return seal ? seal.description : '不明な印';
}
