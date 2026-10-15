import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';import {spawnSync} from 'node:child_process';
const helper='scripts/read-before-fire-safety-level2-bulk.mjs',audit='docs/audits/2026-10-14-fire-safety-level2-bulk';const release=JSON.parse(await readFile(audit+'/release.json','utf8'));
const root=await mkdtemp(path.join(tmpdir(),'getpasslab-fire-bulk-guard-'));
const put=async(f,b)=>{await mkdir(path.dirname(path.join(root,f)),{recursive:true});await writeFile(path.join(root,f),b)};
const run=code=>spawnSync(process.execPath,['--input-type=module','-e',`import {readFile,readdir} from './${helper}';${code}`],{cwd:root,encoding:'utf8'});
try{
 for(const file of [helper,audit+'/release.json',audit+'/baseline.json',...release.sourceChanges.flatMap(r=>[r.path,...(r.originalFile?[r.originalFile]:[])]),...release.articleChanges.flatMap(r=>[r.path,r.originalFile])]){await mkdir(path.dirname(path.join(root,file)),{recursive:true});await copyFile(file,path.join(root,file))}
 const chapter=release.sourceChanges.find(r=>r.path.endsWith('.md')&&!r.originalFile);const scan=`await readdir('${path.dirname(chapter.path)}');`;const read=`await readFile('${chapter.path}');`;
 assert.equal(run(scan).status,0,'approved added chapters hidden with exact checks');assert.equal(run(read).status,0,'approved chapter bytes readable');
 const bytes=await readFile(chapter.path);await put(chapter.path,Buffer.concat([bytes,Buffer.from('mutation')]));assert.notEqual(run(read).status,0,'changed chapter rejected');assert.notEqual(run(scan).status,0,'changed addition rejected during directory projection');await put(chapter.path,bytes);
 const source=release.sourceChanges.find(r=>r.originalFile);const srcRead=`await readFile('${source.path}');`;assert.equal(run(srcRead).status,0,'approved source projection');await put(source.path,Buffer.concat([await readFile(source.path),Buffer.from('X')]));assert.notEqual(run(srcRead).status,0,'unreviewed source change rejected');await put(source.path,await readFile(source.path));await put(source.originalFile,'changed');assert.notEqual(run(srcRead).status,0,'historical original tamper rejected');
 const row=release.articleChanges[0];const artRead=`await readFile('${row.path}');`;assert.equal(run(artRead).status,0,'related links project original lesson');await put(row.path,(await readFile(row.path,'utf8')).replace('</article>','unexpected</article>'));assert.notEqual(run(artRead).status,0,'unreviewed article change rejected');
 const extra=path.dirname(chapter.path)+'/unexpected.md';await put(extra,'unexpected');assert.equal(run(`if(!(await readdir('${path.dirname(chapter.path)}')).includes('unexpected.md'))throw Error('hidden');`).status,0,'unknown additions remain visible');
 await rm(path.join(root,chapter.path));assert.notEqual(run(read).status,0,'deleted chapter rejected');
 console.log('[Fire bulk history guard] 11 isolated positive/negative mutation checks PASS');
}finally{await rm(root,{recursive:true,force:true})}
