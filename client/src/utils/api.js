import axios from 'axios';

const API = axios.create({
  baseURL: 'https://wavetune-i8hy.onrender.com/api'
});

// Auto-attach JWT token on every request
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('wavetune_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ─── MongoDB song endpoints ──────────────────────────────────────────────────
export const songAPI = {
  getAll:     (params) => API.get('/songs', { params }),
  getTrending:() => API.get('/songs/trending'),
  getFeatured:() => API.get('/songs/featured'),
  getById:    (id) => API.get(`/songs/${id}`),
  like:       (id) => API.post(`/songs/${id}/like`),
  play:       (id) => API.post(`/songs/${id}/play`),
};

// ─── YouTube search endpoints ────────────────────────────────────────────────
export const youtubeAPI = {
  /**
   * Search YouTube for songs.
   * @param {string} query - Search term
   * @param {number} limit - Max results (default 20)
   * @returns Promise<{ query, total, results: YouTubeSong[] }>
   */
  search:  (query, limit = 20) => API.get(`/youtube/search/${encodeURIComponent(query)}`, { params: { limit } }),
  suggest: (query) => API.get(`/youtube/suggest/${encodeURIComponent(query)}`),
};

// ─── Playlist endpoints ──────────────────────────────────────────────────────
export const playlistAPI = {
  getAll:    () => API.get('/playlists'),
  getById:   (id) => API.get(`/playlists/${id}`),
  create:    (data) => API.post('/playlists', data),
  update:    (id, data) => API.put(`/playlists/${id}`, data),
  delete:    (id) => API.delete(`/playlists/${id}`),
  addSong:   (id, songId) => API.post(`/playlists/${id}/songs`, { songId }),
  removeSong:(id, songId) => API.delete(`/playlists/${id}/songs/${songId}`),
};

// ─── User endpoints ──────────────────────────────────────────────────────────
export const userAPI = {
  getLikedSongs:    () => API.get('/users/liked-songs'),
  getRecentlyPlayed:() => API.get('/users/recently-played'),
};

export default API;
