import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const root = 'docs/drafts/facility/hobyeongbaekma';
const article = 'src/content/facility/hobyeongbaekma.md';
const assets = 'public/images/facility-series/hobyeongbaekma-00';
const rows = JSON.parse(fs.readFileSync(root + '/image-manifest.json')).images;
const sha = b => createHash('sha256').update(b).digest('hex');
const source = fs.readFileSync(root + '/episode00.md');
assert.match(source.toString(), /^status: draft$/m);
for (const row of rows) assert.equal(sha(fs.readFileSync(root + '/' + row.file)), row.sha256);
const mode = process.argv[2];
if (fs.existsSync(article) && /^status: published$/m.test(fs.readFileSync(article, 'utf8'))) {
  const { assertEpisode00Release } = await import('./read-hobyeongbaekma-publication.mjs');
  assertEpisode00Release();
  console.log('Episode 00 is published; preserve committed article and assets');
  process.exit(0);
}
if (mode === 'stage') {
  assert(!fs.existsSync(article), 'Never overwrite an existing article');
  assert(!fs.existsSync(assets), 'Never overwrite existing assets');
  fs.writeFileSync(article, source, { flag: 'wx' });
  fs.mkdirSync(assets, { recursive: true });
  for (const row of rows) fs.copyFileSync(root + '/' + row.file, assets + '/' + row.file.split('/').at(-1));
} else if (mode === 'clean') {
  if (fs.existsSync(article)) {
    assert.equal(sha(fs.readFileSync(article)), sha(source), 'Refuse to remove a modified article');
    fs.unlinkSync(article);
  }
  if (fs.existsSync(assets)) {
    assert.deepEqual(fs.readdirSync(assets).sort(), rows.map(r => r.file.split('/').at(-1)).sort());
    for (const row of rows) assert.equal(sha(fs.readFileSync(assets + '/' + row.file.split('/').at(-1))), row.sha256);
    fs.rmSync(assets, { recursive: true });
  }
} else throw Error('Use stage or clean');
console.log(`Hobyeongbaekma review ${mode}: draft + ${rows.length} images; production source is unchanged in Git`);
