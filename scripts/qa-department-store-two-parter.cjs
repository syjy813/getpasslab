const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const rows=[
 {slug:'hobyeongbaekma-department-store-despair',route:'/facility-management/career/hobyeongbaekma-department-store-despair/',other:'/facility-management/career/hobyeongbaekma-department-store-hope/'},
 {slug:'hobyeongbaekma-department-store-hope',route:'/facility-management/career/hobyeongbaekma-department-store-hope/',other:'/facility-management/career/hobyeongbaekma-department-store-despair/'}
];
const output='qa-results/department-store-two-parter';fs.mkdirSync(output,{recursive:true});
(async()=>{const browser=await chromium.launch();const results=[];try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();
  for(const row of rows){
   const response=await page.goto(base+row.route);assert.equal(response.status(),200);
   await page.locator('.facility-body img').evaluate(img=>img.decode());
   const state=await page.evaluate(()=>{const img=document.querySelector('.facility-body img'),r=img.getBoundingClientRect();return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,image:{width:img.naturalWidth,height:img.naturalHeight,renderedWidth:r.width,renderedHeight:r.height},sources:document.querySelectorAll('.facility-sources').length,tables:[...document.querySelectorAll('.facility-body table')].map(t=>({width:t.getBoundingClientRect().width,scrollWidth:t.scrollWidth})),heads:[...document.querySelectorAll('.facility-body h2')].map(h=>({color:getComputedStyle(h).color,weight:getComputedStyle(h).fontWeight}))};});
   assert.equal(state.h1,1);assert.equal(state.sources,0);assert(state.scrollWidth<=state.width+1,'no page overflow');
   assert.equal(state.image.width,1440);assert.equal(state.image.height,1080);assert(Math.abs(state.image.renderedWidth/state.image.renderedHeight-4/3)<.01,'uncropped 4:3');
   assert(state.heads.length>=8&&state.heads.every(h=>h.color==='rgb(20, 92, 62)'&&Number(h.weight)>=700),'heading hierarchy');
   assert.equal(await page.locator('.facility-body a[href="'+row.other+'"]').count(),1,'counterpart link');
   await page.locator('.facility-toc summary').click();const target=await page.locator('.facility-toc a').first().getAttribute('href');await page.locator('.facility-toc a').first().click();assert(decodeURIComponent(new URL(page.url()).hash)===decodeURIComponent(target));
   await page.goto(base+row.route);await page.locator('.facility-body img').evaluate(img=>img.decode());await page.screenshot({path:output+'/'+row.slug+'-'+width+'.png',fullPage:true});
   results.push({route:row.route,width,...state});
  } await context.close();
 }
 fs.writeFileSync(output+'/results.json',JSON.stringify({base,results},null,2));console.log('Department-store responsive QA PASS: 2 pages × 4 widths');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
