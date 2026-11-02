// Restrict historical snapshot projection to the approved completion chip and PC TOC.
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import path from 'node:path';

const sourceBlobs={
  'src/components/GNB.astro':{before:'3b384b9a9f3e8b60f9088cd7ddb15e18019eb408',now:'bc86e93d222a9d817b4f78b50d2412ac48102f1d'},
  'src/components/InstantQuestionPractice.astro':{before:'cbc8a863e3c132c6fc905b4f99418276ed33882e',now:'7ee33b06b99d229ecb3830b2701af8a5e1c95848'},
};
const changes={
 'src/components/GNB.astro':[
  ['  /* Desktop already has the persistent chapter sidebar; only mobile needs the header TOC. */\n  @media(min-width:1024px){.gnb-cert-menu,.gnb-cert-menu + .gnb-menu{display:none}}\n','']
 ],
 'src/components/InstantQuestionPractice.astro':[
  ["if (progress) { progress.hidden = false; progress.textContent = '1 / ' + meta.length; }","if (progress) progress.textContent = '1 / ' + meta.length;"],
  ["if (progress) { progress.hidden = false; progress.textContent = (currentIndex + 1) + ' / ' + meta.length; }","if (progress) progress.textContent = (currentIndex + 1) + ' / ' + meta.length;"],
  ["if (progress) progress.hidden = true;","if (progress) progress.textContent = '완료';"]
 ]
};
const oldAssets={
 '/_astro/BaseLayout.DPpxxNzx.css':'/_astro/BaseLayout.C1KrpNFq.css',
 '/_astro/InstantQuestionPractice.astro_astro_type_script_index_0_lang.pDAgU--1.js':'/_astro/InstantQuestionPractice.astro_astro_type_script_index_0_lang.B-5ce8YB.js'
};
const blob=b=>createHash('sha1').update(Buffer.from('blob '+b.length+String.fromCharCode(0))).update(b).digest('hex');
const key=file=>path.normalize(path.isAbsolute(String(file))?path.relative(process.cwd(),String(file)):String(file)).split(path.sep).join('/');
export function beforeCompletionDesktopToc(file,bytes){
 bytes=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);
 const name=key(file);
 if(Object.hasOwn(sourceBlobs,name)){
  const row=sourceBlobs[name],actual=blob(bytes);
  if(actual===row.before)return bytes;
  if(actual!==row.now)return bytes;
  let value=bytes.toString('utf8');
  for(const [newText,oldText]of changes[name]){
   assert.equal(value.split(newText).length,2,name+': one precise approved edit');
   value=value.replace(newText,oldText);
  }
  const restored=Buffer.from(value);
  assert.equal(blob(restored),row.before,name+': original source Git blob restored exactly');
  return restored;
 }
 if(!name.startsWith('dist/')||!name.endsWith('.html'))return bytes;
 let html=bytes.toString('utf8'),found=false;
 for(const [current,previous]of Object.entries(oldAssets)){
  if(!html.includes(current))continue;
  assert.equal(html.split(current).length,2,name+': expected single compiled asset reference '+current);
  html=html.replace(current,previous);
  found=true;
 }
 return found?Buffer.from(html):bytes;
}
