// Mutation checks run in an isolated fixture, never in the product checkout.
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const root=await mkdtemp(path.join(tmpdir(),'getpasslab-practice-guard-'));
const layout='src/layouts/ChapterLayout.astro',endpoint='src/pages/practice-data/[cert].json.ts';
const audit='docs/audits/2026-10-10-hanging-scaffold-wire-rope';
const helper='scripts/read-before-hanging-scaffold-wire-rope.mjs';
async function put(file,text){await mkdir(path.dirname(path.join(root,file)),{recursive:true});await writeFile(path.join(root,file),text)}
const run=code=>spawnSync(process.execPath,['--input-type=module','-e',`import assert from 'node:assert/strict';import {readFile,readdir} from './${helper}';${code}`],{cwd:root,encoding:'utf8'});
try{
 for(const f of [helper,layout,endpoint,audit+'/review.json',audit+'/compatibility.json']){await mkdir(path.dirname(path.join(root,f)),{recursive:true});await copyFile(f,path.join(root,f))}
 const original=await readFile(layout,'utf8'),endpointBytes=await readFile(endpoint,'utf8');
 const readLayout=`await readFile('${layout}','utf8');`;
 assert.equal(run(readLayout).status,0,'approved current layout reverses to historical hash');
 await put(layout,original+'\n');assert.notEqual(run(readLayout).status,0,'unreviewed layout byte rejected');await put(layout,original);
 const scan=`assert.deepEqual(await readdir('src/pages/practice-data'),[]);`;
 assert.equal(run(scan).status,0,'exact approved endpoint omitted for archived inventory');
 await put(endpoint,endpointBytes+'\n');assert.notEqual(run(scan).status,0,'unreviewed endpoint byte rejected');await put(endpoint,endpointBytes);
 await put('src/pages/practice-data/unexpected.ts','export {};');
 assert.equal(run(`assert.deepEqual(await readdir('src/pages/practice-data'),['unexpected.ts']);`).status,0,'unreviewed additions remain visible to inventory guard');
 await rm(path.join(root,endpoint));assert.notEqual(run(scan).status,0,'missing endpoint rejected');
 console.log('[Historical practice guard] 6 isolated positive/negative mutation checks PASS');
}finally{await rm(root,{recursive:true,force:true})}
