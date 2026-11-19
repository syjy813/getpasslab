import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const discoveryUI = JSON.parse(fs.readFileSync('docs/audits/2026-11-19-facility-discovery-ui/manifest.json'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

// Historical publication guards still compare their exact original bytes.
// Reconstruct only these pinned presentation changes, not later edits.
export function beforeDiscoveryUI(file, bytes) {
  const row = discoveryUI.files[file];
  if (!row) return bytes;
  assert.equal(hash(bytes), row.afterSha256, `${file}: reviewed discovery UI`);
  if (!row.before) return bytes;
  const before = Buffer.from(row.before, 'base64');
  assert.equal(hash(before), row.beforeSha256, `${file}: exact predecessor`);
  return before;
}
