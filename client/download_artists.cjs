const fs = require('fs');
const https = require('https');
const path = require('path');

const artists = [
  { id: 'pritam', url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Pritam_Chakraborty.jpg' },
  { id: 'ar_rahman', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/A._R._Rahman_in_2023.jpg' },
  { id: 'arijit', url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Arijit_Singh_in_2022.jpg' },
  { id: 'sachin_jigar', url: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Sachin_Jigar.jpg' },
  { id: 'vishal_shekhar', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Vishal_Dadlani_and_Shekhar_Ravjiani.jpg' },
  { id: 'atif', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Atif_Aslam_2018_%28cropped%29.jpg' }
];

const dir = path.join(__dirname, 'public', 'artists');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

artists.forEach(artist => {
  const file = fs.createWriteStream(path.join(dir, `${artist.id}.jpg`));
  https.get(artist.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, function(response) {
    if (response.statusCode === 200) {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${artist.id}`);
      });
    } else {
        console.log(`Failed ${artist.id}: ${response.statusCode}`);
    }
  }).on('error', function(err) {
    fs.unlink(path.join(dir, `${artist.id}.jpg`));
    console.log(`Error ${artist.id}: ${err.message}`);
  });
});
