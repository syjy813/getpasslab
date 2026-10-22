// A new content release, independent of the archived publication approvals.
// Native content is fingerprinted before any historical snapshot is restored.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=new URL('../../docs/releases/2026-10-21-fire-standard-questions/',import.meta.url);
export const hash=b=>createHash('sha256').update(b).digest('hex');
const read=name=>fs.readFileSync(new URL(name,root));
export const revision=JSON.parse(read('revision.json'));
for(const [name,key] of [['before-rows.json','beforeRowsSHA256'],['assertions.json','assertionsSHA256'],['review.json','reviewSHA256'],['replacements.json','replacementsSHA256']])assert.equal(hash(read(name)),revision[key],name);
export const previousRows=JSON.parse(read('before-rows.json'));
export const standardReview=JSON.parse(read('review.json'));
export function beforeStandardization(row){
  if(!previousRows[row.id])return row;
  assert.equal(hash(JSON.stringify(row)),standardReview[row.id].afterSHA256,row.id+': exact standardized content');
  return previousRows[row.id];
}
export function beforeStandardizedTable(bytes){
  assert.equal(hash(bytes),revision.tableSHA256,'exact current question table');
  const rows=JSON.parse(bytes).map(beforeStandardization);
  const previous=Buffer.from(JSON.stringify(rows,null,2)+'\n');
  assert.equal(hash(previous),revision.beforeTableSHA256,'exact pre-standardization table');
  return previous;
}
export function beforeStandardizedPractice(file,bytes){
  if(String(file)!=='dist/fire-safety-manager-level2/practice/index.html')return bytes;
  assert.equal(hash(bytes),revision.practiceSHA256,'exact standardized practice HTML');
  const fields=['id','chapterId','chapterTitle','subjectId','question','choices','answerNumber','explanation','isCore','questionType','sourceQuestionId'];
  let found=false;
  const text=bytes.toString('utf8').replace(/(<script[^>]*data-fire-payload[^>]*>)([\s\S]*?)(<\/script>)/,(_,open,json,close)=>{
    found=true;const payload=JSON.parse(json);
    payload.questions=payload.questions.map(q=>previousRows[q.id]?Object.fromEntries(fields.map(k=>[k,previousRows[q.id][k]])):q);
    return open+JSON.stringify(payload).replace(/</g,'\\u003c')+close;
  });
  assert(found,'practice payload found');
  const previous=Buffer.from(text);
  assert.equal(hash(previous),revision.beforePracticeSHA256,'exact pre-standardization practice HTML');
  return previous;
}
