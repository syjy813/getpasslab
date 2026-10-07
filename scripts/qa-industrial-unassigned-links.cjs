const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-07-industrial-unassigned-links/review.json'));
const questions = JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json'));
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = path.resolve('qa-results/industrial-unassigned-links'); fs.mkdirSync(out, { recursive: true });
const result = { base, startedAt: new Date().toISOString(), exactHtmlMatches: 0, viewports: [], errors: [] };
const hash = b => createHash('sha256').update(b).digest('hex');
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
let browser;
(async () => {
  for (const row of review.chapters) {
    const route = new URL(row.url).pathname, response = await fetch(base + route); assert.equal(response.status, 200);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fs.readFileSync('dist' + route + 'index.html'))); result.exactHtmlMatches++;
  }
  browser = await chromium.launch({ executablePath: process.env.QA_BROWSER_EXECUTABLE });
  for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', r => { const u = new URL(r.request().url()); return u.origin === new URL(base).origin || u.hostname === 'cdn.jsdelivr.net' ? r.continue() : r.abort(); });
    const page = await context.newPage(); page.on('pageerror', e => result.errors.push(String(e)));
    page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) result.errors.push(`${r.status()} ${r.url()}`); });
    const viewport = { width, pages: [] }; result.viewports.push(viewport);
    for (const row of review.chapters) {
      await page.goto(base + new URL(row.url).pathname, { waitUntil: 'domcontentloaded' }); await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1); assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), row.url);
      assert.deepEqual(await page.locator('main [data-open]').evaluateAll(es => es.map(e => e.dataset.open)), row.questions);
      const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth, mathErrors: document.querySelectorAll('.katex-error').length }));
      assert(layout.scroll <= layout.width + 1); assert.equal(layout.mathErrors, 0);
      if (row.slug === 'safety-factor') assert((await page.locator('article').textContent()).includes('200/5 = 40 ton'));
      if (row.slug === 'safety-management-cost') assert((await page.locator('article').textContent()).includes('2022년 6월 2일 개정 규정'));
      await page.screenshot({ path: path.join(out, `${width}-${row.slug}.png`), fullPage: true });
      const q = questions.find(q => q.id === row.addedQuestion), d = page.locator('#deferred-question-dialog');
      await page.locator(`[data-open="${q.id}"]`).click(); await d.locator('[data-reveal]').waitFor({ state: 'visible' });
      assert.equal(await d.getAttribute('data-revealed'), 'false'); assert.equal(await d.locator('[data-question-body]').textContent(), q.body);
      assert.deepEqual(await d.locator('.q-choices li').evaluateAll(es => es.map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim())), q.choices.map((c, i) => `${['①', '②', '③', '④'][i]} ${c}`));
      assert(await d.evaluate(el => el.scrollWidth <= el.clientWidth + 1));
      await page.screenshot({ path: path.join(out, `${width}-${q.id}.png`) });
      await d.locator('[data-reveal]').click(); assert.equal(await d.locator('.q-choices li').evaluateAll(es => es.findIndex(e => e.classList.contains('is-answer')) + 1), q.answer);
      await d.locator('[data-close]').click(); assert.equal(await d.isVisible(), false);
      await page.locator(`[data-open="${q.id}"]`).click(); await d.locator('[data-reveal]').waitFor({ state: 'visible' });
      assert.equal(await d.getAttribute('data-revealed'), 'false'); await page.keyboard.press('Escape'); assert.equal(await d.isVisible(), false);
      viewport.pages.push({ slug: row.slug, id: q.id, answer: q.answer, layout, resetAndEscape: true, passed: true }); save();
    }
    await context.close();
  }
  result.passed = !result.errors.length; result.finishedAt = new Date().toISOString(); save(); await browser.close(); assert(result.passed);
})().catch(async e => { result.passed = false; result.errors.push(String(e)); save(); if (browser) await browser.close().catch(() => {}); console.error(e); process.exitCode = 1; });
