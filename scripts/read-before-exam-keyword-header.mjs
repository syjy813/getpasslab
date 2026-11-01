// Preserve archived chapter snapshots while verifying only the approved
// exam-point first-column heading change. Build output keeps the new copy.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import path from 'node:path';

const componentPath = 'src/components/ReadableChapter.astro';
const beforeBlob = 'e21f48df6687831b33234d15ac495660cf74144a';
const currentBlob = 'f59419c0a4d0cf3bbb3b253d7db5f68b8fe2a532';
const beforeSource = "const html = formatChapterHtml(await Astro.slots.render('default'), { slug, certId });";
const currentSource = `// Update only the first-column header in the exam-point table at build time.
// Keep Markdown sources, other table headers, lesson text and question data intact.
const html = formatChapterHtml(await Astro.slots.render('default'), { slug, certId })
  .replaceAll('<th>문제에서 보이는 키워드</th>', '<th>주요 키워드</th>');`;
const previousHeader = '<th>문제에서 보이는 키워드</th>';
const currentHeader = '<th>주요 키워드</th>';
const nextHeader = '<th>정답으로 연결</th>';
const blobHash = bytes => createHash('sha1')
  .update(Buffer.from('blob ' + bytes.length + String.fromCharCode(0)))
  .update(bytes).digest('hex');
const key = file => path.normalize(path.isAbsolute(String(file))
  ? path.relative(process.cwd(), String(file)) : String(file)).split(path.sep).join('/');

export function beforeExamKeywordHeader(file, bytes) {
  bytes = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  const filename = key(file);
  if (filename === componentPath) {
    const actual = blobHash(bytes);
    if (actual === beforeBlob) return bytes;
    assert.equal(actual, currentBlob, filename + ': only approved source change');
    const text = bytes.toString('utf8');
    assert.equal(text.split(currentSource).length, 2, 'one exact source revision');
    const restored = Buffer.from(text.replace(currentSource, beforeSource));
    assert.equal(blobHash(restored), beforeBlob, 'original component source preserved');
    return restored;
  }
  if (!filename.startsWith('dist/') || !filename.endsWith('.html')) return bytes;
  const html = bytes.toString('utf8');
  if (!html.includes(currentHeader)) return bytes;
  const exactHeader = currentHeader + nextHeader;
  const priorHeader = previousHeader + nextHeader;
  // Other tables titled "주요 키워드" are not in scope.
  if (!html.includes(exactHeader)) return bytes;
  return Buffer.from(html.replaceAll(exactHeader, priorHeader));
}
