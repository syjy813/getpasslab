const { chromium }=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
const out=process.env.QA_OUTPUT_DIR||'qa-results/certification-discovery';fs.mkdirSync(out,{recursive:true});
const pages=[['industrial','/industrial-safety/written/mechanical/boiler-safety-devices/'],['computer','/computer-literacy/written/computer-basics/computer-classification/']];
(async()=>{const browser=await chromium.launch();for(const [name,path] of pages){for(const width of [320,390,768,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 const response=await page.goto(base+path);assert.equal(response.status(),200);await page.evaluate(()=>document.fonts.ready);
 const state=await page.evaluate(()=>{const nav=document.querySelector('.breadcrumb'),current=nav.querySelector(':scope > .current');return {overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,currentVisible:getComputedStyle(current).display!=='none',heading:document.querySelector('h1').textContent.trim(),links:[...nav.querySelectorAll('a')].map(a=>a.getAttribute('href'))};});
 assert(state.overflow<=1,JSON.stringify({name,width,state}));assert.equal(state.currentVisible,width>=640);assert(state.heading&&state.links.length>=2);
 const switcher=page.locator('.breadcrumb .subject-switcher');
 if(await switcher.count()){const summary=switcher.locator('summary');await summary.press('Enter');assert(await switcher.locator('.subject-switcher-menu').isVisible());await summary.press('Escape');assert(!(await switcher.locator('.subject-switcher-menu').isVisible()));}
 if(name==='industrial'){
  const table=page.locator('article > h3#주요-장치와-기능 + table');assert.equal(await table.locator('tbody tr').count(),6);
  const headings=await page.evaluate(()=>{const a=document.querySelector('article');let h=a.querySelector('#핵심-개념'),e=a.querySelector('#시험-포인트');return {normal:getComputedStyle(h).backgroundColor,exam:getComputedStyle(e).backgroundColor};});assert.equal(headings.normal,'rgba(0, 0, 0, 0)');assert.notEqual(headings.exam,'rgba(0, 0, 0, 0)');
  if(width<640){const widths=await table.locator('thead th').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));assert(widths[2]>widths[1]&&widths[1]>widths[0],JSON.stringify(widths));}
  await table.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/reading-pilot-table-${width}.png`});
 }else{
  const cells=page.locator('article table').first().locator('tbody tr');const list=[];for(let i=0;i<3;i++)list.push(await cells.nth(i).locator('td').nth(1).locator('li').allTextContents());
  assert.deepEqual(list,[['디지털','아날로그','하이브리드'],['슈퍼컴퓨터','메인프레임','퍼스널 컴퓨터'],['팜톱','랩톱','노트북','데스크톱']]);
  await page.locator('article table').first().scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/reading-pilot-list-${width}.png`});
 }
 console.log('PASS',name,width,JSON.stringify(state));await page.close();
 }}await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
