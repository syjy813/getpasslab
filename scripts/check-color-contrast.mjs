import { readFile } from 'node:fs/promises';

const css = await readFile('src/styles/global.css', 'utf8');
const tokens = new Map(
  [...css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)]
    .map(([, name, value]) => [name, value.toUpperCase()]),
);

const pairs = [
  ['gray-600', 'white', 4.5],
  ['gray-600', 'gray-50', 4.5],
  ['gray-600', 'gray-100', 4.5],
];

const errors = [];

function relativeLuminance(hex) {
  const channels = [1, 3, 5]
    .map(index => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
    .map(channel => channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4);

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const [foregroundName, backgroundName, minimum] of pairs) {
  const foreground = tokens.get(foregroundName);
  const background = tokens.get(backgroundName);

  if (!foreground || !background) {
    errors.push(`색상 토큰 누락: --${!foreground ? foregroundName : backgroundName}`);
    continue;
  }

  const ratio = contrastRatio(foreground, background);
  console.log(`[Contrast] --${foregroundName} ${foreground} on --${backgroundName} ${background}: ${ratio.toFixed(2)}:1`);

  if (ratio < minimum) {
    errors.push(`--${foregroundName} on --${backgroundName}: ${ratio.toFixed(2)}:1 < ${minimum}:1`);
  }
}

if (errors.length > 0) {
  console.error(`[Contrast] 오류 ${errors.length}개`);
  for (const error of errors) console.error(`[Contrast error] ${error}`);
  process.exit(1);
}

console.log('[Contrast] 오류 0개');
