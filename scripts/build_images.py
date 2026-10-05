"""Webre optimalizált képváltozatok előállítása.

- EXIF-orientáció javítása, minden metaadat eldobása (EXIF/GPS/ICC kivéve sRGB-konverzió)
- AVIF + WebP több szélességben, egy JPEG fallback
- images/projects/<projekt>/<kategória>/<név>-<szélesség>.<ext>
- src/data/images.json: azonosító → méretek, elérhető szélességek

Az eredeti fájlok NEM kerülnek a repóba; a forrásmappa (OLIVE_RAW) érintetlen marad.
Futtatás: python scripts/build_images.py   (újrafuttatható, a meglévő kimenetet kihagyja;
--force az újrageneráláshoz)
"""
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
RAW = Path(os.environ.get('OLIVE_RAW', ROOT.parent / 'olive-assets-raw'))
OUT = ROOT / 'images' / 'projects'
MANIFEST = ROOT / 'src' / 'data' / 'images.json'

WIDTHS = [640, 960, 1440]
HERO_WIDTHS = [640, 960, 1440, 1920]
FALLBACK_W = 960
AVIF_Q, WEBP_Q, JPEG_Q = 52, 76, 80
FORCE = '--force' in sys.argv


def to_srgb(im):
    icc = im.info.get('icc_profile')
    if icc:
        try:
            src = ImageCms.ImageCmsProfile(ImageCms.io.BytesIO(icc))
            im = ImageCms.profileToProfile(im, src, ImageCms.createProfile('sRGB'), outputMode='RGB')
        except Exception:
            pass
    return im.convert('RGB')


def main():
    spec = json.loads((ROOT / 'scripts' / 'image-sources.json').read_text(encoding='utf-8'))
    manifest = {}
    for item in spec['images']:
        src = RAW / item['src']
        if not src.exists():
            sys.exit(f'Hiányzó forrás: {src}')
        im = Image.open(src)
        im = ImageOps.exif_transpose(im)
        im = to_srgb(im)
        w0, h0 = im.size
        widths = HERO_WIDTHS if item.get('hero') else WIDTHS
        widths = [w for w in widths if w < w0] + ([w0] if w0 <= widths[-1] else [])
        widths = sorted(set(widths))[:len(HERO_WIDTHS)]
        base = OUT / item['id']
        base.parent.mkdir(parents=True, exist_ok=True)
        for w in widths:
            h = round(h0 * w / w0)
            variant = None
            for ext, kw in (('avif', {'quality': AVIF_Q, 'speed': 6}), ('webp', {'quality': WEBP_Q, 'method': 6})):
                p = Path(f'{base}-{w}.{ext}')
                if p.exists() and not FORCE:
                    continue
                variant = variant or im.resize((w, h), Image.LANCZOS)
                variant.save(p, ext.upper(), **kw)
        fw = min(FALLBACK_W, w0)
        pj = Path(f'{base}-{fw}.jpg')
        if FORCE or not pj.exists():
            im.resize((fw, round(h0 * fw / w0)), Image.LANCZOS).save(pj, 'JPEG', quality=JPEG_Q, optimize=True, progressive=True)
        if item.get('hero') or item.get('og'):  # Open Graph: 1200×630 középre vágva
            po = Path(f'{base}-og.jpg')
            if FORCE or not po.exists():
                ImageOps.fit(im, (1200, 630), Image.LANCZOS).save(po, 'JPEG', quality=82, optimize=True, progressive=True)
        manifest[item['id']] = {
            'width': w0, 'height': h0, 'widths': widths, 'fallback': fw,
            'source': item['src'],
            **({'floorplan': True} if item.get('floorplan') else {}),
            **({'og': True} if item.get('hero') or item.get('og') else {}),
        }
        print(f"{item['id']}: {w0}x{h0} -> {widths}")
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


def make_icons():
    """Favicon/app-ikonok: olívazöld kör, világos olívabogyó (a favicon.svg rasztere)."""
    from PIL import ImageDraw
    for size, name in ((180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png')):
        s = size * 4
        im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.ellipse((0, 0, s - 1, s - 1), fill='#3B4A32')
        cx, cy, rx, ry = s / 2, s * 17 / 32, s * 6 / 32, s * 8 / 32
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill='#C7CFB7')
        im.resize((size, size), Image.LANCZOS).save(ROOT / name)


if __name__ == '__main__':
    main()
    make_icons()
