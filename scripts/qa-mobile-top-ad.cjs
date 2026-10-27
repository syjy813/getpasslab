const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {gunzipSync}=require('node:zlib');
const {routes}=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-27-mobile-top-ad/review.json.gz')));
const base=(process.env.QA_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const out='qa-results/mobile-top-ad';fs.mkdirSync(out,{recursive:true});
const report={base,commit:process.env.QA_COMMIT,cases:[],errors:[],device:'Chromium responsive emulation; AdFit SDK stubbed, no real ad impressions'};
const dimensions=()=>{
 const ad=document.querySelector('[data-mobile-top-ad]'),mount=ad.querySelector('[data-mobile-top-ad-mount]'),a=ad.getBoundingClientRect(),m=mount.getBoundingClientRect(),gnb=document.querySelector('.gnb').getBoundingClientRect();
 return {width:innerWidth,shown:getComputedStyle(ad).display!=='none',adHeight:a.height,top:a.top,gnbBottom:gnb.bottom,mountWidth:m.width,mountHeight:m.height,center:m.left+m.width/2,scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,breadcrumb:document.querySelector('.breadcrumb').getBoundingClientRect().top,ins:mount.querySelectorAll('ins').length,sdk:[...mount.querySelectorAll('script')].length};
};
let browser;
(async()=>{
 browser=await chromium.launch();
 for(const width of [320,390,767,768,1440]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:width<768,hasTouch:width<768});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
  for(const route of routes){
   await page.goto(base+route,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
   const d=await page.evaluate(dimensions);
   assert.equal(d.shown,width<768,route+': mobile-only slot');assert(d.scroll<=d.client+1,route+': no overflow');
   assert.equal(d.ins,0);assert.equal(d.sdk,0,'preview must not request production ads');
   if(width<768){assert.equal(d.adHeight,82);assert.equal(d.mountWidth,320);assert.equal(d.mountHeight,50);assert(Math.abs(d.center-width/2)<=1);assert(Math.abs(d.top-d.gnbBottom)<=1);assert(d.breadcrumb>d.top+d.adHeight,'breadcrumb follows the reserved slot');}
   else assert.equal(d.adHeight,0,'no desktop whitespace');
   await page.locator('.gnb-menu>summary').click();assert(await page.locator('.gnb-dropdown').isVisible());
   await page.locator('.gnb-menu>summary').press('Escape');assert(!await page.locator('.gnb-dropdown').isVisible());
   if(width===390&&route.split('/').length===4){
    await page.screenshot({path:`${out}/390-${route.split('/')[1]}-preview.png`});
    await page.mouse.wheel(0,350);
    await page.waitForFunction(()=>document.querySelector('[data-mobile-top-ad]').getBoundingClientRect().bottom<0);
    assert((await page.locator('[data-mobile-top-ad]').boundingBox()).y<0,'banner scrolls away');
   }
   report.cases.push({width,route,case:'all-certification listing layout and GNB',passed:true});
  }
  for(const route of ['/','/privacy/','/computer-literacy/','/computer-literacy/written/computer-basics/character-codes/','/fire-safety-manager-level2/practice/']){
   await page.goto(base+route);assert.equal(await page.locator('[data-mobile-top-ad]').count(),0,'unrequested page unchanged');
  }
  await context.close();
 }
 // Exercise production-only mounting against locally served HTML. The real SDK
 // is replaced before any request reaches Kakao; no impressions are generated.
 const sdkStub=`document.querySelectorAll('[data-mobile-top-ad-mount] ins').forEach(e=>{e.style.display='block';e.style.width='320px';e.style.height='50px';e.style.background='#eef3fa';e.style.textAlign='center';e.style.lineHeight='50px';e.textContent='320×50 테스트 광고';e.dataset.qaFilled='true';});`;
 for(const route of routes.filter(r=>r.split('/').length===4)){
  for(const width of [390,1440]){
   let sdkCalls=0,releaseSDK;const sdkGate=new Promise(resolve=>releaseSDK=resolve);
   const context=await browser.newContext({viewport:{width,height:844}});
   await context.route('**/*',async r=>{
    const u=new URL(r.request().url());
    if(u.hostname==='getpasslab.co.kr'){const response=await r.fetch({url:base+u.pathname+u.search});return r.fulfill({response});}
    if(u.hostname==='t1.kakaocdn.net'&&u.pathname==='/kas/static/ba.min.js'){sdkCalls++;await sdkGate;return r.fulfill({contentType:'application/javascript',body:sdkStub});}
    return r.abort();
   });
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
   await page.goto('https://getpasslab.co.kr'+route,{waitUntil:'domcontentloaded'});
   const before=await page.evaluate(dimensions);releaseSDK();
   if(width===390){
    await page.waitForFunction(()=>document.querySelector('ins[data-qa-filled="true"]'));
    const after=await page.evaluate(dimensions);assert.equal(before.breadcrumb,after.breadcrumb,'SDK load must not shift content');
    const config=await page.locator('[data-mobile-top-ad-mount] ins').evaluate(e=>({unit:e.dataset.adUnit,width:e.dataset.adWidth,height:e.dataset.adHeight}));
    assert.deepEqual(config,{unit:'DAN-aX4OBdYehvddWlai',width:'320',height:'50'});assert.equal(sdkCalls,1);
    await page.screenshot({path:`${out}/390-${route.split('/')[1]}-stub.png`});
   }else{
    assert.equal(sdkCalls,0);assert.equal(before.ins,0);assert.equal(before.adHeight,0);
    await page.setViewportSize({width:390,height:844});
    await page.waitForFunction(()=>document.querySelector('ins[data-qa-filled="true"]'));
    assert.equal(sdkCalls,1);await page.setViewportSize({width:1440,height:844});assert(!(await page.evaluate(dimensions)).shown);
    await page.setViewportSize({width:390,height:844});assert.equal((await page.evaluate(dimensions)).ins,1);assert.equal(sdkCalls,1,'resize must not duplicate SDK initialization');
   }
   report.cases.push({width,route,case:'production hostname with SDK stub; sizing, CLS, desktop requests and resizing',passed:true});
   await context.close();
  }
 }
 assert.equal(report.errors.length,0,JSON.stringify(report.errors));report.passed=true;await browser.close();
 fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log('[Mobile top ad browser] PASS',report.cases.length,'cases;',routes.length,'listing routes; no live SDK requests');
})().catch(async e=>{report.passed=false;report.errors.push(String(e));fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1;});
