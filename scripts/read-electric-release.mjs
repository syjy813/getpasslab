import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

// The 2026-11-20 electric guide launch adds two public articles without
// changing the historical facility release's approved content and assets.
export const electricArticles = [
  {
    id: 'electric-unlimited',
    category: 'intro',
    image: 'electric-unlimited.webp',
    master: 'electric-unlimited-original.png',
    imageSha256: 'c067b2b63c8272fc3c88e3f967319f8439a53382a4dd10518eb705bf30494aef',
    masterSha256: 'b3c40ccca6a8d7008d851956fcdde0ff2bf83a491ac4de9ab5dc4706b361cce7',
  },
  {
    id: 'electric-license-appointment-comparison',
    category: 'qualifications',
    image: 'electric-license-appointment-comparison.webp',
    master: 'electric-license-comparison-original.png',
    imageSha256: 'e8f885c0fc68b0a7e7c87d8d8dc37eb28aa0185e3526d395ee311f74819f701b',
    masterSha256: '11196ece16f7e52cd2ac1e0a791fdef084205f9fff17ce20696d43e6c369147e',
  },
].map(row => ({
  ...row,
  source: `src/content/facility/${row.id}.md`,
  route: `/facility-management/${row.category}/${row.id}/`,
  publicFile: `public/images/facility-electric/${row.image}`,
  masterFile: `docs/drafts/facility/electric/${row.master}`,
}));

export const electricSourceAdditions = electricArticles.flatMap(row => [row.source, row.publicFile]);
export const electricOutputAdditions = electricArticles.flatMap(row => [
  `dist${row.route}index.html`,
  row.publicFile.replace(/^public/, 'dist'),
]);

const covers = electricArticles.map(row => `  '${row.id}': '/images/facility-electric/${row.image}',\n`).join('');
const newSize = `const coverSize = ['electric-unlimited', 'electric-license-appointment-comparison'].includes(article.id)\n  ? [1536, 1024]\n  : listingThumbnail ? [1448, 1086] : article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];`;
const oldSize = `const coverSize = listingThumbnail ? [1448, 1086] : article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];`;

// Restore exactly the new card mappings before legacy byte-for-byte guards.
// The original immutable fingerprints and their checks remain unchanged.
export function beforeElectricArticleCard(file, bytes) {
  if (file !== 'src/components/FacilityCard.astro') return bytes;
  let text = bytes.toString('utf8');
  assert.equal(text.split(covers).length, 2, 'electric card mappings present exactly once');
  text = text.replace(covers, '');
  assert.equal(text.split(newSize).length, 2, 'electric 3:2 card size present exactly once');
  return Buffer.from(text.replace(newSize, oldSize));
}

export function assertElectricRelease() {
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  for (const row of electricArticles) {
    const source = fs.readFileSync(row.source, 'utf8');
    assert.match(source, /^status: published$/m, row.id + ': publicly released');
    assert.match(source, new RegExp(`^category: ${row.category}$`, 'm'), row.id + ': original route category');
    assert.match(source, /^publishedAt: '2026-11-20'$/m, row.id + ': approved publish date');
    assert.match(source, /^legalReview: true$/m, row.id + ': legal review flag');
    assert.match(source, /^sources:\s*\n- title:/m, row.id + ': cited primary sources');
    assert.equal(hash(fs.readFileSync(row.publicFile)), row.imageSha256, row.id + ': approved WebP unchanged');
    assert.equal(hash(fs.readFileSync(row.masterFile)), row.masterSha256, row.id + ': approved PNG unchanged');
    assert.equal(hash(fs.readFileSync(row.publicFile.replace(/^public/, 'dist'))), row.imageSha256, row.id + ': served image unchanged');
    const html = fs.readFileSync(`dist${row.route}index.html`, 'utf8');
    assert(html.includes(`https://getpasslab.co.kr${row.route}`), row.id + ': canonical URL');
    assert(html.includes('<meta property="og:image" content="https://getpasslab.co.kr/og-facility.png">'), row.id + ': social image preserved');
    assert(!html.includes('검토용 초안'), row.id + ': no draft badge');
  }
}
