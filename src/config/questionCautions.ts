// Learner guidance from docs/audits/2026-09-25-c1/CONTENT_REVIEW.md
// Separate from canonical question text, answers, and chapter assignments.
const QUESTION_CAUTIONS: Readonly<Record<string, string>> = {
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
