#!/usr/bin/env python3
"""
Generate Bug Whisper Favicons and Social Media Preview Card using Pillow.
Identity: Prismatic "Fracture & Heal" Chevron (Execution 1-A)
  - Dark precision container (#141612) with hairline graphite border (#313628)
  - Terracotta chiseled upper arm (#ff7d4d / #de5d33 / #8a2a0a)
  - Emerald chiseled lower arm (#8efab1 / #7bd88f / #247839)
  - Optical diamond key & focal node locking the fracture line
  - 1200x630 Cream Paper engineering notebook social preview card
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT_DIR / "public"


def render_prismatic_chevron_icon(size: int) -> Image.Image:
    """Renders the Prismatic Fracture & Heal Chevron icon at any pixel resolution."""
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    def s(v: float) -> float:
        return v / 64.0 * canvas_size

    # 1. Dark Precision Tile Container
    pad = s(1.0)
    r = int(s(15.0))
    bw = max(1, int(s(1.0)))
    draw.rounded_rectangle(
        [pad, pad, canvas_size - pad, canvas_size - pad],
        radius=r,
        fill=(22, 24, 19, 255),        # #161813
        outline=(49, 54, 40, 255),     # #313628
        width=bw,
    )

    # 2. Subtle Radial Glow behind Fracture Point (44, 32)
    glow_cx, glow_cy = s(44), s(32)
    glow_r = s(18)
    for i in range(int(glow_r), 0, -2):
        alpha = int(40 * (1 - i / glow_r))
        draw.ellipse(
            [glow_cx - i, glow_cy - i, glow_cx + i, glow_cy + i],
            fill=(123, 216, 143, alpha),
        )

    # 3. Upper Arm: The Fault / Traceback
    # Top Highlight Facet
    pts_fault_top = [
        (s(14), s(14)),
        (s(47), s(29)),
        (s(42), s(31.2)),
        (s(14), s(21.5)),
    ]
    draw.polygon(pts_fault_top, fill=(240, 105, 60, 255))   # #f0693c
    # Chiseled Shadow Bevel
    pts_fault_bevel = [
        (s(14), s(21.5)),
        (s(42), s(31.2)),
        (s(36), s(32.2)),
        (s(14), s(26.5)),
    ]
    draw.polygon(pts_fault_bevel, fill=(180, 55, 22, 255))  # #b43716
    # Top Highlight Ridge
    draw.line([(s(14), s(14)), (s(47), s(29))], fill=(255, 175, 140, 255), width=max(1, int(s(0.9))))

    # 4. Lower Arm: The Repair / Synthesis
    # Bottom Highlight Facet
    pts_heal_bottom = [
        (s(14), s(50)),
        (s(47), s(35)),
        (s(42), s(32.8)),
        (s(14), s(42.5)),
    ]
    draw.polygon(pts_heal_bottom, fill=(123, 216, 143, 255)) # #7bd88f
    # Chiseled Shadow Bevel
    pts_heal_bevel = [
        (s(14), s(42.5)),
        (s(42), s(32.8)),
        (s(36), s(31.8)),
        (s(14), s(37.5)),
    ]
    draw.polygon(pts_heal_bevel, fill=(45, 135, 70, 255))    # #2d8746
    # Bottom Highlight Ridge
    draw.line([(s(14), s(50)), (s(47), s(35))], fill=(195, 255, 215, 255), width=max(1, int(s(0.9))))

    # 5. Optical Diamond Key at Fracture Junction
    pts_diamond = [
        (s(46), s(30.5)),
        (s(51), s(32.0)),
        (s(46), s(33.5)),
        (s(44), s(32.0)),
    ]
    draw.polygon(pts_diamond, fill=(255, 255, 255, 255))

    # Focal Vertex Node
    node_cx, node_cy = s(51.5), s(32.0)
    node_r = s(2.4)
    draw.ellipse([node_cx - node_r, node_cy - node_r, node_cx + node_r, node_cy + node_r], fill=(123, 216, 143, 255))
    draw.ellipse([node_cx - node_r*0.5, node_cy - node_r*0.5, node_cx + node_r*0.5, node_cy + node_r*0.5], fill=(255, 255, 255, 255))

    # Origin Hairline Calibration Mark
    draw.line([(s(8), s(32)), (s(11), s(32))], fill=(80, 88, 70, 255), width=max(1, int(s(0.8))))

    return img.resize((size, size), Image.Resampling.LANCZOS)


def generate_favicons():
    """Generates all favicon formats (ICO, PNGs)."""
    base_512 = render_prismatic_chevron_icon(512)
    base_192 = render_prismatic_chevron_icon(192)
    base_180 = render_prismatic_chevron_icon(180)
    base_48 = render_prismatic_chevron_icon(48)
    base_32 = render_prismatic_chevron_icon(32)
    base_16 = render_prismatic_chevron_icon(16)

    # Save PNGs
    base_512.save(PUBLIC_DIR / "icon-512.png", format="PNG")
    base_192.save(PUBLIC_DIR / "icon-192.png", format="PNG")
    base_180.save(PUBLIC_DIR / "apple-touch-icon.png", format="PNG")
    base_32.save(PUBLIC_DIR / "favicon-32x32.png", format="PNG")
    base_16.save(PUBLIC_DIR / "favicon-16x16.png", format="PNG")

    # Multi-resolution ICO
    base_48.save(
        PUBLIC_DIR / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[base_32, base_16],
    )
    print("Prismatic Chevron favicons generated (ICO, PNGs).")


def generate_og_image():
    """Generates 1200x630 social preview card adhering to Cream Paper design system."""
    w, h = 1200, 630
    img = Image.new("RGBA", (w, h), (246, 246, 246, 255))  # #f6f6f6 Cream Surface
    draw = ImageDraw.Draw(img)

    # Blueprint grid
    grid = 40
    for x in range(0, w, grid):
        draw.line([(x, 0), (x, h)], fill=(236, 234, 228, 255), width=1)
    for y in range(0, h, grid):
        draw.line([(0, y), (w, y)], fill=(236, 234, 228, 255), width=1)

    # Hairline frame
    draw.rectangle([16, 16, w - 16, h - 16], outline=(225, 222, 214, 255), width=1)

    # Fonts
    try:
        font_eyebrow = ImageFont.truetype("arialbd.ttf", 13)
        font_brand = ImageFont.truetype("arialbd.ttf", 26)
        font_headline = ImageFont.truetype("arialbd.ttf", 46)
        font_desc = ImageFont.truetype("arial.ttf", 19)
        font_code = ImageFont.truetype("consola.ttf", 16)
        font_code_bold = ImageFont.truetype("consolab.ttf", 16)
        font_badge = ImageFont.truetype("consola.ttf", 14)
    except IOError:
        font_eyebrow = ImageFont.load_default()
        font_brand = ImageFont.load_default()
        font_headline = ImageFont.load_default()
        font_desc = ImageFont.load_default()
        font_code = ImageFont.load_default()
        font_code_bold = ImageFont.load_default()
        font_badge = ImageFont.load_default()

    # Brand Title: Icon + "bug whisper"
    icon_small = render_prismatic_chevron_icon(38)
    img.paste(icon_small, (64, 52), icon_small)
    draw.text((114, 56), "bug whisper", fill=(20, 20, 20, 255), font=font_brand)

    # Eyebrow Tag
    draw.rounded_rectangle([300, 56, 475, 88], radius=6, fill=(255, 255, 255, 255), outline=(220, 218, 210, 255), width=1)
    draw.text((314, 65), "PYTHON RUNTIME", fill=(99, 102, 92, 255), font=font_eyebrow)

    # Display Headline
    draw.text((64, 126), "The runtime platform", fill=(20, 20, 20, 255), font=font_headline)
    draw.text((64, 180), "that keeps Python code", fill=(20, 20, 20, 255), font=font_headline)
    draw.text((64, 234), "in sync.", fill=(222, 93, 51, 255), font=font_headline)

    # Description
    draw.text((64, 308), "Deterministic CPython AST validation meets", fill=(85, 88, 78, 255), font=font_desc)
    draw.text((64, 336), "fine-tuned Qwen 2.5 Coder 3B neural intelligence.", fill=(85, 88, 78, 255), font=font_desc)
    draw.text((64, 364), "Instant traceback healing with zero regressions.", fill=(85, 88, 78, 255), font=font_desc)

    # CLI Command Card
    draw.rounded_rectangle([64, 420, 440, 468], radius=8, fill=(20, 20, 20, 255), outline=(56, 56, 58, 255), width=1)
    draw.text((82, 434), "$ pip install bugwhisper", fill=(240, 242, 235, 255), font=font_code)

    # Badges
    stats = [
        ("93/93 Tests Passing", (123, 216, 143, 255)),
        ("Pyodide CPython 3.12", (71, 191, 255, 255)),
        ("Qwen 2.5 Coder 3B", (222, 93, 51, 255)),
    ]
    bx = 64
    for label, col in stats:
        draw.ellipse([bx, 502, bx + 10, 512], fill=col)
        draw.text((bx + 18, 500), label, fill=(70, 74, 65, 255), font=font_badge)
        bx += 230

    draw.text((64, 562), "Apache-2.0 License · PyPI Package: bugwhisper · Pernav Jain & Harshit Sharma", fill=(125, 130, 120, 255), font=font_badge)

    # Right Column: Precision Dark Code Card (#141414) with traffic-light dots
    cx0, cy0, cx1, cy1 = 560, 52, 1140, 575
    draw.rounded_rectangle([cx0, cy0, cx1, cy1], radius=12, fill=(20, 20, 20, 255), outline=(56, 56, 58, 255), width=1)

    # Titlebar
    draw.rectangle([cx0 + 1, cy0 + 1, cx1 - 1, cy0 + 38], fill=(36, 36, 36, 255))
    draw.ellipse([cx0 + 16, cy0 + 14, cx0 + 26, cy0 + 24], fill=(252, 97, 141, 255))
    draw.ellipse([cx0 + 34, cy0 + 14, cx0 + 44, cy0 + 24], fill=(248, 230, 122, 255))
    draw.ellipse([cx0 + 52, cy0 + 14, cx0 + 62, cy0 + 24], fill=(123, 216, 143, 255))
    draw.text((cx0 + 78, cy0 + 13), "remediation_sandbox.py — Bug Whisper Studio", fill=(160, 160, 160, 255), font=font_code)

    # Code interior
    lines = [
        ("# 1. Live CPython runtime exception detected", (110, 115, 105, 255), False),
        ("def calculate_average(records: list) -> float:", (230, 230, 230, 255), False),
        ("    total = sum(r['score'] for r in records)", (230, 230, 230, 255), False),
        ("    return total / len(records)", (230, 230, 230, 255), False),
        ("", (0, 0, 0, 0), False),
        ("! ZeroDivisionError: division by zero (line 4)", (252, 97, 141, 255), True),
        ("", (0, 0, 0, 0), False),
        ("# 2. Neural patch synthesized and AST verified (< 200ms)", (110, 115, 105, 255), False),
        ("@@ -3,2 +3,4 @@ def calculate_average", (140, 140, 140, 255), False),
        ("+   if not records:", (123, 216, 143, 255), True),
        ("+       return 0.0", (123, 216, 143, 255), True),
        ("    total = sum(r['score'] for r in records)", (200, 200, 200, 255), False),
        ("    return total / len(records)", (200, 200, 200, 255), False),
        ("", (0, 0, 0, 0), False),
        ("Verification: PASS · AST Compile 0ms · Regressions: 0", (71, 191, 255, 255), True),
    ]

    ly = cy0 + 56
    for text, col, is_bold in lines:
        if text:
            if text.startswith("!"):
                draw.rounded_rectangle([cx0 + 14, ly - 3, cx1 - 14, ly + 21], radius=4, fill=(50, 24, 28, 255))
            elif text.startswith("+"):
                draw.rounded_rectangle([cx0 + 14, ly - 3, cx1 - 14, ly + 21], radius=4, fill=(24, 46, 30, 255))
            fnt = font_code_bold if is_bold else font_code
            draw.text((cx0 + 22, ly), text, fill=col, font=fnt)
        ly += 26

    img.save(PUBLIC_DIR / "og-image.png", format="PNG")
    print("Cream Paper social preview card generated (public/og-image.png).")


def main():
    import sys
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    generate_favicons()
    if "--social" in sys.argv:
        generate_og_image()


if __name__ == "__main__":
    main()

