const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const audit='docs/audits/2026-10-22-all-chapter-hierarchy/';
const baseline=JSON.parse(fs.readFileSync(audit+'baseline.json'));
const pages=Object.entries(baseline.html).filter(([,r])=>r.chapter).map(([file])=>({file,route:file.slice(4,-10),cert:file.split('/')[1]}));
const base=(process.env.QA_BASE_URL||'http://127.0.0.1:4321').replace(/\/$/,'');
const out=process.env.QA_OUTPUT_DIR||'qa-results/all-chapter-hierarchy';
fs.mkdirSync(out,{recursive:true});
const report={base,commit:process.env.QA_COMMIT||null,device:'Chromium viewport emulation',cases:[],errors:[],httpMatches:0};
const hash=b=>createHash('sha256').update(b).digest('hex');
const save=()=>fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2)+'\n');
let browser;
(async()=>{
  // A stale CDN document must not pass the visual checks for a new deployment.
  for(const {file,route}of pages){
    const response=await fetch(base+route);assert.equal(response.status,200,route);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(fs.readFileSync(file)),route+': served build');
    report.httpMatches++;
  }
  browser=await chromium.launch({executablePath:process.env.QA_BROWSER_EXECUTABLE});
  await Promise.all([320,390,768,1440].map(async width=>{
    const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768});
    await context.route('**/*',r=>(new URL(r.request().url()).origin===new URL(base).origin||new URL(r.request().url()).hostname==='cdn.jsdelivr.net')?r.continue():r.abort());
    const page=await context.newPage();let current='';const captured=new Set();
    page.on('pageerror',e=>report.errors.push(current+': '+e));
    for(const row of pages){
      current=width+row.route;
      try{
        await page.goto(base+row.route,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
        const layout=await page.evaluate(()=>{
          const a=document.querySelector('.chapter-page article');
          const visible=e=>getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().height>0;
          const headings=[...a.children].filter(e=>e.tagName==='H2');
          const nextVisible=e=>{let n=e.nextElementSibling;while(n&&!visible(n))n=n.nextElementSibling;return n;};
          const previousVisible=e=>{let n=e.previousElementSibling;while(n&&!visible(n))n=n.previousElementSibling;return n;};
          const rect=e=>e.getBoundingClientRect();
          return {width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
            h1:document.querySelectorAll('h1').length,mathErrors:a.querySelectorAll('.katex-error').length,
            sections:headings.map((e,i)=>{const p=previousVisible(e),n=nextVisible(e),s=getComputedStyle(e,'::after');return {
              title:e.textContent,id:e.id,background:getComputedStyle(e).backgroundColor,font:parseFloat(getComputedStyle(e).fontSize),divider:s.height,dividerContent:s.content,
              dividerTop:parseFloat(s.top),previousGap:p?rect(e).top-rect(p).bottom:null,nextTag:n?.tagName,
              nextGap:n?rect(n).top-rect(e).bottom:null,needsDivider:i>0||Boolean(n?.matches('.exam-history,.related-list')),
            };}),
            tables:[...a.querySelectorAll('table')].filter(visible).map(e=>({font:parseFloat(getComputedStyle(e).fontSize),cells:[...e.querySelectorAll('th,td')].map(c=>getComputedStyle(c).verticalAlign)})),
            related:[...a.querySelectorAll(':scope>.related-list')].map(e=>({margin:getComputedStyle(e).marginTop,style:getComputedStyle(e).listStyleType})),
            practice:[...a.querySelectorAll(':scope>[data-fire-practice-entry]')].map(e=>({border:getComputedStyle(e).borderTopWidth,gap:rect(e.querySelector('.fire-actions')).top-rect(e.querySelector('h2')).bottom})),
            cellLists:[...a.querySelectorAll('td>ul.chapter-cell-items')].map(ul=>({
              style:getComputedStyle(ul).listStyleType,
              items:[...ul.children].map(li=>({text:li.textContent.trim(),top:rect(li).top,bottom:rect(li).bottom,font:parseFloat(getComputedStyle(li).fontSize),marker:parseFloat(getComputedStyle(li,'::marker').fontSize)})),
            })),
          };
        });
        assert(layout.scroll<=layout.width+1,current+': page overflow');assert.equal(layout.h1,1);assert.equal(layout.mathErrors,0);
        for(const h of layout.sections){
          assert.equal(h.font,width<768?18:20,current+': section typography');
          const quiet=['핵심-개념','절차-및-판별-기준','자주-틀리는-포인트'].includes(h.id);
          assert.equal(h.background,quiet?'rgba(0, 0, 0, 0)':'rgb(239, 246, 255)',current+': section emphasis '+h.title);
          if(h.needsDivider){
            assert.equal(h.divider,'1px',current+': section divider '+h.title);
            assert.equal(h.dividerTop,width<768?-16:-24,current+': midpoint divider');
            // A divider must have breathing room above the preceding content.
            assert(h.previousGap>= (width<768?32:48)-1,current+': section gap '+h.title+' '+h.previousGap);
          }
          if(!h.needsDivider)assert.notEqual(h.divider,'1px',current+': no duplicate divider before the first section');
          if(['P','UL','OL','TABLE'].includes(h.nextTag))assert(Math.abs(h.nextGap-16)<=1,current+': heading/content '+h.title+' '+h.nextGap);
        }
        for(const t of layout.tables){assert.equal(t.font,14,current+': table typography');assert(t.cells.every(v=>v==='top'),current+': cell alignment');}
        for(const r of layout.related){assert.equal(r.margin,'0px');assert.equal(r.style,'none');}
        for(const p of layout.practice){assert.equal(p.border,'1px');assert(Math.abs(p.gap-16)<=1);}
        for(const ul of layout.cellLists){
          assert.equal(ul.style,'disc');assert(ul.items.length>=2,current+': multiple table items');
          for(let i=0;i<ul.items.length;i++){
            const item=ul.items[i];assert(item.text,current+': no empty list item');assert.equal(item.font,14);assert(item.marker<item.font,current+': small bullet');
            if(i)assert(item.top>ul.items[i-1].bottom,current+': separate table item lines');
          }
        }
        report.cases.push({width,route:row.route,cert:row.cert,sections:layout.sections.length,tables:layout.tables.length,passed:true});
        const representative=['concentration-conversion','goal-seek','management-target-grades','fuel-properties','character-codes','fire-emergency-plan-contents','boiler-work-safety','industrial-accident-insurance','grounding-exemption'].some(slug=>row.route.includes('/'+slug+'/'));
        if(representative||!captured.has(row.cert)){
          await page.screenshot({path:out+'/'+width+'-'+row.cert+'-'+row.route.split('/').at(-2)+'.png',fullPage:true});captured.add(row.cert);
        }
      }catch(e){report.errors.push(current+': '+e);report.cases.push({width,route:row.route,passed:false,error:String(e)});await page.screenshot({path:out+'/failure-'+width+'-'+row.route.split('/').at(-2)+'.png',fullPage:true}).catch(()=>{});}
    }
    await context.close();
  }));
  report.passed=report.errors.length===0;save();await browser.close();assert(report.passed,JSON.stringify(report.errors));
  console.log('[All chapter hierarchy browser] PASS',report.httpMatches,'served chapters;',report.cases.length,'viewport cases');
})().catch(async e=>{report.passed=false;report.errors.push(String(e));save();if(browser)await browser.close().catch(()=>{});console.error(e);process.exitCode=1;});
