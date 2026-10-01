const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const root = require('node:path').resolve(__dirname, '../../..');
const out = `${root}/docs/audits/2026-09-30-computer-literacy-001-081`;
const evidence = JSON.parse(fs.readFileSync(`${out}/source-verification.json`));
const scope = '/computer-literacy/written/computer-basics/';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4325';
const results = { base, viewport: { width: 390, height: 844 }, externalRequests: 'blocked; local content and interaction QA only', pages: [], screenshots: [], errors: [] };
fs.mkdirSync(`${out}/screenshots`, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.QA_CHROMIUM_PATH ? { executablePath: process.env.QA_CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: results.viewport, deviceScaleFactor: 1 });
  await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('pageerror', error => results.errors.push(String(error)));
  const layout = async () => page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const overflow = [...document.querySelectorAll('main h1, main h2, main p, main table, main code, dialog[open], dialog[open] .q-inner, dialog[open] img')].filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.left < -1 || r.right > width + 1 || el.scrollWidth > el.clientWidth + 2 && el.tagName !== 'CODE' && el.clientWidth > 0);
    }).map(el => ({ tag: el.tagName, class: el.className, text: el.textContent.slice(0, 80), scroll: el.scrollWidth, client: el.clientWidth }));
    return { width, scrollWidth: document.documentElement.scrollWidth, overflow };
  });
  for (const chapter of evidence.chapters) {
    const response = await page.goto(base + scope + chapter.slug + '/', { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    const before = await layout();
    assert(before.scrollWidth <= before.width, `${chapter.order}: document overflow`);
    assert.deepEqual(before.overflow, [], `${chapter.order}: element overflow`);
    const record = { order: chapter.order, slug: chapter.slug, status: response.status(), layout: before, dialogs: [], images: [] };
    if ([34, 64, 81].includes(chapter.order)) {
      const file = `screenshots/mobile-${chapter.order}-${chapter.slug}.png`;
      await page.screenshot({ path: `${out}/${file}`, fullPage: true }); results.screenshots.push(file);
    }
    for (const id of [...chapter.primary, ...chapter.support]) {
      await page.locator(`[data-open="${id}"]`).click();
      const dialog = page.locator(`#q-${id}`);
      assert(await dialog.isVisible(), `${id}: open`);
      assert.equal(await dialog.getAttribute('data-revealed'), 'false');
      const image = dialog.locator('img');
      if (await image.count()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(img => img.decode());
        const data = await image.evaluate(img => ({ src: img.getAttribute('src'), alt: img.alt, naturalWidth: img.naturalWidth, width: img.getBoundingClientRect().width }));
        assert(data.alt && data.naturalWidth > 0 && data.width <= 390); record.images.push({ id, ...data });
      }
      const inDialog = await layout();
      assert.deepEqual(inDialog.overflow, [], `${chapter.order}/${id}: dialog overflow`);
      await dialog.locator('[data-reveal]').click();
      assert.equal(await dialog.getAttribute('data-revealed'), 'true');
      const caution = dialog.locator('[data-question-caution]');
      if (await caution.count()) assert(await caution.isVisible());
      if ([['software-license-types', '20151017_009'], ['device-manager', '20150627_013'], ['disk-format-file-systems', '20161022_018']].some(([s, q]) => s === chapter.slug && q === id)) {
        if (await caution.count()) await caution.scrollIntoViewIfNeeded();
        else await dialog.locator('.q-inner').evaluate(el => el.scrollTop = 0);
        const file = `screenshots/mobile-dialog-${id}.png`;
        await page.screenshot({ path: `${out}/${file}` }); results.screenshots.push(file);
      }
      await dialog.locator('[data-close]').click();
      assert(!(await dialog.isVisible()));
      await page.locator(`[data-open="${id}"]`).click();
      assert.equal(await dialog.getAttribute('data-revealed'), 'false');
      if (await caution.count()) assert(!(await caution.isVisible()));
      await page.keyboard.press('Escape');
      assert(!(await dialog.isVisible()));
      record.dialogs.push({ id, openRevealCloseResetEscape: true });
    }
    const previous = page.locator('.chapter-mobile-link.previous[href]');
    const next = page.locator('.chapter-mobile-link.next[href]');
    if (chapter.order > 1) assert.equal(await previous.getAttribute('href'), scope + evidence.chapters[chapter.order - 2].slug + '/');
    if (chapter.order < 81) assert.equal(await next.getAttribute('href'), scope + evidence.chapters[chapter.order].slug + '/');
    results.pages.push(record);
    if (chapter.order % 10 === 0) console.log(`390px QA: ${chapter.order}/81`);
  }
  results.additionalViewports = [];
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const order of [28, 34, 43, 48, 64, 66, 68, 71, 81]) {
      const chapter = evidence.chapters[order - 1];
      await page.goto(base + scope + chapter.slug + '/', { waitUntil: 'networkidle' });
      const state = await layout();
      assert(state.scrollWidth <= width);
      assert.deepEqual(state.overflow, [], `${width}px/${order}`);
      for (const id of [...chapter.primary, ...chapter.support]) {
        await page.locator(`[data-open="${id}"]`).click();
        const dialogState = await layout();
        assert.deepEqual(dialogState.overflow, [], `${width}px/${order}/${id}`);
        await page.keyboard.press('Escape');
      }
      results.additionalViewports.push({ width, order, layout: state });
    }
    if (width === 1440) {
      const file = 'screenshots/desktop-81-user-accounts-uac.png';
      await page.screenshot({ path: `${out}/${file}`, fullPage: true }); results.screenshots.push(file);
    }
  }
  assert.deepEqual(results.errors, []);
  results.passed = true;
  fs.writeFileSync(`${out}/browser-qa.json`, JSON.stringify(results, null, 2) + '\n');
  console.log(`PASS: ${results.pages.length} pages; ${results.pages.reduce((n,p)=>n+p.dialogs.length,0)} dialogs at390px; ${results.additionalViewports.length} additional samples`);
  await browser.close();
})().catch(error => { results.passed = false; results.failure = String(error); fs.writeFileSync(`${out}/browser-qa.json`, JSON.stringify(results, null, 2)); console.error(error); process.exit(1); });
