// Újrafelhasználható HTML-komponensek (sima függvények → HTML-string). Nincs keretrendszer,
// nincs függőség: a scripts/build.mjs ebből állítja elő a statikus oldalakat.
import { readFileSync } from 'node:fs';
import { site } from './data/site.mjs';
import { services } from './data/services.mjs';

const IMAGES = JSON.parse(readFileSync(new URL('./data/images.json', import.meta.url), 'utf8'));

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');

export function img(id) {
  const m = IMAGES[id];
  if (!m) throw new Error(`Ismeretlen kép: ${id} (futtasd: python scripts/build_images.py)`);
  return m;
}
const imgPath = (id, w, ext) => `/images/projects/${id}-${w}.${ext}`;
export const imgUrl = (id, w) => imgPath(id, w ?? img(id).fallback, 'jpg');
export const largest = (id, ext = 'webp') => imgPath(id, img(id).widths.at(-1), ext);

// Picture: AVIF → WebP → JPEG fallback, srcset + sizes, explicit méret a CLS ellen.
export function Picture(id, { alt, sizes = '100vw', eager = false, cls, style, objectPosition } = {}) {
  const m = img(id);
  const set = (ext) => m.widths.map((w) => `${imgPath(id, w, ext)} ${w}w`).join(', ');
  const st = [style, objectPosition ? `object-position:${objectPosition}` : null].filter(Boolean).join(';') || undefined;
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${esc(sizes)}"><source type="image/webp" srcset="${set('webp')}" sizes="${esc(sizes)}"><img${attrs({
    src: imgPath(id, m.fallback, 'jpg'), width: m.width, height: m.height, alt: alt ?? '',
    loading: eager ? 'eager' : 'lazy', fetchpriority: eager ? 'high' : undefined, decoding: eager ? undefined : 'async', class: cls, style: st,
  })}></picture>`;
}

export function Header({ path, overlay = false }) {
  const link = (n) => `<li><a href="${n.href}"${path === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`;
  return `<header class="header${overlay ? ' header--overlay' : ''}">
  <div class="header__inner">
    <a class="brand" href="/" aria-label="${esc(site.name)} – kezdőlap">${esc(site.name)}</a>
    <nav class="nav" aria-label="Fő navigáció"><ul>${site.nav.map(link).join('')}</ul></nav>
    <a class="btn btn--solid header__cta" href="${site.headerCta.href}">${esc(site.headerCta.label)}</a>
    <button class="menu-btn" id="menu-open" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="mnav"><span class="menu-btn__bars" aria-hidden="true"><span></span><span></span><span></span></span>Menü</button>
  </div>
</header>
${MobileNavigation({ path })}`;
}

export function MobileNavigation({ path }) {
  return `<dialog class="mnav" id="mnav" aria-label="Menü">
  <div class="mnav__inner">
    <div class="mnav__top"><a class="brand" href="/">${esc(site.name)}</a><button class="mnav__close" type="button">Bezárás<span class="visually-hidden"> – menü</span></button></div>
    <nav aria-label="Mobil navigáció"><ul>
      <li><a href="/"${path === '/' ? ' aria-current="page"' : ''}>Kezdőlap</a></li>
      ${site.nav.map((n) => `<li><a href="${n.href}"${path === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}
    </ul></nav>
    <div class="mnav__foot">
      <a class="btn btn--solid" href="${site.headerCta.href}">${esc(site.headerCta.label)}</a>
      <div class="mnav__contact"><a href="${site.phoneHref}">${esc(site.phone)}</a><a href="mailto:${site.email}">${esc(site.email)}</a></div>
    </div>
  </div>
</dialog>`;
}

export function Hero({ image, alt, eyebrow, title, lead, ctas = [] }) {
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">${Picture(image, { alt, eager: true, sizes: '100vw' })}</div>
  <div class="hero__content">
    ${eyebrow ? `<span class="hero__eyebrow">${esc(eyebrow)}</span>` : ''}
    <h1 id="hero-title">${esc(title)}</h1>
    ${lead ? `<p class="hero__lead">${esc(lead)}</p>` : ''}
    ${ctas.length ? `<div class="btn-row">${ctas.map((c, i) => `<a class="btn ${i ? 'btn--ghost-light' : 'btn--light'}" href="${c.href}">${esc(c.label)}</a>`).join('')}</div>` : ''}
  </div>
</section>`;
}

export function PageHead({ eyebrow, title, intro, crumbs }) {
  return `<header class="page-head"><div class="wrap">
  ${crumbs ? Breadcrumb(crumbs) : ''}
  ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
  <h1>${esc(title)}</h1>
  ${intro ? `<p class="lead">${esc(intro)}</p>` : ''}
</div></header>`;
}

export function Breadcrumb(crumbs) {
  return `<nav class="breadcrumb" aria-label="Morzsamenü"><ol>${crumbs.map((c, i) => `<li>${i < crumbs.length - 1 ? `<a href="${c.href}">${esc(c.label)}</a>` : `<span aria-current="page">${esc(c.label)}</span>`}</li>`).join('')}</ol></nav>`;
}

export function SectionHeading({ eyebrow, title, intro, id, split = false, level = 2 }) {
  return `<div class="sh${split ? ' sh--split' : ''}">
  <div>${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}<h${level}${id ? ` id="${id}"` : ''}>${esc(title)}</h${level}></div>
  ${intro ? `<p class="sh__intro">${esc(intro)}</p>` : ''}
</div>`;
}

export function ServiceBlock(s, i) {
  return `<li class="service"><a class="service__link" href="/szolgaltatasok/#${s.slug}">
  ${s.image ? `<div class="media">${Picture(s.image, { alt: '', sizes: '(min-width: 760px) 45vw, 100vw' })}</div>` : ''}
  <span class="service__num">${String(i + 1).padStart(2, '0')}</span>
  <h3>${esc(s.short)}</h3>
  <p>${esc(s.teaser)}</p>
</a></li>`;
}

export function ProjectCard(p, { headingLevel = 3 } = {}) {
  const ba = p.beforeAfter[0];
  const href = `/projektek/${p.slug}/`;
  const h = `h${headingLevel}`;
  return `<li><article class="pcard" aria-labelledby="pc-${p.slug}">
  <a class="pcard__media" href="${href}" tabindex="-1" aria-hidden="true">${Picture(p.hero, { alt: '', sizes: '(min-width: 900px) 58vw, 100vw' })}</a>
  <div>
    <p class="pcard__meta">${esc(p.shortLocation)}</p>
    <${h} id="pc-${p.slug}"><a href="${href}">${esc(p.title)}${p.subtitle ? `<span class="pcard__sub">${esc(p.subtitle)}</span>` : ''}</a></${h}>
    <p>${esc(p.cardText)}</p>
    <ul class="tags" aria-label="Szolgáltatások">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    ${ba ? `<div class="pcard__ba" role="group" aria-label="Előtte–utána előnézet: ${esc(ba.room)}">
      <figure>${Picture(ba.before, { alt: ba.altBefore, sizes: '11rem', objectPosition: ba.objectPositionBefore })}<figcaption>Előtte</figcaption></figure>
      <figure>${Picture(ba.after, { alt: ba.altAfter, sizes: '11rem', objectPosition: ba.objectPositionAfter })}<figcaption>Utána</figcaption></figure>
    </div>` : ''}
    <a class="link-arrow" href="${href}">Projekt megtekintése<span class="visually-hidden">: ${esc(p.title)}</span></a>
  </div>
</article></li>`;
}

export function ProjectFacts(facts) {
  const known = facts.filter((f) => f.value); // ismeretlen (null/TODO) adat nem jelenik meg
  return `<dl class="facts">${known.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl>`;
}

export function BeforeAfterSlider(pair) {
  const aspect = pair.aspect ? ` style="--ba-aspect:${esc(pair.aspect)}"` : '';
  const sizes = pair.displayMode === 'slider' ? '(min-width: 1280px) 1180px, 100vw' : '(min-width: 640px) 50vw, 100vw';
  const [aw, ah] = (pair.aspect || '4 / 3').split('/').map(Number); // pl. '3 / 4'
  const portrait = aw < ah;
  return `<figure class="ba${portrait ? ' ba--portrait' : ''}" data-mode="${pair.displayMode}" data-room="${esc(pair.room)}"${aspect}>
  <div class="ba__head"><h3 class="ba__room">${esc(pair.room)}</h3>${pair.note ? `<p class="ba__note">${esc(pair.note)}</p>` : ''}</div>
  <div class="ba__pair">
    <div class="ba__item ba__item--before">${Picture(pair.before, { alt: pair.altBefore, sizes, objectPosition: pair.objectPositionBefore })}<span class="ba__label">Előtte</span></div>
    <div class="ba__item ba__item--after">${Picture(pair.after, { alt: pair.altAfter, sizes, objectPosition: pair.objectPositionAfter })}<span class="ba__label">Utána</span></div>
  </div>
  ${pair.displayMode === 'slider' ? '<p class="ba__hint" hidden>Húzza a csúszkát, vagy fókuszálva használja a nyílbillentyűket.</p>' : ''}
</figure>`;
}

const INITIAL_GALLERY = 10; // 1 széles + 3×3 rács
export function ProjectGallery(items, { id }) {
  return `<ul class="gallery" data-gallery id="${id}">${items.map((g, i) => `<li${i >= INITIAL_GALLERY ? ' class="is-hidden"' : ''}><button type="button" data-full="${largest(g.image)}" data-alt="${esc(g.alt)}" aria-label="Nagyítás: ${esc(g.alt)}">${Picture(g.image, { alt: g.alt, sizes: i === 0 ? '(min-width: 1280px) 1180px, 100vw' : '(min-width: 800px) 33vw, 50vw' })}</button></li>`).join('')}</ul>
${items.length > INITIAL_GALLERY ? `<p class="gallery-more"><button class="btn btn--line" type="button">További ${items.length - INITIAL_GALLERY} kép</button></p>
<noscript><style>.gallery li.is-hidden{display:block}.gallery-more{display:none}</style></noscript>` : ''}`;
}

export function AccessibleLightbox() {
  return `<dialog class="lightbox" id="lightbox" aria-label="Képnézegető">
  <div class="lightbox__inner">
    <div class="lightbox__bar"><span class="lightbox__count" aria-live="polite"></span><button class="lightbox__close" type="button">Bezárás <span aria-hidden="true">✕</span></button></div>
    <div class="lightbox__stage">
      <img alt="">
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Előző kép">‹</button>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Következő kép">›</button>
    </div>
    <p class="lightbox__caption"></p>
  </div>
</dialog>`;
}

export function ProcessTimeline(steps) {
  return `<ol class="timeline">${steps.map((s) => `<li><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}</ol>`;
}

export function ContactCTA({ title, text, label = 'Beszéljünk a projektről', href = '/kapcsolat/' }) {
  return `<section class="section cta" aria-labelledby="cta-title"><div class="wrap">
  <h2 id="cta-title">${esc(title)}</h2>
  <p>${esc(text)}</p>
  <div class="btn-row"><a class="btn btn--light" href="${href}">${esc(label)}</a><a class="btn btn--ghost-light" href="${site.phoneHref}">${esc(site.phone)}</a></div>
</div></section>`;
}

export function ContactForm({ services: opts }) {
  const field = (name, label, { type = 'text', required = false, auto, opt = false, full = false } = {}) => `<div class="field${full ? ' field--full' : ''}"><label for="f-${name}">${esc(label)}${opt ? ' <span class="opt">(opcionális)</span>' : ''}</label><input id="f-${name}" name="${name}" type="${type}"${required ? ' required' : ''}${auto ? ` autocomplete="${auto}"` : ''}></div>`;
  return `<form class="form" id="contact-form" novalidate${site.formEndpoint ? ` data-endpoint="${esc(site.formEndpoint)}"` : ''} data-mailto="${esc(site.email)}" aria-describedby="form-note">
  <div class="form__row">${field('nev', 'Név', { required: true, auto: 'name' })}${field('email', 'E-mail', { type: 'email', required: true, auto: 'email' })}</div>
  <div class="form__row">${field('telefon', 'Telefonszám', { type: 'tel', auto: 'tel', opt: true })}${field('helyszin', 'Ingatlan helye vagy kerülete', { required: true })}</div>
  <div class="form__row">
    <div class="field"><label for="f-szolgaltatas">Érdekelt szolgáltatás</label><select id="f-szolgaltatas" name="szolgaltatas" required><option value="">Válasszon…</option>${opts.map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>
    ${field('kezdes', 'Tervezett kezdés', { opt: true })}
  </div>
  <div class="form__row">${field('keret', 'Becsült keret', { opt: true })}<div></div></div>
  <div class="field"><label for="f-leiras">Rövid leírás</label><textarea id="f-leiras" name="leiras" required></textarea></div>
  <div class="field field--check"><input id="f-consent" name="hozzajarulas" type="checkbox" required><label for="f-consent">Hozzájárulok, hogy az Urban Flip Studio a megadott adataimat a megkeresésem megválaszolása céljából kezelje.</label></div>
  <!-- TODO: adatkezelési tájékoztató linkje ide, jogi ellenőrzés után (site.privacyUrl). -->
  <div><button class="btn btn--solid" type="submit">Üzenet küldése</button></div>
  <p class="form__status" role="status" aria-live="polite"></p>
  <p class="form__alt" id="form-note">${site.formEndpoint ? '' : 'A küldés gomb a levelezőprogramjában nyit egy előre kitöltött üzenetet. '}Ha egyszerűbb: hívjon a <a href="${site.phoneHref}">${esc(site.phone)}</a> számon, írjon a <a href="mailto:${site.email}">${esc(site.email)}</a> címre, vagy üzenjen <a href="${site.whatsapp}" rel="noopener" target="_blank">WhatsAppon</a>.</p>
</form>`;
}

export function Footer() {
  const year = new Date().getFullYear();
  return `<footer class="footer"><div class="wrap">
  <div class="footer__grid">
    <div><p class="footer__brand">${esc(site.name)}</p><p>Teljes körű lakásfelújítás, enteriőrtervezés és home staging Budapesten.</p></div>
    <nav aria-label="Lábléc navigáció"><h2>Oldalak</h2><ul>${site.nav.filter((n) => !n.href.includes('#')).map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}</ul></nav>
    <div><h2>Kapcsolat</h2><ul><li><a href="${site.phoneHref}">${esc(site.phone)}</a></li><li><a href="mailto:${site.email}">${esc(site.email)}</a></li><li><a href="${site.whatsapp}" rel="noopener" target="_blank">WhatsApp</a></li></ul></div>
  </div>
  <div class="footer__bottom"><span>© ${year} ${esc(site.name)}</span><span>Budapest</span></div>
</div></footer>`;
}

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
