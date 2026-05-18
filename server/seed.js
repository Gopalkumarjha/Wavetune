// Seed script - populates DB with sample songs
const mongoose = require('mongoose');
const Song = require('./models/Song');
require('dotenv').config();

const sampleSongs = [
  {
    title: "Midnight Drive",
    artist: "Echo Waves",
    album: "Night Sessions",
    genre: "Electronic",
    duration: 212,
    coverImage: "https://picsum.photos/seed/song1/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    plays: 15420, trending: true, featured: true, year: 2024
  },
  {
    title: "Solar Flare",
    artist: "The Cosmic Band",
    album: "Galaxy EP",
    genre: "Indie Rock",
    duration: 189,
    coverImage: "https://picsum.photos/seed/song2/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    plays: 9870, trending: true, year: 2024
  },
  {
    title: "Ocean Breeze",
    artist: "Luna Shores",
    album: "Coastal Vibes",
    genre: "Chill",
    duration: 245,
    coverImage: "https://picsum.photos/seed/song3/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    plays: 23100, trending: true, featured: true, year: 2023
  },
  {
    title: "Neon Pulse",
    artist: "Synthwave City",
    album: "Electric Dreams",
    genre: "Synthwave",
    duration: 198,
    coverImage: "https://picsum.photos/seed/song4/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    plays: 7540, trending: true, year: 2024
  },
  {
    title: "Golden Hour",
    artist: "Amber Lights",
    album: "Sunsets",
    genre: "Pop",
    duration: 222,
    coverImage: "https://picsum.photos/seed/song5/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    plays: 31200, trending: true, featured: true, year: 2024
  },
  {
    title: "Forest Rain",
    artist: "Nature Sounds",
    album: "Earth Sessions",
    genre: "Ambient",
    duration: 310,
    coverImage: "https://picsum.photos/seed/song6/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    plays: 5200, year: 2023
  },
  {
    title: "City Lights",
    artist: "Urban Flow",
    album: "Metropolitan",
    genre: "Hip-Hop",
    duration: 176,
    coverImage: "https://picsum.photos/seed/song7/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    plays: 18900, trending: true, year: 2024
  },
  {
    title: "Starfall",
    artist: "Astral Project",
    album: "Cosmos",
    genre: "Electronic",
    duration: 267,
    coverImage: "https://picsum.photos/seed/song8/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    plays: 12300, featured: true, year: 2024
  },
  {
    title: "Crimson Sky",
    artist: "Red Horizon",
    album: "Dusk",
    genre: "Indie Rock",
    duration: 201,
    coverImage: "https://picsum.photos/seed/song9/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    plays: 8700, year: 2023
  },
  {
    title: "Velvet Underground",
    artist: "Silky Strings",
    album: "Smooth Jazz Vol 1",
    genre: "Jazz",
    duration: 290,
    coverImage: "https://picsum.photos/seed/song10/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    plays: 6400, year: 2023
  },
  {
    title: "Electric Storm",
    artist: "Thunder Beats",
    album: "Power Up",
    genre: "Electronic",
    duration: 185,
    coverImage: "https://picsum.photos/seed/song11/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    plays: 14500, trending: true, year: 2024
  },
  {
    title: "Peaceful Morning",
    artist: "Dawn Walker",
    album: "Sunrise",
    genre: "Acoustic",
    duration: 234,
    coverImage: "https://picsum.photos/seed/song12/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    plays: 9200, year: 2024
  }
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wavetune');
  await Song.deleteMany({});
  await Song.insertMany(sampleSongs);
  console.log('✅ Database seeded with', sampleSongs.length, 'songs');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
