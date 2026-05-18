// WaveTune Backend - Main Entry Point
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (audio, images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/users', require('./routes/users'));
app.use('/api/youtube', require('./routes/youtube'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'WaveTune API running 🎵', youtube: 'enabled' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wavetune';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log('🎵 WaveTune server running on port ' + PORT));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    app.listen(PORT, () => console.log('🎵 WaveTune server running on port ' + PORT + ' (no DB)'));
  });

module.exports = app;
