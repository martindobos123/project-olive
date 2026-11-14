/* Consent-gated measurement. No SDK, event backlog or attribution storage before opt-in. */
(function () {
  'use strict';
  if (window.ufsMeasurement) return;
  var config = window.__ufsMeasurementConfig;
  var KEY = 'ufs-consent-v2', ATTR = 'ufs-attribution-v1', TTL = 180 * 86400000;
  var state = { analytics: false, marketing: false }, loaded = {}, closed = false;
  var bar = document.getElementById('consent'), opener = null;
  var path = document.documentElement.getAttribute('data-measure-path') || '/404.html';
  var language = document.documentElement.lang === 'en' ? 'en' : 'hu';
  var attribution = null, attributionAt = 0, consentTimer;
  var needsAnalytics = config.providers.includes('ga4');
  var needsMarketing = config.providers.some(function (provider) { return provider !== 'ga4'; });
  function gtmAllowed() { return config.purposeGatingVerified ? (state.analytics || state.marketing) : ((!needsAnalytics || state.analytics) && (!needsMarketing || state.marketing)); }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  function signal(command) {
    window.gtag('consent', command, {
      analytics_storage: state.analytics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
      functionality_storage: 'denied', personalization_storage: 'denied', security_storage: 'granted'
    });
  }
  signal('default');
  function readChoice() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && v.revision === config.revision && typeof v.analytics === 'boolean' && typeof v.marketing === 'boolean' &&
          Number.isFinite(v.at) && v.at <= Date.now() && Date.now() - v.at < TTL) return v;
    } catch (_) { /* Storage may be disabled; default remains denied. */ }
    return null;
  }
  function removeAttribution() {
    attribution = null;
    try { sessionStorage.removeItem(ATTR); } catch (_) {}
  }
  function clearCookies() {
    var domains = ['', location.hostname];
    var parts = location.hostname.split('.');
    for (var i = 0; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.trim().split('=')[0];
      if (!/^(_ga($|_)|_gid$|_gat|_gcl_|_fbp$|_fbc$|_ttp$|_tt_enable_cookie$|ttcsid|tt_|li_|__oppref$|__obref$)/.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      });
    });
  }
  function safeToken(value) {
    return typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9_. -]{0,79}$/.test(value) && !/\d{7,}/.test(value) ? value : '';
  }
  function origin(value) {
    try { var u = new URL(value); return /^https?:$/.test(u.protocol) ? u.origin : ''; } catch (_) { return ''; }
  }
  function captureAttribution() {
    if (!state.analytics) return;
    if (attribution && Date.now() - attributionAt >= 1800000) removeAttribution();
    if (attribution) return;
    var current = {}, query = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function (key) {
      var value = safeToken(query.get(key)); if (value) current[key] = value;
    });
    current.referrer_origin = origin(document.referrer);
    current.landing_path = path;
    try {
      // Only restore an allowlisted, versioned session record; never trust arbitrary storage fields.
      var previous = JSON.parse(sessionStorage.getItem(ATTR));
      if (previous && previous.revision === config.revision && Date.now() - previous.at < 1800000 && previous.at <= Date.now()) {
        ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function (key) { if (safeToken(previous[key])) current[key] = previous[key]; });
        if (config.paths.includes(previous.landing_path)) current.landing_path = previous.landing_path;
        current.referrer_origin = origin(previous.referrer_origin);
      }
      attribution = current; attributionAt = Date.now();
      sessionStorage.setItem(ATTR, JSON.stringify(Object.assign({ revision: config.revision, at: Date.now() }, current)));
    } catch (_) { attribution = current; attributionAt = Date.now(); }
  }
  function cleanAddress() {
    // Pixels inspect the address themselves. Drop arbitrary queries before loading any SDK.
    var query = new URLSearchParams(location.search), clean = new URLSearchParams();
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function (key) { var v = safeToken(query.get(key)); if (v) clean.set(key, v); });
    // Click identifiers are only exposed to advertising providers after marketing consent.
    if (state.marketing) ['gclid','gbraid','wbraid','fbclid','ttclid','oppref'].forEach(function (key) {
      var v = query.get(key); if (v && /^[\w-]{1,256}$/.test(v)) clean.set(key, v);
    });
    var hash = /^#[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(location.hash) ? location.hash : '';
    try { history.replaceState(history.state, '', path + (clean.size ? '?' + clean.toString() : '') + hash); } catch (_) {}
  }
  function script(name, url) {
    if (loaded[name]) return;
    loaded[name] = true;
    var el = document.createElement('script'); el.async = true; el.src = url; el.dataset.measurement = name;
    document.head.appendChild(el);
  }
  // Minimal image transport: no SDK, automatic matching, user object or browser-ID cookies.
  function openaiEvent(name, custom) {
    if (!state.marketing || closed || !config.openai) return;
    var query = new URLSearchParams({ pid: config.openai, event: name, 'data[type]': name === 'page_viewed' ? 'contents' : name === 'custom' ? 'custom' : 'customer_action' });
    query.set('event_id', 'ufs_' + Date.now() + '_' + Math.random().toString(36).slice(2));
    if (custom) query.set('custom_event_name', custom);
    var ref = new URLSearchParams(location.search).get('oppref');
    if (ref && /^[\w-]{1,256}$/.test(ref)) query.set('oppref', ref);
    var url = 'https://bzr.openai.com/v1/sdk/events?' + query.toString();
    // Keep click events alive while navigating to the contact page. No identifiers or credentials.
    if (name !== 'page_viewed' && typeof fetch === 'function') {
      fetch(url, { mode: 'no-cors', credentials: 'omit', keepalive: true, cache: 'no-store', referrerPolicy: 'origin' }).catch(function () {}); return;
    }
    var pixel = document.createElement('img'); pixel.hidden = true; pixel.width = 1; pixel.height = 1; pixel.alt = '';
    pixel.dataset.measurement = 'openai'; pixel.src = url;
    pixel.onload = pixel.onerror = function () { pixel.remove(); };
    document.body.appendChild(pixel);
  }
  function start() {
    if (!config.active || closed || !(state.analytics || state.marketing)) return;
    captureAttribution();
    cleanAddress();
    if (state.marketing && config.openai && !loaded.openai) {
      loaded.openai = true;
      openaiEvent('page_viewed');
    }
    if (config.gtm) {
      // Only the declared purposes can authorize this audited container.
      if (gtmAllowed() && !loaded.gtm) {
        window.dataLayer.push({ measurement: { page_path: path, page_location: location.origin + path, page_referrer: origin(document.referrer), language: language } });
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
        script('gtm', 'https://www.googletagmanager.com/gtm.js?id=' + config.gtm);
      }
      return;
    }
    if ((state.analytics && config.ga4) || (state.marketing && config.googleAds)) {
      if (!loaded.google) {
        window.gtag('js', new Date());
        window.gtag('set', 'ads_data_redaction', true);
        window.gtag('set', 'url_passthrough', false);
        script('google', 'https://www.googletagmanager.com/gtag/js?id=' + (state.analytics && config.ga4 ? config.ga4 : config.googleAds));
      }
      if (state.analytics && config.ga4 && !loaded.ga4) {
        loaded.ga4 = true;
        window.gtag('config', config.ga4, { send_page_view: false, cookie_expires: 15552000, cookie_update: false,
          allow_google_signals: false, allow_ad_personalization_signals: false,
          page_location: location.origin + path, page_referrer: origin(document.referrer) });
      }
      if (state.marketing && config.googleAds && !loaded.ads) {
        loaded.ads = true;
        window.gtag('config', config.googleAds, { send_page_view: false, allow_enhanced_conversions: false });
      }
    }
    if (state.marketing && config.meta && !loaded.meta) {
      var fb = window.fbq = window.fbq || function () { fb.callMethod ? fb.callMethod.apply(fb, arguments) : fb.queue.push(arguments); };
      if (!fb.queue) { fb.queue = []; fb.loaded = true; fb.version = '2.0'; fb.push = fb; }
      window._fbq = window._fbq || fb;
      fb('consent', 'grant'); fb('set', 'autoConfig', false, config.meta); fb('init', config.meta);
      script('meta', 'https://connect.facebook.net/en_US/fbevents.js'); fb('track', 'PageView');
    }
    if (state.marketing && config.linkedin && !loaded.linkedin) {
      window._linkedin_partner_id = config.linkedin;
      window._linkedin_data_partner_ids = [config.linkedin];
      var lintrk = window.lintrk = window.lintrk || function (a, b) { lintrk.q.push([a, b]); }; lintrk.q = lintrk.q || [];
      script('linkedin', 'https://snap.licdn.com/li.lms-analytics/insight.min.js');
    }
    if (state.marketing && config.tiktok && !loaded.tiktok) {
      window.TiktokAnalyticsObject = 'ttq';
      var ttq = window.ttq = window.ttq || [];
      var methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
      function defer(target, method) { target[method] = function () { target.push([method].concat(Array.prototype.slice.call(arguments))); }; }
      ttq.methods = methods; ttq.setAndDefer = defer;
      methods.forEach(function (method) { defer(ttq, method); });
      ttq._i = {}; ttq._i[config.tiktok] = []; ttq._i[config.tiktok]._u = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._t = {}; ttq._t[config.tiktok] = Date.now(); ttq._o = {}; ttq._o[config.tiktok] = {};
      ttq.instance = function (id) { var instance = ttq._i[id] || []; methods.forEach(function (m) { defer(instance, m); }); return instance; };
      ttq.grantConsent();
      script('tiktok', 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + config.tiktok + '&lib=ttq'); ttq.page();
    }
  }
  var allowed = ['page_view','cta_click','contact_phone_click','contact_email_click','contact_whatsapp_click','outbound_click','form_start','form_validation_error','form_submit_attempt','email_draft_open','form_error','generate_lead','js_error','resource_error','unhandled_rejection','calculator_interaction','marketing_page_view'];
  function track(name, params) {
    try {
      if (closed || !config.active || !allowed.includes(name) || !(state.analytics || state.marketing)) return false;
      // Expired consent must never authorize events, even in a long-lived tab.
      if (consentAt && Date.now() - consentAt >= TTL) { apply({ analytics: false, marketing: false }, false); return false; }
      if (config.gtm && !gtmAllowed()) return false;
      if (state.analytics) {
        captureAttribution(); attributionAt = Date.now();
        try { sessionStorage.setItem(ATTR, JSON.stringify(Object.assign({ revision: config.revision, at: attributionAt }, attribution))); } catch (_) {}
      }
      var data = { event_name: name, page_path: path, page_location: location.origin + path, page_referrer: origin(document.referrer), language: language };
      ['form_id','cta_id','link_kind','error_kind','calculator_id'].forEach(function (key) { if (params && safeToken(params[key])) data[key] = safeToken(params[key]); });
      if (params && config.paths.includes(params.target_path)) data.target_path = params.target_path;
      if (state.analytics && attribution) Object.assign(data, attribution);
      if (config.debug) data.debug_mode = true;
      if (state.marketing && config.openai && loaded.openai) {
        if (name === 'generate_lead') openaiEvent('lead_created');
        else if (/^contact_/.test(name) || name === 'cta_click') openaiEvent('custom', name);
      }
      if (config.gtm) { window.dataLayer.push({ measurement: null }); window.dataLayer.push({ event: 'ufs_' + name, measurement: data }); }
      else {
        if (state.analytics && config.ga4) window.gtag('event', name, Object.assign({ send_to: config.ga4 }, data));
        if (state.marketing && name === 'generate_lead') {
          if (config.meta) window.fbq('track', 'Lead');
          if (config.googleAds && config.adsLeadLabel) window.gtag('event', 'conversion', { send_to: config.googleAds + '/' + config.adsLeadLabel });
          if (config.linkedin && config.linkedinLead) window.lintrk('track', { conversion_id: Number(config.linkedinLead) });
          if (config.tiktok) window.ttq.track('SubmitForm');
        } else if (state.marketing && /^contact_/.test(name) && config.meta) window.fbq('track', 'Contact');
      }
      return true;
    } catch (_) { return false; } // Measuring must never break the website.
  }
  var consentAt = 0;
  function scheduleExpiry() {
    clearTimeout(consentTimer);
    var remaining = TTL - (Date.now() - consentAt);
    consentTimer = setTimeout(function () {
      if (Date.now() - consentAt >= TTL) { apply({ analytics: false, marketing: false }, false); show(); }
      else scheduleExpiry();
    }, Math.max(1, Math.min(remaining, 2147483647)));
  }
  function apply(next, persist, at) {
    var reduced = (state.analytics && !next.analytics) || (state.marketing && !next.marketing);
    var previous = { analytics: state.analytics, marketing: state.marketing };
    state = { analytics: needsAnalytics && !!next.analytics, marketing: needsMarketing && !!next.marketing };
    consentAt = at || Date.now();
    if (persist) { try { localStorage.removeItem(KEY); localStorage.setItem(KEY, JSON.stringify({ revision: config.revision, at: consentAt, analytics: state.analytics, marketing: state.marketing })); } catch (_) {} }
    scheduleExpiry();
    if (reduced) {
      // Stop application events immediately; reload discards SDK timers, listeners and pending queues.
      closed = true;
      if (config.ga4) window['ga-disable-' + config.ga4] = true;
      if (window.fbq) { window.fbq('consent', 'revoke'); if (window.fbq.queue) window.fbq.queue.length = 0; }
      if (window.ttq && window.ttq.revokeConsent) window.ttq.revokeConsent();
      window.dataLayer.length = 0;
      removeAttribution(); clearCookies();
      if (!persist) { try { localStorage.removeItem(KEY); } catch (_) {} }
      // Do not call a loaded Google SDK with denied consent: Basic Mode sends no denied-state pings.
      location.reload(); return;
    }
    signal('update'); start();
    if (state.analytics && !previous.analytics) track('page_view');
    if (config.gtm && state.marketing && !previous.marketing) track('marketing_page_view');
  }
  function show() {
    if (!bar) return;
    opener = document.activeElement;
    bar.hidden = false;
    if (bar.querySelector('[name=analytics]')) bar.querySelector('[name=analytics]').checked = state.analytics;
    if (bar.querySelector('[name=marketing]')) bar.querySelector('[name=marketing]').checked = state.marketing;
    bar.querySelector('button').focus();
  }
  window.ufsMeasurement = { track: track, openSettings: show };
  var choice = readChoice();
  if (choice) apply(choice, false, choice.at);
  else { removeAttribution(); clearCookies(); if (bar) bar.hidden = false; }
  try { localStorage.removeItem('ufs-consent'); } catch (_) {} // Legacy blanket opt-in is never upgraded.
  if (bar) {
    bar.querySelectorAll('[data-consent]').forEach(function (button) {
      button.addEventListener('click', function () {
        var action = button.dataset.consent;
        var next = action === 'save' ? { analytics: !!(bar.querySelector('[name=analytics]') && bar.querySelector('[name=analytics]').checked), marketing: !!(bar.querySelector('[name=marketing]') && bar.querySelector('[name=marketing]').checked) }
          : { analytics: action === 'all', marketing: action === 'all' };
        apply(next, true); bar.hidden = true;
        if (opener && opener.focus) opener.focus();
      });
    });
  }
  document.querySelectorAll('[data-consent-open]').forEach(function (button) { button.addEventListener('click', function (e) { e.preventDefault(); show(); }); });
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY && event.key !== null) return;
    // Re-evaluate in a clean document, including deletion and revocation from another tab.
    closed = true; removeAttribution(); clearCookies(); location.reload();
  });
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.hasAttribute('data-consent-open')) return;
    var url; try { url = new URL(a.getAttribute('href'), location.href); } catch (_) { return; }
    var kind = url.protocol === 'tel:' ? 'phone' : url.protocol === 'mailto:' ? 'email'
      : url.protocol === 'whatsapp:' || /^(wa.me|www.wa.me|api.whatsapp.com|web.whatsapp.com)$/.test(url.hostname) ? 'whatsapp' : '';
    if (kind) track('contact_' + kind + '_click');
    else if (a.matches('.btn, .link-arrow, [data-cta]')) track('cta_click', { cta_id: a.getAttribute('data-cta') || (a.closest('header') ? 'header' : a.closest('footer') ? 'footer' : a.closest('.mnav') ? 'mobile_nav' : a.closest('.hero') ? 'hero' : 'content'), target_path: url.origin === location.origin ? url.pathname : '' });
    else if (/^https?:$/.test(url.protocol) && url.origin !== location.origin) track('outbound_click', { link_kind: 'external' });
  });
  var forms = new WeakSet();
  function formId(form) { return form.id === 'contact-form' ? 'contact' : form.hasAttribute('data-preparation-form') ? 'preparation' : 'investor'; }
  document.addEventListener('focusin', function (e) {
    var form = e.target.closest && e.target.closest('#contact-form, [data-invest-form]');
    if (form && !forms.has(form) && track('form_start', { form_id: formId(form) })) forms.add(form);
  });
  var invalidForms = new WeakSet();
  document.addEventListener('invalid', function (e) {
    var form = e.target.form;
    if (!form || invalidForms.has(form)) return;
    invalidForms.add(form); track('form_validation_error', { form_id: formId(form) });
    setTimeout(function () { invalidForms.delete(form); }, 0);
  }, true);
  var calculators = new WeakSet();
  document.addEventListener('change', function (e) {
    var calc = e.target.closest && e.target.closest('[data-invest-calculator], [data-preparation-fee]');
    if (calc && !calculators.has(calc) && track('calculator_interaction', { calculator_id: calc.hasAttribute('data-invest-calculator') ? 'investor' : 'preparation' })) calculators.add(calc);
  });
  var errors = 0;
  window.addEventListener('error', function (event) { if (errors < 10 && track(event.target && event.target !== window ? 'resource_error' : 'js_error', { error_kind: 'runtime' })) errors++; }, true);
  window.addEventListener('unhandledrejection', function () { if (errors < 10 && track('unhandled_rejection', { error_kind: 'promise' })) errors++; });
})();
