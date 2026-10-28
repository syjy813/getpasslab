const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const rows=JSON.parse(fs.readFileSync('docs/audits/2026-10-28-fire-followup-chapters/figure-briefs.json')).figures;
const output=process.env.QA_OUTPUT_DIR||'qa-results/fire-followup-chapters';fs.mkdirSync(output,{recursive:true});
const chapters=fs.readdirSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice').map(f=>fs.readFileSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+f,'utf8')).map(s=>({slug:s.match(/^slug: "([^"]+)"/m)[1],order:Number(s.match(/^order: ([\d.]+)/m)[1])})).sort((a,b)=>a.order-b.order);
const prefix='/fire-safety-manager-level2/written/fire-safety-practice/';
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
   const page=await browser.newPage({viewport:{width,height:900},ignoreHTTPSErrors:!!proxy});page.on('pageerror',e=>report.errors.push(String(e)));
   await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
   for(const row of rows){
    assert.equal((await page.goto(base+prefix+row.slug+'/')).status(),200);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('h1').textContent(),row.title);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const fig=page.locator('article figure');assert.equal(await fig.count(),1);const img=fig.locator('img');await img.evaluate(e=>e.decode());
    assert.equal(await img.getAttribute('src'),'/images/fire-safety-manager-level2/'+row.asset);assert.equal(await img.evaluate(e=>e.naturalWidth),380);
    const typography=await fig.evaluate(e=>({caption:getComputedStyle(e.querySelector('strong')).fontSize,note:getComputedStyle(e.querySelector('.fire-panel-note')).fontSize,weight:getComputedStyle(e.querySelector('.fire-panel-note')).fontWeight,imgWidth:e.querySelector('img').getBoundingClientRect().width}));
    assert.equal(typography.caption,width<768?'16px':'17px');assert.equal(typography.note,'13px');assert.equal(typography.weight,'400');assert(typography.imgWidth*21/380>=14,'minimum diagram label at actual display width');
    assert.equal((await fig.locator('.fire-panel-note').textContent()).trim(),'※ 학습을 위해 재구성된 이미지');assert.equal(await page.locator('.fire-panel-step').count(),3);
    const index=chapters.findIndex(r=>r.slug===row.slug);for(const [rel,target]of [['prev',chapters[index-1]],['next',chapters[index+1]]])assert.equal(await page.locator('.chapter-mobile-link[rel="'+rel+'"]').getAttribute('href'),prefix+target.slug+'/');
    const button=fig.locator('button');await button.scrollIntoViewIfNeeded();const before=await page.evaluate(()=>({y:scrollY,style:document.body.getAttribute('style')||''}));await button.click();
    const dialog=page.locator('#fire-bulk-image-dialog');assert(await dialog.evaluate(e=>e.open));await dialog.locator('img').evaluate(e=>e.decode());assert.equal(await dialog.locator('img').evaluate(e=>e.getBoundingClientRect().width),760);
    assert(await dialog.locator('.fire-bulk-zoom-scroll').evaluate(e=>e.scrollWidth>e.clientWidth));await page.keyboard.press('Escape');await page.waitForFunction(y=>!document.querySelector('dialog[open]')&&Math.abs(scrollY-y)<=1,before.y);
    assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style);assert(await button.evaluate(e=>document.activeElement===e));
    const practice=page.locator('[data-fire-practice-entry] a').first();assert((await practice.textContent()).includes('연결 챕터 문제 풀기'));assert((await practice.getAttribute('href')).includes('chapter='+row.parentId));
    if(width===390){const pop=page.waitForEvent('popup');await practice.click();const p=await pop;await p.waitForLoadState('domcontentloaded');await p.waitForFunction(()=>document.querySelector('[data-start]')?.disabled===false);await p.locator('[data-start]').click();assert(await p.locator('[data-session]').isVisible());await p.close();}
    if(width===320||width===390||width===1440){await fig.scrollIntoViewIfNeeded();await fig.screenshot({path:output+'/'+row.id+'-figure-'+width+'.png'});await page.locator('.fire-panel-steps').screenshot({path:output+'/'+row.id+'-steps-'+width+'.png'});}
    report.cases.push({id:row.id,width,typography,zoom:'PASS',navigation:'PASS',practice:row.parentId});
   }await page.close();
  }
  const page=await browser.newPage({viewport:{width:420,height:720},ignoreHTTPSErrors:!!proxy});
  for(const row of rows){
   assert.equal((await page.goto(base+'/images/fire-safety-manager-level2/'+row.asset)).status(),200);await page.evaluate(()=>document.fonts.ready);
   const labels=await page.locator('svg text').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return{text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height,size:parseFloat(getComputedStyle(e).fontSize)}}));
   assert(labels.length>=6);assert(labels.every(b=>b.x>=0&&b.y>=0&&b.x+b.width<=380&&b.y+b.height<=row.height),'all labels within canvas');assert(labels.every(b=>b.size>=21));
   assert(!labels.some(b=>b.text===row.caption||b.text.includes('학습')),'caption and notice only outside the SVG');await page.locator('svg').screenshot({path:output+'/'+row.id+'-artwork.png'});report.svg.push({id:row.id,labels});
  }await page.close();assert.deepEqual(report.errors,[]);report.result='PASS';
 }catch(e){report.result='FAIL';report.errors.push(String(e));throw e;}
 finally{fs.writeFileSync(output+'/browser-results.json',JSON.stringify(report,null,2)+'\n');await browser.close();server.close();}
 console.log('[Fire followup browser] PASS',report.cases.length,'chapter/viewport cases;',report.svg.length,'SVG inspections');
})().catch(e=>{console.error(e);process.exitCode=1});
