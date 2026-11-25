import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

// Utilitário opcional, usado quando as imagens novas chegam. Os derivados ficam versionados em
// public/images/, e o site não precisa de nenhuma biblioteca de imagem para ser publicado.
//
// Coloque os PNGs gerados em docs/source-assets/ com estes nomes e rode:
//   SHARP_PATH=<pasta do sharp> node scripts/optimize-images.mjs   (ou com sharp instalado no projeto)
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH || 'sharp');
const sourceDirectory = 'docs/source-assets';
const images = [
  ['hero-mercado', [768, 1024, 1536]],
  ['separacao-pedido', [640, 768, 1024]],
  ['cliente-audio', [640, 768, 1024]],
];
for (const [name, widths] of images) {
  const source = `${sourceDirectory}/${name}.png`;
  if (!existsSync(source)) { console.log(`Pulando ${name}: ${source} ainda não existe.`); continue; }
  for (const width of widths) {
    const output = `public/images/${name}-${width}.avif`;
    const info = await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality: 57, effort: 6 }).toFile(output);
    console.log(output, info.size);
  }
  const fallback = `public/images/${name}.webp`;
  const info = await sharp(source).resize({ width: Math.max(...widths), withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile(fallback);
  console.log(fallback, info.size);
}
