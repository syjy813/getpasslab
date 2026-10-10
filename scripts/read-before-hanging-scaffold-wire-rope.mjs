import assert from 'node:assert/strict';
import { readFile as readActualFile, readdir as readActualDirectory } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Exact historical reads only; the newest guard checks all real source and article bytes.
const audit = 'docs/audits/2026-10-10-hanging-scaffold-wire-rope';
const review = JSON.parse(await readActualFile(`${audit}/review.json`, 'utf8'));
const compatibility = JSON.parse(await readActualFile(`${audit}/compatibility.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const rolloutLayout = 'src/layouts/ChapterLayout.astro';
const rolloutLayoutHash = '120b96e6a2b914eb66e447782f29937e974d35597b1ff3b3b036b2d87b992ff3';
const originalLayoutHash = 'e4684c86c85209a8d6f7978ba04b095d526c585834b91f48942594f9489955d2';
const rolloutEndpoint = 'src/pages/practice-data/[cert].json.ts';
const rolloutEndpointHash = 'e4bc7aa1d9a7edd5c6f0bd8026c94ad38abc7679b138875be6af667540f4990a';
// PR #164 added exactly these four lines to the unchanged shared layout.
// Validate both versions, reversing only this approved overlay for older audits.
const layoutInsertions = [
  "import InstantQuestionPractice from '../components/InstantQuestionPractice.astro';\n",
  '  practiceQuestions?: any[];\n',
  '  practiceQuestions,\n',
  '  {practiceQuestions && <InstantQuestionPractice questions={practiceQuestions} certificationId={cert_id} chapterSlug={slug} />}\n',
];
// Exact, Git-reviewed rollout content. The 2026-10-10 source snapshot must
// remain immutable; it predates the all-chapter practice rollout (#161).
const rolloutHashes = new Map([
  ['src/components/InstantQuestionPractice.astro', 'cc622a10bf43b49e2c1a2c17fc2412da06bf831c308317f65555d1b1c2e6edc3'],
  ['src/pages/[cert]/[exam]/[subject]/[slug].astro', '346dc57256093c0a8171aed740362981ac2d6f9c461b19b53dee845e7bb55087'],
  ['dist/industrial-safety/written/safety-management/accident-prevention-principles/index.html', 'fab31075f68fd4d161b9dbe4f6f13a4e4cea4f769220a072d7c5bf58812b11b5'],
]);
// The user-authorized dialog UI repair preserves all data/layout bytes.
// Keep the rollout allowlist and archived evidence unchanged; accept only
// this exact additional component version, never arbitrary future edits.
const repairedPracticeHashes = new Map([
  ['src/components/InstantQuestionPractice.astro', '43f7428d6c43cc1b0492b54b56dc29425fb382afa485d3984770b33c62e3f9e3'],
  // This pilot article changes only the compiled practice script filename.
  ['dist/industrial-safety/written/safety-management/accident-prevention-principles/index.html', '5936242ddc2698e50b49dd83dbd6b9ee6281f0dd1dccd832ac89ae5bc73b76de'],
]);
export const isApprovedPracticeUIRepair = (file, actual) => actual === repairedPracticeHashes.get(file);
const matchesApprovedHash = (row, actual) => actual === row.sha256 || actual === rolloutHashes.get(row.path)
  || isApprovedPracticeUIRepair(row.path, actual);
async function approvedOriginal(row, bytes, articleOnly = false) {
  const actual = articleOnly ? bytes.toString('utf8').match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1] : bytes;
  assert(matchesApprovedHash(row, hash(actual)), `${row.path}: exact already-approved change, got ${hash(actual)}`);
  const original = articleOnly ? JSON.parse(await readActualFile(row.originalFile, 'utf8')).article : await readActualFile(row.originalFile);
  assert.equal(hash(original), row.originalSha256, `${row.path}: exact historical bytes`);
  return articleOnly ? Buffer.from(bytes.toString('utf8').replace(actual, () => original)) : original;
}
export async function readFile(file, encoding) {
  let bytes = await readActualFile(file);
  const key = path.normalize(String(file));
  if (key === rolloutLayout && hash(bytes) !== originalLayoutHash) {
    assert.equal(hash(bytes), rolloutLayoutHash, 'exact PR #164 layout overlay');
    let source = bytes.toString('utf8');
    for (const addition of layoutInsertions) {
      assert.equal(source.split(addition).length, 2, 'one exact approved layout insertion');
      source = source.replace(addition, '');
    }
    assert.equal(hash(source), originalLayoutHash, 'all historical layout bytes preserved');
    bytes = Buffer.from(source);
  }
  const related = review.relatedArticleChanges.find(r => r.path === key);
  if (related) {
    const html = bytes.toString('utf8'), article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    assert.equal(hash(article), related.sha256); assert.equal(article.split(related.insertedHtml).length, 2);
    const original = article.replace(related.insertedHtml, ''); assert.equal(hash(original), related.originalSha256);
    bytes = Buffer.from(html.replace(article, () => original));
  }
  const source = compatibility.sourceChanges.find(r => r.path === key && !r.newFile);
  if (source) bytes = await approvedOriginal(source, bytes);
  const pilot = compatibility.articleChanges.find(r => r.path === key);
  if (pilot) bytes = await approvedOriginal(pilot, bytes, true);
  return encoding ? bytes.toString(encoding) : bytes;
}
export async function readdir(dir, options) {
  let entries = await readActualDirectory(dir, options);
  const key = path.normalize(String(dir));
  for (const row of compatibility.sourceChanges.filter(r => r.newFile && path.dirname(r.path) === key)) {
    const actualHash = hash(await readActualFile(row.path));
    assert(matchesApprovedHash(row, actualHash), `${row.path}: only approved source versions allowed, got ${actualHash}`);
    assert(entries.some(e => (typeof e === 'string' ? e : e.name) === path.basename(row.path)));
    entries = entries.filter(e => (typeof e === 'string' ? e : e.name) !== path.basename(row.path));
  }
  const source = key === path.dirname(review.chapter.path);
  const route = key === path.dirname(path.dirname(review.chapter.articlePath));
  if (!source && !route) return entries;
  assert.equal(hash(await readActualFile(review.chapter.path)), review.chapter.sha256);
  if (route) assert.equal(hash((await readActualFile(review.chapter.articlePath, 'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]), review.chapter.articleSha256);
  const name = source ? path.basename(review.chapter.path) : review.chapter.slug;
  assert(entries.some(e => (typeof e === 'string' ? e : e.name) === name));
  return entries.filter(e => (typeof e === 'string' ? e : e.name) !== name);
}

// Only audits that predate the endpoint opt into this inventory projection.
// Newer guards still see it and verify its existence and delivered data.
export async function beforePracticeEndpointInventory(files) {
  assert(files.includes(rolloutEndpoint), 'approved endpoint must be present');
  assert.equal(hash(await readActualFile(rolloutEndpoint)), rolloutEndpointHash, 'exact PR #164 static endpoint');
  return files.filter(file => file !== rolloutEndpoint);
}
