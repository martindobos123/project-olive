// Kétnyelvűség (HU alap, EN a /en/ alatt). A build nyelvenként egyszer rendereli az összes oldalt:
// setLang('hu') → oldalak → setLang('en') → oldalak. A szövegek { hu, en } objektumok, a t() a
// futó nyelv változatát adja vissza (sima string/szám változatlanul megy át).
export let lang = 'hu';
export const LANGS = ['hu', 'en'];
export const setLang = (l) => { lang = l; };

export const t = (v) => (v && typeof v === 'object' && !Array.isArray(v) && 'hu' in v ? (v[lang] ?? v.hu) : v);

const ROUTES = {
  home: { hu: '/', en: '/en/' },
  services: { hu: '/szolgaltatasok/', en: '/en/services/' },
  projects: { hu: '/projektek/', en: '/en/projects/' },
  about: { hu: '/rolunk/', en: '/en/about/' },
  contact: { hu: '/kapcsolat/', en: '/en/contact/' },
};

// href('services') / href('project:vamhaz-korut') — az aktuális (vagy megadott) nyelv útvonala
export function href(key, l = lang) {
  if (key.startsWith('project:')) return `${ROUTES.projects[l]}${key.slice(8)}/`;
  if (!ROUTES[key]) throw new Error(`Ismeretlen útvonal-kulcs: ${key}`);
  return ROUTES[key][l];
}

// a szakasz-horgonyok is nyelvfüggők (/#folyamat ↔ /en/#process)
export const anchors = { process: { hu: 'folyamat', en: 'process' } };
