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
import { Header, Footer, ConsentBanner, esc, img } from '../src/components.mjs';
import { LANGS, setLang, href, t } from '../src/i18n.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (rel, content) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};

// assets: tartalom-hash a cache-törléshez (a Pages ~10 percig cache-el)
// a betű-deklarációk (fonts.css) a site.css elejére kerülnek: egy CSS-kérés, nincs külső betűszerver
const assets = {};
// OpenAI Measurement Pixel — üresen minden Pixel-elem kimarad. Az OAI_PIXEL_ID env CSAK lokális teszthez
// (pl. `OAI_PIXEL_ID=test-local node scripts/build.mjs`): a kimenetet utána tiszta builddel felül kell írni,
// commitolni mindig a site.mjs-beli (valódi vagy üres) értékkel generált oldalakat szabad.
const PIXEL = process.env.OAI_PIXEL_ID || site.oaiPixelId;
if (PIXEL && !/^[\w-]{4,128}$/.test(PIXEL)) throw new Error(`site.oaiPixelId gyanús érték: ${PIXEL}`);
const assetSrc = {
  'site.css': readFileSync(join(ROOT, 'src', 'assets', 'fonts.css'), 'utf8') + readFileSync(join(ROOT, 'src', 'assets', 'site.css'), 'utf8'),
  'site.js': readFileSync(join(ROOT, 'src', 'assets', 'site.js'), 'utf8'),
  // Régi /project-olive/ cím → projektoldal; a query stringet (pl. az OpenAI ?oppref=… attribúciós
  // paramétert) és a hash-t megőrzi, hogy a Pixel a céloldalon még lássa. A CSP tiltja az inline scriptet,
  // ezért külön fájl; JS nélkül a <noscript> meta-refresh visz tovább (query nélkül).
  'redirect.js': `location.replace('/projektek/vamhaz-korut/' + location.search + location.hash);\n`,
  ...(PIXEL ? {
    // A hivatalos betöltő (developers.openai.com/ads/measurement-pixel) külső fájlban, mert a CSP nem enged
    // inline scriptet. Hozzájárulás: ha nincs tárolt engedély, az init ELŐTT oaiq("consent", false) —
    // a dokumentált mechanizmus; az "Elfogadom" gomb (site.js) oaiq("consent", true)-t hív.
    'oaiq-init.js': `(function (w, d, s, u) {
  if (w.oaiq) return;
  var q = function () { q.q.push(arguments); };
  q.q = [];
  w.oaiq = q;
  var js = d.createElement(s);
  js.async = true;
  js.src = u;
  var f = d.getElementsByTagName(s)[0];
  f.parentNode.insertBefore(js, f);
})(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
(function () {
  var granted = false;
  try { granted = window.localStorage.getItem('ufs-consent') === 'granted'; } catch (e) {}
  if (!granted) oaiq("consent", false);
  oaiq("init", { pixelId: ${JSON.stringify(PIXEL)} });
})();
`,
  } : {}),
};
mkdirSync(join(ROOT, 'assets', 'fonts'), { recursive: true });
for (const [f, content] of Object.entries(assetSrc)) {
  writeFileSync(join(ROOT, 'assets', f), content);
  assets[f] = `/assets/${f}?v=${createHash('sha1').update(content).digest('hex').slice(0, 8)}`;
}
for (const f of readdirSync(join(ROOT, 'src', 'assets', 'fonts'))) copyFileSync(join(ROOT, 'src', 'assets', 'fonts', f), join(ROOT, 'assets', 'fonts', f));
const PRELOAD_FONTS = ['fraunces-normal-400-latin.woff2', 'fraunces-normal-400-latin-ext.woff2', 'inter-latin.woff2'];

// CSP: a Pixel dokumentált forrásai CSAK akkor kerülnek be, ha a Pixel be van állítva
// (script: bzrcdn.openai.com; események + konfiguráció: bzr.openai.com, bzrcdn.openai.com; kép-fallback: bzr.openai.com).
const CSP = [
  "default-src 'self'", "base-uri 'self'", `img-src 'self' data:${PIXEL ? ' https://bzr.openai.com' : ''}`,
  "style-src 'self' 'unsafe-inline'", "font-src 'self'",
  `script-src 'self'${site.goatcounter ? ' https://gc.zgo.at' : ''}${PIXEL ? ' https://bzrcdn.openai.com' : ''}`,
  `connect-src 'self'${site.goatcounter ? ' https://*.goatcounter.com' : ''}${site.formEndpoint ? ' ' + new URL(site.formEndpoint).origin : ''}${PIXEL ? ' https://bzr.openai.com https://bzrcdn.openai.com' : ''}`,
  "media-src 'self'", "object-src 'none'", "frame-src 'none'", "form-action 'self'", 'upgrade-insecure-requests',
].join('; ');

function layout(page, lang) {
  const url = site.url + (page.path === '/404.html' ? '/' : page.path);
  const alternates = page.key ? Object.fromEntries(LANGS.map((l) => [l, href(page.key, l)])) : null;
  const hreflang = alternates
    ? [...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${site.url}${alternates[l]}">`), `<link rel="alternate" hreflang="x-default" href="${site.url}${alternates.hu}">`].join('\n')
    : '';
  const og = img(page.ogImage);
  if (!og.og) throw new Error(`${page.path}: az OG-képnek (${page.ogImage}) nincs -og.jpg változata (image-sources.json: "og": true)`);
  const ogUrl = `${site.url}/images/projects/${page.ogImage}-og.jpg`;
  return `<!DOCTYPE html>
<html lang="${lang}"${site.goatcounter ? ` data-gc="${esc(site.goatcounter)}"` : ''}${PIXEL ? ' data-oai-pixel' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
${hreflang}
<meta name="theme-color" content="#FAF8F3">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${t(site.locale)}">
${alternates ? LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${site.locale[l]}">`).join('\n') : ''}
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
${PIXEL ? `<script src="${assets['oaiq-init.js']}"></script>\n` : ''}<script src="${assets['site.js']}" defer></script>
${page.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<a class="skip-link" href="#tartalom">${t({ hu: 'Ugrás a tartalomhoz', en: 'Skip to content' })}</a>
${Header({ path: page.path, overlay: !!page.overlayHeader, alternates })}
${page.body}
${Footer()}
${PIXEL ? ConsentBanner() : ''}
</body>
</html>
`;
}

const pages = [];
for (const lang of LANGS) {
  setLang(lang);
  for (const p of allPages()) {
    const file = p.path === '/404.html' ? '404.html' : join(p.path, 'index.html');
    out(file, layout(p, lang));
    pages.push(p);
  }
}
setLang('hu');

// régi útvonal → új projektoldal (a GitHub Pages nem tud szerveroldali 301-et)
const target = '/projektek/vamhaz-korut/';
out('project-olive/index.html', `<!DOCTYPE html>
<html lang="hu"><head><meta charset="utf-8"><title>Átirányítás — Vámház körút</title>
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${site.url}${target}">
<script src="${assets['redirect.js']}"></script>
<noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
</head><body><p>Az oldal elköltözött: <a href="${target}">Vámház körút – Project Olive</a>.</p></body></html>
`);

const today = new Date().toISOString().slice(0, 10);
out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${site.url}${p.path}</loc>${LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${site.url}${href(p.key, l)}"/>`).join('')}<lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
out('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
out('site.webmanifest', JSON.stringify({
  name: site.name, short_name: 'Urban Flip', lang: 'hu', start_url: '/', display: 'browser',
  background_color: '#FAF8F3', theme_color: '#3B4A32',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
}, null, 2) + '\n');

console.log(`${pages.length} oldal + átirányítás, sitemap, robots, manifest kész.`);
