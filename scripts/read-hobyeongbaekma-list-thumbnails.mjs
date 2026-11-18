import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const component = 'src/components/FacilityCard.astro';
const componentBefore = 'c2597defc70e6b5a3eca2e5222264089c15df347ba9be97e354c8b6d445146bf';
const componentAfter = 'd3ae744482c33f7293110b81f86562c6552a99b5df765138aaf92e939285103a';

// User-approved 2026-11-16/17 listing-only images. These are intentionally absent
// from the older immutable source/publication inventories.
export const thumbnailRows = [
  {id:'hobyeongbaekma',name:'hobyeongbaekma-ep0',png:'63e5a116a02f52ff3989cb8f7bec065e4c96f4d08c6f9388c1e3c33e4c7d9def',webp:'d880566ea4820c762eb753e4e1606f44525506d6e108eff75666a44c6392e770'},
  {id:'hobyeongbaekma-hotel-despair',name:'hobyeongbaekma-hotel-despair',png:'e2050def62c0d75c84b2b9a4a5180a11a58fa76882fb248277d0fc3c74410600',webp:'f5e78e3c7ca3e55354a66fe92988245db8a126a64a465945659b10035d0132f0'},
  {id:'hobyeongbaekma-hotel-hope',name:'hobyeongbaekma-hotel-hope',png:'158f37a2d7e106d24867a704f0f8179b67d76527f2683cb6dee922a8ff3b37ea',webp:'c0c6a8ac16d5480ead0003864ba0b179c12cd38097407b6e872b0a10d21488d5'},
  {"id":"hobyeongbaekma-hospital-despair","name":"hobyeongbaekma-hospital-despair","png":"30bb9bbd45ff09ced1ce3146ea108d36ececf911647425890df0cbb1cc1a9af3","webp":"b6710879676824a08e30c55244e25b6cfc618221d3568dc85ce39afb6296c69a","maxBytes":200000},
  {"id":"hobyeongbaekma-hospital-hope","name":"hobyeongbaekma-hospital-hope","png":"aa65a52be38228c099f0024605bcede7d23db1dfeab769f7b37d3bb94e99dd08","webp":"c1fea9913a39fb7f4d0fb16a13c93ce07dfe00224e0aab8c407db207f1d7f7ab","maxBytes":200000},
  {"id":"hobyeongbaekma-hospital-large-university","name":"hobyeongbaekma-hospital-large-university","png":"4ab1c556d8c43c6953c0b2039c4772035f6783cfcd0c363a7d57f9af36b3aff7","webp":"6b9c208a69ca97d1afd00ec589548e8934711035bb5d03bd597418f4b9710cb3","maxBytes":300000},
  {"id":"hobyeongbaekma-department-store-despair","name":"hobyeongbaekma-department-store-despair","png":"bfe7cc5c3aa3cfdf5a07e31b2bccd8ba581bfd535adec46976ada8a65a7b0e9e","webp":"9dac894afb02197def5cc078aaa63d8aa06b12add56a2118aac9708e7d7a181f","maxBytes":200000},
  {"id":"hobyeongbaekma-department-store-hope","name":"hobyeongbaekma-department-store-hope","png":"079701e4c68fd78326a71a28ad85069ee5b05130a4013700043e8c8af5039454","webp":"6c1ba432f74c893111179ce77f2ffbba0003dbaee37837290d2e0aa17ad88e73","maxBytes":200000},
  {id:'hobyeongbaekma-mart-despair',name:'hobyeongbaekma-mart-despair',png:null,webp:'f7f3e5e8afba6859f72da0bd1d05108846bf2eb9bc0bc07e26b75982e67d8afc',maxBytes:200000},
  {id:'hobyeongbaekma-mart-hope',name:'hobyeongbaekma-mart-hope',png:null,webp:'c9839b10284ad062e6d3a77c6987c1fe96c170aca5964ab97433bbef1f1ab56a',maxBytes:200000},
  {id:'sasugoldae',name:'sasugoldae-ep0',png:null,webp:'e9fa554eed56ec07fbe737c52a428244c8105a9190bf890d4eb7ca1e76998043',maxBytes:300000},
].map(row=>({
  ...row,
  master:row.png ? `facility-assets/hobyeongbaekma-list-thumbnails/${row.name}.png` : null,
  publicFile:`public/images/facility-series/list-thumbnails/${row.name}.webp`,
  outputFile:`dist/images/facility-series/list-thumbnails/${row.name}.webp`,
  route:`/facility-management/career/${row.id}/`,
}));
export const thumbnailMasterFiles = thumbnailRows.map(row=>row.master).filter(Boolean);
export const thumbnailPublicFiles = thumbnailRows.map(row=>row.publicFile);
export const thumbnailOutputFiles = thumbnailRows.map(row=>row.outputFile);

// Reconstruct the exact pre-thumbnail component before older immutable guards.
// No older fingerprint or unrelated rule is relaxed.
export function beforeHobyeongbaekmaListThumbnails(file, bytes) {
  if (file !== component) return bytes;
  let text=bytes.toString('utf8');
  // Restore only approved hospital/department-store/mart/sasugoldae overrides before the immutable baseline.
  for (const row of thumbnailRows.slice(3)) {
    const entry = `  '${row.id}': '${row.publicFile.replace(/^public/,'')}',\n`;
    assert.equal(text.split(entry).length,2,file+': exact approved thumbnail entry');
    text=text.replace(entry,'');
  }
  assert.equal(sha(text),componentAfter,file+': approved thumbnail component');
  const changes=[
    [
      '// Published articles reuse their hero image by default; approved listing-only\n// thumbnails override it without changing the article body or social metadata.\n',
      '// Reuse images already referenced in the corresponding published article.\n',
    ],
    [
      "const listingThumbnails: Record<string, string> = {\n  'hobyeongbaekma': '/images/facility-series/list-thumbnails/hobyeongbaekma-ep0.webp',\n  'hobyeongbaekma-hotel-despair': '/images/facility-series/list-thumbnails/hobyeongbaekma-hotel-despair.webp',\n  'hobyeongbaekma-hotel-hope': '/images/facility-series/list-thumbnails/hobyeongbaekma-hotel-hope.webp',\n};\nconst listingThumbnail = listingThumbnails[article.id];\nconst cover = listingThumbnail ?? covers[article.id];\nconst coverSize = listingThumbnail ? [1448, 1086] : article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];",
      "const cover = covers[article.id];\nconst coverSize = article.id.startsWith('hobyeongbaekma') ? [1440, 1080] : article.id === 'first-job' ? [1447, 1087] : [1448, 1086];",
    ],
  ];
  for (const [current,previous] of changes) {
    assert.equal(text.split(current).length,2,file+': exact approved thumbnail edit');
    text=text.replace(current,previous);
  }
  assert.equal(sha(text),componentBefore,file+': original card source restored');
  return Buffer.from(text);
}

const allNodes = node => [node,...(node.childNodes||[]).flatMap(allNodes)];
const attr = (node,name) => node?.attrs?.find(row=>row.name===name)?.value;
const hasClass = (node,name) => (attr(node,'class')||'').split(/\s+/).includes(name);

export async function assertHobyeongbaekmaListThumbnails() {
  beforeHobyeongbaekmaListThumbnails(component,fs.readFileSync(component));
  const {default:sharp}=await import('sharp');
  for (const row of thumbnailRows) {
    for (const [file,expected,format] of [[row.master,row.png,'png'],[row.publicFile,row.webp,'webp'],[row.outputFile,row.webp,'webp']]) {
      if (!file) continue; // Mart/sasugoldae PNG originals remain in the image-generation Library items.
      const bytes=fs.readFileSync(file);
      assert.equal(sha(bytes),expected,file+': approved image bytes');
      const meta=await sharp(bytes).metadata();
      assert.deepEqual([meta.format,meta.width,meta.height],[format,1448,1086],file+': 4:3 image');
      if (format==='webp') assert(bytes.length<(row.maxBytes ?? 200_000),file+': optimized listing thumbnail');
    }
  }
  const list=allNodes(parse(fs.readFileSync('dist/facility-management/stories/index.html','utf8')));
  const cards=list.filter(node=>node.tagName==='a'&&hasClass(node,'facility-card'));
  assert.equal(cards.filter(node=>allNodes(node).some(child=>attr(child,'src')?.includes('/list-thumbnails/'))).length,thumbnailRows.length,'exactly the approved listing overrides');
  for (const row of thumbnailRows) {
    const card=cards.find(node=>attr(node,'href')===row.route);
    assert(card,row.route+': listing card');
    const img=allNodes(card).find(node=>node.tagName==='img');
    assert.equal(attr(img,'src'),row.publicFile.replace(/^public/,''),row.route+': approved listing-only image');
    assert.deepEqual([attr(img,'width'),attr(img,'height')],['1448','1086'],row.route+': reserved aspect ratio');
    const article=allNodes(parse(fs.readFileSync('dist'+row.route+'index.html','utf8')));
    const body=article.find(node=>hasClass(node,'facility-body'));
    assert(body,row.route+': article body');
    assert(!allNodes(body).some(node=>attr(node,'src')?.includes('/list-thumbnails/')),row.route+': original article hero preserved');
    assert(!article.some(node=>node.tagName==='meta'&&attr(node,'property')==='og:image'&&attr(node,'content')?.includes('/list-thumbnails/')),row.route+': social image preserved');
  }
}
