import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';

const outputDir = 'public/images';
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// Converte logo.png para logo.webp (qualidade 85, preserva transparência)
await sharp('images/logo.png')
  .webp({ quality: 85 })
  .toFile(`${outputDir}/logo.webp`);

// Cria versão reduzida para ícone PWA (512x512 max)
await sharp('images/logo.png')
  .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile(`${outputDir}/icon-512.webp`);

await sharp('images/logo.png')
  .resize(192, 192, { fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 85 })
  .toFile(`${outputDir}/icon-192.webp`);

console.log('Imagens otimizadas e salvas em public/images/');
