# 농도 환산 회색 수식 박스 볼드 예시 — 2026-10-05

회색 박스의 수식 글자만 기존 fw-bold(700) 토큰으로 변경. KaTeX의 기본 .katex font shorthand가 weight를 normal로 재설정하므로, 박스 안 실제 .katex 노드를 대상으로 지정. 기존 KaTeX bold / bold italic 서체 사용. 숫자·기호·분자/분모·아래첨자·단위의 실제 computed font-weight를 320/390/1440px에서 확인.

본문·수식 문자열·기출·회색 배경/테두리·글자색·크기·여백·소제목 및 다른 챕터 불변. 현재 보호 검사의 exact source chain으로 CSS 변경을 기록하고 삽입 CSS를 제거하면 직전 원문 hash로 정확히 복원. 최종 CI/배포/실서버 상태는 PR 설명.
