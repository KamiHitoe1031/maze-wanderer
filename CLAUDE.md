# CLAUDE.md — 迷境の旅人（ローグライクRPG）

## プロジェクト概要

風来のシレン風のターン制ローグライクRPGをHTML + vanilla JavaScriptで実装するプロジェクト。
ゲーム仕様の詳細は `spec.md` を必ず参照すること。

## 技術スタック

- **言語:** HTML5 + CSS3 + vanilla JavaScript (ES2020+)
- **描画:** HTML Canvas (2D Context)
- **ビルドツール:** なし（バンドラ不使用、素のJSモジュール `<script type="module">` で構成）
- **データ保存:** localStorage
- **外部ライブラリ:** 一切使わない
- **バージョン管理:** Git + GitHub
- **デプロイ:** Cloudflare Pages（GitHub連携による自動デプロイ）

## Git ワークフロー

### ブランチ戦略
```
main          ← 本番（Cloudflare Pages がここを監視・自動デプロイ）
└── develop   ← 開発統合ブランチ
    ├── phase1/mvp
    ├── phase2/items
    ├── phase3/intermediate
    ├── phase4/advanced
    └── phase5/polish
```

### コミットルール
- **フェーズ作業開始時:** `develop` から作業ブランチを切る
- **こまめにコミット:** 機能単位・ファイル単位で細かくコミット
- **コミットメッセージ:** 日本語OK、プレフィックス付き
  ```
  feat: BSP法によるダンジョン生成を実装
  fix: モンスターが壁を通り抜ける不具合を修正
  refactor: renderer.js を SpriteManager 経由に変更
  docs: CLAUDE.md にアセット管理セクション追加
  test: ダメージ計算のデバッグコマンド追加
  ```
- **フェーズ完了時:** 作業ブランチ → `develop` にマージ → 動作確認後 `develop` → `main` にマージ
- **`main` は常にデプロイ可能な状態を保つ**

### 典型的な作業フロー
```bash
# 開発開始
git checkout develop
git pull origin develop
git checkout -b phase1/mvp

# 作業中（こまめにコミット）
git add -A
git commit -m "feat: BSP法ダンジョン生成の基本実装"

# フェーズ完了
git checkout develop
git merge phase1/mvp
git push origin develop

# 本番デプロイ（動作確認後）
git checkout main
git merge develop
git push origin main    # → Cloudflare Pages が自動デプロイ
```

## Cloudflare Pages デプロイ設定

### 初回セットアップ（手動で実施）
1. GitHub にリポジトリを作成
2. Cloudflare Dashboard → Pages → 「Create a project」→ 「Connect to Git」
3. リポジトリを選択し、以下を設定：

| 項目 | 設定値 |
|------|--------|
| Production branch | `main` |
| Build command | （空欄 — ビルド不要） |
| Build output directory | `/`（ルート直下） |

4. 「Save and Deploy」

### 設定のポイント
- **ビルドコマンドなし。** バンドラを使わないので、リポジトリの中身がそのまま配信される
- `main` ブランチに push するたびに自動デプロイが走る
- `develop` ブランチへの push ではプレビューURLが自動生成される（動作確認用に活用）
- カスタムドメインが必要なら Cloudflare Dashboard の Pages 設定から追加

## ディレクトリ構成

```
project-root/
├── CLAUDE.md          # このファイル
├── spec.md            # ゲーム仕様書（全14章）
├── .gitignore         # Git除外設定
├── index.html         # エントリポイント
├── css/
│   └── style.css
├── assets/            # 画像アセット（後から差し替え前提）
│   ├── characters/    # プレイヤー・NPC
│   ├── monsters/      # モンスター画像
│   ├── items/         # アイテムアイコン
│   ├── tiles/         # 床・壁・通路・階段・水路等
│   ├── effects/       # 攻撃エフェクト・状態異常等
│   └── ui/            # UIパーツ（枠・ボタン等）
└── js/
    ├── main.js        # 初期化・ゲームループ制御
    ├── game.js        # ゲーム全体の状態管理 (GameState クラス)
    ├── dungeon.js     # BSP法によるダンジョン自動生成
    ├── player.js      # プレイヤー状態・行動
    ├── monster.js     # モンスターAI・行動処理
    ├── item.js        # アイテム生成・効果適用
    ├── combat.js      # ダメージ計算・戦闘処理
    ├── fov.js         # 視界計算 (Fog of War)
    ├── trap.js        # 罠の配置・発動
    ├── shop.js        # 店システム
    ├── renderer.js    # Canvas描画
    ├── ui.js          # UI（メニュー・メッセージログ・ステータスバー）
    ├── input.js       # キーボード・クリック入力ハンドラ
    ├── save.js        # セーブ・ロード
    ├── rng.js         # シード付き疑似乱数 (xorshift128)
    ├── sprite-manager.js  # スプライト管理（画像/フォールバック統合描画）
    └── data/
        ├── sprites.js # 全スプライト定義（画像パス＋フォールバック記号・色）
        ├── weapons.js
        ├── shields.js
        ├── rings.js
        ├── grasses.js
        ├── scrolls.js
        ├── wands.js
        ├── pots.js
        ├── monsters.js
        └── traps.js
```

## コーディング規約

### 全般
- **言語:** コード中のコメント・変数名は英語。UIテキスト・アイテム名・メッセージは日本語
- **モジュール:** `export` / `import` を使用（ `<script type="module">`）
- **クラス:** 主要エンティティは class で定義（GameState, Player, Monster, Item, Dungeon 等）
- **定数:** マジックナンバー禁止。`data/` 配下にデータ定義を集約し、上限値・計算係数も名前付き定数にする
- **状態管理:** グローバル変数を避け、GameState オブジェクトに集約する

### 命名規則
```
クラス名:     PascalCase   — Player, MonsterAI, DungeonGenerator
関数/メソッド: camelCase    — calculateDamage(), generateFloor()
定数:         UPPER_SNAKE  — MAX_INVENTORY_SIZE, TILE_WALL
ファイル名:    kebab-case   — ただし既存のフラット構成に合わせ snake も可
```

### Canvas描画
- タイルサイズ: 24x24px（デフォルト）、レスポンシブ対応で可変
- 毎ターン全体再描画ではなくダーティフラグで差分描画を基本とする
- ただし初回実装時は全体再描画でOK、最適化は後回し

## ゲームループ（イベント駆動型ターン制）

```
プレイヤー入力を待つ
  ↓
プレイヤー行動処理
  ↓
全モンスター行動処理（プレイヤーからの距離が近い順）
  ↓
罠発動チェック
  ↓
ターン終了処理:
  - 満腹度減少 (10ターンに1)
  - HP自然回復
  - 状態異常ターン経過
  - ターンカウンタ++
  ↓
画面再描画
  ↓
死亡/階段/クリア判定
  ↓
プレイヤー入力を待つ（ループ）
```

**重要:** `requestAnimationFrame` によるフレームループではない。入力イベント発火 → 1ターン処理 → 描画、の同期的なフローにすること。非同期にする場合はPromiseベースでプレイヤー入力をawaitするパターンを採用。

## 実装フェーズ

**必ず Phase 順に実装すること。前のフェーズが動作確認できてから次に進む。**

### Phase 1: MVP（まず動くものを作る）
1. `index.html` + `style.css` の骨格
2. `rng.js` — シード付き乱数
3. `sprite-manager.js` + `data/sprites.js` — スプライト管理基盤（まずフォールバック描画のみ）
4. `dungeon.js` — BSP法でマップ生成（壁・床・通路・階段）
5. `renderer.js` — Canvasにマップとプレイヤーを描画（**必ず SpriteManager 経由**）
6. `input.js` — 8方向キーボード移動
7. `player.js` — 位置、HP、レベル基本ステータス
8. `monster.js` — ノーマル系3種（緑スライム、青スライム、ネズミ小僧）、基本AI（視界内追跡/視界外ランダム移動）
9. `combat.js` — spec.md §4 のダメージ計算式
10. `game.js` — ターン制ループ制御、死亡判定
11. `ui.js` — ステータスバー、メッセージログ（最新5行）

**Phase 1 完了基準:** ダンジョンを歩き回り、敵と殴り合い、階段で次のフロアへ進めること。

### Phase 2: アイテムと装備
1. `data/*.js` — 全アイテムデータ定義
2. `item.js` — アイテム生成（フロアにランダム配置）、拾う、使う
3. 草・食料の使用効果
4. 巻物の使用効果
5. 武器・盾の装備システム（攻撃力・防御力反映）
6. 満腹度システム
7. 全モンスター種の追加と特殊能力

**Phase 2 完了基準:** アイテムを拾い、装備し、草巻物を使って戦略的にプレイできること。

### Phase 3: 中級システム
1. `fov.js` — 部屋は全体可視、通路は周囲1マスの視界ルール
2. 杖（魔法弾の直線飛行処理）
3. 壺（保存の壺、識別の壺、合成の壺）
4. 腕輪
5. 未識別システム（仮名ランダム割り当て、使用時識別、値段識別）
6. `trap.js` — 罠配置・発動処理
7. 矢の射撃処理

**Phase 3 完了基準:** 未識別アイテムの識別、杖で敵を操作、罠を踏んでの事故がゲーム体験に組み込まれていること。

### Phase 4: 上級システム
1. 印システム（合成の壺で装備合成）
2. `shop.js` — 店生成、売買UI、泥棒時の店主追跡
3. モンスターハウス
4. フロアボス（5F/10F/15F/20F）
5. `save.js` — 中断セーブ・再開ロード
6. アイテムの呪い

**Phase 4 完了基準:** 20F踏破まで一通りプレイ可能。店での売買、合成による装備強化ができること。

### Phase 5: 仕上げ
1. バランス調整（テストプレイに基づく数値チューニング）
2. タッチ/クリック操作
3. ゲームオーバー画面、クリア画面、タイトル画面
4. ミニマップ
5. 簡易アニメーション（攻撃エフェクト、ダメージ数値表示）
6. レスポンシブ対応
7. BGM/SE（Web Audio API、任意）

## 重要な実装ルール

### ダンジョン生成 (spec.md §2.3)
- BSP法を使う。マップは `number[][]` の2次元配列 (0=壁, 1=床, 2=通路, 3=階段, ...)
- **必ず全ての部屋が接続されていることを検証する**（BFSで到達確認）
- 階段はプレイヤー初期位置と異なる部屋に配置

### ダメージ計算 (spec.md §4)
```javascript
// プレイヤーの攻撃力
function calcPlayerAttack(player) {
  let lvBonus;
  if (player.level <= 5) lvBonus = Math.floor(player.level * 1.5);
  else if (player.level <= 13) lvBonus = 7 + (player.level - 5);
  else lvBonus = 15 + Math.floor((player.level - 13) * 0.5);

  const weaponStr = player.weapon ? player.weapon.baseAtk + player.weapon.enhance : 0;
  return lvBonus + player.strength + weaponStr;
}

// ダメージ計算
function calcDamage(attack, defense, rng) {
  const base = Math.max(1, attack - defense + 1);
  const roll = 0.875 + rng.next() * 0.25; // 87.5% ~ 112.5%
  return Math.max(1, Math.floor(base * roll));
}
```

### モンスターAI
- **シンプルに保つ。** A*探索は不要。視界内ならプレイヤー方向へ1マス移動（障害物があれば迂回は隣接マスの空きチェック程度）。視界外ならランダム移動。
- 特殊能力は「使用条件を満たしていれば確率で使う」のシンプルなルール
- モンスターの行動順はプレイヤーからのマンハッタン距離が近い順

### アイテム未識別
- ゲーム開始時に草・巻物・杖・壺・腕輪それぞれの仮名テーブルをシャッフルして割り当てる
- 仮名は `identified` マップで管理。`true` になった種類は以降本名表示
- 識別状態はセーブデータに含める

### 入力処理
- **1入力 = 1ターン** を厳守。メニュー操作中はターン消費しない
- ダッシュ（Shift+方向）は内部的に複数ターンの自動実行。敵が視界に入ったら自動停止
- Ctrl+方向で向きのみ変更（ターン消費なし）

### 描画
- Canvas中心にプレイヤーを配置するスクロール方式
- 未探索マスは黒、探索済み＋現在不可視は暗いグレー、可視範囲は通常色

## アセット管理（画像差し替え設計）

**全てのビジュアル要素は後から画像ファイルに差し替える前提で設計する。**
初期実装ではプレースホルダー（色付き矩形＋テキスト記号）で描画し、画像が用意でき次第 `assets/` に配置するだけで切り替わる仕組みにする。

### SpriteManager クラス（`js/sprite-manager.js`）

全ての描画はこのクラスを経由する。直接 `ctx.fillText()` や `ctx.fillRect()` でキャラクター・タイル・アイテムを描画してはいけない。

```javascript
// js/sprite-manager.js
class SpriteManager {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.sprites = new Map();  // key -> { image, loaded } | null
    this.fallbacks = new Map(); // key -> { char, color, bgColor }
  }

  // アセット定義を一括登録
  register(key, { imagePath, fallbackChar, fallbackColor, fallbackBg }) {
    // フォールバック（プレースホルダー）は必ず登録
    this.fallbacks.set(key, {
      char: fallbackChar,
      color: fallbackColor || '#FFFFFF',
      bgColor: fallbackBg || null
    });
    // imagePath があれば非同期で画像ロード試行
    if (imagePath) {
      const img = new Image();
      img.src = imagePath;
      img.onload = () => this.sprites.set(key, { image: img, loaded: true });
      img.onerror = () => this.sprites.set(key, null); // 失敗→フォールバック維持
    }
  }

  // 描画（画像があれば画像、なければフォールバック）
  draw(ctx, key, x, y) {
    const sprite = this.sprites.get(key);
    if (sprite?.loaded) {
      ctx.drawImage(sprite.image, x, y, this.tileSize, this.tileSize);
      return;
    }
    // フォールバック描画
    const fb = this.fallbacks.get(key);
    if (!fb) return;
    if (fb.bgColor) {
      ctx.fillStyle = fb.bgColor;
      ctx.fillRect(x, y, this.tileSize, this.tileSize);
    }
    ctx.fillStyle = fb.color;
    ctx.font = `${this.tileSize - 4}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(fb.char, x + this.tileSize / 2, y + this.tileSize / 2);
  }
}
```

### スプライトキー命名規則

```
カテゴリ.識別子[.状態]

tile.wall              # 壁
tile.floor             # 部屋の床
tile.corridor          # 通路
tile.stairs            # 階段
tile.water             # 水路
tile.shop              # 店の床

char.player            # プレイヤー
char.player.damaged    # 被ダメージ時（任意）
char.shopkeeper        # 店主

monster.green_slime    # 緑スライム
monster.blue_slime     # 青スライム
monster.rat            # ネズミ小僧
monster.fire_dragon    # 火竜
monster.demon_king     # 魔王
...（monsters.js の id と対応）

item.weapon.wooden_stick    # 木の棒
item.shield.wooden_shield   # 木の盾
item.grass.heal_grass       # 薬草
item.scroll.identify        # 識別の巻物
item.wand.seal              # 封印の杖
item.pot.storage            # 保存の壺
item.arrow.wood             # 木の矢
item.food.riceball          # おにぎり
item.ring.strength          # ちからの腕輪
...（各 data/*.js の id と対応）

item.unidentified.grass     # 未識別の草（共通アイコン）
item.unidentified.scroll    # 未識別の巻物
item.unidentified.wand      # 未識別の杖
item.unidentified.pot       # 未識別の壺
item.unidentified.ring      # 未識別の腕輪

trap.poison_arrow      # 毒矢の罠
trap.pitfall           # 落とし穴
trap.landmine          # 地雷
...

effect.attack          # 攻撃エフェクト
effect.magic           # 魔法弾
effect.heal            # 回復
effect.levelup         # レベルアップ
```

### フォールバック定義（プレースホルダー）

初期実装で使う記号・色の一覧。`data/sprites.js` に定義する。

```javascript
// js/data/sprites.js
export const SPRITE_DEFS = {
  // --- タイル ---
  'tile.wall':        { imagePath: 'assets/tiles/wall.png',      fallbackChar: '#', fallbackColor: '#8B8682', fallbackBg: '#3B3530' },
  'tile.floor':       { imagePath: 'assets/tiles/floor.png',     fallbackChar: '·', fallbackColor: '#6B6560', fallbackBg: '#1A1815' },
  'tile.corridor':    { imagePath: 'assets/tiles/corridor.png',  fallbackChar: '·', fallbackColor: '#5A5550', fallbackBg: '#121010' },
  'tile.stairs':      { imagePath: 'assets/tiles/stairs.png',    fallbackChar: '>', fallbackColor: '#FFD700', fallbackBg: '#1A1815' },
  'tile.water':       { imagePath: 'assets/tiles/water.png',     fallbackChar: '~', fallbackColor: '#4488CC', fallbackBg: '#112244' },
  'tile.shop':        { imagePath: 'assets/tiles/shop.png',      fallbackChar: '$', fallbackColor: '#FFD700', fallbackBg: '#2A2520' },

  // --- キャラクター ---
  'char.player':      { imagePath: 'assets/characters/player.png',    fallbackChar: '@', fallbackColor: '#00FF88', fallbackBg: null },
  'char.shopkeeper':  { imagePath: 'assets/characters/shopkeeper.png', fallbackChar: 'S', fallbackColor: '#FFD700', fallbackBg: null },

  // --- モンスター（代表例。全種は monsters.js の id から自動生成） ---
  'monster.green_slime':  { imagePath: 'assets/monsters/green_slime.png',  fallbackChar: 's', fallbackColor: '#44FF44' },
  'monster.blue_slime':   { imagePath: 'assets/monsters/blue_slime.png',   fallbackChar: 's', fallbackColor: '#4488FF' },
  'monster.rat':          { imagePath: 'assets/monsters/rat.png',          fallbackChar: 'r', fallbackColor: '#AA8855' },
  'monster.ghost':        { imagePath: 'assets/monsters/ghost.png',        fallbackChar: 'G', fallbackColor: '#CC88FF' },
  'monster.bat':          { imagePath: 'assets/monsters/bat.png',          fallbackChar: 'b', fallbackColor: '#8844AA' },
  'monster.fire_dragon':  { imagePath: 'assets/monsters/fire_dragon.png',  fallbackChar: 'D', fallbackColor: '#FF4422' },
  'monster.demon_king':   { imagePath: 'assets/monsters/demon_king.png',   fallbackChar: 'W', fallbackColor: '#FF0000' },
  // ... 全モンスターを定義

  // --- アイテム ---
  'item.weapon':              { imagePath: 'assets/items/weapon.png',       fallbackChar: ')', fallbackColor: '#CCCCCC' },
  'item.shield':              { imagePath: 'assets/items/shield.png',       fallbackChar: '[', fallbackColor: '#88AAFF' },
  'item.grass':               { imagePath: 'assets/items/grass.png',        fallbackChar: '"', fallbackColor: '#44DD44' },
  'item.scroll':              { imagePath: 'assets/items/scroll.png',       fallbackChar: '?', fallbackColor: '#FFFFAA' },
  'item.wand':                { imagePath: 'assets/items/wand.png',         fallbackChar: '/', fallbackColor: '#CC88FF' },
  'item.pot':                 { imagePath: 'assets/items/pot.png',          fallbackChar: '{', fallbackColor: '#DD8844' },
  'item.arrow':               { imagePath: 'assets/items/arrow.png',        fallbackChar: '-', fallbackColor: '#CCAA77' },
  'item.food':                { imagePath: 'assets/items/food.png',         fallbackChar: '%', fallbackColor: '#FFAA44' },
  'item.ring':                { imagePath: 'assets/items/ring.png',         fallbackChar: '=', fallbackColor: '#FFDD00' },

  // --- 罠 ---
  'trap.default':     { imagePath: 'assets/tiles/trap.png',      fallbackChar: '^', fallbackColor: '#FF4444', fallbackBg: '#1A1815' },

  // --- エフェクト ---
  'effect.attack':    { imagePath: 'assets/effects/attack.png',  fallbackChar: '*', fallbackColor: '#FFFFFF' },
  'effect.magic':     { imagePath: 'assets/effects/magic.png',   fallbackChar: '*', fallbackColor: '#AA44FF' },
};
```

### 画像差し替え手順（将来の作業者向け）

1. 画像ファイルを `assets/` の該当フォルダに配置（PNG推奨、正方形）
2. `js/data/sprites.js` の対応エントリの `imagePath` が正しいパスを指していることを確認
3. **コード変更不要** — `SpriteManager` が自動で画像をロードし、成功すればフォールバックの代わりに画像を描画する
4. 画像が見つからない・読み込み失敗の場合は自動でフォールバック（記号表示）に戻る

### 画像仕様

| 項目 | 仕様 |
|------|------|
| フォーマット | PNG（透過対応） |
| 推奨サイズ | 48×48px（Canvas側で `tileSize` にスケーリング） |
| 命名 | スプライトキーの `.` 以降をそのままファイル名に（例: `monster.fire_dragon` → `assets/monsters/fire_dragon.png`） |
| アニメーション | 当面は静止画1枚。将来対応する場合はスプライトシート方式に拡張可 |

### 実装上の厳守ルール

1. **renderer.js で直接キャラクター/タイル/アイテムを描画しない。** 必ず `spriteManager.draw(ctx, key, x, y)` を使う
2. **data/*.js の各エンティティに `spriteKey` フィールドを持たせる。** 例:
   ```javascript
   // data/monsters.js
   { id: 'green_slime', name: '緑スライム', spriteKey: 'monster.green_slime', hp: 12, atk: 4, ... }
   // data/weapons.js
   { id: 'wooden_stick', name: '木の棒', spriteKey: 'item.weapon', baseAtk: 2, ... }
   ```
   アイテムは個別画像がなければカテゴリ共通のキー（`item.weapon` 等）を使い、個別画像が用意されたら `item.weapon.wooden_stick` のように差し替えるだけでよい
3. **フォールバック定義を省略しない。** 画像がない状態でも常にプレイ可能であること

## テスト・デバッグ用コマンド

開発中は以下のデバッグ機能を `window` に公開しておく（本番では無効化）:

```javascript
window.debug = {
  revealMap: () => {},     // フロア全体を可視化
  giveItem: (id) => {},    // 任意アイテムを入手
  setFloor: (n) => {},     // 任意フロアに移動
  setLevel: (n) => {},     // レベル設定
  killAll: () => {},       // フロアの全モンスター消去
  toggleGodMode: () => {}, // 無敵モード切替
  spawnMonster: (id) => {} // 任意モンスター召喚
};
```

## よくある落とし穴

1. **ターン処理の順序ミス** — プレイヤー行動→モンスター行動の順序を崩すと不具合の温床。spec.md §14.2 のループ構造を厳守
2. **ダンジョン生成で孤立部屋** — BSP分割後の通路接続で全部屋連結を保証すること。生成後にBFS検証を入れる
3. **満腹度の減算タイミング** — 10ターンに1、毎ターンではない。ターンカウンタ % 10 === 0 で減算
4. **壺の中身管理** — 壺はアイテムの中にアイテム配列を持つ入れ子構造。所持品上限のカウントから除外する
5. **状態異常の重複** — 同じ状態異常は上書き（ターン数リセット）、異なる状態異常は共存
6. **店の泥棒判定** — 未会計の商品を持って部屋の外に出た瞬間に泥棒フラグが立つ。この判定は部屋の出入り口の座標で行う
7. **死亡時のアイテムドロップ** — モンスターを倒したらアイテムをドロップすることがある（確率約10%）。ドロップテーブルはモンスター種ごとに定義
8. **印スロット上限** — 合成時に空きスロットがなければ印は付かない。エラーではなくメッセージで通知
9. **SpriteManager を迂回した描画** — キャラ・タイル・アイテムを `ctx.fillText()` 等で直接描画すると、画像差し替え時に全箇所を修正する羽目になる。**renderer.js → SpriteManager.draw() の経路を厳守**
10. **Git コミット忘れ** — 動く状態になったら即コミット。大きな変更を一括コミットすると切り戻しが困難になる

## Claude Code への指示例

プロジェクトルートで Claude Code を起動した際の、フェーズごとの指示テンプレート。

### 初回セットアップ
```
プロジェクトの初期セットアップをしてください。
1. CLAUDE.md と spec.md を読んで全体像を把握
2. ディレクトリ構成に従ってフォルダを作成
3. Git リポジトリを初期化（git init）
4. .gitignore を作成（node_modules, .DS_Store, *.log）
5. 初回コミット
```

### Phase 1 開始
```
CLAUDE.md の Phase 1（MVP）を実装してください。
spec.md のダメージ計算式（§4）、マップ仕様（§2）、モンスターデータ（§6）を参照しながら進めてください。
Phase 1 の完了基準：ダンジョンを歩き回り、敵と殴り合い、階段で次のフロアへ進めること。
作業ブランチ phase1/mvp を切って作業し、機能ごとにこまめにコミットしてください。
```

### Phase 2〜5（同パターン）
```
CLAUDE.md の Phase N を実装してください。
spec.md の関連セクションを参照しながら進めてください。
作業ブランチ phaseN/xxx を切って作業し、機能ごとにこまめにコミットしてください。
前フェーズの機能が壊れていないことを確認しながら進めてください。
```

### バグ修正
```
以下のバグを修正してください：
[症状の説明]
[再現手順があれば記載]
spec.md の該当セクションを確認し、仕様通りの動作に修正してください。
修正後にコミットしてください。
```

### デプロイ
```
develop ブランチの最新を main にマージしてプッシュしてください。
Cloudflare Pages が自動デプロイします。
```

## 参照ドキュメント

- `spec.md` — **最も重要。全ての数値・計算式・データテーブルはここを参照すること**
  - §2: ダンジョン生成仕様
  - §3: プレイヤーステータス計算
  - §4: ダメージ計算式
  - §5: 全アイテムデータ（武器/盾/腕輪/草/巻物/杖/壺/矢/食料）
  - §6: 全モンスターデータ（ステータス・特殊能力・出現階）
  - §7: 罠一覧
  - §8: 状態異常一覧
  - §9: 店システム
  - §10: 操作キーバインド
  - §11: 画面レイアウト
  - §12: フロア別バランス設計
  - §13: セーブデータ構造
  - §14: 技術実装ガイドライン・フェーズ計画
