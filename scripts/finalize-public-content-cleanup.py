from pathlib import Path

REPLACEMENTS = {
    Path('src/content/chapters/ergonomics/safety-improvement-plan-items.md'): (
        '- 이 챕터에는 현재 직접 일치가 확정된 기출 관계가 없어 `questions` 배열을 비워 둔다.',
        '- 현재 수록 기출에서 직접 일치가 확정된 출제 이력은 없다.',
    ),
    Path('src/content/chapters/ergonomics/weber-fechner-law.md'): (
        '`20210307_032`는 “인간이 감지할 수 있는 외부의 물리적 자극 변화의 최소범위는 표준 자극의 크기에 비례한다”는 현상을 설명하는 이론을 묻는다. 선택지는 피츠 법칙, 웨버 법칙, 신호검출이론, 힉-하이만 법칙이고 JSON과 PDF의 정답은 2번 웨버 법칙이다.',
        '2021년 3월 시험 32번은 인간이 감지할 수 있는 최소 자극 변화가 기준 자극의 크기에 비례한다는 현상을 설명하는 이론을 묻는다. 정답은 웨버 법칙이며, 최소 식별 차이의 상대비를 확인하는 것이 핵심이다.',
    ),
}

changed = []
for path, (before, after) in REPLACEMENTS.items():
    text = path.read_text(encoding='utf-8')
    if before not in text:
        raise SystemExit(f'expected source line not found: {path}')
    updated = text.replace(before, after, 1)
    path.write_text(updated, encoding='utf-8', newline='')
    changed.append(path.as_posix())

print(f'[Content cleanup final] 변경 파일 {len(changed)}개')
for path in changed:
    print(f'[Content cleanup final] {path}')
