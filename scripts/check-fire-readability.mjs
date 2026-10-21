import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {beforeReview,beforePracticePolish} from './read-before-fire-persona-corrections.mjs';
const release=JSON.parse(await readFile('docs/audits/2026-10-20-fire-persona-corrections/release.json','utf8'));
const rows=release.reviewProjections;
const hash=b=>createHash('sha256').update(b).digest('hex');
assert.deepEqual(Object.keys(rows).sort(),[
  'src/components/FirePracticeRunner.astro','src/utils/firePracticeClient.ts',
  'src/pages/fire-safety-manager-level2/practice/index.astro',
  'dist/fire-safety-manager-level2/practice/index.html',
].sort());
for(const [file,row] of Object.entries(rows)){
  const native=await readFile(file);
  const bytes=beforePracticePolish(file,native);
  assert.equal(hash(bytes),row.sha256,file+': exact native readability release');
  assert.equal(hash(beforeReview(file,native)),row.beforeSHA256,file+': exact deployed popup bytes preserved');
  assert.equal(row.beforeSHA256,release.popupProjections[file].sha256,file+': existing popup golden unchanged');
  assert.throws(()=>beforeReview(file,Buffer.concat([native,Buffer.from('\n')])),file+': unapproved mutation rejected');
}
console.log('[Fire readability] 3 UI sources and only practice HTML; exact native bytes, preserved popup baselines and mutation rejection PASS');

const polish=release.practicePolishProjections;
assert.deepEqual(Object.keys(polish).sort(),Object.keys(rows).sort(),'polish touches only the same 3 UI sources and practice HTML');
for(const [file,row] of Object.entries(polish)){
  const native=await readFile(file);
  assert.equal(hash(native),row.sha256,file+': current practice polish bytes');
  assert.equal(row.beforeSHA256,rows[file].sha256,file+': deployed readability baseline unchanged');
  assert.equal(hash(beforePracticePolish(file,native)),row.beforeSHA256);
  assert.throws(()=>beforePracticePolish(file,Buffer.concat([native,Buffer.from('\n')])));
}
console.log('[Fire practice polish] 3 UI sources and practice HTML; exact inverse and mutation rejection PASS');
