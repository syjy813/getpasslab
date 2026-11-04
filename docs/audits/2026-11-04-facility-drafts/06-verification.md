# 06번 최신 검증·편집 메모

2026-11-04 · 공개 본문이 아닌 내부 편집 기록. 원고 및 이미지 검토 완료, 사이트 미게시.

| 항목 | 판정 | 근거 위치 | 변경·범위 |
|---|---|---|---|
| 상반기 전체121·일반시설51·보훈시설1 | 확인 | FMS_SPRING · 채용인원/사업소 단위 모집표 | 일반51과 보훈1을 구분 |
| 하반기 전체156·시설31 | 확인 | FMS_AUTUMN · PDF1쪽 | 하반기 원문 사본의 모집표 |
| 상반기5/21 14시·하반기10/22 14시 마감 | 확인 | FMS_SPRING;FMS_AUTUMN · 원서접수 일정 | 두 회차 종료된 과거 사례 |
| 한전아트센터 A 영선 유경험 | 정정 | FMS_SITES · PDF12쪽/인쇄23쪽 아트센터 A | 공조냉동기계기능사 이상 필수로 정정 |
| 아트센터 B 기계·전기 우대 | 삭제 | FMS_SITES · PDF12쪽/인쇄23쪽 아트센터 B | 해당 행에 우대 문구 확인 안 됨; 한전인재개발원 A의 교대필수·기계설비자격우대 사례로 교체 |
| 서대문은평·평택전력 고덕보조 사례 | 삭제 | FMS_SITES · 붙임3 시설관리 모집표 | 이 회차 원문에서 확인되지 않아 제외; 거짓 또는 타회차라고 확정하지 않음 |
| 동용인지사 2종 선임 모두 필수 | 확인 | FMS_SITES · PDF11쪽/인쇄22쪽 동용인 | 냉동제조시설·특정가스사용시설 |
| 이천 3종·서수원 3종 선임 필수 | 확인/보완 | FMS_SITES · PDF11~12쪽/인쇄22~23쪽 | 이천:냉동·검사대상·위험물; 서수원:냉동·검사대상·특정가스 |
| 285/304/347/399만원 적용 회차 | 범위 정정 | FMS_SPRING;FMS_AUTUMN · 상반기 근로조건; 하반기PDF3쪽 | 285/304는 상·하반기; 초급347/고급399는 상반기 별도 직위 |
| 6개월 인턴·평가 후 적격 전환·인턴급여 동일 | 확인 | FMS_SPRING;FMS_AUTUMN · 근로조건 | 하반기 채용예정2027-01-01도 명시 |
| 이미지 02-site-appointment-conditions.webp | 교체 완료 | FMS_SITES · 해당 공고/별표 및 교체 이미지 육안·4폭 검수 | 공식 표와 다른 사업소 사례를 삭제하고 동용인·이천의 필수 선임요건으로 교체 |
| 이미지 03-required-versus-preferred.webp | 교체 완료 | FMS_SITES · 해당 공고/별표 및 교체 이미지 육안·4폭 검수 | 한전인재개발원A의 필수·우대 원문 확인 사례로 교체 |

## 근거

- FMS_SPRING: [한전FMS 2026년 상반기 5직급 채용공고](https://job.career.co.kr/recruit/view/21905687) — 2026-05-14 공고·05-21 접수 마감
- FMS_AUTUMN: [한전FMS 2026년 하반기 공고 및 붙임 원문 사본(삼육대 게시)](https://www.syu.ac.kr/wp-admin/admin-ajax.php?action=file_download_id&o_name=2026%EB%85%84-%ED%95%98%EB%B0%98%EA%B8%B0-5%EC%A7%81%EA%B8%89-%EC%B1%84%EC%9A%A9%ED%98%95%EC%9D%B8%ED%84%B4-%EC%B1%84%EC%9A%A9-%EA%B3%B5%EA%B3%A0-%EB%B0%8F-%EB%B6%99%EC%9E%84%ED%8C%8C%EC%9D%BC.pdf&t_id=257480) — 2026-10-15 공고·10-22 접수 마감
- FMS_SITES: [상반기 붙임3 모집단위 및 근무지별 자격기준](https://job3.career.co.kr/ci/202600/tmpfile/kepcofms/0507/%EB%B6%99%EC%9E%843.%20%EB%AA%A8%EC%A7%91%EB%8B%A8%EC%9C%84%20%EB%B0%8F%20%EA%B7%BC%EB%AC%B4%EC%A7%80%EB%B3%84%20%EC%9E%90%EA%B2%A9%EA%B8%B0%EC%A4%80.pdf) — 2026년 상반기 공고에 한정

## 화면 QA 및 발행 경계

- 320/390/768/1440px Chromium 같은 출처 iframe 뷰포트에서 레이아웃 측정. 페이지 넘침·이미지 잘림 없음. 실제 모바일 기기·Safari·광고 실노출 검증과 구분한다.
- 390px에서 본문 이미지5개 모두 실제 로딩 확인. width/height·alt·1px테두리·원래비율 확인.
- 게시용 본문은 article.md, 편집 메모는 이 파일. 원고와 이미지는 기존 원문을 보존한 검토본이다.
- 실제 발행 시 날짜·최신 공고/법령 변화 재확인, GitHub 반영 및 CI·발행 승인 필요.
- 교체 완료: `02-site-appointment-conditions.webp` → `02-site-appointment-conditions-v2.webp`. 공식 표와 다른 사업소 사례를 삭제하고 동용인·이천의 필수 선임요건으로 교체
- 교체 완료: `03-required-versus-preferred.webp` → `03-required-versus-preferred-v2.webp`. 한전인재개발원A의 필수·우대 원문 확인 사례로 교체
