import { site } from './data/site.mjs';
import { projects } from './data/projects.mjs';
import { preparationTasks, preparationFaq } from './data/value-enhancement.mjs';
import { preparationOutcome } from './assets/value-enhancement.mjs';
import { lang, t, href } from './i18n.mjs';
import { esc, Picture, Breadcrumb, BeforeAfterSlider, SectionHeading } from './components.mjs';

const tx = (hu,en) => t({hu,en});
const money = n => new Intl.NumberFormat(lang==='hu'?'hu-HU':'en-GB').format(n)+(lang==='hu'?' Ft':' HUF');
const cta = () => `<a class="btn btn--solid" href="#egyeztetes">${tx('Egyeztetést kérek','Discuss my apartment')}</a>`;
const paths = {
  boxes:'M3 7h7v7H3zM14 10h7v11h-7zM4 18h6M7 15v6M15 3h5v4h-5z',
  sparkle:'m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3z',
  tool:'m14 6 4 4M4 20l10-10M15 3l6 6-4 4-6-6 4-4zM3 17l4 4',
  sofa:'M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 17H3v-5a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H5zM5 17v3M19 17v3',
  sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5',
  camera:'M3 7h4l2-3h6l2 3h4v13H3V7zM12 10a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z',
};
const icon = name => `<svg class="value-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[name]}"></path></svg>`;

function enquiry() {
  const endpoint=site.investorFormEndpoint;
  return `<section class="section section--alt" id="egyeztetes" aria-labelledby="value-enquiry-title"><div class="wrap split split--top">
  <div><span class="eyebrow">${tx('Kezdjük az Ön lakásával','Let’s start with your apartment')}</span><h2 id="value-enquiry-title">${tx('Nézzük meg, mit hozhatunk ki belőle.','Let’s see what we can do with it.')}</h2>
  <p class="lead">${tx('Írja meg, hol van a lakás és milyen állapotban van. Ha már hirdeti, a hirdetés linkjét is elküldheti. Átbeszéljük a lehetőségeket és a következő lépést.','Tell us where the apartment is and its current condition. If it is already listed, you can include the listing link. We will discuss the options and the next step.')}</p>
  <p class="value-small">${tx('A megkeresés még nem jelent megrendelést. A munkákat és a feltételeket indulás előtt egyeztetjük.','An enquiry does not commit you to a service. We agree the work and terms before starting.')}</p>
  <p class="mt-md"><a class="link-arrow" href="${site.phoneHref}">${esc(site.phone)}</a></p></div>
  <form class="form" data-invest-form data-preparation-form data-mailto="${esc(site.email)}" action="mailto:${esc(site.email)}" method="POST" enctype="text/plain" aria-describedby="value-form-note">
    <input type="hidden" name="_subject" value="${tx('Értéknövelés — eladásra felkészítés — Urban Flip Studio','Sale preparation enquiry — Urban Flip Studio')}"><input type="hidden" name="_template" value="table"><input type="hidden" name="_captcha" value="false">
    <div class="value-trap" aria-hidden="true"><label for="value-website">${tx('Hagyja üresen','Leave empty')}</label><input id="value-website" name="_honey" tabindex="-1" autocomplete="off"></div>
    <div class="form__row"><div class="field"><label for="value-name">${tx('Név','Name')} *</label><input id="value-name" name="name" autocomplete="name" maxlength="120" required></div><div class="field"><label for="value-email">E-mail *</label><input id="value-email" name="email" type="email" autocomplete="email" maxlength="180" required></div></div>
    <div class="form__row"><div class="field"><label for="value-location">${tx('Hol van a lakás?','Apartment location')} *</label><input id="value-location" name="location" placeholder="${tx('Pl. Budapest, XI. kerület','E.g. Budapest, District XI')}" maxlength="180" required></div><div class="field"><label for="value-phone">${tx('Telefonszám (nem kötelező)','Phone (optional)')}</label><input id="value-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div></div>
    <div class="field"><label for="value-condition">${tx('Milyen állapotú a lakás?','What condition is the apartment in?')} *</label><select id="value-condition" name="condition" required><option value="">${tx('Válasszon…','Please choose…')}</option>${[
      ['Jó állapotú, de ráférne egy kis frissítés','Good condition, needs a refresh'],['Üres vagy elavult berendezésű','Vacant or dated furnishings'],['Elhanyagolt / felújítandó','Neglected / needs renovation'],['Félkész / befejezésre vár','Unfinished'],['Teljes felújítást szeretnék','I am interested in a full renovation'],
    ].map(([hu,en])=>`<option>${esc(tx(hu,en))}</option>`).join('')}</select></div>
    <div class="field"><label for="value-listing">${tx('A hirdetés linkje (nem kötelező)','Listing link (optional)')}</label><input id="value-listing" name="listing" type="url" placeholder="https://" maxlength="1000"></div>
    <div class="field"><label for="value-message">${tx('A lakás mérete, tervezett eladás, kérdések (nem kötelező)','Apartment size, timing and questions (optional)')}</label><textarea id="value-message" name="message" maxlength="2000" rows="3"></textarea></div>
    <div class="field field--check"><input id="value-consent" name="consent" type="checkbox" required><label for="value-consent">${tx('Adataimat Dobos Martin a megkeresésem megválaszolásához kezeli. Megismertem az','Dobos Martin processes my data to respond to my enquiry. I have read the')} <a href="${href('privacy')}">${tx('adatkezelési tájékoztatót','privacy notice')}</a>. *</label></div>
    <button class="btn btn--solid" type="submit">${tx('E-mail előkészítése','Prepare email')}</button><p class="form__status" role="status" aria-live="polite" tabindex="-1"></p>
    <p class="form__alt" id="value-form-note">${tx('A gomb megnyitja a levelezőjét. Az üzenetet ott kell elküldenie. Ha nem nyílik meg, írjon ide:','The button opens your email app. Send the message there. If no app opens, email')} <a href="mailto:${site.email}">${esc(site.email)}</a>.</p>
    <noscript><p>${tx('JavaScript nélkül írjon közvetlenül a fenti e-mail-címre, vagy használja a levelezőjét.', 'Without JavaScript, email the address above directly or use your email app.')}</p></noscript>
  </form></div></section>`;
}

export function valueEnhancementPage() {
  const key='valueEnhancement';
  const example=preparationOutcome(60e6,65e6);
  const project=projects.find(p=>p.slug==='balazs-bela-utca');
  const crumbs=[{href:href('home'),label:tx('Kezdőlap','Home')},{href:href(key),label:tx('Értéknövelés','Sale preparation')}];
  const description=tx('Saját költségen készítjük fel budapesti lakását az eladásra: rendrakás, festés, kisebb javítások, home staging és fotózás. Jutalék az eladás után.','We fund the agreed preparation of your Budapest apartment for sale: tidying, painting, minor repairs, home staging and photography. Commission payable after the sale.');
  const faq=preparationFaq.map((f,i)=>({q:t(f.q),a:t(f.a)+(i===1?tx(' A feltüntetett díj bruttó végösszeg, további ÁFA nem adódik hozzá.',' The stated fee is the gross total; no VAT is added.'): '')}));
  return {key,valueAssets:true,
    title:tx('Értéknövelés — saját költségünkön készítjük fel lakását az eladásra','Sale preparation — we cover the upfront costs')+' | '+site.name,
    description,ogImage:'balazs-bela-utca/gallery/nappali',
    jsonLd:[
      {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.label,item:site.url+c.href}))},
      {'@context':'https://schema.org','@type':'Service',name:tx('Értéknövelés és eladásra felkészítés','Property sale preparation'),description,url:site.url+href(key),provider:{'@type':'Organization',name:site.name,url:site.url},areaServed:{'@type':'City',name:'Budapest'},inLanguage:lang},
      {'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))},
    ],
    body:`<main id="tartalom" tabindex="-1" class="value-page">
    <section class="value-hero"><div class="wrap">
      ${Breadcrumb(crumbs)}<span class="eyebrow">${tx('Értéknövelés · Budapest','Sale preparation · Budapest')}</span>
      <h1>${tx('Saját költségen szépítjük meg a lakását, hogy jobb áron és gyorsabban adhassa el.','We cover the cost of preparing your apartment to help you sell faster and for a better price.')}</h1>
      <p class="lead">${tx('Rendet teszünk, felfrissítjük, berendezzük és lefotózzuk. A felkészítést mi fizetjük, Ön az eladás után, az eladási árból fizet jutalékot. Az értékesítésben is segítünk.','We tidy, refresh, furnish and photograph your apartment. We pay for the preparation; you pay a commission from the sale proceeds afterwards. We also help with selling.')}</p>
      <ul class="value-promises"><li><strong>${tx('Mi fizetjük','We pay upfront')}</strong><span>${tx('az egyeztetett felkészítést','for the agreed preparation')}</span></li><li><strong>${tx('Eladás után','Pay after selling')}</strong><span>${tx('fizet jutalékot','commission from the proceeds')}</span></li><li><strong>${tx('Az Ön lakása','Your apartment')}</strong><span>${tx('végig az Ön tulajdona marad','stays in your ownership')}</span></li></ul>
      <div class="btn-row">${cta()}<a class="btn btn--line" href="#tartalom-csomag">${tx('Mit tartalmaz?','What is included?')}</a></div>
      <div class="value-comparison">${BeforeAfterSlider(project.beforeAfter[0],{eager:true,sizes:'(min-width: 1280px) 1180px, 100vw'})}</div>
      <p class="caption">${tx('Balázs Béla utca · saját teljes felújításunk előtte és utána. A képek a munkánkat mutatják; az eladásra felkészítés feladatait lakásonként választjuk ki.','Balázs Béla utca · before and after our own full renovation. These images show our work; the sale-preparation scope is chosen for each apartment.')}</p>
    </div></section>

    <section class="section section--alt" id="tartalom-csomag" aria-labelledby="value-tasks-title"><div class="wrap">
      ${SectionHeading({eyebrow:tx('Amit átvállalunk','What we take care of'),title:tx('A lakás legjobb formáját mutatjuk meg.','Show your apartment at its best.'),id:'value-tasks-title',split:true,intro:tx('A felmérés után közösen kiválasztjuk, mire van szükség. A célzott munkákat és a berendezést előre egyeztetjük, a szervezést és a költségeket mi vállaljuk.','After assessing the apartment, we agree which improvements are needed. We define the work and furnishings in advance, then handle the organisation and costs.')})}
      <ul class="value-tasks">${preparationTasks.map(x=>`<li>${icon(x.icon)}<h3>${esc(t(x.title))}</h3><p>${esc(t(x.text))}</p></li>`).join('')}</ul>
    </div></section>

    <section class="section value-pricing" id="jutalek" aria-labelledby="value-fee-title"><div class="wrap value-pricing__grid">
      <div><span class="eyebrow">${tx('Induló kiadás nélkül','No upfront payment')}</span><h2 id="value-fee-title">${tx('Mi előre dolgozunk. Ön az eladás után fizet.','We do the work first. You pay after the sale.')}</h2>
      <p class="lead">${tx('A jutalék a lakás eladási árának 3%-a, de minimum 1,5 millió Ft. Ez fedezi az előre egyeztetett felkészítést; arra külön előleget nem kérünk.','The commission is 3% of the apartment sale price, with a minimum of HUF 1.5 million. It covers the agreed preparation; no separate deposit is required for that work.')}</p>
      <p>${tx('Bruttó végösszeg, további ÁFA nélkül. A díjat az eladás után, a vételárból fizeti.','Gross total, with no VAT added. You pay after the sale, from the proceeds.')}</p>
      <p class="value-small mt-md">${tx('A kiválasztott munkákat, a berendezést, az értékesítésben vállalt feladatokat és az elszámolást indulás előtt rögzítjük.','Before starting, we document the agreed work, furnishings, selling assistance and settlement arrangements.')}</p></div>
      <div class="value-fee" data-preparation-fee><span class="eyebrow">${tx('Mennyivel járhat jobban?','How much more could you keep?')}</span>
        <p class="value-small">${tx('Állítsa be a jelenlegi és a felkészítés utáni eladási árat. A számoló levonja a jutalékunkat is.','Enter the current sale price and the price after preparation. The calculator also deducts our commission.')}</p>
        ${[
          ['original',60,tx('Eladási ár jelenlegi állapotban (millió Ft)','Sale price in current condition (HUF million)')],
          ['prepared',65,tx('Eladási ár felkészítés után (millió Ft)','Sale price after preparation (HUF million)')],
        ].map(([name,value,label])=>`<div class="value-fee__control" data-price-control><label for="value-${name}">${label}</label><div class="value-fee__inputs"><input type="range" min="10" max="300" step="1" value="${value}" aria-label="${label}"><input id="value-${name}" name="${name}" type="number" min="10" max="300" step="1" value="${value}" inputmode="numeric"></div></div>`).join('')}
        <dl class="value-fee__breakdown"><div><dt>${tx('A felkészítés értéktöbblete','Added sale value')}</dt><dd data-uplift-output>${money(example.uplift)}</dd></div><div><dt>${tx('Urbanflip jutaléka, bruttó','Urbanflip commission, gross')}</dt><dd data-fee-output>${money(example.fee)}</dd></div></dl>
        <div class="value-fee__result" role="status" aria-live="polite" aria-atomic="true"><p class="value-fee__label" data-extra-label>${tx('Ennyivel marad több Önnél a jutalék után','Extra proceeds you keep after commission')}</p><output class="value-fee__amount" for="value-original value-prepared" data-extra-output>${money(example.extra)}</output></div>
        <p class="value-small" data-outcome-negative hidden>${tx('Ezekkel az árakkal a magasabb eladási ár nem fedezi a jutalékot.','At these prices, the increase does not cover the commission.')}</p>
        <p class="value-small">${tx('Jutalék: 3% a felkészítés utáni eladási árból, minimum bruttó 1 500 000 Ft. A megadott árakkal számolt példa; a tényleges eladási ár eltérhet.','Commission: 3% of the sale price after preparation, minimum HUF 1,500,000 gross. This is an illustration using your inputs; the actual sale price may differ.')}</p><p class="value-small" data-fee-error hidden>${tx('Mindkét árhoz 10 és 300 közötti egész összeget adjon meg, millió Ft-ban.','For both prices, enter a whole number from 10 to 300, in HUF million.')}</p>
        ${cta()}<noscript><p class="value-small">${tx('A csúszkák JavaScripttel működnek. Példa: 60 helyett 65 milliós eladásnál az 5 millió Ft értéktöbbletből 1,95 millió Ft a jutalék, így 3,05 millió Ft-tal marad több Önnél.','The sliders require JavaScript. Example: selling for HUF 65 million instead of 60 million adds HUF 5 million; commission is HUF 1.95 million, leaving you HUF 3.05 million extra.')}</p></noscript>
      </div>
    </div></section>

    <section class="section" aria-labelledby="value-furniture-title"><div class="wrap split split--top">
      <figure class="media media--43">${Picture('balazs-bela-utca/gallery/nappali',{alt:{hu:'A Balázs Béla utcai saját projektünk berendezett nappalija',en:'The furnished living room from our Balázs Béla utca project'},sizes:'(min-width: 900px) 50vw, 100vw'})}</figure>
      <div><span class="eyebrow">${tx('Berendezés, választási lehetőséggel','Furnishings with a choice')}</span><h2 id="value-furniture-title">${tx('A bútor maradhat. Vagy visszavesszük.','The furniture can stay. Or we take it back.')}</h2>
      <p class="lead">${tx('A vevő így berendezve látja a lakást, és könnyebben elképzeli benne a saját életét.','Buyers see a furnished apartment and can more easily picture living there.')}</p>
      <ul class="value-options"><li><strong>${tx('Ha megtetszik a vevőnek','If the buyer wants it')}</strong><p>${tx('A kiválasztott bútorokat és kiegészítőket külön megállapodással megvásárolhatja.','They can purchase selected furniture and accessories by separate agreement.')}</p></li><li><strong>${tx('Ha nincs rá szükség','If it is not needed')}</strong><p>${tx('Az általunk hozott berendezést visszavesszük; a tulajdonosnak nem kötelező megvennie.','We take back the furnishings we supplied; the owner does not have to buy them.')}</p></li></ul>
      <p class="value-small">${tx('A bútorok külön megvásárlásának ára nem része a jutaléknak.','The separate purchase price of the furniture is not included in the commission.')}</p></div>
    </div></section>

    <section class="section section--alt" aria-labelledby="value-process-title"><div class="wrap">
      ${SectionHeading({eyebrow:tx('Egyszerű menet','A straightforward process'),title:tx('A felméréstől az eladásig.','From assessment to sale.'),id:'value-process-title'})}
      <ol class="value-process">${[
        ['Átbeszéljük a lakást','We discuss your apartment','Megnézzük az állapotát, a jelenlegi hirdetést és az eladási elképzeléseit.','We review its condition, any current listing and your plans for selling.'],
        ['Megállapodunk a feladatokról','We agree the work','Rögzítjük a felkészítés tartalmát, az ütemezést, a jutalékot és a feltételeket.','We document the preparation, schedule, commission and terms.'],
        ['Mi készítjük fel','We prepare it','Megszervezzük és finanszírozzuk az egyeztetett munkákat, a berendezést és a fotózást.','We organise and fund the agreed work, furnishings and photography.'],
        ['Eladás után elszámolunk','We settle after the sale','Segítünk az értékesítésben. A jutalékot az eladás után, a vételárból fizeti ki.','We help with selling. You pay the commission afterwards from the sale proceeds.'],
      ].map(([hu,en,ht,et],i)=>`<li><span aria-hidden="true">0${i+1}</span><h3>${tx(hu,en)}</h3><p>${tx(ht,et)}</p></li>`).join('')}</ol>
    </div></section>

    <section class="section" aria-labelledby="value-renovation-title"><div class="wrap value-renovation">
      <div><span class="eyebrow">${tx('Ha nagyobb munkára van szükség','When more work is needed')}</span><h2 id="value-renovation-title">${tx('Teljes felújítást és korszerűsítést is vállalunk.','We also offer full renovation and modernisation.')}</h2>
      <p>${tx('Felújítandó vagy félkész lakásnál is érdemes egyeztetnünk. Ha a célhoz több kell egy felfrissítésnél, külön ajánlatot adunk a szükséges munkákra.','We can also discuss apartments needing renovation or completion. Where a refresh is not enough, we quote separately for the necessary work.')}</p>
      <p class="value-small">${tx('A teljes felújítás és a nagyobb műszaki korszerűsítés külön, a tulajdonos által finanszírozott megrendelés.','Full renovation and substantial technical upgrades are separate, owner-funded projects.')}</p><a class="link-arrow" href="${href('services')}#felujitas">${tx('A felújítás részletei','Explore renovation services')}</a></div>
      <figure class="media media--43">${Picture('site/munka-kozben',{alt:{hu:'Festés előkészítése saját lakásprojektünkben',en:'Preparing paint for one of our own apartment projects'},sizes:'(min-width: 900px) 40vw, 100vw',objectPosition:'55% 65%'})}</figure>
    </div></section>

    <section class="section section--alt" aria-labelledby="value-faq-title"><div class="wrap value-faq">
      ${SectionHeading({eyebrow:tx('Kérdések és válaszok','Questions and answers'),title:tx('Amit még érdemes tudnia.','What else you may want to know.'),id:'value-faq-title'})}
      ${faq.map(f=>`<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
    </div></section>
    ${enquiry()}
    <div class="value-mobile-cta">${cta()}</div>
    </main>`.replace(/[ \t]+\n/g,'\n'),
  };
}
