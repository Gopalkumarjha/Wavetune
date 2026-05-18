const fs = require('fs');

const artists = [
  {id: 'a1', name: 'Pritam', url: 'https://open.spotify.com/artist/1wRPtKGflJrBx9BmLsOkza'},
  {id: 'a2', name: 'A.R. Rahman', url: 'https://open.spotify.com/artist/1mYsTxnqsietlzjXIGAW54'},
  {id: 'a3', name: 'Arijit Singh', url: 'https://open.spotify.com/artist/4YRxDV8wROuPEcgZVDJ4M6'},
  {id: 'a4', name: 'Sachin-Jigar', url: 'https://open.spotify.com/artist/19LIcwdcwIGlmX2KHEHjE1'},
  {id: 'a5', name: 'Vishal-Shekhar', url: 'https://open.spotify.com/artist/6Mv8GjQa7LKFMzgoRiFtuP'},
  {id: 'a6', name: 'Atif Aslam', url: 'https://open.spotify.com/artist/2oSONSC9zQ4UonDKnLqksx'}
];

async function run() {
  const results = [];
  for (const a of artists) {
    try {
      const res = await fetch(a.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const text = await res.text();
      const match = text.match(/<meta property="og:image" content="([^"]+)"/);
      if (match) {
        console.log(a.name, match[1]);
        results.push(`  { id: '${a.id}', name: '${a.name}', image: '${match[1]}' },`);
      } else {
        console.log(a.name, 'NOT FOUND');
      }
    } catch (e) {
      console.log(a.name, e.message);
    }
    // Sleep 1 sec to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n\n--- RESULTS ---');
  console.log(results.join('\n'));
}

run();
