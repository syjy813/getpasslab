const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const audit='docs/audits/2026-10-28-fire-original-plan',ledger=JSON.parse(fs.readFileSync(audit+'/completion-ledger.json'));
const briefs=JSON.parse(fs.readFileSync(audit+'/figure-briefs.json')).figures;
const output=process.env.QA_OUTPUT_DIR||'qa-results/fire-original-plan';fs.mkdirSync(output,{recursive:true});
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const value=(s,k)=>s.match(new RegExp('^'+k+':\\s*["\\\']?([^"\\\'\\n]+)','m'))?.[1];
const chapters=walk('src/content/chapters/fire-safety-manager-level2').filter(f=>f.endsWith('.md')).map(f=>{const s=fs.readFileSync(f,'utf8');return {id:value(s,'chapter_id'),slug:value(s,'slug'),order:Number(value(s,'order')),subject:Number(value(s,'subject_id')),title:value(s,'title'),pool:value(s,'practiceChapter'),s};});
const specs=ledger.items.map(r=>{const c=chapters.find(x=>x.id===r.id);const figures=[...c.s.matchAll(/<figure\b[\s\S]*?<\/figure>/g)].map(m=>({src:m[0].match(/<img[^>]*src="([^"]+)"/)[1],width:Number(m[0].match(/<img[^>]*width="(\d+)"/)[1])}));return {...r,...c,figures,poolId:c.pool?chapters.find(x=>x.slug===c.pool).id:c.id};});
const report={result:'RUNNING',cases:[],svg:[],errors:[],limitations:['Chromium emulation; physical devices and Safari not tested']};
(async()=>{
 const server=http.createServer((req,res)=>{let f=path.resolve('dist','.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!f.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res);});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=process.env.QA_BASE_URL||'http://127.0.0.1:'+server.address().port;
 const proxy=process.env.QA_BASE_URL&&process.env.HTTPS_PROXY?new URL(process.env.HTTPS_PROXY):null;
 const browser=await chromium.launch({headless:true,executablePath:process.env.QA_CHROMIUM_EXECUTABLE,args:JSON.parse(process.env.QA_CHROMIUM_ARGS||'["--no-sandbox","--disable-dev-shm-usage"]'),proxy:proxy?{server:proxy.protocol+'//'+proxy.host,username:decodeURIComponent(proxy.username),password:decodeURIComponent(proxy.password)}:undefined});
 try{
  for(const width of [320,390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:900},ignoreHTTPSErrors:!!proxy});page.on('pageerror',e=>report.errors.push(String(e)));
   await page.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
   for(const r of specs){
    assert.equal((await page.goto(base+r.route)).status(),200,r.id);await page.evaluate(()=>document.fonts.ready);assert.equal(await page.locator('h1').textContent(),r.title);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),r.id+' page overflow');assert(!(await page.locator('article').innerText()).includes('**'),r.id+' rendered emphasis');
    const figs=page.locator('article figure');assert.equal(await figs.count(),r.figures.length,r.id+' figures');let zoomCount=0;
    for(let i=0;i<r.figures.length;i++){
     const fig=figs.nth(i),img=fig.locator('img').first();await img.evaluate(e=>e.decode());assert.equal(await img.getAttribute('src'),r.figures[i].src);assert.equal(await img.evaluate(e=>e.naturalWidth),r.figures[i].width);assert(await img.getAttribute('alt'));
     if(r.work==='new'||r.work==='revise'){
      const sizes=await fig.evaluate(e=>({title:getComputedStyle(e.querySelector('strong')).fontSize,notes:e.querySelectorAll('.fire-panel-note').length}));assert.deepEqual(sizes,{title:width<768?'16px':'17px',notes:0},r.id+' typography');
      if(briefs.some(b=>'/images/fire-safety-manager-level2/'+b.asset===r.figures[i].src))assert(await img.evaluate(e=>e.getBoundingClientRect().width)*21/380>=14,r.id+' actual label size');
     }
     const button=fig.locator('button');await button.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(r)));const before=await page.evaluate(()=>({y:scrollY,style:document.body.getAttribute('style')||''}));await button.click();
     const dialog=page.locator('dialog[open]');assert.equal(await dialog.count(),1);await dialog.locator('img').evaluate(e=>e.decode());assert.equal(await dialog.locator('img').getAttribute('src'),r.figures[i].src);if(width<768)assert(await dialog.locator('.fire-bulk-zoom-scroll,.zoom-scroll').evaluate(e=>e.scrollWidth>e.clientWidth||e.scrollHeight>e.clientHeight));
     await page.keyboard.press('Escape');await page.waitForFunction(y=>!document.querySelector('dialog[open]')&&Math.abs(scrollY-y)<=1,before.y);assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style);assert(await button.evaluate(e=>document.activeElement===e));zoomCount++;
     if(width===390&&(r.work==='new'||r.work==='revise')){await fig.scrollIntoViewIfNeeded();await fig.screenshot({path:output+'/'+r.id+'-figure-'+i+'-390.png'});}
    }
    const ordered=chapters.filter(c=>c.subject===r.subject).sort((a,b)=>a.order-b.order),index=ordered.findIndex(c=>c.id===r.id),prefix='/fire-safety-manager-level2/written/'+(r.subject===1?'fire-safety-theory':'fire-safety-practice')+'/';
    for(const [rel,c]of [['prev',ordered[index-1]],['next',ordered[index+1]]]){const a=page.locator('.chapter-mobile-link[rel="'+rel+'"]');assert.equal(await a.count(),c?1:0);if(c)assert.equal(await a.getAttribute('href'),prefix+c.slug+'/');}
    const practice=page.locator('[data-fire-practice-entry] a').first();assert((await practice.getAttribute('href')).includes('chapter='+r.poolId),r.id+' original question pool');
    if(r.work==='new'){assert((await practice.textContent()).includes('연결 챕터 문제 풀기'));if(width===390){const pop=page.waitForEvent('popup');await practice.click();const p=await pop;await p.waitForLoadState('domcontentloaded');await p.waitForFunction(()=>document.querySelector('[data-start]')?.disabled===false);await p.locator('[data-start]').click();assert(await p.locator('[data-session]').isVisible());await p.close();}}
    report.cases.push({number:r.number,id:r.id,width,route:r.route,figures:r.figures.length,zoomCount,practicePool:r.poolId,navigation:'PASS',overflow:false});
   }await page.close();
  }
  const page=await browser.newPage({viewport:{width:420,height:760},ignoreHTTPSErrors:!!proxy});
  for(const r of briefs){assert.equal((await page.goto(base+'/images/fire-safety-manager-level2/'+r.asset)).status(),200);await page.evaluate(()=>document.fonts.ready);const labels=await page.locator('svg text').evaluateAll(es=>es.map(e=>{const b=e.getBBox();return{text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height,size:parseFloat(getComputedStyle(e).fontSize)}}));assert(labels.length>=6);assert(labels.every(b=>b.x>=0&&b.y>=0&&b.x+b.width<=380&&b.y+b.height<=r.height),'SVG bounds '+r.id);assert(labels.every(b=>b.size>=21));assert(!labels.some(b=>b.text===r.caption||b.text.includes('学習')||b.text.includes('학습')));await page.locator('svg').screenshot({path:output+'/'+r.id+'-artwork.png'});report.svg.push({id:r.id,labels});}
  await page.close();assert.deepEqual(report.errors,[]);assert.equal(report.cases.length,88);report.result='PASS';
 }catch(e){report.result='FAIL';report.errors.push(String(e));throw e;}
 finally{fs.writeFileSync(output+'/browser-results.json',JSON.stringify(report,null,2)+'\n');await browser.close();server.close();}
 console.log('[Fire original plan browser] PASS',report.cases.length,'chapter/viewport cases;',report.cases.reduce((s,r)=>s+r.zoomCount,0),'zoom checks;',report.svg.length,'SVG inspections');
})().catch(e=>{console.error(e);process.exitCode=1});
