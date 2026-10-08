// Részprojektek — kisebb, nem A-tól Z-ig tartó munkák (a /projektek oldal alján).
// Forrás: a tulajdonos Google Fotók-albuma (2026-10-07). A címek a képeken LÁTHATÓ munkanemet
// írják le; helyszínt, megrendelőt vagy évszámot nem találunk ki — ha a tulajdonos megadja,
// a `where` mező tölthető (null → nem jelenik meg).
export const subprojectsIntro = {
  hu: 'Nem mindig a teljes lakást újítjuk fel. Egy-egy jól körülhatárolt részmunkát — szerkezetépítést, szigetelést, bontást és falazást — önállóan is vállalunk, ugyanazzal a figyelemmel.',
  en: 'We don’t always renovate the whole apartment. We also take on well-defined partial jobs — structural work, insulation, demolition and walling — on their own, with the same attention.',
};

export const subprojects = [
  {
    slug: 'szerkezetepites',
    title: { hu: 'Szerkezetépítés és födém', en: 'Structural work and floor slab' },
    text: {
      hu: 'Teherhordó falak, vasbeton koszorú és előregyártott födémpallók — egy épület váza az alapoktól a födémig.',
      en: 'Load-bearing walls, a reinforced-concrete ring beam and precast floor planks — the skeleton of a building from the foundations to the slab.',
    },
    where: null,
    images: [
      { image: 'reszprojektek/szerkezet-1', alt: { hu: 'Felülről: a frissen felrakott előregyártott födémpallók a téglafalakon', en: 'From above: freshly laid precast floor planks on the brick walls' } },
      { image: 'reszprojektek/szerkezet-2', alt: { hu: 'A téglafalak és a nyílásáthidalók, a koszorú zsaluzásával', en: 'The brick walls and lintels, with the ring-beam formwork' } },
      { image: 'reszprojektek/szerkezet-3', alt: { hu: 'Belül: a kész födém alulról, a falazott nyílásokkal', en: 'Inside: the finished slab from below, with the walled openings' } },
    ],
  },
  {
    slug: 'szigeteles',
    title: { hu: 'Homlokzati szigetelés és betonalap', en: 'Façade insulation and concrete base' },
    text: {
      hu: 'Lábazati és homlokzati hőszigetelés egy családi házon, mellette egy új betonalap zsaluzása és öntése.',
      en: 'Plinth and façade insulation on a family house, plus the formwork and pouring of a new concrete base.',
    },
    where: null,
    images: [
      { image: 'reszprojektek/szigeteles-1', alt: { hu: 'A csapat hőszigetelő lapokat ragaszt a ház homlokzatára', en: 'The team fixing insulation boards to the façade of the house' } },
      { image: 'reszprojektek/szigeteles-2', alt: { hu: 'Friss betonalap simítása a zsaluzatban', en: 'Smoothing a freshly poured concrete base in its formwork' } },
    ],
  },
  {
    slug: 'bontas-falazas',
    title: { hu: 'Bontás és új válaszfalak', en: 'Demolition and new partition walls' },
    text: {
      hu: 'A régi falak és burkolatok bontása, majd az új alaprajz felépítése pórusbeton válaszfalakkal — egy felújítás első, szerkezeti szakasza.',
      en: 'Taking out the old walls and finishes, then building the new layout with aerated-concrete partitions — the first, structural phase of a renovation.',
    },
    where: null,
    images: [
      { image: 'reszprojektek/valaszfal-1', alt: { hu: 'Épülő pórusbeton válaszfal a kibontott lakásban', en: 'An aerated-concrete partition going up in the stripped apartment' } },
      { image: 'reszprojektek/valaszfal-2', alt: { hu: 'A régi padló felszedve, az új falak már állnak', en: 'The old floor taken up, the new walls already standing' } },
      { image: 'reszprojektek/valaszfal-3', alt: { hu: 'Új falak és az álmennyezet vázszerkezete', en: 'New walls and the frame of the suspended ceiling' } },
    ],
  },
];
