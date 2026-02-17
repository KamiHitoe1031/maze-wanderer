/**
 * scene-manager.js - シーン管理（町 ↔ ダンジョン切替）
 */

export const SCENE = {
  TOWN: 'town',
  DUNGEON: 'dungeon'
};

export class SceneManager {
  constructor() {
    this.currentScene = null;
    this.sceneHandlers = new Map();
  }

  /**
   * シーンハンドラを登録
   * @param {string} sceneId - SCENE定数
   * @param {object} handler - { enter(data), exit(), update(), render() }
   */
  register(sceneId, handler) {
    this.sceneHandlers.set(sceneId, handler);
  }

  /**
   * シーン遷移
   * @param {string} sceneId - 遷移先のシーンID
   * @param {object} data - 遷移時に渡すデータ
   */
  transition(sceneId, data = {}) {
    const nextHandler = this.sceneHandlers.get(sceneId);
    if (!nextHandler) return;

    if (this.currentScene) {
      const currentHandler = this.sceneHandlers.get(this.currentScene);
      if (currentHandler?.exit) currentHandler.exit();
    }

    this.currentScene = sceneId;
    nextHandler.enter(data);
  }

  /**
   * 現在シーンのupdate
   */
  update() {
    const handler = this.sceneHandlers.get(this.currentScene);
    if (handler?.update) handler.update();
  }

  /**
   * 現在シーンのrender
   */
  render() {
    const handler = this.sceneHandlers.get(this.currentScene);
    if (handler?.render) handler.render();
  }
}
