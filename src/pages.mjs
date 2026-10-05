// Oldalsablonok. Minden oldal: { path, title, description, ogImage, jsonLd, overlayHeader, body }.
import { site, process, why } from './data/site.mjs';
import { services, featuredServiceSlugs, formServices } from './data/services.mjs';
import { projects } from './data/projects.mjs';
import {
  esc, Picture, Hero, PageHead, SectionHeading, ServiceBlock, ProjectCard, ProjectFacts, BeforeAfterSlider,
  ProjectGallery, AccessibleLightbox, ProcessTimeline, ContactCTA, ContactForm, serviceBySlug, imgUrl, Breadcrumb,
} from './components.mjs';

const abs = (p) => site.url + p;

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#business`,
  name: site.name,
  url: `${site.url}/`,
  telephone: site.phone.replace(/\s/g, ''),
  email: site.email,
  image: abs(`/images/projects/${site.defaultOgImage}-og.jpg`),
  description: 'Teljes körű lakásfelújítás, generálkivitelezés, enteriőrtervezés, lakberendezés és home staging Budapesten.',
  areaServed: { '@type': 'City', name: 'Budapest' },
};

const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(c.href) })),
});

const closingCta = () => ContactCTA({
  title: 'Van egy lakás, amiben több lehetőség van?',
  text: 'Írjon néhány mondatot a projektről. Az első egyeztetésen átbeszéljük az ingatlan állapotát, az elképzeléseket és a lehetséges következő lépéseket.',
});

/* ===================== KEZDŐLAP ===================== */
function home() {
  const featured = featuredServiceSlugs.map((s) => serviceBySlug[s]);
  return {
    path: '/',
    title: 'Urban Flip Studio — Teljes körű lakásfelújítás és enteriőrtervezés Budapesten',
    description: 'Teljes körű lakásfelújítás tervezéssel Budapesten: generálkivitelezés, enteriőrtervezés, lakberendezés és eladás előtti home staging egy kézben. Nézze meg a munkáinkat.',
    ogImage: 'vamhaz-korut/gallery/nappali-galeria',
    overlayHeader: true,
    jsonLd: [orgLd],
    body: `<main id="tartalom" tabindex="-1">
${Hero({
  image: 'vamhaz-korut/gallery/nappali-galeria',
  alt: 'Világos, tágas nappali a Vámház körúti projektben: galériaszint, gömblámpák, magas ablakok',
  eyebrow: 'Generálkivitelezés · Enteriőrtervezés · Home staging',
  title: 'Lakásból otthon. Tervtől az utolsó részletig.',
  lead: 'Teljes körű lakásfelújítást és enteriőrtervezést vállalunk Budapesten – a műszaki tervezéstől és kivitelezéstől a berendezésen át az átadásig.',
  ctas: [{ label: 'Kérek konzultációt', href: '/kapcsolat/' }, { label: 'Megnézem a munkáinkat', href: '/projektek/' }],
})}
<section class="section" aria-labelledby="intro-title"><div class="wrap split">
  <div>
    <span class="eyebrow">Urban Flip Studio</span>
    <h2 id="intro-title">Egy kézben a teljes átalakulás</h2>
    <p class="lead">Az Urban Flip Studio a felújítás műszaki és esztétikai oldalát fogja össze. Megtervezzük a tereket, megszervezzük és vezetjük a kivitelezést, majd a berendezést és az utolsó részleteket is a helyükre tesszük. Így az ötlet, a költségek és a megvalósítás nem külön utakon haladnak.</p>
  </div>
  <figure class="media media--45">${Picture('vamhaz-korut/gallery/konyha', { alt: 'Egyedi fehér konyhabútor márvány hatású hátfallal a Vámház körúti lakásban', sizes: '(min-width: 900px) 45vw, 100vw' })}</figure>
</div></section>

<section class="section section--alt" aria-labelledby="szolg-title"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Szolgáltatások', title: 'Tervezéstől a berendezésig', id: 'szolg-title', split: true, intro: 'Vállalunk teljes lakásfelújítást generálkivitelezéssel, önálló tervezést, lakberendezést, és kisebb volumenű, eladás vagy kiadás előtti home stagingot is.' })}
  <ul class="services">${featured.map(ServiceBlock).join('')}</ul>
  <p class="mt-xl"><a class="link-arrow" href="/szolgaltatasok/">Minden szolgáltatás</a></p>
</div></section>

<section class="section" aria-labelledby="proj-title"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Projektek', title: 'Válogatott munkáink', id: 'proj-title' })}
  <ul class="projects">${projects.map((p) => ProjectCard(p)).join('')}</ul>
</div></section>

<section class="section section--alt" id="folyamat" aria-labelledby="folyamat-title"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Folyamat', title: 'Öt lépésben az átadásig', id: 'folyamat-title', split: true, intro: process.intro })}
  ${ProcessTimeline(process.steps)}
  <p class="copy mt-lg">Az árat és az ütemezést mindig az adott lakás állapota és a közösen meghozott döntések alapján határozzuk meg.</p>
</div></section>

<section class="section" aria-labelledby="miert-title"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Miért velünk?', title: 'Ami a munkánkat összetartja', id: 'miert-title' })}
  <ul class="why">${why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
</div></section>

<section class="section section--alt" aria-labelledby="rolunk-title"><div class="wrap split split--flip">
  <div>
    <span class="eyebrow">Rólunk</span>
    <h2 id="rolunk-title">A jó enteriőr nemcsak szép. Jól is működik.</h2>
    <p class="copy">Az Urban Flip Studio mögött egy tervezői és egy megvalósítói szemlélet találkozik. A terek hangulatát, használhatóságát és műszaki részleteit egységként kezeljük – mert a jó döntések nem a dekorációnál, hanem az alaprajznál, a fényeknél és a kivitelezés minőségénél kezdődnek.</p>
    <p class="mt-md"><a class="link-arrow" href="/rolunk/">Ismerjen meg minket</a></p>
  </div>
  <figure class="media media--43">${Picture('vamhaz-korut/gallery/galeria-haloszoba', { alt: 'A Vámház körúti galériaszinti hálószoba üvegfalon át, gömblámpákkal', sizes: '(min-width: 900px) 45vw, 100vw' })}</figure>
</div></section>

${closingCta()}
</main>`,
  };
}

/* ===================== SZOLGÁLTATÁSOK ===================== */
function servicesPage() {
  const crumbs = [{ label: 'Kezdőlap', href: '/' }, { label: 'Szolgáltatások', href: '/szolgaltatasok/' }];
  return {
    path: '/szolgaltatasok/',
    title: 'Szolgáltatások — lakásfelújítás, tervezés, lakberendezés, home staging | Urban Flip Studio',
    description: 'Teljes körű lakásfelújítás és generálkivitelezés, műszaki és térszervezési tervezés, enteriőrtervezés és lakberendezés, valamint eladás előtti lakásfelkészítés (home staging) Budapesten.',
    ogImage: 'gozmozdony-utca/gallery/nappali',
    jsonLd: [orgLd, breadcrumbLd(crumbs), ...services.map((s) => ({
      '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.text,
      provider: { '@id': `${site.url}/#business` }, areaServed: { '@type': 'City', name: 'Budapest' },
      url: abs(`/szolgaltatasok/#${s.slug}`),
    }))],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({ crumbs, eyebrow: 'Szolgáltatások', title: 'Tervezés, kivitelezés, berendezés — együtt vagy külön', intro: 'Egy teljes lakásfelújítást a tervtől az átadásig összefogunk, de a tervezés, a lakberendezés vagy egy eladás előtti home staging önállóan is kérhető.' })}
<section class="section section--flush" style="padding-top:0"><div class="wrap">
  ${services.map((s) => `<article class="sblock" id="${s.slug}" aria-labelledby="h-${s.slug}">
    <div>
      <h2 id="h-${s.slug}">${esc(s.title)}</h2>
      <p class="copy">${esc(s.text)}</p>
      ${s.note ? `<p class="sblock__note">${esc(s.note)}</p>` : ''}
    </div>
    <div class="sblock__aside">
      ${s.image ? `<figure class="media">${Picture(s.image, { alt: '', sizes: '(min-width: 900px) 55vw, 100vw' })}</figure>` : ''}
      ${s.list ? `<h3 class="visually-hidden">${esc(s.listTitle)}</h3><ul class="sblock__list" aria-label="${esc(s.listTitle)}">${s.list.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
    </div>
  </article>`).join('')}
</div></section>
<section class="section section--alt" aria-labelledby="folyamat-title"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Folyamat', title: 'Hogyan dolgozunk', id: 'folyamat-title', split: true, intro: process.intro })}
  ${ProcessTimeline(process.steps)}
</div></section>
${closingCta()}
</main>`,
  };
}

/* ===================== PROJEKTEK ===================== */
function projectsIndex() {
  const crumbs = [{ label: 'Kezdőlap', href: '/' }, { label: 'Projektek', href: '/projektek/' }];
  return {
    path: '/projektek/',
    title: 'Projektek és referenciák — lakásfelújítás előtte–utána | Urban Flip Studio',
    description: 'Budapesti lakásfelújítási és enteriőrtervezési referenciáink előtte–utána képekkel: Vámház körút (Project Olive), Gőzmozdony utca, Balázs Béla utca.',
    ogImage: 'balazs-bela-utca/gallery/nappali',
    jsonLd: [breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({ crumbs, eyebrow: 'Projektek', title: 'Lakások, amelyeket újragondoltunk', intro: 'Minden projektnél megmutatjuk a kiindulási állapotot is — mert a változás így érthető igazán.' })}
<section class="section" style="padding-top:0"><div class="wrap">
  <ul class="projects">${projects.map((p) => ProjectCard(p, { headingLevel: 2 })).join('')}</ul>
</div></section>
${closingCta()}
</main>`,
  };
}

function projectPage(p, i) {
  const next = projects[(i + 1) % projects.length];
  const crumbs = [{ label: 'Kezdőlap', href: '/' }, { label: 'Projektek', href: '/projektek/' }, { label: p.title, href: `/projektek/${p.slug}/` }];
  const titleFull = p.subtitle ? `${p.title} – ${p.subtitle}` : p.title;
  return {
    path: `/projektek/${p.slug}/`,
    title: `${titleFull} — lakásfelújítás és enteriőr | Urban Flip Studio`,
    description: `${p.summary.split('. ')[0].replace(/\.$/, '')}. Előtte–utána képek, megoldások és galéria.`,
    ogImage: p.hero,
    jsonLd: [breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
<header class="page-head"><div class="wrap">
  ${Breadcrumb(crumbs)}
  <span class="eyebrow">${esc(p.location)}</span>
  <h1>${esc(p.title)}${p.subtitle ? ` <span style="font-style:italic;color:var(--olive)">– ${esc(p.subtitle)}</span>` : ''}</h1>
  <p class="lead">${esc(p.summary)}</p>
  <ul class="tags mt-md" aria-label="Szolgáltatások">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
</div></header>
<div class="phero">${Picture(p.hero, { alt: p.heroAlt, eager: true, sizes: '100vw' })}</div>

<section class="section" aria-labelledby="adatok"><div class="wrap">
  <h2 id="adatok" class="visually-hidden">Projektadatok</h2>
  ${ProjectFacts(p.facts)}
  <div class="split mt-xl" style="align-items:start">
    <div><span class="eyebrow">Kiindulási állapot</span><div class="copy">${p.starting.map((t) => `<p>${esc(t)}</p>`).join('')}</div></div>
    <div><span class="eyebrow">A cél</span><p class="lead" style="font-size:1.2rem">${esc(p.goal)}</p></div>
  </div>
</div></section>

<section class="section section--alt" aria-labelledby="megoldasok"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Megoldások', title: 'Mit és hogyan alakítottunk át', id: 'megoldasok' })}
  <ul class="solutions">${p.solutions.map((s) => `<li><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ul>
</div></section>

<section class="section" aria-labelledby="elotte-utana"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Előtte – utána', title: 'Ugyanaz a tér, felújítás előtt és után', id: 'elotte-utana', intro: 'A képpárok ugyanazt a helyiséget mutatják. Ahol a nézőpont azonos, csúszkával is összehasonlíthatók; máshol egymás mellett láthatók.' })}
  <div class="ba-list">${p.beforeAfter.map(BeforeAfterSlider).join('')}</div>
  ${p.beforeGallery.length ? `<h3 class="mt-xl" style="font-size:var(--fs-h3)">A kiindulási állapotról</h3>
  <ul class="gallery mt-md" data-gallery aria-label="Felújítás előtti képek">${p.beforeGallery.map((b) => `<li><button type="button" data-full="${imgUrl(b.image, 960)}" data-alt="${esc(b.alt)}" aria-label="Nagyítás: ${esc(b.alt)}">${Picture(b.image, { alt: b.alt, sizes: '(min-width: 800px) 33vw, 50vw' })}</button></li>`).join('')}</ul>` : ''}
</div></section>

<section class="section section--alt" aria-labelledby="galeria"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Galéria', title: 'A kész lakás', id: 'galeria' })}
  ${ProjectGallery(p.gallery, { id: `g-${p.slug}` })}
</div></section>

${p.floorplans.length ? `<section class="section" aria-labelledby="alaprajz"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Alaprajz', title: p.floorplans.length > 1 ? 'Alaprajzok' : 'Alaprajz', id: 'alaprajz' })}
  <div class="plans">${p.floorplans.map((f) => `<figure>${Picture(f.image, { alt: f.alt, sizes: '(min-width: 800px) 45vw, 100vw' })}<figcaption>${esc(f.caption)}</figcaption></figure>`).join('')}</div>
</div></section>` : ''}

${p.video || p.press || p.story ? `<section class="section${p.floorplans.length ? ' section--alt' : ''}" aria-labelledby="tortenet"><div class="wrap split" style="align-items:start">
  <div>
    <span class="eyebrow">A projekt története</span>
    <h2 id="tortenet">${esc(p.subtitle || p.title)}</h2>
    ${p.story ? `<p class="copy">${esc(p.story)}</p>` : ''}
    ${p.press ? `<p class="press mt-lg">${esc(p.press)}</p>` : ''}
  </div>
  ${p.video ? `<div class="video-frame"><video controls preload="none" playsinline poster="${imgUrl(p.video.poster)}" aria-label="${esc(p.video.title)}"><source src="${p.video.src}" type="video/mp4"></video></div>` : '<div></div>'}
</div></section>` : ''}

<section class="section" aria-labelledby="kapcs-szolg"><div class="wrap">
  <h2 id="kapcs-szolg" style="font-size:var(--fs-h3);margin-bottom:var(--sp-md)">Kapcsolódó szolgáltatások</h2>
  <ul class="related">${p.serviceSlugs.map((s) => `<li><a href="/szolgaltatasok/#${s}">${esc(serviceBySlug[s].title)}</a></li>`).join('')}</ul>
</div></section>

<section class="section section--alt" aria-labelledby="kovetkezo"><div class="wrap">
  <a class="next-project" href="/projektek/${next.slug}/">
    <div><span class="eyebrow">Következő projekt</span><h2 id="kovetkezo">${esc(next.title)}</h2><p class="copy">${esc(next.cardText)}</p></div>
    <div class="media">${Picture(next.hero, { alt: '', sizes: '(min-width: 800px) 45vw, 100vw' })}</div>
  </a>
</div></section>

${closingCta()}
${AccessibleLightbox()}
</main>`,
  };
}

/* ===================== RÓLUNK ===================== */
function about() {
  const crumbs = [{ label: 'Kezdőlap', href: '/' }, { label: 'Rólunk', href: '/rolunk/' }];
  return {
    path: '/rolunk/',
    title: 'Rólunk — tervezői és kivitelezői szemlélet egy csapatban | Urban Flip Studio',
    description: 'Az Urban Flip Studio budapesti lakásfelújítással és enteriőrtervezéssel foglalkozik: a terek hangulatát, használhatóságát és műszaki részleteit egységként kezeljük.',
    ogImage: 'vamhaz-korut/gallery/nappali-konyha',
    jsonLd: [orgLd, breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({ crumbs, eyebrow: 'Rólunk', title: 'A jó enteriőr nemcsak szép. Jól is működik.', intro: 'Az Urban Flip Studio mögött egy tervezői és egy megvalósítói szemlélet találkozik.' })}
<section class="section" style="padding-top:0"><div class="wrap split" style="align-items:start">
  <div class="copy">
    <p>A terek hangulatát, használhatóságát és műszaki részleteit egységként kezeljük – mert a jó döntések nem a dekorációnál, hanem az alaprajznál, a fényeknél és a kivitelezés minőségénél kezdődnek.</p>
    <!-- TODO: a házaspár/társalapító történet nyilvános kommunikációját a tulajdonosok erősítsék meg. -->
    <p>Ketten indítottuk a stúdiót: egy tervező és egy megvalósító, a magánéletben házaspár. Az egyikünk a tereket, a fényeket és az anyagokat gondolja végig, a másikunk a kivitelezést szervezi és vezeti. Így a tervezőasztalnál született döntések a helyszínen sem vesznek el.</p>
    <p>Az eddigi legnagyobb közös munkánk a Vámház körúti lakás, a <a href="/projektek/vamhaz-korut/">Project Olive</a> volt. Hónapokig kerestük a burkolatokat, a lámpákat, a kilincseket és a színeket — ugyanezzel a figyelemmel dolgozunk az ügyfeleink lakásain is.</p>
  </div>
  <figure class="media media--45" style="max-width:30rem">${Picture('site/rolunk', { alt: 'Az Urban Flip Studio két alapítója', sizes: '(min-width: 900px) 30rem, 100vw' })}</figure>
</div></section>
<section class="section section--alt" aria-labelledby="miert-title"><div class="wrap">
  ${SectionHeading({ eyebrow: 'Ahogy dolgozunk', title: 'Ami a munkánkat összetartja', id: 'miert-title' })}
  <ul class="why">${why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
</div></section>
${closingCta()}
</main>`,
  };
}

/* ===================== KAPCSOLAT ===================== */
function contact() {
  const crumbs = [{ label: 'Kezdőlap', href: '/' }, { label: 'Kapcsolat', href: '/kapcsolat/' }];
  return {
    path: '/kapcsolat/',
    title: 'Kapcsolat — konzultáció lakásfelújításhoz | Urban Flip Studio',
    description: 'Meséljen a lakásról: írjon néhány mondatot a felújításról, a tervezésről, a lakberendezésről vagy az eladás előtti home stagingről, és egyeztetünk a következő lépésekről.',
    ogImage: 'balazs-bela-utca/after/konyha',
    jsonLd: [orgLd, breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({ crumbs, eyebrow: 'Kapcsolat', title: 'Meséljen a lakásról', intro: 'Írjon néhány mondatot a projektről. Az első egyeztetésen átbeszéljük az ingatlan állapotát, az elképzeléseket és a lehetséges következő lépéseket.' })}
<section class="section" style="padding-top:0"><div class="wrap contact-grid">
  <div>${ContactForm({ services: formServices })}</div>
  <aside aria-labelledby="elerhetoseg">
    <h2 id="elerhetoseg" class="eyebrow">Közvetlen elérhetőség</h2>
    <ul class="contact-list">
      <li><span>Telefon</span><a href="${site.phoneHref}">${esc(site.phone)}</a></li>
      <li><span>E-mail</span><a href="mailto:${site.email}">${esc(site.email)}</a></li>
      <li><span>WhatsApp</span><a href="${site.whatsapp}" target="_blank" rel="noopener">Üzenet WhatsAppon<span class="visually-hidden"> (új lapon nyílik)</span></a></li>
    </ul>
    <p class="copy mt-md" style="font-size:var(--fs-small)">Budapesti lakásokkal dolgozunk.</p>
  </aside>
</div></section>
</main>`,
  };
}

/* ===================== 404 ===================== */
function notFound() {
  return {
    path: '/404.html',
    noindex: true,
    title: 'Az oldal nem található | Urban Flip Studio',
    description: 'A keresett oldal nem található.',
    ogImage: site.defaultOgImage,
    jsonLd: [],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({ eyebrow: '404', title: 'Ezt az oldalt nem találjuk', intro: 'Lehet, hogy a cím megváltozott. Innen biztosan továbbjut:' })}
<section class="section" style="padding-top:0"><div class="wrap"><div class="btn-row"><a class="btn btn--solid" href="/">Kezdőlap</a><a class="btn btn--line" href="/projektek/">Projektek</a><a class="btn btn--line" href="/kapcsolat/">Kapcsolat</a></div></div></section>
</main>`,
  };
}

export function allPages() {
  return [home(), servicesPage(), projectsIndex(), ...projects.map(projectPage), about(), contact(), notFound()];
}
