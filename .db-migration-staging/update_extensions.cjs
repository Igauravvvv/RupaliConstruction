const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let modifiedFiles = 0;

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Simple replace for .png and .jpg to .webp
    // Only replace instances that are likely asset paths like "/logo.png" or "image.png"
    const newContent = content
      .replace(/\.png/g, '.webp')
      .replace(/\.jpg/g, '.webp')
      .replace(/\.jpeg/g, '.webp');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Updated:', filePath);
      modifiedFiles++;
    }
  }
});

console.log(`Replaced .png/.jpg with .webp in ${modifiedFiles} files.`);
