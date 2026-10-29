import { beforeMobileLearningUX } from './read-before-mobile-learning-ux.mjs';
import fs from 'node:fs';
import {isCertificationAddition} from './read-before-certification-discovery.mjs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const readabilityReview=JSON.parse(fs.readFileSync('docs/audits/2026-10-26-global-chapter-readability/review.json','utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function beforeGlobalChapterReadability(file,bytes){
  bytes=beforeMobileLearningUX(file,bytes);
  const key=path.normalize(String(file)),row=readabilityReview.files[key];
  if(!row || row.added || hash(bytes)===row.beforeSHA256)return bytes;
  assert.equal(hash(bytes),row.sha256,key+': exact global readability release');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,key+': exact readability delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const restored=Buffer.from(text);
  assert.equal(hash(restored),row.beforeSHA256,key+': complete previous document preserved');
  return restored;
}
export function isReadabilityAddition(file){
  if(isCertificationAddition(file))return true;
  const key=path.normalize(String(file)),row=readabilityReview.files[key];
  if(!row?.added)return false;
  assert.equal(hash(fs.readFileSync(key)),row.sha256,key+': exact readability addition');
  return true;
}
