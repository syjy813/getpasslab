import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://getpasslab.co.kr',
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
