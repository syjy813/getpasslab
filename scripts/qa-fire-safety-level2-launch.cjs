const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const dir = process.env.QA_OUTPUT_DIR || 'qa-results/fire-safety-level2';
const prefix = '/fire-safety-manager-level2/written/';
const lesson = prefix + 'fire-safety-theory/sprinkler-types-operation/';
const report = {base, startedAt: new Date().toISOString(), cases: [], errors: [], limitations: ['Chromium emulation; physical iOS/Android and Safari not tested']};
fs.mkdirSync(dir, {recursive:true});
(async () => {
  const browser = await chromium.launch({headless:true,
    ...(process.env.QA_CHROMIUM_EXECUTABLE ? {executablePath:process.env.QA_CHROMIUM_EXECUTABLE} : {}),
    args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
  try {
    for (const width of [320,390,768,1440]) {
      const context = await browser.newContext({viewport:{width,height:900}});
      await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
      const page = await context.newPage();
      page.setDefaultTimeout(12000);page.setDefaultNavigationTimeout(20000);
      page.on('pageerror', e => report.errors.push(String(e)));
      page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
      await page.goto(base);
      await page.locator('a.card', {hasText:'소방안전관리자 2급'}).click();
      await page.waitForURL(base+prefix);
      await page.locator('a.card', {hasText:'소방안전관리 이론'}).click();
      await page.waitForURL(base+prefix+'fire-safety-theory/');
      await page.locator('a.card', {hasText:'스프링클러 방식과 작동 순서'}).click();
      await page.waitForURL(base+lesson);
      await page.waitForFunction(() => [...document.querySelectorAll('article img')].every(i=>i.complete && i.naturalWidth===1254));
      assert.equal(await page.locator('h1').count(),1);
      assert.equal(await page.locator('article figure').count(),4);
      assert.equal(await page.locator('[data-open],[data-practice-open]').count(),0);
      assert(!/복원문제 참고|연결 자료에서 확인한 판단|검수 기록|편집 메모|기출 출제 이력/.test(await page.locator('article').innerText()));
      assert(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1));
      const dims = await page.locator('article figure .sprinkler-crop').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));
      assert(dims.every(n=>n>=width-52 || n>=350));
      await page.screenshot({path:dir+`/lesson-${width}.png`,fullPage:true});
      for (let i=0;i<4;i++) {
        const button = page.locator('article .zoom-button').nth(i);
        await button.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
        const before = await page.evaluate(()=>({x:scrollX,y:scrollY,style:document.body.getAttribute('style')}));
        await button.click();
        await page.waitForFunction(()=>document.getElementById('image-dialog').open);
        assert.equal(await page.locator('#image-dialog .zoom-crop').evaluate(e=>e.getBoundingClientRect().width),600);
        assert.equal(await page.evaluate(()=>getComputedStyle(document.body).position),'fixed');
        await page.locator('.zoom-scroll').evaluate(e=>{e.scrollLeft=90;e.scrollTop=60});
        if (i===1) await page.keyboard.press('Escape');
        else if(i===2) await page.mouse.click(2,2);
        else await page.locator('[data-close-modal]').click();
        await page.waitForFunction(b=>!document.getElementById('image-dialog').open && Math.abs(scrollY-b.y)<=1 && Math.abs(scrollX-b.x)<=1,before);
        assert.equal(await button.evaluate(e=>e===document.activeElement),true);
        assert.equal(await page.evaluate(()=>document.body.getAttribute('style')||''),before.style||'');
      }
      await page.locator('.gnb-menu summary').click();
      assert.equal(await page.locator('.gnb-menu summary').getAttribute('aria-label'),'챕터 목차');
      const chapterLink=page.locator('.gnb-chapter-dropdown a:not([aria-current])').first();
      const chapterHref=await chapterLink.getAttribute('href');
      await chapterLink.click();
      await page.waitForURL(base+chapterHref);
      assert.equal(await page.locator('h1').count(),1);
      // General pages retain certification navigation; chapter pages use the TOC.
      await page.goto(base);
      await page.locator('.gnb-menu summary').click();
      assert.equal(await page.locator('.gnb-menu summary').getAttribute('aria-label'),'자격증 선택');
      assert.equal(await page.locator('.gnb-certification-link',{hasText:'소방안전관리자 2급'}).count(),1);
      await page.locator('.gnb-certification-link',{hasText:'소방안전관리자 2급'}).click();
      await page.waitForURL(base+prefix);
      report.cases.push({width,menuNavigation:'PASS',imageCount:4,displayWidths:dims,zoomCloseAndRestoration:4,noOverflow:true});
      await context.close();
    }
    // Existing scopes retain their chapter layout and question popups.
    const page = await browser.newPage({viewport:{width:390,height:900}});
    await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    for (const route of ['/industrial-safety/written/construction/hanging-scaffold-wire-rope/','/energy-management/written/thermal-equipment/draft-flue-gas/','/computer-literacy/written/spreadsheets/goal-seek/']) {
      const response=await page.goto(base+route); assert.equal(response.status(),200);
      assert.equal(await page.locator('h1').count(),1);
      const trigger=page.locator('[data-open]').first();
      await trigger.click();
      const dialog=page.locator('dialog[open]');await dialog.waitFor();
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>!document.querySelector('dialog[open]'));
      report.cases.push({route,existingQuestionPopup:'PASS'});
    }
    assert.deepEqual(report.errors,[]);
    report.result='PASS';
  } catch(error) { report.result='FAIL'; report.errors.push(String(error)); throw error; }
  finally { report.finishedAt=new Date().toISOString();fs.writeFileSync(dir+'/browser-results.json',JSON.stringify(report,null,2));await browser.close(); }
  console.log('[Fire safety browser QA]',report.result,report.cases.length,'conditions, 16 image zoom cases');
})().catch(e=>{console.error(e);process.exitCode=1});
