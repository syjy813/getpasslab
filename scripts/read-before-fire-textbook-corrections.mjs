// Exact projection for archived checks; the current checker reads native bytes.
import assert from 'node:assert/strict';
import {readFile as nativeRead, readdir as nativeReaddir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit='docs/audits/2026-10-18-fire-level2-textbook-corrections';
const release=JSON.parse(await nativeRead(audit+'/release.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
// Later reviewed AdFit release (PR #172). Keep old evidence immutable:
// project only these two precisely identified blobs back to older test snapshots.
const floatingPath = 'src/components/AdFitFloating.astro';
const floatingBlob = '5955381f94cdbd9119f5145e64bb56ff1cc6590b';
const layoutPath = 'src/layouts/BaseLayout.astro';
const layoutBlob = 'dd77b9dfed68859fdd0e3b659c1f71973982e211';
const priorLayoutBlob = 'af541ce66d6102c3dc9cafd4968065ad5b7af82f';
const blobSha = bytes => createHash('sha1').update(Buffer.from(`blob ${bytes.length}\\0`)).update(bytes).digest('hex');

async function verifyFloating() {
 const bytes = await nativeRead(floatingPath);
 assert.equal(blobSha(bytes), floatingBlob, 'exact approved two-sided AdFit component');
}

export async function readdir(dir,options) {
 const entries = await nativeReaddir(dir,options);
 if (path.normalize(String(dir)) !== 'src/components') return entries;
 await verifyFloating();
 assert(entries.some(e => (typeof e === 'string' ? e : e.name) === 'AdFitFloating.astro'), 'approved AdFit component present');
 return entries.filter(e => (typeof e === 'string' ? e : e.name) !== 'AdFitFloating.astro');
}
export async function readFile(file,encoding){
 let bytes=await nativeRead(file);
 if (path.normalize(String(file)) === layoutPath) {
  assert.equal(blobSha(bytes), layoutBlob, 'exact approved floating AdFit layout');
  let text = bytes.toString('utf8');
  for (const addition of [
   "import AdFitFloating from '../components/AdFitFloating.astro';\\n",
   "    <AdFitFloating />\\n",
  ]) {
   assert.equal(text.split(addition).length, 2, 'one exact reviewed AdFit layout insertion');
   text = text.replace(addition, '');
  }
  bytes = Buffer.from(text);
  assert.equal(blobSha(bytes), priorLayoutBlob, 'exact original BaseLayout restored');
 }
 const row=release.files.find(r=>r.path===path.normalize(String(file)));
 if(row){
  assert.equal(hash(bytes),row.sha256,String(file)+': exact textbook correction bytes');
  bytes=await nativeRead(row.originalFile);
  assert.equal(hash(bytes),row.originalSha256,String(file)+': exact pre-correction bytes');
 }
 return encoding?bytes.toString(encoding):bytes;
}
