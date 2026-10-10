// Read-only end-to-end QA for shared, deferred, all-chapter instant-practice UI.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const dir = path.resolve('qa-results/instant-practice-coverage');
fs.mkdirSync(dir, { recursive: true });
const report = { base, samples: [], errors: [] };
const samples = [
  { cert: 'industrial-safety', subject: 'safety-management', slug: 'accident-prevention-principles', count: 6, explain: true, widths: [320,390,1440] },
  { cert: 'energy-management', subject: 'thermal-equipment', slug: 'heating-systems', count: 116, explain: false, widths: [390] },
  { cert: 'computer-literacy', subject: 'computer-basics', slug: 'computer-classification', count: 5, explain: false, widths: [390] },
];
let browser;
async function verify(sample, width) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 768, hasTouch: width < 768 });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  await page.route('**/*', route => {
    const u = new URL(route.request().url());
    return u.origin === base || u.hostname === 'cdn.jsdelivr.net' ? route.continue() : route.abort();
  });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const url = base + '/' + sample.cert + '/written/' + sample.subject + '/' + sample.slug + '/';
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  assert.equal(response.status(), 200, url);
  const history = page.locator('[data-question-role="primary"]');
  const opener = history.locator('[data-practice-open]');
  const root = page.locator('[data-instant-practice]');
  const dialog = root.locator('[data-practice-dialog]');
  assert.equal(await opener.count(), 1);
  assert.equal(await root.locator('[data-practice-meta]').count(), sample.count, 'question count ' + url);
  assert(!(await dialog.isVisible()));
  assert.equal(await page.locator('article [data-practice-item]').count(), 0, 'question body must not be present in article');
  await opener.click();
  assert(await dialog.isVisible());
  const item = dialog.locator('[data-practice-item]');
  const body = item.locator('[data-practice-body]');
  await body.waitFor({ state: 'visible' });
  assert(await body.textContent(), 'question did not load');
  const visual = await dialog.evaluate(el => {
    const h = el.querySelector('#instant-practice-heading');
    const close = el.querySelector('[data-practice-close]');
    const hr = h.getBoundingClientRect(), cr = close.getBoundingClientRect(), dr = el.getBoundingClientRect();
    return {
      outsideArticle: !el.closest('article'),
      titleBackground: getComputedStyle(h).backgroundColor,
      titleMarker: getComputedStyle(h, '::before').display,
      headerOverlap: hr.right > cr.left + 2,
      fit: dr.left >= 0 && dr.right <= document.documentElement.clientWidth + 1,
      docScroll: document.documentElement.scrollWidth,
      docWidth: document.documentElement.clientWidth
    };
  });
  assert(visual.outsideArticle && visual.titleBackground === 'rgba(0, 0, 0, 0)' && visual.titleMarker === 'none' && !visual.headerOverlap && visual.fit && visual.docScroll <= visual.docWidth + 1, width + 'px: ' + JSON.stringify(visual));
  await dialog.screenshot({ path: path.join(dir, sample.cert + '-' + width + '-initial.png') });
  const loopCount = sample.explain ? sample.count : 2;
  for (let i=0; i<loopCount; i++) {
    const check=item.locator('[data-practice-check]');
    assert(await check.isDisabled());
    const radios=item.locator('input[type="radio"]');
    assert.equal(await radios.count(), 4);
    await radios.nth(i%2).check();
    assert(await check.isEnabled());
    await check.click();
    assert(await item.locator('[data-practice-feedback]').isVisible());
    assert.equal(await item.locator('.practice-choice.is-correct').count(), 1);
    assert(await item.locator('[data-practice-answer]').textContent());
    const explanationLabel = (await item.locator('[data-practice-explanation-label]').textContent()).trim();
    assert.equal(explanationLabel, sample.explain ? '해설' : '해설 상태');
    if (!sample.explain) assert((await item.locator('[data-practice-explanation]').textContent()).includes('검증된 문항별 해설'));
    if (i === 0) await dialog.screenshot({ path: path.join(dir,sample.cert+'-'+width+'-graded.png') });
    await item.locator('[data-practice-next]').click();
  }
  if (sample.explain) {
    const completed=dialog.locator('[data-practice-complete]');
    assert(await completed.isVisible());
    assert((await completed.locator('[data-practice-score]').textContent()).includes('6문제 중'));
    await dialog.screenshot({path:path.join(dir,sample.cert+'-'+width+'-complete.png')});
    await completed.locator('[data-practice-restart]').click();
    assert(await item.isVisible());
  } else {
    assert(await item.isVisible());
    assert((await body.textContent()).includes('3.'), 'next problem navigation');
  }
  await page.keyboard.press('Escape');
  assert(!(await dialog.isVisible()));
  assert(await opener.evaluate(el=>el===document.activeElement));
  await opener.click();
  await body.waitFor({state:'visible'});
  assert((await body.textContent()).startsWith('1.'), 'reopened quiz must start from first question');
  assert(await item.locator('[data-practice-check]').isDisabled());
  await dialog.locator('[data-practice-close]').click();
  assert(!(await dialog.isVisible()));
  assert.equal(errors.length,0, 'page errors: '+JSON.stringify(errors));
  if (sample.cert==='industrial-safety') {
    const old=page.locator('[data-open="20220424_010"]');
    await old.click();
    const existing=page.locator('#deferred-question-dialog');
    assert(await existing.isVisible());
    await existing.locator('[data-reveal]').waitFor({state:'visible'});
    await existing.locator('[data-close]').click();
  }
  report.samples.push({cert:sample.cert,slug:sample.slug,width,questionCount:sample.count,scoreAndNavigation:'PASS',modalAndStyles:'PASS',existingPopup:sample.cert==='industrial-safety'?'PASS':'not checked'});
  await context.close();
}
(async()=>{
  browser=await chromium.launch({headless:true});
  for(const sample of samples)for(const width of sample.widths) {
    try {await verify(sample,width)}catch(err){report.errors.push({cert:sample.cert,width,error:String(err),stack:err.stack})}
  }
  await browser.close();
  fs.writeFileSync(path.join(dir,'report.json'),JSON.stringify(report,null,2));
  assert.deepEqual(report.errors,[],JSON.stringify(report.errors));
  console.log('All-chapter instant practice browser QA PASS: industrial-safety, energy-management, computer-literacy; 320/390/1440');
})().catch(e=>{console.error(e);process.exitCode=1});
