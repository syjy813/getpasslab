const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321',out=process.env.QA_OUTPUT_DIR||'qa-results/practice-ui-alignment';fs.mkdirSync(out,{recursive:true});
const routes=[
 '/industrial-safety/written/construction/formwork-removal/',
 '/energy-management/written/thermal-equipment/draft-flue-gas/',
 '/computer-literacy/written/spreadsheets/goal-seek/',
];
const report={result:'RUNNING',cases:[],errors:[],limitations:['Chromium emulation; physical devices and Safari not tested']};
const properties=['fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingRight','paddingBottom','paddingLeft','backgroundColor','color','borderTopWidth','borderTopColor','borderRadius','minHeight'];
const styles=(locator,keys=properties)=>locator.evaluate((e,keys)=>Object.fromEntries(keys.map(k=>[k,getComputedStyle(e)[k]])),keys);
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.QA_CHROMIUM_EXECUTABLE?{executablePath:process.env.QA_CHROMIUM_EXECUTABLE}:{}),args:JSON.parse(process.env.QA_CHROMIUM_ARGS||'["--no-sandbox","--disable-dev-shm-usage"]')});try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},isMobile:width<768,hasTouch:width<768});await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  const reference=await context.newPage();await reference.goto(base+'/fire-safety-manager-level2/practice/?popup=1');await reference.locator('[data-window-close]').waitFor();
  const referenceClose=await styles(reference.locator('[data-window-close]'));
  await reference.locator('[data-start]').click();const fireChoice=reference.locator('[data-choices] label').first();const referenceChoice=await styles(fireChoice);await fireChoice.click();const referenceSelected=await styles(fireChoice,['backgroundColor','borderTopColor']);
  for(const route of routes){
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push(String(e)));assert.equal((await page.goto(base+route)).status(),200);await page.evaluate(()=>document.fonts.ready);
   const open=page.locator('[data-practice-open]');await open.scrollIntoViewIfNeeded();await open.click();const dialog=page.locator('[data-practice-dialog]'),item=dialog.locator('[data-practice-item]');await item.waitFor();
   assert.equal(await dialog.locator('.practice-intro,[data-practice-source]').count(),0);
   assert.deepEqual(await styles(dialog.locator('[data-practice-close]')),referenceClose,'close button matches fire mock exam '+width);
   assert.equal((await dialog.locator('[data-practice-close]').textContent()).trim(),'창 닫기');
   const choice=item.locator('.practice-choice').first();assert.deepEqual(await styles(choice),referenceChoice,'choice card matches fire mock exam '+width);
   assert.equal(await choice.locator('input').evaluate(e=>getComputedStyle(e).clipPath),'inset(50%)');assert.equal(await choice.locator('input').getAttribute('type'),'radio');
   assert.equal(await item.locator('input:checked').count(),0);await choice.click();assert.deepEqual(await styles(choice,['backgroundColor','borderTopColor']),referenceSelected);
   await item.locator('[data-practice-body]').focus();await page.keyboard.press('Tab');assert(await choice.locator('input').evaluate(e=>e===document.activeElement));await page.keyboard.press('ArrowDown');assert.equal(await item.locator('input:checked').inputValue(),'2');
   const focused=item.locator('.practice-choice').nth(1);assert.equal((await styles(focused,['outlineStyle'])).outlineStyle,'solid');
   await item.locator('[data-practice-check]').click();assert.equal(await item.locator('.is-correct').count(),1);assert(await item.locator('[data-practice-feedback]').isVisible());
   await item.locator('[data-practice-next]').click();assert.equal(await item.locator('input:checked').count(),0);assert(await item.locator('[data-practice-check]').isDisabled());
   assert(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(width===390||width===1440)await dialog.screenshot({path:out+'/'+route.split('/')[1]+'-'+width+'.png'});
   await dialog.locator('[data-practice-close]').click();await dialog.waitFor({state:'hidden'});assert(await open.evaluate(e=>e===document.activeElement));
   report.cases.push({route,width,close:'matches reference',choices:'matches reference',keyboard:'PASS',gradeNextAndClose:'PASS',overflow:false});await page.close();
  }await context.close();
 }assert.deepEqual(report.errors,[]);report.result='PASS';
}catch(e){report.result='FAIL';report.errors.push(String(e));throw e;}finally{fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));await browser.close();}console.log('[Practice UI reference comparison] PASS',report.cases.length,'certification/viewport cases');})().catch(e=>{console.error(e);process.exitCode=1});
