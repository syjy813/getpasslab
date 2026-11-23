// One-time deterministic migration of the remaining 17 facility-story list thumbnails.
// The old 4:3 files and every article body/OG image remain untouched.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const targetSize={width:1536,height:1024};
const ids=[
  'hobyeongbaekma',
  'hobyeongbaekma-hotel-hope',
  'hobyeongbaekma-hospital-despair',
  'hobyeongbaekma-hospital-hope',
  'hobyeongbaekma-hospital-large-university',
  'hobyeongbaekma-department-store-despair',
  'hobyeongbaekma-department-store-hope',
  'hobyeongbaekma-mart-despair',
  'hobyeongbaekma-mart-hope',
  'sasugoldae',
  'sasugoldae-sauna-despair',
  'sasugoldae-swimming-pool-despair',
  'sasugoldae-swimming-pool-hope',
  'sasugoldae-golf-course-despair',
  'sasugoldae-golf-course-hope',
  'sasugoldae-university-despair',
  'sasugoldae-university-hope',
];
const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
const component=fs.readFileSync('src/components/FacilityCard.astro','utf8');
const lookup=(id)=>{
  const q=id.replace(/[.*+?^$()|[\]{}]/g,'\\$&');
  const list=component.match(new RegExp("  '"+q+"': \\['([^']+)', 1448, 1086\\],"));
  if (list) return list[1];
  const covers=component.match(new RegExp("  '"+q+"': '([^']+)',"));
  assert(covers, id+': 4:3 original source missing');
  return covers[1];
};
const root='public/images/facility-series/list-thumbnails-3x2';
const logDir='docs/audits/2026-11-23-story-thumbnails-rest-3x2';
fs.mkdirSync(root,{recursive:true});
fs.mkdirSync(logDir,{recursive:true});
const rows=[];
for(const id of ids){
  const url=lookup(id);
  const input='public'+url;
  assert(fs.existsSync(input), id+': source '+input);
  const source=fs.readFileSync(input);
  const meta=await sharp(source).metadata();
  assert.deepEqual([meta.width,meta.height],[1448,1086], id+': expected 4:3 original');
  // No stretch or crop. The complete illustration is kept in the center.
  // Only the narrow side gutters are ambient, blurred extensions of the source.
  const foregroundWidth=Math.round(meta.width*targetSize.height/meta.height);
  const left=Math.floor((targetSize.width-foregroundWidth)/2);
  const ambient=await sharp(source).resize(targetSize.width,targetSize.height,{fit:'cover'})
    .blur(32).modulate({brightness:0.94,saturation:0.9}).toBuffer();
  const foreground=await sharp(source).resize(foregroundWidth,targetSize.height).toBuffer();
  const output=await sharp(ambient).composite([{input:foreground,left,top:0}])
    .webp({quality:80,effort:6}).toBuffer();
  const target=path.join(root,id+'.webp');
  fs.writeFileSync(target,output);
  const outMeta=await sharp(output).metadata();
  assert.deepEqual([outMeta.format,outMeta.width,outMeta.height],['webp',1536,1024],id+': output format');
  rows.push({id,source:input,sourceSha256:sha256(source),webpSha256:sha256(output),width:1536,height:1024,bytes:output.length,publicFile:target});
  console.log(id+': '+output.length+' bytes');
}
const manifest={date:'2026-11-23',goal:'17 remaining published facility-story list-only 3:2 assets; original 4:3, article content and OG preserved',method:'sharp source-preserving contained foreground + narrow blurred side extensions',rows};
fs.writeFileSync(path.join(logDir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
assert.equal(rows.length,17);
console.log('Generated '+rows.length+' remaining 3:2 assets and SHA-256 manifest');
