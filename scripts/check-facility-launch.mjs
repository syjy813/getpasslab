// The original facility-publication fingerprint is kept immutable in
// docs/audits/2026-10-31-facility-launch/review.json.gz.
// The approved editorial UI and subsequent compact GNB revision pin seven exact source blobs.
// Preserve exact old bytes for everything else, the complete output page/URL
// inventory, and all original/rendered facility assets. Generated HTML changes
// globally when the common header and footer change; verify its semantics via
// SEO/public-content checks and 4-width browser QA, not obsolete HTML hashes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { facilityReview, beforeFacilityLaunch } from './read-before-facility-launch.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlob = bytes => createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
const walk = dir => fs.existsSync(dir)
  ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
      entry.isDirectory() ? walk(dir + '/' + entry.name) : [dir + '/' + entry.name])
  : [];
const editorialBlobs = {
  'src/components/GNB.astro': '94217aab4aa2b5a754a95e3674a3844a6e46a9c2',
  'src/components/Footer.astro': '1c21ee8122b0e7a2bbd5eac8c1c1f5d3538f5867',
  'src/components/FacilityCard.astro': '7f4f6bbef4708bbcb89e961d92cb80b810b6c53e',
  'src/layouts/FacilityArticleLayout.astro': '0f9259e6f2473db213c8b416cf4aea5e58857782',
  'src/pages/facility-management/index.astro': 'b56e69b444af43a3e9373132f6c04fe9f88fce60',
  'src/styles/facility.css': '33e048fa4d4d642c8b56b8e8bf442ed2e261e613',
  'src/styles/serviceNavigation.css': 'd23b7abf51e2482b779d4026fd97e8776eec559a',
};

const files = [
  ...walk('src'),
  ...walk('public'),
  ...walk('dist').filter(file => /\.(html|xml)$/.test(file)),
].sort();
assert.deepEqual(files, Object.keys(facilityReview.current).sort(), 'same native source and public URL inventory');
const reviewedEditorialPaths = [];
let generated = 0;
for (const file of files) {
  const bytes = fs.readFileSync(file);
  if (Object.hasOwn(editorialBlobs, file)) {
    assert.equal(gitBlob(bytes), editorialBlobs[file], file + ': approved UI blob');
    assert.notEqual(hash(bytes), facilityReview.current[file], file + ': changed from publication snapshot');
    reviewedEditorialPaths.push(file);
  } else if (file.startsWith('dist/')) {
    // Exact rendered HTML bytes change on every page due to shared GNB/footer.
    // The page inventory is still exact; SEO/link/browser tests cover contents.
    generated++;
  } else {
    assert.equal(hash(bytes), facilityReview.current[file], file + ': unmodified native source/public bytes');
    if (facilityReview.changes[file]) {
      assert.equal(hash(beforeFacilityLaunch(file, bytes)), facilityReview.changes[file].beforeSHA256,
        file + ': original publication delta');
    }
  }
}
assert.deepEqual(reviewedEditorialPaths.sort(), Object.keys(editorialBlobs).sort(), 'seven reviewed UI changes only');

const assets = walk('facility-assets').sort();
assert.deepEqual(assets, Object.keys(facilityReview.assets).sort(), 'original image inventory');
for (const file of assets) assert.equal(hash(fs.readFileSync(file)), facilityReview.assets[file], file + ': original image');

const served = walk('dist/images/facility-drafts').sort();
assert.deepEqual(served, Object.keys(facilityReview.publishedAssets).sort(), 'only previously approved publication images');
for (const [file, row] of Object.entries(facilityReview.publishedAssets)) {
  assert.equal(hash(fs.readFileSync(file)), row.sha256, file + ': served image bytes');
  assert.equal(hash(fs.readFileSync(row.source)), row.sha256, file + ': source image bytes');
}
assert.equal(served.length, 22, '22 approved images remain unchanged');
console.log('[Facility UI source guard] PASS', files.length - generated, 'native files,', generated,
  'rendered HTML/XML paths, seven pinned UI blobs, 22 unchanged images');
