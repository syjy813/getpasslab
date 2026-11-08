import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {renderInfographic,infographicOverviewLayout} from './generate-facility-overview.mjs';
import {integratedImageRoot as root,integrateEpisode00Images} from './hobyeongbaekma-integrated-images.mjs';
const sharp=createRequire(import.meta.url)('sharp');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const prefix='/images/facility-series/hobyeongbaekma-00/';
fs.mkdirSync(root+'/masters',{recursive:true});
fs.mkdirSync(root+'/specs',{recursive:true});
fs.mkdirSync('public'+prefix,{recursive:true});
const rows=[
  {id:'02-four-workplaces',template:'overview-example-4',count:4,alt:'호텔·병원·백화점·마트 4개 시설의 관리 대상과 객실 대응·담당 파트·야간 작업·직접 정비 범위 비교'},
  {id:'03-why-hard',template:'overview-workload-4',count:4,alt:'시설 업무 부담을 가르는 운영시간·민원과 요청·업무 분장·인력과 지원 4개 조건'},
  {id:'05-before-applying',template:'overview-example-6',count:6,alt:'지원 전 확인할 고용주·근무표·실제 담당·야간 지원·보수와 휴게·경력과 교육 6개 항목'}
];
const manifest={baseCommit:'ca30d38975eec8ca0b8ec18e852f27386ef43050',previousSource:root+'/previous-article.md',previousSourceSHA256:sha(fs.readFileSync(root+'/previous-article.md')),updatedAt:'2026-11-08',groups:[],additions:{}};
const style=fs.readFileSync('src/styles/facility.css');
manifest.previousStyle=root+'/previous-facility.css';
manifest.previousStyleBlob='48b48abb2751e463e3f70ccbfde589e3664b6e83';
manifest.facilityStyleBlob=createHash('sha1').update('blob '+style.length+'\0').update(style).digest('hex');
manifest.facilityStyleSHA256=sha(style);
for(const row of rows){
  const spec=JSON.parse(fs.readFileSync('docs/standards/facility-infographic-templates/'+row.template+'.json','utf8'));
  const specPath=root+'/specs/'+row.id+'.json';
  fs.writeFileSync(specPath,JSON.stringify(spec,null,2)+'\n');
  const group={id:row.id,count:row.count,alt:row.alt,spec:specPath,specSHA256:sha(fs.readFileSync(specPath)),previous:[prefix+row.id+'-1.webp',prefix+row.id+'-2.webp']};
  for(const viewport of ['desktop','mobile']){
    const svg=renderInfographic({...spec,viewport}),layout=infographicOverviewLayout({...spec,viewport});
    const master=root+'/masters/'+row.id+'-combined-'+viewport+'.svg';
    fs.writeFileSync(master,svg);
    await sharp(Buffer.from(svg),{density:72}).png().toFile(master.replace(/\.svg$/,'.png'));
    const src=prefix+row.id+'-combined-'+viewport+'.webp',file='public'+src;
    const bytes=await sharp(Buffer.from(svg),{density:72}).webp({quality:90,effort:6}).toBuffer();
    fs.writeFileSync(file,bytes);
    const pngMaster=master.replace(/\.svg$/,'.png');
    group[viewport]={src,file,width:layout.width,height:layout.height,sha256:sha(bytes),master,masterSHA256:sha(Buffer.from(svg)),pngMaster,pngSHA256:sha(fs.readFileSync(pngMaster))};
    manifest.additions[file]=sha(bytes);
  }
  manifest.groups.push(group);
}
const article=integrateEpisode00Images(fs.readFileSync(manifest.previousSource,'utf8'),manifest);
fs.writeFileSync('src/content/facility/hobyeongbaekma.md',article);
manifest.additions['src/content/facility/hobyeongbaekma.md']=sha(Buffer.from(article));
fs.writeFileSync(root+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Episode 0: three complete comparison pictures, six responsive WebP files');
