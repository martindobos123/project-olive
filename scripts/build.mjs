// Statikus oldalgenerátor — függőség nélkül (csak Node beépített modulok).
// Futtatás: node scripts/build.mjs
// Kimenet: a GitHub Pages által kiszolgált gyökérbe (index.html, <útvonal>/index.html, assets/,
// sitemap.xml, robots.txt, site.webmanifest, 404.html, régi /project-olive/ átirányítás).
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/data/site.mjs';
import { allPages } from '../src/pages.mjs';
import { Header, Footer, esc, img } from '../src/components.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (rel, content) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};

// assets: tartalom-hash a cache-törléshez (a Pages ~10 percig cache-el)
// a betű-deklarációk (fonts.css) a site.css elejére kerülnek: egy CSS-kérés, nincs külső betűszerver
const assets = {};
const assetSrc = {
  'site.css': readFileSync(join(ROOT, 'src', 'assets', 'fonts.css'), 'utf8') + readFileSync(join(ROOT, 'src', 'assets', 'site.css'), 'utf8'),
  'site.js': readFileSync(join(ROOT, 'src', 'assets', 'site.js'), 'utf8'),
};
mkdirSync(join(ROOT, 'assets', 'fonts'), { recursive: true });
for (const [f, content] of Object.entries(assetSrc)) {
  writeFileSync(join(ROOT, 'assets', f), content);
  assets[f] = `/assets/${f}?v=${createHash('sha1').update(content).digest('hex').slice(0, 8)}`;
}
for (const f of readdirSync(join(ROOT, 'src', 'assets', 'fonts'))) copyFileSync(join(ROOT, 'src', 'assets', 'fonts', f), join(ROOT, 'assets', 'fonts', f));
const PRELOAD_FONTS = ['fraunces-normal-400-latin.woff2', 'fraunces-normal-400-latin-ext.woff2', 'inter-latin.woff2'];

const CSP = [
  "default-src 'self'", "base-uri 'self'", "img-src 'self' data:",
  "style-src 'self' 'unsafe-inline'", "font-src 'self'",
  `script-src 'self'${site.goatcounter ? ' https://gc.zgo.at' : ''}`,
  `connect-src 'self'${site.goatcounter ? ' https://*.goatcounter.com' : ''}${site.formEndpoint ? ' ' + new URL(site.formEndpoint).origin : ''}`,
  "media-src 'self'", "object-src 'none'", "frame-src 'none'", "form-action 'self'", 'upgrade-insecure-requests',
].join('; ');

function layout(page) {
  const url = site.url + (page.path === '/404.html' ? '/' : page.path);
  const og = img(page.ogImage);
  if (!og.og) throw new Error(`${page.path}: az OG-képnek (${page.ogImage}) nincs -og.jpg változata (image-sources.json: "og": true)`);
  const ogUrl = `${site.url}/images/projects/${page.ogImage}-og.jpg`;
  return `<!DOCTYPE html>
<html lang="hu"${site.goatcounter ? ` data-gc="${esc(site.goatcounter)}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta name="theme-color" content="#FAF8F3">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${PRELOAD_FONTS.map((f) => `<link rel="preload" href="/assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="stylesheet" href="${assets['site.css']}">
<script src="${assets['site.js']}" defer></script>
${page.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<a class="skip-link" href="#tartalom">Ugrás a tartalomhoz</a>
${Header({ path: page.path, overlay: !!page.overlayHeader })}
${page.body}
${Footer()}
</body>
</html>
`;
}

const pages = allPages();
for (const p of pages) {
  const file = p.path === '/404.html' ? '404.html' : join(p.path, 'index.html');
  out(file, layout(p));
}

// régi útvonal → új projektoldal (a GitHub Pages nem tud szerveroldali 301-et)
const target = '/projektek/vamhaz-korut/';
out('project-olive/index.html', `<!DOCTYPE html>
<html lang="hu"><head><meta charset="utf-8"><title>Átirányítás — Vámház körút</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${site.url}${target}">
<meta http-equiv="refresh" content="0; url=${target}">
</head><body><p>Az oldal elköltözött: <a href="${target}">Vámház körút – Project Olive</a>.</p></body></html>
`);

const today = new Date().toISOString().slice(0, 10);
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
out('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
out('site.webmanifest', JSON.stringify({
  name: site.name, short_name: 'Urban Flip', lang: 'hu', start_url: '/', display: 'browser',
  background_color: '#FAF8F3', theme_color: '#3B4A32',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
}, null, 2) + '\n');

console.log(`${pages.length} oldal + átirányítás, sitemap, robots, manifest kész.`);
