import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {parse} from 'parse5';
import {beforeFireFullPanels,isFireFullPanelAddition} from './read-before-fire-full-panels.mjs';
const audit='docs/audits/2026-10-27-fire-full-panels';
const review=JSON.parse(gunzipSync(fs.readFileSync(audit+'/review.json.gz')));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const inventory=[...walk('src'),...walk('public'),...walk('dist').filter(p=>p.endsWith('.html'))].sort();
assert.deepEqual(inventory,Object.keys(review.current).sort(),'complete current source/asset/HTML inventory');
for(const file of inventory)assert.equal(hash(fs.readFileSync(file)),review.current[file],file+': current native bytes');
const affected=['pump-control-panels-states','pump-manual-auto-reading','receiver-backup-power-test','receiver-circuit-continuity-test'];
const chapterDir='src/content/chapters/fire-safety-manager-level2/fire-safety-practice/';
assert.deepEqual(Object.keys(review.changes).filter(p=>p.startsWith('src/')).sort(),affected.map(s=>chapterDir+s+'.md').sort(),'only four teaching bodies revised');
for(const [file,row]of Object.entries(review.changes)){
 const bytes=fs.readFileSync(file);
 assert.equal(hash(beforeFireFullPanels(file,bytes)),row.beforeSHA256,file+': exact previous document');
 assert.notEqual(hash(beforeFireFullPanels(file,Buffer.concat([bytes,Buffer.from(' unreviewed')]))),row.beforeSHA256,file+': unreviewed bytes remain visible');
 if(file.startsWith(chapterDir)){
  const before=beforeFireFullPanels(file,bytes).toString(),now=bytes.toString();
  for(const key of ['chapter_id','slug','cert_id','exam','subject_id','order','practiceChapter'])
   assert.equal(now.match(new RegExp('^'+key+': .*$','m'))?.[0],before.match(new RegExp('^'+key+': .*$','m'))?.[0],file+': stable '+key);
 }
}
assert.equal(Object.keys(review.additions).length,4,'three images and one scoped stylesheet');
for(const [file,sha]of Object.entries(review.additions)){
 assert(isFireFullPanelAddition(file));assert.equal(hash(fs.readFileSync(file)),sha);
}
for(const [file,sha]of Object.entries(review.questions))assert.equal(hash(fs.readFileSync(file)),sha,file+': question text, answers and approval unchanged');
const nodes=html=>{const out=[];const visit=n=>{out.push(n);for(const c of n.childNodes||[])visit(c)};visit(parse(html));return out;};
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>(n.childNodes||[]).map(c=>c.nodeName==='#text'?c.value:text(c)).join('');
const briefs=JSON.parse(fs.readFileSync(audit+'/figure-briefs.json')).chapters;
for(const row of briefs){
 const source=fs.readFileSync(chapterDir+row.slug+'.md','utf8');
 const html=fs.readFileSync('dist/fire-safety-manager-level2/written/fire-safety-practice/'+row.slug+'/index.html','utf8');
 const ns=nodes(html);assert.equal(ns.filter(n=>n.tagName==='h1').length,1);
 const detail=ns.filter(n=>n.tagName==='div'&&attr(n,'class')?.split(' ').includes('fire-panel-detail'));
 assert.equal(detail.length,row.details.length);
 const imgs=ns.filter(n=>n.tagName==='img'&&attr(n,'src')===row.src);
 assert.equal(imgs.length,row.details.length+1,'same approved image in overview and all enlargements');
 for(const img of imgs)for(const key of ['alt','width','height'])assert(attr(img,key));
 assert(html.includes('fire-panel-lessons.css'));assert(html.includes('fire-panel-dialog'));
 const entry=ns.find(n=>n.tagName==='section'&&attr(n,'data-fire-practice-entry')!==undefined);
 assert(entry);assert(text(entry).includes('문제 풀기'));
 const link=nodes(html).filter(n=>n.tagName==='a').find(n=>attr(n,'href')?.includes('chapter='+row.practicePool));assert(link);
 for(const term of row.requiredText)assert(source.includes(term),row.id+': required judgment '+term);
 for(const stale of row.forbiddenText||[])assert(!source.includes(stale),row.id+': no stale scenario '+stale);
 const previous=Buffer.from(review.changes[chapterDir+row.slug+'.md'].before,'base64').toString();
 const previousImages=[...previous.matchAll(/src="(\/images\/[^" ]+)"/g)].map(m=>m[1]);
 for(const src of previousImages)assert(fs.existsSync('public'+src),'old asset retained '+src);
}
const oldPractice=fs.readFileSync(audit+'/practice-payload.sha256','utf8').trim();
const practice=fs.readFileSync('dist/fire-safety-manager-level2/practice/index.html','utf8');
const payload=practice.match(/<script[^>]*data-fire-payload[^>]*>([\s\S]*?)<\/script>/)[1];
assert.equal(hash(payload),oldPractice,'same published practice questions and assignments');
console.log('[Fire full panels] PASS',JSON.stringify({chapters:4,panels:3,details:11,files:inventory.length,questionAssignments:'unchanged',oldAssets:'retained'}));
