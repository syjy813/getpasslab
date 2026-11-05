import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TOKENS,logoSvg} from './generate-facility-infographic.mjs';
import {FULLBLEED_LAYOUT,fullBleedGeometry,renderFullBleedOverlay,composeFullBleedHero} from './render-facility-thumbnail-fullbleed.mjs';

const dir='docs/standards/facility-thumbnail-templates/';
const example=JSON.parse(readFileSync(dir+'example-fullbleed.json','utf8'));
const saved=readFileSync(dir+'fullbleed-overlay-sample.svg','utf8');

test('full-bleed cover SVG renders ONLY fixed title, subtitle and top-right brand',()=>{
  const svg=renderFullBleedOverlay(example);
  assert.equal(svg,saved,'Full-bleed overlay sample must reproduce exactly');
  assert.match(svg,/width="1440" height="1080" viewBox="0 0 1440 1080"/);
  assert.match(svg,/id="header-fixed"/);
  assert.match(svg,/x="720" y="140"[^>]*font-size="64" font-weight="700" text-anchor="middle"/);
  assert.match(svg,/x="720" y="230"[^>]*font-size="30" font-weight="400" text-anchor="middle"/);
  assert.equal((svg.match(/id="gpl-brand"/g)||[]).length,1);
  assert.match(svg,/id="gpl-brand" transform="translate\(1150 80\)"/);
  assert.ok(svg.includes(logoSvg()),'logo must be the same SVG as card templates');
  assert.doesNotMatch(svg,/<rect\b|<line\b|<image\b|<foreignObject\b|<pattern\b|<filter\b/);
  assert.doesNotMatch(svg,/graphic-safe-area|graphic-preview-placeholder|collage-graphic|background|divider|main-graphic/);
});

test('text is centered, lines wrap without changing current provisional sizes',()=>{
  assert.equal(TOKENS.typography.title,64);
  assert.equal(TOKENS.typography.subtitle,30);
  assert.equal(FULLBLEED_LAYOUT.fontSizeStatus.startsWith('PROVISIONAL'),true);
  const two={...example,title:['시설관리 취업을 준비할 때','지원 공고를 읽는 방법'],subtitle:['채용공고를 먼저 비교하고','고용주와 근무조건을 확인']};
  const lines=fullBleedGeometry(two);
  assert.equal(lines.title.length,2);
  assert.equal(lines.subtitle.length,2);
  assert.equal(lines.subY,304);
  const svg=renderFullBleedOverlay(two);
  assert.equal((svg.match(/<tspan x="720"/g)||[]).length,4);
  assert.equal((svg.match(/id="gpl-brand"/g)||[]).length,1);
  assert.throws(()=>fullBleedGeometry({...example,title:['1','2','3']}),/exceeds/);
  assert.throws(()=>fullBleedGeometry({...example,title:'가'.repeat(200)}),/too long/);
  assert.throws(()=>renderFullBleedOverlay({...example,title:'<img onerror=alert(1)>'}),/too long|unbreakable/);
});

test('background fills the entire 4:3 frame without header box or default panel',async()=>{
  const {default:sharp}=await import('sharp');
  const bg=await sharp({create:{width:1440,height:1080,channels:3,background:{r:87,g:160,b:191}}}).png().toBuffer();
  const result=await composeFullBleedHero(example,bg);
  const image=sharp(result);
  const meta=await image.metadata();
  assert.equal(meta.format,'webp');
  assert.deepEqual([meta.width,meta.height],[1440,1080]);
  const p=await sharp(result).extract({left:8,top:8,width:1,height:1}).raw().toBuffer();
  assert.ok(Math.abs(p[0]-87)<10&&Math.abs(p[1]-160)<10&&Math.abs(p[2]-191)<10,'background must extend to the top-left corner');
  const p2=await sharp(result).extract({left:8,top:1068,width:1,height:1}).raw().toBuffer();
  assert.ok(Math.abs(p2[0]-87)<10&&Math.abs(p2[1]-160)<10&&Math.abs(p2[2]-191)<10,'background must extend to the bottom-left corner');
  assert.throws(()=>composeFullBleedHero(example,Buffer.from('<svg></svg>')),/nonempty raster|PNG\/JPEG\/WebP/);
  const wrong=await sharp({create:{width:1000,height:1000,channels:3,background:'white'}}).png().toBuffer();
  await assert.rejects(()=>composeFullBleedHero(example,wrong),/4:3/);
});
