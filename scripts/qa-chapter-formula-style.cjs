const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { publicPages: baselinePages } = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-all-chapter-gray-formulas/source-verification.json'));
const ftaReview = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-fta-symbols-split/review.json'));
const sourceReview = JSON.parse(fs.readFileSync('docs/audits/2026-10-06-industrial-question-source-repair/review.json'));
const batchReview = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-industrial-remaining-splits/review.json'));
const reviewedPages = baselinePages.map(row => sourceReview.chapters.find(later => later.url === row.url) ?? batchReview.chapters.find(later => later.url === row.url) ?? ftaReview.chapters.find(later => later.url === row.url) ?? row).concat([...ftaReview.chapters, ...batchReview.chapters].filter(row => row.newFile));
const publication = JSON.parse(fs.readFileSync('docs/audits/2026-10-07-clam-shell-chapter/review.json'));
const publicPages = require('./current-20190804-review.cjs').chapters(reviewedPages).concat(publication.chapter);
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = path.resolve('qa-results/chapter-formula-style');
fs.mkdirSync(out, { recursive: true });
const result = { base, startedAt: new Date().toISOString(), device: 'Chromium viewport emulation', exactHtmlMatches: 0, viewports: [], errors: [] };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
let browser;
(async () => {
  for (const row of publicPages) {
    const route = new URL(row.url).pathname;
    const response = await fetch(base + route);
    assert.equal(response.status, 200, `${route}: HTTP`);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fs.readFileSync('dist' + route + 'index.html')), `${route}: served HTML mismatch`);
    result.exactHtmlMatches++;
  }
  browser = await chromium.launch({ executablePath: process.env.QA_BROWSER_EXECUTABLE });
  await Promise.all([320, 390, 1440].map(async width => {
    let current;
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', route => {
      const u = new URL(route.request().url());
      return u.origin === new URL(base).origin || u.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    page.on('pageerror', e => result.errors.push(`${current}: ${e}`));
    page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) result.errors.push(`${current}: HTTP ${r.status()} ${r.url()}`); });
    const viewport = { width, pages: [] }; result.viewports.push(viewport);
    const captured = new Set();
    for (const row of publicPages) {
      const route = new URL(row.url).pathname;
      current = `${width}${route}`;
      try {
        await page.goto(base + route, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        const layout = await page.evaluate(() => {
          const article = document.querySelector('.chapter-page article');
          const cards = [...article.querySelectorAll('.katex-display, p>.katex:only-child')];
          return {
            width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth,
            mathErrors: document.querySelectorAll('.katex-error').length,
            headings: [...article.querySelectorAll('h2')].map(e => getComputedStyle(e).backgroundColor),
            cards: cards.map(c => ({ background: getComputedStyle(c).backgroundColor, border: getComputedStyle(c).borderTopColor, color: getComputedStyle(c).color, width: c.clientWidth, scroll: c.scrollWidth,
              glyphs: [...c.querySelectorAll('.katex-html span')].filter(e => [...e.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())).map(e => ({weight:getComputedStyle(e).fontWeight, family:getComputedStyle(e).fontFamily})) })),
            otherMath: [...article.querySelectorAll('.katex')].filter(e => !cards.some(c => c.contains(e))).map(e => ({ background:getComputedStyle(e).backgroundColor, weight:getComputedStyle(e).fontWeight })),
          };
        });
        assert(layout.scrollWidth <= layout.width + 1, `${current}: page overflow`);
        assert.equal(layout.mathErrors, 0, `${current}: math error`);
        assert(layout.headings.every(c => c === 'rgb(239, 246, 255)'), `${current}: headings changed`);
        for (const card of layout.cards) {
          assert.equal(card.background, 'rgb(242, 244, 246)');
          assert.equal(card.border, 'rgb(229, 232, 235)');
          assert.equal(card.color, 'rgb(51, 61, 75)');
          assert(card.glyphs.length && card.glyphs.every(g => g.weight === '700'), `${current}: non-bold formula glyph`);
          // Long existing equations retain their internal scroll container.
          assert(card.width <= layout.width, `${current}: formula box exceeds viewport`);
        }
        assert(layout.otherMath.every(m => m.background === 'rgba(0, 0, 0, 0)' && m.weight === '400'), `${current}: inline/table math changed`);
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), row.url);
        assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), row.questions);
        if ((layout.cards.length && !captured.has(row.certification)) || route.endsWith('/concentration-conversion/')) {
          await page.screenshot({ path: path.join(out, `${width}-${row.certification}-${route.split('/').at(-2)}.png`), fullPage: true });
          captured.add(row.certification);
        }
        viewport.pages.push({ route, certification: row.certification, layout, passed: true });
      } catch (error) {
        result.errors.push(`${current}: ${error}`);
        viewport.pages.push({ route, passed: false, error: String(error) });
        await page.screenshot({ path: path.join(out, `failure-${width}-${route.split('/').at(-2)}.png`), fullPage: true }).catch(() => {});
      }
      save();
    }
    await context.close();
  }));
  result.passed = !result.errors.length; result.finishedAt = new Date().toISOString(); save();
  await browser.close(); assert(result.passed, JSON.stringify(result.errors));
})().catch(async e => { result.passed = false; result.errors.push(String(e)); save(); if (browser) await browser.close().catch(() => {}); console.error(e); process.exitCode = 1; });
