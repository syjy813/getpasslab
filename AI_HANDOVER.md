# AI_HANDOVER.md — GetPassLab 프로젝트 인수인계

> **이 문서를 읽는 AI에게**
> 당신은 지금부터 **GetPassLab** 프로젝트를 이어받는다. 이전 담당(Claude)과 프로젝트 오너(마일로)가 6주간 쌓은 맥락을 이 문서 하나로 전달한다.
> **이 문서만으로 작업을 시작할 수 있도록** 필요한 모든 것을 담았다. 더 깊은 내용은 아래 동반 문서를 참조하라.
>
> | 문서 | 언제 읽나 |
> |------|-----------|
> | **이 문서 (AI_HANDOVER.md)** | **지금. 전부.** |
> | `ARCHITECTURE.md` | 코드를 짜기 전 (§9 스키마, §7 조인 포함) |
> | `CODING_RULES.md` | 코드를 짤 때 (특히 §13 제약 블록) |
> | `DECISION_LOG.md` | "왜 이렇게 됐지?" 궁금할 때 |
> | `PRD.md` | 기능 세부가 필요할 때 |
> | `KNOWN_ISSUES.md` | 버그·부채를 건드릴 때 |
> | `ROADMAP.md` | 다음에 뭘 할지 |
> | `UI_UX_GUIDE.md` | UI를 만들 때 |
>
> **최초 작성일**: 2026-07-14 / **최종 갱신일**: 2026-08-02 / **작성자**: Claude·ChatGPT·Codex / **버전**: v1.8

---

## ⚡ 30초 요약 (먼저 이것만)

**GetPassLab** = 산업안전기사 수험생용 **기출 역설계 기반 핵심 요약 정적 웹사이트**.

- **스택**: Astro 5 + Markdown + GitHub Pages. **서버 없음, DB 없음, API 없음.** 모든 게 빌드 타임에 끝난다.
- **목적**: 1순위 = **이직 포트폴리오**, 2순위 = AdSense 수익.
- **현재**: 공개 챕터 198개와 정적 페이지 209개를 `getpasslab.co.kr` production에 배포했다. HTTPS·정책·SEO·AdSense·GA4 코드 통합, 공개 콘텐츠 내부 식별자 정리, 시험 인사이트 2개 배치, 관계·구조 정리 Gate A의 production 검증까지 완료됐다. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 별도 확인이 남았다.
- **최신 동적 상태**: 문서 맨 아래의 `관계·구조 정리 Gate A·production 검증 게이트 완료` 절을 우선한다.

**🚨 절대 하지 마라 (이것만 기억해도 대형 사고 방지):**
1. `slug` / `subject_id` / `question_id` **변경·생성 금지** (동결 키)
2. **Tailwind 쓰지 마라** — 설치 안 됨. `global.css`의 CSS 변수를 쓴다
3. **React/Vue 도입 금지** — `<details>`·`<dialog>`로 해결
4. **같은 정보를 두 곳에 저장 금지** (이중 원본)
5. **마일로 대신 최종 결정 금지** — 선택지와 근거까지만, 결정은 마일로

---

# 1. 프로젝트 요약

## 1.1 무엇인가

**한 문장**: 5개년 기출문제 1,675문항을 전수 DB화하고, 그 데이터를 **역으로 분석해 "실제로 출제되는 것만"** 챕터 단위로 정리해 보여주는 정적 웹사이트.

핵심 단위는 **챕터(chapter)**다. 1챕터 = 1개의 독립 학습 주제 = 1개의 URL = 1개의 SEO 랜딩 페이지.

각 챕터는 5개 섹션:

| 섹션 | 내용 | 생성 |
|------|------|------|
| 1. 핵심 공식 / 정의 | 공식·정의·⚠️함정 인용블록 | **수동** |
| 2. 단위·기호 해설 | 기호/명칭/단위/주의점 표 | **수동** |
| 3. 해석 / 의미 | 왜 중요한지, 어디 응용되는지 | **수동** |
| 4. 기출 출제 이력 | 빈도 라벨 + 회차 뱃지 + 클릭 시 문제 레이어 | **🤖 빌드 자동** |
| 5. 관련 챕터 | 동일 그룹 + 수동 지정 링크 | **🤖 빌드 자동** |

## 1.2 차별화 — 왜 이게 이기는가

> **섹션 4가 이 서비스의 해자(moat)다.**
> 기출 전수 DB가 있어야 *"옴의 법칙은 단독 출제 0건, 응용 결합형 100%"* 같은 **시중 수험서에 없는 인사이트**를 데이터에서 자동 도출할 수 있다. 경쟁 서비스가 복제 불가능한 지점.

시장 관찰: comcbt 등 기존 사이트는 **문제풀이(CBT) 특화** → **구조화된 요약 사이트가 빈 공간.** 산업안전기사는 **연 3회 시험**이라 트래픽 스파이크가 주기적.

## 1.3 목적과 우선순위 (이걸 모르면 모든 판단을 오독한다)

| 순위 | 목적 | 함의 |
|------|------|------|
| **1순위** | **이직 포트폴리오 / 제품 빌딩 역량 증명** | "문제 정의 → IA → 구현 → 출시 → 데이터 분석 **전 사이클 혼자 수행**"이라는 면접 서사 |
| **2순위** | AdSense 수익 | 이직 시점까지 유의미한 금액 안 됨(계산 확인). **수익은 포트폴리오의 증거로서 가치** |

> **🎯 AI에게**: 제안할 때 "이게 수익에 더 좋다"만으로는 부족하다. **"포트폴리오 서사에 어떤 영향을 주는가"**를 함께 답해야 마일로의 기준에 맞는다.

## 1.4 오너 — 마일로

| 항목 | 내용 |
|------|------|
| 직무 | IT 서비스 기획자 (현직 SOOP 플랫폼 BM팀) → 대형 IT사 이직 목표 |
| 기술 이해도 | **개념은 이해. 코드는 직접 쓰지 않음.** 구현 단계 설명 불필요 |
| 커뮤니케이션 | **결론 먼저. 분석적. 표·목록 선호. 이모티콘·아부 금지** |
| 의사결정 | AI가 **근거+선택지 제시** → 마일로가 **직접 결정** |
| 도메인 지식 | 산업안전기사 **필기 합격, 실기 준비 중** → 콘텐츠 직접 검수 가능 |
| 제약 | 토큰 효율 중시. 공조냉동 과정평가형 수업 병행(시간 제약) |

---

# 2. 현재 개발 상태

## 2.1 진행률

```
기획·설계        ██████████ 100%
디자인 시스템    █████████░  90%
기출 데이터      █████████░  90%   (이미지 문제 미해결)
아키텍처·인프라  ████████░░  85%   (도메인 미연결)
UI 구현          ███████░░░  70%   (검색·탭바 미완)
출시 필수 콘텐츠 ██████████ 100%+  (82/77) ✅
SEO              ██░░░░░░░░  20%
수익화           █░░░░░░░░░  10%   (AdSense 미신청)
법적·정책        ░░░░░░░░░░   0%   (terms/privacy 없음)

Phase 1 전체 ≈ 62%  /  출시 준비도 ≈ 45%  /  콘텐츠 준비도 100%
```

## 2.2 완료된 것 ✅

- 브랜드/도메인 확정 (GetPassLab / getpasslab.site — **도메인 구매만, 미연결**)
- 기출 DB **1,675문항** → `questions.json` 탑재
- 디자인 시스템 Astro 이식 (토스풍 블루, Pretendard, 4px)
- URL 구조 `/industrial-safety/written/[subject]/[slug]/` 확정
- 과목 슬러그 6종 **동결**
- 페이지 5종 구현 (홈 / 자격증 허브 / 필기 / 과목 목차 / 챕터 상세)
- GitHub Pages 배포 파이프라인 개통 (`syjy813.github.io/getpasslab/`)
- **출시 필수 챕터 82개 작성 완료** (v3 템플릿)
- GNB 드롭다운, 사이드바, 브레드크럼, 기출 뱃지, 문제 모달

## 2.3 진행 중 / 미검증 ⏳

- **노션 → git 이관 Cowork 세션** (지시문 완성, 실행 미확인)
- 챕터 스텁 md 171개 생성 / `/admin/` 페이지 / status 빌드 필터
- 과목 탭 바 (지시문만)

## 2.4 미착수 (출시 블로커) 🔴

- `/terms`, `/privacy` — **AdSense 승인 요건**
- 커스텀 도메인 연결
- SEO 기본 (canonical / OG / sitemap / robots)
- 사이트 내 검색 (**Pagefind 미설치**)
- AdSense 신청 / GA4 연동

## 2.5 🚨 확인해야 할 불확실 항목

| # | 항목 | 왜 |
|---|------|-----|
| 1 | **출시 목표 일정** | "2025.08~2026.01"(문서) vs "8월 출시"(대화) vs 첫 대화 2026-06 — 6개월 불일치. **연도 오기 추정. 마일로 확인 필수** |
| 2 | **이미지 기출문제 수** | `review: "jpg 확필"` 표기만, 이미지 없음. 규모 파악 필요 |
| 3 | **이관 세션 완료 여부** | 지시문만 확인됨 |

---

# 3. 프로젝트 구조

## 3.1 디렉토리 (실제 코드 확인)

```
getpasslab/
├─ .github/workflows/deploy.yml       # GitHub Actions 배포
├─ public/
│  └─ robots.txt                      # Disallow: /admin/
├─ src/
│  ├─ config/
│  │  ├─ subjects.ts                  # ★ 동결 키 SUBJECTS 맵
│  │  └─ url.ts                       # ★ withBase() — base path 유틸
│  ├─ content.config.ts               # ★ Zod 스키마 (데이터 계약)
│  ├─ content/chapters/
│  │  ├─ safety-management/  (1과목)
│  │  ├─ ergonomics/         (2과목)
│  │  ├─ mechanical/         (3과목)
│  │  ├─ electrical/         (4과목)  예: ohm-law.md
│  │  ├─ chemical/           (5과목)
│  │  └─ construction/       (6과목)   # 총 253개 (작성완료 82 + 스텁 171)
│  ├─ data/questions.json             # ★ 기출 1,675문항 (단일 파일)
│  ├─ layouts/
│  │  ├─ BaseLayout.astro             # 일반 페이지 셸
│  │  └─ ChapterLayout.astro          # 챕터 상세 (사이드바 포함)
│  ├─ components/
│  │  ├─ GNB.astro
│  │  ├─ Footer.astro
│  │  ├─ QuestionHistory.astro        # ★ 섹션 4 (기출 뱃지+모달)
│  │  └─ RelatedChapters.astro        # ★ 섹션 5
│  ├─ pages/
│  │  ├─ index.astro                  # /
│  │  ├─ admin/index.astro            # /admin/ (noindex) — 미검증
│  │  └─ industrial-safety/
│  │     ├─ index.astro               # 자격증 허브
│  │     └─ written/
│  │        ├─ index.astro            # 필기 허브
│  │        └─ [subject]/
│  │           ├─ index.astro         # 과목 목차
│  │           └─ [slug].astro        # 챕터 상세 ★
│  └─ styles/global.css               # ★ 디자인 토큰 (단일 파일)
├─ astro.config.mjs
└─ package.json                       # 의존성 4개뿐
```

## 3.2 데이터 흐름 (핵심)

```
챕터 md (frontmatter + 본문 1~3섹션)  ─┐
questions.json (기출 1,675문항)        ─┤
subjects.ts (동결 키)                  ─┼─► [Astro 빌드: Zod 검증 → 조인 → getStaticPaths]
global.css (디자인 토큰)               ─┘         │
                                                   ▼
                                          정적 HTML (조회·계산 없음)
                                                   │
                                          GitHub Pages → 사용자
```

**"API 호출"에 해당하는 것은 `getCollection()`이다.** 네트워크가 아니라 파일 시스템, 런타임이 아니라 빌드 타임.

## 3.3 챕터 페이지의 조인 (아키텍처의 심장)

```astro
---
// src/pages/industrial-safety/written/[subject]/[slug].astro
export async function getStaticPaths() {
  const chapters = await getCollection('chapters');
  return chapters
    // 🔴 .filter(c => c.data.status === '작성완료')  ← 이관 후 반드시 추가
    .map(ch => ({
      params: {
        subject: SUBJECTS[ch.data.subject_id].slug,   // ← 동결 키 조인
        slug: ch.data.slug,                            // ← 동결 키
      },
      props: { chapter: ch },
    }));
}
const { chapter } = Astro.props;
const { Content } = await render(chapter);

// 조인: 챕터 → 기출 (섹션 4)
const allQuestions = await getCollection('questions');
const linked = chapter.data.questions             // frontmatter의 ID 배열
  .map(id => allQuestions.find(q => q.data.id === id)?.data)
  .filter(Boolean);                               // 🔴 오타 ID가 조용히 사라짐 (ISS-04)
---
<ChapterLayout {...chapter.data}>
  <Content />                                     <!-- 섹션 1~3: 수동 -->
  <QuestionHistory questions={linked} ... />      <!-- 섹션 4: 자동 -->
  <RelatedChapters ... />                         <!-- 섹션 5: 자동 -->
</ChapterLayout>
```

---

# 4. 반드시 이해해야 하는 핵심 개념

> **이 5개를 이해하지 못하면 사고가 난다.**

## 4.1 🔑 동결 키 (Frozen Keys) — 최우선

**절대 변경 불가한 식별자 3종:**

| 키 | 형식 | 3가지 역할 |
|----|------|-----------|
| `slug` | 영문 kebab-case (`ohm-law`) | URL 식별자 + 조인 키 + (Phase 2) 유저 기록 참조 |
| `subject_id` | 정수 1~6 | URL 세그먼트 + 조인 키 |
| `question_id` | `YYYYMMDD_NNN` (`20220424_061`) | 기출 식별자 + (Phase 2) 오답노트 참조 |

**왜 동결인가**: 이 셋은 **URL·조인·유저 데이터 참조를 동시에** 담당한다. 바꾸면 ① SEO 인덱스가 죽고 ② 기출-챕터 관계가 끊기고 ③ Phase 2 유저 데이터가 고아가 된다.

**실무 규칙:**
- 슬러그는 **CSV/기존 값 그대로.** 🚨 **AI가 임의 생성 절대 금지.**
- 슬러그 공란이면 **만들지 말고 보고**한다.
- `question_id`의 `YYYYMMDD_NNN` 형식은 **문자열 정렬 = 날짜 정렬**이 되게 설계됨. 형식을 바꾸면 뱃지 정렬이 깨진다.

**과목 슬러그 (동결 완료):**
| id | 과목 | slug |
|----|------|------|
| 1 | 산업재해 예방 및 안전보건교육 | `safety-management` |
| 2 | 인간공학 및 위험성평가·관리 | `ergonomics` |
| 3 | 기계·기구 및 설비 안전관리 | `mechanical` |
| 4 | 전기설비 안전관리 | `electrical` |
| 5 | 화학설비 안전관리 | `chemical` |
| 6 | 건설공사 안전관리 | `construction` |

> ⚠️ 구 슬러그(`accident-prevention`, `machine-safety` 등)가 보이면 **레거시**. 갱신 대상.

## 4.2 단일 진실 원천 (이중 원본 절대 금지)

**이 프로젝트가 실제로 가장 크게 데인 문제다.** 노션과 md에 챕터 상태를 이중 기입하다가 장부-실물 불일치가 반복 발생 → 노션을 **동결(읽기 전용)**하고 git으로 단일화했다.

| 데이터 | 유일한 집 |
|--------|-----------|
| 챕터 본문 | `src/content/chapters/**/*.md` |
| 챕터 메타 | 같은 md의 **frontmatter** |
| 기출문제 | `src/data/questions.json` |
| **기출↔챕터 관계** | 챕터 frontmatter의 **`questions` 배열** ← 여기만 |
| 과목 정보 | `src/config/subjects.ts` |
| 디자인 토큰 | `src/styles/global.css` |
| 문서·정책 | 노션 (**읽기 전용. 최신 아닐 수 있음**) |

> 🚨 **`questions.json`에 챕터 정보를 넣지 마라.** 관계를 양쪽에 두면 다시 이중 원본이 된다.
> 🚨 **본문을 DB화하지 마라.** git 줄 단위 이력이 본문 관리의 핵심 인프라다. DB화하면 "변환 계층"이 부활한다.

## 4.3 빌드 타임에 모든 게 끝난다 (런타임 없음)

서버·DB·API·상태관리 라이브러리가 **전부 없고, 필요 없다.**

| 없는 것 | 이유 |
|---------|------|
| 백엔드 / DB / REST API | 정적 사이트. 파일만 서빙 |
| Redux/Zustand 등 상태관리 | 변하는 값이 없다 |
| React/Vue | Astro 컴포넌트 + 네이티브 HTML |
| localStorage / fetch | MVP엔 저장할 상태·가져올 API 없음 |

**Phase 2(웹앱)에서 Supabase가 처음 등장한다. 그때도 원칙: DB로 가는 건 사용자 데이터뿐. 콘텐츠는 계속 git.**

## 4.4 역설계 콘텐츠 전략

```
① 기출 DB 전수 구축 → ② 기출 기준 챕터 재정비 → ③ 기출 기준 본문 작성
```
챕터를 먼저 만들면 "출제 안 되는 내용을 열심히 쓰는" 낭비. **무엇을 안 써도 되는지 먼저 아는 것**이 1인 운영의 최대 레버리지. 이 순서가 §1.2 차별화를 가능케 한다.

## 4.5 섹션 4·5는 빌드 자동 생성

챕터 본문에 **기출 링크를 하드코딩하면 안 된다.** frontmatter `questions` 배열에 ID만 넣으면, 빌드 타임에 `questions.json`과 조인해 섹션 4를 자동 렌더한다. 이 덕에 챕터당 수작업이 700~900자로 줄어 **82개 양산이 가능했다.**

---

# 5. 지금까지의 주요 의사결정

> 전체 76건은 `DECISION_LOG.md`. 여기선 **파급력 큰 것만.**

| # | 결정 | 핵심 이유 | 유효 |
|---|------|-----------|------|
| **주제** | 산업안전기사 (조합 추천 사이트 기각) | **공인 원본(공단) 존재** → 정답 명확·갱신 예측 가능 | ✅ |
| **구현** | 노코드(Notion+Super.so) 기각 → **Astro 직접 구현** | ① AdSense 삽입 제약 ② 포트폴리오 서사 ③ 웹앱 확장 | ✅ (**정체성 규정**) |
| **동결 키** | `slug`/`subject_id`/`question_id` 불변 | URL·조인·유저 데이터 동시 담당 | ✅ |
| **역설계** | 기출 먼저 → 챕터 → 본문 | 안 써도 되는 것을 먼저 앎 | ✅ |
| **섹션 축소** | 7섹션 → 5섹션, 4·5 자동 생성 | 254개 양산 가능케 | ✅ |
| **노션 동결** | 읽기 전용 + git 단일화 | **이중 기입 불일치를 실제로 겪음** | ✅ |
| **본문 DB화 기각** | 메타만 frontmatter, 본문은 md | git 이력이 핵심 인프라 | ✅ |
| **확장 순서** | 산안 → **컴활 2급**(연 50만) → 공조냉동 | 정량 근거가 "포화" 정성 판단을 이김 | ✅ |
| **무관 카테고리 금지** | 정치·선거 등 절대 추가 안 함 | **AdSense 계정 위험** | ✅ (불변식) |
| **Phase 2 스택** | Supabase + Stripe | 공식 통합 + **결제 구현 경험 자체가 목표** | ✅ |
| **디자인** | 미니멀·집중 | **광고와 충돌 안 함** = 수익화 인프라 | ✅ |
| **withBase()** | 모든 링크를 감쌈 | 도메인 연결 시 설정 한 줄로 전체 정상화 | ✅ |
| **네이티브 인터랙션** | `<details>`/`<dialog>` | 접근성·상태관리를 브라우저가 공짜 제공 | ✅ |

**AI가 정성 판단을 뒤집은 사례 (교훈):** Claude가 컴활을 "포화 시장"이라 했다가 응시자 50만 근거로 2순위 승격. 또 "AdSense로 Rewarded Interstitial 불가"라 오답했다가 마일로 증거로 정정. → **광고 정책·시장 판단·최신 수치를 단정하지 마라.**

---

# 6. 개발 시 주의사항

## 6.1 🔴 절대 규칙 10개 (Hard Rules)

| # | 규칙 | 위반 시 |
|---|------|---------|
| 1 | `slug`/`subject_id`/`question_id` 변경·생성 금지 | URL·SEO·유저 데이터 붕괴 |
| 2 | **Tailwind 클래스 금지** | 미설치. 동작 안 함 |
| 3 | 색상·간격 하드코딩 금지 → `var(--*)` | 일관성 붕괴 |
| 4 | **React/Vue 도입 금지** → `<details>`/`<dialog>` | 프레임워크 없음 |
| 5 | 컴포넌트에서 `getCollection()` 호출 금지 | 조회=페이지, 표현=컴포넌트 |
| 6 | 링크 하드코딩 금지 → `withBase()` | GitHub Pages 404 |
| 7 | 챕터 본문에 기출 링크 하드코딩 금지 | 253개 유지보수 불가 |
| 8 | 같은 정보 두 곳 저장 금지 | 이중 원본 |
| 9 | `npm run build` 성공 없이 push 금지 | 스키마 위반 배포 |
| 10 | 마일로 대신 최종 결정 금지 | 선택지+근거까지만 |

## 6.2 CSS는 이렇게

```astro
<!-- ❌ 동작 안 함 -->
<div class="bg-blue-600 rounded-lg px-6 py-4">

<!-- ✅ 실제 방식 -->
<div class="card">
```
```css
/* ❌ */ .card { background:#F2F4F6; padding:24px; }
/* ✅ */ .card { background:var(--gray-100); padding:var(--space-6); }
```

**CSS 클래스 3계열** (실제 코드): `gpl-*`(타이포), 프리픽스 없음(레이아웃: `.container`/`.grid-3`), flat kebab-case(컴포넌트: `.card-title`/`.gnb-dropdown` — **BEM 아님**).

**주요 토큰**: `--primary-600`(#1D4ED8, 메인 블루), `--gray-900/800/600/200/100`, `--space-*`(4px 그리드), `--radius-md`(8px), `--fs-*`, `--fw-*`.

## 6.3 인터랙션은 이렇게

```
접기/펼치기 → <details>/<summary>   (GNB가 이 방식)
모달/레이어 → <dialog>              (기출 모달이 이 방식, data-open으로 연결)
탭         → <details> or CSS :target
그 외 최후  → 인라인 <script> 최소 코드
Phase 2    → 그때만 Astro Island (client:visible 등)
```

## 6.4 Astro 5 주의

- **Content Layer API** (`glob`/`file` loader). Astro 4 예제 복사 금지 (`type: 'content'`는 구문법).
- 링크는 **trailing slash** 필수 (`/electrica/ohm-law/`).
- 페이지가 `getStaticPaths`로 조회·조인, 컴포넌트는 props만 받는다.

## 6.5 Cowork 운영 규칙 (자동화 위임 시)

- 세션은 **과목 단위 분할** (한 번에 253개 금지)
- **시작 전 git pull, 완료 후 git push. 동시 세션 금지**
- 완료 후 **`npm run build` 검증** + dist에 스텁 누출 없는지 확인
- 노션 CSV export는 **반드시 `_all` 파일** (기본 파일은 뷰 필터가 반영돼 행 누락), **Include subpages 끄기** (안 끄면 md 1,690개 딸려옴)

---

# 7. 자주 실수하는 부분

> **이전 담당(Claude)과 도구들이 실제로 저지른 실수. 반복하지 마라.**

| # | 실수 | 올바른 것 |
|---|------|-----------|
| 1 | **"Tailwind로 만들어줘"** → 먹통 코드 | `global.css` CSS 변수 + 기존 클래스 |
| 2 | **`#1D4ED8` 하드코딩** | `var(--primary-600)` |
| 3 | **React 컴포넌트로 드롭다운/모달** | `<details>`/`<dialog>` |
| 4 | **`<a href="/...">` 직접** → 404 | `<a href={withBase('/...')}>` |
| 5 | **슬러그를 AI가 생성** | CSV 값 그대로. 없으면 보고 |
| 6 | **컴포넌트가 `getCollection()` 호출** | 페이지가 조회 → props |
| 7 | **본문에 기출 링크 하드코딩** | frontmatter `questions` 배열 |
| 8 | **광고 정책·시장·최신 수치 단정** | 확인 후 답 (Claude가 AdSense·컴활에서 오답) |
| 9 | **일정을 데드라인으로 가정** | 확인 (Claude가 1/15를 출시일로 오독) |
| 10 | **`status` 필터 없이 챕터 카운트** | `.filter(c => c.data.status === '작성완료')` |
| 11 | **`filter(Boolean)`로 오타 ID 방치** | Map 인덱싱 + 미매칭 경고 |
| 12 | **Claude Design 새 프로젝트 생성** | 기존 프로젝트에서 작업 (토큰 재사용) |
| 13 | **노션 기본 CSV export** | `_all` 파일 + subpages 끄기 |
| 14 | **근사 표기 "2018~2022 공통"** | 개별 회차 명시 or 미표기 (데이터 신뢰도) |

---

# 8. 기존 대화에서 암묵적으로 합의했던 내용

> **명시적 문서엔 없지만 실제로 합의된 것들.** 이걸 어기면 마일로가 "이거 아닌데" 한다.

| # | 암묵적 합의 | 출처 |
|---|-------------|------|
| 1 | **"기능 부족은 트래픽 손실 적지만, 콘텐츠 부족은 치명적"** — AdSense 승인도 콘텐츠 충실도 기준 | MVP 범위 축소 논리 |
| 2 | **"완벽 정리 후 이관"이 아니라 "이관 후 다듬기"** — 좋은 도구로 옮긴 뒤 정리 | 노션 이관 |
| 3 | **PC 시안을 축소해 모바일 만들지 않는다** — 컬러·타이포·컴포넌트 스타일만 참고, 레이아웃은 모바일부터 | 디자인 이식 |
| 4 | **접기(accordion) 남용 금지** — 5섹션 전부 펼침 (SEO+학습 흐름) | 섹션 구조 |
| 5 | **"준비 중"은 숨기지 않되, 미완성은 숨긴다** — 빈 과목/실기 카드는 "준비 중" 표시, 스텁 챕터는 빌드 제외 | UX |
| 6 | **자연 분량 원칙** — 억지로 늘리지 않는다. 분량은 하한선이 아니라 관찰값 | 콘텐츠 |
| 7 | **명사형 어미 문체** — "~함", "~임" (스캔 가독성) | 콘텐츠 |
| 8 | **저트래픽 페이지엔 광고 안 넣는다** — 자격증 허브=광고 0 | 광고 배치 |
| 9 | **운영자 익명** (MVP) — 하나의 제품으로 보이게 | 푸터 |
| 10 | **미매칭 기출 = 신규 챕터 후보** — 어느 챕터에도 안 붙는 기출은 빠진 주제라는 신호 | 역설계 루프 |
| 11 | **의존성은 부채** — 4개 유지. 아이콘 8개 때문에 lucide 패키지 안 넣고 인라인 SVG | 성능 |
| 12 | **토스 인상은 참고, 자산은 미사용** — TDS 라이선스는 파트너사 전용 | 디자인 라이선스 |

---

# 9. 앞으로 가장 먼저 해야 할 일

> **크리티컬 패스: AdSense 심사가 2~4주 걸린다. 이게 유일한 진짜 병목이다. 지금 즉시 신청을 걸고, 대기 중에 나머지를 채운다.**

## 9.1 🔥 이번 주 (출시 준비, ≈1.5일)

```
0. 출시 목표 일정 확정 (마일로)                    ★★★
1. 이미지 기출문제 규모 파악:
   python3 -c "import json;qs=json.load(open('src/data/questions.json'));print(len([q for q in qs if q.get('review')]))"
2. 익명운영 vs 책임자 표기 결정 (마일로)           ★★★  ← 정책 페이지 선행
3. 커스텀 도메인 연결 (DNS + astro.config base 제거) 🟢 1h
4. /terms 작성                                     🟡 3h
5. /privacy 작성                                   🟡 3h
6. 문의 이메일 생성                                🟢 30m
7. SEO 기본 (canonical/OG/sitemap/robots) + title 통일  🟡 4h
8. GA4 연동                                        🟢 1h
9. 광고 슬롯 컴포넌트 (CLS 방지 고정 높이)          🟡 2h
10. Search Console 등록 + sitemap 제출             🟢 30m
★ 11. AdSense 신청                                 🟢 30m
```
**⑪을 걸어놓으면 이후 2~4주가 자유 시간이 된다.**

## 9.2 ⏳ 심사 대기 중 (병렬)

```
[이관] 노션 CSV export → Cowork 이관 세션 (TRACK 1~4)
       → 🔴 status 빌드 필터 4곳 (스텁 생성과 한 커밋!)
       → /admin/ 페이지
[버그] 🔴 filter(Boolean) 경고 로직 (이관 前 필수)
       BaseLayout Pretendard 확인
[기능] 사이트 내 검색 (Pagefind) / 과목 탭 바 / 챕터 좌우 이동
[콘텐츠] 이미지 기출문제 처리 / 1차 챕터 160개 양산
```

## 9.3 🎯 특별 권고 — 모의고사를 앞당겨라

**모의고사 A타입(기출 랜덤 출제 + 클라이언트 채점)은 Phase 3에 있지만, 정적 사이트에서 지금 구현 가능하다** (문제 데이터·랜덤·채점 전부 클라이언트, 기록 저장만 DB 필요→저장 없이 1회성으로). **AdSense 심사 대기 중 만들 수 있는 최고 가치 기능** — 체류시간 급증 = 광고 노출 증가 + 차별화.

## 9.4 🚨 순서가 생명인 3가지

| 반드시 | 안 지키면 |
|--------|-----------|
| **스텁 생성 + status 필터를 같은 커밋에** | "챕터 48개" 표시하고 클릭하면 12개 |
| **filter(Boolean) 경고를 이관 前에** | 병합된 오타 ID가 조용히 누락 |
| **AdSense를 최대한 빨리** | 시험 시즌(연 3회 중 다음 회차)을 놓침 |

---

# 10. AI에게 주는 개발 가이드

## 10.1 작업 프로토콜

1. **결론 먼저.** 서론·아부·이모티콘 없이.
2. **선택지를 표로, 각각 장단 명시.** 추천안+근거 제시.
3. **마일로가 결정.** 당신이 확정하지 마라.
4. **불확실하면 불확실하다고 말한다.** 수치·법령·최신 정보는 확인 후.
5. **코드는 완성본으로.** 마일로는 코드를 안 쓴다. "어디에 붙여넣는지"만 안내.
6. **작업 후 `npm run build` 성공 확인 후 push 안내.**

## 10.2 코드 생성 전 체크

- [ ] Tailwind 안 썼나 (→ `global.css` 변수)
- [ ] 색상·간격 하드코딩 안 했나 (→ `var(--*)`)
- [ ] React/Vue 안 썼나 (→ `<details>`/`<dialog>`)
- [ ] 링크를 `withBase()`로 감쌌나
- [ ] 동결 키를 건드리지 않았나
- [ ] 컴포넌트가 `getCollection()` 호출 안 하나
- [ ] `status: 작성완료` 필터를 넣었나 (챕터 카운트·목록)
- [ ] 새 디자인을 발명 안 했나 (카드 3종/버튼 3종 재사용)

## 10.3 복붙용 제약 블록

> **다른 AI(Cowork/Codex)에 코드를 시킬 때 이걸 앞에 붙여라:**

```
[GetPassLab 코딩 제약]
- Tailwind 쓰지 마라. 설치 안 됨. src/styles/global.css의 CSS 변수와 기존 클래스를 재사용하라.
- React/Vue 도입 금지. Astro 컴포넌트 + 네이티브 <details>/<dialog>로 해결.
- 색상·간격 하드코딩 금지. var(--primary-600), var(--space-4) 사용.
- 모든 링크는 withBase()로 감싼다 (src/config/url.ts).
- slug/subject_id/question_id는 동결 키. 변경·생성 금지. 없으면 보고.
- 컴포넌트에서 getCollection() 호출 금지. 페이지가 조회해 props로 내려준다.
- 챕터 목록·카운트는 status === '작성완료' 필터 필수.
- 새 디자인 발명 금지. 카드 3종/버튼 3종/기존 클래스로 커버됨.
- 작업 후 npm run build 성공 확인 후 push.
```

## 10.4 저장소 파악 명령 (인수 직후 실행)

```bash
# 스택 실체 확인
cat package.json | grep -iE "tailwind|pagefind|react|vue|sitemap"   # 앞 4개 없어야 정상
cat astro.config.mjs                                                  # base, site
cat src/content.config.ts                                            # 스키마 (priority/status 있으면 이관 완료)
cat src/config/subjects.ts                                           # 동결 키

# 진행 상태 확인
find src/content/chapters -name '*.md' | wc -l                        # 253이면 이관 완료
grep -rl "status: 미작성" src/content/chapters | wc -l                # 스텁 수
python3 -c "import json;print(len(json.load(open('src/data/questions.json'))))"  # 1675
find src/pages -name '*.astro'                                       # /admin/, /all 존재 여부

# 버그 확인
grep -rn "작성완료" src/pages src/layouts                            # status 필터 (ISS-01)
grep -rn "filter(Boolean)" src/                                      # 조용한 실패 (ISS-04)
grep -rn "pretendard" src/layouts src/styles                        # 폰트 로드 (ISS-05)

# 빌드 검증
npm run build && find dist -name index.html | wc -l                  # 스텁 누출 검사
```

## 10.5 자주 받을 질문과 답

| 질문 | 답 |
|------|-----|
| "Tailwind로 스타일 바꿔줘" | Tailwind 미설치. `global.css` CSS 변수로 함 |
| "이 챕터 슬러그 좀 바꿔줘" | 동결 키라 변경 불가. URL·SEO·유저 데이터가 깨짐. 대안 제시 |
| "노션에서 수정해줘" | 노션은 읽기 전용 아카이브. git이 진실 원천 |
| "검색 기능 고쳐줘" | 검색은 아직 미구현 (Pagefind 미설치). 구현부터 |
| "챕터 몇 개야?" | 작성완료 82 / 전체 253 (`/admin/` 또는 파일 수 확인) |
| "회원 기능 추가하자" | Phase 2 범위. MVP는 광고 모델이라 로그인=순손실 |

## 10.6 마지막 당부

> **이 프로젝트를 관통하는 한 문장:**
> **"1인이 운영 가능한 최소 구조로, 기출 데이터가 스스로 말하게 만든다."**
>
> 새 기능을 제안할 때 **"혼자서 253개 챕터를 유지보수할 수 있는가"**를 통과하지 못하면 폐기 대상이다.
> 그리고 이건 **포트폴리오 프로젝트**다. 모든 기술 선택은 "혼자 전 사이클을 수행했다"는 서사를 강화하는 방향이어야 한다.

---

## 부록: 동반 문서 지도

| 필요할 때 | 문서 | 핵심 내용 |
|-----------|------|-----------|
| 배경 전체 | `PROJECT_CONTEXT.md` | 목적·철학·타겟·확장 |
| 기능 세부 | `PRD.md` | 51기능 + 폐기 13 (10필드) |
| 코드 짜기 전 · 데이터 다룰 때 | `ARCHITECTURE.md` | 구조·조인·**스키마(§9)**·문서-코드 불일치 |
| 코드 짤 때 | `CODING_RULES.md` | 규칙·§13 제약블록 |
| "왜?" 궁금할 때 | `DECISION_LOG.md` | 76건 (대안·기각·유효성) |
| UI 만들 때 | `UI_UX_GUIDE.md` | 토큰·컴포넌트·접근성 |
| 다음 할 일 | `ROADMAP.md` | 크리티컬 패스·리스크 |
| 이력 추적 | `CHANGELOG.md` | 시간순 변경 |
| 버그 건드릴 때 | `KNOWN_ISSUES.md` | 이슈 34건 (우선순위) |

**환영한다. 이제 저장소를 clone하고 §10.4를 실행하는 것부터 시작하라.**

---

## 공개 기출 안전 필터 게이트 (2026-07-17)

- 공개 기출 안전 필터 구현 완료
- 검증된 커밋: `684797c`
- Push 및 Owner 승인 완료
- 공개 페이지에서 `jpg 확필`·빈 선택지 문항 제외
- 중복 ID 렌더 방지 및 Map 조회 적용
- 해당 게이트 당시 build 성공
- 남은 매핑 관계 정리와 이미지 위험

---

## P1 콘텐츠 작성 게이트 완료 (2026-07-18)

### 현재 단계

- P1 draft 콘텐츠 작성 게이트 완료
- 48개 draft 챕터를 공개 완료 상태로 전환
- 다음 단계는 draft 구조 정리 또는 P2 콘텐츠 백로그 처리

### 완료 작업

- 기출 원본 데이터 검증·보정 완료
- 공개 기출 안전 필터 구현 완료
- 중복·과목 불일치 관계 정리 완료
- 콘텐츠 적합성 기반 관계 정제 완료
- P1 콘텐츠 챕터 48개 작성 완료
- P1 과정에서 확인된 대체 관계 정리 완료
- clean-cache build 성공

### 검증된 현재 수치

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 253 |
| 공개 완료 챕터 | 119 |
| 전체 기출↔챕터 관계 | 768 |
| 매핑 고유 문항 | 756 |
| 미매핑 문항 | 924 |
| 다중 매핑 문항 | 12 |
| 무결성 오류 | 0 |
| 생성 페이지 | 130 |

### 주요 커밋

- `684797c` — 공개 기출 안전 필터
- `20a174a` — 중복·과목 불일치 관계 정리
- `89b9193` — 관계 정제
- `a8a00d5` — P1 Batch 3 후속 관계 정리 및 P1 최종 상태

### 남은 위험

- 구조 결정이 필요한 중복 draft 5개
- 과대범위 draft 11개
- Owner 검토 draft 2개
- orphan draft 13개
- P2·P3 콘텐츠 백로그
- 신규 챕터 후보군
- 미매핑 문항 잔여
- 이미지가 필요한 `jpg 확필` 문항
- 기존 Pretendard 경고
- 기존 KaTeX Unicode 경고
- `20210814_107` 미매핑 상태
- `safety-improvement-plan-items` subject 경계 이슈

### 다음 작업 (제안)

1. 중복·과대범위·Owner 검토 draft 구조 결정
2. 승인된 구조 정리 구현
3. P2 콘텐츠 작성
4. 신규 챕터 후보 검토
5. 이미지 자산 및 공개 가능 문항 확대

P2·P3 완료, draft 병합·분리 확정, 신규 챕터 확정, 전체 미매핑 분류 완료,
production 배포 완료 및 현행 법령 검증 완료로는 해석하지 않는다.

---

## 누적 콘텐츠·관계 작업 중간 게이트 (2026-07-19)

### 현재 단계

- P1 콘텐츠 48개와 P1 이후 후속 콘텐츠 65개를 완료하여 완료 챕터 184개를 확보함.
- 현재 미시작 챕터는 69개이며, 대량 콘텐츠 작성 단계에서 잔여 챕터 유형별 처리 단계로 전환함.
- 다음 우선순위는 `RELATION_REQUIRED`, 법령·규격 확인, 구조 결정, 이미지 의존, retire/archive 후보 처리임.
- 저작권·출처 이용권, 광고, production 관련 판단은 Owner 게이트로 보류함.

### 완료된 작업

- 기출 원본 데이터 검증·보정 및 공개 기출 안전 필터 구현 완료.
- 중복·과목 불일치·의심 관계를 포함한 기출↔챕터 관계 무결성 정리 완료.
- P1 콘텐츠 48개 완료.
- P2 및 후속 콘텐츠 65개 완료: Batch 1 14개, Batch 2 16개, Batch 3 16개, Batch 4 10개, Batch 5 5개, READY 배치 4개.
- 과대범위 draft 오배치 관계 16건 제거 및 기존 적합 챕터 재배정 7건 완료.
- draft 관계 확장: Batch 1 27건(19개 draft), Batch 2 56건(29개 draft), Batch 3 21건(10개 draft), Batch 4 26건 추가 후 1건 오배치 제거.
- `clam-shell → 20200822_112` 오배치 제거 완료.
- `luminous-intensity → 20190303_028` 관계를 `point-source-illuminance`로 이동 완료.
- clean-cache build 195페이지 성공.

### 검증된 현재 수치

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 253 |
| 완료 챕터 | 184 |
| 미시작 챕터 | 69 |
| 전체 기출↔챕터 관계 | 888 |
| 매핑 고유 문항 | 876 |
| 미매핑 문항 | 804 |
| 단일 매핑 문항 | 864 |
| 다중 매핑 문항 | 12 |
| 존재하지 않는 참조 | 0 |
| 챕터 내부 중복 | 0 |
| subject 불일치 | 0 |
| 빈 body | 0 |
| 빈 choice 문항 | 16 |
| review 빈 값 | 1,607 |
| review `jpg 확필` | 73 |
| 생성 페이지 | 195 |

### 주요 커밋

- `9890b36` — P1 게이트 handover 갱신
- `749751b` — 과대범위 draft 오배치 관계 정리
- `9e14e22` — P2 Batch 1
- `c1aef6e` — P2 Batch 2
- `4b737c3` — P2 Batch 3
- `099e09d` — P2 Batch 4
- `416b4c4` — P2 Batch 5
- `04d2435` — READY 4개 작성
- `c32429d` — 조명 관계 이동
- 관계 확장 대표: `5e9ed05`, `93c91c2`, `ab5a2ef`, `f972141`, `50ea792`

### 남은 위험

- 미시작 챕터 69개.
- 분류 시점 73개 기준 `RELATION_REQUIRED` 10개, 법령·규격 보류 29개, 구조 결정 보류 14개, 이미지 의존 3개, retire/archive 후보 11개.
- 위 73개 분류에서 `READY_TO_WRITE` 4개는 완료되었고, `RELATION_MISMATCH` 2개는 `clam-shell` 관계 제거 및 `luminous-intensity` 관계 이동으로 조정됨. 분류 수치는 현재 69개에 다시 합산하지 않음.
- 신규 파워 쇼벨 챕터 후보: `20200822_112`.
- `20190303_028` 원문의 `5 Lumen` 단위 오류 가능성.
- `jpg 확필` 73개 및 빈 선택지 16개.
- 기존 Pretendard 경고와 KaTeX Unicode 경고 12건.
- `safety-improvement-plan-items` subject 경계 이슈.
- 저작권·출처 이용권 확인 보류, 광고·분석·법무·production 미검증.

### 다음 작업 (제안)

1. `RELATION_REQUIRED` 10개 처리.
2. 관계가 확보된 챕터의 추가 콘텐츠 작성.
3. 법령·규격 29개를 별도 Network 허용 검증.
4. 구조 결정 14개에 대한 Owner 승인.
5. 이미지 의존 3개 처리 정책 결정.
6. retire/archive 후보 11개 구조 정리.
7. 신규 파워 쇼벨 챕터 후보 판단.
8. 상용 MVP 전 저작권·광고·분석·production 게이트.

위 순서는 제안이며 Owner 승인 전 확정 사항으로 해석하지 않는다.

---

## 새 스레드 전환 기준 (2026-07-20)

이 절은 새 스레드에서 사용할 최신 검증 기준이다. 문서 앞부분의 과거 진행률·집계는 당시 기록으로 보존하며, 현재 상태 판단에는 이 절과 실제 저장소를 우선한다.

### 검증된 저장소 상태

- 기준 브랜치: `main`
- 작업 시작 HEAD: `e99521d1b5683979f766818d1dcea9b2b754ab38`
- 작업 시작 시 `main`과 `origin/main`은 동기화 상태였음.
- 작업 시작 시 working tree는 clean이었음.
- `42a0ccb14c02b2ddef719d2fa17219c6f9ff0c29`, `031f79b04a306eff79a515e361a8c4364c139c08`, `1330125117aa211ef975b2f561e9cd09ff46efa1`, `e99521d1b5683979f766818d1dcea9b2b754ab38`는 모두 `origin/main`에 반영되어 있음.

실제 저장소 집계:

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 253 |
| 완료 챕터 | 192 |
| 미시작 챕터 | 61 |
| 전체 기출↔챕터 관계 | 894 |
| 고유 매핑 문항 | 882 |
| 미매핑 문항 | 798 |
| 단일 매핑 문항 | 870 |
| 다중 매핑 문항 | 12 |
| 없는 question_id 참조 | 0 |
| 챕터 내부 중복 관계 | 0 |
| subject 불일치 관계 | 0 |
| 빈 body | 0 |
| 빈 choice 문항 | 16 |
| `review: ""` | 1,607 |
| `review: "jpg 확필"` | 73 |
| 생성 페이지 | 203 |

### 최근 검증 완료 작업

- `42a0ccb fix: move mismatched chapter relations`
  - `20220305_102`: `demolition-methods`에서 제거하고 `demolition-safety-measures`에 추가.
  - `20220305_070`: `electric-shock-factors`에서 제거하고 `shock-prevention`에 추가.
- `031f79b content: complete structured draft chapters`
  - `luminance`, `qualitative-assessment-items`, `quantitative-assessment-items`, `equipment-safety-three` 완료.
- `1330125 fix: restore illuminance question and relations`
  - `20180304_034`의 누락 보기 텍스트를 `A: 바닥`, `B: 천정`, `C: 가구`, `D: 벽`으로 복원.
  - `luminance → 20180304_027`, `illuminance-luminance-reflectance → 20180304_034` 관계 추가.
- `e99521d content: complete illuminance concept overview`
  - `illuminance-luminance-reflectance` 완료.

### 빌드 검증

- 실행: `npm.cmd run build -- --force`
- 결과: 성공, `203 page(s) built`.
- 새 오류·경고: 없음.
- 기존 경고: Pretendard 폰트 resolve 경고, KaTeX Unicode 경고 12건.
- 기존 로그: `public-question-filter`가 `jpg 확필` 및 빈 선택지 문항을 공개 렌더링에서 제외함.
- duplicate-id 경고는 재현되지 않음.

### 남은 확정 상태와 위험

- `lightning-rod-vs-arrester`: `lightning-arrester-conditions` 통합을 권장하며, 독립 챕터 작성은 비추천. 실제 merge/archive는 미실행.
- `accident-rate`: 비교 허브 유지 또는 `annual-1000-rate` 흡수 결정이 필요하며 현재 `STRUCTURE_REDEFINE_REQUIRED`. 수정 미실행.
- `construction-illuminance`: subject 2 일반 조도 기준과 subject 6 건설 조도 기준의 경계를 법령·기출 근거 확인 전 보류.
- 병합·archive 후보: `forklift-stability-criteria`, `forklift-stability-formula`, `inspired-volume-correction`, `safety-devices`, `lightning-rod-vs-arrester`. 파일 삭제나 archive 상태 구현은 미실행.
- `review: ""`은 PDF 보기·표 텍스트 누락까지 보증하지 않음. 확인된 사례는 `20180304_034`이며, 1,680문항 전체 재감사는 미실행.
- `jpg 확필` 73문항, 빈 choice 16문항, 법령·규격 의존 챕터, 기출 공개·사용 권리, 광고·분석·약관·개인정보·면책, production 배포·최종 QA는 남은 게이트임.
- Production 상태는 `UNVERIFIED`로 유지한다.

### 다음 승인 작업

1. 구조 병합·보류 후보의 실제 운영 처리 방식 결정.
2. `lightning-rod-vs-arrester` 통합 또는 archive 여부 결정.
3. `accident-rate` 유지·흡수 결정.
4. 남은 미시작 61개를 최신 상태 기준으로 재분류.
5. 관계·법령·이미지 위험을 기준으로 다음 배치 선정.

새 스레드는 위 상태와 실제 저장소가 일치하는지 확인한 뒤, 전체 감사를 반복하지 않고 Owner 승인 범위의 다음 작업으로 진행한다. 이 문서 갱신 자체는 `AI_HANDOVER.md`만 변경하며, push·production 작업을 포함하지 않는다.

---

## 구조 중복 정리 게이트 완료 (2026-07-20)

이 절은 Owner 승인과 ChatGPT 기술 리뷰가 완료된 구조 정리 이후의 최신 기준이다. 앞선 게이트의 수치와 기록은 당시 상태로 보존하며, 현재 상태 판단에는 이 절과 실제 저장소를 우선한다.

### 현재 단계

- `lightning-rod-vs-arrester`와 `accident-rate`의 구조 결정 및 구현 완료.
- 두 중복 미시작 스텁 제거 완료.
- 남은 미시작 챕터: 59개.
- 다음 단계: 미시작 59개 최신 재분류 및 다음 구현 배치 선정.
- Production 상태: `UNVERIFIED`.

### 완료 작업

#### `lightning-rod-vs-arrester`

- `lightning-arrester-conditions`에 피뢰침·피뢰기 구분 설명이 이미 포함된 것으로 확정.
- 미시작·본문 없음·관계 없음 상태의 중복 스텁 삭제.
- 신규 archive 상태, slug, 대체 관계 없음.
- 커밋: `4bc4e040aa4f7822c934c58cb4597a97bf2bb77c` — `content: remove redundant lightning comparison stub`

#### `accident-rate`

- 일반 재해율 개념을 `annual-1000-rate`에 최소 범위로 흡수.
- 동일한 기간·재해자 수·근로자 수 기준에서만 `연천인율 = 재해율 × 10` 관계 적용.
- 기존 기출 3건과 관계 유지.
- 미시작 중복 스텁 삭제.
- 신규 archive 상태, slug, 관계 없음.
- 커밋: `94fe08c4afab2d55295b10df3f6c55c449805e05` — `content: absorb accident rate into annual 1000 rate`

### 최신 검증 수치

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 251 |
| 완료 챕터 | 192 |
| 미시작 챕터 | 59 |
| 전체 기출↔챕터 관계 | 894 |
| 고유 매핑 문항 | 882 |
| 미매핑 문항 | 798 |
| 단일 매핑 문항 | 870 |
| 다중 매핑 문항 | 12 |
| 없는 question_id 참조 | 0 |
| 챕터 내부 중복 관계 | 0 |
| subject 불일치 관계 | 0 |
| 생성 페이지 | 203 |

합계 검산: `192 + 59 = 251`, `882 + 798 = 1,680`, `870 + 12 = 882`.

### 검증 결과

- 두 구조 정리 작업 모두 `git diff --check` 통과.
- 두 번째 작업 종료 시 Build 성공, `203 page(s) built`.
- 신규 오류·경고 없음.
- 기존 Pretendard resolve 경고, KaTeX Unicode 경고 12건, `public-question-filter` 로그만 존재.
- 작업 종료 시 working tree clean.
- Push 미실행.
- Production은 검증하지 않았으며 `UNVERIFIED` 유지.

### 남은 위험

다음 두 항목은 구조 결정이 완료되어 미결정 목록에서 제외한다: `lightning-rod-vs-arrester` 통합 및 중복 스텁 삭제, `accident-rate`의 `annual-1000-rate` 흡수 및 중복 스텁 삭제.

계속 유지하는 위험:

- `construction-illuminance` 과목·법령 경계.
- 나머지 병합·archive 후보: `forklift-stability-criteria`, `forklift-stability-formula`, `inspired-volume-correction`, `safety-devices`.
- `jpg 확필` 73문항 및 빈 choice 16문항.
- 법령·규격 의존 챕터.
- 기출 공개·사용 권리.
- 광고·분석·약관·개인정보·면책.
- production 배포 및 최종 QA.
- 기존 Pretendard·KaTeX 경고.

### 다음 작업

1. 남은 미시작 59개를 최신 저장소 기준으로 위험별 재분류.
2. 구조 정리 가능한 나머지 후보 판단.
3. `construction-illuminance`의 법령·과목 경계 검토.
4. 관계·법령·이미지 위험 기준으로 다음 구현 배치 선정.
5. 상용 MVP 전 법무·광고·production 게이트.

아직 확정하지 않은 사항: `construction-illuminance`의 최종 subject, 나머지 병합·archive 후보의 삭제, 법령 최신성, 기출 사용 권리, 광고·production 상태, 미시작 59개의 재분류 결과.

## 미시작 재분류 및 READY 4개 콘텐츠 게이트 완료 (2026-07-20)

이 절은 이전 게이트 기록을 삭제하거나 소급 수정하지 않고, 현재 상태 판단에 우선하는 최신 게이트 기록이다.

### 현재 단계

- 미시작 59개 최신 위험 재분류 완료.
- 재분류 결과의 ChatGPT 기술 리뷰 완료.
- `risk-assessment-procedure`를 `OWNER_DECISION_REQUIRED`에서 `LEGAL_STANDARD_REQUIRED`로 보정.
- READY_TO_WRITE 4개 작성과 최종 콘텐츠 보정 완료.
- 전체 완료 196개 / 미시작 55개.
- 현재 READY_TO_WRITE 잔여 0개.
- 다음 우선 작업은 관계 의미 재검토 4개.
- Production 상태: `UNVERIFIED`.

### 위험 재분류 결과

READY 4개 작성 후 남은 미시작 55개의 최신 분류:

| 분류 | 개수 |
|---|---:|
| RELATION_REQUIRED | 13 |
| RELATION_REVIEW_REQUIRED | 4 |
| LEGAL_STANDARD_REQUIRED | 23 |
| STRUCTURE_DECISION_REQUIRED | 8 |
| IMAGE_DEPENDENT | 2 |
| RETIRE_ARCHIVE_CANDIDATE | 4 |
| OWNER_DECISION_REQUIRED | 1 |
| 합계 | 55 |

보정 사항:

- `risk-assessment-procedure`
  - 최종 분류: `LEGAL_STANDARD_REQUIRED`
  - 사유: 사업·구조 결정이 아니라 현행 법령과 절차 검증이 선행 조건임.
- `OWNER_DECISION_REQUIRED` 잔여 1개: `construction-illuminance`
  - subject 2 일반 조도와 subject 6 건설 조도 및 법령 경계 판단 필요.

### READY 4개 완료 작업

다음 챕터를 `미시작`에서 `완료`로 전환했다.

- `reactive-dangerous-gases`
  - 연결 기출: `20220424_098`
  - 알루미늄분과 고온의 물 반응 시 수소 발생 범위.
- `toxicity-indices`
  - 연결 기출: `20210307_095`, `20180819_099`
  - LD50·LC50·TLV 구분 및 상가작용 혼합물 약 333 ppm 계산.
- `slope-collapse-prevention`
  - 연결 기출: `20220305_118`
  - 지표수·지하수 침투 방지 중심.
- `weber-fechner-law`
  - 연결 기출: `20210307_032`
  - 웨버 법칙과 페히너 법칙 구분.

공통 결과:

- 연결 기출과 로컬 PDF 원문·정답 대조 완료.
- `questions` 배열과 기출↔챕터 관계 변경 없음.
- 신규 slug·관계 없음.
- 4개 모두 `status: 완료`.
- 기출 링크는 기존 자동 생성 구조 유지.

### ChatGPT 콘텐츠 리뷰 보정

- `reactive-dangerous-gases`
  - 검증되지 않은 포스핀·과염소산·산소 범위 제거.
  - summary를 `알루미늄분 + 고온의 물 → 수소`로 제한.
- `toxicity-indices`
  - 빈 summary 보완.
  - LD50·LC50 정의 정밀화.
  - TLV를 법정 기준으로 단정하지 않도록 조정.
- `weber-fechner-law`
  - PDF 표기에 따라 `힉-하이만(Hick-Hyman) 법칙`으로 오탈자 수정.
- `slope-collapse-prevention`
  - ChatGPT 최종 리뷰에서 추가 수정 없이 통과.

### 커밋

- `7db887db1534211f00b4c43629015fe5bd593dda`
  - `content: complete ready risk-classified chapters`
  - READY 4개 작성.
- `a69e4c746c6407a0fef6ee4f3f5476785b89ba43`
  - `content: refine ready chapter accuracy`
  - ChatGPT 리뷰 보정 3개.

두 커밋은 ChatGPT 최종 기술 리뷰를 통과했으며 현재 Push 전 상태다.

### 최신 검증 수치

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 251 |
| 완료 챕터 | 196 |
| 미시작 챕터 | 55 |
| 전체 기출↔챕터 관계 | 894 |
| 고유 매핑 문항 | 882 |
| 미매핑 문항 | 798 |
| 단일 매핑 문항 | 870 |
| 다중 매핑 문항 | 12 |
| 없는 question_id 참조 | 0 |
| 챕터 내부 중복 관계 | 0 |
| subject 불일치 관계 | 0 |
| 빈 choice 문항 | 16 |
| review 빈 문자열 | 1,607 |
| review `jpg 확필` | 73 |
| 생성 페이지 | 207 |

### 검증 결과

- 연결 기출 5건의 PDF 본문·선택지·정답 대조 완료.
- `git diff --check` 통과.
- 기준 커밋의 clean-cache Build 성공, `207 page(s) built`.
- 신규 오류·경고 없음.
- 기존 경고: Pretendard resolve 경고, KaTeX Unicode 경고 12건, `public-question-filter` 로그.
- 기준 작업 종료 시 working tree clean.
- Push 미실행.
- Production `UNVERIFIED`.

이번 문서 갱신에서는 Build를 반복 실행하지 않았다. 기준 커밋의 검증 결과를 기록하고, 문서 변경 후 `git diff --check`만 다시 확인한다.

### 다음 우선 작업

1. `RELATION_REVIEW_REQUIRED` 4개 관계 의미 재검토
   - `ideal-gas-law`
   - `ladder-cage-standard`
   - `articulation-index`
   - `safety-education-hours`
2. 검토 결과에 따른 관계 이동·삭제·범위 재정의 여부 결정.
3. `RELATION_REQUIRED` 13개의 기출 후보 검색.
4. `LEGAL_STANDARD_REQUIRED` 23개를 Network 허용 별도 검증.
5. 구조·이미지·Owner 결정 항목 처리.
6. 상용 MVP 전 법무·광고·production 게이트.

### 남은 위험

- 관계 의미 재검토 4개.
- 직접 관계 후보가 필요한 챕터 13개.
- 현행 법령·표준 검증 23개.
- 구조 결정 8개.
- 이미지 의존 2개.
- retire/archive 후보 4개.
- `construction-illuminance` 과목·법령 경계.
- `jpg 확필` 73문항.
- 빈 choice 16문항.
- 기출 공개·사용 권리.
- 광고·분석·약관·개인정보·면책.
- production 배포 및 최종 QA.
- 기존 Pretendard·KaTeX 경고.

확정하지 않은 사항:

- 관계 재검토 4개의 실제 이동·삭제 대상.
- 관계 없는 13개 챕터의 신규 관계.
- 법령·규격 최신성.
- 구조 후보의 삭제·병합.
- 이미지 제공 정책.
- 신규 slug.
- 기출 사용 권리.
- 광고·production 상태.

## 관계 의미 재검토 게이트 완료 (2026-07-20)

이 절은 관계 의미 재검토 게이트의 최신 검증 상태를 기록하며, 앞선 과거 게이트보다 현재 상태 판단에 우선한다.

### 현재 단계

- `RELATION_REVIEW_REQUIRED` 4개 챕터, 총 10개 관계 검토 완료.
- PDF·`questions.json` 의미 대조 완료.
- 승인된 관계 수정 구현 완료.
- `RELATION_REVIEW_REQUIRED` 잔여 0개.
- 전체 완료 196개 / 미시작 55개 유지.
- 다음 우선 작업은 `RELATION_REQUIRED` 16개 기출 후보 검색.
- Production은 `UNVERIFIED`.

### 관계 처리 결과

#### KEEP 1건

- `safety-education-hours → 20220305_007`
- 근로자 교육시간 기준을 직접 묻는 문항이므로 유지.
- 최신 교육시간 수치는 별도 법령 검증 대상.

#### MOVE 2건

- `20220305_092`
  - `ideal-gas-law`에서 제거.
  - `chemical-classification`에 추가.
  - 위험물질 8대 분류 문항.
- `20220305_093`
  - `ideal-gas-law`에서 제거.
  - `reactive-dangerous-gases`에 추가.
  - 인화칼슘과 물의 반응으로 포스핀 발생 문항.

#### REMOVE 7건

`ladder-cage-standard`:

- `20220305_103`
- `20210814_109`

`articulation-index`:

- `20220305_028`

`safety-education-hours`:

- `20220424_004`
- `20220424_013`
- `20220424_015`
- `20220305_005`

공통 처리:

- 대체 관계를 억지로 생성하지 않음.
- 신규 slug·챕터 생성 없음.
- 제거 문항은 미매핑 상태로 전환.
- 신규 다중 매핑 없음.

### `reactive-dangerous-gases` 보강

- 기존 관계 `20220424_098` 유지.
- 신규 관계 `20220305_093` 추가.
- 알루미늄분 + 고온의 물 → 수소 설명 유지.
- 인화칼슘 + 물 → 포스핀 설명 추가.
- summary를 두 PDF 검증 사례 범위로 확장.
- 과염소산·산소 등 미검증 사례는 추가하지 않음.
- 법령 수치와 원문에 없는 반응식 계수는 추가하지 않음.

### 챕터별 후속 분류

- `ideal-gas-law`
  - 관계 처리 후 questions 0건.
  - `RELATION_REQUIRED`.
  - 독립 챕터 유지.
- `ladder-cage-standard`
  - 관계 처리 후 questions 0건.
  - `RELATION_REQUIRED`.
  - 독립 챕터 유지 여부는 향후 근거 확보 후 판단.
- `articulation-index`
  - 관계 처리 후 questions 0건.
  - `RELATION_REQUIRED`.
  - 독립 챕터 유지 여부는 향후 근거 확보 후 판단.
- `safety-education-hours`
  - questions 1건 유지.
  - `LEGAL_STANDARD_REQUIRED`.
  - 현행 교육시간 기준 확인 전 작성 보류.

### 최신 잔여 위험 분류

| 분류 | 개수 |
|---|---:|
| RELATION_REQUIRED | 16 |
| RELATION_REVIEW_REQUIRED | 0 |
| LEGAL_STANDARD_REQUIRED | 24 |
| STRUCTURE_DECISION_REQUIRED | 8 |
| IMAGE_DEPENDENT | 2 |
| RETIRE_ARCHIVE_CANDIDATE | 4 |
| OWNER_DECISION_REQUIRED | 1 |
| 합계 | 55 |

분류 변화:

- `ideal-gas-law`: 관계 재검토 → 관계 필요.
- `ladder-cage-standard`: 관계 재검토 → 관계 필요.
- `articulation-index`: 관계 재검토 → 관계 필요.
- `safety-education-hours`: 관계 재검토 → 법령·기준 검증 필요.

### 최신 검증 수치

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 251 |
| 완료 챕터 | 196 |
| 미시작 챕터 | 55 |
| 전체 기출↔챕터 관계 | 887 |
| 고유 매핑 문항 | 875 |
| 미매핑 문항 | 805 |
| 단일 매핑 문항 | 863 |
| 다중 매핑 문항 | 12 |
| 없는 question_id 참조 | 0 |
| 챕터 내부 중복 관계 | 0 |
| subject 불일치 관계 | 0 |
| 생성 페이지 | 207 |

### 검증 결과

- 대상 10개 문항 PDF·JSON 의미 대조 완료.
- 이미지·표 의존 문항 없음.
- `git diff --check` 통과.
- Build 성공, `207 page(s) built`.
- 신규 오류·경고 없음.
- 기존 경고: Pretendard resolve 경고, KaTeX Unicode 경고 12건, `public-question-filter` 로그.
- 작업 종료 시 working tree clean.
- Push 미실행.
- Production `UNVERIFIED`.

이번 문서 갱신에서는 Build를 반복 실행하지 않는다. 기준 커밋의 검증 결과를 기록하고, 문서 변경 후 `git diff --check`만 다시 확인한다.

### 커밋

- `68096ea11111233f7ab4d1120ad56b4eeb38dc08`
  - `fix: reconcile reviewed chapter relations`

### 신규 콘텐츠 후보로 남은 개념

삭제된 관계에서 다음 후보가 확인되었으나 신규 slug는 확정하지 않았다.

- 일반 사다리식 통로 기준: `20220305_103`, `20210814_109`
- 통화 간섭 수준: `20220305_028`
- 역할연기 교육방법: `20220424_004`
- 특별교육 내용: `20220424_013`
- 학습정도 4단계: `20220424_015`
- 안전보건 교육계획: `20220305_005`

위 문항은 현재 미매핑이며, 신규 챕터 또는 기존 범위 확장은 Owner 승인 전 확정하지 않는다.

### 다음 우선 작업

1. `RELATION_REQUIRED` 16개 전체의 기출 후보 검색.
2. 기존 805개 미매핑 문항에서 의미 후보 추출.
3. 기존 챕터로 연결 가능한 관계와 신규 콘텐츠 후보를 분리.
4. 관계 후보가 확보된 챕터의 다음 콘텐츠 배치 선정.
5. `LEGAL_STANDARD_REQUIRED` 24개는 별도 Network 허용 검증.
6. 구조·이미지·Owner 결정 항목 후속 처리.

### 남은 위험

- 직접 관계가 필요한 챕터 16개.
- 현행 법령·표준 확인 24개.
- 구조 결정 8개.
- 이미지 의존 2개.
- retire/archive 후보 4개.
- `construction-illuminance` 과목·법령 경계.
- 현재 미매핑 805문항.
- `jpg 확필` 73문항.
- 빈 choice 16문항.
- 기출 공개·사용 권리.
- 광고·분석·약관·개인정보·면책.
- production 배포 및 최종 QA.
- 기존 Pretendard·KaTeX 경고.

확정하지 않은 사항:

- 신규 콘텐츠 후보의 slug.
- 삭제된 7개 문항의 새 관계.
- `RELATION_REQUIRED` 16개 관계.
- 법령·규격 최신성.
- 구조 후보 삭제·병합.
- 이미지 정책.
- 기출 사용 권리.
- 광고·production 상태.

## explosion-types 콘텐츠 및 관계 중복 방지 게이트 완료 (2026-07-20)

이 절은 `explosion-types` 콘텐츠 구현과 관계 중복 방지 결정의 최신 검증 상태를 기록하며, 앞선 과거 게이트보다 현재 상태 판단에 우선한다.

### 1. RELATION_REQUIRED 후보 검색

- 미매핑 805개를 대상으로 `RELATION_REQUIRED` 16개 챕터의 후보를 읽기 전용으로 감사했다.
- 즉시 추가 추천으로 `explosion-types`의 다음 3건을 확정했다.
  - `20210814_089`
  - `20200926_100`
  - `20190427_087`
- 세 문항은 모두 기존 미매핑이었으며 PDF·`questions.json` 의미가 일치했다.
- 나머지 후보는 법령·구조·이미지 검토 대상으로 보류했다.

### 2. 중복 관계 방지 결정

- `20190427_084`는 이미 완료 챕터 `adiabatic-compression`에 연결되어 있음을 확인했다.
- 기존 관계는 커밋 `93c91c2`에서 추가됐다.
- `gas-state-change`에 추가하면 신규 다중 매핑이 발생하므로 추가하지 않았다.
- 기존 `adiabatic-compression` 관계를 유지했다.
- `gas-state-change`와 `ideal-gas-law`에는 이번 게이트에서 관계를 추가하지 않았다.
- `gas-state-change`의 독립 유지·흡수·retire 여부는 후속 구조 감사 대상으로 남겼다.
- 해당 상태는 `STRUCTURE_DECISION_REQUIRED`로 기록하되, 전체 위험 분류표는 이번 문서 작업에서 임의 재계산하지 않았다.

### 3. `explosion-types` 구현

- 변경 파일: `src/content/chapters/chemical/explosion-types.md`
- 관계 3건 추가.
- `status: 미시작 → 완료`.
- 물리·화학 분류와 기상·응상 분류를 서로 다른 관점으로 설명.
- 부정형 문제 판별과 세 기출의 정답 근거 추가.
- summary는 구현 범위에 맞게 최소 보정하고, slug·subject_id·title·group·tags·order·priority는 유지.
- 구현 커밋:
  - `d909bb8c9b012a230123cac88d1ad3c1960a3db6`
  - `content: complete explosion types chapter`

### 4. ChatGPT 리뷰와 보정

- 전체 diff와 현재 파일을 대상으로 표적 리뷰했다.
- 관계·정답·기상·응상 사례를 승인했다.
- 분해폭발 설명은 용어만으로 기상·응상 여부를 일반화할 위험이 있어 최소 보정했다.
- `20200926_100`의 선택지 구성 범위에서만 정답 근거를 설명하도록 제한했다.
- “분해폭발은 항상 기상폭발이다”와 같은 단정은 사용하지 않았다.
- 보정 커밋:
  - `f778ada2e1512d58180aa779797d6bb6c7c8d996`
  - `content: clarify decomposition explosion scope`

### 5. 최신 검증 수치

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 251 |
| 완료 챕터 | 197 |
| 미시작 챕터 | 54 |
| 전체 기출↔챕터 관계 | 890 |
| 고유 매핑 문항 | 878 |
| 미매핑 문항 | 802 |
| 단일 매핑 문항 | 866 |
| 다중 매핑 문항 | 12 |
| 없는 question_id 참조 | 0 |
| 챕터 내부 중복 관계 | 0 |
| subject 불일치 관계 | 0 |
| 빈 body | 0 |
| 생성 페이지 | 208 |

### 6. 검증 상태

- 직전 콘텐츠 구현과 보정 작업 모두 `git diff --check` 통과.
- 직전 보정 작업에서 전체 Build 성공.
- 핵심 출력: `208 page(s) built`.
- 신규 오류·경고 없음.
- 기존 경고: Pretendard resolve 경고, KaTeX Unicode 경고 12건, `public-question-filter` 로그.
- Production `UNVERIFIED`.
- 이번 handover 갱신에서는 Build를 반복 실행하지 않는다. 문서 한 파일만 변경하며 직전 콘텐츠 보정 작업에서 전체 Build 성공을 확인했다.

### 7. 남은 보류 사항

- `drying-equipment` 후보 4건: 현행 법령·기준 확인 필요.
- `gas-state-change`: 독립 유지·흡수·retire 구조 감사 필요.
- `articulation-index → 20210814_036`: 그래프 이미지 확보 필요.
- 관계 0건 챕터: 유지·retire 판단 필요.
- Production 미검증.

### 8. 다음 권장 작업

1. 최우선으로 `gas-state-change` 구조 표적 감사를 읽기 전용으로 수행.
2. 비교 대상:
   - `gas-state-change`
   - `ideal-gas-law`
   - `adiabatic-compression`
   - 같은 subject의 기체 법칙·상태변화 관련 기존 챕터
3. 각 챕터의 학습 범위와 공식 소유권 구분.
4. `gas-state-change`의 독립 유지·흡수·retire 결정안 작성.
5. 미매핑 문항 후보 재검색.
6. Owner 승인 전에는 관련 파일을 변경하지 않음.

## 20190804_001 원문 복원 게이트 완료 (2026-07-21)

이 절은 `20190804_001` 원문 복원 이후의 최신 검증 상태를 기록하며, 앞선 과거 게이트보다 현재 상태 판단에 우선한다.

### 1. 발견 경위

- 기체 상태·법칙 챕터의 읽기 전용 구조 감사 중 전체 문항 후보를 검색하다 발견했다.
- `questions.json`의 `20190804_001`에 `20190804_090`의 이황화탄소 농도 환산 문항이 잘린 형태로 복제되어 있었다.
- 의미 있는 PDF·JSON 원본 불일치로 판단하여 구조 감사를 중단했다.
- 구조 감사 중단 당시 저장소 변경은 없었다.

### 2. PDF 원문 확인

- PDF 1쪽 실제 1번: `적성요인에 있어 직업적성을 검사하는 항목이 아닌 것은?`
- 선택지:
  - ① 지능
  - ② 촉각 적응력
  - ③ 형태식별능력
  - ④ 운동속도
- 정답: ②
- 과목: 1과목 안전관리론
- 이미지·표 의존 없음.
- PDF 6쪽 실제 90번은 이황화탄소 폭발한계·농도 환산 문항이다.
- PDF 8쪽 정답표에서 1번과 90번 모두 ②로 확인했다.

### 3. 복원 내용

- 변경 파일: `src/data/questions.json`
- `20190804_001`의 `body`와 `choices`를 PDF 실제 1번으로 복원했다.
- `answer: 2`, `subject_id: 1`, ID·날짜·번호·`review`는 유지했다.
- `20190804_090`은 변경하지 않았다.
- 다른 문항·챕터·관계 변경 없음.
- `20190804_001`은 관계 0건이므로 관계 조정이 필요하지 않았다.

### 4. 복원 커밋

- `77b05da95bbfc7aa7e85a86a8dd5663dd9ba0331`
  - `data: restore 20190804 question 1 from source`

### 5. 검증 결과

- JSON parse 통과.
- 총 문제 1,680개, question ID 중복 0건.
- 과목별 문제 각 280개.
- `20190804_001`은 1개, `20190804_090`은 1개이며 90번은 무변경.
- 두 문항의 잘못된 본문·선택지 복제 상태 해소.
- 선택지 및 정답 유효성 통과.

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 251 |
| 완료 챕터 | 197 |
| 미시작 챕터 | 54 |
| 전체 기출↔챕터 관계 | 890 |
| 고유 매핑 문항 | 878 |
| 미매핑 문항 | 802 |
| 단일 매핑 문항 | 866 |
| 다중 매핑 문항 | 12 |
| 없는 question_id 참조 | 0 |
| 챕터 내부 중복 관계 | 0 |
| subject 불일치 관계 | 0 |
| 생성 페이지 | 208 |

- `git diff --check` 통과.
- 전체 Build 성공, `208 page(s) built`.
- 신규 오류·경고 없음.

### 6. 기존 Build 출력

- Pretendard resolve 경고.
- KaTeX Unicode 경고 12건.
- `public-question-filter` 로그.
- `--force` 데이터 저장소 초기화 안내.
- 이번 handover 갱신에서는 Build를 반복 실행하지 않는다. 문서 한 파일만 변경하며 복원 커밋에서 전체 Build 성공을 확인했다.

### 7. 후속 작업

1. 복원 커밋과 이 handover 커밋을 `origin/main`에 Push하여 기준선을 동기화.
2. 동기화 후 중단했던 기체 상태·법칙 구조 감사를 처음부터 반복하지 않고 이어서 재개.
3. 핵심 비교 대상:
   - `gas-state-change`
   - `ideal-gas-law`
   - `adiabatic-compression`
4. `20190804_001`은 안전관리론 문항이므로 기체 관계 후보에서 제외.
5. `20190804_090`은 기존 `concentration-conversion` 관계 유지.
6. `gas-state-change` 구조 결정은 아직 미확정.
7. Production `UNVERIFIED`.

## 기체 상태·법칙 구조 정리 및 ideal-gas-law 콘텐츠 완료 게이트 (2026-07-21)

이 절은 승인된 기체 상태·법칙 구조 정리와 `ideal-gas-law` 콘텐츠 완료 이후의 최신 상태를 기록하며, 앞선 `gas-state-change` 보류·감사 기록보다 현재 상태 판단에 우선한다.

### 1. 완료 작업

- `gas-state-change`를 `ideal-gas-law` 범위로 흡수했다.
  - 미시작·관계 0건 스텁인 `gas-state-change.md`를 삭제했다.
  - 유지 slug는 `ideal-gas-law`이며 archive·redirect를 만들지 않았다.
  - 기출↔챕터 관계의 추가·이동·삭제는 없었다.
  - 커밋: `d0c36462f3b508bb6e0af7b2e22905e8cf6c54a7` — `content: consolidate gas state law stubs`
- `ideal-gas-law`를 완료 챕터로 전환했다.
  - `PV=nRT`와 고정 몰수 일반 상태변화식 `P₁V₁/T₁=P₂V₂/T₂`를 설명했다.
  - 절대온도·절대압력, 기체상수 단위, 조건별 특수 관계, 계산 예제를 포함했다.
  - `status`는 `미시작 → 완료`로 변경했고, `questions: []`는 유지했다.
  - 직접 기출 관계가 없는 기반 개념 챕터로 제공하며, 실제 출제 이력이나 출제 빈도로 표현하지 않는다.
  - 커밋: `1b966f3753a9ff6f2ef719f9423c516fad79b2c8` — `content: add ideal gas law chapter`

### 2. 관계 0건 기반 개념 콘텐츠 정책

- 직접 연결된 기출문제가 없어도 시험 범위의 핵심 기반 개념이거나 다른 기출 연결 챕터를 이해하는 데 필요한 개념이면 완료 챕터로 제공할 수 있다.
- 관계 0건이라는 사실을 실제 출제 개념이나 출제 빈도로 바꾸어 표현하지 않는다.
- 이 정책은 관계 0건 챕터 전체의 자동 완료 승인이 아니다. 챕터별 구조·범위·학습 필요성을 별도로 판단한다.
- 현재 승인 적용 사례는 `ideal-gas-law` 하나뿐이다.

### 3. 최신 검증 수치

| 항목 | 값 |
|---|---:|
| 전체 문제 | 1,680 |
| 전체 챕터 | 250 |
| 완료 챕터 | 198 |
| 미시작 챕터 | 52 |
| 전체 기출↔챕터 관계 | 890 |
| 고유 매핑 문항 | 878 |
| 미매핑 문항 | 802 |
| 단일 매핑 문항 | 866 |
| 다중 매핑 문항 | 12 |
| 없는 question_id 참조 | 0 |
| 챕터 내부 중복 관계 | 0 |
| subject 불일치 관계 | 0 |
| 생성 페이지 | 209 |

### 4. 검증 상태

- 구조 정리와 콘텐츠 작성 모두 `git diff --check`를 통과했다.
- 최근 전체 Build가 성공했고, 핵심 출력은 `209 page(s) built`다.
- 신규 오류·경고는 없었다.
- 기존 경고만 유지한다: Pretendard 경로 resolve 경고, KaTeX Unicode 경고 12건, `public-question-filter` 로그, `--force` 캐시 초기화 안내.
- Production은 계속 `UNVERIFIED`다.

### 5. 남은 위험과 다음 작업

1. 다음 작업은 `gas-mass-volume` 구조 감사다.
   - 관계 0건이라는 이유만으로 본문을 즉시 작성하지 않는다.
   - 현재 범위, 인접 챕터와의 중복, 관련 미매핑 문항 후보를 읽기 전용으로 검토한다.
   - 감사 후 별도 Owner 승인 전까지 파일을 수정하지 않는다.
2. 별도 감사 후보 `20220305_091`, `20200822_097`, `20200822_098`의 관계는 이번 게이트에서 확정하거나 변경하지 않았다.
3. 기존의 법령·이미지·관계 구조 관련 미해결 위험과 Owner 결정 대기 항목은 이 게이트로 변경되지 않는다.

## AUDIT-UNMAPPED-001-R3-REV4-FIX 감사 게이트 종료 (2026-07-27)

이 절은 ChatGPT 최종 기술 리뷰와 Owner 승인이 완료된 `R3-REV4-FIX` 감사 결과를 기록한다. Owner 승인일은 `2026-07-27`이며, 이 절의 상태가 해당 감사 게이트에 대한 현재 판단에 우선한다.

### 1. 정책 문구 보정

- 승인 후보 revision: `R3-REV4-FIX`.
- REV4 대비 직접 정책 변경 경로는 다음 2개뿐이다.
  - `/metadata/generation_rules/new_clusters_only`
  - `/metadata/generation_rules/scenario_gate`
- `new_clusters_only`는 파일·관계·콘텐츠·매핑·공개 상태를 실제로 변경하는 실행안이 아니라 `PLANNING_ONLY` 구조 검토 투영이다.
- 전체 후보 102군집에서 effective HOLD 14군집을 제외해 88군집을 구조 검토 대상으로 투영한다.
- mandatory-PDF 검토 미완료 77군집·167문항은 구조 검토 투영에 유지되지만 실행하거나 생성할 수 없다.

### 2. 감사 불변식

| 항목 | 값 |
|---|---:|
| 문항 | 802 |
| 군집 | 286 |
| PDF 판정 MATCH | 54 |
| PDF 판정 MISMATCH | 25 |
| PDF 판정 INDETERMINATE | 1 |
| PDF 미검토 | 722 |
| effective HOLD 군집 | 153 |
| effective HOLD 문항 | 508 |

- 문항 본문·선택지·정답·군집 membership 변경은 0건이다.
- 저장소·관계·콘텐츠·매핑·공개 동작 변경은 0건이다.
- 관계·챕터 후보는 아직 구현되거나 공개 대상으로 승인되지 않았다.

### 3. 결정론성 및 증거

- A/B/최종 공식 산출물 8개의 바이트와 SHA-256 결정론성 검증을 완료했다.
- 증거 ZIP:
  - 파일명: `review-evidence.zip`
  - 크기: `40,373 bytes`
  - SHA-256: `F3EBE718D8E6D3ADC6D64AA7192CE6D93D1509C0335777FB3A1405B627C86357`
- Production은 계속 `UNVERIFIED`다.

### 4. 다음 단계

1. 다음 작업은 별도 승인된 명세로 수립한다.
2. 관계·챕터 후보를 자동으로 구현하거나 공개하지 않는다.
3. 이 문서 갱신은 감사 게이트 종료 기록만 반영하며 관계·콘텐츠·데이터 상태를 변경하지 않는다.

## Production 배포·HTTPS·챕터 가독성 게이트 완료 (2026-07-30)

이 절은 `87dacef` 배포 이후 ChatGPT 기술 검토와 Owner 승인을 거쳐 확정한 최신 production 상태다. 이 절의 검증 결과는 앞선 `Production UNVERIFIED` 기록보다 현재 상태 판단에 우선한다.

### 1. 현재 기준선

- 기준 브랜치: `main`.
- 기준 커밋:
  - `87dacef68e674c4271a82486bc62ad0f57b970b2`
  - `feat: standardize safety chapter readability`
- 갱신 직전 로컬 `HEAD`, `origin/main`, 실제 원격 `main`이 모두 `87dacef`로 일치했다.
- 갱신 직전 working tree는 clean이었다.
- GitHub Pages 배포:
  - workflow: `Deploy to GitHub Pages`
  - run: `30463789064`
  - 기준 SHA: `87dacef68e674c4271a82486bc62ad0f57b970b2`
  - 결과: `completed / success`
- 공개 주소: `https://getpasslab.co.kr/`.

### 2. HTTPS 상태

- `http://getpasslab.co.kr/` 접속은 `301 Moved Permanently`로 `https://getpasslab.co.kr/`에 전환된다.
- HTTPS 직접 응답은 `200 OK`, 인증서 검증 결과는 정상이다.
- 인증서:
  - Subject: `CN=getpasslab.co.kr`
  - Issuer: Let's Encrypt `YR1`
  - 유효기간: 2026-07-29 22:40:17 ~ 2026-10-27 22:40:16 KST
- GitHub Pages의 `Enforce HTTPS`가 활성화됐다.
- GitHub 설정 화면의 `DNS Check in Progress` 표시는 한동안 남아 있었지만, 실제 DNS·인증서·리디렉션·HTTPS 응답은 정상 동작하는 것을 확인했다.

### 3. 챕터 뱃지와 가독성 보정

#### 뱃지 체계

- 챕터 기본 유형을 `개념`·`계산`·`절차`로 통일했다.
- 법령 챕터는 기본 유형과 별도의 `법령` 뱃지로 표시한다.
- 출제 빈도는 관계 데이터에서 자동 판정한다.
  - `최빈출`: 70% 이상.
  - `빈출`: 40% 이상 70% 미만.
- 홈·과목 목록·챕터 상세가 같은 뱃지 판정 로직을 사용한다.
- production에서 동일 챕터를 교차 확인한 결과 홈·목록·상세의 `개념·법령·최빈출` 표시가 일치했다.
- 관련 커밋:
  - `f0bb7b9` — `feat: standardize chapter badges`

#### 본문 가독성

- 선행 4개 챕터의 가독성 파일럿 이후, 비법령 안전관리 개념 챕터 8개를 첫 확장 배치로 보정했다.
- 8개 챕터는 `핵심 개념 → 판별/구분/단계 기준 → 시험 포인트 → 자주 틀리는 포인트` 구조를 사용한다.
- 표의 핵심 용어를 강조하고 기존 숫자·비율·개념은 유지했다.
- `slug`, `subject_id`, `question_id`, 기출 관계 등 frontmatter는 변경하지 않았다.
- production HTML 대조 결과:
  - 대상 8개 모두 `200 OK`.
  - 필수 새 섹션 포함: 8/8.
  - 구형 섹션 잔존: 0/8.
- 관련 커밋:
  - `fdf372e` — `content: standardize chapter readability pilot`
  - `87dacef` — `feat: standardize safety chapter readability`

#### 관련 챕터 카드 폭

- 일반 본문 목록의 `max-width: 800px` 제한이 관련 챕터 목록에 적용되던 문제를 수정했다.
- `.related-list`는 본문 목록 폭 제한을 받지 않고 기출 이력 카드와 같은 콘텐츠 폭을 사용한다.
- production 데스크톱 대조:
  - 기출 이력 카드: 880px.
  - 관련 챕터 목록·카드: 880px.
- production 모바일 390×844 대조:
  - 기출 이력 카드: 342px.
  - 관련 챕터 목록·카드: 342px.

### 4. 안전난간·강도율 보정

- 안전난간 챕터의 법령 표현을 보정했다.
- production에서 다음을 확인했다.
  - `개념·법령` 뱃지.
  - 「산업안전보건기준에 관한 규칙」 제13조 표현.
  - `발끝막이판: 바닥면등으로부터 10cm 이상의 높이를 유지`.
  - 물체 낙하 위험이 없거나 망 설치 등 예방조치를 한 장소의 예외 표현.
- 관련 커밋:
  - `62fbf16` — `fix: correct safety handrail legal criteria`
- 강도율 공식의 분수 글자 크기를 확대했다.
- production에서 분수 생성, 분자·분모 렌더링, 데스크톱·모바일 가로 넘침 없음 상태를 확인했다.

### 5. 검증 결과

- 최근 전체 Build 성공:
  - `209 page(s) built`
  - `Complete!`
- `git diff --check` 통과.
- 챕터 소스 파일: 250.
- 중복 basename: 0.
- 중복 slug: 0.
- 공개 챕터: 198.
- 공개 챕터 뱃지 대조 불일치: 0.
- production 데스크톱 QA:
  - HTTPS 진입 정상.
  - 홈·목록·상세 뱃지 정상.
  - 보정 챕터 구조 8/8 정상.
  - 관련 카드 폭 정상.
  - 강도율 분수 정상.
  - 안전난간 법령 본문 정상.
  - 가로 넘침 없음.
- production 모바일 QA:
  - Chrome 개발자 도구 기기 모드 390×844, DPR 2.
  - 홈·과목 목록·대상 상세 페이지 가로 넘침 없음.
  - 화면 밖 카드 0건.
  - 관련 챕터 카드·기출 카드 폭 일치.
  - 강도율 분수 정상.
  - 안전난간 표와 `10cm 이상` 본문 정상.
- QA 범위에서 신규 production 오류는 확인되지 않았다.

### 6. 기존 경고와 남은 위험

- Build의 기존 `public-question-filter` 경고는 유지된다.
  - `review=jpg 확필`
  - 일부 blank choice
- 이미지·표 의존 문항, 미매핑 문항, 법령·표준 최신성, 기출 공개·사용 권리, 광고·분석·개인정보 관련 Owner 결정은 이번 게이트로 해결되지 않았다.
- `R3-REV4-FIX`의 관계·챕터 후보는 계속 `PLANNING_ONLY`이며 자동 구현·공개할 수 없다.
- 기존 동결 키와 기출↔챕터 관계 관리 원칙은 그대로 유지한다.

### 7. 다음 권장 작업

1. 챕터 UX 표준화 2차 배치는 인간공학 비법령 챕터를 우선 검토한다.
2. 법령 챕터는 최신 법령 원문 검증이 필요한 별도 배치로 분리한다.
3. 콘텐츠 의미·수식·숫자·부정문 변경은 위험 후보만 직접 대조한다.
4. 기존 미매핑·구조 감사 작업은 별도 승인된 명세로 재개한다.
5. 신규 slug·관계·스키마·의존성은 Owner 승인 없이 변경하지 않는다.

### 8. 이 문서 갱신

- ChatGPT 기술 검토와 Owner의 production QA 승인 후 갱신했다.
- 이번 갱신은 `AI_HANDOVER.md` 한 파일만 변경한다.
- 구현 파일·데이터·동결 키·관계·production 설정은 변경하지 않는다.
- 이 문서 변경의 Commit·Push는 별도 Owner 승인 전까지 수행하지 않는다.

## 전체 챕터 UX 표준화·수익화·분석·SEO 통합 게이트 (2026-07-30)

이 절은 Owner가 승인한 전체 챕터 UX 표준화 작업과, 별도 웹 작업으로 추가된 AdSense·검색엔진·GA4 변경을 로컬 `main`에서 비파괴 병합한 현재 상태를 기록한다. 이 절의 기준선이 앞선 8개 챕터 파일럿 및 후속 작업 안내보다 우선한다.

### 1. 전체 챕터 UX 표준화

- 파일럿 이후 남은 공개 대상 중 58개 챕터를 과목별 독립 커밋으로 보정했다.
  - 인간공학 6개
  - 안전관리 4개
  - 화학 6개
  - 건설 10개
  - 전기 19개
  - 기계 13개
- 대상 58개는 다음 4개 H2 구조로 통일했다.
  - 핵심 개념 또는 핵심 공식
  - 판별·계산·절차 등 챕터별 기준
  - 시험 포인트
  - 자주 틀리는 포인트
- `slug`, `subject_id`, `questions`, `related`와 기출↔챕터 관계는 변경하지 않았다.
- 구조 검사 결과 대상 58개 불일치 0건, 동결 필드 변경 0건, question 연결 오류 0건이다.
- 전체 빌드는 `209 page(s) built`로 성공했다.
- 데스크톱·모바일 QA에서 대상 58개 구조와 가로 넘침을 확인했고 특이사항은 없었다.
- 관련 로컬 커밋:
  - `32cda44` — `content: improve remaining ergonomics chapters`
  - `830a7b5` — `content: improve remaining safety management chapters`
  - `a0f65f7` — `content: improve remaining chemical chapters`
  - `7001ae3` — `content: improve remaining construction chapters`
  - `290d172`, `a843732` — 전기 챕터 배치
  - `a0170d4`, `cc8ebbf` — 기계 챕터 배치
  - `6be8700` — 연간율 챕터 구조 보정

### 2. 원격 수익화·분석·SEO 변경 통합

- 로컬 콘텐츠 이력과 원격 변경이 서로 분기된 상태에서 `origin/main`을 merge 방식으로 통합했다.
- 병합 충돌과 중복 변경 파일은 없었으며, 양쪽 커밋 이력을 모두 유지했다.
- 통합 커밋:
  - `760f26d83bcca174a4f436661f65be0f004f96b7`
  - 부모: `6be8700`, `f0fe807`

#### AdSense

- 공통 레이아웃에 AdSense 연결 스크립트가 추가됐다.
- 게시자 ID: `ca-pub-8799723694540263`.
- `public/ads.txt`에 승인된 판매자 레코드가 추가됐다.
- 개인정보처리방침은 광고 사용을 반영해 보정됐다.
- Owner가 AdSense 외부 계정 등록을 진행했다.
- AdSense 심사 승인 여부와 실제 광고 송출은 아직 검증하지 않았다.

#### Google Analytics 4

- 공통 레이아웃에 GA4 태그가 추가됐다.
- 측정 ID: `G-0CB3KFL9FJ`.
- 개인정보처리방침에 Google Analytics 사용을 고지했다.
- 로컬 렌더링에서 외부 스크립트와 초기화 코드 삽입을 확인했다.
- production의 실시간 이벤트 수신 여부는 Push·배포 후 별도 확인이 필요하다.

#### 검색엔진·SEO

- Owner가 Google Search Console 외부 등록을 진행했다고 전달했다.
- 저장소에는 custom domain 기준 canonical, sitemap, robots, Open Graph, Twitter Card, WebSite·Article·Breadcrumb 구조화 데이터가 반영됐다.
- 네이버 검색 노출을 위한 사이트 소유 확인 메타 태그가 추가됐다.
- 빌드 결과물을 검사하는 `check:seo` 명령과 PR용 SEO 검사 workflow가 추가됐다.
- 최근 SEO 검사 결과:
  - HTML 209개
  - sitemap URL 210개
  - 오류 0개
  - 경고 196개
- 경고 196개는 짧은 meta description 개선 권고이며 현재 배포 차단 오류는 아니다.
- Search Console 내부의 소유권 상태·색인 상태·sitemap 처리 결과는 저장소만으로 확인할 수 없으므로 외부 계정 또는 production에서 별도 확인해야 한다.

### 3. 통합 검증

- 전체 빌드: 성공, `209 page(s) built`.
- `git diff --check`: 통과.
- 로컬 브라우저 QA:
  - 홈 데스크톱 렌더링 정상.
  - 대표 챕터 모바일 390px 렌더링 정상.
  - 관련 챕터 카드 폭 정상.
  - 개인정보처리방침 모바일 렌더링 정상.
  - 가로 넘침 없음.
  - 브라우저 오류 로그 없음.
  - AdSense·GA4·canonical·네이버 인증·JSON-LD 삽입 확인.
- 전체 페이지 모바일 캡처에서 일시적인 stitching 표시 이상이 있었으나, 일반 viewport 캡처와 실제 요소 치수 대조에서는 레이아웃 문제가 재현되지 않았다.

### 4. Push·production 검증과 남은 확인

- Owner가 이 문서 갱신과 `main` Push를 명시 승인했다.
- 첫 문서 갱신 커밋:
  - `3fefedc514626da47326e4a33761d6f4b3b11a09`
  - `docs: update handover after service integration`
- `origin/main` Push 성공 후 로컬 `main`, `origin/main`, 실제 원격 `main`이 `3fefedc`로 일치하는 것을 확인했다.
- GitHub Pages 자동 배포:
  - workflow: `Deploy to GitHub Pages`
  - run: `30549030290`
  - 기준 SHA: `3fefedc514626da47326e4a33761d6f4b3b11a09`
  - 결과: `completed / success`
- production 확인:
  - `https://getpasslab.co.kr/`: `200 OK`.
  - 대표 챕터의 새 4개 섹션과 모바일 레이아웃 정상.
  - 모바일 390px 기준 관련 챕터 카드 폭 일치, 가로 넘침 없음.
  - AdSense·GA4·canonical·네이버 인증·JSON-LD 태그 삽입 확인.
  - `https://getpasslab.co.kr/ads.txt`: `200 OK`, 게시자 레코드 일치.
  - `https://getpasslab.co.kr/sitemap-index.xml`: `200 OK`, custom domain URL 포함.
  - 브라우저 오류·경고 로그 없음.
- AdSense 승인·실제 광고 게재, Search Console 색인·sitemap 처리, GA4 실시간 이벤트 수신은 각각의 외부 서비스 증거가 확인되기 전까지 완료로 확정하지 않는다.
- 기존 동결 키·관계 데이터와 `R3-REV4-FIX`의 `PLANNING_ONLY` 상태는 변경하지 않는다.

## 공개 챕터 UX 전수 정리·production 배포 게이트 완료 (2026-07-30)

이 절은 전체 챕터 UX 적용 범위와 production 상태에 관해 위의 이전 기록보다 최신이다. ChatGPT 기술 검토와 Owner의 다음 단계 진행 승인을 받은 검증 사실만 기록한다.

### 1. 배포 기준

- 브랜치: `main`.
- production 기준 커밋:
  - `a4cce168a7a37d528b41f104047adf52a01cdc1a`
  - `fix: prevent severity rate fraction overlap`
- GitHub Pages:
  - workflow: `Deploy to GitHub Pages`
  - run: `30553447087`
  - 결과: `completed / success`
- production URL: `https://getpasslab.co.kr/`.
- 배포 확인 시점에는 로컬 `main`, `origin/main`, 원격 `main`이 위 커밋으로 일치했고 working tree가 깨끗했다.

### 2. 전체 챕터 UX 적용 범위

- 챕터 소스 파일: 250개.
- 공개 완료 챕터: 198개.
- 공개 챕터 198개 모두 다음 네 역할의 본문 구조를 갖는다.
  - 핵심 개념 또는 핵심 공식
  - 판별·계산·절차 기준
  - 시험 포인트
  - 자주 틀리는 포인트
- 제목 적용 방식:
  - 공통 제목 세트를 사용하는 챕터: 133개.
  - 앞선 검토에서 승인한 역할별 제목을 유지하는 챕터: 65개.
- `48069e0` 이후 추가 정리 범위:
  - 챕터 125개와 자동화 도구 1개.
  - 화학설비 24개, 건설안전 13개, 전기안전 22개, 인간공학 28개, 기계안전 17개, 안전관리 21개.
  - 도구: `scripts/standardize-chapter-content.mjs`.
- 동결된 `slug`, `subject_id`, 기출 관계와 frontmatter는 변경하지 않았다.
- 검증 결과:
  - frontmatter 불일치 0건.
  - 숫자 토큰 불일치 0건.
  - 네 역할 구조 불일치 0건.
- 강도율 공식은 모바일 분수 겹침을 해소하기 위해 표시 문법만 `\frac{\small ...}`에서 `\dfrac{\text{...}}` 형태로 조정했다. 공식의 의미와 수치는 변경하지 않았다.

### 3. 빌드·데이터·SEO 검증

- 전체 빌드: 성공, `209 page(s) built`.
- SEO 검사:
  - HTML 209개.
  - sitemap URL 210개.
  - 오류 0개.
  - 경고 196개.
- 소스 검사:
  - 중복 slug 0건.
  - 중복 basename 0건.
  - NUL 문자 0건.
- Astro 증분 콘텐츠 동기화 과정에서 duplicate-id 경고가 출력됐지만 소스 slug와 basename 중복은 재현되지 않았다. 원인은 확정하지 않았으며 별도 기술 부채로 남긴다.

### 4. production 화면 QA

- 네트워크:
  - HTTP 접속은 HTTPS로 `301` 전환.
  - HTTPS 대표 페이지는 `200 OK`.
- 확인 viewport:
  - 데스크톱 `1280×720`.
  - 모바일 `390×844`.
- 대표 확인 챕터:
  - 강도율
  - 방폭 전기기기 피팅
  - 안전보건표지
  - 이상기체 상태방정식
  - 안전난간 구조
- 확인 결과:
  - 가로 넘침 없음.
  - 표의 모바일 반응형 표시 정상.
  - 모바일에서 본문·기출 이력·관련 챕터·카드 폭이 모두 327px로 일치.
  - 강도율 분수의 분자·분모·분수선 겹침 없음.
  - 브라우저 콘솔 오류 0건.
- production 캡처 저장은 브라우저 도구의 시간 초과와 탭 종료로 완료하지 못했다. 다만 같은 세션의 실제 DOM·레이아웃 치수와 화면 상태 대조는 완료했다.

### 5. 변경하지 않은 기존 관계 불일치

다음 파일은 폴더 분류와 `subject_id`가 서로 다르지만 기존 동결 관계이므로 이번 작업에서 수정하지 않았다.

- `construction/vibration-diagnosis.md` → `subject_id: 3`
- `mechanical/cavitation.md` → `subject_id: 5`
- `mechanical/surging-phenomenon.md` → `subject_id: 5`
- `safety-management/risk-assessment-procedure.md` → `subject_id: 2`

변경하려면 Owner 판단과 동결 키·관계 변경 절차가 필요하다.

### 6. 미확인 상태와 다음 작업

- 저장소와 production 화면만으로 다음 외부 상태는 확정하지 않는다.
  - AdSense 심사 승인과 실제 광고 송출.
  - Google Search Console 색인과 sitemap 처리.
  - GA4 실시간 이벤트 수신.
- 법령 문구의 최신성 전체 대조는 이번 UX 구조 작업 범위가 아니므로 별도 검증이 필요하다.
- 다음 권장 작업:
  1. SEO description 경고 196건 개선은 다음 최신 게이트에서 완료됐다.
  2. AdSense·Search Console·GA4 외부 상태를 각 서비스 화면에서 확인한다.
  3. 기존 폴더·과목 관계 불일치는 Owner가 변경 필요성을 결정한다.
- 완료된 전체 챕터 UX 배치를 다시 수행하지 않는다.

## SEO description 전수 개선·production 배포 게이트 완료 (2026-07-31)

이 절은 SEO description 경고와 현재 production 기준에 관해 위의 이전 기록보다 최신이다. ChatGPT 기술 검토와 Owner의 다음 단계 진행 승인을 받은 검증 사실만 기록한다.

### 1. 구현 기준

- production 기준 커밋:
  - `5ea53cb0c0e448f56c81be3d1ae52a406c66ecf2`
  - `feat: improve SEO meta descriptions`
- 챕터 화면에 표시되는 기존 `summary`는 변경하지 않았다.
- 챕터 meta description은 다음 기존 데이터에서 자동 파생한다.
  - 챕터명
  - `summary`
  - 과목명
  - 개념·계산·절차·법령 유형
- 챕터별 SEO 문구를 별도 필드로 저장하지 않아 이중 원본을 만들지 않는다.
- 개념·계산·절차·법령 유형별로 서로 다른 학습 범위 문장을 사용한다.
- 산업안전기사·필기·과목 목록·개인정보처리방침·이용약관의 짧은 description도 각 페이지 목적에 맞게 보정했다.
- `ARCHITECTURE.md`, `CODING_RULES.md`, `src/content.config.ts`의 설명을 실제 파생 방식과 일치시켰다.

### 2. 로컬 검증

- 전체 빌드: 성공, `209 page(s) built`.
- SEO 검사:
  - HTML 209개.
  - sitemap URL 210개.
  - 경고 196개 → 0개.
  - 오류 0개.
- 공개 챕터 198개 description:
  - 최소 86자.
  - 최대 155자.
  - 50자 미만 0건.
  - 160자 초과 0건.
  - 중복 0건.
- 챕터 본문과 frontmatter, `slug`, `subject_id`, 기출 관계 변경 0건.
- `git diff --check` 통과.
- 기존 `public-question-filter`의 `review=jpg 확필`·blank choice 제외 경고는 유지되며 이번 SEO 작업과 무관하다.

### 3. Push·GitHub Pages 배포

- `origin/main` Push 성공.
- GitHub Pages:
  - workflow: `Deploy to GitHub Pages`
  - run: `30555901971`
  - 기준 SHA: `5ea53cb0c0e448f56c81be3d1ae52a406c66ecf2`
  - 결과: `completed / success`
- 배포 검증 후 로컬 `main`, `origin/main`, 원격 `main`이 기준 커밋으로 일치했고 working tree가 깨끗했다.

### 4. production 메타데이터 검증

- 대표 확인 페이지 6개:
  - 계산 챕터: 이상기체 법칙.
  - 법령 챕터: 안전난간 구조 및 설치요건.
  - 개념 챕터: THERP·휴먼에러 정량화.
  - 화학설비 안전관리 과목 목록.
  - 개인정보처리방침.
  - 이용약관.
- 확인 결과:
  - 6개 페이지 모두 `200 OK`.
  - description 길이 68~155자.
  - 과목·유형별 문구 정상 반영.
  - meta description, OG description, Twitter description, `LearningResource` 구조화 데이터 description 일치.
  - HTTP 접속은 HTTPS로 `301` 전환.
- 사용자에게 보이는 챕터 요약과 본문은 변경되지 않았으므로 별도 화면 레이아웃 QA는 수행하지 않았다.

### 5. 남은 외부 확인과 다음 작업

- 다음 외부 상태는 저장소와 production HTML만으로 확정하지 않는다.
  - Google Search Console sitemap 처리와 색인 상태.
  - GA4 실시간 이벤트 수신.
  - AdSense 심사 승인과 실제 광고 송출.
- 다음 권장 순서:
  1. Search Console에서 sitemap 처리·색인 상태를 확인하고 중요 URL 재크롤링 필요성을 판단한다.
  2. GA4 실시간 보고서에서 production 이벤트 수신을 확인한다.
  3. AdSense 심사·광고 송출 상태를 확인한다.
  4. 기존 폴더·과목 관계 불일치는 Owner가 변경 필요성을 결정한다.
- 완료된 전체 챕터 UX 및 SEO description 배치를 다시 수행하지 않는다.

## 공개 챕터 내부 식별자·운영 문구 정리·production 검증 게이트 완료 (2026-08-01)

이 절은 공개 챕터의 내부 식별자·제작 문구 노출과 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소, CI, GitHub Pages 배포, runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #6 `content: clean public exam notes and block internal IDs` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `ac2a610d68958c7a3193c8fbf75334c310aedf87`.
- 공개 챕터: 198개.
- 생성 페이지: 209개.
- PR #6 범위의 GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 이번 범위의 Production 상태: **VERIFIED**.
- 완료된 내부 식별자·운영 문구 정리 배치를 다시 수행하지 않는다.

### 2. 구현 범위

- 전체 변경 파일: 132개.
  - 공개 챕터: 129개.
  - 영구 검증 workflow: 1개.
  - `package.json`: 1개.
  - 공개 콘텐츠 검사 스크립트: 1개.
- 제거·교정한 사용자 노출 요소:
  - `YYYYMMDD_NNN`, `qYYYYMMDD` 형태의 내부 문항 식별자.
  - PDF·JSON·DB·검수·매핑·렌더링 관련 내부 운영 문구.
  - 선택지 전체를 반복하는 제작 관점 문장.
  - 렌더링되지 않은 Markdown 강조 표기.
  - 내부 chapter slug의 코드 표기.
  - 손상된 LaTeX `\rho` 표기.
- 시험 포인트는 출제 유형·정답 판단 조건·함정 중심의 사용자용 문장으로 교정했다.

### 3. 데이터 무결성과 CI 가드

변경하지 않은 항목:

- `slug`.
- `subject_id`.
- chapter `questions` 관계.
- 기출 DB의 `question_id`.
- 기출 문제 본문·선택지·정답.
- URL 구조와 데이터 스키마.
- 신규 의존성, 광고·결제·production 설정.

영구 CI 차단 기준:

- 사용자 노출 텍스트의 내부 문항 ID 및 별칭.
- 렌더링되지 않은 Markdown 강조 표기.
- PDF·JSON·DB·검수·매핑·공개 렌더링 등 내부 제작 문구.
- 내부 chapter slug의 코드 표기.
- 챕터 원문의 비정상 제어문자.
- `\rho`가 손상되어 `ho=`로 남은 흔적.

### 4. 병합 전 검증

- PR 최종 HEAD: `09a81b4eaedc7f4768cba5910a450bdab500c606`.
- GitHub Actions `SEO validation` run #68: 성공.
- `npm ci`: 성공.
- Astro build: 성공, `209 page(s) built`.
- SEO 검사:
  - HTML 209개.
  - sitemap URL 210개.
  - 경고 0개.
  - 오류 0개.
- 공개 콘텐츠·원문 무결성 검사: 오류 0개.

### 5. production 배포·runtime 검증

- GitHub Pages workflow: `Deploy to GitHub Pages`.
- run: `30697893844`.
- 기준 SHA: `ac2a610d68958c7a3193c8fbf75334c310aedf87`.
- 결과: `completed / success`.
- 실행 시간: `2026-08-01T11:32:38Z → 2026-08-01T11:33:28Z`.
- runtime smoke test:
  - 홈: HTTP 200, 사이트 제목 정상.
  - 위험물 반응 가스 발생: HTTP 200, 사용자 노출 텍스트에서 내부 ID·PDF·JSON 문구 미노출.
  - VDT 화면 대비: HTTP 200, strong 렌더링과 `\rho=0.85` 수식 정상, 사용자 노출 내부 ID 미노출.
  - 재해 원인 분류: HTTP 200, strong 렌더링 정상, Markdown 기호 미노출.
- 사용자 노출 검사는 영구 CI와 동일하게 `script`, `style`, `noscript`, `template` 요소를 제외한 visible text 기준으로 수행했다.
- 상세 검증 문서: `docs/audits/2026-08-01-pr6-production-verification.md`.

### 6. 남은 위험과 범위 밖 항목

- npm 취약점 5건: 낮음 1건, 높음 4건.
- `esbuild`, `sharp` install script 승인 경고.
- GitHub Actions 내부 Node 20 deprecation 경고.
- 법령 의존 문구의 현행 기준 전체 대조.
- AdSense 승인과 실제 광고 송출 상태.
- Search Console 색인 상태.
- 공개 챕터 전체의 `시험 포인트`·`출제 경향` 의미 품질 전수 감사는 이번 패턴 정리 범위만으로 완료로 확정하지 않는다.

### 7. 다음 권장 작업

1. 공개 챕터 198개의 `시험 포인트`·`출제 경향` 의미 품질을 위험 기반으로 진단한다.
2. Search Console 노출 데이터가 확보된 페이지를 우선 배치로 선정한다.
3. 숫자·수식·부정문·법령·조건·예외가 포함된 후보를 고강도로 검토한다.
4. AdSense 승인·실제 광고 송출과 Search Console 색인 상태는 각 외부 서비스 증거로 별도 확정한다.
5. npm 취약점과 Actions 경고는 콘텐츠 작업과 분리된 의존성·CI 감사에서 처리한다.

위 순서는 추천안이며, 다음 구현 범위는 Owner 승인 후 확정한다.

## 시험 포인트 첫 개선 배치·production 검증 게이트 완료 (2026-08-02)

이 절은 공개 챕터의 첫 시험 인사이트 개선 배치와 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소·CI·GitHub Pages·runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #8 `content: improve first exam-insight batch` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `7898e84ed78d318fec1886daaad00bb0ef67815f`.
- GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 이번 배치의 Production 상태: **VERIFIED**.
- 완료된 첫 개선 배치를 다시 수행하지 않는다.

### 2. 완료 범위

- 확정 관계 불일치 8건 제거.
- 명확한 기존 완료 챕터 5곳으로 관계 이동.
- 대상이 불명확한 3문항은 임의 관계 없이 미매핑 유지.
- 5개 챕터의 연결 문항 수·고유 시행 회차 재집계 및 근사·과장 표현 제거.
- 법령·고시 의존 4개 챕터의 출제 경향과 기준일 주의 보정.
- `spontaneous-combustion` 회차별 정답 나열을 3개 판단 포인트로 압축.
- 변경 파일: 챕터 21개, 감사 문서 4개.

### 3. 데이터 무결성·빌드 검증

- 전체 챕터: 250개.
- 전체 관계: 887건.
- 존재하지 않는 문항 참조: 0건.
- 챕터 내부 중복 관계: 0건.
- `subject_id` 불일치: 0건.
- `slug`, `subject_id`, `question_id` 무변경.
- `questions.json` 본문·선택지·정답 무변경.
- 최종 PR CI:
  - Astro build 성공, 209페이지.
  - SEO 검사 경고 0개·오류 0개.
  - 공개 콘텐츠·원문 무결성 검사 오류 0개.

### 4. production 배포·runtime 검증

- GitHub Pages workflow run: `30706599852`.
- 기준 SHA: `7898e84ed78d318fec1886daaad00bb0ef67815f`.
- 결과: `completed / success`.
- 대표 URL 6개 모두 HTTP 200.
- 빈도 문구, 법령 기준일 주의, 자연발화 시험 포인트, 대표 관계 이동을 production에서 확인.
- 상세 검증 문서: `docs/audits/2026-08-02-exam-content-batch1-production-verification.md`.

### 5. 남은 위험과 다음 작업

- 법령 조문·별표 수치 전 항목의 의미 대조는 `LEGAL_SOURCE_RECHECK_REQUIRED`로 유지.
- `examComment` 미작성 공개 챕터 전체 보강은 후속 배치로 유지.
- Search Console 노출 데이터가 확보된 페이지를 다음 콘텐츠 개선 우선순위에 반영.
- npm 취약점과 Actions deprecation 경고는 콘텐츠 작업과 분리된 감사에서 처리.

다음 권장 작업은 남은 `examComment` 미작성 챕터를 빈도·검색 가치·정확성 위험으로 분류하고, 두 번째 개선 배치를 선정하는 것이다.

## 시험 포인트 두 번째 개선 배치·production 검증 게이트 완료 (2026-08-02)

이 절은 두 번째 `examComment` 개선 배치와 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소·CI·GitHub Pages·runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #10 `content: add second exam trend batch` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `e10d7c59f90084bf63c1f6b9a385cc957a2e9cfd`.
- GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 두 번째 개선 배치의 Production 상태: **VERIFIED**.
- 완료된 두 번째 배치를 다시 수행하지 않는다.

### 2. 완료 범위

- 공개 챕터 12개의 `examComment`를 보강.
- 전체 14개 시행 회차 대비 실제 문항 수·고유 회차 수 사용.
- 출제 유형·계산 흐름·부정형 함정을 학습자용 한 문장으로 요약.
- 변경 파일 12개, 12줄 추가, 삭제 0줄.
- `severity-rate`는 이미지 검수 미완료 문항을 제외한 공개 기준 6문항·6회차로 기록.

대상 챕터:

- 화학: `dust-explosion-factors`, `acetylene-properties`
- 전기: `shock-prevention`, `vf-danger-energy`
- 기계: `safety-factor`, `press-safety-distance`
- 안전관리: `accident-prevention-principles`, `severity-rate`, `hazard-prediction-training`, `safety-inspection-types`
- 인간공학: `anthropometry-design`, `information-entropy`

### 3. 데이터 무결성·빌드 검증

- PR 최종 HEAD: `973bc20020846515b461082e35588df454b0bb62`.
- GitHub Actions `SEO validation` run #101: 성공.
- Astro build 성공, 209페이지.
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개.
- 공개 콘텐츠·원문 무결성 검사: HTML 209개, 오류 0개.
- `slug`, `subject_id`, `question_id`, 챕터 `questions` 관계 무변경.
- `questions.json` 본문·선택지·정답 무변경.
- 스키마·의존성·URL·production 설정 무변경.

### 4. production 배포·runtime 검증

- GitHub Pages workflow run: `30747175723`.
- 기준 SHA: `e10d7c59f90084bf63c1f6b9a385cc957a2e9cfd`.
- 결과: `completed / success`.
- 실행 시간: `2026-08-02T12:07:47Z → 2026-08-02T12:08:38Z`.
- production 검증 workflow run: `30748804989`.
- 홈과 대표 4개 챕터 모두 HTTP 200.
- 분진폭발 `13문항 / 11회차`, 심실세동 에너지 `8문항 / 8회차`, 강도율 공개 기준 `6문항 / 6회차`, 정보량 `3문항 / 3회차` 문구 반영 확인.
- 상세 검증 문서: `docs/audits/2026-08-02-exam-content-batch2-production-verification.md`.

### 5. 남은 위험과 다음 작업

- T0 감사 기준 미작성 공개 챕터 121개 중 12개를 보강했으며 잔여 109개는 후속 배치로 유지.
- 관계 불일치 의심 항목과 챕터 범위 구조 후보는 `examComment` 작성과 분리해 검토.
- 법령·고시 의존 챕터는 현행 공식 원문 대조 후 작성.
- Search Console 노출 데이터가 확보되면 다음 배치 우선순위에 반영.
- npm 취약점 5건과 Actions deprecation 경고는 별도 의존성·CI 감사에서 처리.

다음 권장 작업은 관계 불일치·구조 후보를 먼저 정리한 뒤, 법령 비의존 고빈도 미작성 챕터의 세 번째 `examComment` 배치를 선정하는 것이다.

## 관계·구조 정리 Gate A·production 검증 게이트 완료 (2026-08-02)

이 절은 관계·구조 T0 감사에서 신규 공개 식별자나 법령 원문 확인 없이 확정할 수 있었던 Gate A 구현과 production 상태에 관해 위의 이전 기록보다 최신이다. 실제 저장소·CI·GitHub Pages·runtime 증거로 검증된 사실만 기록한다.

### 1. 현재 단계

- PR #13 `fix: reconcile relation structure gate A` 완료.
- Owner 승인 후 Squash and merge로 `main` 반영 완료.
- `main` 병합 커밋: `571a4aec906a4127e99f474b3a0e57d8c239598b`.
- GitHub Pages 배포와 대표 runtime 검증: **PASS**.
- 관계·구조 정리 Gate A의 Production 상태: **VERIFIED**.
- 완료된 Gate A 범위를 다시 수행하지 않는다.

### 2. 완료 범위

- 관계 제거 8건, 관계 추가 7건을 반영해 전체 관계를 887건에서 886건으로 정리.
- Swain 챕터에서 Reason 계열 2문항 분리.
- 심실세동 전류에서 위험한계 에너지 계산 1문항 제거.
- 심실세동 에너지에 원문 복원 대기 중인 정확한 내부 관계 3건 추가.
- 연삭숫돌 회전속도를 계산형 3문항으로 정리.
- 평형플랜지·연삭기 노출각도·기계의 5대 위험점 관계 보완.
- 누전차단기 설치 예외에서 설치 전압 기준 문항 1건 제거.
- 원문 누락·OCR 훼손 문항 3건을 `jpg 확필`로 전환해 복원 전 공개 차단.
- `연삭숙돌`, `숙돌` 사용자 노출 오타 교정.

변경 파일은 챕터 8개와 `questions.json` 1개이며, `questions.json`은 손상 문항 3건의 `review` 필드만 변경했다.

### 3. 데이터 무결성·빌드 검증

- PR 최종 HEAD: `e488fbcbf2aa8ca176f63d4e433f80432b5e5955`.
- GitHub Actions `SEO validation` run #113: 성공.
- Astro build 성공, 209페이지.
- SEO 검사: HTML 209개, sitemap URL 210개, 경고 0개, 오류 0개.
- 공개 콘텐츠·원문 무결성 검사: HTML 209개, 오류 0개.
- 전체 관계: 886건.
- 존재하지 않는 문항 참조: 0건.
- 챕터 내부 중복 관계: 0건.
- `subject_id` 불일치: 0건.
- 기존 `slug`, `subject_id`, `question_id` 무변경.
- 문제 본문·선택지·정답 무변경.
- 신규 공개 `slug`, 의존성, 스키마, URL 규칙, production 설정 무변경.

### 4. production 배포·runtime 검증

- GitHub Pages workflow run: `30752925033`.
- 기준 SHA: `571a4aec906a4127e99f474b3a0e57d8c239598b`.
- 결과: `completed / success`.
- 실행 시간: `2026-08-02T14:48:31Z → 2026-08-02T14:49:11Z`.
- production 검증 workflow run: `30752971120`.
- Swain, 심실세동 전류, 심실세동 에너지, 연삭숫돌 회전속도, 기계의 5대 위험점, 누전차단기 설치 예외 페이지 모두 HTTP 200.
- 관계 제거·추가, 손상 문항 비노출, 공개 문항 수 유지, 제목·설명 보정을 production에서 확인.
- 상세 검증 문서: `docs/audits/2026-08-02-relation-structure-gate-a-production-verification.md`.

### 5. 남은 위험과 다음 작업

- Reason 인간오류 분류와 일반 연삭기 안전 신규 챕터는 신규 공개 식별자 Owner 승인 필요.
- 심실세동 전류의 전격사 위험 범위 확대는 기존 챕터 보정 작업으로 유지.
- 건설공사 유해·위험방지계획서와 누전차단기 구조·정격·시설기준은 법령·고시 공식 원문 대조 후 보정.
- 원문 누락·OCR·이미지 의존 문항은 원본 복원 전 비공개 유지.
- `examComment` 미작성 공개 챕터 후속 배치는 관계·구조 정리와 분리해 진행.
- npm 취약점 5건과 Actions deprecation 경고는 별도 의존성·CI 감사에서 처리.

다음 권장 작업은 신규 공개 식별자 없이 가능한 기존 챕터 범위 보정을 먼저 진행하고, 신규 `slug` 2개는 Owner 명명·생성 결정을 별도 게이트로 처리하는 것이다.

