const fs=require('node:fs');
const assert=require('node:assert/strict');
const { chromium }=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const dir=process.env.QA_OUTPUT_DIR||'qa-results/chapter-practice-header-gnb';
fs.mkdirSync(dir,{recursive:true});
const routes=[
  '/industrial-safety/written/construction/formwork-removal/',
  '/energy-management/written/thermal-equipment/draft-flue-gas/',
  '/computer-literacy/written/spreadsheets/goal-seek/'
];
const results=[],errors=[];
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768});
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(String(e)));
 for(const route of routes){
  assert.equal((await page.goto(base+route,{waitUntil:'load'})).status(),200);
  const cert=page.locator('.gnb-cert-menu');
  const toc=page.locator('.gnb-menu');
  assert.equal(await toc.count(),1,'chapter TOC stays available');
  assert.equal(await cert.isVisible(),width>=768&&width<1024,'cert picker is available only on tablet chapter detail');
  assert.equal(await toc.locator('summary').isVisible(),width<1024,'TOC visible only when desktop sidebar is absent');
  if(width>=1024) assert(await page.locator('.chapter-side').isVisible(),'desktop chapter sidebar replaces header TOC');
  assert.equal(await page.locator('.gnb-logo').getAttribute('href'),'/certifications/','certificate logo and service switch share one home');
  const opener=page.locator('[data-practice-open]');
  assert(await opener.count(),'shared practice entry is present');
  await opener.scrollIntoViewIfNeeded();await opener.click();
  const dialog=page.locator('[data-practice-dialog]');const item=dialog.locator('[data-practice-item]');await item.waitFor();
  const heading=dialog.locator('#instant-practice-heading');
  assert.equal(await heading.textContent(),'기출 풀어보기');
  assert.equal(await dialog.locator('.practice-status-row').count(),0);
  const progress=dialog.locator('[data-practice-progress]');
  const label=await progress.textContent();
  assert.match(label,/^1\s*\/\s*\d+$/);
  const close=dialog.locator('[data-practice-close]');
  assert.equal(await close.getAttribute('aria-label'),'문제 풀이 닫기');
  assert.equal(await close.locator('svg[aria-hidden="true"]').count(),1);
  assert(await close.isVisible(),'X button shown at all viewport sizes');
  const layout=await dialog.evaluate(el=>{
   const h=el.querySelector('#instant-practice-heading').getBoundingClientRect();
   const p=el.querySelector('[data-practice-progress]').getBoundingClientRect();
   const b=el.querySelector('[data-practice-close]').getBoundingClientRect();
   return {titleRight:h.right,progressLeft:p.left,progressRight:p.right,closeLeft:b.left,closeWidth:b.width,closeHeight:b.height,titleTop:h.top,progressTop:p.top,docWidth:document.documentElement.scrollWidth,viewWidth:document.documentElement.clientWidth};
  });
  assert(layout.progressLeft>=layout.titleRight-1&&layout.progressRight<layout.closeLeft,
    'progress follows title, both left of X');
  assert(Math.abs(layout.titleTop-layout.progressTop)<=15,'title and progress share a row');
  assert(layout.closeWidth>=44&&layout.closeHeight>=44,'accessible close hit target');
  assert(layout.docWidth<=layout.viewWidth+1,'no full page horizontal overflow');
  const options=item.locator('.practice-choice');
  assert.equal(await options.count(),4);
  await options.first().click();
  assert(await item.locator('[data-practice-check]').isEnabled(),'selection/answer button intact');
  await item.locator('[data-practice-check]').click();
  assert(await item.locator('[data-practice-feedback]').isVisible(),'grading intact');
  if(width===390||width===1440)await dialog.screenshot({path:dir+'/'+route.split('/')[1]+'-'+width+'.png'});
  await close.click();
  await dialog.waitFor({state:'hidden'});
  assert(await opener.evaluate(e=>document.activeElement===e),'focus restored to opener');
  results.push({route,width,progress:label,modal:'PASS',gnb:'PASS'});
 }
 for(const other of ['/', '/computer-literacy/written/']){
  assert.equal((await page.goto(base+other)).status(),200);
  assert(await page.locator('[data-gnb-menu] > summary[aria-label="자격증 선택"]').isVisible(),'ordinary pages retain certification menu');
  assert.equal(await page.locator('.gnb-chapter-dropdown').count(),0,'no extra chapter picker on ordinary pages');
 }
 await context.close();
}
assert.deepEqual(errors,[],'no script errors');
console.log('[Chapter modal and mobile GNB] PASS',JSON.stringify({cases:results.length,viewports:[320,390,768,1440],pages:routes.length,errors:0}));
}finally{
fs.writeFileSync(dir+'/results.json',JSON.stringify({results,errors},null,2));
await browser.close();
}
})().catch(e=>{console.error(e);process.exitCode=1;});
