import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderInfographic,TOKENS} from './generate-facility-infographic.mjs';
import {renderFacilityThumbnail,heroGeometry,rasterToDataUri,HERO_LAYOUT} from './generate-facility-thumbnail.mjs';

const dir='docs/standards/facility-thumbnail-templates/';
const input=JSON.parse(readFileSync(dir+'example-hero.json','utf8'));
const saved=readFileSync(dir+'hero-4x3-preview.svg','utf8');

test('locked 1440x1080 hero shell and graphic-safe area',()=>{
  assert.deepEqual([HERO_LAYOUT.canvasWidth,HERO_LAYOUT.canvasHeight],[1440,1080]);
  const {title,subtitle,ruleY,box,safe}=heroGeometry(input);
  assert.equal(title.length,1);assert.equal(subtitle.length,1);
  assert.equal(ruleY,300);
  assert.deepEqual(box,{x:80,y:348,width:1280,height:652});
  assert.deepEqual(safe,{x:98,y:366,width:1244,height:616});
  assert.ok(safe.y+safe.height<=1000);
});

test('SVG preview is fully deterministic and never contains raster artwork',()=>{
  const svg=renderFacilityThumbnail(input,{preview:true});
  assert.equal(svg,saved,'preview template must be regenerated after renderer changes');
  assert.match(svg,/width="1440" height="1080"/);
  assert.match(svg,/id="header-fixed"/);
  assert.match(svg,/x="720" y="140"[^>]*font-size="64" font-weight="700" text-anchor="middle"/);
  assert.match(svg,/x="720" y="230"[^>]*font-size="30" font-weight="400" text-anchor="middle"/);
  assert.match(svg,/id="gpl-brand" transform="translate\(1150 80\)"/);
  assert.match(svg,/font-size="24" font-weight="600" fill="#114935">GetPassLab/);
  assert.equal((svg.match(/id="gpl-brand"/g)||[]).length,1);
  assert.match(svg,/data-x="98" data-y="366" data-width="1244" data-height="616"/);
  assert.match(svg,/id="graphic-preview-placeholder"/);
  assert.doesNotMatch(svg,/id="main-graphic"/);
});

test('same brand tokens as 1-4-card infographic renderer',()=>{
  const sample=JSON.parse(readFileSync('docs/standards/facility-infographic-templates/example-1.json','utf8'));
  const card=renderInfographic({...sample,title:input.title,subtitle:input.subtitle});
  const hero=renderFacilityThumbnail(input,{preview:true});
  const logo=/id="gpl-brand" transform="translate\(1150 80\)"[\s\S]*?GetPassLab<\/text><\/g>/;
  assert.equal(hero.match(logo)?.[0],card.match(logo)?.[0]);
  for(const token of ['font-size="64" font-weight="700"','font-size="30" font-weight="400"']){
    assert.ok(hero.includes(token) && card.includes(token));
  }
  assert.equal(TOKENS.colors.brand,'#114935');
});

test('two-line headers move the graphic slot, never reduce title size',()=>{
  const longer={...input,title:['시설관리 취업을 준비할 때','지원 공고를 읽는 방법']};
  const a=heroGeometry(input),b=heroGeometry(longer);
  assert.equal(b.box.y-a.box.y,74);
  assert.equal(b.safe.x,a.safe.x);
  assert.equal(b.box.y+b.box.height,1000);
  assert.match(renderFacilityThumbnail(longer,{preview:true}),/font-size="64" font-weight="700"/);
  assert.throws(()=>heroGeometry({...input,title:['a','b','c']}),/exceeds/);
});

test('every header line shares the canvas and graphic center for all 1–2-line combinations',()=>{
  for(const title of [input.title,['시설관리 취업을 준비할 때','지원 공고를 읽는 방법']]){
    for(const subtitle of [input.subtitle,['고용주와 근무조건을 먼저 살펴보고','지원에 필요한 자격을 확인해요']]){
      const spec={title,subtitle};
      const geometry=heroGeometry(spec);
      const svg=renderFacilityThumbnail(spec,{preview:true});
      const header=svg.match(/<g id="header-fixed">([\s\S]*?)<\/g>/)[1];
      const center=HERO_LAYOUT.canvasWidth/2;
      assert.equal(center,720);
      assert.equal(geometry.box.x+geometry.box.width/2,center);
      assert.equal(geometry.safe.x+geometry.safe.width/2,center);
      const texts=[...header.matchAll(/<text ([^>]+)>([\s\S]*?)<\/text>/g)];
      assert.equal(texts.length,2);
      for(const [index,text] of texts.entries()){
        assert.match(text[1],/x="720"/);
        assert.match(text[1],/text-anchor="middle"/);
        const spans=[...text[2].matchAll(/<tspan x="(\d+)" dy="(\d+)">/g)];
        assert.equal(spans.length,(index===0?geometry.title:geometry.subtitle).length);
        for(const [line,span] of spans.entries()){
          assert.equal(Number(span[1]),center);
          assert.equal(Number(span[2]),line===0?0:index===0?74:40);
        }
      }
      assert.equal(geometry.box.y+geometry.box.height,1000);
      assert.equal(geometry.box.y,348+(geometry.title.length-1)*74+(geometry.subtitle.length-1)*40);
    }
  }
});

test('automatic wrapping and explicit lines keep the same width and two-line limits',()=>{
  const title='시설관리 취업에서 실제 고용주와 급여 조건을 빠짐없이 확인하는 구체적인 방법';
  const subtitle='지원하기 전에 실제 고용주와 근무형태를 확인하고 공고에 적힌 자격 요건과 급여 조건을 꼼꼼하게 비교해요';
  const geometry=heroGeometry({title,subtitle});
  assert.equal(geometry.title.length,2);
  assert.equal(geometry.subtitle.length,2);
  const automatic=renderFacilityThumbnail({title,subtitle},{preview:true});
  const explicit=renderFacilityThumbnail({title:geometry.title,subtitle:geometry.subtitle},{preview:true});
  const header=svg=>svg.match(/<g id="header-fixed">([\s\S]*?)<\/g>/)[1];
  assert.equal(header(automatic),header(explicit));
  for(const key of ['title','subtitle']){
    assert.throws(()=>heroGeometry({...input,[key]:['첫 줄','둘째 줄','셋째 줄']}),/exceeds/);
    assert.throws(()=>heroGeometry({...input,[key]:'가'.repeat(150)}),/too long/);
  }
});

test('two-line JSON example regenerates the saved centered preview',()=>{
  const spec=JSON.parse(readFileSync(dir+'example-hero-two-lines.json','utf8'));
  assert.equal(heroGeometry(spec).title.length,2);
  assert.equal(heroGeometry(spec).subtitle.length,2);
  assert.equal(renderFacilityThumbnail(spec,{preview:true}),readFileSync(dir+'hero-4x3-two-lines-preview.svg','utf8'));
});

test('final output requires verified raster; placeholder cannot leak into final',()=>{
  assert.throws(()=>renderFacilityThumbnail(input),/Provide the main graphic/);
  assert.throws(()=>renderFacilityThumbnail(input,{graphicHref:'https://example.com/graphic.png'}),/Only bounded embedded/);
  assert.throws(()=>renderFacilityThumbnail(input,{graphicHref:'data:image/svg+xml;base64,AAAA'}),/Only bounded embedded/);
  assert.throws(()=>renderFacilityThumbnail(input,{preview:true,graphicHref:'data:image/png;base64,AAAA'}),/mutually exclusive/);
  const samplePng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/UocAAAAASUVORK5CYII=','base64');
  const href=rasterToDataUri(samplePng);
  assert.match(href,/^data:image\/png;base64,/);
  const complete=renderFacilityThumbnail(input,{graphicHref:href});
  assert.match(complete,/id="main-graphic"/);
  assert.match(complete,/x="720" y="140"[^>]*text-anchor="middle"/);
  assert.match(complete,/x="720" y="230"[^>]*text-anchor="middle"/);
  assert.match(complete,/preserveAspectRatio="xMidYMid meet"/);
  assert.match(complete,/clip-path="url\(#graphic-safe-clip\)"/);
  assert.doesNotMatch(complete,/graphic-preview-placeholder|메인 그래픽 교체 영역/);
  assert.throws(()=>rasterToDataUri(Buffer.from('<svg><script/></svg>')),/Unsupported raster/);
});

test('malicious source strings cannot inject SVG tags',()=>{
  const out=renderFacilityThumbnail({...input,title:'시설 & <script> 테스트'},{preview:true});
  assert.match(out,/&amp; &lt;script&gt;/);
  assert.doesNotMatch(out,/<script>/);
});
