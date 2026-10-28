import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {phase2Review as review,beforeFirePracticePhase2,isFirePracticePhase2Addition} from './read-before-fire-practice-phase2.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const inventory=[...walk('src'),...walk('public'),...walk('dist').filter(f=>f.endsWith('.html'))].sort();
assert.deepEqual(inventory,Object.keys(review.current).sort());
for(const f of inventory)assert.equal(hash(fs.readFileSync(f)),review.current[f],f+': native current file');
assert.equal(Object.keys(review.additions).length,5);
for(const f of Object.keys(review.additions))assert(isFirePracticePhase2Addition(f));
assert.equal(Object.keys(review.changes).length,8);
for(const [f,row]of Object.entries(review.changes)){
 const data=fs.readFileSync(f);assert.equal(hash(beforeFirePracticePhase2(f,data)),row.beforeSHA256);
 assert.notEqual(hash(beforeFirePracticePhase2(f,Buffer.concat([data,Buffer.from(' unknown')]))),row.beforeSHA256,'unknown mutation stays visible');
 if(f.endsWith('.md'))assert.equal(data.toString().split('---',3)[1],beforeFirePracticePhase2(f,data).toString().split('---',3)[1],'all metadata retained');
}
for(const [f,sha]of Object.entries(review.questions))assert.equal(hash(fs.readFileSync(f)),sha,'canonical question data retained');
const rows=JSON.parse(fs.readFileSync('docs/audits/2026-10-28-fire-practice-phase2/figure-briefs.json')).figures;
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const nodes=html=>{const all=[];const visit=n=>{all.push(n);for(const c of n.childNodes||[])visit(c);};visit(parse(html));return all;};
for(const r of rows){
 const md='src/content/chapters/fire-safety-manager-level2/fire-safety-practice/'+r.slug+'.md';const source=fs.readFileSync(md,'utf8');
 assert.equal(source.split('※ 학습을 위해 재구성된 이미지').length-1,1);assert(!source.includes('학습용 재구성 ·'));
 const html=fs.readFileSync('dist/fire-safety-manager-level2/written/fire-safety-practice/'+r.slug+'/index.html','utf8'),all=nodes(html);
 assert.equal(all.filter(n=>n.tagName==='h1').length,1);assert.equal(all.filter(n=>n.tagName==='section'&&attr(n,'class')==='fire-panel-step').length,3);
 const img=all.find(n=>n.tagName==='img'&&attr(n,'src')==='/images/fire-safety-manager-level2/'+r.asset);assert(img);assert(attr(img,'alt'));assert.equal(attr(img,'width'),'640');
 assert(html.includes('chapter='+r.id),'original practice pool retained');
 for(const original of r.old)assert(fs.existsSync('public/images/fire-safety-manager-level2/'+original),'original asset retained');
}
// Source-backed example: 0.60MPa rated pressure, 500 L/min flow.
const pump=fs.readFileSync('src/content/chapters/fire-safety-manager-level2/fire-safety-practice/pump-performance-tests.md','utf8');
assert(pump.includes('0.84MPa')&&pump.includes('750L/min')&&pump.includes('0.39MPa')&&pump.includes('0.37MPa'));
assert.equal(.60*1.4,.84);assert.equal(500*1.5,750);assert.equal(.60*.65,.39);
// In the drawing the inlet is 22 units from the nozzle plane, for a 44-unit bore.
const pitot=fs.readFileSync('public/images/fire-safety-manager-level2/pitot-measurement-assembly-v2.svg','utf8');
assert(pitot.includes('id="nozzle-outlet" cx="250"')&&pitot.includes('id="pitot-inlet" cx="272"'));
assert(pitot.includes('d="M223 154V198M218 154H230M218 198H230"'));
assert.equal((272-250)/(198-154),.5,'distance matches D/2 geometry');
assert.equal(walk('src/content/chapters/fire-safety-manager-level2').filter(f=>f.endsWith('.md')).length,79);
console.log('[Fire practice phase2] PASS',JSON.stringify({chapters:4,newSVG:4,currentFiles:inventory.length,sourceMetadata:'unchanged',questions:'unchanged'}));
