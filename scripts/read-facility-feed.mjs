import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {beforeFacilityCareerThumbnails} from './read-facility-career-thumbnails.mjs';

const delta = JSON.parse(fs.readFileSync('docs/audits/2026-11-15-facility-feed/delta.json'));
const feedA = JSON.parse(fs.readFileSync('docs/audits/2026-11-20-facility-feed-a/delta.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
// The home-only category footer is a reviewed addition to the A-feed layout.
// Strip precisely this delta before running the immutable historical feed guards.
const homeFooterSource = `.facility-group-footer{display:flex;justify-content:center;padding:var(--space-6) 0 var(--space-8);border-bottom:1px solid var(--gray-200)}
.facility-group-more{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);min-height:44px;padding:10px 16px;border-radius:var(--radius-md);background:var(--gray-100);color:var(--gray-800);font-size:var(--fs-caption);font-weight:var(--fw-semibold);line-height:1.4;text-decoration:none;text-align:center;transition:background-color .15s}
.facility-group-more:hover{background:var(--gray-200)}
`;
const homeFooterCompiled = '.facility-group-footer{padding:var(--space-6) 0 var(--space-8);border-bottom:1px solid var(--gray-200);justify-content:center;display:flex}.facility-group-more{justify-content:center;align-items:center;gap:var(--space-2);border-radius:var(--radius-md);background:var(--gray-100);min-height:44px;color:var(--gray-800);font-size:var(--fs-caption);font-weight:var(--fw-semibold);text-align:center;padding:10px 16px;line-height:1.4;text-decoration:none;transition:background-color .15s;display:inline-flex}.facility-group-more:hover{background:var(--gray-200)}';
function beforeHomeFooter(file, bytes) {
  if (file !== 'src/styles/facility.css') return bytes;
  assert.equal(sha(bytes), 'a47cc9dbc0ee44d6d2c60db1c6230b27df9c1cdd54688c875c0eeb8c527eefcb', 'approved home footer source');
  const current = bytes.toString('utf8');
  assert.equal(current.split(homeFooterSource).length, 2, 'unique home footer styles');
  const previous = current.replace(homeFooterSource, '');
  assert.equal(sha(previous), feedA.source[file].afterSha256, 'previous A feed stylesheet restored');
  return Buffer.from(previous);
}

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
  return restoreSource(file, beforeFacilityCareerThumbnails(file, beforeHomeFooter(file, bytes)), feedA.source[file]);
}

export function beforeFacilityFeedCompiled(css) {
  assert.equal(sha(css), '6e801f8aacaddd3542ad1aed2903c72f5b96f9e216d6f8a53f7619313d4d590d', 'approved home footer compiled CSS');
  assert.equal(css.split(homeFooterCompiled).length, 2, 'unique compiled home footer rules');
  css = css.replace(homeFooterCompiled, '');
  assert.equal(sha(css), feedA.compiled.afterSha256, 'reviewed compiled A feed CSS');
  css = gunzipSync(Buffer.from(feedA.compiled.beforeGzip, 'base64')).toString('utf8');
  assert.equal(sha(css), feedA.compiled.beforeSha256, 'previous compiled facility CSS preserved');
  assert.equal(sha(css), delta.compiled.afterSha256, 'reviewed compiled feed CSS');
  assert.equal(sha(delta.compiled.before), delta.compiled.beforeSha256, 'previous list CSS preserved');
  return delta.compiled.before;
}
