// Rebuild only affected reviewed cards. Prior compact masters stay untouched.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {registerExtraPictograms} from './facility-pictograms-extended.mjs';
import {renderInfographic} from './generate-facility-compact-infographic.mjs';
import {applyBulkLabelOffsets,measureBulkLabelOffsets} from './facility-bulk-labels.mjs';
registerExtraPictograms();sharp.cache(false);sharp.concurrency(1);
const audit='docs/audits/2026-11-06-facility-pictogram-review';
const manifestPath='docs/audits/2026-11-06-facility-image-bulk/manifest.json';
const fixed=['mechanical','gas','submission','rail'];
const sha=b=>createHash('sha256').update(b).digest('hex');
for(const dir of ['masters','specs'])fs.mkdirSync(audit+'/'+dir,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(audit+'/before-manifest.json'));
let count=0;
for(const row of manifest.images){
 if(row.kind!=='official-card-template'||!row.icons.some(k=>fixed.includes(k)))continue;
 const spec=JSON.parse(fs.readFileSync(row.spec));
 spec.labelOffsets=await measureBulkLabelOffsets(spec);
 const number=row.publicPath.split('/')[3],file=path.basename(row.publicPath);
 row.master=`${audit}/masters/${number}-${file.replace('.webp','.svg')}`;
 row.spec=`${audit}/specs/${number}-${file.replace('.webp','.json')}`;
 row.file=`facility-pictogram-review/${number}/${file}`;
 fs.mkdirSync(path.dirname(row.file),{recursive:true});
 fs.writeFileSync(row.spec,JSON.stringify(spec,null,2)+'\n');
 fs.writeFileSync(row.master,applyBulkLabelOffsets(renderInfographic(spec),spec.labelOffsets));
 await sharp(fs.readFileSync(row.master)).webp({quality:92,effort:6}).toFile(row.file);
 row.sha256=sha(fs.readFileSync(row.file));row.masterSHA256=sha(fs.readFileSync(row.master));count++;
}
for(const dep of Object.keys(manifest.dependencies))manifest.dependencies[dep]=sha(fs.readFileSync(dep));
manifest.dependencies['scripts/repair-facility-pictograms.mjs']=sha(fs.readFileSync('scripts/repair-facility-pictograms.mjs'));
manifest.measurementAudit=audit;
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({fixed,updatedImages:count,unchangedImages:manifest.images.length-count}));
