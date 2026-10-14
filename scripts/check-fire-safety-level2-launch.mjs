import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const audit = 'docs/audits/2026-10-14-fire-safety-level2-launch';
const baseline = JSON.parse(await readFile(`${audit}/baseline.json`, 'utf8'));
const release = JSON.parse(await readFile(`${audit}/release.json`, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function walk(dir) {
  return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]))).flat();
}
const additions = release.sourceChanges.filter(r => !r.originalFile);
assert.deepEqual([...await walk('src'),...await walk('public')].sort(), [...Object.keys(baseline.files),...additions.map(r=>r.path)].sort());
for (const [file, before] of Object.entries(baseline.files)) {
  const row = release.sourceChanges.find(row=>row.path===file);
  assert.equal(hash(await readFile(file)), row?.sha256 ?? before, `${file}: preserved or exact approved change`);
  if (row) { assert.equal(row.originalSha256,before); assert.equal(hash(await readFile(row.originalFile)),before); }
}
for (const row of additions) assert.equal(hash(await readFile(row.path)),row.sha256,`${row.path}: approved addition`);
const articles = {};
for (const file of await walk('dist')) if (file.endsWith('/index.html')) {
  const html = await readFile(file,'utf8');
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
  if (article !== undefined) articles[file] = hash(article);
}
assert.deepEqual(articles,{...baseline.articles,...release.newArticles},'all 450 previous articles and exactly one added lesson');
const [lessonFile] = Object.keys(release.newArticles);
const html = await readFile(lessonFile,'utf8');
assert.equal((html.match(/<h1\b/g)??[]).length,1);
assert.equal((html.match(/class="zoom-button"/g)??[]).length,4);
assert.equal((html.match(/<figure\b/g)??[]).length,4);
assert(!/복원문제 참고|연결 자료에서 확인한 판단|기출 출제 이력|수록 기출에서 직접 출제 이력 없음|data-open=|data-practice-open/.test(html));
assert(!/편집 메모|sample-editorial|검수 기록/.test(html));
assert(html.includes('기동용수압개폐장치') && html.includes('준비작동식'));
const route = lessonFile.replace(/^dist/,'').replace(/index.html$/,'');
for (const file of ['dist/sitemap-0.xml','dist/fire-safety-manager-level2/written/fire-safety-theory/index.html']) assert((await readFile(file,'utf8')).includes(route));
assert((await readFile('dist/index.html','utf8')).includes('소방안전관리자 2급'));
console.log(`[Fire safety launch] ${Object.keys(baseline.files).length} prior source/assets, ${Object.keys(baseline.articles).length} prior articles preserved; 1 new lesson; no source question data changes`);
