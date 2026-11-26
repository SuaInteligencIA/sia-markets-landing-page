import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

// Utilitário opcional, usado quando as imagens novas chegam. Os derivados ficam versionados em
// public/images/, e o site não precisa de nenhuma biblioteca de imagem para ser publicado.
//
// Coloque as imagens geradas (PNG ou JPG) em docs/source-assets/ com estes nomes e rode:
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
  const source = [`${sourceDirectory}/${name}.png`, `${sourceDirectory}/${name}.jpg`].find(existsSync) || `${sourceDirectory}/${name}.png`;
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

// Recortes para telas pequenas: a cliente-audio tem a faixa vazia à esquerda (espaço para o texto no
// computador); no celular o texto vai abaixo da imagem, então a faixa sai.
const crops = [['cliente-audio', 'cliente-audio-recorte', 0.345, [640, 768]]];
for (const [name, outputName, leftFraction, widths] of crops) {
  const source = [`${sourceDirectory}/${name}.png`, `${sourceDirectory}/${name}.jpg`].find(existsSync);
  if (!source) continue;
  const { width, height } = await sharp(source).metadata();
  const left = Math.round(width * leftFraction);
  for (const size of widths) {
    const output = `public/images/${outputName}-${size}.avif`;
    const info = await sharp(source).extract({ left, top: 0, width: width - left, height }).resize({ width: size }).avif({ quality: 57, effort: 6 }).toFile(output);
    console.log(output, info.size, `${width - left}x${height}`);
  }
}
