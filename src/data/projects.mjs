// Projektek — a referencia-oldalak, a kezdőlap kártyái és a sitemap is ebből épül.
//
// Szabály: ismeretlen adatot NEM találunk ki. Ami nincs ellenőrizve, az `null` / TODO,
// és a sablon nem jeleníti meg (lásd ProjectFacts). Az album-dátumokat szándékosan nem
// használjuk projektidőként. A kivitelezési időt (3 hónap) és a Vámház nappali-képpárt a
// tulajdonos erősítette meg (2026-10-05).
//
// beforeAfter párosítás (képmanifest):
//   displayMode 'slider'      — csak ha a két kép ugyanabból a nézőpontból készült
//   displayMode 'side-by-side' — ugyanaz a helyiség, de eltérő kameraállás
//   A két kép soha nincs tükrözve, torzítva vagy AI-val módosítva.

const BUDAPEST = { hu: 'Budapest', en: 'Budapest' };
const BUILD_TIME = { label: { hu: 'Kivitelezési idő', en: 'Build time' }, value: { hu: '3 hónap', en: '3 months' } };

export const projects = [
  {
    slug: 'vamhaz-korut',
    title: { hu: 'Vámház körút', en: 'Vámház körút' },
    subtitle: 'Project Olive',
    location: { hu: 'Vámház körút, Kálvin tér környéke, Budapest', en: 'Vámház körút, near Kálvin tér, Budapest' },
    shortLocation: { hu: 'Budapest, Kálvin tér környéke', en: 'Budapest, near Kálvin tér' },
    summary: {
      hu: 'Egy 79 m²-es, különleges adottságú belvárosi lakás teljes újragondolása. A közel négyméteres belmagasságot, a nagy ablakokat és a műemléki környezet karakterét kortárs, természetes és részletgazdag enteriőrrel egészítettük ki.',
      en: 'A complete rethink of a 79 m² downtown apartment with exceptional features. We complemented the almost four-metre ceilings, the large windows and the character of the listed building with a contemporary, natural and detailed interior.',
    },
    cardText: {
      hu: '79 m²-es belvárosi lakás egy Ybl Miklós tervezte műemléki épületben — belső második szinttel és fényaknával.',
      en: 'A 79 m² downtown apartment in a listed building designed by Miklós Ybl — with an internal second level and a light well.',
    },
    tags: [
      { hu: 'Teljes körű felújítás', en: 'Full renovation' },
      { hu: 'Enteriőrtervezés', en: 'Interior design' },
      { hu: 'Egyedi bútorok', en: 'Custom furniture' },
    ],
    serviceSlugs: ['felujitas', 'tervezes', 'lakberendezes'],
    hero: 'vamhaz-korut/gallery/nappali-galeria',
    heroAlt: {
      hu: 'A Vámház körúti lakás világos nappalija a galériaszinttel, gömblámpákkal és a magas ablakokkal',
      en: 'The bright living room of the Vámház körút apartment with the gallery level, globe pendants and tall windows',
    },
    facts: [
      { label: { hu: 'Helyszín', en: 'Location' }, value: { hu: 'Vámház körút, Budapest', en: 'Vámház körút, Budapest' } },
      { label: { hu: 'Alapterület', en: 'Floor area' }, value: '79 m²' },
      { label: { hu: 'Hálószobák', en: 'Bedrooms' }, value: '2' },
      { label: { hu: 'Fürdőszobák', en: 'Bathrooms' }, value: '2' },
      { label: { hu: 'Belmagasság', en: 'Ceiling height' }, value: { hu: 'közel 4 m', en: 'almost 4 m' } },
      { label: { hu: 'Épület', en: 'Building' }, value: { hu: 'Ybl Miklós tervezte műemléki ház', en: 'Listed building designed by Miklós Ybl' } },
      { label: { hu: 'Munka', en: 'Scope' }, value: { hu: 'Teljes enteriőrtervezés és felújítás', en: 'Complete interior design and renovation' } },
      BUILD_TIME,
    ],
    starting: [
      {
        hu: 'A lakás egy Ybl Miklós tervezte, műemléki saroképületben található, a Kálvin tér közelében. Az adottságok különlegesek voltak: közel négyméteres belmagasság, nagy, osztott ablakok és egy felülvilágítós fényakna.',
        en: 'The apartment is in a listed corner building designed by Miklós Ybl, close to Kálvin tér. Its features were exceptional: ceilings almost four metres high, large divided windows and a skylit light well.',
      },
      {
        hu: 'A felújítás előtt a lakás elhanyagolt állapotban volt: elavult gépészet és villamos hálózat, régi konyha és fürdőszoba, valamint egy rögtönzött, létrával megközelíthető galéria.',
        en: 'Before the renovation the apartment was run-down: outdated plumbing and wiring, an old kitchen and bathroom, and a makeshift gallery reached by a ladder.',
      },
    ],
    goal: {
      hu: 'A cél az volt, hogy a belmagasságot valódi élettérré alakítsuk, a műemléki környezet karakterét megtartsuk, és egy természetes anyagokra épülő, nyugodt, kortárs otthon szülessen — korszerű műszaki háttérrel.',
      en: 'The aim was to turn the ceiling height into real living space, keep the character of the listed building, and create a calm, contemporary home built on natural materials — with up-to-date technical systems.',
    },
    solutions: [
      {
        title: { hu: 'Belső második szint', en: 'Internal second level' },
        text: {
          hu: 'A belmagasságot kihasználva az új konyha fölé egy különálló, zárható galériaszint épült hálószobával, saját mosdóval és WC-vel, valamint szabadon álló káddal; a szintet csigalépcső köti össze a nappalival.',
          en: 'Making use of the ceiling height, a separate, lockable gallery level was built above the new kitchen, with a bedroom, its own washbasin and WC and a freestanding bathtub; a spiral staircase connects it to the living room.',
        },
      },
      {
        title: { hu: 'Fényakna', en: 'Light well' },
        text: {
          hu: 'A korábban elhanyagolt felülvilágító a lakás egyik legkülönlegesebb pontja lett: zöld növényfal, felülről érkező természetes fény és célzott megvilágítás.',
          en: 'The previously neglected skylight became one of the most special spots in the apartment: a green plant wall, natural light from above and targeted lighting.',
        },
      },
      {
        title: { hu: 'Térszervezés', en: 'Layout' },
        text: {
          hu: 'Egy felezőfal kibontásával a nappali, az étkező és a konyha egy nyitott, sarokablakos térbe került, a hálószoba és a fürdőszobák külön zónát kaptak.',
          en: 'By removing a dividing wall, the living room, dining area and kitchen became one open space with corner windows, while the bedroom and bathrooms got their own zone.',
        },
      },
      {
        title: { hu: 'Anyaghasználat', en: 'Materials' },
        text: {
          hu: 'Világos halszálkás padló, meleg fa felületek, zöld csempe és márvány hatású részletek — visszafogott, természetes paletta.',
          en: 'Light herringbone flooring, warm wood surfaces, green tiles and marble-effect details — a restrained, natural palette.',
        },
      },
      {
        title: { hu: 'Egyedi bútorok', en: 'Custom furniture' },
        text: {
          hu: 'A konyha és a beépített bútorok a lakáshoz készültek, a térhez és a belmagassághoz igazítva.',
          en: 'The kitchen and built-in furniture were made for the apartment, tailored to the space and the ceiling height.',
        },
      },
      {
        title: { hu: 'Műszaki korszerűsítés', en: 'Technical upgrade' },
        text: {
          hu: 'Háromrétegű, hangszigetelt ablakok, klimatizálás, gépi szellőztetés, megújult elektromos hálózat egyedi mérőórákkal.',
          en: 'Triple-glazed, sound-insulated windows, air conditioning, mechanical ventilation and new wiring with individual meters.',
        },
      },
    ],
    beforeAfter: [
      {
        pairId: 'living-room-01', room: { hu: 'Nappali', en: 'Living room' }, displayMode: 'side-by-side',
        before: 'vamhaz-korut/before/nappali', after: 'vamhaz-korut/gallery/nappali-galeria',
        altBefore: { hu: 'A sarokszoba a felújítás előtt: kopott halszálkás parketta, régi radiátorok, két falon magas ablakok', en: 'The corner room before the renovation: worn herringbone parquet, old radiators, tall windows on two walls' },
        altAfter: { hu: 'Ugyanez a sarokszoba nappaliként: világos padló, kanapé, étkezőasztal és a galériaszint', en: 'The same corner room as the living room: light flooring, sofa, dining table and the gallery level' },
        objectPositionBefore: '50% 60%', objectPositionAfter: '50% 50%',
        note: {
          hu: 'Eltérő nézőpontból, ugyanaz a helyiség: egy felezőfal kikerült, és az új konyha fölé galéria épült.',
          en: 'Same room, different viewpoint: a dividing wall was removed and a gallery was built above the new kitchen.',
        },
      },
      {
        pairId: 'light-shaft-01', room: { hu: 'Fényakna', en: 'Light well' }, displayMode: 'side-by-side',
        before: 'vamhaz-korut/before/fenyakna', after: 'vamhaz-korut/after/fenyakna-alulrol',
        altBefore: { hu: 'A fényakna alulról a felújítás előtt: foltos, drótüveges felülvilágító', en: 'The light well from below before the renovation: a stained, wired-glass skylight' },
        altAfter: { hu: 'A fényakna alulról a felújítás után: zöld növényfal és a tetőablak, spotlámpákkal', en: 'The light well from below after the renovation: green plant wall and the roof window with spotlights' },
        objectPositionBefore: '50% 40%', objectPositionAfter: '50% 50%',
      },
    ],
    beforeGallery: [
      { image: 'vamhaz-korut/before/nappali-bontas', alt: { hu: 'A nappali a bontás idején, törmelékes zsákokkal', en: 'The living room during demolition, with rubble sacks' } },
      { image: 'vamhaz-korut/before/konyha', alt: { hu: 'A régi konyha a felújítás előtt', en: 'The old kitchen before the renovation' } },
      { image: 'vamhaz-korut/before/furdo', alt: { hu: 'A régi fürdőszoba sárgult káddal', en: 'The old bathroom with a yellowed bathtub' } },
      { image: 'vamhaz-korut/before/galeria', alt: { hu: 'A korábbi, létrával megközelíthető galéria', en: 'The former gallery, reached by a ladder' } },
    ],
    gallery: [
      { image: 'vamhaz-korut/gallery/nappali-galeria', alt: { hu: 'Nappali a galériaszinttel, gömblámpákkal és a nagy ablakokkal', en: 'Living room with the gallery level, globe pendants and large windows' } },
      { image: 'vamhaz-korut/gallery/nappali-konyha', alt: { hu: 'Nyitott nappali és konyha, csigalépcső a galériaszintre', en: 'Open living room and kitchen, spiral staircase to the gallery level' } },
      { image: 'vamhaz-korut/gallery/nappali-ablakok', alt: { hu: 'A nappali az ablakok felől, olajfával és fotelekkel', en: 'The living room from the windows, with an olive tree and armchairs' } },
      { image: 'vamhaz-korut/gallery/konyha', alt: { hu: 'Fehér, egyedi konyhabútor márvány hatású hátfallal, kerek étkezőasztal', en: 'White custom kitchen with a marble-effect splashback and a round dining table' } },
      { image: 'vamhaz-korut/gallery/galeria-haloszoba', alt: { hu: 'A galériaszinti hálószoba üvegfalon át, előtérben a gömblámpák', en: 'The gallery-level bedroom through a glass wall, globe pendants in the foreground' } },
      { image: 'vamhaz-korut/gallery/galeria-ago', alt: { hu: 'Hálószoba a galériaszinten, franciaággyal és klímával', en: 'Bedroom on the gallery level with a double bed and air conditioning' } },
      { image: 'vamhaz-korut/gallery/galeria-kad', alt: { hu: 'Szabadon álló kád az ágy mellett a galériaszinten', en: 'Freestanding bathtub next to the bed on the gallery level' } },
      { image: 'vamhaz-korut/gallery/haloszoba', alt: { hu: 'A második hálószoba kárpitozott ággyal és íróasztallal', en: 'The second bedroom with an upholstered bed and a desk' } },
      { image: 'vamhaz-korut/gallery/furdo-mosdo', alt: { hu: 'Dupla pultos mosdó zöld csempével és diófa szekrénnyel', en: 'Double vanity with green tiles and a walnut cabinet' } },
      { image: 'vamhaz-korut/gallery/furdo-zuhany', alt: { hu: 'Zuhany zöld halpikkely-csempével és márvány hatású mosdó', en: 'Shower with green fish-scale tiles and a marble-effect washbasin' } },
      { image: 'vamhaz-korut/gallery/eloszoba', alt: { hu: 'Előszoba beépített gardróbbal és padkával', en: 'Hallway with a built-in wardrobe and bench' } },
      { image: 'vamhaz-korut/gallery/fenyakna', alt: { hu: 'A fényakna alja konzolasztallal és festménnyel', en: 'The base of the light well with a console table and a painting' } },
      { image: 'vamhaz-korut/gallery/kilatas', alt: { hu: 'Kilátás az ablakból a Kálvin tér felé', en: 'View from the window towards Kálvin tér' } },
      { image: 'vamhaz-korut/gallery/uvegfolyoso', alt: { hu: 'Az épület színes üvegablakos függőfolyosója', en: 'The building’s open corridor with stained-glass windows' } },
      { image: 'vamhaz-korut/gallery/epulet', alt: { hu: 'Az Ybl Miklós tervezte épület homlokzata a Vámház körúton', en: 'The façade of the Miklós Ybl-designed building on Vámház körút' } },
    ],
    floorplans: [
      { image: 'vamhaz-korut/floorplans/fo-szint', alt: { hu: 'A lakás fő szintjének alaprajza: nappali, étkező, konyha, hálószoba, fürdő, bevilágító', en: 'Floor plan of the main level: living room, dining area, kitchen, bedroom, bathroom, light well' }, caption: { hu: 'Fő szint', en: 'Main level' } },
      { image: 'vamhaz-korut/floorplans/galeria-szint', alt: { hu: 'A galériaszint alaprajza: hálószoba, készülődő, WC', en: 'Floor plan of the gallery level: bedroom, dressing area, WC' }, caption: { hu: 'Galériaszint', en: 'Gallery level' } },
    ],
    video: { src: '/images/projects/vamhaz-korut/video/olive-video.mp4', poster: 'vamhaz-korut/gallery/video-poster', title: { hu: 'Videós séta a kész lakásban', en: 'Video walkthrough of the finished apartment' } },
    // a lapszám 2026 decemberében jelenik meg — megjelenés után múlt időre írható
    press: {
      hu: 'A projektet a Lakáskultúra magazin 2026. decemberi lapszáma mutatja be.',
      en: 'The project is featured in the December 2026 issue of Lakáskultúra magazine.',
    },
    story: {
      hu: 'A Project Olive nevet az olajfáról kapta: lassan nő, sokáig él, és nem siet. Ilyen otthont akartunk — időtállót és természeteset, amely nem a divatnak, hanem az életnek készül.',
      en: 'Project Olive is named after the olive tree: it grows slowly, lives long and is never in a hurry. That is the kind of home we wanted — timeless and natural, made for living rather than for fashion.',
    },
  },
  {
    slug: 'gozmozdony-utca',
    title: { hu: 'Gőzmozdony utca', en: 'Gőzmozdony utca' },
    subtitle: null,
    location: { hu: 'Gőzmozdony utca, Budapest', en: 'Gőzmozdony utca, Budapest' },
    shortLocation: BUDAPEST,
    summary: { hu: 'Komplett lakásfelújítás és enteriőrkialakítás a Gőzmozdony utcában.', en: 'A complete apartment renovation and interior fit-out on Gőzmozdony utca.' },
    cardText: { hu: 'Komplett lakásfelújítás és enteriőrkialakítás a Gőzmozdony utcában.', en: 'A complete apartment renovation and interior fit-out on Gőzmozdony utca.' },
    tags: [{ hu: 'Teljes körű felújítás', en: 'Full renovation' }, { hu: 'Enteriőr', en: 'Interiors' }],
    serviceSlugs: ['felujitas', 'lakberendezes'],
    hero: 'gozmozdony-utca/gallery/nappali',
    heroAlt: {
      hu: 'A Gőzmozdony utcai lakás nappalija világos kanapéval, puffal és a tükrös gardróbbal elválasztott hálórésszel',
      en: 'The living room of the Gőzmozdony utca apartment with a light sofa, a pouf and the sleeping area separated by a mirrored wardrobe',
    },
    facts: [
      { label: { hu: 'Helyszín', en: 'Location' }, value: { hu: 'Gőzmozdony utca, Budapest', en: 'Gőzmozdony utca, Budapest' } },
      { label: { hu: 'Munka', en: 'Scope' }, value: { hu: 'Komplett felújítás és enteriőrkialakítás', en: 'Complete renovation and interior fit-out' } },
      { label: { hu: 'Alapterület', en: 'Floor area' }, value: null }, // TODO: a tulajdonostól
      BUILD_TIME,
    ],
    starting: [
      {
        hu: 'A felújítás előtt a lakás teljesen kiürített, megbontott állapotban volt: régi burkolatok és csempék, szabadon álló gépészeti strangok, elhasznált nyílászárók.',
        en: 'Before the renovation the apartment was completely emptied and partly stripped: old flooring and tiles, exposed service risers and worn-out doors and windows.',
      },
    ],
    goal: {
      hu: 'Egy világos, egységes és könnyen használható otthon kialakítása — új konyhával, fürdőszobával és WC-vel, nyugodt, meleg színvilággal.',
      en: 'A bright, coherent and easy-to-use home — with a new kitchen, bathroom and WC and a calm, warm colour palette.',
    },
    solutions: [
      { title: { hu: 'Új konyha', en: 'New kitchen' }, text: { hu: 'Világos frontok, fa munkalap, beépített gépek — az ablakos konyhafal teljes hosszában.', en: 'Light fronts, a wooden worktop and integrated appliances — along the full length of the kitchen wall with the window.' } },
      { title: { hu: 'Fürdőszoba és WC', en: 'Bathroom and WC' }, text: { hu: 'Új burkolat, kád, mosdópult és a gépészeti strang eltakarása a WC-ben.', en: 'New tiling, bathtub and vanity, and the service riser concealed in the WC.' } },
      { title: { hu: 'Lakóterek', en: 'Living spaces' }, text: { hu: 'Egységes padló, friss falfelületek és visszafogott, meleg tónusú berendezés.', en: 'Continuous flooring, fresh walls and restrained, warm-toned furnishings.' } },
    ],
    beforeAfter: [
      {
        pairId: 'kitchen-01', room: { hu: 'Konyha', en: 'Kitchen' }, displayMode: 'slider',
        before: 'gozmozdony-utca/before/konyha', after: 'gozmozdony-utca/after/konyha',
        altBefore: { hu: 'A konyha a felújítás előtt: lebontott csempe, üres falak, régi radiátor az ablak alatt', en: 'The kitchen before the renovation: stripped tiles, bare walls, an old radiator under the window' },
        altAfter: { hu: 'A konyha a felújítás után: világos konyhabútor, fa munkalap, beépített sütő', en: 'The kitchen after the renovation: light cabinets, wooden worktop, built-in oven' },
        objectPositionBefore: '50% 55%', objectPositionAfter: '50% 55%', aspect: '4 / 3',
      },
      {
        pairId: 'wc-01', room: { hu: 'WC', en: 'WC' }, displayMode: 'slider',
        before: 'gozmozdony-utca/before/wc', after: 'gozmozdony-utca/after/wc',
        altBefore: { hu: 'A WC a felújítás előtt: szabadon álló, rozsdás gépészeti csövek', en: 'The WC before the renovation: exposed, rusty service pipes' },
        altAfter: { hu: 'A WC a felújítás után: burkolt fal, eltakart strang, polc', en: 'The WC after the renovation: tiled wall, concealed riser, shelf' },
        objectPositionBefore: '50% 55%', objectPositionAfter: '50% 55%', aspect: '3 / 4',
      },
      {
        pairId: 'living-room-01', room: { hu: 'Nappali', en: 'Living room' }, displayMode: 'side-by-side',
        before: 'gozmozdony-utca/before/nappali', after: 'gozmozdony-utca/after/nappali',
        altBefore: { hu: 'A nappali a felújítás előtt: üres szoba fóliázott padlóval, hármas ablak', en: 'The living room before the renovation: an empty room with protective sheeting on the floor, triple window' },
        altAfter: { hu: 'A nappali a felújítás után: kanapé, puff, szőnyeg a hármas ablak előtt', en: 'The living room after the renovation: sofa, pouf and rug in front of the triple window' },
        objectPositionBefore: '50% 40%', objectPositionAfter: '50% 50%',
      },
      {
        pairId: 'bedroom-01', room: { hu: 'Hálószoba', en: 'Bedroom' }, displayMode: 'side-by-side',
        before: 'gozmozdony-utca/before/haloszoba', after: 'gozmozdony-utca/after/haloszoba',
        altBefore: { hu: 'A hálószoba a felújítás előtt: régi erkélyajtó, klíma, csupasz falak', en: 'The bedroom before the renovation: old balcony door, air conditioner, bare walls' },
        altAfter: { hu: 'A hálószoba a felújítás után: ágy, komód, függönyök az erkélyajtó előtt', en: 'The bedroom after the renovation: bed, chest of drawers, curtains in front of the balcony door' },
        objectPositionBefore: '50% 50%', objectPositionAfter: '50% 50%',
      },
      {
        pairId: 'bathroom-01', room: { hu: 'Fürdőszoba', en: 'Bathroom' }, displayMode: 'side-by-side',
        before: 'gozmozdony-utca/before/furdo', after: 'gozmozdony-utca/after/furdo',
        altBefore: { hu: 'A fürdőszoba a bontás után: leszedett csempe, csupasz falak', en: 'The bathroom after demolition: tiles removed, bare walls' },
        altAfter: { hu: 'A fürdőszoba a felújítás után: új burkolat, kád, mosdópult és mosógép', en: 'The bathroom after the renovation: new tiling, bathtub, vanity and washing machine' },
        objectPositionBefore: '50% 50%', objectPositionAfter: '50% 50%',
      },
    ],
    beforeGallery: [],
    gallery: [
      { image: 'gozmozdony-utca/gallery/nappali', alt: { hu: 'Nappali kanapéval és puffal, a háttérben tükrös gardróbbal elválasztott hálórész', en: 'Living room with sofa and pouf, the sleeping area behind a mirrored wardrobe in the background' } },
      { image: 'gozmozdony-utca/gallery/nappali-ablakok', alt: { hu: 'A nappali az ablakok felől, kanapé és tévéállvány', en: 'The living room from the windows, sofa and TV stand' } },
      { image: 'gozmozdony-utca/after/nappali', alt: { hu: 'Nappali a hármas ablakkal, szőnyeggel és puffal', en: 'Living room with the triple window, rug and pouf' } },
      { image: 'gozmozdony-utca/gallery/haloszoba-uvegfal', alt: { hu: 'Hálórész üvegfallal és függönnyel', en: 'Sleeping area with a glass partition and curtain' } },
      { image: 'gozmozdony-utca/after/haloszoba', alt: { hu: 'Hálószoba komóddal és erkélyajtóval', en: 'Bedroom with a chest of drawers and balcony door' } },
      { image: 'gozmozdony-utca/gallery/haloszoba-iroasztal', alt: { hu: 'Hálószoba íróasztallal és székkel', en: 'Bedroom with a desk and chair' } },
      { image: 'gozmozdony-utca/after/konyha', alt: { hu: 'Hosszú, ablakos konyha világos frontokkal', en: 'Long kitchen with a window and light fronts' } },
      { image: 'gozmozdony-utca/gallery/konyha-bejarat', alt: { hu: 'A konyha a bejárati ajtó felől', en: 'The kitchen seen from the front door' } },
      { image: 'gozmozdony-utca/gallery/konyha-reszlet', alt: { hu: 'Konyhapult fekete csapteleppel és fa munkalappal', en: 'Kitchen counter with a black tap and wooden worktop' } },
      { image: 'gozmozdony-utca/gallery/etkezo', alt: { hu: 'Étkezősarok kis asztallal és székekkel', en: 'Dining corner with a small table and chairs' } },
      { image: 'gozmozdony-utca/gallery/eloszoba', alt: { hu: 'Előszoba szekrénnyel és fehér beltéri ajtókkal', en: 'Hallway with a cabinet and white interior doors' } },
      { image: 'gozmozdony-utca/after/furdo', alt: { hu: 'Fürdőszoba kerámia mosdóval, káddal és mosógéppel', en: 'Bathroom with a ceramic washbasin, bathtub and washing machine' } },
      { image: 'gozmozdony-utca/after/wc', alt: { hu: 'Burkolt WC fali polccal', en: 'Tiled WC with a wall shelf' } },
      { image: 'gozmozdony-utca/gallery/erkely', alt: { hu: 'Erkély kisasztallal és kilátással a város felé', en: 'Balcony with a small table and a view over the city' } },
    ],
    floorplans: [],
    video: null,
    press: null,
    story: null,
  },
  {
    slug: 'balazs-bela-utca',
    title: { hu: 'Balázs Béla utca', en: 'Balázs Béla utca' },
    subtitle: null,
    location: { hu: 'Balázs Béla utca, Budapest', en: 'Balázs Béla utca, Budapest' },
    shortLocation: BUDAPEST,
    summary: { hu: 'Teljes körű lakásfelújítás és enteriőrtervezés a Balázs Béla utcában.', en: 'A full-scope apartment renovation and interior design on Balázs Béla utca.' },
    cardText: { hu: 'Teljes körű lakásfelújítás és enteriőrtervezés a Balázs Béla utcában.', en: 'A full-scope apartment renovation and interior design on Balázs Béla utca.' },
    tags: [{ hu: 'Teljes körű felújítás', en: 'Full renovation' }, { hu: 'Enteriőrtervezés', en: 'Interior design' }],
    serviceSlugs: ['felujitas', 'tervezes', 'lakberendezes'],
    hero: 'balazs-bela-utca/gallery/nappali',
    heroAlt: {
      hu: 'A Balázs Béla utcai lakás nappalija bouclé kanapéval, mintás szőnyeggel és falpanelekkel',
      en: 'The living room of the Balázs Béla utca apartment with a bouclé sofa, patterned rug and wall panelling',
    },
    facts: [
      { label: { hu: 'Helyszín', en: 'Location' }, value: { hu: 'Balázs Béla utca, Budapest', en: 'Balázs Béla utca, Budapest' } },
      { label: { hu: 'Munka', en: 'Scope' }, value: { hu: 'Teljes körű felújítás és enteriőrtervezés', en: 'Full renovation and interior design' } },
      { label: { hu: 'Alapterület', en: 'Floor area' }, value: null }, // TODO: a tulajdonostól
      BUILD_TIME,
    ],
    starting: [
      {
        hu: 'A kiindulási állapot egy berendezett, de sötét tónusú lakás volt: fekete konyhabútor, sötétszürke falak, narancssárga csempés fürdőszoba.',
        en: 'The starting point was a furnished but dark apartment: black kitchen cabinets, dark grey walls and a bathroom with orange tiles.',
      },
    ],
    goal: {
      hu: 'Világosabb, melegebb és egységesebb terek — a meglévő alaprajzra építve, új konyhával, fürdőszobával, burkolatokkal és teljes berendezéssel.',
      en: 'Brighter, warmer and more coherent spaces — building on the existing layout, with a new kitchen, bathroom, flooring and complete furnishing.',
    },
    solutions: [
      { title: { hu: 'Világos alapok', en: 'A light base' }, text: { hu: 'Világos falak, dekoratív falpanelek és fa hatású padló adják az új alapot.', en: 'Light walls, decorative wall panelling and wood-effect flooring form the new base.' } },
      { title: { hu: 'Konyha és étkező', en: 'Kitchen and dining' }, text: { hu: 'Krémszínű, fogantyús konyhabútor, fa munkalap és egy kerek étkezőasztal a nappali és a konyha határán.', en: 'Cream cabinets with handles, a wooden worktop and a round dining table where the living room meets the kitchen.' } },
      { title: { hu: 'Fürdőszoba', en: 'Bathroom' }, text: { hu: 'Natúr tónusú burkolat, cementlap hatású padló, fa mosdópult és arany színű szerelvények.', en: 'Natural-toned tiles, cement-tile-effect flooring, a wooden vanity and gold-coloured fittings.' } },
      { title: { hu: 'Loggia', en: 'Loggia' }, text: { hu: 'A loggia étkezősarokkal és függőfotellel a lakás kültéri szobája lett.', en: 'With a dining corner and a hanging chair, the loggia became the apartment’s outdoor room.' } },
    ],
    beforeAfter: [
      {
        pairId: 'bedroom-01', room: { hu: 'Hálószoba', en: 'Bedroom' }, displayMode: 'slider',
        before: 'balazs-bela-utca/before/haloszoba', after: 'balazs-bela-utca/after/haloszoba',
        altBefore: { hu: 'A hálószoba a felújítás előtt: sötétszürke fal, sötét fa ágy, ablak jobbra', en: 'The bedroom before the renovation: dark grey wall, dark wooden bed, window on the right' },
        altAfter: { hu: 'A hálószoba a felújítás után: világos fal, kárpitozott ágy, képek az ágy fölött', en: 'The bedroom after the renovation: light wall, upholstered bed, pictures above the bed' },
        objectPositionBefore: '50% 62%', objectPositionAfter: '50% 55%', aspect: '4 / 3',
      },
      {
        pairId: 'living-room-01', room: { hu: 'Nappali', en: 'Living room' }, displayMode: 'side-by-side',
        before: 'balazs-bela-utca/before/nappali', after: 'balazs-bela-utca/after/nappali',
        altBefore: { hu: 'A nappali a felújítás előtt: zöld kanapé, szürke szőnyeg, sötét bútorok', en: 'The living room before the renovation: green sofa, grey rug, dark furniture' },
        altAfter: { hu: 'A nappali a felújítás után: bouclé kanapé, falpanelek, fotel és állólámpa', en: 'The living room after the renovation: bouclé sofa, wall panelling, armchair and floor lamp' },
        objectPositionBefore: '50% 50%', objectPositionAfter: '50% 50%',
      },
      {
        pairId: 'kitchen-01', room: { hu: 'Konyha', en: 'Kitchen' }, displayMode: 'side-by-side',
        before: 'balazs-bela-utca/before/konyha', after: 'balazs-bela-utca/after/konyha',
        altBefore: { hu: 'A konyha a felújítás előtt: fekete konyhabútor és hűtő', en: 'The kitchen before the renovation: black cabinets and fridge' },
        altAfter: { hu: 'A konyha a felújítás után: krémszínű konyhabútor, fa munkalap', en: 'The kitchen after the renovation: cream cabinets, wooden worktop' },
        objectPositionBefore: '50% 50%', objectPositionAfter: '50% 50%',
      },
      {
        pairId: 'bathroom-01', room: { hu: 'Fürdőszoba', en: 'Bathroom' }, displayMode: 'side-by-side',
        before: 'balazs-bela-utca/before/furdo', after: 'balazs-bela-utca/after/furdo',
        altBefore: { hu: 'A fürdőszoba a felújítás előtt: narancssárga csíkos csempe, régi mosdó', en: 'The bathroom before the renovation: orange striped tiles, old washbasin' },
        altAfter: { hu: 'A fürdőszoba a felújítás után: natúr burkolat, fa mosdópult, kerek tükör', en: 'The bathroom after the renovation: natural tiles, wooden vanity, round mirror' },
        objectPositionBefore: '50% 50%', objectPositionAfter: '50% 50%',
      },
      {
        pairId: 'loggia-01', room: { hu: 'Loggia', en: 'Loggia' }, displayMode: 'side-by-side',
        before: 'balazs-bela-utca/before/loggia', after: 'balazs-bela-utca/after/loggia',
        altBefore: { hu: 'A loggia korábban: műfű, sötét asztal és székek', en: 'The loggia before: artificial grass, dark table and chairs' },
        altAfter: { hu: 'A loggia most: étkezőasztal fa székekkel, függőfotel, szőnyeg', en: 'The loggia now: dining table with wooden chairs, hanging chair, rug' },
        objectPositionBefore: '50% 50%', objectPositionAfter: '50% 50%',
      },
    ],
    beforeGallery: [],
    gallery: [
      { image: 'balazs-bela-utca/gallery/nappali', alt: { hu: 'Nappali bouclé kanapéval, mintás szőnyeggel és gömblámpával', en: 'Living room with a bouclé sofa, patterned rug and globe lamp' } },
      { image: 'balazs-bela-utca/after/nappali', alt: { hu: 'A nappali az étkező felől, fotellel és állólámpával', en: 'The living room from the dining area, with an armchair and floor lamp' } },
      { image: 'balazs-bela-utca/gallery/nappali-kanape', alt: { hu: 'Bouclé kanapé falpanelek előtt', en: 'Bouclé sofa in front of wall panelling' } },
      { image: 'balazs-bela-utca/gallery/nappali-ablak', alt: { hu: 'Nappali a loggiára nyíló ablakkal, tévéállvánnyal', en: 'Living room with the window to the loggia and a TV stand' } },
      { image: 'balazs-bela-utca/gallery/olvasosarok', alt: { hu: 'Olvasósarok barna fotellel és állólámpával', en: 'Reading corner with a brown armchair and floor lamp' } },
      { image: 'balazs-bela-utca/gallery/etkezo', alt: { hu: 'Étkező kerek asztallal, rálátással a konyhára és a hálóra', en: 'Dining area with a round table, looking towards the kitchen and bedroom' } },
      { image: 'balazs-bela-utca/gallery/etkezo-konyha', alt: { hu: 'Étkezőasztal függőlámpával a konyha mellett', en: 'Dining table with a pendant lamp next to the kitchen' } },
      { image: 'balazs-bela-utca/after/konyha', alt: { hu: 'Krémszínű konyhabútor beépített sütővel', en: 'Cream kitchen cabinets with a built-in oven' } },
      { image: 'balazs-bela-utca/gallery/konyha-reszlet', alt: { hu: 'Konyhapult arany csapteleppel és fa munkalappal', en: 'Kitchen counter with a gold tap and wooden worktop' } },
      { image: 'balazs-bela-utca/after/haloszoba', alt: { hu: 'Hálószoba kárpitozott ággyal, képekkel az ágy fölött', en: 'Bedroom with an upholstered bed and pictures above it' } },
      { image: 'balazs-bela-utca/gallery/haloszoba', alt: { hu: 'A hálószoba az ajtó felől', en: 'The bedroom from the door' } },
      { image: 'balazs-bela-utca/after/furdo', alt: { hu: 'Fürdőszoba fa mosdópulttal, kerek tükörrel és WC-vel', en: 'Bathroom with a wooden vanity, round mirror and WC' } },
      { image: 'balazs-bela-utca/gallery/furdo-kad', alt: { hu: 'Kád arany színű csapteleppel, cementlap hatású padló', en: 'Bathtub with a gold-coloured tap, cement-tile-effect floor' } },
      { image: 'balazs-bela-utca/gallery/eloszoba', alt: { hu: 'Előszoba fa gardróbszekrénnyel', en: 'Hallway with a wooden wardrobe' } },
      { image: 'balazs-bela-utca/after/loggia', alt: { hu: 'Loggia étkezőasztallal és függőfotellel', en: 'Loggia with a dining table and hanging chair' } },
      { image: 'balazs-bela-utca/gallery/loggia', alt: { hu: 'Loggia a szomszédos házak felé', en: 'Loggia facing the neighbouring buildings' } },
    ],
    // a korábbi alaprajz ingatlan.com-vízjeles volt, saját alaprajz nincs (tulajdonos, 2026-10-05) → nem közöljük
    floorplans: [],
    video: null,
    press: null,
    story: null,
  },
];
