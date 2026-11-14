import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { measurementConfig, measurementCsp } from '../src/measurement-config.mjs';
const source = readFileSync(new URL('../src/assets/measurement.js', import.meta.url), 'utf8');
const direct = { GA4_MEASUREMENT_ID:'G-TEST1234', META_PIXEL_ID:'123456789', GOOGLE_ADS_ID:'AW-12345678', GOOGLE_ADS_LEAD_LABEL:'Test_label', LINKEDIN_PARTNER_ID:'123456', LINKEDIN_LEAD_CONVERSION_ID:'654321', TIKTOK_PIXEL_ID:'TEST1234567890' };
function browser(env = direct, initial, blocked = false) {
  let time = Date.now();
  class ClockDate extends Date { static now() { return time; } }
  const config = { ...measurementConfig(env), paths:['/','/kapcsolat/'] };
  const local = new Map(), session = new Map(), scripts = [], pixels = [], events = {}, windowEvents = {}, timers = [];
  const input = { analytics:{checked:false}, marketing:{checked:false} };
  const buttons = Object.fromEntries(['none','all','save'].map(action => [action, { dataset:{consent:action}, focus(){}, addEventListener(_,fn){this.click=fn} }]));
  const bar = {hidden:true, querySelector(s){return s === 'button' ? buttons.none : input[s.match(/name=(\w+)/)[1]]}, querySelectorAll(){return Object.values(buttons)}};
  if (initial !== undefined) local.set('ufs-consent-v2', typeof initial === 'string' ? initial : JSON.stringify({ revision:config.revision, at:Date.now(), ...initial }));
  const storage = map => ({ getItem:k=>{if(blocked)throw Error('blocked');return map.get(k) ?? null}, setItem:(k,v)=>{if(blocked)throw Error('blocked');map.set(k,v)}, removeItem:k=>{if(blocked)throw Error('blocked');map.delete(k)} });
  const location = { hostname:'urbanflipstudio.com', origin:'https://urbanflipstudio.com', href:'https://urbanflipstudio.com/?utm_source=test&email=private%40example.com', search:'?utm_source=test&email=private%40example.com', hash:'', reload(){this.reloads=(this.reloads||0)+1} };
  const document = {cookie:'_ga=old; essential=yes',referrer:'https://ref.example/private?q=secret',activeElement:null,documentElement:{lang:'hu',getAttribute:()=>'/'} ,getElementById:()=>bar,
    body:{appendChild:el=>pixels.push(el)},createElement:()=>({dataset:{},remove(){}}),head:{appendChild:el=>scripts.push(el)},querySelectorAll:()=>[],addEventListener:(name,fn)=>{events[name]=fn} };
  const window = {__ufsMeasurementConfig:config,addEventListener:(name,fn)=>{windowEvents[name]=fn}};
  const context = { fetch:(url,options)=>{pixels.push({src:url,options});return Promise.resolve()}, window, document, location, localStorage:storage(local), sessionStorage:storage(session), history:{state:null,replaceState:(_,__,url)=>{location.cleaned=url}}, URL,URLSearchParams, WeakSet, Date:ClockDate,
    setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length},clearTimeout:()=>{} };
  vm.runInNewContext(source,context);
  const choose = (analytics,marketing) => {input.analytics.checked=analytics;input.marketing.checked=marketing;buttons.save.click()};
  return {context,window,document,location,config,scripts,pixels,local,session,bar,buttons,choose,events,windowEvents,timers,advance:ms=>{time+=ms},
    commands:()=>window.dataLayer.filter(x=>typeof x[0]==='string').map(x=>Array.from(x))};
}
test('build validates public IDs and rejects duplicates, undeclared GTM providers and orphan conversion labels',()=>{
  assert.equal(measurementConfig({}).active,false);
  for(const env of [{GA4_MEASUREMENT_ID:'<script>'},{GTM_CONTAINER_ID:'GTM-TEST123',GA4_MEASUREMENT_ID:'G-TEST1234'},{GTM_CONTAINER_ID:'GTM-TEST123'},{GTM_CONTAINER_ID:'GTM-TEST123',GTM_SERVICES:'unknown'},{GOOGLE_ADS_LEAD_LABEL:'Test_label'},{LINKEDIN_LEAD_CONVERSION_ID:'123456'}]) assert.throws(()=>measurementConfig(env));
  assert.equal(measurementCsp(measurementConfig({})).script,'');
  assert.doesNotMatch(measurementCsp(measurementConfig(direct)).script,/unsafe|\*/);
});
test('no SDK or attribution before consent, after rejection, or with malformed/expired/old consent',()=>{
  for(const initial of [undefined,'granted','{bad', {analytics:true,marketing:true,at:1},{analytics:true,marketing:true,at:Date.now()+10000},{analytics:'yes',marketing:true},{analytics:true,marketing:true,revision:'old'}]) {
    const b=browser(direct,initial);assert.equal(b.scripts.length,0);assert.equal(b.session.size,0);assert.equal(b.bar.hidden,false);
    assert.equal(b.window.ufsMeasurement.track('generate_lead'),false);
    b.buttons.none.click();assert.equal(b.scripts.length,0);assert.equal(b.session.size,0);
    const defaults=b.commands()[0];assert.equal(defaults[0],'consent');for(const key of ['analytics_storage','ad_storage','ad_user_data','ad_personalization'])assert.equal(defaults[2][key],'denied');
  }
});
test('analytics-only loads Google once, sanitizes payloads and does not replay pre-consent events',()=>{
  const b=browser();b.window.ufsMeasurement.track('cta_click');b.choose(true,false);
  assert.equal(b.scripts.length,1);assert.match(b.scripts[0].src,/gtag/);assert.equal(b.session.size,1);
  assert.doesNotMatch(b.location.cleaned,/email|private/);
  let sent=b.commands().filter(c=>c[0]==='event');assert.equal(JSON.stringify(sent.map(c=>c[1])),JSON.stringify(['page_view']));
  b.window.ufsMeasurement.track('cta_click',{cta_id:'header',email:'private@example.com',message:'secret'});
  sent=b.commands().filter(c=>c[0]==='event');assert.equal(sent.at(-1)[2].cta_id,'header');assert.equal(sent.at(-1)[2].email,undefined);assert.equal(sent.at(-1)[2].page_referrer,'https://ref.example');
  assert.equal(sent.at(-1)[2].page_location,'https://urbanflipstudio.com/');
  b.choose(true,true);assert.equal(b.scripts.length,4);assert.equal(b.commands().filter(c=>c[0]==='event'&&c[1]==='page_view').length,1);
  b.choose(true,true);assert.equal(b.scripts.length,4);
});
test('marketing-only never configures GA4 or captures analytics attribution; email draft is never Lead',()=>{
  const b=browser();b.choose(false,true);assert.equal(b.session.size,0);assert.equal(b.scripts.length,4);
  assert.equal(b.commands().some(c=>c[0]==='config'&&c[1]===b.config.ga4),false);
  b.window.ufsMeasurement.track('email_draft_open',{form_id:'investor'});
  assert.equal(b.window.fbq.queue.some(c=>c[1]==='Lead'),false);assert.equal(b.commands().some(c=>c[1]==='conversion'),false);
  b.window.ufsMeasurement.track('generate_lead',{form_id:'investor'});
  assert.equal(b.window.fbq.queue.filter(c=>c[1]==='Lead').length,1);
  assert.equal(b.commands().filter(c=>c[1]==='conversion').length,1);assert.equal(b.window.lintrk.q.length,1);assert.ok(b.window.ttq.some(c=>c[0]==='track'&&c[1]==='SubmitForm'));
});
test('revocation closes dispatch immediately, clears attribution/queues, persists and reloads',()=>{
  const b=browser();b.choose(true,true);b.choose(false,false);
  assert.equal(b.location.reloads,1);assert.equal(b.session.size,0);assert.equal(b.window.ufsMeasurement.track('generate_lead'),false);assert.equal(b.window.fbq.queue.length,0);assert.equal(b.window.dataLayer.length,0);
  const stored=JSON.parse(b.local.get('ufs-consent-v2'));assert.equal(stored.analytics,false);assert.equal(stored.marketing,false);
});
test('restored choices, blocked storage and cross-tab removal remain safe',()=>{
  const b=browser(direct,{analytics:true,marketing:false});assert.equal(b.scripts.length,1);
  b.windowEvents.storage({key:null});assert.equal(b.location.reloads,1);assert.equal(b.window.ufsMeasurement.track('cta_click'),false);
  const privateBrowser=browser(direct,undefined,true);assert.equal(privateBrowser.scripts.length,0);privateBrowser.choose(true,false);assert.equal(privateBrowser.scripts.length,1);
});
test('GTM is exclusive, requires both categories, and resets data-layer parameters for each event',()=>{
  const b=browser({GTM_CONTAINER_ID:'GTM-TEST123',GTM_SERVICES:'ga4,meta'});
  b.choose(true,false);assert.equal(b.scripts.length,0);assert.equal(b.window.ufsMeasurement.track('cta_click'),false);
  b.choose(true,true);assert.equal(b.scripts.length,1);assert.match(b.scripts[0].src,/gtm.js/);
  b.window.ufsMeasurement.track('form_start',{form_id:'contact'});b.window.ufsMeasurement.track('cta_click',{cta_id:'hero'});
  const last=b.window.dataLayer.at(-1);assert.equal(last.event,'ufs_cta_click');assert.equal(last.measurement.form_id,undefined);assert.equal(b.window.dataLayer.at(-2).measurement,null);
  vm.runInNewContext(source,b.context);assert.equal(b.scripts.length,1);
});
test('error measurement is capped and never contains stack or exception text',()=>{
  const b=browser();b.choose(true,false);
  for(let i=0;i<15;i++)b.windowEvents.error({target:b.window,message:'private@example.com',stack:'secret'});
  const errors=b.commands().filter(c=>c[1]==='js_error');assert.equal(errors.length,10);assert.doesNotMatch(JSON.stringify(errors),/private|secret/);
});

test('long-lived consent timers stay within browser limits and expire without a late event',()=>{
 const b=browser();b.choose(true,true);assert.ok(b.timers.at(-1).delay<=2147483647);
 b.timers.at(-1).fn();assert.equal(b.location.reloads,undefined);
 b.advance(180*86400000+1);b.timers.at(-1).fn();assert.equal(b.location.reloads,1);assert.equal(b.window.ufsMeasurement.track('generate_lead'),false);
});
test('delegated contact and CTA clicks send fixed identifiers without exposing the destination',()=>{
 const b=browser();b.choose(true,false);
 function click(href,cta=false){
  const a={hasAttribute:()=>false,getAttribute:key=>key==='href'?href:null,matches:()=>cta,closest:()=>null};
  b.events.click({target:{closest:()=>a}});
 }
 click('mailto:private@example.com?body=secret');click('tel:+36701234567');click('https://wa.me/36701234567');click('/kapcsolat/',true);
 const sent=b.commands().filter(c=>c[0]==='event');
 assert.equal(sent.filter(c=>c[1]==='contact_email_click').length,1);
 assert.equal(sent.filter(c=>c[1]==='contact_phone_click').length,1);
 assert.equal(sent.filter(c=>c[1]==='contact_whatsapp_click').length,1);
 assert.equal(sent.at(-1)[2].target_path,'/kapcsolat/');assert.doesNotMatch(JSON.stringify(sent),/private|secret|36701234567/);
});

test('GA4-only GTM needs analytics consent and never requests marketing consent',()=>{
 const b=browser({GTM_CONTAINER_ID:'GTM-TEST123',GTM_SERVICES:'ga4'});
 b.choose(false,true);assert.equal(b.scripts.length,0);
 b.choose(true,false);assert.equal(b.scripts.length,1);
 assert.equal(b.window.dataLayer.filter(x=>x.event==='ufs_page_view').length,1);
 assert.equal(b.window.dataLayer.at(-1).measurement.event_name,'page_view');
 const choice=JSON.parse(b.local.get('ufs-consent-v2'));assert.equal(choice.marketing,false);
});

test('audited mixed GTM keeps purpose choices independent and never duplicates analytics pageviews',()=>{
 const b=browser({GTM_CONTAINER_ID:'GTM-TEST123',GTM_SERVICES:'ga4,meta',GTM_PURPOSE_GATING_VERIFIED:'true'});
 b.choose(true,false);assert.equal(b.scripts.length,1);assert.equal(b.window.dataLayer.filter(x=>x.event==='ufs_marketing_page_view').length,0);
 b.choose(true,true);assert.equal(b.scripts.length,1);assert.equal(b.window.dataLayer.filter(x=>x.event==='ufs_page_view').length,1);assert.equal(b.window.dataLayer.filter(x=>x.event==='ufs_marketing_page_view').length,1);
 const m=browser({GTM_CONTAINER_ID:'GTM-TEST123',GTM_SERVICES:'ga4,meta',GTM_PURPOSE_GATING_VERIFIED:'true'});m.choose(false,true);assert.equal(m.scripts.length,1);assert.equal(m.session.size,0);assert.equal(m.window.dataLayer.filter(x=>x.event==='ufs_page_view').length,0);assert.equal(m.window.dataLayer.filter(x=>x.event==='ufs_marketing_page_view').length,1);
});
test('ChatGPT image pixel respects refusal, purpose choice, single pageview and withdrawal',()=>{
 const env={GTM_CONTAINER_ID:'GTM-TEST123',GTM_SERVICES:'ga4,meta',GTM_PURPOSE_GATING_VERIFIED:'true',CHATGPT_PIXEL_ID:'test_pixel_12345'};
 const rejected=browser(env);rejected.buttons.none.click();assert.equal(rejected.pixels.length,0);
 const b=browser(env);b.choose(true,false);assert.equal(b.pixels.length,0);
 b.choose(true,true);assert.equal(b.pixels.length,1);const url=new URL(b.pixels[0].src);assert.equal(url.searchParams.get('pid'),env.CHATGPT_PIXEL_ID);assert.equal(url.searchParams.get('event'),'page_viewed');
 b.choose(true,true);assert.equal(b.pixels.length,1);b.window.ufsMeasurement.track('email_draft_open');assert.equal(b.pixels.length,1);
 b.window.ufsMeasurement.track('cta_click',{email:'private@example.com'});assert.equal(new URL(b.pixels.at(-1).src).searchParams.get('custom_event_name'),'cta_click');assert.doesNotMatch(b.pixels.at(-1).src,/private|email/);assert.equal(b.pixels.at(-1).options.keepalive,true);assert.equal(b.pixels.at(-1).options.credentials,'omit');
 b.choose(false,false);assert.equal(b.location.reloads,1);b.window.ufsMeasurement.track('cta_click');assert.equal(b.pixels.length,2);
 const m=browser(env);m.choose(false,true);assert.equal(m.session.size,0);assert.equal(m.pixels.length,1);assert.equal(m.scripts.some(s=>s.src.includes('openai')),false);
});
