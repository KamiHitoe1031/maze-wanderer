# 引継ぎ資料 - 迷境の旅人 Phase 2 アイテムと装備

## 更新日時
2026-02-12

## プロジェクト概要
風来のシレン風ターン制ローグライクRPGをHTML + vanilla JavaScriptで実装するプロジェクト。

## GitHubリポジトリ
https://github.com/KamiHitoe1031/maze-wanderer

## 現在の状態

### Phase 2 アイテムと装備 - 完了

アイテムシステム、装備、満腹度、全モンスター種と特殊能力を実装。
`phase2/items` ブランチで作業中。developへのマージはまだ。

### ブランチ状況
```
main          ← Phase 1完了済み
develop       ← Phase 1完了済み
phase2/items  ← 現在のブランチ（Phase 2実装完了、マージ待ち）
```

### 完了タスク

#### Phase 1 MVP（完了済み）
基本的なダンジョン探索・戦闘・階段降下が動作。

#### Phase 2 実装（全完了）
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

## ファイル構成

```
O:\AI_\Claudecode\不思議のダンジョン\
├── CLAUDE.md          # プロジェクト指示書
├── spec.md            # ゲーム仕様書（全14章）
├── HANDOVER.md        # この引継ぎ資料
├── .gitignore
├── index.html         # エントリーポイント
├── css/
│   └── style.css      # スタイルシート（インベントリUI含む）
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
    ├── monster.js     # モンスターAI（特殊能力対応）
    ├── combat.js      # ダメージ計算
    ├── item.js        # アイテム生成・効果適用
    ├── renderer.js    # Canvas描画
    ├── input.js       # キーボード入力
    ├── ui.js          # UI管理（インベントリ含む）
    ├── rng.js         # 乱数生成
    ├── sprite-manager.js # スプライト管理
    └── data/
        ├── sprites.js  # スプライト定義（全モンスター対応）
        ├── monsters.js # モンスターデータ（45種）
        ├── weapons.js  # 武器データ（11種）
        ├── shields.js  # 盾データ（10種）
        ├── grasses.js  # 草データ（17種）
        ├── scrolls.js  # 巻物データ（16種）
        └── food.js     # 食料データ（5種）
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

## Phase 2 実装詳細

### アイテムシステム
- フロア別3段階テーブル（前半1-5F / 中盤6-12F / 後半13-20F）
- 各フロアにアイテムをランダム配置（部屋ごとに0-2個 + ゴールド0-1個）
- ユニークID方式でアイテムインスタンスを管理
- 拾う/使う/装備/外す/置くアクション

### 装備システム
- 武器: baseAtk + enhance値が攻撃力に加算
- 盾: baseDef + enhance値から防御力を計算
- 盾特殊効果: 見切り(evasion), 毒消し(antidote), 錆止め(rustproof), 爆発防御(blast_guard), 満腹(fullness)

### 草・巻物・食料
- 草: 回復/強化/状態異常/復活の種 等17種
- 巻物: 強化/識別/混乱/ワープ 等16種
- 食料: おにぎり系5種（満腹度回復）
- 復活の種: 飲むとhasRevivalフラグON、死亡時に自動蘇生

### 満腹度
- 10ターンに1減少（満腹の盾装備時は20ターンに1）
- 0で飢餓ダメージ（毎ターンHP-1、無敵でも受ける）

### モンスター特殊能力（全実装）
| 系統 | 能力 | 実装 |
|------|------|------|
| 幽霊系 | 壁抜け移動 | canMoveToでwall_pass判定 |
| 幽霊系 | 乗り移り | handlePossessOnDeath |
| ドレイン系 | ちから/レベル下げ | applyOnHitAbilities |
| 竜系 | 炎ブレス（20/30/40） | processAbility fire_breath |
| 一つ目系 | 催眠術（アイテム強制使用） | processAbility hypnosis |
| 爆発系 | HP半分以下で爆発 | processAbility explode |
| タヌキ系 | アイテム盗み/おにぎり変化 | applyOnHitAbilities |
| 錆カビ | 盾強化値低下 | applyOnHitAbilities |
| 戦車系 | 遠距離弾（10/20/30） | processAbility ranged |
| 分裂スライム | 被ダメで分裂 | handleSplit |
| ボス系 | 倍速/全画面攻撃/召喚 | processAbility + isDoubleSpeed |

### フロアボス
- 5F: ガーゴイル（倍速移動）
- 10F: キマイラ（炎30+毒）
- 15F: ワイバーン（炎40+倍速）
- 20F: 魔王（全画面30+召喚）
- 階段の隣に配置

## コミット履歴（Phase 2）

```
feat: 全アイテムデータ定義を追加（武器・盾・草・巻物・食料）
feat: item.js - アイテム生成・フロア配置・拾得・使用効果システムを実装
feat: player.js - 状態異常・満腹の盾・復活の種システムを追加
feat: インベントリUI・装備管理画面を実装
feat: game.js + renderer.js + main.js - アイテム・装備・満腹度を統合
feat: 全45種モンスターデータとスプライト定義を追加
feat: モンスター特殊能力AIを実装
```

## 次のフェーズ（Phase 3: 中級システム）

Phase 3で実装予定:
- 視界システム（fov.js - 部屋全体可視/通路周囲1マス）
- 杖（魔法弾の直線飛行処理）
- 壺（保存・識別・合成の壺）
- 腕輪
- 未識別システム（仮名ランダム割り当て、使用時識別）
- 罠（trap.js - 罠配置・発動処理）
- 矢の射撃処理

詳細は `CLAUDE.md` と `spec.md` を参照。

## 次回作業時のコマンド

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

# Phase 3開始
git checkout develop
git checkout -b phase3/intermediate
```

## 注意事項

1. **SpriteManager経由での描画を厳守** - 直接Canvas描画しない
2. **spec.mdの計算式を遵守** - ダメージ計算、経験値等
3. **コミットはこまめに** - 機能単位で細かくコミット
4. **ブランチ運用** - 作業はdevelopから切って、完了後にdevelop→mainへマージ
5. **Phase 2で追加した草・巻物の仮名テーブルは定義済み** - Phase 3の未識別システムで使用予定
