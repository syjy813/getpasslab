// Branch preview QA: table readability and every canonical question interaction.
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-04-accident-analysis-table/review.json'));
const questions = new Map(JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json')).map(q => [q.id, q]));
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const url = '/industrial-safety/written/safety-management/accident-analysis-tools/';
const out = path.resolve('qa-results/accident-analysis-figures');
fs.mkdirSync(out, { recursive: true });
const result = { startedAt: new Date().toISOString(), base, type: 'Chromium viewport emulation, not physical device testing', viewports: [], errors: [] };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
let browser;
(async () => {
  browser = await chromium.launch();
  for (const width of [390, 1440, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', route => {
      const target = new URL(route.request().url());
      return target.origin === base || target.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', error => result.errors.push(String(error)));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) result.errors.push(`${response.status()} ${response.url()}`); });
    const record = { width, dialogs: [] };
    result.viewports.push(record);
    assert.equal((await page.goto(base + url, { waitUntil: 'networkidle' })).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert(layout.scroll <= layout.width + 1);
    assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), review.questionIds);
    assert.equal(await page.locator('article .learning-visuals').count(), 0);
    const table = page.locator('article table');
    assert.equal(await table.count(), 1);
    record.table = await table.evaluate(el => {
      const r=el.getBoundingClientRect();
      return { width:r.width, left:r.left, right:r.right, scrollWidth:el.scrollWidth, clientWidth:el.clientWidth, cells:[...el.querySelectorAll('th,td')].map(c=>({text:c.textContent,clientWidth:c.clientWidth,scrollWidth:c.scrollWidth,fontSize:parseFloat(getComputedStyle(c).fontSize)})) };
    });
    assert(record.table.left >= 0 && record.table.right <= width+1);
    assert(record.table.scrollWidth <= record.table.clientWidth+1);
    assert(record.table.cells.every(c=>c.scrollWidth <= c.clientWidth+1 && c.fontSize >= 13));
    assert.equal(await table.locator('tbody tr').count(), 4);
    await table.evaluate(el => window.scrollTo(0,window.scrollY+el.getBoundingClientRect().top-72));
    await table.screenshot({path:path.join(out,`${width}-table.png`)});
    for (const id of review.questionIds) {
      const canonical = questions.get(id), dialog = page.locator('#deferred-question-dialog');
      await page.locator(`[data-open="${id}"]`).click();
      await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
      assert.equal(await dialog.getAttribute('data-revealed'), 'false');
      assert.equal(await dialog.locator('[data-question-body]').textContent(), canonical.body);
      assert.deepEqual(await dialog.locator('.q-choices li').evaluateAll(els => els.map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim())), canonical.choices.map((c, i) => `${['①','②','③','④'][i]} ${c}`));
      assert.equal(await dialog.locator('.q-answer-mark').isVisible(), false);
      await dialog.locator('[data-reveal]').click();
      assert.equal(await dialog.getAttribute('data-revealed'), 'true');
      assert.equal(await dialog.locator('.q-choices li').evaluateAll(els => els.findIndex(el => el.classList.contains('is-answer')) + 1), canonical.answer);
      assert(await dialog.locator('.q-answer-mark').isVisible());
      await dialog.locator('[data-close]').click(); assert.equal(await dialog.isVisible(), false);
      await page.locator(`[data-open="${id}"]`).click();
      await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
      assert.equal(await dialog.getAttribute('data-revealed'), 'false'); assert.equal(await dialog.locator('.q-answer-mark').isVisible(), false);
      await page.keyboard.press('Escape'); assert.equal(await dialog.isVisible(), false);
      record.dialogs.push({ id, answer: canonical.answer, bodyChoicesAnswerRevealCloseResetEscape: true });
    }
    await page.screenshot({ path: path.join(out, `${width}-chapter.png`), fullPage: true });
    record.passed = true;
    save(); console.log(`${width}px: table layout + 5 canonical dialogs PASS`);
    await context.close();
  }
  result.passed = result.errors.length === 0; result.finishedAt = new Date().toISOString(); save();
  await browser.close(); assert(result.passed, JSON.stringify(result.errors));
})().catch(async error => { result.passed = false; result.errors.push(String(error)); save(); if (browser) await browser.close().catch(() => {}); console.error(error); process.exitCode = 1; });
