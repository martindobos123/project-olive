// Központi webhely-adatok. Minden oldal innen veszi a márkát, az elérhetőségeket és a navigációt.
export const site = {
  name: 'Urban Flip Studio',
  url: 'https://urbanflipstudio.com',
  locale: 'hu_HU',
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
  nav: [
    { label: 'Szolgáltatások', href: '/szolgaltatasok/' },
    { label: 'Projektek', href: '/projektek/' },
    { label: 'Folyamat', href: '/#folyamat' },
    { label: 'Rólunk', href: '/rolunk/' },
    { label: 'Kapcsolat', href: '/kapcsolat/' },
  ],
  headerCta: { label: 'Projektet tervezek', href: '/kapcsolat/' },
};

export const process = {
  intro: 'Átlátható folyamat, kevesebb bizonytalanság. A döntéseket előre rendszerezzük, a kivitelezés során pedig egy kézben tartjuk a szakágakat és a részleteket.',
  steps: [
    { title: 'Konzultáció és igényfelmérés', text: 'Megismerjük az ingatlant, az elképzeléseket, a használati igényeket és a kereteket. Itt dől el, milyen mélységű beavatkozásra van szükség.' },
    { title: 'Helyszíni felmérés és ajánlat', text: 'Felmérjük a lakás műszaki állapotát és adottságait, majd a feltárt információk alapján elkészítjük az ajánlatot.' },
    { title: 'Tervezés és anyagválasztás', text: 'Térszervezés, világítás, burkolatok, szaniterek, konyha és beépített bútorok — a döntések a kivitelezés előtt születnek meg.' },
    { title: 'Kivitelezés és koordináció', text: 'Összehangoljuk és vezetjük a szakágakat, követjük az ütemezést, és figyeljük, hogy a megvalósítás a tervet kövesse.' },
    { title: 'Berendezés, styling és átadás', text: 'Bútorok, textilek, lámpák és a záró részletek a helyükre kerülnek, majd közösen átvesszük a kész lakást.' },
  ],
};

export const why = [
  'A tervezés és a kivitelezés együtt halad',
  'Egy kapcsolattartó, összehangolt szakágak',
  'Esztétikai és műszaki döntések egy rendszerben',
  'A részletek az első tervtől az átadásig követhetők',
];
