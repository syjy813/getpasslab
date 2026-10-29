import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

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
  integrations: [sitemap({
    filter: (page) =>
      !page.includes('/admin')
      && (!new URL(page).pathname.startsWith('/facility-management/')
        || !/name="robots"[^>]*content="noindex/.test(readFileSync(new URL(`./dist${new URL(page).pathname.replace(/\/?$/, '/')}index.html`, import.meta.url), 'utf8')))
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
