import { useState, useEffect } from 'react';
import { HiHeart } from 'react-icons/hi';
import { userAPI } from '../utils/api';
import SongRow from '../components/cards/SongRow';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';

const LikedSongs = () => {
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchLiked();
    else setLoading(false);
  }, [user]);

  const fetchLiked = async () => {
    try { const { data } = await userAPI.getLikedSongs(); setSongs(data); }
    catch {} finally { setLoading(false); }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <HiHeart size={64} className="text-wave-pink/30" />
      <div className="text-center">
        <h2 className="font-display font-bold text-2xl mb-2">Your liked songs</h2>
        <p className="text-wave-muted mb-6">Login to see and manage your liked songs</p>
        <Link to="/login" className="px-6 py-3 bg-wave-accent text-white rounded-full font-medium hover:bg-wave-accent/80 transition-all">
          Log In
        </Link>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner text="Loading liked songs..." />;

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 mb-8"
        style={{ background: 'linear-gradient(135deg, #2d1040, #1a0a2e)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 50%, rgba(255,107,157,0.2), transparent)' }} />
        <div className="relative flex items-end gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-wave-pink to-wave-accent flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 0 40px rgba(255,107,157,0.4)' }}>
            <HiHeart size={44} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-wave-muted uppercase tracking-widest mb-1">Playlist</p>
            <h1 className="font-display font-bold text-3xl md:text-4xl">Liked Songs</h1>
            <p className="text-wave-muted mt-1">{songs.length} songs</p>
          </div>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">💔</p>
          <p className="text-wave-text font-medium">No liked songs yet</p>
          <p className="text-wave-muted text-sm mt-1">Heart a song to add it here</p>
        </div>
      ) : (
        <>
          <button
            onClick={() => playSong(songs[0], songs)}
            className="mb-6 flex items-center gap-3 px-6 py-3 bg-wave-accent hover:bg-wave-accent/80 rounded-full text-white font-medium transition-all accent-glow"
          >
            Play All
          </button>
          <div className="glass rounded-2xl overflow-hidden">
            {songs.map((song, i) => (
              <SongRow key={song._id} song={song} index={i} queue={songs} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LikedSongs;
