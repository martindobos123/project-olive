// Újrafelhasználható HTML-komponensek (sima függvények → HTML-string). Nincs keretrendszer,
// nincs függőség: a scripts/build.mjs ebből állítja elő a statikus oldalakat.
// A nyelvfüggő szövegek a t()-n mennek át (src/i18n.mjs) — az adatfájlok { hu, en } objektumai is.
import { readFileSync } from 'node:fs';
import { site } from './data/site.mjs';
import { services } from './data/services.mjs';
import { lang, LANGS, t, href, anchors } from './i18n.mjs';

const IMAGES = JSON.parse(readFileSync(new URL('./data/images.json', import.meta.url), 'utf8'));

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');

// több helyen használt UI-szövegek
const L = {
  before: { hu: 'Előtte', en: 'Before' },
  after: { hu: 'Utána', en: 'After' },
  zoom: { hu: 'Nagyítás', en: 'Enlarge' },
  close: { hu: 'Bezárás', en: 'Close' },
  menu: { hu: 'Menü', en: 'Menu' },
  services: { hu: 'Szolgáltatások', en: 'Services' },
};

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
    src: imgPath(id, m.fallback, 'jpg'), width: m.width, height: m.height, alt: t(alt) ?? '',
    loading: eager ? 'eager' : 'lazy', fetchpriority: eager ? 'high' : undefined, decoding: eager ? undefined : 'async', class: cls, style: st,
  })}></picture>`;
}

export const navHref = (n) => href(n.key) + (n.hash ? `#${t(anchors[n.hash])}` : '');
const navLink = (n, path) => `<li><a href="${navHref(n)}"${path === navHref(n) ? ' aria-current="page"' : ''}>${esc(t(n.label))}</a></li>`;

// Nyelvváltó: a másik nyelv megfelelő oldalára mutat. alternates: { hu: '/…', en: '/en/…' }
export function LangSwitch(alternates, cls = 'lang-switch') {
  const other = LANGS.find((l) => l !== lang);
  if (!alternates?.[other]) return '';
  const name = { hu: 'Magyar', en: 'English' }[other];
  return `<a class="${cls}" href="${alternates[other]}" hreflang="${other}" lang="${other}"><span aria-hidden="true">${other.toUpperCase()}</span><span class="visually-hidden">${name}</span></a>`;
}

export function Header({ path, overlay = false, alternates }) {
  return `<header class="header${overlay ? ' header--overlay' : ''}">
  <div class="header__inner">
    <a class="brand" href="${href('home')}" aria-label="${esc(site.name)} – ${t({ hu: 'kezdőlap', en: 'home' })}">${esc(site.name)}</a>
    <nav class="nav" aria-label="${t({ hu: 'Fő navigáció', en: 'Main navigation' })}"><ul>${site.nav.map((n) => navLink(n, path)).join('')}</ul></nav>
    <div class="header__end">
      ${LangSwitch(alternates)}
      <a class="btn btn--solid header__cta" href="${href(site.headerCta.key)}">${esc(t(site.headerCta.label))}</a>
      <button class="menu-btn" id="menu-open" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="mnav"><span class="menu-btn__bars" aria-hidden="true"><span></span><span></span><span></span></span>${t(L.menu)}</button>
    </div>
  </div>
</header>
${MobileNavigation({ path, alternates })}`;
}

export function MobileNavigation({ path, alternates }) {
  const home = href('home');
  return `<dialog class="mnav" id="mnav" aria-label="${t(L.menu)}">
  <div class="mnav__inner">
    <div class="mnav__top"><a class="brand" href="${home}">${esc(site.name)}</a><button class="mnav__close" type="button">${t(L.close)}<span class="visually-hidden"> – ${t(L.menu).toLowerCase()}</span></button></div>
    <nav aria-label="${t({ hu: 'Mobil navigáció', en: 'Mobile navigation' })}"><ul>
      <li><a href="${home}"${path === home ? ' aria-current="page"' : ''}>${t({ hu: 'Kezdőlap', en: 'Home' })}</a></li>
      ${site.nav.map((n) => navLink(n, path)).join('')}
    </ul></nav>
    <div class="mnav__foot">
      <a class="btn btn--solid" href="${href(site.headerCta.key)}">${esc(t(site.headerCta.label))}</a>
      <div class="mnav__contact"><a href="${site.phoneHref}">${esc(site.phone)}</a><a href="mailto:${site.email}">${esc(site.email)}</a>${LangSwitch(alternates, 'lang-switch lang-switch--mnav')}</div>
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
  return `<nav class="breadcrumb" aria-label="${t({ hu: 'Morzsamenü', en: 'Breadcrumb' })}"><ol>${crumbs.map((c, i) => `<li>${i < crumbs.length - 1 ? `<a href="${c.href}">${esc(c.label)}</a>` : `<span aria-current="page">${esc(c.label)}</span>`}</li>`).join('')}</ol></nav>`;
}

export function SectionHeading({ eyebrow, title, intro, id, split = false, level = 2 }) {
  return `<div class="sh${split ? ' sh--split' : ''}">
  <div>${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}<h${level}${id ? ` id="${id}"` : ''}>${esc(title)}</h${level}></div>
  ${intro ? `<p class="sh__intro">${esc(intro)}</p>` : ''}
</div>`;
}

export function Tags(tags, cls = 'tags') {
  return `<ul class="${cls}" aria-label="${t(L.services)}">${tags.map((x) => `<li>${esc(t(x))}</li>`).join('')}</ul>`;
}

export function ServiceBlock(s, i) {
  return `<li class="service"><a class="service__link" href="${href('services')}#${s.slug}">
  ${s.image ? `<div class="media">${Picture(s.image, { alt: '', sizes: '(min-width: 760px) 45vw, 100vw' })}</div>` : ''}
  <span class="service__num">${String(i + 1).padStart(2, '0')}</span>
  <h3>${esc(t(s.short))}</h3>
  <p>${esc(t(s.teaser))}</p>
</a></li>`;
}

export function ProjectCard(p, { headingLevel = 3 } = {}) {
  const ba = p.beforeAfter[0];
  const url = href(`project:${p.slug}`);
  const h = `h${headingLevel}`;
  const title = t(p.title);
  return `<li><article class="pcard" aria-labelledby="pc-${p.slug}">
  <a class="pcard__media" href="${url}" tabindex="-1" aria-hidden="true">${Picture(p.hero, { alt: '', sizes: '(min-width: 900px) 58vw, 100vw' })}</a>
  <div>
    <p class="pcard__meta">${esc(t(p.shortLocation))}</p>
    <${h} id="pc-${p.slug}"><a href="${url}">${esc(title)}${p.subtitle ? `<span class="pcard__sub">${esc(p.subtitle)}</span>` : ''}</a></${h}>
    <p>${esc(t(p.cardText))}</p>
    ${Tags(p.tags)}
    ${ba ? `<div class="pcard__ba" role="group" aria-label="${t({ hu: 'Előtte–utána előnézet', en: 'Before and after preview' })}: ${esc(t(ba.room))}">
      <figure>${Picture(ba.before, { alt: ba.altBefore, sizes: '11rem', objectPosition: ba.objectPositionBefore })}<figcaption>${t(L.before)}</figcaption></figure>
      <figure>${Picture(ba.after, { alt: ba.altAfter, sizes: '11rem', objectPosition: ba.objectPositionAfter })}<figcaption>${t(L.after)}</figcaption></figure>
    </div>` : ''}
    <a class="link-arrow" href="${url}">${t({ hu: 'Projekt megtekintése', en: 'View project' })}<span class="visually-hidden">: ${esc(title)}</span></a>
  </div>
</article></li>`;
}

export function ProjectFacts(facts) {
  const known = facts.filter((f) => f.value); // ismeretlen (null/TODO) adat nem jelenik meg
  return `<dl class="facts">${known.map((f) => `<div><dt>${esc(t(f.label))}</dt><dd>${esc(t(f.value))}</dd></div>`).join('')}</dl>`;
}

export function BeforeAfterSlider(pair) {
  const aspect = pair.aspect ? ` style="--ba-aspect:${esc(pair.aspect)}"` : '';
  const sizes = pair.displayMode === 'slider' ? '(min-width: 1280px) 1180px, 100vw' : '(min-width: 640px) 50vw, 100vw';
  const [aw, ah] = (pair.aspect || '4 / 3').split('/').map(Number); // pl. '3 / 4'
  const portrait = aw < ah;
  const room = t(pair.room);
  return `<figure class="ba${portrait ? ' ba--portrait' : ''}" data-mode="${pair.displayMode}" data-room="${esc(room)}"${aspect}>
  <div class="ba__head"><h3 class="ba__room">${esc(room)}</h3>${pair.note ? `<p class="ba__note">${esc(t(pair.note))}</p>` : ''}</div>
  <div class="ba__pair">
    <div class="ba__item ba__item--before">${Picture(pair.before, { alt: pair.altBefore, sizes, objectPosition: pair.objectPositionBefore })}<span class="ba__label">${t(L.before)}</span></div>
    <div class="ba__item ba__item--after">${Picture(pair.after, { alt: pair.altAfter, sizes, objectPosition: pair.objectPositionAfter })}<span class="ba__label">${t(L.after)}</span></div>
  </div>
  ${pair.displayMode === 'slider' ? `<p class="ba__hint" hidden>${t({ hu: 'Húzza a csúszkát, vagy fókuszálva használja a nyílbillentyűket.', en: 'Drag the slider, or focus it and use the arrow keys.' })}</p>` : ''}
</figure>`;
}

const INITIAL_GALLERY = 10; // 1 széles + 3×3 rács
export function ProjectGallery(items, { id }) {
  const rest = items.length - INITIAL_GALLERY;
  return `<ul class="gallery" data-gallery id="${id}">${items.map((g, i) => `<li${i >= INITIAL_GALLERY ? ' class="is-hidden"' : ''}><button type="button" data-full="${largest(g.image)}" data-alt="${esc(t(g.alt))}" aria-label="${t(L.zoom)}: ${esc(t(g.alt))}">${Picture(g.image, { alt: g.alt, sizes: i === 0 ? '(min-width: 1280px) 1180px, 100vw' : '(min-width: 800px) 33vw, 50vw' })}</button></li>`).join('')}</ul>
${rest > 0 ? `<p class="gallery-more"><button class="btn btn--line" type="button">${t({ hu: `További ${rest} kép`, en: `${rest} more photos` })}</button></p>
<noscript><style>.gallery li.is-hidden{display:block}.gallery-more{display:none}</style></noscript>` : ''}`;
}

export function AccessibleLightbox() {
  return `<dialog class="lightbox" id="lightbox" aria-label="${t({ hu: 'Képnézegető', en: 'Image viewer' })}">
  <div class="lightbox__inner">
    <div class="lightbox__bar"><span class="lightbox__count" aria-live="polite"></span><button class="lightbox__close" type="button">${t(L.close)} <span aria-hidden="true">✕</span></button></div>
    <div class="lightbox__stage">
      <img alt="">
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="${t({ hu: 'Előző kép', en: 'Previous image' })}">‹</button>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="${t({ hu: 'Következő kép', en: 'Next image' })}">›</button>
    </div>
    <p class="lightbox__caption"></p>
  </div>
</dialog>`;
}

export function ProcessTimeline(steps) {
  return `<ol class="timeline">${steps.map((s) => `<li><div><h3>${esc(t(s.title))}</h3><p>${esc(t(s.text))}</p></div></li>`).join('')}</ol>`;
}

export function ContactCTA({ title, text, label = t({ hu: 'Beszéljünk a projektről', en: 'Let’s talk about your project' }), to = href('contact') }) {
  return `<section class="section cta" aria-labelledby="cta-title"><div class="wrap">
  <h2 id="cta-title">${esc(title)}</h2>
  <p>${esc(text)}</p>
  <div class="btn-row"><a class="btn btn--light" href="${to}">${esc(label)}</a><a class="btn btn--ghost-light" href="${site.phoneHref}">${esc(site.phone)}</a></div>
</div></section>`;
}

export function ContactForm({ services: opts }) {
  const opt = t({ hu: 'opcionális', en: 'optional' });
  const field = (name, label, { type = 'text', required = false, auto, optional = false } = {}) => `<div class="field"><label for="f-${name}">${esc(t(label))}${optional ? ` <span class="opt">(${opt})</span>` : ''}</label><input id="f-${name}" name="${name}" type="${type}"${required ? ' required' : ''}${auto ? ` autocomplete="${auto}"` : ''}></div>`;
  const wa = t({ hu: 'WhatsAppon', en: 'on WhatsApp' });
  return `<form class="form" id="contact-form" novalidate${site.formEndpoint ? ` data-endpoint="${esc(site.formEndpoint)}"` : ''} data-mailto="${esc(site.email)}" aria-describedby="form-note">
  <div class="form__row">${field('nev', { hu: 'Név', en: 'Name' }, { required: true, auto: 'name' })}${field('email', { hu: 'E-mail', en: 'Email' }, { type: 'email', required: true, auto: 'email' })}</div>
  <div class="form__row">${field('telefon', { hu: 'Telefonszám', en: 'Phone number' }, { type: 'tel', auto: 'tel', optional: true })}${field('helyszin', { hu: 'Ingatlan helye vagy kerülete', en: 'Property location or district' }, { required: true })}</div>
  <div class="form__row">
    <div class="field"><label for="f-szolgaltatas">${t({ hu: 'Érdekelt szolgáltatás', en: 'Service you are interested in' })}</label><select id="f-szolgaltatas" name="szolgaltatas" required><option value="">${t({ hu: 'Válasszon…', en: 'Please choose…' })}</option>${t(opts).map((o) => `<option>${esc(o)}</option>`).join('')}</select></div>
    ${field('kezdes', { hu: 'Tervezett kezdés', en: 'Planned start' }, { optional: true })}
  </div>
  <div class="form__row">${field('keret', { hu: 'Becsült keret', en: 'Estimated budget' }, { optional: true })}<div></div></div>
  <div class="field"><label for="f-leiras">${t({ hu: 'Rövid leírás', en: 'Short description' })}</label><textarea id="f-leiras" name="leiras" required></textarea></div>
  <div class="field field--check"><input id="f-consent" name="hozzajarulas" type="checkbox" required><label for="f-consent">${t({ hu: 'Hozzájárulok, hogy az Urban Flip Studio a megadott adataimat a megkeresésem megválaszolása céljából kezelje.', en: 'I agree that Urban Flip Studio may process the data I provide in order to respond to my enquiry.' })}</label></div>
  <!-- TODO: adatkezelési tájékoztató linkje ide, jogi ellenőrzés után (site.privacyUrl). -->
  <div><button class="btn btn--solid" type="submit">${t({ hu: 'Üzenet küldése', en: 'Send message' })}</button></div>
  <p class="form__status" role="status" aria-live="polite"></p>
  <p class="form__alt" id="form-note">${site.formEndpoint ? '' : t({ hu: 'A küldés gomb a levelezőprogramjában nyit egy előre kitöltött üzenetet. ', en: 'The send button opens a pre-filled message in your email app. ' })}${t({ hu: 'Ha egyszerűbb: hívjon a', en: 'If it’s easier, call' })} <a href="${site.phoneHref}">${esc(site.phone)}</a>${t({ hu: ' számon, írjon a', en: ', email' })} <a href="mailto:${site.email}">${esc(site.email)}</a>${t({ hu: ' címre, vagy üzenjen', en: ', or message us' })} <a href="${site.whatsapp}" rel="noopener" target="_blank">${wa}</a>.</p>
</form>`;
}

export function Footer() {
  const year = new Date().getFullYear();
  return `<footer class="footer"><div class="wrap">
  <div class="footer__grid">
    <div><p class="footer__brand">${esc(site.name)}</p><p>${esc(t(site.tagline))}</p></div>
    <nav aria-label="${t({ hu: 'Lábléc navigáció', en: 'Footer navigation' })}"><h2>${t({ hu: 'Oldalak', en: 'Pages' })}</h2><ul>${site.nav.filter((n) => !n.hash).map((n) => `<li><a href="${navHref(n)}">${esc(t(n.label))}</a></li>`).join('')}</ul></nav>
    <div><h2>${t({ hu: 'Kapcsolat', en: 'Contact' })}</h2><ul><li><a href="${site.phoneHref}">${esc(site.phone)}</a></li><li><a href="mailto:${site.email}">${esc(site.email)}</a></li><li><a href="${site.whatsapp}" rel="noopener" target="_blank">WhatsApp</a></li></ul></div>
  </div>
  <div class="footer__bottom"><span>© ${year} ${esc(site.name)}</span><span>Budapest</span></div>
</div></footer>`;
}

export const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
