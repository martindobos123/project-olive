import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('legal pages are linked in both full and landing footers and have real identity',()=>{
 for(const [pages,footers] of [
  [['adatkezeles','impresszum','aszf','sutik'],['index.html','befektetoi-egyuttmukodes/index.html']],
  [['en/privacy','en/legal-notice','en/terms','en/cookies'],['en/index.html','en/investor-partnership/index.html']]
 ])for(const route of pages){
   const page=read(route+'/index.html');
   assert.doesNotMatch(page,/TERVEZET|DRAFT|\[Public postal|\[A közzé/);
   assert.ok(read('sitemap.xml').includes('/'+route+'/'));
   for(const footer of footers)assert.ok(read(footer).includes(`href="/${route}/"`));
   if(!route.endsWith('cookies')&&route!=='sutik'){
     assert.ok(page.includes('Dobos Martin'));assert.ok(page.includes('1162 Budapest, Állás utca 40.'));
   }
 }
});
test('enquiry submission opens an encoded mail draft without network delivery or false success',()=>{
 const source=read('src/assets/investor.mjs').replace(/export /g,'');
 for(const lang of ['hu','en']) {
  let handler,focused=false;
  const status={textContent:'',focus(){focused=true}};
  const form={dataset:{mailto:'martindobos123@gmail.com'},reportValidity:()=>true,addEventListener:(_,fn)=>{handler=fn},querySelector:()=>status};
  const fields=new Map([['name','Árvíz & Test'],['email','test@example.com'],['message','First line\nMásodik? &'],['_subject','Értéknövelés'],['consent','on']]);
  const context={document:{documentElement:{lang},querySelector:s=>s==='[data-invest-form]'?form:null},FormData:class{get(k){return fields.get(k)}},window:{location:{href:''}},fetch:()=>assert.fail('No network submission allowed')};
  vm.runInNewContext(source,context);handler({preventDefault(){}});
  const url=new URL(context.window.location.href);
  assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'martindobos123@gmail.com');assert.equal(url.searchParams.get('subject'),'Értéknövelés');
  assert.ok(url.searchParams.get('body').includes('Árvíz & Test'));assert.ok(url.searchParams.get('body').includes('First line\nMásodik? &'));assert.ok(focused);
  assert.match(status.textContent,/még nem történt küldés|has not been sent yet/);
  form.reportValidity=()=>false;context.window.location.href='';handler({preventDefault(){}});assert.equal(context.window.location.href,'');
 }
});
