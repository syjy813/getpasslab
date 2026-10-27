// Mutation checks run in an isolated fixture, never in the product checkout.
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const correctionAudit='docs/audits/2026-10-18-fire-level2-textbook-corrections';
const corrections=JSON.parse(await readFile(correctionAudit+'/release.json','utf8'));
const practiceAudit='docs/audits/2026-10-20-fire-level2-practice';
const practiceRelease=JSON.parse(await readFile(practiceAudit+'/release.json','utf8'));
const personaAudit='docs/audits/2026-10-20-fire-persona-corrections';
const personaRelease=JSON.parse(await readFile(personaAudit+'/release.json','utf8'));
const standardFiles=['scripts/read-before-mobile-chapter-top-ad.mjs','docs/audits/2026-10-27-mobile-chapter-top-ad/review.json.gz','scripts/read-before-mobile-top-ad.mjs','docs/audits/2026-10-27-mobile-top-ad/review.json.gz','scripts/read-before-gnb-toc-height.mjs','docs/audits/2026-10-26-gnb-toc-height/review.json.gz','scripts/read-before-gnb-chapter-toc.mjs','docs/audits/2026-10-26-gnb-chapter-toc/review.json.gz','scripts/read-before-mobile-learning-ux.mjs','docs/audits/2026-10-26-mobile-learning-ux/review.json.gz','scripts/read-before-global-chapter-readability.mjs','docs/audits/2026-10-26-global-chapter-readability/review.json','scripts/fire-mock-authoring/standardization.mjs',...['revision.json','review.json','assertions.json','before-rows.json','replacements.json'].map(n=>'docs/releases/2026-10-21-fire-standard-questions/'+n)];
const personaFiles=['docs/audits/2026-10-22-all-chapter-hierarchy/review.json',...standardFiles,'scripts/read-before-fire-persona-corrections.mjs',personaAudit+'/release.json',...personaRelease.files.flatMap(r=>[r.path,...(r.originalFile?[r.originalFile]:[])])];
const practiceFiles=[...personaFiles,'scripts/read-before-fire-practice.mjs',practiceAudit+'/release.json',practiceAudit+'/baseline.json',...practiceRelease.files.flatMap(r=>[r.path,...(r.originalFile?[r.originalFile]:[])])];
const correctionFiles=[...practiceFiles,'scripts/read-before-fire-textbook-corrections.mjs',correctionAudit+'/release.json',...corrections.files.flatMap(r=>[r.path,r.originalFile])];
const root=await mkdtemp(path.join(tmpdir(),'getpasslab-practice-guard-'));
const layout='src/layouts/ChapterLayout.astro',endpoint='src/pages/practice-data/[cert].json.ts';
const audit='docs/audits/2026-10-10-hanging-scaffold-wire-rope';
const helper='scripts/read-before-hanging-scaffold-wire-rope.mjs';
const component='src/components/InstantQuestionPractice.astro';
const pilot='dist/industrial-safety/written/safety-management/accident-prevention-principles/index.html';
const compatibility=JSON.parse(await readFile(audit+'/compatibility.json','utf8'));
const pilotOriginal=compatibility.articleChanges.find(row=>row.path===pilot).originalFile;
async function put(file,text){await mkdir(path.dirname(path.join(root,file)),{recursive:true});await writeFile(path.join(root,file),text)}
const run=code=>spawnSync(process.execPath,['--input-type=module','-e',`import assert from 'node:assert/strict';import {readFile,readdir,beforePracticeEndpointInventory} from './${helper}';const inventory=async()=>beforePracticeEndpointInventory((await readdir('src/pages/practice-data')).map(f=>'src/pages/practice-data/'+f));${code}`],{cwd:root,encoding:'utf8'});
try{
 for(const f of correctionFiles){await mkdir(path.dirname(path.join(root,f)),{recursive:true});await copyFile(f,path.join(root,f))}

 for(const f of ['scripts/read-before-fire-safety-level2-bulk.mjs','docs/audits/2026-10-14-fire-safety-level2-bulk/release.json','docs/audits/2026-10-14-fire-safety-level2-bulk/baseline.json',helper,'scripts/read-before-fire-safety-level2-launch.mjs','docs/audits/2026-10-14-fire-safety-level2-launch/release.json','docs/audits/2026-10-14-fire-safety-level2-launch/baseline.json',layout,endpoint,component,pilot,pilotOriginal,audit+'/review.json',audit+'/compatibility.json']){await mkdir(path.dirname(path.join(root,f)),{recursive:true});await copyFile(f,path.join(root,f))}
 const original=await readFile(layout,'utf8'),endpointBytes=await readFile(endpoint,'utf8');
 const readLayout=`await readFile('${layout}','utf8');`;
 assert.equal(run(readLayout).status,0,'approved current layout reverses to historical hash');
 await put(layout,original+'\n');assert.notEqual(run(readLayout).status,0,'unreviewed layout byte rejected');await put(layout,original);
 const scan=`assert.deepEqual(await inventory(),[]);`;
 assert.equal(run(scan).status,0,'exact approved endpoint omitted for archived inventory');
 await put(endpoint,endpointBytes+'\n');assert.notEqual(run(scan).status,0,'unreviewed endpoint byte rejected');await put(endpoint,endpointBytes);
 await put('src/pages/practice-data/unexpected.ts','export {};');
 assert.equal(run(`assert.deepEqual(await inventory(),['src/pages/practice-data/unexpected.ts']);`).status,0,'unreviewed additions remain visible to inventory guard');
 await rm(path.join(root,endpoint));assert.notEqual(run(scan).status,0,'missing endpoint rejected');
 const componentBytes=await readFile(component,'utf8');
 const scanComponents=`assert.deepEqual(await readdir('src/components'),[]);`;
 assert.equal(run(scanComponents).status,0,'exact authorized UI component omitted for archived inventory');
 await put(component,componentBytes+'\n');assert.notEqual(run(scanComponents).status,0,'unreviewed UI component byte rejected');await put(component,componentBytes);
 await rm(path.join(root,component));assert.notEqual(run(scanComponents).status,0,'missing UI component rejected');
 const pilotBytes=await readFile(pilot,'utf8');
 const readPilot=`await readFile('${pilot}','utf8');`;
 assert.equal(run(readPilot).status,0,'exact UI bundle filename change preserves archived article');
 await put(pilot,pilotBytes.replace('</article>','<!-- unexpected content mutation --></article>'));assert.notEqual(run(readPilot).status,0,'unreviewed article change rejected');await put(pilot,pilotBytes);
 await rm(path.join(root,pilot));assert.notEqual(run(readPilot).status,0,'missing pilot article rejected');
 console.log('[Historical practice guard] 12 isolated positive/negative mutation checks PASS');
}finally{await rm(root,{recursive:true,force:true})}
