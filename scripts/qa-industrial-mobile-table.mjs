import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve('dist');
const walk = async dir => (await Promise.all((await fs.readdir(dir, { withFileTypes: true })).map(async entry => {
  const p = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(p) : [p];
}))).flat();
const pages = (await walk(path.join(root, 'industrial-safety', 'written'))).filter(p => p.endsWith('index.html'));
let lesson;
for (const file of pages) {
  const html = await fs.readFile(file, 'utf8');
  if (html.includes('금지표지') && html.includes('전달 목적')) { lesson = file; break; }
}
assert(lesson, 'Find a published industrial-safety signs table with both header and body');
const mime = p => p.endsWith('.html') ? 'text/html; charset=utf-8' : p.endsWith('.css') ? 'text/css' : p.endsWith('.js') ? 'text/javascript' : p.endsWith('.svg') ? 'image/svg+xml' : p.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname.replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    assert(target.startsWith(root + path.sep) || target === root);
    let bytes;
    try { bytes = await fs.readFile(target); }
    catch { bytes = await fs.readFile(path.join(target, 'index.html')); }
    const resolved = (await fs.stat(target).catch(() => null))?.isDirectory() ? path.join(target, 'index.html') : target;
    res.writeHead(200, { 'content-type': mime(resolved) });
    res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const relativeLesson = path.relative(root, lesson).split(path.sep).join('/');
const url = base + '/' + relativeLesson;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await fs.mkdir('qa-results/industrial-mobile-table', { recursive: true });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const article = document.querySelector('.industrial-safety-chapter article');
      const table = [...article.querySelectorAll('table')].find(el => el.textContent.includes('금지표지') && el.textContent.includes('전달 목적'));
      if (!table) return null;
      const lastHeading = table.tHead?.rows[0]?.lastElementChild;
      const lastBody = table.tBodies[0]?.rows[0]?.lastElementChild;
      return {
        tableRight: table.getBoundingClientRect().right,
        headingRight: lastHeading?.getBoundingClientRect().right,
        bodyRight: lastBody?.getBoundingClientRect().right,
        articleRight: article.getBoundingClientRect().right,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        display: getComputedStyle(table).display,
        wrapped: Boolean(table.closest('.industrial-table-scroll')),
      };
    });
    assert(result, width + ': safety-sign table found');
    assert.equal(result.display, 'table', width + ': native table display');
    assert(Math.abs(result.tableRight - result.headingRight) < 3, width + ': heading fills table');
    assert(Math.abs(result.headingRight - result.bodyRight) < 3, width + ': header and body tracks align');
    if (width <= 390) {
      assert(result.tableRight <= result.articleRight + 2, width + ': short table does not overflow');
      assert(!result.wrapped, width + ': short table does not need horizontal scroll');
      assert(result.documentWidth <= result.viewportWidth + 2, width + ': no page-level horizontal scroll');
    }
    await page.screenshot({ path: 'qa-results/industrial-mobile-table/' + width + '.png' });
    console.log('[industrial mobile table]', width, JSON.stringify(result));
  }

  await page.setViewportSize({ width: 320, height: 850 });
  await page.evaluate(() => {
    const table = document.createElement('table');
    table.id = 'qa-wide-table';
    const cells = Array.from({ length: 12 }, (_, i) => '<th>매우긴비교항목' + i + '</th>').join('');
    table.innerHTML = '<thead><tr>' + cells + '</tr></thead><tbody><tr>' + cells.replaceAll('th>', 'td>') + '</tr></tbody>';
    document.querySelector('.industrial-safety-chapter article').append(table);
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForFunction(() => Boolean(document.querySelector('.industrial-table-scroll #qa-wide-table')));
  const narrow = await page.evaluate(() => {
    const scroller = document.querySelector('.industrial-table-scroll');
    return { client: scroller.clientWidth, scroll: scroller.scrollWidth, page: document.documentElement.scrollWidth, viewport: innerWidth };
  });
  assert(narrow.scroll > narrow.client, 'wide table has independent horizontal scrolling');
  assert(narrow.page <= narrow.viewport + 2, 'wide table does not expand page');
  await page.setViewportSize({ width: 1440, height: 850 });
  await page.waitForFunction(() => !document.querySelector('.industrial-table-scroll #qa-wide-table'));
  assert.equal(errors.length, 0, 'no page runtime errors: ' + errors.join('; '));
  console.log('[industrial table scroll and desktop restoration] PASS', JSON.stringify(narrow));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}