const assert = require('node:assert/strict');
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');

const base = 'http://127.0.0.1:4321';
const categories = ['career', 'jobs', 'qualifications', 'practice'];

(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 950 } });
      await context.route('**/*', request => new URL(request.request().url()).origin === base
        ? request.continue() : request.abort());
      const page = await context.newPage();
      for (const category of categories) {
        const response = await page.goto(`${base}/facility-management/${category}/`);
        assert.equal(response.status(), 200, `${category}: page status`);
        const grid = page.locator('[data-facility-article-grid]');
        if (await grid.count() === 0) {
          assert.equal(await page.locator('[data-facility-sort]').count(), 0);
          continue;
        }
        const cards = grid.locator(':scope > a.facility-card');
        const count = await cards.count();
        assert.ok(count > 0);
        await page.waitForFunction(() => [...document.querySelectorAll('#facility-article-grid > a.facility-card')]
          .every(card => card.dataset.viewCount !== undefined));
        const initial = await cards.evaluateAll(items => items.map(card => ({
          href: card.getAttribute('href'),
          date: card.dataset.publishedAt,
          index: Number(card.dataset.sortIndex),
          views: Number(card.dataset.viewCount),
          recorded: card.dataset.viewRecorded === 'true',
          label: card.querySelector('.facility-card-meta')?.textContent ?? '',
        })));
        assert.equal(initial.length, count);
        assert.ok(initial.every((item, index) => item.index === index && item.label.includes('조회')));

        const expected = [...initial].sort((a, b) => Number(b.recorded) - Number(a.recorded)
          || b.views - a.views || b.date.localeCompare(a.date) || a.index - b.index).map(item => item.href);
        const select = page.locator('[data-facility-sort]');
        assert.equal(await select.inputValue(), 'latest');
        await select.selectOption('views');
        assert.deepEqual(await cards.evaluateAll(items => items.map(card => card.getAttribute('href'))), expected,
          `${category}/${width}: view-count sorting`);
        await select.selectOption('latest');
        assert.deepEqual(await cards.evaluateAll(items => items.map(card => card.getAttribute('href'))), initial.map(item => item.href),
          `${category}/${width}: restore latest sorting`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        assert.ok(overflow <= 1, `${category}/${width}: horizontal overflow ${overflow}`);
      }
      await context.close();
      console.log(`PASS facility GA4 sort at ${width}px`);
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
