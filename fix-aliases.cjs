const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function getRelativePath(fromFile, toAlias) {
  const fromDir = path.dirname(fromFile);
  const rootDir = path.resolve(__dirname);
  
  let targetPath;
  if (toAlias.startsWith('@db/')) {
    targetPath = path.join(rootDir, 'db', toAlias.substring(4));
  } else if (toAlias.startsWith('@contracts/')) {
    targetPath = path.join(rootDir, 'contracts', toAlias.substring(11));
  } else if (toAlias.startsWith('@/')) {
    targetPath = path.join(rootDir, 'src', toAlias.substring(2));
  }
  
  if (!targetPath) return toAlias;
  
  let rel = path.relative(fromDir, targetPath).replace(/\\/g, '/');
  if (!rel.startsWith('.')) {
    rel = './' + rel;
  }
  return rel;
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
        .replace(/(import|export)\s+([\s\S]*?)\s+from\s+(["'])(@db\/[^"']+|@contracts\/[^"']+|@\/[^"']+)(["'])/g, (match, p1, p2, p3, p4, p5) => {
          let rel = getRelativePath(filePath, p4);
          if (!rel.endsWith('.js') && !rel.endsWith('.json') && !rel.endsWith('.ts')) {
             rel += '.js';
          }
          return `${p1} ${p2} from ${p3}${rel}${p5}`;
        })
        .replace(/import\((["'])(@db\/[^"']+|@contracts\/[^"']+|@\/[^"']+)(["'])\)/g, (match, p1, p2, p3) => {
          let rel = getRelativePath(filePath, p2);
          if (!rel.endsWith('.js') && !rel.endsWith('.json') && !rel.endsWith('.ts')) {
             rel += '.js';
          }
          return `import(${p1}${rel}${p3})`;
        });

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log('Fixed aliases in:', filePath);
        count++;
      }
    }
  });
});

console.log(`Updated aliases in ${count} files.`);
