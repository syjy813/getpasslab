import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {preactionCopyReview as review,beforeFirePreactionCopy} from './read-before-fire-preaction-copy.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(Object.keys(review.changes).length,2);
for(const [file,row] of Object.entries(review.changes)){
 const bytes=fs.readFileSync(file),before=beforeFirePreactionCopy(file,bytes);
 assert.equal(hash(bytes),row.sha256,file+': reviewed current copy');
 assert.equal(hash(before),row.beforeSHA256,file+': exact predecessor');
 assert.notEqual(hash(beforeFirePreactionCopy(file,Buffer.concat([bytes,Buffer.from(' unknown')]))),row.beforeSHA256,'unknown changes stay visible');
 if(file.endsWith('.md'))assert.equal(bytes.toString().split('---',3)[1],before.toString().split('---',3)[1],'chapter metadata retained');
}
console.log('[Fire preaction copy] PASS: one chapter copy edit; exact source and rendered HTML delta');
