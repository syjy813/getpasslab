# 복원된 20190804 미배정 문항 연결 검토

기준 main `22e57b360a492c69596a72bee590b8cf3c38214a` · 사용자 ‘다음 작업’ · 컴활 보류

PR150에서 원문을 복원한 뒤 미배정 상태인 2019-08-04 건설 문항 11개를 검토함. 산업안전 전체 미배정 문항의 검토 완료를 의미하지 않음

## 문항별 판단

| 번호 | 답 | 결정 / 풀이 근거 | 챕터 |
|---|---|---|---|
| 102 | ④ | 거푸집 측압의 증가·감소 요인 설명 필요 | 후속 집필 |
| 103 | ④ | 절단하중200ton ÷ 안전계수5 = 최대하중40ton | [안전계수](https://getpasslab.co.kr/industrial-safety/written/mechanical/safety-factor/) |
| 105 | ② | 선창 내부 출입설비 깊이1.5m 조건 설명 필요 | 후속 집필 |
| 106 | ② | 회전반경 출입금지 등 굴착기계 운행 기준 설명 필요 | 후속 집필 |
| 109 | ① | 부두·안벽 통로 폭90cm 조건 설명 필요 | 후속 집필 |
| 110 | ③ | 문제에 명시된2022-06-02 개정 기준2천만 원 | [산업안전보건관리비](https://getpasslab.co.kr/industrial-safety/written/construction/safety-management-cost/) |
| 111 | ③ | 길이15m 이상 수직갱의 계단참은10m 이내마다 | [가설통로·계단](https://getpasslab.co.kr/industrial-safety/written/construction/temporary-passage-stairs/) |
| 112 | ① | 토중수 결빙에 따른 지표 융기인 동상현상 | [토양 붕괴 예방](https://getpasslab.co.kr/industrial-safety/written/construction/soil-collapse-prevention/) |
| 114 | ③ | 안전난간대 금속 파이프 지름2.7cm 이상 | [안전난간 구조](https://getpasslab.co.kr/industrial-safety/written/construction/safety-handrail-structure/) |
| 115 | ③ | 교량 최대지간50m 이상이 대상 · 보기40m 제외 | [유해·위험방지계획서](https://getpasslab.co.kr/industrial-safety/written/construction/construction-hazard-plan-documents/) |
| 116 | ② | 달비계 와이어로프 사용·폐기 조건 설명 필요 | 후속 집필 |

6개 기출 버튼 추가. 안전계수에 실제103번 계산 예시2줄, 관리비에 문제에서 명시한 적용연도1줄만 보완함. 안전계수 빈도6문항/6회차를 실제7문항/7회차로 갱신함. 나머지4개는 기출 배정만 추가

103번은 원래 건설 과목 문항이지만 동일한 안전계수 기본식을 다루는 기존 기계 챕터를 재사용함. 원본 `subject_id: 6` 유지. 안전계수5를 모든 권상용 로프의 현행 법정 기준이라고 일반화하지 않음

110번은2019 시험 표기에2022 개정 적용 문구를 담은 출판사 갱신본임. 실제2019 당시 법령 기준으로 소개하지 않음. `토증수`(112), `떄`(105)는 원본 자체 오탈자이므로 정본 기출에는 보존함

## 후속 범위

1. 거푸집 측압:102번의 타설속도·높이·투수성·온도 영향
2. 선창·부두 통로:105번 깊이조건과109번 폭조건 · 선박 승강용 사다리/비계 작업발판과 구별
3. 굴착기계 운행 안전:106번의 탑승·회전반경·주차·장애물 조건
4. 달비계 와이어로프 사용 조건:116번의 이음매·끊어진 소선·지름 감소·손상 조건

이5문항은 기존 안전계수·전도방지·로프 꼬임·선박 사다리 챕터에 억지로 연결하지 않음. 새 공개 URL/신규 집필은 다음 작업에서 결정함

## 검증 근거와 보호 범위

- CBT 학생용 PDF7~8쪽의 문제·선택지·8쪽 정답표를 실제 렌더로 확인함. URL/SHA/11개 정본 기록은 `review.json`, `question-review.json`
- Q-Net 공식 원문·정오표는 미확인. CBT 갱신본 대조를 공식2019 원문 검증으로 주장하지 않음
- 법령 보조 대조: 국가법령정보센터 산업안전보건기준에 관한 규칙 제13조/제23조, 산업안전보건법 시행령 제42조. 전체 본문의 현행 법령 전수검수는 이번 범위가 아님
- 제13조/23조: https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1016700405
- 제42조: https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0042&lsiSeq=288347&urlMode=lsScJoRltInfoR
- 적용 집필 기준: `CHAPTER_WRITING_GUIDE.md`. PDF 이미지 검수에는 `docs/standards/learning-image-design-system-v1.md`의 원본 우선·근거 대조·원본/파생 구분 적용. 신규 학습 이미지·CSS 변경 없음
- 실제 최신 guard: `check-industrial-unassigned-links.mjs`. 기존725개src/public파일의 목록·해시를 앞선 공개 감사 기준으로 검사하고 MD6곳만 정확한 승인해시로 허용함. 정본1680문항/정답/ID/과목/일자/이미지/스타일 모두 그대로 유지
- 산업안전259 / 전체443 / 주기출1015→1021 / article446 유지. 변경6개article 외440개article 바이트 유지
- 과거 감사는 `read-before-industrial-unassigned-links.mjs`로 정확한 최신6MD/6article를 보존된 원본으로 역복원해 검증함. 과거 snapshot 숫자는 현재 배포 숫자와 구별함. 브라우저 QA는 역복원 없이 실제 최신 목록을 사용함
- 로컬/CI/Deploy/Production 최종 검증은 PR 기록에 실제 결과를 남김. 자동 QA의 정답 일치를 학습자 정답률 검증으로 해석하지 않음

## 실제 로컬 검증

- Build 성공 · HTML464 / sitemap463 · SEO/본문/deferred 오류0
- 이전12개 보호검사 및 최신 연결guard 통과
- 320/390/1440: 새6챕터×3=18팝업, 원문120×3=360fixture팝업 및 실제24연결, 기존source4챕터·클램셸 QA 통과 · 원문/보기/정답 공개·초기화·Escape·HTML일치·가로 넘침 검사
- 실제 배포 여부와 CI/Production QA는 최종 PR의 실행URL/커밋/아티팩트로 구분함
