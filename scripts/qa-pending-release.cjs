const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const release=JSON.parse(fs.readFileSync('docs/audits/2026-11-18-pending-release/manifest.json'));
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
(async()=>{const browser=await chromium.launch();const results=[];try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  for(const row of release.articles){
   assert.equal((await page.goto(base+row.route)).status(),200);await page.locator('.facility-body img').evaluate(i=>i.decode());
   assert.equal(await page.locator('h1').textContent(),row.title);assert.equal(await page.locator('.facility-sources').count(),0);
   const geometry=await page.evaluate(()=>{const im=document.querySelector('.facility-body img'),r=im.getBoundingClientRect();return {w:innerWidth,scroll:document.documentElement.scrollWidth,natural:[im.naturalWidth,im.naturalHeight],ratio:r.width/r.height}});
   assert(geometry.scroll<=width+1,'article overflow '+row.slug);assert.deepEqual(geometry.natural,[1448,1086]);assert(Math.abs(geometry.ratio-4/3)<.01);
   await page.locator('.facility-toc summary').click();const target=await page.locator('.facility-toc a').first().getAttribute('href');await page.locator('.facility-toc a').first().click();assert.equal(decodeURIComponent(new URL(page.url()).hash),decodeURIComponent(target));
   const other=await page.locator('.facility-section .facility-card').first().getAttribute('href');await page.locator('.facility-section .facility-card').first().click();await page.waitForURL(base+other);assert.equal(await page.locator('h1').count(),1);
   results.push({width,slug:row.slug,overflow:false,hero:'loaded 4:3',toc:'pass',related:'pass'});
  }
  await page.goto(base+'/facility-management/stories/');
  for(const row of release.articles){const card=page.locator('.facility-category-list .facility-card[href="'+row.route+'"]');assert.equal(await card.count(),1);await card.locator('img').evaluate(i=>i.decode());assert.equal(await card.locator('img').getAttribute('src'),row.image.replace(/^public/,''));}
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.goto(base+'/facility-management/');assert.equal(await page.locator('#facility-group-stories').count(),1);assert.equal(await page.locator('.facility-feed .facility-card[href*="/sasugoldae-"]').count(),6);
  assert.equal(await page.locator('select[data-sort], [data-view-sort]').count(),0,'view sorting excluded');
  assert.deepEqual(errors,[]);await context.close();
 }
 fs.mkdirSync('qa-results/pending-release',{recursive:true});fs.writeFileSync('qa-results/pending-release/results.json',JSON.stringify(results,null,2)+'\n');console.log('PASS: eight new episodes × four widths, images, TOC, related navigation, list and home');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
