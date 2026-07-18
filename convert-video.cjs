const { execSync } = require('child_process');
const path = require('path');

const input = path.join(__dirname, 'public', 'animation video.mov');
const output = path.join(__dirname, 'public', 'animation-video.mp4');

console.log('Converting .mov to .mp4...');
console.log('Input:', input);
console.log('Output:', output);

try {
  execSync(`ffmpeg -i "${input}" -c:v libx264 -preset fast -crf 23 -c:a aac -movflags +faststart -y "${output}"`, {
    stdio: 'inherit'
  });
  console.log('✅ Conversion complete! File saved to:', output);
} catch (err) {
  console.error('❌ ffmpeg conversion failed:', err.message);
  process.exit(1);
}
