const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const targetDirs = [
  path.join(__dirname, 'server'),
  path.join(__dirname, 'api')
];

let count = 0;

targetDirs.forEach(dir => {
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      const newContent = content
        .replace(/(import|export)\s+([\s\S]*?)\s+from\s+(['"])(\.\.?\/[^'"]+)(['"])/g, (match, p1, p2, p3, p4, p5) => {
          if (p4.endsWith('.js') || p4.endsWith('.json') || p4.endsWith('.ts')) return match;
          return `${p1} ${p2} from ${p3}${p4}.js${p5}`;
        })
        .replace(/import\((['"])(\.\.?\/[^'"]+)(['"])\)/g, (match, p1, p2, p3) => {
          if (p2.endsWith('.js') || p2.endsWith('.json') || p2.endsWith('.ts')) return match;
          return `import(${p1}${p2}.js${p3})`;
        });

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log('Fixed imports in:', filePath);
        count++;
      }
    }
  });
});

console.log(`Updated imports in ${count} files.`);
