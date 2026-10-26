import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preparationFee, preparationOutcome } from '../src/assets/value-enhancement.mjs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('gross commission applies to the whole sale price, including the minimum boundary',()=>{
  assert.equal(preparationFee(40e6),1_500_000);
  assert.equal(preparationFee(49e6),1_500_000);
  assert.equal(preparationFee(50e6),1_500_000);
  assert.equal(preparationFee(51e6),1_530_000);
  assert.equal(preparationFee(60e6),1_800_000);
  assert.equal(preparationFee(100e6),3_000_000);
  assert.equal(preparationFee(60_000_019),1_800_001);
});
test('missing and invalid sale prices do not produce a commission',()=>{
  for(const n of [undefined,null,NaN,Infinity,-Infinity,0,-1,'60000000']) assert.equal(preparationFee(n),null);
});
test('owner keeps the price increase after the gross commission on the full sale price',()=>{
  assert.deepEqual(preparationOutcome(60e6,65e6),{uplift:5e6,fee:1_950_000,extra:3_050_000});
  assert.deepEqual(preparationOutcome(40e6,45e6),{uplift:5e6,fee:1_500_000,extra:3_500_000});
});
test('unchanged or lower prices show the full negative difference without concealing the fee',()=>{
  assert.deepEqual(preparationOutcome(60e6,60e6),{uplift:0,fee:1_800_000,extra:-1_800_000});
  assert.deepEqual(preparationOutcome(60e6,59e6),{uplift:-1e6,fee:1_770_000,extra:-2_770_000});
  for(const n of [undefined,null,NaN,Infinity,0,-1,'60000000']) {
    assert.equal(preparationOutcome(n,65e6),null);
    assert.equal(preparationOutcome(60e6,n),null);
  }
});
test('both languages expose discoverable, indexable pages with matching FAQ and accessible enquiry forms',()=>{
  for(const [route,other,home,services,privacy] of [
    ['/erteknoveles/','/en/sale-preparation/','index.html','szolgaltatasok/index.html','adatkezeles/index.html'],
    ['/en/sale-preparation/','/erteknoveles/','en/index.html','en/services/index.html','en/privacy/index.html'],
  ]) {
    const html=read(route.slice(1)+'index.html');
    assert.ok(html.includes(`<link rel="canonical" href="https://urbanflipstudio.com${route}">`));
    assert.ok(html.includes(`href="https://urbanflipstudio.com${other}"`));
    assert.ok(read('sitemap.xml').includes(`https://urbanflipstudio.com${route}`));
    for(const entry of [home,services]) assert.ok(read(entry).includes(`href="${route}"`));
    const json=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).flat();
    assert.ok(json.some(j=>j['@type']==='Service'&&j.url===`https://urbanflipstudio.com${route}`));
    const faq=json.find(j=>j['@type']==='FAQPage');
    assert.equal(faq.mainEntity.length,7);
    for(const q of faq.mainEntity){ assert.ok(html.includes(q.name));assert.ok(html.includes(q.acceptedAnswer.text)); }
    assert.ok(html.includes('data-preparation-form'));
    assert.ok(html.includes('https://formsubmit.co/ajax/'));
    for(const id of ['value-name','value-email','value-location','value-condition','value-consent']) {
      assert.match(html,new RegExp(`id="${id}"[^>]*required`));
      assert.ok(html.includes(`for="${id}"`));
    }
    assert.ok(html.includes('name="_honey"'));
    assert.ok(html.includes('role="status" aria-live="polite"'));
    assert.ok(read(privacy).includes(route.startsWith('/en')?'sale-preparation':'értéknövelési'));
    assert.ok(html.indexOf('id="value-faq-title"')<html.indexOf('id="egyeztetes"'));
    // Integer controls avoid presenting a fractional million as a step.
    assert.match(html, /type="range" min="10" max="300" step="1"/);
    assert.match(html, /type="number" min="10" max="300" step="1"/);
  }
});
