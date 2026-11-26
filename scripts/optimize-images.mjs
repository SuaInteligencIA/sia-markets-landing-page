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
// Larguras até 2048 px: a faixa da lista ocupa a tela inteira e o topo, dois terços dela, inclusive em telas
// de alta densidade. O navegador escolhe a menor que fica nítida.
const quality = 62;
const images = [
  ['hero-mercado', [768, 1024, 1536, 2048]],
  ['separacao-pedido', [640, 768, 1024, 1536]],
  ['cliente-audio', [768, 1024, 1536, 2048]],
];
for (const [name, widths] of images) {
  const source = [`${sourceDirectory}/${name}.png`, `${sourceDirectory}/${name}.jpg`].find(existsSync) || `${sourceDirectory}/${name}.png`;
  if (!existsSync(source)) { console.log(`Pulando ${name}: ${source} ainda não existe.`); continue; }
  for (const width of widths) {
    const output = `public/images/${name}-${width}.avif`;
    const info = await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality, effort: 6 }).toFile(output);
    console.log(output, info.size);
  }
  const fallback = `public/images/${name}.webp`;
  const info = await sharp(source).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile(fallback);
  console.log(fallback, info.size);
}

// Recortes para telas pequenas: a cliente-audio tem a faixa vazia à esquerda (espaço para o texto no
// computador); no celular o texto vai abaixo da imagem, então a faixa sai.
// A entrega também: no quadro de "Como funciona" entra só a cena, sem a faixa vazia da esquerda.
// Último campo: gera também o WebP de reserva (só quem é usado como <img src> precisa dele).
const crops = [['cliente-audio', 'cliente-audio-recorte', 0.345, [640, 768, 1024], false], ['entrega-cliente', 'entrega-cliente', 0.3, [640, 960, 1280], true], ['cliente-atendido', 'cliente-atendido', 0.28, [640, 960, 1280], true]];
for (const [name, outputName, leftFraction, widths, withWebp] of crops) {
  const source = [`${sourceDirectory}/${name}.png`, `${sourceDirectory}/${name}.jpg`].find(existsSync);
  if (!source) continue;
  const { width, height } = await sharp(source).metadata();
  const left = Math.round(width * leftFraction);
  for (const size of widths) {
    const output = `public/images/${outputName}-${size}.avif`;
    const info = await sharp(source).extract({ left, top: 0, width: width - left, height }).resize({ width: size }).avif({ quality, effort: 6 }).toFile(output);
    console.log(output, info.size, `${width - left}x${height}`);
  }
  if (withWebp) await sharp(source).extract({ left, top: 0, width: width - left, height }).resize({ width: 960 }).webp({ quality: 82, effort: 6 }).toFile(`public/images/${outputName}.webp`);
}

// Recortes com enquadramento próprio (caixa em px da imagem original).
// separacao-etapa-zoom: mais fechado na atendente, nos sacos e no balão, para a etapa de separação.
const boxes = [['separacao-etapa', 'separacao-etapa-zoom', { left: 1010, top: 200, width: 1460, height: 1496 }, [480, 720, 960]]];
for (const [name, outputName, box, widths] of boxes) {
  const source = [`${sourceDirectory}/${name}.png`, `${sourceDirectory}/${name}.jpg`].find(existsSync);
  if (!source) continue;
  for (const size of widths) {
    const output = `public/images/${outputName}-${size}.avif`;
    const info = await sharp(source).extract(box).resize({ width: size }).avif({ quality, effort: 6 }).toFile(output);
    console.log(output, info.size);
  }
  await sharp(source).extract(box).resize({ width: 720 }).webp({ quality: 82, effort: 6 }).toFile(`public/images/${outputName}.webp`);
}

// Prévia de link (WhatsApp, redes): JPG 1200×630 a partir do topo, focada na SIA e no balão.
const heroSource = [`${sourceDirectory}/hero-mercado.png`, `${sourceDirectory}/hero-mercado.jpg`].find(existsSync);
if (heroSource) {
  const { width, height } = await sharp(heroSource).metadata();
  const cropHeight = Math.round(width * 0.62 * 630 / 1200);
  await sharp(heroSource).extract({ left: Math.round(width * 0.38), top: Math.max(0, Math.round((height - cropHeight) * 0.12)), width: Math.round(width * 0.62), height: cropHeight }).resize(1200, 630).jpeg({ quality: 82, mozjpeg: true }).toFile('public/images/social-preview.jpg');
  console.log('public/images/social-preview.jpg');
}
// Ícone para a tela inicial do iPhone: o símbolo da marca em branco sobre azul, 180×180.
const symbol = (await import('node:fs')).readFileSync('public/brand/icon.svg', 'utf8').replace(/fill="#2d5ffe"/g, 'fill="#ffffff"');
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#2d5ffe' } }).composite([{ input: await sharp(Buffer.from(symbol)).resize(112, 112).png().toBuffer(), gravity: 'center' }]).png().toFile('public/brand/apple-touch-icon.png');
console.log('public/brand/apple-touch-icon.png');
