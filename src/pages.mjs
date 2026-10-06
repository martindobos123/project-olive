// Oldalsablonok. Minden oldal: { key, path, title, description, ogImage, jsonLd, overlayHeader, body }.
// A build nyelvenként egyszer hívja az allPages()-t (src/i18n.mjs → setLang); a key-ből jön a
// másik nyelvű megfelelő (hreflang + nyelvváltó).
import { site, process, why } from './data/site.mjs';
import { services, featuredServiceSlugs, formServices } from './data/services.mjs';
import { projects } from './data/projects.mjs';
import { lang, t, href, anchors } from './i18n.mjs';
import {
  esc, Picture, Hero, PageHead, SectionHeading, ServiceBlock, ProjectCard, ProjectFacts, BeforeAfterSlider,
  ProjectGallery, AccessibleLightbox, ProcessTimeline, ContactCTA, ContactForm, serviceBySlug, imgUrl, Breadcrumb, Tags,
} from './components.mjs';

const abs = (p) => site.url + p;
const BRAND = ` | ${site.name}`;

const orgLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#business`,
  name: site.name,
  url: abs(href('home')),
  telephone: site.phone.replace(/\s/g, ''),
  email: site.email,
  image: abs(`/images/projects/${site.defaultOgImage}-og.jpg`),
  description: t({
    hu: 'Teljes körű lakásfelújítás, generálkivitelezés, enteriőrtervezés, lakberendezés és home staging Budapesten.',
    en: 'Full-scope apartment renovation, general contracting, interior design, furnishing and home staging in Budapest.',
  }),
  areaServed: { '@type': 'City', name: 'Budapest' },
  inLanguage: lang,
});

const breadcrumbLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: abs(c.href) })),
});

const crumb = (key, label) => ({ href: href(key), label: t(label) });
const HOME = { hu: 'Kezdőlap', en: 'Home' };

const closingCta = () => ContactCTA({
  title: t({ hu: 'Van egy lakás, amiben több lehetőség van?', en: 'Have an apartment with more potential?' }),
  text: t({
    hu: 'Írjon néhány mondatot a projektről. Az első egyeztetésen átbeszéljük az ingatlan állapotát, az elképzeléseket és a lehetséges következő lépéseket.',
    en: 'Write a few lines about your project. At our first meeting we’ll go through the condition of the property, your ideas and the possible next steps.',
  }),
});

const whyList = () => `<ul class="why">${why.map((w) => `<li>${esc(t(w))}</li>`).join('')}</ul>`;

/* ===================== KEZDŐLAP ===================== */
function home() {
  const featured = featuredServiceSlugs.map((s) => serviceBySlug[s]);
  const processId = t(anchors.process);
  return {
    key: 'home',
    title: t({
      hu: 'Urban Flip Studio — Teljes körű lakásfelújítás és enteriőrtervezés Budapesten',
      en: 'Urban Flip Studio — Full-scope apartment renovation and interior design in Budapest',
    }),
    description: t({
      hu: 'Teljes körű lakásfelújítás tervezéssel Budapesten: generálkivitelezés, enteriőrtervezés, lakberendezés és eladás előtti home staging egy kézben. Nézze meg a munkáinkat.',
      en: 'Full-scope apartment renovation with design in Budapest: general contracting, interior design, furnishing and pre-sale home staging in one pair of hands. See our work.',
    }),
    ogImage: 'vamhaz-korut/gallery/nappali-galeria',
    overlayHeader: true,
    jsonLd: [orgLd()],
    body: `<main id="tartalom" tabindex="-1">
${Hero({
  image: 'vamhaz-korut/gallery/nappali-galeria',
  alt: { hu: 'Világos, tágas nappali a Vámház körúti projektben: galériaszint, gömblámpák, magas ablakok', en: 'Bright, spacious living room in the Vámház körút project: gallery level, globe pendants, tall windows' },
  eyebrow: t({ hu: 'Generálkivitelezés · Enteriőrtervezés · Home staging', en: 'General contracting · Interior design · Home staging' }),
  title: t({ hu: 'Lakásból otthon. Tervtől az utolsó részletig.', en: 'From apartment to home. From the plan to the last detail.' }),
  lead: t({
    hu: 'Teljes körű lakásfelújítást és enteriőrtervezést vállalunk Budapesten – a műszaki tervezéstől és kivitelezéstől a berendezésen át az átadásig.',
    en: 'We take on full-scope apartment renovation and interior design in Budapest – from technical planning and construction through furnishing to handover.',
  }),
  ctas: [
    { label: t({ hu: 'Kérek konzultációt', en: 'Book a consultation' }), href: href('contact') },
    { label: t({ hu: 'Megnézem a munkáinkat', en: 'See our work' }), href: href('projects') },
  ],
})}
<section class="section" aria-labelledby="intro-title"><div class="wrap split">
  <div>
    <span class="eyebrow">Urban Flip Studio</span>
    <h2 id="intro-title">${t({ hu: 'Egy kézben a teljes átalakulás', en: 'The whole transformation in one pair of hands' })}</h2>
    <p class="lead">${t({
      hu: 'Az Urban Flip Studio a felújítás műszaki és esztétikai oldalát fogja össze. Megtervezzük a tereket, megszervezzük és vezetjük a kivitelezést, majd a berendezést és az utolsó részleteket is a helyükre tesszük. Így az ötlet, a költségek és a megvalósítás nem külön utakon haladnak.',
      en: 'Urban Flip Studio brings together the technical and the aesthetic side of a renovation. We design the spaces, organise and run the build, then put the furnishings and the last details in place. That way the idea, the costs and the execution never drift apart.',
    })}</p>
  </div>
  <figure class="media media--45">${Picture('vamhaz-korut/gallery/konyha', { alt: { hu: 'Egyedi fehér konyhabútor márvány hatású hátfallal a Vámház körúti lakásban', en: 'Custom white kitchen with a marble-effect splashback in the Vámház körút apartment' }, sizes: '(min-width: 900px) 45vw, 100vw' })}</figure>
</div></section>

<section class="section section--alt" aria-labelledby="szolg-title"><div class="wrap">
  ${SectionHeading({
    eyebrow: t({ hu: 'Szolgáltatások', en: 'Services' }), title: t({ hu: 'Tervezéstől a berendezésig', en: 'From design to furnishing' }), id: 'szolg-title', split: true,
    intro: t({
      hu: 'Vállalunk teljes lakásfelújítást generálkivitelezéssel, önálló tervezést, lakberendezést, és kisebb volumenű, eladás vagy kiadás előtti home stagingot is.',
      en: 'We take on full renovations as general contractor, standalone design, interior furnishing, and smaller home staging jobs before a sale or rental.',
    }),
  })}
  <ul class="services">${featured.map(ServiceBlock).join('')}</ul>
  <p class="mt-xl"><a class="link-arrow" href="${href('services')}">${t({ hu: 'Minden szolgáltatás', en: 'All services' })}</a></p>
</div></section>

<section class="section" aria-labelledby="proj-title"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Projektek', en: 'Projects' }), title: t({ hu: 'Válogatott munkáink', en: 'Selected work' }), id: 'proj-title' })}
  <ul class="projects">${projects.map((p) => ProjectCard(p)).join('')}</ul>
</div></section>

<section class="section section--alt" id="${processId}" aria-labelledby="folyamat-title"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Folyamat', en: 'Process' }), title: t({ hu: 'Öt lépésben az átadásig', en: 'Five steps to handover' }), id: 'folyamat-title', split: true, intro: t(process.intro) })}
  ${ProcessTimeline(process.steps)}
  <p class="copy mt-lg">${t({
    hu: 'Az árat és az ütemezést mindig az adott lakás állapota és a közösen meghozott döntések alapján határozzuk meg.',
    en: 'Price and schedule are always based on the condition of the apartment and the decisions we make together.',
  })}</p>
</div></section>

<section class="section" aria-labelledby="miert-title"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Miért velünk?', en: 'Why us?' }), title: t({ hu: 'Ami a munkánkat összetartja', en: 'What holds our work together' }), id: 'miert-title' })}
  ${whyList()}
</div></section>

<section class="section section--alt" aria-labelledby="rolunk-title"><div class="wrap split split--flip">
  <div>
    <span class="eyebrow">${t({ hu: 'Rólunk', en: 'About us' })}</span>
    <h2 id="rolunk-title">${t({ hu: 'Kis stúdió, teljes figyelem.', en: 'A small studio, full attention.' })}</h2>
    <p class="copy">${t({
      hu: 'Az Urban Flip Studiót ketten, házaspárként indítottuk. Először a saját lakásainkon, a saját pénzünkön tanultuk meg a szakmát — ma már másoknak is A-tól Z-ig megoldjuk a felújítást. Szándékosan kicsik maradunk: egyszerre csak néhány projektet vállalunk, hogy mindegyikre valóban oda tudjunk figyelni.',
      en: 'We started Urban Flip Studio as a married couple. We first learned the craft on our own apartments, with our own money — today we handle renovations from A to Z for others too. We deliberately stay small: we take on only a few projects at a time, so that each one gets our real attention.',
    })}</p>
    <p class="mt-md"><a class="link-arrow" href="${href('about')}">${t({ hu: 'Ismerjen meg minket', en: 'Get to know us' })}</a></p>
  </div>
  <figure class="media media--43">${Picture('vamhaz-korut/gallery/galeria-haloszoba', { alt: { hu: 'A Vámház körúti galériaszinti hálószoba üvegfalon át, gömblámpákkal', en: 'The gallery-level bedroom of the Vámház körút apartment through a glass wall, with globe pendants' }, sizes: '(min-width: 900px) 45vw, 100vw' })}</figure>
</div></section>

${closingCta()}
</main>`,
  };
}

/* ===================== SZOLGÁLTATÁSOK ===================== */
function servicesPage() {
  const crumbs = [crumb('home', HOME), crumb('services', { hu: 'Szolgáltatások', en: 'Services' })];
  return {
    key: 'services',
    title: t({ hu: 'Szolgáltatások — lakásfelújítás, tervezés, lakberendezés, home staging', en: 'Services — renovation, design, interiors, home staging' }) + BRAND,
    description: t({
      hu: 'Teljes körű lakásfelújítás és generálkivitelezés, műszaki és térszervezési tervezés, enteriőrtervezés és lakberendezés, valamint eladás előtti lakásfelkészítés (home staging) Budapesten.',
      en: 'Full-scope apartment renovation and general contracting, technical and spatial planning, interior design and furnishing, and pre-sale home staging in Budapest.',
    }),
    ogImage: 'gozmozdony-utca/gallery/nappali',
    jsonLd: [orgLd(), breadcrumbLd(crumbs), ...services.map((s) => ({
      '@context': 'https://schema.org', '@type': 'Service', name: t(s.title), description: t(s.text),
      provider: { '@id': `${site.url}/#business` }, areaServed: { '@type': 'City', name: 'Budapest' },
      url: abs(`${href('services')}#${s.slug}`), inLanguage: lang,
    }))],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({
  crumbs, eyebrow: t({ hu: 'Szolgáltatások', en: 'Services' }),
  title: t({ hu: 'Tervezés, kivitelezés, berendezés — együtt vagy külön', en: 'Design, construction, furnishing — together or separately' }),
  intro: t({
    hu: 'Egy teljes lakásfelújítást a tervtől az átadásig összefogunk, de a tervezés, a lakberendezés vagy egy eladás előtti home staging önállóan is kérhető.',
    en: 'We can manage a full apartment renovation from plan to handover, but design, interior furnishing or pre-sale home staging can also be booked on their own.',
  }),
})}
<section class="section section--flush" style="padding-top:0"><div class="wrap">
  ${services.map((s) => `<article class="sblock" id="${s.slug}" aria-labelledby="h-${s.slug}">
    <div>
      <h2 id="h-${s.slug}">${esc(t(s.title))}</h2>
      <p class="copy">${esc(t(s.text))}</p>
      ${s.note ? `<p class="sblock__note">${esc(t(s.note))}</p>` : ''}
    </div>
    <div class="sblock__aside">
      ${s.image ? `<figure class="media">${Picture(s.image, { alt: '', sizes: '(min-width: 900px) 55vw, 100vw' })}</figure>` : ''}
      ${s.list ? `<h3 class="visually-hidden">${esc(t(s.listTitle))}</h3><ul class="sblock__list" aria-label="${esc(t(s.listTitle))}">${t(s.list).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
    </div>
  </article>`).join('')}
</div></section>
<section class="section section--alt" aria-labelledby="folyamat-title"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Folyamat', en: 'Process' }), title: t({ hu: 'Hogyan dolgozunk', en: 'How we work' }), id: 'folyamat-title', split: true, intro: t(process.intro) })}
  ${ProcessTimeline(process.steps)}
</div></section>
${closingCta()}
</main>`,
  };
}

/* ===================== PROJEKTEK ===================== */
function projectsIndex() {
  const crumbs = [crumb('home', HOME), crumb('projects', { hu: 'Projektek', en: 'Projects' })];
  return {
    key: 'projects',
    title: t({ hu: 'Projektek és referenciák — lakásfelújítás előtte–utána', en: 'Projects — apartment renovations before and after' }) + BRAND,
    description: t({
      hu: 'Budapesti lakásfelújítási és enteriőrtervezési referenciáink előtte–utána képekkel: Vámház körút (Project Olive), Gőzmozdony utca, Balázs Béla utca.',
      en: 'Our apartment renovation and interior design projects in Budapest with before-and-after photos: Vámház körút (Project Olive), Gőzmozdony utca, Balázs Béla utca.',
    }),
    ogImage: 'balazs-bela-utca/gallery/nappali',
    jsonLd: [breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({
  crumbs, eyebrow: t({ hu: 'Projektek', en: 'Projects' }),
  title: t({ hu: 'Lakások, amelyeket újragondoltunk', en: 'Apartments we have reimagined' }),
  intro: t({ hu: 'Minden projektnél megmutatjuk a kiindulási állapotot is — mert a változás így érthető igazán.', en: 'For every project we also show the starting point — because that is what makes the change clear.' }),
})}
<section class="section" style="padding-top:0"><div class="wrap">
  <ul class="projects">${projects.map((p) => ProjectCard(p, { headingLevel: 2 })).join('')}</ul>
</div></section>
${closingCta()}
</main>`,
  };
}

function projectPage(p, i) {
  const next = projects[(i + 1) % projects.length];
  const title = t(p.title);
  const crumbs = [crumb('home', HOME), crumb('projects', { hu: 'Projektek', en: 'Projects' }), crumb(`project:${p.slug}`, p.title)];
  const titleFull = p.subtitle ? `${title} – ${p.subtitle}` : title;
  const summary = t(p.summary);
  return {
    key: `project:${p.slug}`,
    title: `${titleFull} — ${t({ hu: 'lakásfelújítás és enteriőr', en: 'renovation and interior design' })}${BRAND}`,
    description: `${summary.split('. ')[0].replace(/\.$/, '')}. ${t({ hu: 'Előtte–utána képek, megoldások és galéria.', en: 'Before-and-after photos, solutions and gallery.' })}`,
    ogImage: p.hero,
    jsonLd: [breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
<header class="page-head"><div class="wrap">
  ${Breadcrumb(crumbs)}
  <span class="eyebrow">${esc(t(p.location))}</span>
  <h1>${esc(title)}${p.subtitle ? ` <span style="font-style:italic;color:var(--olive)">– ${esc(p.subtitle)}</span>` : ''}</h1>
  <p class="lead">${esc(summary)}</p>
  ${Tags(p.tags, 'tags mt-md')}
</div></header>
<div class="phero">${Picture(p.hero, { alt: p.heroAlt, eager: true, sizes: '100vw' })}</div>

<section class="section" aria-labelledby="adatok"><div class="wrap">
  <h2 id="adatok" class="visually-hidden">${t({ hu: 'Projektadatok', en: 'Project facts' })}</h2>
  ${ProjectFacts(p.facts)}
  <div class="split mt-xl" style="align-items:start">
    <div><span class="eyebrow">${t({ hu: 'Kiindulási állapot', en: 'Starting point' })}</span><div class="copy">${p.starting.map((x) => `<p>${esc(t(x))}</p>`).join('')}</div></div>
    <div><span class="eyebrow">${t({ hu: 'A cél', en: 'The goal' })}</span><p class="lead" style="font-size:1.2rem">${esc(t(p.goal))}</p></div>
  </div>
</div></section>

<section class="section section--alt" aria-labelledby="megoldasok"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Megoldások', en: 'Solutions' }), title: t({ hu: 'Mit és hogyan alakítottunk át', en: 'What we changed and how' }), id: 'megoldasok' })}
  <ul class="solutions">${p.solutions.map((s) => `<li><h3>${esc(t(s.title))}</h3><p>${esc(t(s.text))}</p></li>`).join('')}</ul>
</div></section>

<section class="section" aria-labelledby="elotte-utana"><div class="wrap">
  ${SectionHeading({
    eyebrow: t({ hu: 'Előtte – utána', en: 'Before – after' }), title: t({ hu: 'Ugyanaz a tér, felújítás előtt és után', en: 'The same space, before and after' }), id: 'elotte-utana',
    intro: t({
      hu: 'A képpárok ugyanazt a helyiséget mutatják. Ahol a nézőpont azonos, csúszkával is összehasonlíthatók; máshol egymás mellett láthatók.',
      en: 'Each pair shows the same room. Where the viewpoint matches, you can compare them with a slider; otherwise they are shown side by side.',
    }),
  })}
  <div class="ba-list">${p.beforeAfter.map(BeforeAfterSlider).join('')}</div>
  ${p.beforeGallery.length ? `<h3 class="mt-xl" style="font-size:var(--fs-h3)">${t({ hu: 'A kiindulási állapotról', en: 'More of the starting point' })}</h3>
  <ul class="gallery mt-md" data-gallery aria-label="${t({ hu: 'Felújítás előtti képek', en: 'Photos before the renovation' })}">${p.beforeGallery.map((b) => `<li><button type="button" data-full="${imgUrl(b.image, 960)}" data-alt="${esc(t(b.alt))}" aria-label="${t({ hu: 'Nagyítás', en: 'Enlarge' })}: ${esc(t(b.alt))}">${Picture(b.image, { alt: b.alt, sizes: '(min-width: 800px) 33vw, 50vw' })}</button></li>`).join('')}</ul>` : ''}
</div></section>

<section class="section section--alt" aria-labelledby="galeria"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Galéria', en: 'Gallery' }), title: t({ hu: 'A kész lakás', en: 'The finished apartment' }), id: 'galeria' })}
  ${ProjectGallery(p.gallery, { id: `g-${p.slug}` })}
</div></section>

${p.floorplans.length ? `<section class="section" aria-labelledby="alaprajz"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Alaprajz', en: 'Floor plan' }), title: p.floorplans.length > 1 ? t({ hu: 'Alaprajzok', en: 'Floor plans' }) : t({ hu: 'Alaprajz', en: 'Floor plan' }), id: 'alaprajz' })}
  <div class="plans">${p.floorplans.map((f) => `<figure>${Picture(f.image, { alt: f.alt, sizes: '(min-width: 800px) 45vw, 100vw' })}<figcaption>${esc(t(f.caption))}</figcaption></figure>`).join('')}</div>
</div></section>` : ''}

${p.video || p.press || p.story ? `<section class="section${p.floorplans.length ? ' section--alt' : ''}" aria-labelledby="tortenet"><div class="wrap split" style="align-items:start">
  <div>
    <span class="eyebrow">${t({ hu: 'A projekt története', en: 'The story of the project' })}</span>
    <h2 id="tortenet">${esc(p.subtitle || title)}</h2>
    ${p.story ? `<p class="copy">${esc(t(p.story))}</p>` : ''}
    ${p.press ? `<p class="press mt-lg">${esc(t(p.press))}</p>` : ''}
  </div>
  ${p.video ? `<div class="video-frame"><video controls preload="none" playsinline poster="${imgUrl(p.video.poster)}" aria-label="${esc(t(p.video.title))}"><source src="${p.video.src}" type="video/mp4"></video></div>` : '<div></div>'}
</div></section>` : ''}

<section class="section" aria-labelledby="kapcs-szolg"><div class="wrap">
  <h2 id="kapcs-szolg" style="font-size:var(--fs-h3);margin-bottom:var(--sp-md)">${t({ hu: 'Kapcsolódó szolgáltatások', en: 'Related services' })}</h2>
  <ul class="related">${p.serviceSlugs.map((s) => `<li><a href="${href('services')}#${s}">${esc(t(serviceBySlug[s].title))}</a></li>`).join('')}</ul>
</div></section>

<section class="section section--alt" aria-labelledby="kovetkezo"><div class="wrap">
  <a class="next-project" href="${href(`project:${next.slug}`)}">
    <div><span class="eyebrow">${t({ hu: 'Következő projekt', en: 'Next project' })}</span><h2 id="kovetkezo">${esc(t(next.title))}</h2><p class="copy">${esc(t(next.cardText))}</p></div>
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
  const crumbs = [crumb('home', HOME), crumb('about', { hu: 'Rólunk', en: 'About' })];
  // A házaspár-történet nyilvános kommunikációját a tulajdonos jóváhagyta (2026-10-05); neveket nem írunk ki.
  return {
    key: 'about',
    title: t({ hu: 'Rólunk — egy házaspár, aki A-tól Z-ig felújít', en: 'About us — a couple who renovate from A to Z' }) + BRAND,
    description: t({
      hu: 'Az Urban Flip Studio egy budapesti házaspár stúdiója: a saját lakásainkon tanultuk meg a felújítást, ma már másoknak is A-tól Z-ig megoldjuk — egyszerre csak néhány projekttel.',
      en: 'Urban Flip Studio is a Budapest couple’s studio: we learned renovation on our own apartments and now handle it from A to Z for others too — only a few projects at a time.',
    }),
    ogImage: 'vamhaz-korut/gallery/nappali-konyha',
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({
  crumbs, eyebrow: t({ hu: 'Rólunk', en: 'About us' }),
  title: t({ hu: 'Inkább szenvedély, mint munka.', en: 'More passion than work.' }),
  intro: t({ hu: 'Ketten vagyunk, a magánéletben házaspár. Az Urban Flip Studio a közös szerelemprojektünkből nőtt ki.', en: 'We are two people, married in private life. Urban Flip Studio grew out of our shared passion project.' }),
})}
<section class="section" style="padding-top:0"><div class="wrap split" style="align-items:start">
  <div class="copy">
    <p>${t({
      hu: 'Az első lakásokat a saját pénzünkön, a saját kockázatunkra újítottuk fel. Ott tanultuk meg, mennyit számít egy jó alaprajz, egy átgondolt fény vagy egy pontosan kivitelezett csatlakozás.',
      en: 'We renovated our first apartments with our own money, at our own risk. That is where we learned how much a good layout, well-planned light or a precisely finished joint matters.',
    })}</p>
    <p>${t({
      hu: 'Ma már másoknak is dolgozunk, A-tól Z-ig: a felméréstől és a tervezéstől a kivitelezésen és a beszerzésen át a berendezésig és az átadásig. Egyikünk a tereket, a fényeket és az anyagokat gondolja végig, a másikunk a kivitelezést szervezi és vezeti — így a tervezőasztalnál született döntések a helyszínen sem vesznek el.',
      en: 'Today we work for clients too, from A to Z: from survey and design through construction and procurement to furnishing and handover. One of us thinks through the spaces, the light and the materials; the other organises and runs the build — so the decisions made at the drawing board don’t get lost on site.',
    })}</p>
    <p>${t({
      hu: 'Nem akarunk nagy céggé válni. Szándékosan egyszerre csak néhány projektet vállalunk, hogy mindegyikre valóban oda tudjunk figyelni.',
      en: 'We don’t want to become a big company. We deliberately take on only a few projects at a time, so that each one gets our real attention.',
    })}</p>
    <p>${t({ hu: 'Az eddigi legnagyobb közös munkánk a Vámház körúti lakás, a', en: 'Our biggest project together so far is the Vámház körút apartment,' })} <a href="${href('project:vamhaz-korut')}">Project Olive</a>${t({
      hu: ' volt. Hónapokig kerestük a burkolatokat, a lámpákat, a kilincseket és a színeket — ugyanezzel a figyelemmel dolgozunk az ügyfeleink lakásain is.',
      en: '. We spent months searching for the tiles, the lamps, the door handles and the colours — and we bring the same attention to our clients’ homes.',
    })}</p>
  </div>
  <figure class="media media--45" style="max-width:30rem">${Picture('site/rolunk', { alt: { hu: 'Az Urban Flip Studio két alapítója', en: 'The two founders of Urban Flip Studio' }, sizes: '(min-width: 900px) 30rem, 100vw' })}</figure>
</div></section>
<section class="section section--alt" aria-labelledby="miert-title"><div class="wrap">
  ${SectionHeading({ eyebrow: t({ hu: 'Ahogy dolgozunk', en: 'How we work' }), title: t({ hu: 'Ami a munkánkat összetartja', en: 'What holds our work together' }), id: 'miert-title' })}
  ${whyList()}
</div></section>
${closingCta()}
</main>`,
  };
}

/* ===================== KAPCSOLAT ===================== */
function contact() {
  const crumbs = [crumb('home', HOME), crumb('contact', { hu: 'Kapcsolat', en: 'Contact' })];
  return {
    key: 'contact',
    title: t({ hu: 'Kapcsolat — konzultáció lakásfelújításhoz', en: 'Contact — consultation for your renovation' }) + BRAND,
    description: t({
      hu: 'Meséljen a lakásról: írjon néhány mondatot a felújításról, a tervezésről, a lakberendezésről vagy az eladás előtti home stagingről, és egyeztetünk a következő lépésekről.',
      en: 'Tell us about your apartment: write a few lines about the renovation, design, furnishing or pre-sale home staging, and we’ll agree on the next steps.',
    }),
    ogImage: 'balazs-bela-utca/after/konyha',
    jsonLd: [orgLd(), breadcrumbLd(crumbs)],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({
  crumbs, eyebrow: t({ hu: 'Kapcsolat', en: 'Contact' }),
  title: t({ hu: 'Meséljen a lakásról', en: 'Tell us about your apartment' }),
  intro: t({
    hu: 'Írjon néhány mondatot a projektről. Az első egyeztetésen átbeszéljük az ingatlan állapotát, az elképzeléseket és a lehetséges következő lépéseket.',
    en: 'Write a few lines about your project. At our first meeting we’ll go through the condition of the property, your ideas and the possible next steps.',
  }),
})}
<section class="section" style="padding-top:0"><div class="wrap contact-grid">
  <div>${ContactForm({ services: formServices })}</div>
  <aside aria-labelledby="elerhetoseg">
    <h2 id="elerhetoseg" class="eyebrow">${t({ hu: 'Közvetlen elérhetőség', en: 'Direct contact' })}</h2>
    <ul class="contact-list">
      <li><span>${t({ hu: 'Telefon', en: 'Phone' })}</span><a href="${site.phoneHref}">${esc(site.phone)}</a></li>
      <li><span>${t({ hu: 'E-mail', en: 'Email' })}</span><a href="mailto:${site.email}">${esc(site.email)}</a></li>
      <li><span>WhatsApp</span><a href="${site.whatsapp}" target="_blank" rel="noopener">${t({ hu: 'Üzenet WhatsAppon', en: 'Message on WhatsApp' })}<span class="visually-hidden"> (${t({ hu: 'új lapon nyílik', en: 'opens in a new tab' })})</span></a></li>
    </ul>
    <p class="copy mt-md" style="font-size:var(--fs-small)">${t({ hu: 'Budapesti lakásokkal dolgozunk.', en: 'We work on apartments in Budapest.' })}</p>
  </aside>
</div></section>
</main>`,
  };
}

/* ===================== 404 (csak a gyökérben — a GitHub Pages egyetlen 404.html-t szolgál ki) ===================== */
function notFound() {
  return {
    key: null,
    path: '/404.html',
    noindex: true,
    title: `Az oldal nem található / Page not found${BRAND}`,
    description: 'A keresett oldal nem található.',
    ogImage: site.defaultOgImage,
    jsonLd: [],
    body: `<main id="tartalom" tabindex="-1">
${PageHead({ eyebrow: '404', title: 'Ezt az oldalt nem találjuk', intro: 'Lehet, hogy a cím megváltozott. Innen biztosan továbbjut:' })}
<section class="section" style="padding-top:0"><div class="wrap">
  <div class="btn-row"><a class="btn btn--solid" href="/">Kezdőlap</a><a class="btn btn--line" href="/projektek/">Projektek</a><a class="btn btn--line" href="/kapcsolat/">Kapcsolat</a></div>
  <p class="copy mt-lg" lang="en">Page not found — <a href="/en/">continue in English</a>.</p>
</div></section>
</main>`,
  };
}

export function allPages() {
  const pages = [home(), servicesPage(), projectsIndex(), ...projects.map(projectPage), about(), contact()];
  for (const p of pages) p.path = href(p.key);
  if (lang === 'hu') pages.push(notFound());
  return pages;
}
