import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const delta = JSON.parse(fs.readFileSync('docs/audits/2026-11-15-facility-feed/delta.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// Restore only this approved presentation change before historical guards run.
export function beforeFacilityFeed(file, bytes) {
  const row = delta.source[file];
  if (!row) return bytes;
  assert.equal(sha(bytes), row.afterSha256, file + ': reviewed feed presentation');
  let text = bytes.toString('utf8');
  for (const change of [...row.changes].reverse()) {
    assert.equal(text.split(change.after).length, 2, file + ': unique feed replacement');
    text = text.replace(change.after, change.before);
  }
  assert.equal(sha(text), row.beforeSha256, file + ': exact previous list source restored');
  return Buffer.from(text);
}

export function beforeFacilityFeedCompiled(css) {
  assert.equal(sha(css), delta.compiled.afterSha256, 'reviewed compiled feed CSS');
  assert.equal(sha(delta.compiled.before), delta.compiled.beforeSha256, 'previous list CSS preserved');
  return delta.compiled.before;
}
