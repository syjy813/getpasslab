import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const certificates = [
  'industrial-safety',
  'energy-management',
  'computer-literacy',
  'fire-safety-manager-level2',
];
const root = 'dist';
const entry = 'data-mobile-entry-ad aria-label="광고"';
const ribbon = 'data-mobile-top-ad>';
const footer = 'data-footer-ad data-unit="DAN-A3dGUv2kIjnZSTmZ"';
const count = (text, needle) => text.split(needle).length - 1;

const files = [];
function visit(dir) {
  for (const node of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, node.name);
    if (node.isDirectory()) visit(p);
    else if (p.endsWith('.html')) files.push(p);
  }
}
visit(root);
const targets = [];
const other = [];
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const route = '/' + path.relative(root, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  const hasEntry = count(html, entry) > 0;
  const hasRibbon = count(html, ribbon) > 0;
  const hasFooter = count(html, footer) > 0;
  assert.equal(count(html, entry), hasEntry ? 1 : 0, file + ' top rectangular placement');
  assert.equal(count(html, ribbon), hasRibbon ? 1 : 0, file + ' 320x50 placement');
  assert.equal(count(html, footer), hasFooter ? 1 : 0, file + ' original footer placement');
  if (hasEntry) {
    assert(certificates.some(cert => route.startsWith('/' + cert + '/written/')), file + ' only supported certifications');
    assert([2,3,4].includes(route.split('/').filter(Boolean).length), file + ' only three target page types');
    assert.equal(hasRibbon, true, file + ' ribbon retained');
    assert.equal(hasFooter, true, file + ' footer slot retained for PC');
    assert(html.includes('data-mobile-swapped="true"'), file + ' mobile duplicate suppression');
    const headerEnd = html.indexOf('</header>');
    const firstEntry = html.indexOf(entry);
    const firstRibbon = html.indexOf(ribbon);
    const firstFooter = html.indexOf(footer);
    const footerElement = html.indexOf('<footer ');
    assert(headerEnd >= 0 && firstEntry > headerEnd, file + ' rectangle follows GNB');
    assert(firstRibbon > firstEntry && firstFooter > firstRibbon, file + ' ribbon follows content');
    assert(footerElement > firstFooter, file + ' footer remains after ads');
    assert(html.includes("ad.dataset.adUnit = 'DAN-aX4OBdYehvddWlai'"), file + ' existing ribbon unit');
    assert(html.includes("ad.dataset.adUnit = 'DAN-A3dGUv2kIjnZSTmZ'"), file + ' original rectangle unit');
    targets.push(route);
  } else {
    assert(!hasRibbon, file + ' no orphaned ribbon without entry');
    other.push(route);
  }
}
for (const cert of certificates) {
  for (const route of ['/' + cert + '/written/', '/' + cert + '/written/']) {
    assert(targets.includes(route), cert + ' exam screen present');
  }
  assert(targets.some(route => route.startsWith('/' + cert + '/written/') &&
    route.split('/').filter(Boolean).length === 3), cert + ' subject screen present');
  assert(targets.some(route => route.startsWith('/' + cert + '/written/') &&
    route.split('/').filter(Boolean).length === 4), cert + ' chapter screen present');
  const hub = fs.readFileSync(path.join(root, cert, 'index.html'), 'utf8');
  assert(hub.includes(footer), cert + ' hub footer retained');
  assert(!hub.includes(entry) && !hub.includes(ribbon), cert + ' hub not swapped');
}
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.equal(count(home, footer), 1, 'home footer rectangle exactly once');
assert(!home.includes(entry) && !home.includes(ribbon), 'home advertising positions untouched');
assert(!home.includes('data-mobile-swapped="true"'), 'home has no swap behavior');
assert(targets.length >= 500, 'all chapter listings and details, not a small sample');
console.log('[Mobile ad swap static] PASS', JSON.stringify({
  targetPages: targets.length, otherPages: other.length,
  byCertificate: Object.fromEntries(certificates.map(cert => [
    cert, targets.filter(r => r.startsWith('/' + cert + '/written/')).length,
  ])),
  homeFooter: 'preserved', nonTargets: 'unchanged eligibility',
}));