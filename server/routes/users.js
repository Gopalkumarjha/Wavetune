const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/users/liked-songs
router.get('/liked-songs', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('likedSongs');
    res.json(user.likedSongs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/users/recently-played
router.get('/recently-played', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('recentlyPlayed.song');
    const recent = user.recentlyPlayed.filter(r => r.song).slice(0, 20);
    res.json(recent);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
