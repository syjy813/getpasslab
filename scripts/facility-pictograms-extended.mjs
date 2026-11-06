// Topic-specific additions for the approved facility image refresh.
// Existing canonical pictograms stay byte-identical. 104 × 104 coordinates.
import {PICTOGRAMS} from './facility-pictograms.mjs';
const soft='#E9F5E6';
const box=(x,y,w,h,r=5)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${soft}"/>`;
export const EXTRA_PICTOGRAMS={
 mechanical:{meaning:'펌프와 배관을 통한 기계설비 관리',svg:'<g data-part="motor">'+box(56,40,36,33,5)+'<path d="M65 49v15M80 49v15"/></g><g data-part="pump"><circle cx="36" cy="55" r="20" fill="#E9F5E6"/><circle cx="36" cy="55" r="7" fill="#FFFFFF"/><path d="M16 55H6M6 47v16M36 35V18h34M70 10v16"/></g><path d="M36 75v13M76 74v14M16 88h76"/>'},
 electrical:{meaning:'수배전반과 전기설비',svg:box(22,8,60,88)+'<path d="M22 32h60M32 21h9m10 0h9M56 43L40 66h15l-5 19 19-28H54Z"/>'},
 fire:{meaning:'소화기와 소방설비',svg:box(31,35,43,60,12)+'<path d="M40 35V22h25v13M39 22l13-12h22M73 22q18 0 18 20v18M34 67h37M46 52h14M47 80h12"/>'},
 repair:{meaning:'문과 시설물의 보수',svg:'<path d="M10 89h49M17 89V14h40v50M28 32h17M28 47h17"/><path fill="#E9F5E6" d="M71 13a19 19 0 0 0-15 28L34 75a8 8 0 0 0 13 10l25-32a19 19 0 0 0 24-20L83 45l-14-9 8-16Z"/>'},
 office:{meaning:'오피스 건물',svg:box(25,9,55,86,2)+'<path d="M11 95h83M37 24h7m14 0h8M37 41h7m14 0h8M37 58h7m14 0h8M43 95V77h18v18"/>'},
 apartment:{meaning:'공동주택의 동별 공용설비',svg:box(9,28,36,66,2)+box(59,9,36,85,2)+'<path d="M18 41h5m9 0h4M18 57h5m9 0h4M18 73h5m9 0h4M69 23h5m9 0h3M69 39h5m9 0h3M69 55h5m9 0h3M69 71h5m9 0h3M71 94V82h11v12"/>'},
 hospital:{meaning:'병원과 연속 운영 설비',svg:box(12,34,80,61,3)+box(34,9,36,40,3)+'<path d="M52 18v22M42 29h20M25 56h7m40 0h7M25 73h7m40 0h7M43 95V69h18v26"/>'},
 warehouse:{meaning:'물류창고 및 보관 설비',svg:'<path fill="#E9F5E6" d="M8 38L52 9l44 29v56H8Z"/><path d="M26 94V47h52v47M26 62h52M26 77h52M8 38h88"/>'},
 shopping:{meaning:'쇼핑몰의 점포와 이용객 시설',svg:box(14,40,76,53,3)+'<path fill="#FFFFFF" d="M14 40l9-25h58l9 25Z"/><path d="M14 40q0 14 13 14t13-14q0 14 13 14t13-14q0 14 12 14t12-14M41 93V67h22v26"/>'},
 clock:{meaning:'근무시간과 출퇴근 시각',svg:'<circle cx="52" cy="52" r="40" fill="#E9F5E6"/><path d="M52 26v28l19 11M52 12v6M12 52h6M52 92v-6M92 52h-6"/>'},
 day:{meaning:'주간근무의 낮 시간대',svg:'<circle cx="52" cy="52" r="23" fill="#E9F5E6"/><path d="M52 7v10M52 87v10M7 52h10M87 52h10M20 20l7 7M77 77l7 7M20 84l7-7M77 27l7-7"/>'},
 night:{meaning:'야간근무 및 휴식의 밤 시간대',svg:'<path fill="#E9F5E6" d="M78 68A36 36 0 1 1 40 14a29 29 0 0 0 38 54Z"/><path d="M79 12v14M72 19h14M88 38v10M83 43h10"/>'},
 monitor:{meaning:'중앙감시 화면과 작업 관리',svg:box(8,13,88,61)+'<path d="M8 62h88M40 74v17M64 74v17M29 93h46M20 49V36h15v13h14V25h17v24h17"/>'},
 training:{meaning:'매뉴얼과 교육 절차',svg:'<path fill="#E9F5E6" d="M9 19q22-8 43 4 21-12 43-4v65q-22-8-43 4-21-12-43-4Z"/><path d="M52 23v65M20 35h19M20 49h19M20 63h19M64 35h19M64 49h19M64 63h19"/>'},
 career:{meaning:'기간별 근무기록과 경력 증빙',svg:box(16,13,72,80)+'<path d="M29 7v14M75 7v14M16 34h72M30 51h17M30 66h17M30 80h17M59 53l6 6 12-13M59 78l6 6 12-13"/>'},
 folder:{meaning:'증빙서류의 수집 및 분류',svg:'<path fill="#E9F5E6" d="M8 27V16h33l10 11h45v65H8Z"/><path fill="#FFFFFF" d="M19 38h70l-9 44H12Z"/><path d="M30 49h42M28 62h35"/>'},
 stamp:{meaning:'회사 직인과 서류 날인',svg:'<path fill="#E9F5E6" d="M39 59V44c0-10-10-14-10-24C29 5 75 5 75 20c0 10-10 14-10 24v15Z"/><path fill="#FFFFFF" d="M19 62h66v15H19Z"/><path d="M11 91h82M28 79v12M76 79v12"/>'},
 rail:{meaning:'철도 선로 및 토목 시설',svg:'<g data-part="rails"><path d="M35 8L21 96M69 8l14 88"/></g><g data-part="sleepers"><path d="M29 24h46M25 43h54M21 62h62M17 81h70"/></g>'},
 ratio:{meaning:'인원 수의 나눗셈과 비율',svg:'<circle cx="52" cy="22" r="7" fill="#12523C" stroke="none"/><circle cx="52" cy="82" r="7" fill="#12523C" stroke="none"/><path d="M18 52h68"/>'},
 boiler:{meaning:'보일러 본체와 용량 확인',svg:box(15,23,74,65,17)+'<circle cx="39" cy="55" r="17" fill="#FFFFFF"/><circle cx="39" cy="55" r="5"/><path d="M63 39h13M63 53h13M63 67h13M30 23V10h19v13M26 88v9M77 88v9"/>'},
 gas:{meaning:'가스 공급관과 차단밸브',svg:'<g data-part="pipes"><path d="M8 46h27M8 64h27M8 38v34M69 46h27M69 64h27M96 38v34"/></g><g data-part="valve">'+box(35,35,34,40,6)+'<circle cx="52" cy="55" r="8" fill="#FFFFFF"/></g><g data-part="handwheel"><path d="M52 35V22"/><ellipse cx="52" cy="14" rx="17" ry="6" fill="#E9F5E6"/></g>'},
 cooling:{meaning:'냉동 및 저온설비',svg:'<path d="M52 8v88M14 30l76 44M14 74l76-44M40 16l12 12 12-12M40 88l12-12 12 12M16 43l17-4-3-17M88 61l-17 4 3 17M30 82l3-17-17-4M74 22l-3 17 17 4"/>'},
 law:{meaning:'적용 법령과 개별 제도',svg:box(22,10,62,85)+'<path d="M35 10v85M47 29h24M47 45h24M47 61h24M47 77h17"/>'},
 gauge:{meaning:'압력·용량 등 기기 사양 측정',svg:'<circle cx="52" cy="43" r="33" fill="#E9F5E6"/><path d="M52 76v19M35 95h34M28 43h7M69 43h7M52 19v7M52 43l16-14"/><circle cx="52" cy="43" r="4" fill="#12523C"/>'},
 submission:{meaning:'신고서류 제출 및 접수',svg:'<g data-part="tray"><path fill="#E9F5E6" d="M10 69v25h84V69"/></g><g data-part="paper"><path fill="#FFFFFF" d="M25 7h35l16 16v24H25Z"/><path d="M60 7v17h16M37 34h25"/></g><g data-part="arrow"><path d="M52 59v23M42 72l10 10 10-10"/></g>'},
 hazardous:{meaning:'위험물 보관 및 안전관리',svg:box(24,14,56,78,4)+'<path d="M24 28h56M24 77h56M42 14V7h20v7"/><path fill="#FFFFFF" d="M52 35L70 53 52 71 34 53Z"/><path d="M52 45v11M52 62h.1"/>'},
 route:{meaning:'사업장 간 이동 및 전환배치',svg:'<circle cx="21" cy="22" r="11" fill="#E9F5E6"/><circle cx="83" cy="82" r="11" fill="#E9F5E6"/><path d="M21 39v21q0 22 25 22h17M42 22h19q22 0 22 22v18M53 73l10 9-10 9"/>'},
 support:{meaning:'비상 호출과 지원 연락체계',svg:'<path fill="#E9F5E6" d="M20 12h19l8 22-13 11q9 20 25 27l12-13 22 9v19q-3 12-16 9C43 89 15 61 9 28 7 18 12 12 20 12Z"/><path d="M65 12q23 3 27 27M65 27q10 2 12 12"/>'}
};
export function registerExtraPictograms(){for(const [key,value] of Object.entries(EXTRA_PICTOGRAMS)){if(PICTOGRAMS[key])throw Error('Duplicate pictogram '+key);PICTOGRAMS[key]=value;}}
