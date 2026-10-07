const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-07-formwork-lateral-pressure/review.json'));
const questions = JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json'));
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = path.resolve('qa-results/formwork-lateral-pressure');
fs.mkdirSync(out, { recursive: true });
const result = { base, startedAt: new Date().toISOString(), exactHtmlMatches: 0, viewports: [], errors: [] };
const hash = b => createHash('sha256').update(b).digest('hex');
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
let browser;
(async () => {
  const route = new URL(review.chapter.url).pathname;
  const related = '/industrial-safety/written/construction/shore-safety-standard/';
  const secondRelated = '/industrial-safety/written/construction/walkway-board-standard/';
  for (const current of [route, related, secondRelated, '/industrial-safety/written/construction/']) {
    const response = await fetch(base + current);
    assert.equal(response.status, 200);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fs.readFileSync('dist' + current + 'index.html')));
    result.exactHtmlMatches++;
  }
  browser = await chromium.launch({ executablePath: process.env.QA_BROWSER_EXECUTABLE });
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', route => { const url = new URL(route.request().url()); return url.origin === new URL(base).origin || url.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort(); });
    const page = await context.newPage();
    page.on('pageerror', error => result.errors.push(String(error)));
    page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) result.errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base + route, { waitUntil: 'domcontentloaded' }); await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), review.chapter.url);
    assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), review.chapter.questions);
    assert.equal(await page.locator('article table tbody tr').count(), 6);
    const layout = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, tableWidth: document.querySelector('article table').clientWidth, tableScroll: document.querySelector('article table').scrollWidth, h2Background: getComputedStyle(document.querySelector('article h2')).backgroundColor, mathErrors: document.querySelectorAll('.katex-error').length }));
    assert(layout.scroll <= layout.viewport + 1); assert.equal(layout.mathErrors, 0);
    assert(layout.tableScroll <= layout.tableWidth + 1);
    assert.notEqual(layout.h2Background, 'rgba(0, 0, 0, 0)');
    await page.screenshot({ path: path.join(out, `${width}-chapter.png`), fullPage: true });
    await page.locator('article table').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(out, `${width}-table.png`) });
    const popupResults = [];
    for (const id of review.chapter.questions) {
      const question = questions.find(q => q.id === id);
      const dialog = page.locator('#deferred-question-dialog');
      await page.locator(`[data-open="${id}"]`).click(); await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
      assert.equal(await dialog.locator('[data-question-body]').textContent(), question.body);
      assert.deepEqual(await dialog.locator('.q-choices li').evaluateAll(els => els.map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim())), question.choices.map((c, i) => `${['①', '②', '③', '④'][i]} ${c}`));
      assert.equal(await dialog.getAttribute('data-revealed'), 'false');
      await page.screenshot({ path: path.join(out, `${width}-${id}.png`) });
      await dialog.locator('[data-reveal]').click();
      assert.equal(await dialog.locator('.q-choices li').evaluateAll(els => els.findIndex(e => e.classList.contains('is-answer')) + 1), question.answer);
      await dialog.locator('[data-close]').click(); assert.equal(await dialog.isVisible(), false);
      await page.locator(`[data-open="${id}"]`).click(); await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
      assert.equal(await dialog.getAttribute('data-revealed'), 'false'); await page.keyboard.press('Escape'); assert.equal(await dialog.isVisible(), false);
      popupResults.push({ id, answer: question.answer, resetAndEscape: true, passed: true });
    }
    await page.locator(`article .related-list a[href="${related}"]`).click(); assert.equal(new URL(page.url()).pathname, related);
    await page.locator(`article .related-list a[href="${route}"]`).click(); assert.equal(new URL(page.url()).pathname, route);
    await page.locator(`article .related-list a[href="${secondRelated}"]`).click(); assert.equal(new URL(page.url()).pathname, secondRelated);
    await page.locator(`article .related-list a[href="${route}"]`).click(); assert.equal(new URL(page.url()).pathname, route);
    await page.goto(base + '/industrial-safety/written/construction/', { waitUntil: 'domcontentloaded' });
    await page.locator(`a.card[href="${route}"]`).click(); assert.equal(new URL(page.url()).pathname, route);
    result.viewports.push({ width, layout, popups: popupResults, tocAndRelatedRoundTrip: true, passed: true }); save();
    await context.close();
  }
  result.passed = !result.errors.length; result.finishedAt = new Date().toISOString(); save(); await browser.close(); assert(result.passed);
})().catch(async error => { result.passed = false; result.errors.push(String(error)); save(); if (browser) await browser.close().catch(() => {}); console.error(error); process.exitCode = 1; });
