import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parseFragment} from 'parse5';
import {formatChapterHtml,copyRules,cellLists} from './chapter-readability.mjs';
import {readabilityReview,beforeGlobalChapterReadability} from './read-before-global-chapter-readability.mjs';

const audit='docs/audits/2026-10-26-global-chapter-readability/';
const baseline=JSON.parse(fs.readFileSync(audit+'baseline.json'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);
const added=Object.entries(readabilityReview.files).filter(([,r])=>r.added).map(([file])=>file);
assert.deepEqual([...walk('src'),...walk('public')].sort(),[...Object.keys(baseline.files),...added.filter(f=>f.startsWith('src/')||f.startsWith('public/'))].sort());
assert.deepEqual(walk('dist').filter(f=>f.endsWith('.html')).sort(),Object.keys(baseline.html).sort());
for(const[file,row]of Object.entries(readabilityReview.files)){
  const bytes=fs.readFileSync(file);assert.equal(hash(bytes),row.sha256,file+': reviewed native bytes');
  if(!row.added){
    assert.equal(hash(beforeGlobalChapterReadability(file,bytes)),row.beforeSHA256);
    assert.throws(()=>beforeGlobalChapterReadability(file,Buffer.concat([bytes,Buffer.from(' mutation')])));
  }
}
for(const[file,expected]of Object.entries({...baseline.files,...baseline.html})){
  assert.equal(hash(beforeGlobalChapterReadability(file,fs.readFileSync(file))),expected,file+': only approved presentation changes');
}
const region=html=>{
  const begin=html.indexOf('>',html.indexOf('<article'))+1,end=html.indexOf('<aside class="adfit-placement"',begin);
  assert(begin>0 && end>begin,'lesson slot boundaries');return {begin,end,html:html.slice(begin,end)};
};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
const protectedParts=html=>{
  const root=parseFragment(html,{sourceCodeLocationInfo:true}),parts=[];
  const visit=n=>{
    const classes=n.attrs?.find(a=>a.name==='class')?.value||'';
    if(['code','pre','figure','img','a','script','style','svg','math','h1','h2','h3','h4','h5','h6'].includes(n.tagName)||classes.split(' ').includes('katex')){
      const loc=n.sourceCodeLocation;if(loc)parts.push(html.slice(loc.startOffset,loc.endOffset));return;
    }
    for(const c of n.childNodes||[])visit(c);
  };visit(root);return parts;
};
const report={chapters:0,changed:0,byCertification:{},cells:0,sentenceBreaks:0,copyRules:copyRules.length,reviewedCellRules:cellLists.length};
for(const row of baseline.chapters){
  const bytes=fs.readFileSync(row.file),after=bytes.toString(),before=beforeGlobalChapterReadability(row.file,bytes).toString();
  const old=region(before),current=region(after),scope={slug:row.slug,certId:row.cert};
  assert.equal(formatChapterHtml(old.html,scope),current.html,row.file+': complete slot transformation');
  assert.equal(formatChapterHtml(current.html,scope),current.html,row.file+': idempotent');
  assert.deepEqual(protectedParts(old.html),protectedParts(current.html),row.file+': formulae, code, diagrams, links and headings preserved');
  const numbers=html=>{
    const chunks=[];const visit=n=>{if(n.nodeName==='#text')chunks.push(n.value);else for(const c of n.childNodes||[])visit(c);};
    visit(parseFragment(html));return chunks.join(' ').match(/\d+(?:,\d{3})*(?:\.\d+)?/g);
  };
  assert.deepEqual(numbers(old.html),numbers(current.html),row.file+': every numerical value preserved');
  const outsideBefore=before.slice(0,old.begin)+before.slice(old.end),outsideAfter=after.slice(0,current.begin)+after.slice(current.end);
  const normalizeCSS=s=>s.replace(/\/_astro\/global\.[\w-]+\.css/g,'/_astro/global.css');
  assert.equal(normalizeCSS(outsideBefore),normalizeCSS(outsideAfter),row.file+': question UI and navigation untouched');
  report.chapters++;report.byCertification[row.cert]??={chapters:0,changed:0};report.byCertification[row.cert].chapters++;
  if(old.html!==current.html){report.changed++;report.byCertification[row.cert].changed++;}
  report.cells+=(current.html.match(/class="chapter-cell-items"/g)||[]).length;
  report.sentenceBreaks+=(current.html.match(/data-chapter-sentence-break/g)||[]).length;
}
assert.equal(report.chapters,521);
// Boundaries that cannot safely be covered by a text-only replacement.
const input='<table><tr><td><strong>첫 조건 · 다음 <em>조건</em></strong> · 마지막 조건</td></tr></table>';
const formatted=formatChapterHtml(input);
const tree=parseFragment(formatted);assert(!formatted.includes(' · '));assert.equal(text(tree),'첫 조건다음 조건마지막 조건');
assert.equal(formatChapterHtml(formatted),formatted);
for(const html of ['<p><code>m · h · ℃</code></p>','<p>열전도율 (kcal/(m · h · ℃))</p>','<p><code>*</code> · <code>/</code></p>','<figure><figcaption>형식 · 학습용 재구성</figcaption></figure>'])assert.equal(formatChapterHtml(html),html);
assert.equal(formatChapterHtml('<p>소유자·관리자·점유자</p>',{certId:'computer-literacy'}),'<p>소유자·관리자·점유자</p>');
console.log('[Global chapter readability] PASS',JSON.stringify(report));
