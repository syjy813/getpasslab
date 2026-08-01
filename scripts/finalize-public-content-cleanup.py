from pathlib import Path
import re

RULES = {
    Path('src/content/chapters/ergonomics/safety-improvement-plan-items.md'): (
        re.compile(r'^- 이 챕터에는 현재 직접 일치가 확정된 기출 관계가 없어 .*? 배열을 비워 둔다\.$', re.M),
        '- 현재 수록 기출에서 직접 일치가 확정된 출제 이력은 없다.',
    ),
    Path('src/content/chapters/ergonomics/weber-fechner-law.md'): (
        re.compile(
            r'^.*인간이 감지할 수 있는 외부의 물리적 자극 변화의 최소범위는 표준 자극의 크기에 비례한다.*?웨버 법칙이다\.$',
            re.M,
        ),
        '2021년 3월 시험 32번은 인간이 감지할 수 있는 최소 자극 변화가 기준 자극의 크기에 비례한다는 현상을 설명하는 이론을 묻는다. 정답은 웨버 법칙이며, 최소 식별 차이의 상대비를 확인하는 것이 핵심이다.',
    ),
}

changed = []
for path, (pattern, replacement) in RULES.items():
    text = path.read_text(encoding='utf-8')
    if replacement in text:
        continue
    updated, count = pattern.subn(replacement, text, count=1)
    if count != 1:
        raise SystemExit(f'expected source line not found: {path}')
    path.write_text(updated, encoding='utf-8', newline='')
    changed.append(path.as_posix())

print(f'[Content cleanup final] 변경 파일 {len(changed)}개')
for path in changed:
    print(f'[Content cleanup final] {path}')
