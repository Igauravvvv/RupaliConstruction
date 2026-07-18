const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  { url: 'https://images.unsplash.com/photo-1617192661858-6902d3345e59?w=600&q=80', dest: 'structural/ultratech.webp' },
  { url: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600&q=80', dest: 'structural/shree-cement.webp' },
  { url: 'https://images.unsplash.com/photo-1585295599818-4a5719992f9d?w=600&q=80', dest: 'structural/tata-steel.webp' },
  { url: 'https://images.unsplash.com/photo-1612479426284-88062debfd01?w=600&q=80', dest: 'structural/jsw-steel.webp' },
  { url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80', dest: 'structural/rathi-steel.webp' },
  { url: 'https://images.unsplash.com/photo-1580213501704-5f5024213d29?w=600&q=80', dest: 'structural/aac-blocks.webp' },
  { url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&q=80', dest: 'structural/fly-ash-bricks.webp' },
  { url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&q=80', dest: 'structural/traditional-bricks.webp' },
  { url: 'https://images.unsplash.com/photo-1604561879007-9571fffc9e19?w=600&q=80', dest: 'structural/liquid-waterproofing.webp' },
  { url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80', dest: 'structural/cementitious-waterproofing.webp' },
  
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', dest: 'mep/daikin.webp' },
  { url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80', dest: 'mep/voltas.webp' },
  { url: 'https://images.unsplash.com/photo-1558223617-640c49987820?w=600&q=80', dest: 'mep/havells-switches.webp' },
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80', dest: 'mep/schneider.webp' },
  { url: 'https://images.unsplash.com/photo-1558442074-3c19857bc1dc?w=600&q=80', dest: 'mep/havells-wires.webp' },
  { url: 'https://images.unsplash.com/photo-1585802102170-c44760aed2cc?w=600&q=80', dest: 'mep/supreme-pipes.webp' },
  { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80', dest: 'mep/finolex-pipes.webp' },
  { url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=80', dest: 'mep/jaguar-fittings.webp' },
  { url: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&q=80', dest: 'mep/grohe-fittings.webp' },
  { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174296fc?w=600&q=80', dest: 'mep/geberit.webp' },
  
  { url: 'https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=600&q=80', dest: 'interior/century-ply.webp' },
  { url: 'https://images.unsplash.com/photo-1522030080646-3bb1d5e68ec8?w=600&q=80', dest: 'interior/action-tesa.webp' },
  { url: 'https://images.unsplash.com/photo-1506509923838-5110e58849b2?w=600&q=80', dest: 'interior/fenesta.webp' },
  { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', dest: 'interior/tostem.webp' },
  { url: 'https://images.unsplash.com/photo-1600566753086-00f18efc2294?w=600&q=80', dest: 'interior/alupure.webp' },
  { url: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=600&q=80', dest: 'interior/somany.webp' },
  { url: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb65?w=600&q=80', dest: 'interior/kajaria.webp' },
  
  { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80', dest: 'finishing/asian-paints.webp' },
  { url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80', dest: 'finishing/berger.webp' },
  { url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80', dest: 'finishing/wipro-finishing.webp' },
  { url: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&q=80', dest: 'finishing/syska-finishing.webp' },
  { url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&q=80', dest: 'finishing/havells-finishing.webp' }
];

const basePath = path.join(__dirname, 'public', 'assets', 'brand-standards');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function fetchImages() {
  console.log(`Fetching ${images.length} images...`);
  for (const img of images) {
    const fullPath = path.join(basePath, img.dest);
    try {
      await download(img.url, fullPath);
      console.log(`✅ Downloaded: ${img.dest}`);
    } catch (err) {
      console.error(`❌ Failed: ${img.dest}`, err.message);
    }
  }
  console.log('Done!');
}

fetchImages();
