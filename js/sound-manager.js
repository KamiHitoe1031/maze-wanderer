/**
 * sound-manager.js - 効果音管理（Web Audio API）
 */

// サウンドキー定義
export const SOUND = {
  // 戦闘
  SLASH: 'slash',
  BLUNT: 'blunt',
  WIND_SLASH: 'wind_slash',
  PLAYER_HIT: 'player_hit',
  MONSTER_HIT: 'monster_hit',
  MONSTER_DEATH: 'monster_death',
  PLAYER_DEATH: 'player_death',
  CRITICAL_HIT: 'critical_hit',
  MISS: 'miss',
  FIRE_BREATH: 'fire_breath',
  EXPLOSION: 'explosion',
  MAGIC_SHOT: 'magic_shot',
  BULLET: 'bullet',
  POISON: 'poison',

  // アイテム
  ITEM_PICKUP: 'item_pickup',
  ITEM_DROP: 'item_drop',
  GRASS_USE: 'grass_use',
  SCROLL_USE: 'scroll_use',
  FOOD_EAT: 'food_eat',
  EQUIP: 'equip',
  UNEQUIP: 'unequip',
  GOLD_PICKUP: 'gold_pickup',
  HEAL: 'heal',
  LEVELUP: 'levelup',
  STEAL: 'steal',

  // 移動
  FOOTSTEP: 'footstep',
  STAIRS: 'stairs',
  BUMP_WALL: 'bump_wall',

  // UI
  MENU_OPEN: 'menu_open',
  MENU_SELECT: 'menu_select',
  MENU_CANCEL: 'menu_cancel',
  MENU_CURSOR: 'menu_cursor',

  // 環境
  DUNGEON_AMBIENT: 'dungeon_ambient',
  BOSS_ENCOUNTER: 'boss_encounter',

  // 罠
  TRAP_TRIGGER: 'trap_trigger',
  WARP: 'warp',
};

// ファイルパス定義
const SOUND_FILES = {
  [SOUND.SLASH]: 'assets/sounds/slash.mp3',
  [SOUND.BLUNT]: 'assets/sounds/blunt.mp3',
  [SOUND.WIND_SLASH]: 'assets/sounds/wind_slash.mp3',
  [SOUND.PLAYER_HIT]: 'assets/sounds/player_hit.mp3',
  [SOUND.MONSTER_HIT]: 'assets/sounds/monster_hit.mp3',
  [SOUND.MONSTER_DEATH]: 'assets/sounds/monster_death.mp3',
  [SOUND.PLAYER_DEATH]: 'assets/sounds/player_death.mp3',
  [SOUND.CRITICAL_HIT]: 'assets/sounds/critical_hit.mp3',
  [SOUND.MISS]: 'assets/sounds/miss.mp3',
  [SOUND.FIRE_BREATH]: 'assets/sounds/fire_breath.mp3',
  [SOUND.EXPLOSION]: 'assets/sounds/explosion.mp3',
  [SOUND.MAGIC_SHOT]: 'assets/sounds/magic_shot.mp3',
  [SOUND.BULLET]: 'assets/sounds/bullet.mp3',
  [SOUND.POISON]: 'assets/sounds/poison.mp3',

  [SOUND.ITEM_PICKUP]: 'assets/sounds/item_pickup.mp3',
  [SOUND.ITEM_DROP]: 'assets/sounds/item_drop.mp3',
  [SOUND.GRASS_USE]: 'assets/sounds/grass_use.mp3',
  [SOUND.SCROLL_USE]: 'assets/sounds/scroll_use.mp3',
  [SOUND.FOOD_EAT]: 'assets/sounds/food_eat.mp3',
  [SOUND.EQUIP]: 'assets/sounds/equip.mp3',
  [SOUND.UNEQUIP]: 'assets/sounds/unequip.mp3',
  [SOUND.GOLD_PICKUP]: 'assets/sounds/gold_pickup.mp3',
  [SOUND.HEAL]: 'assets/sounds/heal.mp3',
  [SOUND.LEVELUP]: 'assets/sounds/levelup.mp3',
  [SOUND.STEAL]: 'assets/sounds/steal.mp3',

  [SOUND.FOOTSTEP]: 'assets/sounds/footstep.mp3',
  [SOUND.STAIRS]: 'assets/sounds/stairs.mp3',
  [SOUND.BUMP_WALL]: 'assets/sounds/bump_wall.mp3',

  [SOUND.MENU_OPEN]: 'assets/sounds/menu_open.mp3',
  [SOUND.MENU_SELECT]: 'assets/sounds/menu_select.mp3',
  [SOUND.MENU_CANCEL]: 'assets/sounds/menu_cancel.mp3',
  [SOUND.MENU_CURSOR]: 'assets/sounds/menu_cursor.mp3',

  [SOUND.DUNGEON_AMBIENT]: 'assets/sounds/dungeon_ambient.mp3',
  [SOUND.BOSS_ENCOUNTER]: 'assets/sounds/boss_encounter.mp3',

  [SOUND.TRAP_TRIGGER]: 'assets/sounds/trap_trigger.mp3',
  [SOUND.WARP]: 'assets/sounds/warp.mp3',
};

export class SoundManager {
  constructor() {
    /** @type {Map<string, AudioBuffer>} */
    this.buffers = new Map();
    /** @type {AudioContext|null} */
    this.ctx = null;
    this.masterVolume = 0.5;
    this.sfxVolume = 0.7;
    this.ambientVolume = 0.3;
    this.muted = false;
    this.initialized = false;

    /** @type {AudioBufferSourceNode|null} */
    this.ambientSource = null;
    this.ambientGain = null;
  }

  /**
   * AudioContextを初期化（ユーザー操作後に呼ぶ必要あり）
   */
  async init() {
    if (this.initialized) return;

    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
      await this.loadAll();
    } catch (e) {
      console.warn('SoundManager: AudioContext initialization failed:', e);
    }
  }

  /**
   * 全サウンドファイルを非同期ロード
   */
  async loadAll() {
    if (!this.ctx) return;

    const entries = Object.entries(SOUND_FILES);
    const promises = entries.map(async ([key, path]) => {
      try {
        const resp = await fetch(path);
        if (!resp.ok) return;
        const arrayBuf = await resp.arrayBuffer();
        const audioBuf = await this.ctx.decodeAudioData(arrayBuf);
        this.buffers.set(key, audioBuf);
      } catch (e) {
        // File not found or decode error - silently skip
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * 効果音を再生
   * @param {string} soundKey - SOUND定数のいずれか
   * @param {number} [volume] - 0.0-1.0（省略時はsfxVolume）
   */
  play(soundKey, volume) {
    if (this.muted || !this.ctx || !this.initialized) return;

    const buffer = this.buffers.get(soundKey);
    if (!buffer) return;

    // AudioContext がsuspendedの場合resume
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.ctx.createGain();
    const vol = volume !== undefined ? volume : this.sfxVolume;
    gainNode.gain.value = vol * this.masterVolume;

    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    source.start(0);
  }

  /**
   * 環境音をループ再生
   * @param {string} soundKey
   */
  playAmbient(soundKey) {
    if (this.muted || !this.ctx || !this.initialized) return;

    this.stopAmbient();

    const buffer = this.buffers.get(soundKey);
    if (!buffer) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.ambientSource = this.ctx.createBufferSource();
    this.ambientSource.buffer = buffer;
    this.ambientSource.loop = true;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = this.ambientVolume * this.masterVolume;

    this.ambientSource.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);
    this.ambientSource.start(0);
  }

  /**
   * 環境音を停止
   */
  stopAmbient() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
      } catch (e) {
        // already stopped
      }
      this.ambientSource = null;
      this.ambientGain = null;
    }
  }

  /**
   * ミュート切替
   */
  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopAmbient();
    }
    return this.muted;
  }

  /**
   * マスター音量設定
   * @param {number} vol - 0.0-1.0
   */
  setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.ambientVolume * this.masterVolume;
    }
  }
}
