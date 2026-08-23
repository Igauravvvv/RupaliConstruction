const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebp(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await convertToWebp(filePath);
    } else if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const ext = path.extname(file);
      const webpPath = filePath.replace(ext, '.webp');
      
      try {
        if (!fs.existsSync(webpPath)) {
          await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          
          const origSize = fs.statSync(filePath).size;
          const newSize = fs.statSync(webpPath).size;
          const savings = ((origSize - newSize) / origSize * 100).toFixed(1);
          console.log(`Converted ${file}: ${(origSize/1024).toFixed(1)}KB -> ${(newSize/1024).toFixed(1)}KB (Saved ${savings}%)`);
        }
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err);
      }
    }
  }
}

(async () => {
  console.log('Starting conversion...');
  await convertToWebp(path.join(__dirname, 'public'));
  console.log('Done!');
})();
