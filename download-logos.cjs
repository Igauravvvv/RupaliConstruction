const fs = require('fs');
const https = require('https');
const path = require('path');

const brands = [
  { name: 'UltraTech', domain: 'ultratechcement.com' },
  { name: 'Ambuja Cement', domain: 'ambujacement.com' },
  { name: 'ACC Cement', domain: 'acclimited.com' },
  { name: 'Shree Cement', domain: 'shreecement.com' },
  { name: 'Tata Tiscon', domain: 'tatasteel.com' },
  { name: 'Finolex', domain: 'finolexcables.com' },
  { name: 'Legrand', domain: 'legrand.co.in' },
  { name: 'Havells', domain: 'havells.com' },
  { name: 'Jaquar', domain: 'jaquar.com' },
  { name: 'Asian Paints', domain: 'asianpaints.com' },
  { name: 'Kohler', domain: 'kohler.co.in' },
  { name: 'Schneider', domain: 'se.com' },
  { name: 'Cera', domain: 'cera-india.com' },
  { name: 'Dr Fixit', domain: 'drfixit.co.in' }
];

const dir = path.join(process.cwd(), 'public', 'assets', 'logos');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

brands.forEach(brand => {
  const url = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${brand.domain}&size=256`;
  const filePath = path.join(dir, `${brand.name.replace(/ /g, '_')}.png`);
  const file = fs.createWriteStream(filePath);
  
  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${brand.name} to ${filePath}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${brand.name}:`, err.message);
  });
});
