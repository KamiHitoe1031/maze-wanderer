"""
Town asset generation script for 迷境の旅人 (Maze Wanderer)
Uses Google Gemini API (gemini-3-pro-image-preview / Nano Banana Pro) to generate:
  - 8 town tile images (static)
  - 2 NPC character images
  - Animated sprite sheets (town tiles, character idle)

IMPORTANT: API key is loaded from secrets/api-keys.secrets.md (gitignored).
"""

import json
import base64
import time
import os
import sys
import re
import urllib.request
import urllib.error
from pathlib import Path
from io import BytesIO

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow is required. Install with: pip install Pillow")
    sys.exit(1)

# --- Config ---
def _load_api_key():
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key
    secrets_path = Path(__file__).resolve().parent.parent / "secrets" / "api-keys.secrets.md"
    if secrets_path.exists():
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

REQUEST_DELAY = 5  # seconds between requests
TARGET_SIZE = 48   # final sprite size

# Style prefixes
STYLE_BASE = "16-bit pixel art, SNES inspired, rich colors and shading, dark outlines, clean pixel edges, no anti-aliasing, sharp edges, no blur"
STYLE_TILE = f"{STYLE_BASE}, top-down RPG tile, seamless texture"
STYLE_CHAR = f"{STYLE_BASE}, top-down RPG character sprite, front-facing, centered on canvas"

# ============================================================
# Static Town Tiles (8 images)
# ============================================================
TOWN_TILES = [
    ("tiles/town_grass.png",
     f"A lush green grass ground tile for an RPG village. {STYLE_TILE}. Bright green grass with subtle variations in shade, warm and inviting outdoor village ground. Fully opaque, no transparency.",
     False),
    ("tiles/town_path.png",
     f"A cobblestone walkway tile for an RPG village. {STYLE_TILE}. Warm brown-tan cobblestone path, well-worn rounded stones with sandy mortar, outdoor village walkway. Fully opaque.",
     False),
    ("tiles/town_water.png",
     f"A calm blue water surface tile for a village fountain/pond. {STYLE_TILE}. Clear blue water with gentle circular ripple pattern, peaceful and reflective. Fully opaque.",
     False),
    ("tiles/town_tree.png",
     f"A single green tree on grass, top-down view, for an RPG village tile. {STYLE_TILE}. Round green leafy deciduous tree with visible brown trunk center, on bright grass background, lush and healthy. Fully opaque.",
     False),
    ("tiles/town_wall.png",
     f"A wooden building wall tile for an RPG village. {STYLE_TILE}. Brown wooden plank wall with visible wood grain, medieval cottage style, warm tones. Fully opaque.",
     False),
    ("tiles/town_roof.png",
     f"A red-brown roof tile seen from above for an RPG village building. {STYLE_TILE}. Terracotta or thatched roof pattern, warm reddish-brown, clearly a rooftop seen from top-down perspective. Fully opaque.",
     False),
    ("tiles/town_fence.png",
     f"A wooden picket fence on grass tile, top-down view, for an RPG village. {STYLE_TILE}. Simple brown wooden fence posts running horizontally on green grass, rural village style. Fully opaque.",
     False),
    ("tiles/town_flower.png",
     f"A flower bed on grass tile, top-down view, for an RPG village. {STYLE_TILE}. Colorful small flowers in pink, yellow, and white growing on green grass, cheerful garden patch. Fully opaque.",
     False),
]

# ============================================================
# Town NPCs (2 images, magenta bg -> transparent)
# ============================================================
TOWN_NPCS = [
    ("characters/warehouse_keeper.png",
     f"An RPG warehouse keeper NPC character. {STYLE_CHAR}. A sturdy middle-aged man wearing blue robes with a large backpack and satchel, kind friendly expression, stocky build, clearly a storage/warehouse worker. Solid magenta background (#FF00FF).",
     True),
    ("characters/dungeon_guide.png",
     f"An adventurer guild guide NPC character. {STYLE_CHAR}. A tough experienced adventurer wearing an orange cloak with a sword sheathed at the hip, confident battle-ready expression, muscular build. Solid magenta background (#FF00FF).",
     True),
]

# ============================================================
# Animated Sprite Sheets (frame-by-frame generation + stitch)
# ============================================================
ANIMATED_TILES = {
    "tiles/town_tree_sheet.png": {
        "frames": 4,
        "base_prompt": f"A single green tree on grass, top-down view, RPG village tile. {STYLE_TILE}. Round green leafy tree with brown trunk on grass. Fully opaque.",
        "frame_prompts": [
            "Tree branches and leaves slightly leaning to the left, as if blown by a gentle breeze from the right.",
            "Tree standing upright in calm neutral position, leaves settled and symmetrical.",
            "Tree branches and leaves slightly leaning to the right, as if blown by a gentle breeze from the left.",
            "Tree standing upright returning to calm, leaves settling back to center.",
        ],
        "transparent": False,
    },
    "tiles/town_water_sheet.png": {
        "frames": 4,
        "base_prompt": f"Blue water surface tile for a village fountain pond, top-down view. {STYLE_TILE}. Clear blue water, peaceful. Fully opaque.",
        "frame_prompts": [
            "Water ripples radiating outward from center, first wave phase, small concentric circles.",
            "Water ripples expanding wider, second phase, ripples reaching edges.",
            "Water ripples at widest point, surface texture shifted, third phase.",
            "Water ripples fading and resetting, surface calming, fourth phase before next cycle.",
        ],
        "transparent": False,
    },
    "tiles/town_flower_sheet.png": {
        "frames": 4,
        "base_prompt": f"Colorful flower bed on grass tile, top-down view, RPG village. {STYLE_TILE}. Small pink, yellow, white flowers on green grass. Fully opaque.",
        "frame_prompts": [
            "Flowers swaying slightly to the left in a gentle breeze.",
            "Flowers standing upright, petals fully open, calm.",
            "Flowers swaying slightly to the right in a gentle breeze.",
            "Flowers standing upright, petals slightly closing, calm.",
        ],
        "transparent": False,
    },
}

ANIMATED_CHARACTERS = {
    "characters/player_idle_sheet.png": {
        "frames": 4,
        "base_prompt": f"A young adventurer hero in green tunic and brown boots, short brown hair, front-facing, top-down RPG sprite. {STYLE_CHAR}. Solid magenta background (#FF00FF).",
        "frame_prompts": [
            "Standing still, arms at sides, neutral relaxed pose.",
            "Subtle breathing out, body shifts down very slightly, weight settling.",
            "At lowest point of breath, shoulders slightly dropped.",
            "Breathing in, body shifts back up slightly toward neutral.",
        ],
        "transparent": True,
    },
    "characters/warehouse_keeper_idle_sheet.png": {
        "frames": 2,
        "base_prompt": f"A sturdy warehouse keeper in blue robes with backpack, front-facing, top-down RPG NPC sprite. {STYLE_CHAR}. Solid magenta background (#FF00FF).",
        "frame_prompts": [
            "Standing still, neutral pose, looking forward.",
            "Slight head nod, subtle weight shift to other foot.",
        ],
        "transparent": True,
    },
    "characters/dungeon_guide_idle_sheet.png": {
        "frames": 2,
        "base_prompt": f"A tough adventurer guide in orange cloak with sword at hip, front-facing, top-down RPG NPC sprite. {STYLE_CHAR}. Solid magenta background (#FF00FF).",
        "frame_prompts": [
            "Standing at attention, sword at side, confident pose.",
            "Slight weight shift, arm moves slightly, subtle idle motion.",
        ],
        "transparent": True,
    },
}


# ============================================================
# API & Image Processing Functions
# ============================================================

def generate_image(prompt):
    """Call Gemini API to generate a single image. Returns PIL Image or None."""
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
        }
    }
    headers = {"Content-Type": "application/json"}
    url = f"{API_URL}?key={API_KEY}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"  API Error {e.code}: {body[:200]}")
        return None
    except Exception as e:
        print(f"  Request failed: {e}")
        return None

    # Extract image from response
    for candidate in result.get("candidates", []):
        for part in candidate.get("content", {}).get("parts", []):
            if "inlineData" in part:
                img_data = base64.b64decode(part["inlineData"]["data"])
                return Image.open(BytesIO(img_data)).convert("RGBA")

    print("  No image in response")
    return None


def remove_magenta_bg(img, threshold=60):
    """Replace magenta-ish pixels with transparent."""
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r > 200 and g < threshold and b > 200:
                pixels[x, y] = (0, 0, 0, 0)
    return img


def resize_to_target(img, size=TARGET_SIZE):
    """Center-crop to square, then resize to target size."""
    w, h = img.size
    # Gemini APIが縦長画像を返すことがあるため、まず正方形にクロップ
    if w != h:
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))
    return img.resize((size, size), Image.Resampling.NEAREST)


def stitch_horizontal(frames, output_path):
    """Stitch list of PIL Images into a horizontal sprite sheet."""
    n = len(frames)
    w, h = frames[0].size
    sheet = Image.new("RGBA", (w * n, h), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.paste(frame, (i * w, 0))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(str(output_path), "PNG", optimize=True)
    print(f"  -> Saved sprite sheet: {output_path} ({w*n}x{h}, {n} frames)")


def generate_and_save_static(output_rel, prompt, transparent):
    """Generate a single static image and save it."""
    output_path = ASSETS_DIR / output_rel
    if output_path.exists():
        print(f"  SKIP (exists): {output_rel}")
        return True

    output_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"  Generating: {output_rel}")

    img = generate_image(prompt)
    if img is None:
        print(f"  FAILED: {output_rel}")
        return False

    img = resize_to_target(img)
    if transparent:
        img = remove_magenta_bg(img)

    img.save(str(output_path), "PNG", optimize=True)
    print(f"  -> Saved: {output_path} ({img.size[0]}x{img.size[1]})")
    return True


def generate_sprite_sheet(output_rel, config):
    """Generate an animated sprite sheet by generating frames individually and stitching."""
    output_path = ASSETS_DIR / output_rel
    if output_path.exists():
        print(f"  SKIP (exists): {output_rel}")
        return True

    output_path.parent.mkdir(parents=True, exist_ok=True)
    base_prompt = config["base_prompt"]
    frame_prompts = config["frame_prompts"]
    transparent = config.get("transparent", False)
    frames = []

    for i, frame_desc in enumerate(frame_prompts):
        print(f"  Generating frame {i+1}/{len(frame_prompts)} for {output_rel}")
        full_prompt = f"{base_prompt} {frame_desc}"
        img = generate_image(full_prompt)
        if img is None:
            print(f"  FAILED frame {i+1} for {output_rel}")
            return False

        img = resize_to_target(img)
        if transparent:
            img = remove_magenta_bg(img)
        frames.append(img)
        time.sleep(REQUEST_DELAY)

    stitch_horizontal(frames, output_path)
    return True


# ============================================================
# Main
# ============================================================

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Generate town assets for 迷境の旅人")
    parser.add_argument("--skip-static", action="store_true", help="Skip static tile/NPC generation")
    parser.add_argument("--skip-sheets", action="store_true", help="Skip sprite sheet generation")
    parser.add_argument("--only", type=str, help="Only generate assets matching this substring")
    args = parser.parse_args()

    print(f"=== Town Asset Generator ===")
    print(f"Model: {MODEL}")
    print(f"Output: {ASSETS_DIR}")
    print()

    # --- Static images ---
    if not args.skip_static:
        print("--- Generating static town tiles ---")
        for output_rel, prompt, transparent in TOWN_TILES:
            if args.only and args.only not in output_rel:
                continue
            generate_and_save_static(output_rel, prompt, transparent)
            time.sleep(REQUEST_DELAY)

        print("\n--- Generating town NPCs ---")
        for output_rel, prompt, transparent in TOWN_NPCS:
            if args.only and args.only not in output_rel:
                continue
            generate_and_save_static(output_rel, prompt, transparent)
            time.sleep(REQUEST_DELAY)

    # --- Animated sprite sheets ---
    if not args.skip_sheets:
        print("\n--- Generating animated tile sheets ---")
        for output_rel, config in ANIMATED_TILES.items():
            if args.only and args.only not in output_rel:
                continue
            generate_sprite_sheet(output_rel, config)

        print("\n--- Generating character idle sheets ---")
        for output_rel, config in ANIMATED_CHARACTERS.items():
            if args.only and args.only not in output_rel:
                continue
            generate_sprite_sheet(output_rel, config)

    print("\n=== Done ===")


if __name__ == "__main__":
    main()
