// Restore only the two fingerprinted copy-edit files for historical audits.
import fs, {beforeFireOriginalPlan} from './read-before-fire-original-plan.mjs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
export const preactionCopyReview=JSON.parse(gunzipSync(fs.readFileSync('docs/audits/2026-10-28-fire-preaction-copy/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
export function beforeFirePreactionCopy(file,bytes){
 bytes=beforeFireOriginalPlan(file,bytes);
 const key=path.normalize(path.isAbsolute(String(file))?path.relative(process.cwd(),String(file)):String(file));
 const row=preactionCopyReview.changes[key];
 if(!row||hash(bytes)!==row.sha256)return bytes;
 const before=Buffer.from(row.before,'base64');
 assert.equal(hash(before),row.beforeSHA256,'exact copy-edit predecessor');return before;
}
export default {...fs,readFileSync(file,options){
 const data=beforeFirePreactionCopy(file,fs.readFileSync(file));
 const encoding=typeof options==='string'?options:options?.encoding;
 return encoding?data.toString(encoding):data;
}};
