import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

process.env.NODE_ENV = 'production';
const temporaryDirectory = path.resolve('.prerender');
await build({
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: temporaryDirectory,
    emptyOutDir: true,
    copyPublicDir: false,
  },
  ssr: { noExternal: ['iconsax-react'] },
});
const { render } = await import(pathToFileURL(path.join(temporaryDirectory, 'entry-server.js')).href);
const htmlPath = path.resolve('dist/index.html');
let template = await fs.readFile(htmlPath, 'utf8');
// The page is already rendered below. Give its above-the-fold artwork and font
// network priority over hydration while downloading the module immediately.
template = template.replace(/<script type="module"([^>]+)>/g, '<script type="module" fetchpriority="low"$1>');
const placeholder = '<div id="root"></div>';
if (!template.includes(placeholder)) throw new Error('Expected empty root in the freshly built index.html.');
// A single-page site has a small shared stylesheet. Including it in the HTML
// removes a render-blocking network round trip without delaying any styles.
const stylesheetLinks = [...template.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
for (const [link] of stylesheetLinks) {
  const href = link.match(/href="([^"]+)"/)?.[1];
  if (!href || !/\/assets\/[^/]+\.css$/.test(href)) throw new Error('Unexpected stylesheet URL.');
  const css = await fs.readFile(path.resolve('dist', 'assets', path.basename(href)), 'utf8');
  template = template.replace(link, `<style>${css}</style>`);
}
await fs.writeFile(htmlPath, template.replace(placeholder, `<div id="root">${render()}</div>`));
console.log('Prerendered the homepage into dist/index.html.');
