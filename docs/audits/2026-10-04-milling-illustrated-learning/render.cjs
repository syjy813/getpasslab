// Requires locally installed NanumGothic and FONTCONFIG_FILE with its directory.
// No font binary is distributed. Exact labels/arrows are separate from AI imagery.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const source = fs.readFileSync(path.join(__dirname, 'milling-annotated-source.svg'), 'utf8');
const jpeg = fs.readFileSync(path.join(__dirname, 'milling-original-reference.jpg')).toString('base64');
const embedded = source.replaceAll('href="milling-original-reference.jpg"', `href="data:image/jpeg;base64,${jpeg}"`);
sharp(Buffer.from(embedded)).webp({ quality: 93 }).toFile(path.resolve(__dirname, '../../../public/images/industrial-safety/milling-motion-illustrated-v1.webp'));
