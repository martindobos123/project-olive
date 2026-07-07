# Project Olive — weboldal

Prémium, kétnyelvű (HU/EN) bemutató oldal a budapesti Project Olive lakáshoz.
Egyetlen önálló `index.html` — nincs build, nincs függőség.

## Fotók

A profi fotósorozat webre optimalizálva a helyén van (`images/`, 1500–2400 px,
WebP formátum). A videó 720p H.264 MP4-re konvertálva (`olive-video.mp4`) + poszter.

**Ami még hiányzik:** `before-1.jpg` és `after-1.jpg` — a felújítás ELŐTTI fotó
(lehetőleg ugyanabból a szögből, mint egy kész fotó). Amíg nincsenek meg, az
Előtte/utána szekció elegáns placeholderrel jelenik meg. Bemásolás után
`git add images && git commit && git push` — és élesedik.

## Kapcsolati adatok

- telefon / WhatsApp: `+36 70 604 3807`
- e-mail: `martindobos123@gmail.com`
- domain: `urbanflipstudio.com` (a `CNAME` fájlban is)

## Közzététel

GitHub Pages szolgálja ki, saját domainnel (Rackhost DNS → GitHub Pages).
Minden `git push` után pár másodperccel automatikusan frissül az élő oldal.
