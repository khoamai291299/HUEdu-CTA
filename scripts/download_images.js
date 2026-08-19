const https = require('https');
const fs = require('fs');
const path = require('path');

const DRAWABLE_DIR = path.join(__dirname, '../android/app/src/main/res/drawable');

// Đảm bảo thư mục tồn tại
if (!fs.existsSync(DRAWABLE_DIR)) {
  fs.mkdirSync(DRAWABLE_DIR, { recursive: true });
}

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(DRAWABLE_DIR, filename);
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

const copyArtifact = (srcPath, filename) => {
  const dest = path.join(DRAWABLE_DIR, filename);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dest);
    console.log(`Copied ${filename}`);
  } else {
    console.log(`Warning: Local artifact ${srcPath} not found`);
  }
};

const arasaacImages = {
  // Specific ARASAAC IDs
  39387: 'arasaac_rice.png',
  2428: 'arasaac_fried_egg.png',
  2248: 'arasaac_water.png',
  2483: 'arasaac_orange.png',
  2326: 'arasaac_brush_teeth.png',
  24222: 'arasaac_jeans.png',
  2450: 'arasaac_book.png',
  2440: 'arasaac_pencil.png',
  2409: 'arasaac_pencil_eraser.png',
  // Remaining images fetched earlier via API search
  4952: 'arasaac_chicken.png',
  2573: 'arasaac_soup.png',
  2445: 'arasaac_milk.png',
  2618: 'arasaac_yogurt.png',
  2462: 'arasaac_apple.png',
  2530: 'arasaac_banana.png',
  2557: 'arasaac_watermelon.png',
  6456: 'arasaac_eat.png',
  6061: 'arasaac_drink.png',
  6479: 'arasaac_sleep.png',
  2309: 'arasaac_t_shirt.png',
  2340: 'arasaac_toy_car.png',
  3241: 'arasaac_ball.png',
  4945: 'arasaac_teddy_bear.png',
  26238: 'arasaac_doll.png',
  2359: 'arasaac_notebook.png',
};

const artifacts = {
  'media_1787153471570.png': 'local_wash_hands.png',
  'media_1787153526487.png': 'local_shower.png',
  'media_1787153591540.png': 'local_toilet.png',
  'media_1787154716354.png': 'local_wooden_blocks.png',
};

const ARTIFACT_DIR = 'C:\\Users\\Dinh Vu Anh Thuy\\.gemini\\antigravity-ide\\brain\\95b0dc6c-67d2-4563-b3d9-5b15842286f7\\.user_uploaded';

async function main() {
  console.log('Downloading ARASAAC images...');
  for (const [id, filename] of Object.entries(arasaacImages)) {
    const url = `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;
    try {
      await downloadImage(url, filename);
      console.log(`Downloaded ${filename}`);
    } catch (e) {
      console.error(`Error downloading ${filename}:`, e);
    }
  }

  console.log('\nCopying artifact images...');
  for (const [srcName, destName] of Object.entries(artifacts)) {
    const srcPath = path.join(ARTIFACT_DIR, srcName);
    copyArtifact(srcPath, destName);
  }
}

main();
