const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const out = 'qa-results/certification-discovery'; fs.mkdirSync(out, {recursive:true});
(async () => {
  const browser = await chromium.launch();
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({viewport:{width,height:900}});
    await page.route('**/*', r => new URL(r.request().url()).origin === new URL(base).origin ? r.continue() : r.abort());
    const response = await page.goto(base + '/computer-literacy/written/computer-basics/cache-buffer/');
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    const data = await page.evaluate(() => {
      const a = document.querySelector('article');
      const ps = [...a.children].filter(e => e.tagName === 'P' && e.previousElementSibling?.tagName === 'P' && !e.matches(':has(>.katex:only-child,>img:only-child)') && !e.previousElementSibling.matches(':has(>.katex:only-child,>img:only-child)'));
      return {pairs:ps.map(e=>({gap:e.getBoundingClientRect().top-e.previousElementSibling.getBoundingClientRect().bottom, font:parseFloat(getComputedStyle(e).fontSize), line:parseFloat(getComputedStyle(e).lineHeight)})), overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
    });
    assert(data.pairs.length >= 2, 'sample consecutive prose');
    for (const p of data.pairs) { assert(Math.abs(p.gap-8)<1, JSON.stringify({width,p})); assert(Math.abs(p.line/p.font-1.7)<0.02); }
    assert(data.overflow <= 1);
    await page.locator('article table').first().scrollIntoViewIfNeeded();
    await page.screenshot({path:`${out}/paragraph-spacing-${width}.png`});
    await page.close();
  }
  await browser.close(); console.log('[Chapter paragraph spacing] PASS 4 viewport cases');
})().catch(e=>{console.error(e);process.exitCode=1});
