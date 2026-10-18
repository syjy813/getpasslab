import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const helper = 'scripts/read-before-fire-safety-level2-launch.mjs';
const audit = 'docs/audits/2026-10-14-fire-safety-level2-launch';
const release = JSON.parse(await readFile(audit+'/release.json','utf8'));
const correctionAudit='docs/audits/2026-10-18-fire-level2-textbook-corrections';
const corrections=JSON.parse(await readFile(correctionAudit+'/release.json','utf8'));
const correctionFiles=['scripts/read-before-fire-textbook-corrections.mjs',correctionAudit+'/release.json',...corrections.files.flatMap(r=>[r.path,r.originalFile])];
const root = await mkdtemp(path.join(tmpdir(),'getpasslab-fire-history-'));
const run = code => spawnSync(process.execPath,['--input-type=module','-e',`import assert from 'node:assert/strict';import {readFile,readdir} from './${helper}';${code}`],{cwd:root,encoding:'utf8'});
async function put(file,bytes){await mkdir(path.dirname(path.join(root,file)),{recursive:true});await writeFile(path.join(root,file),bytes)}
try {
 for(const f of correctionFiles){await mkdir(path.dirname(path.join(root,f)),{recursive:true});await copyFile(f,path.join(root,f))}

  const bulkAudit='docs/audits/2026-10-14-fire-safety-level2-bulk';
  const bulk=JSON.parse(await readFile(bulkAudit+'/release.json','utf8'));
  const files=['scripts/read-before-fire-safety-level2-bulk.mjs',bulkAudit+'/release.json',bulkAudit+'/baseline.json',...bulk.sourceChanges.flatMap(row=>[row.path,...(row.originalFile?[row.originalFile]:[])]),helper,audit+'/release.json',audit+'/baseline.json',...release.sourceChanges.flatMap(row=>[row.path,...(row.originalFile?[row.originalFile]:[])])];
  for(const file of files){await mkdir(path.dirname(path.join(root,file)),{recursive:true});await copyFile(file,path.join(root,file))}
  const source=release.sourceChanges.find(row=>row.originalFile);
  const read=`assert.equal(await readFile('${source.path}','utf8'),${JSON.stringify(await readFile(source.originalFile,'utf8'))});`;
  assert.equal(run(read).status,0,'approved source reverses to exact prior bytes');
  await put(source.path,(await readFile(source.path,'utf8'))+'\n');assert.notEqual(run(read).status,0,'unapproved source edit rejected');await put(source.path,await readFile(source.path));
  await put(source.originalFile,'changed original');assert.notEqual(run(read).status,0,'tampered historical original rejected');await put(source.originalFile,await readFile(source.originalFile));
  const image=release.sourceChanges.find(row=>row.path.endsWith('.png'));
  const scan=`assert.deepEqual(await readdir('public/images'),[]);`;
  assert.equal(run(scan).status,0,'approved image directory omitted only after exact byte verification');
  await put(image.path,Buffer.concat([await readFile(image.path),Buffer.from('X')]));assert.notEqual(run(scan).status,0,'tampered image rejected');await put(image.path,await readFile(image.path));
  const extra=path.dirname(image.path)+'/unexpected.svg';await put(extra,'<svg/>');assert.notEqual(run(scan).status,0,'unreviewed nested addition rejected');await rm(path.join(root,extra));
  await rm(path.join(root,image.path));assert.notEqual(run(scan).status,0,'deleted image rejected');
  console.log('[Fire launch history guard] 7 isolated positive/negative checks PASS');
} finally {await rm(root,{recursive:true,force:true})}
