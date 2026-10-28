const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const audit='docs/audits/2026-10-28-fire-practice-phase2';
const rows=JSON.parse(fs.readFileSync(audit+'/figure-briefs.json')).figures;
const output=process.env.QA_OUTPUT_DIR||'qa-results/fire-practice-phase2';fs.mkdirSync(output,{recursive:true});
const report={result:'RUNNING',cases:[],svg:[],errors:[],limitations:['Chromium emulation; physical devices and Safari not tested']};
(async()=>{
 const server=http.createServer((req,res)=>{
  let f=path.resolve('dist','.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(!f.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=process.env.QA_BASE_URL||'http://127.0.0.1:'+server.address().port;
 const proxy=process.env.QA_BASE_URL&&process.env.HTTPS_PROXY?new URL(process.env.HTTPS_PROXY):null;
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM_EXECUTABLE,args:JSON.parse(process.env.QA_CHROMIUM_ARGS||'["--no-sandbox","--disable-dev-shm-usage"]'),proxy:proxy?{server:proxy.protocol+'//'+proxy.host,username:decodeURIComponent(proxy.username),password:decodeURIComponent(proxy.password)}:undefined});
 try{
  for(const width of [320,390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:900},ignoreHTTPSErrors:!!proxy});
   page.on('pageerror',e=>report.errors.push(String(e)));
   await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
   for(const r of rows){
    const route='/fire-safety-manager-level2/written/fire-safety-practice/'+r.slug+'/';
    assert.equal((await page.goto(base+route)).status(),200);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('h1').count(),1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal page overflow');
    const figure=page.locator('.fire-practice-lesson figure');assert.equal(await figure.count(),1);
    const img=figure.locator('img');await img.evaluate(e=>e.decode());
    assert.equal(await img.getAttribute('src'),'/images/fire-safety-manager-level2/'+r.asset);assert.equal(await img.evaluate(e=>e.naturalWidth),640);assert((await img.getAttribute('alt')).length>20);
    assert.equal(await page.locator('.fire-panel-step').count(),3);
    const typography=await figure.evaluate(e=>({title:getComputedStyle(e.querySelector('strong')).fontSize,note:getComputedStyle(e.querySelector('.fire-panel-note')).fontSize,weight:getComputedStyle(e.querySelector('.fire-panel-note')).fontWeight,notes:e.querySelectorAll('.fire-panel-note').length}));
    assert.deepEqual(typography,{title:width<768?'16px':'17px',note:'13px',weight:'400',notes:1});
    assert.equal((await figure.locator('.fire-panel-note').textContent()).trim(),'※ 학습을 위해 재구성된 이미지');
    const button=figure.locator('button');await button.scrollIntoViewIfNeeded();
    const before=await page.evaluate(()=>({y:scrollY,style:document.body.getAttribute('style')||''}));await button.click();
    const dialog=page.locator('#fire-bulk-image-dialog');assert(await dialog.evaluate(e=>e.open));await dialog.locator('img').evaluate(e=>e.decode());
    assert.equal(await dialog.locator('img').getAttribute('src'),'/images/fire-safety-manager-level2/'+r.asset);
    assert.equal(await dialog.locator('img').evaluate(e=>Math.round(e.getBoundingClientRect().width)),1000);assert(await dialog.locator('.fire-bulk-zoom-scroll').evaluate(e=>e.scrollWidth>e.clientWidth));
    if(width===390)await dialog.screenshot({path:`${output}/${r.id}-zoom-390.png`});
    await page.keyboard.press('Escape');await page.waitForFunction(y=>!document.querySelector('dialog[open]')&&Math.abs(scrollY-y)<=1,before.y);
    assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style);assert(await button.evaluate(e=>document.activeElement===e));
    const practice=page.locator('[data-fire-practice-entry] a').first();assert((await practice.getAttribute('href')).includes('chapter='+r.id));
    if(width===390){const popupPromise=page.waitForEvent('popup');await practice.click();const popup=await popupPromise;await popup.waitForLoadState('domcontentloaded');await popup.waitForFunction(()=>document.querySelector('[data-start]')?.disabled===false);await popup.locator('[data-start]').click();assert(await popup.locator('[data-session]').isVisible());await popup.close();}
    if(width===390||width===1440){await figure.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-90));await page.screenshot({path:`${output}/${r.id}-figure-${width}.png`});}
    report.cases.push({id:r.id,width,route,asset:r.asset,typography,zoom:'PASS',practice:'original pool retained'});
   }await page.close();
  }
  const page=await browser.newPage({viewport:{width:700,height:700},ignoreHTTPSErrors:!!proxy});
  for(const r of rows){
   assert.equal((await page.goto(base+'/images/fire-safety-manager-level2/'+r.asset)).status(),200);await page.evaluate(()=>document.fonts.ready);
   const labels=await page.locator('svg text').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return {text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height,size:parseFloat(getComputedStyle(e).fontSize)}}));
   assert(labels.length>=7);assert(labels.every(b=>b.x>=-1&&b.y>=0&&b.x+b.width<=641),'SVG labels within canvas');
   assert(!labels.some(b=>b.text.includes('학습')||b.text===r.caption),'no repeated heading or notice in artwork');
   await page.locator('svg').screenshot({path:`${output}/${r.id}-artwork.png`});report.svg.push({id:r.id,labels});
  }await page.close();
  assert.deepEqual(report.errors,[]);report.result='PASS';
 }catch(e){report.result='FAIL';report.errors.push(String(e));throw e;}
 finally{fs.writeFileSync(output+'/browser-results.json',JSON.stringify(report,null,2)+'\n');await browser.close();server.close();}
 console.log('[Fire practice phase2 browser] PASS',report.cases.length,'chapter/viewport cases;',report.svg.length,'SVG inspections');
})().catch(e=>{console.error(e);process.exitCode=1});
