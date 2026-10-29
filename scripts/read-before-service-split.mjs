// Exact release projection for archived checks; live bytes have a separate native guard.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
export const serviceSplitReview = JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-29-service-split/review.json.gz')));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const key = file => path.normalize(path.isAbsolute(String(file)) ? path.relative(process.cwd(), String(file)) : String(file));
export function beforeServiceSplit(file, bytes) {
  const row = serviceSplitReview.changes[key(file)];
  if (!row || hash(bytes) !== row.sha256) return bytes;
  let before = bytes.toString();
  if (row.kind === 'source') before = row.before;
  if (row.kind === 'html') for (const insert of serviceSplitReview.htmlInserts) before = before.split(insert).join('');
  if (row.kind === 'sitemap') before = before.replace(/<url>.*?<\/url>/g, url => /\/(facility-management|certifications)\//.test(url) ? '' : url);
  assert.equal(hash(before), row.beforeSHA256, `${file}: exact pre-service-split bytes`);
  return Buffer.from(before);
}
export function isServiceSplitAddition(file) {
  const name = key(file);
  const rows = Object.entries(serviceSplitReview.additions).filter(([f]) => f === name || f.startsWith(`${name}/`));
  if (!rows.length || Object.keys(serviceSplitReview.current).some(f => (f === name || f.startsWith(`${name}/`)) && !serviceSplitReview.additions[f])) return false;
  const walk = f => fs.statSync(f).isDirectory() ? fs.readdirSync(f).flatMap(e => walk(path.join(f, e))) : [key(f)];
  const actual = walk(file).sort();
  assert.deepEqual(actual, rows.map(([f]) => f).sort(), `${name}: no unknown additions`);
  for (const [f, sha] of rows) assert.equal(hash(fs.readFileSync(f)), sha, `${f}: exact service addition`);
  return true;
}
const encode = (bytes, options) => { const encoding = typeof options === 'string' ? options : options?.encoding; return encoding ? bytes.toString(encoding) : bytes; };
const historicalFS = { ...fs,
  readFileSync(file, options) { return encode(beforeServiceSplit(file, fs.readFileSync(file)), options); },
  readdirSync(dir, options) { return fs.readdirSync(dir, options).filter(entry => !isServiceSplitAddition(path.join(String(dir), typeof entry === 'string' ? entry : entry.name))); },
};

export async function readdir(dir, options) { return historicalFS.readdirSync(dir, options); }

export default historicalFS;
