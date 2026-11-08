const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const assert=require('node:assert/strict');
const {chromium}=require(process.env.QA_PLAYWRIGHT_MODULE||'playwright');

(async()=>{
  const folder=path.resolve('docs/standards/facility-infographic-templates');
  const report={kind:'template preview and SVG geometry, not Production QA',viewports:[],svgChecks:[]};
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage();
    for(const width of [320,390,768,1440]) {
      await page.setViewportSize({width,height:1000});
      await page.goto(pathToFileURL(path.join(folder,'overview-preview.html')).href);
      await page.evaluate(async()=>{await document.fonts.ready;for(const img of document.images){img.loading='eager';await img.decode();}});
      const result=await page.evaluate(()=>({viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].map(i=>({width:i.getBoundingClientRect().width,height:i.getBoundingClientRect().height,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,count:Number(i.parentElement.dataset.count),bodyFontAtDisplay:(innerWidth<768?32:28)*i.getBoundingClientRect().width/i.naturalWidth}))}));
      assert(!result.overflow);
      assert.deepEqual(result.images.map(i=>i.count),[4,5,6]);
      for(const image of result.images){
        assert.equal(image.naturalWidth,width<768?720:1440,'picture selects a complete single sheet');
        assert(Math.abs(image.height/image.width-image.naturalHeight/image.naturalWidth)<.002,'correct aspect ratio');
        assert(image.bodyFontAtDisplay>=12,'essential details remain readable at 320px');
      }
      report.viewports.push(result);
    }
    for(const n of [4,5,6]) for(const viewport of ['desktop','mobile']) {
      await page.setViewportSize({width:viewport==='mobile'?720:1440,height:2800});
      await page.goto(pathToFileURL(path.join(folder,'overview-example-'+n+'-'+viewport+'.svg')).href);
      await page.evaluate(()=>document.fonts.ready);
      const result=await page.evaluate(()=>{
        const cards=[...document.querySelectorAll('g.card')],errors=[];
        for(const card of cards){
          const frame=card.querySelector('rect').getBBox();
          const boxes=[...card.querySelectorAll('text')].map(t=>({text:t.textContent,b:t.getBBox()}));
          for(const {text,b} of boxes)if(b.x<frame.x-1||b.y<frame.y-1||b.x+b.width>frame.x+frame.width+1||b.y+b.height>frame.y+frame.height+1)errors.push('outside card: '+text);
          for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
            const a=boxes[i].b,b=boxes[j].b;
            if(a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height)errors.push('text overlap: '+boxes[i].text+' / '+boxes[j].text);
          }
        }
        const root=document.documentElement.getBoundingClientRect();
        const outside=[...document.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.x<root.x-1||r.right>root.right+1||r.y<root.y-1||r.bottom>root.bottom+1}).map(t=>t.textContent);
        return {cards:cards.length,errors,outside};
      });
      assert.equal(result.cards,n);assert.deepEqual(result.errors,[]);assert.deepEqual(result.outside,[]);
      report.svgChecks.push({count:n,viewport,...result});
    }
  } finally {await browser.close();}
  const output=process.env.OVERVIEW_QA_REPORT||'overview-browser-validation.json';
  fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log('Overview browser QA PASS: 320/390/768/1440, six SVG sheets, no clipping/overlap');
})().catch(error=>{console.error(error);process.exitCode=1;});
