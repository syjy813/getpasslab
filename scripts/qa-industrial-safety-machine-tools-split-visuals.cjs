// Check the image resources and their actual readable size in the chapter layout.
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const out = path.resolve('qa-results/industrial-safety-machine-tools-split');
const brief = JSON.parse(fs.readFileSync('docs/audits/2026-10-04-machine-tools-visuals/brief.json'));
const results = { base, type: 'CI preview image QA', pages: [], errors: [] };
(async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 844 } });
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        return url.origin === base || url.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      for (const f of brief.figures) {
        const response = await page.goto(`${base}/industrial-safety/written/mechanical/${f.slug}/`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        const figure = page.locator('article .learning-visuals figure');
        assert.equal(await figure.count(), 1);
        const img = figure.locator('img');
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(el => el.decode());
        const state = await img.evaluate(el => ({ src: el.getAttribute('src'), alt: el.alt, width: el.clientWidth, naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight, viewportWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
        assert.equal(state.src, `/images/industrial-safety/${f.slug.replace('-safety', '')}-motion.svg`);
        assert.equal(state.alt, f.alt);
        assert.equal(state.naturalWidth, 360);
        assert(state.width >= 240);
        assert(state.scrollWidth <= state.viewportWidth + 1);
        const minLabelPx = 22 * state.width / 360;
        assert(minLabelPx >= 14, `${f.slug}: labels too small`);
        const screenshot = `${width}-${f.slug}-figure.png`;
        await figure.evaluate(el => el.scrollIntoView({ block: 'center' }));
        await figure.screenshot({ path: path.join(out, screenshot) });
        const imageResponse = await context.request.get(base + state.src);
        assert.equal(imageResponse.status(), 200);
        const svg = await imageResponse.text();
        assert(svg.includes('학습용 재구성'));
        assert(!svg.includes('テーブル'));
        assert(!svg.includes('<script'));
        assert.equal(svg, fs.readFileSync('public' + state.src, 'utf8'));
        results.pages.push({ slug: f.slug, viewport: width, ...state, minLabelPx, screenshot, passed: true });
      }
      await context.close();
    }
    results.passed = true;
  } catch (e) {
    results.errors.push(String(e));
    process.exitCode = 1;
  } finally {
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'visual-results.json'), JSON.stringify(results, null, 2) + '\n');
    await browser.close();
  }
})();
