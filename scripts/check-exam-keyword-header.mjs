import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : [file];
});
const authored = walk('src/content/chapters').filter(file => file.endsWith('.md'));
const htmlFiles = walk('dist').filter(file => file.endsWith('.html'));
const sourceHeader = /^\|\s*문제에서 보이는 키워드\s*\|\s*정답으로 연결\s*\|/gm;
const oldHeader = /<th(?:\s+[^>]*)?>\s*문제에서 보이는 키워드\s*<\/th>/g;
const newHeader = /<th(?:\s+[^>]*)?>\s*주요 키워드\s*<\/th>/g;
let matchingSources = 0, updatedPages = 0, updatedHeaders = 0;
for (const file of authored) {
  const text = fs.readFileSync(file, 'utf8');
  if (sourceHeader.test(text)) matchingSources++;
  sourceHeader.lastIndex = 0;
}
assert(matchingSources > 0, 'expected at least one authored exam-point header');
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const before = [...html.matchAll(oldHeader)].length;
  const after = [...html.matchAll(newHeader)].length;
  assert.equal(before, 0, file + ': obsolete column title must not appear in generated HTML');
  if (after) {
    assert(html.includes('정답으로 연결'), file + ': second column title retained');
    updatedPages++;
    updatedHeaders += after;
  }
}
assert(updatedPages > 0, 'the new header must render in published pages');
console.log('[Exam keyword header] PASS', JSON.stringify({
  matchingSourceFiles: matchingSources,
  renderedPagesWithNewHeader: updatedPages,
  newHeaders: updatedHeaders,
  oldRenderedHeaders: 0,
  htmlFiles: htmlFiles.length
}));
