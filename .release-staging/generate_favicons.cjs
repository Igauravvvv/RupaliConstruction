const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  const inputPath = path.join(__dirname, 'public', 'logo-icon.png');
  const publicDir = path.join(__dirname, 'public');

  if (!fs.existsSync(inputPath)) {
    console.error('Error: logo-icon.png not found in public directory!');
    process.exit(1);
  }

  console.log('Generating Google Search optimized PNG favicons from logo-icon.png...');

  // Google requires multiples of 48px square (48, 96, 144, 192, 512) for search result icons
  const sizes = [48, 96, 144, 192, 512];

  for (const size of sizes) {
    const outPath = path.join(publicDir, `favicon-${size}x${size}.png`);
    await sharp(inputPath)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100 })
      .toFile(outPath);
    console.log(`Generated: favicon-${size}x${size}.png`);
  }

  // Apple Touch Icon (180x180)
  await sharp(inputPath)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated: apple-touch-icon.png');

  // Standard favicon.ico fallback (48x48 PNG format as .ico)
  await sharp(inputPath)
    .resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'favicon.ico'));
  console.log('Generated: favicon.ico');

  console.log('All favicons successfully generated!');
}

generateFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
