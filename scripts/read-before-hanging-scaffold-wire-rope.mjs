import assert from 'node:assert/strict';
import { readFile as readActualFile, readdir as readActualDirectory } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Exact historical reads only; the newest guard checks all real source and article bytes.
const audit = 'docs/audits/2026-10-10-hanging-scaffold-wire-rope';
const review = JSON.parse(await readActualFile(`${audit}/review.json`, 'utf8'));
const compatibility = JSON.parse(await readActualFile(`${audit}/compatibility.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
// Exact, Git-reviewed rollout content. The 2026-10-10 source snapshot must
// remain immutable; it predates the all-chapter practice rollout (#161).
const rolloutHashes = new Map([
  ['src/components/InstantQuestionPractice.astro', 'cc622a10bf43b49e2c1a2c17fc2412da06bf831c308317f65555d1b1c2e6edc3'],
  ['src/pages/[cert]/[exam]/[subject]/[slug].astro', '346dc57256093c0a8171aed740362981ac2d6f9c461b19b53dee845e7bb55087'],
  ['dist/industrial-safety/written/safety-management/accident-prevention-principles/index.html', 'fab31075f68fd4d161b9dbe4f6f13a4e4cea4f769220a072d7c5bf58812b11b5'],
]);
const matchesApprovedHash = (row, actual) => actual === row.sha256 || actual === rolloutHashes.get(row.path);
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
