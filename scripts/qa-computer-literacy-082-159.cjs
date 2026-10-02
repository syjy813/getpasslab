// Read-only browser QA of the built chapters 082–159. No production deployment.
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const evidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/audits/2026-10-02-computer-literacy-082-159/source-verification.json')));
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const chapterScope = c => `/computer-literacy/written/${c.subject_id === 1 ? 'computer-basics' : 'spreadsheets'}/`;
const previousEvidence = JSON.parse(fs.readFileSync(path.join(root, 'docs/audits/2026-09-30-computer-literacy-001-081/source-verification.json')));
const allChapters = [...previousEvidence.chapters, ...evidence.chapters];
for (const subject of ['computer-basics', 'spreadsheets']) {
  const directory = path.join(root, 'src/content/chapters/computer-literacy/written', subject);
  for (const file of fs.readdirSync(directory)) {
    const source = fs.readFileSync(path.join(directory, file), 'utf8');
    const slug = JSON.parse(source.match(/^slug: (.+)$/m)[1]);
    if (allChapters.some(c => c.slug === slug)) continue;
    allChapters.push({slug, subject_id: subject === 'computer-basics' ? 1 : 2, order: Number(source.match(/^order: (.+)$/m)[1])});
  }
}
const navigation = c => allChapters.filter(i => i.subject_id === c.subject_id).sort((a,b) => a.order - b.order);
const boundary = previousEvidence.chapters.at(-1);
const out = path.join(root, 'qa-results/computer-literacy-082-159');
fs.mkdirSync(out, { recursive: true });
const samples = [81, 82, 83, 85, 86, 89, 91, 93, 95, 97, 100, 101, 106, 108, 116, 117, 125, 127, 134, 138, 142, 151, 152, 153, 154, 155, 157, 158, 159];
const results = { base, startedAt: new Date().toISOString(), viewports: [], errors: [], screenshots: [], externalRequests: 'Advertising/tracking blocked; built assets and KaTeX CSS/fonts allowed', browser: 'Chromium; viewport emulation, not a physical phone' };
const save = () => fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(results, null, 2));
let browser;
let page;
let current = '';

async function capture(name, fullPage = false) {
  await page.screenshot({ path: path.join(out, name), fullPage });
  results.screenshots.push(name);
}
async function layout() {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const visible = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const overflow = [...document.querySelectorAll('main h1, main h2, main p, main li, main pre, main code, main table, dialog[open] li, dialog[open] p, dialog[open] img')].filter(visible).filter(e => {
      const r = e.getBoundingClientRect();
      return r.left < -1 || r.right > width + 1;
    }).map(e => ({ tag: e.tagName, text: e.textContent.slice(0, 100), width: e.clientWidth, scroll: e.scrollWidth }));
    const tables = [...document.querySelectorAll('main table')].map(e => ({ width: e.clientWidth, scrollWidth: e.scrollWidth, overflowX: getComputedStyle(e).overflowX, clipped: e.scrollWidth > e.clientWidth + 3 && getComputedStyle(e).overflowX === 'hidden' }));
    return { width, scrollWidth: document.documentElement.scrollWidth, overflow, tables };
  });
}
async function checkLayout(label) {
  const s = await layout();
  assert(s.scrollWidth <= s.width + 1, `${label}: document horizontal overflow ${JSON.stringify(s)}`);
  assert.deepEqual(s.overflow, [], `${label}: elements outside viewport`);
  assert(!s.tables.some(t => t.clipped), `${label}: table clipping`);
  return s;
}

(async () => {
  browser = await chromium.launch({ headless: true });
  for (const width of [390, 320, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768, deviceScaleFactor: 1 });
    await context.route('**/*', route => {
      const u = new URL(route.request().url());
      return u.origin === base || u.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort();
    });
    page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', e => results.errors.push({ page: current, error: String(e), type: 'pageerror' }));
    const viewport = { width, height: 844, pages: [] };
    results.viewports.push(viewport);
    const chapters = width === 320 ? evidence.chapters.filter(c => [97,100,106,134,154,157,158,159].includes(c.order)) : [boundary, ...evidence.chapters];
    for (const chapter of chapters) {
      current = `${width}px/${chapter.order}`;
      const record = { order: chapter.order, slug: chapter.slug, url: base + chapterScope(chapter) + chapter.slug + '/', dialogs: [] };
      viewport.pages.push(record);
      try {
        const response = await page.goto(record.url, { waitUntil: 'networkidle', timeout: 45000 });
        record.status = response.status();
        assert.equal(record.status, 200);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('main h1').textContent(), chapter.title);
        record.layout = await checkLayout(current);
        const ids = await page.locator('main [data-open]').evaluateAll(els => els.map(e => e.getAttribute('data-open')));
        assert.deepEqual(ids, [...chapter.primary, ...chapter.support]);
        if (samples.includes(chapter.order)) await capture(`${width}-chapter-${chapter.order}.png`, true);
        for (const id of ids) {
          const d = { id };
          record.dialogs.push(d);
          try {
            await page.locator(`[data-open="${id}"]`).click();
            const dialog = page.locator(`#q-${id}`);
            assert(await dialog.isVisible());
            assert.equal(await dialog.getAttribute('data-revealed'), 'false');
            const images = dialog.locator('img');
            if (await images.count()) {
              await images.first().scrollIntoViewIfNeeded();
              await images.evaluateAll(imgs => Promise.all(imgs.map(i => i.decode())));
              d.images = await images.evaluateAll(imgs => imgs.map(i => { const r = i.getBoundingClientRect(); return { src: i.currentSrc, alt: i.alt, naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight, width: r.width, height: r.height }; }));
              for (const image of d.images) {
                assert(image.alt && image.naturalWidth > 0 && image.width > 0 && image.width <= width);
                assert(Math.abs(image.width / image.height - image.naturalWidth / image.naturalHeight) < 0.005);
              }
            }
            d.layout = await checkLayout(`${current}/${id}`);
            await dialog.locator('[data-reveal]').click();
            assert.equal(await dialog.getAttribute('data-revealed'), 'true');
            const caution = dialog.locator('[data-question-caution]');
            if (await caution.count()) assert(await caution.isVisible());
            d.revealedLayout = await checkLayout(`${current}/${id}/answer`);
            if (width === 390 && ['20161022_008','20150307_001','20200704_001','20200229_012','20150627_028','20200704_021','20190831_028','20150307_005','20151017_006','20151017_035'].includes(id) && !results.screenshots.includes(`${width}-dialog-${id}.png`)) {
              if (await caution.count()) await caution.scrollIntoViewIfNeeded();
              await capture(`${width}-dialog-${id}.png`);
            }
            await dialog.locator('[data-close]').click();
            assert(!(await dialog.isVisible()));
            await page.locator(`[data-open="${id}"]`).click();
            assert.equal(await dialog.getAttribute('data-revealed'), 'false');
            if (await caution.count()) assert(!(await caution.isVisible()));
            await page.keyboard.press('Escape');
            assert(!(await dialog.isVisible()));
            d.openRevealCloseResetEscape = true;
          } catch (e) {
            d.error = String(e);
            results.errors.push({ page: current, question: id, error: String(e) });
            await capture(`failure-${width}-${chapter.order}-${id}.png`).catch(() => {});
            await page.keyboard.press('Escape').catch(() => {});
          }
        }
        const ordered = navigation(chapter);
        const at = ordered.findIndex(c => c.slug === chapter.slug);
        const scope = chapterScope(chapter);
        if (width < 768) {
          const previous = page.locator('.chapter-mobile-link.previous[href]');
          const next = page.locator('.chapter-mobile-link.next[href]');
          if (at > 0) assert.equal(await previous.getAttribute('href'), scope + ordered[at - 1].slug + '/');
          if (at < ordered.length - 1) assert.equal(await next.getAttribute('href'), scope + ordered[at + 1].slug + '/');
          else assert.equal(await page.locator('.chapter-mobile-link.next.is-disabled').getAttribute('aria-disabled'), 'true');
          if (samples.includes(chapter.order) && at < ordered.length - 1) {
            await next.click();
            await page.waitForURL(base + scope + ordered[at + 1].slug + '/');
            await page.locator('.chapter-mobile-link.previous[href]').click();
            await page.waitForURL(record.url);
            record.nextAndPreviousClicked = true;
          }
          const list = page.locator('details.learning-chapters');
          await list.locator('summary').click();
          const toc = await list.locator('nav a').evaluateAll(els => els.map(e => e.getAttribute('href')));
          assert.deepEqual(toc, ordered.map(c => scope + c.slug + '/'));
          assert(!toc.some(h => /P2-02a/.test(h)));
          await list.locator('summary').click();
          record.completeMobileToc = toc.length;
        } else {
          const toc = await page.locator('.chapter-side .side-nav a').evaluateAll(els => els.map(e => e.getAttribute('href')));
          assert.deepEqual(toc, ordered.map(c => scope + c.slug + '/'));
          const side = await page.locator('.chapter-side').boundingBox();
          const main = await page.locator('main').boundingBox();
          assert(side.x + side.width <= main.x + 1, 'PC sidebar/content overlap');
          record.completeDesktopToc = toc.length;
        }
        if (samples.includes(chapter.order)) {
          await page.goto(base + scope, {waitUntil:'networkidle'});
          await checkLayout(current + '/subject');
          for (const c of ordered) assert(await page.locator(`main a[href="${scope}${c.slug}/"]`).count(), 'subject missing chapter');
          await page.locator(`main a[href="${scope}${chapter.slug}/"]`).first().click();
          await page.waitForURL(record.url);
          record.subjectTocClicked = true;
        }
        record.adSlots = await page.locator('[data-adfit-responsive]').evaluateAll(els => els.map(e => {
          const r=e.getBoundingClientRect(), mount=e.querySelector('[data-adfit-mount]').getBoundingClientRect();
          return {preview:e.dataset.adfitReady, size:e.dataset.adfitSize, width:r.width, height:r.height, mountWidth:mount.width, mountHeight:mount.height, left:mount.left, right:mount.right};
        }));
        for (const ad of record.adSlots) {
          assert.equal(ad.preview,'preview');
          assert(ad.height >= ad.mountHeight && ad.left >= 0 && ad.right <= width + 1, 'reserved advertisement slot clipped');
        }

      } catch (e) {
        record.error = String(e);
        results.errors.push({ page: current, error: String(e) });
        await capture(`failure-${width}-${chapter.order}.png`).catch(() => {});
      }
      save();
      console.log(`${current}: ${record.error ? 'FAIL' : 'checked'}; ${record.dialogs.length} dialogs`);
    }
    await context.close();
  }
  results.passed = results.errors.length === 0;
  results.finishedAt = new Date().toISOString();
  save();
  await browser.close();
  console.log(JSON.stringify({ passed: results.passed, pages: results.viewports.map(v => ({ width: v.width, pages: v.pages.length })), errors: results.errors }));
  if (!results.passed) process.exitCode = 1;
})().catch(async e => {
  results.passed = false;
  results.failure = String(e);
  save();
  if (browser) await browser.close().catch(() => {});
  console.error(e);
  process.exitCode = 1;
});
