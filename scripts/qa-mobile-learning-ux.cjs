const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const out=process.env.QA_OUTPUT_DIR||'qa-results/mobile-learning-ux';
fs.mkdirSync(out,{recursive:true});
const baseline=JSON.parse(fs.readFileSync('docs/audits/2026-10-26-mobile-learning-ux/baseline.json'));
const chapterRoutes=Object.entries(baseline.html).filter(([,v])=>v.chapter).map(([f])=>f.slice(4,-10));
const slugs=['goal-seek','character-codes','cell-entry-edit-navigation','concentration-conversion','draft-flue-gas','management-target-grades','sprinkler-types-operation','power-formula'];
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
        assert.equal(await page.locator('.learning-chapters,.chapter-mobile-index').count(),0,'no body or bottom TOC');
        const alignment=await page.evaluate(()=>{
          const n=document.querySelector('.gnb-inner').getBoundingClientRect(),l=document.querySelector('.gnb-logo').getBoundingClientRect(),r=document.querySelector('.gnb-menu summary svg').getBoundingClientRect();
          return {left:l.left-n.left,right:n.right-r.right};
        });
        assert(Math.abs(alignment.left-24)<=1&&Math.abs(alignment.right-24)<=1,'symmetric GNB visible edges');
        const gnb=page.locator('.gnb-menu');
        assert.equal(await gnb.locator('summary').getAttribute('aria-label'),'챕터 목차');
        await gnb.locator('summary').click();
        const toc=gnb.locator('.gnb-chapter-dropdown');
        // Native details queues its toggle event; wait for the existing auto-scroll.
        await page.waitForFunction(()=>{
          const details=document.querySelector('.gnb-menu'),menu=details?.querySelector('.gnb-chapter-dropdown'),current=menu?.querySelector('[aria-current="page"]');
          if(!details?.open||!menu||!current)return false;
          const panel=menu.getBoundingClientRect(),item=current.getBoundingClientRect();
          return panel.height>0&&item.bottom>panel.top&&item.top<panel.bottom;
        });
        const selection=await toc.evaluate(e=>{
          const current=e.querySelector('[aria-current="page"]'),p=e.getBoundingClientRect(),c=current.getBoundingClientRect();
          return {current:current.getAttribute('href'),visible:c.bottom>p.top&&c.top<p.bottom,touch:[...e.querySelectorAll('a')].every(a=>a.getBoundingClientRect().height>=44),left:p.left,right:p.right,bottom:p.bottom};
        });
        assert(selection.visible&&selection.touch,'current chapter visible in touch TOC');assert.equal(selection.current,route);
        assert(selection.left>=0&&selection.right<=width+1&&selection.bottom<=844,'bounded TOC');
        if(width<1024){
          const footer=await page.locator('.chapter-mobile-nav').boundingBox();
          assert(selection.bottom<=footer.y-8,'TOC clears the fixed navigation bar by at least 8px');
        }
        const sidebarLinks=await page.locator('.chapter-side .side-nav a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
        assert.deepEqual(await toc.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),sidebarLinks);
        if(width===390)await page.screenshot({path:`${out}/${width}-${route.split('/').at(-2)}-toc.png`});
        const destination=toc.locator('a:not([aria-current])').first();
        const destinationURL=await destination.getAttribute('href');
        await Promise.all([page.waitForURL(new URL(destinationURL,base).href,{waitUntil:'load'}),destination.click()]);
        assert(new URL(page.url()).pathname===destinationURL,'TOC link navigation');
        await page.goBack({waitUntil:'load'});assert.equal(new URL(page.url()).pathname,route);
        if(await page.locator('.gnb-menu').getAttribute('open')!==null)await page.locator('.gnb-menu>summary').click();
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
            const original=await zoom.first().evaluate(button=>{const e=button.closest('figure').querySelector('img');return {src:e.currentSrc,alt:e.alt,width:Number(e.getAttribute('width'))||e.naturalWidth||e.width,rendered:e.getBoundingClientRect().width};});
            await zoom.first().click();
            const dialog=page.locator('.learning-image-dialog');
            assert(await dialog.isVisible());
            assert(await dialog.locator('img').evaluate((e,o)=>e.src===o.src&&e.alt===o.alt&&e.width>=o.width&&e.width>=o.rendered*1.25,original),'original asset and enlarged labels');
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
    for(const ordinary of ['/', '/computer-literacy/written/']){
      await page.goto(base+ordinary);
      assert.equal(await page.locator('.gnb-menu>summary').getAttribute('aria-label'),'자격증 선택');
      assert.equal(await page.locator('.gnb-chapter-dropdown').count(),0);
      const edges=await page.evaluate(()=>{const n=document.querySelector('.gnb-inner').getBoundingClientRect(),l=document.querySelector('.gnb-logo').getBoundingClientRect(),r=document.querySelector('.gnb-menu summary svg').getBoundingClientRect();return [l.left-n.left,n.right-r.right];});
      assert(edges.every(v=>Math.abs(v-24)<=1),'ordinary GNB symmetry');
      report.cases.push({width,route:ordinary,case:'ordinary page GNB',passed:true});
    }
    // Exercise long menus at short/normal heights and a simulated 34px bottom inset.
    if(width<1024){
      const longRoute=chapterRoutes.find(r=>r.endsWith('/character-codes/'));
      for(const height of [360,844])for(const safeArea of [0,34]){
        await page.setViewportSize({width,height});await page.goto(base+longRoute);
        if(safeArea)await page.addStyleTag({content:`@media(max-width:1023px){body.chapter-page{--chapter-mobile-nav-space:${72+safeArea}px}.chapter-mobile-nav{padding-bottom:${8+safeArea}px}}`});
        await page.locator('.gnb-menu>summary').click();
        const menu=page.locator('.gnb-chapter-dropdown'),bar=page.locator('.chapter-mobile-nav');
        const box=await menu.boundingBox(),footer=await bar.boundingBox();
        assert(box.x>=0&&box.x+box.width<=width+1&&box.y+box.height<=footer.y-8,'long menu does not cover footer');
        assert(await menu.locator('a').count()>100,'long list fixture');
        const last=menu.locator('a').last();await last.scrollIntoViewIfNeeded();
        const lastBox=await last.boundingBox();
        assert(lastBox.y>=box.y-1&&lastBox.y+lastBox.height<=box.y+box.height+1,'last chapter can be reached inside the menu');
        const href=await last.getAttribute('href');
        await page.screenshot({path:`${out}/footer-clearance-${width}-${height}-inset${safeArea}.png`});
        await last.click();assert.equal(new URL(page.url()).pathname,href,'last chapter remains clickable');
        report.cases.push({width,height,safeArea,case:'TOC/footer separation and last link',gap:footer.y-box.y-box.height,passed:true});
      }
    }
    await context.close();
  }
  await browser.close();report.passed=report.errors.length===0;save();assert(report.passed,JSON.stringify(report.errors));
  console.log('[Mobile learning browser] PASS',report.cases.length,'cases');
})().catch(async e=>{report.errors.push(String(e));report.passed=false;save();if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1;});
