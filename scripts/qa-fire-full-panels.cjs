const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const rows=[
 ['FSM2-048','receiver-circuit-continuity-test','receiver-continuity-full-panel-v2.webp',3,'FSM2-048'],
 ['FSM2-049','receiver-backup-power-test','receiver-backup-full-panel-v2.webp',3,'FSM2-049'],
 ['FSM2-034','pump-control-panels-states','pump-control-full-panel-v2.webp',2,'FSM2-034'],
 ['FSM2-077','pump-manual-auto-reading','pump-control-full-panel-v2.webp',3,'FSM2-034'],
 ['FSM2-075','receiver-operation-auto-reset','receiver-operation-full-panel-v2.webp',3,'FSM2-047'],
 ['FSM2-076','detector-transmitter-signal-reading','receiver-transmitter-full-panel-v2.webp',3,'FSM2-047'],
 ['FSM2-078','pump-test-piping-valves','pump-test-system-full-v2.webp',3,'FSM2-035'],
 ['FSM2-079','preaction-panel-state-reading','preaction-full-panel-v2.webp',3,'FSM2-040'],
];
const output=process.env.QA_OUTPUT_DIR||'qa-results/fire-full-panels';
fs.mkdirSync(output,{recursive:true});
const report={result:'RUNNING',cases:[],errors:[],limitations:['Chromium emulation; physical devices and Safari not tested']};
(async()=>{
 let server;
 let base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
 if(process.env.QA_SERVE_DIST==='1'){
  server=http.createServer((req,res)=>{
   const url=new URL(req.url,'http://localhost');let file=path.resolve('dist','.'+decodeURIComponent(url.pathname));
   if(!file.startsWith(path.resolve('dist')+path.sep)){res.writeHead(403).end();return;}
   if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
   if(!fs.existsSync(file)){res.writeHead(404).end();return;}
   const type={'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.svg':'image/svg+xml','.json':'application/json'}[path.extname(file)]||'application/octet-stream';
   res.writeHead(200,{'Content-Type':type});fs.createReadStream(file).pipe(res);
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
 }
 const options={headless:true,args:JSON.parse(process.env.QA_CHROMIUM_ARGS||'["--no-sandbox","--disable-dev-shm-usage"]')};
 if(process.env.QA_CHROMIUM_EXECUTABLE)options.executablePath=process.env.QA_CHROMIUM_EXECUTABLE;
 const browser=await chromium.launch(options);
 try{
  for(const width of [320,390,768,1440]){
   const context=await browser.newContext({viewport:{width,height:900}});
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));
   await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
   for(const [id,slug,file,steps,pool]of rows){
    const response=await page.goto(base+'/fire-safety-manager-level2/written/fire-safety-practice/'+slug+'/');
    assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('h1').count(),1);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' horizontal overflow '+width);
    const figure=page.locator('.fire-panel-overview figure');
    const overview=figure.locator('img');await overview.scrollIntoViewIfNeeded();await overview.evaluate(e=>e.decode());
    const src='/images/fire-safety-manager-level2/'+file;
    assert.equal(await overview.getAttribute('src'),src);
    assert.equal(await overview.evaluate(e=>e.naturalWidth),1536);
    const type=await figure.evaluate(e=>{
     const title=getComputedStyle(e.querySelector('figcaption strong'));
     const notes=e.querySelectorAll('.fire-panel-note');
     return {title:title.fontSize,count:notes.length};
    });
    assert.deepEqual(type,{title:width<768?'16px':'17px',count:0},id+' caption hierarchy');
    const crop=await figure.locator('.fire-panel-artwork').evaluate(e=>{
     const frame=e.getBoundingClientRect(),img=e.querySelector('img').getBoundingClientRect();
     return {frame:frame.height,source:img.height,top:frame.top-img.top,width:frame.width};
    });
    assert(crop.top>0&&crop.frame+crop.top<crop.source,'decorative title and footer are outside the display window');
    assert.equal(await page.locator('.fire-panel-step').count(),steps);
    const stepElements=page.locator('.fire-panel-step');const geometry=[];
    for(let i=0;i<steps;i++){
     const step=stepElements.nth(i);
     await step.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
     assert(await step.locator('.fire-panel-detail').isHidden(),'detail image replaced by text');
     assert(await step.locator('h3').isVisible());assert(await step.locator('p').isVisible());
     const g=await step.evaluate(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return {width:b.width,height:b.height,top:b.top,bottom:b.bottom,border:s.borderTopWidth};});
     assert.equal(g.border,'0px','no oversized image card');
     if(i){const previous=await stepElements.nth(i-1).boundingBox();const current=await step.boundingBox();assert(current.y>=previous.y+previous.height,'numbered explanations stack vertically');}
     geometry.push(g);
    }
    await page.locator('.fire-panel-steps').screenshot({path:`${output}/${id}-text-steps-${width}.png`});
    await figure.screenshot({path:`${output}/${id}-overview-${width}.png`});
    if(id==='FSM2-076'&&(width===390||width===1440)){
     await figure.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-90));
     await page.screenshot({path:`${output}/${id}-hierarchy-${width}.png`});
    }
    const button=figure.locator('.fire-bulk-zoom');await button.evaluate(e=>e.scrollIntoView({block:'center'}));
    const before=await page.evaluate(()=>({y:scrollY,style:document.body.getAttribute('style')||''}));
    await button.click();const dialog=page.locator('#fire-bulk-image-dialog');await dialog.locator('img').evaluate(e=>e.decode());
    assert(await dialog.evaluate(e=>e.open));assert.equal(await dialog.locator('img').getAttribute('src'),src);
    assert(await dialog.locator('img').evaluate(e=>e.getBoundingClientRect().width)>=1280,'readable expanded panel');
    assert(await dialog.locator('.fire-bulk-zoom-scroll').evaluate(e=>e.scrollWidth>e.clientWidth),'expanded panel is scrollable');
    await dialog.screenshot({path:`${output}/${id}-dialog-${width}.png`});
    await page.keyboard.press('Escape');await page.waitForFunction(b=>!document.getElementById('fire-bulk-image-dialog').open&&Math.abs(scrollY-b.y)<=1,before);
    assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style);
    assert(await button.evaluate(e=>e===document.activeElement));
    const entry=page.locator('[data-fire-practice-entry]');const link=entry.locator('a').first();
    assert((await link.getAttribute('href')).includes('chapter='+pool),'original question pool retained');
    if(width===390){
     const popupPromise=page.waitForEvent('popup');await link.click();const popup=await popupPromise;
     popup.on('pageerror',e=>report.errors.push(String(e)));await popup.waitForLoadState('domcontentloaded');
     await popup.waitForFunction(()=>document.querySelector('[data-start]')?.disabled===false);
     await popup.locator('[data-start]').click();assert(await popup.locator('[data-session]').isVisible());await popup.close();
    }
    await page.evaluate(()=>{scrollTo(0,0);return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
    if(width===390||width===1440)await page.screenshot({path:`${output}/${id}-page-${width}.png`,fullPage:true});
    report.cases.push({id,width,steps,geometry,typography:type,crop,asset:src,overflow:false,zoomAndRestore:'PASS',practicePool:pool});
   }
   await context.close();
  }
  assert.deepEqual(report.errors,[]);report.result='PASS';
 }catch(e){report.result='FAIL';report.errors.push(String(e));throw e;}
 finally{fs.writeFileSync(output+'/browser-results.json',JSON.stringify(report,null,2));await browser.close();if(server)server.close();}
 console.log('[Fire full panels browser] PASS',report.cases.length,'chapter/viewport cases');
})().catch(e=>{console.error(e);process.exitCode=1});
