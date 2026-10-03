// Read-only browser QA of a branch build; no production deployment.
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const audit = path.join(root, 'docs/audits/2026-10-03-industrial-safety-machine-tools-split');
const evidence = JSON.parse(fs.readFileSync(path.join(audit, 'source-verification.json')));
const questions = new Map(JSON.parse(fs.readFileSync(path.join(root, 'src/data/questions/industrial-safety.json'))).map(q => [q.id, q]));
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const scope = '/industrial-safety/written/mechanical/';
const out = path.join(root, 'qa-results/industrial-safety-machine-tools-split');
fs.mkdirSync(out, { recursive: true });
const results = { base, startedAt: new Date().toISOString(), viewports: [], errors: [], screenshots: [], browser: 'Chromium viewport emulation; not a physical phone', externalRequests: 'Advertising/tracking blocked; local assets and jsDelivr fonts/CSS allowed' };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2) + '\n');
let browser;
let page;
let current = '';

async function capture(name, fullPage = false) {
  await page.screenshot({ path: path.join(out, name), fullPage });
  results.screenshots.push(name);
}
async function checkLayout() {
  const state = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const visible = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const overflow = [...document.querySelectorAll('main h1, main h2, main p, main li, main table, .chapter-mobile-nav a, dialog[open] li, dialog[open] .q-body')].filter(visible).filter(e => {
      const r = e.getBoundingClientRect();
      return r.left < -1 || r.right > width + 1;
    }).map(e => ({ tag: e.tagName, text: e.textContent.slice(0, 80) }));
    const tables = [...document.querySelectorAll('main table')].map(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth, clipped: e.scrollWidth > e.clientWidth + 3 && getComputedStyle(e).overflowX === 'hidden' }));
    return { width, scrollWidth: document.documentElement.scrollWidth, overflow, tables };
  });
  assert(state.scrollWidth <= state.width + 1, `${current}: horizontal page overflow`);
  assert.deepEqual(state.overflow, [], `${current}: content outside viewport`);
  assert(!state.tables.some(t => t.clipped), `${current}: table clipping`);
  return state;
}
async function goto(url) {
  const response = await page.goto(base + url, { waitUntil: 'networkidle', timeout: 45000 });
  assert.equal(response.status(), 200, `${url}: HTTP status`);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('main h1').count(), 1);
  return response.status();
}

(async () => {
  browser = await chromium.launch({ headless: true });
  for (const width of [390, 1440, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768, deviceScaleFactor: 1 });
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      return url.origin === base || url.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort();
    });
    page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', e => results.errors.push({ page: current, type: 'pageerror', error: String(e) }));
    page.on('response', r => {
      if (r.url().startsWith(base) && r.status() >= 400) results.errors.push({ page: current, type: 'local-http', url: r.url(), status: r.status() });
    });
    const viewport = { width, height: 844, pages: [], regression: [] };
    results.viewports.push(viewport);
    for (const [slug, expected] of Object.entries(evidence.allocations)) {
      current = `${width}px/${slug}`;
      const record = { slug, url: base + scope + slug + '/', dialogs: [] };
      viewport.pages.push(record);
      try {
        record.status = await goto(scope + slug + '/');
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://getpasslab.co.kr' + scope + slug + '/');
        record.title = await page.locator('main h1').textContent();
        record.layout = await checkLayout();
        assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), expected);
        if (width === 1440) assert(await page.locator('.chapter-side').isVisible());
        await capture(`${width}-${slug}.png`, true);
        for (const id of expected) {
          const canonical = questions.get(id);
          const d = { id, expectedAnswer: canonical.answer };
          record.dialogs.push(d);
          await page.locator(`[data-open="${id}"]`).click();
          const dialog = page.locator('#deferred-question-dialog');
          await dialog.waitFor({ state: 'visible' });
          await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
          assert.equal(await dialog.getAttribute('data-revealed'), 'false');
          assert.equal(await dialog.locator('[data-question-body]').textContent(), canonical.body);
          const choices = await dialog.locator('.q-choices li').evaluateAll(els => els.map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim()));
          assert.deepEqual(choices, canonical.choices.map((c, i) => `${['①','②','③','④'][i]} ${c}`));
          assert.equal(await dialog.locator('.q-answer-mark').isVisible(), false);
          d.layout = await checkLayout();
          await dialog.locator('[data-reveal]').click();
          assert.equal(await dialog.getAttribute('data-revealed'), 'true');
          assert(await dialog.locator('.q-answer-mark').isVisible());
          assert.equal(await dialog.locator('.q-choices li').evaluateAll(els => els.findIndex(e => e.classList.contains('is-answer')) + 1), canonical.answer);
          d.revealedLayout = await checkLayout();
          if (id === expected[0]) await capture(`${width}-${slug}-answer.png`);
          await dialog.locator('[data-close]').click();
          assert.equal(await dialog.isVisible(), false);
          await page.locator(`[data-open="${id}"]`).click();
          await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
          assert.equal(await dialog.getAttribute('data-revealed'), 'false');
          assert.equal(await dialog.locator('.q-answer-mark').isVisible(), false);
          await page.keyboard.press('Escape');
          assert.equal(await dialog.isVisible(), false);
          d.bodyChoicesAnswerOpenRevealCloseResetEscape = true;
        }
        const related = page.locator('.related-list a');
        const targets = await related.evaluateAll(els => els.map(e => new URL(e.href).pathname));
        record.related = targets;
        const wanted = slug === 'machine-tools-safety' ? Object.keys(evidence.allocations).filter(s => s !== slug) : ['machine-tools-safety'];
        for (const target of wanted) {
          assert(targets.includes(scope + target + '/'));
          await page.locator(`.related-list a[href="${scope}${target}/"]`).click();
          await page.waitForURL(base + scope + target + '/');
          await goto(scope + slug + '/');
        }
        if (width < 768) {
          record.previousNext = [];
          for (const direction of ['previous', 'next']) {
            const link = page.locator(`.chapter-mobile-link.${direction}[href]`);
            if (!await link.count()) continue;
            const href = await link.getAttribute('href');
            await link.click();
            await page.waitForURL(base + href);
            await checkLayout();
            record.previousNext.push(href);
            await goto(scope + slug + '/');
          }
        }
        record.passed = true;
      } catch (error) {
        record.error = String(error);
        results.errors.push({ page: current, error: String(error) });
        await capture(`failure-${width}-${slug}.png`).catch(() => {});
        await page.keyboard.press('Escape').catch(() => {});
      }
      save();
      console.log(`${current}: ${record.passed ? 'PASS' : 'FAIL'}; ${record.dialogs.length} dialogs`);
    }
    current = `${width}px/mechanical-toc`;
    await goto(scope);
    const toc = { url: base + scope, layout: await checkLayout(), clickedChapters: [] };
    viewport.toc = toc;
    await capture(`${width}-mechanical-toc.png`, true);
    for (const slug of Object.keys(evidence.allocations)) {
      await page.locator(`main a.card[href="${scope}${slug}/"]`).click();
      await page.waitForURL(base + scope + slug + '/');
      toc.clickedChapters.push(slug);
      await goto(scope);
    }
    for (const url of ['/', '/industrial-safety/', scope + 'shaper-structure/', '/computer-literacy/written/computer-basics/']) {
      current = `${width}px/regression/${url}`;
      const status = await goto(url);
      viewport.regression.push({ url: base + url, status, layout: await checkLayout() });
    }
    save();
    await context.close();
  }
  results.passed = results.errors.length === 0;
  results.finishedAt = new Date().toISOString();
  save();
  await browser.close();
  console.log(JSON.stringify({ passed: results.passed, viewports: results.viewports.map(v => ({ width: v.width, splitPages: v.pages.length, dialogs: v.pages.reduce((n,p) => n + p.dialogs.length, 0), regressionPages: v.regression.length })), errors: results.errors }));
  if (!results.passed) process.exitCode = 1;
})().catch(async error => {
  results.passed = false;
  results.failure = String(error);
  save();
  if (browser) await browser.close().catch(() => {});
  console.error(error);
  process.exitCode = 1;
});
