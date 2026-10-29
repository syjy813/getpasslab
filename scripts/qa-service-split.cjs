const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321',out=process.env.QA_OUTPUT_DIR||'qa-results/service-split';
fs.mkdirSync(out,{recursive:true});
const routes=['/','/certifications/','/facility-management/','/facility-management/start/','/facility-management/career/','/facility-management/qualifications/','/facility-management/practice/','/facility-management/start/reading-job-postings/','/industrial-safety/written/construction/formwork-removal/','/energy-management/written/thermal-equipment/draft-flue-gas/','/computer-literacy/written/spreadsheets/goal-seek/','/fire-safety-manager-level2/written/fire-safety-theory/sprinkler-types-operation/'];
const report={result:'RUNNING',cases:[],interactions:[],errors:[],limitations:['Chromium responsive emulation; real devices and Safari not tested','Article image styles are provided; the one real initial article contains no illustration']};
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768});
   await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
   const page=await context.newPage();page.on('pageerror',error=>report.errors.push(String(error)));
   for(const route of routes){
    assert.equal((await page.goto(base+route)).status(),200);await page.evaluate(()=>document.fonts.ready);
    const expected=route.startsWith('/facility-management/')?'facility':'certifications';
    const inspect=()=>page.evaluate(()=>{
     const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
     return {service:document.body.dataset.service,active:[...document.querySelectorAll('.service-switch a[aria-current]')].map(e=>e.dataset.serviceLink),overflow:document.documentElement.scrollWidth>innerWidth+1,header:box(document.querySelector('.gnb')),links:[...document.querySelectorAll('.service-switch a')].map(e=>({text:e.textContent,rect:box(e),color:getComputedStyle(e).color,background:getComputedStyle(e).backgroundColor})),primary:getComputedStyle(document.body).getPropertyValue('--primary-600').trim()};
    });
    let result=await inspect();assert.equal(result.service,expected);assert.deepEqual(result.active,[expected]);assert(!result.overflow,route+' '+width+' page overflow');
    for(const link of result.links){assert(link.rect.height>=44);assert(link.rect.left>=0&&link.rect.right<=width);assert(link.rect.bottom<=result.header.bottom);}
    assert.equal(result.primary.toLowerCase(),expected==='facility'?'#18794e':'#1d4ed8');
    assert.equal(result.header.height,width<768?117:65); // border included
    await page.reload();result=await inspect();assert.deepEqual(result.active,[expected],'refresh keeps URL-derived active state');
    const menu=page.locator('.gnb-menu>summary');await menu.click();
    const dropdown=page.locator('.gnb-dropdown'),rect=await dropdown.boundingBox();assert(rect.x>=0&&rect.x+rect.width<=width+1,'menu stays in viewport');
    if(route.includes('/written/')&&route.split('/').filter(Boolean).length>3){
     const current=page.locator('.gnb-chapter-dropdown a[aria-current="page"]');assert.equal(await current.getAttribute('href'),route);
     const content=await page.locator('.gnb-chapter-dropdown a').evaluateAll(es=>es.map(e=>({title:e.textContent,href:e.getAttribute('href')})));
     assert.deepEqual(content,await page.locator('.chapter-side .side-nav a').evaluateAll(es=>es.map(e=>({title:e.textContent,href:e.getAttribute('href')}))));
     if(width<1024){const bottom=await page.locator('.chapter-mobile-nav').boundingBox();assert(rect.y+rect.height<=bottom.y-8+1,'TOC clears fixed bottom navigation');}
    }
    await page.keyboard.press('Escape');assert.equal(await page.locator('.gnb-menu').getAttribute('open'),null);assert(await menu.evaluate(e=>document.activeElement===e));
    if(route.endsWith('/reading-job-postings/')){
     const table=page.locator('.facility-table-scroll');assert(await table.evaluate(e=>e.scrollWidth>e.clientWidth)=== (width<640));
     await table.focus();await page.keyboard.press('ArrowRight');if(width<640)await page.waitForFunction(()=>document.querySelector('.facility-table-scroll').scrollLeft>0);
    }
    if([390,1440].includes(width)&&['/facility-management/','/certifications/','/facility-management/start/reading-job-postings/','/facility-management/career/'].includes(route)){
     const name=route==='/facility-management/'?'facility-main':route==='/certifications/'?'certifications':route.endsWith('/career/')?'empty-category':'article';
     await page.screenshot({path:`${out}/${name}-${width}.png`,fullPage:true});
    }
    report.cases.push({route,width,...result});
   }
   await page.goto(base+'/facility-management/');
   await page.locator('[data-service-link="certifications"]').focus();await page.keyboard.press('Enter');await page.waitForURL(base+'/certifications/');
   assert.equal(await page.locator('[data-service-link="certifications"]').getAttribute('aria-current'),'true');
   await page.locator('[data-service-link="facility"]').click();await page.waitForURL(base+'/facility-management/');
   assert.equal(await page.locator('[data-service-link="facility"]').getAttribute('aria-current'),'true');
   await page.goBack();assert.equal(new URL(page.url()).pathname,'/certifications/');
   await page.goForward();assert.equal(new URL(page.url()).pathname,'/facility-management/');
   report.interactions.push({width,keyboardAndPointerSwitch:'PASS',history:'PASS',reload:'PASS'});
   await context.close();
  }
  assert.deepEqual(report.errors,[]);report.result='PASS';
 }catch(error){report.result='FAIL';report.errors.push(String(error));throw error;}
 finally{fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));await browser.close();}
 console.log('[Service split browser QA] PASS',report.cases.length,'page/viewport cases');
})().catch(error=>{console.error(error);process.exitCode=1});
