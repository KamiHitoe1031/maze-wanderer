/**
 * input.js - キーボード・クリック入力ハンドラ
 */

// 方向定数
export const DIRECTION = {
  NONE: { dx: 0, dy: 0 },
  UP: { dx: 0, dy: -1 },
  DOWN: { dx: 0, dy: 1 },
  LEFT: { dx: -1, dy: 0 },
  RIGHT: { dx: 1, dy: 0 },
  UP_LEFT: { dx: -1, dy: -1 },
  UP_RIGHT: { dx: 1, dy: -1 },
  DOWN_LEFT: { dx: -1, dy: 1 },
  DOWN_RIGHT: { dx: 1, dy: 1 }
};

// アクション定数
export const ACTION = {
  NONE: 'none',
  MOVE: 'move',
  ATTACK: 'attack',
  WAIT: 'wait',
  PICKUP: 'pickup',
  DESCEND: 'descend',
  INVENTORY: 'inventory',
  EXAMINE: 'examine'
};

// キーマッピング
const KEY_MAP = {
  // テンキー
  'Numpad7': DIRECTION.UP_LEFT,
  'Numpad8': DIRECTION.UP,
  'Numpad9': DIRECTION.UP_RIGHT,
  'Numpad4': DIRECTION.LEFT,
  'Numpad6': DIRECTION.RIGHT,
  'Numpad1': DIRECTION.DOWN_LEFT,
  'Numpad2': DIRECTION.DOWN,
  'Numpad3': DIRECTION.DOWN_RIGHT,
  'Numpad5': DIRECTION.NONE, // 待機

  // WASD + QE + ZC
  'KeyQ': DIRECTION.UP_LEFT,
  'KeyW': DIRECTION.UP,
  'KeyE': DIRECTION.UP_RIGHT,
  'KeyA': DIRECTION.LEFT,
  'KeyD': DIRECTION.RIGHT,
  'KeyZ': DIRECTION.DOWN_LEFT,
  'KeyS': DIRECTION.DOWN,
  'KeyC': DIRECTION.DOWN_RIGHT,

  // 矢印キー（4方向）
  'ArrowUp': DIRECTION.UP,
  'ArrowDown': DIRECTION.DOWN,
  'ArrowLeft': DIRECTION.LEFT,
  'ArrowRight': DIRECTION.RIGHT
};

export class InputHandler {
  constructor() {
    this.pendingAction = null;
    this.pendingDirection = null;
    this.shiftHeld = false;
    this.ctrlHeld = false;

    // キーイベントのバインド
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * キーダウンイベント処理
   */
  handleKeyDown(event) {
    // 修飾キーの状態を更新
    this.shiftHeld = event.shiftKey;
    this.ctrlHeld = event.ctrlKey;

    // 方向キーの処理
    if (KEY_MAP[event.code]) {
      event.preventDefault();
      const direction = KEY_MAP[event.code];

      if (direction === DIRECTION.NONE) {
        // 待機
        this.pendingAction = ACTION.WAIT;
        this.pendingDirection = null;
      } else {
        this.pendingAction = ACTION.MOVE;
        this.pendingDirection = direction;
      }
      return;
    }

    // スペースで待機
    if (event.code === 'Space') {
      event.preventDefault();
      this.pendingAction = ACTION.WAIT;
      this.pendingDirection = null;
      return;
    }

    // Enterで拾う/階段を降りる
    if (event.code === 'Enter') {
      event.preventDefault();
      this.pendingAction = ACTION.PICKUP;
      this.pendingDirection = null;
      return;
    }

    // Fで攻撃
    if (event.code === 'KeyF') {
      event.preventDefault();
      this.pendingAction = ACTION.ATTACK;
      this.pendingDirection = null;
      return;
    }

    // Iでインベントリ
    if (event.code === 'KeyI') {
      event.preventDefault();
      this.pendingAction = ACTION.INVENTORY;
      this.pendingDirection = null;
      return;
    }

    // Xで足元を調べる
    if (event.code === 'KeyX') {
      event.preventDefault();
      this.pendingAction = ACTION.EXAMINE;
      this.pendingDirection = null;
      return;
    }
  }

  /**
   * キーアップイベント処理
   */
  handleKeyUp(event) {
    this.shiftHeld = event.shiftKey;
    this.ctrlHeld = event.ctrlKey;
  }

  /**
   * 保留中のアクションを取得してクリア
   */
  getAction() {
    const action = this.pendingAction;
    const direction = this.pendingDirection;

    this.pendingAction = null;
    this.pendingDirection = null;

    return { action, direction };
  }

  /**
   * アクションが保留中か
   */
  hasAction() {
    return this.pendingAction !== null;
  }

  /**
   * イベントリスナーを削除
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }
}
