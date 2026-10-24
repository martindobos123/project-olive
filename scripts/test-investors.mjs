import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { calculateProject, calculateTwoProjects } from '../src/assets/investor.mjs';

const example = { purchase:38, renovation:8, other:4, sale:60, months:8 };
test('positive profit is split only after every entered cost', () => {
  assert.deepEqual(calculateProject(example), { total:50e6, profit:10e6, investor:5e6, operator:5e6, settlement:55e6, roi:10, months:8 });
  assert.equal(calculateProject({ ...example, other:6 }).investor, 4e6);
});
test('break-even does not invent a minimum return or fee', () => {
  const result = calculateProject({ ...example, sale:50 });
  assert.equal(result.investor, 0);
  assert.equal(result.operator, 0);
  assert.equal(result.roi, 0);
  assert.equal(result.settlement, result.total);
});
test('downside remains visible without a hidden guarantee', () => {
  const result = calculateProject({ ...example, sale:45 });
  assert.equal(result.profit, -5e6);
  assert.equal(result.investor, -5e6);
  assert.equal(result.operator, 0);
  assert.equal(result.roi, -10);
  assert.equal(result.settlement, 45e6);
});
test('project return is independent of assumed duration, not annualised', () => {
  assert.equal(calculateProject({ ...example, months:24 }).roi, 10);
});
test('invalid or incomplete values do not produce misleading output', () => {
  for (const field of Object.keys(example)) {
    assert.equal(calculateProject({ ...example, [field]:NaN }), null);
    assert.equal(calculateProject({ ...example, [field]:Infinity }), null);
    assert.equal(calculateProject({ ...example, [field]:-1 }), null);
  }
  assert.equal(calculateProject({ ...example, purchase:0 }), null);
  assert.equal(calculateProject({ ...example, months:0 }), null);
});
test('decimal input uses forints and conserves the project result', () => {
  const result = calculateProject({ ...example, other:4.1 });
  assert.equal(result.total, 50.1e6);
  assert.equal(result.investor + result.operator, result.profit);
});
test('two projects compound only under explicit reinvestment assumptions and retain their actual duration', () => {
  const result = calculateTwoProjects(calculateProject({ ...example, sale:65, months:6 }));
  assert.equal(result.settlement, 66.125e6);
  assert.ok(Math.abs(result.roi - 32.25) < 1e-9);
  assert.equal(result.months, 12);
  assert.equal(calculateTwoProjects(calculateProject(example)).months, 16);
  assert.equal(calculateTwoProjects(calculateProject({...example,sale:0})).settlement, 0);
});
test('generated routes preserve existing pages and isolate landing SEO', () => {
  const read = p => readFileSync(new URL('../'+p, import.meta.url), 'utf8');
  const home = read('index.html');
  assert.match(home, /href="\/befektetoknek\/">Befektetőként csatlakoznék/);
  assert.match(home, /Lakásfelújítás A–Z-ig, a tervezéstől a lakberendezésig\./);
  const sitemap = read('sitemap.xml');
  for (const [route, landing] of [['befektetoknek',false],['befektetoi-egyuttmukodes',true],['en/investors',false],['en/investor-partnership',true]]) {
    const html = read(route+'/index.html');
    assert.equal((html.match(/<h1>/g)||[]).length, 1);
    assert.match(html, /data-invest-calculator/);
    assert.match(html, /data-invest-form/);
    assert.equal(html.includes('<meta name="robots" content="noindex">'), landing);
    assert.equal(sitemap.includes('<loc>https://urbanflipstudio.com/'+route+'/</loc>'), !landing);
    assert.doesNotMatch(html, /3%-os hozamgarancia|garantált 3%|guaranteed 3%/i);
  }
  for (const route of ['kapcsolat','szolgaltatasok','rolunk','adatkezeles','projektek/vamhaz-korut','projektek/gozmozdony-utca','projektek/balazs-bela-utca','en/contact','en/services']) assert.ok(existsSync(new URL('../'+route+'/index.html',import.meta.url)));
});
