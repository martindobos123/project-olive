# Urban Flip Studio mérési terv és élesítési útmutató

## Átvizsgált architektúra

Repo: martindobos123/project-olive; domain: urbanflipstudio.com. Függőség nélküli Node statikus generátor, GitHub Pages. A src/ a forrás, a gyökér HTML és assets/ generált, commitolandó kimenet. HU/EN, 37 oldal, külön befektetői landing és értéknövelési űrlap. Nincs szerveroldali lead-visszaigazolás.

A korábbi OpenAI Pixel és GoatCounter kód inaktív volt, a build tiltja bekapcsolásukat. A régi betöltők és kattintásfigyelők helyére egyetlen közös measurement.js került; nem indulnak párhuzamosan. A három űrlap jelenleg levelezőben készít elő üzenetet. A külső űrlapküldés tiltása megmaradt.

## Beállítás és szükséges hozzáférések

| Környezeti változó | Hol található / szükséges jog |
| --- | --- |
| GA4_MEASUREMENT_ID | G-…; GA4 Admin → Data streams → Web. Property Editor a stream, események, egyéni dimenziók és adatmegőrzés beállításához |
| GTM_CONTAINER_ID | GTM-…; Google Tag Manager webes konténer. Edit + Approve/Publish a konténerhez |
| GTM_SERVICES | A konténerben ténylegesen használt szolgáltatók: ga4,meta,googleAds,linkedin,tiktok |
| META_PIXEL_ID | Meta Events Manager → Dataset/Pixel. Dataset kezelési jogosultság, Business Portfolio és hirdetési fiók összerendelése |
| GOOGLE_ADS_ID | AW-…; Google Ads → Goals → Conversions → webes konverzió. Standard/Admin hozzáférés a konverziós művelethez |
| GOOGLE_ADS_LEAD_LABEL | Az igazolt lead konverzió címkéje; nem a gombkattintásé |
| LINKEDIN_PARTNER_ID | Campaign Manager → Analyze → Insight Tag. A hirdetési fiókhoz megfelelő Campaign Manager jog |
| LINKEDIN_LEAD_CONVERSION_ID | Külön event-specific igazolt lead konverzió ID |
| TIKTOK_PIXEL_ID | Ads Manager → Events Manager → Web Pixel. Pixel- és hirdetési fiókhozzáférés |
| GTM_PURPOSE_GATING_VERIFIED | true kizárólag a teljesen auditált, minden címkénél célonként védett Urbanflip-konténerhez |
| MEASUREMENT_DEBUG | true csak ellenőrzéshez: GA4 debug_mode; élesben false |

A GitHub és a Pages közzétételi beállításához már van repóhozzáférés. A Google- és Meta-fiókok beállítását a tulajdonos által megnyitott, bejelentkezett böngészőben végeztük el. Az opcionális Google Ads, LinkedIn és TikTok követés még inaktív, saját fiókazonosítóik és konverzióbeállításaik szükségesek. API-token, Measurement Protocol secret, CAPI token és felhasználói hitelesítő adat SOHA nem kerülhet publikus JS-be. A fenti ID-k nyilvános azonosítók.

A `.env.example` csak minta. Node 20.6+ esetén:

```sh
cp .env.example .env
# A valós nyilvános azonosítók kitöltése után:
node --env-file=.env scripts/build.mjs
node --test scripts/test-*.mjs
```

A build a környezetet olvassa; a Pages önmagában nem futtatja a buildet és nem ad env-változókat a böngészőnek. A generált HTML-t és assets/ fájlokat együtt kell publikálni, vagy külön Actions-buildet beállítani. Nincs új automatikus élesítési workflow. Üres környezettel újraépítve az összes mérés kikapcsolható. A tesztazonosítóval generált állapotot soha ne publikáld.

## Hozzájárulás

- Basic Consent Mode v2: minden Google storage/user-data/personalization jel alapból denied. A helyi dataLayer nem hálózati kérés. Nincs Google, Meta, LinkedIn vagy TikTok kérés a szükséges hozzájárulás előtt; nincs noscript követő és nincs előzetes eseménypuffer.
- Külön analitika és marketing, alapból üres jelölőnégyzetek. Egyformán megjelenő „Mindet elutasítom” és „Mindet elfogadom”, menthető részleges döntés. Az űrlap adatkezelési jelölőnégyzete nem tracking-hozzájárulás.
- ufs-consent-v2: döntés, időpont, konfigurációverzió, 180 nap. Régi általános „granted” nem migrálódik. Szolgáltató/ID változása új engedélyt kér. Sérült, lejárt vagy jövőbeli rekord érvénytelen. Tárolási hibánál alapból tiltott; az aktuális munkamenetben adható engedély.
- Láblécben és landing láblécben újranyitás, módosítás és visszavonás. Csökkentett engedélynél az alkalmazás rögtön leállítja eseményeit, törli az elérhető saját mérősütiket és attribúciót, újratölti az oldalt az SDK-k megszüntetéséhez. Másik lapfül döntése újratöltést vált ki. Már elküldött adatok és a külső domain sütijei nem törölhetők innen.
- GTM-módban az auditált Urbanflip-konténer célonként külön működik (GTM_PURPOSE_GATING_VERIFIED=true). A konténer bármelyik választott cél engedélyével betölthető, minden címke saját Additional Consent Checks feltétele kötelező. Ismeretlen/nem auditált vegyes konténer alapértelmezetten mindkét engedélyt igényli; a repó nem tudja ellenőrizni a később módosított konténer összes címkéjét.

A technikai megoldás önmagában nem igazolja a teljes GDPR/ePrivacy-megfelelést. Élesítés előtt az adatkezelőnek ellenőriznie kell a szolgáltatói szerződéseket, szerepköröket, nemzetközi adattovábbítás garanciáit, valódi sütikészletet és megőrzési beállításokat. Tájékoztató/cél változtatásakor emelni kell a measurement-config.mjs noticeVersion értékét is, hogy új hozzájárulást kérjen. A HU/EN tájékoztató a buildben megadott szolgáltatókat sorolja fel; GTM_SERVICES-nek a közzétett konténerrel egyeznie kell. A tulajdonos 2026. november 14-i döntése szerint a GA4 eseményadatok megőrzése 2 hónap, a felhasználói adatoké 14 hónap, új aktivitáskor hosszabbítható. Ezeket az élő fiókban ellenőriztük és változatlanul hagytuk; a tájékoztató ezt tükrözi. GA4-süti: 180 nap, automatikus hosszabbítás nélkül. Marketingplatformok sütibeállításait a tájékoztatóval egyeztetni kell. A hozzájárulás bizonyíthatóságát és a banner/verziók nyilvántartását az adatkezelőnek külön rendeznie kell; nincs szerveroldali hozzájárulásnapló.

## Események és konverziók

| Esemény | Feltétel / értelmezés |
| --- | --- |
| page_view | Oldalanként egyszer, analitikai engedély után; Meta/TikTok külön saját PageView-t kap marketingengedéllyel |
| cta_click | .btn, .link-arrow vagy data-cta link, fix elhelyezésazonosítóval |
| contact_phone_click / contact_email_click / contact_whatsapp_click | Kontaktlink aktiválás, célcím és szám továbbítása nélkül. Meta: Contact, más platformon alapból nem lead |
| outbound_click | Egyéb külső link, cél URL nélkül |
| form_start | Első fókusz űrlaponként és oldalbetöltésenként, engedély után |
| form_validation_error | Sikertelen validálási kör, mezőérték és hibaüzenet nélkül |
| form_submit_attempt | Érvényes beküldési kísérlet; nem sikeres lead |
| email_draft_open | Mailto üzenet előkészítése; a küldést nem igazolja |
| generate_lead | Csak tényleges, visszaigazolt backend-átvételnél. A jelenlegi mailto űrlapok SOHA nem hívják |
| form_error | Külső beküldés hibája; jelenlegi konfigurációban nincs külső végpont |
| calculator_interaction | Első változtatás, összeg és kalkulátoreredmény nélkül |
| js_error / resource_error / unhandled_rejection | Analitikában legfeljebb 10 jelzés/oldal, nyers üzenet, stack, URL és személyes adat nélkül |

Igazolt leadnél a közvetlen mód Meta Lead, Google Ads conversion, LinkedIn event-specific conversion és TikTok SubmitForm eseményt ad (csak megadott ID-val és marketingengedéllyel). Jelenleg ilyen konverzió nem keletkezik, mert nincs visszaigazoló backend. CTA/kontakt kattintások külön másodlagos konverzióként jelölhetők a fiókokban; ne nevezd őket tényleges érdeklődésnek. Google Adsbe GA4-ből importált ÉS közvetlenül küldött ugyanazon lead közül csak az egyik legyen elsődleges, különben dupla konverziót számolhatsz.

Saját eseménymezők: event_name, page_path, page_location (query/hash nélkül), page_referrer (csak origin), target_path (csak ismert belső útvonal), language, form_id, cta_id, link_kind, error_kind, calculator_id, utm_source/medium/campaign/content/term, referrer_origin, landing_path. Fix allowlist. UTM-szövegek szűrve (80 karakter, nincs @, URL vagy hosszú számsor); kampánynevekbe személyes adatot tilos tenni. Attribúció kizárólag analitikai hozzájárulástól, sessionStorage-ban 30 perces inaktivitási ablakkal; engedély előtti navigációból nincs visszamenőleges attribúció. Csak az aktuális oldal UTM-je érhető el az első opt-innél. A visszavonás törli.

A betöltés előtt az SDK-k által olvasható oldal URL-jéből eltűnnek az ismeretlen query-paraméterek; marketingengedéllyel az engedélyezett click ID-k megmaradhatnak. Fix buildelt oldalútvonalat használunk (404-nél /404.html). Referrer-policy: origin. A külső SDK-k saját technikai gyűjtését a szolgáltatói feltételek szabályozzák; ne tegyél személyes adatot URL-be, UTM-be vagy oldal címébe. Automatikus advanced/enhanced matching nincs bekapcsolva a kódból. A Meta/TikTok/LinkedIn fiókban is ki kell kapcsolni az automatikus eseményfelismerést, Website Actions-t, adatgyűjtő eseményszerkesztőt és advanced/enhanced matchinget az aktiválás előtt; a távoli fiókbeállításokat a repó nem tudja felülvizsgálni.

## GTM beállítás

1. Kizárólag GTM_CONTAINER_ID + GTM_SERVICES, minden közvetlen ID üres; a build az ütközést hibával megállítja.
2. A consent default/update a konténer előtt a dataLayerbe kerül. Ne telepíts még egy bannert vagy default/update címkét.
3. A webes konténerben a `ufs_page_view`, `ufs_cta_click`, stb. custom eventekre készíts trigger-t. A paraméterek a `measurement.*` Data Layer Variables alatt vannak. A mérőobjektum eseményenként nullázódik, így korábbi form_id nem öröklődik tovább.
4. A Google tag send_page_view=false; ne legyen más All Pages/History Change automatikus page_view. GA4 Enhanced Measurement automatikus űrlap-, outbound- és history-mérését kapcsold ki, hogy ne duplikálja a saját eseményeket és ne gyűjtsön űrlapadatot. Google Signals, személyre szabott hirdetés és user-provided/enhanced conversion data kikapcsolva, amíg ezekről nincs külön döntés.
5. Minden analitikai címke analytics_storage engedélyt, minden marketingcímke ad_storage, ad_user_data és ad_personalization engedélyt igényeljen; a külső pixeleknél is állíts Additional Consent Checks-et. Ne fusson automatikus form scraper vagy PII-t olvasó változó.
6. A CSP csak a megadott szolgáltatók dokumentált domainjeit engedi. Nincs unsafe-eval, inline JS vagy tetszőleges Custom HTML megnyitás. Használj beépített címkéket / ellenőrzött sandboxed template-eket. További regionális endpointot és Preview-domain engedélyezést külön, konkrét kérés alapján kell felvenni, a teljes CSP fellazítása nélkül.
7. GTM admin módosítás is adatkezelési változás: tájékoztató, szolgáltatólista és hozzájárulásverzió felülvizsgálata szükséges.

## Ellenőrzés és élesítési kapuk

- Automatizált teszt: node scripts/build.mjs; node --test scripts/test-*.mjs. A hozzájárulási tesztek helyi ál-SDK-val futnak, nem küldenek adatot éles platformnak.
- Tiszta böngészőben, HU/EN és befektetői landing: választás előtt / elutasítás után nincs mérőscript vagy vendor hálózat, nincs attribúció; engedély nélkül működik a kapcsolatfelvétel.
- Analitika-only: GA4 indul, egy page_view; Meta/Ads/LinkedIn/TikTok nem. Marketing-only: marketing indul, GA4/analitikai sessionStorage nem. Mindkettő: minden beállított szolgáltató egyszer. GTM: alapértelmezetten a vegyes célú konténer mindkét engedélyt igényli; a teljesen auditált Urbanflip-konténer GTM_PURPOSE_GATING_VERIFIED=true beállítással célonként külön működik.
- Módosítás, visszavonás, lapváltás, új lapfül, sérült/lejárt/tárolhatatlan consent, 180 nap utáni hosszú ideig nyitva hagyott oldal. Mobil és billentyűzet/zoom: olvasható banner, fókusz elérhető, láblécből újranyitható.
- Tag Assistant: default mind a négy v2 mező denied, majd megfelelő update; Basic módban előzetes ping sincs. GA4 Realtime/DebugView: egy oldalnézet, CTA és form esemény egyszer, query/mezőérték nélkül. Egyéni dimenziókhoz a form_id, cta_id, calculator_id és language paramétereket már regisztráltuk eseményhatókörű egyéni dimenzióként.
- Meta Test Events / Pixel Helper, LinkedIn Insight Tag diagnostics, TikTok Test Events / Pixel Helper és Ads konverziódiagnosztika a tényleges fiókokkal. Ellenőrizd a hálózatot és a CSP hibákat; szükség esetén konkrét vendor endpointot adj hozzá.
- E-mail előkészítéskor email_draft_open látszik, generate_lead nem; backend bevezetésekor csak igazolt siker adhat konverziót, dupla beküldés ellen deduplikációval.
- Üres env-vel új build után nincs külső ID vagy tesztkód; git diff ellenőrzése a generált fájlokkal együtt. Publish előtt a fenti fiók- és jogi ellenőrzések befejezése szükséges.

Hivatalos referenciák: [Google Basic Consent Mode v2](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [Google CSP](https://developers.google.com/tag-platform/security/guides/csp), [GA4 eseményparaméterek](https://developers.google.com/analytics/devguides/collection/ga4/event-parameters), [Meta Pixel](https://developers.facebook.com/docs/meta-pixel/implementation/), [LinkedIn eseménykonverzió](https://www.linkedin.com/help/lms/answer/a1437736), [TikTok sütik és hozzájárulás](https://ads.tiktok.com/resources/help/article/how-to-use-cookies-with-tiktok-pixel), [EDPB hozzájárulási iránymutatás](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en).

## Beállított Google-fiókok – 2026. november 14.

- GTM: GTM-5RM2FGZ5, Urban Flip Studio / urbanflipstudio.com. A 3. verzió közzétéve: két GA4 és három Meta címke, öt eseménytrigger, 18 saját adatréteg-változó.
- GA4: G-11M7MVNNC8, Urban Flip Studio – weboldal; property 564317301, web stream 16340596325. Magyar időzóna és HUF.
- Automatikus továbbfejlesztett eseménymérés, Google Signals, hirdetés-személyre-szabás és automatikus user-provided data nincs engedélyezve a GTM-konfigurációban.
- A helyi előnézetből küldött page_view és cta_click esemény megjelent a GA4 valós idejű jelentésében. Hozzájárulás előtt nem volt külső script a DOM-ban; analitikai hozzájárulás után a GTM betöltődött.
- Az aktív webes build beállítása: GTM_CONTAINER_ID=GTM-5RM2FGZ5, GTM_SERVICES=ga4,meta és GTM_PURPOSE_GATING_VERIFIED=true. További szolgáltató hozzáadásakor a lista, a tájékoztató és a hozzájárulási verzió együtt frissítendő.

## Meta Pixel és ellenőrzött GTM célonkénti engedélyezés

Meta üzleti portfólió: Urban Flip Studio, 1755397495535379. Webes Pixel: 3075140532817657. A tulajdonos külön jóváhagyta a Meta Commercial Terms és Business Tools Terms elfogadását. Más márka eszközeit és további személyeket nem adtunk hozzá. Automatikus események és advanced matching kikapcsolva; Meta-enabled CAPI opt-in nincs engedélyezve.

Az Urbanflip konténer összes címkéjét ellenőriztük: GA4 → analytics_storage; minden Meta-címke → ad_storage + ad_user_data + ad_personalization. Ehhez az auditált konténerhez GTM_PURPOSE_GATING_VERIFIED=true állítható, ekkor részleges engedélynél is betöltődik a konténer, de a címkék saját célfeltételei kötelezők. Ismeretlen/nem auditált konténernél az érték false maradjon. Később hozzáadott címkénél ugyanezeket a feltételeket kötelező ellenőrizni.

Meta PageView csak ufs_marketing_page_view eseményre indul (az oldal betöltésekor érvényes marketingengedély, vagy az oldalon újonnan megadott marketingengedély után egyszer). Contact csak a három contact_*_click eseményre, Lead csak az igazolt generate_lead eseményre. Az analitika engedélyezése nem ad Meta-engedélyt; a marketing későbbi engedélyezése nem duplázza a GA4 oldalnézetet. Visszavonás újratölti az oldalt, és az új állapot szerint indulnak a címkék.

A Meta hivatalos v2.0.9 GTM-sablonja fbevents.js-t, valamint Meta paramétersegédet használhat. A CSP kizárólag a connect.facebook.net és a Meta csomag pontos jsDelivr/UNPKG útvonalait engedi scriptszinten; nincs általános CDN-domainengedély. Az ecommerce, GA4 ecommerce, advancedMatching és optInMetaCAPI opciók hamisak; disableAutoConfig és disablePushState igaz. A segéd alap technikai URL/kattintásparamétereket kezelhet; saját eseményadatként sem űrlapértéket, sem felhasználói személyes adatot nem adunk át.

A GA4 alapcímke Initialization mellett ufs_page_view eseményre is aktiválható, oldalanként egyszer. Így akkor is inicializál, ha előbb csak marketing-, majd később analitikai engedély érkezik. send_page_view=false, a tényleges oldalnézetet kizárólag az eseménycímke küldi.

2026. november 14-i ellenőrzés: 29 automatizált teszt sikeres. Helyi valódi GTM-betöltésnél engedély előtt és visszavonás után külső scriptlista üres; analitika-only mellett nincs Meta SDK; marketing-only mellett Meta betöltődik. Mindkét cél engedélyezésénél nem volt CSP- vagy böngészőhiba. A Google adatmegőrzési beállításai a tulajdonos döntése szerint változatlanok.

## Élesítés és fiókellenőrzés eredménye

- A GA4 és Meta módosításai élesek: [PR #13](https://github.com/martindobos123/project-olive/pull/13), [PR #14](https://github.com/martindobos123/project-olive/pull/14). A Meta-frissítés Pages közzététele sikeres (43593327923).
- Az éles domainen is ellenőrizve: engedély előtt és visszavonás után nincs külső mérőscript; csak analitika mellett nincs Meta SDK; marketingengedély után a Meta SDK a helyes Pixel ID-val töltődik. A vizsgált oldalon nem volt CSP-/böngészőhiba.
- A GA4 valós idejű jelentése tényleges page_view, cta_click és űrlapeseményeket fogadott. contact_phone_click, contact_email_click és contact_whatsapp_click kulcseseményként regisztrálva, munkamenetenként egyszer, alapértelmezett pénzérték nélkül. Ezek kattintások, nem igazolt leadek.
- Négy eseményhatókörű egyéni dimenzió létrehozva: cta_id, form_id, calculator_id, language.
- A Meta felületén a mai dátumra szűrve a feldolgozott események visszaigazolása az utolsó ellenőrzéskor még függőben volt. A Meta akár 30 perces késést jelez. A Pixel telepítése és engedélyhez kötött betöltése ellenőrizve; a Meta adatfogadása még nem tekinthető külön visszaigazoltnak.
- A böngésző a telefonlink megnyitását biztonsági okból blokkolta; ezt nem kerültük meg. A kontaktkattintás-kezelést automatizált teszt ellenőrzi; éles hívás indítása nem történt.
