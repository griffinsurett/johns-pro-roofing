// astro.config.mjs
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/content/siteDomain.js';
import { buildRedirectConfig } from './src/utils/redirects';
import { manualChunks, assetFileNames } from './vite.chunks.js';
import iconGeneratorIntegration from './src/integrations/icons/icon-generator.integration.mjs';
import clientDirectivesIntegration from './src/integrations/client-directives/client-directives.integration.mjs';
import conditionalPartytown from './src/integrations/partytown/partytown.integration.mjs';
import robotsLlmsIntegration from './src/integrations/robots-llms/robots-llms.integration.ts';

const redirects = await buildRedirectConfig();
const siteUrl = SITE_URL;

console.log(`Site URL: ${siteUrl}`);

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'never',
  server: { port: 5757 },
  output: 'static',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 10240, // 10KB - will inline your 7.3KB CSS automatically
      cssCodeSplit: true,
      cssMinify: 'esbuild',
      // Vite 8 (Astro 7) bundles with Rolldown: `rollupOptions` became
      // `rolldownOptions`, and the `manualChunks` function became a
      // `codeSplitting` group — the same conversion Rolldown applied
      // internally to the deprecated option.
      rolldownOptions: {
        output: {
          assetFileNames,
          codeSplitting: {
            groups: [{ name: manualChunks }],
          },
        },
      },
    },
    css: {
      devSourcemap: false,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },
  
  integrations: [
    clientDirectivesIntegration(),
    iconGeneratorIntegration(),
    mdx(),
    react(),
    // `/sitemap.xml` is rewritten to this integration's sitemap-index.xml in
    // vercel.json — tools that guess /sitemap.xml got a 404 and concluded
    // there was no sitemap at all.
    //
    // `lastmod` is a native option. Build time is the honest value for a
    // static site: it IS when each page was generated. Per-page content dates
    // would need `serialize`.
    sitemap({ lastmod: new Date() }),
    conditionalPartytown(),
    robotsLlmsIntegration(),
  ],
  
  build: {
    inlineStylesheets: 'always',
    split: true,
  },

  prefetch: false,
  
  compressHTML: true,
  redirects,

  experimental: {
    clientPrerender: false,
  },
});
