import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';

const CHAPTER_ROOT = path.join('src', 'content', 'chapters');
const write = process.argv.includes('--write');
const subjectArgument = process.argv.find((argument) => argument.startsWith('--subject='));
const subjectFilter = subjectArgument?.slice('--subject='.length);
const PREVIOUS_UX_COMMITS = [
  'fdf372e',
  '87dacef',
  '32cda44',
  '830a7b5',
  'a0f65f7',
  '7001ae3',
  '290d172',
  'a843732',
  'a0170d4',
  'cc8ebbf',
  '6be8700',
];

const previouslyStandardized = new Set(
  PREVIOUS_UX_COMMITS.flatMap((commit) =>
    execFileSync(
      'git',
      ['diff-tree', '--no-commit-id', '--name-only', '-r', commit, '--', CHAPTER_ROOT],
      { encoding: 'utf8' },
    )
      .split(/\r?\n/)
      .filter((file) => file.endsWith('.md'))
      .map((file) => path.normalize(file)),
  ),
);

const walk = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });

const extractDocument = (text, file) => {
  const frontmatterMatch = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  if (!frontmatterMatch) throw new Error(`[${file}] frontmatter를 찾을 수 없습니다.`);

  const frontmatterRaw = frontmatterMatch[0];
  const frontmatter = frontmatterRaw
    .replace(/^---\r?\n/, '')
    .replace(/\r?\n---\r?\n?$/, '');

  return {
    frontmatter,
    frontmatterRaw,
    body: text.slice(frontmatterRaw.length),
  };
};

const parseSections = (body) => {
  const headingMatches = [...body.matchAll(/^##\s+(.+?)\r?$/gm)];
  if (!headingMatches.length) return null;

  const prefix = body.slice(0, headingMatches[0].index);
  const sections = headingMatches.map((match, index) => {
    const contentStart = match.index + match[0].length;
    const contentEnd = headingMatches[index + 1]?.index ?? body.length;
    return {
      heading: match[1].trim(),
      content: body.slice(contentStart, contentEnd).trim(),
    };
  });

  return { prefix, sections };
};

const sectionRole = (heading) => {
  if (/자주 틀|혼동|함정|범위와|주의|제외/.test(heading)) return 'mistake';
  if (/연결 기출|연결 문항|출제 문항|핵심 요약|시험 포인트/.test(heading)) {
    return 'exam';
  }
  return 'criteria';
};

const isAlreadyStandard = (headings) =>
  headings.length === 4 &&
  /^(핵심 개념|핵심 공식)$/.test(headings[0]) &&
  headings[2] === '시험 포인트' &&
  headings[3] === '자주 틀리는 포인트';

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const frontmatterString = (frontmatter, key) => {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  if (!match) return '';
  return match[1].trim().replace(/^(["'])(.*)\1$/, '$2');
};

const emphasizeDefinition = (content, frontmatter) => {
  const paragraphMatch = content.match(/^([^\r\n]+)(\r?\n|$)/);
  if (!paragraphMatch) return content;

  const paragraph = paragraphMatch[1];
  if (paragraph.includes('**') || paragraph.startsWith('|') || paragraph.startsWith('>')) {
    return content;
  }

  const title = frontmatterString(frontmatter, 'title');
  const titleWithoutParenthetical = title.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const candidates = [...new Set([title, titleWithoutParenthetical])]
    .map((candidate) => candidate.replace(/\s+\(/g, '(').trim())
    .filter(Boolean)
    .sort((left, right) => right.length - left.length);

  const definitionMatch = candidates
    .map((candidate) =>
      paragraph.match(
        new RegExp(`^(${escapeRegExp(candidate)}(?:\\s*\\([^)]*\\))?)(은|는|이란|란)\\s`),
      ),
    )
    .find(Boolean);
  if (!definitionMatch) return content;

  const term = definitionMatch[1].trim();
  if (!term || /[$`]/.test(term)) return content;

  const emphasized = paragraph.replace(term, `**${term}**`);
  return emphasized + content.slice(paragraph.length);
};

const emphasizeLabels = (content) =>
  content
    .split(/\r?\n/)
    .map((line) => {
      const bulletMatch = line.match(/^(\s*[-*]\s+)([^:*`$]{1,30})(:\s+)/);
      if (bulletMatch && !bulletMatch[2].includes('**')) {
        return `${bulletMatch[1]}**${bulletMatch[2].trim()}**${bulletMatch[3]}${line.slice(
          bulletMatch[0].length,
        )}`;
      }

      if (!line.trimStart().startsWith('|') || /^\s*\|?\s*:?-{3,}/.test(line)) {
        return line;
      }

      const cells = line.split('|');
      if (cells.length < 3) return line;

      const firstCell = cells[1].trim();
      const isHeaderSeparator = /^:?-{3,}:?$/.test(firstCell);
      const isSimpleCell =
        firstCell &&
        !isHeaderSeparator &&
        !firstCell.includes('**') &&
        !/[$`<>]/.test(firstCell);

      if (!isSimpleCell) return line;

      cells[1] = `${cells[1].match(/^\s*/)?.[0] ?? ''}**${firstCell}**${
        cells[1].match(/\s*$/)?.[0] ?? ''
      }`;
      return cells.join('|');
    })
    .join('\n');

const criteriaHeading = (frontmatter, sections) => {
  const hasCalculation =
    /^tags:\s*\[[^\]]*계산[^\]]*\]/m.test(frontmatter) ||
    /핵심 공식|계산식|계산 예시|계산 방법|계산과 판단|핵심 검산/.test(
      sections.map((section) => section.heading).join(' '),
    );
  if (hasCalculation) return '계산 기준';

  const hasProcedure =
    /^tags:\s*\[[^\]]*절차[^\]]*\]/m.test(frontmatter) ||
    /절차|순서|단계|흐름|라운드/.test(sections.map((section) => section.heading).join(' '));
  if (hasProcedure) return '절차 및 판별 기준';

  return '판별 기준';
};

const formatGroup = (heading, sections) => {
  const includeSubheadings = sections.length > 1;
  const chunks = sections.map((section) => {
    const content = emphasizeLabels(section.content);
    return includeSubheadings ? `### ${section.heading}\n\n${content}` : content;
  });

  return `## ${heading}\n\n${chunks.join('\n\n')}`;
};

const comparableLines = (body) =>
  body
    .split(/\r?\n/)
    .filter((line) => !/^#{2,3}\s+/.test(line))
    .map((line) => line.replace(/\*\*/g, '').trim())
    .filter(Boolean)
    .sort();

const numericTokens = (body) =>
  [...body.matchAll(/\d+(?:[.,]\d+)*(?:\s*(?:%|mm|cm|m|kg|kN|MPa|초|분|시간|V|A|Ω|℃))?/g)]
    .map((match) => match[0].replace(/\s+/g, ''))
    .sort();

const assertUnchangedContent = (beforeBody, afterBody, file) => {
  if (JSON.stringify(comparableLines(beforeBody)) !== JSON.stringify(comparableLines(afterBody))) {
    throw new Error(`[${file}] 제목·강조 외 본문 문장이 달라졌습니다.`);
  }

  if (JSON.stringify(numericTokens(beforeBody)) !== JSON.stringify(numericTokens(afterBody))) {
    throw new Error(`[${file}] 숫자·단위 토큰이 달라졌습니다.`);
  }
};

const results = {
  alreadyStandard: [],
  candidates: [],
  previousBatch: [],
  skipped: [],
};

for (const file of walk(CHAPTER_ROOT).filter((entry) => entry.endsWith('.md'))) {
  if (subjectFilter && path.basename(path.dirname(file)) !== subjectFilter) continue;

  const original = fs.readFileSync(file, 'utf8');
  const { frontmatter, frontmatterRaw, body } = extractDocument(original, file);
  if (!/^status:\s*["']?완료["']?\s*$/m.test(frontmatter)) continue;
  if (previouslyStandardized.has(path.normalize(file))) {
    results.previousBatch.push(file);
    continue;
  }

  const parsed = parseSections(body);
  if (!parsed) {
    results.skipped.push({ file, reason: 'H2 없음' });
    continue;
  }

  const headings = parsed.sections.map((section) => section.heading);
  if (isAlreadyStandard(headings)) {
    results.alreadyStandard.push(file);
    continue;
  }

  const [core, ...remaining] = parsed.sections;
  const grouped = {
    criteria: remaining.filter((section) => sectionRole(section.heading) === 'criteria'),
    exam: remaining.filter((section) => sectionRole(section.heading) === 'exam'),
    mistake: remaining.filter((section) => sectionRole(section.heading) === 'mistake'),
  };

  const missingRoles = Object.entries(grouped)
    .filter(([, sections]) => sections.length === 0)
    .map(([role]) => role);
  if (missingRoles.length) {
    results.skipped.push({ file, reason: `필수 역할 없음: ${missingRoles.join(', ')}` });
    continue;
  }

  const coreHeading = /핵심 공식/.test(core.heading) ? '핵심 공식' : '핵심 개념';
  const coreContent = emphasizeLabels(emphasizeDefinition(core.content, frontmatter));
  const standardizedBody = [
    parsed.prefix.trim(),
    `## ${coreHeading}\n\n${coreContent}`,
    formatGroup(criteriaHeading(frontmatter, grouped.criteria), grouped.criteria),
    formatGroup('시험 포인트', grouped.exam),
    formatGroup('자주 틀리는 포인트', grouped.mistake),
  ]
    .filter(Boolean)
    .join('\n\n')
    .trimEnd()
    .concat('\n');

  assertUnchangedContent(body, standardizedBody, file);

  const output = frontmatterRaw + standardizedBody;
  const outputDocument = extractDocument(output, file);
  if (outputDocument.frontmatterRaw !== frontmatterRaw) {
    throw new Error(`[${file}] frontmatter가 변경됐습니다.`);
  }

  results.candidates.push(file);
  if (write) fs.writeFileSync(file, output, 'utf8');
}

const countBySubject = (files) =>
  files.reduce((counts, file) => {
    const subject = path.basename(path.dirname(file));
    counts[subject] = (counts[subject] ?? 0) + 1;
    return counts;
  }, {});

console.log(`[chapter-content] mode=${write ? 'write' : 'dry-run'}`);
console.log(`[chapter-content] subject=${subjectFilter ?? 'all'}`);
console.log(`[chapter-content] previous-batch=${results.previousBatch.length}`);
console.log(`[chapter-content] already-standard=${results.alreadyStandard.length}`);
console.log(`[chapter-content] candidates=${results.candidates.length}`);
console.log(`[chapter-content] skipped=${results.skipped.length}`);
console.log(
  `[chapter-content] candidates-by-subject=${JSON.stringify(countBySubject(results.candidates))}`,
);

for (const item of results.skipped) {
  console.log(`[chapter-content][skip] ${item.file}: ${item.reason}`);
}
