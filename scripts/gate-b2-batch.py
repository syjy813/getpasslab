import json
from copy import deepcopy
from pathlib import Path

QUESTIONS_PATH = Path('src/data/questions.json')
PAGE_PATH = Path('src/pages/industrial-safety/written/[subject]/[slug].astro')
CONSTRUCTION_PATH = Path('src/content/chapters/construction/construction-hazard-plan-documents.md')
LEAKAGE_PATH = Path('src/content/chapters/electrical/leakage-breaker-types.md')
Q119_AUDIT_PATH = Path('docs/audits/2026-08-03-question-20190804-119-source-mismatch.md')
GATE_AUDIT_PATH = Path('docs/audits/2026-08-03-gate-b2-law-and-relations-implementation.md')
ASSET_DIR = Path('scripts/gate-b2-assets')
TRIGGER_PATH = Path('.gate-b2-trigger')

questions = json.loads(QUESTIONS_PATH.read_text(encoding='utf-8'))
if len(questions) != 1680:
    raise RuntimeError(f'Expected 1680 questions, found {len(questions)}')

ids = [question['id'] for question in questions]
if len(ids) != len(set(ids)):
    raise RuntimeError('Duplicate question IDs detected before update')

by_id = {question['id']: question for question in questions}
required_ids = {
    '20190804_118', '20190804_119', '20190804_120',
    '20220424_065', '20200926_065', '20180428_073',
}
missing = sorted(required_ids - set(by_id))
if missing:
    raise RuntimeError(f'Missing required question IDs: {missing}')

before_118 = deepcopy(by_id['20190804_118'])
before_120 = deepcopy(by_id['20190804_120'])
target = by_id['20190804_119']

expected_identity = {
    'id': '20190804_119',
    'subject_id': 6,
    'date': '2019-08-04',
    'label': '2019년 8월 시행',
    'number': 119,
}
for key, value in expected_identity.items():
    if target.get(key) != value:
        raise RuntimeError(f'Unexpected 20190804_119 {key}: {target.get(key)!r}')

restored = {
    'body': '감전재해의 직접적인 요인으로 가장 거리가 먼 것은?',
    'choices': ['통전전압의 크기', '통전전류의 크기', '통전시간', '통전경로'],
    'answer': 1,
    'review': '',
}
if not all(target.get(key) == value for key, value in restored.items()):
    if '유해' not in str(target.get('body', '')) or target.get('answer') != 1:
        raise RuntimeError('20190804_119 no longer matches the audited corrupted state')
    target.update(restored)

if by_id['20190804_118'] != before_118 or by_id['20190804_120'] != before_120:
    raise RuntimeError('Adjacent question records changed unexpectedly')

QUESTIONS_PATH.write_text(
    json.dumps(questions, ensure_ascii=False, indent=1) + '\n',
    encoding='utf-8',
)

page = PAGE_PATH.read_text(encoding='utf-8')
filter_snippet = "  if (question.id === '20190804_119') {\n    exclusionReasons.push('source answer verification pending');\n  }\n"
if filter_snippet in page:
    page = page.replace(filter_snippet, '', 1)
elif 'source answer verification pending' in page or "question.id === '20190804_119'" in page:
    raise RuntimeError('Temporary 20190804_119 filter changed shape')
PAGE_PATH.write_text(page, encoding='utf-8')

construction_current = CONSTRUCTION_PATH.read_text(encoding='utf-8')
construction_frontmatter = construction_current.split('---', 2)[1]
expected_construction = [
    '20220424_103', '20220424_107', '20220305_101', '20210814_108',
    '20200606_101', '20200822_119', '20200926_119', '20180428_102',
    '20180819_110', '20190303_106', '20190427_107', '20210307_118',
    '20210515_116',
]
if 'slug: construction-hazard-plan-documents' not in construction_current:
    raise RuntimeError('Construction chapter slug mismatch')
if '20190804_119' in construction_frontmatter:
    raise RuntimeError('Corrupted 20190804_119 relation reappeared')
for question_id in expected_construction:
    if question_id not in construction_frontmatter:
        raise RuntimeError(f'Missing expected construction relation: {question_id}')

candidate_ids = ['20220424_065', '20200926_065', '20180428_073']
relation_hits = {question_id: [] for question_id in candidate_ids}
for chapter in Path('src/content/chapters').rglob('*.md'):
    parts = chapter.read_text(encoding='utf-8').split('---', 2)
    frontmatter = parts[1] if len(parts) >= 3 else ''
    for question_id in candidate_ids:
        if question_id in frontmatter:
            relation_hits[question_id].append(str(chapter))
unexpected_hits = {question_id: hits for question_id, hits in relation_hits.items() if hits}
if unexpected_hits:
    raise RuntimeError(f'Candidate relations are no longer unmapped: {unexpected_hits}')

leakage_current = LEAKAGE_PATH.read_text(encoding='utf-8')
leakage_frontmatter = leakage_current.split('---', 2)[1]
expected_leakage = [
    '20210814_075', '20210307_071', '20200926_078', '20210515_065',
    '20180304_065', '20190303_072', '20190303_076', '20190427_068',
]
if 'slug: leakage-breaker-types' not in leakage_current:
    raise RuntimeError('Leakage-breaker chapter slug mismatch')
for question_id in expected_leakage:
    if question_id not in leakage_frontmatter:
        raise RuntimeError(f'Missing expected leakage relation: {question_id}')

CONSTRUCTION_PATH.write_text((ASSET_DIR / 'construction.md').read_text(encoding='utf-8'), encoding='utf-8')
LEAKAGE_PATH.write_text((ASSET_DIR / 'leakage.md').read_text(encoding='utf-8'), encoding='utf-8')
Q119_AUDIT_PATH.write_text((ASSET_DIR / 'q119-audit.md').read_text(encoding='utf-8'), encoding='utf-8')
GATE_AUDIT_PATH.write_text((ASSET_DIR / 'gate-audit.md').read_text(encoding='utf-8'), encoding='utf-8')

relation_hits_after = []
for chapter in Path('src/content/chapters').rglob('*.md'):
    parts = chapter.read_text(encoding='utf-8').split('---', 2)
    frontmatter = parts[1] if len(parts) >= 3 else ''
    if '20190804_119' in frontmatter:
        relation_hits_after.append(str(chapter))
if relation_hits_after:
    raise RuntimeError(f'20190804_119 must remain unmapped: {relation_hits_after}')

for question_id in candidate_ids:
    hits = []
    for chapter in Path('src/content/chapters').rglob('*.md'):
        parts = chapter.read_text(encoding='utf-8').split('---', 2)
        frontmatter = parts[1] if len(parts) >= 3 else ''
        if question_id in frontmatter:
            hits.append(str(chapter))
    if hits != [str(LEAKAGE_PATH)]:
        raise RuntimeError(f'Unexpected final relation for {question_id}: {hits}')

if TRIGGER_PATH.exists():
    TRIGGER_PATH.unlink()

print('Gate B2 batch changes prepared successfully.')
