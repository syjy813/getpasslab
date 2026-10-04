// Exact SVG labels and arrows remain independent of generated base.
// Set FONTCONFIG_FILE for local Pretendard Variable converted from the existing site WOFF2.
// No additional font binary distributed.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const svg = fs.readFileSync(path.join(__dirname, 'planer-annotated-source.svg'), 'utf8');
const jpg = fs.readFileSync(path.join(__dirname, 'planer-original-reference.jpg')).toString('base64');
sharp(Buffer.from(svg.replaceAll('href="planer-original-reference.jpg"', `href="data:image/jpeg;base64,${jpg}"`)))
  .webp({ quality: 93 })
  .toFile(path.resolve(__dirname, '../../../public/images/industrial-safety/planer-motion-illustrated-v1.webp'));
