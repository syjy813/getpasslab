// Check the image resources and their actual readable size in the chapter layout.
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const out = path.resolve('qa-results/industrial-safety-machine-tools-split');
const brief = JSON.parse(fs.readFileSync('docs/audits/2026-10-04-machine-tools-visuals/brief.json'));
const illustration = JSON.parse(fs.readFileSync('docs/audits/2026-10-04-lathe-illustrated-learning/image-spec.json'));
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
        const expected = illustration[f.slug] || { src: `/images/industrial-safety/${f.slug.replace('-safety', '')}-motion.svg`, alt: f.alt, width: 360, minFontSize: 22 };
        const response = await page.goto(`${base}/industrial-safety/written/mechanical/${f.slug}/`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        const figure = page.locator('article .learning-visuals figure');
        assert.equal(await figure.count(), 1);
        const img = figure.locator('img');
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(el => el.decode());
        const state = await img.evaluate(el => ({ src: el.getAttribute('src'), alt: el.alt, width: el.clientWidth, naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight, viewportWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
        assert.equal(state.src, expected.src);
        assert.equal(state.alt, expected.alt);
        assert.equal(state.naturalWidth, expected.width);
        if (expected.height) {
          assert.equal(state.naturalHeight, expected.height);
          assert.equal(await img.getAttribute('width'), String(expected.width));
          assert.equal(await img.getAttribute('height'), String(expected.height));
          const definitionOrder = await page.evaluate(() => {
            const article = document.querySelector('article');
            const visual = article.querySelector('.learning-visuals');
            const headings = [...article.querySelectorAll('h2')];
            const movement = headings.find(h => h.textContent === '선반의 움직임');
            const chips = headings.find(h => h.textContent === '칩을 끊는 장치와 막는 장치');
            const definitions = visual.previousElementSibling;
            return Boolean(movement && chips && definitions?.tagName === 'UL' && definitions.textContent.includes('척') && definitions.textContent.includes('바이트') && definitions.textContent.includes('가공할 재료') && (movement.compareDocumentPosition(visual) & Node.DOCUMENT_POSITION_FOLLOWING) && (visual.compareDocumentPosition(chips) & Node.DOCUMENT_POSITION_FOLLOWING));
          });
          assert(definitionOrder, 'lathe illustration must follow the definitions in the movement section');
        }
        assert(state.width >= 240);
        assert(state.scrollWidth <= state.viewportWidth + 1);
        const minLabelPx = expected.minFontSize * state.width / expected.width;
        assert(minLabelPx >= 14, `${f.slug}: labels too small`);
        const screenshot = `${width}-${f.slug}-figure.png`;
        await figure.evaluate(el => el.scrollIntoView({ block: 'center' }));
        await figure.screenshot({ path: path.join(out, screenshot) });
        const imageResponse = await context.request.get(base + state.src);
        assert.equal(imageResponse.status(), 200);
        const bytes = await imageResponse.body();
        assert.deepEqual(bytes, fs.readFileSync('public' + state.src));
        if (state.src.endsWith('.svg')) {
          const svg = bytes.toString('utf8');
          assert(svg.includes('학습용 재구성'));
          assert(!svg.includes('テーブル'));
          assert(!svg.includes('<script'));
        } else {
          assert.equal(bytes.subarray(0, 4).toString(), 'RIFF');
          assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
        }
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
