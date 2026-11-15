const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
const base='http://127.0.0.1:4321',route='/facility-management/career/sasugoldae/';
const out='qa-results/sasugoldae';fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch();const results=[];try{
for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:1000}});
 await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 const page=await context.newPage();
 assert.equal((await page.goto(base+route)).status(),200);
 await page.locator('.facility-body img').evaluate(img=>img.decode());
 const state=await page.evaluate(()=>{const im=document.querySelector('.facility-body img'),r=im.getBoundingClientRect();return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,summary:document.querySelectorAll('.facility-summary li').length,sources:document.querySelectorAll('.facility-sources').length,hero:{naturalWidth:im.naturalWidth,naturalHeight:im.naturalHeight,width:r.width,height:r.height},tableWidths:[...document.querySelectorAll('.facility-body table')].map(t=>t.getBoundingClientRect().width),related:[...document.querySelectorAll('.facility-section .facility-card')].map(a=>a.getAttribute('href'))};});
 assert.equal(state.h1,1);assert.equal(state.summary,3);assert.equal(state.sources,0);assert(state.scrollWidth<=width+1,'no page overflow');
 assert.equal(state.hero.naturalWidth,1448);assert.equal(state.hero.naturalHeight,1086);assert(Math.abs(state.hero.width/state.hero.height-4/3)<0.005,'full uncropped hero');
 assert.equal(await page.locator('.facility-body a[href^="https://cafe.naver.com/"]').count(),2);
 await page.screenshot({path:`${out}/article-${width}.png`,fullPage:true});
 await page.locator('.facility-toc summary').click();const target=await page.locator('.facility-toc a').first().getAttribute('href');await page.locator('.facility-toc a').first().click();assert.equal(decodeURIComponent(new URL(page.url()).hash),decodeURIComponent(target));
 for(const list of ['/facility-management/','/facility-management/career/']){
  assert.equal((await page.goto(base+list)).status(),200);
  const card=page.locator(`a.facility-card[href="${route}"]`).first();assert.equal(await card.count(),1);
  const img=card.locator('img');await img.scrollIntoViewIfNeeded();await img.evaluate(im=>im.decode());assert((await img.getAttribute('src')).includes('sasugoldae-00'));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(list==='/facility-management/'&&width===390)await page.screenshot({path:`${out}/home-${width}.png`,fullPage:true});
 }
 results.push({width,...state,toc:'pass',homeCard:'pass',categoryCard:'pass'});await context.close();
}
const page=await browser.newPage();for(const [path,sources]of [['/facility-management/career/hobyeongbaekma/',0],['/facility-management/career/first-job/',1]]){await page.goto(base+path);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.facility-sources').count(),sources);}
fs.writeFileSync('docs/audits/2026-11-15-sasugoldae-ep00/responsive-qa.json',JSON.stringify({base,engine:'Chromium',externalResources:'blocked during local QA',results,regressions:'hobyeongbaekma source list remains hidden; first-job source list remains visible'},null,2)+'\n');console.log('PASS: article/home/category × 4 widths; TOC; hero; 2 existing-page regressions');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
