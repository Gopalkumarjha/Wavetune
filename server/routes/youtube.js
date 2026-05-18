/**
 * WaveTune - YouTube Search Route
 * Uses youtube-search-api to fetch real song results from YouTube.
 * Returns clean, structured JSON for the frontend player.
 */

const express = require('express');
const router = express.Router();
const YoutubeSearchApi = require('youtube-search-api');

/**
 * Parse ISO 8601 duration (PT3M45S) or YouTube's "3:45" format → "3:45"
 */
const parseDuration = (raw) => {
  if (!raw) return null;
  // Already "M:SS" style
  if (/^\d+:\d+$/.test(raw)) return raw;
  // ISO 8601 e.g. PT3M45S
  const match = raw.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return raw;
  const h = parseInt(match[1] || 0);
  const m = parseInt(match[2] || 0);
  const s = parseInt(match[3] || 0);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
};

/**
 * Normalize a raw YouTube search result item into our clean song shape.
 */
const normalizeItem = (item) => {
  if (!item || !item.id) return null;
  const videoId = typeof item.id === 'string' ? item.id : item.id?.videoId || item.id;
  if (!videoId || item.type === 'playlist' || item.type === 'channel') return null;

  // Pick the best thumbnail
  const thumbs = item.thumbnail?.thumbnails || [];
  const thumbnail =
    thumbs.find(t => t.width >= 320)?.url ||
    thumbs[thumbs.length - 1]?.url ||
    `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  return {
    videoId,
    title: item.title || 'Unknown Title',
    artist: item.channelTitle || item.shortBylineText?.runs?.[0]?.text || 'Unknown Artist',
    channelTitle: item.channelTitle || item.shortBylineText?.runs?.[0]?.text || '',
    thumbnail: thumbnail.startsWith('//') ? 'https:' + thumbnail : thumbnail,
    duration: parseDuration(item.length?.simpleText || item.lengthText?.simpleText || item.duration),
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`,
    views: item.shortViewCountText?.simpleText || null,
    // Unified ID used by player context
    _id: `yt_${videoId}`,
    // Player-compatible fields
    audioUrl: null, // playback handled via YouTube iframe
    coverImage: thumbnail.startsWith('//') ? 'https:' + thumbnail : thumbnail,
    album: 'YouTube',
    genre: 'YouTube',
    source: 'youtube',
  };
};

/**
 * GET /api/youtube/search/:query
 * Search YouTube for music tracks. Returns up to 20 clean results.
 */
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  const limit = Math.min(parseInt(req.query.limit) || 20, 20);

  if (!query || query.trim().length < 2) {
    return res.status(400).json({ message: 'Query must be at least 2 characters', results: [] });
  }

  try {
    // Append "music" to bias results toward music videos
    const searchTerm = `${query.trim()} music`;
    const data = await YoutubeSearchApi.GetListByKeyword(searchTerm, false, limit, [{ type: 'video' }]);

    const results = (data?.items || [])
      .map(normalizeItem)
      .filter(Boolean)
      .slice(0, limit);

    return res.json({ query, total: results.length, results });
  } catch (err) {
    console.error('[YouTube Search Error]', err.message);
    return res.status(502).json({
      message: 'YouTube search temporarily unavailable. Try again shortly.',
      error: err.message,
      results: [],
    });
  }
});

/**
 * GET /api/youtube/suggest/:query
 * Get autocomplete suggestions for a query.
 */
router.get('/suggest/:query', async (req, res) => {
  try {
    const data = await YoutubeSearchApi.GetSuggestData(req.params.query);
    res.json({ suggestions: data || [] });
  } catch (err) {
    res.json({ suggestions: [] });
  }
});

module.exports = router;
