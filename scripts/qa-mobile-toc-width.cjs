const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const out=process.env.QA_OUTPUT_DIR||'/tmp/mobile-toc-width-qa';fs.mkdirSync(out,{recursive:true});
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-26-mobile-learning-ux/baseline.json'));
const routes=Object.keys(baseline.html).filter(f=>/\/(power-formula|character-codes|goal-seek|concentration-conversion|draft-flue-gas|management-target-grades|sprinkler-types-operation|cell-entry-edit-navigation)\/index.html$/.test(f)).map(f=>f.slice(4,-10));
assert.equal(routes.length,8);
const report={result:'RUNNING',cases:[],limitations:['Chromium responsive emulation; physical devices and Safari not tested']};
(async()=>{
 const server=http.createServer((req,res)=>{
  let file=path.resolve('dist','.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=process.env.QA_BASE_URL||'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM_EXECUTABLE,args:JSON.parse(process.env.QA_CHROMIUM_ARGS||'["--no-sandbox"]')});
 try{
  for(const width of [320,390,767,768,1440]){
   const page=await browser.newPage({viewport:{width,height:844}});
   await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
   for(const route of routes){
    assert.equal((await page.goto(base+route)).status(),200);await page.evaluate(()=>document.fonts.ready);
    await page.locator('.gnb-menu>summary').click();
    const menu=page.locator('.gnb-chapter-dropdown');
    const result=await menu.evaluate(e=>{
     const rect=e.getBoundingClientRect(),current=e.querySelector('[aria-current]');
     const items=[...e.querySelectorAll('a')].map(a=>{const s=getComputedStyle(a);const range=document.createRange();range.selectNodeContents(a);return {title:a.textContent,height:a.getBoundingClientRect().height,text:range.getBoundingClientRect().width,available:a.clientWidth-parseFloat(s.paddingLeft)-parseFloat(s.paddingRight),whiteSpace:s.whiteSpace,ellipsis:s.textOverflow,overflow:s.overflowX};});
     return {width:rect.width,left:rect.left,right:rect.right,bottom:rect.bottom,scroll:e.scrollWidth,client:e.clientWidth,current:current.getAttribute('href'),items};
    });
    assert(result.left>=23&&result.right<=width-23,'panel stays within shared GNB edges');
    assert(result.scroll<=result.client+1,'no horizontal menu overflow');assert.equal(result.current,route);
    assert(result.items.every(a=>a.height>=44),'touch rows retain at least 44px');
    if(width<768){
     assert(result.items.every(a=>a.whiteSpace==='nowrap'&&a.ellipsis==='ellipsis'&&a.overflow==='hidden'),'one-line ellipsis');
     const widest=Math.max(...result.items.map(a=>a.text));
     assert(Math.abs(result.width-Math.min(widest+42,width-48))<2,'content-sized menu with viewport cap');
    }else assert.equal(result.width,Math.min(360,width-48),'desktop/tablet width retained');
    if(width<1024){const bar=await page.locator('.chapter-mobile-nav').boundingBox();assert(result.bottom<=bar.y-8,'footer clearance');}
    const before=await menu.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
    assert.deepEqual(before,await page.locator('.chapter-side .side-nav a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))));
    if(width===390&&route.includes('power-formula'))await page.screenshot({path:out+'/power-formula-390.png'});
    if(width===320&&route.includes('character-codes'))await page.screenshot({path:out+'/long-title-320.png'});
    const last=menu.locator('a').last();await last.scrollIntoViewIfNeeded();const href=await last.getAttribute('href');await last.click();assert.equal(new URL(page.url()).pathname,href);
    report.cases.push({route,viewport:width,...result});
   }
   await page.goto(base+'/computer-literacy/written/');await page.locator('.gnb-menu>summary').click();
   assert.equal(await page.locator('.gnb-chapter-dropdown').count(),0);assert.equal(await page.locator('.gnb-dropdown').evaluate(e=>getComputedStyle(e).minWidth),'260px');
   await page.close();
  }
  report.result='PASS';
 }catch(e){report.result='FAIL';report.error=String(e);throw e;}
 finally{fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2)+'\n');await browser.close();server.close();}
 console.log('[Mobile TOC width] PASS',report.cases.length,'chapter/viewport cases');
})().catch(e=>{console.error(e);process.exitCode=1});
