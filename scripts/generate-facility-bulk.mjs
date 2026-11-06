import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
sharp.cache(false);sharp.concurrency(1);
import {BULK_SPECS} from './facility-bulk-specs.mjs';
import {registerExtraPictograms} from './facility-pictograms-extended.mjs';
import {renderInfographic,infographicLayout} from './generate-facility-compact-infographic.mjs';
import {applyBulkLabelOffsets,measureBulkLabelOffsets} from './facility-bulk-labels.mjs';
const audit='docs/audits/2026-11-06-facility-image-bulk';
const spacingAudit='docs/audits/2026-11-06-facility-card-spacing';
const sha=b=>createHash('sha256').update(b).digest('hex');
registerExtraPictograms();
const inventory=JSON.parse(fs.readFileSync(audit+'/inventory-before.json'));
const images=[];const source={};
const attributes=(url,alt,hero,height)=>`<figure><img src="${url}" alt="${alt}" width="1440" height="${height}" loading="${hero?'eager':'lazy'}" decoding="async"${hero?' fetchpriority="high"':''} /></figure>`;
fs.mkdirSync(audit+'/previous-articles',{recursive:true});
for(const dir of ['masters','specs'])fs.mkdirSync(spacingAudit+'/'+dir,{recursive:true});
if(!fs.existsSync(spacingAudit+'/before-manifest.json'))fs.copyFileSync(audit+'/manifest.json',spacingAudit+'/before-manifest.json');
for(const number of [...new Set(inventory.map(x=>x.publicPath.split('/')[3]))].filter(n=>n!=='05')){
 const group=inventory.filter(x=>x.publicPath.includes('/'+number+'/'));
 const article='src/content/facility/'+group[0].article+'.md';
 const previous=audit+'/previous-articles/'+group[0].article+'.md';
 if(!fs.existsSync(previous))fs.copyFileSync(article,previous);
 const before=fs.readFileSync(previous,'utf8');let after=before;
 for(const row of group){
  const file=path.basename(row.publicPath),hero=row.role==='hero';
  const specs=hero?[{number,file,title:before.match(/^title: (.+)$/m)[1].split('｜')[0],kind:'hero'}]:BULK_SPECS.filter(s=>s.number===number&&s.original===file);
  if(!specs.length)throw Error('Missing brief '+row.publicPath);
  const replacements=[];
  for(const spec of specs){
   const height=hero?1080:infographicLayout(spec).height;
   const master=hero?`${audit}/hero-masters/${number}.png`:`${spacingAudit}/masters/${number}-${spec.file.replace('.webp','.svg')}`;
   if(!hero){spec.labelOffsets=await measureBulkLabelOffsets(spec);const json=`${spacingAudit}/specs/${number}-${spec.file.replace('.webp','.json')}`;fs.writeFileSync(json,JSON.stringify(spec,null,2)+'\n');fs.writeFileSync(master,applyBulkLabelOffsets(renderInfographic(spec),spec.labelOffsets));spec.spec=json;}
   if(!fs.existsSync(master)){console.log('Pending hero',number);continue;}
   const target=`${hero?'facility-image-refresh':'facility-card-spacing'}/${number}/${spec.file}`;fs.mkdirSync(path.dirname(target),{recursive:true});
   await sharp(fs.readFileSync(master)).resize(1440,height,{fit:'fill'}).webp({quality:hero?88:92,effort:6}).toFile(target);
   const publicPath=`/images/facility-drafts/${number}/${spec.file}`;
   const alt=hero?spec.title+' — 관련 설비와 확인 자료를 담은 일러스트':`${spec.title}: ${spec.cards.map(c=>c.title+' '+(Array.isArray(c.summary)?c.summary.join(' '):c.summary)).join(', ')}`;
   replacements.push(attributes(publicPath,alt,hero,height));
   images.push({article:group[0].article,publicPath,originalPath:row.publicPath,existing:spec.file===file,file:target,master,spec:spec.spec,kind:hero?'editorial-hero':'official-card-template',sha256:sha(fs.readFileSync(target)),masterSHA256:sha(fs.readFileSync(master)),width:1440,height,alt,icons:hero?[]:spec.cards.map(c=>c.icon)});
  }
  if(!replacements.length)continue;
  const escaped=row.publicPath.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re=new RegExp(`<figure><img[^>]*src="${escaped}"[^>]*><\\/figure>|!\\[[^\\]]*\\]\\(${escaped}\\)`);
  if(!re.test(after))throw Error('Missing article image '+row.publicPath);
  after=after.replace(re,replacements.join('\n\n'));
 }
 fs.writeFileSync(article,after);source[article]={previous,beforeSHA256:sha(Buffer.from(before)),sha256:sha(Buffer.from(after)),images:images.filter(r=>r.article===group[0].article).length};
}
const dependencies=Object.fromEntries(['scripts/generate-facility-infographic.mjs','scripts/generate-facility-compact-infographic.mjs','scripts/facility-pictograms.mjs','scripts/facility-pictograms-extended.mjs','scripts/facility-bulk-specs.mjs','scripts/facility-bulk-labels.mjs'].map(f=>[f,sha(fs.readFileSync(f))]));
const manifest={baseCommit:'ddcaecf638bf42c57651776336caea134daa4319',scope:'13 published facility articles; public-sector comparison unchanged; draft excluded',source,dependencies,images};
fs.writeFileSync(audit+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({cards:images.filter(r=>r.kind==='official-card-template').length,heroes:images.filter(r=>r.kind==='editorial-hero').length,sourceArticles:Object.keys(source).length}));
