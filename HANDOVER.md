# 引継ぎ資料 - 迷境の旅人 Phase 1 MVP

## 作成日時
2026-02-12

## プロジェクト概要
風来のシレン風ターン制ローグライクRPGをHTML + vanilla JavaScriptで実装するプロジェクト。

## 現在の状態

### ブランチ状況
```
main     ← 現在のブランチ（Phase 1完了済み）
develop  ← mainと同期済み
phase1/mvp ← 作業完了、developにマージ済み
```

### 完了タスク

#### セットアップ
- [x] ディレクトリ構成作成（CLAUDE.md準拠）
- [x] .gitignore作成
- [x] git init + 初回コミット
- [x] develop, phase1/mvpブランチ作成
- [x] phase1/mvp → develop → main へマージ完了

#### Phase 1 MVP実装（全完了）
| ファイル | 内容 | 状態 |
|---------|------|------|
| `index.html` | ゲーム画面HTML | 完了 |
| `css/style.css` | スタイルシート | 完了 |
| `js/rng.js` | シード付き乱数（xorshift128） | 完了 |
| `js/sprite-manager.js` | スプライト管理 | 完了 |
| `js/data/sprites.js` | スプライト定義 | 完了 |
| `js/dungeon.js` | BSP法ダンジョン生成 | 完了 |
| `js/renderer.js` | Canvas描画 | 完了 |
| `js/input.js` | キーボード入力 | 完了 |
| `js/player.js` | プレイヤー状態 | 完了 |
| `js/monster.js` | モンスターAI | 完了 |
| `js/data/monsters.js` | モンスターデータ（3種） | 完了 |
| `js/combat.js` | ダメージ計算 | 完了 |
| `js/game.js` | ゲームループ | 完了 |
| `js/ui.js` | UI管理 | 完了 |
| `js/main.js` | エントリーポイント | 完了 |

### 未完了タスク

#### GitHubリポジトリ（gh CLI問題）
- [ ] `gh repo create KamiHitoe1031/maze-wanderer --public --source=. --push`
- [ ] developブランチをpush

**問題:** gh CLIがインストールされているがPATHに反映されていない
**解決方法:** システム再起動後に以下を実行：
```bash
cd "O:\AI_\Claudecode\不思議のダンジョン"
gh repo create KamiHitoe1031/maze-wanderer --public --source=. --push
git push -u origin develop
```

## ファイル構成

```
O:\AI_\Claudecode\不思議のダンジョン\
├── CLAUDE.md          # プロジェクト指示書
├── spec.md            # ゲーム仕様書（全14章）
├── HANDOVER.md        # この引継ぎ資料
├── .gitignore
├── index.html         # エントリーポイント
├── css/
│   └── style.css      # スタイルシート
├── assets/            # 画像アセット（空、後から追加）
│   ├── characters/
│   ├── monsters/
│   ├── items/
│   ├── tiles/
│   ├── effects/
│   └── ui/
└── js/
    ├── main.js        # ゲーム初期化・ループ
    ├── game.js        # ゲーム状態管理
    ├── dungeon.js     # ダンジョン生成（BSP法）
    ├── player.js      # プレイヤー状態
    ├── monster.js     # モンスターAI
    ├── combat.js      # ダメージ計算
    ├── renderer.js    # Canvas描画
    ├── input.js       # キーボード入力
    ├── ui.js          # UI管理
    ├── rng.js         # 乱数生成
    ├── sprite-manager.js # スプライト管理
    └── data/
        ├── sprites.js  # スプライト定義
        └── monsters.js # モンスターデータ
```

## 動作確認方法

1. `index.html` をブラウザで開く
2. 操作:
   - **移動:** WASD / 矢印キー / テンキー（8方向）
   - **攻撃:** F（向いている方向）
   - **待機:** スペース / テンキー5
   - **階段を降りる:** Enter

3. デバッグコマンド（ブラウザコンソールで実行）:
   ```javascript
   debug.revealMap()      // マップ全体表示
   debug.killAll()        // 全モンスター消去
   debug.heal()           // HP全回復
   debug.setFloor(5)      // 5階へ移動
   debug.setLevel(10)     // レベル10に
   ```

## 実装詳細

### ダメージ計算式（spec.md §4準拠）
```javascript
基本ダメージ = max(1, 攻撃力 - 防御力 + 1)
乱数補正 = 87.5% ～ 112.5%
最終ダメージ = floor(基本ダメージ × 乱数補正)
最低保証 = 1
```

### モンスター（Phase 1）
| 名前 | HP | 攻撃 | 防御 | 経験値 | 出現階 |
|------|-----|------|------|--------|--------|
| 緑スライム | 6 | 3 | 2 | 2 | 1-3F |
| 青スライム | 15 | 8 | 5 | 8 | 3-6F |
| ネズミ小僧 | 8 | 5 | 3 | 4 | 1-4F |

### ゲームループ
```
1. プレイヤー入力待ち
2. プレイヤー行動処理
3. モンスター行動処理（距離順）
4. ターン終了処理（満腹度、HP回復）
5. 描画
6. 死亡/クリア判定
→ 1に戻る
```

## 次のフェーズ（Phase 2）

Phase 2で実装予定:
- アイテム拾得・使用（草・巻物・食料）
- 武器・盾の装備
- 満腹度システムの完全実装
- 全モンスター種の追加
- メッセージログの拡充

詳細は `CLAUDE.md` と `spec.md` を参照。

## 注意事項

1. **SpriteManager経由での描画を厳守** - 直接Canvas描画しない
2. **spec.mdの計算式を遵守** - ダメージ計算、経験値等
3. **コミットはこまめに** - 機能単位で細かくコミット

## コミット履歴（Phase 1）

```
feat: 初期セットアップ - ディレクトリ構成を作成
feat: index.html + style.css の骨格を実装
feat: rng.js - シード付き疑似乱数生成器を実装
feat: sprite-manager.js + data/sprites.js を実装
feat: dungeon.js - BSP法によるダンジョン自動生成を実装
feat: renderer.js - Canvas描画を実装
feat: input.js - キーボード入力ハンドラを実装
feat: player.js - プレイヤー状態管理を実装
feat: monster.js + data/monsters.js - モンスターAIを実装
feat: combat.js - ダメージ計算・戦闘処理を実装
feat: game.js - ゲーム状態管理・ターン制ループを実装
feat: ui.js + main.js - UI管理とゲーム統合を実装
chore: 不要な.gitkeepファイルを削除
```
