const {chromium} = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const preview = process.env.QA_FACILITY_PREVIEW === '1';
const mode = preview ? 'private-preview' : 'publication';
const output = `qa-results/facility-launch/${mode}`;
fs.mkdirSync(output, {recursive: true});
const imageCounts = {'what-is-facility-management':4, 'first-job':4, 'employment-types':5, 'shifts-and-pay':5, 'public-sector-comparison':4};
const pages = ['/facility-management/', ...['career','jobs','practice','qualifications'].map(x=>`/facility-management/${x}/`), ...Object.keys(imageCounts).map(x=>`/facility-management/${x === 'public-sector-comparison' ? 'jobs' : 'career'}/${x}/`), '/certifications/', '/computer-literacy/written/computer-basics/computer-classification/'];
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
          assert.equal(await page.locator('.gnb-logo').getAttribute('href'),'/facility-management/','facility logo destination');
          assert.equal(await page.locator('summary[aria-label="시설 카테고리"]').count(),1,'facility-first navigation');
          assert.equal(await page.locator('summary[aria-label="자격증 선택"]').count(),0,'no certificate picker in facility area');
          if (path === '/facility-management/') {
            assert.equal(await page.locator('.facility-intro .facility-eyebrow').count(),0,'top eyebrow removed');
            assert.equal(await page.locator('.facility-intro .facility-actions').count(),0,'hero CTA buttons removed');
            assert.equal(await page.locator('.facility-card').count(),5,'published articles appear once on home');
            assert.equal(await page.locator('.facility-category-link').count(),2,'only populated categories are linked');
            const routes = await page.locator('.facility-card').evaluateAll(links => links.map(link => new URL(link.href).pathname));
            assert.equal(new Set(routes).size,5,'no repeated home articles');
            const leadCover = page.locator('.facility-card--lead img');
            await leadCover.evaluate(img => img.decode());
            assert(await leadCover.evaluate(img => img.naturalWidth > 0),'lead uses existing article image');
          }
          assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), preview ? 'noindex, nofollow' : empty ? 'noindex, follow' : 'index, follow');
          assert.equal(await page.locator('.service-switch [data-service-link="facility"]').getAttribute('aria-current'),'page');
          if (expected !== undefined) {
            assert.equal(await page.locator('.facility-body img').count(),expected,`${path}: image count`);
            assert.equal(await page.locator('.facility-article-meta time').count(),2,'publish and reviewed dates');
            for (const date of await page.locator('.facility-article-meta time').evaluateAll(elements=>elements.map(el=>el.dateTime))) assert.equal(date,'2026-11-03');
            assert(!(await page.locator('.facility-article > article').innerText()).includes('검토용 초안'));
            const toc = page.locator('.facility-toc');
            assert.equal(await toc.count(),1,'long article has table of contents');
            await toc.locator('summary').click();
            assert(await toc.locator('a').count()>=3,'TOC offers section anchors');
            const anchor = await toc.locator('a').first().getAttribute('href');
            assert(anchor?.startsWith('#') && await page.locator('[id="' + anchor.slice(1) + '"]').count()===1,'TOC targets an existing heading');
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
        assert.deepEqual(
          await page.locator('.service-switch a').allTextContents().then(labels => labels.map(label => label.trim())),
          ['커뮤니티', '자격증'],
          'short service names are shared by both areas'
        );
        const pill = await page.locator('.service-switch').evaluate(switcher => {
          const links = [...switcher.querySelectorAll('a')];
          const active = links.find(a => a.getAttribute('aria-current') === 'page');
          const before = getComputedStyle(active, '::before');
          const px = value => Number.parseFloat(value) || 0;
          return {
            shellRadius: getComputedStyle(switcher).borderRadius,
            activeRadius: before.borderRadius,
            hitHeights: links.map(a => a.getBoundingClientRect().height),
            visualHeight: active.getBoundingClientRect().height - px(before.top) - px(before.bottom),
            width: switcher.getBoundingClientRect().width,
            shellHeight: switcher.getBoundingClientRect().height,
            viewport: document.documentElement.clientWidth
          };
        });
        assert.equal(pill.shellRadius, '999px', 'pill-shaped service switch outer border');
        assert.equal(pill.activeRadius, '999px', 'pill-shaped active background');
        assert(pill.hitHeights.every(height => height >= 44), '44px service navigation touch targets');
        if (width < 768) {
          assert(Math.abs(pill.shellHeight - 36) <= 1, '36px visible mobile switch shell');
          assert(pill.visualHeight >= 29 && pill.visualHeight <= 31, '30px visible mobile active pill');
        } else {
          assert(pill.visualHeight >= 35 && pill.visualHeight <= 39, '36px visible desktop/tablet active pill');
        }
        assert(pill.width <= pill.viewport - 24, 'service switch stays within narrow screens');
        if (width < 768) {
          const layout = await page.evaluate(() => {
            const nav = document.querySelector('.gnb-inner');
            const logo = nav?.querySelector('.gnb-logo');
            const switcher = nav?.querySelector('.service-switch');
            const menu = [...(nav?.querySelectorAll('details[data-gnb-menu]') || [])]
              .find(element => getComputedStyle(element).display !== 'none');
            const rect = element => {
              const r = element.getBoundingClientRect();
              return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, midY:(r.top+r.bottom)/2, width:r.width, height:r.height };
            };
            return { nav:rect(nav), logo:rect(logo), switcher:rect(switcher), menu:rect(menu), viewport:document.documentElement.clientWidth };
          });
          assert(layout.nav.height >= 54 && layout.nav.height <= 60, width+' '+path+': single-row header '+JSON.stringify(layout));
          assert(layout.logo.right + 2 <= layout.switcher.left, width+' '+path+': logo/switch separation '+JSON.stringify(layout));
          assert(layout.switcher.right + 2 <= layout.menu.left, width+' '+path+': switch/menu separation '+JSON.stringify(layout));
          assert(layout.logo.left >= -1 && layout.menu.right <= layout.viewport + 1, width+' '+path+': all navigation within viewport');
          assert(Math.abs(layout.logo.midY - layout.switcher.midY) <= 6, width+' '+path+': logo and switch aligned');
          assert(Math.abs(layout.menu.midY - layout.switcher.midY) <= 6, width+' '+path+': menu aligned with switch');
        }
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
      const facilityMenu = page.locator('summary[aria-label="시설 카테고리"]');
      await facilityMenu.click();
      assert(await page.locator('.gnb-facility-dropdown').isVisible(),'facility category menu opens');
      await facilityMenu.press('Escape');
      assert(!(await page.locator('.gnb-facility-dropdown').isVisible()),'facility category menu closes');
      await page.locator('.service-switch [data-service-link="certifications"]').click();
      assert.equal(new URL(page.url()).pathname,'/certifications/');
      assert.equal(await page.locator('.service-switch [data-service-link="certifications"]').getAttribute('aria-current'),'page');
      await page.locator('.service-switch [data-service-link="facility"]').click();
      assert.equal(new URL(page.url()).pathname,'/facility-management/');
      const excluded = await page.request.get(base+'/facility-management/career/reading-job-postings/');
      assert.equal(excluded.status(),404,'unapproved draft is inaccessible');
      await context.close();
    }
    fs.writeFileSync(`${output}/results.json`,JSON.stringify({mode,cases:results.length,results},null,2)+'\n');
    console.log(`Facility QA: ${mode}, ${results.length} page and viewport cases PASS; 22 images and service switching verified at four widths`);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
