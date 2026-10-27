const assert=require('node:assert/strict');const fs=require('node:fs');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const dir=process.env.QA_OUTPUT_DIR||'qa-results/fire-priority-chapters';
const briefs=JSON.parse(fs.readFileSync('docs/audits/2026-10-27-fire-priority-chapters/figure-briefs.json')).figures;
const chapters=fs.readdirSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice').map(n=>fs.readFileSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+n,'utf8')).sort((a,b)=>Number(a.match(/^order: ([\d.]+)/m)[1])-Number(b.match(/^order: ([\d.]+)/m)[1]));
const slugs=chapters.map(s=>s.match(/^slug: "([^"]+)"/m)[1]);
const cases=briefs.map(b=>{const s=chapters.find(s=>s.includes('chapter_id: "'+b.chapterId+'"'));return{...b,slug:s.match(/^slug: "([^"]+)"/m)[1]}});
const prefix='/fire-safety-manager-level2/written/fire-safety-practice/';
const report={result:'RUNNING',cases:[],errors:[],limitations:['Chromium emulation; physical devices and Safari not tested']};
fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push(String(e)));
  await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  for(const row of cases){
   const response=await page.goto(base+prefix+row.slug+'/');assert.equal(response.status(),200);
   await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('h1').count(),1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),row.chapterId+' page overflow '+width);
   const img=page.locator('article figure img').first();await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());
   const image=await img.evaluate(e=>({src:new URL(e.currentSrc).pathname,width:e.getBoundingClientRect().width,alt:e.alt,naturalWidth:e.naturalWidth}));
   assert.equal(image.src,'/images/fire-safety-manager-level2/'+row.file);assert.equal(image.naturalWidth,380);assert(image.alt);
   assert(image.width*22/380>=13,'secondary label size '+image.width);assert(image.width*24/380>=14,'core label size '+image.width);
   await page.locator('article figure').screenshot({path:`${dir}/${row.chapterId}-figure-${width}.png`});
   const button=page.locator('.fire-bulk-zoom').first();await button.evaluate(e=>e.scrollIntoView({block:'center'}));
   const before=await page.evaluate(()=>({y:scrollY,style:document.body.getAttribute('style')||''}));await button.click();
   await page.waitForFunction(()=>document.getElementById('fire-bulk-image-dialog').open);
   const expanded=page.locator('#fire-bulk-image-dialog img');await expanded.evaluate(e=>e.decode());assert.equal(await expanded.getAttribute('src'),image.src);
   await page.keyboard.press('Escape');await page.waitForFunction(b=>!document.getElementById('fire-bulk-image-dialog').open&&Math.abs(scrollY-b.y)<=1,before);
   assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style);assert(await button.evaluate(e=>e===document.activeElement));
   const index=slugs.indexOf(row.slug);
   for(const [rel,slug]of [['prev',slugs[index-1]],['next',slugs[index+1]]])assert.equal(await page.locator(`.chapter-mobile-link[rel="${rel}"]`).getAttribute('href'),prefix+slug+'/',row.chapterId+' '+rel);
   if(width<1024){
    const menu=page.locator('header details').filter({has:page.locator('summary').filter({hasText:'챕터 목차'})});
    await menu.locator('summary').click();
    for(const next of cases)assert(await menu.locator(`a[href="${prefix+next.slug}/"]`).count(),next.slug+' in GNB');
    await menu.locator('summary').click();
   }
   const entry=page.locator('[data-fire-practice-entry]');assert((await entry.innerText()).includes('연결 챕터 문제 풀기'));
   const link=entry.locator('a').first();const href=await link.getAttribute('href');assert(!href.includes(row.chapterId));
   const popupPromise=page.waitForEvent('popup');await link.click();const popup=await popupPromise;
   popup.on('pageerror',e=>report.errors.push(String(e)));
   await popup.waitForLoadState('domcontentloaded');
   await popup.waitForFunction(()=>document.querySelector('[data-start]')?.disabled===false);
   assert(await popup.locator('[data-start]').isEnabled());
   await popup.locator('[data-start]').click();assert(await popup.locator('[data-session]').isVisible());await popup.close();
   await page.evaluate(()=>scrollTo(0,0));if(width===390||width===1440)await page.screenshot({path:`${dir}/${row.chapterId}-page-${width}.png`,fullPage:true});
   report.cases.push({chapterId:row.chapterId,width,image,practice:'existing approved pool opens',zoomAndRestore:'PASS',navigation:'PASS',overflow:false});
  }
  await page.goto(base+prefix);assert.equal(await page.locator('a.card').count(),30);
  for(const row of cases)assert.equal(await page.locator(`a.card[href="${prefix+row.slug}/"]`).count(),1);
  await context.close();
 }
 const page=await browser.newPage();
 for(const row of cases){
  await page.goto(base+'/images/fire-safety-manager-level2/'+row.file);await page.evaluate(()=>document.fonts.ready);
  const bad=await page.locator('svg text').evaluateAll(es=>es.flatMap(e=>{const b=e.getBBox(),h=e.ownerSVGElement.viewBox.baseVal.height;return b.x<0||b.x+b.width>380.5||b.y<0||b.y+b.height>h?[e.textContent]:[]}));
  assert.deepEqual(bad,[],row.file+' label bounds');
 }
 assert.deepEqual(report.errors,[]);report.result='PASS';
 }catch(e){report.result='FAIL';report.errors.push(String(e));throw e}
 finally{fs.writeFileSync(dir+'/browser-results.json',JSON.stringify(report,null,2));await browser.close();}
 console.log('[Fire priority browser] PASS',report.cases.length,'chapter/viewport cases');
})().catch(e=>{console.error(e);process.exitCode=1});
