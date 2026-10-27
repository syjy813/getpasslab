const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {gunzipSync}=require('node:zlib');
const {routes}=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-mobile-chapter-top-ad/review.json.gz')));
const slugs=['energy-laws-and-inspection','draft-flue-gas','character-codes','goal-seek','concentration-conversion','power-formula','management-target-grades','sprinkler-types-operation'];
const samples=slugs.map(slug=>routes.find(r=>r.endsWith('/'+slug+'/')));assert(samples.every(Boolean));
const base=(process.env.QA_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const out='qa-results/mobile-chapter-top-ad';fs.mkdirSync(out,{recursive:true});
const report={base,commit:process.env.QA_COMMIT,cases:[],errors:[],device:'Chromium responsive emulation; SDK stub, no live advertising impressions'};
const layout=()=>{
 const ad=document.querySelector('[data-mobile-top-ad]'),mount=ad.querySelector('[data-mobile-top-ad-mount]'),r=ad.getBoundingClientRect(),m=mount.getBoundingClientRect();
 return {shown:getComputedStyle(ad).display!=='none',height:r.height,top:r.top,bottom:r.bottom,mountWidth:m.width,mountHeight:m.height,center:m.left+m.width/2,gnbBottom:document.querySelector('.gnb').getBoundingClientRect().bottom,breadcrumb:document.querySelector('.breadcrumb').getBoundingClientRect().top,ins:mount.querySelectorAll('ins').length,sdk:mount.querySelectorAll('script[src]').length,scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth};
};
let browser;
(async()=>{
 browser=await chromium.launch();
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:width<768,hasTouch:width<768});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
  for(const route of samples){
   await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);const d=await page.evaluate(layout);
   assert.equal(await page.locator('[data-mobile-top-ad]').count(),1);assert.equal(await page.locator('.adfit-placement').count(),1,'existing article advertisement remains');
   assert.equal(d.shown,width<768);assert(d.scroll<=d.client+1,'no page overflow');assert.equal(d.ins,0);assert.equal(d.sdk,0);
   if(width<768){assert.equal(d.height,82);assert.equal(d.mountWidth,320);assert.equal(d.mountHeight,50);assert(Math.abs(d.center-width/2)<=1);assert.equal(d.top,d.gnbBottom);assert(d.breadcrumb>d.bottom);}
   else assert.equal(d.height,0,'no PC whitespace');
   await page.locator('.gnb-menu>summary').click();await page.waitForFunction(()=>document.querySelector('.gnb-menu').open);
   const menu=await page.locator('.gnb-chapter-dropdown').boundingBox();
   if(width<768){const footer=await page.locator('.chapter-mobile-nav').boundingBox();assert(menu.y+menu.height<=footer.y-8,'TOC still clears fixed footer');}
   await page.locator('.gnb-menu>summary').press('Escape');assert(!await page.locator('.gnb-chapter-dropdown').isVisible());
   if(width===390)await page.screenshot({path:`${out}/390-${route.split('/').at(-2)}-preview.png`});
   report.cases.push({route,width,case:'chapter ad placement, existing ad and GNB/footer',passed:true});
  }
  await context.close();
 }
 const representatives=[...new Set(samples.map(r=>r.split('/')[1]))].map(cert=>samples.find(r=>r.split('/')[1]===cert));
 const stub=`document.querySelectorAll('[data-mobile-top-ad-mount] ins').forEach(e=>{e.style.display='block';e.style.width='320px';e.style.height='50px';e.style.background='#eef3fa';e.style.textAlign='center';e.style.lineHeight='50px';e.textContent='320×50 테스트 광고';e.dataset.qaFilled='true';});`;
 for(const route of representatives)for(const width of [390,1440]){
  let release;const gate=new Promise(resolve=>release=resolve);
  const context=await browser.newContext({viewport:{width,height:844}});
  await context.route('**/*',async r=>{
   const u=new URL(r.request().url());
   if(u.hostname==='getpasslab.co.kr'){const response=await r.fetch({url:base+u.pathname+u.search});return r.fulfill({response});}
   if(u.hostname==='t1.kakaocdn.net'&&u.pathname==='/kas/static/ba.min.js'){await gate;return r.fulfill({contentType:'application/javascript',body:stub});}
   return r.abort();
  });
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
  await page.goto('https://getpasslab.co.kr'+route,{waitUntil:'domcontentloaded'});const before=await page.evaluate(layout);release();
  if(width===390){
   await page.waitForFunction(()=>document.querySelector('[data-mobile-top-ad-mount] ins[data-qa-filled="true"]'));
   const after=await page.evaluate(layout);assert.equal(after.breadcrumb,before.breadcrumb,'loading ad must not move content');assert.equal(after.ins,1);assert.equal(after.sdk,1);
   const config=await page.locator('[data-mobile-top-ad-mount] ins').evaluate(e=>({unit:e.dataset.adUnit,width:e.dataset.adWidth,height:e.dataset.adHeight}));assert.deepEqual(config,{unit:'DAN-aX4OBdYehvddWlai',width:'320',height:'50'});
   await page.screenshot({path:`${out}/390-${route.split('/').at(-2)}-stub.png`});
  }else{assert.equal(before.ins,0);assert.equal(before.sdk,0);assert.equal(before.height,0);}
  report.cases.push({route,width,case:'production hostname top unit/CLS with all AdFit SDK requests stubbed',passed:true});await context.close();
 }
 assert.equal(report.errors.length,0,JSON.stringify(report.errors));report.passed=true;await browser.close();fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log('[Mobile chapter top ad browser] PASS',report.cases.length,'cases; native coverage',routes.length,'chapters');
})().catch(async e=>{report.passed=false;report.errors.push(String(e));fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1;});
