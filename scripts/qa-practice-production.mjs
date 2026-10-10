// Read-only production census. Compare actual HTTP bytes with this checkout's
// build and canonical data; no writes to product sources or archived evidence.
import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import yaml from 'js-yaml';
const exec = promisify(execFile);
const base = process.env.QA_BASE_URL || 'https://getpasslab.co.kr';
const out = 'qa-results/practice-production';
await mkdir(out, { recursive: true });
const hash = b => createHash('sha256').update(b).digest('hex');
const certs = ['industrial-safety','energy-management','computer-literacy'];
const walk = async d => (await Promise.all((await readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]))).flat();
const report = { base, startedAt: new Date().toISOString(), totals: {}, datasets: [], pages: [], resources: [], errors: [] };
const get = async url => {
  const t=Date.now();
  const {stdout}=await exec('curl',['--fail','--silent','--show-error','--location','--max-time','45','--retry','2',url],{maxBuffer:12*1024*1024});
  return {text:stdout,ms:Date.now()-t};
};
const article = h => h.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
const metas = h => [...h.matchAll(/<span\b[^>]*data-practice-meta[^>]*>/g)].map(x=>x[0]);
const ids = h => metas(h).map(x=>x.match(/data-id="([^"]+)"/)[1]);
const assets = new Set();
const rows=[];
for (const cert of certs) {
  const source=JSON.parse(await readFile('src/data/questions/'+cert+'.json','utf8'));
  const lookup=new Map(source.map(q=>[q.id,q]));
  assert.equal(lookup.size,source.length,cert+' canonical duplicate IDs');
  const data=await get(base+'/practice-data/'+cert+'.json');
  const expected=source.map(({id,label,number,body,choices,answer})=>({id,label,number,body,choices,answer}));
  assert.deepEqual(JSON.parse(data.text),expected,cert+' production canonical fields');
  report.datasets.push({cert,records:source.length,bytes:Buffer.byteLength(data.text),ms:data.ms,sha256:hash(data.text),result:'PASS'});
  const sources=[];
  for(const f of (await walk('src/content/chapters')).filter(f=>f.endsWith('.md'))){
    const h=await readFile(f,'utf8');const c=yaml.load(h.match(/^---\n([\s\S]*?)\n---/)[1]);
    if((c.cert_id??'industrial-safety')===cert&&c.status==='완료')sources.push(c);
  }
  const files=(await walk('dist/'+cert+'/written')).filter(f=>f.endsWith('/index.html')&&f.split('/').length===6);
  const published=[];
  for(const file of files){
    const h=await readFile(file,'utf8');if(/http-equiv="refresh"/.test(h))continue;
    const route='/'+file.slice(5,-10),slug=route.split('/').at(-2);
    const c=sources.find(c=>c.slug===slug);assert(c,route+' has public source');
    const primary=h.match(/<div\b[^>]*data-question-role="primary"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)?.[1]??'';
    const history=[...primary.matchAll(/data-open="([^"]+)"/g)].map(m=>m[1]);
    const eligible=[...new Set(history)].filter(id=>{const q=lookup.get(id);return q&&!q.review&&q.choices.length===4&&q.answer>=1&&q.answer<=4});
    // These are the actual frontmatter allocations, not a count inferred from UI.
    assert(history.every(id=>(c.questions??[]).includes(id)),route+' primary frontmatter IDs');
    for(const id of c.questions??[]){const q=lookup.get(id);assert(q,route+' missing canonical ID '+id);if(!q.review)assert(history.includes(id),route+' missing history ID '+id)}
    assert.deepEqual(ids(h),eligible,route+' practice eligibility');
    const launches=[...h.matchAll(/\bdata-practice-open(?:\s|>)/g)].length;
    assert.equal(launches,eligible.length?1:0,route+' button visibility');
    if(eligible.length)assert(h.includes('문제 풀기 ('+eligible.length+'문항)'),route+' count label');
    const row={cert,route,title:c.title,count:eligible.length,ids:eligible,imageCount:metas(h).filter(m=>m.includes('data-image-src=')).length,cautionCount:metas(h).filter(m=>m.includes('data-caution=')).length,articleSha256:hash(article(h))};
    rows.push({...row,file});published.push(row);
  }
  assert.equal(published.length,sources.length,cert+' all published sources have routes');
  report.totals[cert]={chapters:published.length,withPractice:published.filter(r=>r.count).length,withoutPractice:published.filter(r=>!r.count).length,linkedQuestions:published.reduce((s,r)=>s+r.count,0)};
}
async function pool(items,fn){let i=0;await Promise.all(Array.from({length:8},async()=>{while(i<items.length){const item=items[i++];await fn(item)}}))}
await pool(rows,async row=>{
  try{
    const local=await readFile(row.file,'utf8'),remote=await get(base+row.route),h=remote.text;
    assert.equal(hash(article(h)),row.articleSha256,'article bytes');
    assert.deepEqual(metas(h),metas(local),'practice metadata/images/cautions/explanations');
    assert.equal(h.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0],local.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0],'canonical');
    assert.equal(h.match(/<title>(.*?)<\/title>/)?.[1],local.match(/<title>(.*?)<\/title>/)?.[1],'title');
    assert.equal(h.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0],local.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0],'description');
    assert(h.includes('href="'+base+row.route+'"'),'self canonical');
    assert(!/katex-error|http-equiv="refresh"|name="robots" content="noindex/.test(h),'published errors');
    assert.equal([...h.matchAll(/\bdata-practice-open(?:\s|>)/g)].length,row.count?1:0,'button visibility');
    if(row.count)assert(h.includes('문제 풀기 ('+row.count+'문항)'),'button count');
    for(const m of h.matchAll(/(?:data-image-src|data-question-image-src|src)="(\/[^"?]+)"/g))assets.add(m[1]);
    report.pages.push({...row,file:undefined,httpMs:remote.ms,productionArticleSha256:hash(article(h)),result:'PASS'});
  }catch(e){report.errors.push({route:row.route,error:String(e)})}
  if((report.pages.length+report.errors.length)%50===0)console.log('Production chapters checked',report.pages.length+report.errors.length,'/',rows.length);
});
await pool([...assets],async route=>{try{const r=await get(base+route);report.resources.push({route,ms:r.ms,result:'PASS'})}catch(e){report.errors.push({resource:route,error:String(e)})}});
for(const route of ['/sitemap-0.xml','/sitemap-index.xml','/robots.txt','/']){
  try{const r=await get(base+route);if(route==='/sitemap-0.xml')for(const row of rows)assert(r.text.includes(base+row.route),'sitemap missing '+row.route);report.resources.push({route,ms:r.ms,result:'PASS'})}catch(e){report.errors.push({resource:route,error:String(e)})}
}
report.finishedAt=new Date().toISOString();
await writeFile(out+'/http-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({totals:report.totals,datasets:report.datasets,checkedPages:report.pages.length,resources:report.resources.length,errors:report.errors},null,2));
assert.equal(report.errors.length,0,'production census failures');
