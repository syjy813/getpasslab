import fs from 'node:fs';
import {integratedImageRoot as root,integratedPicture,integratedImageStyles} from './hobyeongbaekma-integrated-images.mjs';
const manifest=JSON.parse(fs.readFileSync(root+'/manifest.json'));
const titles=['4개의 시설은 무엇이 다를까?','왜 기피 현장이라는 말이 붙었을까?','지원하기 전, 이것부터 묻자'];
const sections=manifest.groups.map((group,i)=>{
  let picture=integratedPicture(group);
  for(const viewport of ['desktop','mobile']){
    const image=group[viewport];
    picture=picture.replace(image.src,'data:image/webp;base64,'+fs.readFileSync(image.file).toString('base64'));
  }
  return '<section><h2>'+titles[i]+'</h2>'+picture+'</section>';
}).join('');
const css=':root{--gray-200:#d9e2da;--radius-lg:12px;--space-6:24px}*{box-sizing:border-box}body{margin:0;background:#f5f7f3;color:#173f2e;font:16px/1.7 system-ui,-apple-system,"Noto Sans KR",sans-serif;word-break:keep-all}main{max-width:800px;margin:auto;padding:32px 20px;background:#fff}h1{font-size:28px;line-height:1.4}h2{font-size:23px;line-height:1.4;margin:36px 0 16px}p{color:#52665b}.facility-body img{box-sizing:border-box;width:100%;max-width:100%;height:auto;aspect-ratio:auto 4/3;display:block;border:1px solid var(--gray-200);border-radius:var(--radius-lg)}.facility-body figure{margin:var(--space-6) 0}'+integratedImageStyles;
fs.writeFileSync(root+'/episode00-integrated-images-review.html','<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>호병백마 0화 · 통합 이미지 검토본</title><style>'+css+'</style></head><body><main><h1>호병백마 0화 · 통합 이미지</h1><p>같은 주제로 나뉜 본문 이미지 6장을 3장으로 통합했습니다. 대표 썸네일·기존 본문과 표는 유지합니다. 이 파일은 이미지 검토본이며 실서버 배포 전입니다.</p><div class="facility-body">'+sections+'</div></main></body></html>\n');
console.log('Portable episode 0 integrated-image review generated');
