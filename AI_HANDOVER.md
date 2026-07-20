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
> **작성 기준일**: 2026-07-14 / **작성자**: Claude / **버전**: v1.0

---

## ⚡ 30초 요약 (먼저 이것만)

**GetPassLab** = 산업안전기사 수험생용 **기출 역설계 기반 핵심 요약 정적 웹사이트**.

- **스택**: Astro 5 + Markdown + GitHub Pages. **서버 없음, DB 없음, API 없음.** 모든 게 빌드 타임에 끝난다.
- **목적**: 1순위 = **이직 포트폴리오**, 2순위 = AdSense 수익.
- **현재**: 출시 콘텐츠(챕터 82개) 완성. **출시 절차(정책 페이지·SEO·도메인·AdSense)가 남았다.**

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
