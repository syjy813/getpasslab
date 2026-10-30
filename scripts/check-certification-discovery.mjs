import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse,serialize} from 'parse5';
import {certificationUIReview as review,beforeCertificationDiscovery} from './read-before-certification-discovery.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const files=[...walk('src'),...walk('public'),...walk('dist').filter(f=>/\.(html|xml)$/.test(f))].sort();
assert.deepEqual(files,Object.keys(review.current).sort(),'native inventory');
for(const file of files)assert.equal(hash(fs.readFileSync(file)),review.current[file],file+': reviewed current bytes');
assert.deepEqual(review.productFiles,[
 'src/components/AdFitResponsive.astro','src/components/GNB.astro','src/components/ReadableChapter.astro','src/layouts/BaseLayout.astro','src/layouts/ChapterLayout.astro',
 'src/pages/[cert]/[exam]/[subject]/index.astro','src/pages/[cert]/[exam]/index.astro','src/pages/[cert]/index.astro','src/pages/index.astro',
 'src/styles/catalog.css','src/styles/global.css',
]);
assert.deepEqual(Object.keys(review.additions),['src/styles/catalog.css'],'no new URL/content/data/image');
assert.deepEqual(files.filter(f=>f.startsWith('dist/')),review.beforeInventory.filter(f=>f.startsWith('dist/')).sort(),'all public routes retained');
const attr=(n,name)=>n.attrs?.find(a=>a.name===name)?.value;
const all=tree=>{const list=[];const visit=n=>{list.push(n);for(const c of n.childNodes||[])visit(c);};visit(tree);return list;};
const metadata=nodes=>nodes.filter(n=>n.tagName==='title'||n.tagName==='meta'||n.tagName==='link'&&attr(n,'rel')==='canonical'||n.tagName==='script'&&attr(n,'type')==='application/ld+json').map(n=>serialize(n)+JSON.stringify(n.attrs||[]));
const cleanLesson=(node,file)=>{
 const copy=structuredClone(node);
 const visit=n=>{if(!n.childNodes)return;n.childNodes=n.childNodes.filter(c=>!(c.tagName==='aside'&&(attr(c,'class')||'').split(' ').includes('adfit-placement'))&&!(c.tagName==='script'&&serialize(c).includes('const initializeAdFit =')));n.childNodes.forEach(visit);};visit(copy);
 let result=serialize(copy);
 for(const items of file==='dist/computer-literacy/written/computer-basics/computer-classification/index.html' ? [['디지털','아날로그','하이브리드'],['팜톱','랩톱','노트북','데스크톱']] : []){
  const list=`<ul class="chapter-cell-items">${items.map(item=>`<li>${item}</li>`).join('')}</ul>`;
  result=result.replace(list,items.join('·'));
 }
 return result;
};
let lessons=0,htmlCount=0;
let footerPages=0;
for(const file of files.filter(f=>f.endsWith('.html'))){
 const nodes=all(parse(fs.readFileSync(file,'utf8')));
 const redirect=nodes.some(n=>n.tagName==='meta'&&(attr(n,'http-equiv')||'').toLowerCase()==='refresh');
 const expected=(file==='dist/index.html'||/^dist\/(industrial-safety|energy-management|computer-literacy|fire-safety-manager-level2)\//.test(file))&&!file.includes('/practice/')&&!redirect;
 const slots=nodes.filter(n=>attr(n,'data-footer-ad')!==undefined);
 assert.equal(slots.length,expected?1:0,file+': common footer eligibility');
 assert.equal(nodes.filter(n=>attr(n,'data-unit')==='DAN-A3dGUv2kIjnZSTmZ').length,expected?1:0,file+': exactly one footer unit; no home duplicate');
 if(expected)footerPages++;
}
for(const [file,row]of Object.entries(review.changes)){
 const current=fs.readFileSync(file),before=beforeCertificationDiscovery(file,current);
 assert.equal(hash(before),row.beforeSHA256,file+': immutable predecessor');
 assert.notEqual(hash(beforeCertificationDiscovery(file,Buffer.concat([current,Buffer.from('unknown')]))),row.beforeSHA256,'unknown mutations remain detectable');
 if(!file.endsWith('.html'))continue;htmlCount++;
 const now=all(parse(current.toString())),old=all(parse(before.toString()));
 assert.deepEqual(metadata(now),metadata(old),file+': canonical and SEO metadata preserved');
 const a=now.find(n=>n.tagName==='article'),b=old.find(n=>n.tagName==='article');assert.equal(!!a,!!b);
 if(a){assert.equal(cleanLesson(a,file),cleanLesson(b,file),file+': lesson, figures, question payload and practice unchanged except reviewed cell lists');lessons++;}
 if(file!=='dist/index.html')assert.equal(serialize(now.find(n=>n.tagName==='h1')),serialize(old.find(n=>n.tagName==='h1')),file+': original page title retained');
}
assert.deepEqual(walk('dist/_astro').filter(f=>/\.(js|css)$/.test(f)).sort(),Object.keys(review.bundles).sort(),'compiled bundle inventory');
for(const [file,sha]of Object.entries(review.bundles))assert.equal(hash(fs.readFileSync(file)),sha,file+': reviewed bundle');
assert(lessons>500);assert(htmlCount>500);
console.log('[Certification discovery native] PASS',JSON.stringify({nativeFiles:files.length,lessons,htmlCount,footerPages,sourceChanges:review.productFiles.length,questionsAndImages:'unchanged',routes:'unchanged'}));
