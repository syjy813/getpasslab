// Historical release view; check-fire-image-copy.mjs verifies current files.
import fs from './read-before-fire-image-copy.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {fivePanelReview as review,beforeFireFivePanels,isFireFivePanelAddition} from './read-before-fire-five-full-panels.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const inventory=[...walk('src'),...walk('public'),...walk('dist').filter(p=>p.endsWith('.html'))].sort();
assert.deepEqual(inventory,Object.keys(review.current).sort());
for(const f of inventory)assert.equal(hash(fs.readFileSync(f)),review.current[f],f+': current native file');
assert.equal(Object.keys(review.additions).length,4);
for(const f of Object.keys(review.additions))assert(isFireFivePanelAddition(f));
for(const [f,row]of Object.entries(review.changes)){
 const bytes=fs.readFileSync(f);assert.equal(hash(beforeFireFivePanels(f,bytes)),row.beforeSHA256);
 assert.notEqual(hash(beforeFireFivePanels(f,Buffer.concat([bytes,Buffer.from(' unknown')]))),row.beforeSHA256);
 if(f.endsWith('.md')){
  const s=bytes.toString(),old=beforeFireFivePanels(f,bytes).toString();
  assert.equal(s.split('---',3)[1],old.split('---',3)[1],f+': all chapter metadata retained');
 }
}
for(const [f,sha]of Object.entries(review.questions))assert.equal(hash(fs.readFileSync(f)),sha,f+': questions unchanged');
const rows=JSON.parse(fs.readFileSync('docs/audits/2026-10-27-fire-five-full-panels/chapters.json'));
assert.deepEqual(rows.map(r=>r.id),['FSM2-075','FSM2-076','FSM2-077','FSM2-078','FSM2-079']);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=html=>{const out=[];const visit=n=>{out.push(n);for(const c of n.childNodes||[])visit(c)};visit(parse(html));return out;};
for(const r of rows){
 const file='dist/fire-safety-manager-level2/written/fire-safety-practice/'+r.slug+'/index.html';const html=fs.readFileSync(file,'utf8'),nodes=all(html);
 assert.equal(nodes.filter(n=>n.tagName==='h1').length,1);
 const img=nodes.find(n=>n.tagName==='img'&&attr(n,'src')===r.src);assert(img);
 for(const key of ['alt','width','height'])assert(attr(img,key));
 assert(html.includes('fire-panel-lessons.css'));assert(html.includes('fire-panel-dialog'));
 assert.equal(nodes.filter(n=>n.tagName==='section'&&attr(n,'class')==='fire-panel-step').length,3);
 const source=fs.readFileSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+r.slug+'.md','utf8');
 const parent=source.match(/^practiceChapter: "([^"]+)"/m)[1];assert(parent);
 const parentSource=fs.readFileSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+parent+'.md','utf8');
 const parentId=parentSource.match(/^chapter_id: "([^"]+)"/m)[1];assert(html.includes('chapter='+parentId));
 if(!r.reusedApprovedImage)assert(!source.includes('fire-panel-detail'),'new chapters do not add cropped detail windows');
}
console.log('[Fire five full panels] PASS',JSON.stringify({chapters:5,newImages:4,approvedImageReused:1,currentFiles:inventory.length,questions:'unchanged'}));
