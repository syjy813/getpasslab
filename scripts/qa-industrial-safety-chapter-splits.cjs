const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const review = JSON.parse(fs.readFileSync('docs/audits/2026-10-04-industrial-safety-chapter-splits/review.json'));
const questions = new Map(JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json')).map(q => [q.id, q]));
const images = new Set(JSON.parse(fs.readFileSync('src/data/question-assets/industrial-safety.json')).map(q => q.id));
const subjects = { 1: 'safety-management', 2: 'ergonomics', 3: 'mechanical', 4: 'electrical', 5: 'chemical', 6: 'construction' };
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = path.resolve(process.env.QA_OUTPUT_DIR || 'qa-results/industrial-safety-chapter-splits');
fs.mkdirSync(out, { recursive: true });
const result = { base, startedAt: new Date().toISOString(), device: 'Chromium viewport emulation, not a physical phone', viewports: [], errors: [] };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
const url = row => `/industrial-safety/written/${subjects[row.subject_id]}/${row.slug}/`;
const bySlug = new Map(review.chapters.map(c => [c.slug, c]));
const parents = new Set(review.families.map(f => f.parent));
const captureTargets = new Set(['hazop-guidewords', 'tunnel-support-safety', 'maslow-needs', 'leakage-breaker-ratings', 'euler-buckling-load', 'mixed-gas-explosion-limits', 'ndt-types']);
let browser, current;
async function layout(page) {
  const state = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const overflow = [...document.querySelectorAll('article h1, article h2, article p, article li, article table, .chapter-mobile-nav a, dialog[open] .q-body')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.left < -1 || r.right > width + 1); }).map(e => ({ tag: e.tagName, text: e.textContent.slice(0, 80) }));
    const tables = [...document.querySelectorAll('article table')].map(e => ({ width: e.clientWidth, scroll: e.scrollWidth, cells: [...e.querySelectorAll('th,td')].map(c => ({ client: c.clientWidth, scroll: c.scrollWidth, font: parseFloat(getComputedStyle(c).fontSize) })) }));
    return { width, scroll: document.documentElement.scrollWidth, overflow, tables };
  });
  assert(state.scroll <= state.width + 1, `${current}: page overflow`);
  assert.deepEqual(state.overflow, [], `${current}: viewport clipping`);
  assert(state.tables.every(t => t.scroll <= t.width + 2 && t.cells.every(c => c.scroll <= c.client + 2 && c.font >= 13)), `${current}: table readability`);
  assert.equal(await page.locator('.katex-error').count(), 0);
  return state;
}
(async () => {
  browser = await chromium.launch();
  // Exact build comparison also makes this reusable against Production.
  for (const row of review.chapters) {
    const response = await fetch(base + url(row));
    assert.equal(response.status, 200, `${row.slug}: HTTP`);
    const actual = Buffer.from(await response.arrayBuffer()), expected = fs.readFileSync('dist' + url(row) + 'index.html');
    assert.equal(createHash('sha256').update(actual).digest('hex'), createHash('sha256').update(expected).digest('hex'), `${row.slug}: served HTML differs from reviewed build`);
  }
  result.exactHtmlMatches = review.chapters.length;
  for (const width of [390, 1440, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', route => { const u = new URL(route.request().url()); return u.origin === new URL(base).origin || u.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort(); });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', e => result.errors.push(`${current}: ${e}`));
    page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) result.errors.push(`${current}: ${r.status()} ${r.url()}`); });
    const viewport = { width, pages: [], navigation: [], regression: [] }; result.viewports.push(viewport);
    for (const row of review.chapters) {
      current = `${width}/${row.slug}`;
      assert.equal((await page.goto(base + url(row), { waitUntil: 'networkidle' })).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), row.url);
      const record = { slug: row.slug, layout: await layout(page), dialogs: [] }; viewport.pages.push(record);
      assert.deepEqual(await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.dataset.open)), row.questions);
      if (width === 1440) assert(await page.locator('.chapter-side').isVisible());
      const nav = await page.locator('.chapter-mobile-nav a').evaluateAll(els => els.map(e => e.getAttribute('href')));
      for (const target of nav) assert.equal((await context.request.get(base + target)).status(), 200, `${current}: previous/next link`);
      for (const target of row.related) {
        const link = page.locator('.related-list a').filter({ hasText: bySlug.get(target)?.title || '' });
        if (bySlug.has(target)) assert(await link.count() > 0, `${current}: related ${target}`);
      }
      if ((width === 390 && parents.has(row.slug)) || captureTargets.has(row.slug)) {
        await page.screenshot({ path: path.join(out, `${width}-${row.slug}.png`), fullPage: true });
      }
      for (const id of row.questions) {
        const canonical = questions.get(id), dialog = page.locator('#deferred-question-dialog');
        await page.locator(`[data-open="${id}"]`).click();
        await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
        assert.equal(await dialog.getAttribute('data-revealed'), 'false');
        assert.equal(await dialog.locator('[data-question-body]').textContent(), canonical.body);
        assert.deepEqual(await dialog.locator('.q-choices li').evaluateAll(els => els.map(e => [...e.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim())), canonical.choices.map((c, i) => `${['①','②','③','④'][i]} ${c}`));
        if (images.has(id)) {
          const image = dialog.locator('img.q-image'); await image.waitFor({ state: 'visible' });
          await image.evaluate(img => img.decode());
          assert(await image.evaluate(img => img.naturalWidth > 0 && img.getBoundingClientRect().width <= document.documentElement.clientWidth));
        }
        assert.equal(await dialog.locator('.q-answer-mark').isVisible(), false);
        await dialog.locator('[data-reveal]').click();
        assert.equal(await dialog.getAttribute('data-revealed'), 'true');
        assert.equal(await dialog.locator('.q-choices li').evaluateAll(els => els.findIndex(el => el.classList.contains('is-answer')) + 1), canonical.answer);
        await layout(page);
        await dialog.locator('[data-close]').click(); assert.equal(await dialog.isVisible(), false);
        await page.locator(`[data-open="${id}"]`).click();
        await dialog.locator('[data-reveal]').waitFor({ state: 'visible' });
        assert.equal(await dialog.getAttribute('data-revealed'), 'false');
        assert.equal(await dialog.locator('.q-answer-mark').isVisible(), false);
        await page.keyboard.press('Escape'); assert.equal(await dialog.isVisible(), false);
        record.dialogs.push({ id, answer: canonical.answer, image: images.has(id), bodyChoicesAnswerRevealCloseResetEscape: true });
      }
      record.passed = true; save(); console.log(`${current}: ${row.questions.length} questions PASS`);
    }
    // Follow every parent-child return link using the real rendered UI.
    for (const family of review.families) {
      const parent = bySlug.get(family.parent);
      for (const slug of family.children) {
        const child = bySlug.get(slug);
        await page.goto(base + url(parent), { waitUntil: 'networkidle' });
        await page.locator(`.related-list a[href="${url(child)}"]`).click();
        await page.waitForURL(base + url(child));
        await page.locator(`.related-list a[href="${url(parent)}"]`).click();
        await page.waitForURL(base + url(parent));
        viewport.navigation.push({ parent: family.parent, child: slug, passed: true });
      }
    }
    for (const target of ['/industrial-safety/written/mechanical/lathe-safety/', '/industrial-safety/written/safety-management/accident-analysis-tools/', '/computer-literacy/written/computer-basics/ipv4-ipv6-addresses/', '/energy-management/written/thermal-equipment/boiler-types-construction/']) {
      assert(fs.existsSync('dist' + target + 'index.html'), `missing regression route ${target}`);
      current = `${width}/regression${target}`;
      assert.equal((await page.goto(base + target, { waitUntil: 'networkidle' })).status(), 200);
      await layout(page);
      viewport.regression.push({ url: target, passed: true });
    }
    await context.close(); save();
  }
  result.passed = result.errors.length === 0; result.finishedAt = new Date().toISOString(); save();
  await browser.close(); assert(result.passed, JSON.stringify(result.errors));
})().catch(async e => { result.passed = false; result.errors.push(String(e)); save(); if (browser) await browser.close().catch(() => {}); console.error(e); process.exitCode = 1; });
