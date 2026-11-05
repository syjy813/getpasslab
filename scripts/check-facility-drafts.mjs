import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';

if (fs.existsSync('docs/audits/2026-11-05-facility-publication/manifest.json')) {
  await import('./check-facility-publication.mjs');
  process.exit(0);
}

const audit = 'docs/audits/2026-11-04-facility-drafts/';
const preview = process.env.FACILITY_DRAFT_PREVIEW === '1';
const manifest = JSON.parse(fs.readFileSync(audit+'draft-manifest.json'));
const articles = Object.values(JSON.parse(fs.readFileSync(audit+'site-article-map.json')));
const images = JSON.parse(fs.readFileSync(audit+'site-image-map.json'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]) : [];
const attr = (node,key) => node.attrs?.find(a=>a.name===key)?.value;
const nodes = root => [root,...(root.childNodes||[]).flatMap(nodes)];
for (const [file,hash] of Object.entries({...manifest.source,...manifest.assets})) assert.equal(sha(fs.readFileSync(file)),hash,file);
assert.equal(Object.keys(manifest.source).length,8);
assert.equal(Object.keys(manifest.assets).length,40);
let links = 0;
for (const article of articles) {
  const source = fs.readFileSync('src/content/facility/'+article.slug+'.md','utf8');
  assert.match(source,/^status: draft$/m,article.slug+': stays draft');
  const file = 'dist'+article.path+'index.html';
  assert.equal(fs.existsSync(file),preview,article.path+': preview only');
  if (!preview) continue;
  const list = nodes(parse(fs.readFileSync(file,'utf8')));
  assert.equal(list.filter(n=>n.tagName==='h1').length,1);
  assert.equal(attr(list.find(n=>n.tagName==='meta'&&attr(n,'name')==='robots'),'content'),'noindex, nofollow');
  assert.equal(attr(list.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href'),'https://getpasslab.co.kr'+article.path);
  assert.equal(list.filter(n=>n.tagName==='img'&&attr(n,'src')?.includes('/images/facility-drafts/')).length >= 5,true);
  assert(!list.some(n=>n.tagName==='img'&&attr(n,'alt')?.includes('\\~')),'no Markdown escape in HTML alt');
  assert(!list.some(n=>n.tagName==='del'),'no unintended Markdown strikethrough');
  assert(!list.some(n=>n.nodeName==='#text'&&n.value.includes('**')),'no raw Markdown emphasis');
  for (const node of list) {
    const href = node.tagName==='a' ? attr(node,'href') : undefined;
    if (href?.startsWith('/facility-management/')) {
      assert(fs.existsSync('dist'+href.replace(/\/$/,'')+'/index.html'),article.path+': missing '+href);
      links++;
    }
    if (node.tagName==='script'&&attr(node,'type')==='application/ld+json') {
      const json=JSON.parse((node.childNodes||[]).map(n=>n.value||'').join(''));
      assert(!(Array.isArray(json)?json:[json]).some(n=>n['@type']==='Article'),'draft has no public Article schema');
    }
  }
}
for (const image of images) {
  const file='dist'+image.url;
  assert.equal(fs.existsSync(file),preview,image.url+': preview only');
  if(preview) assert.equal(sha(fs.readFileSync(file)),manifest.assets['facility-assets/'+image.url.split('/').slice(-2).join('/')]);
}
const sitemap=walk('dist').filter(p=>p.endsWith('.xml')).map(p=>fs.readFileSync(p,'utf8')).join('');
for(const article of articles) assert(!sitemap.includes(article.path),'draft absent from sitemap');
if(!preview) {
  const baseline=JSON.parse(fs.readFileSync(audit+'public-baseline.json')).files;
  const files=walk('dist').filter(p=>!p.split('/').some(part=>part.startsWith('.'))).sort();
  assert.deepEqual(files,Object.keys(baseline).sort(),'complete public file inventory');
  // PR245 replaced these three outputs after the immutable PR242 baseline.
  // Pin approved source masters and render in this environment: installed CJK
  // fonts/Sharp can change bytes across machines without changing the source.
  const generated = new Map([
    ['01-public-sector-hero', '9bfa7b4ed1614597c8a3a4627929a64c6277e36f'],
    ['02-employer-types', '5f5cf07544e75f5543ecbd591ec0e2c5ef9ec5c2'],
    ['04-pay-data-comparison', 'b2981e016b006a6ee2ce0a6bca9e82ea35f7ca75'],
  ]);
  const expectedGenerated = new Map();
  const {default: sharp} = await import('sharp');
  for (const [name,blob] of generated) {
    const source=fs.readFileSync('facility-asset-edits/05/'+name+'.svg');
    assert.equal(createHash('sha1').update('blob '+source.length+'\0').update(source).digest('hex'),blob,'approved PR245 master: '+name);
    const output=await sharp(source,{density:96}).resize(1440,1080,{fit:'fill'}).webp({quality:86,effort:6}).toBuffer();
    expectedGenerated.set('dist/images/facility-drafts/05/'+name+'.webp',sha(output));
  }
  for(const file of files)assert.equal(sha(fs.readFileSync(file)),expectedGenerated.get(file)??baseline[file],file+': approved public bytes');
  console.log('Facility draft guard: 8 drafts and 40 assets excluded; '+(files.length-generated.size)+' public files byte-identical to PR242; 3 approved PR245 master renders verified');
} else console.log('Facility draft guard: 8 draft routes, 40 images, '+links+' internal links, robots/schema/sitemap PASS');
