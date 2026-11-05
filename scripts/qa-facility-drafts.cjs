const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=(process.env.QA_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const preview=process.env.QA_FACILITY_PREVIEW==='1';
const release=fs.existsSync('docs/audits/2026-11-05-facility-publication/manifest.json');
const available=preview||release;
const articles=Object.values(JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/site-article-map.json')));
const output='qa-results/facility-launch/'+(preview?'private-preview':'publication')+'/drafts';
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch();
 const results=[];
 try {
  for(const width of [320,390,768,1440]) {
   const context=await browser.newContext({viewport:{width,height:900}});
   await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   for(const article of articles) {
    const response=await page.goto(base+article.path);
    assert.equal(response.status(),available?200:404,article.path);
    if(!available){results.push({width,path:article.path,status:404});continue;}
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('h1').count(),1);
    const headings=await page.locator('.facility-body :is(h2,h3)').evaluateAll(elements=>elements.map(h=>{
     const s=getComputedStyle(h);return {level:h.tagName,color:s.color,weight:s.fontWeight,padding:s.paddingTop,top:s.marginTop,bottom:s.marginBottom};
    }));
    assert(headings.some(h=>h.level==='H2'),article.path+': body headings exist');
    for(const h of headings){
     const isH2=h.level==='H2';
     assert.equal(h.color,isH2?'rgb(20, 92, 62)':'rgb(25, 31, 40)',article.path+': heading color');
     assert.equal(h.weight,isH2?'700':'600',article.path+': heading weight');
     assert.equal(h.padding,isH2?'24px':'0px',article.path+': heading padding');
     assert.equal(h.top,isH2?'48px':'32px',article.path+': heading top margin');
     assert.equal(h.bottom,isH2?'16px':'12px',article.path+': heading bottom margin');
    }
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),preview?'noindex, nofollow':'index, follow');
    const images=page.locator('.facility-body img');
    assert.equal(await images.count(),5);
    for(const img of await images.all()) {
     await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
     const data=await img.evaluate(el=>{const r=el.getBoundingClientRect(),b=document.querySelector('.facility-body').getBoundingClientRect();return {loaded:el.complete&&el.naturalWidth>0,alt:el.alt,dimensions:!!el.width&&!!el.height,inside:r.left>=b.left-1&&r.right<=b.right+1,ratio:Math.abs(r.width/r.height-el.naturalWidth/el.naturalHeight)<.01,border:getComputedStyle(el).borderTopWidth};});
     assert(data.loaded&&data.alt&&data.dimensions&&data.inside&&data.ratio,article.path+': image '+JSON.stringify(data));
     assert.equal(data.border,'1px');
    }
    const dimensions=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert(dimensions.scroll<=dimensions.client+1,article.path+': no page overflow');
    const toc=page.locator('.facility-toc');
    await toc.locator('summary').click();
    const first=toc.locator('a').first(),href=await first.getAttribute('href');
    await first.click();
    await page.waitForFunction(id=>document.getElementById(id).getBoundingClientRect().top>=document.querySelector('.gnb').getBoundingClientRect().bottom-1,href.slice(1));
    if(width===390||width===1440) {
     await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
     await page.screenshot({path:output+'/'+article.slug+'-'+width+'.png',fullPage:true});
    }
    results.push({width,path:article.path,status:200,images:5,...dimensions});
   }
   assert.deepEqual(errors,[],'no page runtime errors');
   await context.close();
  }
  fs.writeFileSync(output+'/results.json',JSON.stringify({preview,cases:results.length,results},null,2)+'\n');
  console.log('Facility draft browser QA: '+results.length+' route/viewport cases PASS; '+(available?'160 image loads':'drafts return 404'));
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
