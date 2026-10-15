import assert from 'node:assert/strict';
import { readFile as actualReadFile, readdir as actualReaddir } from './read-before-fire-safety-level2-bulk.mjs';
import { createHash } from 'node:crypto';
import path from 'node:path';

// Exact historical projection; check-fire-safety-level2-launch validates the
// actual complete inventory, including every added asset and published route.
const audit = 'docs/audits/2026-10-14-fire-safety-level2-launch';
const release = JSON.parse(await actualReadFile(`${audit}/release.json`, 'utf8'));
const baseline = JSON.parse(await actualReadFile(`${audit}/baseline.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function readFile(file, encoding) {
  let bytes = await actualReadFile(file);
  const row = release.sourceChanges.find(row => row.path === path.normalize(String(file)) && row.originalFile);
  if (row) {
    assert.equal(hash(bytes), row.sha256, `${row.path}: exact approved fire launch bytes`);
    bytes = await actualReadFile(row.originalFile);
    assert.equal(hash(bytes), row.originalSha256, `${row.path}: historical original preserved`);
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
export async function readdir(dir, options) {
  let entries = await actualReaddir(dir, options);
  const key = path.normalize(String(dir));
  for (const entry of [...entries]) {
    const name = typeof entry === 'string' ? entry : entry.name;
    const full = path.join(key, name);
    const rows = release.sourceChanges.filter(row => !row.originalFile && (row.path === full || row.path.startsWith(full + '/')));
    // Never hide any pre-existing directory or an unreviewed extra file.
    if (rows.length && !Object.keys(baseline.files).some(file => file === full || file.startsWith(full + '/'))) {
      async function walk(actual) {
        if (rows.some(row => row.path === actual)) return [actual];
        const children = await actualReaddir(actual, { withFileTypes: true });
        return (await Promise.all(children.map(child => child.isDirectory() ? walk(path.join(actual, child.name)) : [path.join(actual, child.name)]))).flat();
      }
      const actualFiles = await walk(full);
      assert.deepEqual(actualFiles.sort(), rows.map(row => row.path).sort(), 'only approved added paths');
      for (const row of rows) assert.equal(hash(await actualReadFile(row.path)), row.sha256, `${row.path}: added file hash`);
      entries = entries.filter(e => (typeof e === 'string' ? e : e.name) !== name);
    }
    if (key === 'dist' && name === release.certId) {
      for (const [file, expected] of Object.entries(release.newArticles)) {
        const article = (await actualReadFile(file, 'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
        assert.equal(hash(article), expected, 'exact new fire article');
      }
      entries = entries.filter(e => (typeof e === 'string' ? e : e.name) !== name);
    }
  }
  return entries;
}
