const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  artist: { type: String, required: true, trim: true },
  album: { type: String, default: 'Unknown Album' },
  genre: { type: String, default: 'Unknown' },
  duration: { type: Number, default: 0 }, // in seconds
  coverImage: { type: String, default: '' },
  audioUrl: { type: String, required: true },
  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  year: { type: Number, default: new Date().getFullYear() }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
