const express = require('express');
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

// GET /api/playlists - User's playlists
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate('songs');
    res.json(playlists);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/playlists - Create playlist
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const playlist = await Playlist.create({ name, description, isPublic, owner: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $push: { playlists: playlist._id } });
    res.status(201).json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/playlists/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs').populate('owner', 'username');
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/playlists/:id - Update playlist
router.put('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    Object.assign(playlist, req.body);
    await playlist.save();
    res.json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/playlists/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { $pull: { playlists: req.params.id } });
    res.json({ message: 'Playlist deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/playlists/:id/songs - Add song to playlist
router.post('/:id/songs', auth, async (req, res) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $addToSet: { songs: songId } },
      { new: true }
    ).populate('songs');
    res.json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/playlists/:id/songs/:songId
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $pull: { songs: req.params.songId } },
      { new: true }
    ).populate('songs');
    res.json(playlist);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
