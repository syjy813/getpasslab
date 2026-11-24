import {beforePendingRelease,seriesSourceAdditions,seriesOutputAdditions} from './read-pending-release.mjs';
import {beforeSasugoldae, sasugoldaeSourceAdditions, sasugoldaeOutputAdditions} from './read-sasugoldae-release.mjs';
import {hotelRelease, assertHotelRelease} from './read-hotel-two-parter-release.mjs';
assertHotelRelease();
import { episode00Release, assertEpisode00Release, approvedBorderlessHeroStyle, episode00Integration } from './read-hobyeongbaekma-publication.mjs';
import { integratedImageStyles } from './hobyeongbaekma-integrated-images.mjs';
assertEpisode00Release();
import {bulkVisuals,beforeBulkVisuals,assertBulkVisuals,bulkOutput} from './read-facility-bulk-visuals.mjs';
// The original facility-publication fingerprint is kept immutable in
// docs/audits/2026-10-31-facility-launch/review.json.gz.
// The approved editorial UI and current unified navy branding pin exact source blobs.
// Preserve exact old bytes for everything else, the complete output page/URL
// inventory, and all original facility assets. Reviewed image derivatives are pinned separately. Generated HTML changes
// globally when the common header and footer change; verify its semantics via
// SEO/public-content checks and 4-width browser QA, not obsolete HTML hashes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { facilityReview, beforeFacilityLaunch } from './read-before-facility-launch.mjs';
import {thumbnailPublicFiles, thumbnailMasterFiles, assertHobyeongbaekmaListThumbnails} from './read-hobyeongbaekma-list-thumbnails.mjs';
import {careerThumbnailPublicFiles, assertFacilityCareerThumbnails} from './read-facility-career-thumbnails.mjs';
import {storyThumbnail3x2PublicFiles, storyThumbnail3x2MasterFiles, assertStoryThumbnails3x2} from './read-story-thumbnails-3x2.mjs';
import { publicSectorVisuals, visualDerivativeFiles, beforePublicSectorVisuals, assertPublicSectorVisuals, visualOutput } from './read-public-sector-visuals.mjs';
import { electricSourceAdditions, electricOutputAdditions, assertElectricRelease } from './read-electric-release.mjs';

assertPublicSectorVisuals();
assertBulkVisuals();
await assertHobyeongbaekmaListThumbnails();
await assertFacilityCareerThumbnails();
await assertStoryThumbnails3x2();
assertElectricRelease();

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
  'src/layouts/BaseLayout.astro': '339bb8e75ad977a91d4cfafcc2181146060caa42',
  'src/pages/index.astro': '3359904eb7683b843b6c026a68c30ca3fcb73541',
  'public/favicon.svg': '035e5d8687d0c001e2cf16f5f83b3fb7a592bc90',
  'public/favicon-approved-v1.png': 'd5c235158422531435a64d924804fe92b6c01724',
  'src/pages/certifications/index.astro': '125799ae05dc3918bd43b16babbdcfd9bf1fc043',
  'src/styles/catalog.css': '8a90e16d57215350e844faf7accf12cd20b1cd68',
  'src/components/Footer.astro': '1c21ee8122b0e7a2bbd5eac8c1c1f5d3538f5867',
  'src/components/FacilityCard.astro': hotelRelease.nativeChanges['src/components/FacilityCard.astro'].blob,
  'src/layouts/FacilityArticleLayout.astro': hotelRelease.nativeChanges['src/layouts/FacilityArticleLayout.astro'].blob,
  'src/pages/facility-management/index.astro': 'f609c910d1b89037253da9923d38f714fa6d7ec7',
  'src/styles/facility.css': episode00Release.facilityStyleBlob,
  'src/pages/facility-management/[category]/index.astro': 'c6e86be311d7f72fc212e32f0e3ce691b0d17239',
  'src/styles/serviceNavigation.css': 'de32048d9ea8af551344504ba3742fbda03d005f',
};
// SEO link recovery is limited to the two certification index breadcrumbs.
// Reverse only the approved text/link substitutions before checking the
// original UI fingerprints; unrelated edits must still fail the guard.
const oldCertificationCrumb = '      <span>{certification.name}</span><span class="sep">/</span>';
const linkedCertificationCrumb = '      <a href={withBase(`/${certification.slug}/`)}>{certification.name}</a><span class="sep">/</span>';
const oldSingleSubjectCrumb = [
  '      {isSingleSubjectExam ? (',
  '        <span class="current">{examDefinition.name}</span>',
  '      ) : (',
].join('\n');
const linkedSingleSubjectCrumb = [
  '      {isSingleSubjectExam ? (',
  '        <>',
  '          <a href={withBase(`/${certification.slug}/${examDefinition.slug}/`)}>{examDefinition.name}</a><span class="sep">/</span>',
  '          <span class="current">{subject.name}</span>',
  '        </>',
  '      ) : (',
].join('\n');
const approvedSeoBreadcrumbs = new Map([
  ['src/pages/[cert]/[exam]/index.astro', [[linkedCertificationCrumb, oldCertificationCrumb]]],
  ['src/pages/[cert]/[exam]/[subject]/index.astro', [
    [linkedCertificationCrumb, oldCertificationCrumb],
    [linkedSingleSubjectCrumb, oldSingleSubjectCrumb],
  ]],
]);

const draftManifest = JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/draft-manifest.json'));
const publicationFile = 'docs/audits/2026-11-05-facility-publication/manifest.json';
const publication = fs.existsSync(publicationFile) ? JSON.parse(fs.readFileSync(publicationFile)) : null;
const newArticlePaths = publication ? Object.values(JSON.parse(fs.readFileSync('docs/audits/2026-11-04-facility-drafts/site-article-map.json'))).map(row => 'dist'+row.path+'index.html') : [];
const hospitalRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-11-hospital-two-parter/manifest.json'));
const hospitalSourceAdditions = new Set(hospitalRelease.articles.flatMap(row => [row.source, row.image]));
const hospitalOutputAdditions = new Set(hospitalRelease.articles.map(row => 'dist'+row.route+'index.html'));
const departmentStoreRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-12-department-store-two-parter/manifest.json'));
const departmentStoreSourceAdditions = new Set(departmentStoreRelease.articles.flatMap(row => [row.source, row.image]));
const departmentStoreOutputAdditions = new Set(departmentStoreRelease.articles.map(row => 'dist'+row.route+'index.html'));
const martRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-12-mart-two-parter/manifest.json'));
const martSourceAdditions = new Set(martRelease.articles.flatMap(row => [row.source, row.image]));
const martOutputAdditions = new Set(martRelease.articles.map(row => 'dist'+row.route+'index.html'));
const hospitalExtraRelease = JSON.parse(fs.readFileSync('docs/audits/2026-11-13-hospital-ep2-3/manifest.json'));
const hospitalExtraSourceAdditions = new Set(hospitalExtraRelease.articles.flatMap(row => [row.source, row.image]));
const hospitalExtraOutputAdditions = new Set(hospitalExtraRelease.articles.map(row => 'dist'+row.route+'index.html'));
// These shared navigation files changed under the five-category IA. Their new
// rendered behavior and preservation of all 24 article URLs are checked by
// scripts/check-facility-ia.mjs. Retain original byte guards for all other files.
const facilityIAFiles = new Set([
  'src/components/FacilityIcon.astro',
  'src/components/Footer.astro',
  'src/components/GNB.astro',
  'src/config/facility.ts',
  'src/content.config.ts',
  'src/layouts/FacilityArticleLayout.astro',
  'src/pages/facility-management/[category]/index.astro',
  'src/pages/facility-management/index.astro',
  'src/styles/facility.css',
]);
const facilityIANewRoutes = new Set([
  'dist/facility-management/intro/index.html',
  'dist/facility-management/stories/index.html',
]);
for (const [file, sha] of Object.entries({...draftManifest.source, ...publication?.source, ...draftManifest.assets})) {
  assert.equal(hash(beforeBulkVisuals(file,fs.readFileSync(file))), sha, file + ': pinned reviewed draft');
}
const newlyPublishedContent = new Set([
  'src/content/facility/mechanical-maintainer-grace-period.md',
  'dist/facility-management/qualifications/mechanical-maintainer-grace-period/index.html',
  'src/content/facility/refrigeration-safety-manager.md',
  'dist/facility-management/qualifications/refrigeration-safety-manager/index.html',
  'src/content/facility/statutory-appointment-overlap.md',
  'dist/facility-management/qualifications/statutory-appointment-overlap/index.html',
  'src/content/facility/musugi.md',
  'src/content/facility/facility-career-start.md',
  'dist/facility-management/intro/musugi/index.html',
  'dist/facility-management/career/facility-career-start/index.html',
]);
for (const path of newlyPublishedContent) assert(fs.existsSync(path), path + ': new approved content route exists');
const files = [
  ...walk('src'),
  ...walk('public'),
  ...walk('dist').filter(file => /\.(html|xml)$/.test(file)),
// Daily GA4 snapshots are validated by their dedicated analytics workflow, not UI fingerprints.
].filter(file => !newlyPublishedContent.has(file) && !electricSourceAdditions.includes(file) && !electricOutputAdditions.includes(file) && !seriesSourceAdditions.includes(file) && !seriesOutputAdditions.includes(file) && file !== 'src/data/facility-page-views.json' && !thumbnailPublicFiles.includes(file) && !careerThumbnailPublicFiles.includes(file) && !storyThumbnail3x2PublicFiles.includes(file) && !facilityIAFiles.has(file) && !facilityIANewRoutes.has(file) && !sasugoldaeSourceAdditions.includes(file) && !sasugoldaeOutputAdditions.includes(file) && !Object.hasOwn(hotelRelease.additions, file) && !hotelRelease.outputAdditions.includes(file) && !Object.hasOwn(episode00Release.additions, file) && !episode00Release.outputAdditions.includes(file) && !hospitalSourceAdditions.has(file) && !hospitalOutputAdditions.has(file) && !departmentStoreSourceAdditions.has(file) && !departmentStoreOutputAdditions.has(file) && !martSourceAdditions.has(file) && !martOutputAdditions.has(file) && !hospitalExtraSourceAdditions.has(file) && !hospitalExtraOutputAdditions.has(file) && !Object.hasOwn(draftManifest.source, file) && !newArticlePaths.includes(file)).sort();
assert.deepEqual(files, Object.keys(facilityReview.current).filter(file => !facilityIAFiles.has(file)).sort(), 'same non-IA source and public URL inventory');
const reviewedEditorialPaths = [];
let generated = 0;
for (const file of files) {
  const bytes = beforeSasugoldae(file, beforePublicSectorVisuals(file, beforeBulkVisuals(file, fs.readFileSync(file))));
  if (Object.hasOwn(editorialBlobs, file)) {
    if (file === 'src/styles/facility.css') {
      const originalFacilityCss=fs.readFileSync(episode00Integration.previousStyle,'utf8')+integratedImageStyles;
      assert.equal(bytes.toString('utf8'),originalFacilityCss+approvedBorderlessHeroStyle,'only approved borderless hero CSS appended');
      assert.equal(gitBlob(Buffer.from(originalFacilityCss)), editorialBlobs[file], file + ': original approved UI blob');
    } else if (file === 'src/layouts/FacilityArticleLayout.astro') {
      const current=bytes.toString('utf8');
      assert.equal(current.split("const showSourceList = !article.id.startsWith('hobyeongbaekma');").length,2,file + ': exact hobyeongbaekma source visibility extension');
      const historical=Buffer.from(current.replace("const showSourceList = !article.id.startsWith('hobyeongbaekma');","const showSourceList = !['hobyeongbaekma', 'hobyeongbaekma-hotel-despair', 'hobyeongbaekma-hotel-hope'].includes(article.id);"));
      assert.equal(gitBlob(historical), editorialBlobs[file], file + ': approved UI baseline with series source visibility extension');
    } else if (file === 'src/components/FacilityCard.astro') {
      const current=bytes.toString('utf8');
      const departmentStoreCovers="  'hobyeongbaekma-department-store-despair': '/images/facility-series/ep3-1-department-store-despair/01-hero.webp',\n  'hobyeongbaekma-department-store-hope': '/images/facility-series/ep3-2-department-store-hope/01-hero.webp',\n";
const martCovers="  'hobyeongbaekma-mart-despair': '/images/facility-series/ep4-1-mart-despair/01-hero.webp',\n  'hobyeongbaekma-mart-hope': '/images/facility-series/ep4-2-mart-hope/01-hero.webp',\n";
      const hospitalCovers="  'hobyeongbaekma-hospital-despair': '/images/facility-series/ep2-1-hospital-despair/01-hero.webp',\n  'hobyeongbaekma-hospital-hope': '/images/facility-series/ep2-2-hospital-hope/01-hero.webp',\n";
      const hospitalExtraCover="  'hobyeongbaekma-hospital-large-university': '/images/facility-series/ep2-3-hospital-large/01-hero.webp',\n";
      assert.equal(current.split(departmentStoreCovers).length,2,file + ': exact department-store cover additions');
      assert.equal(current.split(hospitalCovers).length,2,file + ': exact hospital cover additions');
      assert.equal(current.split(hospitalExtraCover).length,2,file + ': exact hospital ep.2-3 cover addition');
      assert.equal(current.split("const coverSize = article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];").length,2,file + ': series cover size rule');
      const historical=Buffer.from(current.replace(departmentStoreCovers,'').replace(martCovers,'').replace(hospitalCovers,'').replace(hospitalExtraCover,'').replace("const coverSize = article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];","const coverSize = ['hobyeongbaekma', 'hobyeongbaekma-hotel-despair', 'hobyeongbaekma-hotel-hope'].includes(article.id) ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];"));
      assert.equal(gitBlob(historical), editorialBlobs[file], file + ': approved card baseline with hospital and department-store cover extensions');
    } else if (approvedSeoBreadcrumbs.has(file)) {
      let historical = bytes.toString('utf8');
      for (const [current, original] of approvedSeoBreadcrumbs.get(file)) {
        assert.equal(historical.split(current).length, 2, `${file}: exact approved SEO breadcrumb change`);
        historical = historical.replace(current, original);
      }
      assert.equal(gitBlob(Buffer.from(historical)), editorialBlobs[file], `${file}: original UI preserved beyond approved links`);
    } else {
      assert.equal(gitBlob(bytes), editorialBlobs[file], file + ': approved UI blob');
    }
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
assert.deepEqual(reviewedEditorialPaths.sort(), Object.keys(editorialBlobs).filter(file => !facilityIAFiles.has(file)).sort(), 'other reviewed UI and favicon changes preserved');

const assets = walk('facility-assets').filter(file => !thumbnailMasterFiles.includes(file) && !storyThumbnail3x2MasterFiles.includes(file) && !Object.hasOwn(draftManifest.assets, file)).sort();
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
  'rendered HTML/XML paths,', Object.keys(editorialBlobs).length, 'pinned UI/brand blobs, 24 originals and 3 historical masters preserved; 5 current public-sector visuals verified');
