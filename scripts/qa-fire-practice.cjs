// Synthetic fixtures are injected only into intercepted test responses. They never
// change the management table, approval flags, or production build artifacts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const output = process.env.QA_OUTPUT_DIR || 'qa-results/fire-practice';
fs.mkdirSync(output, { recursive: true });
const report = { startedAt: new Date().toISOString(), cases: [], errors: [], limitations: ['Synthetic fixture content is not a textbook review', 'Chromium emulation; physical Safari/iOS/Android not tested'] };
const route = '/fire-safety-manager-level2/practice/';
const payloadPattern = /(<script[^>]*data-fire-payload[^>]*>)[\s\S]*?(<\/script>)/;
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.QA_CHROMIUM_EXECUTABLE ? { executablePath: process.env.QA_CHROMIUM_EXECUTABLE } : {}), args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  try {
    const context = await browser.newContext();
    await context.route('**/*', r => new URL(r.request().url()).origin === new URL(base).origin ? r.continue() : r.abort());
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(String(error)));
    await page.goto(base + route);
    const payload = await page.locator('[data-fire-payload]').evaluate(element => JSON.parse(element.textContent));
    assert.equal(payload.questions.length, 2328);
    assert.equal(payload.chapters.length, 74);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const chapters = width === 390 || width === 1440 ? payload.chapters : [payload.chapters[0]];
      for (const chapter of chapters) {
        await page.goto(base + chapter.href);
        assert.equal(await page.locator('[data-fire-practice-entry]').count(), 1);
        const links = page.locator('[data-fire-practice-entry] a');
        assert.equal(await links.count(), 2);
        assert.equal(await links.nth(0).getAttribute('href'), route + '?chapter=' + chapter.id);
        assert.equal(await links.nth(1).getAttribute('href'), route);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      }
      await page.locator('[data-fire-practice-entry]').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/chapter-entry-${width}.png`, fullPage: false });
      const popupPromise = context.waitForEvent('page');
      await page.locator('[data-fire-practice-entry] a').first().click();
      const popup = await popupPromise;
      await popup.waitForLoadState('networkidle');
      assert.equal(new URL(popup.url()).searchParams.get('popup'), '1');
      assert.equal(await popup.evaluate(() => window.opener), null);
      await popup.waitForFunction(() => document.querySelector('[data-start]')?.disabled === false);
      await Promise.all([popup.waitForEvent('close'), popup.locator('[data-window-close]').click()]);
      assert(popup.isClosed());
      // A blocked popup follows the usable link in the current tab.
      await page.evaluate(() => { window.open = () => null; });
      await page.locator('[data-fire-practice-entry] a').first().click();
      await page.waitForFunction(()=>document.querySelector('[data-start]')?.disabled===false);
      assert.equal(await page.locator('[data-start]').isDisabled(), false);
      assert.match(await page.locator('[data-availability]').textContent(), /공개 문제/);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.goto(base + route,{waitUntil:'networkidle'});
      assert.equal(await page.locator('[data-window-close]').isVisible(), false, 'direct/fallback page has no inactive close button');
      assert.equal(await page.locator('[data-start]').isDisabled(), false);
      await page.screenshot({ path: `${output}/published-${width}.png`, fullPage: true });
      await page.goto(base + route + '?chapter=unknown',{waitUntil:'networkidle'});
      assert.match(await page.locator('[data-availability]').textContent(), /찾을 수 없/);
      assert.equal(await page.locator('[data-start]').isDisabled(), true);
      report.cases.push({ width, chapterRoutes: chapters.length, publishedAndInvalid: 'PASS', overflow: false });
    }
    const chapterOne = payload.chapters.find(q => q.subjectId === 1);
    const questions = [];
    for (const subjectId of [1, 2]) {
      const chapters = payload.chapters.filter(q => q.subjectId === subjectId);
      for (let i = 0; i < 30; i++) {
        const chapter = chapters[i < 3 ? 0 : 1];
        const id = `TEST-${subjectId}-${i}`;
        questions.push({ id, chapterId: chapter.id, chapterTitle: chapter.title, subjectId,
          question: i === 0 ? `<img src=x onerror="window.fixtureXss=true"> 테스트 전용 ${subjectId}과목 문항` : `테스트 전용 ${subjectId}과목 ${i}번 문항`,
          choices: ['첫 번째', '두 번째', '세 번째', '네 번째'], answerNumber: 2, explanation: '테스트 전용 정답 해설',
          isCore: true, questionType: 'source_reconstruction', sourceQuestionId: id });
        if (i < 3) questions.push({ ...questions.at(-1), id: id + '-variant', isCore: false, questionType: 'source_variant' });
      }
    }
    const fixture = JSON.stringify({ chapters: payload.chapters, questions }).replace(/</g, '\\u003c');
    await page.route('**/fire-safety-manager-level2/practice/**', async r => {
      const response = await r.fetch();
      const html = (await response.text()).replace(payloadPattern, (_, open, close) => open + fixture + close);
      await r.fulfill({ response, body: html });
    });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + route + '?chapter=' + chapterOne.id);
      await page.locator('[data-start]').click();
      assert.equal(await page.locator('[data-clock-wrap]').isVisible(), false);
      assert.equal(await page.locator('[data-check]').count(), 0);
      assert.equal(await page.locator('[data-feedback]').count(), 0);
      assert.equal(await page.locator('[data-next]').isDisabled(), false);
      await page.locator('input[value="1"]').check();
      await page.locator('input[value="2"]').check();
      assert.equal(await page.locator('input:disabled').count(), 0);
      await page.locator('[data-next]').click();
      await page.locator('[data-previous]').click();
      assert.equal(await page.locator('input:checked').inputValue(), '2');
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="cancel"]').click();
      await page.waitForFunction(() => !document.querySelector('[data-confirm]').open && document.activeElement === document.querySelector('[data-submit]'));
      assert.equal(await page.locator('[data-session]').isVisible(), true);
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({ state: 'visible' });
      assert.match(await page.locator('[data-score]').textContent(), /1개 정답/);
      assert.equal(await page.locator('[data-review] details').count(), 6);
      await page.locator('[data-review] summary').first().click();
      assert.equal(await page.locator('[data-review] a').count(), 6);
      await page.locator('[data-filter="wrong"]').click();
      assert.equal(await page.locator('[data-review] details:visible').count(), 0);
      await page.locator('[data-filter="unanswered"]').click();
      assert.equal(await page.locator('[data-review] details:visible').count(), 5);
      await page.locator('[data-filter="all"]').click();
      await page.screenshot({ path: `${output}/chapter-result-${width}.png`, fullPage: true });
      await page.locator('[data-retry]').click();
      assert.equal(await page.locator('[data-navigation] button').count(), 5);
      assert.equal(await page.locator('[data-clock-wrap]').isVisible(), false);
      await page.locator('input[value="1"]').check();
      await page.locator('[data-clear]').click();
      assert.equal(await page.locator('input:checked').count(), 0);
      await page.locator('input[value="1"]').check();
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({ state: 'visible' });
      assert.match(await page.locator('[data-verdict]').textContent(), /정답 0개 · 오답 1개 · 미응답 4개/);
      await page.locator('[data-filter="wrong"]').click();
      assert.equal(await page.locator('[data-review] details:visible').count(), 1);
      await page.locator('[data-filter="unanswered"]').click();
      assert.equal(await page.locator('[data-review] details:visible').count(), 4);
      await page.goto(base + route);
      await page.locator('[data-start]').click();
      assert.equal(await page.locator('[data-navigation] button').count(), 50);
      assert.equal(await page.locator('[data-clock]').textContent(), '60:00');
      if (width === 1440) {
        const submitBox = await page.locator('[data-submit]').boundingBox();
        assert(submitBox.y >= 0 && submitBox.y + submitBox.height <= 900, 'desktop submit stays in viewport with 50-question sidebar');
      }
      assert.equal(await page.locator('[data-check]').count(), 0);
      assert.equal(await page.locator('[data-feedback]').count(), 0);
      await page.locator('input[value="1"]').check();
      await page.locator('[data-next]').click();
      await page.locator('[data-previous]').click();
      assert.equal(await page.locator('input:checked').inputValue(), '1');
      await page.locator('input[value="2"]').check();
      // An unanswered submission has explicit confirmation and can be cancelled with Escape.
      await page.locator('[data-submit]').click();
      assert.match(await page.locator('[data-confirm-text]').textContent(), /49개/);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('[data-confirm]').open && document.activeElement === document.querySelector('[data-submit]'));
      assert.equal(await page.locator('[data-session]').isVisible(), true);
      assert.equal(await page.locator('[data-submit]').evaluate(e => e === document.activeElement), true);
      if (!await page.locator('[data-answer-panel]').evaluate(e => e.open)) await page.locator('[data-answer-panel] summary').click();
      for (let i = 0; i < 50; i++) {
        await page.locator('[data-navigation] button').nth(i).click();
        assert.match(await page.locator('[data-meta]').textContent(), new RegExp(i < 25 ? '1과목' : '2과목'));
        if (i < 35) await page.locator('input[value="2"]').check();
      }
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.equal(await page.evaluate(() => Boolean(window.fixtureXss)), false);
      assert.equal(await page.locator('[data-question] img').count(), 0);
      await page.screenshot({ path: `${output}/mock-active-${width}.png`, fullPage: true });
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({ state: 'visible' });
      assert.match(await page.locator('[data-score]').textContent(), /平均|평균 70점/);
      assert.match(await page.locator('[data-verdict]').textContent(), /합격 기준 충족/);
      assert.equal(await page.locator('[data-review] details').count(), 50);
      await page.screenshot({ path: `${output}/mock-result-${width}.png`, fullPage: true });
      // Same source + variant must not appear together in the selected test.
      const families = await page.locator('[data-review] details p:first-of-type').allTextContents();
      assert.equal(new Set(families).size, 50);
      await page.locator('[data-restart]').click();
      assert.equal(await page.locator('input:checked').count(), 0);
      assert.match(await page.locator('[data-progress]').textContent(), /0개 답안 선택/);
      // Date-based deadline must survive a suspended/background timer.
      await page.evaluate(() => {
        const original = Date.now;
        Date.now = () => original() + 3_601_000;
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.locator('[data-results]').waitFor({ state: 'visible' });
      assert.match(await page.locator('[data-verdict]').textContent(), /자동 제출/);
      assert.match(await page.locator('[data-score]').textContent(), /평균 0점/);
      report.cases.push({ width, chapterBatchSubmission: 'PASS', popupAndFallback: 'PASS', filtersAndRetry: 'PASS', answerPersistence: 'PASS', mock50: 'PASS', score70: 'PASS', restart: 'PASS', deadline: 'PASS', htmlInjection: 'PASS' });
    }
    await page.unroute('**/fire-safety-manager-level2/practice/**');
    for (const path of ['/industrial-safety/written/construction/hanging-scaffold-wire-rope/', '/energy-management/written/thermal-equipment/draft-flue-gas/', '/computer-literacy/written/spreadsheets/goal-seek/']) {
      await page.goto(base + path);
      assert.equal(await page.locator('[data-fire-practice-entry]').count(), 0);
      await page.locator('[data-open]').first().click();
      await page.locator('dialog[open]').waitFor();
      await page.keyboard.press('Escape');
      report.cases.push({ path, existingPopup: 'PASS' });
    }
    assert.deepEqual(report.errors, []);
    report.result = 'PASS';
    await context.close();
  } catch (error) {
    report.result = 'FAIL'; report.errors.push(String(error));
    const page = browser.contexts()[0]?.pages()[0];
    if (page) await page.screenshot({ path: output + '/failure.png', fullPage: true }).catch(() => {});
    throw error;
  }
  finally { report.finishedAt = new Date().toISOString(); fs.writeFileSync(output + '/browser-results.json', JSON.stringify(report, null, 2)); await browser.close(); }
  console.log('[Fire practice browser]', report.result, report.cases.length, 'groups');
})().catch(error => { console.error(error); process.exitCode = 1; });
