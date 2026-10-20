#!/usr/bin/env python3
"""Materialize recorded model attempts; never generates or repairs an answer.

Run from any directory. --check verifies the committed audit products without writes.
"""
import argparse
import collections
import csv
import hashlib
import io
import json
import re
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
BANK_PATH = 'docs/drafts/fire-level2-mock-exam/question-table.json'
BASE = '4e4ead0f84a8c110455351abb95d7811aad5316e'


def sha(value):
    return hashlib.sha256(value).hexdigest()


def encoded(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    bank_bytes = (ROOT / BANK_PATH).read_bytes()
    assert bank_bytes == subprocess.check_output(['git', 'show', f'{BASE}:{BANK_PATH}'], cwd=ROOT), 'Question bank changed since audit'
    bank = json.loads(bank_bytes)
    lookup = {r['id']: r for r in bank}
    decisions = json.loads((HERE / 'decisions.json').read_text())
    adjudications = json.loads((HERE / 'adjudications.json').read_text())
    manual = json.loads((HERE / 'findings.json').read_text())
    assert len(bank) == len(lookup) == 2480
    assert set(decisions) == {f'FSM2-{n:03}' for n in range(1, 75)}
    seen = set()
    chapter_manifest = []
    for chapter, decision in sorted(decisions.items()):
        chapter_bytes = (ROOT / decision['chapterFile']).read_bytes()
        assert sha(chapter_bytes) == decision['chapterSHA256'], f'Chapter changed: {chapter}'
        assert chapter_bytes == subprocess.check_output(['git', 'show', f"{BASE}:{decision['chapterFile']}"], cwd=ROOT)
        expected = [r['id'] for r in bank if r['chapterId'] == chapter]
        assert [a['id'] for a in decision['attempts']] == expected, f'Missing or reordered attempts: {chapter}'
        for attempt in decision['attempts']:
            assert attempt['id'] not in seen
            seen.add(attempt['id'])
            assert attempt['selectedAnswer'] in [None, 1, 2, 3, 4]
        chapter_manifest.append({'chapterId': chapter, 'file': decision['chapterFile'], 'sha256': sha(chapter_bytes)})
    assert seen == set(lookup)
    initial = {a['id']: a['selectedAnswer'] for c in decisions.values() for a in c['attempts']}
    for ident, adj in adjudications.items():
        assert ident in lookup and adj['initialAnswer'] == initial[ident]
        assert adj['reviewAnswer'] in [None, 1, 2, 3, 4]
    attempts = {ident: adjudications.get(ident, {}).get('reviewAnswer', answer) for ident, answer in initial.items()}
    for finding in manual:
        assert finding['questionIds'] and len(finding['questionIds']) == len(set(finding['questionIds']))
        assert set(finding['questionIds']) <= seen, finding['id']
    assert len({f['id'] for f in manual}) == len(manual)

    # All nulls were explicitly recorded by the reviewer. This dispatch only groups
    # the recorded blockers; it is not an automatic answerability classifier.
    missing = collections.defaultdict(list)
    figure_chapters = {14, 30, 33, 34, 36, 37, 43, 44, 45, 47, 48, 49, 57, 58, 59, 60}
    for r in bank:
        if attempts[r['id']] is not None:
            continue
        if not r.get('choices'):
            category = 'missing_choices'
        elif int(r['chapterId'][-3:]) in figure_chapters or re.search('그림|사진|계통도|체계도', r['question']):
            category = 'missing_figure'
        else:
            category = 'chapter_support_missing'
        missing[category].append(r['id'])
    labels = {
        'missing_choices': ('선택지 누락', '원본 선택지를 복구하고 OCR·정답 위치를 다시 대조한다.'),
        'missing_figure': ('풀이에 필요한 도면·표시 누락', '기호·치수·점등·위치를 확인할 원본 도판을 복구하거나 조건을 완전한 텍스트로 재작성한다.'),
        'chapter_support_missing': ('챕터 근거 부족으로 풀이 보류', '챕터 이론·전제·선행 링크를 보완하거나 문항을 재배정한 뒤 다시 답안을 가리고 푼다.'),
    }
    findings = [{'id': f'BLOCK-{key}', 'priority': 'P1', 'category': key,
                 'title': labels[key][0], 'detail': labels[key][1],
                 'questionIds': ids, 'evidence': 'decisions.json 및 adjudications.json의 명시적 보류 기록'}
                for key, ids in sorted(missing.items())] + manual
    by_question = collections.defaultdict(list)
    for finding in findings:
        for ident in finding['questionIds']:
            by_question[ident].append(finding['id'])

    rows = []
    for r in bank:
        ident = r['id']
        first, answer, key = initial[ident], attempts[ident], r['answerNumber']
        chapter = decisions[r['chapterId']]
        # Chapter notes name specific questions, but are not automatically elevated
        # to verified content defects; preserve them as cautions for the next edit.
        note = chapter['issues'] if isinstance(chapter['issues'], str) else ''
        mentioned = ident in note or (ident.startswith('FSM2-CORE-') and 'CORE' + ident[-3:] in note)
        rows.append({
            'id': ident, 'chapterId': r['chapterId'], 'subjectId': r['subjectId'],
            'questionType': r['questionType'], 'initialAnswer': first,
            'initialKeyMatch': None if first is None else first == key,
            'reviewAnswer': answer, 'suppliedAnswer': key,
            'reviewKeyMatch': None if answer is None else answer == key,
            'selectedChoice': r['choices'][answer - 1] if answer is not None else None,
            'status': 'blocked' if answer is None else 'answer_selected_needs_editorial_review' if by_question[ident] or mentioned else 'answer_selected',
            'findingIds': by_question[ident], 'chapterNoteMentionsQuestion': mentioned,
            'chapterBasis': chapter['basis'],
            'adjudication': adjudications.get(ident),
            'publicationDecision': 'not_assessed',
        })
    initial_mismatches = [r['id'] for r in rows if r['initialKeyMatch'] is False]
    assert set(initial_mismatches) == set(adjudications), 'Unresolved first-attempt discrepancy'
    assert not any(r['reviewKeyMatch'] is False for r in rows), 'Unresolved reviewed discrepancy'
    assert all(not r['examEligible'] and r['publicationStatus'] == 'unpublished' and r['reviewStatus'] == 'pending' for r in bank)
    counts = {'chapters': 74, 'questions': 2480,
              'initialAnswersSelected': sum(r['initialAnswer'] is not None for r in rows),
              'initialBlocked': sum(r['initialAnswer'] is None for r in rows),
              'initialKeyMatches': sum(r['initialKeyMatch'] is True for r in rows),
              'initialDiscrepancies': len(initial_mismatches),
              'answersSelectedAfterAdjudication': sum(r['reviewAnswer'] is not None for r in rows),
              'blockedAfterAdjudication': sum(r['reviewAnswer'] is None for r in rows),
              'blockers': {key: len(ids) for key, ids in sorted(missing.items())},
              'targetedFindingQuestions': len(set(q for f in manual for q in f['questionIds'])),
              'selectedWithTargetedFindingOrNamedChapterCaution': sum(r['status'] == 'answer_selected_needs_editorial_review' for r in rows)}
    by_type = {}
    for typ in sorted({r['questionType'] for r in rows}):
        subset = [r for r in rows if r['questionType'] == typ]
        by_type[typ] = {'questions': len(subset), 'selected': sum(r['reviewAnswer'] is not None for r in subset), 'blocked': sum(r['reviewAnswer'] is None for r in subset)}
    identical = [r['id'] for r in bank if r['questionType'] == 'source_variant' and r.get('choices') and sorted(r['choices']) == sorted(lookup[r['sourceQuestionId']].get('choices') or [])]
    manifest = {'auditDate': '2026-10-20', 'baseCommit': BASE,
                'scope': '모델이 챕터 본문·표와 문항 지문·선택지를 읽고 답을 기록한 전수 1차 QA',
                'bankFile': BANK_PATH, 'bankSHA256': sha(bank_bytes),
                'decisionsSHA256': sha((HERE / 'decisions.json').read_bytes()),
                'counts': counts, 'byType': by_type, 'chapters': chapter_manifest,
                'variantsWithExactlySameChoicesAsSource': identical,
                'limitations': ['실제 초보 수험생의 사용자 테스트나 합격률 실험이 아니다.',
                               '같은 대화에서 저작·정답 정보 일부를 이전에 본 모델이므로 완전 독립 블라인드 검증으로 주장하지 않는다.',
                               '답안 표시를 제외한 입력으로 답을 기록한 후 정답 번호를 대조했다. 원본 시도와 사후 판정은 분리 보존한다.',
                               '챕터 그림의 전수 시각 판독·실제 UI 2480회 클릭·모든 해설 문장의 독립 법령/의료 팩트체크는 이번 기록의 범위가 아니다.',
                               '답안 일치는 문항의 유일성·챕터 충족·난도·공개 적격성을 보증하지 않는다. 공개 승인과 배포는 하지 않았다.']}

    lines = ['# 소방안전관리자 2급 챕터 기반 문제 풀이 QA — 2026-10-20', '',
             '**74개 챕터·2,480개 관리 문항의 전수 1차 풀이를 완료했다. 현 상태 일괄 공개는 권하지 않는다.**', '',
             '원본 복원자료 500개 + 작성 문항 1,980개(핵심 변형 500·기본 740·심화 740)를 읽었다. 답안 표시를 제외한 챕터 본문·표와 지문·선택지를 입력으로 사용하고, 먼저 답 또는 보류를 기록한 뒤 수록 정답 번호와 대조했다. 초보 수험생이 외부 지식 없이 해당 챕터로 풀 수 있는지를 점검하는 모델 시뮬레이션이다.', '',
             '| 구분 | 문항 수 |', '|---|---:|']
    for title, value in [('전체', 2480), ('최초 답 선택', counts['initialAnswersSelected']), ('최초 보류', counts['initialBlocked']), ('최초 수록 답안 일치', counts['initialKeyMatches']), ('최초 대조 불일치', counts['initialDiscrepancies']), ('재검토 후 답 선택', counts['answersSelectedAfterAdjudication']), ('재검토 후 풀이 보류', counts['blockedAfterAdjudication'])]:
        lines.append(f'| {title} | {value:,} |')
    lines += ['', '최초 불일치 4개는 검수자의 계산·복합판정 오류 3개와 답안 문자열 전사 오류 1개였다. **정답표 오류 4개를 발견했다는 뜻이 아니다.** 최초 기록을 고치지 않고 별도 판정을 남겼다. 재검토된 선택 답은 수록 답안과 일치하지만, 그중에도 아래 문구 결함과 챕터 공백이 있다.', '',
              '| 풀이 보류의 주된 이유 | 문항 수 |', '|---|---:|']
    for category, ids in sorted(missing.items()):
        lines.append(f'| {labels[category][0]} | {len(ids)} |')
    lines += ['', '보류 이유는 서로 겹칠 수 있으며 표는 주된 이유 1개씩 분류했다. 수록 답은 알고 있어도 누락 도판을 추정해 풀지 않았다.', '',
              '| 문항 유형 | 전체 | 답 선택 | 보류 |', '|---|---:|---:|---:|']
    for typ, values in by_type.items():
        lines.append(f"| {typ} | {values['questions']} | {values['selected']} | {values['blocked']} |")
    lines += ['', '## 우선 수정·확인 항목', '',
              'P0는 오해 시 안전에 영향을 주는 표현, P1은 풀이·정답 유일성·이론 연결을 막는 결함, P2는 난도·문장·형식 개선이다. 외부 원문을 아직 확인하지 못한 내용은 확정 오류로 단정하지 않았다.', '']
    for finding in manual:
        lines += [f"### {finding['id']} · {finding['priority']} · {finding['title']}", '', finding['detail'], '',
                  '대상: ' + ', '.join(finding['questionIds']), '', '근거: ' + finding.get('evidence', '챕터 본문과 문항 직접 대조'), '']
    lines += ['## 난도와 문항 수 해석', '',
              f'핵심 변형 500개 중 {len(identical)}개는 원본과 선택지 문구가 정확히 같고 순서만 다르다. 문항 지문 전체가 완전히 같은지 또는 저작권 판단을 뜻하는 집계는 아니다. 별도 신규 상황·수치·오답을 요구하는 편집 검토가 필요하다. 해당 ID는 manifest.json에 남겼다.', '',
              '심화 740개는 각 챕터의 사례를 가·나 연결, 수정할 기록, 옳은 의견 개수로 반복 조합한다. 조합 판단·경계값 계산은 있지만 문장이 길다는 사실만으로 실전 고난도를 입증하지 못한다. 기본 문항에는 항상·무조건·모든·영구 같은 강한 단정형 오답이 많아 상식만으로 제거되는 경향도 보였다. 실제 수험생 풀이 시간·오답률에 의한 난도 보정이 필요하다.', '',
              '## 재검토 이력', '']
    for ident, adj in adjudications.items():
        lines += [f"- {ident}: 최초 {adj['initialAnswer']} → 재검토 {adj['reviewAnswer'] or '보류'}. {adj['reason']}"]
    lines += ['', '## 챕터별 근거와 보완 메모', '']
    for chapter, decision in sorted(decisions.items()):
        subset = [r for r in rows if r['chapterId'] == chapter]
        lines += [f"### {chapter} · {len(subset)}문항 · 보류 {sum(r['reviewAnswer'] is None for r in subset)}", '',
                  f"본문: `{decision['chapterFile']}`", '', '풀이에 사용한 기준: ' + decision['basis'], '']
        if decision['issues']:
            lines += ['보완 메모: ' + str(decision['issues']), '']
    lines += ['## 재현과 해석 범위', '',
              '`python docs/audits/2026-10-20-fire-persona-qa/build_report.py --check`', '',
              'manifest.json은 원본 은행과 74개 챕터의 해시를 고정한다. decisions.json은 첫 답, adjudications.json은 대조 후의 오류 정정·보류 판정이다. question-results.jsonl·question-results.csv에는 2,480개 ID, 첫 답, 검토 답, 수록 답, 선택한 보기, 챕터 기준과 발견 항목을 남겼다. 스크립트는 답안을 생성하거나 마스터 은행을 수정하지 않는다.', '']
    lines += ['- ' + limitation for limitation in manifest['limitations']]
    lines += ['', '검토 후에도 마스터의 reviewStatus=pending, publicationStatus=unpublished, examEligible=false가 유지된다. 도판·선택지 복구 → 안전 표현·유일성 수정 → 챕터 공백·선행 관계 보강 → 변형/난도 편집 → 수정본 재풀이 순으로 처리한다.', '']
    csv_io = io.StringIO(newline='')
    columns = ['id', 'chapterId', 'subjectId', 'questionType', 'initialAnswer', 'initialKeyMatch', 'reviewAnswer', 'suppliedAnswer', 'reviewKeyMatch', 'status', 'findingIds', 'chapterNoteMentionsQuestion', 'selectedChoice', 'chapterBasis', 'publicationDecision']
    writer = csv.DictWriter(csv_io, fieldnames=columns, lineterminator='\n')
    writer.writeheader()
    for row in rows:
        writer.writerow({key: '|'.join(row[key]) if key == 'findingIds' else row[key] for key in columns})
    outputs = {'manifest.json': encoded(manifest), 'all-findings.json': encoded(findings),
               'question-results.jsonl': ''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in rows),
               'question-results.csv': csv_io.getvalue(), 'README.md': '\n'.join(lines)}
    for filename, contents in outputs.items():
        target = HERE / filename
        if args.check:
            assert target.read_bytes() == contents.encode('utf-8'), f'Stale audit artifact: {filename}'
        else:
            target.write_bytes(contents.encode('utf-8'))
    print(json.dumps({'verified': args.check, **counts}, ensure_ascii=False))


if __name__ == '__main__':
    main()
