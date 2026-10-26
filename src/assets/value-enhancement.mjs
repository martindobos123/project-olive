// The commission is based on the full apartment sale price, with a fixed minimum.
export const PREPARATION_RATE = .03;
export const PREPARATION_MINIMUM = 1_500_000;
export function preparationFee(salePrice) {
  if (!Number.isFinite(salePrice) || salePrice <= 0) return null;
  return Math.max(PREPARATION_MINIMUM, Math.round(salePrice * PREPARATION_RATE));
}

if (typeof document !== 'undefined') {
  const calculator = document.querySelector('[data-preparation-fee]');
  if (calculator) {
    const input = calculator.querySelector('input[type=number]');
    const slider = calculator.querySelector('input[type=range]');
    const output = calculator.querySelector('[data-fee-output]');
    const en = document.documentElement.lang === 'en';
    const render = () => {
      const fee = input.value !== '' && input.validity.valid ? preparationFee(input.valueAsNumber * 1e6) : null;
      output.textContent = fee === null ? '—' : new Intl.NumberFormat(en ? 'en-GB' : 'hu-HU').format(fee) + (en ? ' HUF' : ' Ft');
      calculator.querySelector('[data-fee-error]').hidden = fee !== null;
    };
    input.addEventListener('input', () => { slider.value = input.value; render(); });
    slider.addEventListener('input', () => { input.value = slider.value; render(); });
    render();
  }
}
