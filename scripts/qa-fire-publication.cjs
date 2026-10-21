const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const output=process.env.QA_OUTPUT_DIR||'qa-results/fire-publication';
fs.mkdirSync(output,{recursive:true});
const table=JSON.parse(fs.readFileSync('docs/drafts/fire-level2-mock-exam/question-table.json','utf8'));
const release=JSON.parse(fs.readFileSync('docs/releases/2026-10-20-fire-practice/publication.json','utf8'));
const fields=['id','chapterId','chapterTitle','subjectId','question','choices','answerNumber','explanation','isCore','questionType','sourceQuestionId'];
const expected=table.filter(q=>q.reviewStatus==='approved'&&q.publicationStatus==='published'&&q.examEligible).map(q=>Object.fromEntries(fields.map(k=>[k,q[k]])));
const report={base,published:expected.length,subjects:[1421,907],held:release.heldCount,cases:[],errors:[],physicalDevices:'not tested'};
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  try{
    const context=await browser.newContext();
    const page=await context.newPage();
    page.on('pageerror',e=>report.errors.push(String(e)));
    const url=base+'/fire-safety-manager-level2/practice/';
    // A Pages deployment can finish shortly before all CDN edges refresh.
    let payload;
    for(let attempt=0;attempt<12;attempt++){
      const response=await page.goto(url+'?release='+encodeURIComponent(process.env.QA_COMMIT||'publication'),{waitUntil:'networkidle'});
      assert.equal(response.status(),200);
      payload=await page.locator('[data-fire-payload]').evaluate(e=>JSON.parse(e.textContent));
      if(payload.questions.length===expected.length)break;
      if(attempt<11)await page.waitForTimeout(10000);
    }
    assert.deepEqual(payload.questions,expected,'production payload matches all 2328 approved rows');
    assert(payload.questions.every(q=>!release.held.includes(q.id)));
    assert.equal(payload.chapters.length,74);
    const findQuestion=async()=>{
      const text=(await page.locator('[data-question]').textContent()).replace(/^\d+\. /,'');
      const choices=(await page.locator('[data-choices] label span').allTextContents()).map(s=>s.replace(/^[①②③④] /,''));
      const matches=expected.filter(q=>q.question===text&&JSON.stringify(q.choices)===JSON.stringify(choices));
      assert(matches.length>0,'visible question and all choices match approved content');
      assert.equal(new Set(matches.map(q=>q.answerNumber)).size,1,'duplicate display has consistent key');
      return matches[0];
    };
    for(const width of [390,1440]){
      await page.setViewportSize({width,height:900});
      const chapter=payload.chapters[0];
      await page.goto(base+chapter.href,{waitUntil:'networkidle'});
      assert.equal(await page.locator('[data-fire-practice-entry] a').count(),2);
      await page.goto(base + await page.locator('[data-fire-practice-entry] a').first().getAttribute('href'),{waitUntil:'networkidle'});
      await page.waitForFunction(()=>document.querySelector('[data-start]')?.disabled===false);
      assert.equal(await page.locator('[data-start]').isDisabled(),false);
      assert.equal(await page.locator('[data-chapter-back]').count(),0);
      assert.equal(await page.locator('[data-guide] br').count(),2);
      await page.locator('[data-start]').click();
      assert.equal(await page.locator('[data-clear]').count(),0);
      assert.equal(await page.locator('[data-question]').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)),width===1440?20:18);
      assert.equal(await page.locator('[data-choices] input').first().evaluate(e=>getComputedStyle(e).clipPath),'inset(50%)');
      const q=await findQuestion();
      await page.locator(`input[value="${q.answerNumber}"]`).locator('..').click();
      assert.equal(await page.locator('[data-feedback]').count(),0,'answers hidden before submission');
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({state:'visible'});
      const firstReview=page.locator('[data-review-item]').first();
      assert.equal(await page.locator('[data-review] details, [data-review] summary').count(),0);
      assert.equal(await page.locator('[data-explanation]:visible').count(),await page.locator('[data-review-item]').count());
      assert.equal(await firstReview.getAttribute('data-status'),'correct');
      assert.equal(await page.locator('[data-review] .fire-answer, [data-review] [data-answer]').count(),0);
      assert.equal(await firstReview.locator('.fire-choice-label').textContent(),'내 선택 · 정답');
      assert((await firstReview.textContent()).includes(q.explanation));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      await page.screenshot({path:`${output}/chapter-${width}.png`,fullPage:false});
      await firstReview.screenshot({path:`${output}/chapter-explanation-${width}.png`});
      await page.goto(url,{waitUntil:'networkidle'});
      assert.equal(await page.locator('[data-start]').isDisabled(),false);
      await page.locator('[data-start]').click();
      assert.equal(await page.locator('[data-navigation] button').count(),50);
      assert.equal(await page.locator('[data-clock-wrap]').isVisible(),true);
      for(let n=0;n<50;n++){
        if(n>0)await page.locator('[data-next]').click();
        assert.match(await page.locator('[data-meta]').textContent(),new RegExp(n<25?'1과목':'2과목'));
        const actual=await findQuestion();assert.equal(actual.subjectId,n<25?1:2);
        await page.locator(`input[value="${actual.answerNumber}"]`).locator('..').click();
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
      }
      await page.locator('[data-submit]').click();
      await page.locator('[data-confirm] button[value="submit"]').click();
      await page.locator('[data-results]').waitFor({state:'visible'});
      assert.match(await page.locator('[data-score]').textContent(),/평균 100점/);
      assert.match(await page.locator('[data-verdict]').textContent(),/합격 기준 충족/);
      assert.equal(await page.locator('[data-review-item]').count(),50);
      assert.equal(await page.locator('[data-review] a').count(),50);
      assert.equal(await page.locator('[data-retry]').isDisabled(),true);
      await page.screenshot({path:`${output}/mock-result-${width}.png`,fullPage:false});
      report.cases.push({width,actualChapterAnswerAndExplanation:'PASS',actualMock50:'PASS',subject25Each:'PASS',score100:'PASS',overflow:false});
    }
    assert.deepEqual(report.errors,[]);report.result='PASS';
    await context.close();
  }catch(e){report.result='FAIL';report.errors.push(String(e));throw e;}
  finally{fs.writeFileSync(output+'/results.json',JSON.stringify(report,null,2)+'\n');await browser.close();}
  console.log('[Fire actual publication]',report.result,'2328 approved rows; held 152 excluded; mobile/desktop real chapter and 50-question exams');
})().catch(e=>{console.error(e);process.exitCode=1;});
