const {chromium} = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const preview = process.env.QA_FACILITY_PREVIEW === '1';
const mode = preview ? 'private-preview' : 'publication';
const output = `qa-results/facility-launch/${mode}`;
fs.mkdirSync(output, {recursive: true});
const imageCounts = {'what-is-facility-management':4, 'first-job':4, 'employment-types':5, 'shifts-and-pay':5, 'public-sector-comparison':4};
const pages = ['/', '/facility-management/', ...['career','jobs','practice','qualifications'].map(x=>`/facility-management/${x}/`), ...Object.keys(imageCounts).map(x=>`/facility-management/${x === 'public-sector-comparison' ? 'jobs' : 'career'}/${x}/`), '/certifications/', '/computer-literacy/written/computer-basics/computer-classification/'];
(async () => {
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of [320,390,768,1440]) {
      const context = await browser.newContext({viewport:{width,height:900}});
      await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
      const page = await context.newPage();
      for (const path of pages) {
        const response = await page.goto(base+path);
        assert.equal(response.status(),200,path);
        await page.evaluate(()=>document.fonts.ready);
        const slug = path.split('/').filter(Boolean).at(-1);
        const expected = imageCounts[slug];
        if (path.startsWith('/facility-management/')) {
          const empty = ['practice','qualifications'].includes(slug);
          assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), preview ? 'noindex, nofollow' : empty ? 'noindex, follow' : 'index, follow');
          assert.equal(await page.locator('.service-switch [data-service-link="facility"]').getAttribute('aria-current'),'page');
          if (expected !== undefined) {
            assert.equal(await page.locator('.facility-body img').count(),expected,`${path}: image count`);
            assert.equal(await page.locator('.facility-article-meta time').count(),3);
            for (const date of await page.locator('.facility-article-meta time').evaluateAll(elements=>elements.map(el=>el.dateTime))) assert.equal(date,'2026-11-03');
            assert(!(await page.locator('.facility-article > article').innerText()).includes('검토용 초안'));
            assert.equal(await page.locator('.facility-sources a').count()>0,true);
            const images = page.locator('.facility-body img');
            for (let i=0;i<expected;i++) {
              const img = images.nth(i);
              await img.scrollIntoViewIfNeeded();
              await img.evaluate(el=>el.decode());
              const info = await img.evaluate(el=>({src:el.getAttribute('src'),alt:el.getAttribute('alt'),complete:el.complete,naturalWidth:el.naturalWidth,renderWidth:el.getBoundingClientRect().width}));
              assert(info.complete && info.naturalWidth>0 && info.alt?.trim(),`${path} image ${i}: load and alt`);
              assert(info.renderWidth>0 && info.renderWidth<=width,`${path} image ${i}: width`);
              if (width===320 || width===390) {
                const dir = `${output}/images-${width}`;
                fs.mkdirSync(dir,{recursive:true});
                await img.screenshot({path:`${dir}/${info.src.split('/').slice(-2).join('-')}.png`});
              }
            }
          }
        }
        const dimensions = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
        assert(dimensions.scroll<=dimensions.client+1,`${width} ${path}: overflow ${JSON.stringify(dimensions)}`);
        assert.equal(await page.locator('h1').count(),1,path);
        assert.equal(await page.locator('.service-switch a').count(),2,path);
        if (['facility-management','career','first-job'].includes(slug)) await page.screenshot({path:`${output}/${slug}-${width}.png`,fullPage:true});
        if (path.includes('/computer-classification/')) {
          const selector = page.locator('summary[aria-label="자격증 선택"]');
          if (width<768) {
            assert(!(await selector.isVisible()),'mobile chapter hides certificate menu');
            assert(await page.locator('summary[aria-label="챕터 목차"]').isVisible());
          } else if (width>=1024) {
            assert(!(await selector.isVisible()),'desktop chapter hides certificate menu');
            assert(!(await page.locator('summary[aria-label="챕터 목차"]').isVisible()),'desktop chapter uses sidebar');
          } else {
            await selector.click();
            assert(await page.locator('.gnb-cert-dropdown').isVisible());
            await selector.press('Escape');
            assert(!(await page.locator('.gnb-cert-dropdown').isVisible()));
          }
        }
        results.push({width,path,status:'PASS'});
      }
      await page.goto(base+'/facility-management/');
      await page.locator('.service-switch [data-service-link="certifications"]').click();
      assert.equal(new URL(page.url()).pathname,'/');
      const certificationHomeHeading = await page.locator('h1').innerText();
      assert.equal(await page.locator('.service-switch [data-service-link="certifications"]').getAttribute('aria-current'),'page');
      await page.locator('.service-switch [data-service-link="facility"]').click();
      assert.equal(new URL(page.url()).pathname,'/facility-management/');
      await page.locator('.gnb-logo').click();
      assert.equal(new URL(page.url()).pathname,'/');
      assert.equal(await page.locator('h1').innerText(),certificationHomeHeading,'logo and certification toggle open the same home');
      await page.screenshot({path:`${output}/certification-home-${width}.png`,fullPage:true});
      const excluded = await page.request.get(base+'/facility-management/career/reading-job-postings/');
      assert.equal(excluded.status(),404,'unapproved draft is inaccessible');
      await context.close();
    }
    fs.writeFileSync(`${output}/results.json`,JSON.stringify({mode,cases:results.length,results},null,2)+'\n');
    console.log(`Facility QA: ${mode}, ${results.length} page and viewport cases PASS; 22 images and service switching verified at four widths`);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
