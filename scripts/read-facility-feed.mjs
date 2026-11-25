import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {beforeFacilityCareerThumbnails} from './read-facility-career-thumbnails.mjs';
import {beforeStoryThumbnails3x2} from './read-story-thumbnails-3x2.mjs';

const delta = JSON.parse(fs.readFileSync('docs/audits/2026-11-15-facility-feed/delta.json'));
const feedA = JSON.parse(fs.readFileSync('docs/audits/2026-11-20-facility-feed-a/delta.json'));
const searchMetadataSource = JSON.parse(fs.readFileSync('docs/audits/2026-11-25-facility-search/source-delta.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
// The home-only category footer is a reviewed addition to the A-feed layout.
// Strip precisely this delta before running the immutable historical feed guards.
const homeFooterSource = `.facility-group-footer{display:flex;justify-content:center;padding:var(--space-6) 0 var(--space-8);border-bottom:1px solid var(--gray-200)}
.facility-group-more{display:inline-flex;align-items:center;justify-content:center;gap:var(--space-2);min-height:44px;padding:10px 16px;border-radius:var(--radius-md);background:var(--gray-100);color:var(--gray-800);font-size:var(--fs-caption);font-weight:var(--fw-semibold);line-height:1.4;text-decoration:none;text-align:center;transition:background-color .15s}
.facility-group-more:hover{background:var(--gray-200)}
`;
const homeFooterCompiled = '.facility-group-footer{padding:var(--space-6) 0 var(--space-8);border-bottom:1px solid var(--gray-200);justify-content:center;display:flex}.facility-group-more{justify-content:center;align-items:center;gap:var(--space-2);border-radius:var(--radius-md);background:var(--gray-100);min-height:44px;color:var(--gray-800);font-size:var(--fs-caption);font-weight:var(--fw-semibold);text-align:center;padding:10px 16px;line-height:1.4;text-decoration:none;transition:background-color .15s;display:inline-flex}.facility-group-more:hover{background:var(--gray-200)}';
const refinedFooterSource = '.facility-home-group{--facility-category-divider:#C4CBD4;padding-top:calc(var(--space-16) + var(--space-4))}\n'
  + homeFooterSource.replace('border-bottom:1px solid var(--gray-200)', 'border-bottom:1px solid var(--facility-category-divider)')
  + '@media(max-width:639px){.facility-home-group{padding-top:var(--space-16)}}\n';
const refinedFooterCompiled = '.facility-home-group{--facility-category-divider:#c4cbd4;padding-top:calc(var(--space-16) + var(--space-4))}'
  + homeFooterCompiled.replace('border-bottom:1px solid var(--gray-200)', 'border-bottom:1px solid var(--facility-category-divider)')
  + '@media (width<=639px){.facility-home-group{padding-top:var(--space-16)}}';
// Retain the exact old category-page source for historical release checks.
// The removed link was redundant with the cards already shown in that group.
function beforeCareerJobsCTA(file, bytes) {
  if (file !== 'src/pages/facility-management/[category]/index.astro') return bytes;
  assert.equal(sha(bytes), 'e372fc1c1782c8ad428698a9af73a9d0a2a8416233507d44b11a20ee505ebc0a', 'approved redundant jobs CTA removal');
  const text = bytes.toString('utf8');
  const heading = '          <h2 class="gpl-h2">{group.title}</h2>\n';
  const removedCTA = `          {category.slug === 'career' && group.title === '기업·채용 분석' && (
            <a href={withBase(facilityCategoryPath('jobs'))}>채용공고 분석 모음 보기 →</a>
          )}
`;
  assert.equal(text.split(heading).length, 2, 'unique company analysis group heading');
  const restored = text.replace(heading, heading + removedCTA);
  assert.equal(sha(restored), feedA.source[file].afterSha256, 'previous category-page source restored');
  return Buffer.from(restored);
}
function beforeHomeFooter(file, bytes) {
  if (file !== 'src/styles/facility.css') return bytes;
  assert.equal(sha(bytes), '3b48a0025f00c2822a966e85d0be35c5a98638dd79dfb0d4aa17784e43306a6c', 'approved home footer refinement');
  const current = bytes.toString('utf8');
  assert.equal(current.split(refinedFooterSource).length, 2, 'unique refined home footer styles');
  const withOriginalFooter = current.replace(refinedFooterSource, homeFooterSource);
  assert.equal(sha(withOriginalFooter), 'a47cc9dbc0ee44d6d2c60db1c6230b27df9c1cdd54688c875c0eeb8c527eefcb', 'first approved home footer preserved');
  assert.equal(withOriginalFooter.split(homeFooterSource).length, 2, 'unique original footer styles');
  const previous = withOriginalFooter.replace(homeFooterSource, '');
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
  bytes = restoreSource(file, bytes, searchMetadataSource[file]);
  return restoreSource(file, beforeFacilityCareerThumbnails(file, beforeStoryThumbnails3x2(file, beforeHomeFooter(file, beforeCareerJobsCTA(file, bytes)))), feedA.source[file]);
}

export function beforeFacilityFeedCompiled(css) {
  assert.equal(sha(css), '5a11a66d4ead4afb69e987decb2381450f6a2076f83f9150b52a6c084a8987cd', 'approved footer spacing compiled CSS');
  assert.equal(css.split(refinedFooterCompiled).length, 2, 'unique refined footer compiled rules');
  css = css.replace(refinedFooterCompiled, homeFooterCompiled);
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
