const fs = require('fs');
const path = require('path');
const https = require('https');

const brandDomains = {
  "UltraTech Cement": "ultratechcement.com",
  "UltraTech": "ultratechcement.com",
  "Ambuja Cement": "ambujacement.com",
  "ACC Cement": "acclimited.com",
  "Shree Cement": "shreecement.com",
  "Tata Tiscon": "tatatiscon.co.in",
  "Tata Steel": "tatasteel.com",
  "JSW Steel": "jsw.in",
  "Dr. Fixit": "drfixit.co.in",
  "Havells": "havells.com",
  "Schneider Electric": "se.com",
  "Legrand": "legrand.co.in",
  "Finolex Pipes": "finolexpipes.com",
  "Astral": "astralpipes.com",
  "Jaquar": "jaquar.com",
  "Kohler": "kohler.co.in",
  "Cera": "cera-india.com",
  "Century Ply": "centuryply.com",
  "Fenesta": "fenesta.com",
  "Kajaria": "kajariaceramics.com",
  "Asian Paints": "asianpaints.com",
  "Syska": "syska.co.in",
  "Godrej Locks": "godrej.com",
  "Hafele": "hafeleindia.com",
  "Saint-Gobain Gyproc": "gyproc.in",
  "Saint-Gobain": "saint-gobain.co.in",
  "Aludecor": "aludecor.com",
  "Daikin": "daikinindia.com",
  "Philips": "lighting.philips.co.in",
  "D'Decor": "ddecor.com",
  "Pidilite (Dr. Fixit)": "pidilite.com",
  "Birla Cement": "birlacorporation.com",
  "Kamdhenu Steel": "kamdhenulimited.com",
  "Jindal Steel": "jindalsteelpower.com",
  "SAIL": "sail.co.in",
  "Asian Granito": "aglasiangranito.com",
};

const outputDir = path.join(__dirname, 'public', 'assets', 'logos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(dest);
          if (stats.size < 1000) { // Tiny files are usually broken/empty
             console.log(`   -> File too small (${stats.size} bytes), likely broken placeholder. Deleting.`);
             fs.unlinkSync(dest);
          } else {
             console.log(`   -> Success! Saved to ${dest}`);
          }
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
         download(response.headers.location, dest).then(resolve).catch(reject);
      } else {
        console.log(`   -> Failed to download: ${response.statusCode}`);
        resolve(); // Continue anyway
      }
    }).on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.error(`   -> Error downloading: ${err.message}`);
      resolve();
    });
  });
}

async function main() {
  for (const [brand, domain] of Object.entries(brandDomains)) {
    const url = `https://logo.clearbit.com/${domain}?size=400`;
    const dest = path.join(outputDir, `${brand.replace(/ /g, '_')}.png`);
    console.log(`Downloading ${brand} (${url})...`);
    await download(url, dest);
  }
  console.log("Download process complete.");
}

main();
