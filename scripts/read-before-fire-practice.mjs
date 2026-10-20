// Project only this exact feature addition for archived checks. Native current checks
// protect the complete inventory; unknown files and changed bytes are never hidden.
import assert from 'node:assert/strict';
import { readFile as nativeRead, readdir as nativeReaddir } from './read-before-fire-persona-corrections.mjs';
import { createHash } from 'node:crypto';
import path from 'node:path';
const audit = 'docs/audits/2026-10-20-fire-level2-practice';
const release = JSON.parse(await nativeRead(audit + '/release.json', 'utf8'));
const baseline = JSON.parse(await nativeRead(audit + '/baseline.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function readFile(file, encoding) {
  const key = path.normalize(String(file));
  let bytes = await nativeRead(file);
  const row = release.files.find(row => row.path === key);
  if (row) {
    assert.equal(hash(bytes), row.sha256, key + ': exact practice feature bytes');
    if (row.originalFile) {
      bytes = await nativeRead(row.originalFile);
      assert.equal(hash(bytes), row.originalSha256, key + ': exact pre-practice source');
    }
  }
  const article = release.articles[key];
  if (article) {
    const html = bytes.toString('utf8');
    const current = html.match(/<article\b[^>]*>[\s\S]*?<\/article>/)?.[0];
    assert.equal(hash(current), article.sha256, key + ': exact practice article');
    const before = current.replace(/<section\b[^>]*data-fire-practice-entry[\s\S]*?<\/section>/, '');
    assert.equal(hash(before), article.originalSha256, key + ': original lesson preserved');
    bytes = Buffer.from(html.replace(current, before));
    if (article.htmlShell) {
      // Seventeen archived textbook checks fingerprint the full HTML document.
      // Reuse their verified pre-correction shell, keeping the current corrected
      // lesson, and prove that this reproduces the exact pre-feature document.
      const shell = await nativeRead(article.htmlShell);
      assert.equal(hash(shell), article.htmlShellSha256, key + ': original HTML shell');
      bytes = Buffer.from(shell.toString('utf8').replace(/<article\b[^>]*>[\s\S]*?<\/article>/, () => before));
      assert.equal(hash(bytes), article.originalHtmlSha256, key + ': exact pre-feature HTML');
    }
  }
  return encoding ? bytes.toString(encoding) : bytes;
}
export async function readdir(dir, options) {
  const key = path.normalize(String(dir));
  let entries = await nativeReaddir(dir, options);
  for (const entry of [...entries]) {
    const name = typeof entry === 'string' ? entry : entry.name;
    const full = path.join(key, name);
    const additions = release.files.filter(row => !row.originalFile && (row.path === full || row.path.startsWith(full + '/')));
    if (!additions.length || Object.keys(baseline.files).some(file => file === full || file.startsWith(full + '/'))) continue;
    const walk = async file => additions.some(row => row.path === file) ? [file]
      : (await Promise.all((await nativeReaddir(file, { withFileTypes: true })).map(child => child.isDirectory() ? walk(path.join(file, child.name)) : [path.join(file, child.name)]))).flat();
    assert.deepEqual((await walk(full)).sort(), additions.map(row => row.path).sort(), 'only exact practice additions');
    for (const row of additions) assert.equal(hash(await nativeRead(row.path)), row.sha256, row.path + ': exact added practice file');
    entries = entries.filter(item => (typeof item === 'string' ? item : item.name) !== name);
  }
  return entries;
}
