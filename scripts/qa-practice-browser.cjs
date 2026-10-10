// Actual browser interaction against production; product data is read-only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'https://getpasslab.co.kr';
const dir='qa-results/practice-production';fs.mkdirSync(dir,{recursive:true});
const previousPath=process.env.QA_COMPLETE_LARGE_REPORT||process.env.QA_RETRY_REPORT;
const previous=previousPath?JSON.parse(fs.readFileSync(previousPath,'utf8')):undefined;
const retryKeys=new Set((process.env.QA_COMPLETE_LARGE_REPORT?previous.samples.filter(s=>s.total>50&&!s.completed):previous?.errors??[]).map(e=>e.url+'|'+e.width));
const report=previous?{...previous,samples:previous.samples.filter(s=>!retryKeys.has(s.url+'|'+s.width)),errors:[],findings:previous.findings.filter(f=>!retryKeys.has(f.url+'|'+f.width))}:{base,startedAt:new Date().toISOString(),samples:[],findings:[],errors:[],faultInjection:[],limitations:['Chromium desktop and touch emulation; no physical iOS/Android device','Advertising/analytics requests blocked to avoid test traffic; font requests retained']};
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const certs=['industrial-safety','energy-management','computer-literacy'];
const questions=Object.fromEntries(certs.map(c=>[c,new Map(JSON.parse(fs.readFileSync('src/data/questions/'+c+'.json')).map(q=>[q.id,q]))]));
const rows=certs.flatMap(cert=>walk('dist/'+cert+'/written').filter(p=>p.endsWith('/index.html')&&p.split('/').length===6).flatMap(file=>{
 const h=fs.readFileSync(file,'utf8');if(/http-equiv="refresh"/.test(h))return [];
 const meta=[...h.matchAll(/<span\b[^>]*data-practice-meta[^>]*>/g)].map(m=>m[0]);
 return [{cert,route:'/'+file.slice(5,-10),ids:meta.map(m=>m.match(/data-id="([^"]+)"/)[1]),meta}];
}));
const get=slug=>rows.find(r=>r.route.endsWith('/'+slug+'/'));
const reps=[get('accident-prevention-principles'),get('energy-laws-and-inspection'),get('cell-entry-edit-navigation')];
const special=[
 ['quantitative-assessment-items','20200926_025'],['press-safety-devices','20220424_051'],
 ['fta-event-symbols','20180304_036'],['heating-systems','20121020_025'],
 ['boiler-protection-devices','20130127_025'],['iptv-smart-tv','20150307_005'],
 ['network-device-roles','20180901_020'],
];
let browser;
const symbols=['①','②','③','④'];
async function newPage(width){
 const context=await browser.newContext({viewport:{width,height:844},isMobile:width<768,hasTouch:width<768,ignoreHTTPSErrors:true});
 const page=await context.newPage();page.setDefaultTimeout(12000);
 await page.route('**/*',r=>/google-analytics|googletagmanager|googlesyndication|doubleclick|kakao.*ad/.test(r.request().url())?r.abort():r.continue());
 return {context,page};
}
async function verify(row,width,target){
 const {context,page}=await newPage(width);let errors=[],networkFailures=[],requests=[],navigationCancellations=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)networkFailures.push({url:r.url(),status:r.status()})});
 page.on('requestfailed',r=>{if(r.url().startsWith(base)){const event={url:r.url(),error:r.failure()?.errorText};if(event.error==='net::ERR_ABORTED')navigationCancellations.push(event);else networkFailures.push(event)}});
 page.on('console',m=>{if(m.type()==='error'&&m.location().url.startsWith(base)&&!m.text().includes('net::ERR_ABORTED'))errors.push(m.text())});
 page.on('request',r=>requests.push(r.url()));
 try{
  const response=await page.goto(base+row.route,{waitUntil:'networkidle',timeout:60000});assert.equal(response.status(),200);
  assert(!requests.some(u=>u.includes('/practice-data/')),'initial eager dataset request');
  const opener=page.locator('[data-practice-open]'),dialog=page.locator('[data-practice-dialog]'),item=dialog.locator('[data-practice-item]');
  assert.equal(await opener.count(),1);assert((await opener.innerText()).includes(row.ids.length+'문항'));
  const clicked=Date.now();await opener.click();await item.waitFor({state:'visible'});const firstLoadMs=Date.now()-clicked;
  assert.equal(requests.filter(u=>u.includes('/practice-data/')).length,1,'one deferred dataset request');
  const geom=await dialog.evaluate(el=>{
   const d=el.getBoundingClientRect(),h=el.querySelector('#instant-practice-heading').getBoundingClientRect(),c=el.querySelector('[data-practice-close]').getBoundingClientRect();
   const s=el.querySelector('.practice-dialog-inner');return {fit:d.left>=0&&d.right<=innerWidth+1&&d.top>=0&&d.bottom<=innerHeight+1,overlap:h.right>c.left+1,dialogWidth:d.width,scrollHeight:s.scrollHeight,clientHeight:s.clientHeight,horizontalOverflow:s.scrollWidth>s.clientWidth+1,docOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,bodyOverflow:getComputedStyle(document.body).overflow};
  });
  assert(geom.fit&&!geom.overlap&&!geom.horizontalOverflow&&!geom.docOverflow,JSON.stringify(geom));
  // Wheel on the backdrop detects background motion even with native dialog inertness.
  const y=await page.evaluate(()=>scrollY);await page.mouse.move(2,420);await page.mouse.wheel(0,400);await page.waitForTimeout(200);
  const afterY=await page.evaluate(()=>scrollY);
  if(Math.abs(afterY-y)>2)report.findings.push({severity:'medium',kind:'background-scroll',url:base+row.route,width,beforeY:y,afterY,expected:'background scroll stays fixed while dialog is open',actual:'background page moved on backdrop wheel',screenshot:`${row.cert}-${width}-initial.png`});
  await dialog.screenshot({path:dir+'/'+row.cert+'-'+width+'-'+row.route.split('/').at(-2)+'-initial.png'});
  let correct=0,answered=0,images=0,cautions=0,longChoiceHeight=0,minChoiceHeight=Infinity,feedbackStyles;
  const max=target&&!process.env.QA_COMPLETE_LARGE_REPORT?row.ids.indexOf(target)+1:row.ids.length;assert(max>0,'target is assigned');
  for(let i=0;i<max;i++){
   const q=questions[row.cert].get(row.ids[i]);
   assert.equal(await item.locator('[data-practice-body]').innerText(),(i+1)+'. '+q.body,'canonical question body '+q.id);
   assert.equal(await item.locator('input[type=radio]').count(),4);
   const labels=await item.locator('.practice-choice').allTextContents();
   const hasImage=await item.locator('[data-practice-figure]').isVisible();
   for(let j=0;j<4;j++){
    const display=hasImage&&/^(수식|그림)[①②③④]$/.test(q.choices[j])?(q.choices[j].startsWith('수식')?'위 이미지에 제시된 수식':'위 이미지에 제시된 보기'):q.choices[j];
    assert.equal(labels[j].trim(),symbols[j]+display,'canonical option '+q.id);
   }
   const dims=await item.locator('.practice-choice').evaluateAll(es=>es.map(e=>({height:e.getBoundingClientRect().height,overflow:e.scrollWidth>e.clientWidth+1})));
   assert(dims.every(d=>!d.overflow),'choice wrapping');longChoiceHeight=Math.max(longChoiceHeight,...dims.map(d=>d.height));minChoiceHeight=Math.min(minChoiceHeight,...dims.map(d=>d.height));
   if(hasImage){
    images++;const img=item.locator('[data-practice-image]');await img.scrollIntoViewIfNeeded();await img.evaluate(e=>e.decode());
    assert(await img.evaluate(e=>e.naturalWidth>0&&e.getBoundingClientRect().width<=e.parentElement.getBoundingClientRect().width+1&&Math.abs(e.getBoundingClientRect().width/e.getBoundingClientRect().height-e.naturalWidth/e.naturalHeight)<.03),'image loaded and proportionate');
   }
   const caution=await item.locator('[data-practice-caution]').isVisible();if(caution)cautions++;
   const check=item.locator('[data-practice-check]');assert(await check.isDisabled());
   const selected=i%2===0?q.answer:q.answer%4+1;if(selected===q.answer)correct++;
   await item.locator('input[type=radio]').nth(selected-1).check();await check.click();answered++;
   assert.equal(await item.locator('.practice-choice.is-correct').count(),1);
   assert.equal(await item.locator('.practice-choice.is-incorrect').count(),selected===q.answer?0:1);
   if(i===1||max===1){feedbackStyles=await item.locator('.practice-choice').evaluateAll(es=>es.map(e=>({correct:e.classList.contains('is-correct'),incorrect:e.classList.contains('is-incorrect'),background:getComputedStyle(e).backgroundColor,border:getComputedStyle(e).borderColor,borderStyle:getComputedStyle(e).borderStyle})));}
   assert(await item.locator('input[type=radio]').nth(0).isDisabled(),'graded choices locked');
   const feedback=await item.locator('[data-practice-result]').innerText();assert(feedback.includes(caution?'수록 답안':selected===q.answer?'정답':'오답'));
   assert((await item.locator('[data-practice-answer]').innerText()).includes(symbols[q.answer-1]),'source answer number');
   const exp=await item.locator('[data-practice-explanation]').innerText();assert(row.route.endsWith('/accident-prevention-principles/')?!exp.includes('아직 없습니다'):exp.includes('검증된 문항별 해설이 아직 없습니다'));
   if(q.id===target||i===0)await dialog.screenshot({path:dir+'/'+row.cert+'-'+width+'-'+q.id+'-graded.png'});
   await item.locator('[data-practice-next]').click();
  }
  const completed=max===row.ids.length;
  if(completed){
   assert(await dialog.locator('[data-practice-complete]').isVisible());assert.equal(await dialog.locator('[data-practice-score]').innerText(),row.ids.length+'문제 중 '+correct+'문제 수록 답안과 일치');
   await dialog.screenshot({path:dir+'/'+row.cert+'-'+width+'-'+row.route.split('/').at(-2)+'-complete.png'});
   await dialog.locator('[data-practice-restart]').click();assert((await item.locator('[data-practice-body]').innerText()).startsWith('1. '));assert(await item.locator('[data-practice-check]').isDisabled());assert.equal(await item.locator('input:checked').count(),0);
  }
  await page.keyboard.press('Escape');assert(!(await dialog.isVisible()));assert(await opener.evaluate(e=>e===document.activeElement));
  await opener.click();await item.waitFor({state:'visible'});assert.equal(await item.locator('[data-practice-body]').innerText(),'1. '+questions[row.cert].get(row.ids[0]).body);assert(await item.locator('[data-practice-check]').isDisabled());
  await dialog.locator('[data-practice-close]').click();assert(!(await dialog.isVisible()));
  await opener.click();await item.waitFor({state:'visible'});await page.mouse.click(2,420);assert(!(await dialog.isVisible()),'backdrop close');
  assert.equal(requests.filter(u=>u.includes('/practice-data/')).length,1,'cached reopen no repeated dataset');
  const old=page.locator('[data-question-role="primary"] [data-open]').first();
  const oldId=await old.getAttribute('aria-controls');assert(oldId,'original popup aria-controls');
  await old.click();const oldDialog=page.locator('[id="'+oldId+'"]');await oldDialog.waitFor({state:'visible'});await oldDialog.locator('[data-reveal]').waitFor({state:'visible'});await page.keyboard.press('Escape');
  const link=page.locator('article a[href^="/'+row.cert+'/written/"]').first();if(await link.count()){const dest=await link.getAttribute('href');await link.click();assert.equal(new URL(page.url()).pathname,dest);await page.goBack({waitUntil:'domcontentloaded'})}
  assert.equal(errors.length,0,JSON.stringify(errors));assert.equal(networkFailures.length,0,JSON.stringify(networkFailures));
  const dom=await page.evaluate(()=>document.getElementsByTagName('*').length);
  if(minChoiceHeight<44)report.findings.push({severity:'medium',kind:'choice-touch-area',url:base+row.route,width,minHeight:minChoiceHeight,expected:'at least 44px clickable choice row',actual:'dynamic choice row has no scoped padding/border styles'});
  if(feedbackStyles?.filter(s=>s.correct||s.incorrect).some(s=>s.background==='rgba(0, 0, 0, 0)'&&s.borderStyle==='none'))report.findings.push({severity:'medium',kind:'choice-color-feedback',url:base+row.route,width,feedbackStyles,expected:'correct/incorrect rows display colored backgrounds and borders',actual:'classes are added but Astro scoped selectors do not match dynamically created labels'});
  report.samples.push({url:base+row.route,width,answered,total:row.ids.length,completed,correct,images,cautions,firstLoadMs,longChoiceHeight,minChoiceHeight,feedbackStyles,domNodes:dom,geometry:geom,navigationCancellations,result:'PASS with separately recorded UI findings'});
  console.log('Browser PASS',width,row.route,answered,'/',row.ids.length);
 }catch(e){const slug=row.route.split('/').at(-2);await page.screenshot({path:dir+'/failure-'+width+'-'+slug+'.png'}).catch(()=>{});report.errors.push({url:base+row.route,width,target,error:String(e),stack:e.stack,errors,networkFailures});console.error('Browser FAIL',width,row.route,String(e))}
 finally{await context.close()}
}
async function faults(){
 const {context,page}=await newPage(390);const row=get('computer-classification');
 try{
  await page.route('**/practice-data/computer-literacy.json',r=>r.fulfill({status:503,body:'injected outage'}));
  await page.goto(base+row.route,{waitUntil:'networkidle',timeout:60000});await page.locator('[data-practice-open]').click();
  await page.getByText('문항을 불러오지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요.',{exact:true}).waitFor();
  await page.screenshot({path:dir+'/injected-503.png'});await page.keyboard.press('Escape');await page.unroute('**/practice-data/computer-literacy.json');
  const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:400,downloadThroughput:50*1024,uploadThroughput:20*1024});
  const t=Date.now();await page.locator('[data-practice-open]').click();await page.getByText('문항을 불러오는 중입니다.',{exact:true}).waitFor();
  await page.locator('[data-practice-item]').waitFor({state:'visible',timeout:60000});const ms=Date.now()-t;
  await page.screenshot({path:dir+'/slow-network-recovery.png'});report.faultInjection.push({kind:'503 then close/reopen retry',result:'PASS'},{kind:'400ms latency / 50KiB per second',loadMs:ms,result:'PASS'});
 }catch(e){report.errors.push({kind:'fault-injection',error:String(e)})}finally{await context.close()}
}
(async()=>{
 const proxy=process.env.QA_PROXY;browser=await chromium.launch({headless:true,...(process.env.QA_CHROMIUM_EXECUTABLE?{executablePath:process.env.QA_CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'],...(proxy?{proxy:{server:proxy}}:{})});
 const jobs=[...reps.flatMap(row=>[320,390,768,1440].map(width=>({row,width}))),...special.flatMap(([slug,id])=>[320,1440].map(width=>({row:get(slug),width,target:id})))].filter(j=>!previous||retryKeys.has(base+j.row.route+'|'+j.width));
 let jobIndex=0;
 try{await Promise.all(Array.from({length:Math.min(Number(process.env.QA_JOBS||1),jobs.length)},async()=>{while(jobIndex<jobs.length){const j=jobs[jobIndex++];await verify(j.row,j.width,j.target)}}));
 if(!previous||previous.errors.some(e=>e.kind==='fault-injection'))await faults();}finally{await browser.close();report.finishedAt=new Date().toISOString();report.overall=report.errors.length||report.findings.length?'PARTIAL PASS':'PASS';fs.writeFileSync(dir+'/browser-report.json',JSON.stringify(report,null,2))}
 console.log(JSON.stringify({samples:report.samples.length,answered:report.samples.reduce((s,r)=>s+r.answered,0),findings:report.findings,errors:report.errors},null,2));
 assert.equal(report.errors.length,0,'browser functional errors');
 assert.equal(report.findings.length,0,'browser UI findings require correction; see browser-report.json');
})().catch(e=>{console.error(e);process.exitCode=1});
