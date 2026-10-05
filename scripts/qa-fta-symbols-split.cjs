const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-fta-symbols-split/review.json'));
const canonical = new Map(JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json')).map(q => [q.id, q]));
const assetIds = new Set(JSON.parse(fs.readFileSync('src/data/question-assets/industrial-safety.json')).map(q => q.id));
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = path.resolve('qa-results/fta-symbols-split'); fs.mkdirSync(out, { recursive: true });
const result = { base, startedAt: new Date().toISOString(), device: 'Chromium viewport emulation', exactHtmlMatches: 0, viewports: [], errors: [] };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
const hash = b => createHash('sha256').update(b).digest('hex');
let browser;
(async () => {
  for (const row of review.chapters) {
    const route = new URL(row.url).pathname, response = await fetch(base + route);
    assert.equal(response.status, 200); assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fs.readFileSync(`dist${route}index.html`)));
    result.exactHtmlMatches++;
  }
  browser = await chromium.launch();
  await Promise.all([320, 390, 1440].map(async width => {
    let current;
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', route => { const u = new URL(route.request().url()); return u.origin === new URL(base).origin || u.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort(); });
    const page = await context.newPage();
    page.on('pageerror', e => result.errors.push(`${current}: ${e}`));
    page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) result.errors.push(`${current}: ${r.status()} ${r.url()}`); });
    const viewport = { width, pages: [], navigation: [] }; result.viewports.push(viewport);
    for (const row of review.chapters) {
      current = `${width}/${row.slug}`;
      await page.goto(base + new URL(row.url).pathname, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, mathErrors: document.querySelectorAll('.katex-error').length, cells: [...document.querySelectorAll('article th,article td')].map(e => ({ font:parseFloat(getComputedStyle(e).fontSize), width:e.clientWidth, scroll:e.scrollWidth })) }));
      assert(layout.scroll <= layout.width + 1); assert.equal(layout.mathErrors, 0); assert(layout.cells.every(c => c.font >= 13 && c.scroll <= c.width + 2));
      assert.equal(await page.locator('h1').count(), 1); assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), row.url);
      assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), row.questions);
      const record = { slug:row.slug, layout, figures:[], dialogs:[] }; viewport.pages.push(record);
      for (const img of await page.locator('article .chapter-figure img').all()) {
        await img.evaluate(img => img.decode());
        const info = await img.evaluate(img => ({src:img.getAttribute('src'),alt:img.alt,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,width:img.getBoundingClientRect().width}));
        assert(info.alt && info.naturalWidth === 360 && info.width <= layout.width);
        assert(await page.locator(`a.chapter-figure-zoom-link[href="${info.src}"]`).count() === 1);
        const response = await context.request.get(base + info.src); assert.equal(response.status(), 200);
        const svg = await response.text(); assert(svg.includes('<title') && svg.includes('<desc'));
        const labelSize = 20 * info.width / 360;
        if (width === 390) assert(labelSize >= 14, 'core SVG labels below 14px');
        record.figures.push({...info,coreLabelCssPx:labelSize,zoom:true});
      }
      for (const id of row.questions) {
        const q = canonical.get(id), dialog = page.locator('#deferred-question-dialog');
        await page.locator(`[data-open="${id}"]`).click(); await dialog.locator('[data-reveal]').waitFor({state:'visible'});
        assert.equal(await dialog.getAttribute('data-revealed'), 'false');
        assert.equal(await dialog.locator('[data-question-body]').textContent(), q.body);
        assert.deepEqual(await dialog.locator('.q-choices li').evaluateAll(els => els.map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim())), q.choices.map((c,i)=>`${['①','②','③','④'][i]} ${c}`));
        if (assetIds.has(id)) {
          const img = dialog.locator('img.q-image'); await img.waitFor({state:'visible'}); await img.evaluate(img => img.decode());
          assert(await img.evaluate(img => img.naturalWidth > 0 && img.getBoundingClientRect().width <= document.documentElement.clientWidth));
          if (width === 390) await page.screenshot({path:path.join(out, `${width}-${id}.png`)});
        }
        await dialog.locator('[data-reveal]').click();
        assert.equal(await dialog.getAttribute('data-revealed'), 'true');
        assert.equal(await dialog.locator('.q-choices li').evaluateAll(els => els.findIndex(e=>e.classList.contains('is-answer'))+1), q.answer);
        await dialog.locator('[data-close]').click(); assert.equal(await dialog.isVisible(), false);
        await page.locator(`[data-open="${id}"]`).click(); await dialog.locator('[data-reveal]').waitFor({state:'visible'});
        assert.equal(await dialog.getAttribute('data-revealed'), 'false'); await page.keyboard.press('Escape'); assert.equal(await dialog.isVisible(), false);
        record.dialogs.push({id,answer:q.answer,image:assetIds.has(id),passed:true});
      }
      await page.screenshot({path:path.join(out, `${width}-${row.slug}.png`),fullPage:true}); record.passed = true; save();
    }
    const parent = review.chapters[0];
    for (const child of review.chapters.filter(row=>row.newFile)) {
      await page.goto(base + new URL(parent.url).pathname);
      await page.locator(`.related-list a[href="${new URL(child.url).pathname}"]`).click(); assert.equal(new URL(page.url()).pathname, new URL(child.url).pathname);
      await page.locator(`.related-list a[href="${new URL(parent.url).pathname}"]`).click(); assert.equal(new URL(page.url()).pathname, new URL(parent.url).pathname);
      viewport.navigation.push({child:child.slug,roundTrip:true});
    }
    await context.close(); save();
  }));
  result.passed = !result.errors.length; result.finishedAt = new Date().toISOString(); save(); await browser.close(); assert(result.passed, JSON.stringify(result.errors));
})().catch(async e=>{result.passed=false;result.errors.push(String(e));save();if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1;});
