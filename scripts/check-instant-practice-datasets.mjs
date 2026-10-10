import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const certs=['industrial-safety','energy-management','computer-literacy'];
for(const cert of certs) {
  const source=JSON.parse(await readFile('src/data/questions/'+cert+'.json','utf8'));
  const delivered=JSON.parse(await readFile('dist/practice-data/'+cert+'.json','utf8'));
  assert.equal(source.length,delivered.length);
  const actual=new Map(source.map(q=>[q.id,q]));
  for(const row of delivered) {
    const s=actual.get(row.id);
    assert(s);
    for(const field of ['id','label','number','body','choices','answer']) assert.deepEqual(row[field],s[field],cert+' '+row.id+' '+field);
    assert.deepEqual(Object.keys(row).sort(), ['id','label','number','body','choices','answer'].sort());
  }
}
console.log('[Instant practice endpoints] 3 static certification JSON datasets match canonical fields exactly');
