/**
 * WaveTune Search Page
 * Live YouTube + MongoDB search with debouncing, Bollywood genre tiles with images,
 * skeleton loading, and a Spotify-inspired result layout.
 */
import { useState, useEffect, useRef } from 'react';
import {
  HiSearch, HiX, HiPlay, HiMusicNote,
} from 'react-icons/hi';
import { SiYoutube } from 'react-icons/si';
import { HiSparkles } from 'react-icons/hi2';
import axios from 'axios';
import { songAPI } from '../utils/api';
import { usePlayer } from '../context/PlayerContext';

// ─── Genre tiles with reliable images ──────────────────────────────────────────
const GENRES = [
  { label: 'Bollywood', bgColor: 'bg-orange-500', image: 'https://picsum.photos/seed/bolly/400/400' },
  { label: 'Hip-Hop', bgColor: 'bg-yellow-500', image: 'https://picsum.photos/seed/hiphop/400/400' },
  { label: 'Electronic', bgColor: 'bg-cyan-500', image: 'https://picsum.photos/seed/edm/400/400' },
  { label: 'Rock', bgColor: 'bg-red-600', image: 'https://picsum.photos/seed/rock/400/400' },
  { label: 'Romantic', bgColor: 'bg-pink-500', image: 'https://picsum.photos/seed/romantic/400/400' },
  { label: 'Classical', bgColor: 'bg-purple-500', image: 'https://picsum.photos/seed/classical/400/400' },
  { label: 'R&B', bgColor: 'bg-indigo-500', image: 'https://picsum.photos/seed/rnb/400/400' },
  { label: 'Devotional', bgColor: 'bg-amber-600', image: 'https://picsum.photos/seed/devotion/400/400' },
  { label: 'Punjabi', bgColor: 'bg-emerald-500', image: 'https://picsum.photos/seed/punjabi/400/400' },
  { label: 'K-Pop', bgColor: 'bg-fuchsia-500', image: 'https://picsum.photos/seed/kpop/400/400' },
];

// ─── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#12121a' }}>
    <div className="aspect-square bg-wave-surface" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-wave-surface rounded w-4/5" />
      <div className="h-3 bg-wave-surface rounded w-3/5" />
    </div>
  </div>
);

// ─── YouTube result card ───────────────────────────────────────────────────────
const YTSongCard = ({ song, queue }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?._id === song._id;

  return (
    <div
      onClick={() => playSong(song, queue)}
      className={`song-card group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
        ${isActive ? 'ring-2 ring-red-500' : 'hover:scale-105'}`}
      style={{ background: 'linear-gradient(145deg, #12121a, #1a1a26)' }}
    >
      <div className="relative aspect-square overflow-hidden bg-wave-surface">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = `https://picsum.photos/seed/${song.videoId}/300/300`; }}
        />
        <div className="song-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110">
            {isActive && isPlaying
              ? <div className="flex gap-0.5 items-end h-5">
                  <div className="eq-bar w-1 h-3" />
                  <div className="eq-bar w-1 h-4" />
                  <div className="eq-bar w-1 h-3" />
                  <div className="eq-bar w-1 h-5" />
                </div>
              : <HiPlay size={22} className="ml-0.5" />
            }
          </button>
        </div>
        {song.duration && (
          <span className="absolute bottom-2 right-2 text-xs px-1.5 py-0.5 rounded bg-black/75 text-white font-mono">
            {song.duration}
          </span>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm">
          <SiYoutube size={10} className="text-red-500" />
          <span className="text-xs text-white/80">YouTube</span>
        </div>
      </div>
      <div className="p-3">
        <p className={`font-medium text-sm truncate leading-snug ${isActive ? 'text-red-400' : 'text-wave-text'}`}>
          {song.title}
        </p>
        <p className="text-xs text-wave-muted truncate mt-0.5">{song.artist}</p>
      </div>
    </div>
  );
};

// ─── YouTube result row ────────────────────────────────────────────────────────
const YTSongRow = ({ song, index, queue }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?._id === song._id;

  return (
    <div
      onClick={() => playSong(song, queue)}
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${isActive ? 'bg-red-500/10' : 'hover:bg-wave-surface'}`}
    >
      <div className="w-6 text-center flex-shrink-0">
        {isActive && isPlaying ? (
          <div className="flex gap-px items-end justify-center h-4">
            <div className="eq-bar w-0.5 h-2 bg-red-400" style={{ animationDuration: '0.8s' }} />
            <div className="eq-bar w-0.5 h-3 bg-red-400" style={{ animationDuration: '1.1s' }} />
            <div className="eq-bar w-0.5 h-2 bg-red-400" style={{ animationDuration: '0.9s' }} />
          </div>
        ) : (
          <>
            <span className={`text-sm group-hover:hidden ${isActive ? 'text-red-400' : 'text-wave-muted'}`}>
              {index + 1}
            </span>
            <HiPlay size={15} className="hidden group-hover:block text-wave-text mx-auto" />
          </>
        )}
      </div>
      <div className="relative flex-shrink-0">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-10 h-10 rounded-lg object-cover"
          onError={e => { e.target.src = `https://picsum.photos/seed/${song.videoId}/40/40`; }}
        />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center">
          <SiYoutube size={7} className="text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-red-400' : 'text-wave-text'}`}>
          {song.title}
        </p>
        <p className="text-xs text-wave-muted truncate">{song.artist}</p>
      </div>
      {song.duration && (
        <span className="text-xs text-wave-muted tabular-nums flex-shrink-0">{song.duration}</span>
      )}
    </div>
  );
};

// ─── Genre Tile (with album art background) ───────────────────────────────────
const GenreTile = ({ genre, onClick }) => {
  return (
    <button
      onClick={() => onClick(genre.label)}
      className={`relative overflow-hidden rounded-lg text-left transition-all duration-300 hover:scale-105 ${genre.bgColor}`}
      style={{ aspectRatio: '1 / 1' }}
    >
      <div className="absolute top-4 left-4 z-10">
        <h3 className="font-bold text-white text-xl md:text-2xl drop-shadow-md">
          {genre.label}
        </h3>
      </div>
      <img
        src={genre.image}
        alt={genre.label}
        className="absolute w-[65%] h-[65%] bottom-0 right-0 object-cover shadow-[0_10px_30px_rgba(0,0,0,0.6)] translate-x-[20%] translate-y-[5%] rotate-[25deg] rounded-md"
      />
    </button>
  );
};

// ─── Inline DB song row ────────────────────────────────────────────────────────
const DbSongRow = ({ song, index, queue }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const isActive = currentSong?._id === song._id;

  const fmt = (s) => {
    if (!s) return '--:--';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  };

  return (
    <div
      onClick={() => playSong(song, queue)}
      className={`group flex items-center gap-4 px-4 py-3 cursor-pointer transition-all
        ${isActive ? 'bg-wave-accent/10' : 'hover:bg-wave-surface'}`}
    >
      <div className="w-6 text-center flex-shrink-0">
        {isActive && isPlaying
          ? <div className="flex gap-px items-end justify-center h-4">
              <div className="eq-bar w-0.5 h-2" />
              <div className="eq-bar w-0.5 h-3" />
              <div className="eq-bar w-0.5 h-2" />
            </div>
          : <>
              <span className={`text-sm group-hover:hidden ${isActive ? 'text-wave-accent' : 'text-wave-muted'}`}>{index + 1}</span>
              <HiPlay size={14} className="hidden group-hover:block text-wave-text mx-auto" />
            </>
        }
      </div>
      <img
        src={song.coverImage || `https://picsum.photos/seed/${song._id}/40/40`}
        alt={song.title}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-wave-accent' : 'text-wave-text'}`}>{song.title}</p>
        <p className="text-xs text-wave-muted truncate">{song.artist}</p>
      </div>
      <p className="hidden md:block text-xs text-wave-muted truncate w-32">{song.album}</p>
      <span className="text-xs text-wave-muted w-10 text-right flex-shrink-0 tabular-nums">{fmt(song.duration)}</span>
    </div>
  );
};

// ─── Main Search Page ──────────────────────────────────────────────────────────
const Search = () => {
  const [query, setQuery]         = useState('');
  const [ytResults, setYtResults] = useState([]);
  const [dbResults, setDbResults] = useState([]);
  const [allSongs, setAllSongs]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);
  const [viewMode, setViewMode]   = useState('grid');
  const [error, setError]         = useState(null);

  const inputRef    = useRef(null);
  const debounceRef = useRef(null);
  const searchGenre = (genre) => {
  doSearch(genre.label);
};

  useEffect(() => {
    inputRef.current?.focus();
    songAPI.getAll({ limit: 50 }).then(({ data }) => setAllSongs(data)).catch(() => {});
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setYtResults([]);
      setDbResults([]);
      setSearched(false);
      setError(null);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query.trim()), 450);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const doSearch = async (q) => {
  setLoading(true);
  setError(null);
  setSearched(true);

  const [ytRes, dbRes] = await Promise.allSettled([
    axios.get(
      `https://wavetune-i8hy.onrender.com/api/youtube/search/${encodeURIComponent(q)}`
    ),
    songAPI.getAll({ search: q }),
  ]);

  setYtResults(
    ytRes.status === 'fulfilled'
      ? ytRes.value.data.results || []
      : []
  );

  setDbResults(
    dbRes.status === 'fulfilled'
      ? dbRes.value.data || []
      : []
  );

  if (ytRes.status === 'rejected') {
    console.error(ytRes.reason);

    if (ytRes.reason?.code === 'ECONNABORTED') {
      setError('Backend waking up... try again in 30 seconds.');
    } else {
      setError(ytRes.reason?.message || 'Search failed');
    }
  }

  setLoading(false);
};

  const hasResults = ytResults.length > 0 || dbResults.length > 0;

  return (
    <div className="animate-fade-in space-y-8 pb-8">

      {/* ── Search bar ─────────────────────────────────────────────── */}
      <div className="relative">
        <HiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-wave-muted pointer-events-none"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search YouTube for any song, artist, or album…"
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-wave-surface border border-wave-border text-wave-text
                     placeholder-wave-muted focus:outline-none focus:border-wave-accent focus:ring-1 focus:ring-wave-accent/30
                     transition-all text-base"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-wave-muted hover:text-wave-text transition-colors"
          >
            <HiX size={18} />
          </button>
        )}
      </div>

      {/* ── Loading skeletons ────────────────────────────────────────── */}
      {loading && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-32 h-4 bg-wave-surface rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {/* ── Error banner ─────────────────────────────────────────────── */}
      {error && !loading && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm">
          <span className="text-xl leading-none mt-0.5">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* ── YouTube results ───────────────────────────────────────────── */}
      {!loading && ytResults.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-wave-text flex items-center gap-2">
              <SiYoutube className="text-red-500" size={20} />
              YouTube Results
              <span className="text-wave-muted font-normal text-sm">({ytResults.length})</span>
            </h2>
            <div className="flex items-center gap-1 bg-wave-surface rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${viewMode === 'grid' ? 'bg-wave-accent text-white' : 'text-wave-muted hover:text-wave-text'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${viewMode === 'list' ? 'bg-wave-accent text-white' : 'text-wave-muted hover:text-wave-text'}`}
              >
                List
              </button>
            </div>
          </div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ytResults.map(song => (
                <YTSongCard key={song._id} song={song} queue={ytResults} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              {ytResults.map((song, i) => (
                <YTSongRow key={song._id} song={song} index={i} queue={ytResults} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── MongoDB local results ─────────────────────────────────────── */}
      {!loading && dbResults.length > 0 && (
        <section>
          <h2 className="font-display font-bold text-lg text-wave-text flex items-center gap-2 mb-4">
            <HiMusicNote className="text-wave-accent" size={18} />
            Local Library
            <span className="text-wave-muted font-normal text-sm">({dbResults.length})</span>
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-4 py-3 border-b border-wave-border text-xs text-wave-muted uppercase tracking-wider">
              <span className="w-6 text-center">#</span>
              <span className="w-10" />
              <span className="flex-1">Title</span>
              <span className="hidden md:block w-32">Album</span>
              <span className="w-10 text-right">Time</span>
            </div>
            {dbResults.map((song, i) => (
              <DbSongRow key={song._id} song={song} index={i} queue={dbResults} />
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {!loading && searched && !hasResults && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-6xl">🔍</div>
          <div className="text-center">
            <p className="text-wave-text font-semibold text-lg">No results for "{query}"</p>
            <p className="text-wave-muted text-sm mt-1">Try a different search term or check your connection</p>
          </div>
          <button
            onClick={() => setQuery('')}
            className="mt-2 px-5 py-2.5 bg-wave-surface border border-wave-border rounded-xl text-wave-text text-sm hover:border-wave-accent transition-all"
          >
            Clear search
          </button>
        </div>
      )}

      {/* ── Browse by Genre (shown before searching) ──────────────────── */}
      {!query && !loading && (
        <section>
          <h2 className="font-display font-bold text-2xl hover:underline cursor-pointer text-white mb-5">
            Browse all
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {GENRES.map(g => (
              <GenreTile key={g.label} genre={g} onClick={searchGenre} />
            ))}
          </div>

          {/* All local songs */}
          {allSongs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display font-bold text-xl text-wave-text mb-4 flex items-center gap-2">
                <HiMusicNote className="text-wave-accent" /> All Songs
              </h2>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center gap-4 px-4 py-3 border-b border-wave-border text-xs text-wave-muted uppercase tracking-wider">
                  <span className="w-6 text-center">#</span>
                  <span className="w-10" />
                  <span className="flex-1">Title</span>
                  <span className="hidden md:block w-32">Album</span>
                  <span className="w-10 text-right">Time</span>
                </div>
                {allSongs.map((song, i) => (
                  <DbSongRow key={song._id} song={song} index={i} queue={allSongs} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Search;
