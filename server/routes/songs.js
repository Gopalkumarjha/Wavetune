const express = require('express');
const Song = require('../models/Song');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/songs - Get all songs
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, genre, limit = 50, page = 1 } = req.query;
    let query = {};
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { artist: { $regex: search, $options: 'i' } },
      { album: { $regex: search, $options: 'i' } }
    ];
    if (genre) query.genre = genre;
    const songs = await Song.find(query).limit(parseInt(limit)).skip((page-1)*limit).sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/songs/trending
router.get('/trending', async (req, res) => {
  try {
    const songs = await Song.find({ trending: true }).limit(10).sort({ plays: -1 });
    res.json(songs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/songs/featured
router.get('/featured', async (req, res) => {
  try {
    const songs = await Song.find({ featured: true }).limit(6);
    res.json(songs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/songs/:id
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/songs/:id/play - Increment play count
router.post('/:id/play', auth, async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } }, { new: true });
    // Add to recently played
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentlyPlayed: { song: req.params.id } }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recentlyPlayed: { $each: [{ song: req.params.id, playedAt: new Date() }], $position: 0, $slice: 20 } }
    });
    res.json(song);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/songs/:id/like - Like/unlike song
router.post('/:id/like', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isLiked = user.likedSongs.includes(req.params.id);
    if (isLiked) {
      await User.findByIdAndUpdate(req.user._id, { $pull: { likedSongs: req.params.id } });
      await Song.findByIdAndUpdate(req.params.id, { $inc: { likes: -1 } });
    } else {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { likedSongs: req.params.id } });
      await Song.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
    }
    res.json({ liked: !isLiked });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
