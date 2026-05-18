import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import {
  HiPlay, HiPause, HiFastForward, HiRewind,
  HiVolumeUp, HiVolumeOff, HiSwitchHorizontal, HiRefresh, HiHeart,
} from 'react-icons/hi';
import { MdRepeatOne } from 'react-icons/md';
import { SiYoutube } from 'react-icons/si';
import toast from 'react-hot-toast';
import YouTubePlayer from './YouTubePlayer';

const MusicPlayer = () => {
  const {
    currentSong, isPlaying, duration, currentTime, volume, isMuted,
    isShuffled, repeatMode, isLoading,
    togglePlay, handleNext, handlePrev, seek,
    changeVolume, toggleMute, toggleShuffle, cycleRepeat, formatTime, isYouTubeSong,
  } = usePlayer();
  const { isLiked, toggleLike, user } = useAuth();

  // Empty player bar
  if (!currentSong) return (
    <>
      <YouTubePlayer />
      <div className="fixed bottom-20 left-6 right-6 md:left-[272px] md:right-8 h-24 glass-dark rounded-2xl border border-white/5 flex items-center justify-center z-50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3 text-wave-muted">
          <div className="flex gap-0.5 items-end h-4 opacity-40">
            <div className="w-0.5 h-2 bg-wave-accent rounded eq-bar" />
            <div className="w-0.5 h-3 bg-wave-accent rounded eq-bar" />
            <div className="w-0.5 h-2 bg-wave-accent rounded eq-bar" />
            <div className="w-0.5 h-4 bg-wave-accent rounded eq-bar" />
          </div>
          <p className="text-sm">Select a song to start playing</p>
        </div>
      </div>
    </>
  );

  const ytSong    = isYouTubeSong(currentSong);
  const liked     = !ytSong && isLiked(currentSong._id);
  const progress  = duration ? (currentTime / duration) * 100 : 0;
  const cover     = currentSong.coverImage || currentSong.thumbnail || `https://picsum.photos/seed/${currentSong._id}/56/56`;

  const handleLike = async () => {
    if (ytSong) { toast('Like YouTube songs by adding them to a playlist 🎵', { icon: '💡' }); return; }
    if (!user) { toast.error('Login to like songs'); return; }
    const ok = await toggleLike(currentSong._id);
    toast(ok ? '❤️ Added to liked songs' : '💔 Removed from liked songs', { duration: 1500 });
  };

  return (
    <>
      {/* Hidden YouTube iframe — always rendered so postMessage works */}
      <YouTubePlayer />

      <div className="fixed bottom-20 left-6 right-6 md:left-[272px] md:right-8 z-50 glass-dark rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 backdrop-blur-2xl transition-all duration-300" style={{ height: '90px' }}>
        <div className="w-full h-full flex items-center gap-4 px-4 md:px-6">

          {/* ── Song info ──────────────────────────────────────── */}
          <div className="flex items-center gap-3 w-52 min-w-0 flex-shrink-0">
            <div className="relative flex-shrink-0 group cursor-pointer" onClick={togglePlay}>
              <img
                src={cover}
                alt={currentSong.title}
                className={`w-14 h-14 rounded-xl object-cover transition-all duration-500 shadow-md
                  ${isPlaying ? 'shadow-[0_4px_16px_rgba(255,71,87,0.3)] ring-1 ring-wave-accent/50' : ''}`}
                onError={e => { e.target.src = `https://picsum.photos/seed/${currentSong._id}/56/56`; }}
              />
              {/* Equalizer overlay when playing */}
              {isPlaying && !isLoading && (
                <div className="absolute inset-0 rounded-xl flex items-end justify-center pb-2 gap-px bg-black/30">
                  <div className="eq-bar w-0.5 h-2.5" />
                  <div className="eq-bar w-0.5 h-3.5" />
                  <div className="eq-bar w-0.5 h-2.5" />
                  <div className="eq-bar w-0.5 h-4" />
                </div>
              )}
              {/* Loading spinner overlay */}
              {isLoading && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/50">
                  <div className="w-5 h-5 border-2 border-wave-border border-t-wave-accent rounded-full animate-spin" />
                </div>
              )}
              {/* Source badge */}
              {ytSong && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                  <SiYoutube size={9} className="text-white" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-wave-text truncate leading-tight">{currentSong.title}</p>
              <p className="text-xs text-wave-muted truncate mt-0.5">
                {currentSong.artist || currentSong.channelTitle}
              </p>
            </div>

            <button
              onClick={handleLike}
              title={ytSong ? 'YouTube song' : liked ? 'Unlike' : 'Like'}
              className={`flex-shrink-0 transition-all duration-200
                ${ytSong ? 'text-wave-muted/40 cursor-default' : liked ? 'text-wave-pink scale-110' : 'text-wave-muted hover:text-wave-pink'}`}
            >
              <HiHeart size={18} />
            </button>
          </div>

          {/* ── Center controls ────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center gap-1.5 max-w-lg mx-auto">
            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShuffle}
                title="Shuffle"
                className={`hidden sm:block transition-all ${isShuffled ? 'text-wave-accent drop-shadow-[0_0_6px_#6c63ff]' : 'text-wave-muted hover:text-wave-text'}`}
              >
                <HiSwitchHorizontal size={17} />
              </button>

              <button
                onClick={handlePrev}
                className="text-wave-muted hover:text-wave-text transition-all active:scale-95"
              >
                <HiRewind size={22} />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-wave-accent hover:bg-wave-pink flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(255,71,87,0.3)] hover:shadow-[0_8px_20px_rgba(255,71,87,0.4)]"
              >
                {isLoading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : isPlaying
                    ? <HiPause size={24} />
                    : <HiPlay size={24} className="ml-1" />
                }
              </button>

              <button
                onClick={handleNext}
                className="text-wave-muted hover:text-wave-text transition-all active:scale-95"
              >
                <HiFastForward size={22} />
              </button>

              <button
                onClick={cycleRepeat}
                title={repeatMode === 'none' ? 'No repeat' : repeatMode === 'all' ? 'Repeat all' : 'Repeat one'}
                className={`hidden sm:block transition-all ${repeatMode !== 'none' ? 'text-wave-accent drop-shadow-[0_0_6px_#6c63ff]' : 'text-wave-muted hover:text-wave-text'}`}
              >
                {repeatMode === 'one' ? <MdRepeatOne size={20} /> : <HiRefresh size={17} />}
              </button>
            </div>

            <div className="flex items-center gap-3 w-full px-2 player-slider-container">
              <span className="text-[11px] text-wave-muted font-medium w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
              <div className="flex-1 flex items-center h-4">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime || 0}
                  onChange={e => seek(parseFloat(e.target.value))}
                  className="w-full player-slider"
                  style={{
                    background: `linear-gradient(to right, var(--accent) ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
                  }}
                />
              </div>
              <span className="text-[11px] text-wave-muted font-medium w-8 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* ── Volume ─────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 w-36 flex-shrink-0 justify-end player-slider-container">
            {ytSong && (
              <span title="YouTube" className="text-red-500 opacity-70">
                <SiYoutube size={14} />
              </span>
            )}
            <button onClick={toggleMute} className="text-wave-muted hover:text-wave-text transition-all">
              {isMuted ? <HiVolumeOff size={18} /> : <HiVolumeUp size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => changeVolume(e.target.value)}
              className="w-20 player-slider"
              style={{
                background: `linear-gradient(to right, var(--accent) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.1) ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
