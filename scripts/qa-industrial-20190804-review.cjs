const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto'),{pathToFileURL}=require('node:url');
const audit='docs/audits/2026-10-06-industrial-20190804-full-review';
const review=JSON.parse(fs.readFileSync(audit+'/review.json'));
const questions=JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json')).filter(q=>q.id.startsWith('20190804_')).sort((a,b)=>a.number-b.number);
const registry=JSON.parse(fs.readFileSync('src/data/question-assets/industrial-safety.json'));
const base=(process.env.QA_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const out=path.resolve('qa-results/industrial-20190804-review');fs.mkdirSync(out,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const result={base,startedAt:new Date().toISOString(),exactHtmlMatches:0,viewports:[],errors:[],fixtureScope:'All 120 payloads use the existing real popup button/listener with temporary browser-only data attributes. Unassigned questions are not claimed as published chapter links.'};
const save=()=>fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(result,null,2)+'\n');
let browser;
(async()=>{
 for(const row of review.articles){const route=new URL(row.url).pathname,response=await fetch(base+route);assert.equal(response.status,200);assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(fs.readFileSync('dist'+route+'index.html')));result.exactHtmlMatches++}
 const payload=await fetch(base+review.questionPayload.path);assert.equal(payload.status,200);assert.equal(hash(Buffer.from(await payload.arrayBuffer())),review.questionPayload.sha256);
 const built=(await import(pathToFileURL(path.resolve('dist'+review.questionPayload.path)))).default;for(const q of questions)assert.deepEqual(built.find(row=>row.id===q.id),q);
 const images={};for(const row of registry.filter(r=>r.id.startsWith('20190804_'))){const file=fs.readdirSync('dist/_astro').find(f=>f.startsWith(row.id+'.')&&f.endsWith('.png'));assert(file);const url='/_astro/'+file,response=await fetch(base+url);assert.equal(response.status,200);assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(fs.readFileSync('dist'+url)));images[row.id]={url,width:row.width,height:row.height}}
 browser=await chromium.launch({executablePath:process.env.QA_BROWSER_EXECUTABLE});
 await Promise.all([320,390,1440].map(async width=>{
  const context=await browser.newContext({viewport:{width,height:844},isMobile:width<768,hasTouch:width<768});
  await context.route('**/*',r=>{const u=new URL(r.request().url());return u.origin===new URL(base).origin||u.hostname==='cdn.jsdelivr.net'?r.continue():r.abort()});
  const page=await context.newPage();page.on('pageerror',e=>result.errors.push(String(e)));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)result.errors.push(`${r.status()} ${r.url()}`)});
  const viewport={width,pages:[],publicPopups:[],fixturePopups:[]};result.viewports.push(viewport);
  for(const row of review.chapters){await page.goto(base+new URL(row.url).pathname,{waitUntil:'domcontentloaded'});assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),row.url);assert.deepEqual(await page.locator('main [data-open]').evaluateAll(es=>es.map(e=>e.dataset.open)),row.questions);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1));
   for(const id of row.questions.filter(id=>id.startsWith('20190804_'))){const q=questions.find(q=>q.id===id),d=page.locator('#deferred-question-dialog');await page.locator(`[data-open="${id}"]`).click();await d.locator('[data-reveal]').waitFor({state:'visible'});assert.equal(await d.locator('[data-question-body]').textContent(),q.body);await page.keyboard.press('Escape');viewport.publicPopups.push(id)}viewport.pages.push(row.slug);
  }
  await page.goto(base+'/industrial-safety/written/ergonomics/cutset-pathset/',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);
  await page.locator('[data-open="20190804_033"]').click();await page.locator('dialog[open] [data-reveal]').waitFor({state:'visible'});assert.equal(await page.locator('dialog[open] [data-question-body]').textContent(),questions.find(q=>q.number===33).body);await page.keyboard.press('Escape');viewport.publicPopups.push('20190804_033');
  await page.locator('[data-open="20190804_033"]').evaluate(el=>el.id='qa-source-question');
  for(const q of questions){const img=images[q.id];await page.locator('#qa-source-question').evaluate((el,{q,img})=>{el.dataset.open=q.id;for(const key of ['questionImageSrc','questionImageWidth','questionImageHeight'])delete el.dataset[key];if(img){el.dataset.questionImageSrc=img.url;el.dataset.questionImageWidth=String(img.width);el.dataset.questionImageHeight=String(img.height)}},{q,img});
   const d=page.locator('#deferred-question-dialog');await page.locator('#qa-source-question').click();await d.locator('[data-reveal]').waitFor({state:'visible'});assert.equal(await d.getAttribute('data-revealed'),'false');assert.equal(await d.locator('[data-question-body]').textContent(),q.body);
   const choices=q.choices.map((c,i)=>`${['①','②','③','④'][i]} ${img&&/^수식[①②③④]$/.test(c)?'위 이미지에 제시된 수식':c}`);assert.deepEqual(await d.locator('.q-choices li').evaluateAll(es=>es.map(e=>[...e.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim())),choices);
   const layout=await d.evaluate(el=>{const body=el.querySelector('[data-question-body]'),rect=body.getBoundingClientRect();return{width:el.clientWidth,scroll:el.scrollWidth,bodyLeft:rect.left,bodyRight:rect.right,whiteSpace:getComputedStyle(body).whiteSpace}});assert(layout.scroll<=layout.width+1);assert(layout.bodyLeft>=-1&&layout.bodyRight<=width+1);assert.equal(layout.whiteSpace,'pre-line');
   if(img){const el=d.locator('img.q-image');await el.waitFor({state:'visible'});await el.evaluate(i=>i.decode());const geometry=await el.evaluate(i=>({src:new URL(i.currentSrc).pathname,width:i.naturalWidth,height:i.naturalHeight,alt:i.alt,r:i.getBoundingClientRect().toJSON()}));assert.equal(geometry.src,img.url);assert.equal(geometry.width,img.width);assert.equal(geometry.height,img.height);assert(geometry.alt&&geometry.r.width>0&&geometry.r.right<=width+1&&geometry.r.left>=-1);assert(Math.abs(geometry.r.width/geometry.r.height-img.width/img.height)<0.02)}
   if([5,18,29,33,47,51,56,59,61,63,68,101,113].includes(q.number))await page.screenshot({path:path.join(out,`${width}-${q.id}.png`)});
   await d.locator('[data-reveal]').click();assert.equal(await d.getAttribute('data-revealed'),'true');assert.equal(await d.locator('.q-choices li').evaluateAll(es=>es.findIndex(e=>e.classList.contains('is-answer'))+1),q.answer);await d.locator('[data-close]').click();assert.equal(await d.isVisible(),false);
   await page.locator('#qa-source-question').click();await d.locator('[data-reveal]').waitFor({state:'visible'});assert.equal(await d.getAttribute('data-revealed'),'false');await page.keyboard.press('Escape');assert.equal(await d.isVisible(),false);viewport.fixturePopups.push({id:q.id,answer:q.answer,image:!!img,layout,passed:true});save();
  }
  await context.close();
 }));result.passed=!result.errors.length;result.finishedAt=new Date().toISOString();save();await browser.close();assert(result.passed);
})().catch(async e=>{result.passed=false;result.errors.push(String(e));save();if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1});
