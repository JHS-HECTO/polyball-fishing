"""
Strip the checkerboard/white background from Gemini-generated sprites so the
PNGs have real alpha transparency. Run from the project root:

    python scripts/remove-bg.py

Skips files whose name implies they have a full-bleed background (e.g.
01-title-bg.png). Output overwrites the original PNG in place.
"""
from __future__ import annotations

import sys
from pathlib import Path

from rembg import remove
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "public" / "images"

# Files that intentionally keep their full background.
SKIP = {
    "01-title-bg.png",
}


def process_one(path: Path) -> None:
    print(f"  {path.name} ...", end=" ", flush=True)
    src = Image.open(path).convert("RGBA")
    out = remove(src)
    out.save(path, format="PNG", optimize=True)
    print("OK")


def main() -> int:
    if not IMG_DIR.is_dir():
        print(f"Image dir not found: {IMG_DIR}")
        return 1

    pngs = sorted(p for p in IMG_DIR.glob("*.png") if p.name not in SKIP)
    if not pngs:
        print("No PNGs to process.")
        return 0

    print(f"Removing background from {len(pngs)} sprites in {IMG_DIR}")
    for p in pngs:
        try:
            process_one(p)
        except Exception as exc:  # noqa: BLE001
            print(f"FAIL ({exc})")
            return 2
    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
