import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const audit = 'docs/audits/2026-10-20-fire-level2-practice';
const baseline = JSON.parse(await readFile(audit + '/baseline.json', 'utf8'));
const release = JSON.parse(await readFile(audit + '/release.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const walk = async dir => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))).flat();
const changes = new Map(release.files.map(row => [row.path, row]));
const inventory = [...await walk('src'), ...await walk('public')].sort();
assert.deepEqual(inventory, [...Object.keys(baseline.files), ...release.files.filter(row => !row.originalFile).map(row => row.path)].sort());
for (const file of inventory) assert.equal(hash(await readFile(file)), changes.get(file)?.sha256 ?? baseline.files[file], file + ': native source protection');
for (const row of release.files.filter(row => row.originalFile)) {
  assert.equal(hash(await readFile(row.originalFile)), row.originalSha256);
  assert.equal(row.originalSha256, baseline.files[row.path]);
}
assert.equal(release.files.filter(row => row.originalFile).length, 1, 'only generic chapter route is edited');
assert.equal(release.files.find(row => row.originalFile).path, 'src/pages/[cert]/[exam]/[subject]/[slug].astro');
const articles = {};
for (const file of await walk('dist')) if (file.endsWith('/index.html')) {
  const html = await readFile(file, 'utf8');
  const article = html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
  if (article) {
    articles[file] = hash(article);
    if (release.articles[file]) {
      assert.equal((article.match(/data-fire-practice-entry/g) || []).length, 1);
      assert.equal(hash(article.replace(/<section\b[^>]*data-fire-practice-entry[\s\S]*?<\/section>/, '')), baseline.articles[file]);
      assert(html.includes('이 챕터 문제 풀기') && html.includes('전체 모의고사 풀기'));
      assert(!html.includes('기출 출제 이력'));
    }
  }
}
assert.deepEqual(articles, { ...baseline.articles, ...Object.fromEntries(Object.entries(release.articles).map(([file, row]) => [file, row.sha256])) });
assert.equal(Object.keys(release.articles).length, 74);
const practice = await readFile('dist/fire-safety-manager-level2/practice/index.html', 'utf8');
const payload = JSON.parse(practice.match(/<script[^>]*data-fire-payload[^>]*>([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(payload.questions, [], 'draft questions must not be serialized');
assert.equal(payload.chapters.length, 74);
assert.equal((practice.match(/<h1\b/g) || []).length, 1);
assert(!practice.includes('rawSourceText') && !practice.includes('FSM2-CORE-'));
assert(practice.includes('noindex, follow'));
console.log(`[Fire practice] ${inventory.length} native sources/assets, 74 entry sections only; all 524 original lessons and canonical questions preserved; drafts excluded`);
