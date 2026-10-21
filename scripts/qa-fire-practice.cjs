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
    const rawStems=async locator=>locator.evaluateAll(elements=>elements.map(e=>[...e.querySelectorAll(':scope > [data-stem-order]')].sort((a,b)=>Number(a.dataset.stemOrder)-Number(b.dataset.stemOrder)).map(part=>{const copy=part.cloneNode(true);copy.querySelector('[data-question-number]')?.remove();return copy.textContent;}).join('')));

    const interceptPayload = async questions => {
      await page.unroute('**/fire-safety-manager-level2/practice/**');
      const fixture = JSON.stringify({chapters:payload.chapters,questions}).replace(/</g,'\\u003c');
      await page.route('**/fire-safety-manager-level2/practice/**', async r => {
        const response=await r.fetch();
        const html=(await response.text()).replace(payloadPattern,(_,open,close)=>open+fixture+close);
        await r.fulfill({response,body:html});
      });
    };
    const noteQuestion=payload.questions.find(q=>q.id==='moducbt-27777-q01');
    const advancedQuestion=payload.questions.find(q=>q.id==='FSM2-MOCK-053-16');
    const typographyQuestions=[noteQuestion,advancedQuestion].map(q=>({...q,chapterId:chapterOne.id,subjectId:1}));
    await interceptPayload(typographyQuestions);
    for(const width of [320,390,1440]){
      await page.setViewportSize({width,height:900});
      await page.goto(base+route+'?chapter='+chapterOne.id,{waitUntil:'networkidle'});
      assert.equal(await page.locator('[data-guide] br').count(),2);
      assert.equal(await page.locator('[data-chapter-back]').count(),0);
      await page.screenshot({path:`${output}/chapter-setup-${width}.png`,fullPage:false});
      await page.locator('[data-start]').click();
      if(!(await page.locator('[data-question]').textContent()).includes('이 건물은 '))await page.locator('[data-next]').click();
      assert.equal((await rawStems(page.locator('[data-question]')))[0],noteQuestion.question);
      const checkHierarchy=async selector=>{
        const styles=await page.locator(selector).evaluate(e=>{
          const style=c=>{const s=getComputedStyle(e.querySelector(c));return {size:parseFloat(s.fontSize),color:s.color};};
          return {title:style('.fire-stem-title'),condition:style('.fire-stem-condition'),reference:style('.fire-stem-reference'),marker:getComputedStyle(e.querySelector('.fire-stem-reference'),'::before').content};
        });
        assert(styles.title.size>styles.condition.size&&styles.condition.size>styles.reference.size);
        assert.equal(styles.title.color,styles.condition.color);
        assert.notEqual(styles.condition.color,styles.reference.color);
        assert.equal(styles.marker,'"※"');
        return styles;
      };
      const live=await checkHierarchy('[data-question]');
      assert.equal(await page.locator('[data-core-badge]').textContent(),'출제 유력');
      await page.locator('[data-meta]').screenshot({path:`${output}/core-badge-${width}.png`});

      assert.equal(await page.locator('[data-clear]').count(),0);
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      await page.locator('[data-question]').screenshot({path:`${output}/question-hierarchy-${width}.png`});
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({state:'visible'});
      assert.deepEqual((await rawStems(page.locator('.fire-review-question'))).sort(),typographyQuestions.map(q=>q.question).sort());
      const reviewSelector='[data-review-item]:has(.fire-stem-reference)';
      const review=await checkHierarchy(reviewSelector);
      const listedReview=page.locator('[data-review-item]').filter({hasText:advancedQuestion.question.split('\n').at(-1)});
      const display=await listedReview.locator('.fire-review-question > [data-stem-order]').evaluateAll(parts=>parts.map(p=>({order:Number(p.dataset.stemOrder),kind:p.className,text:p.textContent})));
      assert(display.findIndex(p=>p.text.includes('반드시 수정해야'))<display.findIndex(p=>p.kind==='fire-stem-condition'),'complete question precedes explanations and case conditions');
      assert.deepEqual(display.map(p=>p.order),[0,2,1]);
      await listedReview.screenshot({path:`${output}/listed-conditions-${width}.png`});

      assert.equal(await page.locator('[data-review] .fire-answer, [data-review] [data-answer]').count(),0);
      await page.locator(reviewSelector).screenshot({path:`${output}/review-hierarchy-${width}.png`});
      report.cases.push({width,questionHierarchy:{live,review},approvedQuestionTextPreserved:'PASS'});
    }
    // Rendering every approved stem must preserve its full text and multiplicity.
    await interceptPayload(payload.questions.map(q=>({...q,chapterId:chapterOne.id,subjectId:1})));
    await page.goto(base+route+'?chapter='+chapterOne.id,{waitUntil:'networkidle'});
    await page.locator('[data-start]').click();
    await page.locator('[data-submit]').click();
    await page.locator('[data-confirm] button[value="submit"]').click();
    await page.locator('[data-results]').waitFor({state:'visible'});
    assert.deepEqual((await rawStems(page.locator('.fire-review-question'))).sort(),payload.questions.map(q=>q.question).sort());
    const questionFirst=await page.locator('.fire-review-question').evaluateAll(elements=>elements.filter(e=>{const order=[...e.querySelectorAll(':scope > [data-stem-order]')].map(p=>Number(p.dataset.stemOrder));return order.some((n,i)=>i>0&&n<order[i-1]);}).length);
    assert(questionFirst>=731,'all published advanced case questions show the complete prompt before conditions');
    report.cases.push({allApprovedStems:2328,textAndMultiplicityPreserved:'PASS',questionFirst});
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
    await interceptPayload(questions);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + route + '?chapter=' + chapterOne.id);
      assert.equal(await page.locator('[data-chapter-back]').count(), 0);
      assert.equal(await page.locator('[data-guide] br').count(), 2);
      assert.deepEqual(await page.locator('[data-guide]').evaluate(e=>e.innerText.split('\n')), ['모든 문제를 푼 뒤 한 번에 채점합니다.', '제출 전에는 자유롭게 이동하고 답을 바꿀 수 있습니다.', '시간 제한은 없습니다.']);
      await page.screenshot({path:`${output}/chapter-setup-${width}.png`,fullPage:false});
      await page.locator('[data-start]').click();
      assert.equal(await page.locator('[data-clear]').count(), 0);
      assert.equal(await page.locator('[data-clock-wrap]').isVisible(), false);
      assert.equal(await page.locator('[data-check]').count(), 0);
      assert.equal(await page.locator('[data-feedback]').count(), 0);
      assert.equal(await page.locator('[data-next]').isDisabled(), false);
      await page.locator('input[value="1"]').locator('..').click();
      await page.locator('input[value="1"]').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('input:checked').inputValue(),'2','native radio keyboard selection survives visual removal');
      const selectionStyle=await page.locator('[data-choices]').evaluate(e=>{
        const input=e.querySelector('input:checked'), selected=getComputedStyle(input.parentElement), other=getComputedStyle(e.querySelector('input:not(:checked)').parentElement), control=getComputedStyle(input);
        return {selectedBackground:selected.backgroundColor,otherBackground:other.backgroundColor,selectedBorder:selected.borderColor,otherBorder:other.borderColor,clip:control.clipPath,width:control.width,focus:getComputedStyle(input.parentElement).outlineWidth};
      });
      assert.notEqual(selectionStyle.selectedBackground,selectionStyle.otherBackground);
      assert.notEqual(selectionStyle.selectedBorder,selectionStyle.otherBorder);
      assert.equal(selectionStyle.clip,'inset(50%)');
      assert.equal(selectionStyle.width,'1px');
      assert.equal(selectionStyle.focus,'3px');
      await page.locator('input[value="1"]').locator('..').click();
      await page.locator('input[value="2"]').locator('..').click();
      assert.equal(await page.locator('input:disabled').count(), 0);
      await page.locator('[data-next]').click();
      await page.locator('[data-previous]').click();
      assert.equal(await page.locator('input:checked').inputValue(), '2');
      if (!await page.locator('[data-answer-panel]').evaluate(e=>e.open)) await page.locator('[data-answer-panel] summary').click();
      const chosen=page.locator('[data-navigation] button[data-answered="true"]');
      assert.equal(await chosen.locator('span').textContent(),'②');
      const answerStyle=await chosen.evaluate(e=>{const s=getComputedStyle(e.querySelector('span'));return {size:parseFloat(s.fontSize),weight:Number(s.fontWeight),height:e.getBoundingClientRect().height,overflow:e.scrollWidth>e.clientWidth};});
      assert.equal(answerStyle.size,20);assert(answerStyle.weight>=600);assert(answerStyle.height>=64);assert.equal(answerStyle.overflow,false);
      await page.locator('[data-answer-panel]').screenshot({path:`${output}/answer-status-${width}.png`});

      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="cancel"]').click();
      await page.waitForFunction(() => !document.querySelector('[data-confirm]').open && document.activeElement === document.querySelector('[data-submit]'));
      assert.equal(await page.locator('[data-session]').isVisible(), true);
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({ state: 'visible' });
      assert.match(await page.locator('[data-score]').textContent(), /1개 정답/);
      assert.equal(await page.locator('[data-review-item]').count(), 6);
      assert.equal(await page.locator('[data-review] .fire-answer, [data-review] [data-answer]').count(),0);
      assert.equal(await page.locator('[data-review-item][data-status="correct"] .fire-choice-label').textContent(),'내 선택 · 정답');
      assert.equal(await page.locator('[data-review] details, [data-review] summary').count(), 0, 'review has no disclosure toggles');
      assert.equal(await page.locator('[data-explanation]:visible').count(), 6, 'all explanations displayed at once');
      const reviewStyle = await page.locator('[data-review-item]').first().evaluate(e => ({
        border: getComputedStyle(e).borderTopWidth, padding: parseFloat(getComputedStyle(e).paddingTop),
        questionFont: parseFloat(getComputedStyle(e.querySelector('.fire-review-question')).fontSize),
        bodyFont: parseFloat(getComputedStyle(e.querySelector('[data-explanation] p')).fontSize),
        lineHeight: parseFloat(getComputedStyle(e.querySelector('[data-explanation] p')).lineHeight),
        width: e.getBoundingClientRect().width,
      }));
      assert.equal(reviewStyle.border, '1px'); assert(reviewStyle.padding >= 24);
      assert(reviewStyle.questionFont >= 18 && reviewStyle.bodyFont >= 16);
      assert(reviewStyle.lineHeight / reviewStyle.bodyFont >= 1.75 && reviewStyle.width <= 800);
      const tones = await page.locator('[data-outcomes] [data-status]').evaluateAll(items => {
        const rgb = s => s.startsWith('color(') ? s.match(/[\d.]+/g).map(Number).slice(0,3) : s.match(/[\d.]+/g).map(Number).slice(0,3).map(n=>n/255);
        const luminance = c => c.map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);
        return items.map(item => { const style=getComputedStyle(item), foreground=rgb(style.color), background=rgb(style.backgroundColor);
          const a=luminance(foreground), b=luminance(background);
          return {status:item.dataset.status, foreground, contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
        });
      });
      for (const tone of tones) assert(tone.contrast >= 4.5, `${tone.status}: readable status color`);
      const [green,red,orange]=tones.map(t=>t.foreground);
      assert(green[1]>green[0] && green[1]>green[2]);
      assert(red[0]>red[1]*1.5 && red[0]>red[2]*1.5);
      assert(orange[0]>orange[1] && orange[1]>orange[2]);
      report.cases.push({width,expandedExplanations:'PASS',statusColorsAndContrast:tones,typography:reviewStyle});
      assert.equal(await page.locator('[data-review] a').count(), 6);
      await page.locator('[data-filter="wrong"]').click();
      assert.equal(await page.locator('[data-review-item]:visible').count(), 0);
      await page.locator('[data-filter="unanswered"]').click();
      assert.equal(await page.locator('[data-review-item]:visible').count(), 5);
      await page.locator('[data-filter="all"]').click();
      await page.screenshot({ path: `${output}/chapter-result-${width}.png`, fullPage: false });
      await page.locator('[data-review-item]').first().screenshot({path:`${output}/correct-review-${width}.png`});
      assert.equal(await page.locator('[data-restart]').isVisible(),false,'chapter results have only the review action');
      const beforeRetry=await page.locator('[data-review]').textContent();
      await page.locator('[data-retry]').click();
      assert.equal(await page.locator('[data-results]').isVisible(),true);
      assert.equal(await page.locator('[data-session]').isVisible(),false);
      assert.equal(await page.locator('[data-confirm] [value="submit"]').textContent(),'확인');
      await page.locator('[data-confirm]').screenshot({path:`${output}/retry-confirm-${width}.png`});
      await page.locator('[data-confirm] [value="cancel"]').click();
      await page.waitForFunction(()=>!document.querySelector('[data-confirm]').open&&document.activeElement===document.querySelector('[data-retry]'));
      assert.equal(await page.locator('[data-review]').textContent(),beforeRetry,'cancel preserves grading results');
      await page.locator('[data-retry]').click();
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>!document.querySelector('[data-confirm]').open&&document.activeElement===document.querySelector('[data-retry]'));
      assert.equal(await page.locator('[data-results]').isVisible(),true);
      await page.locator('[data-retry]').click();
      await page.locator('[data-confirm] [value="submit"]').click();
      assert.equal(await page.locator('[data-navigation] button').count(), 5);
      assert.equal(await page.locator('[data-clock-wrap]').isVisible(), false);
      await page.locator('input[value="1"]').locator('..').click();
      assert.equal(await page.locator('[data-clear]').count(), 0);
      await page.locator('input[value="2"]').locator('..').click();
      await page.locator('input[value="1"]').locator('..').click();
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({ state: 'visible' });
      assert.deepEqual(await page.locator('[data-outcomes] p').allTextContents(), ['정답0개','오답1개','미응답4개']);
      await page.locator('[data-filter="wrong"]').click();
      assert.equal(await page.locator('[data-review-item]:visible').count(), 1);
      assert.deepEqual(await page.locator('[data-review-item]:visible .fire-choice-label').allTextContents(),['내 선택','정답']);
      assert.equal(await page.locator('[data-review] .fire-answer, [data-review] [data-answer]').count(),0);
      await page.locator('[data-review-item]:visible').first().screenshot({path:`${output}/wrong-review-${width}.png`});
      await page.locator('[data-filter="unanswered"]').click();
      assert.equal(await page.locator('[data-review-item]:visible').count(), 4);
      await page.locator('[data-review-item]:visible').first().screenshot({path:`${output}/unanswered-review-${width}.png`});
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
      await page.locator('input[value="1"]').locator('..').click();
      await page.locator('[data-next]').click();
      await page.locator('[data-previous]').click();
      assert.equal(await page.locator('input:checked').inputValue(), '1');
      await page.locator('input[value="2"]').locator('..').click();
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
        if (i < 35) await page.locator('input[value="2"]').locator('..').click();
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
      assert.equal(await page.locator('[data-review-item]').count(), 50);
      assert.equal(await page.locator('[data-explanation]:visible').count(), 50);
      await page.screenshot({ path: `${output}/mock-result-${width}.png`, fullPage: false });
      // Same source + variant must not appear together in the selected test.
      const families = await page.locator('[data-review-item] .fire-review-question').allTextContents();
      assert.equal(new Set(families).size, 50);
      assert.equal(await page.locator('[data-restart]').isVisible(),true,'full exam keeps new-exam action');
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
