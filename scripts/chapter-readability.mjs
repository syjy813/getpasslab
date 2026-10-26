import { parseFragment } from 'parse5';

// This runs on the authored lesson slot during static rendering. Questions,
// navigation, headings, source metadata, diagrams, formulae and code stay out.
const blockedTags = new Set(['a','code','pre','script','style','template','svg','math','figure','figcaption','h1','h2','h3','h4','h5','h6']);
const blockedClasses = /(?:^|\s)(?:katex[^\s]*|[^\s]*formula[^\s]*|fire-source-note|q-body|q-options|question[^\s]*)(?:\s|$)/;
const proseTags = new Set(['p','li','td','th']);
const inlineTags = new Set(['strong','em','b','i','span','sub','sup','small','mark']);

// Explicit reviewed expressions, not a replacement rule for every middle dot.
// Names, alternative classifications, units and numerical lists keep their dots.
export const copyRules = [
  { before:'소유자·관리자·점유자', after:'소유자, 관리자 또는 점유자', certId:'fire-safety-manager-level2', reason:'definition alternatives' },
  { before:'소방기술사·소방시설관리사', after:'소방기술사 또는 소방시설관리사', slug:'manager-qualification-appointment', reason:'alternative qualifications' },
  { before:'소방설비기사·소방설비산업기사', after:'소방설비기사 또는 소방설비산업기사', slug:'manager-qualification-appointment', reason:'alternative qualifications' },
  { before:'위험물기능장·위험물산업기사·위험물기능사', after:'위험물기능장, 위험물산업기사 또는 위험물기능사', slug:'manager-qualification-appointment', reason:'alternative qualifications' },
  { before:'소방공무원·의무소방원·의용소방대원', after:'소방공무원, 의무소방원 및 의용소방대원', slug:'basic-fire-law-terms-organization', reason:'organization members' },
  { before:'구성·운영·교육', after:'구성, 운영 및 교육', reason:'parallel duties' },
  { before:'작성·시행', after:'작성 및 시행', reason:'parallel duties' },
  { before:'기록·유지', after:'기록 및 유지', reason:'parallel duties' },
  { before:'선임·신고', after:'선임 및 신고', reason:'parallel duties' },
  { before:'점검·정비', after:'점검 및 정비', reason:'parallel maintenance actions' },
  { before:'점검·보수', after:'점검 및 보수', reason:'parallel maintenance actions' },
  { before:'잠금·표지', after:'잠금 및 표지', reason:'both isolation precautions' },
  { before:'잠금·표시', after:'잠금 및 표시', reason:'both isolation precautions' },
  { before:'연결·고정', after:'연결 및 고정', reason:'parallel securing actions' },
  { before:'유지·관리', after:'유지 및 관리', reason:'parallel management duties' },
  { before:'교육·훈련', after:'교육 및 훈련', reason:'parallel learning activities' },
  { before:'소방훈련·교육', after:'소방훈련 및 교육', reason:'parallel duties' },
  { before:'복사·이동·삭제', after:'복사, 이동 및 삭제', certId:'computer-literacy', reason:'separate file operations' },
  { before:'입력·출력', after:'입력 및 출력', certId:'computer-literacy', reason:'separate information flows' },
  { before:'인식·설정', after:'인식 및 설정', certId:'computer-literacy', reason:'separate device actions' },
  { before:'탐지·차단', after:'탐지 및 차단', certId:'computer-literacy', reason:'parallel security actions' },
  { before:'읽기·쓰기', after:'읽기 및 쓰기', certId:'computer-literacy', reason:'separate operations' },
  { before:'제조·가공된 동산', after:'제조되거나 가공된 동산', slug:'product-liability-defects', reason:'definition alternatives' },
  { before:'배선 단선·종단저항 미접속', after:'배선 단선 또는 종단저항 미접속', slug:'receiver-circuit-continuity-test', reason:'alternative causes' },
  { before:'기숙사·의료시설·노유자시설·수련시설·숙박시설', after:'기숙사, 의료시설, 노유자시설, 수련시설 또는 숙박시설', slug:'assistant-appointment-count', reason:'alternative facility types' },
  { before:'노대·부속실', after:'노대 또는 부속실', slug:'escape-stairs-special-stairs', reason:'alternative escape spaces' },
  { before:'거부·방해·기피', after:'거부, 방해 또는 기피', slug:'penalties-administrative-fines', reason:'alternative violations' },
  { before:'30V 이하 기계기구·건조한 곳', after:'30V 이하 기계기구이고 건조한 곳', slug:'grounding-exemption', reason:'joint conditions in the historical question' },
  { before:'교류 대지전압 300V 이하·건조한 곳', after:'교류 대지전압 300V 이하이고 건조한 곳', slug:'grounding-exemption', reason:'joint conditions of the incorrect statement; false label preserved' },
  { before:'정격감도전류 40mA 이하·동작시간 2초 이하 누전차단기', after:'정격감도전류 40mA 이하이며 동작시간 2초 이하인 누전차단기', slug:'grounding-exemption', reason:'joint conditions of the incorrect statement; false label preserved' },
  { before:'일용근로자·계약기간 1주 이하 기간제', after:'일용근로자 또는 계약기간 1주 이하 기간제', slug:'safety-education-hours', reason:'alternative worker categories' },
  { before:'상시·수시 간병', after:'상시 또는 수시 간병', slug:'industrial-accident-insurance', reason:'alternative care needs' },
  { before:'요양 시작 후 2년 경과·미치유·중증요양상태·취업 불가 시 휴업급여 대체', after:'요양 시작 후 2년이 지나고 미치유, 중증요양상태 및 취업 불가 조건을 모두 충족하면 휴업급여 대체', slug:'industrial-accident-insurance', reason:'all benefit conditions jointly required' },
  { before:'일정 기간·기능 제한 후 구매 유도', after:'일정 기간이나 기능을 제한한 뒤 구매 유도', slug:'software-license-types', reason:'alternative trial restrictions' },
  { before:'장치 연결·분리', after:'장치 연결 및 분리', slug:'plug-and-play-hot-swap', reason:'supported operations' },
  { before:'전원 차단·분리', after:'전원 차단 및 분리', slug:'power-off-procedure', reason:'isolation actions' },
  { before:'사용·수정·배포', after:'사용, 수정 및 배포', slug:'software-license-types', reason:'separate licensed operations' },
];

// Independently reviewed multi-condition cells. A dot inside a shared noun,
// synonym, numerical series or unit is deliberately not a generic list boundary.
export const cellLists = [
  {slug:'boiler-work-safety',before:'감압·냉각·연료 및 전원 차단·잔류에너지 제거',items:['감압','냉각','연료 및 전원 차단','잔류에너지 제거']},
  {slug:'boiler-work-safety',before:'연료 누설 차단·환기·충분한 퍼지·점화순서 준수',items:['연료 누설 차단','환기','충분한 퍼지','점화순서 준수']},
  {slug:'boiler-work-safety',before:'배관 구배·드레인·트랩 관리·밸브 천천히 조작',items:['배관 구배, 드레인 및 트랩 관리','밸브를 천천히 조작']},
  {slug:'boiler-work-safety',before:'산소·유해가스 측정·환기·감시인·구조계획',items:['산소 및 유해가스 측정','환기','감시인','구조계획']},
  {slug:'steam-traps-condensate',before:'구배·드레인·예열·밸브 천천히 조작',items:['구배','드레인','예열','밸브를 천천히 조작']},
  {slug:'vdt-contrast',before:'반사율 85%·조도 350lux·문자 휘도 400cd/m²',items:['반사율 85%','조도 350lux','문자 휘도 400cd/m²']},
  {slug:'z-score',before:'평균 10,000·표준편차 200·사용 9,600시간',items:['평균 10,000','표준편차 200','사용 9,600시간']},
  {slug:'mttf',before:'1,000개·각 100,000시간·고장 5건',items:['1,000개','각 100,000시간','고장 5건']},
  {slug:'ohms-law',before:'심실세동전류 165mA·500Ω·1초',items:['심실세동전류 165mA','500Ω','1초']},
  {slug:'charge-capacitance',before:'인체저항 5000Ω·전류 3mA·정전용량 0.1μF',items:['인체저항 5000Ω','전류 3mA','정전용량 0.1μF']},
  {slug:'combined-resistance',before:'누전전류 500mA·인체전류 10mA·인체저항 500Ω',items:['누전전류 500mA','인체전류 10mA','인체저항 500Ω']},
  {slug:'welder-efficiency',before:'아크전압 25V·아크전류 300A·내부손실 4kW',items:['아크전압 25V','아크전류 300A','내부손실 4kW']},
  {slug:'welder-duty-cycle',before:'정격사용률 10%·정격전류 500A·사용전류 250A',items:['정격사용률 10%','정격전류 500A','사용전류 250A']},
  {slug:'welder-duty-cycle',before:'정격사용률 30%·정격전류 300A·사용전류 200A',items:['정격사용률 30%','정격전류 300A','사용전류 200A']},
  {slug:'vessel-charge-amount',before:'프로판 310kg·50L·가스정수 2.35',items:['프로판 310kg','50L','가스정수 2.35']},
  {slug:'concentration-conversion',before:'CS₂ 1.25vol%·분자량 76.1·20℃',items:['CS₂ 1.25vol%','분자량 76.1','20℃']},
  {slug:'concentration-conversion',before:'CS₂ 44vol%·분자량 76.1·20℃',items:['CS₂ 44vol%','분자량 76.1','20℃']},
  {slug:'frequency-rate',before:'80건·1,000명·주 48시간·52주·결근 3%',items:['80건','1,000명','주 48시간','52주','결근 3%']},
  {slug:'sling-wire-tension',before:'하중 3kN·2줄·전체 각도 55°',items:['하중 3kN','2줄','전체 각도 55°']},
  {slug:'fire-emergency-plan-contents',before:'위치·구조·용도·수용인원·소방시설',items:['위치','구조','용도','수용인원','소방시설']},
  {slug:'fire-emergency-plan-contents',before:'자위소방대·초기대응체계·업무 분담',items:['자위소방대','초기대응체계','업무 분담']},
  {slug:'fire-emergency-plan-contents',before:'대상·일정·방법·결과 관리',items:['대상','일정','방법','결과 관리']},
  {slug:'fire-emergency-plan-contents',before:'경로·집결지·유도 방법·피난약자 지원',items:['경로','집결지','유도 방법','피난약자 지원']},
  {slug:'fire-emergency-plan-contents',before:'발견·신고·초기소화·소방대 인계 등',items:['발견','신고','초기소화','소방대 인계 등']},
  {slug:'heat-exchanger-inspection',before:'도장의 노후 상태·보온재와 보냉재 파손·플랜지와 용접부 누출·기초볼트 체결',items:['도장의 노후 상태','보온재와 보냉재 파손','플랜지와 용접부 누출','기초볼트 체결']},
  {slug:'press-pre-work-checklist',before:'1행정 1정지기구·급정지장치·비상정지장치 기능',items:['1행정 1정지기구','급정지장치','비상정지장치 기능']},
  {"slug":"fire-facility-categories","before":"소화기구·옥내소화전·옥외소화전·스프링클러·물분무등소화설비","items":["소화기구","옥내소화전","옥외소화전","스프링클러","물분무등소화설비"]},
  {"slug":"fire-facility-categories","before":"비상경보·자동화재탐지·자동화재속보·가스누설경보기 등","items":["비상경보","자동화재탐지","자동화재속보","가스누설경보기 등"]},
  {"slug":"fire-facility-categories","before":"피난기구·인명구조기구·유도등·유도표지·비상조명등 등","items":["피난기구","인명구조기구","유도등","유도표지","비상조명등 등"]},
  {"slug":"fire-facility-categories","before":"제연·연결송수관·연결살수·비상콘센트·무선통신보조 등","items":["제연","연결송수관","연결살수","비상콘센트","무선통신보조 등"]},
  {"slug":"extinguisher-layout-count","before":"공연장·집회장·관람장·문화재·장례식장·의료시설 등","items":["공연장","집회장","관람장","문화재","장례식장","의료시설 등"]},
  {"slug":"extinguisher-layout-count","before":"근린생활·판매·숙박·공장·창고·노유자·업무시설 등","items":["근린생활","판매","숙박","공장","창고","노유자","업무시설 등"]},
  {"slug":"flame-retardant-target-test","before":"커튼·블라인드·카펫·전시용 합판·무대용 합판·섬유판 등","items":["커튼","블라인드","카펫","전시용 합판","무대용 합판","섬유판 등"]},
  {"slug":"computer-classification","before":"슈퍼컴퓨터·메인프레임·퍼스널 컴퓨터","items":["슈퍼컴퓨터","메인프레임","퍼스널 컴퓨터"]},
  {"slug":"quantitative-assessment-items","before":"취급물질·조작·화학설비 용량·온도·압력","items":["취급물질","조작","화학설비 용량","온도","압력"]},
  {"slug":"oxygen-consumption","before":"맥박수·폐활량·산소소비량·RMR·근전도","items":["맥박수","폐활량","산소소비량","RMR","근전도"]},
  {"slug":"electrical-fire-causes","before":"단락·누전·과전류·접촉부 과열·스파크·절연열화·트래킹","items":["단락","누전","과전류","접촉부 과열","스파크","절연열화","트래킹"]},
  {"slug":"spontaneous-combustion","before":"통풍·온도·퇴적량·표면적·공기 접촉 관리","items":["통풍","온도","퇴적량","표면적","공기 접촉 관리"]},
  {"slug":"soil-collapse-prevention","before":"사면·법면의 경사 및 기울기 증가, 절토·성토 높이 증가, 공사에 의한 진동·반복하중, 지표수·지하수의 침투에 의한 토사 중량 증가, 지진·차량·구조물의 하중 작용, 토사·암석의 혼합층 두께","items":["사면·법면의 경사 및 기울기 증가","절토·성토 높이 증가","공사에 의한 진동·반복하중","지표수·지하수의 침투에 의한 토사 중량 증가","지진·차량·구조물의 하중 작용","토사·암석의 혼합층 두께"]},
  {"slug":"soil-collapse-prevention","before":"절토 사면의 토질·암질, 성토 사면의 토질 구성·분포, 토석의 강도 저하","items":["절토 사면의 토질·암질","성토 사면의 토질 구성·분포","토석의 강도 저하"]},
  {"slug":"herzberg-two-factor","before":"급여·감독·회사 정책·작업조건·안전","items":["급여","감독","회사 정책","작업조건","안전"]},
  {"slug":"accident-occurrence-theories","before":"작업의 어려움·설비 결함·집중 곤란 환경·심신의 근심","items":["작업의 어려움","설비 결함","집중 곤란 환경","심신의 근심"]},
  {"slug":"accident-occurrence-theories","before":"작업의 어려움·기계설비의 결함·심신의 근심","items":["작업의 어려움","기계설비의 결함","심신의 근심"]},
  {"slug":"welding-defects","before":"기공·슬래그 혼입·용입불량·내부 균열","items":["기공","슬래그 혼입","용입불량","내부 균열"]},
  {"slug":"boiler-safety-devices","before":"아웃트리거·언로드밸브·과부하방지장치","items":["아웃트리거","언로드밸브","과부하방지장치"]},
  {"slug":"overload-prevention-device","before":"경보·권상 정지·위험 방향 동작 제한","items":["경보","권상 정지","위험 방향 동작 제한"]},
  {"slug":"crane-safety-devices","before":"크레인·이동식 크레인·리프트·곤돌라·승강기","items":["크레인","이동식 크레인","리프트","곤돌라","승강기"]},
  {"slug":"crane-safety-devices","before":"승객용·화물용·소형화물용 엘리베이터·에스컬레이터","items":["승객용·화물용·소형화물용 엘리베이터","에스컬레이터"]},
  {"slug":"press-safety-devices","before":"안전금형·방호울·전용 프레스·자동 프레스","items":["안전금형","방호울","전용 프레스","자동 프레스"]},
];

const attrs = node => Object.fromEntries((node.attrs || []).map(a=>[a.name,a.value]));
const text = node => node.nodeName==='#text' ? node.value : (node.childNodes || []).map(text).join('');
const children = node => node.childNodes || [];
function ancestors(node) { const result=[]; for(let p=node.parentNode;p;p=p.parentNode)result.push(p); return result; }
function protectedNode(node) {
  return [node,...ancestors(node)].some(n=>blockedTags.has(n.tagName) || blockedClasses.test(attrs(n).class || '') || attrs(n)['data-chapter-no-format']!==undefined);
}
function inParentheses(raw, offset) {
  // Unit expressions and parenthesized labels are not sentence boundaries.
  let depth=0;
  for(const char of raw.slice(0,offset)){if('([{'.includes(char))depth++;if(')]}'.includes(char))depth--;}
  return depth>0;
}
function operatorNeighbours(node) {
  const siblings=children(node.parentNode),i=siblings.indexOf(node);
  return [siblings[i-1],siblings[i+1]].every(n=>n?.tagName==='code' && /^[\s:,+*/<>=&-]+$/.test(text(n)));
}
function cellFor(node) { return ancestors(node).find(n=>n.tagName==='td'); }
function simpleCell(cell) {
  const visit=n=>children(n).every(c=>c.nodeName==='#text' || c.tagName==='br' || (inlineTags.has(c.tagName) && !attrs(c).id && !protectedNode(c) && visit(c)));
  return !protectedNode(cell) && visit(cell);
}
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function renderReviewedCell(cell, rule) {
  const emphasis=[];
  function collect(n){if(n.tagName==='strong'||n.tagName==='em')emphasis.push({tag:n.tagName,text:text(n)});for(const c of children(n))collect(c);}
  collect(cell);
  const allBold=emphasis.some(e=>e.tag==='strong' && e.text===rule.before);
  return '<ul class="chapter-cell-items">'+rule.items.map(item=>{
    let html=escape(item);
    if(allBold)html='<strong>'+html+'</strong>';
    else for(const e of emphasis.sort((a,b)=>b.text.length-a.text.length))if(e.text && item.includes(e.text))html=html.replace(escape(e.text),`<${e.tag}>${escape(e.text)}</${e.tag}>`);
    return '<li>'+html+'</li>';
  }).join('')+'</ul>';
}

export function formatChapterHtml(html, scope={}) {
  const root=parseFragment(html,{sourceCodeLocationInfo:true});
  const edits=[],cells=new Set();
  function walk(node) {
    if(protectedNode(node))return;
    if(node.tagName==='td' && simpleCell(node)){
      const rule=cellLists.find(r=>r.slug===scope.slug && r.before===text(node).trim());
      if(rule){
        edits.push({start:node.sourceCodeLocation.startTag.endOffset,end:node.sourceCodeLocation.endTag.startOffset,value:renderReviewedCell(node,rule)});
        return;
      }
    }
    if(node.nodeName==='#text' && node.sourceCodeLocation && ancestors(node).some(n=>proseTags.has(n.tagName))){
      const at=node.sourceCodeLocation.startOffset;
      const raw=html.slice(at,node.sourceCodeLocation.endOffset);
      for(const rule of copyRules){
        if((rule.slug && rule.slug!==scope.slug)||(rule.certId && rule.certId!==scope.certId))continue;
        for(let index=raw.indexOf(rule.before);index>=0;index=raw.indexOf(rule.before,index+rule.before.length)){
          edits.push({start:at+index,end:at+index+rule.before.length,value:rule.after});
        }
      }
      for(const match of raw.matchAll(/ · /g)){
        if(inParentheses(raw,match.index) || operatorNeighbours(node))continue;
        const cell=cellFor(node);
        if(cell && simpleCell(cell)){
          const stack=ancestors(node).slice(0,ancestors(node).indexOf(cell));
          const close=stack.map(n=>`</${n.tagName}>`).join('');
          const open=[...stack].reverse().map(n=>html.slice(n.sourceCodeLocation.startTag.startOffset,n.sourceCodeLocation.startTag.endOffset)).join('');
          edits.push({start:at+match.index,end:at+match.index+match[0].length,value:close+'</li><li>'+open});
          cells.add(cell);
        }else edits.push({start:at+match.index,end:at+match.index+match[0].length,value:'<br data-chapter-sentence-break>'});
      }
    }
    for(const child of children(node))walk(child);
  }
  walk(root);
  for(const cell of cells){
    edits.push({start:cell.sourceCodeLocation.startTag.endOffset,end:cell.sourceCodeLocation.startTag.endOffset,value:'<ul class="chapter-cell-items"><li>'});
    edits.push({start:cell.sourceCodeLocation.endTag.startOffset,end:cell.sourceCodeLocation.endTag.startOffset,value:'</li></ul>'});
  }
  edits.sort((a,b)=>b.start-a.start || b.end-a.end);
  let previous=html.length+1;
  for(const edit of edits){
    if(edit.end>previous)throw new Error('Overlapping chapter readability edits: '+scope.slug);
    html=html.slice(0,edit.start)+edit.value+html.slice(edit.end);previous=edit.start;
  }
  return html;
}
