// Verify an exact approved delta without rewriting historical snapshots.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parse} from 'parse5';

const base = process.env.REVIEW_BASE_SHA;
assert.match(base??'',/^[0-9a-f]{40}$/,'immutable PR base SHA required');
const chapter = 'src/content/chapters/safety-management/accident-cause-classification.md';
const industrial = 'src/styles/industrialReadability.css';
const global = 'src/styles/global.css';
const paths = [chapter, industrial, global];
const readBase = file => execFileSync('git',['show',base+':'+file],{encoding:'utf8'});
const native = file => readFileSync(file,'utf8');
const replaceExactly = (source,oldText,newText,occurrences=1) => {
  assert.equal(source.split(oldText).length-1,occurrences,'precise original content: '+oldText);
  return source.split(oldText).join(newText);
};
const revisions = new Map();
let md=readBase(chapter);
md=replaceExactly(md,'불가항력 (천재 등)','불가항력',2);
md=replaceExactly(md,'| M | 내용 |','| <span class="accident-cause-4m-label">구분</span> | 내용 |');
md=replaceExactly(md,'| 용어 | 소속 | 주의점 |','| <span class="accident-cause-term-label">용어</span> | 소속 | 주의점 |');
md=replaceExactly(md,'Engineering·Education·Enforcement','Engineering (기술적 대책)<br>Education (교육적 대책)<br>Enforcement (관리적 대책)',2);
md=replaceExactly(md,'**간접 원인 (3E 대응)** · Engineering','**간접 원인 (3E 대응)**<br>Engineering');
revisions.set(chapter,md);

const appended=[
'',
'/* Keep the two compact accident-cause tables full-width at narrow viewport sizes. */',
'.industrial-safety-chapter article table:has(.accident-cause-4m-label),',
'.industrial-safety-chapter article table:has(.accident-cause-term-label){display:table;table-layout:fixed;width:100%}',
'.industrial-safety-chapter article table:has(.accident-cause-4m-label) :is(th,td):first-child{width:37%}',
'.industrial-safety-chapter article table:has(.accident-cause-term-label) :is(th,td):nth-child(1){width:30%}',
'.industrial-safety-chapter article table:has(.accident-cause-term-label) :is(th,td):nth-child(2){width:21%}',
'.industrial-safety-chapter article table:has(.accident-cause-term-label) :is(th,td):nth-child(3){width:49%;overflow-wrap:anywhere}',
'.industrial-safety-chapter article table:has(.accident-cause-4m-label) th,',
'.industrial-safety-chapter article table:has(.accident-cause-term-label) th{vertical-align:middle}',
''
].join('\n');
revisions.set(industrial,readBase(industrial)+appended);
revisions.set(global,replaceExactly(readBase(global),'#핵심-개념,#절차-및-판별-기준,#자주-틀리는-포인트','#핵심-개념,#절차-및-판별-기준',2));

// Exact bytes, including the Markdown frontmatter and CSS declarations, ensure
// the original five primary questions and every other production line survive.
for (const path of paths) {
  assert.equal(native(path),revisions.get(path),path+': approved revision only');
  assert.notEqual(native(path)+'mutation',revisions.get(path),path+': unknown append rejected');
  assert.notEqual(native(path).slice(1),revisions.get(path),path+': unknown deletion rejected');
}
const changed=execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8'}).trim().split('\n').sort();
assert.deepEqual(changed,[
  '.github/workflows/all-chapter-hierarchy-qa.yml',
  '.github/workflows/industrial-remaining-splits-qa.yml',
  '.github/workflows/chapter-formula-style-qa.yml',
  '.github/workflows/mobile-learning-ux-qa.yml',
  '.github/workflows/industrial-safety-chapter-splits-qa.yml',
  '.github/workflows/mobile-top-ad-qa.yml',
  '.github/workflows/fire-safety-level2-launch-qa.yml',
  '.github/workflows/certification-discovery-qa.yml',
  'scripts/qa-accident-cause-chapter.cjs',
  'scripts/qa-mobile-chapter-top-ad.cjs',
  'scripts/qa-all-chapter-hierarchy.cjs',
  'scripts/check-accident-cause-release.mjs',
  'scripts/ci-archived-history.cjs',
  ...paths
].sort(), 'no additional files changed');
const frontmatter = source => source.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1];
assert.equal(frontmatter(native(chapter)),frontmatter(readBase(chapter)),'chapter ID/URL/linked questions retained');

const route='dist/industrial-safety/written/safety-management/accident-cause-classification/index.html';
const html=native(route);
const dom=parse(html);
const attr=(n,name)=>n.attrs?.find(a=>a.name===name)?.value;
const all=(node,result=[])=>{result.push(node);for(const child of node.childNodes||[])all(child,result);return result;};
const nodes=all(dom);
const article=nodes.find(n=>n.tagName==='article');
assert(article,'chapter article rendered');
const descendants=all(article,[]);
const heading=id=>descendants.find(n=>n.tagName==='h2'&&attr(n,'id')===id);
assert(heading('자주-틀리는-포인트'),'mistake section retained');
assert(heading('시험-포인트'),'exam section retained');
assert(descendants.some(n=>attr(n,'class')==='accident-cause-4m-label'&&n.tagName==='span'),'4M label rendered');
assert(descendants.some(n=>attr(n,'class')==='accident-cause-term-label'&&n.tagName==='span'),'term label rendered');
assert(html.includes('Engineering (기술적 대책)'),'3E engineering retained');
assert(html.includes('Education (교육적 대책)'),'3E education retained');
assert(html.includes('Enforcement (관리적 대책)'),'3E enforcement retained');
assert(!html.includes('불가항력 (천재 등)'),'redundant example removed');

console.log('[Accident cause release] PASS: three exact production deltas, 16-file total scope, immutable question metadata, native HTML, adversarial edit rejection');
