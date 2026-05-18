import { HiPlay, HiHeart, HiDotsVertical } from 'react-icons/hi';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SongRow = ({ song, index, queue = [], showIndex = true }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const { isLiked, toggleLike, user } = useAuth();

  const isActive = currentSong?._id === song._id;
  const liked = isLiked(song._id);

  const handlePlay = () => playSong(song, queue.length > 0 ? queue : [song]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Login to like songs'); return; }
    await toggleLike(song._id);
  };

  const formatDuration = (secs) => {
    if (!secs) return '--:--';
    return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
  };

  return (
    <div
      onClick={handlePlay}
      className={`group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        ${isActive ? 'bg-wave-accent/10' : 'hover:bg-wave-surface'}`}
    >
      {/* Index / Playing indicator */}
      {showIndex && (
        <div className="w-6 text-center flex-shrink-0">
          {isActive && isPlaying ? (
            <div className="flex gap-0.5 items-end justify-center h-4">
              <div className="eq-bar w-1 h-2" style={{ animationDuration: '0.8s' }} />
              <div className="eq-bar w-1 h-3" style={{ animationDuration: '1.1s' }} />
              <div className="eq-bar w-1 h-2" style={{ animationDuration: '0.9s' }} />
            </div>
          ) : (
            <span className={`text-sm ${isActive ? 'text-wave-accent' : 'text-wave-muted group-hover:hidden'}`}>
              {index + 1}
            </span>
          )}
          <HiPlay size={16} className="hidden group-hover:block text-wave-text mx-auto" style={{ display: isActive && isPlaying ? 'none' : undefined }} />
        </div>
      )}

      {/* Cover */}
      <img
        src={song.coverImage || `https://picsum.photos/seed/${song._id}/48/48`}
        alt={song.title}
        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        onError={e => { e.target.src = `https://picsum.photos/seed/${song.title}/48/48`; }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-wave-accent' : 'text-wave-text'}`}>
          {song.title}
        </p>
        <p className="text-xs text-wave-muted truncate">{song.artist}</p>
      </div>

      {/* Album */}
      <p className="hidden md:block text-xs text-wave-muted truncate w-32">{song.album}</p>

      {/* Like */}
      <button
        onClick={handleLike}
        className={`transition-all ${liked ? 'text-wave-pink' : 'text-wave-muted hover:text-wave-pink opacity-0 group-hover:opacity-100'}`}
      >
        <HiHeart size={16} />
      </button>

      {/* Duration */}
      <span className="text-xs text-wave-muted w-10 text-right flex-shrink-0">
        {formatDuration(song.duration)}
      </span>
    </div>
  );
};

export default SongRow;
