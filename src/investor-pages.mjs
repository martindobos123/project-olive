import { site } from './data/site.mjs';
import { investorFaq, investorSteps } from './data/investors.mjs';
import { projects } from './data/projects.mjs';
import { t, href } from './i18n.mjs';
import { esc, Picture, Breadcrumb, SectionHeading, ProcessTimeline } from './components.mjs';

const tx = (hu, en) => esc(t({ hu, en }));
const button = () => `<a class="btn btn--solid" href="#erdeklodes">${tx('Beszéljünk a befektetésről', 'Let’s discuss investing')}</a>`;

function calculator() {
  const fields = [
    ['purchase', 'Vételár', 'Purchase price', 38, 1, 200, .5],
    ['renovation', 'Felújítás és berendezés', 'Renovation and furnishing', 8, 0, 100, .5],
    ['other', 'Egyéb költségek és felhasznált tartalék', 'Other costs and spent contingency', 4, 0, 50, .1],
    ['sale', 'Feltételezett eladási ár', 'Assumed sale price', 60, 1, 350, .5],
    ['months', 'Feltételezett teljes projektidő', 'Assumed total project duration', 8, 1, 60, 1],
  ];
  return `<section class="section section--alt" id="kalkulator" aria-labelledby="calc-title"><div class="wrap">
  ${SectionHeading({ eyebrow: tx('Számoljunk átláthatóan', 'Transparent numbers'), title: tx('Mit jelentene ez egy projektben?', 'What could a project look like?'), id: 'calc-title', intro: tx('Próbáljon ki több eladási árat és költségszintet. Minden kiinduló szám szemléltető feltételezés, nem ajánlat vagy hozamelőrejelzés.', 'Try different sale prices and cost levels. All starting figures are illustrative assumptions, not an offer or a return forecast.'), split: true })}
  <div class="invest-calc" data-invest-calculator>
    <div class="invest-calc__inputs" aria-describedby="calc-costs">${fields.map(([name, hu, en, val, min, max, step]) => `<div class="invest-control"><label for="calc-${name}">${tx(hu, en)} <span>(${name === 'months' ? tx('hónap', 'months') : tx('millió Ft', 'HUF million')})</span></label><div><input type="range" data-pair="${name}" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${tx(hu, en)} – ${tx('csúszka', 'slider')}"><input type="number" inputmode="decimal" id="calc-${name}" name="${name}" min="${min}" max="${max}" step="${step}" value="${val}" required></div></div>`).join('')}
    <p class="invest-small" id="calc-costs">${tx('Az egyéb költségekbe számolja bele a vagyonszerzés, ügyvéd, fenntartás, értékesítés és minden más projektteher összegét, valamint a ténylegesen felhasznált tartalékot. A személyes adózás külön tétel. Nincs automatikusan hozzáadott díj vagy adókulcs.', 'Include acquisition, legal, holding, selling and all other project costs, plus contingency actually spent. Personal taxes are separate. No fee or tax rate is added automatically.')}</p></div>
    <div class="invest-result" aria-labelledby="result-title"><span class="eyebrow">${tx('Szemléltető projektpélda', 'Illustrative project example')}</span><h3 id="result-title">${tx('Az Ön számolt részesedése', 'Your calculated share')}</h3>
    <div class="invest-result__main" aria-live="polite" aria-atomic="true"><strong data-result="investor">5 000 000 Ft</strong><span data-result="roi">10% ${tx('projekthozam, személyes adók előtt', 'project return, before personal taxes')}</span></div>
    <dl class="invest-breakdown">
      ${[['total','Teljes projektfinanszírozás','Total project funding','50 000 000 Ft'],['profit','Projekt eredménye a megadott költségek után','Project result after entered costs','10 000 000 Ft'],['operator','Urban Flip Studio részesedése','Urban Flip Studio share','5 000 000 Ft'],['settlement','Számolt befektetői záróösszeg','Calculated investor closing amount','55 000 000 Ft'],['duration','Feltételezett teljes időtartam','Assumed total duration',tx('8 hónap','8 months')]].map(([key,hu,en,val])=>`<div><dt>${tx(hu,en)}</dt><dd data-result="${key}">${val}</dd></div>`).join('')}
    </dl><p class="invest-small" data-calc-status role="status"></p>
    <p class="invest-small" data-loss-note>${tx('A pozitív projektprofitot 50–50%-ban osztjuk meg. Az eredmény egy projektre vonatkozik, nem éves hozam. A záróösszeg a finanszírozás és a számolt befektetői eredmény összege, személyes adók előtt.', 'Positive project profit is shared 50–50. The result is per project, not an annual return. The closing amount is funding plus the calculated investor result, before personal taxes.')}</p>
    <details class="invest-formula"><summary>${tx('Hogyan jön ki az eredmény?', 'How is this calculated?')}</summary><p>${tx('Projekt eredménye = eladási ár − vételár − felújítás − egyéb költségek. Pozitív eredménynél a befektető részesedése ennek 50%-a. Projekthozam = befektetői eredmény / teljes projektfinanszírozás × 100. Veszteségnél a stresszpélda a teljes veszteséget a befektetőre terheli; ez nem szerződéses veszteségmegosztás. Minimumhozamot nem építünk a számításba.', 'Project result = sale price − purchase price − renovation − other costs. For a positive result, the investor receives 50%. Project return = investor result / total funding × 100. In a loss scenario, this stress example assigns all losses to the investor; this is not a contractual allocation. No minimum return is included.')}</p></details>
    <details class="invest-formula invest-two"><summary>${tx('És ha két projektet forgatnék végig?', 'What if I completed two projects?')}</summary>
    <p>${tx('Két egymást követő, azonos százalékos befektetői eredményű projektet feltételezünk, a teljes záróösszeg újrabefektetésével. A második projekt költségei arányosan változnának. Ez számítási feltételezés, nem elérhető hozamra tett ígéret.', 'We assume two consecutive projects with the same percentage investor result, reinvesting the entire closing amount. Second-project costs scale proportionally. This is a calculation assumption, not a promise of an achievable return.')}</p>
    <dl class="invest-breakdown"><div><dt>${tx('Két projekt számolt záróösszege', 'Calculated closing amount after two projects')}</dt><dd data-two="settlement">60 500 000 Ft</dd></div><div><dt>${tx('Összesített befektetői eredmény', 'Combined investor return')}</dt><dd data-two="roi">21%</dd></div><div><dt>${tx('Két projekt feltételezett teljes ideje', 'Assumed total time for two projects')}</dt><dd data-two="duration">${tx('16 hónap', '16 months')}</dd></div></dl>
    <p class="invest-small">${tx('Az összesített eredmény csak akkor tekinthető 12 hónaposnak, ha a keresés, a két felújítás, az értékesítések és az elszámolások együtt beleférnek 12 hónapba. A személyes adók és a projektek közötti várakozás csökkenthetik az újrabefektethető összeget, illetve növelhetik az időtartamot.', 'This is a 12-month result only if the search, both renovations, sales and settlements all fit within 12 months. Personal taxes and waiting between projects may reduce reinvestable funds or extend the timeline.')}</p></details>
    <div class="mt-md">${button()}</div></div>
  </div><noscript><p class="invest-notice">${tx('A példa: 38 M Ft vétel + 8 M Ft felújítás + 4 M Ft egyéb költség = 50 M Ft finanszírozás. 60 M Ft eladásnál 10 M Ft projektprofit, ebből 5 M Ft a befektető számolt részesedése (10%), személyes adók előtt. A csúszkákhoz JavaScript szükséges.', 'Example: HUF 38m purchase + 8m renovation + 4m other costs = 50m funding. A HUF 60m sale gives 10m project profit; the investor’s calculated share is 5m (10%), before personal taxes. Sliders require JavaScript.')}</p></noscript>
  </div></section>`;
}

function references(landing) {
  const shown = landing ? projects.slice(0, 1) : projects;
  return `<section class="section" id="referenciak" aria-labelledby="reference-title"><div class="wrap">
  ${SectionHeading({ eyebrow: tx('Munkák, amelyeket meg lehet nézni', 'Work you can see'), title: tx('A felújítás mögött valódi munka van.', 'Real work behind the renovation.'), id: 'reference-title', intro: tx('Megvalósult felújítások saját fotókkal és esettanulmányokkal. Ezek a munkáinkat mutatják be; befektetői hozamot vagy eladási profitot nem igazolnak.', 'Completed renovations with our own photos and case studies. They demonstrate our work, not investor returns or sale profits.'), split: true })}
  <ul class="invest-references">${shown.map(p=>`<li><article><a class="media media--32" href="${href('project:'+p.slug)}">${Picture(p.hero,{alt:p.heroAlt,sizes:landing?'(min-width: 900px) 60vw, 100vw':'(min-width: 900px) 33vw, 100vw'})}</a><h3>${esc(t(p.title))}</h3><p class="copy">${esc(t(p.summary))}</p><a class="link-arrow" href="${href('project:'+p.slug)}">${tx('Megnézem az esettanulmányt', 'View the case study')}<span class="visually-hidden">: ${esc(t(p.title))}</span></a></article></li>`).join('')}</ul></div></section>`;
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
      <h1>${landing?tx('A projektprofit 50%‑a az Öné. A felújítás gondja a miénk.', '50% of project profit is yours. We take care of the renovation.'):tx('A lakás az Ön nevén. A projektprofit fele az Öné.', 'The apartment in your name. Half the project profit is yours.')}</h1>
      <p class="lead">${tx('Ön finanszíroz, mi keressük a budapesti lakást, megszervezzük a felújítást és az eladást. Az ingatlan az Ön nevére kerül; a napi szervezést mi végezzük.', 'You provide funding; we find the Budapest apartment and organise the renovation and sale. The property is registered in your name; we handle daily coordination.')}</p>
      <ul class="invest-hero__benefits"><li>${tx('A költségek után maradó pozitív projektprofit 50%-a Öné.', 'You receive 50% of positive project profit after costs.')}</li><li>${tx('Nincs kivitelezőszervezés vagy napi projektmunka az Ön oldalán.', 'No contractor coordination or daily project work on your side.')}</li></ul>
      <p class="invest-small invest-hero__proposal">${tx('Projektenkénti 3%-os minimumhozammal tervezünk. Vállalása és szerződéses feltételei még véglegesítés alatt állnak; ez jelenleg nem hozamgarancia.', 'We are planning a 3% minimum return per project. The commitment and contractual terms are still being finalised; this is not currently a return guarantee.')}</p>
      <div class="btn-row">${button()}${landing?'':`<a class="btn btn--line" href="#kalkulator">${tx('Kiszámolom egy projekt eredményét', 'Explore a project’s numbers')}</a>`}</div>
      <p class="invest-small mt-md">${tx('Induló keretként nagyságrendileg 40–50 M Ft-tól érdemes egyeztetni. A tényleges tőkeigény projektfüggő.', 'Start the conversation at approximately HUF 40–50m and upwards. Actual funding depends on the project.')}</p>
    </div><figure class="invest-hero__photo">${Picture('vamhaz-korut/gallery/nappali-galeria',{alt:{hu:'Saját megvalósult felújításunk: a Vámház körúti lakás nappalija és galériája',en:'Our completed renovation: living room and gallery at Vámház körút'},eager:true,sizes:'(min-width: 1000px) 45vw, 100vw'})}<figcaption>${tx('Vámház körút · Saját felújítási referencia', 'Vámház körút · Our renovation work')}</figcaption></figure></div></section>
    <div class="invest-strip"><div class="wrap"><span>${tx('Az ingatlan az Ön nevén', 'Property in your name')}</span><span>${tx('Teljes projektszervezés', 'Full project coordination')}</span><span>${tx('Pozitív projektprofit: 50–50%', 'Positive project profit: 50–50%')}</span></div></div>
    ${landing?references(true):''}
    <section class="section" aria-labelledby="model-title"><div class="wrap">
    ${SectionHeading({eyebrow:tx('Így dolgoznánk együtt', 'How we would work together'),title:tx('Tőke Öntől. Szervezés tőlünk.', 'Your capital. Our coordination.'),id:'model-title',intro:tx('A flip egy lakás megvásárlása, felújítása és továbbértékesítése. A modellben Ön finanszíroz, mi a megvalósítást visszük; a részleteket indulás előtt közösen rögzítjük.', 'A flip means purchasing, renovating and reselling an apartment. In this model you provide funding and we run the project; the details are agreed together before starting.'),split:true})}
    ${ProcessTimeline(investorSteps)}
    <aside class="invest-notice mt-lg"><strong>${tx('A kockázatok is a képhez tartoznak.', 'Risks are part of the picture.')}</strong><p>${tx('Az eladási ár, a költségek és az időtartam változhatnak, veszteség is keletkezhet. A minimumhozamra vonatkozó feltételek még nem véglegesek; ez az oldal nem tesz hozamgaranciát. A döntési jogköröket, a költségtúllépést, a kiszállást és az elszámolást az egyedi megállapodásban szükséges rögzíteni.', 'Sale price, costs and duration may change; losses are possible. Minimum-return terms are not yet final and this page provides no return guarantee. Decision-making, overruns, exit and settlement must be defined in an individual agreement.')}</p></aside>
    </div></section>
    ${calculator()}${landing?'':references(false)}
    <section class="section" aria-labelledby="faq-title"><div class="wrap invest-faq">
    ${SectionHeading({eyebrow:tx('Kérdések és válaszok','Questions and answers'),title:tx('Amit érdemes előre tisztázni.', 'What to clarify before starting.'),id:'faq-title'})}
    ${investorFaq.map(f=>`<details><summary>${esc(t(f.q))}</summary><p>${esc(t(f.a))}</p></details>`).join('')}
    </div></section>${enquiry()}
    <div class="invest-mobile-cta">${button()}</div>
    </main>`,
  };
}
