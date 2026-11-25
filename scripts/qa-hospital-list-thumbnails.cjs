const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const ids=["hobyeongbaekma-hospital-despair","hobyeongbaekma-hospital-hope","hobyeongbaekma-hospital-large-university"];
const protectedFiles={
  "src/content/facility/hobyeongbaekma-hospital-despair.md": "eb8bc7647305527897d3375c678fbf4fe7565a57",
  "src/content/facility/hobyeongbaekma-hospital-hope.md": "928d8c12d5405072a4bf772d5270679ad8f69e3e",
  "src/content/facility/hobyeongbaekma-hospital-large-university.md": "f30811d0097495afabc835c398704d42c81776d7",
  "src/layouts/FacilityArticleLayout.astro": "514bb907f42667a64871b04783fce6059101340f",
  "src/layouts/FacilityLayout.astro": "e42fafcbf46f542e679edc5ca713402d375063a2"
};
const out='qa-results/hospital-list-thumbnails';fs.mkdirSync(out,{recursive:true});
(async()=>{const {beforeBodyHeroRemoval}=await import('./read-hobyeongbaekma-body-heroes.mjs');
const {beforePendingRelease}=await import('./read-pending-release.mjs');
for(const [file,expected] of Object.entries(protectedFiles)){
 const bytes=beforeBodyHeroRemoval(file,beforePendingRelease(file,fs.readFileSync(file))),actual=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
 assert.equal(actual,expected,file+': original article and metadata source');
}
const browser=await chromium.launch();const results=[];
try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:1000}});
  await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const page=await context.newPage();
  for(const id of ids){
   const listResponse=await page.goto(base+'/facility-management/stories/');assert.equal(listResponse.status(),200);
   const route='/facility-management/career/'+id+'/',card=page.locator('.facility-card[href="'+route+'"]');
   assert.equal(await card.count(),1);await card.scrollIntoViewIfNeeded();await card.locator('img').evaluate(img=>img.decode());
   const state=await card.evaluate(card=>{const img=card.querySelector('img'),frame=img.parentElement,r=frame.getBoundingClientRect();return {
    src:img.getAttribute('src'),natural:[img.naturalWidth,img.naturalHeight],rendered:[r.width,r.height],
    fit:getComputedStyle(img).objectFit,border:parseFloat(getComputedStyle(frame).borderTopWidth),
    title:card.querySelector('.facility-card-title').textContent.trim(),client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth
   }});
   assert.equal(state.src,'/images/facility-series/list-thumbnails-3x2/'+id+'.webp');assert.deepEqual(state.natural,[1536,1024]);
   assert(state.rendered[0]>0&&Math.abs(state.rendered[0]/state.rendered[1]-3/2)<.01,'3:2 frame for the original composition');
   assert.equal(state.fit,'contain');assert(state.border>=1,'image frame');assert(state.title.length>0,'HTML title');assert(state.scroll<=state.client+1,'no overflow');
   await card.click();await page.waitForURL(base+route);
   assert.equal(await page.locator('.facility-body img').count(),0,'approved body hero removed');
   assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),'https://getpasslab.co.kr/og-facility.png','original OG');
   results.push({id,width,...state});
  }
  await page.goto(base+'/facility-management/');
  const home=page.locator('.facility-card[href="/facility-management/career/hobyeongbaekma-hospital-large-university/"] img');
  assert.equal(await home.count(),0,'older hospital card retained in category after new release');
  await page.goto(base+'/facility-management/stories/');
  const hospital=page.locator('.facility-card[href="/facility-management/career/hobyeongbaekma-hospital-large-university/"]');
  await hospital.scrollIntoViewIfNeeded();
  await page.screenshot({path:out+'/stories-'+width+'.png',fullPage:true});
  await context.close();
 }
 fs.writeFileSync(out+'/results.json',JSON.stringify({base,protectedFiles,results},null,2));
 console.log('Hospital listing thumbnails PASS: 3 images x 4 widths, navigation, home, removed body heroes and preserved OG');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
