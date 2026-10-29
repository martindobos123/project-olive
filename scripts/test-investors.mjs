import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { calculateProject, calculateTwoProjects, DEFAULT_PROJECT } from '../src/assets/investor.mjs';
import { investorResults } from '../src/data/investors.mjs';
const example = DEFAULT_PROJECT;
const close = (actual, expected) => assert.ok(Math.abs(actual-expected)<1e-8, `${actual} != ${expected}`);

test('owner screenshot defaults split every cost before sharing profit',()=>{
 const r=calculateProject(example);
 assert.deepEqual(example,{purchase:45,renovation:8,other:2,sale:67,months:6});
 assert.equal(r.total,55e6);assert.equal(r.profit,12e6);assert.equal(r.investor,6e6);assert.equal(r.operator,6e6);assert.equal(r.settlement,61e6);assert.equal(r.guaranteeFunding,0);
 close(r.roi,6/55*100);close(r.annualized,((61/55)**2-1)*100);
});
test('3% is included in the profit share and is a per-project minimum',()=>{
 const r=calculateProject({...example,sale:57});
 assert.equal(r.minimum,1.65e6);assert.equal(r.investor,1.65e6);assert.equal(r.operator,.35e6);assert.equal(r.guaranteeFunding,0);assert.equal(r.roi,3);
 assert.equal(calculateProject({...example,sale:57,months:24}).roi,3);
});
test('break-even explicitly requires operator-funded minimum payment',()=>{
 const r=calculateProject({...example,sale:55});
 assert.equal(r.profit,0);assert.equal(r.investor,1.65e6);assert.equal(r.operator,-1.65e6);assert.equal(r.guaranteeFunding,1.65e6);assert.equal(r.settlement,56.65e6);
});
test('loss scenario includes restoration of capital plus 3% and exposes required Urbanflip funding',()=>{
 const r=calculateProject({...example,sale:45});
 assert.equal(r.profit,-10e6);assert.equal(r.investor,1.65e6);assert.equal(r.operator,-11.65e6);assert.equal(r.guaranteeFunding,11.65e6);assert.equal(r.investor+r.operator,r.profit);
});
test('annualised rate changes with time while the project return is unchanged',()=>{
 const a=calculateProject(example),b=calculateProject({...example,months:12}),c=calculateProject({...example,months:24});
 close(b.annualized,b.roi);close(c.annualized,((61/55)**.5-1)*100);assert.ok(a.annualized>b.annualized);assert.equal(a.roi,b.roi);
});
test('invalid or incomplete numbers never yield a financial result',()=>{
 for(const key of Object.keys(example))for(const value of [NaN,Infinity,-1,undefined])assert.equal(calculateProject({...example,[key]:value}),null);
 assert.equal(calculateProject({...example,purchase:0}),null);assert.equal(calculateProject({...example,months:0}),null);
});
test('forint rounding conserves profit and minimum funding',()=>{
 const r=calculateProject({...example,other:2.1});assert.equal(r.total,55.1e6);assert.equal(r.investor+r.operator,r.profit);
});
test('two-project reinvestment retains its real duration and compound assumptions',()=>{
 const r=calculateTwoProjects(calculateProject(example));assert.equal(r.settlement,67_654_545);close(r.roi,(67_654_545/55e6-1)*100);assert.equal(r.months,12);
 assert.equal(calculateTwoProjects(calculateProject({...example,months:8})).months,16);
});
test('routes, integer controls, SEO and separation of financial references',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 assert.match(read('index.html'),/href="\/befektetoknek\/">Befektetőként csatlakoznék/);
 assert.match(read('index.html'),/Lakásfelújítás A–Z-ig, a tervezéstől a lakberendezésig\./);
 const sitemap=read('sitemap.xml');
 for(const [route,landing]of[['befektetoknek',false],['befektetoi-egyuttmukodes',true],['en/investors',false],['en/investor-partnership',true]]){
  const html=read(route+'/index.html');assert.equal((html.match(/<h1>/g)||[]).length,1);assert.match(html,/data-invest-calculator/);assert.match(html,/data-invest-form/);assert.match(html,/data-result="annualized"/);
  assert.equal((html.match(/step="1"/g)||[]).length,10);assert.equal(html.includes('<meta name="robots" content="noindex">'),landing);
  assert.equal(sitemap.includes('<loc>https://urbanflipstudio.com/'+route+'/</loc>'),!landing);
  assert.doesNotMatch(html,/tervezett modell szerint|ez jelenleg nem hozamgarancia|feltételei még véglegesítés/);
 }
 for(const slug of Object.keys(investorResults)){
  for(const route of [`befektetoknek/projektek/${slug}`,`en/investors/projects/${slug}`]){assert.ok(existsSync(new URL('../'+route+'/index.html',import.meta.url)));assert.match(read(route+'/index.html'),/invest-case__facts/);}
  for(const route of [`projektek/${slug}`,`en/projects/${slug}`])assert.doesNotMatch(read(route+'/index.html'),/full-project return|projekthozam|befektetői projekthozam|investor project return/);
 }
});

test('investor service is discoverable in both languages without replacing renovation enquiries or process anchors',()=>{
 const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
 for(const [prefix,catalog,contact,investors,processId] of [
  ['', 'szolgaltatasok','kapcsolat','befektetoknek','folyamat'],
  ['en/','services','contact','investors','process'],
 ]){
  const url=`/${prefix}${investors}/`;
  const home=read(prefix+'index.html');
  assert.match(home,new RegExp(`<a class="service__link" href="${url}">`));
  assert.ok(home.includes(`id="${processId}"`));
  const service=read(`${prefix}${catalog}/index.html`);
  const entry=service.match(/<article class="sblock" id="befektetoi-egyuttmukodes"[\s\S]*?<\/article>/)?.[0];
  assert.ok(entry?.includes(`href="${url}"`));
  const structured=[...service.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).flat();
  assert.ok(structured.some(x=>x['@type']==='Service'&&x.url===`https://urbanflipstudio.com${url}`));
  const enquiry=read(`${prefix}${contact}/index.html`);
  assert.ok(enquiry.includes(`href="${url}#erdeklodes"`));
  assert.ok(enquiry.includes('id="f-helyszin"')); // Existing renovation enquiry stays available.
  for(const html of [home,service,enquiry,read(`${prefix}projektek/index.html`.replace('en/projektek','en/projects'))]){
   for(const nav of html.matchAll(/<nav\b[\s\S]*?<\/nav>/g))assert.doesNotMatch(nav[0],/>\s*(Folyamat|Process)\s*</);
  }
 }
});
