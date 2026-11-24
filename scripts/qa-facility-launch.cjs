const {chromium} = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const preview = process.env.QA_FACILITY_PREVIEW === '1';
const mode = preview ? 'private-preview' : 'publication';
const output = `qa-results/facility-launch/${mode}`;
async function decodeVisibleImage(image) {
  await image.scrollIntoViewIfNeeded();
  await image.evaluate(async element => {
    let timer;
    try {
      await Promise.race([
        element.decode(),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`Image load timed out: ${element.currentSrc || element.src}`)), 10000);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  });
}

fs.mkdirSync(output, {recursive: true});
const bulkImages=JSON.parse(fs.readFileSync('docs/audits/2026-11-06-facility-image-bulk/manifest.json'));
const bodyThumbnailRemovals = require('../docs/audits/2026-11-24-facility-body-thumbnails.json');
const imageCounts = {'what-is-facility-management':4, 'first-job':4, 'employment-types':5, 'shifts-and-pay':5, 'public-sector-comparison':5, 'electric-unlimited':1, 'electric-license-appointment-comparison':1};
for(const [file,row] of Object.entries(bulkImages.source)) {const slug=file.split('/').at(-1).replace('.md','');if(slug in imageCounts)imageCounts[slug]=row.images;}
const articleCategory = id => id === 'public-sector-comparison' ? 'jobs' : id === 'electric-unlimited' ? 'intro' : id === 'electric-license-appointment-comparison' ? 'qualifications' : 'career';
const pages = ['/facility-management/', ...['intro','career','stories','jobs','practice','qualifications'].map(x=>`/facility-management/${x}/`), ...Object.keys(imageCounts).map(x=>`/facility-management/${articleCategory(x)}/${x}/`), '/certifications/', '/computer-literacy/written/computer-basics/computer-classification/', '/energy-management/', '/energy-management/written/', '/computer-literacy/written/computer-basics/', '/about/'];
(async () => {
  const { careerThumbnailRows } = await import('./read-facility-career-thumbnails.mjs');
  const entryRows = careerThumbnailRows.filter(row => row.category);
  const storyPreviewRows = (await import('./read-story-thumbnails-3x2.mjs')).storyThumbnail3x2Rows;
  const replacedStoryIds = new Set(storyPreviewRows.map(row=>row.id));
  const listingThumbnails = (await import('./read-hobyeongbaekma-list-thumbnails.mjs')).thumbnailRows
    .filter(row=>!replacedStoryIds.has(row.id)).map(({id,name})=>[id,name]);
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const width of [320,390,768,1024,1440]) {
      const context = await browser.newContext({viewport:{width,height:900}});
      await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
      const page = await context.newPage();
      let facilityHomeGeometry = null;
      for (const path of new Set([...pages, ...entryRows.map(row => row.route)])) {
        const response = await page.goto(base+path);
        assert.equal(response.status(),200,path);
        await page.evaluate(()=>document.fonts.ready);
        const slug = path.split('/').filter(Boolean).at(-1);
        const expected = Object.hasOwn(imageCounts, slug) ? imageCounts[slug] - Number(Object.hasOwn(bodyThumbnailRemovals, slug)) : undefined;
        if (path === '/facility-management/stories/') {
          assert.equal(await page.locator('.facility-card img[src*="/list-thumbnails/"]').count(),listingThumbnails.length,'original list thumbnails retained except approved previews');
          assert.equal(await page.locator('.facility-card img[src*="/list-thumbnails-3x2/"]').count(),storyPreviewRows.length,'all nineteen updated 3:2 story images');
          for (const [id,name] of listingThumbnails) {
            const card=page.locator(`a.facility-card[href="/facility-management/career/${id}/"]`);
            assert.equal(await card.count(),1,id+': existing article link retained');
            const image=card.locator('img');
            assert.equal(await image.getAttribute('src'),`/images/facility-series/list-thumbnails/${name}.webp`);
            await decodeVisibleImage(image);
            const state=await image.evaluate(el=>{
              const frame=el.parentElement.getBoundingClientRect();
              return {natural:[el.naturalWidth,el.naturalHeight],frameRatio:frame.width/frame.height,fit:getComputedStyle(el).objectFit};
            });
            assert.deepEqual(state.natural,[1448,1086],id+': optimized WebP loads');
            assert(Math.abs(state.frameRatio-3/2)<.01,id+': consistent 3:2 frame');
            assert.equal(state.fit,'contain',id+': full image shown');
          }
          for (const row of storyPreviewRows) {
            const card=page.locator(`a.facility-card[href="${row.route}"]`);
            const image=card.locator('img');
            assert.equal(await card.count(),1,row.id+': story card retained');
            assert.equal(await image.getAttribute('src'),row.publicFile.replace(/^public/,''));
            await decodeVisibleImage(image);
            const state=await image.evaluate(el=>{
              const frame=el.parentElement.getBoundingClientRect();
              return {natural:[el.naturalWidth,el.naturalHeight],frameRatio:frame.width/frame.height,fit:getComputedStyle(el).objectFit};
            });
            assert.deepEqual(state.natural,[1536,1024],row.id+': 3:2 optimized WebP loads');
            assert(Math.abs(state.frameRatio-3/2)<.01,row.id+': matched image and frame ratio');
            assert.equal(state.fit,'contain',row.id+': no crop');
          }
        }

        // Both service homepages must share the same heading scale, left edge,
        // intro spacing and section-heading hierarchy at every viewport.
        if (path === '/facility-management/' || path === '/certifications/') {
          const isFacilityHome = path === '/facility-management/';
          const geometry = await page.evaluate(isFacility => {
            const main = document.querySelector(isFacility ? '.facility-main' : '.certifications-home-main');
            const intro = document.querySelector(isFacility ? '.facility-intro' : '.certifications-home-intro');
            const section = document.querySelector(isFacility ? '.facility-featured' : '.certifications-home-section');
            const sectionHead = section?.querySelector(isFacility ? '.facility-section-head' : '.certifications-home-section-head');
            const title = intro?.querySelector('h1');
            const subtitle = intro?.querySelector('p');
            const h2 = sectionHead?.querySelector('h2.gpl-h2');
            if (!main || !intro || !section || !sectionHead || !title || !subtitle || !h2) return null;
            const css = el => getComputedStyle(el);
            const x = el => Math.round(el.getBoundingClientRect().left * 100) / 100;
            return {
              mainLeft: x(main), titleLeft: x(title), h2Left: x(h2),
              mainPaddingTop: css(main).paddingTop,
              introPaddingTop: css(intro).paddingTop, introPaddingBottom: css(intro).paddingBottom,
              introBorder: css(intro).borderBottomWidth,
              titleFont: css(title).fontSize, titleWeight: css(title).fontWeight,
              titleLineHeight: css(title).lineHeight,
              titleAlignment: css(title).textAlign,
              subtitleFont: css(subtitle).fontSize, subtitleLineHeight: css(subtitle).lineHeight,
              sectionPaddingTop: css(section).paddingTop,
              h2Font: css(h2).fontSize, h2Weight: css(h2).fontWeight,
              h2LineHeight: css(h2).lineHeight,
              sectionHeadMarginBottom: css(sectionHead).marginBottom,
            };
          }, isFacilityHome);
          assert(geometry, width+' '+path+': landing headings exist');
          assert.equal(geometry.mainPaddingTop,width >= 768 ? '24px' : '16px','compact main top padding');
          assert.equal(geometry.introPaddingTop,width >= 768 ? '16px' : '8px','compact intro top padding');
          if (isFacilityHome) {
            facilityHomeGeometry = geometry;
          } else {
            assert.deepEqual(geometry, facilityHomeGeometry, width+': certification homepage matches facility heading hierarchy');
            assert.equal(await page.locator('.certifications-home-intro h1').innerText(), '자격증의 모든 것');
            assert.equal(await page.locator('.certifications-home-section-head h2').innerText(), '자격증 선택');
            assert.equal(await page.locator('.certifications-home-intro .hero-badge').count(), 0, 'no redundant certification hero badge');
            assert.equal(await page.locator('.certifications-home-section .card').count(), 4, 'four existing certifications retained');
          }
        }

        if (path.startsWith('/facility-management/')) {
          const empty = slug === 'practice';
          assert.equal(await page.locator('.gnb-logo').getAttribute('href'),'/facility-management/','facility logo destination');
          assert.equal(await page.locator('summary[aria-label="시설 카테고리"]').count(),1,'facility-first navigation');
          assert.equal((await page.locator('summary[aria-label="시설 카테고리"]').innerText()).trim(),'카테고리','same visible facility label at every viewport');
          assert.equal(await page.locator('summary[aria-label="자격증 선택"]').count(),0,'no certificate picker in facility area');
          if (['intro','career','stories','jobs','practice','qualifications'].includes(slug)) {
            assert.equal(await page.locator('.facility-category-page').count(),1,'category-specific layout');
            assert.equal(await page.locator('.facility-category-header .facility-eyebrow').count(),0,'redundant eyebrow removed');
            assert.equal(await page.locator('.facility-category-header h1.gpl-h1').count(),1,'compact subject-list heading');
            assert.equal(await page.locator('.facility-category-header h1').innerText(),
              await page.locator('.breadcrumb .current').innerText(), 'category H1 matches breadcrumb');
            const categoryHeader = await page.evaluate(() => {
              const header = document.querySelector('.facility-category-header');
              const h1 = header.querySelector('h1');
              const crumb = document.querySelector('.facility-category-page .breadcrumb');
              const section = document.querySelector('.facility-category-list');
              return {
                titleFont: getComputedStyle(h1).fontSize,
                topPadding: getComputedStyle(header).paddingTop,
                breadcrumbGap: getComputedStyle(crumb).marginBottom,
                bottomRule: getComputedStyle(header).borderBottomWidth,
                listGap: getComputedStyle(section).paddingTop,
              };
            });
            assert.equal(categoryHeader.titleFont, width >= 768 ? '32px' : '24px',
              'category H1 uses certification subject-list size');
            assert.equal(categoryHeader.topPadding,'0px','heading starts directly after breadcrumb');
            assert.equal(categoryHeader.breadcrumbGap,'24px','subject-list breadcrumb spacing');
            assert.equal(categoryHeader.bottomRule,'1px','header separator retained');
            assert.equal(categoryHeader.listGap,'32px','article cards retain a clear 32px gap');
            const counts = {intro:3,career:9,stories:19,jobs:5,practice:0,qualifications:8};
            assert.equal(await page.locator('.facility-category-list .facility-card').count(),
              counts[slug], 'existing article cards retained by category');
            if (slug === 'stories') assert.equal(await page.locator('.facility-category-list .facility-card[href="/facility-management/career/hobyeongbaekma-hospital-large-university/"]').count(),1,'hospital ep.2-3 category card');
          }
          if (path === '/facility-management/') {
            assert.equal(await page.locator('.facility-intro .facility-eyebrow').count(),0,'top eyebrow removed');
            assert.equal(await page.locator('.facility-featured .facility-section-head .gpl-caption').count(),0,'redundant facility-intro caption removed');
            assert.equal(await page.locator('.facility-learning').count(),0,'home cross-service promotion removed');
            assert.equal(await page.locator('.facility-intro .facility-actions').count(),0,'hero CTA buttons removed');
            const counts = { intro: 2, career: 4, stories: 4, qualifications: 4 };
            for (const [category, count] of Object.entries(counts)) {
              const section = page.locator(`section[aria-labelledby="facility-group-${category}"]`);
              assert.equal(await section.locator('.facility-feed > .facility-card').count(), count, `${category}: home cards`);
              assert.equal(await section.locator('.facility-section-head a').count(), 0, `${category}: no heading CTA`);
              const more = section.locator('.facility-group-footer > a.facility-group-more');
              assert.equal(await more.count(), 1, `${category}: one bottom CTA`);
              assert.equal(await more.getAttribute('href'), `/facility-management/${category}/`, `${category}: full-list destination`);
              assert((await more.innerText()).includes('전체보기'), `${category}: full-list label`);
              const footerStyle = await section.locator('.facility-group-footer').evaluate(el => ({
                border: getComputedStyle(el).borderBottomWidth,
                borderColor: getComputedStyle(el).borderBottomColor,
                sectionTop: getComputedStyle(el.closest('.facility-home-group')).paddingTop,
                centered: Math.abs(el.getBoundingClientRect().left + el.clientWidth / 2 - el.querySelector('a').getBoundingClientRect().left - el.querySelector('a').getBoundingClientRect().width / 2) < 1,
              }));
              assert.equal(footerStyle.border, '1px', `${category}: category divider`);
              assert.equal(footerStyle.borderColor, 'rgb(196, 203, 212)', `${category}: stronger category divider color`);
              assert.equal(footerStyle.sectionTop, width < 640 ? '64px' : '80px', `${category}: wider section spacing`);
              if (count > 1) {
                assert.equal(await section.locator('.facility-feed > .facility-card + .facility-card').first().evaluate(el => getComputedStyle(el).borderTopColor),
                  'rgb(229, 232, 235)', `${category}: lighter article separators retained`);
              }
              assert(footerStyle.centered, `${category}: centered CTA`);
              assert((await more.evaluate(el => el.getBoundingClientRect().height)) >= 44, `${category}: touch target`);
            }
            assert.equal(await page.locator('.facility-card--lead').count(),1,'one featured article');
            assert.equal(await page.locator('.facility-category-link').count(),4,'only four populated categories are linked');
            const routes = await page.locator('.facility-card').evaluateAll(links => links.map(link => new URL(link.href).pathname));
            assert.equal(new Set(routes).size,routes.length,'no repeated home articles');
            const leadCover = page.locator('.facility-card--lead img');
            await decodeVisibleImage(leadCover);
            assert(await leadCover.evaluate(img => img.naturalWidth > 0),'lead uses existing article image');
          }
          assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), preview ? 'noindex, nofollow' : empty ? 'noindex, follow' : 'index, follow');
          assert.equal(await page.locator('.service-switch [data-service-link="facility"]').getAttribute('aria-current'),'page');
          assert.equal(await page.locator('.facility-card-action').count(),0,'redundant read-more text removed; entire card remains linked');
          assert.equal(await page.locator('.facility-card .card-label, .facility-card time').count(),0,'list badges and publication dates removed');
          const listCards = await page.locator('.facility-feed > .facility-card').evaluateAll(cards => cards.map(card => {
            const rect = el => el?.getBoundingClientRect().toJSON();
            const title = card.querySelector('.facility-card-title');
            const summary = card.querySelector('.facility-card-description');
            const previous = card.previousElementSibling;
            return {
              card: rect(card), title: rect(title), cover: rect(card.querySelector('.facility-card-cover')),
              summary: rect(summary), summaryDisplay: getComputedStyle(summary).display,
              padding: getComputedStyle(card).paddingTop, border: getComputedStyle(card).borderTopWidth,
              previous: previous ? rect(previous) : null,
              titleClipped: title.scrollHeight > title.clientHeight + 1 || title.scrollWidth > title.clientWidth + 1,
            };
          }));
          for (const row of listCards) {
            assert(!row.titleClipped, path+': complete title without clipping');
            if (row.previous) {
              assert.equal(row.border, '1px', path+': separator between feed items');
              assert(Math.abs(row.card.top - row.previous.bottom) < 1, path+': continuous single-column feed');
            }
            if (width < 640) {
              assert.equal(row.summaryDisplay, 'none', path+': mobile summary hidden');
              assert.equal(row.padding, '28px', path+': consistent mobile padding');
              assert(row.card.height >= 128, path+': minimum row height');
              if (row.cover) {
                assert(Math.abs(row.cover.width - (width < 360 ? 88 : 96)) < 1, path+': mobile thumbnail width');
                assert(Math.abs(row.title.left - row.cover.right - (width < 360 ? 16 : 20)) < 1, path+': title beside left thumbnail');
              }
            } else {
              assert(row.summaryDisplay !== 'none' && row.summary.width > 0 && row.summary.height > 0, path+': desktop summary');
              if (row.cover) {
                assert(row.title.right < row.cover.left && Math.abs(row.cover.right - row.card.right) < 1, path+': thumbnail at right edge');
                assert(Math.abs(row.cover.width - (width < 1024 ? width * .22 : 270)) < 1, path+': tablet or desktop thumbnail width');
              }
            }
            if (row.cover) assert(Math.abs(row.cover.width / row.cover.height - 3 / 2) < .01, path+': 3:2 thumbnail frame');
          }
          const borderlessHeroPath='/images/facility-drafts/03/01-employment-types-hero.webp';
          const covers = page.locator('.facility-card-cover img');
          for (const cover of await covers.all()) {
            await decodeVisibleImage(cover);
            const info=await cover.evaluate(img=>{
              const r=img.getBoundingClientRect(),p=img.parentElement.getBoundingClientRect();
              return {
                natural: [img.naturalWidth, img.naturalHeight],
                attributes: [Number(img.getAttribute('width')), Number(img.getAttribute('height'))],
                inFeed: Boolean(img.closest('.facility-feed')),
                render: r.width / r.height,
                fit: getComputedStyle(img).objectFit,
                inside: r.left >= p.left - .5 && r.right <= p.right + .5 && r.top >= p.top - .5 && r.bottom <= p.bottom + .5,
              };
            });
            assert.deepEqual(info.attributes, info.natural, path+': intrinsic image dimensions');
            if (!info.inFeed) assert(Math.abs(info.natural[0] / info.natural[1] - info.render) < .01, path+': original featured image ratio');
            assert.equal(info.fit,'contain',path+': no object-fit crop');
            assert(info.inside,path+': thumbnail inside border');
          }
          await page.evaluate(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
          const coverBorders = await page.locator('.facility-card-cover').evaluateAll(covers => covers.map(cover => ({src:new URL(cover.querySelector('img').src).pathname,width:getComputedStyle(cover).borderTopWidth,style:getComputedStyle(cover).borderTopStyle})));
          for (const border of coverBorders) {
            const isBorderlessHero=border.src===borderlessHeroPath;
            assert.equal(border.width,isBorderlessHero?'0px':'1px',path+': thumbnail border');
            assert.equal(border.style,isBorderlessHero?'none':'solid',path+': thumbnail solid border');
          }
          if (expected !== undefined) {
            assert.equal(await page.locator('.facility-body img').count(),expected,`${path}: image count`);
            const headingStyle = await page.locator('.facility-body :is(h2,h3)').evaluateAll(headings => headings.map(h => ({
              level:h.tagName,color:getComputedStyle(h).color,weight:getComputedStyle(h).fontWeight,
              background:getComputedStyle(h).backgroundColor,paddingTop:getComputedStyle(h).paddingTop,
              marginTop:getComputedStyle(h).marginTop,marginBottom:getComputedStyle(h).marginBottom
            })));
            for (const heading of headingStyle) {
              const isH2 = heading.level === 'H2';
              assert.equal(heading.color,isH2?'rgb(20, 92, 62)':'rgb(25, 31, 40)',path+': shared heading color');
              assert.equal(heading.weight,isH2?'700':'600',path+': heading hierarchy');
              assert.equal(heading.background,'rgba(0, 0, 0, 0)',path+': headings keep the white article background');
              assert.equal(heading.paddingTop,isH2?'24px':'0px',path+': shared heading top padding');
              assert.equal(heading.marginTop,heading.level==='H2'?'48px':'32px',path+': heading top margin retained');
              assert.equal(heading.marginBottom,heading.level==='H2'?'16px':'12px',path+': heading bottom margin retained');
            }
            assert.equal(await page.locator('.facility-summary h2').evaluate(h=>getComputedStyle(h).color),'rgb(25, 31, 40)',path+': summary title stays neutral');
            assert.equal(await page.locator('.facility-article-meta time').count(),2,'publish and reviewed dates');
            for (const date of await page.locator('.facility-article-meta time').evaluateAll(elements=>elements.map(el=>el.dateTime))) assert.equal(date,slug.startsWith('electric-')?'2026-11-20':'2026-11-03');
            assert(!(await page.locator('.facility-article > article').innerText()).includes('검토용 초안'));
            const toc = page.locator('.facility-toc');
            assert.equal(await toc.count(),1,'long article has table of contents');
            await toc.locator('summary').click();
            assert(await toc.locator('a').count()>=3,'TOC offers section anchors');
            const anchor = await toc.locator('a').first().getAttribute('href');
            assert(anchor?.startsWith('#') && await page.locator('[id="' + anchor.slice(1) + '"]').count()===1,'TOC targets an existing heading');
            assert.equal(await page.locator('.facility-sources a').count()>0,true);
            const images = page.locator('.facility-body img');
            if(slug==='public-sector-comparison'){
              const visualReview=JSON.parse(fs.readFileSync('docs/audits/2026-11-05-public-sector-visuals/manifest.json'));
              assert.deepEqual(await images.evaluateAll(imgs=>imgs.map(img=>new URL(img.src).pathname)),visualReview.images.filter(row=>row.publicPath!=='/images/facility-drafts/05/01-public-sector-hero.webp').map(row=>row.publicPath),'four reviewed body cards in order');
              for(const image of await images.all()){
                await decodeVisibleImage(image);
                assert.deepEqual(await image.evaluate(el=>[el.naturalWidth,el.naturalHeight]),[1440,1080],'reviewed raster dimensions');
              }
            }
            for (let i=0;i<expected;i++) {
              const img = images.nth(i);
              await decodeVisibleImage(img);
              const info = await img.evaluate(el=>({src:el.getAttribute('src'),alt:el.getAttribute('alt'),complete:el.complete,naturalWidth:el.naturalWidth,renderWidth:el.getBoundingClientRect().width,border:getComputedStyle(el).borderTopWidth,borderStyle:getComputedStyle(el).borderTopStyle,boxSizing:getComputedStyle(el).boxSizing}));
              assert(info.complete && info.naturalWidth>0 && info.alt?.trim(),`${path} image ${i}: load and alt`);
              assert(info.renderWidth>0 && info.renderWidth<=width,`${path} image ${i}: width`);
              const isBorderlessHero=info.src===borderlessHeroPath;
              assert.equal(info.border,isBorderlessHero?'0px':'1px',`${path} image ${i}: approved border`);
              assert.equal(info.borderStyle,isBorderlessHero?'none':'solid',`${path} image ${i}: border style`);
              assert.equal(info.boxSizing,'border-box',`${path} image ${i}: border fits layout`);
              if (width===320 || width===390) {
                const dir = `${output}/images-${width}`;
                fs.mkdirSync(dir,{recursive:true});
                await img.screenshot({path:`${dir}/${info.src.split('/').slice(-2).join('-')}.png`});
              }
            }
          }
        }
        const topGeometry=await page.evaluate(()=>{
          const gnb=document.querySelector('.gnb')?.getBoundingClientRect();
          const shell=document.querySelector('.hero-inner,.chapter-wrap,.policy-page,.facility-main,.certifications-home-main,.exam-index>.section,.subject-index>.section');
          const logo=document.querySelector('.gnb-logo').getBoundingClientRect();
          const mark=document.querySelector('.gnb-brand-mark').getBoundingClientRect();
          const wordmark=document.querySelector('.gnb-logo span').getBoundingClientRect();
          const toggle=document.querySelector('.service-switch').getBoundingClientRect();
          const h1=document.querySelector('.facility-intro h1,.certifications-home-intro h1');
          return {
            gap:toggle.left-logo.right,markGap:wordmark.left-mark.right,padding:shell?getComputedStyle(shell).paddingTop:null,
            homeGap:h1&&gnb?h1.getBoundingClientRect().top-gnb.bottom:null
          };
        });
        assert(Math.abs(topGeometry.gap-(width>=768?20:14))<1,width+' '+path+': logo-toggle gap '+JSON.stringify(topGeometry));
        assert(Math.abs(topGeometry.markGap-(width>=768?6:2))<1,width+' '+path+': icon-wordmark gap '+JSON.stringify(topGeometry));
        if(topGeometry.padding!==null)assert.equal(topGeometry.padding,width>=768?'24px':'16px',path+': shared compact top padding');
        if((path==='/facility-management/'||path==='/certifications/')&&topGeometry.homeGap!==null)assert(Math.abs(topGeometry.homeGap-(width>=768?40:24))<1,path+': compact home header gap');
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
            activeColor: getComputedStyle(active).color,
            activeBackground: before.backgroundColor,
            activeService: active.dataset.serviceLink,
            hitHeights: links.map(a => a.getBoundingClientRect().height),
            visualHeight: active.getBoundingClientRect().height - px(before.top) - px(before.bottom),
            width: switcher.getBoundingClientRect().width,
            shellHeight: switcher.getBoundingClientRect().height,
            viewport: document.documentElement.clientWidth
          };
        });
        assert.equal(pill.shellRadius, '999px', 'pill-shaped service switch outer border');
        assert.equal(pill.activeRadius, '999px', 'pill-shaped active background');
        assert.equal(pill.activeColor,'rgb(255, 255, 255)','active toggle label uses white text');
        if (pill.activeService === 'certifications') {
          assert.equal(pill.activeBackground,'rgb(29, 78, 216)','certification uses blue active pill at every width');
        } else {
          assert.equal(pill.activeBackground,'rgb(24, 121, 78)','community retains forest green active pill');
        }
        assert(pill.hitHeights.every(height => height >= 44), '44px service navigation touch targets');
        if (width < 768) {
          assert(Math.abs(pill.shellHeight - 36) <= 1, '36px visible mobile switch shell');
          assert(pill.visualHeight >= 29 && pill.visualHeight <= 31, '30px visible mobile active pill');
        } else {
          assert(Math.abs(pill.shellHeight - 46) <= 1, 'unchanged 46px desktop/tablet switch shell');
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
      console.log(`Facility QA: ${mode} at ${width}px PASS`);
    }
    fs.writeFileSync(`${output}/results.json`,JSON.stringify({mode,cases:results.length,results},null,2)+'\n');
    console.log(`Facility QA: ${mode}, ${results.length} page and viewport cases PASS; article imagery and service switching verified at five widths`);
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
