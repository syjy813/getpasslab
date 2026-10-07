# 클램셸 용도 챕터 공개

기준 main `a4db4e8a3cc97976b06879b4c54b50520dc7b674` · 사용자 다음 작업 요청 · 컴활 보류 유지

- 기존 `clam-shell` STUB에 본문 작성 후 완료로 변경 · 제목/slug/과목/그룹/정렬/요약 유지
- 미배정 `20190804_120`을 단독 주 기출로 연결 · 지문/보기/수록 정답④/검수 필드는 수정하지 않음
- 조개형 버킷의 집어 올리는 개념 → 잠함/수중/깊은 기초 굴착 3행 표 → 암반 굴착 적합이라는 오답 구별
- 기출에서 요구하지 않는 기계 사양·작업속도 수치·안전 법규·별도 요약/시험 포인트/반복 그림 제외
- 암반을 깨는 굴착과 모래·자갈을 집어 올리는 용도를 구별함 · 특수 장비까지 모두 단단한 흙 작업이 불가능하다고 일반화하지 않음
- 공개 산업안전258→259 / 전체442→443 · 주 기출1014→1015
- 기존725개 src/public 파일 중 이 챕터 한 파일만 변경 · 기출 정본/이미지/CSS/컴활 원본 모두 그대로 유지
- 기존445 article 중 타워크레인 풍속 기준 한 곳에 자동 관련 링크 블록만 추가 · 나머지444 article 바이트 그대로 유지
- 기존 감사 스냅샷은 보존 · 과거 검증에서 정확한 승인 해시의 STUB/관련 링크만 역복원하고 현행 검증은 실제 소스로 별도 확인
- 전체 챕터 브라우저 QA에 새 챕터 추가 · 443개 실제 공개 경로 검사

## 자료와 범위

- [CBT 발행 학생용 PDF](https://img.comcbt.com/xe/download/822fabe365db4a9bcfc05597b00ea22a/8976275/%EC%82%B0%EC%97%85%EC%95%88%EC%A0%84%EA%B8%B0%EC%82%AC20190804%28%ED%95%99%EC%83%9D%EC%9A%A9%29.pdf): 8쪽120번/정답표 직접 재대조
- PDF SHA256 `b03996ec40a2c3d9b163b75c0f4287b37557e331d2ddbeb110e36688915af861`
- [Liebherr GMZ24](https://www.liebherr.com/en-int/p/644097-5376693): 흙 굴착 및 모래·자갈·흙 취급 용도 교차 확인
- [Liebherr 준설 자료](https://www.liebherr.com/shared/media/construction-machinery/deep-foundation/pdf/brochures/liebherr-brochure-solutions-for-material-handling-11961525-english.pdf): 해저 모래/퇴적물 굴착 용도 교차 확인
- Q-Net 공식 원문/정오표 대조 미실행 · CBT 수록 정답에 대한 본문 대응 검토이며 학습자 정답률 실험 아님
- 이미지 정본v1.2 §1·2·7·9 적용: 원본 PDF 검수 우선,120번에 도판 없음 확인, 그림 추가 필요 없음 판단 · 신규 이미지 제작/기존 이미지 변경 없음

## 검증

- Build 성공 · SEO HTML464/sitemap463, 오류0 · public-content/deferred-content 오류0
- 기존 source/배정/FTA/수식/흙막이/공작기계/컴활 보호 검사 모두 통과
- 클램셸 실제 Chromium320/390/1440: 가로 넘침0, 기존 파란 h2, 표3행, 기출 지문/보기/정답④ 일치, 정답 숨김/공개/재설정/ESC,목차 진입/관련 챕터 왕복 통과
- HTML3개 정확 비교, 팝업3회, 오류0 · 캡처 직접 확인, `browser-results.json`/`previews/`
- 최초 로컬 QA는 목차에 없는 `main` 선택자로 실패, 실제 `a.card`로 교정 후 전체 재검사 통과 · 제품 코드 변경 원인 아님
- CI/Merge/Deploy/Production 결과는 PR의 최종 실제 기록 참조

[공개 챕터](https://getpasslab.co.kr/industrial-safety/written/construction/clam-shell/)

## 다음 작업

복원된 미배정 문항의 전용 학습 범위·연결 검토(102/103/105/106/109 포함) · 제목만으로 배정하지 않음 · 컴활 보류
