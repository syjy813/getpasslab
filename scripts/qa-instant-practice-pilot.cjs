// Read-only browser QA of the STEP 1 pilot. No deploy, merge or production mutation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const target = base + '/industrial-safety/written/safety-management/accident-prevention-principles/';
const output = path.join(__dirname, '../qa-results/instant-practice-pilot');
fs.mkdirSync(output, { recursive: true });
const report = { target, viewports: [], failures: [], browser: 'Headless Chromium viewport emulation' };
let browser;

async function check(width) {
  const context = await browser.newContext({
    viewport: { width, height: 844 },
    isMobile: width < 768,
    hasTouch: width < 768,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    return url.origin === base || url.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort();
  });
  page.on('pageerror', error => report.failures.push({ width, type: 'pageerror', error: String(error) }));

  const response = await page.goto(target, { waitUntil: 'networkidle', timeout: 45000 });
  assert.equal(response.status(), 200, width + 'px: pilot page is not available');
  const history = page.locator('[data-question-role="primary"]');
  const opener = history.locator('[data-practice-open]');
  const root = page.locator('[data-instant-practice]');
  const dialog = root.locator('[data-practice-dialog]');
  assert.equal(await root.count(), 1);
  assert.equal(await opener.count(), 1, 'Launch button must be inside the existing question history');
  assert.equal(await history.locator('[data-practice-dialog]').count(), 0, 'Quiz dialog must not be embedded in the question history article');
  assert(await opener.isVisible());
  assert.equal((await opener.textContent()).trim(), '문제 풀기 (6문항)');
  assert(!(await dialog.isVisible()), 'Quiz must not be visible in the article until opened');
  assert.equal(await history.locator('.practice-item').count(), 0);

  await opener.click();
  assert(await dialog.isVisible());
  assert.equal(await dialog.getAttribute('aria-modal'), 'true');
  assert(await root.locator('[data-practice-close]').evaluate(element => element === document.activeElement));
  const modalVisuals = await dialog.evaluate(element => {
    const heading = element.querySelector('#instant-practice-heading');
    const close = element.querySelector('[data-practice-close]');
    const headingStyle = getComputedStyle(heading);
    const headingBefore = getComputedStyle(heading, '::before');
    const headingRect = heading.getBoundingClientRect();
    const closeRect = close.getBoundingClientRect();
    const dialogRect = element.getBoundingClientRect();
    return {
      outsideArticle: !element.closest('article'),
      rootedInBody: element.parentElement?.parentElement === document.body,
      titleBackground: headingStyle.backgroundColor,
      titlePadding: headingStyle.paddingTop,
      titleMarker: headingBefore.content,
      titleMarkerDisplay: headingBefore.display,
      headerNotOverlapping: headingRect.right <= closeRect.left + 2,
      dialogInsideViewport: dialogRect.left >= 0 && dialogRect.right <= document.documentElement.clientWidth + 1,
      dialogWidth: dialogRect.width,
    };
  });
  assert(modalVisuals.outsideArticle && modalVisuals.rootedInBody, width + 'px: modal must be outside chapter article');
  assert(['rgba(0, 0, 0, 0)', 'transparent'].includes(modalVisuals.titleBackground), width + 'px: chapter title background leaked: ' + JSON.stringify(modalVisuals));
  assert.equal(modalVisuals.titlePadding, '0px', width + 'px: chapter title padding leaked');
  assert.equal(modalVisuals.titleMarkerDisplay, 'none', width + 'px: chapter title marker leaked');
  assert(modalVisuals.headerNotOverlapping && modalVisuals.dialogInsideViewport, width + 'px: modal header geometry: ' + JSON.stringify(modalVisuals));

  const questions = dialog.locator('[data-practice-item]');
  assert.equal(await questions.count(), 6);
  assert.equal(await dialog.locator('[data-practice-item]:visible').count(), 1);
  assert.equal((await dialog.locator('[data-practice-progress]').textContent()).trim(), '1 / 6');

  // Closing with Escape must restore focus and discard partial progress on reopen.
  await questions.first().locator('input[value="2"]').check();
  await page.keyboard.press('Escape');
  assert(!(await dialog.isVisible()));
  assert(await opener.evaluate(element => element === document.activeElement));
  await opener.click();
  assert(await dialog.isVisible());
  assert(!(await questions.first().locator('input[value="2"]').isChecked()));
  assert(await questions.first().locator('[data-practice-check]').isDisabled());
  await dialog.screenshot({ path: path.join(output, width + '-initial.png') });
  const answers = [2, 4, 2, 1, 2, 4];
  let expectedCorrect = 0;

  for (let index = 0; index < answers.length; index++) {
    const current = questions.nth(index);
    assert(await current.isVisible());
    const checkButton = current.locator('[data-practice-check]');
    assert(await checkButton.isDisabled());

    const expectedAnswer = answers[index];
    const chosenAnswer = index % 2 === 0 ? expectedAnswer : (expectedAnswer % 4) + 1;
    const shouldPass = chosenAnswer === expectedAnswer;
    if (shouldPass) expectedCorrect++;
    await current.locator('input[value="' + chosenAnswer + '"]').check();
    assert(await checkButton.isEnabled());
    await checkButton.click();
    const feedback = current.locator('[data-practice-feedback]');
    assert(await feedback.isVisible());
    assert((await feedback.textContent()).includes(shouldPass ? '정답입니다' : '오답입니다'));
    assert((await feedback.textContent()).includes('해설'));
    assert.equal(await current.locator('.practice-choice.is-correct').count(), 1);
    assert.equal(await current.locator('.practice-choice.is-incorrect').count(), shouldPass ? 0 : 1);
    assert(await current.locator('input[value="' + chosenAnswer + '"]').isDisabled());
    assert(!(await checkButton.isVisible()));

    if (index === 1) await dialog.screenshot({ path: path.join(output, width + '-incorrect.png') });
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert(dimensions.scroll <= dimensions.width + 1, width + 'px: horizontal overflow at question ' + (index + 1));
    await current.locator('[data-practice-next]').click();
    assert(!(await current.isVisible()));
  }

  const completed = dialog.locator('[data-practice-complete]');
  assert(await completed.isVisible());
  assert((await completed.textContent()).includes('6문제 중 ' + expectedCorrect + '문제 정답'));
  assert(await completed.locator('[data-practice-finish]').isVisible());
  const resultVisuals = await completed.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const score = element.querySelector('[data-practice-score]').getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      width: rect.width,
      centered: Math.abs((score.left + score.right) / 2 - (rect.left + rect.right) / 2) < 12,
      padded: parseFloat(style.paddingTop) >= 12,
      background: style.backgroundColor,
      onScreen: rect.left >= 0 && rect.right <= document.documentElement.clientWidth + 1,
    };
  });
  assert(resultVisuals.centered && resultVisuals.padded && resultVisuals.onScreen, width + 'px: result UI is broken: ' + JSON.stringify(resultVisuals));
  await dialog.screenshot({ path: path.join(output, width + '-complete.png') });
  await completed.locator('[data-practice-restart]').click();
  assert(!(await completed.isVisible()));
  assert(await questions.first().isVisible());
  assert(await questions.first().locator('[data-practice-check]').isDisabled());
  assert.equal(await dialog.locator('.practice-choice.is-correct').count(), 0);
  assert.equal(await dialog.locator('.practice-choice.is-incorrect').count(), 0);
  // Closing with the visible control restores focus; reopening always starts from question 1.
  await dialog.locator('[data-practice-close]').click();
  assert(!(await dialog.isVisible()));
  assert(await opener.evaluate(element => element === document.activeElement));
  await opener.click();
  assert(await questions.first().isVisible());
  assert(await questions.first().locator('[data-practice-check]').isDisabled());
  await dialog.locator('[data-practice-finish]').click();
  assert(!(await dialog.isVisible()), width + 'px: return to learning failed');
  assert(await opener.evaluate(element => element === document.activeElement));

  // Other chapters do not expose this pilot button.
  const unrelated = await page.goto(base + '/industrial-safety/written/safety-management/heinrich-domino-theory/', { waitUntil: 'networkidle', timeout: 45000 });
  assert.equal(unrelated.status(), 200);
  assert.equal(await page.locator('[data-practice-open]').count(), 0);
  await page.goto(target, { waitUntil: 'networkidle', timeout: 45000 });

  // Existing public question-history popups must remain functional.
  const oldButton = page.locator('[data-open="20220424_010"]');
  assert.equal(await oldButton.count(), 1);
  await oldButton.click();
  const oldDialog = page.locator('#deferred-question-dialog');
  assert(await oldDialog.isVisible());
  await oldDialog.locator('[data-reveal]').waitFor({ state: 'visible' });
  await oldDialog.locator('[data-reveal]').click();
  assert.equal(await oldDialog.getAttribute('data-revealed'), 'true');
  await oldDialog.locator('[data-close]').click();
  assert(!(await oldDialog.isVisible()));

  report.viewports.push({ width, questions: answers.length, deliberatelyIncorrect: 3, correct: expectedCorrect, modalOpenCloseEscapeAndFocus: 'PASS', reset: 'PASS', resultLayout: 'PASS', titleStyleIsolation: 'PASS', legacyPopup: 'PASS', otherChapterUnchanged: 'PASS', horizontalOverflow: 'NONE' });
  await context.close();
}

(async () => {
  browser = await chromium.launch({ headless: true });
  for (const width of [320, 390, 1440]) {
    try {
      await check(width);
    } catch (error) {
      report.failures.push({ width, error: String(error), stack: error.stack });
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2));
  assert.deepEqual(report.failures, [], 'Instant practice browser QA failures: ' + JSON.stringify(report.failures));
  console.log('Instant practice modal browser QA passed at 320px, 390px and 1440px');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
