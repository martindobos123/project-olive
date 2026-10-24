// Központi webhely-adatok. Minden oldal innen veszi a márkát, az elérhetőségeket és a navigációt.
// A nyelvfüggő szövegek { hu, en } objektumok (lásd src/i18n.mjs).
export const site = {
  name: 'Urban Flip Studio',
  url: 'https://urbanflipstudio.com',
  locale: { hu: 'hu_HU', en: 'en_GB' },
  city: 'Budapest',
  phone: '+36 70 604 3807',
  phoneHref: 'tel:+36706043807',
  email: 'martindobos123@gmail.com',
  whatsapp: 'https://wa.me/36706043807',
  instagram: 'https://www.instagram.com/urbanflipstudio/',
  // ChatGPT Ads Manager — OpenAI Measurement Pixel azonosító (Ads Manager → Conversions → Pixel).
  // Üresen a Pixel NEM települ és a CSP sem bővül; a kapcsolat-kattintás mérés kódja (site.js) készen
  // várja. Helyőrzőt NEM írunk ide — csak a valódi ID-t (a tulajdonostól).
  oaiPixelId: '',
  // TODO: valódi űrlap-fogadó végpont (pl. Formspree / saját backend). Amíg üres, az űrlap
  // a látogató levelezőprogramjában nyit egy előre kitöltött e-mailt — nem jelez hamis sikert.
  // Ha megadod, a Content-Security-Policy form-action / connect-src listájába is fel kell venni.
  formEndpoint: '',
  // Public FormSubmit endpoint; no secret key is shipped to the browser.
  investorFormEndpoint: 'https://formsubmit.co/ajax/martindobos123@gmail.com',
  // GoatCounter kód (süti nélküli látogatásmérés). Üresen inaktív.
  goatcounter: '',
  // Adatkezelési tájékoztató: saját oldal (src/i18n.mjs 'privacy' útvonal, src/pages.mjs privacy()).
  // Az adatkezelő cégszerű adatait (cégnév/székhely/adószám) a tulajdonos pótolja — lásd privacy().
  defaultOgImage: 'vamhaz-korut/after/nappali-szemben',
  tagline: {
    hu: 'Teljes körű lakásfelújítás, enteriőrtervezés és home staging Budapesten.',
    en: 'Full-scope apartment renovation, interior design and home staging in Budapest.',
  },
  // key = route-kulcs (src/i18n.mjs); hash = horgony a céloldalon
  nav: [
    { label: { hu: 'Szolgáltatások', en: 'Services' }, key: 'services' },
    { label: { hu: 'Projektek', en: 'Projects' }, key: 'projects' },
    { label: { hu: 'Befektetőknek', en: 'Investors' }, key: 'investors' },
    { label: { hu: 'Folyamat', en: 'Process' }, key: 'home', hash: 'process' },
    { label: { hu: 'Rólunk', en: 'About' }, key: 'about' },
    { label: { hu: 'Kapcsolat', en: 'Contact' }, key: 'contact' },
  ],
  headerCta: { label: { hu: 'Felújítást tervezek', en: 'Plan a project' }, key: 'contact' },
};

export const process = {
  intro: {
    hu: 'Előre megbeszéljük, mit szeretne, mennyibe kerülhet és mikorra készülhet el. Ezután mi szervezzük a szakembereket, és végig követjük a munkát.',
    en: 'We agree on what you want, the budget and the schedule before work starts. Then we organise the trades and keep track of the work.',
  },
  steps: [
    {
      title: { hu: 'Konzultáció és igényfelmérés', en: 'Consultation and brief' },
      text: { hu: 'Átbeszéljük, mit szeretne a lakással, hogyan használná és mennyit szán rá. Ebből derül ki, milyen felújításra van szükség.', en: 'We talk through your plans for the apartment, how you would use it and your budget. That helps us work out what needs changing.' },
    },
    {
      title: { hu: 'Helyszíni felmérés és ajánlat', en: 'Site survey and quote' },
      text: { hu: 'Megnézzük a lakást, felmérjük az állapotát, és elkészítjük az ajánlatot.', en: 'We survey the technical condition and features of the apartment, then prepare a quote based on what we find.' },
    },
    {
      title: { hu: 'Tervezés és anyagválasztás', en: 'Design and material selection' },
      text: { hu: 'Térszervezés, világítás, burkolatok, szaniterek, konyha és beépített bútorok — a döntések a kivitelezés előtt születnek meg.', en: 'Layout, lighting, finishes, sanitaryware, kitchen and built-in furniture — the decisions are made before construction starts.' },
    },
    {
      title: { hu: 'A felújítás megszervezése', en: 'Construction and coordination' },
      text: { hu: 'Mi egyeztetünk a szakemberekkel, szervezzük a munkát, és ellenőrizzük, hogy minden a tervek szerint készüljön el.', en: 'We coordinate and lead the trades, track the schedule and make sure the build follows the design.' },
    },
    {
      title: { hu: 'Berendezés, styling és átadás', en: 'Furnishing, styling and handover' },
      text: { hu: 'Bútorok, textilek, lámpák és a záró részletek a helyükre kerülnek, majd közösen átvesszük a kész lakást.', en: 'Furniture, textiles, lighting and the finishing touches go in, then we walk through the finished apartment together.' },
    },
  ],
};

export const why = [
  { hu: 'A tervezéstől az átadásig velünk egyeztet', en: 'Work with us from the first plans to handover' },
  { hu: 'Egy kapcsolattartó intézi a szakembereket', en: 'One contact who organises the trades' },
  { hu: 'A műszaki részletekre és a berendezésre is figyelünk', en: 'Attention to both the building work and the furnishings' },
  { hu: 'Egyszerre kevés munkát vállalunk, hogy mindegyikre legyen időnk', en: 'Only a few projects at a time, so we have time for each one' },
];
