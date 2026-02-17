"""
Sound effect generation script for 迷境の旅人 (Maze Wanderer)
Uses ElevenLabs Sound Effects API to generate game audio.
"""

import json
import time
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

# --- Config ---
API_KEY = "sk_80035a28e8d5df4f3978520fd54c531beb7de448d9271edb"
API_URL = "https://api.elevenlabs.io/v1/sound-generation"

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOUNDS_DIR = PROJECT_ROOT / "assets" / "sounds"

# Rate limiting (concurrent limit = 2-3 for free/starter, add delay between requests)
REQUEST_DELAY = 3  # seconds between requests

# --- Sound Effect Definitions ---
# (filename, prompt, duration_seconds, prompt_influence)

COMBAT_SOUNDS = [
    ("slash.mp3",
     "Quick sword slash whoosh sound effect, sharp metallic cutting through air, retro RPG game style",
     1.0, 0.7),
    ("blunt.mp3",
     "Heavy blunt weapon impact, wooden club hitting something solid, thud with slight crack, retro game",
     0.8, 0.7),
    ("wind_slash.mp3",
     "Triple wind blade cutting through air, three rapid swooshing sounds, magical wind attack, fantasy RPG",
     1.2, 0.7),
    ("player_hit.mp3",
     "Character taking damage, short impact with slight grunt, retro game damage sound, 8-bit style thud",
     0.7, 0.6),
    ("monster_hit.mp3",
     "Monster being hit, squishy impact sound, creature taking damage, short retro game hit",
     0.6, 0.6),
    ("monster_death.mp3",
     "Monster defeated, dissolving poof sound with small sparkle, creature vanishing, retro RPG",
     1.0, 0.6),
    ("player_death.mp3",
     "Game over death sound, dramatic descending tone, character falling, sad retro RPG defeat jingle",
     2.0, 0.6),
    ("critical_hit.mp3",
     "Critical hit powerful impact, loud sharp striking sound with echo, devastating blow, retro RPG",
     1.0, 0.7),
    ("miss.mp3",
     "Attack miss, quick whoosh through empty air, swing and miss, light and fast",
     0.5, 0.7),
    ("fire_breath.mp3",
     "Dragon fire breath, roaring flame burst, fire whooshing and crackling, fantasy monster attack",
     1.5, 0.7),
    ("explosion.mp3",
     "Retro game explosion, 8-bit style boom, bomb blast with debris, short and punchy",
     1.2, 0.7),
    ("magic_shot.mp3",
     "Magic projectile firing, mystical energy bolt launching, purple sparkle whoosh, fantasy RPG spell",
     1.0, 0.7),
    ("bullet.mp3",
     "Tank cannon firing, metallic bullet shot with slight echo, short mechanical projectile launch",
     0.8, 0.7),
    ("poison.mp3",
     "Poison effect, bubbling toxic liquid sound, venomous sizzle, short status ailment sound",
     1.0, 0.6),
]

ITEM_SOUNDS = [
    ("item_pickup.mp3",
     "Item pickup, short cheerful chime, collecting treasure, retro RPG pickup sound, bright and positive",
     0.5, 0.7),
    ("item_drop.mp3",
     "Item dropping on stone floor, small object landing with a light thud and slight bounce",
     0.6, 0.6),
    ("grass_use.mp3",
     "Eating magical herb, crunching leaves with slight magical shimmer, consuming potion herb",
     1.0, 0.6),
    ("scroll_use.mp3",
     "Magic scroll activating, paper unrolling with mystical energy release, magical incantation burst",
     1.2, 0.6),
    ("food_eat.mp3",
     "Eating rice ball onigiri, satisfying munching and chewing sounds, eating food, short and pleasant",
     1.0, 0.7),
    ("equip.mp3",
     "Equipping weapon or armor, metallic clink and buckle fastening, gear equip sound, fantasy RPG",
     0.8, 0.7),
    ("unequip.mp3",
     "Removing equipment, light metallic sliding and unbuckling, gear removal, soft and quick",
     0.6, 0.6),
    ("gold_pickup.mp3",
     "Collecting gold coins, jingling coins sound, treasure pickup, bright metallic chime, retro RPG",
     0.6, 0.7),
    ("heal.mp3",
     "Healing magic sound, warm glowing chime with sparkling particles, HP recovery, soothing and magical",
     1.2, 0.6),
    ("levelup.mp3",
     "Level up fanfare, triumphant ascending chime melody, character power up, retro RPG celebration jingle",
     2.0, 0.7),
    ("steal.mp3",
     "Item being stolen, quick snatching sound with running footsteps, thief grabbing and fleeing",
     1.0, 0.6),
]

MOVEMENT_SOUNDS = [
    ("footstep.mp3",
     "Single footstep on stone dungeon floor, light step echo in cave, short and subtle",
     0.5, 0.7),
    ("stairs.mp3",
     "Descending stone stairs, multiple steps going down with echo, dungeon staircase, brief descent",
     1.5, 0.6),
    ("bump_wall.mp3",
     "Bumping into a wall, dull thud against stone, blocked movement, short impact",
     0.5, 0.7),
]

UI_SOUNDS = [
    ("menu_open.mp3",
     "Menu opening sound, soft UI popup chime, inventory opening, clean and subtle interface sound",
     0.5, 0.7),
    ("menu_select.mp3",
     "Menu selection confirm, short positive click beep, UI button press, clean retro interface",
     0.5, 0.7),
    ("menu_cancel.mp3",
     "Menu cancel close, soft descending tone, UI back button, gentle dismissal sound",
     0.5, 0.7),
    ("menu_cursor.mp3",
     "Menu cursor move, tiny tick sound, UI navigation blip, very short and clean",
     0.5, 0.7),
]

AMBIENT_SOUNDS = [
    ("dungeon_ambient.mp3",
     "Dark dungeon ambient atmosphere, dripping water echoing in stone cavern, distant wind, eerie and quiet, underground cave ambience",
     15.0, 0.4),
    ("boss_encounter.mp3",
     "Boss battle dramatic entrance, ominous deep rumbling with tension building, powerful enemy appearing, dark fantasy RPG",
     3.0, 0.6),
]

TRAP_SOUNDS = [
    ("trap_trigger.mp3",
     "Trap triggering, mechanical click and spring release, hidden trap activating on dungeon floor",
     0.8, 0.7),
    ("warp.mp3",
     "Teleportation warp sound, magical dimensional shift, character teleporting to another location, mystical whoosh",
     1.2, 0.6),
]

# Combine all
ALL_SOUNDS = (
    COMBAT_SOUNDS +
    ITEM_SOUNDS +
    MOVEMENT_SOUNDS +
    UI_SOUNDS +
    AMBIENT_SOUNDS +
    TRAP_SOUNDS
)


def generate_sound(text: str, duration: float, prompt_influence: float) -> bytes | None:
    """Call ElevenLabs API to generate a sound effect. Returns raw MP3 bytes or None."""
    payload = {
        "text": text,
        "duration_seconds": duration,
        "prompt_influence": prompt_influence,
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
            "xi-api-key": API_KEY,
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.read()
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8", errors="replace")
        print(f"  HTTP Error {e.code}: {error_body[:300]}")
        if e.code == 429:
            print("  Rate limited, waiting 10 seconds...")
            time.sleep(10)
        return None
    except Exception as e:
        print(f"  Request error: {e}")
        return None


def main():
    # Determine which sounds to generate
    if len(sys.argv) > 1:
        category = sys.argv[1].lower()
        category_map = {
            "combat": COMBAT_SOUNDS,
            "items": ITEM_SOUNDS,
            "movement": MOVEMENT_SOUNDS,
            "ui": UI_SOUNDS,
            "ambient": AMBIENT_SOUNDS,
            "traps": TRAP_SOUNDS,
            "all": ALL_SOUNDS,
        }
        sounds = category_map.get(category, [])
        if not sounds:
            print(f"Unknown category: {category}")
            print(f"Available: {', '.join(category_map.keys())}")
            return
    else:
        sounds = ALL_SOUNDS

    # Ensure output directory exists
    SOUNDS_DIR.mkdir(parents=True, exist_ok=True)

    print(f"=== Sound Effect Generation ===")
    print(f"Total sounds to generate: {len(sounds)}")
    print(f"Output: {SOUNDS_DIR}")
    print()

    success = 0
    failed = 0
    skipped = 0

    for i, (filename, prompt, duration, influence) in enumerate(sounds):
        output_path = SOUNDS_DIR / filename

        # Skip if already exists
        if output_path.exists():
            print(f"[{i+1}/{len(sounds)}] SKIP (exists): {filename}")
            skipped += 1
            continue

        print(f"[{i+1}/{len(sounds)}] Generating: {filename} ({duration}s)")

        raw_bytes = generate_sound(prompt, duration, influence)

        if raw_bytes:
            with open(output_path, "wb") as f:
                f.write(raw_bytes)
            size_kb = len(raw_bytes) / 1024
            print(f"  -> Saved: {filename} ({size_kb:.1f} KB)")
            success += 1
        else:
            print(f"  -> FAILED")
            failed += 1

        # Rate limiting
        if i < len(sounds) - 1:
            time.sleep(REQUEST_DELAY)

    print()
    print(f"=== Done ===")
    print(f"Success: {success}, Failed: {failed}, Skipped: {skipped}")
    print(f"Total: {success + failed + skipped}/{len(sounds)}")


if __name__ == "__main__":
    main()
