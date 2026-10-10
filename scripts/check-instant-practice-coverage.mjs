import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
// Build-output check: all publicly rendered certification chapters, not a sample.
// Do not modify source question JSON, archived review evidence or chapter markdown.
const certs = ['industrial-safety','energy-management','computer-literacy'];
const errors = [];
const totals = {};
for (const cert of certs) {
  const canonical = JSON.parse(await readFile('src/data/questions/'+cert+'.json','utf8'));
  const byId = new Map(canonical.map(q=>[q.id,q]));
  const chapters = [];
  async function scan(dir) {
    for (const item of await readdir(dir,{withFileTypes:true})) {
      const full=path.join(dir,item.name);
      if(item.isDirectory())await scan(full);
      else if(item.name==='index.html' && path.relative('dist/'+cert+'/written',full).split(path.sep).length===3) chapters.push(full);
    }
  }
  await scan('dist/'+cert+'/written');
  let withPractice=0, withoutPractice=0, counted=0, missingExplanations=0;
  for(const file of chapters) {
    const html=await readFile(file,'utf8');
    if(/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html))continue;
    const block = html.match(/<div\b[^>]*data-question-role="primary"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)?.[1] ?? '';
    const ids=[...block.matchAll(/data-open="([^"]+)"/g)].map(m=>m[1]);
    const unique=[...new Set(ids)];
    const eligible=unique.filter(id=>{
      const q=byId.get(id);
      return q && !q.review && Array.isArray(q.choices) && q.choices.length===4 && q.answer>=1 && q.answer<=4;
    });
    const meta=[...html.matchAll(/<span\b[^>]*\bdata-practice-meta\b[^>]*\bdata-id="([^"]+)"[^>]*>/g)].map(m=>m[1]);
    const launches=[...html.matchAll(/\bdata-practice-open(?:\s|>)/g)].length;
    const dialogs=[...html.matchAll(/id="instant-practice-dialog"/g)].length;
    if(eligible.length) {
      withPractice++;
      counted+=eligible.length;
      if(eligible.join('|')!==meta.join('|'))errors.push(file+': source-linked ids differ from practice ids ('+eligible.length+'/'+meta.length+')');
      if(launches!==1 || dialogs!==1)errors.push(file+': missing or duplicate launch/modal ('+launches+'/'+dialogs+')');
      missingExplanations+=eligible.filter(id=>!(cert==='industrial-safety' && /accident-prevention-principles\/index\.html$/.test(file) && ['20220424_010','20220305_009','20200606_016','20200822_009','20200926_004','20190303_008'].includes(id))).length;
    } else {
      withoutPractice++;
      if(meta.length || launches || dialogs) errors.push(file+': unassigned chapter shows practice UI');
    }
    // Initial HTML may contain question IDs and image metadata but no duplicated
    // question body or four choices in the new practice section.
    if(/data-practice-body[^>]*>[^<\s]/.test(html))errors.push(file+': eager question body in practice modal');
  }
  totals[cert]={chapters:withPractice+withoutPractice,withPractice,withoutPractice,linkedQuestions:counted,withoutVerifiedExplanation:missingExplanations};
}
for(const error of errors)console.error('[Instant practice coverage]',error);
console.log('[Instant practice coverage]',JSON.stringify(totals),'errors='+errors.length);
assert.equal(errors.length,0,'Some chapter practice assignments are inconsistent');
assert(Object.values(totals).every(x=>x.chapters>0 && x.withPractice>0));
