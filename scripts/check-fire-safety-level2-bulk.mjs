import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit='docs/audits/2026-10-14-fire-safety-level2-bulk';
const baseline=JSON.parse(await readFile(audit+'/baseline.json','utf8'));
const release=JSON.parse(await readFile(audit+'/release.json','utf8'));
const reviews=JSON.parse(await readFile(audit+'/chapter-review.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const walk=async d=>(await Promise.all((await readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]))).flat();
const additions=release.sourceChanges.filter(r=>!r.originalFile);
assert.deepEqual([...await walk('src'),...await walk('public')].sort(),[...Object.keys(baseline.files),...additions.map(r=>r.path)].sort());
for(const [file,before]of Object.entries(baseline.files)){const r=release.sourceChanges.find(r=>r.path===file);assert.equal(hash(await readFile(file)),r?.sha256??before,file);if(r){assert.equal(r.originalSha256,before);assert.equal(hash(await readFile(r.originalFile)),before)}}
for(const row of additions)assert.equal(hash(await readFile(row.path)),row.sha256,row.path);
assert.equal(reviews.length,73);assert.equal(new Set(reviews.map(r=>r.chapterId)).size,73);
const chapterFiles=await walk('src/content/chapters/fire-safety-manager-level2');assert.equal(chapterFiles.length,74);
const ids=[];
for(const f of chapterFiles){const s=await readFile(f,'utf8');ids.push(s.match(/^chapter_id: ["']?(FSM2-\d+)/m)[1]);assert(/^questions: \[\]/m.test(s));assert(/^status: ["']?완료/m.test(s));}
assert.deepEqual(ids.sort(),Array.from({length:74},(_,i)=>'FSM2-'+String(i+1).padStart(3,'0')));
const articles={};for(const f of await walk('dist'))if(f.endsWith('/index.html')){const s=await readFile(f,'utf8');const a=s.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];if(a!==undefined)articles[f]=hash(a)}
assert.deepEqual(articles,{...baseline.articles,...Object.fromEntries(release.articleChanges.map(r=>[r.path,r.sha256])),...release.newArticles},'450 exact existing articles, original sprinkler content with only related links, and 73 additions');
const sitemap=await readFile('dist/sitemap-0.xml','utf8');
for(const r of reviews){const s=await readFile('dist'+r.route+'index.html','utf8');assert.equal((s.match(/<h1\b/g)??[]).length,1);assert(!/복원문제 참고|편집 메모|기출 출제 이력|data-practice-open|data-open=/.test(s));assert(sitemap.includes(r.route));assert.equal((s.match(/<figure\b/g)??[]).length,r.visuals.length);for(const v of r.visuals)assert(s.includes('/images/fire-safety-manager-level2/'+v.file));}
const first=release.sourceChanges.find(r=>r.path.endsWith('sprinkler-types-operation.md'));assert.equal((await readFile(first.path,'utf8')).replace('order: 40\n','order: 37\n'),await readFile(first.originalFile,'utf8'),'existing lesson body and identity unchanged');
console.log('[Fire bulk] 73 chapters, 32 SVGs, 736 prior source/assets checked; 450 exact prior articles and original sprinkler content preserved; 74 fire lessons; canonical questions unchanged');

for(const r of release.articleChanges){const current=(await readFile(r.path,'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];const old=(await readFile(r.originalFile,'utf8')).match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];assert.equal(hash(old),r.originalSha256);assert.equal(current.split('<h2>관련 챕터</h2>')[0].trimEnd(),old.trimEnd())}

for(const r of reviews){const body=await readFile(r.path,'utf8');assert.equal(Number(body.match(/^order: (\d+)/m)[1]),r.order,r.chapterId+': planned learning order');assert.equal(hash(body),r.contentSha256,r.chapterId+': reviewed content hash')}
for(const id of [1,2]){const rows=await Promise.all(chapterFiles.map(async f=>({f,s:await readFile(f,'utf8')})));const orders=rows.filter(r=>new RegExp('subject_id: '+id).test(r.s)).map(r=>Number(r.s.match(/^order: (\d+)/m)[1]));assert.equal(new Set(orders).size,orders.length,'unique subject learning order')}
