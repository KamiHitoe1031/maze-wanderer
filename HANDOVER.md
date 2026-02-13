# 引継ぎ資料 - 迷境の旅人

## 更新日時
2026-02-13

## プロジェクト概要
風来のシレン風ターン制ローグライクRPGをHTML + vanilla JavaScriptで実装するプロジェクト。

## GitHubリポジトリ
https://github.com/KamiHitoe1031/maze-wanderer

---

## 現在の状態

### Phase 2 アイテムと装備 - 実装完了・マージ待ち

アイテムシステム、装備、満腹度、全45種モンスターと特殊能力を実装済み。
`phase2/items` ブランチで完了。`develop` / `main` へのマージはまだ行っていない。

### ブランチ状況
```
main          ← Phase 1完了済み
develop       ← Phase 1完了済み
phase2/items  ← 現在のブランチ（Phase 2実装完了、マージ待ち）
```

### 既知の修正済みバグ
- インベントリのキーリスナー重複登録（巻物使用後WASDが効かなくなる）→ 修正済み

---

## ネクストアクション: 画像アセットの差し替え

### 概要

現在ゲーム内のキャラクター・モンスター・アイテム・タイルは全て **テキスト記号によるフォールバック描画** で表示されている。画像アセットを `assets/` フォルダに配置するだけで自動的に画像表示に切り替わる仕組み（SpriteManager）が既に実装済み。

### アセット仕様書

**`ASSET_SPEC.md`** に全100ファイルの詳細仕様を記載済み。

### 作業の流れ

#### 1. 画像を用意する

全アセットの基本サイズは **48x48px（WEBP形式・透過対応）**。

| カテゴリ | ファイル数 | サイズ | 備考 |
|---------|-----------|--------|------|
| タイル | 7 | 48x48 静止画 | 壁・床・通路・階段 等 |
| アイテム | 29 | 48x48 静止画 | 武器11・盾10・消費アイテム8 |
| UIパーツ | 3 | サイズ可変 | タイトル320x160、HPバー96x12、ミニマップ枠120x120 |
| モンスター | 45 | 48x48 静止画 or スプライトシート | 下記参照 |
| プレイヤー | 4 | 48x48 静止画 or スプライトシート | 下記参照 |
| NPC | 1 | 48x48 静止画 or スプライトシート | 店主 |
| エフェクト | 11 | 48x48 静止画 or スプライトシート | 下記参照 |

#### 2. スプライトシートに関する方針決定が必要

ASSET_SPEC.md ではモンスター・プレイヤー・エフェクトを **横一列スプライトシート**（例: 2フレーム = 96x48px）で定義しているが、以下の問題がある：

- **1:1でないアスペクト比** → 画像生成AIで作りにくい
- 現在の `SpriteManager` はスプライトシート未対応（単体画像のみ）

**選択肢:**

| 方針 | メリット | デメリット |
|------|---------|-----------|
| A. 全て48x48静止画で統一 | 最もシンプル。現行コード変更不要。画像生成AIと相性が良い | アニメーションなし |
| B. フレーム別ファイルに分割 | 1:1維持でアニメ可。`player_walk_0.webp`, `player_walk_1.webp`... | SpriteManager改修が必要。ファイル数が増える |
| C. スプライトシート（現ASSET_SPEC通り） | 業界標準の方式 | 1:1でない。SpriteManager改修が必要。画像生成AIと相性が悪い |

**推奨: まず方針Aで画像を配置してゲームの見た目を確認し、後からアニメーション対応を検討する。**
方針Aなら現行コードを一切変更せず、画像ファイルを置くだけで済む。

#### 3. 画像ファイルの配置

```
assets/
├── tiles/          # wall.webp, floor.webp, corridor.webp, stairs.webp, ...
├── characters/     # player.webp, shopkeeper.webp
├── monsters/       # green_slime.webp, blue_slime.webp, ...（45ファイル）
├── items/          # wooden_stick.webp, copper_sword.webp, grass.webp, ...
├── effects/        # slash.webp, fire_breath.webp, ...
└── ui/             # title_logo.webp, hp_bar.webp, minimap_frame.webp
```

#### 4. sprites.js の拡張子を修正

現在 `sprites.js` の `imagePath` は `.png` 拡張子で定義されている。
WEBP形式で画像を用意する場合、`sprites.js` の全 `imagePath` を `.webp` に変更する必要がある。

```javascript
// 現状（.png）
'tile.wall': { imagePath: 'assets/tiles/wall.png', ... }

// 変更後（.webp）
'tile.wall': { imagePath: 'assets/tiles/wall.webp', ... }
```

一括置換で対応可能（`.png` → `.webp`）。

#### 5. アイテム個別画像の対応（任意）

現在アイテムはカテゴリ共通アイコン（`item.weapon`, `item.shield` 等）で表示。
個別画像を用意した場合、`sprites.js` にエントリを追加し、各アイテムデータの `spriteKey` を変更する。

```javascript
// sprites.js に追加
'item.weapon.iron_katana': { imagePath: 'assets/items/iron_katana.webp', fallbackChar: ')', fallbackColor: '#CCCCCC' },

// data/weapons.js の該当アイテムを変更
{ id: 'iron_katana', spriteKey: 'item.weapon.iron_katana', ... }  // item.weapon → item.weapon.iron_katana
```

### SpriteManager の現在の仕様

- **場所:** `js/sprite-manager.js`
- **機能:** `draw(ctx, key, x, y)` — 画像がロード済みならそれを描画、なければフォールバック（テキスト記号）を描画
- **画像ロード:** `register()` 時に `new Image()` で非同期ロード。失敗したら自動でフォールバックに戻る
- **スプライトシート:** 未対応。単体画像を `tileSize` にスケーリングして描画するのみ
- **アニメーション:** 未対応。将来追加する場合は `drawFrame(ctx, key, x, y, frameIndex)` のようなメソッドを追加する

---

## ファイル構成

```
O:\AI_\Claudecode\不思議のダンジョン\
├── CLAUDE.md          # プロジェクト指示書
├── spec.md            # ゲーム仕様書（全14章）
├── HANDOVER.md        # この引継ぎ資料
├── ASSET_SPEC.md      # 画像アセット仕様書（全100ファイル）
├── .gitignore
├── index.html         # エントリーポイント
├── css/
│   └── style.css      # スタイルシート（インベントリUI含む）
├── assets/            # 画像アセット（現在は空、ここに画像を配置）
│   ├── characters/
│   ├── monsters/
│   ├── items/
│   ├── tiles/
│   ├── effects/
│   └── ui/
└── js/
    ├── main.js            # ゲーム初期化・ループ
    ├── game.js            # ゲーム状態管理
    ├── dungeon.js         # ダンジョン生成（BSP法）
    ├── player.js          # プレイヤー状態
    ├── monster.js         # モンスターAI（特殊能力対応）
    ├── combat.js          # ダメージ計算
    ├── item.js            # アイテム生成・効果適用
    ├── renderer.js        # Canvas描画
    ├── input.js           # キーボード入力
    ├── ui.js              # UI管理（インベントリ含む）
    ├── rng.js             # 乱数生成
    ├── sprite-manager.js  # スプライト管理（画像/フォールバック自動切替）
    └── data/
        ├── sprites.js     # スプライト定義（全キー + imagePath + フォールバック）
        ├── monsters.js    # モンスターデータ（45種）
        ├── weapons.js     # 武器データ（11種）
        ├── shields.js     # 盾データ（10種）
        ├── grasses.js     # 草データ（17種）
        ├── scrolls.js     # 巻物データ（16種）
        └── food.js        # 食料データ（5種）
```

## 操作方法

- **移動:** WASD / 矢印キー / テンキー（8方向）
- **攻撃:** F（向いている方向）、または移動先に敵がいれば自動攻撃
- **待機:** スペース / テンキー5
- **拾う/階段:** Enter
- **インベントリ:** I
  - 上下キー: アイテム選択
  - Enter: アクションメニュー表示
  - Escape: 閉じる

### ローカル動作確認

`file://` プロトコルではES Modulesが動作しないため、HTTPサーバーが必要。

```bash
cd "O:\AI_\Claudecode\不思議のダンジョン"
python -m http.server 8080
# → http://localhost:8080 でアクセス
```

### デバッグコマンド（ブラウザコンソール）
```javascript
debug.revealMap()              // マップ全体表示
debug.killAll()                // 全モンスター消去
debug.heal()                   // HP全回復
debug.setFloor(5)              // 5階へ移動
debug.setLevel(10)             // レベル10に
debug.giveItem('heal_grass', 'grass')   // 薬草を入手
debug.giveItem('iron_katana', 'weapon') // 鉄の刀を入手
debug.giveItem('iron_shield', 'shield') // 鉄の盾を入手
debug.spawnMonster('fire_dragon')       // 火竜を召喚
```

---

## 完了済みフェーズ

### Phase 1 MVP（完了）
基本的なダンジョン探索・戦闘・階段降下が動作。

### Phase 2 アイテムと装備（完了・マージ待ち）

| ファイル | 内容 | 状態 |
|---------|------|------|
| `js/data/weapons.js` | 武器データ11種 | 完了 |
| `js/data/shields.js` | 盾データ10種 | 完了 |
| `js/data/grasses.js` | 草データ17種（仮名テーブル付き） | 完了 |
| `js/data/scrolls.js` | 巻物データ16種（仮名テーブル付き） | 完了 |
| `js/data/food.js` | 食料データ5種 | 完了 |
| `js/item.js` | アイテム生成・配置・拾得・使用効果 | 完了 |
| `js/player.js` | 状態異常・復活の種・満腹の盾追加 | 完了 |
| `js/ui.js` | インベントリUI（Promise型モーダル） | 完了 |
| `css/style.css` | インベントリUIスタイル追加 | 完了 |
| `js/game.js` | アイテム統合・装備・使用・ドロップ | 完了 |
| `js/renderer.js` | フロアアイテム描画追加 | 完了 |
| `js/main.js` | インベントリUI統合 | 完了 |
| `js/data/monsters.js` | 全45種モンスターデータ | 完了 |
| `js/data/sprites.js` | 全モンスタースプライト定義 | 完了 |
| `js/monster.js` | モンスター特殊能力AI | 完了 |

---

## 今後のフェーズ（参考）

### Phase 3: 中級システム
- 視界システム（fov.js - 部屋全体可視/通路周囲1マス）
- 杖（魔法弾の直線飛行処理）
- 壺（保存・識別・合成の壺）
- 腕輪
- 未識別システム（仮名ランダム割り当て、使用時識別）
- 罠（trap.js - 罠配置・発動処理）
- 矢の射撃処理

### Phase 4: 上級システム
- 印システム（合成の壺）、店、モンスターハウス、フロアボス、セーブ・ロード、呪い

### Phase 5: 仕上げ
- バランス調整、タッチ操作、画面演出、ミニマップ、レスポンシブ、BGM/SE

詳細は `CLAUDE.md` と `spec.md` を参照。

---

## マージ手順（アセット差し替え前または後に実施）

```bash
cd "O:\AI_\Claudecode\不思議のダンジョン"

# Phase 2をdevelopにマージ
git checkout develop
git merge phase2/items
git push origin develop

# 動作確認後、mainにマージ
git checkout main
git merge develop
git push origin main
```

---

## 注意事項

1. **SpriteManager経由での描画を厳守** - `renderer.js` で直接Canvas描画しない
2. **画像を置くだけで切り替わる** - コード変更は不要（拡張子が一致していれば）
3. **拡張子の統一** - 現在 `sprites.js` は `.png` 指定。WEBP画像を使うなら一括置換が必要
4. **フォールバックは削除しない** - 画像がない状態でも常にプレイ可能であること
5. **spec.mdの計算式を遵守** - ダメージ計算、経験値等
6. **Phase 2で追加した草・巻物の仮名テーブルは定義済み** - Phase 3の未識別システムで使用予定
