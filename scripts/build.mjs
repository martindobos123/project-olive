// Statikus oldalgenerátor — függőség nélkül (csak Node beépített modulok).
// Futtatás: node scripts/build.mjs
// Kimenet: a GitHub Pages által kiszolgált gyökérbe (index.html, <útvonal>/index.html, assets/,
// sitemap.xml, robots.txt, site.webmanifest, 404.html, régi /project-olive/ átirányítás).
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/data/site.mjs';
import { measurement, measurementCsp } from '../src/measurement-config.mjs';
import { allPages } from '../src/pages.mjs';
import { Header, Footer, ConsentBanner, LangSwitch, esc, img } from '../src/components.mjs';
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
// Legacy loaders remain disabled: the common consent controller owns all measurement.
if (process.env.OAI_PIXEL_ID || site.oaiPixelId || site.goatcounter || site.formEndpoint || site.investorFormEndpoint) throw new Error('Legacy tracking and external forms need a separate consent/legal review.');
const measurementPaths = LANGS.flatMap(l => { setLang(l); return allPages().map(p => p.path); });
setLang('hu');
const assetSrc = {
  'site.css': readFileSync(join(ROOT, 'src', 'assets', 'fonts.css'), 'utf8') + readFileSync(join(ROOT, 'src', 'assets', 'site.css'), 'utf8'),
  'measurement.js': 'window.__ufsMeasurementConfig = ' + JSON.stringify({ ...measurement, paths: measurementPaths }) + ';\n' + readFileSync(join(ROOT, 'src/assets/measurement.js'), 'utf8'),
  'site.js': readFileSync(join(ROOT, 'src', 'assets', 'site.js'), 'utf8'),
  'investor.css': readFileSync(join(ROOT, 'src', 'assets', 'investor.css'), 'utf8'),
  'investor.js': readFileSync(join(ROOT, 'src', 'assets', 'investor.mjs'), 'utf8'),
  'value.css': readFileSync(join(ROOT, 'src', 'assets', 'value-enhancement.css'), 'utf8'),
  'value.js': readFileSync(join(ROOT, 'src', 'assets', 'value-enhancement.mjs'), 'utf8'),
  // Régi /project-olive/ cím → projektoldal; a query stringet (pl. az OpenAI ?oppref=… attribúciós
  // paramétert) és a hash-t megőrzi, hogy a Pixel a céloldalon még lássa. A CSP tiltja az inline scriptet,
  // ezért külön fájl; JS nélkül a <noscript> meta-refresh visz tovább (query nélkül).
  'redirect.js': `location.replace('/projektek/vamhaz-korut/' + location.search + location.hash);\n`,
};
mkdirSync(join(ROOT, 'assets', 'fonts'), { recursive: true });
for (const [f, content] of Object.entries(assetSrc)) {
  writeFileSync(join(ROOT, 'assets', f), content);
  assets[f] = `/assets/${f}?v=${createHash('sha1').update(content).digest('hex').slice(0, 8)}`;
}
for (const f of readdirSync(join(ROOT, 'src', 'assets', 'fonts'))) copyFileSync(join(ROOT, 'src', 'assets', 'fonts', f), join(ROOT, 'assets', 'fonts', f));
const PRELOAD_FONTS = ['fraunces-normal-400-latin.woff2', 'fraunces-normal-400-latin-ext.woff2', 'inter-latin.woff2'];

// Expand only to configured providers, keeping inline scripts and eval blocked.
const sources = measurementCsp();
const CSP = [
  "default-src 'self'", "base-uri 'self'", `img-src 'self' data: ${sources.img}`,
  "style-src 'self' 'unsafe-inline'", "font-src 'self'",
  `script-src 'self' ${sources.script}`, `connect-src 'self' ${sources.connect}`,
  "media-src 'self'", "object-src 'none'", `frame-src ${sources.frame}`, "form-action 'self'", 'upgrade-insecure-requests',
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
<html lang="${lang}" data-measure-path="${esc(page.path)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="origin">
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
<script src="${assets['measurement.js']}" defer></script>
${page.investorAssets ? `<link rel="stylesheet" href="${assets['investor.css']}"><script type="module" src="${assets['investor.js']}"></script>` : ''}
${page.valueAssets ? `<link rel="stylesheet" href="${assets['value.css']}"><script type="module" src="${assets['value.js']}"></script><script type="module" src="${assets['investor.js']}"></script>` : ''}
<script src="${assets['site.js']}" defer></script>
${page.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
<a class="skip-link" href="#tartalom">${t({ hu: 'Ugrás a tartalomhoz', en: 'Skip to content' })}</a>
${page.landing ? `<header class="header header--landing"><div class="header__inner"><a class="brand" href="${href('home')}">${esc(site.name)}</a><div class="header__end">${LangSwitch(alternates)}<a class="btn btn--solid" href="#erdeklodes">${t({hu:'Egyeztessünk',en:'Let’s talk'})}</a></div></div></header>` : Header({ path: page.path, overlay: !!page.overlayHeader, alternates })}
${page.body}
${page.landing ? `<footer class="footer"><div class="wrap"><p class="footer__brand">${esc(site.name)}</p><p>Budapest · <a href="${site.phoneHref}">${esc(site.phone)}</a> · <a href="mailto:${site.email}">${esc(site.email)}</a></p><p><a href="${href('privacy')}">${t({hu:'Adatkezelési tájékoztató',en:'Privacy notice'})}</a> · <a href="${href('imprint')}">${t({hu:'Impresszum',en:'Legal notice'})}</a> · <a href="${href('terms')}">${t({hu:'ÁSZF',en:'Terms'})}</a> · <a href="${href('cookies')}">${t({hu:'Sütitájékoztató',en:'Cookies'})}</a>${measurement.active ? ` · <a href="#consent" data-consent-open>${t({hu:'Mérési beállítások',en:'Measurement settings'})}</a>` : ''}</p></div></footer>` : Footer()}
${measurement.active ? ConsentBanner() : ''}
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
