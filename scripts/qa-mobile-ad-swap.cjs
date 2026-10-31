const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=(process.env.QA_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const out='qa-results/mobile-ad-swap';fs.mkdirSync(out,{recursive:true});
const samples=[
 ['industrial-safety','mechanical','boiler-safety-devices'],
 ['energy-management','thermal-equipment','draft-flue-gas'],
 ['computer-literacy','computer-basics','computer-classification'],
 ['fire-safety-manager-level2','fire-safety-practice','pump-test-piping-valves'],
];
const targets=samples.flatMap(([c,s,ch])=>['/'+c+'/written/','/'+c+'/written/'+s+'/','/'+c+'/written/'+s+'/'+ch+'/']);
const controls=['/',...samples.map(([c])=>'/'+c+'/')];
const widths=[320,390,767,768,1024,1440];
const report={commit:process.env.QA_COMMIT||null,device:'Headless Chromium viewport emulation, not a physical device',cases:[],errors:[]};
const snapshot=()=>{
 const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,top:r.top,bottom:r.bottom};};
 const visible=e=>!!e&&!e.hidden&&getComputedStyle(e).display!=='none';
 const placement=e=>!e?null:{visible:visible(e),hidden:e.hidden,display:getComputedStyle(e).display,parentWidth:e.parentElement.clientWidth,ready:e.dataset.adfitReady||null,box:rect(e),mount:rect(e.querySelector('[data-mobile-entry-ad-mount], [data-mobile-top-ad-mount], [data-footer-ad-mount]')),
  ins:[...e.querySelectorAll('ins.kakao_ad_area')].map(i=>({unit:i.dataset.adUnit,width:i.dataset.adWidth,height:i.dataset.adHeight})),
  sdk:e.querySelectorAll('script[src*="ba.min.js"]').length};
 const nav=document.querySelector('.chapter-mobile-nav');
 const footer=document.querySelector('footer.footer');
 const gnb=document.querySelector('.gnb');
 return {width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
  entry:placement(document.querySelector('[data-mobile-entry-ad]')),
  ribbon:placement(document.querySelector('[data-mobile-top-ad]')),
  old:placement(document.querySelector('[data-footer-ad]')),
  footer:footer?rect(footer):null,gnb:gnb?rect(gnb):null,
  nav:visible(nav)?rect(nav):null,bodyBottomPadding:parseFloat(getComputedStyle(document.body).paddingBottom)};
};
const near=(a,b,delta=1)=>assert(Math.abs(a-b)<=delta,a+' != '+b);
let browser;
(async()=>{
 browser=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:844}});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of [...targets,...controls]){
   const response=await page.goto(base+route,{waitUntil:'load'});
   assert.equal(response.status(),200,route+' status');
   await page.evaluate(()=>document.fonts.ready);
   const d=await page.evaluate(snapshot),mobile=width<768,target=targets.includes(route);
   assert(d.footer&&d.gnb&&d.old,route+' common elements');
   assert(d.scroll<=d.width+1,route+' @'+width+' horizontal overflow');
   assert.equal(!!d.entry,target,route+' entry eligibility');
   assert.equal(!!d.ribbon,target,route+' ribbon eligibility');
   if(target){
    const ribbonFits=mobile&&d.width>=320;
    assert.equal(d.entry.visible,mobile,route+' top rectangle mobile only '+JSON.stringify({width:d.width,scroll:d.scroll,entry:d.entry,gnb:d.gnb}));
    assert.equal(d.ribbon.visible,ribbonFits,route+' ribbon only when 320px fits');
    assert.equal(d.old.visible,!mobile,route+' no duplicate footer rectangle');
    if(mobile){
     near(d.entry.box.top,d.gnb.bottom);
     near(d.entry.mount.width,300);near(d.entry.mount.height,250);
     assert(d.entry.box.x>=-1&&d.entry.box.x+d.entry.box.width<=d.width+1,route+' top ad fits viewport');
     if(ribbonFits){
      near(d.ribbon.mount.width,320);near(d.ribbon.mount.height,50);
      assert(d.ribbon.box.top>=d.entry.box.bottom,route+' ribbon follows content');
      assert(d.ribbon.box.bottom<d.footer.top,route+' ribbon before footer');
     }else{
      assert.equal(d.ribbon.box.height,0,route+' no empty ribbon gap on narrow screen');
     }
    }else{
     assert.equal(d.entry.box.height,0,route+' no desktop top whitespace');
     assert.equal(d.ribbon.box.height,0,route+' no desktop ribbon whitespace');
    }
    if(route.split('/').filter(Boolean).length===4&&width<1024){
     assert(d.nav,route+' chapter bottom navigation kept');
     assert(d.bodyBottomPadding>=d.nav.height-2,route+' bottom navigation reservation');
    }
   }else assert(d.old.visible,route+' original footer retained');
   assert.equal(d.old.ins.length,0,route+' preview footer must not serve actual ad');
   if(d.entry)assert.equal(d.entry.ins.length,0,route+' preview top must not serve actual ad');
   if(d.ribbon)assert.equal(d.ribbon.ins.length,0,route+' preview ribbon must not serve actual ad');
   assert.deepEqual(errors,[],route+' runtime errors');
   if(width===390&&(route==='/'||route.split('/').filter(Boolean).length===4)){
    const name=route==='/'?'home':route.split('/')[1]+'-chapter';
    await page.screenshot({path:path.join(out,name+'-390.png'),fullPage:true});
   }
   report.cases.push({route,width,result:'PASS'});
  }
  await context.close();
 }
 // Recreate production-host behavior with locally served content and a stub SDK.
 // Both real analytics and real advertisement requests are blocked.
 const sdkStub=[
  "const fill=()=>document.querySelectorAll('ins.kakao_ad_area:not([data-qa-filled])').forEach(e=>{",
  "e.dataset.qaFilled='true';e.style.display='block';e.style.width=e.dataset.adWidth+'px';e.style.height=e.dataset.adHeight+'px';",
  "e.style.background='#e9eff7';});fill();",
  "new MutationObserver(fill).observe(document.documentElement,{childList:true,subtree:true});"
 ].join('\n');
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.route('**/*',async r=>{
  const u=new URL(r.request().url());
  if(u.hostname==='getpasslab.co.kr'){
   const response=await r.fetch({url:base+u.pathname+u.search});
   return r.fulfill({response});
  }
  if(u.hostname==='t1.kakaocdn.net'&&u.pathname.endsWith('/ba.min.js'))return r.fulfill({status:200,contentType:'application/javascript',body:sdkStub});
  return r.abort();
 });
 const page=await context.newPage();
 const sample=targets[2];
 await page.goto('https://getpasslab.co.kr'+sample,{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelector('[data-mobile-entry-ad-mount] ins[data-qa-filled]')&&document.querySelector('[data-mobile-top-ad-mount] ins[data-qa-filled]'));
 let d=await page.evaluate(snapshot);
 assert.deepEqual(d.entry.ins,[{unit:'DAN-A3dGUv2kIjnZSTmZ',width:'300',height:'250'}],'top rectangle original unit');
 assert.deepEqual(d.ribbon.ins,[{unit:'DAN-aX4OBdYehvddWlai',width:'320',height:'50'}],'bottom ribbon original unit');
 assert.equal(d.old.ins.length,0,'no duplicate bottom rectangle');
 assert.equal(d.entry.sdk,1);assert.equal(d.ribbon.sdk,1);
 await page.setViewportSize({width:1024,height:844});
 await page.waitForFunction(()=>document.querySelector('[data-mobile-entry-ad]').hidden&&!document.querySelector('[data-footer-ad]').hidden);
 d=await page.evaluate(snapshot);
 assert(!d.entry.visible&&!d.ribbon.visible&&d.old.visible,'desktop positions restored');
 await page.setViewportSize({width:390,height:844});
 await page.waitForFunction(()=>!document.querySelector('[data-mobile-entry-ad]').hidden&&document.querySelector('[data-footer-ad]').hidden&&document.querySelector('[data-mobile-entry-ad-mount] ins'));
 d=await page.evaluate(snapshot);
 assert.equal(d.entry.ins.length,1);assert.equal(d.ribbon.ins.length,1);assert.equal(d.old.ins.length,0);
 report.cases.push({route:sample,width:'390 -> 1024 -> 390',result:'PASS',scenario:'SDK stub / resize'});
 await page.goto('https://getpasslab.co.kr/',{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelector('[data-footer-ad-mount] ins[data-qa-filled]'));
 d=await page.evaluate(snapshot);
 assert.equal(d.entry,null,'home no top rectangle');
 assert.equal(d.ribbon,null,'home no extra ribbon');
 assert(d.old.visible,'home footer rectangle visible');
 assert.deepEqual(d.old.ins,[{unit:'DAN-A3dGUv2kIjnZSTmZ',width:'300',height:'250'}],'home original rectangle unit');
 report.cases.push({route:'/',width:390,result:'PASS',scenario:'SDK stub / home exception'});
 await context.close();
 report.passed=true;
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
 console.log('[Mobile ad swap browser] PASS',report.cases.length,'cases');
 await browser.close();
})().catch(async e=>{
 report.errors.push(String(e.stack||e));
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
 console.error(e);
 if(browser)await browser.close();
 process.exitCode=1;
});