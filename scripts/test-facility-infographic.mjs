import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderInfographic, cardRects, TOKENS } from './generate-facility-infographic.mjs';

const root='docs/standards/facility-infographic-templates/';
const examples=[1,2,3,4].map(n=>({
  n, input:JSON.parse(readFileSync(root+'example-'+n+'.json','utf8')),
  saved:readFileSync(root+'cards-'+n+'.svg','utf8')
}));

test('canonical dimensions and immutable typography tokens',()=>{
  assert.deepEqual(TOKENS.canvas,{width:1440,height:1080});
  assert.equal(TOKENS.title.x,80);assert.equal(TOKENS.title.top,140);
  assert.equal(TOKENS.typography.title,64);assert.equal(TOKENS.typography.subtitle,30);
  assert.deepEqual(TOKENS.logo,{x:1150,y:80,width:210,height:34,markHeight:28,markWidth:40,gap:8});
  assert.deepEqual(TOKENS.footer,{x:80,y:930,width:1280,height:85});
});

for(const {n,input,saved} of examples){
  test(n+' card layout is reproducible without image generation',()=>{
    const actual=renderInfographic(input);
    assert.equal(actual,saved,'example SVG is stale');
    assert.match(actual,/width="1440" height="1080"/);
    assert.match(actual,/id="header-fixed"/);
    assert.match(actual,/x="80" y="140"[^>]*font-size="64" font-weight="700"/);
    assert.match(actual,/x="80" y="230"[^>]*font-size="30" font-weight="400"/);
    assert.match(actual,/id="gpl-brand" transform="translate\(1150 80\)"/);
    assert.match(actual,/font-size="24" font-weight="600" fill="#114935">GetPassLab/);
    assert.equal((actual.match(/id="gpl-brand"/g)||[]).length,1);
    assert.match(actual,new RegExp('data-count="'+n+'"'));
    assert.equal((actual.match(/class="card card-/g)||[]).length,n);
  });
}

test('1-4 card layouts fit fixed content area without collision',()=>{
  for(let n=1;n<=4;n++){
    const layout=cardRects(n,348);
    assert.equal(layout.length,n);
    for(const g of layout){
      assert.ok(g.x>=80 && g.y>=348);
      assert.ok(g.x+g.w<=1360.0001 && g.y+g.h<=894.0001);
    }
    for(let i=0;i<layout.length;i++)for(let j=i+1;j<layout.length;j++){
      const a=layout[i],b=layout[j];
      const overlap=Math.min(a.x+a.w,b.x+b.w)>Math.max(a.x,b.x)
        &&Math.min(a.y+a.h,b.y+b.h)>Math.max(a.y,b.y);
      assert.equal(overlap,false,n+' cards '+i+','+j+' overlap');
    }
    if(n===4)assert.equal(new Set(layout.map(p=>p.y)).size,2,'4 cards are 2x2');
  }
});

test('header geometry does not depend on card count',()=>{
 const heads=[];
 for(let n=1;n<=4;n++){
   const sample={...examples[0].input,cards:Array.from({length:n},()=>examples[0].input.cards[0])};
   const svg=renderInfographic(sample);
   heads.push(svg.match(/<g id="header-fixed">([\s\S]*?)<\/g>/)[1]);
 }
 assert.ok(heads.every(h=>h===heads[0]));
});

test('long header wraps without shrinking font and shifts card region down',()=>{
 const first=renderInfographic(examples[0].input);
 const second=renderInfographic({...examples[0].input,title:'시설관리 취업에서 실제 고용주와 급여 조건을 빠짐없이 확인하는 구체적인 방법'});
 assert.match(second,/font-size="64" font-weight="700"/);
 const top=s=>Number(s.match(/data-count="1" data-top="([\d.]+)"/)[1]);
 assert.ok(top(second)>top(first));
});

test('unsafe markup is escaped and oversize content fails early',()=>{
 const a=renderInfographic({...examples[0].input,title:'A & B'});
 assert.match(a,/A &amp; B/);assert.doesNotMatch(a,/<text[^>]*>A & B/);
 assert.throws(()=>renderInfographic({...examples[0].input,title:'가'.repeat(150)}),/too long/);
 assert.throws(()=>renderInfographic({...examples[0].input,cards:[]}),/1..4/);
 assert.throws(()=>renderInfographic({...examples[0].input,cards:Array(5).fill(examples[0].input.cards[0])}),/1..4/);
});
