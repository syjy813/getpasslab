const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-earth-retaining-structure/review.json'));
const questions = new Map(JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json')).map(q => [q.id, q]));
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const route = new URL(review.chapters[0].url).pathname;
const asset = review.assets.find(a => a.active), assetUrl = '/' + asset.path.replace(/^public\//, '');
const out = path.resolve('qa-results/earth-retaining-structure'); fs.mkdirSync(out, { recursive: true });
const result = { base, startedAt: new Date().toISOString(), device: 'Chromium viewport emulation', viewports: [], errors: [] };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
const hash = b => createHash('sha256').update(b).digest('hex');
let browser;
(async () => {
  for (const url of [route, assetUrl]) {
    const response = await fetch(base + url); assert.equal(response.status, 200);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fs.readFileSync('dist' + (url.endsWith('/') ? url + 'index.html' : url))));
  }
  result.exactHtmlAndAssetMatch = true;
  browser = await chromium.launch({ executablePath: process.env.QA_BROWSER_EXECUTABLE });
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', route => { const u = new URL(route.request().url()); return u.origin === new URL(base).origin || u.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort(); });
    const page = await context.newPage(); page.on('pageerror', e => result.errors.push(String(e)));
    page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) result.errors.push(`${r.status()}: ${r.url()}`); });
    await page.goto(base + route, { waitUntil: 'domcontentloaded' }); await page.evaluate(() => document.fonts.ready);
    const figure = page.locator('.learning-visuals--earth figure'), img = figure.locator('img');
    await img.scrollIntoViewIfNeeded(); await img.evaluate(img => img.decode());
    const layout = await img.evaluate(img => {
      const b = img.getBoundingClientRect(), f = img.closest('figure').getBoundingClientRect(), c = img.closest('figure').querySelector('figcaption').getBoundingClientRect();
      return { viewport:document.documentElement.clientWidth, scroll:document.documentElement.scrollWidth, imageWidth:b.width, imageHeight:b.height, imageLeft:b.left, figureLeft:f.left, figureWidth:f.width, containerLeft:img.closest('.learning-visuals').getBoundingClientRect().left, topGap:b.top-c.bottom, minLabel:24*b.width/390, naturalWidth:img.naturalWidth, naturalHeight:img.naturalHeight, currentSrc:img.currentSrc };
    });
    assert(layout.scroll <= layout.viewport + 1); assert(layout.figureWidth <= 424.1);
    assert(Math.abs(layout.figureLeft-layout.containerLeft) < 1); assert(layout.imageWidth < layout.figureWidth - 25); assert(layout.topGap >= 23.9);
    assert(layout.minLabel >= 14); assert.equal(layout.naturalWidth, 390); assert.equal(layout.naturalHeight, asset.height);
    assert(Math.abs(layout.imageHeight/layout.imageWidth - asset.height/asset.width) < .005);
    assert.equal(new URL(layout.currentSrc).pathname, assetUrl);
    assert((await img.getAttribute('alt')).includes('양쪽에 흙'));
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), review.chapters[0].url);
    assert.equal(await page.locator('h1').count(), 1);
    assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), review.questionIds);
    await figure.screenshot({ path:path.join(out, `${width}-figure.png`), style: ".chapter-mobile-nav{visibility:hidden}" });
    await page.screenshot({ path:path.join(out, `${width}-chapter.png`), fullPage:true });
    const record = { width, layout, dialogs:[] }; result.viewports.push(record);
    for (const id of review.questionIds) {
      const q = questions.get(id), dialog = page.locator('#deferred-question-dialog');
      await page.locator(`[data-open="${id}"]`).click(); await dialog.locator('[data-reveal]').waitFor({state:'visible'});
      assert.equal(await dialog.locator('[data-question-body]').textContent(), q.body);
      assert.deepEqual(await dialog.locator('.q-choices li').evaluateAll(els => els.map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim())), q.choices.map((c,i)=>`${['①','②','③','④'][i]} ${c}`));
      assert.equal(await dialog.getAttribute('data-revealed'), 'false'); await dialog.locator('[data-reveal]').click();
      assert.equal(await dialog.locator('.q-choices li').evaluateAll(els => els.findIndex(e => e.classList.contains('is-answer'))+1), q.answer);
      if (id === '20190804_118') await page.screenshot({path:path.join(out,`${width}-recorded-answer.png`)});
      await dialog.locator('[data-close]').click(); assert.equal(await dialog.isVisible(), false);
      await page.locator(`[data-open="${id}"]`).click(); await dialog.locator('[data-reveal]').waitFor({state:'visible'});
      assert.equal(await dialog.getAttribute('data-revealed'), 'false'); await page.keyboard.press('Escape');
      assert.equal(await dialog.isVisible(), false); record.dialogs.push({id,recordedAnswer:q.answer,passed:true});
    }
    const svgPage = await context.newPage();
    await svgPage.setContent(fs.readFileSync(asset.path, 'utf8')); await svgPage.evaluate(() => document.fonts.ready);
    const labels = await svgPage.locator('svg text').evaluateAll(els => els.map(e => {const b=e.getBBox();return {text:e.textContent,x:b.x,y:b.y,width:b.width,height:b.height};}));
    assert(labels.length === 5 && labels.every(b => b.x >= 0 && b.y >= 0 && b.x+b.width <= 390 && b.y+b.height <= asset.height));
    record.labels = labels;
    if (width === 390) await svgPage.locator('svg').screenshot({path:path.join(out,'svg-390.png')});
    await context.close(); save();
  }
  result.passed = !result.errors.length; result.finishedAt = new Date().toISOString(); save(); await browser.close(); assert(result.passed);
})().catch(async e => { result.passed=false;result.errors.push(String(e));save();if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1; });
