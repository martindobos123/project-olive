/* Urban Flip Studio — progresszív bővítések. Minden tartalom JS nélkül is olvasható. */
(function () {
  'use strict';
  var doc = document;

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
    menuBtn.addEventListener('click', function () { window.location.href = '/kapcsolat/'; });
  }

  /* ---------- Before–after slider (csak data-mode="slider" esetén) ---------- */
  Array.prototype.forEach.call(doc.querySelectorAll('.ba[data-mode="slider"]'), function (fig) {
    var pair = fig.querySelector('.ba__pair');
    var room = fig.getAttribute('data-room') || '';
    var input = doc.createElement('input');
    input.type = 'range';
    input.min = '0'; input.max = '100'; input.step = '1'; input.value = '50';
    input.className = 'ba__range';
    input.setAttribute('aria-label', 'Előtte–utána összehasonlítás' + (room ? ' – ' + room : '') + '. Nagyobb értéknél több látszik az „előtte” képből.');
    var handle = doc.createElement('span');
    handle.className = 'ba__handle';
    handle.setAttribute('aria-hidden', 'true');
    var set = function () {
      pair.style.setProperty('--pos', input.value + '%');
      input.setAttribute('aria-valuetext', 'Előtte ' + input.value + '%, utána ' + (100 - input.value) + '%');
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
        status.textContent = 'Küldés…';
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) {
            if (!r.ok) throw new Error(String(r.status));
            status.textContent = 'Köszönjük, az üzenet megérkezett. Hamarosan jelentkezünk.';
            form.reset();
          })
          .catch(function () {
            status.textContent = 'Az üzenetet most nem sikerült elküldeni. Kérjük, írjon e-mailt vagy hívjon minket — az elérhetőségeket lent találja.';
          });
        return;
      }
      var lines = [];
      var labels = { nev: 'Név', email: 'E-mail', telefon: 'Telefon', helyszin: 'Ingatlan helye', szolgaltatas: 'Érdekelt szolgáltatás', kezdes: 'Tervezett kezdés', keret: 'Becsült keret', leiras: 'Leírás' };
      Object.keys(labels).forEach(function (k) {
        var v = (data.get(k) || '').toString().trim();
        if (v) lines.push(labels[k] + ': ' + v);
      });
      var to = form.getAttribute('data-mailto');
      var href = 'mailto:' + to + '?subject=' + encodeURIComponent('Projekt-megkeresés — ' + (data.get('helyszin') || '')) + '&body=' + encodeURIComponent(lines.join('\n'));
      status.textContent = 'Megnyitottuk a levelezőprogramját egy előre kitöltött üzenettel — a küldés gombbal juttathatja el hozzánk. Ha nem nyílt meg, írjon közvetlenül a ' + to + ' címre.';
      window.location.href = href;
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
