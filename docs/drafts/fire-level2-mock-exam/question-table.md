# 통합 문항 관리표

[필터 가능한 관리표 열기](question-table.html) · [통합 데이터](question-table.json)

하나의 행은 원본 또는 작성 문항 한 개다. 원본 500개와 변형 500개를 별개로 관리한다. 기존 작성분 1,980개에 원본 참조 500행을 더한 관리표는 총 2,480행이다. 원본을 새로 집필한 수량에 더하지 않는다.

| 구분 | 1과목 | 2과목 | 합계 |
|---|---:|---:|---:|
| 핵심 원본 | 254 | 246 | 500 |
| 핵심 변형 | 254 | 246 | 500 |
| 일반 기본 | 490 | 250 | 740 |
| 일반 심화 | 490 | 250 | 740 |
| **관리표 전체** | **1,488** | **992** | **2,480** |
| 기존 작성분만 | 1,234 | 746 | 1,980 |

과목은 현재 챕터 배정 기준이다. 복원자료의 묶음명·연도·표시답은 공식 시험일이나 공식 확정답안의 인증을 의미하지 않는다.

## 컬럼 정의

| 컬럼 | 의미 |
|---|---|
| `id` | 기존 문항 ID 또는 원본의 sourceQuestionId. ID를 새로 바꾸지 않음 |
| `subjectId`, `subjectName` | 1과목 / 2과목. 모든 2,480행에 값 존재 |
| `chapterId`, `chapterTitle` | 연결 챕터와 제목 |
| `isCore` | 사용자 제공 원본 500행만 true. 화면에는 핵심 표시 |
| `questionType` | source_reconstruction(원본), source_variant(변형), general(기본), advanced(심화) |
| `difficulty` | 기본 / 심화 / 미지정. 핵심 여부와 난도를 분리 |
| `reviewStatus` | 현재 전체 pending(검수대기) |
| `contentStatus` | 초안 작성 / OCR 대조 필요 / 원문 시각 대조 필요 |
| `publicationStatus`, `examEligible` | 현재 모두 unpublished·false. 등록과 시험 출제 가능 여부를 분리 |
| `sourceQuestionId` | 원본은 자기 ID, 변형은 대응 원본 ID, 신규 기본·심화는 null |
| `question`, `choices`, `answerNumber`, `explanation` | 지문·선택지·1부터 시작하는 정답번호·해설 |
| `rawSourceText` | 원본 500개의 제공된 추출문. 누락된 선택지를 변형 문항으로 채우지 않음 |
| `sourceSet`, `sourcePDFPage`, `sourceTextProvenance`, `choicesExtraction` | 원자료 묶음·위치·추출 및 분리 상태 |

## 원본과 변형의 표시

- 핵심: 전달받은 원본 500개
- 핵심 변형: 그 원본 각각과 1:1로 연결된 별도 작성 500개. isCore=false
- 일반 기본·심화: 각각 740개. isCore=false
- 이전 core500.json의 파일명과 핵심 태그는 과거 변형 풀의 제작 이력이다. 최신 관리·필터는 이 통합표의 isCore와 questionType을 사용한다. 원본과 변형을 동일 문항으로 표시하지 않는다.

## 원문 대조 상태

원본 500개 중 선택지 4개를 구조적으로 분리한 행은 453개, 안전하게 분리하지 못해 choices=null로 둔 행은 47개다. 모두 원본 표시답·OCR·그림·현행 근거의 내용 검수 전이다. 선택지 미분리를 정상 4지선다로 표시하지 않으며 rawSourceText를 보존했다.

이 작업은 컬럼과 관리표 정리이며 원문 OCR 교정·정답 전수 검수·실서버 탑재가 아니다. 기존 작성 1,980개의 문제·선택지·답·해설 및 공개 src/public은 변경하지 않았다.

## 재생성

```bash
python3 scripts/build-fire-question-table.py --source /path/to/outline-data.json
node scripts/verify-fire-question-table.mjs
```
