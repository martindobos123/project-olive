/* Urban Flip Studio — progresszív bővítések. Minden tartalom JS nélkül is olvasható. */
(function () {
  'use strict';
  var doc = document;
  var EN = doc.documentElement.lang === 'en';
  var T = EN ? {
    contact: '/en/contact/',
    compare: 'Before and after comparison', compareHint: 'Higher values show more of the “before” photo.',
    before: 'Before', after: 'after',
    sending: 'Sending…',
    sent: 'Thank you, your message has arrived. We will be in touch soon.',
    failed: 'We could not send your message right now. Please email or call us — you will find our details below.',
    labels: { nev: 'Name', email: 'Email', telefon: 'Phone', helyszin: 'Property location', szolgaltatas: 'Service', kezdes: 'Planned start', keret: 'Estimated budget', leiras: 'Description' },
    subject: 'Project enquiry — ',
    mailto: function (to) { return 'We opened your email app with a pre-filled message — press send to deliver it. If it did not open, write to us directly at ' + to + '.'; },
  } : {
    contact: '/kapcsolat/',
    compare: 'Előtte–utána összehasonlítás', compareHint: 'Nagyobb értéknél több látszik az „előtte” képből.',
    before: 'Előtte', after: 'utána',
    sending: 'Küldés…',
    sent: 'Köszönjük, az üzenet megérkezett. Hamarosan jelentkezünk.',
    failed: 'Az üzenetet most nem sikerült elküldeni. Kérjük, írjon e-mailt vagy hívjon minket — az elérhetőségeket lent találja.',
    labels: { nev: 'Név', email: 'E-mail', telefon: 'Telefon', helyszin: 'Ingatlan helye', szolgaltatas: 'Érdekelt szolgáltatás', kezdes: 'Tervezett kezdés', keret: 'Becsült keret', leiras: 'Leírás' },
    subject: 'Projekt-megkeresés — ',
    mailto: function (to) { return 'Megnyitottuk a levelezőprogramját egy előre kitöltött üzenettel — a küldés gombbal juttathatja el hozzánk. Ha nem nyílt meg, írjon közvetlenül a ' + to + ' címre.'; },
  };

  /* ---------- Fejléc: a kezdőlapon a hero fölött átlátszó, görgetéskor visszafogott sticky ---------- */
  var header = doc.querySelector('.header--overlay');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-solid', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobilmenü: natív modális <dialog> (fókuszcsapda + Escape a böngészőtől) ---------- */
  var menuBtn = doc.getElementById('menu-open');
  var mnav = doc.getElementById('mnav');
  if (menuBtn && mnav && typeof mnav.showModal === 'function') {
    menuBtn.addEventListener('click', function () {
      mnav.showModal();
      menuBtn.setAttribute('aria-expanded', 'true');
    });
    mnav.addEventListener('close', function () {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    });
    mnav.querySelector('.mnav__close').addEventListener('click', function () { mnav.close(); });
    mnav.addEventListener('click', function (e) {
      if (e.target === mnav) mnav.close(); // a háttérre kattintás bezár
      if (e.target.closest('a')) mnav.close();
    });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1000 && mnav.open) mnav.close(); });
  } else if (menuBtn) {
    menuBtn.addEventListener('click', function () { window.location.href = T.contact; });
  }

  /* ---------- Before–after slider (csak data-mode="slider" esetén) ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('.ba[data-mode="slider"]'), function (fig) {
    var pair = fig.querySelector('.ba__pair');
    var room = fig.getAttribute('data-room') || '';
    var input = doc.createElement('input');
    input.type = 'range';
    input.min = '0'; input.max = '100'; input.step = '1'; input.value = '50';
    input.className = 'ba__range';
    input.setAttribute('aria-label', T.compare + (room ? ' – ' + room : '') + '. ' + T.compareHint);
    var handle = doc.createElement('span');
    handle.className = 'ba__handle';
    handle.setAttribute('aria-hidden', 'true');
    var set = function () {
      pair.style.setProperty('--pos', input.value + '%');
      input.setAttribute('aria-valuetext', T.before + ' ' + input.value + '%, ' + T.after + ' ' + (100 - input.value) + '%');
    };
    input.addEventListener('input', set);
    // egér + érintés: pointer-események (a touch-action: pan-y miatt a függőleges görgetés megmarad)
    var dragging = false;
    var fromX = function (e) {
      var r = pair.getBoundingClientRect();
      input.value = String(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100));
      set();
    };
    pair.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      dragging = true;
      try { pair.setPointerCapture(e.pointerId); } catch (err) { /* régi böngésző */ }
      fromX(e);
      input.focus({ preventScroll: true });
      e.preventDefault();
    });
    pair.addEventListener('pointermove', function (e) { if (dragging) fromX(e); });
    var stop = function () { dragging = false; };
    pair.addEventListener('pointerup', stop);
    pair.addEventListener('pointercancel', stop);
    pair.appendChild(input);
    pair.appendChild(handle);
    fig.classList.add('ba--slider');
    var hint = fig.querySelector('.ba__hint');
    if (hint) hint.hidden = false;
    set();
  });

  /* ---------- Tervlapozó (PlanCarousel): natív scroll-snap sor + nyilak, fülek, számláló ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-plan-carousel]'), function (root) {
    var track = root.querySelector('.plans-carousel__track');
    var slides = Array.prototype.slice.call(track.children);
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var count = root.querySelector('.plans-carousel__count');
    if (!slides.length) return;
    var current = 0;
    var render = function (i) {
      current = i;
      tabs.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      if (count) count.textContent = (i + 1) + ' / ' + slides.length;
    };
    var goTo = function (i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      render(i);
    };
    tabs.forEach(function (b) { b.addEventListener('click', function () { goTo(Number(b.getAttribute('data-index'))); }); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-dir]'), function (b) {
      b.addEventListener('click', function () { goTo(current + Number(b.getAttribute('data-dir'))); });
    });
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var w = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '0');
        var i = Math.round(track.scrollLeft / (w || 1));
        if (i !== current) render(Math.max(0, Math.min(slides.length - 1, i)));
      });
    }, { passive: true });
    root.classList.add('is-ready');
    render(0);
  });

  /* ---------- Galéria: kezdetben csak az első képek töltődnek, a többi gombnyomásra ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-gallery]'), function (list) {
    var more = list.parentNode.querySelector('.gallery-more button');
    if (!more) return;
    more.addEventListener('click', function () {
      var hidden = list.querySelectorAll('li.is-hidden');
      Array.prototype.forEach.call(hidden, function (li) { li.classList.remove('is-hidden'); });
      more.parentNode.hidden = true;
      if (hidden[0]) hidden[0].querySelector('button').focus();
    });
  });

  /* ---------- AccessibleLightbox: <dialog>, fókuszcsapda + Escape natívan, nyilak lapoznak ---------- */
  var lb = doc.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('.lightbox__stage img');
    var lbCap = lb.querySelector('.lightbox__caption');
    var lbCount = lb.querySelector('.lightbox__count');
    var items = [], idx = 0, opener = null;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      var b = items[idx];
      lbImg.src = b.getAttribute('data-full');
      lbImg.alt = b.getAttribute('data-alt') || '';
      lbCap.textContent = b.getAttribute('data-alt') || '';
      lbCount.textContent = (idx + 1) + ' / ' + items.length;
    };
    doc.addEventListener('click', function (e) {
      var b = e.target.closest('[data-full]');
      if (!b) return;
      var group = b.closest('[data-gallery]');
      items = Array.prototype.slice.call(group.querySelectorAll('[data-full]'));
      opener = b;
      show(items.indexOf(b));
      lb.showModal();
    });
    lb.querySelector('.lightbox__close').addEventListener('click', function () { lb.close(); });
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(idx - 1); });
    lb.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(idx - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { show(idx + 1); e.preventDefault(); }
    });
    lb.addEventListener('close', function () {
      lbImg.removeAttribute('src');
      if (opener) {
        var li = opener.closest('li.is-hidden');
        if (!li) opener.focus();
      }
    });
  }

  /* ---------- Kapcsolati űrlap ----------
     Ha van data-endpoint: fetch POST, és CSAK valódi 2xx válasz után ír sikert.
     Ha nincs: a látogató levelezőjében nyit egy előre kitöltött e-mailt (nem jelez hamis sikert). */
  var form = doc.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form__status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = new FormData(form);
      var endpoint = form.getAttribute('data-endpoint');
      if (endpoint) {
        status.textContent = T.sending;
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(String(r.status));
            status.textContent = T.sent;
            form.reset();
          })
          .catch(function () {
            status.textContent = T.failed;
          });
        return;
      }
      var lines = [];
      var labels = T.labels;
      Object.keys(labels).forEach(function (k) {
        var v = (data.get(k) || '').toString().trim();
        if (v) lines.push(labels[k] + ': ' + v);
      });
      var to = form.getAttribute('data-mailto');
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent(T.subject + (data.get('helyszin') || '')) + '&body=' + encodeURIComponent(lines.join('\n'));
      status.textContent = T.mailto(to);
      window.location.href = href;
    });
  }

  /* ---------- ChatGPT Ads (OpenAI Measurement Pixel): kapcsolat-kattintás mérés ----------
     A Pixel betöltőjét a build adja (assets/oaiq-init.js, CSAK ha a site.oaiPixelId ki van töltve); itt csak
     a dokumentált oaiq("measure", "custom", { type: "custom" }, { custom_event_name }) hívás történik.
     - EGY delegált click-figyelő (nincs dupla listener; a később beszúrt linkeket is lefedi; az Enter/Space
       billentyű és a beágyazott ikon/szöveg kattintása is a linken köt ki: closest('a[href]')).
     - Soha nem hív preventDefault-ot és try/catch-ben fut: a tárcsázó/levelező/WhatsApp mindig megnyílik.
     - Csak a kapcsolat-link aktiválása számít; a /kapcsolat oldalra navigálás NEM.
     - A linkek célját (telefonszám, e-mail-cím) NEM küldjük el — csak az eseménynevet.
     - A hozzájárulást a Pixel saját mechanizmusa kezeli (oaiq("consent", …), lásd lent); elutasításkor az
       SDK nem küld eseményt, nekünk itt nincs külön feltétel. */
  var EVENT_BY_KIND = { phone: 'contact_phone_click', whatsapp: 'contact_whatsapp_click', email: 'contact_email_click' };
  var contactKind = function (href) {
    if (!href) return null;
    var h = href.trim().toLowerCase();
    if (h.indexOf('tel:') === 0) return 'phone';
    if (h.indexOf('mailto:') === 0) return 'email';
    if (h.indexOf('whatsapp:') === 0) return 'whatsapp';
    var m = /^https?:\/\/([^/?#]+)/.exec(h);
    if (m && (m[1] === 'wa.me' || m[1] === 'www.wa.me' || m[1] === 'api.whatsapp.com' || m[1] === 'web.whatsapp.com')) return 'whatsapp';
    return null;
  };
  var measureContact = function (kind) {
    try {
      if (typeof window.oaiq !== 'function') return false;
      window.oaiq('measure', 'custom', { type: 'custom' }, { custom_event_name: EVENT_BY_KIND[kind] });
      return true;
    } catch (err) { return false; }
  };
  if (!window.__ufsContactTracking) {
    window.__ufsContactTracking = true;
    var lastEvent = null;
    doc.addEventListener('click', function (e) {
      try {
        if (e === lastEvent) return; // ugyanaz az esemény kétszer (pl. kétszer kötött kód) → egyszer számít
        lastEvent = e;
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var kind = contactKind(a.getAttribute('href'));
        if (kind) measureContact(kind);
      } catch (err) { /* a mérés hibája soha nem akadályozhatja a kapcsolatfelvételt */ }
    });
  }
  window.__ufsContactKind = contactKind; // teszteléshez

  /* ---------- Hozzájárulás-sáv a Pixelhez (csak ha a build betette: <html data-oai-pixel>) ----------
     Tárolt döntés: localStorage 'ufs-consent' = 'granted' | 'denied'. Alapértelmezés: megtagadva
     (az oaiq-init.js az init ELŐTT oaiq("consent", false)-t hív, ha nincs tárolt engedély). */
  var consentBar = doc.getElementById('consent');
  if (consentBar && doc.documentElement.hasAttribute('data-oai-pixel')) {
    var KEY = 'ufs-consent';
    var stored = null;
    try { stored = window.localStorage.getItem(KEY); } catch (err) { /* privát mód */ }
    var applyConsent = function (granted) {
      try { if (typeof window.oaiq === 'function') window.oaiq('consent', !!granted); } catch (err) { /* nincs SDK */ }
    };
    if (stored === 'granted' || stored === 'denied') {
      applyConsent(stored === 'granted');
    } else {
      consentBar.hidden = false;
    }
    Array.prototype.forEach.call(consentBar.querySelectorAll('[data-consent]'), function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-consent');
        try { window.localStorage.setItem(KEY, v); } catch (err) { /* privát mód */ }
        applyConsent(v === 'granted');
        consentBar.hidden = true;
      });
    });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-consent-open]'), function (l) {
      l.addEventListener('click', function (e) { e.preventDefault(); consentBar.hidden = false; consentBar.querySelector('button').focus(); });
    });
  }

  /* ---------- Látogatásmérés (GoatCounter, süti nélkül) — csak ha be van állítva ---------- */
  var gcCode = doc.documentElement.getAttribute('data-gc');
  if (gcCode) {
    var gc = doc.createElement('script');
    gc.async = true;
    gc.src = 'https://gc.zgo.at/count.js';
    gc.setAttribute('data-goatcounter', 'https://' + gcCode + '.goatcounter.com/count');
    doc.head.appendChild(gc);
  }
})();
