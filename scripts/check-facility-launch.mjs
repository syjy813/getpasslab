// The original facility-publication fingerprint is kept immutable in
// docs/audits/2026-10-31-facility-launch/review.json.gz.
// The approved editorial UI and subsequent compact GNB revision pin thirteen exact source blobs.
// Preserve exact old bytes for everything else, the complete output page/URL
// inventory, and all original facility assets. Reviewed brand-free derivatives are pinned separately. Generated HTML changes
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
  'src/pages/[cert]/[exam]/[subject]/index.astro': '25ee38cc20c29e28d7542b70761c4d8b120e72f1',
  'src/pages/[cert]/[exam]/index.astro': '3e648acef59825aa1430431775e1226989605ab3',
  'src/styles/global.css': '297274d23a54af8863e44cb6f26c2e945617f6f8',
  'src/components/GNB.astro': '94217aab4aa2b5a754a95e3674a3844a6e46a9c2',
  'src/pages/certifications/index.astro': '125799ae05dc3918bd43b16babbdcfd9bf1fc043',
  'src/styles/catalog.css': '8a90e16d57215350e844faf7accf12cd20b1cd68',
  'src/components/Footer.astro': '1c21ee8122b0e7a2bbd5eac8c1c1f5d3538f5867',
  'src/components/FacilityCard.astro': '0a7f2c764837931627707951983aaaa15cad9389',
  'src/layouts/FacilityArticleLayout.astro': '0f9259e6f2473db213c8b416cf4aea5e58857782',
  'src/pages/facility-management/index.astro': 'f609c910d1b89037253da9923d38f714fa6d7ec7',
  'src/styles/facility.css': '21931c04c65685e95e6a4c56cb2369e22776b034',
  'src/pages/facility-management/[category]/index.astro': 'c6e86be311d7f72fc212e32f0e3ce691b0d17239',
  'src/styles/serviceNavigation.css': '07e2a66e7697ef2694058f842bc89884032060b4',
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
assert.deepEqual(reviewedEditorialPaths.sort(), Object.keys(editorialBlobs).sort(), 'thirteen reviewed UI changes only');

const assets = walk('facility-assets').sort();
assert.deepEqual(assets, Object.keys(facilityReview.assets).sort(), 'original image inventory');
for (const file of assets) assert.equal(hash(fs.readFileSync(file)), facilityReview.assets[file], file + ': original image');

const editReview = JSON.parse(fs.readFileSync('docs/audits/2026-11-03-facility-image-border/image-edits.json'));
const edits = new Map();
for (const row of editReview.edits) {
  assert(!edits.has(row.source), 'no duplicate edited source');
  assert.equal(row.file, row.source.replace('facility-assets/', 'facility-asset-edits/'), 'same image identity');
  assert.equal(row.sourceSHA256, facilityReview.assets[row.source], 'approved original fingerprint');
  assert.equal(hash(fs.readFileSync(row.source)), row.sourceSHA256, 'original preserved');
  assert.equal(hash(fs.readFileSync(row.file)), row.sha256, 'reviewed brand-free derivative');
  edits.set(row.source, row);
}
assert.equal(edits.size, 11, 'eleven bottom-brand edits');
assert.deepEqual(walk('facility-asset-edits').sort(), editReview.edits.map(row => row.file).sort(), 'exact derivative inventory');
const served = walk('dist/images/facility-drafts').sort();
assert.deepEqual(served, Object.keys(facilityReview.publishedAssets).sort(), 'same 22 public image URLs');
const servedEdits = new Set();
for (const [file, row] of Object.entries(facilityReview.publishedAssets)) {
  const edited = edits.get(row.source);
  assert.equal(hash(fs.readFileSync(file)), edited ? edited.sha256 : row.sha256, file + ': intended served image');
  assert.equal(hash(fs.readFileSync(row.source)), row.sha256, file + ': original source preserved');
  if (edited) servedEdits.add(row.source);
}
assert.deepEqual([...servedEdits].sort(), [...edits.keys()].sort(), 'every derivative is actually served');
assert.equal(served.length, 22, 'all 22 approved images');
console.log('[Facility UI source guard] PASS', files.length - generated, 'native files,', generated,
  'rendered HTML/XML paths, thirteen pinned UI blobs, 24 originals preserved, 11 edited + 11 original publication images');
