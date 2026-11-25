import { createRequire } from 'node:module';

// Optional build-time utility; generated assets are checked in and need no
// image-processing library in the browser or on the production host.
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'C:/Users/samue/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const sourceDirectory = 'docs/source-assets/final';
const images = [
  ['hero-reservas-color-v2', [768, 1024, 1536]],
  ['atendimento-ia-color-v2', [640, 768, 1024]],
  ['hospitalidade-color-v2', [768, 1280]],
];
for (const [name, widths] of images) {
  for (const width of widths) {
    const output = `public/images/${name}-${width}.avif`;
    // The mobile hero keeps the same 768px source dimensions with a visually
    // checked, smaller encoding; larger artwork retains the original quality.
    const mobileHero = name === 'hero-reservas-color-v2' && width === 768;
    const info = await sharp(`${sourceDirectory}/${name}.png`).resize({ width, withoutEnlargement: true }).avif({ quality: mobileHero ? 45 : 57, effort: mobileHero ? 9 : 6 }).toFile(output);
    console.log(output, info.size);
  }
}
const agentSource = 'docs/source-assets/brand/sia-agente.png';
await sharp(agentSource).webp({ quality: 85, effort: 6 }).toFile('public/brand/sia-agente.webp');
await sharp(agentSource).resize({ width: 320 }).webp({ quality: 82, effort: 6 }).toFile('public/brand/sia-agente-320.webp');
await sharp(agentSource).resize({ width: 400 }).webp({ quality: 82, effort: 6 }).toFile('public/brand/sia-agente-400.webp');
await sharp(agentSource).resize({ width: 160 }).webp({ quality: 85, effort: 6 }).toFile('public/brand/sia-agente-avatar.webp');
