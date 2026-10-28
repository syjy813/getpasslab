const assert=require('node:assert/strict');const fs=require('node:fs');const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';const dir=process.env.QA_OUTPUT_DIR||'qa-results/fire-safety-level2-bulk';
const reviews=JSON.parse(fs.readFileSync('docs/audits/2026-10-14-fire-safety-level2-bulk/chapter-review.json','utf8'));
for(const row of reviews){if(row.chapterId==='FSM2-034')row.visuals=[{file:'pump-control-full-panel-v2.webp',sourceWidth:1536}];if(row.chapterId==='FSM2-048')row.visuals=[{file:'receiver-continuity-full-panel-v2.webp',sourceWidth:1536}];if(row.chapterId==='FSM2-049')row.visuals=[{file:'receiver-backup-full-panel-v2.webp',sourceWidth:1536}];}
// Current asset expectations; preserve the original release review unchanged.
for(const r of JSON.parse(fs.readFileSync('docs/audits/2026-10-28-fire-practice-phase2/figure-briefs.json')).figures){const row=reviews.find(row=>row.chapterId===r.id);assert(row);row.visuals=[{file:r.asset,sourceWidth:640,zoomWidth:1000}];}
const report={base,cases:[],errors:[],limitations:['Chromium emulation; physical iOS/Android and Safari not tested'],startedAt:new Date().toISOString()};fs.mkdirSync(dir,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.QA_CHROMIUM_EXECUTABLE?{executablePath:process.env.QA_CHROMIUM_EXECUTABLE}:{}),args:JSON.parse(process.env.QA_CHROMIUM_ARGS||'["--no-sandbox","--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader"]')});
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
 const ordered=[...reviews,...[{chapterId:'FSM2-075',order:56.1,route:'/fire-safety-manager-level2/written/fire-safety-practice/receiver-operation-auto-reset/'},{chapterId:'FSM2-076',order:56.2,route:'/fire-safety-manager-level2/written/fire-safety-practice/detector-transmitter-signal-reading/'},{chapterId:'FSM2-077',order:50.1,route:'/fire-safety-manager-level2/written/fire-safety-practice/pump-manual-auto-reading/'},{chapterId:'FSM2-078',order:51.1,route:'/fire-safety-manager-level2/written/fire-safety-practice/pump-test-piping-valves/'},{chapterId:'FSM2-079',order:54.1,route:'/fire-safety-manager-level2/written/fire-safety-practice/preaction-panel-state-reading/'}],{chapterId:'FSM2-037',order:40,route:'/fire-safety-manager-level2/written/fire-safety-theory/sprinkler-types-operation/'}].filter(r=>r.route.split('/')[3]===row.route.split('/')[3]).sort((a,b)=>a.order-b.order);const index=ordered.findIndex(r=>r.chapterId===row.chapterId);
 for(const [rel,expected]of [['prev',ordered[index-1]],['next',ordered[index+1]]]){const link=page.locator(`.chapter-mobile-link[rel="${rel}"]`);assert.equal(await link.count(),expected?1:0,row.chapterId+' '+rel);if(expected)assert.equal(await link.getAttribute('href'),expected.route,row.chapterId+' '+rel+' order')}
 assert.equal(await page.locator('[data-open],[data-practice-open]').count(),0);
 assert.equal(await page.locator('article figure').count(),row.visuals.length);
 const images=[];let hierarchy;
 for(let i=0;i<row.visuals.length;i++){
 const fig=page.locator('article figure').nth(i);const img=fig.locator('img');await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());
 const detail=await img.evaluate(e=>({src:new URL(e.currentSrc).pathname,w:e.getBoundingClientRect().width,nw:e.naturalWidth,nh:e.naturalHeight,alt:e.alt}));assert.equal(detail.src,'/images/fire-safety-manager-level2/'+row.visuals[i].file);assert.equal(detail.nw,row.visuals[i].sourceWidth||320);assert(detail.alt);if(!row.visuals[i].sourceWidth)assert(detail.w*20/320>=14,'smallest label size '+detail.w);else assert(await page.locator('.fire-panel-step').count()>=2,'whole panel has numbered explanations');
 const button=fig.locator('button');await button.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const before=await page.evaluate(()=>({x:scrollX,y:scrollY,style:document.body.getAttribute('style')||''}));await button.click();
 await page.waitForFunction(()=>document.getElementById('fire-bulk-image-dialog').open);assert.equal(await page.locator('#fire-bulk-image-dialog img').evaluate(e=>e.getBoundingClientRect().width),row.visuals[i].zoomWidth||(row.visuals[i].sourceWidth?1280:640));
 const close=(Number(row.chapterId.slice(-3))+i)%3===0?'button':(Number(row.chapterId.slice(-3))+i)%3===1?'escape':'backdrop';if(close==='button')await page.locator('[data-fire-close]').click();else if(close==='escape')await page.keyboard.press('Escape');else await page.mouse.click(1,1);
 await page.waitForFunction(b=>!document.getElementById('fire-bulk-image-dialog').open&&Math.abs(scrollY-b.y)<=1,before);assert.equal(await button.evaluate(e=>e===document.activeElement),true);assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style);images.push({...detail,close,restore:'PASS'});
 }
 if(row.chapterId==='FSM2-004'){
 const table=page.locator('.sample-table-scroll').first();
 const expected=[
 ['피난계획을 포함한 소방계획서 작성 및 시행','자위소방대 및 초기대응체계의 구성, 운영 및 교육'],
 ['피난시설, 방화구획 및 방화시설 관리','소방시설이나 그 밖의 소방 관련 시설 관리'],
 ['소방훈련 및 교육','화기 취급 감독'],
 ['업무수행 기록 및 유지','화재 발생 시 초기대응','그 밖에 소방안전관리에 필요한 업무']
 ];
 for(let i=0;i<expected.length;i++){
   const items=table.locator('tbody tr').nth(i).locator('td').nth(1).locator('li');
   assert.deepEqual(await items.allTextContents(),expected[i],'nine duties remain distinct');
   const bounds=await items.evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
   assert(bounds.every((b,j)=>!j||b.top>bounds[j-1].bottom),'separate duty lines');
 }
 const prose=page.locator('article>p:not(.fire-source-note)');
 assert(!(await prose.allTextContents()).join('\n').includes('·'),'no ambiguous prose separators');
 assert.equal(await prose.filter({hasText:'소유자, 관리자 또는 점유자'}).count(),1,'definition alternatives');
 assert.equal(await prose.filter({hasText:'소방안전관리자 선임과 시설 유지'}).count(),1,'parallel obligations');
 assert.equal(await prose.filter({hasText:'소방본부장 또는 소방서장'}).count(),1,'notification alternatives preserved');
 await table.screenshot({path:`${dir}/${row.chapterId}-duties-table-${width}.png`});
 await page.getByRole('heading',{name:'관계인의 책임',exact:true}).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));
 await page.screenshot({path:`${dir}/${row.chapterId}-responsibilities-${width}.png`});
 }
 if(row.chapterId==='FSM2-003'){
 assert.equal(await page.locator('article del,article s').count(),0,'no unintended range strikethrough');
 const range=page.locator('article>p').filter({hasText:'아파트 300~599세대 1명, 600~899세대 2명, 900~1,199세대 3명'});
 assert.equal(await range.count(),1,'three original numeric ranges remain visible');
 await range.screenshot({path:`${dir}/${row.chapterId}-range-${width}.png`});
 }
 if(row.chapterId==='FSM2-002'){
 const qualification=page.locator('.sample-table-scroll').first();
 assert.deepEqual(await qualification.locator('thead th').allTextContents(),['등급','자격 요건']);
 const expected=[
 ['소방기술사 또는 소방시설관리사','그 밖의 법정 자격과 경력 조합','특급 시험 합격'],
 ['소방설비기사 또는 소방설비산업기사','소방공무원 7년 이상','1급 시험 합격'],
 ['위험물기능장, 위험물산업기사 또는 위험물기능사','소방공무원 3년 이상','2급 시험 합격'],
 ['소방공무원 1년 이상','3급 시험 합격']
 ];
 for(let i=0;i<expected.length;i++){
   const items=qualification.locator('tbody tr').nth(i).locator('td').nth(1).locator('li');
   assert.deepEqual(await items.allTextContents(),expected[i],'unchanged requirement wording');
   const bounds=await items.evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})));
   assert(bounds.every((b,j)=>!j||b.top>bounds[j-1].bottom),'separate requirement lines');
 }
 await qualification.screenshot({path:`${dir}/${row.chapterId}-qualification-table-${width}.png`});
 }
 if(row.chapterId==='FSM2-001'){
 const table=page.locator('.sample-table-scroll').first();
 assert.equal(await page.locator('link[href="/styles/fire-bulk-visual.css?v=fire-grade-copy-20261022"]').count(),1,'versioned grade stylesheet');
 assert.deepEqual(await table.locator('.fire-grade-conditions').evaluateAll(es=>es.map(e=>e.children.length)),[3,4,5,2]);
 assert.equal(await page.getByRole('heading',{name:'조건에 붙는 단서',exact:true}).count(),0);
 assert.equal(await page.getByRole('heading',{name:'시험 포인트',exact:true}).count(),1);
 const points=page.locator('.fire-grade-exam-points');assert.equal(await points.locator('li').count(),3);
 assert.equal(await table.locator('p.fire-grade-prerequisite').count(),3);
 assert.deepEqual(await table.locator('tbody th[scope="row"]').allTextContents(),['특급','1급','2급','3급']);
 assert.deepEqual(await points.locator('li>strong').allTextContents(),['지하층 포함 여부','설비별 등급이 겹치는 경우','가연성 가스 저장·취급량']);
 const nativeText=await page.locator('article').innerText();assert(!/비아파트|지상층만 셈|면적과 별도 대상을 함께 확인/.test(nativeText));
 if(width<768)for(let i=0;i<4;i++){
   const gradeRow=table.locator('tbody tr').nth(i);
   await gradeRow.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   await gradeRow.screenshot({path:`${dir}/${row.chapterId}-grade-row-${i}-${width}.png`});
 }
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
 const footer=await page.locator('.fire-grade-lesson').evaluate(root=>{
   const article=root.parentElement,entry=article.querySelector(':scope>[data-fire-practice-entry]');
   const heading=entry.querySelector('h2'),cards=entry.querySelector('.fire-actions');
   const ad=article.querySelector(':scope>.adfit-placement');
   const related=article.querySelector(':scope>h2:has(+.related-list)'),list=related.nextElementSibling;
   const gap=(a,b)=>b.getBoundingClientRect().top-a.getBoundingClientRect().bottom;
   return {adToPractice:gap(ad,heading),practiceDivider:getComputedStyle(entry).borderTopWidth,practiceTitleToCards:gap(heading,cards),practiceToRelated:gap(entry,related),relatedDivider:getComputedStyle(related,'::after').height,relatedDividerOffset:getComputedStyle(related,'::after').top,relatedTitleToList:gap(related,list)};
 });
 hierarchy.footer=footer;
 assert.equal(footer.practiceDivider,'1px');assert.equal(footer.relatedDivider,'1px');
 close(parseFloat(footer.relatedDividerOffset),width<768?-16:-24,'related divider position');
 for(const key of ['adToPractice','practiceToRelated'])close(footer[key],width<768?32:48,key+' '+width);
 for(const key of ['practiceTitleToCards','relatedTitleToList'])close(footer[key],16,key+' '+width);
 for(const [name,label]of [['문제 풀기','practice-boundary'],['관련 챕터','related-boundary']]){
   await page.getByRole('heading',{name,exact:true}).evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
   await page.screenshot({path:`${dir}/${row.chapterId}-${label}-${width}.png`});
 }

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
 let total=0;for(const subject of ['fire-safety-theory','fire-safety-practice']){await page.goto(base+prefix+subject+'/');const links=await page.locator('a.card').evaluateAll(es=>es.map(e=>e.pathname));total+=links.length;for(const row of reviews.filter(r=>r.route.includes('/'+subject+'/')))assert(links.includes(row.route))}assert.equal(total,79);
 await context.close();
 }
 // SVG typography bounds use the same locally installed Korean font as screenshots.
 const page=await browser.newPage();for(const row of reviews)for(const v of row.visuals.filter(v=>!v.sourceWidth)){await page.goto(base+'/images/fire-safety-manager-level2/'+v.file);const bad=await page.locator('svg text').evaluateAll(es=>es.map(e=>({s:e.textContent,b:e.getBBox()})).filter(e=>e.b.x<0||e.b.x+e.b.width>320||e.b.y<0));assert.deepEqual(bad,[],v.file+' label bounds')}
 assert.deepEqual(report.errors,[]);report.result='PASS';
}catch(e){report.result='FAIL';report.errors.push(String(e));throw e}finally{report.finishedAt=new Date().toISOString();fs.writeFileSync(dir+'/browser-results.json',JSON.stringify(report,null,2));await browser.close()}
console.log('[Fire bulk browser]',report.result,report.cases.length,'chapter/viewport cases');})().catch(e=>{console.error(e);process.exitCode=1});
