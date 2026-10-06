const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-industrial-remaining-review/review.json'));
const ftaReview = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-fta-symbols-split/review.json'));
const sourceReview = JSON.parse(fs.readFileSync('docs/audits/2026-10-06-industrial-question-source-repair/review.json'));
const batchReview = JSON.parse(fs.readFileSync('docs/audits/2026-10-05-industrial-remaining-splits/review.json'));
review.chapters = review.chapters.map(row => sourceReview.chapters.find(later => later.path === row.path) ?? batchReview.chapters.find(later => later.path === row.path) ?? ftaReview.chapters.find(later => later.path === row.path) ?? row);
review.chapters = require('./current-20190804-review.cjs').chapters(review.chapters);
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = path.resolve('qa-results/industrial-remaining-review');
fs.mkdirSync(out, { recursive: true });
const captures = new Set(['concentration-conversion', 'murrell-rest-formula', 'rmr-energy-metabolism', 'thermal-conditions-wbgt', 'vdt-contrast', 'acetylene-properties', 'fta-symbols', 'msd-risk-factors', 'grounding-types', 'safety-education-stages']);
const result = { base, startedAt: new Date().toISOString(), device: 'Chromium viewport emulation', exactHtmlMatches: 0, viewports: [], errors: [] };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
let browser;
(async () => {
  for (const row of review.chapters) {
    const route = new URL(row.url).pathname;
    const response = await fetch(base + route);
    assert.equal(response.status, 200, `${row.slug}: HTTP`);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), hash(fs.readFileSync('dist' + route + 'index.html')), `${row.slug}: served HTML mismatch`);
    result.exactHtmlMatches++;
  }
  browser = await chromium.launch();
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
    for (const row of review.chapters) {
      current = `${width}/${row.slug}`;
      try {
      await page.goto(base + new URL(row.url).pathname, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const article = document.querySelector('article');
        const width = document.documentElement.clientWidth;
        return {
          width, scrollWidth: document.documentElement.scrollWidth,
          rawLatex: [...article.querySelectorAll('p,li')].filter(e => !e.closest('table')).map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('')).filter(t => /\\(?:approx|rho|sim|text\{)/.test(t)),
          tableFontSizes: [...article.querySelectorAll('td,th')].map(e => parseFloat(getComputedStyle(e).fontSize)),
          mathErrors: article.querySelectorAll('.katex-error').length,
          formulaColors: [...article.querySelectorAll('.katex-display, p>.katex:only-child')].map(e => ({background:getComputedStyle(e).backgroundColor,border:getComputedStyle(e).borderTopColor,color:getComputedStyle(e).color})),
          h2Colors: [...article.querySelectorAll('h2')].map(e => getComputedStyle(e).backgroundColor),
          formulaTextWeights: [...article.querySelectorAll('.katex-display, p>.katex:only-child')].map(card => [...card.querySelectorAll('.katex-html span')].filter(e => [...e.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())).map(e => getComputedStyle(e).fontWeight)),
          tablesWithInternalScroll: [...article.querySelectorAll('table')].filter(e => e.scrollWidth > e.clientWidth + 2).length,
          formulasWithInternalScroll: [...article.querySelectorAll('.katex-display')].filter(e => e.scrollWidth > e.clientWidth + 2).length,
        };
      });
      assert(layout.scrollWidth <= layout.width + 1, `${current}: page overflow`);
      assert(layout.tableFontSizes.every(n => n >= 13), `${current}: small table font`);
      assert.equal(layout.mathErrors, 0, `${current}: math parse error`);
      const sample = row.slug === 'concentration-conversion';
      if (sample) {
        assert(layout.formulaColors.length > 0, `${current}: formula cards missing`);
      }
      assert(layout.formulaTextWeights.every(weights => weights.length && weights.every(w => w === '700')), `${current}: formula glyphs are not all bold`);
      for (const colors of layout.formulaColors) {
        assert.equal(colors.background, 'rgb(242, 244, 246)', `${current}: formula color scope`);
        assert.equal(colors.border, 'rgb(229, 232, 235)'); assert.equal(colors.color, 'rgb(51, 61, 75)');
      }
      assert(layout.h2Colors.every(color => color === 'rgb(239, 246, 255)'), `${current}: heading color changed`);
      assert.equal(layout.rawLatex.length, 0, `${current}: unrendered math command ${JSON.stringify(layout.rawLatex)}`);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), row.url);
      assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), row.questions);
      if (sample) await page.screenshot({ path: path.join(out, `${width}-concentration-bold-preview.png`), fullPage: false });
      if (captures.has(row.slug)) await page.screenshot({ path: path.join(out, `${width}-${row.slug}.png`), fullPage: true });
      viewport.pages.push({ slug: row.slug, layout, passed: true }); save();
      } catch (error) {
        result.errors.push(`${current}: ${error}`);
        viewport.pages.push({ slug: row.slug, passed: false, error: String(error) });
        await page.screenshot({ path: path.join(out, `failure-${width}-${row.slug}.png`), fullPage: true }).catch(() => {});
        save();
      }
    }
    await context.close();
  }));
  result.passed = result.errors.length === 0; result.finishedAt = new Date().toISOString(); save();
  await browser.close(); assert(result.passed, JSON.stringify(result.errors));
})().catch(async e => { result.passed = false; result.errors.push(String(e)); save(); if (browser) await browser.close().catch(() => {}); console.error(e); process.exitCode = 1; });
