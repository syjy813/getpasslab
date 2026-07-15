# CODING_RULES.md — GetPassLab 개발 규칙

> **선행 문서**: `ARCHITECTURE.md` (구조) / `UI_UX_GUIDE.md` (디자인 토큰)
> **작성 기준일**: 2026-07-14 / **버전**: v1.0
> **근거**: 실제 저장소 코드 원문 + 대화 기록
>
> **이 문서의 성격**: "권장"이 아니라 **규칙**이다. 위반하면 빌드가 깨지거나(동결 키·스키마), 254개 파일에 부채가 복제된다(네이밍·컴포넌트). AI·Cowork·마일로 전부 이 문서를 따른다.

---

## 0. 최우선 3원칙 — 나머지는 전부 여기서 파생된다

| # | 원칙 | 위반 시 |
|---|------|---------|
| **1** | **동결 키(`slug`/`subject_id`/`question_id`)는 절대 바꾸지 않는다** | URL·SEO·조인·(Phase 2)유저 데이터 동시 붕괴 |
| **2** | **프레임워크를 먼저 꺼내지 않는다.** 네이티브 HTML → CSS → 최소 JS 순으로 시도한다 | JS 번들 0이라는 최대 자산 상실 |
| **3** | **한 곳에만 쓴다.** 같은 정보를 두 곳에 두지 않는다 | 이중 원본 → 불일치 → 이 프로젝트가 가장 크게 데인 문제 |

---

## 1. 네이밍 규칙

### 1.1 파일·디렉토리

| 대상 | 규칙 | 실제 예시 |
|------|------|-----------|
| **컴포넌트** | `PascalCase.astro` | `GNB.astro`, `Footer.astro`, `QuestionHistory.astro`, `RelatedChapters.astro` |
| **레이아웃** | `PascalCase.astro` | `BaseLayout.astro`, `ChapterLayout.astro` |
| **설정·유틸 (TS)** | `camelCase.ts` | `subjects.ts`, `url.ts`, `content.config.ts` |
| **페이지** | Astro 라우팅 규약 (소문자) | `index.astro`, `[subject]/index.astro`, `[slug].astro` |
| **콘텐츠 (md)** | **`kebab-case.md` = 슬러그와 동일** | `ohm-law.md`, `frequency-rate.md` |
| **디렉토리** | `kebab-case` | `industrial-safety/`, `safety-management/` |
| **데이터** | `camelCase.json` 또는 소문자 | `questions.json` |

> **md 파일명 = `slug` 값이다.** 파일명과 frontmatter의 `slug`가 어긋나면 안 된다. **파일명을 바꾸는 것은 동결 키를 바꾸는 것과 같다.**

### 1.2 슬러그 (동결 키)

| 규칙 | 값 |
|------|-----|
| 형식 | **영문 소문자 케밥케이스** |
| 예시 | `ohm-law`, `frequency-rate`, `safety-management` |
| 한글 | **금지** (URL 인코딩 깨짐, SEO 불리) |
| 숫자 접두 | **금지** — `01-ohm-law` ❌. **`order` 필드가 순서를 담당한다.** 슬러그에 번호가 들어가면 재정렬 시 URL이 깨진다 |
| **생성 주체** | **CSV/기존 값 그대로.** AI·Cowork는 **절대 생성하지 않는다** |
| 공란 처리 | **만들지 말고 보고한다** |

### 1.3 문제 ID (동결 키)

```
{YYYYMMDD}_{NNN}
20220424_061     ← 2022년 4월 24일 시행, 61번
20200926_073
```

| 규칙 | 값 |
|------|-----|
| 문제 번호 | **3자리 zero-padding** (`061`, 아니고 `61` ❌) |
| **부수 효과** | 문자열 정렬 = 날짜순 정렬. 실제 코드가 이를 이용한다:<br>`sort((a,b) => b.id.localeCompare(a.id))` → 최신 회차 먼저 |

### 1.4 CSS 클래스 (실제 코드 기준)

**컨벤션: 단순화된 BEM — 하이픈 1단계.** `__`·`--` 미사용.

```css
/* ✅ 실제 코드에서 관찰된 패턴 */
.gnb              /* 블록 */
.gnb-inner        /* 블록-요소 */
.gnb-logo
.gnb-dropdown

.card             /* 블록 */
.card-label       /* 블록-요소 */
.card-title
.card-meta

.exam-history
.freq-label
.round-badges
.round-badge

.q-layer          /* question layer */
.q-inner
.q-meta
.q-body
.q-choices
```

**타이포그래피 유틸리티는 `gpl-` 접두사**

```html
<h1 class="gpl-display">산업안전기사</h1>
<h1 class="gpl-h1">필기 6과목</h1>
<p class="gpl-body-lg">…</p>
<p class="gpl-body">…</p>
```
> `gpl-` = **G**et**P**ass**L**ab. 전역 유틸리티임을 표시해 컴포넌트 스코프 클래스와 구분한다.

**레이아웃 유틸리티는 무접두**

```html
<section class="section container">
  <div class="grid grid-3">…</div>
</section>
```

**상태 클래스는 형용사 단독**

```html
<span class={`tag ${isHot ? 'hot' : ''}`}>#빈출</span>
```

| 규칙 | 근거 |
|------|------|
| **kebab-case만** | `.cardTitle` ❌, `.card_title` ❌ |
| **하이픈 1단계까지** | `.gnb-dropdown-item-link` ❌ → 너무 깊다. 중첩 셀렉터로 |
| **Tailwind 유틸리티 클래스 금지** | `bg-blue-600` ❌ — **Tailwind가 설치되어 있지 않다** (§7) |

### 1.5 JS 훅은 클래스가 아니라 `data-*`

```html
<!-- ✅ 실제 코드 -->
<button class="round-badge" data-open={q.id}>2022년 4월 시행 61번</button>
<dialog class="q-layer" id={`q-${q.id}`} data-revealed="false">
```

| 규칙 | 근거 |
|------|------|
| **JS가 잡는 것은 `data-*`** | 클래스는 스타일 전용. 디자이너가 클래스를 바꿔도 JS가 안 깨진다 |
| **상태도 `data-*`** | `data-revealed="false"` → CSS에서 `[data-revealed="true"]`로 스타일링 가능 |
| **ID는 동적 생성 시 템플릿 리터럴** | `id={`q-${q.id}`}` |

### 1.6 변수·함수 (TypeScript)

| 대상 | 규칙 | 예시 |
|------|------|------|
| 상수 (동결 맵) | `SCREAMING_SNAKE` 또는 `PascalCase` 객체 | `SUBJECTS` |
| 타입 | `PascalCase` | `SubjectId`, `Props`, `Q` |
| 변수 | `camelCase` | `allQuestions`, `sideChapters`, `sameGroup` |
| 함수 | `camelCase`, 동사로 시작 | `withBase()`, `countBy()`, `parseAns()` |
| 불리언 | `is`/`has`/`should` 접두 | `isHot`, `hasQuestions` |

**의미 있는 이름을 쓴다** — 실제 코드의 좋은 예:
```ts
const linked   = …   // 이 챕터에 연결된 기출문제
const manual   = …   // 수동 지정 관련 챕터
const sameGroup = …  // 동일 그룹 자동 관련 챕터
const sideChapters = … // 사이드바용 같은 과목 챕터
```

---

## 2. 컴포넌트 작성 규칙

### 2.1 절대 규칙: **컴포넌트는 데이터를 조회하지 않는다**

```astro
<!-- ❌ 금지 -->
---
// QuestionHistory.astro
import { getCollection } from 'astro:content';
const questions = await getCollection('questions');  // 컴포넌트가 직접 조회
---

<!-- ✅ 실제 방식 -->
---
// QuestionHistory.astro
interface Q { id: string; label: string; number: number; body: string; choices: string[]; answer: number; }
interface Props { questions: Q[]; examComment?: string; }
const { questions, examComment } = Astro.props;
---
```

**페이지가 조회하고 조인해서 props로 내려준다.**

| 이유 | 설명 |
|------|------|
| 데이터 흐름이 한 방향 | 페이지 → 컴포넌트. 역류 없음 |
| 빌드 성능 | 동일 컬렉션을 N번 읽지 않는다 |
| 테스트·재사용 | 컴포넌트가 데이터 소스에 결합되지 않는다 |

### 2.2 Props는 반드시 `interface Props`로 선언

```astro
---
interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
---
```

| 규칙 | 근거 |
|------|------|
| **`interface Props` 이름 고정** | Astro가 이 이름을 인식해 타입 체크한다 |
| **선택적 prop은 `?`** | `examComment?: string` |
| **구조 분해로 받는다** | `const { title } = Astro.props;` |
| **`any` 금지** | 타입을 못 정하겠으면 그 설계가 틀린 것이다 |

### 2.3 컴포넌트 크기: **작게, 하나만**

| 컴포넌트 | 책임 (하나뿐) |
|----------|--------------|
| `GNB.astro` | 상단 네비게이션 |
| `Footer.astro` | 하단 푸터 |
| `QuestionHistory.astro` | **섹션 4 — 기출 출제 이력** |
| `RelatedChapters.astro` | **섹션 5 — 관련 챕터** |

> 컴포넌트가 2가지 일을 하면 쪼갠다. 100줄을 넘어가면 의심한다.

### 2.4 새 컴포넌트를 만들기 전에 3번 자문한다

| # | 질문 | 통과 못 하면 |
|---|------|-------------|
| 1 | **기존 카드 3종·버튼 3종으로 안 되나?** | 기존 것을 쓴다. **"신규 디자인 금지"는 Cowork 지시문에 명시된 규칙이다** |
| 2 | **2곳 이상에서 쓰이나?** | 1곳뿐이면 페이지에 인라인으로 둔다 |
| 3 | **네이티브 HTML로 안 되나?** (§2.5) | `<details>`, `<dialog>`를 먼저 쓴다 |

### 2.5 인터랙션은 네이티브 HTML 우선 — **실제로 이렇게 하고 있다**

| 인터랙션 | 구현 | 얻는 것 |
|----------|------|---------|
| **드롭다운** | `<details>` / `<summary>` | 토글 상태·키보드 조작·스크린리더 지원 **무료** |
| **모달 (기출문제 레이어)** | **`<dialog>`** | ESC 닫기·포커스 트랩·백드롭 **무료** |
| 접기/펴기 | `<details>` | 동일 |

**실제 코드**
```astro
<!-- GNB 드롭다운 -->
<details class="gnb-menu">
  <summary>필기 과목 <svg …/></summary>
  <div class="gnb-dropdown">…</div>
</details>

<!-- 기출문제 모달 -->
<button class="round-badge" data-open={q.id}>{q.label} {q.number}번</button>
<dialog class="q-layer" id={`q-${q.id}`} data-revealed="false">
  <div class="q-inner">…</div>
</dialog>
```

> 🚨 **React로 드롭다운·모달을 만들지 마라.** 브라우저가 이미 만들어 놨고, 접근성까지 처리해준다.

### 2.6 조건부 렌더링 패턴

```astro
<!-- 빈 상태를 반드시 처리한다 — 실제 코드 -->
{questions.length > 0 ? (
  <>
    <div class="freq-label">최근 5개년 {questions.length}회 출제 · {years.size}개 연도</div>
    <div class="round-badges">…</div>
  </>
) : (
  <div class="freq-label">최근 5개년 직접 출제 이력 없음</div>
)}

<!-- 선택적 값 -->
{examComment && <p class="exam-comment"><strong>출제 경향</strong> — {examComment}</p>}
```

| 규칙 | 근거 |
|------|------|
| **빈 상태를 항상 처리한다** | 기출 0건 챕터가 실제로 존재한다. 빈 화면은 버그로 보인다 |
| **Fragment는 `<>...</>`** | 불필요한 wrapper div 금지 |

### 2.7 스크립트는 컴포넌트 하단, 최소한으로

```astro
<script>
  document.querySelectorAll('.gnb-menu').forEach(d => {
    document.addEventListener('click', e => {
      if (d instanceof HTMLDetailsElement && d.open && !d.contains(e.target as Node)) {
        d.open = false;
      }
    });
  });
</script>
```

| 규칙 | 근거 |
|------|------|
| **`<script>`는 컴포넌트 파일 안에** | 코드 응집성 |
| **10줄 넘으면 설계를 의심한다** | 네이티브로 안 되는지 재검토 |
| **`instanceof` 가드로 타입 좁히기** | Astro `<script>`는 TS다 |

---

## 3. 폴더 구조 규칙

### 3.1 디렉토리별 책임 — **넘나들면 안 된다**

| 디렉토리 | 넣는 것 | **절대 넣지 않는 것** |
|----------|---------|---------------------|
| `src/config/` | 변하지 않는 상수, 순수 유틸 | 컴포넌트, 스타일, 데이터 조회 |
| `src/content/` | 콘텐츠 원본 (md) | 설정, 코드 |
| `src/data/` | 기계 생성 JSON | 사람이 손으로 고칠 것 |
| `src/layouts/` | 페이지 셸 (html/head/body) | 페이지별 고유 로직 |
| `src/components/` | 재사용 UI | **데이터 조회 로직** (§2.1) |
| `src/pages/` | 라우팅 + **데이터 조회·조인** | 스타일 정의 |
| `src/styles/` | 전역 토큰·스타일 | 컴포넌트 스코프 스타일 |

### 3.2 새 파일을 어디에 둘지 판정 트리

```
이 파일이…
├─ URL을 만든다              → src/pages/
├─ 여러 페이지에서 재사용된다   → src/components/
├─ html/head/body를 감싼다     → src/layouts/
├─ 상수 또는 순수 함수다        → src/config/
├─ 사람이 쓴 글이다            → src/content/chapters/{subject-slug}/
├─ 기계가 만든 데이터다         → src/data/
└─ 전역 스타일이다             → src/styles/global.css
```

### 3.3 챕터 md의 위치는 **과목 슬러그 디렉토리**

```
src/content/chapters/
├─ safety-management/    # 1과목
├─ ergonomics/           # 2과목
├─ mechanical/           # 3과목
├─ electrical/           # 4과목
│  └─ ohm-law.md
├─ chemical/             # 5과목
└─ construction/         # 6과목
```

> ⚠️ **디렉토리는 정리용일 뿐, 라우팅에 쓰이지 않는다.** URL은 frontmatter의 `subject_id` → `SUBJECTS[id].slug`로 결정된다.
> **즉 md 파일을 잘못된 과목 폴더에 넣어도 빌드는 통과한다.** `subject_id`가 진실이다. 하지만 **폴더와 `subject_id`를 반드시 일치시켜라** — 안 그러면 사람이 파일을 못 찾는다.

### 3.4 금지된 디렉토리

| 금지 | 이유 |
|------|------|
| `src/utils/`, `src/lib/`, `src/helpers/` | `src/config/`로 통일. 잡동사니 폴더를 만들지 않는다 |
| `src/hooks/`, `src/store/` | React가 없다. 상태 관리가 없다 |
| `src/api/` | API가 없다 |
| `scripts/` | 초기 폴더안에 있었으나 **폐기됨.** 노션 동기화 스크립트는 만들어지지 않았다 |

---

## 4. import 규칙

### 4.1 import 순서 (고정)

```astro
---
// ① 전역 CSS (레이아웃에서만)
import '../styles/global.css';

// ② Astro 런타임
import { getCollection, render } from 'astro:content';

// ③ 레이아웃
import BaseLayout from '../../../layouts/BaseLayout.astro';

// ④ 컴포넌트
import QuestionHistory from '../../../components/QuestionHistory.astro';
import RelatedChapters from '../../../components/RelatedChapters.astro';

// ⑤ 설정·유틸
import { SUBJECTS, type SubjectId } from '../../../config/subjects';
import { withBase } from '../../../config/url';

// ⑥ 타입 선언
interface Props { … }

// ⑦ props 구조 분해
const { chapter } = Astro.props;

// ⑧ 데이터 조회·조인
const allQuestions = await getCollection('questions');
---
```

### 4.2 상대 경로 vs 경로 별칭

**현재: 상대 경로만 사용한다.**
```ts
import { SUBJECTS } from '../../../../config/subjects';   // 실제 코드
```

> ⚠️ **기술 부채**: `[subject]/[slug].astro`에서 `../../../../`가 나온다. 깊이가 4단이다.
> **개선안 (권장)**: `tsconfig.json`에 경로 별칭 추가
> ```json
> { "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
> ```
> → `import { SUBJECTS } from '@/config/subjects';`
> **단, 도입하면 전 파일을 일괄 수정해야 한다.** 다른 대규모 리팩터링과 함께 처리할 것.

### 4.3 타입 import는 `type` 키워드

```ts
import { SUBJECTS, type SubjectId } from '../config/subjects';   // ✅ 실제 코드
```
빌드 시 타입은 지워지므로, 명시하면 번들러가 확실히 제거한다.

### 4.4 금지

| 금지 | 이유 |
|------|------|
| `import React from 'react'` | React가 없다 |
| `import tailwind…` | Tailwind가 없다 |
| `import { Search } from 'lucide-react'` | **Lucide 패키지가 없다.** SVG를 인라인으로 복사한다 (§6.6) |
| 순환 import | 컴포넌트가 페이지를 import하는 일이 없어야 한다 |
| npm 패키지 임의 추가 | **의존성이 4개뿐인 것은 설계다.** 추가 전에 마일로 승인 |

---

## 5. TypeScript 작성 규칙

### 5.1 `as const` + `keyof typeof` — 동결 키를 타입으로 강제

```ts
// src/config/subjects.ts — 실제 코드
export const SUBJECTS = {
  1: { slug: 'safety-management', name: '산업재해 예방 및 안전보건교육' },
  2: { slug: 'ergonomics',        name: '인간공학 및 위험성평가·관리' },
  3: { slug: 'mechanical',        name: '기계·기구 및 설비 안전관리' },
  4: { slug: 'electrical',        name: '전기설비 안전관리' },
  5: { slug: 'chemical',          name: '화학설비 안전관리' },
  6: { slug: 'construction',      name: '건설공사 안전관리' },
} as const;

export type SubjectId = keyof typeof SUBJECTS;   // 1 | 2 | 3 | 4 | 5 | 6
```

**이 12줄이 하는 일**
- `subject_id`가 7이면 **컴파일 단계에서 잡힌다.** 런타임 오류가 아니라 빌드 오류로 만든다
- 과목명·슬러그를 **한 곳에서만 관리**한다

### 5.2 Zod 스키마가 데이터 계약이다

`src/content.config.ts`가 **모든 데이터의 형태를 선언하는 유일한 곳**이다.

```ts
answer: z.number().min(1).max(4),   // ← 이 한 줄이 정답 파싱 실패 5건을 잡아냈다
```

| 규칙 | 근거 |
|------|------|
| **스키마를 먼저 세우고 데이터를 넣는다** | "그릇 없이 74개를 쓰면 스키마 변경 시 전량 수정" — 실제로 이 판단으로 Astro 구조를 콘텐츠보다 먼저 세웠다 |
| **제약을 최대한 좁게 건다** | `z.number()` 보다 `z.number().min(1).max(4)`. 좁을수록 빌드가 더 많이 잡아준다 |
| **enum은 `z.enum`** | `priority: z.enum(['출시 필수','1차','2차'])` |
| **기본값을 준다** | `.default([])`, `.default(999)` — 스텁 생성 시 빌드가 안 깨진다 |
| **스키마 변경 = 254개 파일 영향** | 변경은 이관/양산 작업과 **묶어서** 처리 |

### 5.3 금지

| 금지 | 대안 |
|------|------|
| `any` | 타입을 못 정하겠으면 설계가 틀린 것이다. `unknown` + 타입 가드 |
| `@ts-ignore` | 원인을 고친다 |
| **`!` non-null assertion 남용** | ⚠️ 실제 코드에 `a!.id` 같은 사용이 있다. `filter(Boolean)` 이후라 안전하지만, 가급적 타입 가드로 |
| 타입 단언 남발 | `as SubjectId`는 `SUBJECTS[id]` 인덱싱에만. 그 외에는 지양 |

### 5.4 함수는 화살표 함수 + 명시적 반환 타입 (공개 API)

```ts
// 공개 유틸 — 반환 타입 명시
export function withBase(path: string): string { … }

// 로컬 헬퍼 — 추론 허용
const countBy = (id: number) => chapters.filter(c => c.data.subject_id === id).length;
```

---

## 6. CSS 작성 규칙

### 6.1 단일 파일: `src/styles/global.css`

| 규칙 | 근거 |
|------|------|
| **모든 전역 스타일은 `global.css` 한 파일** | 254개 페이지의 일관성. 파일이 흩어지면 중복 정의가 생긴다 |
| **컴포넌트 스코프 스타일은 `.astro` 파일 내 `<style>`** | Astro가 자동으로 스코프를 격리한다 |
| **레이아웃이 `global.css`를 import** | `import '../styles/global.css';` — BaseLayout·ChapterLayout에서만 |

### 6.2 CSS 변수(토큰)만 사용한다 — **하드코딩 금지**

```css
/* ❌ 금지 */
.card {
  background: #F2F4F6;
  padding: 24px;
  border-radius: 10px;
}

/* ✅ 실제 방식 */
.card {
  background: var(--gray-100);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
}
```

**확인된 토큰명 (실제 코드)**
```
--primary-600
--gray-900  --gray-600  --gray-200  --gray-100
--fs-caption  --fs-label
--fw-bold  --fw-semibold
--space-2  --space-3  --space-4  --space-6  --space-8
--container-max
--radius-sm/md/lg/xl
--shadow-sm/md/lg
```

> 전체 목록은 `grep -oE "^\s*--[a-z0-9-]+" src/styles/global.css | sort -u`로 확인.

### 6.3 인라인 스타일: **1회성 레이아웃 조정에만 허용**

실제 코드가 이렇게 쓰고 있다:
```astro
<p class="gpl-body-lg"
   style="max-width:560px;margin:var(--space-4) auto 0;color:var(--gray-600)">
```

| 허용 | 금지 |
|------|------|
| 1회성 여백·정렬 조정 | 반복되는 스타일 |
| **반드시 `var(--토큰)` 사용** | `color: #6B7684` ❌ |
| 짧게 (3속성 이내) | 5속성 넘으면 클래스로 뺀다 |

> **현실적 타협이다.** 클래스를 남발하는 것보다 낫지만, 같은 인라인 스타일이 2번 나오면 즉시 클래스로 승격한다.

### 6.4 간격은 4px 그리드

```css
/* ✅ */  padding: var(--space-4);   /* 16px */
/* ❌ */  padding: 13px;              /* 4의 배수가 아님 */
```

### 6.5 호버 효과는 데스크톱만

```css
/* ❌ 모바일에서 터치 후 스타일이 남는다 */
.card:hover { transform: translateY(-2px); }

/* ✅ */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}
```

### 6.6 `prefers-reduced-motion`을 깨지 않는다

```css
/* global.css에 이미 존재 */
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
```
> 새 애니메이션을 추가할 때 **이 블록이 커버하는지 확인**한다. `animation`을 쓰면 이 블록에 `animation: none !important`도 추가해야 한다.

### 6.7 모바일 퍼스트 — `min-width`만 쓴다

```css
/* ✅ 기본 = 모바일 */
.gnb { height: 56px; padding: 0 16px; }

@media (min-width: 1024px) {
  .gnb { height: 64px; padding: 0 24px; }
}

/* ❌ max-width로 모바일을 깎아내리지 않는다 */
```

### 6.8 금지

| 금지 | 이유 |
|------|------|
| `!important` | `prefers-reduced-motion` 블록 외에는 금지. 특정도 전쟁의 시작 |
| `outline: none` (대체 없이) | 키보드 사용자 배제 |
| ID 셀렉터 스타일링 (`#foo { }`) | 특정도가 너무 높다. ID는 앵커·JS용 |
| 4단계 이상 중첩 | `.a .b .c .d { }` ❌ |
| 팔레트 외 새 색 | §UI_UX_GUIDE §2 |

---

## 7. Tailwind 사용 원칙

### 7.1 🔴 **Tailwind를 쓰지 않는다**

**정책 문서에는 "Tailwind CSS로 구현"이라고 적혀 있지만, 실제 코드에 Tailwind는 없다.**

```bash
$ grep -i tailwind package.json
# (결과 없음)
```

**따라서 이 프로젝트의 Tailwind 원칙은 단 하나다:**

> ## **Tailwind 클래스를 쓰지 마라. 동작하지 않는다.**

```astro
<!-- ❌ 아무것도 안 일어난다 -->
<div class="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-md">

<!-- ✅ -->
<div class="card">
```

### 7.2 왜 이 규칙이 중요한가

**AI와 Cowork가 가장 자주 어기는 규칙이다.** LLM은 "Astro + 스타일링"이라는 맥락에서 반사적으로 Tailwind를 뱉는다. 그 코드는 빌드는 통과하고, **화면만 깨진다.** 조용한 실패라 발견이 늦다.

### 7.3 Tailwind가 없는데 왜 문서에는 있나

⚠️ **명확한 근거는 대화에 없다.** 정황상:
- 초기 정책(2026-06): "Tailwind 커스터마이징 + 디자인 토큰" 채택
- 실제 구현(2026-07): Claude Design 아카이브를 파싱해 **`global.css` CSS 변수로 직접 이식**
- 이 과정에서 **Tailwind 계층이 자연스럽게 생략**된 것으로 보인다

**결과적으로는 좋은 선택이다.** 정적 사이트에 Tailwind는 빌드 계층을 하나 더 얹는 것이고, 254개 페이지의 스타일이 이미 토큰으로 통제되고 있다.

### 7.4 도입을 재검토할 조건

| 조건 | 판단 |
|------|------|
| Phase 2에서 React 컴포넌트가 늘어난다 | 그때 재검토 가치 있음 |
| 지금 도입 | ❌ **하지 마라.** 254개 페이지의 클래스를 전부 갈아엎는 작업이 되고, 얻는 게 없다 |

### 7.5 Tailwind 스케일 ↔ CSS 변수 대응표 (참고용)

| Tailwind | 우리 토큰 |
|----------|-----------|
| `bg-blue-700` | `var(--primary-600)` (`#1D4ED8`) |
| `p-6` | `var(--space-6)` (24px) |
| `rounded-lg` | `var(--radius-lg)` (10px) |
| `shadow-sm` | `var(--shadow-sm)` |
| `text-gray-800` | `var(--gray-800)` |

> **혼동 주의**: 우리 `--primary-600`은 Tailwind의 `blue-700`이다. 숫자가 한 칸 다르다.

---

## 8. Astro 사용 원칙

### 8.1 Astro 5 — Content Layer API를 쓴다

```ts
// ✅ Astro 5 (현재)
import { glob, file } from 'astro/loaders';
const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({ … }),
});

// ❌ Astro 4 이하 문법 — 인터넷 예제 대부분이 이것이다. 복사하지 마라
const chapters = defineCollection({ type: 'content', schema: … });
```

| loader | 용도 |
|--------|------|
| `glob(...)` | 여러 md 파일 → 각각 하나의 엔트리 (챕터) |
| `file(...)` | 하나의 JSON 배열 → 각 원소가 하나의 엔트리 (기출문제) |

### 8.2 `getStaticPaths`는 페이지에서만

```astro
export async function getStaticPaths() {
  const chapters = await getCollection('chapters');
  return chapters
    .filter(ch => ch.data.status === '작성완료')   // ★ 스텁 제외 필터 필수
    .map(ch => ({
      params: {
        subject: SUBJECTS[ch.data.subject_id as SubjectId].slug,
        slug: ch.data.slug,
      },
      props: { chapter: ch },
    }));
}
```

> 🚨 **`status: 작성완료` 필터가 4곳에 있어야 한다**: ① `getStaticPaths` ② 과목 목차 카드·카운트 ③ 홈 과목 카드 카운트 ④ 사이드바 `sideChapters`.
> **하나라도 빠지면 스텁이 새어나온다.** 빌드 후 `dist/`에 미작성 챕터 페이지가 생겼는지 반드시 확인.

### 8.3 `<slot />`으로 조합한다

```astro
<ChapterLayout {...chapter.data} sideChapters={sideChapters}>
  <Content />                                    <!-- 섹션 1~3: 수동 작성 md -->
  <QuestionHistory questions={linked} … />       <!-- 섹션 4: 빌드 자동 -->
  <RelatedChapters manual={manual} … />          <!-- 섹션 5: 빌드 자동 -->
</ChapterLayout>
```
> **수동 영역과 자동 영역이 물리적으로 분리된다.** 이것이 v3 템플릿의 코드 레벨 구현이다.

### 8.4 `<Content />` — md 본문 렌더

```ts
const { Content } = await render(chapter);   // Astro 5 문법
```
> Astro 4의 `await chapter.render()`가 아니다.

### 8.5 링크는 **반드시 `withBase()`로 감싼다**

```astro
<!-- ❌ GitHub Pages 서브패스에서 404 -->
<a href="/industrial-safety/written/electrical/">4과목</a>

<!-- ✅ -->
<a href={withBase('/industrial-safety/written/electrical/')}>4과목</a>
```

| 규칙 | 근거 |
|------|------|
| **모든 내부 링크에 `withBase()`** | 현재 사이트가 `syjy813.github.io/**getpasslab**/` 서브패스에 산다 |
| **trailing slash 붙인다** | `/written/` (○) — 실제 코드가 일관되게 이렇게 한다 |
| **커스텀 도메인 연결 시** | `astro.config.mjs`의 `base`만 바꾸면 **전체 링크가 동시에 정상화**된다. 이것이 `withBase()`를 만든 이유 |

### 8.6 프레임워크 통합을 추가하지 않는다

```bash
# ❌ 지금 하지 마라
npx astro add react
npx astro add tailwind
```

| 규칙 | 근거 |
|------|------|
| **의존성 4개(astro, remark-math, rehype-katex, katex)를 유지한다** | JS 번들 0. 1인 유지보수 |
| **Phase 2에서 React 통합 추가** | 로그인·오답노트 UI를 **Islands로만** 붙인다. 사이트 전체를 SPA로 바꾸지 않는다 |
| 새 패키지 추가는 마일로 승인 | |

### 8.7 빌드 검증 — Cowork 세션 후 필수

```bash
npm run build
# ① 빌드 성공했는가 (Zod 스키마 위반 없는가)
# ② dist/에 미작성 챕터 페이지가 새어나오지 않았는가
find dist -path "*written*" -name "index.html" | wc -l
```

---

## 9. 성능 최적화 원칙

### 9.1 현재 상태: **이미 거의 최적이다. 망치지 마라.**

| 항목 | 현재 |
|------|------|
| JS 번들 | **거의 0** (GNB 드롭다운 스크립트 6줄) |
| 서버 요청 | **0** (정적 파일만) |
| DB 조회 | **0** |
| 의존성 | **4개** |

> **성능 최적화의 90%는 "아무것도 추가하지 않는 것"이다.**

### 9.2 지켜야 할 규칙

| # | 규칙 | 근거 |
|---|------|------|
| 1 | **JS 프레임워크를 추가하지 않는다** | React 하나가 ~40KB. 드롭다운 하나 만들자고 |
| 2 | **모든 연산은 빌드 타임에** | 클라이언트에서 계산하지 않는다 |
| 3 | **`client:*` 디렉티브를 함부로 쓰지 않는다** | Phase 2에서도 `client:visible` / `client:idle`을 우선. `client:load`는 최후 |
| 4 | **이미지는 최소한으로** | 현재 이미지가 거의 없다. 추가 시 `<Image>` (astro:assets) 사용 |
| 5 | **폰트는 dynamic-subset** | Pretendard `pretendardvariable-dynamic-subset` 사용 중 — **페이지에 등장하는 글자만 다운로드.** 한글 폰트 용량 문제 해결 |

### 9.3 알려진 성능 부채

| # | 항목 | 심각도 | 대응 |
|---|------|--------|------|
| 1 | **조인이 O(n×m)** | 🟡 낮음 | `chapter.questions.map(id => allQuestions.find(...))` — 챕터당 선형 탐색.<br>**개선**: `const qMap = new Map(allQuestions.map(q => [q.data.id, q.data]))` 후 `qMap.get(id)` |
| 2 | **CDN 의존 2건** (Pretendard, KaTeX CSS) | 🟡 | jsDelivr 장애 시 폰트·수식 깨짐. 자체 호스팅 전환은 저비용 |
| 3 | **광고 슬롯 CLS** | 🟠 **높음** | AdSense가 늦게 로드되며 본문을 밀어낸다.<br>**필수**: 슬롯에 **고정 높이 예약** (`min-height`) |
| 4 | **`<dialog>`를 챕터당 N개 렌더** | 🟡 | 기출 30개 챕터는 dialog 30개가 HTML에 박힌다. 문서 크기 증가.<br>필요 시 lazy 렌더 검토 |
| 5 | **View Transitions + AdSense** | ⚠️ | View Transitions 도입 시 **광고 재로드 이슈**가 알려져 있다. 도입 전 검증 |

### 9.4 측정 기준 (배포 후)

| 지표 | 목표 |
|------|------|
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | **< 0.1** ← 광고 때문에 가장 위험 |
| INP | < 200ms (JS가 없으므로 문제없어야 정상) |

---

## 10. SEO 원칙

> **SEO는 이 서비스의 유일한 트래픽 채널이다.** 광고비 0원이므로 검색 유입이 전부다.

### 10.1 챕터 페이지 = SEO 랜딩 페이지

| 원칙 | 구현 |
|------|------|
| **1챕터 = 1URL = 1키워드** | 챕터를 잘게 쪼갠 이유가 이것이다 |
| **URL에 챕터 번호 없음** | `order`가 바뀌어도 URL 불변 → **인덱스 손실 방지** |
| **슬러그 동결** | URL이 바뀌면 그동안 쌓은 인덱스가 전부 죽는다 |

### 10.2 `summary` 필드는 SEO 자산이다

`frontmatter.summary`가 **3곳**에서 쓰인다:
1. `<meta name="description">`
2. 챕터 카드의 한 줄 요약
3. 챕터 헤더

```astro
<meta name="description" content={summary} />   <!-- 실제 코드 -->
```

| 규칙 | 근거 |
|------|------|
| **`summary`는 100~150자** | meta description의 검색 결과 표시 길이 |
| **핵심 키워드를 앞쪽에** | 잘려도 살아남게 |
| **254개를 수동 작성할 수 없다** | 그래서 `summary`가 자동으로 meta가 되게 설계했다. **`summary`를 대충 쓰면 SEO가 대충 된다** |

### 10.3 `<title>` 규칙 — ⚠️ **현재 불일치**

```astro
<!-- ChapterLayout.astro -->
<title>{title} | 산업안전기사 핵심요약 - GetPassLab</title>

<!-- BaseLayout.astro — 페이지가 전체 title을 넘긴다 -->
<title>{title}</title>
<!-- 호출부: title="산업안전기사 필기 — GetPassLab" -->
```

> ⚠️ **구분자가 뒤섞여 있다**: `|`, `-`, `—`(em dash).
> **표준을 정하고 통일할 것.** 권장: `{페이지명} | GetPassLab`

### 10.4 필수 SEO 요소 — **현재 누락된 것들**

| 요소 | 현재 상태 | 조치 |
|------|-----------|------|
| `<title>` | ✅ | 구분자 통일 |
| `<meta description>` | ✅ | |
| **OG 태그** | 🔴 **없음** | `og:title`, `og:description`, `og:type`, `og:url`, `og:image` 추가 |
| **canonical** | 🔴 **없음** | `<link rel="canonical">` — **`/all` 페이지 도입 시 필수** |
| **sitemap.xml** | 🟡 | `@astrojs/sitemap` + `filter: (page) => !page.includes('/admin')` |
| **robots.txt** | 🟡 | `Disallow: /admin/` |
| **`/admin/` noindex** | 🟡 | `<meta name="robots" content="noindex, nofollow">` |
| **구조화 데이터 (JSON-LD)** | 🔴 없음 | `Article` + `BreadcrumbList` |
| favicon | ⚪ 미확인 | |
| **Pretendard 폰트가 BaseLayout에 없음** | 🔴 **버그 의심** | ChapterLayout에만 폰트 link가 있다. **홈·과목 페이지에 폰트가 안 걸릴 수 있다.** 확인 필요 |

### 10.5 `/admin/` 페이지는 3중으로 차단한다

```
① <meta name="robots" content="noindex, nofollow">
② robots.txt: Disallow: /admin/
③ sitemap({ filter: (page) => !page.includes('/admin') })
```
> 하나만 하면 샌다. **3개 전부.**

### 10.6 콘텐츠 SEO 규칙

| 규칙 | 근거 |
|------|------|
| **분량을 부풀리지 않는다** | 자연 분량 원칙(1,000~1,300자). 억지로 늘리면 품질이 떨어지고, 구글은 그걸 안다 |
| **h1은 페이지당 1개** | 챕터명이 h1 |
| **내부 링크를 자동 생성한다** | 섹션 5 관련 챕터 = 내부 링크 = SEO 권위 전달 |
| **본문에 링크 하드코딩 금지** | 254개 유지보수 불가. frontmatter → 빌드 자동 렌더 |
| **수식은 KaTeX (이미지 금지)** | 이미지 안의 텍스트는 검색되지 않는다 |
| **접기(accordion)를 쓰지 않는다** | 숨겨진 콘텐츠는 SEO 가중치가 낮다. 5섹션 전부 펼침 |
| **미작성 챕터를 인덱싱하지 않는다** | `status: 작성완료` 필터. 빈 페이지는 사이트 품질 점수를 깎는다 |

### 10.7 SEO 타이밍

| 사실 | 함의 |
|------|------|
| **색인에 1~2주 소요** | 트래픽 피크(시험 시즌) **최소 1개월 전**에는 출시·색인 완료 상태여야 한다 |
| Search Console 등록 | 출시 즉시. 색인 요청 수동 제출 |

---

## 11. 금지 목록 (한 페이지 요약)

> **AI·Cowork가 가장 자주 어기는 것들. 작업 전에 이 표를 읽어라.**

| # | 금지 | 결과 |
|---|------|------|
| 1 | `slug` / `subject_id` / `question_id` 변경·생성 | URL·SEO·유저 데이터 붕괴 |
| 2 | **Tailwind 클래스 사용** | 조용히 스타일이 깨진다 |
| 3 | **하드코딩 색상·간격** | 254개 페이지 일관성 붕괴 |
| 4 | **React/Vue import** | 프레임워크가 없다 |
| 5 | **`lucide-react` import** | 패키지가 없다. SVG 인라인 복사 |
| 6 | **컴포넌트에서 `getCollection()` 호출** | 데이터 흐름 역류 |
| 7 | **본문에 기출 링크 하드코딩** | 유지보수 불가 |
| 8 | **`status` 필터 누락** | 스텁이 프로덕션에 샌다 |
| 9 | **`withBase()` 없는 내부 링크** | GitHub Pages에서 404 |
| 10 | **`any` / `@ts-ignore`** | 타입 시스템이 잡아줄 것을 놓친다 |
| 11 | **같은 정보를 두 곳에 저장** | 이중 원본 → 불일치 |
| 12 | **npm 패키지 임의 추가** | 의존성 4개는 설계다 |
| 13 | **SEO용 분량 부풀리기** | 자연 분량 원칙 위반 |
| 14 | **새 컴포넌트·디자인 발명** | 카드 3종·버튼 3종으로 충분 |
| 15 | **Cowork 동시 세션** | 파일 충돌 |
| 16 | **Astro 4 문법 복사** | `type: 'content'` ❌ → `loader: glob(...)` |

---

## 12. 즉시 조치가 필요한 항목

| # | 항목 | 심각도 |
|---|------|--------|
| 1 | **BaseLayout에 Pretendard 폰트 link가 없다** — 홈·과목 페이지에서 폰트가 안 걸릴 가능성 | 🔴 |
| 2 | **광고 슬롯 CLS 대비 고정 높이** — AdSense 신청 전 필수 | 🔴 |
| 3 | **OG 태그·canonical·JSON-LD 부재** | 🟠 |
| 4 | **`<title>` 구분자 불일치** (`\|` / `-` / `—`) | 🟡 |
| 5 | **미매칭 기출 ID의 조용한 실패** — `filter(Boolean)`이 오타를 삼킨다. **빌드 시 경고 출력 로직 추가** | 🟠 |
| 6 | **경로 별칭(`@/`) 미도입** — `../../../../`가 나온다 | 🟡 |
| 7 | **조인을 `Map`으로 최적화** | 🟡 |

---

## 13. 검증 명령어

```bash
# Tailwind / Lucide / React 부재 확인 (전부 결과 없어야 정상)
grep -iE "tailwind|lucide|react|vue" package.json

# 하드코딩 색상 탐지 (결과가 나오면 토큰으로 교체)
grep -rnE "#[0-9A-Fa-f]{6}" src/ --include=*.astro

# withBase 누락 링크 탐지
grep -rn 'href="/' src/ --include=*.astro

# status 필터 존재 확인 (4곳에 있어야 함)
grep -rn "작성완료" src/pages/ src/layouts/

# any / ts-ignore 탐지
grep -rnE ": any|@ts-ignore" src/

# 빌드 + 스텁 유출 검사
npm run build && find dist -name "index.html" | wc -l
```

---

## 다음에 읽을 문서

| 문서 | 내용 |
|------|------|
| `ARCHITECTURE.md` | 스키마·조인·디렉토리 (§9 동결 키, §7 조인) |
| `UI_UX_GUIDE.md` | 디자인 토큰 전체, 컴포넌트 스타일 |
| `KNOWN_ISSUES.md` | 이 문서 §12의 규칙 위반이 이슈로 트래킹됨 |
| `AI_HANDOVER.md` | 인수인계 진입점 (§13 제약 블록의 원본) |

> ⚠️ **미작성(계획됨)**: `DATA_MODEL.md`, `CONTENT_SYSTEM.md`, `OPERATIONS_RUNBOOK.md`. 관련 정보는 `ARCHITECTURE.md` §9, `PRD.md` F-15, 본 문서 §11에 분산.
