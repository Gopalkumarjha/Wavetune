import { HiPlay, HiHeart, HiDotsVertical } from 'react-icons/hi';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SongCard = ({ song, queue = [] }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { isLiked, toggleLike, user } = useAuth();

  const isActive = currentSong?._id === song._id;
  const liked = isLiked(song._id);

  const handlePlay = () => {
    const songQueue = queue.length > 0 ? queue : [song];
    playSong(song, songQueue);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Login to like songs'); return; }
    const result = await toggleLike(song._id);
    toast(result ? '❤️ Liked!' : '💔 Unliked', { duration: 1200 });
  };

  const formatDuration = (secs) => {
    if (!secs) return '';
    return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
  };

  return (
    <div
      onClick={handlePlay}
      className={`song-card relative group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
        ${isActive ? 'ring-2 ring-wave-accent' : 'hover:scale-105'}`}
      style={{ background: 'linear-gradient(145deg, #12121a, #1a1a26)' }}
    >
      {/* Cover */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={song.coverImage || `https://picsum.photos/seed/${song._id}/300/300`}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = `https://picsum.photos/seed/${song.title}/300/300`; }}
        />
        {/* Overlay */}
        <div className="song-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
          <button className="w-12 h-12 rounded-full bg-wave-accent hover:bg-wave-accent/80 flex items-center justify-center text-white shadow-lg accent-glow transition-transform hover:scale-110">
            {isActive && isPlaying ? (
              <div className="flex gap-0.5 items-end h-5">
                <div className="eq-bar w-1 h-3" />
                <div className="eq-bar w-1 h-4" />
                <div className="eq-bar w-1 h-3" />
                <div className="eq-bar w-1 h-5" />
              </div>
            ) : (
              <HiPlay size={22} className="ml-0.5" />
            )}
          </button>
        </div>
        {/* Genre badge */}
        {song.genre && (
          <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-black/50 text-wave-muted backdrop-blur-sm">
            {song.genre}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className={`font-medium text-sm truncate ${isActive ? 'text-wave-accent' : 'text-wave-text'}`}>
          {song.title}
        </p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-wave-muted truncate">{song.artist}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            {song.duration && <span className="text-xs text-wave-muted">{formatDuration(song.duration)}</span>}
            <button
              onClick={handleLike}
              className={`transition-all ${liked ? 'text-wave-pink' : 'text-wave-muted hover:text-wave-pink opacity-0 group-hover:opacity-100'}`}
            >
              <HiHeart size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
