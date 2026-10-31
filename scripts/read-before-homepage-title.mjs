// Normalize only the approved 2026-10-31 homepage title edit for historical
// SHA-256 regression snapshots. Native output retains the new title.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import path from 'node:path';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const oldTitle = 'GetPassLab — 자격증 핵심요약과 학습 그림';
const newTitle = 'GetPassLab 시설의 모든것';
const revisions = {
  'src/pages/index.astro': {
    current: '37438da68407eb0f7bf08d7746f17c7158d8a501b1347fde9347030a2265be9b',
    before: 'ca4ccc0cd7d50d57249c248ec771d98cc15cbf65f2823c328537c58476059d93',
  },
  'dist/index.html': {
    current: 'a333b84342f4655370fd24f0c35e03c5dfb63a67c8cd252c34cbad3cdb9afaac',
    before: '493984adcfe0dad80de334fa4c29359a669bcbf28c025dd91aa0d518543a5a78',
  },
};

export function beforeHomepageTitle(file, bytes) {
  const key = path.normalize(path.isAbsolute(String(file))
    ? path.relative(process.cwd(), String(file)) : String(file)).replaceAll('\\', '/');
  const row = revisions[key];
  if (!row) return bytes;
  const actual = hash(bytes);
  if (actual === row.before) return bytes;
  if (actual !== row.current) {
    // An unknown edit containing the new title must not be silently normalized.
    assert(!bytes.includes(Buffer.from(newTitle)), key + ': unapproved homepage title mutation');
    return bytes;
  }
  const source = bytes.toString('utf8');
  assert(source.includes(newTitle), key + ': expected new title');
  const restored = Buffer.from(source.replaceAll(newTitle, oldTitle));
  assert.equal(hash(restored), row.before, key + ': exact approved title-only delta');
  return restored;
}

export function assertCurrentHomepageTitle(file, bytes) {
  const row = revisions[file];
  assert(row, file + ': expected homepage scope');
  assert.equal(hash(bytes), row.current, file + ': complete approved native file');
  assert(bytes.toString('utf8').includes(newTitle), file + ': new title visible');
  assert(!bytes.toString('utf8').includes(oldTitle), file + ': obsolete title absent');
}
