import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderInfographic,infographicOverviewLayout} from './generate-facility-infographic.mjs';
import {renderInfographic as renderCompact,infographicLayout} from './generate-facility-compact-infographic.mjs';

const root='docs/standards/facility-infographic-templates/';
const input=n=>JSON.parse(fs.readFileSync(root+'overview-example-'+n+'.json','utf8'));
test('all four approved compact examples remain byte-identical',()=>{
  for(const n of [1,2,3,4]){
    const spec=JSON.parse(fs.readFileSync(root+'compact-example-'+n+'.json','utf8'));
    assert.equal(renderCompact(spec),fs.readFileSync(root+'compact-cards-'+n+'.svg','utf8'));
  }
});
for(const n of [4,5,6]) for(const viewport of ['desktop','mobile']) {
  test(n+' cards '+viewport+' retain every source field and fit without overlap',()=>{
    const spec={...input(n),viewport};
    const layout=infographicOverviewLayout(spec), svg=renderInfographic(spec);
    assert.equal(svg,fs.readFileSync(root+'overview-example-'+n+'-'+viewport+'.svg','utf8'));
    assert.equal((svg.match(/class="card card-/g)||[]).length,n);
    for(const [i,card] of spec.cards.entries()) {
      const group=svg.split('<g class="card card-'+(i+1)+'"')[1].split('<g class="card card-')[0];
      // Remove SVG tags so a wrapped detail can still be compared as text.
      const text=group.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
      for(const item of [card.title,card.summary,...(card.details||[]),card.action]) {
        const normalized=Array.isArray(item)?item.join(' '):item;
        assert(text.includes(normalized),normalized+' must not disappear');
      }
    }
    for(const a of layout.cards) {
      assert(a.x>=layout.margin&&a.x+a.w<=layout.width-layout.margin);
      assert(a.y+a.h<=layout.footer.y-28);
      const last=a.details.at(-1);
      if(last) assert(a.actionTop>=last.top+last.lines.length*(viewport==='mobile'?42:38)+24);
    }
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) {
      const a=layout.cards[i],b=layout.cards[j];
      assert(!(a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h));
    }
    assert.equal(new Set(layout.cards.map(c=>c.x)).size,viewport==='mobile'?1:n===5?3:2);
    assert.equal((svg.match(/id="gpl-brand"/g)||[]).length,1);
    assert.equal(renderCompact({...spec,cardSpacing:'compact'}),svg,'compact wrapper delegates without cropping');
    assert.equal(infographicLayout(spec).height,layout.height);
    assert.match(svg,new RegExp('width="'+layout.width+'" height="'+layout.height+'"'));
  });
}
test('5 and 6 cards select overview automatically; 4 cards require explicit opt-in',()=>{
  const a=input(5); delete a.cardLayout;
  assert.match(renderInfographic(a),/data-layout="overview"/);
  const b=input(6); delete b.cardLayout;
  assert.match(renderInfographic(b),/data-layout="overview"/);
  const legacy=JSON.parse(fs.readFileSync(root+'example-4.json','utf8'));
  assert.doesNotMatch(renderInfographic(legacy),/data-layout="overview"/);
});
test('fifth card keeps its size and is centred without creating a sixth empty card',()=>{
  const l=infographicOverviewLayout(input(5));
  assert.equal(l.cards[4].w,l.cards[0].w);
  assert.equal(l.cards[4].x+l.cards[4].w/2,l.width/2);
});
test('long headings increase canvas height instead of pushing cards into the footer',()=>{
  const s=input(6), before=infographicOverviewLayout(s);
  const after=infographicOverviewLayout({...s,title:['지원 전 여섯 가지 확인','근무와 계약 조건 비교'],subtitle:['설비와 지원업무를 확인','교육과 경력 기록을 확인']});
  assert(after.height>before.height);
  assert.equal(after.cards[0].y-before.cards[0].y,after.height-before.height);
});
test('invalid or excessive content fails rather than being silently discarded',()=>{
  const s=input(4);
  assert.throws(()=>renderInfographic({...s,cards:s.cards.slice(0,3)}),/4..6/);
  assert.throws(()=>renderInfographic({...s,cards:Array(7).fill(s.cards[0])}),/1..6/);
  assert.throws(()=>renderInfographic({...s,cards:[{...s.cards[0],details:['a','b','c','d']},...s.cards.slice(1)]}),/silently dropped/);
  assert.throws(()=>renderInfographic({...s,cards:[{...s.cards[0],icon:'unknown-topic'},...s.cards.slice(1)]}),/Unknown pictogram/);
  assert.throws(()=>renderInfographic({...s,viewport:'watch'}),/viewport/);
  const escaped=renderInfographic({...s,title:'A & B < C'});
  assert.match(escaped,/A &amp; B &lt; C/);
});
