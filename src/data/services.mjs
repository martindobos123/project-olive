// Szolgáltatások — a kezdőlap előnézete és a /szolgaltatasok oldal is ebből épül.
// A slug a horgony (#felujitas) mindkét nyelven.
export const services = [
  {
    slug: 'felujitas',
    title: { hu: 'Teljes körű lakásfelújítás', en: 'Full-scope apartment renovation' },
    short: { hu: 'Teljes körű felújítás', en: 'Full renovation' },
    teaser: { hu: 'A bontástól az átadásig egy kézben a kivitelezés.', en: 'From demolition to handover, the build in one pair of hands.' },
    image: 'gozmozdony-utca/after/konyha',
    text: {
      hu: 'A bontástól a kész lakás átadásáig megszervezzük és összefogjuk a teljes kivitelezést. Koordináljuk a szakágakat, követjük az ütemezést, és gondoskodunk arról, hogy a műszaki megoldások összhangban legyenek a tervekkel.',
      en: 'From demolition to the handover of the finished apartment, we organise and manage the entire build. We coordinate the trades, keep track of the schedule and make sure the technical solutions match the design.',
    },
    listTitle: { hu: 'Fő munkaterületek', en: 'Main areas of work' },
    list: {
      hu: [
        'állapotfelmérés', 'bontás', 'falazás és gipszkartonozás', 'villanyszerelés',
        'víz- és gépészeti munkák', 'burkolás', 'festés', 'padlózás', 'világítás',
        'szaniterek', 'konyha és egyedi bútorok', 'szakágak koordinációja', 'ütemezés', 'beszerzés', 'átadás',
      ],
      en: [
        'condition survey', 'demolition', 'masonry and drywall', 'electrical work',
        'plumbing and mechanical work', 'tiling', 'painting', 'flooring', 'lighting',
        'sanitaryware', 'kitchen and custom furniture', 'coordination of trades', 'scheduling', 'procurement', 'handover',
      ],
    },
    note: {
      hu: 'A munkákat a projekthez illő szakemberekkel és szakágakkal valósítjuk meg; a szervezés, az összehangolás és a kapcsolattartás nálunk fut össze.',
      en: 'The work is carried out by specialists and trades suited to the project; organisation, coordination and communication all run through us.',
    },
  },
  {
    slug: 'tervezes',
    title: { hu: 'Műszaki és térszervezési tervezés', en: 'Technical and spatial planning' },
    short: { hu: 'Tervezés', en: 'Design' },
    teaser: { hu: 'Alaprajz, funkciók, fények és anyagok — még a kivitelezés előtt.', en: 'Layout, functions, light and materials — before construction starts.' },
    image: 'vamhaz-korut/floorplans/fo-szint',
    text: {
      hu: 'A jó döntések az alaprajznál kezdődnek. Felmérjük a lakást, rendszerezzük az igényeket, és olyan tervet készítünk, amelyben a funkciók, a fények és az anyagok együtt működnek.',
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
    teaser: { hu: 'Egységes enteriőr a tér arányaitól a textilekig.', en: 'A coherent interior, from proportions to textiles.' },
    image: 'balazs-bela-utca/gallery/nappali',
    text: {
      hu: 'A tér arányaitól a világításon és bútorokon át a textilekig egységes enteriőrt alakítunk ki. A cél nem egy gyorsan múló trend, hanem egy következetes, használható és személyes otthon.',
      en: 'From the proportions of the space through lighting and furniture to textiles, we create a coherent interior. The goal is not a passing trend but a consistent, practical and personal home.',
    },
    listTitle: { hu: 'Amiben segítünk', en: 'How we help' },
    list: {
      hu: ['anyag- és termékválasztás', 'egyedi bútorok és beépített megoldások koordinációja', 'világítás', 'berendezés', 'styling'],
      en: ['material and product selection', 'coordination of custom and built-in furniture', 'lighting', 'furnishing', 'styling'],
    },
  },
  {
    slug: 'home-staging',
    title: { hu: 'Eladás vagy kiadás előtti home staging', en: 'Home staging before sale or rental' },
    short: { hu: 'Home staging', en: 'Home staging' },
    teaser: { hu: 'Célzott beavatkozások eladás vagy kiadás előtt.', en: 'Targeted improvements before selling or letting.' },
    image: 'gozmozdony-utca/gallery/nappali',
    text: {
      hu: 'Eladás vagy kiadás előtt célzott beavatkozásokkal tesszük vonzóbbá és fotózhatóbbá az ingatlant. A home staging lehet kisebb javítás, festés, világításfrissítés, bútorozás, átrendezés, dekoráció és az ingatlan fotózásra való előkészítése.',
      en: 'Before a sale or rental, targeted improvements make the property more attractive and photogenic. Home staging can include minor repairs, painting, updated lighting, furnishing, rearranging, styling and preparing the property for the photo shoot.',
    },
    listTitle: { hu: 'Lehetséges elemek', en: 'Possible elements' },
    list: {
      hu: ['kisebb javítások', 'festés', 'világításfrissítés', 'bútorozás és átrendezés', 'dekoráció', 'előkészítés a fotózásra'],
      en: ['minor repairs', 'painting', 'updated lighting', 'furnishing and rearranging', 'styling', 'preparation for the photo shoot'],
    },
    note: {
      hu: 'A home staging önállóan, kisebb volumenű szolgáltatásként is kérhető — nem kell hozzá teljes felújítás.',
      en: 'Home staging can be booked on its own as a smaller service — no full renovation needed.',
    },
  },
  {
    slug: 'reszleges-felujitas',
    title: { hu: 'Részleges felújítás és „ráncfelvarrás”', en: 'Partial renovation and refresh' },
    short: { hu: 'Részleges felújítás', en: 'Partial renovation' },
    teaser: { hu: 'Amikor nem kell mindent újragondolni.', en: 'When not everything needs rethinking.' },
    text: {
      hu: 'Nem minden lakásnak van szüksége teljes átalakításra. Egy konyha, egy fürdőszoba, új burkolat, festés vagy világítás is sokat változtathat — ilyenkor a meglévő adottságokra építünk.',
      en: 'Not every apartment needs a complete overhaul. A new kitchen, a bathroom, new flooring, paint or lighting can change a lot — in these cases we build on what is already there.',
    },
  },
];

export const featuredServiceSlugs = ['felujitas', 'tervezes', 'lakberendezes', 'home-staging'];

// Az űrlap szolgáltatás-választója
export const formServices = {
  hu: ['Teljes körű felújítás', 'Tervezés', 'Lakberendezés', 'Home staging', 'Egyéb'],
  en: ['Full renovation', 'Design', 'Interiors', 'Home staging', 'Other'],
};
