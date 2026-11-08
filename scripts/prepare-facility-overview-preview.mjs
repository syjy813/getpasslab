// Development-only raster export and portable gallery. Requires the existing
// image-QA environment's sharp; no production dependency is added.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {renderInfographic,infographicOverviewLayout} from './generate-facility-infographic.mjs';
const sharp=createRequire(import.meta.url)('sharp');
const root='docs/standards/facility-infographic-templates/';
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const manifest={profile:'overview',images:[]};
let body='';
for(const n of [4,5,6]) {
  const stem='overview-example-'+n;
  const spec=JSON.parse(fs.readFileSync(root+stem+'.json','utf8'));
  const images={};
  for(const viewport of ['desktop','mobile']) {
    const layout=infographicOverviewLayout({...spec,viewport});
    const svg=renderInfographic({...spec,viewport});
    const name=stem+'-'+viewport;
    fs.writeFileSync(root+name+'.svg',svg);
    await sharp(Buffer.from(svg),{density:72}).png().toFile(root+name+'.png');
    const webp=await sharp(Buffer.from(svg),{density:72}).webp({quality:90,effort:6}).toBuffer();
    fs.writeFileSync(root+name+'.webp',webp);
    const row={name,viewport,count:n,width:layout.width,height:layout.height,bytes:webp.length,sha256:createHash('sha256').update(webp).digest('hex')};
    manifest.images.push(row);images[viewport]={...row,src:'data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64')};
  }
  const d=images.desktop,m=images.mobile;
  body+='<section id="cards-'+n+'"><h2>'+n+'개 구성</h2><p class="caption">PC 2열 · 모바일 1열 · 항목과 설명을 모두 한 장에 유지</p><picture data-count="'+n+'"><source media="(max-width:767px)" srcset="'+m.src+'" width="'+m.width+'" height="'+m.height+'"><img src="'+d.src+'" width="'+d.width+'" height="'+d.height+'" alt="'+escape(spec.title)+' — '+spec.cards.map(c=>escape(c.title)).join(', ')+'" loading="lazy" decoding="async"></picture>';
  body+='<details><summary>이미지 내용을 텍스트로 읽기</summary><ol>'+spec.cards.map(c=>'<li><strong>'+escape(c.title)+'</strong> — '+escape(c.summary)+'<br>'+c.details.map(escape).join(' / ')+'<br>'+escape(c.action)+'</li>').join('')+'</ol></details></section>';
}
const css='*{box-sizing:border-box}html{scroll-behavior:auto}body{margin:0;background:#f5f7f3;color:#173f2e;font:16px/1.65 system-ui,-apple-system,"Noto Sans KR",sans-serif;word-break:keep-all;overflow-wrap:anywhere}header,main{max-width:760px;margin:auto;padding:28px 20px}header{padding-bottom:0}h1{font-size:27px;line-height:1.4;margin:0 0 12px}nav{display:flex;gap:12px;margin-top:20px}a{color:#175c40}section{margin:0 0 56px}h2{font-size:23px;margin:0 0 6px}.caption{color:#53665b;margin:0 0 18px}picture,img{display:block;max-width:100%;width:100%;height:auto}details{background:white;border-radius:10px;padding:14px 18px;margin-top:18px}li+li{margin-top:16px}summary{cursor:pointer}footer{font-size:13px;color:#64766b}';
fs.writeFileSync(root+'overview-preview.html','<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>시설 카드 4·5·6개 통합형 검토본</title><style>'+css+'</style></head><body><header><h1>시설 카드 4·5·6개 통합형</h1><p>같은 내용을 1/2·2/2로 나누지 않고 한 장에 담았습니다. 화면 폭에 맞춰 전체 항목을 담은 이미지 한 장이 표시됩니다.</p><nav aria-label="구성 선택"><a href="#cards-4">4개</a><a href="#cards-5">5개</a><a href="#cards-6">6개</a></nav></header><main>'+body+'<footer>템플릿 검토본 · 기존 공개 글에는 아직 적용하지 않았습니다.</footer></main></body></html>\n');
fs.writeFileSync(root+'overview-image-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Overview raster and portable preview: '+manifest.images.length+' WebP exports');
