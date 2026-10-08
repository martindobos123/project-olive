# Urban Flip Studio — weboldal

Teljes körű lakásfelújítással, enteriőrtervezéssel, lakberendezéssel és home staginggel
foglalkozó budapesti vállalkozás szolgáltatói és referenciaoldala — **urbanflipstudio.com**.
A korábbi „Project Olive” eladási oldal tartalma a Vámház körúti projekt-esettanulmányba került
(`/projektek/vamhaz-korut/`; a régi `/project-olive/` cím oda irányít át).

Statikus oldal, GitHub Pages szolgálja ki. **Nincs keretrendszer és nincs npm-függőség** — egy
Node-szkript (csak beépített modulok) generálja a HTML-t a központi adatfájlokból.

## Szerkezet

```
src/data/site.mjs        márka, elérhetőségek, navigáció, folyamat, űrlap-végpont (TODO)
src/data/services.mjs    szolgáltatások (kezdőlap + /szolgaltatasok)
src/data/projects.mjs    projektek: adatok, előtte–utána párok (képmanifest), galéria, alaprajz, tervlapok (plans)
src/data/subprojects.mjs részprojektek (kisebb részmunkák a /projektek alján) — helyszín nélkül, amíg a tulajdonos meg nem adja
src/data/images.json     GENERÁLT — képazonosító → méretek/szélességek
src/components.mjs       Header, MobileNavigation, Hero, SectionHeading, ServiceBlock, ProjectCard,
                         ProjectFacts, BeforeAfterSlider, ProjectGallery, AccessibleLightbox,
                         ProcessTimeline, ContactCTA, MidCta, ContactForm, Footer, Picture,
                         PlanCarousel (lapozható tervsorozat), SubprojectCard, ConsentBanner
src/pages.mjs            oldalsablonok (a 3 projektoldal EGY sablonból, adatból épül)
src/i18n.mjs             nyelvek (hu, en), t() szövegválasztó, útvonal-térkép (/szolgaltatasok/ ↔ /en/services/)
src/assets/              site.css (design tokenek), site.js, fonts.css + fonts/ (önhosztolt woff2)
scripts/build.mjs        HTML + sitemap.xml + robots.txt + site.webmanifest + 404 + átirányítás
scripts/build_images.py  képoptimalizálás (Pillow): EXIF-forgatás, metaadat-törlés, AVIF/WebP/JPEG
scripts/image-sources.json  melyik forrásfájlból melyik webes kép készül
```

A gyökérben lévő `index.html`, `*/index.html`, `assets/`, `images/projects/`, `sitemap.xml` stb.
**generált kimenet** — ne kézzel szerkeszd, hanem a `src/`-t, majd buildelj.
## ChatGPT Ads mérés (OpenAI Measurement Pixel)

- `src/data/site.mjs` → `oaiPixelId`. **Üresen** semmi nem települ (nincs Pixel-script, nincs CSP-bővítés,
  nincs hozzájárulás-sáv). Kitöltve a build legenerálja az `assets/oaiq-init.js`-t (a hivatalos betöltő +
  `oaiq("consent", false)` az init előtt, ha nincs tárolt engedély), beteszi a `<head>`-be, bővíti a CSP-t a
  dokumentált forrásokkal (`bzrcdn.openai.com`, `bzr.openai.com`) és minden oldalra kiteszi a hozzájárulás-sávot.
- Kapcsolat-kattintás események (`src/assets/site.js`): `contact_phone_click` (tel:), `contact_whatsapp_click`
  (wa.me / api.whatsapp.com / whatsapp:), `contact_email_click` (mailto:) — egy delegált click-figyelő,
  `oaiq("measure", "custom", { type: "custom" }, { custom_event_name })`. Soha nem akadályozza a link működését.
- Hozzájárulás: `localStorage['ufs-consent']` = `granted` | `denied`; a sáv gombjai `oaiq("consent", true|false)`-t
  hívnak. Lábléc: „Mérési beállítások” újranyitja a sávot.
- A régi `/project-olive/` átirányítás `assets/redirect.js`-sel megőrzi a query stringet (`?oppref=…`).
- Lokális teszt valódi ID nélkül: `OAI_PIXEL_ID=test-local node scripts/build.mjs` (utána TISZTA build és az
  `assets/oaiq-init.js` törlése, mielőtt commitolsz). Helyőrző ID-t SOHA ne commitolj.

## Kétnyelvűség

Magyar az alap (gyökér), angol a `/en/` alatt. Minden nyelvfüggő szöveg `{ hu, en }` objektum az
adat- és sablonfájlokban; a build nyelvenként egyszer rendereli az összes oldalt, hreflang-párokkal,
nyelvváltóval és kétnyelvű sitemappel. Új szövegnél MINDKÉT nyelvet add meg (hiányzó `en` → a magyar
jelenik meg az angol oldalon). A 404 csak a gyökérben van (a Pages egyetlen 404.html-t szolgál ki).


## Build

```sh
python scripts/build_images.py   # csak ha képek változtak (OLIVE_RAW = nyers forrásmappa)
node scripts/build.mjs           # HTML újragenerálása
python -m http.server 8765       # lokális előnézet: http://localhost:8765/
```

A nyers (eredeti, teljes felbontású) fotók **nincsenek a repóban**: alapból a
`../olive-assets-raw/` mappában vannak (`OLIVE_RAW` környezeti változóval átállítható);
a források a megadott Google Drive- és Google Fotók-albumokból származnak.

## Szabályok

- Ismeretlen projektadatot nem találunk ki: `null` / TODO értéket a sablon nem jelenít meg.
- Előtte–utána párt csak ugyanarról a helyiségről; `slider` csak közel azonos nézőpontnál,
  különben `side-by-side`. Képet nem tükrözünk, nem torzítunk, nem generálunk.
- Google Drive / Fotók linket a kész oldal nem hotlinkel; minden kép helyi asset.

## Kapcsolati adatok

telefon / WhatsApp: `+36 70 604 3807` · e-mail: `martindobos123@gmail.com` · domain a `CNAME`-ben.
