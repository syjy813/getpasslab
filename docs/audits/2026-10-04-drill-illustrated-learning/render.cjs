// Install NanumGothic locally and set FONTCONFIG_FILE to its directory.
// No font binary distributed. Exact labels and arrows are separate from generated imagery.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const source = fs.readFileSync(path.join(__dirname, 'drill-annotated-source.svg'), 'utf8');
const jpeg = fs.readFileSync(path.join(__dirname, 'drill-original-reference.jpg')).toString('base64');
const embedded = source.replaceAll('href="drill-original-reference.jpg"', `href="data:image/jpeg;base64,${jpeg}"`);
sharp(Buffer.from(embedded)).webp({ quality: 93 }).toFile(path.resolve(__dirname, '../../../public/images/industrial-safety/drill-motion-illustrated-v1.webp'));
