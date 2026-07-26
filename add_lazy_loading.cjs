const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

let modifiedFiles = 0;
const skipFiles = ['Hero.tsx', 'Navbar.tsx', 'SplashScreen.tsx', 'CinematicReveal.tsx']; // Likely above the fold

walkDir(path.join(__dirname, 'src'), (filePath) => {
  if (filePath.endsWith('.tsx') && !skipFiles.some(skip => filePath.endsWith(skip))) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if it has an img tag without loading attribute
    if (content.includes('<img ') && !content.includes('loading=')) {
      // Simple replace
      const newContent = content.replace(/<img /g, '<img loading="lazy" ');
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log('Added lazy loading to:', filePath);
        modifiedFiles++;
      }
    }
  }
});

console.log(`Added loading="lazy" to ${modifiedFiles} files.`);
