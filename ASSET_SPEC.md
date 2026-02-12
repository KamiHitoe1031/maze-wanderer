# 画像アセット仕様書 - 迷境の旅人

## 共通仕様

| 項目 | 値 |
|------|-----|
| **フォーマット** | WEBP（透過対応） |
| **基本サイズ** | **48x48px**（Canvas上は24x24pxにスケーリング描画） |
| **背景** | 透過（キャラ・モンスター・アイテム・エフェクト）、不透過OK（タイル） |
| **スプライトシート方式** | 横一列並び。1フレーム48x48、横に連結 |

---

## 1. タイル（静止画 x 7種）

各 48x48px 単体画像。

| ファイル名 | 内容 | 備考 |
|-----------|------|------|
| `tiles/wall.webp` | 壁 | 石壁・暗い色調 |
| `tiles/floor.webp` | 部屋の床 | 明るめの石畳 |
| `tiles/corridor.webp` | 通路 | 床より暗い石畳 |
| `tiles/stairs.webp` | 階段（下り） | 明確に目立つ黄色系 |
| `tiles/water.webp` | 水路 | 青系、将来用 |
| `tiles/shop.webp` | 店の床 | 金色/特殊模様、将来用 |
| `tiles/trap.webp` | 罠 | 赤系の警告模様、将来用 |

**計: 7ファイル**

---

## 2. プレイヤーキャラクター

### 武器タイプの視覚分類

現在の武器11種を視覚的に分類すると **4タイプ**。

| 武器タイプ | 該当武器 |
|-----------|----------|
| **剣（片手剣/刀/太刀）** | 銅の剣、鉄の刀、鋼の太刀、霊刀、竜斬りの剣、一つ目斬り、ドレイン斬り、伝説の剣 |
| **棒（杖/棍棒）** | 木の棒 |
| **鎌（かまいたち）** | 妖刀かまいたち |
| **つるはし** | つるはし |

ただし本ゲームはドット絵24px表示のため、武器を持つ手元の違いはほぼ見えない。
**キャラの攻撃アニメは1種のみ**とし、武器の違いは **攻撃エフェクト** で表現する。

### 最小構成（推奨）: 武器タイプ区別なし

| ファイル名 | 種別 | フレーム数 | シートサイズ | 内容 |
|-----------|------|-----------|-------------|------|
| `characters/player_idle.webp` | スプライトシート | **2枚** | 96x48 | 待機（微動、呼吸的な揺れ） |
| `characters/player_walk.webp` | スプライトシート | **4枚** | 192x48 | 歩行（左足→中間→右足→中間） |
| `characters/player_attack.webp` | スプライトシート | **3枚** | 144x48 | 攻撃（振りかぶり→振り下ろし→戻り） |
| `characters/player_damage.webp` | スプライトシート | **2枚** | 96x48 | 被ダメ（のけぞり→戻り） |

**方向**: 全て **正面（下向き）のみ** で作成。コード側で左右反転・色調変化で4方向を表現。

### 拡張構成（将来対応）: 武器タイプ別攻撃アニメ

後から追加する場合、攻撃アニメのみ武器タイプ別に差し替え。

| ファイル名 | フレーム数 | シートサイズ | 内容 |
|-----------|-----------|-------------|------|
| `characters/player_attack_sword.webp` | 3枚 | 144x48 | 剣系の斬撃モーション |
| `characters/player_attack_stick.webp` | 3枚 | 144x48 | 棒で叩くモーション |
| `characters/player_attack_scythe.webp` | 3枚 | 144x48 | 鎌の横薙ぎモーション |
| `characters/player_attack_pickaxe.webp` | 3枚 | 144x48 | つるはしの振り下ろし |

**プレイヤー計（最小構成）: 4ファイル**

---

## 3. NPC

| ファイル名 | 種別 | フレーム数 | シートサイズ | 内容 |
|-----------|------|-----------|-------------|------|
| `characters/shopkeeper.webp` | スプライトシート | **2枚** | 96x48 | 店主待機 |

**計: 1ファイル**

---

## 4. モンスター（45種）

全て **スプライトシート 2フレーム**（待機アニメ: 微動の繰り返し）。シートサイズ: **96x48px**。

### ノーマル系（8種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/green_slime.webp` | 緑スライム | 緑色の半透明スライム、小型 |
| `monsters/blue_slime.webp` | 青スライム | 青色のスライム、中型 |
| `monsters/red_slime.webp` | 赤スライム | 赤色のスライム、大型、怒り顔 |
| `monsters/rat.webp` | ネズミ小僧 | 小さなネズミ、二足歩行 |
| `monsters/rat_boss.webp` | ネズミ大将 | 大きなネズミ、頭に鉢巻き |
| `monsters/rock_golem.webp` | 岩ゴーレム | 灰色の岩で構成された人型 |
| `monsters/iron_golem.webp` | 鉄ゴーレム | 銀色の鉄製ゴーレム |
| `monsters/diamond_golem.webp` | ダイヤゴーレム | 水色に輝くゴーレム |

### 幽霊系（4種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/ghost.webp` | 幽霊 | 白く半透明な幽霊、ひとだま |
| `monsters/vengeful_spirit.webp` | 怨霊 | 紫がかった怨霊、怒りの表情 |
| `monsters/ghost_warrior.webp` | 亡霊武者 | 鎧を着た半透明の武士 |
| `monsters/evil_warrior.webp` | 悪霊武者 | 黒い鎧の武者、赤い目 |

### ドレイン系（6種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/vampire_bat.webp` | 吸血コウモリ | 紫の小さなコウモリ |
| `monsters/big_vampire_bat.webp` | 大吸血コウモリ | 大型の黒いコウモリ、牙が目立つ |
| `monsters/poison_scorpion.webp` | 毒サソリ | 紫色のサソリ |
| `monsters/deadly_scorpion.webp` | 猛毒サソリ | 大型の赤黒いサソリ、毒液が滴る |
| `monsters/exp_drainer.webp` | 経験吸い | ピンク色の浮遊する球体、触手 |
| `monsters/big_exp_drainer.webp` | 大経験吸い | 大型で赤紫の球体 |

### 竜系（3種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/small_dragon.webp` | 小竜 | 小型のオレンジ色のドラゴン |
| `monsters/fire_dragon.webp` | 火竜 | 赤い大型ドラゴン、口から火 |
| `monsters/sky_dragon.webp` | 天竜 | 水色の神々しいドラゴン |

### 一つ目系（4種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/cyclops_kid.webp` | 一つ目小僧 | 小型の一つ目妖怪 |
| `monsters/hypno_eye.webp` | 催眠目玉 | 浮遊する黄色い巨大目玉 |
| `monsters/evil_eye.webp` | 邪眼目玉 | オレンジ色の目玉、瞳に渦巻き |
| `monsters/demon_eye.webp` | 魔眼目玉 | 赤い目玉、禍々しいオーラ |

### 爆発系（3種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/bomb_urchin.webp` | 爆弾ウニ | オレンジのウニ型、導火線付き |
| `monsters/big_bomb_urchin.webp` | 大爆弾ウニ | 大型のウニ、赤い導火線が燃えている |
| `monsters/mine_urchin.webp` | 地雷ウニ | 真っ赤なウニ、危険マーク |

### 特殊行動系（11種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/thief_tanuki.webp` | こそ泥タヌキ | 小さなタヌキ、風呂敷を背負う |
| `monsters/big_thief_tanuki.webp` | 大泥棒タヌキ | 大型タヌキ、大きな風呂敷 |
| `monsters/riceball_tanuki.webp` | おにぎり狸 | タヌキ、おにぎりを持っている |
| `monsters/rust_mold.webp` | 錆カビ | 茶色のカビ状モンスター |
| `monsters/big_rust_mold.webp` | 大錆カビ | 大型の茶色カビ、金属片が付着 |
| `monsters/grass_frog.webp` | 草投げ蛙 | 緑の蛙、草を持っている |
| `monsters/tank.webp` | 戦車 | 小型の灰色戦車 |
| `monsters/heavy_tank.webp` | 重戦車 | 中型の濃い灰色戦車 |
| `monsters/super_tank.webp` | 超戦車 | 大型の赤い戦車、砲身が太い |
| `monsters/split_slime.webp` | 分裂スライム | 緑色のスライム、中心に亀裂 |
| `monsters/big_split_slime.webp` | 大分裂スライム | 大型の緑スライム、複数の核 |

### フロアボス（4種）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `monsters/gargoyle.webp` | ガーゴイル | 紫色の石像、翼あり |
| `monsters/chimera.webp` | キマイラ | 獅子+山羊+蛇の合成獣 |
| `monsters/wyvern.webp` | ワイバーン | 青い翼竜、大型 |
| `monsters/demon_king.webp` | 魔王 | 赤黒いローブ、王冠、最大サイズ |

**計: 45ファイル（各96x48px スプライトシート 2フレーム）**

---

## 5. アイテムアイコン（全て静止画 48x48px）

### 武器（11種 個別アイコン）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `items/wooden_stick.webp` | 木の棒 | 茶色の木の棒 |
| `items/copper_sword.webp` | 銅の剣 | 銅色の短剣 |
| `items/iron_katana.webp` | 鉄の刀 | 銀色の和刀 |
| `items/steel_tachi.webp` | 鋼の太刀 | 光沢のある太刀 |
| `items/spirit_sword.webp` | 霊刀 | 紫がかった刀、霊気エフェクト |
| `items/dragon_sword.webp` | 竜斬りの剣 | 赤い刀身、竜の装飾 |
| `items/cyclops_sword.webp` | 一つ目斬り | 目のモチーフが柄に |
| `items/drain_sword.webp` | ドレイン斬り | 暗紫色の刀身 |
| `items/pickaxe.webp` | つるはし | T字型のつるはし |
| `items/kamaitachi.webp` | 妖刀かまいたち | 風を纏った鎌状の刀 |
| `items/legendary_sword.webp` | 伝説の剣 | 金色に輝く大剣 |

### 盾（10種 個別アイコン）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `items/wooden_shield.webp` | 木の盾 | 丸い木盾 |
| `items/copper_shield.webp` | 銅の盾 | 銅色のカイトシールド |
| `items/iron_shield.webp` | 鉄の盾 | 銀色の鉄盾 |
| `items/steel_shield.webp` | 鋼鉄の盾 | 厚みのある鋼盾 |
| `items/evasion_shield.webp` | 見切りの盾 | 軽量で薄い、青い装飾 |
| `items/antidote_shield.webp` | 毒消しの盾 | 緑の模様、蛇モチーフ |
| `items/rustproof_shield.webp` | 錆止めの盾 | 金属光沢、油が塗られた感じ |
| `items/blast_shield.webp` | 爆発防御の盾 | 赤い耐熱加工の盾 |
| `items/fullness_shield.webp` | 満腹の盾 | おにぎりの装飾 |
| `items/legendary_shield.webp` | 伝説の盾 | 金色に輝く大盾 |

### 消費アイテム（カテゴリ共通アイコン）

| ファイル名 | 名前 | デザイン指示 |
|-----------|------|-------------|
| `items/grass.webp` | 草（共通） | 緑の薬草、葉が2-3枚 |
| `items/scroll.webp` | 巻物（共通） | 巻かれた羊皮紙 |
| `items/food.webp` | 食料（共通） | おにぎり |
| `items/gold.webp` | お金 | 金貨の山 |
| `items/ring.webp` | 腕輪（共通） | 金の腕輪（Phase 3用） |
| `items/wand.webp` | 杖（共通） | 魔法の杖（Phase 3用） |
| `items/pot.webp` | 壺（共通） | 陶器の壺（Phase 3用） |
| `items/arrow.webp` | 矢（共通） | 矢筒と矢（Phase 3用） |

**計: 29ファイル**

---

## 6. エフェクト（スプライトシート）

| ファイル名 | フレーム数 | シートサイズ | 内容 |
|-----------|-----------|-------------|------|
| `effects/slash.webp` | **3枚** | 144x48 | 剣系攻撃エフェクト（白い斬撃線） |
| `effects/blunt.webp` | **3枚** | 144x48 | 棒/つるはし系（星型の衝撃） |
| `effects/wind.webp` | **3枚** | 144x48 | かまいたち（風の刃3方向） |
| `effects/fire_breath.webp` | **4枚** | 192x48 | 炎ブレス（火球→拡散） |
| `effects/explosion.webp` | **4枚** | 192x48 | 爆発（膨張→消散） |
| `effects/magic.webp` | **3枚** | 144x48 | 魔法弾（紫の光球） |
| `effects/heal.webp` | **3枚** | 144x48 | 回復（緑の光粒子が上昇） |
| `effects/levelup.webp` | **3枚** | 144x48 | レベルアップ（黄色い光柱） |
| `effects/damage.webp` | **2枚** | 96x48 | 被ダメ（赤いフラッシュ） |
| `effects/steal.webp` | **3枚** | 144x48 | 盗み（アイテムが飛んでいく） |
| `effects/bullet.webp` | **3枚** | 144x48 | 戦車の弾（銀の弾丸が飛ぶ） |

**計: 11ファイル**

---

## 7. UIパーツ（静止画・サイズ可変）

| ファイル名 | サイズ | 内容 |
|-----------|------|------|
| `ui/title_logo.webp` | 320x160 | タイトルロゴ「迷境の旅人」 |
| `ui/hp_bar.webp` | 96x12 | HPバーフレーム |
| `ui/minimap_frame.webp` | 120x120 | ミニマップ枠（Phase 5用） |

**計: 3ファイル**

---

## 総計

| カテゴリ | ファイル数 |
|---------|-----------|
| タイル | 7 |
| プレイヤー | 4 |
| NPC | 1 |
| モンスター | 45 |
| アイテム | 29 |
| エフェクト | 11 |
| UI | 3 |
| **合計** | **100ファイル** |

---

## 武器タイプ別攻撃エフェクトの対応表

キャラクターの攻撃モーション自体は1種類。武器の個性は **エフェクト** で表現する。

| 攻撃タイプ | 該当武器 | エフェクト |
|-----------|----------|-----------|
| 斬撃（縦振り） | 銅の剣、鉄の刀、鋼の太刀、霊刀、竜斬りの剣、一つ目斬り、ドレイン斬り、伝説の剣 | `effects/slash.webp` |
| 打撃（叩きつけ） | 木の棒、つるはし | `effects/blunt.webp` |
| 風撃（横薙ぎ3方向） | 妖刀かまいたち | `effects/wind.webp` |

48pxの中で武器の持ち替えを描き分けるのは非現実的なため、この方式を推奨。
将来4方向の攻撃モーションを追加したい場合のみ拡張構成（武器タイプ別スプライトシート）を使用。

---

## スプライトシートの読み込み方法（実装者向け）

```
スプライトシート構造:

[フレーム0][フレーム1][フレーム2]...
|  48x48  |  48x48  |  48x48  |

各フレームは左から右に配置。
描画時は sx = frameIndex * 48, sy = 0 で切り出し。
```

現在の `SpriteManager` は単体画像のみ対応。
スプライトシートを使用する場合、`SpriteManager` にフレーム管理機能を追加する必要がある。
静止画として使う場合はスプライトシートの1枚目（左端 48x48）のみを使用すれば現行コードで動作する。

---

## ディレクトリ構成

```
assets/
├── tiles/          # タイル画像（7ファイル）
├── characters/     # プレイヤー・NPC（5ファイル）
├── monsters/       # モンスター（45ファイル）
├── items/          # アイテムアイコン（29ファイル）
├── effects/        # エフェクト（11ファイル）
└── ui/             # UIパーツ（3ファイル）
```
