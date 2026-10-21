import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {beforePopup} from './read-before-fire-persona-corrections.mjs';
const release=JSON.parse(await readFile('docs/audits/2026-10-20-fire-persona-corrections/release.json','utf8'));
const rows=release.popupProjections;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const sources=Object.keys(rows).filter(p=>p.startsWith('src/'));
assert.deepEqual(sources.sort(),[
  'src/components/FirePracticeEntry.astro','src/components/FirePracticeRunner.astro',
  'src/layouts/BaseLayout.astro','src/pages/fire-safety-manager-level2/practice/index.astro',
  'src/utils/firePracticeClient.ts',
].sort());
for(const [file,row] of Object.entries(rows)){
  const bytes=await readFile(file);
  assert.equal(hash(bytes),row.sha256,file+': reviewed current UI');
  const before=beforePopup(file,bytes);
  assert.equal(hash(before),row.beforeSHA256,file+': preserved pre-popup bytes');
  assert.throws(()=>beforePopup(file,Buffer.concat([bytes,Buffer.from('\n')])),file+': arbitrary mutation rejected');
  if(file.startsWith('src/')){
    const old=release.files.find(r=>r.path===file)?.sha256??release.baselineSources[file];
    assert.equal(row.beforeSHA256,old,file+': linked to existing pinned source');
  }else{
    assert(file.startsWith('dist/fire-safety-manager-level2/'),file+': other certifications unchanged');
    const count=release.publicationEntryCounts[file];
    if(count)assert.equal(row.beforeSHA256,count.publishedSHA256,file+': existing published full HTML preserved');
    else assert.equal(file,'dist/fire-safety-manager-level2/practice/index.html');
  }
}
assert.equal(Object.keys(rows).length,80,'five sources, 74 chapter documents and practice page');
const page=await readFile('dist/fire-safety-manager-level2/practice/index.html','utf8');
assert(!page.includes('data-adfit-floating'),'focused runner must not load floating ads');
assert(!page.includes('class="gnb"'),'focused runner has its own compact header');
assert(!page.includes('data-check'),'no immediate answer reveal in batch mode');
const table=await readFile('docs/drafts/fire-level2-mock-exam/question-table.json');
assert.equal(hash(table),'5e8aff95c51806879e76211c126efe502ee9994b05a5366940d59c889590b1de');
console.log('[Fire popup] five reviewed sources, 75 exact HTML inverses and tamper rejection; question table unchanged PASS');
