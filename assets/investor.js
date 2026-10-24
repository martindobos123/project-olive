// Amounts are in HUF million at input, converted to whole forints before arithmetic.
export function calculateProject({ purchase, renovation, other, sale, months }) {
  const values = [purchase, renovation, other, sale, months];
  if (!values.every(Number.isFinite) || purchase <= 0 || renovation < 0 || other < 0 || sale < 0 || months <= 0) return null;
  const total = Math.round(purchase * 1e6) + Math.round(renovation * 1e6) + Math.round(other * 1e6);
  const profit = Math.round(sale * 1e6) - total;
  const operator = profit > 0 ? Math.floor(profit / 2) : 0;
  // Unagreed loss allocation must not imply a guarantee: show the full downside as a stress case.
  const investor = profit - operator;
  return { total, profit, operator, investor, settlement: total + investor, roi: investor / total * 100, months };
}

// An illustrative sequence, not an annual-return forecast: two equal percentage results,
// full proceeds reinvested, proportional costs and no added waiting period or personal taxes.
export function calculateTwoProjects(result) {
  if (!result || result.total <= 0 || !Number.isFinite(result.roi)) return null;
  const secondResult = Math.round(result.settlement * result.roi / 100);
  const settlement = result.settlement + secondResult;
  return { settlement, roi: (settlement / result.total - 1) * 100, months: 2 * result.months };
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
      status.textContent = numbers.profit < 0
        ? (en ? 'Loss scenario: no positive profit to share. This stress example assigns the full loss to the investor; the actual allocation must be agreed.' : 'Veszteséges példa: nincs felezhető pozitív profit. A stresszpélda a teljes veszteséget a befektetőre terheli; a tényleges veszteségviselésről meg kell állapodni.')
        : (numbers.profit === 0 ? (en ? 'Break-even: no positive profit to share.' : 'Nullszaldó: nincs felezhető pozitív profit.') : '');
      result.classList.toggle('is-loss', numbers.profit < 0);
      for (const key of ['total', 'profit', 'operator', 'investor', 'settlement']) root.querySelector(`[data-result="${key}"]`).textContent = money(numbers[key]);
      root.querySelector('[data-result="roi"]').textContent = number(numbers.roi) + '% ' + (en ? 'project return, before personal taxes' : 'projekthozam, személyes adók előtt');
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
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const labels = en ? { name:'Name', email:'Email', budget:'Planned capital', phone:'Phone', message:'Timing / questions' } : { name:'Név', email:'E-mail', budget:'Tervezett tőke', phone:'Telefon', message:'Időzítés / kérdések' };
    const lines = Object.entries(labels).map(([key, label]) => `${label}: ${String(data.get(key) || '').trim()}`).join('\n');
    const to = form.dataset.mailto;
    const subject = en ? 'Investor enquiry — Urban Flip Studio' : 'Befektetői érdeklődés — Urban Flip Studio';
    form.querySelector('.form__status').textContent = en ? 'Email preparation requested. Send it from your email app. If it did not open, use the email address below.' : 'Kértük az e-mail összeállítását. Az üzenetet a saját levelezőjéből kell elküldenie. Ha nem nyílt meg, használja a lenti e-mail-címet.';
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines + '\n\n' + (en ? 'Enquiry page: ' : 'Érdeklődés oldala: ') + window.location.pathname);
  });
}
