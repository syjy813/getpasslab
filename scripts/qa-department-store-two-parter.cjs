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
   const listings=[];
   for(const listing of ['/facility-management/stories/','/facility-management/']){
    assert.equal((await page.goto(base+listing)).status(),200);
    const card=page.locator('.facility-card[href="'+row.route+'"]');assert.equal(await card.count(),1);
    await card.scrollIntoViewIfNeeded();await card.locator('img').evaluate(img=>img.decode());
    const state=await card.evaluate(card=>{const img=card.querySelector('img'),r=img.getBoundingClientRect();return {
     src:img.getAttribute('src'),natural:[img.naturalWidth,img.naturalHeight],rendered:[r.width,r.height],fit:getComputedStyle(img).objectFit,
     border:parseFloat(getComputedStyle(img.parentElement).borderTopWidth),title:card.querySelector('.facility-card-title').textContent.trim(),
     scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth};});
    assert.equal(state.src,'/images/facility-series/list-thumbnails/'+row.slug+'.webp');assert.deepEqual(state.natural,[1448,1086]);
    assert(state.rendered[0]>0&&Math.abs(state.rendered[0]/state.rendered[1]-4/3)<.01,'uncropped listing 4:3');
    assert.equal(state.fit,'contain');assert(state.border>=1);assert(state.title.length>0);assert(state.scroll<=state.client+1,'listing overflow');
    if(listing.includes('/stories/'))await card.screenshot({path:output+'/'+row.slug+'-card-'+width+'.png'});
    await card.click();await page.waitForURL(base+row.route);listings.push({listing,...state});
   }
   const response=await page.goto(base+row.route);assert.equal(response.status(),200);
   assert.equal(await page.locator('.facility-body img').count(),0,'approved body hero removed');
   const state=await page.evaluate(()=>{return {width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,sources:document.querySelectorAll('.facility-sources').length,tables:[...document.querySelectorAll('.facility-body table')].map(t=>({width:t.getBoundingClientRect().width,scrollWidth:t.scrollWidth})),heads:[...document.querySelectorAll('.facility-body h2')].map(h=>({color:getComputedStyle(h).color,weight:getComputedStyle(h).fontWeight}))};});
   assert.equal(state.h1,1);assert.equal(state.sources,0);assert(state.scrollWidth<=state.width+1,'no page overflow');

   assert(state.heads.length>=8&&state.heads.every(h=>h.color==='rgb(20, 92, 62)'&&Number(h.weight)>=700),'heading hierarchy');
   assert.equal(await page.locator('.facility-body a[href="'+row.other+'"]').count(),1,'counterpart link');
   await page.locator('.facility-toc summary').click();const target=await page.locator('.facility-toc a').first().getAttribute('href');await page.locator('.facility-toc a').first().click();assert(decodeURIComponent(new URL(page.url()).hash)===decodeURIComponent(target));
   await page.goto(base+row.route);assert.equal(await page.locator('.facility-body img').count(),0,'approved body hero removed');await page.screenshot({path:output+'/'+row.slug+'-'+width+'.png',fullPage:true});
   results.push({route:row.route,width,listings,...state});
  } await context.close();
 }
 fs.writeFileSync(output+'/results.json',JSON.stringify({base,results},null,2));console.log('Department-store responsive QA PASS: 2 pages and home/stories cards × 4 widths');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
