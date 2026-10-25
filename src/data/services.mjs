// Szolgáltatások — a kezdőlap előnézete és a /szolgaltatasok oldal is ebből épül.
// A slug a horgony (#felujitas) mindkét nyelven.
export const services = [
  {
    slug: 'felujitas',
    title: { hu: 'Teljes körű lakásfelújítás', en: 'Full-scope apartment renovation' },
    short: { hu: 'Teljes körű felújítás', en: 'Full renovation' },
    teaser: { hu: 'A bontástól a kész lakásig mi szervezzük a munkát.', en: 'We organise the work from demolition to the finished apartment.' },
    image: 'site/felujitas-parketta', // a tulajdonos választotta (2026-10-06): a csapat halszálkás parkettát fektet
    imagePosition: '50% 40%',
    text: {
      hu: 'A bontástól az átadásig mi szervezzük a felújítást. Egyeztetünk a szakemberekkel, intézzük a beszerzést, és ellenőrizzük az elkészült munkát. Önnek egy kapcsolattartóval kell egyeztetnie.',
      en: 'From demolition to the handover of the finished apartment, we organise and manage the entire build. We coordinate the trades, keep track of the schedule and make sure the technical solutions match the design.',
    },
    listTitle: { hu: 'Fő munkaterületek', en: 'Main areas of work' },
    list: {
      hu: [
        'állapotfelmérés', 'bontás', 'falazás és gipszkartonozás', 'villanyszerelés',
        'víz- és gépészeti munkák', 'burkolás', 'festés', 'padlózás', 'világítás',
        'szaniterek', 'konyha és egyedi bútorok', 'szakemberek szervezése', 'ütemezés', 'beszerzés', 'átadás',
      ],
      en: [
        'condition survey', 'demolition', 'masonry and drywall', 'electrical work',
        'plumbing and mechanical work', 'tiling', 'painting', 'flooring', 'lighting',
        'sanitaryware', 'kitchen and custom furniture', 'coordination of trades', 'scheduling', 'procurement', 'handover',
      ],
    },
    note: {
      hu: 'A munkát az adott feladathoz értő szakemberek végzik. Mi szervezzük őket, és velünk tud egyeztetni a felújításról.',
      en: 'The work is carried out by specialists and trades suited to the project; organisation, coordination and communication all run through us.',
    },
  },
  {
    slug: 'tervezes',
    title: { hu: 'Alaprajzi és műszaki tervezés', en: 'Technical and spatial planning' },
    short: { hu: 'Tervezés', en: 'Design' },
    teaser: { hu: 'Előre megtervezzük az alaprajzot, a világítást és az anyagokat.', en: 'Layout, functions, light and materials — before construction starts.' },
    image: 'vamhaz-korut/floorplans/fo-szint',
    // a /szolgaltatasok oldalon a kép helyett lapozható tervsorozat (PlanCarousel) — a Vámház körúti projekt tervei
    plans: 'vamhaz-korut',
    text: {
      hu: 'Felmérjük a lakást, és átbeszéljük, mire van szüksége. Megtervezzük a helyiségek elrendezését, a világítást és az anyagokat, hogy a kivitelezés előtt tiszták legyenek a fontos döntések.',
      en: 'Good decisions start with the floor plan. We survey the apartment, organise your requirements and create a plan in which functions, light and materials work together.',
    },
    listTitle: { hu: 'A tervezés tartalma', en: 'What the design covers' },
    list: {
      hu: [
        'igényfelmérés', 'helyszíni felmérés', 'térszervezés', 'alaprajzi koncepció', 'funkciók kialakítása',
        'hangulat és színvilág', 'világítás', 'burkolatok és anyagok', 'szaniterek',
        'konyha és beépített bútorok', 'műszaki egyeztetés',
      ],
      en: [
        'brief', 'site survey', 'spatial planning', 'layout concept', 'functional zoning',
        'mood and colour palette', 'lighting', 'finishes and materials', 'sanitaryware',
        'kitchen and built-in furniture', 'technical coordination',
      ],
    },
  },
  {
    slug: 'lakberendezes',
    title: { hu: 'Enteriőrtervezés és lakberendezés', en: 'Interior design and furnishing' },
    short: { hu: 'Lakberendezés', en: 'Interiors' },
    teaser: { hu: 'Segítünk kiválasztani a bútorokat, a színeket és a kiegészítőket.', en: 'Help choosing furniture, colours and finishing touches.' },
    image: 'balazs-bela-utca/gallery/nappali',
    text: {
      hu: 'Segítünk kiválasztani a burkolatokat, a lámpákat, a bútorokat és a textileket. Olyan lakást tervezünk, amely illik Önhöz, és a mindennapokban is kényelmes.',
      en: 'We help you choose finishes, lighting, furniture and textiles. The aim is a home that feels like yours and is comfortable to live in.',
    },
    listTitle: { hu: 'Amiben segítünk', en: 'How we help' },
    list: {
      hu: ['anyag- és termékválasztás', 'egyedi és beépített bútorok tervezése, beszerzése', 'világítás', 'berendezés', 'styling'],
      en: ['material and product selection', 'coordination of custom and built-in furniture', 'lighting', 'furnishing', 'styling'],
    },
  },
  {
    slug: 'home-staging',
    title: { hu: 'Eladás vagy kiadás előtti home staging', en: 'Home staging before sale or rental' },
    short: { hu: 'Home staging', en: 'Home staging' },
    teaser: { hu: 'Felkészítjük a lakást az eladásra vagy a kiadásra.', en: 'Targeted improvements before selling or letting.' },
    image: 'gozmozdony-utca/gallery/nappali',
    text: {
      hu: 'Eladás vagy kiadás előtt rendbe tesszük és berendezzük a lakást, hogy a fotókon és a megtekintéskor is jól mutasson. Ez lehet néhány javítás, festés, új lámpák, bútorok átrendezése vagy dekorálás.',
      en: 'Before a sale or rental, targeted improvements make the property more attractive and photogenic. Home staging can include minor repairs, painting, updated lighting, furnishing, rearranging, styling and preparing the property for the photo shoot.',
    },
    listTitle: { hu: 'Lehetséges elemek', en: 'Possible elements' },
    list: {
      hu: ['kisebb javítások', 'festés', 'világításfrissítés', 'bútorozás és átrendezés', 'dekoráció', 'előkészítés a fotózásra'],
      en: ['minor repairs', 'painting', 'updated lighting', 'furnishing and rearranging', 'styling', 'preparation for the photo shoot'],
    },
    note: {
      hu: 'Home staginget teljes felújítás nélkül is vállalunk.',
      en: 'Home staging can be booked on its own as a smaller service — no full renovation needed.',
    },
  },
  {
    slug: 'reszleges-felujitas',
    title: { hu: 'Részleges felújítás és felfrissítés', en: 'Partial renovation and refresh' },
    short: { hu: 'Részleges felújítás', en: 'Partial renovation' },
    teaser: { hu: 'Egy konyhát, fürdőszobát vagy egyetlen szobát is felújítunk.', en: 'When not everything needs rethinking.' },
    image: 'balazs-bela-utca/after/konyha',
    text: {
      hu: 'Ha csak a lakás egy részén változtatna, abban is segítünk. Vállalunk konyha- és fürdőszoba-felújítást, burkolást, festést vagy a világítás cseréjét is.',
      en: 'Not every apartment needs a complete overhaul. A new kitchen, a bathroom, new flooring, paint or lighting can change a lot — in these cases we build on what is already there.',
    },
  },
  {
    slug: 'befektetoi-egyuttmukodes',
    pageKey: 'investors',
    title: { hu: 'Befektetői együttműködés', en: 'Investor partnership' },
    short: { hu: 'Befektetői együttműködés', en: 'Investor partnership' },
    teaser: { hu: 'Ön finanszírozza a lakásvásárlást és a felújítást. Mi intézzük a projektet az eladásig, a nettó profiton fele-fele arányban osztozunk.', en: 'You fund the apartment purchase and renovation. We manage the project through to sale and share the net profit equally.' },
    image: 'vamhaz-korut/after/nappali-szemben',
    text: {
      hu: 'Budapesti lakást keresünk, megvesszük az Ön nevére, felújítjuk és eladjuk. Ön biztosítja a vásárlás és a felújítás költségét, mi szervezzük a teljes projektet. Az elszámolt projektköltségek után fennmaradó nettó profitot 50–50%-ban osztjuk meg, a lakás az eladásig az Ön tulajdona.',
      en: 'We find a Budapest apartment, buy it in your name, renovate it and sell it. You fund the purchase and renovation; we manage the entire project. After accounted project costs, we split the net profit 50–50. The apartment stays in your ownership until the sale.',
    },
    note: {
      hu: 'Önnek nem kell hirdetéseket böngésznie, szakembereket hívogatnia vagy a helyszínre járnia. A feltételeket, a hozamgaranciát, a kalkulátort és a befektetői referenciákat külön oldalon találja.',
      en: 'You do not need to search listings, coordinate trades or visit the site. Our dedicated investor page covers the terms, return guarantee, calculator and investment case studies.',
    },
    cta: { hu: 'Megnézem a befektetési lehetőséget', en: 'Explore the investor partnership' },
    listTitle: { hu: 'Amit a projektben intézünk', en: 'What we handle' },
    list: {
      hu: ['lakáskeresés és vételi egyeztetés', 'tervezés és költségvetés', 'felújítás és berendezés', 'értékesítés és elszámolás'],
      en: ['property search and purchase negotiations', 'design and budgeting', 'renovation and furnishing', 'sale and settlement'],
    },
  },
];

export const featuredServiceSlugs = ['felujitas', 'befektetoi-egyuttmukodes', 'tervezes', 'lakberendezes', 'home-staging', 'reszleges-felujitas'];

// Az űrlap szolgáltatás-választója
export const formServices = {
  hu: ['Teljes körű felújítás', 'Tervezés', 'Lakberendezés', 'Home staging', 'Egyéb'],
  en: ['Full renovation', 'Design', 'Interiors', 'Home staging', 'Other'],
};
