import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const root = 'docs/drafts/facility/hobyeongbaekma';
const background = `${root}/masters/hero-background-centered.webp`;
const spec = {
  width: 1440, height: 1080,
  fontFamily: 'Noto Sans CJK KR', alignment: 'center',
  title: { text: '시설관리 ‘호병백마’란?', size: 64, weight: 700, x: 720, top: 140 },
  subtitle: { text: '호텔·병원·백화점·마트가 묶인 이유', size: 30, weight: 400, x: 720, top: 230 },
};
const sha = b => createHash('sha256').update(b).digest('hex');
if (process.argv[2]) {
  await sharp(process.argv[2]).resize(spec.width, spec.height).webp({ quality: 96, effort: 6 }).toFile(background);
}
assert(fs.existsSync(background), 'Provide the imagegen header-cleared master on first render');
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = item => `<text x="${item.x}" y="${item.top}" font-size="${item.size}" font-weight="${item.weight}" text-anchor="middle" dominant-baseline="hanging">${escape(item.text)}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1080" viewBox="0 0 1440 1080"><g font-family="Noto Sans CJK KR,Noto Sans KR,sans-serif" fill="#114935">${text(spec.title)}${text(spec.subtitle)}</g></svg>`;
const overlay = await sharp(Buffer.from(svg)).png().toBuffer();
const measurements = [];
for (const [role, item] of Object.entries({ title: spec.title, subtitle: spec.subtitle })) {
  const { data, info } = await sharp(overlay).extract({ left: 0, top: item.top, width: 1440, height: item.size + 12 }).raw().toBuffer({ resolveWithObject: true });
  let left = Infinity, right = -1, top = Infinity, bottom = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * info.channels + 3] > 100) { left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
  }
  const difference = Math.abs(left - (1439 - right));
  assert(right > left && difference <= 2, `${role}: visible horizontal center differs by ${difference}px`);
  measurements.push({ role, fontSize: item.size, x: item.x, anchorTop: item.top, left, right, inkTop: top + item.top, inkBottom: bottom + item.top, horizontalGapDifference: difference });
}
const output = await sharp(background).composite([{ input: overlay }]).webp({ quality: 92, effort: 6 }).toBuffer();
fs.writeFileSync(`${root}/images/01-hobyeongbaekma-hero.webp`, output);
fs.writeFileSync(`${root}/masters/hero-centered-type.svg`, svg);
fs.writeFileSync(`${root}/specs/hero-centered-type.json`, JSON.stringify(spec, null, 2) + '\n');
fs.writeFileSync(`${root}/hero-type-verification.json`, JSON.stringify({ spec, measurements, backgroundSHA256: sha(fs.readFileSync(background)), outputSHA256: sha(output) }, null, 2) + '\n');
const manifest = JSON.parse(fs.readFileSync(`${root}/image-manifest.json`));
manifest.images[0] = { ...manifest.images[0], sha256: sha(output), sourcePNG: process.argv[2] ? path.basename(process.argv[2]) : manifest.images[0].sourcePNG, sourceSHA256: process.argv[2] ? sha(fs.readFileSync(process.argv[2])) : manifest.images[0].sourceSHA256, master: 'masters/hero-centered-type.svg', background: 'masters/hero-background-centered.webp', typeSpec: 'specs/hero-centered-type.json', sourceRole: 'imagegen four-building background + precisely centered native text layer' };
fs.writeFileSync(`${root}/image-manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ width: spec.width, height: spec.height, measurements, bytes: output.length }));
