// Explicit, content-pinned publication approval. Never infer approval from a key
// match alone. Historical content QA checks use the exact pre-publication row.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {beforeStandardization} from './standardization.mjs';
export const publication = JSON.parse(fs.readFileSync(new URL('../../docs/releases/2026-10-20-fire-practice/publication.json', import.meta.url),'utf8'));
export const publishedIds = new Set(Object.keys(publication.approved));
export function beforePublication(row) {
  row=beforeStandardization(row);
  const approval=publication.approved[row.id];
  if(!approval) {
    assert.equal(row.reviewStatus,'pending',row.id);
    assert.equal(row.publicationStatus,'unpublished',row.id);
    assert.equal(row.examEligible,false,row.id);
    return row;
  }
  assert.equal(row.reviewStatus,'approved',row.id);
  assert.equal(row.publicationStatus,'published',row.id);
  assert.equal(row.examEligible,true,row.id);
  assert.equal(row.contentStatus,'draft_complete',row.id);
  const before={...row,reviewStatus:'pending',publicationStatus:'unpublished',examEligible:false,contentStatus:approval.beforeContentStatus};
  assert.equal(createHash('sha256').update(JSON.stringify(before)).digest('hex'),approval.beforeSHA256,row.id+': exact approved content');
  return before;
}
