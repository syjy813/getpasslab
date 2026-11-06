import {bulkVisuals,beforeBulkVisuals,assertBulkVisuals,bulkOutput} from './read-facility-bulk-visuals.mjs';
// The original facility-publication fingerprint is kept immutable in
// docs/audits/2026-10-31-facility-launch/review.json.gz.
// The approved editorial UI and subsequent navy route rebrand pin fifteen exact source blobs.
// Preserve exact old bytes for everything else, the complete output page/URL
// inventory, and all original facility assets. Reviewed image derivatives are pinned separately. Generated HTML changes
// globally when the common header and footer change; verify its semantics via
// SEO/public-content checks and 4-width browser QA, not obsolete HTML hashes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { facilityReview, beforeFacilityLaunch } from './read-before-facility-launch.mjs';
import { publicSectorVisuals, visualDerivativeFiles, beforePublicSectorVisuals, assertPublicSectorVisuals, visualOutput } from './read-public-sector-visuals.mjs';

assertPublicSectorVisuals();
assertBulkVisuals();

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
  'src/components/GNB.astro': 'b349aba310092b9170fe6b13db4c55742431370d',
  'src/layouts/BaseLayout.astro': '3446eb7568da5bf0d35364fdd6d7639776df7938',
  'public/favicon.svg': '035e5d8687d0c001e2cf16f5f83b3fb7a592bc90',
  'src/pages/certifications/index.astro': '125799ae05dc3918bd43b16babbdcfd9bf1fc043',
  'src/styles/catalog.css': '8a90e16d57215350e844faf7accf12cd20b1cd68',
  'src/components/Footer.astro': '1c21ee8122b0e7a2bbd5eac8c1c1f5d3538f5867',
  'src/components/FacilityCard.astro': 'bc60b65b1cd8c9f52ae6e9decfc66a17d8c33f70',
  'src/layouts/FacilityArticleLayout.astro': '0f9259e6f2473db213c8b416cf4aea5e58857782',
  'src/pages/facility-management/index.astro': 'f609c910d1b89037253da9923d38f714fa6d7ec7',
  'src/styles/facility.css': '48b48abb2751e463e3f70ccbfde589e3664b6e83',
  'src/pages/facility-management/[category]/index.astro': 'c6e86be311d7f72fc212e32f0e3ce691b0d17239',
  'src/styles/serviceNavigation.css': 'de32048d9ea8af551344504ba3742fbda03d005f',
};

const draftManifest = JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/draft-manifest.json'));
const publicationFile = 'docs/audits/2026-11-05-facility-publication/manifest.json';
const publication = fs.existsSync(publicationFile) ? JSON.parse(fs.readFileSync(publicationFile)) : null;
const newArticlePaths = publication ? Object.values(JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/site-article-map.json'))).map(row => 'dist'+row.path+'index.html') : [];
for (const [file, sha] of Object.entries({...draftManifest.source, ...publication?.source, ...draftManifest.assets})) {
  assert.equal(hash(beforeBulkVisuals(file,fs.readFileSync(file))), sha, file + ': pinned reviewed draft');
}
const files = [
  ...walk('src'),
  ...walk('public'),
  ...walk('dist').filter(file => /\.(html|xml)$/.test(file)),
].filter(file => !Object.hasOwn(draftManifest.source, file) && !newArticlePaths.includes(file)).sort();
assert.deepEqual(files, Object.keys(facilityReview.current).sort(), 'same native source and public URL inventory');
const reviewedEditorialPaths = [];
let generated = 0;
for (const file of files) {
  const bytes = beforePublicSectorVisuals(file, beforeBulkVisuals(file, fs.readFileSync(file)));
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
assert.deepEqual(reviewedEditorialPaths.sort(), Object.keys(editorialBlobs).sort(), 'fifteen reviewed UI changes only');

const assets = walk('facility-assets').filter(file => !Object.hasOwn(draftManifest.assets, file)).sort();
assert.deepEqual(assets, Object.keys(facilityReview.assets).sort(), 'original image inventory');
for (const file of assets) assert.equal(hash(fs.readFileSync(file)), facilityReview.assets[file], file + ': original image');

const editRows = [
  ...JSON.parse(fs.readFileSync('docs/audits/2026-11-03-facility-image-border/image-edits.json')).edits,
  ...JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-gnb-image/image-edits.json')).edits,
];
const edits = new Map();
for (const row of editRows) {
  assert(!edits.has(row.source), 'no duplicate edited source');
  assert.equal(row.file, row.source.replace('facility-assets/', 'facility-asset-edits/'), 'same image identity');
  assert.equal(row.sourceSHA256, facilityReview.assets[row.source], 'approved original fingerprint');
  assert.equal(hash(fs.readFileSync(row.source)), row.sourceSHA256, 'original preserved');
  assert.equal(hash(fs.readFileSync(row.file)), row.sha256, 'reviewed derivative');
  edits.set(row.source, row);
}
assert.equal(edits.size, 12, 'eleven bottom-brand edits and one hand correction');
// Source SVGs are the approved editable masters for 05. Existing original WebPs remain immutable;
// the Astro build renders WebP files at the SAME three public URLs.
const facility05Masters = new Map([
  ['facility-assets/05/01-public-sector-hero.webp', ['facility-asset-edits/05/01-public-sector-hero.svg', '9bfa7b4ed1614597c8a3a4627929a64c6277e36f']],
  ['facility-assets/05/02-employer-types.webp', ['facility-asset-edits/05/02-employer-types.svg', '5f5cf07544e75f5543ecbd591ec0e2c5ef9ec5c2']],
  ['facility-assets/05/04-pay-data-comparison.webp', ['facility-asset-edits/05/04-pay-data-comparison.svg', 'b2981e016b006a6ee2ce0a6bca9e82ea35f7ca75']],
]);
for (const [source, [masterPath, sha]] of facility05Masters) {
  assert.equal(gitBlob(fs.readFileSync(masterPath)), sha, masterPath + ': approved vector master');
  assert.equal(hash(fs.readFileSync(source)), facilityReview.assets[source], source + ': original unchanged');
  const svg = fs.readFileSync(masterPath, 'utf8');
  assert.match(svg, /viewBox="0 0 1440 1080"/, masterPath + ': 4:3 source geometry');
  assert.equal((svg.match(/GetPassLab/g) || []).length, 1, masterPath + ': single brand');
  assert.equal((svg.match(/font-size="64"/g) || []).length, 1, masterPath + ': 64px headline');
  assert.equal((svg.match(/font-size="30"/g) || []).length, 1, masterPath + ': 30px subtitle');
  assert(!svg.includes('시설의 모든 것 05'), masterPath + ': no decorative chapter badge');
}
assert.deepEqual(
  walk('facility-asset-edits').sort(),
  [...editRows.map(row => row.file), ...[...facility05Masters.values()].map(row => row[0]), ...visualDerivativeFiles].sort(),
  'exact derivative + editable SVG master inventory',
);
const { default: sharp } = await import('sharp');
const generatedMasterWebps = new Map();
for (const [source, [masterPath]] of facility05Masters) {
  const webp = await sharp(fs.readFileSync(masterPath), { density: 96 })
    .resize(1440, 1080, { fit: 'fill' }).webp({ quality: 86, effort: 6 }).toBuffer();
  const meta = await sharp(webp).metadata();
  assert.equal(meta.format, 'webp', source + ': optimized webp');
  assert.equal(meta.width, 1440, source + ': width');
  assert.equal(meta.height, 1080, source + ': height');
  generatedMasterWebps.set(source, hash(webp));
}
const newImagePaths = publication ? new Set(Object.keys(publication.assets).map(file=>file.replace('facility-assets/','dist/images/facility-drafts/'))) : new Set();
for(const row of publicSectorVisuals.images){
  assert.equal(hash(fs.readFileSync(visualOutput(row))),row.sha256,'reviewed visual is served: '+row.publicPath);
  if(row.existing)generatedMasterWebps.set('facility-assets/05/'+row.publicPath.split('/').at(-1),row.sha256);
  else newImagePaths.add(visualOutput(row));
}
for(const row of bulkVisuals.images){if(!row.existing)newImagePaths.add(bulkOutput(row));else generatedMasterWebps.set('facility-assets/'+row.publicPath.split('/').slice(-2).join('/'),row.sha256);}
const served = walk('dist/images/facility-drafts').filter(file=>!newImagePaths.has(file)).sort();
assert.deepEqual(served, Object.keys(facilityReview.publishedAssets).sort(), 'same 22 public image URLs');
const servedEdits = new Set();
for (const [file, row] of Object.entries(facilityReview.publishedAssets)) {
  const edited = edits.get(row.source);
  const generated = generatedMasterWebps.get(row.source);
  assert.equal(hash(fs.readFileSync(file)), generated ?? (edited ? edited.sha256 : row.sha256), file + ': intended served image');
  assert.equal(hash(fs.readFileSync(row.source)), row.sha256, file + ': original source preserved');
  if (edited || generated) servedEdits.add(row.source);
}
assert.deepEqual([...servedEdits].sort(), [...new Set([...edits.keys(), ...facility05Masters.keys(), ...publicSectorVisuals.images.filter(r=>r.existing).map(r=>'facility-assets/05/'+r.publicPath.split('/').at(-1)), ...bulkVisuals.images.filter(r=>r.existing&&Number(r.publicPath.split('/')[3])<6).map(r=>'facility-assets/'+r.publicPath.split('/').slice(-2).join('/'))])].sort(), 'every derivative is actually served');
assert.equal(served.length, 22, 'all 22 approved public image URLs retained');
console.log('[Facility UI source guard] PASS', files.length - generated, 'native files,', generated,
  'rendered HTML/XML paths, fifteen pinned UI blobs, 24 originals and 3 historical masters preserved; 5 current public-sector visuals verified');
