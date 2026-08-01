from __future__ import annotations

from pathlib import Path
import json
import re
import sys

REPO_ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path('.').resolve()
CHAPTER_ROOT = REPO_ROOT / 'src' / 'content' / 'chapters'
QUESTIONS_PATH = REPO_ROOT / 'src' / 'data' / 'questions.json'

ID_PATTERN = re.compile(r'`?(?P<id>\d{8}_\d{3})`?(?P<particle>은|는|이|가|을|를|과|와|의|에서|처럼|으로|로|도|만)?')
ALIAS_PATTERN = re.compile(r'`?q\d{8}`?', re.I)
BROKEN_STRONG = re.compile(r'(?<!\*)\*\*(?=[^\s*|:;,.!?])([^*\n|]{1,240}?[^\s*|])\*\*(?=[가-힣A-Za-z0-9])')
BROKEN_UNDERLINE_STRONG = re.compile(r'(?<!_)__(?=[^\s_|:;,.!?])([^_\n|]{1,240}?[^\s_|])__(?=[가-힣A-Za-z0-9])')
SLUG_CODE = re.compile(r'`([^`\n]+)`')

SLUG_DISPLAY_OVERRIDES = {
    'point-source-illuminance': '점광원 조도',
    'workplace-illuminance-standard': '작업면 조도 기준',
    'construction-illuminance': '건설작업장 조도 기준',
}

# Exact source lines that expose implementation/review state. Keep these user-facing and factual.
EXACT_LINE_REPLACEMENTS: dict[str, dict[str, str]] = {
    'chemical/combustion-range-risk.md': {
        '4. 이미지 표가 필요한 문항은 `jpg 확필` 상태를 유지한 채 개념만 연결한다.':
            '4. 이미지·표를 확인해야 하는 문항은 시각 자료가 준비된 경우에만 학습 문제로 제공한다.',
    },
    'chemical/acetylene-properties.md': {
        '`20210307_083`, `20200606_087`, `20200822_092`는 아세톤 용해 또는 용매를, `20190804_092`는 용해 아세틸렌 용기의 취급 조건을 확인한다. 이 챕터는 문제에 제시된 기준을 정리하며, 별도의 최신 법령 수치로 확장하지 않는다.':
            '2021년 3월 시험 83번, 2020년 6월 시험 87번, 2020년 8월 시험 92번은 아세톤 용해 또는 용매를, 2019년 8월 시험 92번은 용해 아세틸렌 용기의 취급 조건을 확인한다. 관련 기준과 수치는 문제에 제시된 조건을 기준으로 판단한다.',
    },
    'chemical/extinguisher-effects.md': {
        '- 메타인산이 언급되면 인산암모늄 계열 분말과 연결한다. 이는 q20200606의 정답 선택지를 판단하는 근거다.':
            '- 메타인산이 언급되면 인산암모늄 계열 분말과 연결한다. 이는 메타인산과 제3종 분말소화약제를 연결하는 판단 근거다.',
    },
    'electrical/ventricular-fibrillation-current.md': {
        '기존 `20220305_078` 관계는 저장소의 역사적 매핑을 보존한 것이다. 해당 문항이 에너지 개념으로 판단될 경우 후속 관계 정리에서 별도 검토한다.':
            '2022년 3월 시험 78번은 심실세동 위험한계 전류와 전기에너지 계산을 구분해 확인하는 문제다.',
    },
    'ergonomics/msd-risk-factors.md': {
        '`20220424_032`는 OWAS의 평가요소를 묻는 이미지·표 기반 문항이며 `review: "jpg 확필"`을 유지한다. `20220424_023`, `20220424_038`은 기존 관계를 보존하되 이 챕터에서 새로 확정하는 5종 분류의 직접 근거로 확대하지 않는다.':
            '2022년 4월 시험 32번은 OWAS의 평가요소를 이미지·표와 함께 구분하는 문제다. 같은 회차의 다른 문항은 작업 자세와 근골격계 부담요인을 문맥에 따라 판단한다.',
        '- 이미지·표 문항은 개념 매핑과 공개 렌더링 가능 여부를 분리한다.':
            '- 이미지·표를 확인해야 하는 문항은 시각 자료가 준비된 경우에만 학습 문제로 제공한다.',
    },
    'safety-management/protective-equipment-types.md': {
        '`20220424_003`의 자율안전확인 보호구 표시 문제는 이미지 자산이 필요한 문항이므로 `review: "jpg 확필"`을 유지한다. 공개 페이지에서는 안전 필터가 이 문항을 계속 제외한다.':
            '2022년 4월 시험 3번은 자율안전확인 보호구의 표시를 이미지로 구분하는 문제다. 시각 자료가 준비된 경우에만 학습 문제로 제공한다.',
    },
    'safety-management/safety-manager-appointment.md': {
        '`20180304_006`은 지방고용노동관서의 장이 안전관리자·보건관리자 등을 증원하거나 교체하도록 명할 수 있는 기준을 묻는 문항이다. 이 문항은 이미지 자산이 필요하므로 `review: "jpg 확필"`을 유지하고 공개 화면에서는 제외한다.':
            '2018년 3월 시험 6번은 지방고용노동관서의 장이 안전관리자·보건관리자 등의 증원 또는 교체를 명할 수 있는 기준을 묻는다. 시각 자료가 필요한 경우에는 자료가 준비된 뒤 학습 문제로 제공한다.',
    },
    'safety-management/safety-signs.md': {
        '`20220424_014`, `20210515_012`, `20180304_017`은 기본 모형을, `20210515_003`, `20200822_012`, `20200926_009`, `20180304_015`, `20180819_011`은 색채 또는 색도 기준을 묻는다. `20220305_014`와 `20180428_007`은 그림 또는 이미지 기반 문항이므로 `jpg 확필` 상태를 유지한다.':
            '2022년 4월·2021년 5월·2018년 3월 시험에서는 안전표지의 기본 모형을, 다른 기출에서는 색채 또는 색도 기준을 반복해 묻는다. 그림을 확인해야 하는 문항은 시각 자료가 준비된 경우에만 학습 문제로 제공한다.',
        '- 이미지가 필요한 문항은 개념 관계와 공개 렌더링 가능 여부를 별도로 판단한다.':
            '- 이미지가 필요한 문항은 시각 자료를 확인한 뒤 표지 유형과 적용 상황을 판단한다.',
    },
    'electrical/body-current.md': {
        '`20180819_070`의 정답은 충전부에서 인체가 자력으로 이탈할 수 있는 전류다. 이는 Let-go current의 정의이며, 기존 `body-current-effect`의 생리적 영향표와는 다른 학습 범위다.':
            '2018년 8월 시험 70번의 정답은 충전부에서 인체가 자력으로 이탈할 수 있는 전류다. 이는 Let-go current의 정의이며, 전류 크기별 생리적 영향과 구분한다.',
    },
    'ergonomics/quantitative-assessment-items.md': {
        '정성적 평가는 위험요인과 원인을 식별·분류하고, 정량적 평가는 빈도·피해·확률·등급처럼 수치화된 결과를 비교한다. 두 단계의 순서와 전체 재평가는 `safety-assessment-basic-principles`의 범위이며, 이 챕터는 연결 기출의 항목과 수치 해석에 한정한다.':
            '정성적 평가는 위험요인과 원인을 식별·분류하고, 정량적 평가는 빈도·피해·확률·등급처럼 수치화된 결과를 비교한다. 평가 순서와 재평가 원칙은 안전성 평가 기본원칙과 함께 구분한다.',
    },
    'ergonomics/swain-human-error.md': {
        '`20220424_022`의 실수·착오·위반 구분과 `20220305_040`의 James Reason 분류는 현재 챕터에 이미 연결된 인접 개념이다. 이 챕터는 이를 삭제하거나 재분류하지 않고, Swain의 작업 수행 오류 유형과 비교하는 데 사용한다. THERP는 인간실수확률을 정량화하는 기법이고 FMEA·FTA·ETA는 다른 분석 목적을 가지므로 이 챕터의 분류와 동일시하지 않는다.':
            '2022년 4월 시험 22번의 실수·착오·위반 구분과 2022년 3월 시험 40번의 James Reason 분류는 Swain의 작업 수행 오류 유형과 비교해 판단한다. THERP는 인간실수확률을 정량화하는 기법이고 FMEA·FTA·ETA는 분석 목적이 다르므로 같은 분류로 보지 않는다.',
    },
    'mechanical/equipment-safety-three.md': {
        '이 챕터는 세 분류의 구분만 다룬다. 특정 기계의 개별 방호장치 목록이나 `machine-safety-six`의 6종 분류는 범위에 포함하지 않는다.':
            '설비 안전화의 구조·기능·작업 분류와 기계설비 안전화 6종은 서로 다른 분류이므로 구분한다.',
    },
    'electrical/vf-danger-energy.md': {
        '이 챕터는 심실세동 위험한계 전류에서 전기에너지를 계산하는 과정을 다룬다. 심실세동 전류 자체의 인체 영향·한계값은 `ventricular-fibrillation-current`, 정전기 축적 에너지와 방전은 `static-energy` 등 인접 챕터의 범위다.':
            '심실세동 위험한계 전류의 인체 영향과 전기에너지 계산을 구분한다. 정전기 축적 에너지와 방전 계산은 별도의 개념이다.',
    },
}

# Whole-line replacements for especially awkward authoring notes / choice dumps.
SPECIAL_LINE_REWRITES: dict[str, dict[str, str]] = {
    'chemical/reactive-dangerous-gases.md': {
        '`20220424_098`은 “알루미늄분이 고온의 물과 반응하였을 때 생성되는 가스”를 묻는다. PDF 원문과 JSON의 선택지는 ① 이산화탄소, ② 수소, ③ 메탄, ④ 에탄이며 정답은 2번 수소다. 이 챕터는 해당 반응 조건과 생성 가스의 구분만 설명하고, 별도의 법령상 분류 수치나 반응 조건을 추가로 확정하지 않는다.':
            '2022년 4월 시험 98번은 알루미늄분이 고온의 물과 반응할 때 발생하는 가스를 묻는다. 정답은 수소이며, 반응물과 온도 조건을 함께 확인하는 것이 핵심이다.',
        '`20220305_093`은 “물과의 반응으로 유독한 포스핀가스를 발생하는 것은?”을 묻는다. PDF 원문과 JSON의 선택지는 ① HCl, ② NaCl, ③ Ca₃P₂, ④ Al(OH)₃이며 정답은 3번 인화칼슘(Ca₃P₂)이다. 이 챕터는 인화칼슘과 물의 반응에서 포스핀이 발생한다는 문항 근거를 추가로 설명하며, 다른 반응 조건이나 분류 기준을 확정하지 않는다.':
            '2022년 3월 시험 93번은 물과 반응해 유독한 포스핀을 발생시키는 물질을 묻는다. 정답은 인화칼슘(Ca₃P₂)이며, 인화칼슘과 물의 반응 생성물을 기억한다.',
    },
    'construction/slope-collapse-prevention.md': {
        '`20220305_118`은 법면 붕괴에 의한 재해 예방조치로 옳은 것을 묻는다. PDF 원문과 JSON의 정답은 1번 “지표수와 지하수의 침투를 방지한다”이며, 나머지 선택지는 경사·높이·구배를 불리하게 관리하는 내용이다.':
            '2022년 3월 시험 118번은 법면 붕괴 재해의 예방조치를 묻는다. 정답은 “지표수와 지하수의 침투를 방지한다”이며, 경사·높이·구배를 더 불리하게 만드는 조치는 제외한다.',
    },
    'ergonomics/illuminance-luminance-reflectance.md': {
        '`20180304_034`의 PDF 보기에서는 다음 표면을 제시한다.':
            '2018년 3월 시험 34번에서는 다음 표면을 제시한다.',
        '- `20180304_034`: 실내면의 반사율 순서를 묻는 문제이며, PDF의 A·B·C·D 표면 정보와 정답 3번 `A＜C＜D＜B`를 기준으로 판단한다.':
            '- 2018년 3월 시험 34번은 실내면의 반사율 순서를 묻는다. 문제에 제시된 A·B·C·D 표면을 확인해 `A＜C＜D＜B` 순서로 판단한다.',
    },
}

# Phrases to simplify when they appear on a line already being cleaned.
PHRASE_REPLACEMENTS: tuple[tuple[re.Pattern[str], str], ...] = (
    (re.compile(r'PDF\s*원문과\s*JSON(?:의)?\s*선택지는\s*.*?\s*(?:이며|이고)\s*정답은\s*'), '정답은 '),
    (re.compile(r'PDF\s*원문과\s*JSON(?:의)?\s*정답은\s*'), '정답은 '),
    (re.compile(r'JSON(?:의)?\s*정답은\s*'), '정답은 '),
    (re.compile(r'JSON(?:의)?\s*선택지는?\s*'), '선택지는 '),
    (re.compile(r'PDF\s*보기에서는?'), '문제에서는'),
    (re.compile(r'PDF(?:의|에서)\s*'), '문제에 제시된 '),
    (re.compile(r'PDF\s*원문'), '기출문제'),
    (re.compile(r'\bJSON\b'), '기출문제'),
    (re.compile(r'\bPDF\b'), '기출문제'),
    (re.compile(r'\bq\d{8}\b', re.I), '관련 기출'),
)

PARTICLE_MAP = {
    '은': '은', '는': '은',
    '이': '이', '가': '이',
    '을': '을', '를': '을',
    '과': '과', '와': '과',
    '의': '의', '에서': '에서', '처럼': '처럼',
    '으로': '으로', '로': '으로', '도': '도', '만': '만',
    None: '',
}


def parse_frontmatter(text: str) -> tuple[str, str]:
    if not text.startswith('---'):
        return '', text
    m = re.match(r'\A---\r?\n([\s\S]*?)\r?\n---\r?\n', text)
    if not m:
        return '', text
    return m.group(0), text[m.end():]


def field(frontmatter: str, name: str) -> str | None:
    m = re.search(rf'^{re.escape(name)}:\s*(.*?)\s*$', frontmatter, re.M)
    if not m:
        return None
    value = m.group(1).strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        value = value[1:-1]
    return value


def load_question_labels() -> dict[str, str]:
    data = json.loads(QUESTIONS_PATH.read_text(encoding='utf-8'))
    labels: dict[str, str] = {}
    for q in data:
        qid = str(q['id'])
        label = str(q.get('label') or '').replace(' 시행', ' 시험').strip()
        number = int(q.get('number') or int(qid[-3:]))
        labels[qid] = f'{label} {number}번' if label else f'{qid[:4]}년 시험 {number}번'
    return labels


def load_slug_titles() -> dict[str, str]:
    titles: dict[str, str] = {}
    for path in CHAPTER_ROOT.rglob('*.md'):
        fm, _ = parse_frontmatter(path.read_text(encoding='utf-8'))
        slug = field(fm, 'slug')
        title = field(fm, 'title')
        if slug and title:
            titles[slug] = title
    return titles


def replace_question_ids(line: str, labels: dict[str, str]) -> str:
    # A compact answer annotation is better than repeating the internal ID after an arrow.
    line = re.sub(
        r'→\s*`?\d{8}_\d{3}`?\s*([1-4])번',
        lambda m: f'→ 정답 {m.group(1)}번',
        line,
    )

    def repl(match: re.Match[str]) -> str:
        qid = match.group('id')
        particle = match.group('particle')
        label = labels.get(qid)
        if not label:
            # Keep the prose understandable even if a stale ID is missing from questions.json.
            label = f'{qid[:4]}년 시험 {int(qid[-3:])}번'
        return label + PARTICLE_MAP.get(particle, particle or '')

    return ID_PATTERN.sub(repl, line)


def replace_internal_slugs(line: str, slug_titles: dict[str, str]) -> str:
    def repl(match: re.Match[str]) -> str:
        slug = match.group(1)
        return SLUG_DISPLAY_OVERRIDES.get(slug, slug_titles.get(slug, match.group(0)))
    return SLUG_CODE.sub(repl, line)


def replace_broken_emphasis(line: str) -> str:
    line = BROKEN_STRONG.sub(lambda m: f'<strong>{m.group(1)}</strong>', line)
    line = BROKEN_UNDERLINE_STRONG.sub(lambda m: f'<strong>{m.group(1)}</strong>', line)
    return line


def clean_line(rel_path: str, line: str, labels: dict[str, str], slug_titles: dict[str, str]) -> str:
    exact = EXACT_LINE_REPLACEMENTS.get(rel_path, {}).get(line)
    if exact is not None:
        return exact
    special = SPECIAL_LINE_REWRITES.get(rel_path, {}).get(line)
    if special is not None:
        return special

    original = line
    line = replace_internal_slugs(line, slug_titles)
    line = replace_broken_emphasis(line)
    line = replace_question_ids(line, labels)
    line = ALIAS_PATTERN.sub('관련 기출', line)

    for pattern, replacement in PHRASE_REPLACEMENTS:
        line = pattern.sub(replacement, line)

    # Remove or convert the remaining implementation-oriented fragments conservatively.
    line = re.sub(r'`?review\s*:\s*["\']?jpg\s*확필["\']?`?', '시각 자료 확인 필요', line, flags=re.I)
    line = re.sub(r'`?jpg\s*확필`?\s*상태를\s*유지한다', '시각 자료를 확인한다', line, flags=re.I)
    line = line.replace('공개 렌더링 가능 여부', '시각 자료 제공 여부')
    line = line.replace('공개 렌더링', '사용자 화면 제공')
    line = line.replace('안전 필터', '공개 기준')
    line = line.replace('questions 배열', '연결된 기출 목록')
    line = line.replace('저장소의 역사적 매핑', '기존 기출 연결')
    line = line.replace('기출 DB', '기출 데이터')
    line = line.replace('DB ID', '내부 식별자')
    line = line.replace('question_id', '문항 식별자')

    # A touched line should no longer read like an internal authoring memo.
    if line != original:
        # Choice-dump cleanup can leave duplicated wording.
        line = re.sub(r'기출문제\s*기출문제', '기출문제', line)
        line = re.sub(r'정답은\s*정답은\s*', '정답은 ', line)
        line = re.sub(r'\s+([,.;:!?])', r'\1', line)
        line = re.sub(r'[ \t]{2,}', ' ', line)
        line = line.replace('이 챕터는 문제에 제시된 기준을 정리하며, 문제에 제시된 수치를 기준으로 판단한다.', '관련 기준과 수치는 문제에 제시된 조건을 기준으로 판단한다.')
        line = line.replace('이 챕터는 해당 문항에 필요한', '이 문제에서는')
        line = line.replace('이 챕터는 해당 반응 조건과 생성 가스의 구분만 설명하고,', '')
        line = line.replace('이 챕터는 인화칼슘과 물의 반응에서 포스핀이 발생한다는 문항 근거를 추가로 설명하며,', '인화칼슘과 물의 반응에서 포스핀이 발생한다는 점을 확인하며,')
        line = re.sub(r'\s*별도의 최신 법령 수치로 확장하지 않는다[.]?', ' 문제에 제시된 수치를 기준으로 판단한다.', line)
        line = re.sub(r'\s*별도의 법령상 분류 수치나 반응 조건을 추가로 확정하지 않는다[.]?', '', line)
        line = re.sub(r'\s*다른 반응 조건이나 분류 기준을 확정하지 않는다[.]?', '', line)
        line = re.sub(r'\s*후속 관계 정리에서 별도 검토한다[.]?', '', line)

    return line.rstrip()


def clean_exam_comment(frontmatter: str, labels: dict[str, str], slug_titles: dict[str, str], rel_path: str) -> str:
    def repl(match: re.Match[str]) -> str:
        prefix, value = match.group(1), match.group(2)
        return prefix + clean_line(rel_path, value, labels, slug_titles)
    return re.sub(r'^(examComment:\s*)(.*)$', repl, frontmatter, flags=re.M)


def process_file(path: Path, labels: dict[str, str], slug_titles: dict[str, str]) -> bool:
    original = path.read_text(encoding='utf-8')
    frontmatter, body = parse_frontmatter(original)
    if not frontmatter or field(frontmatter, 'status') != '완료':
        return False

    rel_path = path.relative_to(CHAPTER_ROOT).as_posix()
    cleaned_frontmatter = clean_exam_comment(frontmatter, labels, slug_titles, rel_path)

    # Preserve line endings and all untouched blank lines exactly.
    body_lines = body.splitlines(keepends=True)
    out: list[str] = []
    for raw in body_lines:
        newline = ''
        content = raw
        if raw.endswith('\r\n'):
            content, newline = raw[:-2], '\r\n'
        elif raw.endswith('\n'):
            content, newline = raw[:-1], '\n'
        cleaned = clean_line(rel_path, content, labels, slug_titles)
        out.append(cleaned + newline)

    cleaned = cleaned_frontmatter + ''.join(out)
    if cleaned == original:
        return False
    path.write_text(cleaned, encoding='utf-8', newline='')
    return True


def main() -> None:
    if not CHAPTER_ROOT.exists() or not QUESTIONS_PATH.exists():
        raise SystemExit('GetPassLab 저장소 루트에서 실행해야 합니다.')

    labels = load_question_labels()
    slug_titles = load_slug_titles()
    changed: list[str] = []
    for path in sorted(CHAPTER_ROOT.rglob('*.md')):
        if process_file(path, labels, slug_titles):
            changed.append(path.relative_to(REPO_ROOT).as_posix())

    print(f'[Content cleanup] 변경 파일 {len(changed)}개')
    for name in changed:
        print(f'[Content cleanup] {name}')


if __name__ == '__main__':
    main()
