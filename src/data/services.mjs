// Szolgáltatások — a kezdőlap előnézete és a /szolgaltatasok oldal is ebből épül.
export const services = [
  {
    slug: 'felujitas',
    title: 'Teljes körű lakásfelújítás',
    short: 'Teljes körű felújítás',
    teaser: 'A bontástól az átadásig egy kézben a kivitelezés.',
    image: 'gozmozdony-utca/after/konyha',
    text: 'A bontástól a kész lakás átadásáig megszervezzük és összefogjuk a teljes kivitelezést. Koordináljuk a szakágakat, követjük az ütemezést, és gondoskodunk arról, hogy a műszaki megoldások összhangban legyenek a tervekkel.',
    listTitle: 'Fő munkaterületek',
    list: [
      'állapotfelmérés', 'bontás', 'falazás és gipszkartonozás', 'villanyszerelés',
      'víz- és gépészeti munkák', 'burkolás', 'festés', 'padlózás', 'világítás',
      'szaniterek', 'konyha és egyedi bútorok', 'szakágak koordinációja', 'ütemezés', 'beszerzés', 'átadás',
    ],
    note: 'A munkákat a projekthez illő szakemberekkel és szakágakkal valósítjuk meg; a szervezés, az összehangolás és a kapcsolattartás nálunk fut össze.',
  },
  {
    slug: 'tervezes',
    title: 'Műszaki és térszervezési tervezés',
    short: 'Tervezés',
    teaser: 'Alaprajz, funkciók, fények és anyagok — még a kivitelezés előtt.',
    image: 'vamhaz-korut/floorplans/fo-szint',
    text: 'A jó döntések az alaprajznál kezdődnek. Felmérjük a lakást, rendszerezzük az igényeket, és olyan tervet készítünk, amelyben a funkciók, a fények és az anyagok együtt működnek.',
    listTitle: 'A tervezés tartalma',
    list: [
      'igényfelmérés', 'helyszíni felmérés', 'térszervezés', 'alaprajzi koncepció', 'funkciók kialakítása',
      'hangulat és színvilág', 'világítás', 'burkolatok és anyagok', 'szaniterek',
      'konyha és beépített bútorok', 'műszaki egyeztetés',
    ],
  },
  {
    slug: 'lakberendezes',
    title: 'Enteriőrtervezés és lakberendezés',
    short: 'Lakberendezés',
    teaser: 'Egységes enteriőr a tér arányaitól a textilekig.',
    image: 'balazs-bela-utca/gallery/nappali',
    text: 'A tér arányaitól a világításon és bútorokon át a textilekig egységes enteriőrt alakítunk ki. A cél nem egy gyorsan múló trend, hanem egy következetes, használható és személyes otthon.',
    listTitle: 'Amiben segítünk',
    list: ['anyag- és termékválasztás', 'egyedi bútorok és beépített megoldások koordinációja', 'világítás', 'berendezés', 'styling'],
  },
  {
    slug: 'home-staging',
    title: 'Eladás vagy kiadás előtti home staging',
    short: 'Home staging',
    teaser: 'Célzott beavatkozások eladás vagy kiadás előtt.',
    image: 'gozmozdony-utca/gallery/nappali',
    text: 'Eladás vagy kiadás előtt célzott beavatkozásokkal tesszük vonzóbbá és fotózhatóbbá az ingatlant. A home staging lehet kisebb javítás, festés, világításfrissítés, bútorozás, átrendezés, dekoráció és az ingatlan fotózásra való előkészítése.',
    listTitle: 'Lehetséges elemek',
    list: ['kisebb javítások', 'festés', 'világításfrissítés', 'bútorozás és átrendezés', 'dekoráció', 'előkészítés a fotózásra'],
    note: 'A home staging önállóan, kisebb volumenű szolgáltatásként is kérhető — nem kell hozzá teljes felújítás.',
  },
  {
    slug: 'reszleges-felujitas',
    title: 'Részleges felújítás és „ráncfelvarrás”',
    short: 'Részleges felújítás',
    teaser: 'Amikor nem kell mindent újragondolni.',
    text: 'Nem minden lakásnak van szüksége teljes átalakításra. Egy konyha, egy fürdőszoba, új burkolat, festés vagy világítás is sokat változtathat — ilyenkor a meglévő adottságokra építünk.',
  },
];

export const featuredServiceSlugs = ['felujitas', 'tervezes', 'lakberendezes', 'home-staging'];

// Az űrlap szolgáltatás-választója
export const formServices = ['Teljes körű felújítás', 'Tervezés', 'Lakberendezés', 'Home staging', 'Egyéb'];
