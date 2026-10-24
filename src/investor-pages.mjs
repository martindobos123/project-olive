import { site } from './data/site.mjs';
import { investorFaq, investorSteps, investorResults } from './data/investors.mjs';
import { DEFAULT_PROJECT, calculateProject, calculateTwoProjects } from './assets/investor.mjs';
import { projects } from './data/projects.mjs';
import { t, href } from './i18n.mjs';
import { esc, Picture, Breadcrumb, SectionHeading, ProcessTimeline, BeforeAfterSlider, ProjectGallery, AccessibleLightbox, PageHead } from './components.mjs';

const tx = (hu, en) => esc(t({ hu, en }));
const button = (to = '#erdeklodes') => `<a class="btn btn--solid" href="${to}">${tx('Érdekel a befektetés', 'Explore the investment')}</a>`;
const number = n => new Intl.NumberFormat(t({hu:'hu-HU',en:'en-GB'}),{maximumFractionDigits:2}).format(n);
const money = n => new Intl.NumberFormat(t({hu:'hu-HU',en:'en-GB'}),{maximumFractionDigits:0}).format(n) + t({hu:' Ft',en:' HUF'});

function calculator() {
  const initial = calculateProject(DEFAULT_PROJECT);
  const two = calculateTwoProjects(initial);
  const fields = [
    ['purchase', 'Vételár', 'Purchase price', DEFAULT_PROJECT.purchase, 1, 200, 1],
    ['renovation', 'Felújítás és berendezés', 'Renovation and furnishing', DEFAULT_PROJECT.renovation, 0, 100, 1],
    ['other', 'Egyéb költségek és felhasznált tartalék', 'Other costs and spent contingency', DEFAULT_PROJECT.other, 0, 50, 1],
    ['sale', 'Feltételezett eladási ár', 'Assumed sale price', DEFAULT_PROJECT.sale, 1, 350, 1],
    ['months', 'Feltételezett teljes projektidő', 'Assumed total project duration', DEFAULT_PROJECT.months, 1, 60, 1],
  ];
  return `<section class="section section--alt" id="kalkulator" aria-labelledby="calc-title"><div class="wrap">
  ${SectionHeading({ eyebrow: tx('Számoljunk', 'Run the numbers'), title: tx('Mennyi jutna Önnek?', 'What would your share be?'), id: 'calc-title', intro: tx('Állítsa be a vételárat, a költségeket és az eladási árat. Megmutatjuk az Ön profitrészét, a projekthozamot és annak évesített értékét.', 'Set the purchase price, costs and sale price. See your profit share, project return and its annualised equivalent.'), split: true })}
  <div class="invest-calc" data-invest-calculator>
    <div class="invest-calc__inputs" aria-describedby="calc-costs">${fields.map(([name, hu, en, val, min, max, step]) => `<div class="invest-control"><label for="calc-${name}">${tx(hu, en)} <span>(${name === 'months' ? tx('hónap', 'months') : tx('millió Ft', 'HUF million')})</span></label><div><input type="range" data-pair="${name}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${tx(hu, en)} – ${tx('csúszka', 'slider')}"><input type="number" inputmode="decimal" id="calc-${name}" name="${name}" min="${min}" max="${max}" step="${step}" value="${val}" required></div></div>`).join('')}
    <p class="invest-small" id="calc-costs">${tx('Az egyéb költségekbe számolja bele a vagyonszerzés, ügyvéd, fenntartás, értékesítés és minden más projektteher összegét, valamint a ténylegesen felhasznált tartalékot. A személyes adózás külön tétel. Nincs automatikusan hozzáadott díj vagy adókulcs.', 'Include acquisition, legal, holding, selling and all other project costs, plus contingency actually spent. Personal taxes are separate. No fee or tax rate is added automatically.')}</p></div>
    <div class="invest-result" aria-labelledby="result-title"><span class="eyebrow">${tx('Az Ön számolt hozama', 'Your calculated return')}</span><h3 id="result-title">${tx('Évesített hozam', 'Annualised return')}</h3>
    <div class="invest-result__main" aria-live="polite" aria-atomic="true"><strong data-result="annualized">${number(initial.annualized)}%</strong><span class="invest-project-return"><b data-result="roi">${number(initial.roi)}%</b> ${tx('projekthozam', 'project return')}</span><span>${tx('Saját adózás előtt · szemléltető számítás', 'Before your own taxes · illustrative calculation')}</span></div>
    <dl class="invest-breakdown">
      ${[['investor','Az Ön projektjövedelme','Your project income',money(initial.investor)],['total','Teljes projektfinanszírozás','Total project funding',money(initial.total)],['profit','Nettó projektprofit','Net project profit',money(initial.profit)],['operator','Urbanflip számolt projekteredménye','Urbanflip calculated project result',money(initial.operator)],['settlement','Tőke és az Ön hozama együtt','Your capital plus return',money(initial.settlement)],['duration','Teljes projektidő','Total project duration',tx('6 hónap','6 months')]].map(([key,hu,en,val])=>`<div><dt>${tx(hu,en)}</dt><dd data-result="${key}">${val}</dd></div>`).join('')}
    </dl><p class="invest-small" data-calc-status role="status"></p>
    <p class="invest-small">${tx('Az évesített érték azonos százalékos eredményt és teljes újrabefektetést feltételez, várakozási idő nélkül. Nem éves hozamígéret. A 3%-os minimum mindig projektre, nem egy évre vonatkozik.', 'The annualised figure assumes the same percentage result and full reinvestment with no waiting time. It is not an annual return promise. The 3% minimum always applies per project, not per year.')}</p>
    <details class="invest-formula"><summary>${tx('Hogyan jön ki az eredmény?', 'How is this calculated?')}</summary><p>${tx('Nettó projektprofit = eladási ár − vételár − felújítás − egyéb költségek. Az Ön jövedelme a nettó projektprofit 50%-a, de legalább a teljes projektfinanszírozás 3%-a. Az ehhez szükséges hiányt az Urbanflip pótlásaként számoljuk. Projekthozam = az Ön jövedelme / teljes finanszírozás × 100. Évesített hozam = ((1 + projekthozam / 100)^(12 / hónap) − 1) × 100. Az adózás nincs levonva.', 'Net project profit = sale price − purchase price − renovation − other costs. Your income is 50% of net project profit, with a minimum of 3% of total funding. Any shortfall is shown as funding required from Urbanflip. Project return = your income / total funding × 100. Annualised return = ((1 + project return / 100)^(12 / months) − 1) × 100. Taxes are not deducted.')}</p></details>
    <details class="invest-formula invest-two"><summary>${tx('És ha két projektet forgatnék végig?', 'What if I completed two projects?')}</summary>
    <p>${tx('Két egymást követő, azonos százalékos befektetői eredményű projektet feltételezünk, a teljes záróösszeg újrabefektetésével. A második projekt költségei arányosan változnának. Ez számítási feltételezés, nem elérhető hozamra tett ígéret.', 'We assume two consecutive projects with the same percentage investor result, reinvesting the entire closing amount. Second-project costs scale proportionally. This is a calculation assumption, not a promise of an achievable return.')}</p>
    <dl class="invest-breakdown"><div><dt>${tx('Két projekt számolt záróösszege', 'Calculated closing amount after two projects')}</dt><dd data-two="settlement">${money(two.settlement)}</dd></div><div><dt>${tx('Összesített befektetői eredmény', 'Combined investor return')}</dt><dd data-two="roi">${number(two.roi)}%</dd></div><div><dt>${tx('Két projekt feltételezett teljes ideje', 'Assumed total time for two projects')}</dt><dd data-two="duration">${tx('12 hónap', '12 months')}</dd></div></dl>
    <p class="invest-small">${tx('Az összesített eredmény csak akkor tekinthető 12 hónaposnak, ha a keresés, a két felújítás, az értékesítések és az elszámolások együtt beleférnek 12 hónapba. A személyes adók és a projektek közötti várakozás csökkenthetik az újrabefektethető összeget, illetve növelhetik az időtartamot.', 'This is a 12-month result only if the search, both renovations, sales and settlements all fit within 12 months. Personal taxes and waiting between projects may reduce reinvestable funds or extend the timeline.')}</p></details>
    <div class="mt-md">${button()}</div></div>
  </div><noscript><p class="invest-notice">${tx('Az alap példa 45 + 8 + 2 = 55 M Ft finanszírozás, 67 M Ft eladás és 6 hónap. Ebből 6 M Ft az Ön számolt projektjövedelme. A csúszkákhoz JavaScript szükséges.', 'The default example uses HUF 45m + 8m + 2m = 55m funding, a HUF 67m sale and 6 months. Your calculated project income is HUF 6m. Sliders require JavaScript.')}</p></noscript>
  </div></section>`;
}

function references(landing) {
  const shown = projects;
  return `<section class="section" id="referenciak" aria-labelledby="reference-title"><div class="wrap">
  ${SectionHeading({ eyebrow: tx('Korábbi saját projektjeink', 'Our earlier projects'), title: tx('Lakásokból teremtettünk értéket.', 'Creating value through apartments.'), id: 'reference-title', intro: tx('Saját felújítások, saját fotók, korábbi projekteredmények. A pontos vételi és eladási összegek magánadatok, a hozamokat és az időtartamot itt megmutatjuk.', 'Our own renovations, photos and earlier project results. Exact purchase and sale figures are private; here we share the returns and timeframes.'), split: true })}
  <ul class="invest-references">${shown.map(p=>{const r=investorResults[p.slug];return `<li><article><a class="media media--32" href="${href('investorProject:'+p.slug)}">${Picture(p.hero,{alt:p.heroAlt,sizes:'(min-width: 900px) 33vw, 100vw'})}</a><h3>${esc(t(p.title))}</h3><p class="invest-reference-return"><strong>≈ ${number(r.projectReturn)}%</strong><span>${r.months} ${tx('hónap · teljes projekthozam','months · full-project return')}</span></p><p class="invest-small">${tx('Tulajdonosi adatközlés, adózás előtt.','Owner-reported, before tax.')}</p><p class="copy">${tx('50–50-es megosztással számolva:', 'Illustrating a 50–50 split:')} <strong>${number(r.projectReturn/2)}% ${tx('befektetői projekthozam','investor project return')}</strong>.</p><a class="link-arrow" href="${href('investorProject:'+p.slug)}">${tx('Megnézem a befektetői referenciát', 'View the investor case study')}<span class="visually-hidden">: ${esc(t(p.title))}</span></a></article></li>`;}).join('')}</ul><p class="invest-small mt-md">${tx('A hozamok a teljes ráfordított tőkéhez viszonyított, közelítő projekteredmények. Az 50–50-es befektetői rész szemléltetés, nem korábbi külső befektető kifizetése. A múltbeli eredmények nem jelentenek jövőbeli hozamígéretet.', 'Returns are approximate project results relative to total capital spent. The 50–50 investor share is an illustration, not a payout to a previous external investor. Past results are not a promise of future returns.')}</p></div></section>`;
}

function enquiry() {
  return `<section class="section section--alt" id="erdeklodes" aria-labelledby="enquiry-title"><div class="wrap split split--top">
  <div><span class="eyebrow">${tx('Első lépés: egy beszélgetés', 'First step: a conversation')}</span><h2 id="enquiry-title">${tx('Nézzük meg, illik-e Önhöz ez a modell.', 'Let’s see if this model suits you.')}</h2><p class="lead">${tx('Írja meg, milyen keretben és mikor gondolkodik. Átbeszéljük a lehetőségeket, a költségeket és a nyitott kérdéseket.', 'Tell us your budget and timing. We will discuss the possibilities, costs and open questions.')}</p><p class="invest-small">${tx('Az érdeklődés nem jelent befektetési kötelezettséget. Az együttműködés részleteit egyedi megállapodás rögzíti.', 'An enquiry creates no obligation to invest. An individual agreement defines the terms.')}</p><a class="link-arrow" href="${site.phoneHref}">${esc(site.phone)}</a></div>
  <form class="form" data-invest-form data-mailto="${esc(site.email)}" aria-describedby="invest-form-note">
    <div class="form__row"><div class="field"><label for="invest-name">${tx('Név', 'Name')} *</label><input id="invest-name" name="name" autocomplete="name" maxlength="120" required></div><div class="field"><label for="invest-email">${tx('E-mail', 'Email')} *</label><input id="invest-email" name="email" type="email" autocomplete="email" maxlength="180" required></div></div>
    <div class="form__row"><div class="field"><label for="invest-budget">${tx('Tervezett tőkekeret (opcionális)', 'Planned capital (optional)')}</label><select id="invest-budget" name="budget"><option value="">${tx('Még egyeztetnék róla', 'Let’s discuss it')}</option><option>40–50 M Ft</option><option>50–80 M Ft</option><option>80+ M Ft</option></select></div><div class="field"><label for="invest-phone">${tx('Telefonszám (opcionális)', 'Phone (optional)')}</label><input id="invest-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div></div>
    <div class="field"><label for="invest-message">${tx('Időzítés, kérdés vagy elképzelés (opcionális)', 'Timing, questions or ideas (optional)')}</label><textarea id="invest-message" name="message" maxlength="1500" rows="3"></textarea></div>
    <div class="field field--check"><input id="invest-consent" name="consent" type="checkbox" required><label for="invest-consent">${tx('Hozzájárulok adataim kezeléséhez a megkeresésem megválaszolása céljából. Elolvastam az', 'I consent to my data being processed to respond to my enquiry. I have read the')} <a href="${href('privacy')}">${tx('adatkezelési tájékoztatót', 'privacy notice')}</a>. *</label></div>
    <button class="btn btn--solid" type="submit">${tx('Érdeklődő e-mail összeállítása', 'Prepare enquiry email')}</button><p class="form__status" role="status" aria-live="polite"></p>
    <p class="form__alt" id="invest-form-note">${tx('A gomb előre kitöltött e-mailt nyit a saját levelezőjében; az üzenetet ott kell elküldenie. Ha nem nyílik meg, írjon közvetlenül:', 'The button opens a pre-filled email in your email app; send the message there. If it does not open, email us directly:')} <a href="mailto:${site.email}">${esc(site.email)}</a>.</p>
    <noscript><p>${tx('Az űrlap összeállításához JavaScript szükséges. Kérjük, írjon közvetlenül a fenti e-mail-címre, vagy telefonáljon.', 'The form requires JavaScript. Please email us directly using the address above or call us.')}</p></noscript>
  </form></div></section>`;
}

export function investorPage(landing = false) {
  const key = landing ? 'investorLanding' : 'investors';
  const crumbs = [{href:href('home'),label:tx('Kezdőlap','Home')},{href:href(key),label:tx('Befektetőknek','For investors')}];
  return {
    key, landing, noindex: landing, investorAssets: true,
    title: tx(landing ? 'Budapesti lakásprojekt befektetőknek' : 'Befektetőknek — budapesti lakásprojektek', landing ? 'Budapest apartment projects for investors' : 'For investors — Budapest apartment projects') + ' | ' + site.name,
    description: tx('Ön finanszírozza a budapesti lakást és a felújítást, mi szervezzük a projektet. Saját tulajdonú ingatlan, 50–50% pozitív projektprofit-megosztás, átlátható kalkulátor és egyeztetés.', 'You fund the Budapest apartment and renovation; we organise the project. Property in your name, 50–50 positive project profit sharing, a transparent calculator and a conversation.'),
    ogImage: 'vamhaz-korut/gallery/nappali-galeria',
    jsonLd: [{ '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.label,item:site.url+c.href})) }],
    body: `<main id="tartalom" tabindex="-1" class="invest-page${landing?' invest-page--landing':''}">
    <section class="invest-hero"><div class="wrap invest-hero__grid"><div>
      ${landing?'':Breadcrumb(crumbs)}<span class="eyebrow">${tx('Budapest · Befektetői együttműködés', 'Budapest · Investor partnership')}</span>
      <h1>${tx('Ön adja a tőkét.', 'You provide the capital.')}<br><em>${tx('A nettó profit fele az Öné.', 'Half the net profit is yours.')}</em></h1>
      <p class="lead">${tx('Mi budapesti lakást vásárolunk az Ön nevére, felújítjuk és eladjuk. Ön a nettó projektprofit 50%-át kapja, projektenként minimum 3%-os hozamgaranciával.', 'We buy a Budapest apartment in your name, renovate it and sell it. You receive 50% of net project profit, with a guaranteed minimum 3% return per project.')}</p>
      <ul class="invest-offer"><li><strong>50–50%</strong><span>${tx('nettó profitmegosztás', 'net profit split')}</span></li><li><strong>3%</strong><span>${tx('minimum projekthozam', 'minimum project return')}</span></li><li><strong>${tx('Saját néven', 'In your name')}</strong><span>${tx('az ingatlan az Öné', 'you own the apartment')}</span></li></ul>
      <div class="btn-row">${button()}${landing?'':`<a class="btn btn--line" href="#kalkulator">${tx('Kiszámolom egy projekt eredményét', 'Explore a project’s numbers')}</a>`}</div>
      <p class="invest-small mt-md"><strong>${tx('Minimum beszálló: 40–50 millió Ft', 'Minimum investment: HUF 40–50 million')}</strong> · ${tx('projekttől függően', 'depending on the project')}</p>
    </div><figure class="invest-hero__photo">${Picture('vamhaz-korut/gallery/nappali-galeria',{alt:{hu:'Saját megvalósult felújításunk: a Vámház körúti lakás nappalija és galériája',en:'Our completed renovation: living room and gallery at Vámház körút'},eager:true,sizes:'(min-width: 1000px) 45vw, 100vw'})}<figcaption>${tx('Vámház körút · Saját felújítási referencia', 'Vámház körút · Our renovation work')}</figcaption></figure></div></section>
    <div class="invest-strip"><div class="wrap"><span>${tx('Az ingatlan az Ön nevén', 'Property in your name')}</span><span>${tx('Teljes projektszervezés', 'Full project coordination')}</span><span>${tx('Pozitív projektprofit: 50–50%', 'Positive project profit: 50–50%')}</span></div></div>
    ${landing?references(true):''}
    <section class="section" aria-labelledby="model-title"><div class="wrap">
    ${SectionHeading({eyebrow:tx('Önnek nem kell a felújítással foglalkoznia', 'No renovation work for you'),title:tx('Amit mi mind vállalunk.', 'Everything we take care of.'),id:'model-title',intro:tx('Nem kell lakást vadásznia, kivitelezőt keresnie vagy a helyszínen intézkednie. A lakáskereséstől az eladásig mi visszük a teljes projektet.', 'No property hunting, finding contractors or managing a building site. We run the complete project, from the property search to the sale.'),split:true})}
    ${ProcessTimeline(investorSteps)}
    </div></section>
    ${calculator()}${landing?'':references(false)}
    <section class="section" aria-labelledby="faq-title"><div class="wrap invest-faq">
    ${SectionHeading({eyebrow:tx('Kérdések és válaszok','Questions and answers'),title:tx('Amit érdemes előre tisztázni.', 'What to clarify before starting.'),id:'faq-title'})}
    ${investorFaq.map(f=>`<details><summary>${esc(t(f.q))}</summary><p>${esc(t(f.a))}${f.links?` <a href="${esc(f.links[0].url)}" target="_blank" rel="noopener">${esc(t(f.links[0].label))}</a>`:''}</p></details>`).join('')}
    </div></section>${enquiry()}
    <div class="invest-mobile-cta">${button()}</div>
    </main>`,
  };
}

// Separate financial case studies: never add return figures to renovation portfolio data/pages.
export function investorProjectPage(project) {
  const result = investorResults[project.slug];
  const key = 'investorProject:' + project.slug;
  const crumbs = [{href:href('home'),label:tx('Kezdőlap','Home')},{href:href('investors'),label:tx('Befektetőknek','Investors')},{href:href(key),label:t(project.title)}];
  return {
    key, investorAssets:true,
    title:t(project.title) + ' — ' + tx('befektetői referencia','investor case study') + ' | ' + site.name,
    description:tx('Saját budapesti lakásprojektünk bemutatása: felújítás, tulajdonos által közölt projekthozam és időtartam, az 50–50-es befektetői modell szemléltetésével.', 'Our Budapest apartment project: renovation, owner-reported project return and duration, illustrating the 50–50 investor model.'),
    ogImage:site.defaultOgImage,
    jsonLd:[{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.label,item:site.url+c.href}))}],
    body:`<main id="tartalom" tabindex="-1" class="invest-page invest-case">
      ${PageHead({crumbs,eyebrow:tx('Befektetői referencia','Investor case study'),title:t(project.title),intro:t(project.summary)})}
      <section class="section section--tight"><div class="wrap split split--top">
      <figure class="media media--43">${Picture(project.hero,{alt:project.heroAlt,eager:true,sizes:'(min-width: 900px) 50vw, 100vw'})}</figure>
      <div><span class="eyebrow">${tx('Korábbi saját projekt · tulajdonosi adatközlés','Earlier owner-funded project · owner-reported figures')}</span>
      <dl class="invest-case__facts"><div><dt>${tx('Teljes projekthozam, adózás előtt','Full-project return, before tax')}</dt><dd>≈ ${number(result.projectReturn)}%</dd></div><div><dt>${tx('Teljes projektidő','Total project duration')}</dt><dd>${result.months} ${tx('hónap','months')}</dd></div></dl>
      <p class="copy">${tx('A hozam a projekt teljes ráfordított tőkéjéhez viszonyított, közelítő eredmény. A pontos vételi és eladási összegeket magánadatként kezeljük.', 'The return is the approximate project result relative to the total capital spent. Exact purchase and sale figures are private.')}</p>
      <div class="invest-notice"><h2>${tx('Mit jelentene ez 50–50-es megosztással?','What would a 50–50 split mean?')}</h2><p><strong>${number(result.projectReturn/2)}% ${tx('befektetői projekthozamot','investor project return')}</strong> ${tx('a fenti projektidő alatt, saját adózás előtt. Ez a mai együttműködés szemléltetése, nem korábbi külső befektető kifizetése.', 'over the project duration above, before personal taxes. This illustrates today’s partnership model, not a payout to a previous external investor.')}</p></div>
      <p class="invest-small mt-md">${tx('A korábbi projekteredmény nem ígér ugyanekkora jövőbeli hozamot. Az aktuális ajánlat minimuma a projektenkénti 3%-os szerződéses vállalásunk.', 'The earlier project result does not promise the same future return. The current offer includes our contractual 3% minimum per project.')}</p>
      ${button(href('investors')+'#erdeklodes')}</div></div></section>
      <section class="section section--alt"><div class="wrap">${SectionHeading({title:tx('A lakás átalakulása','The apartment’s transformation'),id:'case-before-after'})}${BeforeAfterSlider(project.beforeAfter[0])}</div></section>
      <section class="section"><div class="wrap">${SectionHeading({title:tx('A megvalósult munka','The completed work'),id:'case-gallery'})}${ProjectGallery(project.gallery,{id:'invest-gallery-'+project.slug})}</div></section>
      <section class="section section--alt"><div class="wrap"><h2>${tx('Ön is így fektetne ingatlanba?','Would you invest in property this way?')}</h2><p class="lead mt-md">${tx('Ön adja a tőkét. Mi elvégezzük a munkát, a nettó profitot felezzük.','You provide the capital. We do the work and share the net profit equally.')}</p>${button(href('investors')+'#erdeklodes')}</div></section>
      ${AccessibleLightbox()}</main>`,
  };
}
