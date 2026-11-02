const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const base = (process.env.QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const route = '/industrial-safety/written/safety-management/accident-cause-classification/';
const output = process.env.QA_OUTPUT_DIR || 'qa-results/accident-cause-chapter';
fs.mkdirSync(output, {recursive:true});
const results = [], errors = [];
let browser;
(async () => {
  const source = fs.readFileSync('src/content/chapters/safety-management/accident-cause-classification.md', 'utf8');
  assert.match(source, /\| \*\*불가항력\*\* \| \*\*2%\*\* \| 천재지변 \|/);
  assert(!source.includes('불가항력 (천재 등)'));
  assert(source.includes('accident-cause-4m-label'));
  assert(source.includes('accident-cause-term-label'));
  assert(!source.includes('Engineering·Education·Enforcement'));
  const validTerms=['Engineering (기술적 대책)','Education (교육적 대책)','Enforcement (관리적 대책)'];
  for(const term of validTerms) assert.equal(source.split(term).length-1,2, term + ': both tables');
  browser = await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  for (const width of [320,390,400,768,1440]) {
    const context = await browser.newContext({viewport:{width,height:824},isMobile:width<768,hasTouch:width<768});
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
    const page = await context.newPage();
    page.on('pageerror', error=>errors.push(width+': '+String(error)));
    try {
      const res=await page.goto(base+route,{waitUntil:'load'});
      assert.equal(res.status(),200, 'chapter must load');
      await page.evaluate(()=>document.fonts.ready);
      const state=await page.evaluate(()=>{
        const article=document.querySelector('article');
        const first=article.querySelector('table:has(.accident-cause-4m-label)');
        const second=article.querySelector('table:has(.accident-cause-term-label)');
        const rect=e=>e.getBoundingClientRect();
        const headers=t=>[...t.querySelectorAll('thead th')];
        const normalize=text=>text.replace(/\s+/g,' ').trim();
        const inspect=t=>({
          tableDisplay:getComputedStyle(t).display,
          left:rect(t).left,right:rect(t).right,width:rect(t).width,
          headerText:headers(t).map(x=>x.textContent.trim()),
          headerRects:headers(t).map(x=>({x:rect(x).left,right:rect(x).right,width:rect(x).width,background:getComputedStyle(x).backgroundColor,vertical:getComputedStyle(x).verticalAlign}))
        });
        const title=id=>{const el=article.querySelector('#'+id);return {background:getComputedStyle(el).backgroundColor,padding:getComputedStyle(el).padding,font:getComputedStyle(el).fontSize,before:getComputedStyle(el,'::before').backgroundColor};};
        const cell=[...second.querySelectorAll('tbody tr')].find(row=>row.textContent.includes('Engineering'))?.querySelector('td:last-child');
        const exam=[...article.querySelectorAll('#시험-포인트 + table tbody tr')].find(row=>row.textContent.includes('Engineering'))?.querySelector('td:last-child');
        const lineText=el=>el?.innerHTML.replace(/<br\s*\/?>/g,'\n').replace(/<[^>]*>/g,'').split('\n').map(s=>normalize(s)).filter(Boolean);
        return {
          page:{scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth},
          article:{left:rect(article).left,right:rect(article).right},
          first:inspect(first),second:inspect(second),
          terms:lineText(cell),examTerms:lineText(exam),
          termBreaks:cell?.querySelectorAll('br').length,
          mistakes:title('자주-틀리는-포인트'),exam:title('시험-포인트'),
          headings:article.querySelectorAll('h2').length
        };
      });
      assert(state.page.scroll<=state.page.viewport+1,width+': no document horizontal overflow');
      const within=t=>assert(t.left>=state.article.left-2&&t.right<=state.article.right+2,width+': table fits article');
      for(const table of [state.first,state.second]){
        assert.equal(table.tableDisplay,'table', width+': proper table layout (not display:block)');
        within(table);
        assert(Math.abs(table.headerRects.at(-1).right-table.right)<3,width+': header fills table width');
        assert(table.headerRects.every(h=>h.background==='rgb(242, 244, 246)'&&h.vertical==='middle'),width+': header background and vertical alignment');
      }
      assert.deepEqual(state.first.headerText,['구분','내용']);
      assert.deepEqual(state.second.headerText,['용어','소속','주의점']);
      assert(state.first.headerRects[0].width/state.first.width>.34,'4M label width');
      assert(state.second.headerRects[0].width/state.second.width>.27,'term label width expanded');
      assert.deepEqual(state.terms,validTerms,'3E lines + Korean definitions');
      assert.equal(state.termBreaks,2,'3E uses two explicit line breaks');
      assert(state.examTerms?.some(x=>x.includes('Enforcement')),'exam point also includes English term');
      assert.deepEqual(state.mistakes,state.exam,'section headings share the same presentation');
      assert.equal(state.mistakes.background,'rgb(239, 246, 255)','mistakes section background restored');
      if(width===320||width===400||width===1440){
        await page.locator('table:has(.accident-cause-term-label)').scrollIntoViewIfNeeded();
        await page.screenshot({path:output+'/accident-cause-'+width+'.png'});
      }
      results.push({width,chapter:route,tables:'PASS',headings:'PASS',content:'PASS',overflow:'PASS'});
    } finally {
      await page.close();
      await context.close();
    }
  }
  assert.deepEqual(errors,[],'no script errors');
  console.log('[Accident cause chapter] PASS '+JSON.stringify(results));
})().catch(error=>{console.error(error);process.exitCode=1}).finally(async()=>{
  fs.writeFileSync(output+'/result.json',JSON.stringify({results,errors},null,2)+'\n');
  await browser?.close();
});
