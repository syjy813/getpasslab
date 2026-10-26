// Exact inverse used only by historical release checks; current checks use
// native bytes. Unknown files and mutations are never projected away.
import assert from 'node:assert/strict';
import {readFile as nativeRead,readdir as nativeReaddir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import { beforeGlobalChapterReadability, isReadabilityAddition } from './read-before-global-chapter-readability.mjs';
import {beforeStandardizedPractice} from './fire-mock-authoring/standardization.mjs';
const audit='docs/audits/2026-10-20-fire-persona-corrections';
const release=JSON.parse(await nativeRead(audit+'/release.json','utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
// Approved editorial revision of FSM2-001; retain every prior content review.
// Native text is checked separately against the new three-point source map.
const gradeCopyEditFiles = {
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/management-target-grades.md": {
    "sha256": "134308fa6cf8aec67bd1e2c4517e45eb4b1229993854f33898eadb6679e99670",
    "beforeSHA256": "cbe3d626b853e00f8f8a193cf71d2f3466eecde505f5085ea062354ff5d013c1",
    "at": 366,
    "current": "copy-20261022\">\n\n<div class=\"fire-grade-lesson\">\n<section class=\"fire-grade-section\" aria-labelledby=\"등급을-판별하는-순서\">\n<h2 id=\"등급을-판별하는-순서\">등급별 판정 기준</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인<br>여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급별 판정 기준 표\"><table><thead><tr><th scope=\"col\">등급</th><th scope=\"col\">주요 판정 기준(하나 이상 해당)</th></tr></thead><tbody><tr><th scope=\"row\">특급</th><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><th scope=\"row\">1급</th><td><p class=\"fire-grade-prerequisite\">특급 제외</p><ul class=\"fire-grade-conditions\"><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외)</li><li>지상 11층 이상(아파트 제외)</li><li>가연성 가스 1천t 이상 저장·취급</li></ul></td></tr><tr><th scope=\"row\">2급</th><td><p class=\"fire-grade-prerequisite\">특급·1급 제외</p><ul class=\"fire-grade-conditions\"><li>옥내소화전 또는 스프링클러 설치 대상</li><li>물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비</li><li>가연성 가스 100t 이상 1천t 미만 저장·취급</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><th scope=\"row\">3급</th><td><p class=\"fire-grade-prerequisite\">특급·1급·2급 제외</p><ul class=\"fire-grade-conditions\"><li>간이스프링클러 설치 대상(주택전용 제외)</li><li>자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외</p>\n\n</section>\n<section class=\"fire-grade-section\" aria-labelledby=\"시험-포인트\">\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>지하층 포함 여부</strong><p>아파트의 50층·30층 기준: 지상층만 계산</p><p>아파트 외 대상물: 특급의 30층은 지하층 포함, 1급의 11층은 지상층만 계산</p><p>상위 등급 조건이 없는 판매시설의 예<br>지상 9층·지하 2층 / 연면적 12,800㎡<br>옥내소화전·스프링클러 법정 설치 대상 → 2급</p></li>\n<li><strong>설비별 등급이 겹치는 경우</strong><p>옥내소화전 또는 스프링클러의 법정 설치 대상이면 2급 조건</p><p>자동화재탐지설비가 함께 있어도 3급으로 판단하지 않음</p><p>특급·1급·2급 조건 없이 자동화재탐지설비만 설치 대상이면 3급</p></li>\n<li><strong>가연성 가스 저장·취급량</strong><p>2급: 100t 이상 1천t 미만<br>1급: 1천t 이상</p><p>400t·500t은 2급 구간",
    "before": "footer-20261022\">\n\n<div class=\"fire-grade-lesson\">\n<section class=\"fire-grade-section\" aria-labelledby=\"등급을-판별하는-순서\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n\n</section>\n<section class=\"fire-grade-section\" aria-labelledby=\"시험-포인트\">\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임"
  },
  "public/styles/fire-bulk-visual.css": {
    "sha256": "aa310cbad6960878fc2084b369772547f61574b5cb299b13167c5f097d091d38",
    "beforeSHA256": "d5e4fb64fe48fcf5a518b0110162bcdaf469b52e106bc83da09a6f3cf62b7aa3",
    "at": 5715,
    "current": "\n/* FSM2-001 editorial pass: separate shared prerequisites from alternatives. */\narticle .fire-grade-lesson tbody th{vertical-align:top;white-space:nowrap;background:var(--white);font-weight:var(--fw-semibold)}\narticle .fire-grade-lesson td{vertical-align:top}\narticle .fire-grade-lesson .fire-grade-prerequisite{display:table;margin:0 0 8px;padding:3px 8px;border-radius:4px;background:var(--gray-100);color:var(--gray-800);font-size:13px;line-height:1.5;font-weight:var(--fw-semibold)}\n",
    "before": ""
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/management-target-grades/index.html": {
    "sha256": "d2c1658df227f758825cdb23e9300cdaa0a0c872f858c80d3056bb4dcdbddafd",
    "beforeSHA256": "7500ac1c475513c0bc0b2cfa214454c3f5a06fdf74308899900539040a9ad5c7",
    "at": 21822,
    "current": "copy-20261022\">\n<div class=\"fire-grade-lesson\">\n<section class=\"fire-grade-section\" aria-labelledby=\"등급을-판별하는-순서\">\n<h2 id=\"등급을-판별하는-순서\">등급별 판정 기준</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인<br>여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급별 판정 기준 표\"><table><thead><tr><th scope=\"col\">등급</th><th scope=\"col\">주요 판정 기준(하나 이상 해당)</th></tr></thead><tbody><tr><th scope=\"row\">특급</th><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><th scope=\"row\">1급</th><td><p class=\"fire-grade-prerequisite\">특급 제외</p><ul class=\"fire-grade-conditions\"><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외)</li><li>지상 11층 이상(아파트 제외)</li><li>가연성 가스 1천t 이상 저장·취급</li></ul></td></tr><tr><th scope=\"row\">2급</th><td><p class=\"fire-grade-prerequisite\">특급·1급 제외</p><ul class=\"fire-grade-conditions\"><li>옥내소화전 또는 스프링클러 설치 대상</li><li>물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비</li><li>가연성 가스 100t 이상 1천t 미만 저장·취급</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><th scope=\"row\">3급</th><td><p class=\"fire-grade-prerequisite\">특급·1급·2급 제외</p><ul class=\"fire-grade-conditions\"><li>간이스프링클러 설치 대상(주택전용 제외)</li><li>자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외</p>\n</section>\n<section class=\"fire-grade-section\" aria-labelledby=\"시험-포인트\">\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>지하층 포함 여부</strong><p>아파트의 50층·30층 기준: 지상층만 계산</p><p>아파트 외 대상물: 특급의 30층은 지하층 포함, 1급의 11층은 지상층만 계산</p><p>상위 등급 조건이 없는 판매시설의 예<br>지상 9층·지하 2층 / 연면적 12,800㎡<br>옥내소화전·스프링클러 법정 설치 대상 → 2급</p></li>\n<li><strong>설비별 등급이 겹치는 경우</strong><p>옥내소화전 또는 스프링클러의 법정 설치 대상이면 2급 조건</p><p>자동화재탐지설비가 함께 있어도 3급으로 판단하지 않음</p><p>특급·1급·2급 조건 없이 자동화재탐지설비만 설치 대상이면 3급</p></li>\n<li><strong>가연성 가스 저장·취급량</strong><p>2급: 100t 이상 1천t 미만<br>1급: 1천t 이상</p><p>400t·500t은 2급 구간",
    "before": "footer-20261022\">\n<div class=\"fire-grade-lesson\">\n<section class=\"fire-grade-section\" aria-labelledby=\"등급을-판별하는-순서\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n</section>\n<section class=\"fire-grade-section\" aria-labelledby=\"시험-포인트\">\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임"
  },
  "dist/styles/fire-bulk-visual.css": {
    "sha256": "aa310cbad6960878fc2084b369772547f61574b5cb299b13167c5f097d091d38",
    "beforeSHA256": "d5e4fb64fe48fcf5a518b0110162bcdaf469b52e106bc83da09a6f3cf62b7aa3",
    "at": 5715,
    "current": "\n/* FSM2-001 editorial pass: separate shared prerequisites from alternatives. */\narticle .fire-grade-lesson tbody th{vertical-align:top;white-space:nowrap;background:var(--white);font-weight:var(--fw-semibold)}\narticle .fire-grade-lesson td{vertical-align:top}\narticle .fire-grade-lesson .fire-grade-prerequisite{display:table;margin:0 0 8px;padding:3px 8px;border-radius:4px;background:var(--gray-100);color:var(--gray-800);font-size:13px;line-height:1.5;font-weight:var(--fw-semibold)}\n",
    "before": ""
  }
};
// User-approved qualification, count-range and duty/obligation readability edits.
// Current full documents are fingerprinted before exact archived restoration.
export const fireRequirementsFiles={
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/manager-qualification-appointment.md": {
    "sha256": "4c0d4628506f87c8c90310cc3daaf920e393958b3d2a4169f1be88a1b157370d",
    "beforeSHA256": "ef288a08238b7d50fa0d3b3956ef28cdf69cc379ca9fe547df083ae67c4afe01",
    "at": 589,
    "current": " 요건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>소방기술사·소방시설관리사</li><li>그 밖의 법정 자격과 경력 조합</li><li>특급 시험 합격</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>소방설비기사·소방설비산업기사</li><li>소방공무원 7년 이상</li><li>1급 시험 합격</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>위험물기능장·위험물산업기사·위험물기능사</li><li>소방공무원 3년 이상</li><li>2급 시험 합격</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>소방공무원 1년 이상</li><li>3급 시험 합격</li></ul>",
    "before": "을 판단하는 대표 단서</th></tr></thead><tbody><tr><td>특급</td><td>소방기술사·소방시설관리사 · 그 밖의 법정 자격과 경력 조합 · 특급 시험 합격</td></tr><tr><td>1급</td><td>소방설비기사·소방설비산업기사 · 소방공무원 7년 이상 · 1급 시험 합격</td></tr><tr><td>2급</td><td>위험물기능장·위험물산업기사·위험물기능사 · 소방공무원 3년 이상 · 2급 시험 합격</td></tr><tr><td>3급</td><td>소방공무원 1년 이상 · 3급 시험 합격"
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/manager-qualification-appointment/index.html": {
    "sha256": "3be1fc7481f699e83040fe846f49e8bb6a9f2db2a074fec04fdbce7ca8516de6",
    "beforeSHA256": "761aa78230b2de8051189eddef612aa8982526e114bf2b0b1825f6295ba6cafd",
    "at": 22144,
    "current": " 요건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>소방기술사·소방시설관리사</li><li>그 밖의 법정 자격과 경력 조합</li><li>특급 시험 합격</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>소방설비기사·소방설비산업기사</li><li>소방공무원 7년 이상</li><li>1급 시험 합격</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>위험물기능장·위험물산업기사·위험물기능사</li><li>소방공무원 3년 이상</li><li>2급 시험 합격</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>소방공무원 1년 이상</li><li>3급 시험 합격</li></ul>",
    "before": "을 판단하는 대표 단서</th></tr></thead><tbody><tr><td>특급</td><td>소방기술사·소방시설관리사 · 그 밖의 법정 자격과 경력 조합 · 특급 시험 합격</td></tr><tr><td>1급</td><td>소방설비기사·소방설비산업기사 · 소방공무원 7년 이상 · 1급 시험 합격</td></tr><tr><td>2급</td><td>위험물기능장·위험물산업기사·위험물기능사 · 소방공무원 3년 이상 · 2급 시험 합격</td></tr><tr><td>3급</td><td>소방공무원 1년 이상 · 3급 시험 합격"
  },
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/assistant-appointment-count.md": {
    "sha256": "6e5b62b1ebea003f2fe3ba83132c6dd654dcb134410602e6adde908404e25327",
    "beforeSHA256": "bd13377017c18aa9813c84ca96c04c5e4039307fe6c95f1136537f73fe0df4d5",
    "at": 829,
    "current": "\\~599세대 1명, 600\\~899세대 2명, 900\\",
    "before": "~599세대 1명, 600~899세대 2명, 900"
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/assistant-appointment-count/index.html": {
    "sha256": "2777606e4af3fa99a8720c54563ea31319cc08f088522cb369b825d3e86bb5c4",
    "beforeSHA256": "df99737156b7a87676698e66459adc7d45b0407c3c7d0dcb1f07229dba15f753",
    "at": 22377,
    "current": "~599세대 1명, 600~",
    "before": "<del>599세대 1명, 600</del>"
  },
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/manager-duties-owner-responsibility.md": {
    "sha256": "f7fb422a2a3e6fd33cba0c61951eb600c2d1ed20777a122b1ccb46107bdec915",
    "beforeSHA256": "0256e19ef6a3df3d5243341121aa3f41b44d23b6a31bfae85dc88b4e2f6b1ecf",
    "at": 402,
    "current": ", 조직, 시설, 교육, 예방, 기록, 초기대응**으로 구분함\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"업무를 묶어서 판단 표\"><table><thead><tr><th>묶음</th><th>법정 업무</th></tr></thead><tbody><tr><td>계획 및 조직</td><td><ul class=\"fire-grade-conditions\"><li>피난계획을 포함한 소방계획서 작성 및 시행</li><li>자위소방대 및 초기대응체계의 구성, 운영 및 교육</li></ul></td></tr><tr><td>시설</td><td><ul class=\"fire-grade-conditions\"><li>피난시설, 방화구획 및 방화시설 관리</li><li>소방시설이나 그 밖의 소방 관련 시설 관리</li></ul></td></tr><tr><td>교육 및 예방</td><td><ul class=\"fire-grade-conditions\"><li>소방훈련 및 교육</li><li>화기 취급 감독</li></ul></td></tr><tr><td>기록 및 대응</td><td><ul class=\"fire-grade-conditions\"><li>업무수행 기록 및 유지</li><li>화재 발생 시 초기대응</li><li>그 밖에 소방안전관리에 필요한 업무</li></ul></td></tr></tbody></table></div>\n\n## 관계인의 책임\n관계인은 **소유자, 관리자 또는 점유자**를 말함\n\n관계인은 소방안전관리자 선임과 시설 유지 등의 의무를 부담함<br>소방안전관리자를 선임해도 관계인의 법정 책임이 사라지는 것은 아님\n\n소방안전관리자는 소방시설, 피난시설, 방화시설 및 방화구획의 법령 위반을 발견하면 관계인에게 지체 없이 필요한 조치를 요구해야 함<br>관계인은 조치 요구를 지체 없이 이행해야 함\n\n**관계인이 시정하지 않으면 소방안전관리자는 소방본부장 또는 소방서장에게 그 사실을 알려야 함**<br>관계인은 조치 요구를 이유로 소방안전관리자를 해임하거나 보수 지급을 거부하는 등 불이익한 처우를 해서는 안 됨\n\n소방안전관리대상물이 아닌 특정소방대상물에도 관계인의 피난시설 및 방화시설 관리, 소방시설 관리, 화기 감독, 초기대응 등 의무가 있음<br>모든 건물에 소방계획서와 자위소방대 관련 의무가 동일하게 적용되는 것은 아님\n\n## 선임 대상이 아닌 건물의 업무 범위\n소방안전관리대상물이 아닌 특정소방대상물의 관계인에게도 시설 및 방화구획 관리, 화기 감독, 초기대응 의무가 있음\n\n다음 업무는 법 제24조제5항에 따라 소방안전관리대상물에만 적용함\n\n- 소방계획서 작성 및 시행\n- 자위소방대 및 초기대응체계의 구성, 운영 및 교육\n- 소방훈련 및 교육\n- 업무수행 기록 및 유지",
    "before": "·조직·시설·교육·예방·기록·초기대응**으로 구분함\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"업무를 묶어서 판단 표\"><table><thead><tr><th>묶음</th><th>법정 업무</th></tr></thead><tbody><tr><td>계획·조직</td><td>피난계획을 포함한 소방계획서 작성·시행 · 자위소방대 및 초기대응체계 구성·운영·교육</td></tr><tr><td>시설</td><td>피난시설·방화구획·방화시설 관리 · 소방시설 및 관련 시설 관리</td></tr><tr><td>교육·예방</td><td>소방훈련·교육 · 화기 취급 감독</td></tr><tr><td>기록·대응</td><td>업무수행 기록·유지 · 화재 발생 시 초기대응 · 그 밖의 필요한 업무</td></tr></tbody></table></div>\n\n## 관계인의 책임\n관계인은 **소유자·관리자·점유자**를 말하며 선임·시설 유지 등에 대한 의무를 부담함 · 관리자를 선임했다고 관계인의 법정 책임이 사라지는 것은 아님\n\n관리자는 소방시설·피난시설·방화시설·방화구획의 법령 위반을 발견하면 관계인에게 필요한 조치를 요구 · 관계인은 지체 없이 이행해야 함\n\n**관계인이 시정하지 않으면 관리자는 소방본부장 또는 소방서장에게 그 사실을 알려야 함** · 조치 요구를 이유로 관리자를 해임하거나 보수 지급을 거부하는 등 불이익 처우 금지\n\n소방안전관리대상물이 아닌 특정소방대상물에도 관계인의 피난·방화시설 관리, 소방시설 관리, 화기 감독, 초기대응 등 의무가 있음 · 모든 건물에 계획서·자위소방대 의무가 동일하게 적용된다고 읽지 않음\n\n## 선임 대상이 아닌 건물의 업무 범위\n소방안전관리대상물이 아닌 특정소방대상물의 관계인에게도 시설·방화구획 관리, 화기 감독, 초기대응 의무가 있음 · 다만 법 제24조제5항의 소방계획서, 자위소방대·초기대응체계 구성·운영·교육, 소방훈련·교육, 업무수행 기록·유지는 소방안전관리대상물에 적용되는 항목으로 구별"
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/manager-duties-owner-responsibility/index.html": {
    "sha256": "3137eb52c7162fa0dda80f4931ff521dd35c83249964295a778d69199864e1b4",
    "beforeSHA256": "4248503e31173991914747cbf2fb8e8357443ab9f824f482bd8f7336c890eb56",
    "at": 21979,
    "current": ", 조직, 시설, 교육, 예방, 기록, 초기대응</strong>으로 구분함</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"업무를 묶어서 판단 표\"><table><thead><tr><th>묶음</th><th>법정 업무</th></tr></thead><tbody><tr><td>계획 및 조직</td><td><ul class=\"fire-grade-conditions\"><li>피난계획을 포함한 소방계획서 작성 및 시행</li><li>자위소방대 및 초기대응체계의 구성, 운영 및 교육</li></ul></td></tr><tr><td>시설</td><td><ul class=\"fire-grade-conditions\"><li>피난시설, 방화구획 및 방화시설 관리</li><li>소방시설이나 그 밖의 소방 관련 시설 관리</li></ul></td></tr><tr><td>교육 및 예방</td><td><ul class=\"fire-grade-conditions\"><li>소방훈련 및 교육</li><li>화기 취급 감독</li></ul></td></tr><tr><td>기록 및 대응</td><td><ul class=\"fire-grade-conditions\"><li>업무수행 기록 및 유지</li><li>화재 발생 시 초기대응</li><li>그 밖에 소방안전관리에 필요한 업무</li></ul></td></tr></tbody></table></div>\n<h2 id=\"관계인의-책임\">관계인의 책임</h2>\n<p>관계인은 <strong>소유자, 관리자 또는 점유자</strong>를 말함</p>\n<p>관계인은 소방안전관리자 선임과 시설 유지 등의 의무를 부담함<br>소방안전관리자를 선임해도 관계인의 법정 책임이 사라지는 것은 아님</p>\n<p>소방안전관리자는 소방시설, 피난시설, 방화시설 및 방화구획의 법령 위반을 발견하면 관계인에게 지체 없이 필요한 조치를 요구해야 함<br>관계인은 조치 요구를 지체 없이 이행해야 함</p>\n<p><strong>관계인이 시정하지 않으면 소방안전관리자는 소방본부장 또는 소방서장에게 그 사실을 알려야 함</strong><br>관계인은 조치 요구를 이유로 소방안전관리자를 해임하거나 보수 지급을 거부하는 등 불이익한 처우를 해서는 안 됨</p>\n<p>소방안전관리대상물이 아닌 특정소방대상물에도 관계인의 피난시설 및 방화시설 관리, 소방시설 관리, 화기 감독, 초기대응 등 의무가 있음<br>모든 건물에 소방계획서와 자위소방대 관련 의무가 동일하게 적용되는 것은 아님</p>\n<h2 id=\"선임-대상이-아닌-건물의-업무-범위\">선임 대상이 아닌 건물의 업무 범위</h2>\n<p>소방안전관리대상물이 아닌 특정소방대상물의 관계인에게도 시설 및 방화구획 관리, 화기 감독, 초기대응 의무가 있음</p>\n<p>다음 업무는 법 제24조제5항에 따라 소방안전관리대상물에만 적용함</p>\n<ul>\n<li>소방계획서 작성 및 시행</li>\n<li>자위소방대 및 초기대응체계의 구성, 운영 및 교육</li>\n<li>소방훈련 및 교육</li>\n<li>업무수행 기록 및 유지</li>\n</ul",
    "before": "·조직·시설·교육·예방·기록·초기대응</strong>으로 구분함</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"업무를 묶어서 판단 표\"><table><thead><tr><th>묶음</th><th>법정 업무</th></tr></thead><tbody><tr><td>계획·조직</td><td>피난계획을 포함한 소방계획서 작성·시행 · 자위소방대 및 초기대응체계 구성·운영·교육</td></tr><tr><td>시설</td><td>피난시설·방화구획·방화시설 관리 · 소방시설 및 관련 시설 관리</td></tr><tr><td>교육·예방</td><td>소방훈련·교육 · 화기 취급 감독</td></tr><tr><td>기록·대응</td><td>업무수행 기록·유지 · 화재 발생 시 초기대응 · 그 밖의 필요한 업무</td></tr></tbody></table></div>\n<h2 id=\"관계인의-책임\">관계인의 책임</h2>\n<p>관계인은 <strong>소유자·관리자·점유자</strong>를 말하며 선임·시설 유지 등에 대한 의무를 부담함 · 관리자를 선임했다고 관계인의 법정 책임이 사라지는 것은 아님</p>\n<p>관리자는 소방시설·피난시설·방화시설·방화구획의 법령 위반을 발견하면 관계인에게 필요한 조치를 요구 · 관계인은 지체 없이 이행해야 함</p>\n<p><strong>관계인이 시정하지 않으면 관리자는 소방본부장 또는 소방서장에게 그 사실을 알려야 함</strong> · 조치 요구를 이유로 관리자를 해임하거나 보수 지급을 거부하는 등 불이익 처우 금지</p>\n<p>소방안전관리대상물이 아닌 특정소방대상물에도 관계인의 피난·방화시설 관리, 소방시설 관리, 화기 감독, 초기대응 등 의무가 있음 · 모든 건물에 계획서·자위소방대 의무가 동일하게 적용된다고 읽지 않음</p>\n<h2 id=\"선임-대상이-아닌-건물의-업무-범위\">선임 대상이 아닌 건물의 업무 범위</h2>\n<p>소방안전관리대상물이 아닌 특정소방대상물의 관계인에게도 시설·방화구획 관리, 화기 감독, 초기대응 의무가 있음 · 다만 법 제24조제5항의 소방계획서, 자위소방대·초기대응체계 구성·운영·교육, 소방훈련·교육, 업무수행 기록·유지는 소방안전관리대상물에 적용되는 항목으로 구별</p"
  }
};
export function beforeFireRequirementsReadability(file,bytes){
  const row=fireRequirementsFiles[path.normalize(String(file))];
  if(!row||hash(bytes)===row.beforeSHA256)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact requirements readability revision');
  const text=bytes.toString('utf8');
  assert.equal(text.slice(row.at,row.at+row.current.length),row.current);
  const original=Buffer.from(text.slice(0,row.at)+row.before+text.slice(row.at+row.current.length));
  assert.equal(hash(original),row.beforeSHA256,String(file)+': all other chapter bytes preserved');
  return original;
}

// Restore only the exact user-approved shared reading stylesheet/reference delta.
// Native all-chapter checks independently protect current sources and articles.
const hierarchyEdits=JSON.parse(await nativeRead('docs/audits/2026-10-22-all-chapter-hierarchy/review.json','utf8')).changes;
export function beforeChapterHierarchy(file,bytes){
  bytes=beforeGlobalChapterReadability(file,bytes);
  bytes=beforeFireRequirementsReadability(file,bytes);
  const row=hierarchyEdits[path.normalize(String(file))];
  if(!row||hash(bytes)===row.beforeSHA256)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact shared hierarchy bytes');
  let source=bytes.toString('utf8');
  if(row.at!==undefined){
    assert.equal(source.slice(row.at),row.current);
    source=source.slice(0,row.at)+row.before;
  }else{
    assert.equal(source.split(row.current).length,2,String(file)+': one stylesheet reference');
    source=source.replace(row.current,row.before);
  }
  const original=Buffer.from(source);
  assert.equal(hash(original),row.beforeSHA256,String(file)+': exact pre-hierarchy bytes');
  return original;
}

export function beforeGradeCopyEdit(file,bytes){
  bytes=beforeChapterHierarchy(file,bytes);
 const row=gradeCopyEditFiles[path.normalize(String(file))];
 if(!row)return bytes;
 assert.equal(hash(bytes),row.sha256,String(file)+': exact approved grade copy edit');
 const text=bytes.toString('utf8');
 assert.equal(text.slice(row.at,row.at+row.current.length),row.current,'exact copy-edit delta');
 const before=Buffer.from(text.slice(0,row.at)+row.before+text.slice(row.at+row.current.length));
 assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-edit content');
 return before;
}
// Complete the FSM2-001 boundaries through practice and related chapters.
// Restore only exact reviewed footer CSS/link bytes before previous releases.
const gradeFooterFiles = {
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/management-target-grades.md": {
    "sha256": "cbe3d626b853e00f8f8a193cf71d2f3466eecde505f5085ea062354ff5d013c1",
    "beforeSHA256": "99fc973c7845f85b91d6311226398f5d94af2eb446d2f5db7a4fef180d6d068a",
    "at": 366,
    "current": "footer",
    "before": "hierarchy"
  },
  "public/styles/fire-bulk-visual.css": {
    "sha256": "d5e4fb64fe48fcf5a518b0110162bcdaf469b52e106bc83da09a6f3cf62b7aa3",
    "beforeSHA256": "9bae3240da1af7de0c9007e235fef1f0c4ca96b7f28428a4e6c18839c9564cc3",
    "at": 4656,
    "current": "\n/* Continue the FSM2-001 section rhythm through practice and related chapters. */\narticle:has(>.fire-grade-lesson){--grade-section-gap:48px;--grade-section-half-gap:24px}\narticle:has(>.fire-grade-lesson)>.adfit-placement{margin-bottom:0}\narticle:has(>.fire-grade-lesson)>[data-fire-practice-entry]{margin-top:var(--grade-section-half-gap);padding-top:calc(var(--grade-section-half-gap) - 1px);border-top:1px solid var(--gray-200)}\narticle:has(>.fire-grade-lesson)>[data-fire-practice-entry]>h2{margin:0 0 16px}\narticle:has(>.fire-grade-lesson)>[data-fire-practice-entry]>.fire-actions{margin-top:0}\narticle:has(>.fire-grade-lesson)>h2:has(+.related-list){margin:var(--grade-section-gap) 0 16px}\narticle:has(>.fire-grade-lesson)>h2:has(+.related-list)::after{content:'';position:absolute;left:0;right:0;top:calc(0px - var(--grade-section-half-gap));height:1px;background:var(--gray-200)}\narticle:has(>.fire-grade-lesson)>.related-list{margin:0}\n@media(max-width:767px){article:has(>.fire-grade-lesson){--grade-section-gap:32px;--grade-section-half-gap:16px}}\n",
    "before": ""
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/management-target-grades/index.html": {
    "sha256": "7500ac1c475513c0bc0b2cfa214454c3f5a06fdf74308899900539040a9ad5c7",
    "beforeSHA256": "f58427f64f96cf46d1876603dba8a1eb965025782e650aa0eb7571892cb3ab3a",
    "at": 21822,
    "current": "footer",
    "before": "hierarchy"
  },
  "dist/styles/fire-bulk-visual.css": {
    "sha256": "d5e4fb64fe48fcf5a518b0110162bcdaf469b52e106bc83da09a6f3cf62b7aa3",
    "beforeSHA256": "9bae3240da1af7de0c9007e235fef1f0c4ca96b7f28428a4e6c18839c9564cc3",
    "at": 4656,
    "current": "\n/* Continue the FSM2-001 section rhythm through practice and related chapters. */\narticle:has(>.fire-grade-lesson){--grade-section-gap:48px;--grade-section-half-gap:24px}\narticle:has(>.fire-grade-lesson)>.adfit-placement{margin-bottom:0}\narticle:has(>.fire-grade-lesson)>[data-fire-practice-entry]{margin-top:var(--grade-section-half-gap);padding-top:calc(var(--grade-section-half-gap) - 1px);border-top:1px solid var(--gray-200)}\narticle:has(>.fire-grade-lesson)>[data-fire-practice-entry]>h2{margin:0 0 16px}\narticle:has(>.fire-grade-lesson)>[data-fire-practice-entry]>.fire-actions{margin-top:0}\narticle:has(>.fire-grade-lesson)>h2:has(+.related-list){margin:var(--grade-section-gap) 0 16px}\narticle:has(>.fire-grade-lesson)>h2:has(+.related-list)::after{content:'';position:absolute;left:0;right:0;top:calc(0px - var(--grade-section-half-gap));height:1px;background:var(--gray-200)}\narticle:has(>.fire-grade-lesson)>.related-list{margin:0}\n@media(max-width:767px){article:has(>.fire-grade-lesson){--grade-section-gap:32px;--grade-section-half-gap:16px}}\n",
    "before": ""
  }
};
export function beforeGradeFooter(file,bytes){
  bytes=beforeGradeCopyEdit(file,bytes);
  const row=gradeFooterFiles[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact single-chapter footer boundaries');
  const text=bytes.toString('utf8');
  assert.equal(text.slice(row.at,row.at+row.current.length),row.current,'exact footer delta');
  const before=Buffer.from(text.slice(0,row.at)+row.before+text.slice(row.at+row.current.length));
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-footer document');
  return before;
}
// Layout-only FSM2-001 trial: restore the exact previously reviewed source,
// shared CSS and single HTML page. No other chapter may use these new rules.
const gradeHierarchyFiles = {
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/management-target-grades.md": {
    "sha256": "99fc973c7845f85b91d6311226398f5d94af2eb446d2f5db7a4fef180d6d068a",
    "beforeSHA256": "720281f8ffb60da5808abf2ac94fd17045f26f711e340363289ebc4a4affa2e4",
    "at": 366,
    "current": "hierarchy-20261022\">\n\n<div class=\"fire-grade-lesson\">\n<section class=\"fire-grade-section\" aria-labelledby=\"등급을-판별하는-순서\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n\n</section>\n<section class=\"fire-grade-section\" aria-labelledby=\"시험-포인트\">\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div>\n\n</section>\n\n<p class=\"fire-source-note\">적용 기준 · <a href=\"https://www.law.go.kr/LSW/lsInfoR.do?lsiSeq=287389&amp;efYd=20260701&amp;efYn=Y&amp;nwJoYnInfo=Y&amp;chrClsCd=010202&amp;ancYnChk=0\" target=\"_blank\" rel=\"noopener\">화재예방법 시행령</a> · 2026-10-14 확인</p>\n</div",
    "before": "20261022\">\n\n## 등급을 판별하는 순서\n용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 **가장 높은 등급** 적용\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n\n## 시험 포인트\n\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div>\n\n<p class=\"fire-source-note\">적용 기준 · <a href=\"https://www.law.go.kr/LSW/lsInfoR.do?lsiSeq=287389&amp;efYd=20260701&amp;efYn=Y&amp;nwJoYnInfo=Y&amp;chrClsCd=010202&amp;ancYnChk=0\" target=\"_blank\" rel=\"noopener\">화재예방법 시행령</a> · 2026-10-14 확인</p"
  },
  "public/styles/fire-bulk-visual.css": {
    "sha256": "9bae3240da1af7de0c9007e235fef1f0c4ca96b7f28428a4e6c18839c9564cc3",
    "beforeSHA256": "23756959cc8aaf174348482f97a06500e251fd98bbcd2219deb408e793745769",
    "at": 3188,
    "current": "\n/* FSM2-001 trial: section hierarchy and relationship-based vertical spacing. */\narticle .fire-grade-lesson{--grade-section-half-gap:24px;display:grid;grid-template-columns:minmax(0,1fr);min-width:0}\narticle .fire-grade-lesson .fire-grade-section{display:flex;flex-direction:column;min-width:0}\narticle .fire-grade-lesson .fire-grade-section+.fire-grade-section{margin-top:var(--grade-section-half-gap);padding-top:calc(var(--grade-section-half-gap) - 1px);border-top:1px solid var(--gray-200)}\narticle .fire-grade-lesson .fire-grade-section>h2{margin:0 0 16px}\narticle .fire-grade-lesson p{margin:0;line-height:1.7}\narticle .fire-grade-lesson .sample-table-scroll{margin-top:16px}\narticle .fire-grade-lesson table{margin:0;font-size:14px}\narticle .fire-grade-lesson .fire-grade-scope-note{margin-top:8px;color:var(--gray-600);font-size:var(--fs-caption);line-height:1.6}\narticle .fire-grade-lesson .fire-grade-exam-points{padding:24px}\narticle .fire-grade-lesson .fire-grade-exam-points li+li{margin-top:16px;padding-top:15px}\narticle .fire-grade-lesson .fire-grade-exam-points strong{display:block}\narticle .fire-grade-lesson .fire-grade-exam-points p{margin-top:8px;color:var(--gray-800)}\narticle .fire-grade-lesson>.fire-source-note{margin-top:24px;font-size:var(--fs-caption);color:var(--gray-600);line-height:1.6}\n@media(max-width:767px){article .fire-grade-lesson{--grade-section-half-gap:16px}article .fire-grade-lesson .fire-grade-exam-points{padding:16px}}\n",
    "before": ""
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/management-target-grades/index.html": {
    "sha256": "f58427f64f96cf46d1876603dba8a1eb965025782e650aa0eb7571892cb3ab3a",
    "beforeSHA256": "dad443251af3a2a6eef04d81e0aa5a115961a745907dd1b3e5df88b224ab66fb",
    "at": 21822,
    "current": "hierarchy-20261022\">\n<div class=\"fire-grade-lesson\">\n<section class=\"fire-grade-section\" aria-labelledby=\"등급을-판별하는-순서\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n</section>\n<section class=\"fire-grade-section\" aria-labelledby=\"시험-포인트\">\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div>\n</section>\n<p class=\"fire-source-note\">적용 기준 · <a href=\"https://www.law.go.kr/LSW/lsInfoR.do?lsiSeq=287389&#x26;efYd=20260701&#x26;efYn=Y&#x26;nwJoYnInfo=Y&#x26;chrClsCd=010202&#x26;ancYnChk=0\" target=\"_blank\" rel=\"noopener\">화재예방법 시행령</a> · 2026-10-14 확인</p>\n</div",
    "before": "20261022\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div>\n<p class=\"fire-source-note\">적용 기준 · <a href=\"https://www.law.go.kr/LSW/lsInfoR.do?lsiSeq=287389&#x26;efYd=20260701&#x26;efYn=Y&#x26;nwJoYnInfo=Y&#x26;chrClsCd=010202&#x26;ancYnChk=0\" target=\"_blank\" rel=\"noopener\">화재예방법 시행령</a> · 2026-10-14 확인</p"
  },
  "dist/styles/fire-bulk-visual.css": {
    "sha256": "9bae3240da1af7de0c9007e235fef1f0c4ca96b7f28428a4e6c18839c9564cc3",
    "beforeSHA256": "23756959cc8aaf174348482f97a06500e251fd98bbcd2219deb408e793745769",
    "at": 3188,
    "current": "\n/* FSM2-001 trial: section hierarchy and relationship-based vertical spacing. */\narticle .fire-grade-lesson{--grade-section-half-gap:24px;display:grid;grid-template-columns:minmax(0,1fr);min-width:0}\narticle .fire-grade-lesson .fire-grade-section{display:flex;flex-direction:column;min-width:0}\narticle .fire-grade-lesson .fire-grade-section+.fire-grade-section{margin-top:var(--grade-section-half-gap);padding-top:calc(var(--grade-section-half-gap) - 1px);border-top:1px solid var(--gray-200)}\narticle .fire-grade-lesson .fire-grade-section>h2{margin:0 0 16px}\narticle .fire-grade-lesson p{margin:0;line-height:1.7}\narticle .fire-grade-lesson .sample-table-scroll{margin-top:16px}\narticle .fire-grade-lesson table{margin:0;font-size:14px}\narticle .fire-grade-lesson .fire-grade-scope-note{margin-top:8px;color:var(--gray-600);font-size:var(--fs-caption);line-height:1.6}\narticle .fire-grade-lesson .fire-grade-exam-points{padding:24px}\narticle .fire-grade-lesson .fire-grade-exam-points li+li{margin-top:16px;padding-top:15px}\narticle .fire-grade-lesson .fire-grade-exam-points strong{display:block}\narticle .fire-grade-lesson .fire-grade-exam-points p{margin-top:8px;color:var(--gray-800)}\narticle .fire-grade-lesson>.fire-source-note{margin-top:24px;font-size:var(--fs-caption);color:var(--gray-600);line-height:1.6}\n@media(max-width:767px){article .fire-grade-lesson{--grade-section-half-gap:16px}article .fire-grade-lesson .fire-grade-exam-points{padding:16px}}\n",
    "before": ""
  }
};
export function beforeGradeHierarchy(file,bytes){
  bytes=beforeGradeFooter(file,bytes);
  const row=gradeHierarchyFiles[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact single-chapter hierarchy');
  const text=bytes.toString('utf8');
  assert.equal(text.slice(row.at,row.at+row.current.length),row.current,'exact hierarchy delta');
  const before=Buffer.from(text.slice(0,row.at)+row.before+text.slice(row.at+row.current.length));
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-hierarchy document');
  return before;
}
// Source-grounded exam-point revision, limited to one chapter and its scoped CSS.
// Pin native and restored full bytes; retain every previous historical baseline.
const gradeExamPointFiles = {
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/management-target-grades.md": {
    "sha256": "720281f8ffb60da5808abf2ac94fd17045f26f711e340363289ebc4a4affa2e4",
    "beforeSHA256": "486522ab372d0b135e8bed5bd185a2320c83b6dfa4443a81904fc173fa409e4c",
    "at": 352,
    "current": "?v=fire-grade-20261022\">\n\n## 등급을 판별하는 순서\n용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 **가장 높은 등급** 적용\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n\n## 시험 포인트\n\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div>",
    "before": "\">\n\n## 등급을 판별하는 순서\n용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 **가장 높은 등급** 적용\n\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td>아파트 50층 이상 또는 높이 200m 이상<br>아파트 외 30층 이상 또는 120m 이상<br>아파트 외 연면적 10만㎡ 이상</td></tr><tr><td>1급</td><td>특급 제외<br>아파트 30층 이상 또는 120m 이상<br>아파트 외 연면적 1만5천㎡ 이상 또는 지상 11층 이상<br>가연성가스 1천t 이상</td></tr><tr><td>2급</td><td>상위 등급 제외<br>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)<br>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만<br>지하구 등</td></tr><tr><td>3급</td><td>상위 등급 제외<br>간이스프링클러 또는 자동화재탐지설비 설치 대상</td></tr></tbody></table></div>\n\n## 조건에 붙는 단서\n- 특급의 아파트 외 **30층은 지하층 포함** · 1급의 11층은 지상층 기준\n- 면적 기준에서 아파트 제외 여부를 먼저 확인 · 1급의 연면적 기준은 아파트·연립주택 제외 · 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급에서 제외\n- 주택전용 간이스프링클러는 3급 판정의 간이스프링클러에서 제외\n- 국보·보물로 지정된 목조건축물도 2급 대상 조건에 포함\n\n예: 비아파트 건축물이 지상 12층이고 연면적 8천㎡이면 지상층 조건으로 1급 판단 · 비아파트 30층 조건을 1급으로 읽지 않음"
  },
  "public/styles/fire-bulk-visual.css": {
    "sha256": "23756959cc8aaf174348482f97a06500e251fd98bbcd2219deb408e793745769",
    "beforeSHA256": "687669282e6b99ad2a7f13f121c9f390df0bfbe13a41c2daecb6d21d90a4a08f",
    "at": 2143,
    "current": "\narticle ul.fire-grade-conditions{margin:0;padding-left:1em;list-style-type:disc}\narticle ul.fire-grade-conditions>li{padding-left:.1em;margin:0;font-size:inherit;color:inherit}\narticle ul.fire-grade-conditions>li+li{margin-top:.4em}\narticle ul.fire-grade-conditions>li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-scope-note{font-size:var(--fs-caption);color:var(--gray-700);line-height:1.7}\narticle .fire-grade-exam-points{padding:18px 20px;border:1px solid var(--gray-200);border-radius:var(--radius-md);background:var(--gray-50)}\narticle .fire-grade-exam-points ul{margin:0;padding-left:1em;list-style-type:disc}\narticle .fire-grade-exam-points li{margin:0;padding-left:.15em}\narticle .fire-grade-exam-points li+li{margin-top:16px;padding-top:16px;border-top:1px solid var(--gray-200)}\narticle .fire-grade-exam-points li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-exam-points strong{color:var(--gray-900)}\narticle .fire-grade-exam-points p{margin:6px 0 0;color:var(--gray-700);line-height:1.75}\n",
    "before": ""
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/management-target-grades/index.html": {
    "sha256": "dad443251af3a2a6eef04d81e0aa5a115961a745907dd1b3e5df88b224ab66fb",
    "beforeSHA256": "b9b4c69b4b72d0a01dc0612b91adffc29c47f07673ddb8539c2fc45f7e4072dd",
    "at": 21808,
    "current": "?v=fire-grade-20261022\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td><ul class=\"fire-grade-conditions\"><li>아파트 지상 50층 이상 또는 높이 200m 이상</li><li>아파트 외 30층 이상(지하층 포함) 또는 높이 120m 이상</li><li>아파트 외 연면적 10만㎡ 이상</li></ul></td></tr><tr><td>1급</td><td><ul class=\"fire-grade-conditions\"><li>특급 제외</li><li>아파트 지상 30층 이상 또는 높이 120m 이상</li><li>연면적 1만5천㎡ 이상(아파트·연립주택 제외) 또는 지상 11층 이상(아파트 제외)</li><li>가연성가스 1천t 이상</li></ul></td></tr><tr><td>2급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)</li><li>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만</li><li>지하구, 국보·보물로 지정된 목조건축물 등</li></ul></td></tr><tr><td>3급</td><td><ul class=\"fire-grade-conditions\"><li>상위 등급 제외</li><li>간이스프링클러(주택전용 제외) 또는 자동화재탐지설비 설치 대상</li></ul></td></tr></tbody></table></div>\n<p class=\"fire-grade-scope-note\">※ 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급 대상에서 제외함</p>\n<h2 id=\"시험-포인트\">시험 포인트</h2>\n<div class=\"fire-grade-exam-points\">\n<ul>\n<li><strong>층수는 용도별로 구분</strong><p>아파트의 50층·30층 기준은 지하층을 제외함 · 비아파트 특급의 30층은 지하층을 포함하지만, 1급의 11층은 지상층만 셈</p></li>\n<li><strong>지하층을 더해 1급으로 판단하지 않음</strong><p>판매시설이 지상 9층·지하 2층, 연면적 12,800㎡이고 옥내소화전·스프링클러의 법정 설치대상이면 2급임(다른 상위 등급 조건이 없는 경우)</p></li>\n<li><strong>설비가 여러 개면 상위 등급부터 확인</strong><p>옥내소화전·스프링클러 설치대상은 2급 조건임 · 자동화재탐지설비도 함께 있다고 3급으로 판단하지 않음 · 상위 등급 조건 없이 자동화재탐지설비만 설치대상이라면 3급임</p></li>\n<li><strong>가스 저장량은 1천t을 경계로 구분</strong><p>가연성가스 400t·500t은 2급 구간인 100t 이상 1천t 미만에 해당함 · 1천t 이상이면 1급 조건임</p></li>\n<li><strong>면적과 별도 대상을 함께 확인</strong><p>비아파트의 연면적 기준은 특급 10만㎡·1급 1만5천㎡임 · 지상 11층 기준은 아파트에 적용하지 않음 · 지하구와 국보·보물로 지정된 목조건축물은 2급 조건임</p></li>\n</ul>\n</div",
    "before": "\">\n<h2 id=\"등급을-판별하는-순서\">등급을 판별하는 순서</h2>\n<p>용도 → 층수·높이·연면적 → 설치해야 하는 소방시설 순서로 확인함 · 여러 등급 조건에 해당하면 <strong>가장 높은 등급</strong> 적용</p>\n<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td>아파트 50층 이상 또는 높이 200m 이상<br>아파트 외 30층 이상 또는 120m 이상<br>아파트 외 연면적 10만㎡ 이상</td></tr><tr><td>1급</td><td>특급 제외<br>아파트 30층 이상 또는 120m 이상<br>아파트 외 연면적 1만5천㎡ 이상 또는 지상 11층 이상<br>가연성가스 1천t 이상</td></tr><tr><td>2급</td><td>상위 등급 제외<br>옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외)<br>도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만<br>지하구 등</td></tr><tr><td>3급</td><td>상위 등급 제외<br>간이스프링클러 또는 자동화재탐지설비 설치 대상</td></tr></tbody></table></div>\n<h2 id=\"조건에-붙는-단서\">조건에 붙는 단서</h2>\n<ul>\n<li>특급의 아파트 외 <strong>30층은 지하층 포함</strong> · 1급의 11층은 지상층 기준</li>\n<li>면적 기준에서 아파트 제외 여부를 먼저 확인 · 1급의 연면적 기준은 아파트·연립주택 제외 · 동·식물원, 불연성 물품만 저장·취급하는 창고, 위험물 제조소등, 지하구는 특급·1급에서 제외</li>\n<li>주택전용 간이스프링클러는 3급 판정의 간이스프링클러에서 제외</li>\n<li>국보·보물로 지정된 목조건축물도 2급 대상 조건에 포함</li>\n</ul>\n<p>예: 비아파트 건축물이 지상 12층이고 연면적 8천㎡이면 지상층 조건으로 1급 판단 · 비아파트 30층 조건을 1급으로 읽지 않음</p"
  },
  "dist/styles/fire-bulk-visual.css": {
    "sha256": "23756959cc8aaf174348482f97a06500e251fd98bbcd2219deb408e793745769",
    "beforeSHA256": "687669282e6b99ad2a7f13f121c9f390df0bfbe13a41c2daecb6d21d90a4a08f",
    "at": 2143,
    "current": "\narticle ul.fire-grade-conditions{margin:0;padding-left:1em;list-style-type:disc}\narticle ul.fire-grade-conditions>li{padding-left:.1em;margin:0;font-size:inherit;color:inherit}\narticle ul.fire-grade-conditions>li+li{margin-top:.4em}\narticle ul.fire-grade-conditions>li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-scope-note{font-size:var(--fs-caption);color:var(--gray-700);line-height:1.7}\narticle .fire-grade-exam-points{padding:18px 20px;border:1px solid var(--gray-200);border-radius:var(--radius-md);background:var(--gray-50)}\narticle .fire-grade-exam-points ul{margin:0;padding-left:1em;list-style-type:disc}\narticle .fire-grade-exam-points li{margin:0;padding-left:.15em}\narticle .fire-grade-exam-points li+li{margin-top:16px;padding-top:16px;border-top:1px solid var(--gray-200)}\narticle .fire-grade-exam-points li::marker{font-size:.65em;color:var(--gray-600)}\narticle .fire-grade-exam-points strong{color:var(--gray-900)}\narticle .fire-grade-exam-points p{margin:6px 0 0;color:var(--gray-700);line-height:1.75}\n",
    "before": ""
  }
};
export function beforeGradeExamPoints(file,bytes){
  bytes=beforeGradeHierarchy(file,bytes);
  const row=gradeExamPointFiles[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact source-grounded exam-point revision');
  const text=bytes.toString('utf8');
  assert.equal(text.slice(row.at,row.at+row.current.length),row.current,'exact exam-point delta');
  const before=Buffer.from(text.slice(0,row.at)+row.before+text.slice(row.at+row.current.length));
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-exam-point document');
  return before;
}
// This layout-only revision changes nine separators to line breaks in one
// grade table. Both complete native files and restored files are fingerprinted.
const gradeTableBefore = "<div class=\"sample-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"등급을 판별하는 순서 표\"><table><thead><tr><th>등급</th><th>대표적인 대상 조건</th></tr></thead><tbody><tr><td>특급</td><td>아파트 50층 이상 또는 높이 200m 이상 · 아파트 외 30층 이상 또는 120m 이상 · 아파트 외 연면적 10만㎡ 이상</td></tr><tr><td>1급</td><td>특급 제외 · 아파트 30층 이상 또는 120m 이상 · 아파트 외 연면적 1만5천㎡ 이상 또는 지상 11층 이상 · 가연성가스 1천t 이상</td></tr><tr><td>2급</td><td>상위 등급 제외 · 옥내소화전·스프링클러·물분무등소화설비 설치 대상(호스릴 방식만 설치할 수 있는 경우 제외) · 도시가스사업 허가 대상 가스 제조설비 또는 가연성가스 100t 이상 1천t 미만 · 지하구 등</td></tr><tr><td>3급</td><td>상위 등급 제외 · 간이스프링클러 또는 자동화재탐지설비 설치 대상</td></tr></tbody></table></div>";
const gradeTableCurrent = gradeTableBefore.replaceAll(' · ','<br>');
const gradeTableFiles = {
  "src/content/chapters/fire-safety-manager-level2/fire-safety-theory/management-target-grades.md": {
    "sha256": "486522ab372d0b135e8bed5bd185a2320c83b6dfa4443a81904fc173fa409e4c",
    "beforeSHA256": "d0254349f42445b1f8572c34ab3022e76de72302c96a33fc30262d97f6fd2570"
  },
  "dist/fire-safety-manager-level2/written/fire-safety-theory/management-target-grades/index.html": {
    "sha256": "b9b4c69b4b72d0a01dc0612b91adffc29c47f07673ddb8539c2fc45f7e4072dd",
    "beforeSHA256": "7999e5b35f0f7957cfccfeaffacf3260ecdd5d985a30726d8e29ce2573b938ab"
  }
};
export function beforeGradeTableFormatting(file,bytes){
  bytes=beforeGradeExamPoints(file,bytes);
  const row=gradeTableFiles[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact grade table formatting');
  const text=bytes.toString('utf8');
  assert.equal(text.split(gradeTableCurrent).length,2,'exactly one formatted grade table');
  const before=Buffer.from(text.replace(gradeTableCurrent,gradeTableBefore));
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-formatting text and document');
  return before;
}
// Fingerprinted UI deltas are reversed before archived source/HTML checks.
// Every current and restored document must match its complete SHA, so unrelated
// edits cannot disappear behind a structural regex or a changed baseline.
export function beforeQuestionFlow(file,bytes){
  bytes=beforeGradeTableFormatting(file,bytes);
  // Remove only the stale preparation notice; preserve archived config hashes.
  if(path.normalize(String(file))==='src/config/certifications.ts'){
    assert.equal(hash(bytes),'8c3cdee1b7bdf3bfe37c03a9bf4586875d82676bb385ffb2b46aedb98e6def07','exact fire notice removal');
    const before=Buffer.from(bytes.toString('utf8').replace("releaseNotice: '이론·실무 74개 챕터',","releaseNotice: '이론·실무 74개 챕터 · 문제풀이는 준비 중',"));
    assert.equal(hash(before),'b0db03f073cb9cecf096cbe8544dae1cadbc995faaf66a20e96b93b1fed66ed5','exact pre-notice config');
    return before;
  }
  bytes=beforeStandardizedPractice(file,bytes);
  const row=release.questionFlowProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact question flow UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-question flow document');
  return before;
}
export function beforePracticePolish(file,bytes){
  bytes=beforeQuestionFlow(file,bytes);
  const row=release.practicePolishProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact practice polish UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-practice polish document');
  return before;
}
export function beforeReview(file,bytes){
  bytes=beforePracticePolish(file,bytes);
  const row=release.reviewProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact readability UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-readability document');
  return before;
}
export function beforePopup(file,bytes){
  bytes=beforeReview(file,bytes);
  const row=release.popupProjections?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.sha256,String(file)+': exact popup UI document');
  let text=bytes.toString('utf8');
  for(const patch of [...row.patches].reverse()){
    assert.equal(text.slice(patch.at,patch.at+patch.current.length),patch.current,String(file)+': exact UI delta');
    text=text.slice(0,patch.at)+patch.before+text.slice(patch.at+patch.current.length);
  }
  const before=Buffer.from(text);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-popup document');
  return before;
}
// Publishing changes only the entry's count. Check both full documents, then
// restore that one exact label for archived lessons; unknown mutations fail.
export function beforePublishedChapterCount(file,bytes){
  bytes=beforePopup(file,bytes);
  const row=release.publicationEntryCounts?.[path.normalize(String(file))];
  if(!row)return bytes;
  assert.equal(hash(bytes),row.publishedSHA256,String(file)+': exact published chapter document');
  const html=bytes.toString('utf8');
  const projected=html.replace(/<section\b[^>]*data-fire-practice-entry[\s\S]*?<\/section>/,section=>{
    const label=new RegExp('(<small[^>]*>)'+row.count+'문제(<\\/small>)');
    assert(label.test(section),String(file)+': actual chapter count');
    return section.replace(label,'$1문제 준비 중$2');
  });
  const before=Buffer.from(projected);
  assert.equal(hash(before),row.beforeSHA256,String(file)+': exact pre-publication document');
  return before;
}
export async function readdir(dir,options){
  const entries=await nativeReaddir(dir,options);
  const result=[];
  for(const entry of entries){
    const name=typeof entry==='string'?entry:entry.name;
    if(isReadabilityAddition(path.join(String(dir),name)))continue;
    const row=release.files.find(r=>r.added&&r.path===path.join(String(dir),name));
    if(row)assert.equal(hash(await nativeRead(row.path)),row.sha256,row.path+': exact integrated main addition');
    else result.push(entry);
  }
  return result;
}
export async function readFile(file,encoding){
  let bytes=beforePublishedChapterCount(file,await nativeRead(file));
  const row=release.files.find(r=>r.path===path.normalize(String(file)));
  if(row){
    assert.equal(hash(bytes),row.sha256,String(file)+': exact current persona correction');
    if(row.originalFile){
      bytes=await nativeRead(row.originalFile);
      assert.equal(hash(bytes),row.originalSha256,String(file)+': exact historical input');
    }
  }
  return encoding?bytes.toString(encoding):bytes;
}
