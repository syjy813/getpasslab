import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';
const audit = 'docs/audits/2026-10-04-accident-analysis-figures';
const review = JSON.parse(await readFile(`${audit}/review.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const source = await readFile(review.chapters[0].path, 'utf8');
assert.equal(hash(source), review.chapters[0].sha256);
const frontmatter = source.split('\n---\n')[0] + '\n---\n';
assert.equal(hash(frontmatter), review.chapters[0].frontmatterSha256);
const fields = yaml.load(source.match(/^---\n([\s\S]*?)\n---/)[1]);
assert.deepEqual(fields.questions, review.questionIds);
assert.equal(hash(await readFile('src/data/questions/industrial-safety.json')), review.canonicalSha256);
const scope = '/industrial-safety/written/safety-management/';
const url = scope + 'accident-analysis-tools/';
const html = await readFile(`dist${url}index.html`, 'utf8');
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert(html.includes(`href="https://getpasslab.co.kr${url}"`));
assert(!html.includes('noindex'));
assert.deepEqual([...html.matchAll(/data-open="(\d{8}_\d{3})"/g)].map(m => m[1]), review.questionIds);
assert.equal((html.match(/id="deferred-question-dialog"/g) || []).length, 1);
assert(html.includes('data-question-history-mode="deferred"'));
assert((await readFile(`dist${scope}index.html`, 'utf8')).includes(`href="${url}"`));
assert((await readFile('dist/sitemap-0.xml', 'utf8')).includes(`https://getpasslab.co.kr${url}`));
for (const slug of fields.related) {
  assert(html.includes(`href="${scope}${slug}/"`));
  await readFile(`dist${scope}${slug}/index.html`);
}
for (const asset of review.assets) {
  const svg = await readFile(asset.path, 'utf8');
  assert.equal(hash(svg), asset.sha256);
  assert.equal(hash(await readFile(asset.path.replace(/^public\//, 'dist/'))), asset.sha256);
  assert(!/<script|<image|<foreignObject|(?:href|src)=|[\u3040-\u30ff]/.test(svg));
  assert(svg.includes('학습용'));
}
assert.equal((source.match(/<figure>/g) || []).length, 3);
assert(!/^\|/m.test(source), 'duplicate teaching tables must not return');
console.log('[Accident analysis] 3 exact SVG assets, canonical dataset, 5 question assignments, public URL/TOC/sitemap/related links passed');
