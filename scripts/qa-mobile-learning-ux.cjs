const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const out=process.env.QA_OUTPUT_DIR||'qa-results/mobile-learning-ux';
fs.mkdirSync(out,{recursive:true});
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-26-mobile-learning-ux/baseline.json'));
const chapterRoutes=Object.entries(baseline.html).filter(([,v])=>v.chapter).map(([f])=>f.slice(4,-10));
const slugs=['goal-seek','character-codes','cell-entry-edit-navigation','concentration-conversion','draft-flue-gas','management-target-grades','sprinkler-types-operation'];
const routes=slugs.map(s=>chapterRoutes.find(r=>r.endsWith('/'+s+'/')));
assert(routes.every(Boolean));
const report={base,commit:process.env.QA_COMMIT||null,device:'Chromium responsive emulation; no physical device/Safari claim',cases:[],errors:[]};
const save=()=>fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2)+'\n');
let browser;
(async()=>{
  browser=await chromium.launch();
  for(const width of [320,390,768,1440]){
    const context=await browser.newContext({viewport:{width,height:844},isMobile:width<768,hasTouch:width<768});
    // Tests do not request ads or analytics. KaTeX keeps the production stylesheet.
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin||new URL(r.request().url()).hostname==='cdn.jsdelivr.net'?r.continue():r.abort());
    const page=await context.newPage();
    page.on('pageerror',e=>report.errors.push(String(e)));
    for(const route of routes){
      try{
        assert.equal((await page.goto(base+route,{waitUntil:'load'})).status(),200);
        await page.evaluate(()=>document.fonts.ready);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'page overflow');
        assert.equal(await page.locator('h1').count(),1);
        const list=page.locator('.learning-chapters');
        if(width<1024){
          await list.locator('summary').click();
          const selection=await list.evaluate(e=>{
            const panel=e.querySelector('.side-nav'),current=panel.querySelector('[aria-current="page"]');
            const p=panel.getBoundingClientRect(),c=current.getBoundingClientRect();
            return {open:e.open,current:current.getAttribute('href'),visible:c.bottom>p.top&&c.top<p.bottom,touch:[...panel.querySelectorAll('a')].every(a=>a.getBoundingClientRect().height>=44),panelHeight:p.height};
          });
          assert(selection.open&&selection.visible&&selection.touch,'current chapter is visible in bounded touch list');
          assert.equal(selection.current,route);
          assert(selection.panelHeight<=844*.4+2);
          await list.locator('summary').click();
          const index=page.locator('.chapter-mobile-index');
          const href=await index.getAttribute('href');
          assert.equal((await context.request.get(base+href)).status(),200);
          assert((await index.boundingBox()).height>=44);
        }else assert(!await list.isVisible());
        const switcher=page.locator('.subject-switcher');
        if(await switcher.count()){
          await switcher.locator('summary').click();
          const menu=switcher.locator('.subject-switcher-menu');
          const box=await menu.boundingBox();
          assert(box.x>=-1&&box.x+box.width<=width+1,'subject menu stays in viewport');
          await switcher.locator('summary').press('Escape');
          if(width<768)assert(!await menu.isVisible(),'Escape closes focused menu');
        }
        const badges=page.locator('.round-badge');
        if(await badges.count()){
          if(width<768)assert(await badges.evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)),'touch question controls');
          await badges.first().click();
          const question=page.locator('dialog.q-layer[open]');
          await question.waitFor({state:'visible'});
          await question.locator('.reveal').click();
          assert.equal(await question.getAttribute('data-revealed'),'true');
          await question.locator('.close').click();
          assert.equal(await page.locator('dialog.q-layer[open]').count(),0);
        }
        const zoom=page.locator('.learning-image-open');
        if(await zoom.count()){
          for(const method of ['button','escape','backdrop']){
            await zoom.first().scrollIntoViewIfNeeded();
            const before=await page.evaluate(()=>({x:scrollX,y:scrollY,style:document.body.getAttribute('style')}));
            const original=await page.locator('article .learning-visuals figure').filter({has:zoom.first()}).locator('img').evaluate(e=>({src:e.currentSrc,alt:e.alt,width:Number(e.getAttribute('width'))}));
            await zoom.first().click();
            const dialog=page.locator('.learning-image-dialog');
            assert(await dialog.isVisible());
            assert(await dialog.locator('img').evaluate((e,o)=>e.src===o.src&&e.alt===o.alt&&e.width===o.width,original),'exact original asset and full-size labels');
            assert(await page.evaluate(()=>document.body.style.position==='fixed'),'background scroll locked');
            assert(await dialog.locator('[data-learning-image-close]').evaluate(e=>e===document.activeElement),'close gets initial focus');
            await page.screenshot({path:`${out}/${width}-${route.split('/').at(-2)}-zoom.png`});
            if(method==='button')await dialog.locator('[data-learning-image-close]').click();
            if(method==='escape')await page.keyboard.press('Escape');
            if(method==='backdrop')await page.mouse.click(1,1);
            await page.waitForFunction(()=>!document.querySelector('.learning-image-dialog').open&&document.body.style.position!=='fixed');
            const after=await page.evaluate(()=>({x:scrollX,y:scrollY,style:document.body.getAttribute('style'),focused:document.activeElement?.className}));
            assert(Math.abs(before.x-after.x)<=1&&Math.abs(before.y-after.y)<=1,'original reading position restored');
            assert.equal(after.style||'',before.style||'');assert.equal(after.focused,'learning-image-open');
          }
        }
        if(width===390||width===1440){
          await page.evaluate(()=>scrollTo(0,0));
          await page.screenshot({path:`${out}/${width}-${route.split('/').at(-2)}.png`});
        }
        report.cases.push({width,route,passed:true,questions:await badges.count(),imageButtons:await zoom.count()});
      }catch(e){report.errors.push(`${width} ${route}: ${e}`);report.cases.push({width,route,passed:false});await page.screenshot({path:out+`/failure-${width}-${route.split('/').at(-2)}.png`}).catch(()=>{});}
    }
    // Long GNB must remain scrollable on a short mobile screen.
    if(width===320||width===390){
      await page.setViewportSize({width,height:360});await page.goto(base+routes[0]);
      await page.locator('.gnb-menu>summary').click();
      const box=await page.locator('.gnb-dropdown').boundingBox();
      assert(box.x>=-1&&box.x+box.width<=width+1&&box.y+box.height<=360,'short-screen GNB containment');
      const last=page.locator('.gnb-dropdown a').last();await last.scrollIntoViewIfNeeded();
      assert(await last.isVisible());await last.press('Escape');
      assert(!await page.locator('.gnb-dropdown').isVisible());
      report.cases.push({width,height:360,case:'short-screen GNB',passed:true});
    }
    await context.close();
  }
  await browser.close();report.passed=report.errors.length===0;save();assert(report.passed,JSON.stringify(report.errors));
  console.log('[Mobile learning browser] PASS',report.cases.length,'cases');
})().catch(async e=>{report.errors.push(String(e));report.passed=false;save();if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1;});
