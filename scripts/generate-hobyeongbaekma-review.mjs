import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { PICTOGRAMS } from './facility-pictograms.mjs';
import { registerExtraPictograms } from './facility-pictograms-extended.mjs';
import { renderInfographic, infographicLayout } from './generate-facility-compact-infographic.mjs';
import { measureBulkLabelOffsets, applyBulkLabelOffsets } from './facility-bulk-labels.mjs';

const root = 'docs/drafts/facility/hobyeongbaekma';
registerExtraPictograms();
// A guest bed distinguishes the hotel from an office without adding a person.
PICTOGRAMS.hotel = { meaning: '객실 침대와 호텔의 객실 설비', svg: '<g data-part="bed"><path d="M9 90V26M95 90V49M9 73h86M9 60h86V45H47v15"/><rect x="17" y="36" width="23" height="19" rx="6" fill="#E9F5E6"/><path d="M9 80h86"/></g>' };
const card = (title, summary, icon, details, action) => ({ title, summary, icon, details, action });
const specs = [
  ['02-four-workplaces-1', '네 시설의 관리 대상 1/2', '같은 시설명이어도 실제 업무는 현장마다 다름', [
    card('호텔', '객실 냉난방·급탕', 'hotel', ['객실 불편 처리 범위', '야간 호출과 지원업무'], '객실 대응 범위 확인'),
    card('병원', '공조·전기·급배수', 'hospital', ['파트별 책임과 특수설비', '비상 대응·신입 교육'], '담당 파트와 교육 확인'),
  ], '관리 대상과 직접 정비하는 범위를 구분'],
  ['02-four-workplaces-2', '네 시설의 관리 대상 2/2', '영업시간 밖의 작업과 담당 파트를 확인', [
    card('백화점', '전기·공조·방재', 'shopping', ['행사와 매장 변경 지원', '폐점 후 작업과 야간 인원'], '행사·야간 작업 확인'),
    card('마트', '냉장·냉동·배수', 'cooling', ['영선과 야간 보수', '외주 정비와 직접 업무'], '외주·직접 업무 구분'),
  ], '모든 시설팀이 같은 설비를 직접 정비하지는 않음'],
  ['03-why-hard-1', '업무 부담을 가르는 조건 1/2', '건물 이름보다 실제 근무 조건을 비교', [
    card('운영시간', '야간·휴일을 포함한 근무표', 'clock', ['연속 운영 중 호출', '폐점 후 작업 시간'], '최근 근무표 확인'),
    card('민원·요청', '이용객·매장·현장 부서 대응', 'support', ['요청을 접수하는 담당', '시설팀의 처리 범위'], '호출·업무 범위 확인'),
  ], '이용시간과 시설팀의 근무시간을 나누어 확인'],
  ['03-why-hard-2', '업무 부담을 가르는 조건 2/2', '혼자 맡는지, 배울 사람과 지원이 있는지', [
    card('업무 분장', '기계·전기·방재·영선', 'repair', ['직접 운전·점검하는 설비', '외주·고객서비스 지원 범위'], '담당업무 목록 확인'),
    card('인력·지원', '한 근무조의 인원과 지원', 'training', ['신입 교육과 매뉴얼', '야간 비상연락·외주 지원'], '교육·비상 지원 확인'),
  ], '직무 구분과 지원체계에 따라 경험은 달라짐'],
  ['05-before-applying-1', '지원 전 여섯 가지 확인 1/2', '공고에서 빠진 항목부터 질문', [
    card('고용주', '근로계약을 맺는 회사', 'legal-employer', ['직영·자회사·용역 구분'], '계약 상대방 확인'),
    card('근무표', '주간·야간·비번·휴무', 'shift-calendar', ['한 주기의 실제 근무표'], '근무·휴무 주기 확인'),
    card('실제 담당', '설비와 지원업무의 범위', 'mechanical', ['고객서비스·행사 포함 여부'], '업무분장 확인'),
  ], '기관 이름보다 실제 계약과 담당업무부터 확인'],
  ['05-before-applying-2', '지원 전 여섯 가지 확인 2/2', '인력·휴게·교육을 구체적으로 확인', [
    card('야간 지원', '당직 인원과 연락체계', 'support', ['혼자 해결하기 어려운 상황'], '지원 담당자 확인'),
    card('보수·휴게', '기본급·수당·실제 휴게', 'pay-components', ['금액의 포함 항목과 휴게 장소'], '급여·휴게 조건 확인'),
    card('경력·교육', '신입 교육과 경력증빙', 'career', ['교육 담당자와 업무 기록'], '교육·증빙 방법 확인'),
  ], '구체적인 답변은 입사 전 확인 자료와 대조'],
];
const sha = b => createHash('sha256').update(b).digest('hex');
const images = [];
for (const [id, title, subtitle, cards, takeaway] of specs) {
  const spec = { title, subtitle, cards, takeaway, cardSpacing: 'compact' };
  const offsets = await measureBulkLabelOffsets(spec);
  const svg = applyBulkLabelOffsets(renderInfographic(spec), offsets);
  fs.writeFileSync(`${root}/specs/${id}.json`, JSON.stringify(spec, null, 2) + '\n');
  fs.writeFileSync(`${root}/masters/${id}.svg`, svg);
  const image = await sharp(Buffer.from(svg)).webp({ quality: 92, effort: 6 }).toBuffer();
  fs.writeFileSync(`${root}/images/${id}.webp`, image);
  const layout = infographicLayout(spec);
  const boxes = layout.cards.map(r => ({ x: r.x + 22, y: r.y + r.h - 81, width: r.w - 44, height: 57 }));
  boxes.push(layout.footer);
  const centering = [];
  for (const box of boxes) {
    const {data, info} = await sharp(image).extract({ left: Math.ceil(box.x + 2), top: Math.round(box.y), width: Math.floor(box.width - 4), height: box.height }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let min = Infinity, max = -1;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (data[i] < 120 && data[i + 1] < 150 && data[i + 2] < 120) { min = Math.min(min, y); max = Math.max(max, y); }
    }
    const difference = Math.abs(min - (info.height - 1 - max));
    if (max < 0 || difference > 2) throw Error(`${id}: label centering ${difference}`);
    centering.push(difference);
  }
  images.push({ id, file: `images/${id}.webp`, master: `masters/${id}.svg`, width: layout.width, height: layout.height, sha256: sha(image), icons: cards.map(c => ({ key: c.icon, meaning: PICTOGRAMS[c.icon].meaning })), centering });
}
const heroMaster = process.argv[2];
if (!heroMaster) throw Error('Pass the reviewed generated PNG master');
const hero = await sharp(heroMaster).resize(1440, 1080).webp({ quality: 90, effort: 6 }).toBuffer();
fs.writeFileSync(`${root}/images/01-hobyeongbaekma-hero.webp`, hero);
images.unshift({ id: '01-hobyeongbaekma-hero', file: 'images/01-hobyeongbaekma-hero.webp', width: 1440, height: 1080, sha256: sha(hero), sourcePNG: path.basename(heroMaster), sourceSHA256: sha(fs.readFileSync(heroMaster)), sourceRole: 'imagegen edited collage; not an equipment layout' });
fs.writeFileSync(`${root}/image-manifest.json`, JSON.stringify({ images, cards: specs.length, renderer: 'scripts/generate-facility-compact-infographic.mjs', newIcon: { key: 'hotel', meaning: PICTOGRAMS.hotel.meaning, svg: PICTOGRAMS.hotel.svg } }, null, 2) + '\n');
console.log(JSON.stringify({ images: images.length, cards: specs.length, labels: images.flatMap(r => r.centering || []).length, maxLabelDifference: Math.max(...images.flatMap(r => r.centering || [])) }));
