const assert=require('node:assert/strict');const fs=require('node:fs');const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';const dir=process.env.QA_OUTPUT_DIR||'qa-results/fire-safety-level2-bulk';
const reviews=JSON.parse(fs.readFileSync('docs/audits/2026-10-14-fire-safety-level2-bulk/chapter-review.json','utf8'));
const report={base,cases:[],errors:[],limitations:['Chromium emulation; physical iOS/Android and Safari not tested'],startedAt:new Date().toISOString()};fs.mkdirSync(dir,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.QA_CHROMIUM_EXECUTABLE?{executablePath:process.env.QA_CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
try{
 for(const width of [320,390,768,1440]){
 const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();page.setDefaultTimeout(12000);
 await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 page.on('pageerror',e=>report.errors.push(String(e)));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)report.errors.push(r.status()+' '+r.url())});
 for(const row of reviews.filter(r=>!process.env.QA_CHAPTER_IDS||process.env.QA_CHAPTER_IDS.split(',').includes(r.chapterId))){
 const response=await page.goto(base+row.route);await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.equal(response.status(),200);assert.equal(await page.locator('h1').count(),1);
 const fit=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
 assert(fit,row.chapterId+': overflow '+width);
 if(row===reviews[0]){await page.locator('.subject-switcher summary').click();const rect=await page.locator('.subject-switcher-menu').evaluate(e=>{const r=e.getBoundingClientRect();return{left:r.left,right:r.right}});assert(rect.left>=0&&rect.right<=width+1,'subject menu bounds');await page.mouse.move(0,0);await page.locator('h1').click();}
 const ordered=[...reviews,{chapterId:'FSM2-037',order:40,route:'/fire-safety-manager-level2/written/fire-safety-theory/sprinkler-types-operation/'}].filter(r=>r.route.split('/')[3]===row.route.split('/')[3]).sort((a,b)=>a.order-b.order);const index=ordered.findIndex(r=>r.chapterId===row.chapterId);
 for(const [rel,expected]of [['prev',ordered[index-1]],['next',ordered[index+1]]]){const link=page.locator(`.chapter-mobile-link[rel="${rel}"]`);assert.equal(await link.count(),expected?1:0,row.chapterId+' '+rel);if(expected)assert.equal(await link.getAttribute('href'),expected.route,row.chapterId+' '+rel+' order')}
 assert.equal(await page.locator('[data-open],[data-practice-open]').count(),0);
 assert.equal(await page.locator('article figure').count(),row.visuals.length);
 const images=[];let hierarchy;
 for(let i=0;i<row.visuals.length;i++){
 const fig=page.locator('article figure').nth(i);const img=fig.locator('img');await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());
 const detail=await img.evaluate(e=>({src:new URL(e.currentSrc).pathname,w:e.getBoundingClientRect().width,nw:e.naturalWidth,nh:e.naturalHeight,alt:e.alt}));assert.equal(detail.src,'/images/fire-safety-manager-level2/'+row.visuals[i].file);assert.equal(detail.nw,320);assert(detail.alt);assert(detail.w*20/320>=14,'smallest label size '+detail.w);
 const button=fig.locator('button');await button.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const before=await page.evaluate(()=>({x:scrollX,y:scrollY,style:document.body.getAttribute('style')||''}));await button.click();
 await page.waitForFunction(()=>document.getElementById('fire-bulk-image-dialog').open);assert.equal(await page.locator('#fire-bulk-image-dialog img').evaluate(e=>e.getBoundingClientRect().width),640);
 const close=(Number(row.chapterId.slice(-3))+i)%3===0?'button':(Number(row.chapterId.slice(-3))+i)%3===1?'escape':'backdrop';if(close==='button')await page.locator('[data-fire-close]').click();else if(close==='escape')await page.keyboard.press('Escape');else await page.mouse.click(1,1);
 await page.waitForFunction(b=>!document.getElementById('fire-bulk-image-dialog').open&&Math.abs(scrollY-b.y)<=1,before);assert.equal(await button.evaluate(e=>e===document.activeElement),true);assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style);images.push({...detail,close,restore:'PASS'});
 }
 if(row.chapterId==='FSM2-001'){
 const table=page.locator('.sample-table-scroll').first();
 assert.equal(await page.locator('link[href="/styles/fire-bulk-visual.css?v=fire-grade-hierarchy-20261022"]').count(),1,'versioned grade stylesheet');
 assert.deepEqual(await table.locator('.fire-grade-conditions').evaluateAll(es=>es.map(e=>e.children.length)),[3,4,4,2]);
 assert.equal(await page.getByRole('heading',{name:'조건에 붙는 단서',exact:true}).count(),0);
 assert.equal(await page.getByRole('heading',{name:'시험 포인트',exact:true}).count(),1);
 const points=page.locator('.fire-grade-exam-points');assert.equal(await points.locator('li').count(),5);
 const marker=await table.locator('li').first().evaluate(e=>({text:parseFloat(getComputedStyle(e).fontSize),marker:parseFloat(getComputedStyle(e,'::marker').fontSize)}));
 assert(marker.marker<marker.text,'small condition bullet');
 hierarchy=await page.locator('.fire-grade-lesson').evaluate(root=>{
   const sections=[...root.querySelectorAll(':scope>.fire-grade-section')];
   const rect=e=>e.getBoundingClientRect();
   const gap=(a,b)=>rect(b).top-rect(a).bottom;
   const intro=sections[0].querySelector(':scope>p');
   const table=sections[0].querySelector('table');
   const note=sections[0].querySelector('.fire-grade-scope-note');
   const heading=sections[1].querySelector('h2');
   const box=sections[1].querySelector('.fire-grade-exam-points');
   return {sections:sections.length,titleToBody:gap(sections[0].querySelector('h2'),intro),bodyToTable:gap(intro,table),tableToNote:gap(table,note),sectionGap:gap(note,heading),divider:getComputedStyle(sections[1]).borderTopWidth,titleToBox:gap(heading,box),pointTextGaps:[...box.querySelectorAll('li')].map(li=>gap(li.querySelector('strong'),li.querySelector('p'))),boxPadding:parseFloat(getComputedStyle(box).paddingTop),tableFont:parseFloat(getComputedStyle(table).fontSize)};
 });
 const close=(actual,expected,label)=>assert(Math.abs(actual-expected)<1,label+': '+actual+' vs '+expected);
 assert.equal(hierarchy.sections,2);assert.equal(hierarchy.divider,'1px');
 for(const [key,value]of Object.entries({titleToBody:16,bodyToTable:16,tableToNote:8,titleToBox:16,sectionGap:width<768?32:48,boxPadding:width<768?16:24,tableFont:14}))close(hierarchy[key],value,key+' '+width);
 for(const value of hierarchy.pointTextGaps)close(value,8,'point title/body gap');
 await page.getByRole('heading',{name:'시험 포인트',exact:true}).evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
 await page.screenshot({path:`${dir}/${row.chapterId}-section-boundary-${width}.png`});

 for(const [target,label]of [[table,'table'],[points,'exam-points']]){
   await target.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   await target.screenshot({path:`${dir}/${row.chapterId}-${label}-${width}.png`});
 }
 }
 if([13,34,35,36,43,44,45,60].includes(Number(row.chapterId.slice(-3)))){await page.evaluate(()=>scrollTo(0,0));await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));await page.screenshot({path:`${dir}/${row.chapterId}-${width}.png`,fullPage:true});}
 report.cases.push({chapterId:row.chapterId,width,route:row.route,status:response.status(),overflow:false,images,...(hierarchy?{hierarchy}:{})});
 }
 const prefix='/fire-safety-manager-level2/written/';await page.goto(base+prefix);assert.equal(await page.locator('a.card').count(),2);
 let total=0;for(const subject of ['fire-safety-theory','fire-safety-practice']){await page.goto(base+prefix+subject+'/');const links=await page.locator('a.card').evaluateAll(es=>es.map(e=>e.pathname));total+=links.length;for(const row of reviews.filter(r=>r.route.includes('/'+subject+'/')))assert(links.includes(row.route))}assert.equal(total,74);
 await context.close();
 }
 // SVG typography bounds use the same locally installed Korean font as screenshots.
 const page=await browser.newPage();for(const row of reviews)for(const v of row.visuals){await page.goto(base+'/images/fire-safety-manager-level2/'+v.file);const bad=await page.locator('svg text').evaluateAll(es=>es.map(e=>({s:e.textContent,b:e.getBBox()})).filter(e=>e.b.x<0||e.b.x+e.b.width>320||e.b.y<0));assert.deepEqual(bad,[],v.file+' label bounds')}
 assert.deepEqual(report.errors,[]);report.result='PASS';
}catch(e){report.result='FAIL';report.errors.push(String(e));throw e}finally{report.finishedAt=new Date().toISOString();fs.writeFileSync(dir+'/browser-results.json',JSON.stringify(report,null,2));await browser.close()}
console.log('[Fire bulk browser]',report.result,report.cases.length,'chapter/viewport cases');})().catch(e=>{console.error(e);process.exitCode=1});
