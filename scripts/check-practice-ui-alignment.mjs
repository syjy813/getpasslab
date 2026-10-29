import fs from './read-before-service-split.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {practiceUIReview as review,beforePracticeUIAlignment} from './read-before-practice-ui-alignment.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const files=[...walk('src'),...walk('public'),...walk('dist').filter(f=>/\.(html|xml)$/.test(f))].sort();
assert.deepEqual(files,Object.keys(review.current).sort(),'no new or removed content/routes/assets');
for(const f of files)assert.equal(hash(fs.readFileSync(f)),review.current[f],f+': native bytes');
assert.deepEqual(Object.keys(review.changes).filter(f=>!f.startsWith('dist/')),['src/components/InstantQuestionPractice.astro']);
assert.equal(Object.keys(review.changes).filter(f=>f.endsWith('.html')).length,530,'shared chapter stylesheet reference');
assert.equal(review.htmlReplacements.length,5,'intro, source, close button and two compiled asset references only');
let dialogs=0;
for(const [f,row]of Object.entries(review.changes)){
 const bytes=fs.readFileSync(f),old=beforePracticeUIAlignment(f,bytes);assert.equal(hash(old),row.beforeSHA256);
 assert.notEqual(hash(beforePracticeUIAlignment(f,Buffer.concat([bytes,Buffer.from('unknown')]))),row.beforeSHA256,'unknown mutations stay visible');
 if(!f.endsWith('.html'))continue;
 let expected=old.toString();for(const r of review.htmlReplacements)expected=expected.split(r.before).join(r.after);assert.equal(bytes.toString(),expected,f+': only reviewed UI transformations');
 const article=s=>{let a=s.match(/<article\b[\s\S]*?<\/article>/)?.[0];if(!a)return a;a=a.replace(/<dialog\b[^>]*data-practice-dialog[\s\S]*?<\/dialog>/g,'');for(const r of review.htmlReplacements.filter(r=>r.before.startsWith('/_astro/')))a=a.split(r.after).join(r.before);return a;};assert.equal(article(bytes.toString()),article(old.toString()),f+': lesson and question history retained');
 const dialog=bytes.toString().match(/<dialog\b[^>]*data-practice-dialog[\s\S]*?<\/dialog>/)?.[0];
 if(dialog){dialogs++;assert(!dialog.includes('practice-intro')&&!dialog.includes('data-practice-source'),'requested clutter removed');assert(dialog.includes('btn btn-secondary practice-close')&&dialog.includes('창 닫기'),'reference close button');}
}
assert(dialogs>300,'shared overlay rollout');
assert.equal(Object.keys(review.bundles).length,2);for(const [f,sha]of Object.entries(review.bundles))assert.equal(hash(fs.readFileSync(f)),sha,f+': reviewed runtime bundle');
const source=fs.readFileSync('src/components/InstantQuestionPractice.astro','utf8');
assert(source.includes('clip-path:inset(50%)')&&source.includes('input:focus-visible')&&source.includes("radio.type = 'radio'"),'native keyboard-accessible single selection retained');
assert(source.includes('practice-caution')&&source.includes('검증된 문항별 해설이 아직 없습니다'),'per-question caution and explanation status retained');
console.log('[Practice UI alignment] PASS',JSON.stringify({nativeFiles:files.length,html:530,dialogs,sourceChanges:1,reviewedBundles:2,questionsAndLessons:'unchanged'}));
