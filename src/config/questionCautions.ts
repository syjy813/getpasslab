// Learner guidance from docs/audits/2026-09-25-c1/CONTENT_REVIEW.md
// Additional review: docs/audits/2026-09-30-computer-literacy-001-081/README.md
// Separate from canonical question text, answers, and chapter assignments.
const QUESTION_CAUTIONS: Readonly<Record<string, string>> = {
  'computer-literacy:written:20150627_013':
    '수록 답안은 드라이버 미설치 · 현재 Code 28의 의미와 과거 노란 물음표 아이콘 표현을 구별 · 당시 아이콘 모양의 공식 근거는 미확인',
  'computer-literacy:written:20161022_018':
    '수록 답안은 ②임 · ②의 ‘파일을 관리’한다는 표현은 파일 시스템의 정의와 명확히 구별되지 않음 · ①의 트랙·섹터 초기화는 Windows의 논리 포맷과 구별해야 함 · 공식 정정 여부는 확인되지 않음',
  'computer-literacy:written:20160305_012':
    '③ EDSAC·④ UNIVAC의 ‘최초’는 비교 범위에 따라 달라짐 · 범위가 생략된 표현이므로 단일 오답 연습에 주의',
  'computer-literacy:written:20190831_010':
    'Unicode의 고정 16비트 설명은 출제 당시에도 부정확 · UTF-16은 문자에 따라 16비트 또는 32비트 사용',
  'computer-literacy:written:20190831_012':
    'SATA는 직렬 방식이며 일반 연결에 Master/Slave 구분 없음 · ①뿐 아니라 ③도 일반 구조와 불일치 · 공식 정정 여부 미확인',
  'computer-literacy:written:20150307_019':
    '키보드 오류로 부팅을 멈출지는 BIOS 설정에 따라 다름 · ③을 모든 PC에 공통인 정답으로 일반화하지 않기',
};

export const getQuestionCaution = (
  certId: string,
  exam: string,
  questionId: string,
): string | undefined => QUESTION_CAUTIONS[`${certId}:${exam}:${questionId}`];
