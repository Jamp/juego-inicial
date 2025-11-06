import sharp from 'sharp';
import { readFileSync } from 'fs';

const starBuffer = readFileSync('./public/star.png');

// Generar icon-192.png con fondo degradado
await sharp({
  create: {
    width: 192,
    height: 192,
    channels: 4,
    background: { r: 102, g: 126, b: 234, alpha: 1 } // #667eea
  }
})
  .composite([{
    input: await sharp(starBuffer).resize(140, 140).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('./public/icon-192.png');

console.log('✅ icon-192.png generado');

// Generar icon-512.png con fondo degradado
await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: { r: 102, g: 126, b: 234, alpha: 1 } // #667eea
  }
})
  .composite([{
    input: await sharp(starBuffer).resize(384, 384).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('./public/icon-512.png');

console.log('✅ icon-512.png generado');

// Generar apple-touch-icon.png (180x180 para iOS)
await sharp({
  create: {
    width: 180,
    height: 180,
    channels: 4,
    background: { r: 102, g: 126, b: 234, alpha: 1 } // #667eea
  }
})
  .composite([{
    input: await sharp(starBuffer).resize(130, 130).toBuffer(),
    gravity: 'center'
  }])
  .png()
  .toFile('./public/apple-touch-icon.png');

console.log('✅ apple-touch-icon.png generado');

console.log('\n🎉 ¡Todos los íconos generados exitosamente!');
