// Rebuild only when intentionally revising the source. Requires sharp and the
// NanumGothic font installed locally (set FONTCONFIG_FILE to a configuration
// that includes its directory when using bundled libvips); no font binary is distributed in the repo.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const source = fs.readFileSync(path.join(__dirname, 'lathe-annotated-source.svg'), 'utf8');
const jpeg = fs.readFileSync(path.join(__dirname, '../2026-10-04-lathe-illustrated-learning/lathe-original-reference.jpg')).toString('base64');
const embedded = source.replaceAll('href="../2026-10-04-lathe-illustrated-learning/lathe-original-reference.jpg"', `href="data:image/jpeg;base64,${jpeg}"`);
sharp(Buffer.from(embedded)).webp({ quality: 93 }).toFile(path.resolve(__dirname, '../../../public/images/industrial-safety/lathe-motion-illustrated-v3.webp'));
