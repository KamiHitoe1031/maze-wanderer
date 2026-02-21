# 引継ぎ資料 - 迷境の旅人

## 更新日時
2026-02-21

## プロジェクト概要
風来のシレン風ターン制ローグライクRPGをHTML + vanilla JavaScriptで実装するプロジェクト。

## GitHubリポジトリ
https://github.com/KamiHitoe1031/maze-wanderer

## デプロイ先
Cloudflare Pages（`main` ブランチへのpushで自動デプロイ）

---

## 現在の状態

### 実装進捗: Phase 1〜4 完了、Phase 5 部分実装

Phase 1（MVP）〜Phase 4（上級システム）の主要機能がすべて `main` ブランチにマージ・デプロイ済み。
Phase 5（仕上げ）の一部機能（画像アセット・アニメーション・UI改善）も実装済み。

### ブランチ状況
```
main          ← 全機能マージ済み（本番環境、Cloudflare Pagesデプロイ対象）
phase2/items  ← 古い作業ブランチ（mainより大幅に遅れている。使用しない）
```

---

## 実装済み機能一覧

### Phase 1: MVP
- BSP法ダンジョン自動生成（全部屋接続保証）
- 8方向移動・ターン制ゲームループ
- 基本戦闘（spec.md §4 のダメージ計算式準拠）
- Canvas描画（SpriteManager経由）
- メッセージログ・ステータスバー

### Phase 2: アイテムと装備
- 全アイテムカテゴリ: 武器(11種)・盾(10種)・草(17種)・巻物(16種)・杖・壺(13種)・腕輪・矢・食料(5種)
- 装備システム（武器・盾・腕輪2枠）
- 満腹度システム（10ターンに1減少）
- 全45種モンスターと特殊能力AI
- インベントリUI（Promise型モーダル）

### Phase 3: 中級システム
- 視界システム（部屋全体可視/通路周囲1マス）
  - `explored`（永続的探索済み）と `visible`（現在の可視範囲）を分離
- 杖システム（魔法弾の直線飛行処理）
- 壺システム（保存・識別・合成・変化・強化・弱化・やりすごし・底抜け・割れない・呪い等）
- 腕輪システム（ちから・千里眼・ワナ見え等）
- 未識別システム（仮名ランダム割り当て、使用時識別、値段識別）
- 罠システム（毒矢・落とし穴・地雷・睡眠・混乱・回転・錆・空腹・ワープ・召喚等）
- 矢の射撃処理
- 印システム（合成の壺で装備合成、特殊効果の印移植）

### Phase 4: 上級システム
- マルチダンジョン（3ダンジョン: 霧幻の塔20F / 深緑の迷宮25F / 海淵の洞窟25F）
- ボス戦（各ダンジョンの特定階にボスモンスター）
- モンスターハウス（ランダム発生）
- ショップシステム（ショップアンロックレベル1〜5、売買UI）
- 中断セーブ・再開（localStorage、1回限り）
- クラウドセーブ（Supabase REST API、ユーザーID/パスワード認証）
- タイトル画面（はじめから / つづきから / 操作説明）
- 町画面（Canvas歩行型マップ、NPC対話でショップ・倉庫・ダンジョン選択）
- 倉庫システム（アイテム預け入れ・持ち出し）
- 統計情報（倒したモンスター数・拾ったアイテム数・最高到達階）

### Phase 5 相当（部分実装済み）
- エフェクトアニメーション（スプライトシートベース、12種）
- ミニマップ（サイドパネル上部、プレイヤー中心スクロール）
- 画像アセット80枚以上（モンスター・アイテム・エフェクト・キャラクター）
- 町タイル画像8枚 + NPC画像2枚（Gemini API生成）
- 町アニメーション（木の揺れ、水の波紋、花の揺れ、キャラ呼吸）
- サウンドシステム（BGM/SE、MP3、ミュート切替）
- アイテム説明文表示（識別済み/未識別対応）
- 未識別アイテムのビジュアル区別（紫色+イタリック+「?」マーク）

---

## ファイル構成

```
O:\AI_\Claudecode\不思議のダンジョン\
├── CLAUDE.md              # プロジェクト指示書
├── spec.md                # ゲーム仕様書（全14章）
├── HANDOVER.md            # この引継ぎ資料
├── ASSET_SPEC.md          # 画像アセット仕様書
├── .gitignore
├── index.html             # エントリーポイント
├── css/
│   └── style.css          # スタイルシート
├── secrets/               # APIキー（.gitignoreで除外）
├── scripts/
│   ├── generate_town_assets.py    # Gemini API画像生成
│   ├── generate_assets.py         # Gemini APIモンスター/アイテム画像生成
│   ├── generate_sounds.py         # サウンド生成
│   └── create_spritesheets.py     # プログラムによるスプライトシート生成
├── assets/
│   ├── characters/        # player.png, shopkeeper.png, warehouse_keeper.png, dungeon_guide.png + idle sheets
│   ├── monsters/          # 55種以上のモンスターPNG
│   ├── items/             # 武器・盾・消費アイテムPNG（83ファイル）
│   ├── effects/           # エフェクトアニメーション（スプライトシート12種）
│   ├── tiles/             # ダンジョン・町タイル画像 + スプライトシート
│   ├── ui/                # UI画像（未作成）
│   └── sounds/            # BGM/SE（MP3、20ファイル以上）
└── js/
    ├── main.js            # ゲーム初期化・シーン管理・ゲームループ
    ├── game.js            # ゲーム状態管理・ターン処理・識別システム
    ├── dungeon.js         # ダンジョン生成（BSP法）、width/heightプロパティ付き
    ├── player.js          # プレイヤー状態・ちからデバフ回復
    ├── monster.js         # モンスターAI・特殊能力（60+種）
    ├── combat.js          # ダメージ計算・戦闘処理
    ├── item.js            # アイテム生成・全効果適用
    ├── trap.js            # 罠配置・発動処理
    ├── renderer.js        # Canvas描画・視界管理（explored/visible分離）・アニメーション
    ├── minimap.js         # ミニマップ描画（プレイヤー中心）
    ├── input.js           # キーボード入力（Ctrl+方向=向き変更対応）
    ├── ui.js              # UI管理（インベントリ・メッセージ・ステータスバー・アイテム説明文）
    ├── save.js            # ローカルセーブ・中断セーブ（localStorage）
    ├── cloud-save.js      # Supabaseクラウドセーブ（REST API直接呼出し）
    ├── scene-manager.js   # シーン管理（TITLE / TOWN / DUNGEON）
    ├── town.js            # 町画面（Canvas歩行型、アニメーションループ付き）
    ├── town-map.js        # 町マップデータ（30x22固定、NPC配置）
    ├── sound-manager.js   # サウンド管理（BGM/SE、Web Audio API）
    ├── rng.js             # シード付き乱数（xorshift128）
    ├── sprite-manager.js  # スプライト管理（画像/フォールバック/タイルアニメ/キャラアイドル）
    └── data/
        ├── sprites.js     # 全スプライト定義 + ANIMATED_TILES/ANIMATED_CHARS Set
        ├── config.js      # ゲーム設定定数
        ├── dungeons.js    # ダンジョン定義（3ダンジョン + ショップ品揃え）
        ├── monsters.js    # モンスターデータ（60+種、3ダンジョン対応）
        ├── weapons.js     # 武器データ（30+種）
        ├── shields.js     # 盾データ（13+種）
        ├── grasses.js     # 草データ（17種 + 仮名テーブル）
        ├── scrolls.js     # 巻物データ（16種 + 仮名テーブル）
        ├── wands.js       # 杖データ（+ 仮名テーブル）
        ├── pots.js        # 壺データ（13種 + 仮名テーブル）
        ├── rings.js       # 腕輪データ（+ 仮名テーブル）
        ├── arrows.js      # 矢データ
        ├── food.js        # 食料データ（5種）
        ├── traps.js       # 罠データ
        └── seals.js       # 印（合成効果）データ
```

---

## 操作方法

| 操作 | キー |
|------|------|
| 移動 | WASD / 矢印キー / テンキー（8方向） |
| 攻撃 | F（向いている方向）/ 移動先に敵がいれば自動攻撃 |
| 向き変更（ターン消費なし） | Ctrl + 方向キー |
| 待機 | スペース / テンキー5 |
| 拾う / 階段 | Enter |
| インベントリ | I |
| 中断セーブ | Esc（ダンジョン内） |
| ミュート切替 | M |

### 町画面での操作
| 操作 | キー |
|------|------|
| 移動 | WASD / 矢印キー / テンキー |
| NPC対話 | Enter（向いている方向のNPCに話しかける） |
| メニュー閉じる | Escape |

---

## アーキテクチャ

### シーン遷移
```
TITLE（タイトル画面）
  ├── はじめから → TOWN
  └── つづきから → DUNGEON（中断セーブ復元）

TOWN（町画面 - Canvas歩行型、アニメーションループ常時稼働）
  ├── 道具屋NPC → ショップオーバーレイ（売買）
  ├── 倉庫番NPC → 倉庫オーバーレイ（預入/持出）
  └── 冒険者ギルドNPC → ダンジョン選択 → DUNGEON

DUNGEON（ダンジョン探索）
  ├── 階段降下 → 次の階
  ├── クリア → TOWN（アイテム持ち帰り）
  ├── 死亡 → TITLE
  └── 中断セーブ → TITLE
```

### 視界システム（renderer.js）
- **`dungeon.explored[y][x]`**: 永続的な探索済みフラグ。一度見たタイル・アイテムは表示し続ける
- **`renderer.visible[y][x]`**: 現在ターンの可視範囲。毎ターンリセット。モンスター表示に使用
- **`renderer.clairvoyant`**: 見通し状態。trueなら全探索済みマスのモンスターを表示

### アニメーションシステム（sprite-manager.js）
- **`animTimestamp`**: グローバルアニメーション時計（`tick(deltaMs)` で加算）
- **`drawAnimatedTile()`**: 静止画のソース矩形を1-2pxずらして揺れ効果（木・水・花）
- **`drawCharIdle()`**: 1px上下動で呼吸モーション（プレイヤー・NPC）
- **`ANIMATED_TILES` Set**: アニメーション対象タイルキー（sprites.js）
- **`ANIMATED_CHARS` Set**: アニメーション対象キャラキー（sprites.js）

### 町アニメーション（town.js）
- `_startTownAnimLoop()` で requestAnimationFrame ループ開始
- ~15fpsで `spriteManager.tick()` → `render()` を繰り返し
- シーン退出時に `_animLoopActive = false` でループ停止

### 未識別システム（game.js）
- 対象カテゴリ: 草・巻物・杖・壺・腕輪
- `fakeNameMap`: ゲーム開始時にランダムに仮名を割り当て
- `identifiedMap`: 使用時や鑑定の巻物で識別
- `getDisplayName()`: 未識別なら仮名、識別済みなら本名を返す
- `isIdentified()`: 武器・盾・食料・矢・金は常にtrue

### インベントリUI（ui.js）
- アイテム選択時に `.inventory-desc` で説明文を表示
- 未識別アイテムは `.unidentified` クラス（紫色+イタリック+「?」）
- 武器/盾は基礎ステータス（攻撃力/防御力/印スロット）も表示

### 画像生成（scripts/）
- `generate_town_assets.py`: Gemini API で画像生成。APIキーは `secrets/api-keys.secrets.md` から読み取り
- `generate_assets.py`: Gemini API でモンスター・アイテム画像生成
- `create_spritesheets.py`: 静止画から wave_distort, vertical_shift でスプライトシート生成
- **重要**: `resize_to_target()` は中心クロップ後リサイズ（APIが縦長画像を返すため）

---

## 既知の課題・TODO

### 未実装・改善候補
- ダンジョンタイル画像（`assets/tiles/wall.png`, `floor.png`, `stairs.png` 等）が未作成（フォールバック描画で動作中）
  - 町タイル画像は生成済み
- UI画像アセットが未作成（`assets/ui/` は空）
- タッチ/クリック操作（モバイル対応）
- レスポンシブ対応
- バランス調整（テストプレイベース）
- 店の泥棒システム（店主追跡は未実装）
- アイテムの呪いシステム（部分実装）
- ゲームオーバー画面・クリア画面のリッチ化

### 3D化プロジェクト（別PJ）
- `O:\AI_\Claudecode\meikyo-3d-docs\` に設計書一式を作成済み
- Three.js + Vite で3D化する場合の全ドキュメント
- 本プロジェクトのゲームロジック（~4,800行）をそのまま再利用可能

---

## ローカル動作確認

`file://` プロトコルではES Modulesが動作しないため、HTTPサーバーが必要。

```bash
cd "O:\AI_\Claudecode\不思議のダンジョン"
python -m http.server 8080
# → http://localhost:8080 でアクセス
```

## デバッグコマンド（ブラウザコンソール）
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

## 注意事項

1. **SpriteManager経由での描画を厳守** — `renderer.js` で直接Canvas描画しない
2. **フォールバックは削除しない** — 画像がない状態でも常にプレイ可能であること
3. **spec.mdの計算式を遵守** — ダメージ計算、経験値、レベルアップ等
4. **中断セーブでdungeon.themeを保存** — 忘れると復帰時に黒画面になる
5. **visible配列とexplored配列を混同しない** — モンスター表示は`visible`、タイル/アイテムは`explored`
6. **Dungeon.width/heightプロパティ** — コンストラクタで `MAP_WIDTH`/`MAP_HEIGHT` を設定済み。renderer.jsがこれを参照
7. **外部ライブラリ一切不使用** — vanilla JS + ES Modules のみ
8. **Cloudflare Pages自動デプロイ** — `main` ブランチにpushすれば自動反映
9. **APIキーはsecrets/に保存** — `secrets/` と `*.secrets.md` は `.gitignore` で除外済み。絶対にコミットしない
10. **Gemini画像生成時は中心クロップ** — APIが縦長画像を返すため、正方形にクロップしてからリサイズする
