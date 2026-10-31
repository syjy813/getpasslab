import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, cpSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const facilityDir = './src/content/facility';
const publishedFacilityCategories = new Set(readdirSync(facilityDir).filter(file => file.endsWith('.md')).map(file => readFileSync(join(facilityDir, file), 'utf8').split('---')[1] || '').filter(front => /^status:\s*['\"]?published['\"]?\s*$/m.test(front)).map(front => front.match(/^category:\s*['\"]?([a-z-]+)['\"]?\s*$/m)?.[1]).filter(Boolean));

const facilityAssetArticles = {
  '01': 'what-is-facility-management', '02': 'first-job', '03': 'employment-types',
  '04': 'shifts-and-pay', '05': 'public-sector-comparison',
};
const facilityAssets = {
  name: 'facility-selective-assets',
  hooks: {
    'astro:build:done': ({ dir }) => {
      rmSync(join(fileURLToPath(dir), 'images', 'facility-drafts'), { recursive: true, force: true });
      for (const [number, slug] of Object.entries(facilityAssetArticles)) {
        const file = join(facilityDir, `${slug}.md`);
        const front = readFileSync(file, 'utf8').split('---')[1] || '';
        if (process.env.FACILITY_DRAFT_PREVIEW !== '1' && !/^status:\s*['"]?published['"]?\s*$/m.test(front)) continue;
        const target = join(fileURLToPath(dir), 'images', 'facility-drafts', number);
        mkdirSync(target, { recursive: true });
        cpSync(join('facility-assets', number), target, { recursive: true });
      }
    },
  },
};

const permanentRedirects = {
  '/industrial-safety/written/mechanical/roller-surface-speed':
    '/industrial-safety/written/mechanical/roller-stopping-distance/',
  '/industrial-safety/written/chemical/flameproof-flange-distance':
    '/industrial-safety/written/electrical/gas-group-distance/',
};

const redirectSources = Object.keys(permanentRedirects);

export default defineConfig({
  site: 'https://getpasslab.co.kr',
  compressHTML: true,
  redirects: permanentRedirects,
  integrations: [facilityAssets, sitemap({
    filter: (page) =>
      !['career', 'jobs', 'practice', 'qualifications'].some(category => page.endsWith(`/facility-management/${category}/`) && !publishedFacilityCategories.has(category))
      &&       !(process.env.FACILITY_DRAFT_PREVIEW === '1' && page.includes('/facility-management/'))
      && !page.includes('/admin')
      && !page.includes('/fire-safety-manager-level2/practice/')
      && !redirectSources.some(source => page.endsWith(source) || page.endsWith(`${source}/`)),
  })],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
