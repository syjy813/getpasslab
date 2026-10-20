import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {beforePublication} from './fire-mock-authoring/publication.mjs';
import {beforePublishedChapterCount} from './read-before-fire-persona-corrections.mjs';
const dir='docs/audits/2026-10-20-fire-persona-corrections';
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const release=await json(dir+'/release.json');
const corrections=await json(dir+'/question-corrections.json');
const beforeRows=await json(dir+'/baseline-rows.json');
const retest=await json(dir+'/retest.json');
const rows=(await json('docs/drafts/fire-level2-mock-exam/question-table.json')).map(beforePublication);
const hash=b=>createHash('sha256').update(b).digest('hex');
// Match Python's sorted, UTF-8 JSON serialization used in the baseline.
const canonical=v=>Array.isArray(v)?'['+v.map(canonical).join(', ')+']':v!==null&&typeof v==='object'?'{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+': '+canonical(v[k])).join(', ')+'}':JSON.stringify(v);
// Verify canonical per-row hashes through the audit's recorded after snapshots.
const verification=await json(dir+'/review.json');
const expectedTargets=new Set(corrections.targets);
assert.equal(expectedTargets.size,167);assert.equal(Object.keys(retest).length,167);
assert.deepEqual(new Set(Object.keys(retest)),expectedTargets);
assert.equal(rows.length,2480);assert.equal(Object.keys(beforeRows).length,2480);
for(const row of rows){
  const record=verification.rows[row.id];assert(record,row.id);
  assert.equal(hash(JSON.stringify(row)),record.currentHash,row.id+': exact reviewed row');
  const identity=Object.fromEntries(Object.entries(row).filter(([k])=>!['question','choices','explanation','sourceTextProvenance','editorialRevision'].includes(k)));
  assert.equal(hash(canonical(identity)),beforeRows[row.id].identityHash,row.id+': preserved ID/source/key/metadata');
  if(!expectedTargets.has(row.id))assert.equal(hash(canonical(row)),beforeRows[row.id].rowHash,row.id+': untouched row');
  assert.equal(row.reviewStatus,'pending');assert.equal(row.publicationStatus,'unpublished');assert.equal(row.examEligible,false);
  if(expectedTargets.has(row.id)){
    assert.equal(retest[row.id],row.answerNumber,row.id+': recorded re-solve');
    assert.equal(new Set(row.choices.map(s=>s.replace(/\s+/g,' ').trim())).size,4,row.id+': distinct choices');
    assert.deepEqual(Object.fromEntries(Object.keys(corrections.corrections[row.id].set).map(k=>[k,row[k]])),corrections.corrections[row.id].set);
    const link=row.explanation.match(/이론 연결: (\/[^\s]+)/)?.[1];assert(link);
    await readFile('dist'+link+'index.html');
  }
}
assert.equal(verification.untouchedQuestions,2313);
assert.equal(verification.preservedRawSources,500);
assert.equal(verification.preservedAnswerNumbers,2480);
const walk=async d=>(await Promise.all((await readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]))).flat();
const files=[...await walk('src'),...await walk('public')].sort();
assert.deepEqual(files,[...Object.keys(release.baselineSources),...release.files.filter(r=>r.added).map(r=>r.path)].sort());
for(const f of files){const changed=release.files.find(r=>r.path===f);assert.equal(hash(await readFile(f)),changed?.sha256 ?? release.baselineSources[f],f);}
for(const row of release.files){
  assert.equal(hash(beforePublishedChapterCount(row.path,await readFile(row.path))),row.sha256,row.path);
  if(row.originalFile)assert.equal(hash(await readFile(row.originalFile)),row.originalSha256,row.originalFile);
  if(row.path.endsWith('.md'))assert.equal((await readFile(row.path,'utf8')).match(/^---[\s\S]*?\n---/)[0],(await readFile(row.originalFile,'utf8')).match(/^---[\s\S]*?\n---/)[0]);
}
const article=s=>s.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
const articles={};
for(const f of await walk('dist'))if(f.endsWith('/index.html')){const a=article(beforePublishedChapterCount(f,await readFile(f)).toString('utf8'));if(a)articles[f]=hash(a);}
assert.deepEqual(articles,release.currentArticles,'only the 28 reviewed lesson bodies may change');
console.log('[Fire persona corrections] 167 re-solves, 28 chapters, 2313 untouched rows, all IDs/raw sources/keys/gates and native inventory PASS');
