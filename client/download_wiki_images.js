import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const artists = [
  { id: 'a6', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Atif_Aslam_at_Badlapur_%28cropped%29.jpg' }
];

const dir = path.join(__dirname, 'public', 'artists');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function download() {
  for (const a of artists) {
    try {
      const res = await fetch(a.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(path.join(dir, `${a.id}.jpg`), Buffer.from(buffer));
        console.log(`Saved ${a.id}.jpg`);
      } else {
        console.log(`Failed ${a.id}:`, res.status);
      }
    } catch (e) {
      console.log(`Error ${a.id}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

download();
