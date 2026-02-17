"""
Asset generation script for 迷境の旅人 (Maze Wanderer)
Uses Google Gemini API (gemini-3-pro-image-preview / Nano Banana Pro) to generate game assets.
"""

import json
import base64
import time
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

# --- Config ---
# APIキーは secrets/api-keys.secrets.md に記載。環境変数 or secrets/ から読み込み
def _load_api_key():
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    secrets_path = Path(__file__).resolve().parent.parent / "secrets" / "api-keys.secrets.md"
    if secrets_path.exists():
        import re
        text = secrets_path.read_text(encoding="utf-8")
        m = re.search(r"## Google Gemini API Key\s*```\s*(\S+)\s*```", text)
        if m:
            return m.group(1)
    print("ERROR: APIキーが見つかりません。")
    print("  環境変数 GEMINI_API_KEY を設定するか、secrets/api-keys.secrets.md を配置してください。")
    sys.exit(1)

API_KEY = _load_api_key()
MODEL = "gemini-3-pro-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = PROJECT_ROOT / "assets"

# Rate limiting
REQUEST_DELAY = 5  # seconds between requests

# Common style prefix for all game assets
STYLE_BASE = "16-bit pixel art, SNES inspired, rich colors and shading, dark outlines, clean pixel edges, no anti-aliasing, sharp edges, no blur"
STYLE_TILE = f"{STYLE_BASE}, top-down dungeon tile, seamless texture, dark fantasy dungeon"
STYLE_CHAR = f"{STYLE_BASE}, top-down RPG character sprite, front-facing, centered on canvas"
STYLE_MONSTER = f"{STYLE_BASE}, top-down RPG monster sprite, front-facing, centered on canvas, dark fantasy"
STYLE_ITEM = f"{STYLE_BASE}, RPG item icon, centered on canvas, clean and recognizable at small size"
STYLE_EFFECT = f"{STYLE_BASE}, game visual effect, centered on canvas, bright and dynamic"

# --- Asset Definitions ---
# Each entry: (output_path_relative_to_assets, prompt, aspect_ratio, size)

TILES = [
    ("tiles/wall.png",
     f"A dark stone dungeon wall tile. {STYLE_TILE}. Rough grey-brown stone blocks with dark mortar lines. Solid magenta (#FF00FF) has NO place here - this is a fully opaque tile.",
     "1:1", "1K"),
    ("tiles/floor.png",
     f"A dungeon room floor tile. {STYLE_TILE}. Light grey-brown cobblestone pattern, slightly worn, subtle cracks.",
     "1:1", "1K"),
    ("tiles/corridor.png",
     f"A dark dungeon corridor floor tile. {STYLE_TILE}. Darker than room floor, narrow stone path, slightly damp look.",
     "1:1", "1K"),
    ("tiles/stairs.png",
     f"Descending stone stairs in a dungeon floor tile. {STYLE_TILE}. Stone steps going down, golden-yellow tint to stand out, clearly visible.",
     "1:1", "1K"),
    ("tiles/water.png",
     f"A water tile for dungeon waterway. {STYLE_TILE}. Deep blue water surface with subtle ripple pattern, reflective.",
     "1:1", "1K"),
    ("tiles/shop.png",
     f"A special shop floor tile for dungeon merchant area. {STYLE_TILE}. Ornate golden-trimmed stone floor, slightly luxurious, warm tones.",
     "1:1", "1K"),
    ("tiles/trap.png",
     f"A dungeon floor trap tile. {STYLE_TILE}. Stone floor with subtle red warning markings, a hidden pressure plate pattern.",
     "1:1", "1K"),
]

CHARACTERS = [
    ("characters/player.png",
     f"A young adventurer hero character for a Japanese roguelike RPG. {STYLE_CHAR}. Wearing a green tunic and brown boots, carrying a small sword, determined expression, short brown hair. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("characters/shopkeeper.png",
     f"A dungeon shopkeeper NPC for a Japanese roguelike RPG. {STYLE_CHAR}. Elderly man with a long white beard, wearing a purple merchant robe and a small hat, friendly smile, holding a staff. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_NORMAL = [
    ("monsters/green_slime.png",
     f"A small green slime monster. {STYLE_MONSTER}. Semi-transparent green jelly blob, simple cute face with dot eyes, small and round. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/blue_slime.png",
     f"A medium blue slime monster. {STYLE_MONSTER}. Semi-transparent blue jelly blob, slightly larger than green slime, round with simple face. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/red_slime.png",
     f"A large angry red slime monster. {STYLE_MONSTER}. Semi-transparent red jelly blob, larger size, angry expression with furrowed brows. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/rat.png",
     f"A small bipedal thief rat monster. {STYLE_MONSTER}. Small brown rat standing on hind legs, mischievous expression, small and nimble. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/rat_boss.png",
     f"A large rat boss monster with a headband. {STYLE_MONSTER}. Big brown rat standing upright, wearing a red headband (hachimaki), tough expression, muscular. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/rock_golem.png",
     f"A rock golem monster. {STYLE_MONSTER}. Humanoid figure made of grey rough rocks, glowing eyes, sturdy and heavy-looking. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/iron_golem.png",
     f"An iron golem monster. {STYLE_MONSTER}. Humanoid figure made of silver-grey metal plates, glowing blue eyes, polished metallic surface. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/diamond_golem.png",
     f"A diamond golem monster. {STYLE_MONSTER}. Humanoid figure made of sparkling light-blue crystal, prismatic reflections, elegant and powerful. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_GHOST = [
    ("monsters/ghost.png",
     f"A floating ghost spirit. {STYLE_MONSTER}. White semi-transparent ghost with a wispy tail, simple round face, floating hitodama (will-o-wisp). Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/vengeful_spirit.png",
     f"An angry vengeful spirit. {STYLE_MONSTER}. Purple-tinted translucent ghost, angry hateful expression, surrounded by dark aura. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/ghost_warrior.png",
     f"A ghost samurai warrior. {STYLE_MONSTER}. Semi-transparent warrior in old Japanese armor, holding a ghostly katana, honor-bound spirit. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/evil_warrior.png",
     f"An evil spirit samurai. {STYLE_MONSTER}. Dark-armored ghostly warrior, black armor with glowing red eyes, menacing and corrupted. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_DRAIN = [
    ("monsters/vampire_bat.png",
     f"A small vampire bat. {STYLE_MONSTER}. Small purple bat with spread wings, tiny fangs visible, cute but dangerous. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/big_vampire_bat.png",
     f"A large vampire bat. {STYLE_MONSTER}. Big black bat with large spread wings, prominent fangs, intimidating red eyes. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/poison_scorpion.png",
     f"A purple poison scorpion. {STYLE_MONSTER}. Purple scorpion with raised venomous tail, pincers ready, menacing pose. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/deadly_scorpion.png",
     f"A large deadly scorpion. {STYLE_MONSTER}. Big dark red-black scorpion, dripping venom from tail stinger, massive pincers. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/exp_drainer.png",
     f"A floating pink experience-draining orb creature. {STYLE_MONSTER}. Pink glowing floating sphere with small tentacles, ethereal and mysterious. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/big_exp_drainer.png",
     f"A large floating red-purple experience-draining orb. {STYLE_MONSTER}. Large dark red-purple glowing sphere with many tentacles, ominous aura. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_DRAGON = [
    ("monsters/small_dragon.png",
     f"A small baby dragon. {STYLE_MONSTER}. Small orange dragon, cute but fierce, tiny wings, breathing a small puff of smoke. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/fire_dragon.png",
     f"A large red fire dragon. {STYLE_MONSTER}. Big red dragon with spread wings, breathing fire, fierce eyes, powerful and intimidating. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/sky_dragon.png",
     f"A majestic celestial sky dragon. {STYLE_MONSTER}. Beautiful light-blue dragon with divine aura, elegant wings, holy and powerful, shimmering scales. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_EYE = [
    ("monsters/cyclops_kid.png",
     f"A small one-eyed yokai child monster. {STYLE_MONSTER}. Small cute Japanese yokai (hitotsume-kozou) with one large eye, childlike body, traditional look. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/hypno_eye.png",
     f"A floating hypnotic giant eyeball. {STYLE_MONSTER}. Large yellow floating eyeball, swirling hypnotic pupil, tentacle-like nerves trailing below. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/evil_eye.png",
     f"An evil floating eyeball monster. {STYLE_MONSTER}. Orange floating eyeball, spiral pattern in pupil, sinister and corrupted look. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/demon_eye.png",
     f"A demonic red floating eyeball. {STYLE_MONSTER}. Large red eyeball, dark ominous aura, blood-red iris, most powerful eye monster. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_BOMB = [
    ("monsters/bomb_urchin.png",
     f"An orange bomb sea urchin monster. {STYLE_MONSTER}. Orange spiky urchin-shaped creature with a lit fuse on top, round with spines. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/big_bomb_urchin.png",
     f"A large bomb sea urchin. {STYLE_MONSTER}. Big red-orange spiky urchin with a burning fuse, larger spines, dangerous look. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/mine_urchin.png",
     f"A bright red mine urchin monster. {STYLE_MONSTER}. Bright red spiky urchin with danger warning symbol, most explosive variant, glowing hot. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_SPECIAL = [
    ("monsters/thief_tanuki.png",
     f"A small thief raccoon dog (tanuki) monster. {STYLE_MONSTER}. Small tanuki carrying a wrapped cloth bundle (furoshiki) on its back, sneaky expression. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/big_thief_tanuki.png",
     f"A large thief tanuki monster. {STYLE_MONSTER}. Big tanuki with a large furoshiki bundle, bold and confident, master thief look. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/riceball_tanuki.png",
     f"A tanuki holding a rice ball (onigiri). {STYLE_MONSTER}. Cute tanuki holding a white triangle onigiri rice ball, cheerful expression. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/rust_mold.png",
     f"A rust-colored mold monster. {STYLE_MONSTER}. Brown fuzzy mold/fungus creature, small patches of rust-colored growth, slow-looking. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/big_rust_mold.png",
     f"A large rust mold monster. {STYLE_MONSTER}. Big brown mold creature with metal fragments stuck to its body, corroded and dangerous. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/grass_frog.png",
     f"A green frog that throws grass items. {STYLE_MONSTER}. Green frog standing upright, holding a bundle of grass/herbs, ready to throw them. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/tank.png",
     f"A small fantasy tank monster. {STYLE_MONSTER}. Small grey cartoon-style tank with a face, tiny cannon barrel, cute but dangerous. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/heavy_tank.png",
     f"A medium fantasy heavy tank monster. {STYLE_MONSTER}. Medium dark grey tank with thicker armor, larger cannon, stern expression. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/super_tank.png",
     f"A large red super tank monster. {STYLE_MONSTER}. Large red heavily-armored tank, massive thick cannon barrel, menacing and powerful. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/split_slime.png",
     f"A green slime with a crack down the middle. {STYLE_MONSTER}. Green slime monster with a visible crack/split line down its center, about to divide. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/big_split_slime.png",
     f"A large green splitting slime with multiple nuclei. {STYLE_MONSTER}. Large green slime with multiple visible nuclei/cores inside, ready to split into many. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

MONSTERS_BOSS = [
    ("monsters/gargoyle.png",
     f"A gargoyle boss monster. {STYLE_MONSTER}. Purple stone gargoyle with bat wings, perched pose, glowing eyes, menacing stone creature. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/chimera.png",
     f"A chimera boss monster. {STYLE_MONSTER}. Three-headed beast: lion head, goat head, snake tail, powerful hybrid creature, fearsome. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/wyvern.png",
     f"A wyvern boss monster. {STYLE_MONSTER}. Large blue winged dragon (wyvern), spread wings, fierce eyes, powerful flying predator. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("monsters/demon_king.png",
     f"The Demon King final boss. {STYLE_MONSTER}. Imposing dark figure in red-black robes wearing a crown, glowing red eyes, ultimate evil lord, largest monster. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

ITEMS_WEAPONS = [
    ("items/wooden_stick.png",
     f"A simple wooden stick weapon icon. {STYLE_ITEM}. Brown wooden stick/club, simple and crude, starter weapon. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/copper_sword.png",
     f"A copper short sword icon. {STYLE_ITEM}. Copper-colored short sword, simple crossguard, warm bronze tones. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/iron_katana.png",
     f"A Japanese iron katana sword icon. {STYLE_ITEM}. Silver Japanese katana with simple black handle wrapping, elegant curve. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/steel_tachi.png",
     f"A polished steel tachi (long Japanese sword) icon. {STYLE_ITEM}. Gleaming steel tachi, longer blade, ornate handle, high quality. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/spirit_sword.png",
     f"A spirit blade katana icon. {STYLE_ITEM}. Purple-tinted ghostly katana with spiritual energy aura, ethereal glow. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/dragon_sword.png",
     f"A dragon slayer sword icon. {STYLE_ITEM}. Red-bladed sword with dragon motif on the guard, fiery aura, powerful. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/cyclops_sword.png",
     f"A one-eye slayer sword icon. {STYLE_ITEM}. Sword with an eye motif carved into the pommel, specialized blade. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/drain_sword.png",
     f"A life-draining dark sword icon. {STYLE_ITEM}. Dark purple blade that seems to absorb light, ominous aura, vampiric weapon. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/pickaxe.png",
     f"A mining pickaxe weapon icon. {STYLE_ITEM}. T-shaped iron pickaxe, wooden handle, utility tool used as weapon. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/kamaitachi.png",
     f"A wind-blade sickle (kamaitachi) weapon icon. {STYLE_ITEM}. Curved sickle-shaped blade surrounded by swirling wind energy, mystical. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/legendary_sword.png",
     f"A legendary golden holy sword icon. {STYLE_ITEM}. Magnificent golden glowing great sword, radiant light, ultimate weapon, ornate design. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

ITEMS_SHIELDS = [
    ("items/wooden_shield.png",
     f"A round wooden shield icon. {STYLE_ITEM}. Simple round wooden shield with iron rim, starter defense. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/copper_shield.png",
     f"A copper kite shield icon. {STYLE_ITEM}. Copper-colored kite-shaped shield, warm bronze tones, simple design. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/iron_shield.png",
     f"An iron shield icon. {STYLE_ITEM}. Silver iron shield, sturdy, basic metal design. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/steel_shield.png",
     f"A heavy steel shield icon. {STYLE_ITEM}. Thick steel shield, reinforced with rivets, heavy duty defense. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/evasion_shield.png",
     f"A light evasion shield icon. {STYLE_ITEM}. Thin lightweight blue-decorated shield, elegant and swift, agility-boosting. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/antidote_shield.png",
     f"An antidote shield with snake motif icon. {STYLE_ITEM}. Green-decorated shield with snake symbol, anti-poison protection. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/rustproof_shield.png",
     f"A rustproof oiled shield icon. {STYLE_ITEM}. Gleaming oiled metal shield with smooth surface, resistant coating visible. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/blast_shield.png",
     f"An explosion-proof shield icon. {STYLE_ITEM}. Red heat-resistant reinforced shield, blast protection design, thick. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/fullness_shield.png",
     f"A hunger-prevention shield with rice ball motif icon. {STYLE_ITEM}. Shield decorated with an onigiri (rice ball) symbol, warm and nourishing design. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/legendary_shield.png",
     f"A legendary golden shield icon. {STYLE_ITEM}. Magnificent golden glowing great shield, radiant light, ultimate defense, ornate design. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

ITEMS_CONSUMABLES = [
    ("items/grass.png",
     f"A medicinal herb (grass) item icon. {STYLE_ITEM}. Green medicinal herb/grass with 2-3 leaves, healing plant. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/scroll.png",
     f"A magic scroll item icon. {STYLE_ITEM}. Rolled parchment scroll tied with a ribbon, ancient magic writing visible. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/food.png",
     f"An onigiri rice ball food item icon. {STYLE_ITEM}. White triangle onigiri rice ball with nori seaweed wrap, classic Japanese rice ball. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/gold.png",
     f"A pile of gold coins icon. {STYLE_ITEM}. Stack of shiny gold coins, treasure, gleaming and valuable. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/ring.png",
     f"A golden bracelet/armband (ring) icon. {STYLE_ITEM}. Gold armband/bracelet with a small gem, magical accessory. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/wand.png",
     f"A magic wand/staff icon. {STYLE_ITEM}. Wooden magic wand with a glowing crystal tip, purple magical energy. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/pot.png",
     f"A ceramic pot/jar icon. {STYLE_ITEM}. Brown ceramic pot/jar with a lid, traditional Japanese pottery style. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("items/arrow.png",
     f"A quiver of arrows icon. {STYLE_ITEM}. Bundle of wooden arrows with feather fletching, in a small quiver. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

EFFECTS = [
    ("effects/attack.png",
     f"A white slash attack effect. {STYLE_EFFECT}. White diagonal slash line with small sparks, sword strike visual effect. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/magic.png",
     f"A purple magic projectile effect. {STYLE_EFFECT}. Glowing purple magic orb/bullet with trailing sparkles, magical energy. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/damage.png",
     f"A red damage flash effect. {STYLE_EFFECT}. Red impact flash/starburst, damage taken visual, sharp red lines. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/slash.png",
     f"A sword slash arc effect. {STYLE_EFFECT}. White crescent slash arc, sword swing trail, clean and sharp. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/blunt.png",
     f"A blunt impact star effect. {STYLE_EFFECT}. Yellow star-shaped impact burst, blunt weapon hit, small debris particles. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/wind.png",
     f"A wind blade effect. {STYLE_EFFECT}. Three green wind blade crescents, swirling air slash, kamaitachi wind attack. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/fire_breath.png",
     f"A fire breath flame effect. {STYLE_EFFECT}. Orange-red fire blast, dragon breath fireball, hot flames spreading. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/explosion.png",
     f"An explosion effect. {STYLE_EFFECT}. Orange-red explosion blast, expanding shockwave, bright center fading outward. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/heal.png",
     f"A green healing effect. {STYLE_EFFECT}. Green sparkling particles rising upward, healing light, soothing glow. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/levelup.png",
     f"A level up golden light pillar effect. {STYLE_EFFECT}. Vertical golden light beam/pillar, sparkling particles, triumphant glow. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/steal.png",
     f"An item being stolen effect. {STYLE_EFFECT}. Small item icon flying away with speed lines, theft visual, quick motion. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
    ("effects/bullet.png",
     f"A tank bullet projectile effect. {STYLE_EFFECT}. Silver metallic bullet/cannonball flying with small trail, projectile. Solid magenta background (#FF00FF).",
     "1:1", "1K"),
]

UI = [
    ("ui/title_logo.png",
     f"A game title logo reading 'Maze Wanderer' in stylized fantasy text. {STYLE_BASE}, dark fantasy RPG title screen logo, dramatic lighting, Japanese dungeon crawler game. The text should be ornate and mystical.",
     "3:2", "1K"),
]

# Combine all asset lists
ALL_ASSETS = (
    TILES +
    CHARACTERS +
    MONSTERS_NORMAL +
    MONSTERS_GHOST +
    MONSTERS_DRAIN +
    MONSTERS_DRAGON +
    MONSTERS_EYE +
    MONSTERS_BOMB +
    MONSTERS_SPECIAL +
    MONSTERS_BOSS +
    ITEMS_WEAPONS +
    ITEMS_SHIELDS +
    ITEMS_CONSUMABLES +
    EFFECTS +
    UI
)


def generate_image(prompt: str, aspect_ratio: str = "1:1", image_size: str = "1K") -> bytes | None:
    """Call Gemini API to generate an image. Returns raw image bytes or None on failure."""
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {
                "aspectRatio": aspect_ratio
            }
        }
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{API_URL}?key={API_KEY}",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"  HTTP Error {e.code}: {error_body[:300]}")
        return None
    except Exception as e:
        print(f"  Request error: {e}")
        return None

    # Extract image data from response
    try:
        for part in result["candidates"][0]["content"]["parts"]:
            if "inlineData" in part:
                b64_data = part["inlineData"]["data"]
                return base64.b64decode(b64_data)
    except (KeyError, IndexError) as e:
        print(f"  Parse error: {e}")
        print(f"  Response: {json.dumps(result, indent=2)[:500]}")

    return None


def process_image(raw_bytes: bytes, output_path: Path, target_size: tuple[int, int] | None = None):
    """Process and save image: optionally remove magenta background and resize."""
    from PIL import Image
    import io

    img = Image.open(io.BytesIO(raw_bytes))

    # Convert to RGBA for transparency processing
    img = img.convert("RGBA")

    # Remove magenta background if this is not a tile
    path_str = str(output_path)
    is_tile = "tiles/" in path_str and "trap" not in path_str
    is_ui = "ui/" in path_str

    if not is_tile and not is_ui:
        # Remove magenta-ish background pixels
        pixels = img.load()
        w, h = img.size
        for y in range(h):
            for x in range(w):
                r, g, b, a = pixels[x, y]
                # Check if pixel is close to magenta (#FF00FF)
                if r > 200 and g < 80 and b > 200:
                    pixels[x, y] = (0, 0, 0, 0)  # Make transparent

    # Resize if target size specified
    if target_size:
        img = img.resize(target_size, Image.Resampling.NEAREST)

    # Save as PNG
    img.save(output_path, "PNG", optimize=True)


def main():
    # Determine which assets to generate
    if len(sys.argv) > 1:
        # Filter by category name
        category = sys.argv[1].lower()
        category_map = {
            "tiles": TILES,
            "characters": CHARACTERS,
            "monsters": (MONSTERS_NORMAL + MONSTERS_GHOST + MONSTERS_DRAIN +
                        MONSTERS_DRAGON + MONSTERS_EYE + MONSTERS_BOMB +
                        MONSTERS_SPECIAL + MONSTERS_BOSS),
            "items": ITEMS_WEAPONS + ITEMS_SHIELDS + ITEMS_CONSUMABLES,
            "effects": EFFECTS,
            "ui": UI,
            "all": ALL_ASSETS,
        }
        assets = category_map.get(category, [])
        if not assets:
            print(f"Unknown category: {category}")
            print(f"Available: {', '.join(category_map.keys())}")
            return
    else:
        assets = ALL_ASSETS

    # Target sizes based on asset type
    def get_target_size(path: str) -> tuple[int, int] | None:
        if "ui/title_logo" in path:
            return (320, 160)
        elif "ui/minimap" in path:
            return (120, 120)
        elif "ui/hp_bar" in path:
            return (96, 12)
        else:
            return (48, 48)

    # Ensure output directories exist
    for subdir in ["tiles", "characters", "monsters", "items", "effects", "ui"]:
        (ASSETS_DIR / subdir).mkdir(parents=True, exist_ok=True)

    print(f"=== Asset Generation ===")
    print(f"Total assets to generate: {len(assets)}")
    print(f"Model: {MODEL}")
    print(f"Output: {ASSETS_DIR}")
    print()

    success = 0
    failed = 0
    skipped = 0

    for i, (rel_path, prompt, aspect_ratio, size) in enumerate(assets):
        output_path = ASSETS_DIR / rel_path
        target_size = get_target_size(rel_path)

        # Skip if already exists
        if output_path.exists():
            print(f"[{i+1}/{len(assets)}] SKIP (exists): {rel_path}")
            skipped += 1
            continue

        print(f"[{i+1}/{len(assets)}] Generating: {rel_path} ({aspect_ratio}, {size})")

        # Generate
        raw_bytes = generate_image(prompt, aspect_ratio, size)

        if raw_bytes:
            try:
                process_image(raw_bytes, output_path, target_size)
                print(f"  -> Saved: {output_path} ({target_size})")
                success += 1
            except Exception as e:
                print(f"  -> Process error: {e}")
                # Save raw image as fallback
                with open(output_path, "wb") as f:
                    f.write(raw_bytes)
                print(f"  -> Saved raw image as fallback")
                success += 1
        else:
            print(f"  -> FAILED")
            failed += 1

        # Rate limiting
        if i < len(assets) - 1:
            time.sleep(REQUEST_DELAY)

    print()
    print(f"=== Done ===")
    print(f"Success: {success}, Failed: {failed}, Skipped: {skipped}")
    print(f"Total: {success + failed + skipped}/{len(assets)}")


if __name__ == "__main__":
    main()
