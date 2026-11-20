import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';

const delta = JSON.parse(fs.readFileSync('docs/audits/2026-11-15-facility-feed/delta.json'));
const feedA = JSON.parse(fs.readFileSync('docs/audits/2026-11-20-facility-feed-a/delta.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// Restore only this approved presentation change before historical guards run.
function restoreSource(file, bytes, row) {
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

export function beforeFacilityFeed(file, bytes) {
  return restoreSource(file, bytes, delta.source[file]);
}

export function beforeFacilityFeedA(file, bytes) {
  return restoreSource(file, bytes, feedA.source[file]);
}

export function beforeFacilityFeedCompiled(css) {
  assert.equal(sha(css), feedA.compiled.afterSha256, 'reviewed compiled A feed CSS');
  css = gunzipSync(Buffer.from(feedA.compiled.beforeGzip, 'base64')).toString('utf8');
  assert.equal(sha(css), feedA.compiled.beforeSha256, 'previous compiled facility CSS preserved');
  assert.equal(sha(css), delta.compiled.afterSha256, 'reviewed compiled feed CSS');
  assert.equal(sha(delta.compiled.before), delta.compiled.beforeSha256, 'previous list CSS preserved');
  return delta.compiled.before;
}
