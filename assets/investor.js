// Amounts are in HUF million at input, converted to whole forints before arithmetic.
export const DEFAULT_PROJECT = { purchase:45, renovation:8, other:2, sale:67, months:6 };
export function calculateProject({ purchase, renovation, other, sale, months }) {
  const values = [purchase, renovation, other, sale, months];
  if (!values.every(Number.isFinite) || purchase <= 0 || renovation < 0 || other < 0 || sale < 0 || months <= 0) return null;
  const total = Math.round(purchase * 1e6) + Math.round(renovation * 1e6) + Math.round(other * 1e6);
  const profit = Math.round(sale * 1e6) - total;
  const minimum = Math.round(total * .03);
  const investor = Math.max(Math.floor(profit / 2), minimum);
  const operator = profit - investor;
  // A shortfall requires actual money from Urbanflip; never imply it comes from sale proceeds.
  const guaranteeFunding = Math.max(0, -operator);
  const roi = investor / total * 100;
  const annualized = (Math.pow(1 + investor / total, 12 / months) - 1) * 100;
  return { total, profit, operator, investor, minimum, guaranteeFunding, settlement:total+investor, roi, annualized, months };
}

// An illustrative sequence, not an annual-return forecast: two equal percentage results,
// full proceeds reinvested, proportional costs and no added waiting period or personal taxes.
export function calculateTwoProjects(result) {
  if (!result || result.total <= 0 || !Number.isFinite(result.roi)) return null;
  const secondResult = Math.round(result.settlement * result.roi / 100);
  const settlement = result.settlement + secondResult;
  return { settlement, roi: (settlement / result.total - 1) * 100, months: 2 * result.months };
}

// FormSubmit can return HTTP 200 with success: "false" (for example before activation).
export async function sendInvestorEnquiry(endpoint, payload, fetcher = fetch, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(endpoint, {
      method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(payload), signal:controller.signal,
    });
    const data = await response.json();
    if (!response.ok || !(data.success === true || data.success === 'true')) {
      return { ok:false, activation:/activat/i.test(String(data.message || '')) };
    }
    return { ok:true };
  } catch {
    return { ok:false, activation:false };
  } finally { clearTimeout(timeout); }
}

if (typeof document !== 'undefined') {
  const en = document.documentElement.lang === 'en';
  const locale = en ? 'en-GB' : 'hu-HU';
  const money = n => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n) + (en ? ' HUF' : ' Ft');
  const number = n => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n);
  const root = document.querySelector('[data-invest-calculator]');
  if (root) {
    const inputs = [...root.querySelectorAll('input[type=number]')];
    const result = root.querySelector('.invest-result');
    const status = root.querySelector('[data-calc-status]');
    const render = () => {
      const valid = inputs.every(el => el.validity.valid && el.value !== '');
      const data = Object.fromEntries(inputs.map(el => [el.name, el.valueAsNumber]));
      const numbers = valid ? calculateProject(data) : null;
      if (!numbers) {
        status.textContent = en ? 'Enter valid figures within the displayed ranges. The previous result is not applicable.' : 'Adjon meg érvényes számokat a mezők tartományán belül. A korábbi eredmény nem alkalmazható.';
        root.querySelectorAll('[data-result]').forEach(el => { el.textContent = '—'; });
        root.querySelectorAll('[data-two]').forEach(el => { el.textContent = '—'; });
        result.classList.remove('is-loss');
        return;
      }
      status.textContent = numbers.guaranteeFunding > 0
        ? (en ? 'This result includes ' + money(numbers.guaranteeFunding) + ' funded by Urbanflip to meet its contractual profit guarantee. This amount is not covered by sale proceeds.' : 'A profitgarancia teljesítéséhez ez a példa ' + money(numbers.guaranteeFunding) + ' Urbanflip-pótlást tartalmaz. Ezt az összeget az eladási bevétel nem fedezi.')
        : (numbers.roi <= 3 ? (en ? 'The calculation applies the 3% contractual profit guarantee.' : 'A számítás a projektenkénti 3%-os profitgaranciát alkalmazza.') : '');
      for (const key of ['total', 'profit', 'operator', 'investor', 'settlement']) root.querySelector(`[data-result="${key}"]`).textContent = money(numbers[key]);
      root.querySelector('[data-result="annualized"]').textContent = number(numbers.annualized) + '%';
      root.querySelector('[data-result="roi"]').textContent = number(numbers.roi) + '%';
      root.querySelector('[data-result="duration"]').textContent = numbers.months + (en ? ' months' : ' hónap');
      const two = calculateTwoProjects(numbers);
      root.querySelector('[data-two="settlement"]').textContent = money(two.settlement);
      root.querySelector('[data-two="roi"]').textContent = number(two.roi) + '%';
      root.querySelector('[data-two="duration"]').textContent = two.months + (en ? ' months' : ' hónap');
      root.querySelectorAll('input[type=range]').forEach(el => { el.setAttribute('aria-valuetext', number(data[el.dataset.pair]) + (el.dataset.pair === 'months' ? (en ? ' months' : ' hónap') : (en ? ' HUF million' : ' millió Ft'))); });
    };
    root.querySelectorAll('input[type=range]').forEach(slider => slider.addEventListener('input', () => {
      root.querySelector(`[name="${slider.dataset.pair}"]`).value = slider.value;
      render();
    }));
    inputs.forEach(input => input.addEventListener('input', () => {
      if (input.validity.valid && input.value !== '') root.querySelector(`[data-pair="${input.name}"]`).value = input.value;
      render();
    }));
    render();
  }

  const form = document.querySelector('[data-invest-form]');
  if (form) form.addEventListener('submit', async event => {
    event.preventDefault();
    if (form.dataset.sending === 'true' || !form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get('_honey') || '').trim()) return;
    const submit = form.querySelector('[type=submit]');
    const status = form.querySelector('.form__status');
    const label = submit.textContent;
    const payload = Object.fromEntries([...data.entries()].map(([key,value])=>[key,String(value).trim()]));
    payload._url = window.location.origin + window.location.pathname;
    form.dataset.sending = 'true';
    form.setAttribute('aria-busy','true');
    submit.disabled = true;
    submit.textContent = en ? 'Sending…' : 'Küldés…';
    status.textContent = en ? 'Sending your enquiry…' : 'Érdeklődés küldése…';
    const result = await sendInvestorEnquiry(form.dataset.endpoint, payload);
    if (result.ok) {
      form.reset();
      status.textContent = en ? 'Thank you, your enquiry has been sent. We will contact you using the details you provided.' : 'Köszönjük, az érdeklődését elküldtük. A megadott elérhetőségén keressük.';
    } else {
      status.textContent = result.activation
        ? (en ? 'The form is awaiting email activation. Your message is not confirmed as sent. Please contact us using the email address below.' : 'Az űrlap e-mailes aktiválásra vár, az üzenet elküldését még nem tudjuk visszaigazolni. Kérjük, írjon a lenti e-mail-címre.')
        : (en ? 'We could not confirm submission. Your entries are preserved. Please try again or use the email address below.' : 'Nem sikerült visszaigazolni a küldést. A kitöltött adatai megmaradtak. Próbálja újra, vagy írjon a lenti e-mail-címre.');
    }
    submit.disabled = false;
    submit.textContent = label;
    form.dataset.sending = 'false';
    form.removeAttribute('aria-busy');
    status.focus();
  });
}
