const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4321';
(async()=>{
 const browser=await chromium.launch();
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:width===320?700:900}});
  await page.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
  await page.goto(base+'/energy-management/written/thermal-equipment/draft-flue-gas/');
  const button=page.getByRole('button',{name:'② 압입통풍 확대 보기'});
  const original=await button.locator('..').locator('img').evaluate(e=>e.getBoundingClientRect().width);
  await button.click();
  const dialog=page.locator('.learning-image-dialog');
  await dialog.locator('img').evaluate(e=>e.decode());
  await page.waitForTimeout(200);
  const state=await dialog.evaluate(d=>{const i=d.querySelector('img'),s=d.querySelector('.learning-image-scroll'),h=d.querySelector('.learning-image-hint');return {width:i.getBoundingClientRect().width,horizontal:s.scrollWidth>s.clientWidth+1,vertical:s.scrollHeight>s.clientHeight+1,hidden:h.hidden,text:h.textContent};});
  assert(state.width>=original*1.24,JSON.stringify({width,original,state}));
  assert.equal(state.hidden,!state.horizontal&&!state.vertical,JSON.stringify({width,state}));
  if(state.horizontal)assert.match(state.text,/좌우/);
  if(state.vertical)assert.match(state.text,/위아래/);
  await page.screenshot({path:`qa-results/certification-discovery/viewer-${width}.png`});
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert(await button.evaluate(e=>e===document.activeElement));
  console.log('PASS',width,JSON.stringify({original,...state}));await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
