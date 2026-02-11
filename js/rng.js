/**
 * rng.js - シード付き疑似乱数生成器 (xorshift128)
 * ダンジョン生成の再現性を確保するために使用
 */

export class RNG {
  constructor(seed) {
    this.state = [
      seed >>> 0,
      (seed ^ 0xDEADBEEF) >>> 0,
      (seed ^ 0x12345678) >>> 0,
      (seed ^ 0x87654321) >>> 0
    ];
  }

  /**
   * 0.0 ~ 1.0 の乱数を返す
   */
  next() {
    let t = this.state[3];
    t ^= t << 11;
    t ^= t >>> 8;
    this.state[3] = this.state[2];
    this.state[2] = this.state[1];
    this.state[1] = this.state[0];
    t ^= this.state[0];
    t ^= this.state[0] >>> 19;
    this.state[0] = t >>> 0;
    return (t >>> 0) / 0xFFFFFFFF;
  }

  /**
   * min以上max以下の整数乱数を返す
   */
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * 配列からランダムに1要素を選択
   */
  pick(array) {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * 配列をシャッフル (Fisher-Yates)
   */
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * 確率判定 (0.0 ~ 1.0 の確率でtrueを返す)
   */
  chance(probability) {
    return this.next() < probability;
  }
}

/**
 * 新しいシードを生成 (Date.now()ベース)
 */
export function generateSeed() {
  return Date.now() ^ (Math.random() * 0xFFFFFFFF);
}
