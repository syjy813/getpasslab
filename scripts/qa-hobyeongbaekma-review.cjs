const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const route = '/facility-management/career/hobyeongbaekma/';
const root = 'docs/drafts/facility/hobyeongbaekma';
const images = JSON.parse(fs.readFileSync(root + '/image-manifest.json')).images;
const output = 'tmp/hobyeongbaekma-review';
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.route('**/*', r => new URL(r.request().url()).origin === new URL(base).origin ? r.continue() : r.abort());
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      assert.equal((await page.goto(base + route)).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('.facility-summary').count(), 1);
      assert.equal(await page.locator('.facility-body h1').count(), 0);
      assert.equal(await page.locator('.facility-body h2').count(), 7);
      assert.equal(await page.locator('.facility-body h3').count(), 3);
      assert.equal(await page.locator('.facility-body table').count(), 2);
      assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, nofollow');
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://getpasslab.co.kr' + route);
      assert.equal(await page.locator('.facility-article > article > header time').count(), 0, 'Draft does not display a publication date');
      assert.equal(await page.locator('.facility-body img').count(), images.length);
      assert.equal(await page.locator('a[href*="hobyeongbaekma/"]').count(), 0, 'Future episodes have no broken links');
      for (const row of images) {
        const img = page.locator('img[src$="/' + row.id + '.webp"]');
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(el => el.decode());
        const info = await img.evaluate(el => {
          const r = el.getBoundingClientRect(), b = el.closest('.facility-body').getBoundingClientRect();
          return { loaded: el.complete && el.naturalWidth > 0, alt: el.alt, width: el.naturalWidth, height: el.naturalHeight, ratio: r.width / r.height, inside: r.left >= b.left - 1 && r.right <= b.right + 1 };
        });
        assert(info.loaded && info.alt && info.inside);
        assert.equal(info.width, row.width); assert.equal(info.height, row.height);
        assert(Math.abs(info.ratio - row.width / row.height) < .01);
      }
      assert(await page.locator('.facility-body').innerText().then(t => !/EDITOR_NOTES|SOURCE_AUDIT|editorial-review|proposedPath|46명/.test(t)));
      const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
      assert(schema.every(s => { const value = JSON.parse(s); return !(Array.isArray(value) ? value : [value]).some(x => x['@type'] === 'Article'); }));
      const geometry = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert(geometry.scroll <= geometry.client + 1, 'No page overflow');
      await page.locator('.facility-toc summary').click();
      await page.locator('.facility-toc a').first().click();
      const target = await page.locator('.facility-toc a').first().getAttribute('href');
      await page.waitForFunction(id => document.getElementById(id).getBoundingClientRect().top >= document.querySelector('.gnb').getBoundingClientRect().bottom - 1, target.slice(1));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: `${output}/episode00-${width}.png`, fullPage: true });
      assert.deepEqual(errors, []);
      results.push({ width, images: images.length, h1: 1, h2: 7, h3: 3, tables: 2, ...geometry, toc: 'PASS', runtimeErrors: 0 });
      await page.close();
    }
    fs.writeFileSync(output + '/results.json', JSON.stringify({ route, production: false, results }, null, 2));
    console.log('Hobyeongbaekma review: 4 viewports, 7 images, draft metadata/tables/TOC PASS');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
