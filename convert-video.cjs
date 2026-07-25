const { execSync } = require('child_process');
const path = require('path');

const input = path.join(__dirname, 'public', 'animation video.mov');
const output = path.join(__dirname, 'public', 'animation-video.mp4');

console.log('Converting .mov to .mp4...');
console.log('Input:', input);
console.log('Output:', output);

try {
  // Optimized for web delivery - lower CRF, fast start, scale to 720p
  execSync(`ffmpeg -i "${input}" -vf scale=-2:720 -c:v libx264 -preset veryfast -crf 28 -c:a aac -b:a 128k -movflags +faststart -y "${output}"`, {
    stdio: 'inherit'
  });
  console.log('✅ Conversion complete! File saved to:', output);
} catch (err) {
  console.error('❌ ffmpeg conversion failed:', err.message);
  process.exit(1);
}
