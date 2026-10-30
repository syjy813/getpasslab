const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=(process.env.QA_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const out=process.env.QA_OUTPUT_DIR||'qa-results/certification-discovery';
fs.mkdirSync(out,{recursive:true});
const samples=[
 ['industrial-safety','mechanical','boiler-safety-devices'],
 ['energy-management','thermal-equipment','draft-flue-gas'],
 ['computer-literacy','computer-basics','computer-classification'],
 ['fire-safety-manager-level2','fire-safety-practice','pump-test-piping-valves'],
];
const routes=['/',...samples.flatMap(([c,s,ch])=>[`/${c}/`,`/${c}/written/`,`/${c}/written/${s}/`,`/${c}/written/${s}/${ch}/`]),'/industrial-safety/written/safety-management/'];
const sizes=[{width:1440,height:900},{width:390,height:844},{width:320,height:700},{width:768,height:1024}];
const report={commit:process.env.QA_COMMIT||null,device:'Headless Chromium viewport tests; no physical mobile or user PC claim',cases:[],errors:[]};
const layout=()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,viewport:[innerWidth,innerHeight]});
const bounded=async(page,selector)=>{
 const b=await page.locator(selector).boundingBox(),client=await page.evaluate(()=>document.documentElement.clientWidth);
 assert(b&&b.x>=-1&&b.x+b.width<=client+1,selector+' horizontal bounds');
 const nav=page.locator('.chapter-mobile-nav');
 if(await nav.isVisible()){const n=await nav.boundingBox();assert(b.y+b.height<=n.y-8,selector+' must clear bottom chapter navigation');}
};
let browser,activePage;
(async()=>{
 browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});
 for(const size of sizes){
  const context=await browser.newContext({viewport:size});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();activePage=page;page.on('pageerror',e=>report.errors.push(String(e)));
  for(const route of routes){
   assert.equal((await page.goto(base+route)).status(),200);await page.evaluate(()=>document.fonts.ready);
   const geometry=await page.evaluate(layout);assert(geometry.scroll<=geometry.client+1,route+' no document overflow');
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('[data-footer-ad]').count(),1,'one common footer slot per content page');
   assert.equal(await page.locator('[data-footer-ad-mount] ins,[data-footer-ad-mount] script').count(),0,'preview never requests footer ads');
   const menus=page.locator('[data-gnb-menu]');assert(await menus.count()>=1);
   assert(await menus.locator('summary').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)),'menu target height');
   const cert=page.locator('summary[aria-label="자격증 선택"]');
   await cert.press('Enter');await page.locator('.gnb-cert-dropdown').waitFor({state:'visible'});await bounded(page,'.gnb-cert-dropdown');
   assert.equal(await page.locator('.gnb-certification-link').count(),4);
   await cert.press('Escape');assert(!await page.locator('.gnb-cert-dropdown').isVisible());assert(await cert.evaluate(e=>e===document.activeElement));
   if(route.split('/').filter(Boolean).length===4){
    const toc=page.locator('.gnb-menu');await toc.locator('summary').press('Enter');
    await page.waitForFunction(()=>{const m=document.querySelector('.gnb-chapter-dropdown'),a=m?.querySelector('[aria-current="page"]');if(!m||!a)return false;const b=m.getBoundingClientRect(),r=a.getBoundingClientRect();return b.height>0&&r.bottom>b.top&&r.top<b.bottom;});
    await bounded(page,'.gnb-chapter-dropdown');
    assert.equal(await toc.locator('[aria-current="page"]').getAttribute('href'),route);
    assert.deepEqual(await toc.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),await page.locator('.chapter-side .side-nav a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))));
    await cert.click();assert(!await toc.evaluate(e=>e.open),'only one menu open');
    // The open mobile menu covers the title. Click the visible outer gutter.
    await page.mouse.click(4,size.height/2);assert.equal(await page.locator('[data-gnb-menu][open]').count(),0,'outside click closes');
    await toc.locator('summary').click();await page.locator('.gnb-chapter-dropdown').waitFor({state:'visible'});
    const other=toc.locator('a:not([aria-current])').first(),destination=await other.getAttribute('href');
    await other.click();await page.waitForURL(u=>u.pathname===destination);await page.goBack();assert.equal(new URL(page.url()).pathname,route);
    if(await toc.evaluate(e=>e.open))await toc.locator('summary').press('Escape');
    const question=page.locator('.round-badge').first();
    if(await question.count()){
     await question.press('Enter');const dialog=page.locator('dialog.q-layer[open]');await dialog.waitFor({state:'visible'});
     await dialog.locator('.reveal').click();assert.equal(await dialog.getAttribute('data-revealed'),'true');await page.keyboard.press('Escape');
     assert.equal(await page.locator('dialog.q-layer[open]').count(),0);assert(await question.evaluate(e=>e===document.activeElement));
    }
    const image=page.locator('.learning-image-open').first();
    if(await image.count()){
     await image.click();await page.locator('.learning-image-dialog[open]').waitFor({state:'visible'});await page.keyboard.press('Escape');assert(await image.evaluate(e=>e===document.activeElement));
    }
   }
   if(route==='/'){
    assert.equal(await page.locator('[data-home-ad]').count(),1);
    assert.equal(await page.locator('[data-home-ad] ins,[data-home-ad] script').count(),0,'preview never requests production ads');
    const first=await page.locator('.certification-grid .card').first().boundingBox();assert(first.y<size.height*.75,'home exposes certification choice early');
    await page.screenshot({path:`${out}/home-${size.width}.png`});
    await page.locator('.footer').screenshot({path:`${out}/footer-${size.width}.png`});
   }
   if(route==='/computer-literacy/written/computer-basics/'){
    await page.locator('.catalog-group-nav a').nth(1).click();assert(new URL(page.url()).hash.startsWith('#chapter-group-'));
    const top=await page.locator(new URL(page.url()).hash).evaluate(e=>e.getBoundingClientRect().top),gnb=await page.locator('.gnb').boundingBox();assert(top>=gnb.height-1,'group jump clears GNB');
   }
   if(route==='/energy-management/written/'||route==='/computer-literacy/written/computer-basics/'||route==='/industrial-safety/written/safety-management/'){
    await page.goto(base+route);await page.screenshot({path:`${out}/${route.split('/')[1]}-list-${size.width}.png`});
   }
   const spacing=await page.evaluate(()=>{
    if(!document.body.classList.contains('catalog-page'))return null;
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
    const featured=document.querySelector('.subject-section'),groups=document.querySelector('.catalog-group-nav'),all=document.querySelector('#all-chapters')?.parentElement,footer=document.querySelector('.footer-inner');
    return {sectionGap:getComputedStyle(document.body).getPropertyValue('--catalog-section-gap').trim(),featuredGap:featured&&groups?featured.getBoundingClientRect().top-groups.getBoundingClientRect().bottom:null,allChaptersGap:all&&featured?all.getBoundingClientRect().top-featured.getBoundingClientRect().bottom:null,footerColumnGap:getComputedStyle(footer).columnGap,footerColumns:[...footer.children].map(rect),gnbServiceLabels:document.querySelectorAll('.gnb-service-label').length};
   });
   report.cases.push({route,...size,geometry,spacing,result:'PASS'});
  }
  await context.close();
 }
 // Real fixed-size SDK content is stubbed. Never request impressions or analytics.
 const sdk=`document.querySelectorAll('ins.kakao_ad_area').forEach(e=>{if(e.dataset.qaFilled)return;e.dataset.qaFilled='true';e.style.display='block';e.style.width=e.dataset.adWidth+'px';e.style.height=e.dataset.adHeight+'px';const f=document.createElement('iframe');f.width=e.dataset.adWidth;f.height=e.dataset.adHeight;f.style.border='0';f.srcdoc='<p>QA advertisement stub</p>';e.append(f);});`;
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='html{overflow-y:scroll;scrollbar-gutter:stable}::-webkit-scrollbar{width:15px;height:15px}';document.head.append(s);});});
 await context.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname==='getpasslab.co.kr'){const response=await r.fetch({url:base+u.pathname+u.search});return r.fulfill({response});}if(u.hostname==='t1.kakaocdn.net')return r.fulfill({contentType:'application/javascript',body:sdk});return r.abort();});
 const page=await context.newPage();activePage=page;page.on('pageerror',e=>report.errors.push(String(e)));
 for(const [c,s,ch]of samples){
  await page.setViewportSize({width:390,height:844});await page.goto(`https://getpasslab.co.kr/${c}/written/${s}/${ch}/`);await page.waitForFunction(()=>document.querySelector('[data-mobile-top-ad] ins[data-qa-filled]'));
  const adCount=await page.locator('.kakao_ad_area').count();
  await page.setViewportSize({width:320,height:700});await page.waitForFunction(()=>document.querySelector('[data-mobile-top-ad]').hasAttribute('data-adfit-unavailable'));
  const d=await page.evaluate(layout);assert(d.client<320,'test must exercise occupied scrollbar width');assert(d.scroll<=d.client+1,'loaded fixed unit must not overflow');
  assert.equal(await page.locator('[data-mobile-top-ad]').evaluate(e=>e.getBoundingClientRect().height),82,'top reservation retained');
  await page.locator('.gnb-menu>summary').click();await bounded(page,'.gnb-chapter-dropdown');await page.screenshot({path:`${out}/${c}-320-classic-scrollbar.png`});await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>!document.querySelector('[data-mobile-top-ad]').hasAttribute('data-adfit-unavailable'));
  assert.equal(await page.locator('.kakao_ad_area').count(),adCount,'same unit restored; no duplicate mount');
  report.cases.push({route:`/${c}/written/${s}/${ch}/`,scenario:'390 loaded SDK →320 occupied scrollbar→390 restoration',geometry:d,result:'PASS'});
 }
 await context.close();
 // Exercise the newly supplied units against a stub SDK; no live impressions.
 const homeSnapshot=()=>{
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom};};
  return {client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,learning:rect(document.querySelector('.home-learning-method')),footer:rect(document.querySelector('.footer')),slots:[...document.querySelectorAll('[data-home-ad],[data-footer-ad]')].map(e=>{const mount=e.querySelector('[data-home-ad-mount],[data-footer-ad-mount]');return {slot:e.hasAttribute('data-footer-ad')?'bottom':e.dataset.homeAd,hidden:e.hidden,rect:rect(e),mount:rect(mount),units:[...mount.querySelectorAll('ins')].map(i=>({unit:i.dataset.adUnit,width:i.dataset.adWidth,height:i.dataset.adHeight,filled:i.dataset.qaFilled})),scripts:mount.querySelectorAll('script').length};})};
 };
 const configs={middle:{unit:'DAN-WuLZW6NARBuA5jnA',width:'320',height:'100'},bottom:{unit:'DAN-A3dGUv2kIjnZSTmZ',width:'300',height:'250'}};
 const desktopFooter={unit:'DAN-cUOTdTkWFtH2f3C1',width:'728',height:'90'};
 for(const width of [1920,1440,768,767,390,320,300]){
  let releaseSDK;const sdkGate=new Promise(resolve=>releaseSDK=resolve);
  const homeContext=await browser.newContext({viewport:{width,height:844}});
  await homeContext.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='html{overflow-y:scroll;scrollbar-gutter:stable}::-webkit-scrollbar{width:15px;height:15px}';document.head.append(s);});});
  await homeContext.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname==='getpasslab.co.kr'){const response=await r.fetch({url:base+u.pathname+u.search});return r.fulfill({response});}if(u.hostname==='t1.kakaocdn.net'){await sdkGate;return r.fulfill({contentType:'application/javascript',body:sdk});}return r.abort();});
  const homePage=await homeContext.newPage();activePage=homePage;homePage.on('pageerror',e=>report.errors.push(String(e)));
  await homePage.goto('https://getpasslab.co.kr/',{waitUntil:'domcontentloaded'});
  await homePage.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
  const before=await homePage.evaluate(homeSnapshot);releaseSDK();
  const expected=Number(width<768&&before.client>=320)+Number(before.client>=300);
  if(expected)await homePage.waitForFunction(n=>document.querySelectorAll('[data-home-ad]:not([hidden]) ins[data-qa-filled],[data-footer-ad]:not([hidden]) ins[data-qa-filled]').length===n,expected);
  const after=await homePage.evaluate(homeSnapshot);
  assert(after.scroll<=after.client+1,'home advertisements never overflow');
  assert.equal(after.learning.y,before.learning.y,'SDK load preserves learning position');assert.equal(after.footer.y,before.footer.y,'SDK load preserves footer position');
  for(const row of after.slots){
   const config=row.slot==='bottom'&&after.client>=1024?desktopFooter:configs[row.slot],shown=(row.slot==='bottom'||width<768)&&after.client>=Number(config.width);
   assert.equal(row.hidden,!shown);
   if(!shown){assert.equal(row.rect.height,0);assert.equal(row.units.length,0);assert.equal(row.scripts,0);continue;}
   assert.equal(row.units.length,1);const {filled,...actual}=row.units[0];assert.equal(filled,'true');assert.deepEqual(actual,config);assert.equal(row.scripts,1);
   assert.equal(row.mount.width,Number(config.width));assert.equal(row.mount.height,Number(config.height));
   assert(row.mount.x>=0&&row.mount.x+row.mount.width<=after.client,'whole fixed unit fits');
   assert(Math.abs(row.mount.x+row.mount.width/2-after.client/2)<1,'centered unit');
   const boundary=await homePage.evaluate(slot=>{const element=document.querySelector(slot==='middle'?'[data-home-ad="middle"]':'[data-footer-ad]');const ad=element.getBoundingClientRect();const previous=document.querySelector(slot==='middle'?'.certification-grid':'.learning-steps').getBoundingClientRect();const next=document.querySelector(slot==='middle'?'.home-learning-method .section-heading':'.footer').getBoundingClientRect();return {previousGap:ad.top+parseFloat(getComputedStyle(element).paddingTop)-previous.bottom,nextGap:next.top-ad.bottom};},row.slot);
   assert(boundary.previousGap>=24&&boundary.nextGap>=24,'advertisement separated from cards, text and footer');
   if(width===390||width===320)await homePage.locator(row.slot==='middle'?'[data-home-ad="middle"]':'[data-footer-ad]').screenshot({path:`${out}/home-ad-${row.slot}-${width}.png`});
  }
  report.cases.push({route:'/',scenario:'home fixed units, delayed SDK and available width',width,before,after,result:'PASS'});
  if(width===1440){
   await homePage.setViewportSize({width:390,height:844});await homePage.waitForFunction(()=>document.querySelectorAll('[data-home-ad] ins[data-qa-filled],[data-footer-ad] ins[data-qa-filled]').length===2);
   await homePage.setViewportSize({width:320,height:700});await homePage.waitForFunction(()=>document.querySelector('[data-home-ad="middle"]').hidden&&!document.querySelector('[data-footer-ad]').hidden);
   const narrow=await homePage.evaluate(homeSnapshot);assert(narrow.scroll<=narrow.client+1);
   await homePage.setViewportSize({width:390,height:844});await homePage.waitForFunction(()=>!document.querySelector('[data-home-ad="middle"]').hidden);
   const restored=await homePage.evaluate(homeSnapshot);for(const row of restored.slots){assert.equal(row.units.length,1);assert.equal(row.scripts,1);}
   report.cases.push({route:'/',scenario:'home desktop→390→320→390; units restored without duplicate mounts',narrow,restored,result:'PASS'});
  }
  await homeContext.close();
 }
 const footerRoutes=samples.flatMap(([c,s,ch])=>[`/${c}/written/${s}/`,`/${c}/written/${s}/${ch}/`]);
 const exclusions=['/about/','/terms/','/privacy/','/fire-safety-manager-level2/practice/'];
 const commonContext=await browser.newContext({viewport:{width:390,height:844}});
 await commonContext.addInitScript(()=>{document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='html{overflow-y:scroll;scrollbar-gutter:stable}::-webkit-scrollbar{width:15px;height:15px}';document.head.append(s);});});
 await commonContext.route('**/*',async r=>{const u=new URL(r.request().url());if(u.hostname==='getpasslab.co.kr'){const response=await r.fetch({url:base+u.pathname+u.search});return r.fulfill({response});}if(u.hostname==='t1.kakaocdn.net')return r.fulfill({contentType:'application/javascript',body:sdk});return r.abort();});
 const commonPage=await commonContext.newPage();activePage=commonPage;commonPage.on('pageerror',e=>report.errors.push(String(e)));
 for(const width of [1920,390,320]){
  await commonPage.setViewportSize({width,height:900});
  for(const route of footerRoutes){
   assert.equal((await commonPage.goto('https://getpasslab.co.kr'+route)).status(),200);
   await commonPage.waitForFunction(()=>document.querySelector('[data-footer-ad] ins[data-qa-filled]'));
   const data=await commonPage.evaluate(()=>{
    const ad=document.querySelector('[data-footer-ad]'),mount=ad.querySelector('[data-footer-ad-mount]'),i=mount.querySelector('ins'),r=mount.getBoundingClientRect(),box=ad.getBoundingClientRect();
    return {client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,slots:document.querySelectorAll('[data-footer-ad]').length,homeUnits:document.querySelectorAll('[data-home-ad]').length,unit:i.dataset.adUnit,width:i.dataset.adWidth,height:i.dataset.adHeight,mount:{x:r.x,y:r.y,width:r.width,height:r.height},footerGap:document.querySelector('.footer').getBoundingClientRect().top-box.bottom,beforeFooter:ad.nextElementSibling.classList.contains('footer'),afterArticle:!document.querySelector('article')||box.top>=document.querySelector('article').getBoundingClientRect().bottom,sdk:mount.querySelectorAll('script').length,visibleAds:[...document.querySelectorAll('ins.kakao_ad_area')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0;}).length};
   });
   const expectedFooter=data.client>=1024?desktopFooter:configs.bottom;const adWidth=Number(expectedFooter.width);assert.equal(data.slots,1);assert.equal(data.homeUnits,0);assert.equal(data.unit,expectedFooter.unit);assert.equal(data.width,expectedFooter.width);assert.equal(data.height,expectedFooter.height);assert.equal(data.mount.width,adWidth);assert.equal(data.mount.height,Number(expectedFooter.height));assert.equal(data.sdk,1);
   assert(data.beforeFooter&&data.afterArticle&&data.footerGap>=24,'footer ad follows all content and clears footer');assert(data.scroll<=data.client+1);assert(data.mount.x>=0&&data.mount.x+adWidth<=data.client);assert(Math.abs(data.mount.x+adWidth/2-data.client/2)<1);assert(data.visibleAds<=4,'at most four displayed units including existing ads');
   if(route.split('/').filter(Boolean).length===4){await commonPage.locator('[data-footer-ad]').scrollIntoViewIfNeeded();await commonPage.screenshot({path:`${out}/footer-ad-${route.split('/')[1]}-${width}.png`});}
   report.cases.push({route,width,scenario:'common footer on list/chapter, whole unit and advertisement count',data,result:'PASS'});
  }
 }
 for(const width of [1440,390]){
  await commonPage.setViewportSize({width,height:844});
  for(const route of exclusions){await commonPage.goto('https://getpasslab.co.kr'+route);assert.equal(await commonPage.locator('[data-footer-ad]').count(),0,'excluded page has no common ad');report.cases.push({route,width,scenario:'common footer excluded from service/legal and practice pages',result:'PASS'});}
 }
 await commonContext.close();
 assert.equal(report.errors.length,0,JSON.stringify(report.errors));report.passed=true;
 await browser.close();fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log('[Certification discovery browser] PASS',report.cases.length,'cases');
})().catch(async e=>{report.passed=false;report.errors.push(String(e));if(activePage){report.failure={url:activePage.url(),viewport:activePage.viewportSize()};await activePage.screenshot({path:out+'/failure.png'}).catch(()=>{});}fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1;});
