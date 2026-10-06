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
  // TODO: valódi űrlap-fogadó végpont (pl. Formspree / saját backend). Amíg üres, az űrlap
  // a látogató levelezőprogramjában nyit egy előre kitöltött e-mailt — nem jelez hamis sikert.
  // Ha megadod, a Content-Security-Policy form-action / connect-src listájába is fel kell venni.
  formEndpoint: '',
  // GoatCounter kód (süti nélküli látogatásmérés). Üresen inaktív.
  goatcounter: '',
  // TODO: adatkezelési tájékoztató — jogi ellenőrzés után külön oldalra; addig nincs link.
  privacyUrl: '',
  defaultOgImage: 'vamhaz-korut/gallery/nappali-galeria',
  tagline: {
    hu: 'Teljes körű lakásfelújítás, enteriőrtervezés és home staging Budapesten.',
    en: 'Full-scope apartment renovation, interior design and home staging in Budapest.',
  },
  // key = route-kulcs (src/i18n.mjs); hash = horgony a céloldalon
  nav: [
    { label: { hu: 'Szolgáltatások', en: 'Services' }, key: 'services' },
    { label: { hu: 'Projektek', en: 'Projects' }, key: 'projects' },
    { label: { hu: 'Folyamat', en: 'Process' }, key: 'home', hash: 'process' },
    { label: { hu: 'Rólunk', en: 'About' }, key: 'about' },
    { label: { hu: 'Kapcsolat', en: 'Contact' }, key: 'contact' },
  ],
  headerCta: { label: { hu: 'Projektet tervezek', en: 'Plan a project' }, key: 'contact' },
};

export const process = {
  intro: {
    hu: 'Átlátható folyamat, kevesebb bizonytalanság. A döntéseket előre rendszerezzük, a kivitelezés során pedig egy kézben tartjuk a szakágakat és a részleteket.',
    en: 'A transparent process with fewer unknowns. We settle decisions up front, and during construction we keep the trades and the details in one pair of hands.',
  },
  steps: [
    {
      title: { hu: 'Konzultáció és igényfelmérés', en: 'Consultation and brief' },
      text: { hu: 'Megismerjük az ingatlant, az elképzeléseket, a használati igényeket és a kereteket. Itt dől el, milyen mélységű beavatkozásra van szükség.', en: 'We get to know the property, your ideas, how you want to live in it and your budget. This is where we decide how deep the intervention needs to go.' },
    },
    {
      title: { hu: 'Helyszíni felmérés és ajánlat', en: 'Site survey and quote' },
      text: { hu: 'Felmérjük a lakás műszaki állapotát és adottságait, majd a feltárt információk alapján elkészítjük az ajánlatot.', en: 'We survey the technical condition and features of the apartment, then prepare a quote based on what we find.' },
    },
    {
      title: { hu: 'Tervezés és anyagválasztás', en: 'Design and material selection' },
      text: { hu: 'Térszervezés, világítás, burkolatok, szaniterek, konyha és beépített bútorok — a döntések a kivitelezés előtt születnek meg.', en: 'Layout, lighting, finishes, sanitaryware, kitchen and built-in furniture — the decisions are made before construction starts.' },
    },
    {
      title: { hu: 'Kivitelezés és koordináció', en: 'Construction and coordination' },
      text: { hu: 'Összehangoljuk és vezetjük a szakágakat, követjük az ütemezést, és figyeljük, hogy a megvalósítás a tervet kövesse.', en: 'We coordinate and lead the trades, track the schedule and make sure the build follows the design.' },
    },
    {
      title: { hu: 'Berendezés, styling és átadás', en: 'Furnishing, styling and handover' },
      text: { hu: 'Bútorok, textilek, lámpák és a záró részletek a helyükre kerülnek, majd közösen átvesszük a kész lakást.', en: 'Furniture, textiles, lighting and the finishing touches go in, then we walk through the finished apartment together.' },
    },
  ],
};

export const why = [
  { hu: 'A tervezés és a kivitelezés együtt halad', en: 'Design and construction move forward together' },
  { hu: 'Egy kapcsolattartó, összehangolt szakágak', en: 'One point of contact, coordinated trades' },
  { hu: 'Esztétikai és műszaki döntések egy rendszerben', en: 'Aesthetic and technical decisions in one system' },
  { hu: 'Egyszerre kevés projekt — mindegyikre oda tudunk figyelni', en: 'Only a few projects at a time — each one gets our full attention' },
];
