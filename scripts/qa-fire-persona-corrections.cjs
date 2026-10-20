const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const audit='docs/audits/2026-10-20-fire-persona-corrections';
const changes=JSON.parse(fs.readFileSync(audit+'/question-corrections.json','utf8'));
const output=process.env.QA_OUTPUT_DIR||'qa-results/fire-persona-corrections';
fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const result={pages:[],errors:[],imageContentReview:'not repeated; unchanged assets',physicalDevices:'not tested'};
  try{
    for(const width of [390,1440]){
      const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
      page.on('pageerror',error=>result.errors.push(error.message));
      for(const row of changes.chapterChanges){
        const md=fs.readFileSync(row.path,'utf8');
        const slug=md.match(/^slug: "([^"]+)"/m)[1];
        const route='/fire-safety-manager-level2/written/'+path.basename(path.dirname(row.path))+'/'+slug+'/';
        const response=await page.goto((process.env.QA_BASE_URL||'http://127.0.0.1:4321')+route,{waitUntil:'networkidle'});
        assert.equal(response.status(),200,route);
        const heading=page.getByRole('heading',{name:row.title,exact:true});
        assert.equal(await heading.count(),1,row.chapterId+' addition present');
        await heading.scrollIntoViewIfNeeded();
        const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
        assert.equal(overflow,false,row.chapterId+' viewport overflow at '+width);
        const linkErrors=await page.locator('article a[href^="/fire-safety-manager-level2/"]').evaluateAll(links=>links.filter(a=>!new URL(a.href).pathname.endsWith('/')).map(a=>a.getAttribute('href')));
        assert.deepEqual(linkErrors,[]);
        assert.equal(await page.locator('[data-fire-practice-entry]').count(),1);
        if(['FSM2-005','FSM2-006','FSM2-057','FSM2-062'].includes(row.chapterId))await page.screenshot({path:path.join(output,row.chapterId+'-'+width+'.png')});
        result.pages.push({chapterId:row.chapterId,width,route,newSectionPresent:true,viewportOverflow:false});
      }
      await page.close();
    }
    assert.deepEqual(result.errors,[]);
    assert.equal(result.pages.length,56);
  }finally{
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(result,null,2)+'\n');
    await browser.close();
  }
  console.log('[Fire persona browser] 28 revised chapters at 390/1440px; headings, overflow and practice entries PASS');
})().catch(error=>{console.error(error);process.exitCode=1;});
