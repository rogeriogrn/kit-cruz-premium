/**
 * 🖼️ Otimizador de Imagens — Pagina Joias
 * 
 * Converte todas as PNGs em assets/ para:
 *   - WebP  (qualidade 78)  → fallback universal
 *   - AVIF  (qualidade 60)  → máxima compressão, navegadores modernos
 *   - PNG otimizado          → fallback legado (compression level 9)
 * 
 * Gera relatório de economia no final.
 * 
 * Uso: node optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

// ───────── CONFIG ─────────
const ASSETS_DIR = 'C:\\Users\\roger\\Downloads\\Pagina Joias\\assets';
const OUTPUT_DIR = join(ASSETS_DIR, 'optimized');

const WEBP_QUALITY = 78;
const AVIF_QUALITY = 60;
const PNG_COMPRESSION = 9;

// Imagens que devem manter transparência (PNG alpha)
const NEEDS_ALPHA = ['logo.png'];

// Tamanhos máximos por tipo de uso (largura em px)
const RESIZE_MAP = {
  'hero-kit-completo': 1200,
  'macro-cordao': 1200,
  'macro-pingente': 1200,
  'macro-pulseira': 1200,
  'bg-cta': 1920,         // background full-width
  'peca-01-cordao': 800,
  'peca-02-pingente': 800,
  'peca-03-pulseira': 800,
  'review-01': 800,
  'review-02': 800,
  'review-03': 800,
  'logo': 400,
};

// ───────── HELPERS ─────────
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}

function pct(original, optimized) {
  return ((1 - optimized / original) * 100).toFixed(1);
}

// ───────── MAIN ─────────
async function run() {
  // Criar diretório de saída
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Listar PNGs
  const files = (await readdir(ASSETS_DIR)).filter(f => f.toLowerCase().endsWith('.png'));
  
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║  🖼️  OTIMIZADOR DE IMAGENS — Pagina Joias                   ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  Imagens encontradas: ${files.length.toString().padEnd(38)}║`);
  console.log(`║  WebP quality: ${WEBP_QUALITY}   |  AVIF quality: ${AVIF_QUALITY}                   ║`);
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const results = [];

  for (const file of files) {
    const inputPath = join(ASSETS_DIR, file);
    const { name } = parse(file);
    const originalStat = await stat(inputPath);
    const originalSize = originalStat.size;
    
    const maxWidth = RESIZE_MAP[name] || 1200;
    const hasAlpha = NEEDS_ALPHA.includes(file);

    console.log(`⏳ ${file} (${formatBytes(originalSize)}) → max ${maxWidth}px`);

    let pipeline = sharp(inputPath);
    
    // Obter metadados para resize inteligente
    const metadata = await sharp(inputPath).metadata();
    const shouldResize = metadata.width > maxWidth;
    
    if (shouldResize) {
      pipeline = sharp(inputPath).resize({
        width: maxWidth,
        withoutEnlargement: true,
        fit: 'inside',
      });
    }

    // ── WebP ──
    const webpPath = join(OUTPUT_DIR, `${name}.webp`);
    await pipeline.clone().webp({
      quality: WEBP_QUALITY,
      effort: 6,
      ...(hasAlpha ? { alphaQuality: 90 } : {}),
    }).toFile(webpPath);
    const webpSize = (await stat(webpPath)).size;

    // ── AVIF ──
    const avifPath = join(OUTPUT_DIR, `${name}.avif`);
    await pipeline.clone().avif({
      quality: AVIF_QUALITY,
      effort: 7,
      chromaSubsampling: '4:2:0',
    }).toFile(avifPath);
    const avifSize = (await stat(avifPath)).size;

    // ── PNG otimizado ──
    const pngPath = join(OUTPUT_DIR, `${name}.png`);
    await pipeline.clone().png({
      compressionLevel: PNG_COMPRESSION,
      adaptiveFiltering: true,
      palette: false,
    }).toFile(pngPath);
    const pngOptSize = (await stat(pngPath)).size;

    const result = {
      file,
      original: originalSize,
      png: pngOptSize,
      webp: webpSize,
      avif: avifSize,
      resized: shouldResize,
      origWidth: metadata.width,
      newWidth: shouldResize ? maxWidth : metadata.width,
    };
    results.push(result);

    console.log(`   ✅ PNG: ${formatBytes(pngOptSize)} (−${pct(originalSize, pngOptSize)}%)`);
    console.log(`   ✅ WebP: ${formatBytes(webpSize)} (−${pct(originalSize, webpSize)}%)`);
    console.log(`   ✅ AVIF: ${formatBytes(avifSize)} (−${pct(originalSize, avifSize)}%)`);
    if (shouldResize) {
      console.log(`   📐 Resize: ${metadata.width}px → ${maxWidth}px`);
    }
    console.log('');
  }

  // ── RELATÓRIO FINAL ──
  const totalOriginal = results.reduce((s, r) => s + r.original, 0);
  const totalWebp = results.reduce((s, r) => s + r.webp, 0);
  const totalAvif = results.reduce((s, r) => s + r.avif, 0);
  const totalPng = results.reduce((s, r) => s + r.png, 0);

  console.log('\n' + '═'.repeat(70));
  console.log('  📊 RELATÓRIO FINAL');
  console.log('═'.repeat(70));
  console.log('');

  // Tabela
  console.log('  Arquivo'.padEnd(32) + 'Original'.padStart(10) + 'WebP'.padStart(10) + 'AVIF'.padStart(10) + '  Economia');
  console.log('  ' + '─'.repeat(66));
  
  for (const r of results) {
    const best = Math.min(r.webp, r.avif);
    const bestFormat = r.avif <= r.webp ? 'AVIF' : 'WebP';
    console.log(
      `  ${r.file.padEnd(30)}${formatBytes(r.original).padStart(10)}${formatBytes(r.webp).padStart(10)}${formatBytes(r.avif).padStart(10)}  −${pct(r.original, best)}% (${bestFormat})`
    );
  }

  console.log('  ' + '─'.repeat(66));
  console.log(
    `  ${'TOTAL'.padEnd(30)}${formatBytes(totalOriginal).padStart(10)}${formatBytes(totalWebp).padStart(10)}${formatBytes(totalAvif).padStart(10)}  −${pct(totalOriginal, totalAvif)}% (AVIF)`
  );
  console.log('');
  console.log(`  💾 Economia total WebP: ${formatBytes(totalOriginal - totalWebp)} (−${pct(totalOriginal, totalWebp)}%)`);
  console.log(`  💾 Economia total AVIF: ${formatBytes(totalOriginal - totalAvif)} (−${pct(totalOriginal, totalAvif)}%)`);
  console.log(`  💾 Economia total PNG:  ${formatBytes(totalOriginal - totalPng)} (−${pct(totalOriginal, totalPng)}%)`);
  console.log('');
  console.log(`  📁 Arquivos salvos em: ${OUTPUT_DIR}`);
  console.log('═'.repeat(70));
  console.log('');
  console.log('  ✨ Próximo passo: copiar os arquivos optimized/ para assets/');
  console.log('     e atualizar o HTML com tags <picture> (AVIF + WebP + PNG fallback)');
  console.log('');
}

run().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
