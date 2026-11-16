import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {beforeFacilityFeed, beforeFacilityFeedCompiled} from './read-facility-feed.mjs';
import {beforeHobyeongbaekmaListThumbnails} from './read-hobyeongbaekma-list-thumbnails.mjs';

const delta = JSON.parse(fs.readFileSync('docs/audits/2026-11-15-facility-list-layout/delta.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

// Keep historical source/asset guards intact. Restore only the reviewed list
// presentation delta, checking both endpoints before comparing older releases.
export function beforeFacilityListLayout(file, bytes) {
  bytes = beforeHobyeongbaekmaListThumbnails(file, bytes);
  bytes = beforeFacilityFeed(file, bytes);
  const row = delta.source[file];
  if (!row) return bytes;
  assert.equal(sha(bytes), row.afterSha256, file + ': reviewed list presentation');
  let text = bytes.toString('utf8');
  for (const change of [...row.changes].reverse()) {
    assert.equal(text.split(change.after).length, 2, file + ': unique reviewed replacement');
    text = text.replace(change.after, change.before);
  }
  assert.equal(sha(text), row.beforeSha256, file + ': exact previous source restored');
  return Buffer.from(text);
}

export function beforeFacilityListCompiled(css) {
  css = beforeFacilityFeedCompiled(css);
  assert.equal(sha(css), delta.compiled.afterSha256, 'reviewed compiled list CSS');
  assert.equal(sha(delta.compiled.before), delta.compiled.beforeSha256, 'previous compiled CSS preserved');
  return delta.compiled.before;
}
