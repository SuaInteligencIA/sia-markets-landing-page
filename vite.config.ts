import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE_URL } from './src/content';

// This site exclusively uses Iconsax's Linear collection. Its pinned package
// bundles all six variants inside each icon; choosing Linear during the build
// lets Rollup discard the unused variants while retaining the original SVGs.
function iconsaxLinear(): Plugin {
  return {
    name: 'iconsax-linear',
    apply: 'build',
    transform(source, id) {
      if (!id.replaceAll('\\', '/').includes('/iconsax-react/') || !source.includes('var chooseVariant = function chooseVariant')) return null;
      return {
        code: source.replace(/var chooseVariant = function chooseVariant\(variant, color\) \{[\s\S]*?\n\};/, 'var chooseVariant = function chooseVariant(variant, color) { return React.createElement(Linear, { color: color }); };'),
        map: null,
      };
    },
  };
}

// O endereço mora só em src/content.ts: o index.html usa %SITE_URL%, o sitemap.xml é gerado no build
// e a subpasta do endereço (ex.: /markets/) vira a base de todos os arquivos.
function siteUrl(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: html => html.replaceAll('%SITE_URL%', SITE_URL),
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
  </url>
</urlset>
` });
    },
  };
}

export default defineConfig({
  base: new URL(SITE_URL).pathname,
  plugins: [react(), iconsaxLinear(), siteUrl()],
  // Preact's compatibility layer preserves the React API used by the site
  // while shipping a much smaller hydration runtime for this static page.
  resolve: {
    alias: [
      { find: 'react-dom/client', replacement: 'preact/compat/client' },
      { find: 'react-dom/server', replacement: 'preact/compat/server' },
      { find: 'react-dom', replacement: 'preact/compat' },
      { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      { find: 'react/jsx-dev-runtime', replacement: 'preact/jsx-dev-runtime' },
      { find: 'react', replacement: 'preact/compat' },
    ],
  },
});
