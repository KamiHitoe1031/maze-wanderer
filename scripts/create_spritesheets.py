"""
Programmatic sprite sheet generator for 迷境の旅人 (Maze Wanderer)

Takes existing static images and creates proper sprite sheets by applying
subtle pixel-level transformations (shifts, wave distortion, color cycling)
to ensure frame-to-frame consistency.

No AI API calls needed - pure image processing.
"""

import sys
from pathlib import Path

try:
    from PIL import Image, ImageFilter
except ImportError:
    print("ERROR: Pillow is required. Install with: pip install Pillow")
    sys.exit(1)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ASSETS_DIR = PROJECT_ROOT / "assets"


def create_horizontal_sheet(frames, output_path):
    """Stitch frames into a horizontal sprite sheet."""
    n = len(frames)
    w, h = frames[0].size
    sheet = Image.new("RGBA", (w * n, h), (0, 0, 0, 0))
    for i, frame in enumerate(frames):
        sheet.paste(frame, (i * w, 0))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(str(output_path), "PNG", optimize=True)
    print(f"  Saved: {output_path.name} ({w*n}x{h}, {n} frames)")


def shift_region(img, y_start_ratio, y_end_ratio, dx, dy):
    """
    Shift a horizontal band of the image by (dx, dy) pixels.
    Pixels shifted out are wrapped or filled from the base.
    """
    result = img.copy()
    w, h = img.size
    y_start = int(h * y_start_ratio)
    y_end = int(h * y_end_ratio)

    # Crop the region
    region = img.crop((0, y_start, w, y_end))
    rw, rh = region.size

    # Create shifted version
    shifted = Image.new("RGBA", (rw, rh), (0, 0, 0, 0))
    # Paste with offset, wrapping
    shifted.paste(region, (dx, dy))
    # Fill gaps by wrapping
    if dx > 0:
        left_strip = region.crop((rw - dx, 0, rw, rh))
        shifted.paste(left_strip, (0, 0))
    elif dx < 0:
        right_strip = region.crop((0, 0, -dx, rh))
        shifted.paste(right_strip, (rw + dx, 0))

    result.paste(shifted, (0, y_start))
    return result


def wave_distort(img, amplitude=1, wavelength=8, phase=0, axis='x'):
    """
    Apply a subtle sine-wave distortion to the image.
    axis='x' shifts rows horizontally, axis='y' shifts columns vertically.
    """
    import math
    result = Image.new("RGBA", img.size, (0, 0, 0, 0))
    w, h = img.size
    pixels_src = img.load()
    pixels_dst = result.load()

    if axis == 'x':
        for y in range(h):
            offset = int(amplitude * math.sin(2 * math.pi * (y / wavelength) + phase))
            for x in range(w):
                sx = (x - offset) % w
                pixels_dst[x, y] = pixels_src[sx, y]
    else:
        for x in range(w):
            offset = int(amplitude * math.sin(2 * math.pi * (x / wavelength) + phase))
            for y in range(h):
                sy = (y - offset) % h
                pixels_dst[x, y] = pixels_src[x, sy]

    return result


def vertical_shift(img, dy):
    """Shift entire image vertically by dy pixels (for breathing effect)."""
    w, h = img.size
    result = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    # Clamp paste position
    if dy >= 0:
        region = img.crop((0, 0, w, h - dy))
        result.paste(region, (0, dy))
    else:
        region = img.crop((0, -dy, w, h))
        result.paste(region, (0, 0))
    return result


def color_cycle_water(img, phase):
    """Subtly shift blue channel for water shimmer effect."""
    pixels = img.load()
    w, h = img.size
    result = img.copy()
    rpx = result.load()

    import math
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            # Subtle blue/green shimmer
            shift = int(8 * math.sin(2 * math.pi * ((x + y * 3) / 16.0 + phase)))
            nb = max(0, min(255, b + shift))
            ng = max(0, min(255, g + shift // 2))
            rpx[x, y] = (r, ng, nb, a)

    return result


# ============================================================
# Tile Sprite Sheets
# ============================================================

def create_tree_sheet():
    """Tree: gentle sway by shifting upper portion (leaves) left/right."""
    src = ASSETS_DIR / "tiles" / "town_tree.png"
    out = ASSETS_DIR / "tiles" / "town_tree_sheet.png"
    if not src.exists():
        print(f"  SKIP: {src.name} not found")
        return

    base = Image.open(str(src)).convert("RGBA")
    print("Creating tree sprite sheet...")

    # 4 frames: center, lean-right, center, lean-left
    import math
    frames = []
    phases = [0, 0.5 * math.pi, math.pi, 1.5 * math.pi]
    for phase in phases:
        frame = wave_distort(base, amplitude=1, wavelength=24, phase=phase, axis='x')
        frames.append(frame)

    create_horizontal_sheet(frames, out)


def create_water_sheet():
    """Water: ripple effect via wave distortion + color cycling."""
    src = ASSETS_DIR / "tiles" / "town_water.png"
    out = ASSETS_DIR / "tiles" / "town_water_sheet.png"
    if not src.exists():
        print(f"  SKIP: {src.name} not found")
        return

    base = Image.open(str(src)).convert("RGBA")
    print("Creating water sprite sheet...")

    import math
    frames = []
    for i in range(4):
        phase = i * 0.5 * math.pi
        # Wave distortion on both axes
        frame = wave_distort(base, amplitude=1, wavelength=12, phase=phase, axis='x')
        frame = wave_distort(frame, amplitude=1, wavelength=16, phase=phase * 0.7, axis='y')
        # Color shimmer
        frame = color_cycle_water(frame, i * 0.25)
        frames.append(frame)

    create_horizontal_sheet(frames, out)


def create_flower_sheet():
    """Flowers: subtle sway via small wave distortion."""
    src = ASSETS_DIR / "tiles" / "town_flower.png"
    out = ASSETS_DIR / "tiles" / "town_flower_sheet.png"
    if not src.exists():
        print(f"  SKIP: {src.name} not found")
        return

    base = Image.open(str(src)).convert("RGBA")
    print("Creating flower sprite sheet...")

    import math
    frames = []
    phases = [0, 0.5 * math.pi, math.pi, 1.5 * math.pi]
    for phase in phases:
        frame = wave_distort(base, amplitude=1, wavelength=16, phase=phase, axis='x')
        frames.append(frame)

    create_horizontal_sheet(frames, out)


# ============================================================
# Character Idle Sprite Sheets
# ============================================================

def create_character_idle_sheet(src_name, out_name, num_frames=4):
    """
    Character idle: subtle breathing by shifting image 1px down and back.
    4 frames: normal, 1px down, 1px down, normal (breathing cycle)
    2 frames: normal, 1px down
    """
    src = ASSETS_DIR / "characters" / src_name
    out = ASSETS_DIR / "characters" / out_name
    if not src.exists():
        print(f"  SKIP: {src.name} not found")
        return

    base = Image.open(str(src)).convert("RGBA")
    print(f"Creating {out_name}...")

    if num_frames == 4:
        # Breathing cycle: up, mid-down, down, mid-up
        frames = [
            base.copy(),                    # Frame 0: normal
            vertical_shift(base, 1),        # Frame 1: 1px down (exhale)
            vertical_shift(base, 1),        # Frame 2: 1px down (hold)
            base.copy(),                    # Frame 3: normal (inhale)
        ]
    else:
        # 2 frames: normal, 1px down
        frames = [
            base.copy(),
            vertical_shift(base, 1),
        ]

    create_horizontal_sheet(frames, out)


# ============================================================
# Main
# ============================================================

def main():
    print("=== Programmatic Sprite Sheet Generator ===")
    print(f"Assets: {ASSETS_DIR}\n")

    # Tile sheets
    print("--- Tile Animation Sheets ---")
    create_tree_sheet()
    create_water_sheet()
    create_flower_sheet()

    # Character idle sheets
    print("\n--- Character Idle Sheets ---")
    create_character_idle_sheet("player.png", "player_idle_sheet.png", 4)
    create_character_idle_sheet("warehouse_keeper.png", "warehouse_keeper_idle_sheet.png", 2)
    create_character_idle_sheet("dungeon_guide.png", "dungeon_guide_idle_sheet.png", 2)

    print("\n=== Done ===")


if __name__ == "__main__":
    main()
