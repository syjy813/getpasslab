import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const questions = JSON.parse(
  readFileSync(new URL('../src/data/questions/energy-management.json', import.meta.url), 'utf8'),
);

const pattern = (label, weight, source) => ({ label, weight, re: new RegExp(source, 'i') });

const topics = [
  {
    code: 'energy-laws-inspection',
    title: '에너지 관계법규·검사',
    currentSlug: 'energy-laws-and-inspection',
    patterns: [
      pattern('에너지이용합리화법', 10, '에너지\\s*이용\\s*합리화법|에너지이용\\s*합리화법'),
      pattern('에너지법', 9, '에너지법|에너지기본법|지역에너지계획|에너지\\s*수급안정'),
      pattern('저탄소·녹색성장', 9, '저탄소|녹색성장'),
      pattern('신재생에너지', 9, '신[·ㆍ ]?재생에너지'),
      pattern('신재생에너지 표기 변형', 9, '신[·ㆍ\\s]*재생\\s*에너지|신에너지\\s*및\\s*재생에너지'),
      pattern('법령·행정', 6, '법률|법령|시행령|시행규칙|대통령령|부령|산업통상|지식경제부|시[·ㆍ ]?도지사|벌칙|과태료'),
      pattern('효율관리', 6, '효율관리|고효율\\s*에너지|에너지소비효율|대기전력'),
      pattern('에너지사용·진단', 5, '에너지다소비|에너지사용량|에너지진단|에너지절약|에너지사용계획|에너지저장'),
      pattern('자원순환', 8, '자원순환|폐기물의\\s*발생'),
      pattern('열사용기자재', 7, '열사용기\\s*자재|열사용기자재|검사대상기기|시공업자단체'),
      pattern('검사 행정', 6, '설치[·ㆍ\\s]*검사|설치검사|계속사용검사|개조검사|재사용검사|검사증|검사기관|검사기준|검사에 합격|철금속가열로'),
      pattern('검사 성능 기준', 6, '보일러의\\s*소음|외기의\\s*온도차|dB\\s*이하'),
      pattern('가열로 기준', 9, '철금속가열로'),
      pattern('에너지원단위', 8, '목표에너지원단위|에너지원단위'),
    ],
  },
  {
    code: 'heating-load-radiators',
    title: '난방부하·방열기 계산',
    currentSlug: 'boiler-installation-combustion',
    patterns: [
      pattern('난방부하', 9, '난방부하|열손실\\s*열량|상당방열면적|표준방열량|방열면적'),
      pattern('방열기 계산', 10, '방열기.*(방열량|온도|계수|면적)|방열량.*방열기'),
      pattern('정격출력·부하', 5, '정격출력|급탕부하|배관부하|예열부하'),
      pattern('난방 계산', 9, '난방부하.*방열면적|방열계수|방열기의\\s*방열량'),
      pattern('방열기 구조', 8, '방열기의\\s*구조|방열기의\\s*종류'),
      pattern('실내 평균온도', 5, '실내\\s*평균온도|호흡선|천장\\s*높이'),
    ],
  },
  {
    code: 'heating-systems',
    title: '증기·온수·복사난방',
    currentSlug: 'boiler-piping-insulation',
    patterns: [
      pattern('난방 방식', 9, '증기난방|온수난방|복사난방|온수온돌|난방법|난방설비'),
      pattern('지역·급탕 난방', 8, '지역난방|온수식\\s*난방|급탕설비|급탕의\\s*온도'),
      pattern('환수 방식', 7, '중력환수|기계환수|진공환수|환수식'),
      pattern('응축수 환수 계통', 8, '응축수\\s*환수방식|응축수\\s*환수\\s*방식'),
      pattern('팽창탱크', 7, '팽창탱크'),
      pattern('방열기', 3, '방열기'),
      pattern('난방 배관', 4, '난방.*배관|배관.*난방'),
      pattern('난방 일반', 7, '난방방식|온수\\s*순환\\s*방법|순환펌프\\s*설치'),
    ],
  },
  {
    code: 'steam-traps-condensate',
    title: '증기트랩·응축수 환수',
    currentSlug: 'boiler-piping-insulation',
    patterns: [
      pattern('증기트랩', 10, '증기\\s*트랩|트랩의|트랩을|트랩에|트랩으로|트랩장치|버킷\\s*트랩|플로트\\s*트랩|디스크형\\s*트랩|열동식\\s*트랩'),
      pattern('응축수', 7, '응축수|드레인\\s*포켓|드레인\\s*배출|하트포드|리프트\\s*피팅'),
      pattern('환수 계통', 9, '진공환수식|응축수\\s*환수방식|응축수\\s*탱크'),
      pattern('워터해머', 7, '워터\\s*해머|수격작용'),
    ],
  },
  {
    code: 'piping-fittings-valves',
    title: '배관·이음쇠·밸브',
    currentSlug: 'boiler-piping-insulation',
    patterns: [
      pattern('배관', 5, '배관|증기관|급수관|환수관|주관|분기관|관경|관의\\s*기울기'),
      pattern('강관 규격', 7, '강관|SPP|SPPS|SPPH|SPLT|KS\\s*규격'),
      pattern('이음쇠', 8, '이음쇠|플랜지|엘보|티이|소켓|리듀[서셔]|슬리브|유니언|캡|벤드'),
      pattern('밸브 일반', 8, '글로브\\s*밸브|게이트\\s*밸브|체크\\s*밸브|감압\\s*밸브|공기빼기\\s*밸브|급수밸브|주증기\\s*밸브|플러그\\s*밸브|역류를\\s*방지'),
      pattern('배관 이경관', 9, '편심\\s*리듀[서셔]|이경관|지름이\\s*다른\\s*관'),
      pattern('패킹·가스켓', 7, '글랜드\\s*패킹|패킹|가스켓'),
      pattern('신축·지지', 6, '신축이음|신축\\s*이음|루프형|벨로즈|배관\\s*지지|행거'),
      pattern('배관 공구·작업', 8, '나사절삭기|파이프\\s*커터|리머|거스러미|파이프\\s*밴더|경납땜|동관\\s*끝|나팔\\s*모양|가스관의\\s*누설검사'),
      pattern('배관 표시·굽힘', 6, '유체의\\s*종류를\\s*나타내는\\s*기호|중심곡선|곡률\\s*반지름'),
      pattern('배관 가공', 8, '가스절단|홈\\s*조인트|그루브|관\\s*끝을\\s*가공'),
    ],
  },
  {
    code: 'insulation-materials',
    title: '보온·단열재',
    currentSlug: 'boiler-piping-insulation',
    patterns: [
      pattern('보온재', 10, '보온재|보온\\s*재료|보온공사'),
      pattern('단열', 8, '단열|열전도율'),
      pattern('보온재 종류', 7, '규조토|암면|탄산마그네슘|유리면|기포성수지|펄라이트|석면'),
      pattern('글라스울', 10, '글라스울|glass\\s*wool'),
      pattern('배관 단열', 9, '증기관이나\\s*온수관.*단열|불필요한\\s*방열을\\s*방지'),
      pattern('방수처리', 4, '방수처리|방수몰탈|루핑'),
    ],
  },
  {
    code: 'water-treatment-corrosion',
    title: '수질관리·스케일·부식',
    currentSlug: 'boiler-water-treatment',
    patterns: [
      pattern('수처리', 10, '수처리|급수처리|보일러수|관수\\s*처리|수질'),
      pattern('외처리', 10, '외처리|외부처리|현탁질\\s*고형물'),
      pattern('스케일', 9, '스케일|슬러지|경도성분|연화|이온\\s*교환|탈기기|용존산소|pH'),
      pattern('캐리오버', 8, '[캐케]리오버|carry\\s*over|프라이밍|포밍'),
      pattern('부식', 8, '부식|가성취화|알칼리\\s*취화|점식|구식|그루빙|고온부식|저온부식'),
      pattern('분출·농축', 5, '보일러수\\s*분출|관수\\s*분출|농축을\\s*방지|블로다운'),
      pattern('세관·세정', 9, '세관작업|산세정|소다보링|Soda\\s*Boiling|용해촉진제'),
    ],
  },
  {
    code: 'operation-maintenance-preservation',
    title: '기동·운전·정지·보존',
    currentSlug: 'boiler-operation-maintenance',
    patterns: [
      pattern('기동·점화', 7, '기동|점화조작|점화\\s*전|점화할|프리퍼지|퍼지'),
      pattern('수동점화', 10, '수동조작\\s*점화|수동점화'),
      pattern('운전 조치', 9, '운전\\s*중.*조치|비상\\s*정지|보일러\\s*조종자의\\s*직무|점화시의\\s*주의사항'),
      pattern('정상운전·송기', 6, '정상운전|운전\\s*중|송기|증기\\s*송기|연소\\s*조작'),
      pattern('정지', 8, '운전정지|운전\\s*정지|정지\\s*순서|소화\\s*순서'),
      pattern('보존', 9, '보존법|만수보존|건조보존|소다만수|질소가스봉입|질소봉입|휴지기간|휴지\\s*중|장기간.*보존'),
      pattern('보일러 보존', 8, '보일러\\s*보존'),
      pattern('점검·정비', 4, '점검|정비|보수|일상보전|연간계획'),
      pattern('취급자·관리', 7, '보일러\\s*취급자|취급\\s*책임자|안전관리\\s*목적'),
      pattern('운전 취급', 8, '가동\\s*중인\\s*보일러의\\s*취급|운전\\s*중\\s*취급|보일러의\\s*안전관리상'),
      pattern('수트블로잉', 5, '수트\\s*블로|그을음\\s*제거'),
    ],
  },
  {
    code: 'failures-accidents-safety',
    title: '고장·사고·작업안전',
    currentSlug: 'boiler-work-safety',
    patterns: [
      pattern('사고·안전', 8, '보일러\\s*사고|사고원인|사고의\\s*원인|작업안전|안전작업|재해'),
      pattern('폭발·화재', 8, '가스폭발|보일러\\s*폭발|화재|질식|화상'),
      pattern('연소 이상', 6, '역화|실화|불착화|점화불량|연소\\s*불안정|블로우\\s*오프'),
      pattern('본체 손상', 7, '팽출|압궤|브리스터|라미네이션|균열|파열|과열\\s*방지'),
      pattern('취급상 사고', 6, '저수위\\s*운전|사용압력초과|취급상의'),
      pattern('산업안전 표시', 9, '안전\\s*보건표지|유해\\s*위험경고'),
      pattern('가스 폭발 예방', 9, '가스보일러.*가스폭발|가스폭발.*예방'),
      pattern('연소 불안정', 8, '화염이\\s*점멸|연소\\s*불안정|실화가\\s*발생'),
    ],
  },
  {
    code: 'automatic-control-interlocks',
    title: '자동제어·인터록',
    currentSlug: 'boiler-control-systems',
    patterns: [
      pattern('자동제어', 10, '자동제어|자동\\s*제어'),
      pattern('피드백·목표값', 10, '피드백\\s*제어|피드백제어|목표\\s*값|제어목표량|동작신호|조작신호'),
      pattern('제어동작', 8, '제어동작|비례동작|적분동작|미분동작|2위치\\s*동작|다위치\\s*동작|PID|PI\\s*제어'),
      pattern('제어량·조작량', 8, '제어량|조작량|시퀀스|신호전송|신호전달'),
      pattern('수위·압력 제어', 6, '수위제어|압력제어|온도제어|연소제어|ACC|FWC|보일러\\s*판넬'),
      pattern('급수 3요소 제어', 10, '급수제어|급수\\s*제어|3요소식|3요소'),
      pattern('공기 연료 제어', 9, '공기-연료제어|공기량\\s*조절방법'),
      pattern('인터록', 9, '인터록|연동장치'),
    ],
  },
  {
    code: 'safety-devices',
    title: '안전장치·연소안전',
    currentSlug: 'boiler-protection-devices',
    patterns: [
      pattern('안전장치', 9, '안전장치|과압방지\\s*안전장치'),
      pattern('안전밸브·방출밸브', 9, '안전밸브|방출밸브|방출관'),
      pattern('안전밸브 계산·규격', 10, '안전밸브.*(?:단면적|크기|호칭지름)|저양정식\\s*안전밸브'),
      pattern('저수위 보호', 9, '저수위안전|저수위\\s*안전|고저수위\\s*경보|저수위\\s*경보|연료차단'),
      pattern('연료차단 보호', 10, '자동연료차단|긴급히\\s*연료를\\s*차단'),
      pattern('수위경보기', 9, '수위\\s*경보기|수위경보기'),
      pattern('온도제한기', 9, '온수온도제한기|온도제한기'),
      pattern('화염 감시', 8, '화염검출기|화염\\s*검출기|플래임로드|플레임로드|플래임아이|프로텍터\\s*릴레이'),
      pattern('압력 보호', 6, '압력조절기|압력제한\\s*스위치|최고사용압력.*(차단|경보)'),
    ],
  },
  {
    code: 'instruments-accessories',
    title: '계측·부속장치',
    currentSlug: 'boiler-accessory-equipment',
    patterns: [
      pattern('수면계', 10, '수면계|수위계|수위검출기|수주관'),
      pattern('압력·온도·유량계', 8, '압력계|온도계|유량계|계측기'),
      pattern('온도계 설치', 9, '온도계를\\s*설치|온도계의\\s*설치'),
      pattern('가스미터·액면계', 9, '가스미터|액면계'),
      pattern('부속장치', 7, '부속장치|부속품|부대장치'),
      pattern('분출장치', 9, '분출밸브|분출관|분출장치'),
      pattern('수트블로워', 9, '[수슈]트\\s*블로|soot\\s*blower|매연분출장치'),
    ],
  },
  {
    code: 'auxiliary-feedwater-equipment',
    title: '급수·부대설비',
    currentSlug: 'boiler-auxiliary-equipment',
    patterns: [
      pattern('급수펌프', 9, '급수\\s*펌프|급수펌프|웨어\\s*펌프|워싱턴\\s*펌프|인젝터'),
      pattern('펌프', 5, '원심펌프|기어\\s*펌프|볼류트\\s*펌프|디퓨[저져]\\s*펌프|왕복\\s*펌프'),
      pattern('절탄기', 11, '절탄기|이코노마이저'),
      pattern('공기예열기', 8, '공기예열기'),
      pattern('오일프리히터', 10, '오일프리히터|오일\\s*프리히터|오일예열기|기름예열기'),
      pattern('과열·재열', 9, '과열기|재열기|감온기'),
      pattern('급수장치', 7, '급수장치|급수탱크|급수예열기'),
      pattern('펌프 현상', 8, '캐비테이션|공동현상|왕복동식\\s*펌프'),
      pattern('증기 부대설비', 6, '증기분리기|기수분리기|축열기|감압장치'),
      pattern('연료 공급 계통', 8, '연료공급계통|연료\\s*공급\\s*계통'),
    ],
  },
  {
    code: 'environmental-pollution-control',
    title: '집진·환경설비',
    currentSlug: 'boiler-accessory-equipment',
    patterns: [
      pattern('집진장치', 10, '집진장치|집진기|집전기|사이클론|스크러버|백필터|전기집진'),
      pattern('분진·매연', 7, '분진|매연|그을음|먼지\\s*포집'),
      pattern('매연 계측', 9, '링겔만\\s*농도표'),
      pattern('대기오염', 8, '대기오염|황산화물|질소산화물|SOx|NOx'),
      pattern('집진 방식', 9, '충전탑|집진법|세정식\\s*집진'),
      pattern('자원순환 환경', 5, '자원순환산업'),
    ],
  },
  {
    code: 'efficiency-output-heat-balance',
    title: '효율·증발량·열정산',
    currentSlug: 'boiler-efficiency-heat-balance',
    patterns: [
      pattern('보일러 효율', 10, '보일러\\s*효율|열효율|연소효율|전열면\\s*효율'),
      pattern('열정산', 10, '열정산|손실열|열손실'),
      pattern('증발량', 11, '상당증발량|실제증발량|환산증발량|증발계수|증발량'),
      pattern('보일러마력', 8, '보일러\\s*(?:\\d+(?:\\.\\d+)?\\s*)?마력|보일러마력'),
      pattern('용량 환산', 8, '온수보일러\\s*용량|온수\\s*보일러의\\s*용량|전기\\s*온수보일러\\s*용량'),
      pattern('출력·부하율', 6, '정격용량|정격출력|보일러\\s*출력|부하율'),
      pattern('성능시험', 5, '효율\\s*시험|성능시험|열정산\\s*시험'),
      pattern('보일러 용량 계산', 9, '보일러의\\s*용량|정격압력.*보일러의\\s*용량'),
    ],
  },
  {
    code: 'draft-flue-gas',
    title: '통풍·연도·굴뚝',
    currentSlug: 'boiler-installation-combustion',
    patterns: [
      pattern('통풍', 9, '통풍|통풍력|통풍압|압입통풍|흡입통풍|평형통풍|자연통풍'),
      pattern('송풍기', 8, '송풍기|유인통풍기|통풍기'),
      pattern('연도·굴뚝', 7, '연도|연돌|굴뚝|댐퍼'),
      pattern('풍량', 5, '풍량|노내압'),
    ],
  },
  {
    code: 'burners-furnaces-atomization',
    title: '버너·화격자·연소장치',
    currentSlug: 'boiler-installation-combustion',
    patterns: [
      pattern('버너', 10, '버너|가스버너|유류\\s*버너'),
      pattern('분무·미립화', 8, '분무|미립화|무화|분사각도|유압\\s*분무'),
      pattern('노즐', 6, '연료\\s*노즐|분무\\s*노즐|증기노즐|혼합노즐|분출노즐'),
      pattern('화격자·연소장치', 8, '화격자|연소장치|스토커|미분탄\\s*연소|보염장치'),
      pattern('연소실·노', 4, '연소실|노벽|노내'),
    ],
  },
  {
    code: 'combustion-air-calculation',
    title: '연소·공기비·배기가스 계산',
    currentSlug: 'boiler-installation-combustion',
    patterns: [
      pattern('연소 계산', 9, '이론공기|공기비|과잉공기|연소가스량|배기가스량|이론\\s*산소|연소\\s*계산'),
      pattern('연소 반응', 7, '완전연소|불완전연소|연소반응|연소에\\s*필요|연소의\\s*필수'),
      pattern('연소 속도', 8, '연소의\\s*속도|맥동연소'),
      pattern('배기가스 분석', 7, '오르자트|Orsat|CO2|CO₂|산소농도|배기가스\\s*분석'),
      pattern('연소', 3, '연소'),
      pattern('발열량 계산', 5, '고위발열량|저위발열량|듀롱|발열량.*계산'),
    ],
  },
  {
    code: 'fuel-properties',
    title: '연료 특성·발열량',
    currentSlug: 'boiler-installation-combustion',
    patterns: [
      pattern('연료 종류', 8, '고체연료|액체\\s*연료|기체\\s*연료|보일러\\s*연료|연료의\\s*구비조건'),
      pattern('석탄', 8, '석탄|고정탄소|휘발분|연료비|회분'),
      pattern('유류·중유', 7, '중유|경유|등유|유류|기름의\\s*점도|연료유'),
      pattern('가스 연료', 7, '도시가스|LNG|LPG|기체연료|가스연료'),
      pattern('가연성 성분', 9, '가연성가스|가연\\s*성분|가연성분|천연가스의\\s*비중'),
      pattern('인화·발화', 8, '인화점|발화점|착화온도|연소점'),
      pattern('발열량', 6, '발열량|고위발열량|저위발열량'),
      pattern('연료 성분', 5, '수분|회분|황분|고정탄소|원소분석|공업분석'),
    ],
  },
  {
    code: 'boiler-types-construction',
    title: '보일러 형식·구조·재료',
    currentSlug: 'boiler-operation-basics',
    patterns: [
      pattern('보일러 형식', 9, '수관식|노통연관식|연관식|노통식|주철제\\s*보일러|관류식|열매체식|전기보일러|폐열보일러'),
      pattern('내분·외분식', 9, '내분식|외분식'),
      pattern('형식 고유명', 8, '다쿠마|다꾸마|라몽트|벨록스|벤슨|가르베|야로우|하우덴|코크란|스코치'),
      pattern('보일러 구조', 6, '보일러\\s*동체|드럼|전열면적|수관|연관|노통|관판|스테이|수부|증기부'),
      pattern('보일러 분류', 9, '매체별\\s*분류|보일러의\\s*분류'),
      pattern('급수내관·수위', 7, '급수내관|안전\\s*저수면|보일러\\s*수위'),
      pattern('특수 전열관', 9, '갤러웨이\\s*관|galloway'),
      pattern('설치 구조', 7, '보일러를\\s*옥내에\\s*설치|설치\\s*시공\\s*기준'),
      pattern('재료·제작', 6, '강판|주철|리벳|용접|인장강도|허용응력|동판|재료'),
      pattern('수압시험', 5, '수압시험'),
      pattern('최고사용압력', 3, '최고사용압력'),
    ],
  },
  {
    code: 'heat-steam-thermodynamics',
    title: '열·증기·열역학 기초',
    currentSlug: 'boiler-operation-basics',
    patterns: [
      pattern('증기 상태', 9, '포화증기|과열증기|습증기|건포화|증기\\s*건도|건조도|포화수'),
      pattern('엔탈피·잠열', 9, '엔탈피|현열|잠열|증발잠열|숨은열'),
      pattern('열역학 상태변화', 8, '상태변화|등온변화|등압변화|정압변화|단열변화|정적변화'),
      pattern('비열·열량', 7, '비열|열량.*온도|온도.*열량|혼합.*온도'),
      pattern('열·일 단위 환산', 9, '열량\\(에너지\\)의\\s*단위|열의\\s*일당량|일을\\s*열량으로\\s*환산|열량을\\s*전부\\s*일로|kgf[·\\s]*m'),
      pattern('동력·열량 환산', 8, '마력\\(PS\\).*열량|기관.*일량.*열량'),
      pattern('열전달', 9, '열전달|열의\\s*이동\\s*현상|열만\\s*이동'),
      pattern('기체 법칙', 7, '표준상태|기체의\\s*용적|보일.*샤를|이상기체'),
      pattern('압력·온도 기초', 7, '절대압력|게이지압력|대기압|섭씨|화씨|압력(?:\\(壓力\\))?에\\s*대한|압력의\\s*단위|임계압력|증기압|기화하는\\s*현상'),
      pattern('전열 가열 계산', 7, '전열기|전기\\s*온수보일러'),
    ],
  },
];

// 자동 분류에서 low이거나 그림 확인이 필요했던 문항을 교사용 원본 PDF와
// 직접 대조한 최종 주제다. 자동 점수·신뢰도는 수정하지 않고 별도 필드로 보존한다.
const pdfReviewedTopics = new Map([
  ['20100131_006', 'draft-flue-gas'],
  ['20100131_036', 'heating-load-radiators'],
  ['20100328_007', 'burners-furnaces-atomization'],
  ['20100328_052', 'safety-devices'],
  ['20100711_006', 'efficiency-output-heat-balance'],
  ['20100711_045', 'heating-systems'],
  ['20101003_006', 'efficiency-output-heat-balance'],
  ['20101003_045', 'heating-systems'],
  ['20110213_025', 'auxiliary-feedwater-equipment'],
  ['20110213_035', 'operation-maintenance-preservation'],
  ['20110417_016', 'safety-devices'],
  ['20110417_042', 'operation-maintenance-preservation'],
  ['20110731_005', 'piping-fittings-valves'],
  ['20110731_027', 'automatic-control-interlocks'],
  ['20110731_029', 'auxiliary-feedwater-equipment'],
  ['20110731_045', 'operation-maintenance-preservation'],
  ['20110731_049', 'operation-maintenance-preservation'],
  ['20110731_052', 'operation-maintenance-preservation'],
  ['20110731_054', 'safety-devices'],
  ['20110731_056', 'energy-laws-inspection'],
  ['20111009_032', 'operation-maintenance-preservation'],
  ['20111009_055', 'energy-laws-inspection'],
  ['20120212_012', 'auxiliary-feedwater-equipment'],
  ['20120212_016', 'draft-flue-gas'],
  ['20120212_021', 'piping-fittings-valves'],
  ['20120212_028', 'failures-accidents-safety'],
  ['20120212_040', 'failures-accidents-safety'],
  ['20120408_007', 'draft-flue-gas'],
  ['20120408_020', 'efficiency-output-heat-balance'],
  ['20120408_028', 'piping-fittings-valves'],
  ['20120408_043', 'operation-maintenance-preservation'],
  ['20120722_005', 'auxiliary-feedwater-equipment'],
  ['20120722_052', 'energy-laws-inspection'],
  ['20121020_006', 'instruments-accessories'],
  ['20121020_022', 'operation-maintenance-preservation'],
  ['20121020_023', 'operation-maintenance-preservation'],
  ['20121020_042', 'piping-fittings-valves'],
  ['20121020_052', 'efficiency-output-heat-balance'],
  ['20130127_004', 'auxiliary-feedwater-equipment'],
  ['20130127_005', 'fuel-properties'],
  ['20130127_008', 'efficiency-output-heat-balance'],
  ['20130127_043', 'operation-maintenance-preservation'],
  ['20130414_012', 'environmental-pollution-control'],
  ['20130414_023', 'piping-fittings-valves'],
  ['20130414_024', 'piping-fittings-valves'],
  ['20130414_025', 'operation-maintenance-preservation'],
  ['20130414_026', 'operation-maintenance-preservation'],
  ['20130414_047', 'water-treatment-corrosion'],
  ['20130414_057', 'heat-steam-thermodynamics'],
  ['20130721_007', 'operation-maintenance-preservation'],
  ['20130721_044', 'piping-fittings-valves'],
  ['20130721_057', 'efficiency-output-heat-balance'],
  ['20131012_030', 'water-treatment-corrosion'],
  ['20131012_043', 'operation-maintenance-preservation'],
  ['20140126_017', 'auxiliary-feedwater-equipment'],
  ['20140126_023', 'efficiency-output-heat-balance'],
  ['20140126_039', 'burners-furnaces-atomization'],
  ['20140126_045', 'steam-traps-condensate'],
  ['20140406_002', 'operation-maintenance-preservation'],
  ['20140406_014', 'draft-flue-gas'],
  ['20140406_020', 'failures-accidents-safety'],
  ['20140406_029', 'insulation-materials'],
  ['20140406_031', 'efficiency-output-heat-balance'],
  ['20140406_047', 'boiler-types-construction'],
  ['20140720_041', 'piping-fittings-valves'],
  ['20141011_010', 'auxiliary-feedwater-equipment'],
  ['20141011_049', 'piping-fittings-valves'],
  ['20141011_056', 'energy-laws-inspection'],
  ['20150125_048', 'operation-maintenance-preservation'],
  ['20150125_050', 'operation-maintenance-preservation'],
  ['20150404_004', 'draft-flue-gas'],
  ['20150404_027', 'auxiliary-feedwater-equipment'],
  ['20150404_028', 'auxiliary-feedwater-equipment'],
  ['20150719_012', 'boiler-types-construction'],
  ['20150719_040', 'heating-systems'],
  ['20150719_059', 'energy-laws-inspection'],
  ['20151010_004', 'combustion-air-calculation'],
  ['20160124_014', 'efficiency-output-heat-balance'],
  ['20160124_033', 'piping-fittings-valves'],
  ['20160402_025', 'draft-flue-gas'],
  ['20160402_034', 'steam-traps-condensate'],
  ['20160402_038', 'piping-fittings-valves'],
  ['20160402_043', 'piping-fittings-valves'],
  ['20160710_018', 'auxiliary-feedwater-equipment'],
  ['20160710_028', 'water-treatment-corrosion'],
  ['20160710_055', 'energy-laws-inspection'],
]);

// 이 두 그림 문항은 텍스트만으로 주제가 드러나지 않아, 기존 이미지 자산
// 감사표의 missing_element 설명을 자동 분류 입력에 보완한다.
const imageContextTopicHints = new Map([
  ['20120408_028', { code: 'piping-fittings-valves', reason: '동력 나사절삭기 구조 그림' }],
  ['20130414_012', { code: 'environmental-pollution-control', reason: '집진장치 종류와 형식 연결 그림' }],
]);

const recommendationByTopic = {
  'energy-laws-inspection': ['기존 URL 유지·주제 집중', '법규·검사 문항이 독립적으로 충분하고 기존 URL의 의미와 일치'],
  'heating-load-radiators': ['분리 후보', '연소·설치와 다른 계산 체계이며 45문항이 반복 출제'],
  'heating-systems': ['분리 후보', '증기·온수·복사난방의 방식 비교가 배관 시공과 별도 학습 단위'],
  'steam-traps-condensate': ['분리 후보', '26문항이지만 트랩·환수·수격이라는 일관된 문제군 형성'],
  'piping-fittings-valves': ['기존 URL 유지·주제 집중', '기존 배관 URL의 중심 주제로 적합'],
  'insulation-materials': ['분리 후보', '재료·허용온도·열전도율 문제가 독립적으로 반복'],
  'water-treatment-corrosion': ['기존 URL 유지·주제 집중', '기존 URL과 분류 경계가 일치'],
  'operation-maintenance-preservation': ['기존 URL 유지·주제 집중', '기동·운전·정지·보존 절차가 하나의 운전 흐름을 구성'],
  'failures-accidents-safety': ['기존 URL 유지·주제 집중', '사고 원인과 작업안전 문제가 기존 URL의 목적과 일치'],
  'automatic-control-interlocks': ['기존 URL 유지·주제 집중', '제어 동작·3요소 급수·인터록 문제가 단일 체계'],
  'safety-devices': ['기존 URL 유지·주제 집중', '안전밸브·저수위·화염검출 보호가 기존 URL과 일치'],
  'instruments-accessories': ['기존 URL 유지·주제 집중', '계측기와 보일러 부속장치가 기존 URL의 중심 주제'],
  'auxiliary-feedwater-equipment': ['기존 URL 유지·주제 집중', '급수·절탄기·과열기 등 부대설비가 일관된 문제군'],
  'environmental-pollution-control': ['분리 후보', '집진·대기오염 문제는 계측·부속장치와 학습 목표가 다름'],
  'efficiency-output-heat-balance': ['기존 URL 유지·주제 집중', '효율·증발량·열정산 계산이 기존 URL과 일치'],
  'draft-flue-gas': ['분리 후보', '통풍·연도·굴뚝 계산과 설비 문제가 독립적으로 반복'],
  'burners-furnaces-atomization': ['분리 후보', '버너·무화·화격자 구조가 연소 계산과 별도 문제군'],
  'combustion-air-calculation': ['기존 URL 유지·주제 집중', '기존 연소 URL에서 공기비·배기가스 계산을 중심으로 유지'],
  'fuel-properties': ['분리 후보', '연료 종류·성분·발열량이 독립적인 기초 단원'],
  'boiler-types-construction': ['분리 후보', '보일러 형식·구조·재료는 열역학 기초와 다른 암기 체계'],
  'heat-steam-thermodynamics': ['기존 URL 유지·주제 집중', '기존 기초 URL에서 열·증기·열역학을 중심으로 유지'],
};

const currentChapterTitles = {
  'boiler-operation-basics': '열·증기·보일러 기초',
  'boiler-auxiliary-equipment': '보일러 부대설비',
  'boiler-accessory-equipment': '보일러 부속설비와 계측',
  'boiler-protection-devices': '보일러 안전장치',
  'boiler-efficiency-heat-balance': '보일러 효율·증발량·열정산',
  'boiler-installation-combustion': '연료·연소·통풍과 보일러 설치',
  'boiler-control-systems': '보일러 자동제어와 인터록',
  'boiler-piping-insulation': '보일러 배관·밸브·보온',
  'boiler-operation-maintenance': '보일러 기동·운전·정지',
  'boiler-water-treatment': '보일러 수질관리',
  'boiler-work-safety': '보일러 작업안전과 사고예방',
  'energy-laws-and-inspection': '에너지 관계법규와 검사 체계',
};

function classify(question) {
  const body = question.body;
  const choices = question.choices.join(' ');
  const text = `${body} ${choices}`;
  const scores = topics.map(topic => {
    const matches = topic.patterns
      .map(item => {
        if (item.re.test(body)) return { ...item, location: '본문', appliedWeight: item.weight * 2 };
        if (item.re.test(choices)) return { ...item, location: '선택지', appliedWeight: item.weight };
        return null;
      })
      .filter(Boolean);
    return {
      code: topic.code,
      title: topic.title,
      currentSlug: topic.currentSlug,
      score: matches.reduce((sum, item) => sum + item.appliedWeight, 0),
      matches: matches.map(item => `${item.location}:${item.label}`),
    };
  });

  const imageContext = imageContextTopicHints.get(question.id);
  if (imageContext) {
    const target = scores.find(item => item.code === imageContext.code);
    target.score = Math.max(target.score, 100);
    target.matches.unshift(`이미지 자산 감사표: ${imageContext.reason}`);
  }

  scores.sort((a, b) => b.score - a.score || a.code.localeCompare(b.code));

  const primary = scores[0];
  const runnerUp = scores[1];
  const tied = primary.score > 0 && primary.score === runnerUp.score;
  const confidence = primary.score === 0
    ? 'unclassified'
    : tied || primary.score < 6 || primary.score - runnerUp.score < 2
      ? 'low'
      : primary.score < 10 || primary.score - runnerUp.score < 4
        ? 'medium'
        : 'high';
  const secondary = scores
    .slice(1)
    .filter(item => item.score >= 5 && item.score >= primary.score * 0.55)
    .slice(0, 3);
  const reviewedTopic = pdfReviewedTopics.get(question.id);
  const finalPrimary = reviewedTopic
    ? scores.find(item => item.code === reviewedTopic)
    : primary;
  if (!finalPrimary) throw new Error(`unknown reviewed topic for ${question.id}: ${reviewedTopic}`);
  const reviewResolution = reviewedTopic ? 'pdf-reviewed' : 'automatic';

  return {
    question, text, primary, finalPrimary, runnerUp, secondary, tied, confidence, reviewResolution, scores,
  };
}

const contentSignature = question => [question.body, ...question.choices, question.answer].join('\u0000');
const results = questions.map(classify);
const topicSummary = topics.map(topic => {
  const items = results.filter(result => result.finalPrimary.code === topic.code);
  const dates = [...new Set(items.map(item => item.question.date))].sort();
  return {
    code: topic.code,
    title: topic.title,
    currentSlug: topic.currentSlug,
    count: items.length,
    uniqueQuestions: new Set(items.map(item => contentSignature(item.question))).size,
    exams: dates.length,
    firstExam: dates[0],
    lastExam: dates.at(-1),
    high: items.filter(item => item.confidence === 'high').length,
    medium: items.filter(item => item.confidence === 'medium').length,
    low: items.filter(item => item.confidence === 'low').length,
    image: items.filter(item => item.question.review === 'jpg 확필').length,
    tied: items.filter(item => item.tied).length,
  };
}).sort((a, b) => b.count - a.count);

const confidenceSummary = Object.fromEntries(
  ['high', 'medium', 'low', 'unclassified'].map(level => [
    level,
    results.filter(result => result.confidence === level).length,
  ]),
);

const ids = questions.map(question => question.id);
const duplicateMap = new Map();
for (const question of questions) {
  const key = [question.body, ...question.choices].join('\u0000');
  if (!duplicateMap.has(key)) duplicateMap.set(key, []);
  duplicateMap.get(key).push(question);
}
const duplicateGroups = [...duplicateMap.values()].filter(group => group.length > 1);
const answerConflictGroups = duplicateGroups.filter(
  group => new Set(group.map(question => question.answer)).size > 1,
);
const resultByQuestionId = new Map(results.map(result => [result.question.id, result]));
const crossTopicDuplicateGroups = duplicateGroups.filter(
  group => new Set(group.map(question => resultByQuestionId.get(question.id).finalPrimary.code)).size > 1,
);
const duplicateSummary = {
  uniqueStemsAndChoices: duplicateMap.size,
  duplicateGroups: duplicateGroups.length,
  questionsInDuplicateGroups: duplicateGroups.reduce((sum, group) => sum + group.length, 0),
  maxGroupSize: Math.max(...duplicateGroups.map(group => group.length)),
  answerConflictGroups: answerConflictGroups.length,
};

const currentSlugSummary = Object.entries(currentChapterTitles).map(([slug, title]) => {
  const items = results.filter(result => result.finalPrimary.currentSlug === slug);
  const topicCodes = topics.filter(topic => topic.currentSlug === slug).map(topic => topic.code);
  return {
    slug,
    title,
    count: items.length,
    topicCodes,
    low: items.filter(item => item.confidence === 'low').length,
    image: items.filter(item => item.question.review === 'jpg 확필').length,
  };
}).sort((a, b) => b.count - a.count);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
assert(questions.length === 1620, `expected 1620 questions, got ${questions.length}`);
assert(new Set(ids).size === questions.length, 'duplicate question IDs detected');
assert(topics.length === 21, `expected 21 topic candidates, got ${topics.length}`);
assert(Object.keys(currentChapterTitles).length === 12, 'current chapter inventory must contain 12 slugs');
assert(results.every(result => result.primary.score > 0), 'unclassified questions remain');
assert(pdfReviewedTopics.size === 86, `expected 86 PDF-reviewed topics, got ${pdfReviewedTopics.size}`);
assert(
  results.filter(result => result.confidence === 'low' || result.question.review === 'jpg 확필').every(
    result => result.reviewResolution === 'pdf-reviewed',
  ),
  'a low-confidence or image question is missing PDF review',
);
assert(results.filter(result => result.reviewResolution === 'pdf-reviewed').length === 86, 'PDF review scope changed');
assert(results.filter(result => result.finalPrimary.code !== result.primary.code).length === 22, 'review correction count changed');
assert(results.every(result => result.question.cert_id === 'energy-management'), 'foreign certificate detected');
assert(results.every(result => result.question.exam === 'written'), 'non-written question detected');
assert(results.every(result => result.question.subject_id === 1), 'unexpected subject_id detected');
assert(questions.filter(question => question.review === 'jpg 확필').length === 32, 'image review count changed');
assert(answerConflictGroups.length === 0, 'repeated questions have conflicting answers');
assert(crossTopicDuplicateGroups.length === 0, 'identical repeated questions have conflicting final topics');
assert(topicSummary.reduce((sum, topic) => sum + topic.count, 0) === questions.length, 'topic totals mismatch');
assert(currentSlugSummary.reduce((sum, chapter) => sum + chapter.count, 0) === questions.length, 'chapter totals mismatch');
assert(Object.values(recommendationByTopic).filter(([action]) => action === '기존 URL 유지·주제 집중').length === 12, 'retain recommendation count changed');
assert(Object.values(recommendationByTopic).filter(([action]) => action === '분리 후보').length === 9, 'split recommendation count changed');

console.log(JSON.stringify({
  questions: questions.length,
  topics: topicSummary,
  confidence: confidenceSummary,
  ties: results.filter(result => result.tied).length,
  pdfReviewed: results.filter(result => result.reviewResolution === 'pdf-reviewed').length,
  reviewedTopicCorrections: results.filter(result => result.finalPrimary.code !== result.primary.code).length,
  duplicates: duplicateSummary,
  currentSlugs: currentSlugSummary,
}, null, 2));

const reviewCandidates = results.filter(result => ['low', 'unclassified'].includes(result.confidence));
console.log(`\nREVIEW_CANDIDATES ${reviewCandidates.length}`);
const reviewLimit = process.argv.includes('--all-review') ? reviewCandidates.length : 250;
for (const result of reviewCandidates.slice(0, reviewLimit)) {
  const { question, primary, runnerUp, confidence } = result;
  console.log([
    question.id,
    confidence,
    `${primary.code}:${primary.score}`,
    `${runnerUp.code}:${runnerUp.score}`,
    question.body.replaceAll('\n', ' '),
  ].join('\t'));
}

const csvEscape = value => {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const toCsv = (headers, rows) => [
  headers.join(','),
  ...rows.map(row => headers.map(header => csvEscape(row[header])).join(',')),
].join('\n');

function writeAuditOutputs() {
  const classificationHeaders = [
    'question_id', 'date', 'number', 'review', 'primary_topic', 'primary_title', 'current_slug',
    'final_topic', 'final_title', 'final_current_slug', 'review_resolution',
    'score', 'runner_up', 'runner_up_score', 'confidence', 'tied', 'secondary_topics',
    'matched_terms', 'body',
  ];
  const classificationRows = results.map(result => ({
    question_id: result.question.id,
    date: result.question.date,
    number: result.question.number,
    review: result.question.review,
    primary_topic: result.primary.code,
    primary_title: result.primary.title,
    current_slug: result.primary.currentSlug,
    final_topic: result.finalPrimary.code,
    final_title: result.finalPrimary.title,
    final_current_slug: result.finalPrimary.currentSlug,
    review_resolution: result.reviewResolution,
    score: result.primary.score,
    runner_up: result.runnerUp.code,
    runner_up_score: result.runnerUp.score,
    confidence: result.confidence,
    tied: result.tied,
    secondary_topics: result.secondary.map(item => `${item.code}:${item.score}`).join(' | '),
    matched_terms: result.primary.matches.join(' | '),
    body: result.question.body,
  }));

  const proposalHeaders = [
    'topic_code', 'title', 'current_slug', 'recommendation', 'question_count',
    'unique_question_count', 'exam_count', 'high', 'medium', 'low', 'tied', 'image_count',
    'first_exam', 'last_exam', 'rationale',
  ];
  const proposalRows = topicSummary.map(topic => {
    const [recommendation, rationale] = recommendationByTopic[topic.code];
    return {
      topic_code: topic.code,
      title: topic.title,
      current_slug: topic.currentSlug,
      recommendation,
      question_count: topic.count,
      unique_question_count: topic.uniqueQuestions,
      exam_count: topic.exams,
      high: topic.high,
      medium: topic.medium,
      low: topic.low,
      tied: topic.tied,
      image_count: topic.image,
      first_exam: topic.firstExam,
      last_exam: topic.lastExam,
      rationale,
    };
  });

  const relationHeaders = [
    'question_id', 'date', 'number', 'cert_id', 'exam', 'subject_id', 'review',
    'final_topic', 'final_title', 'relation_action', 'current_container_slug',
    'proposed_target_slug', 'slug_state', 'frontmatter_inclusion', 'blocking_reason',
    'review_resolution', 'automatic_confidence', 'relation_state',
  ];
  const chapterStateCache = new Map();
  const getChapterState = slug => {
    if (chapterStateCache.has(slug)) return chapterStateCache.get(slug);
    const chapterFile = new URL(
      `../src/content/chapters/energy-management/thermal-equipment/${slug}.md`,
      import.meta.url,
    );
    const exists = existsSync(chapterFile);
    const content = exists ? readFileSync(chapterFile, 'utf8') : '';
    const questionLine = content.match(/^questions:\s*\[(.*)\]\s*$/m)?.[1] ?? '';
    const questionIds = new Set(
      questionLine.split(',').map(value => value.trim()).filter(Boolean),
    );
    const state = { chapterFile, exists, content, questionIds };
    chapterStateCache.set(slug, state);
    return state;
  };
  const relationRows = results.map(result => {
    const [recommendation] = recommendationByTopic[result.finalPrimary.code];
    const splitCandidate = recommendation === '분리 후보';
    const imageBlocked = result.question.review === 'jpg 확필';
    const targetSlug = splitCandidate ? result.finalPrimary.code : result.finalPrimary.currentSlug;
    const chapterState = getChapterState(targetSlug);
    const applied = chapterState.questionIds.has(result.question.id);
    const blockingReasons = [];
    if (imageBlocked) blockingReasons.push('그림 문항 공개 검토 유지');
    if (splitCandidate && !chapterState.exists) blockingReasons.push('신규 slug Owner 승인 필요');
    if (!imageBlocked && !applied) blockingReasons.push('frontmatter 관계 활성화 승인 필요');
    return {
      question_id: result.question.id,
      date: result.question.date,
      number: result.question.number,
      cert_id: result.question.cert_id,
      exam: result.question.exam,
      subject_id: result.question.subject_id,
      review: result.question.review,
      final_topic: result.finalPrimary.code,
      final_title: result.finalPrimary.title,
      relation_action: splitCandidate ? 'split-candidate' : 'existing-slug',
      current_container_slug: result.finalPrimary.currentSlug,
      proposed_target_slug: targetSlug,
      slug_state: splitCandidate
        ? (chapterState.exists ? 'created-local' : 'proposal-not-created')
        : 'existing',
      frontmatter_inclusion: imageBlocked
        ? 'exclude'
        : (applied ? 'applied-local' : 'pending-owner-activation'),
      blocking_reason: blockingReasons.join(' | '),
      review_resolution: result.reviewResolution,
      automatic_confidence: result.confidence,
      relation_state: imageBlocked
        ? 'excluded-image-review'
        : (applied ? 'applied-local-pending-review' : 'proposal-only-not-applied'),
    };
  });
  const relationSummary = topicSummary.map(topic => {
    const [recommendation] = recommendationByTopic[topic.code];
    const rows = relationRows.filter(row => row.final_topic === topic.code);
    const splitCandidate = recommendation === '분리 후보';
    return {
      code: topic.code,
      title: topic.title,
      count: rows.length,
      eligible: rows.filter(row => row.frontmatter_inclusion !== 'exclude').length,
      excluded: rows.filter(row => row.frontmatter_inclusion === 'exclude').length,
      action: splitCandidate ? '신규 slug 적용' : '기존 URL 유지',
      currentSlug: topic.currentSlug,
      proposedSlug: splitCandidate ? topic.code : topic.currentSlug,
      slugState: splitCandidate
        ? (getChapterState(topic.code).exists ? '로컬 생성·미배포' : '미생성·Owner 승인 필요')
        : '기존 slug',
    };
  }).sort((a, b) => b.count - a.count);

  assert(relationRows.length === questions.length, 'relation proposal totals mismatch');
  assert(new Set(relationRows.map(row => row.question_id)).size === questions.length, 'relation proposal duplicate IDs');
  assert(relationRows.filter(row => row.frontmatter_inclusion === 'exclude').length === 32, 'image relation exclusion count changed');
  assert(relationRows.filter(row => row.frontmatter_inclusion === 'applied-local').length === 1588, 'applied relation count changed');
  assert(relationRows.filter(row => row.frontmatter_inclusion === 'pending-owner-activation').length === 0, 'pending relation remains');
  assert(relationRows.filter(row => row.relation_action === 'split-candidate').length > 0, 'split relation proposal is empty');
  assert(relationSummary.filter(topic => topic.action === '신규 slug 적용').length === 9, 'split topic proposal count changed');
  assert(relationSummary.filter(topic => topic.action === '기존 URL 유지').length === 12, 'existing topic proposal count changed');
  assert(new Set(relationSummary.map(topic => topic.proposedSlug)).size === 21, 'proposed target slugs are not unique');
  assert(relationSummary.every(topic => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.proposedSlug)), 'invalid proposed slug format');
  const allTargetSlugs = new Set(relationSummary.map(topic => topic.proposedSlug));
  const actualRelationOwners = new Map();
  for (const topic of relationSummary) {
    const state = getChapterState(topic.proposedSlug);
    assert(state.exists, `target chapter missing: ${topic.proposedSlug}`);
    assert(state.content.includes('cert_id: energy-management'), `cert_id mismatch: ${topic.proposedSlug}`);
    assert(state.content.includes('exam: written'), `exam mismatch: ${topic.proposedSlug}`);
    assert(state.content.includes('subject_id: 1'), `subject_id mismatch: ${topic.proposedSlug}`);
    assert(state.content.includes('status: 완료'), `chapter is not complete: ${topic.proposedSlug}`);
    assert(/^examComment:\s*\S.+$/m.test(state.content), `examComment missing: ${topic.proposedSlug}`);
    const expectedIds = relationRows
      .filter(row => row.proposed_target_slug === topic.proposedSlug && row.frontmatter_inclusion === 'applied-local')
      .map(row => row.question_id);
    assert(state.questionIds.size === expectedIds.length, `relation count mismatch: ${topic.proposedSlug}`);
    assert(expectedIds.every(id => state.questionIds.has(id)), `expected relation missing: ${topic.proposedSlug}`);
    for (const id of state.questionIds) {
      assert(!actualRelationOwners.has(id), `question relation duplicated: ${id}`);
      actualRelationOwners.set(id, topic.proposedSlug);
    }
    const relatedLine = state.content.match(/^related:\s*\[(.*)\]\s*$/m)?.[1] ?? '';
    const relatedSlugs = relatedLine.split(',').map(value => value.trim()).filter(Boolean);
    assert(relatedSlugs.length >= 2, `related chapters missing: ${topic.proposedSlug}`);
    assert(relatedSlugs.every(slug => allTargetSlugs.has(slug)), `related slug missing: ${topic.proposedSlug}`);
  }
  assert(actualRelationOwners.size === 1588, 'actual relation total mismatch');
  assert(relationRows
    .filter(row => row.frontmatter_inclusion === 'exclude')
    .every(row => !actualRelationOwners.has(row.question_id)), 'excluded image relation was applied');

  const currentTable = currentSlugSummary.map(chapter => [
    `\`${chapter.slug}\``, chapter.title, chapter.count, chapter.topicCodes.length,
    chapter.topicCodes.map(code => `\`${code}\``).join('<br>'), chapter.low, chapter.image,
  ].join(' | ')).join('\n');
  const proposalTable = topicSummary.map(topic => {
    const [recommendation] = recommendationByTopic[topic.code];
    return [
      `\`${topic.code}\``, topic.title, topic.count, topic.uniqueQuestions, topic.exams,
      `${topic.high}/${topic.medium}/${topic.low}`, topic.tied, topic.image, recommendation,
    ].join(' | ');
  }).join('\n');
  const relationTable = relationSummary.map(topic => [
    `\`${topic.code}\``, topic.title, topic.count, topic.eligible, topic.excluded, topic.action,
    `\`${topic.currentSlug}\``, `\`${topic.proposedSlug}\``, topic.slugState,
  ].join(' | ')).join('\n');

  const markdown = `# 에너지관리기능사 기출 기반 챕터 분류·커버리지 감사

- 감사일: 2026-08-05
- 대상: \`src/data/questions/energy-management.json\`
- 범위: 2010-01-31~2016-07-10, 27회, 1,620문항
- 성격: 검토용 분류·관계 제안. 실제 챕터 관계, URL, 공개 상태는 변경하지 않음

## 결론

1,620문항 전부를 21개 학습 주제 후보에 배정했다. 미분류는 0건이다. 자동 저신뢰 55건과 그림 문항 32건을 교사용 원본 PDF로 직접 대조했으며, 중복 1건을 제외한 86건의 최종 주제를 확정했다. 자동 1순위와 다른 판정은 22건이다. 현재 12개 URL은 12개 중심 주제에 유지하고, 문항 근거가 독립적으로 반복되는 9개 주제를 분리 후보로 두는 구성이 가장 안정적이다. 이번 감사 결과는 관계 자동 반영이나 신규 URL 승인 근거가 아니다.

## 분류 방법

- 문제 본문과 선택지를 함께 검사하되 본문 일치에 2배 가중치를 적용했다.
- 숫자·계산·설비·법규·운전 절차 등 21개 주제별 명시 패턴을 사용했다.
- 본문만으로 주제가 드러나지 않는 그림 문항 2건은 기존 이미지 자산 감사표의 \`missing_element\` 설명을 자동 분류 입력에 보완했다.
- 자동 저신뢰 55건과 그림 문항 32건은 27개 교사용 원본 PDF의 문제·보기·표시 정답을 직접 대조했다. 겹치는 1건을 제외한 86건 모두 최종 주제를 \`pdf-reviewed\`로 기록했다.
- 원본 검수 결과는 \`final_topic\` 계열 필드에만 반영해 자동 \`primary_topic\`·점수·신뢰도 기록을 보존했다.
- \`jpg 확필\` 32건은 분류에는 포함했지만 그림 누락 위험을 해소하거나 공개 가능으로 판정하지 않았다.
- 동일 본문·선택지는 반복 출제로 집계하되 삭제·병합하지 않았다.

## 전체 결과

- 신뢰도: high ${confidenceSummary.high}, medium ${confidenceSummary.medium}, low ${confidenceSummary.low}, unclassified ${confidenceSummary.unclassified}
- 1·2순위 동률: ${results.filter(result => result.tied).length}건
- 원본 PDF 직접 검수: ${results.filter(result => result.reviewResolution === 'pdf-reviewed').length}건
- 자동 1순위에서 수정된 최종 주제: ${results.filter(result => result.finalPrimary.code !== result.primary.code).length}건
- 고유 본문·선택지 조합: ${duplicateSummary.uniqueStemsAndChoices}개
- 반복 출제 그룹: ${duplicateSummary.duplicateGroups}개, 포함 문항 ${duplicateSummary.questionsInDuplicateGroups}건, 최대 ${duplicateSummary.maxGroupSize}회
- 반복 출제 정답 충돌: ${duplicateSummary.answerConflictGroups}건
- 기존 URL 유지·주제 집중: 12개
- 분리 후보: 9개
- 병합 권고: 없음

## 현재 12개 URL의 기출 커버리지

URL | 현재 제목 | 배정 문항 | 포함 주제 수 | 포함 주제 후보 | low | 그림
--- | --- | ---: | ---: | --- | ---: | ---:
${currentTable}

현재 \`boiler-piping-insulation\`과 \`boiler-installation-combustion\`은 각각 4개와 5개 주제를 한 URL에 포함해 범위가 가장 넓다. \`boiler-operation-basics\`와 \`boiler-accessory-equipment\`도 각각 2개 주제를 포함한다. 나머지 8개 URL은 현재 경계와 기출 주제 경계가 대체로 일치한다.

## 21개 학습 주제 제안

검토 키(아직 URL 아님) | 제목 | 문항 | 고유 문항 | 출제 회차 | high/medium/low | 동률 | 그림 | 권고
--- | --- | ---: | ---: | ---: | --- | ---: | ---: | ---
${proposalTable}

## 중복·누락·위험 판단

- 미분류 0건이므로 분류표 자체의 공백은 없다.
- 자동 low 55건은 모두 원본 PDF로 최종 판정을 완료했다. 자동 점수와 low 표시는 분류기 추적을 위해 그대로 유지한다.
- 동률 19건 중 원본 검수 범위에 포함된 문항은 \`final_topic\`으로 해소했다. 나머지 자동 동률은 실제 관계 작성 시 본문·정답 맥락을 한 번 더 확인한다.
- 반복 출제 85그룹은 기출 빈도를 보여 주는 근거이므로 삭제 대상이 아니다. 동일 본문·선택지 사이 정답 충돌은 0건이다.
- 그림 문항 32건은 기존 \`jpg 확필\` 상태와 비공개 조건을 그대로 유지한다.
- 9개 분리 후보는 학습 단위 제안이며 신규 slug 승인이나 생성으로 간주하지 않는다.

## 다음 게이트

1. Owner가 12개 유지 + 9개 분리 구조와 신규 공개 식별자 필요 여부를 결정한다.
2. 승인된 구조에 한해 기출 관계를 작성하고 관계 무결성·중복·과목 적합성을 검증한다.
3. 관계 검토가 끝난 뒤에만 챕터 본문 작성과 공개 여부를 별도 승인한다.

## 생성물

- \`docs/audits/2026-08-05-energy-management-chapter-classification.csv\`: 자동 분류와 원본 검수 최종 분류를 함께 보존한 1,620문항 전수 분류표
- \`docs/audits/2026-08-05-energy-management-chapter-proposal.csv\`: 21개 주제별 커버리지·권고
- \`docs/audits/2026-08-05-energy-management-pdf-candidate-review.csv\`: 원본 대조 86건의 문제·정답·이미지 검수 원장
- \`scripts/audit-energy-chapter-coverage.mjs\`: 재현 가능한 분류·검증 스크립트
`;

  const relationMarkdown = `# 에너지관리기능사 기출↔챕터 관계 적용 기록

- 작성일: 2026-08-05
- 기준: 원본 PDF 검수를 반영한 \`final_topic\`
- 범위: 27회, 1,620문항, 21개 학습 주제
- 상태: Owner 승인에 따라 로컬 frontmatter 적용 완료. Commit·Push·production 배포 전

## 결론

1,620문항을 21개 최종 주제에 1:1 배정하고, 그림 문항 32건을 제외한 ${relationRows.filter(row => row.frontmatter_inclusion === 'applied-local').length}건을 각 챕터 frontmatter에 적용했다. 기존 slug 12개를 유지하고 신규 slug 9개를 로컬에 생성했다.

프로젝트 결정 D-73에 따라 실제 관계 정본은 챕터 md frontmatter의 \`questions\` 배열 한 곳이다. 이 파일과 CSV는 검증용 파생 산출물이다.

## 무결성 결과

- 전체 관계 후보: ${relationRows.length}건
- 고유 question ID: ${new Set(relationRows.map(row => row.question_id)).size}건
- 과목 불일치: ${relationRows.filter(row => row.subject_id !== 1).length}건
- 동일 문항의 복수 최종 주제: ${crossTopicDuplicateGroups.length}그룹
- 기존 slug 대상 주제: ${relationSummary.filter(topic => topic.action === '기존 URL 유지').length}개
- 신규 slug 적용 주제: ${relationSummary.filter(topic => topic.action === '신규 slug 적용').length}개
- 관계 적용 가능 후보: ${relationRows.filter(row => row.frontmatter_inclusion !== 'exclude').length}건
- 그림 검토로 제외: ${relationRows.filter(row => row.frontmatter_inclusion === 'exclude').length}건
- 실제 frontmatter 관계: ${actualRelationOwners.size}건

## 21개 관계 대상

주제 키 | 제목 | 전체 | 적용 후보 | 그림 제외 | 조치 | 현재 컨테이너 | 제안 대상 slug | slug 상태
--- | --- | ---: | ---: | ---: | --- | --- | --- | ---
${relationTable}

## 적용 결과

1. 기존 URL 12개의 slug는 변경하지 않았다.
2. 승인된 신규 slug 9개는 로컬 콘텐츠 파일로 생성했다.
3. \`jpg 확필\` 32건은 \`frontmatter_inclusion=exclude\`로 유지하고 어떤 챕터에도 연결하지 않았다.
4. 텍스트 문항 1,588건은 각 1개 챕터에만 연결했으며 중복·누락은 없다.
5. Commit·Push·production 배포는 수행하지 않았다.

## 다음 게이트

- ChatGPT 최종 기술 리뷰와 Owner의 Commit·Push 승인
- CI 성공 후 production 배포 승인
- 그림 문항 32건의 별도 공개 여부
`;

  writeFileSync(
    new URL('../docs/audits/2026-08-05-energy-management-chapter-classification.csv', import.meta.url),
    `\uFEFF${toCsv(classificationHeaders, classificationRows)}\n`,
  );
  writeFileSync(
    new URL('../docs/audits/2026-08-05-energy-management-chapter-proposal.csv', import.meta.url),
    `\uFEFF${toCsv(proposalHeaders, proposalRows)}\n`,
  );
  writeFileSync(
    new URL('../docs/audits/2026-08-05-energy-management-chapter-coverage.md', import.meta.url),
    markdown,
  );
  writeFileSync(
    new URL('../docs/audits/2026-08-05-energy-management-question-relations-proposal.csv', import.meta.url),
    `\uFEFF${toCsv(relationHeaders, relationRows)}\n`,
  );
  writeFileSync(
    new URL('../docs/audits/2026-08-05-energy-management-question-relations-proposal.md', import.meta.url),
    relationMarkdown,
  );
  console.log('\nWROTE_AUDIT_OUTPUTS 5');
}

if (process.argv.includes('--write')) writeAuditOutputs();
