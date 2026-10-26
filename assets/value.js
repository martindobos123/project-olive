// The commission is based on the full apartment sale price, with a fixed minimum.
export const PREPARATION_RATE = .03;
export const PREPARATION_MINIMUM = 1_500_000;
export function preparationFee(salePrice) {
  if (!Number.isFinite(salePrice) || salePrice <= 0) return null;
  return Math.max(PREPARATION_MINIMUM, Math.round(salePrice * PREPARATION_RATE));
}

export function preparationOutcome(originalPrice, preparedPrice) {
  if (!Number.isFinite(originalPrice) || originalPrice <= 0) return null;
  const fee = preparationFee(preparedPrice);
  if (fee === null) return null;
  const uplift = preparedPrice - originalPrice;
  return { uplift, fee, extra: uplift - fee };
}

if (typeof document !== 'undefined') {
  const calculator = document.querySelector('[data-preparation-fee]');
  if (calculator) {
    const original = calculator.querySelector('[name=original]');
    const prepared = calculator.querySelector('[name=prepared]');
    const en = document.documentElement.lang === 'en';
    const render = () => {
      const valid = [original, prepared].every(input => input.value !== '' && input.validity.valid);
      const result = valid ? preparationOutcome(original.valueAsNumber * 1e6, prepared.valueAsNumber * 1e6) : null;
      const money = n => new Intl.NumberFormat(en ? 'en-GB' : 'hu-HU').format(n) + (en ? ' HUF' : ' Ft');
      for (const key of ['uplift','fee','extra']) calculator.querySelector(`[data-${key}-output]`).textContent = result === null ? '—' : money(result[key]);
      calculator.querySelector('[data-extra-label]').textContent = result && result.extra < 0
        ? (en ? 'Your difference after commission' : 'Az Ön különbözete a jutalék után')
        : (en ? 'Extra proceeds you keep after commission' : 'Ennyivel marad több Önnél a jutalék után');
      calculator.querySelector('[data-fee-error]').hidden = result !== null;
      calculator.querySelector('[data-outcome-negative]').hidden = !result || result.extra >= 0;
    };
    calculator.querySelectorAll('[data-price-control]').forEach(control => {
      const input = control.querySelector('input[type=number]');
      const slider = control.querySelector('input[type=range]');
      input.addEventListener('input', () => { slider.value = input.value; render(); });
      slider.addEventListener('input', () => { input.value = slider.value; render(); });
    });
    render();
  }
}
