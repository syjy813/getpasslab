# 컴활 2급 82~159 Web Work 반영·검수

기준선: main `27dc3924aff77f478df50c15b5b7b337125c7fdb` · 전용 브랜치 `codex/computer-literacy-082-159-web-20261002`

## 입력과 승인 경계

- 실제 첨부명은 `GetPassLab-computer-literacy-082-159-work-package(1).zip`, 내부 요청서는 `02_WORK_REQUEST_082_159.md`임. 사용자 메시지의 WEB 파일명과 다르지만 전체 요청서와 4개 배치를 확인함
- 요청서의 LOCAL·Commit 금지 조항보다 2026-10-02 사용자 직접 지시(Web Work·작업 브랜치 Commit/Push·Draft PR)를 우선 적용함
- Production용 main push, PR merge, Production deploy, force push는 승인되지 않음
- Master에 4개 배치가 그대로 포함되어 있음. SHA-256 manifest의 6개 입력 파일 크기·해시가 모두 일치함
- 기존 저장소에 없는 문항은 이전 사용자 전달 정본 `computer-literacy-writing-kit-2026-09-24.zip`에서 가져옴. 신규 문제를 창작하지 않음. 현재 main에 이미 있는 21개 참조 문항은 정본 입력과 충돌 없음

## 콘텐츠·데이터 결과

- 통합 순서 82~159 총 78개: 컴퓨터일반 72개, 스프레드시트일반 6개
- chapter ID·제목·subject_id·통합 순서·주/보조 배정 모두 277개 통합 목차 정본과 일치
- 주 149문항·보조 연결 59건, 중복 제외 참조 155문항. 정본 원문·선택지·정답·메타데이터 대조, 주 배정 중복 없음
- 저장소 문항 187→321: 필요한 정본 134문항만 추가. 기존 payload 전부 보존
- ADD 11개 챕터에 기출·출제 빈도 생성 없음
- 기존 공개 컴활 85개 파일(통합 1~81 및 기존 Excel 4개)과 기존 PNG 26개를 기준선 SHA-256으로 보호
- 원본 유지·기존 등록 2장 재연결·신규 원본 5장 추가. 외부 canonical ZIP는 변경하지 않음. 이미지 직접 대조 후 저장소의 미사용 `20200704_001`, `20200704_021`만 `jpg 확필`→빈 review로 변경
- 기존 URL·slug·본문 변경 없음. 신규 slug는 충돌 없이 지정. 통합 160 `P2-02a` 및 해당 주 문항·이미지는 추가하지 않음
- 화면에 편집 메모·question_id·내부 chapter ID·검수 상태를 노출하지 않음. 실제 관계 정본은 챕터 frontmatter이며 이 JSON은 검수 증거 스냅샷임
- 기존 과목 내 이동 규칙 적용: 81→82 연결, 컴퓨터일반 마지막 153과 스프레드시트 마지막 159의 다음 이동 비활성화. 160으로 이동하는 링크 없음. 기존 Excel 4개는 기존 그룹·순서 그대로 유지
- 별도 ‘전체 보기’ URL/기능은 현재 main에 없음. 기존 과목 전체 목록과 모바일 전체 챕터 펼침, PC 사이드바를 회귀 범위로 사용함

## 원문 대조에 따른 편집

모든 주 문항의 본문·4개 선택지·수록 정답을 확인해 초안의 설명과 대조함. 보조 전용 6문항도 확인했으며, 해당 챕터에서는 지정 범위만 설명함.

- 목록·헤더 summary는 잘린 문장 대신 짧은 판단 기준으로 작성
- TIFF/BMP를 항상 비압축이라고 설명하지 않음. WAV는 주로 PCM 데이터를 담는 파일 형식으로 조건 명시
- 성형과 트리형 비교, HTML5와 XML·VRML·JSP 구별, 슬래머·공격 결과·악용 기법 구별 보완
- 시트 전환의 Ctrl+Page Down/Up과 한 행 선택 범위 안 Enter 이동을 보완
- 데스크톱 계산 옵션은 열린 모든 통합문서, 웹용 계산 옵션은 해당 통합문서라는 차이 명시
- Smart TV 기능 중첩·IPv6 호환성/보안 표현·과거 255개 시트 제한은 별도 풀이 참고 안내로도 제공. 기존 부팅 키보드 조건부 안내 유지
- HomeGroup 제거, Easy Connect/Quick Assist, 프린터 설치 UI/포트·기본 프린터, IPv6 표기, OSI 참조 모델, 인터넷 분산 운영, Bluetooth 범위, hs/sc/퀵돔, IE/ActiveX, 악성코드 예방, Defender/방화벽, System Restore/개인 파일 백업, AutoComplete/AutoFill 및 Alt+Enter/Ctrl+Enter 조건 유지
- 공공기관 홈페이지 모든 자료가 비보호 대상이거나 모든 저작물 복사가 범죄인 것처럼 일반화하지 않음
- Point-in-time restore는 Windows 설치 드라이브의 파일·앱·설정만 복구한다는 범위를 명시. 다른 드라이브·클라우드 파일까지 되돌리는 기능으로 설명하지 않음

## 이미지 디자인 기준 적용 및 원본 대조

`docs/standards/learning-image-design-system-v1.md` v1.2를 읽고 원본 정확성·원본 유지형·alt·치수·390px 표시·원본과 파생본 구별·단계별 QA 구분을 적용함. 파생 이미지나 새 그림은 만들지 않음. 원본에 포함된 제목·설명은 시험 단서이므로 그대로 보존함. 아래 캡션은 검수용 학습 질문이며 공개 원본 그림 안에 중복 삽입하지 않음.

| 원본 | 학습 질문·캡션 | 대조 결과 |
|---|---|---|
| 20161022_008 | 핫스팟·무선 마우스·유선 LAN에 맞는 기술은? | Wi-Fi·Bluetooth·Ethernet, 수록 ③ |
| 20150307_001 | 주문형 음악 서비스의 기출 용어는? | MOD, 수록 ④ |
| 20200704_001 | 모형에 명암·색상을 더하는 작업은? | Rendering, 수록 ② |
| 20200229_012 | 관찰값·의미 있는 결과·사회 확산은? | 자료·정보·정보화, 수록 ② |
| 20150627_028 | 연속·비연속 시트 선택에 쓰는 키는? | Shift·Ctrl, 수록 ① |
| 20200704_021 | 실행 취소 아이콘으로 시트 삭제를 되돌릴 수 있는가? | 불가, 수록 ③ |
| 20190831_028 | 문제에서 주어진 D5에 Home을 누르면? | 같은 행 A5, 수록 ② |

7장 모두 PNG 원본·manifest SHA-256·등록 경로·치수·alt를 대조함. PC/모바일 공통 원본 사용. 색·화살표를 재제작하지 않으며, 그림의 문자·기호와 본문 설명으로 의미를 구별함. 20190831_028의 시작 위치 D5는 문제 원문 조건으로 확인함. 실행 취소 아이콘은 작은 원본 크기를 유지함.

## 공식 자료 재확인

확인일 2026-10-02. 상세 제품·법률 범위를 확장하지 않고 초안의 버전 구별에 필요한 내용만 사용함.

- [Microsoft 카메라·마이크 개인정보 설정](https://support.microsoft.com/en-us/windows/privacy/windows-camera-microphone-and-privacy): 데스크톱 앱 범위·웹사이트 권한·Windows Hello 예외
- [HomeGroup 제거](https://support.microsoft.com/en-us/windows/experience/connectivity-networking/homegroup-removed-from-windows-10-version-1803)
- [System Restore](https://support.microsoft.com/en-us/windows/experience/backup-recovery/system-restore), [Point-in-time restore](https://support.microsoft.com/en-us/windows/experience/backup-recovery/point-time-restore-for-windows): 시스템 설정과 파일 복구의 범위 차이
- [Excel 사양](https://support.microsoft.com/en-gb/excel/excel-specifications-and-limits?nochrome=true), [시트 이름](https://support.microsoft.com/en-us/excel/rename-a-worksheet), [시트 그룹](https://support.microsoft.com/en-us/excel/group-worksheets), [계산 옵션](https://support.microsoft.com/en-us/excel/change-formula-recalculation-iteration-or-precision-in-excel)
- [KRNIC .kr 도메인](https://krnic.or.kr/jsp/resources/domainInfo/krDomainInfo.jsp): 퀵돔·교육기관 도메인
- [Bluetooth SIG 범위](https://www.bluetooth.com/learn-about-bluetooth/key-attributes/range/)
- [RFC 4291](https://www.rfc-editor.org/info/rfc4291/), [RFC 5952](https://www.rfc-editor.org/info/rfc5952/), [ISO/IEC 7498-1](https://committee.iso.org/standard/20269.html?browse=tc), [ICANN](https://www.icann.org/resources/pages/about-icann)
- [저작권법 제7조](https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1029423769), [인공지능기본법 제3조](https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=00&joNo=0003&lsiSeq=282791&urlMode=lsScJoRltInfoR)

## 검증·진행 단계

- Web Work에서 Build 및 8개 검사 수행. 검사 명령은 `package.json`의 `check:*`와 동일
- 신규 checker는 원본 해시·보호 파일·관계·슬러그·표현·이미지·팝업·목차·이전/다음·BLOCKED 범위 검사
- 브라우저 installer의 ZIP 다운로드 오류로 이 Web Work 컨테이너에서 Chromium 구동 불가. 승인된 작업 브랜치·Draft PR의 GitHub Actions 임시 preview에서 QA 수행
- 브라우저 QA는 기존 1~81 회귀와 신규 전체 78개 및 81 경계 페이지의 390px/1440px, 신규 대표 8개 320px를 검사. 목차 펼침/접기·과목 전체 목록·PC 사이드바·팝업 열기/정답/닫기/재열기/Escape·이미지 decode/비율·표/문자 넘침·광고 예약 영역·이전/다음 실제 클릭 검증
- 광고의 실제 외부 송출은 preview에서 비활성화되므로 광고 예약 영역만 검증함. Chromium viewport QA이며 실물 휴대폰·Windows/Excel 앱 실행 검증은 아님
- CI 완료 후 `WEB_WORK_RESULT.md`에 실제 workflow·QA 결과를 확정 기록. main merge·Production deploy는 수행하지 않음

## BLOCKED

160 `P2-02a`는 `20200704_024` 실제 Excel 실행 재현 대기 및 `20190302_034` 원본 이미지 검수 필요 상태를 그대로 유지함.
