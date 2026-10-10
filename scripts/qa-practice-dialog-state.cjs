// Exercise modal style, keyboard/touch input and scroll restoration in a real browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const dir = process.env.QA_OUTPUT_DIR || 'qa-results/practice-dialog-ui';
const route = '/industrial-safety/written/safety-management/accident-prevention-principles/';
const questionMap = new Map(JSON.parse(fs.readFileSync('src/data/questions/industrial-safety.json')).map(q => [q.id, q]));
const report = { base, startedAt: new Date().toISOString(), samples: [], errors: [], limitations: ['Chromium emulation; physical iOS/Android and Safari not tested'] };
fs.mkdirSync(dir, { recursive: true });
const styles = [
  ['html', ['overflow-x', 'overflow-y']],
  ['body', ['position', 'top', 'left', 'right', 'overflow-x', 'overflow-y', 'padding-right']],
];
async function snapshot(page) {
  return page.evaluate(styles => ({
    x: scrollX, y: scrollY, mainTop: document.querySelector('main').getBoundingClientRect().top,
    styles: styles.flatMap(([selector, properties]) => properties.map(property => {
      const style = document.querySelector(selector).style;
      return { selector, property, value: style.getPropertyValue(property), priority: style.getPropertyPriority(property) };
    })),
  }), styles);
}
async function restored(page, before) {
  await page.waitForFunction(before => Math.abs(scrollX - before.x) <= 1 && Math.abs(scrollY - before.y) <= 1 && before.styles.every(({selector, property, value, priority}) => {
    const style = document.querySelector(selector).style;
    return style.getPropertyValue(property) === value && style.getPropertyPriority(property) === priority;
  }), before);
  assert.equal(await page.locator('[data-practice-open]').evaluate(e => e === document.activeElement), true, 'opener focus restored');
  return { beforeY: before.y, afterY: await page.evaluate(() => scrollY), restoredInlineStyles: true };
}
(async () => {
  const browser = await chromium.launch({ headless: true,
    ...(process.env.QA_CHROMIUM_EXECUTABLE ? { executablePath: process.env.QA_CHROMIUM_EXECUTABLE } : {}),
    ...(process.env.QA_PROXY ? { proxy: { server: process.env.QA_PROXY } } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });
  try {
    for (const width of [320, 390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.route('**/*', r => /google-analytics|googletagmanager|googlesyndication|doubleclick/.test(r.request().url()) ? r.abort() : r.continue());
      try {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        // Nonempty styles and a priority exercise preservation, not just cleanup to defaults.
        await page.evaluate(() => {
          document.body.style.position = 'relative';
          document.body.style.paddingRight = '3px';
          document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
        });
        const opener = page.locator('[data-practice-open]'), dialog = page.locator('[data-practice-dialog]');
        const item = dialog.locator('[data-practice-item]');
        const ids = await page.locator('[data-practice-meta]').evaluateAll(es => es.map(e => e.dataset.id));
        const colors = await page.evaluate(() => Object.fromEntries(['--primary-50', '--primary-600', '--success-bg', '--success', '--error-bg', '--error'].map(token => {
          const probe = document.createElement('span'); probe.style.color = 'var(' + token + ')'; document.body.append(probe);
          const color = getComputedStyle(probe).color; probe.remove(); return [token, color];
        })));
        const closures = []; let feedbackStyles, selectedStyles, focusStyles, minChoiceHeight;
        for (const method of ['Escape', 'close-button', 'backdrop', 'finish']) {
          await opener.scrollIntoViewIfNeeded();
          const before = await snapshot(page);
          await opener.click(); await item.waitFor({ state: 'visible' });
          assert.equal(await item.locator('input:checked').count(), 0, 'reopen starts unselected');
          assert.equal(await item.locator('[data-practice-body]').innerText(), '1. ' + questionMap.get(ids[0]).body);
          const locked = await snapshot(page);
          assert(Math.abs(locked.mainTop - before.mainTop) <= 2, 'background stays at original visual position when opened');
          await page.mouse.move(2, 420); await page.mouse.wheel(0, 400); await page.waitForTimeout(150);
          const afterWheel = await snapshot(page);
          assert.equal(afterWheel.y, locked.y, 'background wheel cannot move document');
          assert(Math.abs(afterWheel.mainTop - before.mainTop) <= 2, 'background visual position stays fixed');
          if (width < 768) {
            const cdp = await context.newCDPSession(page);
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 2, y: 700 }] });
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 2, y: 200 }] });
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
            await page.waitForTimeout(100);
            assert(await dialog.isVisible(), 'backdrop swipe does not close dialog');
            assert(Math.abs((await snapshot(page)).mainTop - before.mainTop) <= 2, 'background touch swipe cannot move body');
            await cdp.detach();
          }
          minChoiceHeight = Math.min(...await item.locator('.practice-choice').evaluateAll(es => es.map(e => e.getBoundingClientRect().height)));
          assert(minChoiceHeight >= 44, 'clickable choices have at least 44px height');
          await item.locator('[data-practice-body]').focus(); await page.keyboard.press('Tab');
          focusStyles = await item.locator('.practice-choice').first().evaluate(e => ({ focused: e.querySelector('input') === document.activeElement, outline: getComputedStyle(e).outlineStyle, outlineWidth: getComputedStyle(e).outlineWidth }));
          assert(focusStyles.focused && focusStyles.outline === 'solid' && parseFloat(focusStyles.outlineWidth) >= 2, 'visible keyboard focus on row');
          await page.keyboard.press('Space');
          selectedStyles = await item.locator('.practice-choice').first().evaluate(e => ({ background: getComputedStyle(e).backgroundColor, border: getComputedStyle(e).borderColor }));
          assert.equal(selectedStyles.background, colors['--primary-50']); assert.equal(selectedStyles.border, colors['--primary-600']);
          await item.locator('[data-practice-check]').click();
          feedbackStyles = await item.locator('.practice-choice').evaluateAll(es => es.map(e => ({ correct: e.classList.contains('is-correct'), incorrect: e.classList.contains('is-incorrect'), background: getComputedStyle(e).backgroundColor, border: getComputedStyle(e).borderColor, borderStyle: getComputedStyle(e).borderStyle })));
          assert.equal(feedbackStyles.filter(s => s.correct).length, 1); assert.equal(feedbackStyles.filter(s => s.incorrect).length, 1);
          for (const s of feedbackStyles.filter(s => s.correct || s.incorrect)) {
            assert.equal(s.background, colors[s.correct ? '--success-bg' : '--error-bg']);
            assert.equal(s.border, colors[s.correct ? '--success' : '--error']); assert.equal(s.borderStyle, 'solid');
          }
          if (method === 'Escape') await dialog.screenshot({ path: dir + '/state-' + width + '-feedback.png' });
          if (method === 'finish') {
            await item.locator('[data-practice-next]').click();
            for (let i = 1; i < ids.length; i++) {
              await item.locator('input[type=radio]').nth(questionMap.get(ids[i]).answer - 1).check();
              await item.locator('[data-practice-check]').click(); await item.locator('[data-practice-next]').click();
            }
            assert.equal(await dialog.locator('[data-practice-score]').innerText(), '6문제 중 5문제 수록 답안과 일치');
            await dialog.locator('[data-practice-finish]').click();
          } else if (method === 'Escape') await page.keyboard.press('Escape');
          else if (method === 'close-button') await dialog.locator('[data-practice-close]').click();
          else await page.mouse.click(2, 420);
          await dialog.waitFor({ state: 'hidden' }); closures.push({ method, ...await restored(page, before) });
          const bodyScroll = await page.evaluate(() => scrollY); await page.mouse.wheel(0, 150); await page.waitForTimeout(150);
          assert(Math.abs(await page.evaluate(() => scrollY) - bodyScroll) > 2, 'body scroll works again after close');
        }
        assert.equal(errors.length, 0, JSON.stringify(errors));
        report.samples.push({ width, closures, minChoiceHeight, selectedStyles, feedbackStyles, focusStyles, result: 'PASS' });
        console.log('Dialog state PASS', width);
      } catch (e) { report.errors.push({ width, error: String(e), stack: e.stack }); await page.screenshot({ path: dir + '/state-failure-' + width + '.png' }).catch(() => {}); }
      finally { await context.close(); }
    }
  } finally { await browser.close(); report.finishedAt = new Date().toISOString(); report.overall = report.errors.length ? 'FAIL' : 'PASS'; fs.writeFileSync(dir + '/dialog-state-report.json', JSON.stringify(report, null, 2)); }
  console.log(JSON.stringify(report, null, 2)); assert.equal(report.errors.length, 0);
})().catch(e => { console.error(e); process.exitCode = 1; });
