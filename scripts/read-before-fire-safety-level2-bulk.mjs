import assert from 'node:assert/strict';
import {readFile as nativeRead, readdir as nativeReaddir} from './read-before-fire-textbook-corrections.mjs';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit='docs/audits/2026-10-14-fire-safety-level2-bulk';
const release=JSON.parse(await nativeRead(audit+'/release.json','utf8'));
const baseline=JSON.parse(await nativeRead(audit+'/baseline.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function readFile(file,encoding){
 let bytes=await nativeRead(file);const key=path.normalize(String(file));
 const row=release.sourceChanges.find(r=>r.path===key);
 const articleRow=release.articleChanges.find(r=>r.path===key);
 if(articleRow){assert.equal(hash(bytes.toString('utf8').match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]),articleRow.sha256,key+': exact reviewed related-links addition');bytes=await nativeRead(articleRow.originalFile);assert.equal(hash(bytes.toString('utf8').match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1]),articleRow.originalSha256,key+': exact original article')}
 if(row){assert.equal(hash(bytes),row.sha256,key+': exact reviewed bulk bytes');if(row.originalFile){bytes=await nativeRead(row.originalFile);assert.equal(hash(bytes),row.originalSha256,key+': exact pre-bulk original')}}
 return encoding?bytes.toString(encoding):bytes;
}
export async function readdir(dir,options){
 const key=path.normalize(String(dir));let entries=await nativeReaddir(dir,options);
 for(const entry of [...entries]){
  const name=typeof entry==='string'?entry:entry.name;const full=path.join(key,name);
  const rows=release.sourceChanges.filter(r=>!r.originalFile&&(r.path===full||r.path.startsWith(full+'/')));
  if(rows.length&&!Object.keys(baseline.files).some(f=>f===full||f.startsWith(full+'/'))){
   const walk=async p=>(await Promise.all((await nativeReaddir(p,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]))).flat();
   const files=rows.some(r=>r.path===full)?[full]:await walk(full);
   assert.deepEqual(files.sort(),rows.map(r=>r.path).sort(),'only exact approved bulk additions');
   for(const row of rows)assert.equal(hash(await nativeRead(row.path)),row.sha256,row.path+': approved addition');
   entries=entries.filter(e=>(typeof e==='string'?e:e.name)!==name);
  }
  const articles=Object.entries(release.newArticles).filter(([f])=>f===full||f.startsWith(full+'/'));
  if(articles.length&&!Object.keys(baseline.articles).some(f=>f===full||f.startsWith(full+'/'))){
   for(const [f,expected]of articles){const text=await nativeRead(f,'utf8');const article=text.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];assert.equal(hash(article),expected,f+': approved bulk article')}
   entries=entries.filter(e=>(typeof e==='string'?e:e.name)!==name);
  }
 }
 return entries;
}
