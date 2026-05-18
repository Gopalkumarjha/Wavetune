import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiPlay, HiTrash, HiMusicNote, HiDotsHorizontal } from 'react-icons/hi';
import { playlistAPI } from '../utils/api';
import SongRow from '../components/cards/SongRow';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playSong } = usePlayer();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPlaylist(); }, [id]);

  const fetchPlaylist = async () => {
    try {
      const { data } = await playlistAPI.getById(id);
      setPlaylist(data);
    } catch { toast.error('Playlist not found'); navigate('/library'); }
    finally { setLoading(false); }
  };

  const removeSong = async (songId) => {
    try {
      const { data } = await playlistAPI.removeSong(id, songId);
      setPlaylist(data);
      toast.success('Song removed');
    } catch { toast.error('Failed to remove song'); }
  };

  if (loading) return <LoadingSpinner text="Loading playlist..." />;
  if (!playlist) return null;

  const songs = playlist.songs || [];
  const colors = ['from-wave-accent/30', 'from-wave-pink/30', 'from-wave-cyan/30'];
  const colorClass = colors[playlist.name.length % colors.length];

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className={`relative rounded-3xl overflow-hidden p-8 mb-8 bg-gradient-to-br ${colorClass} to-wave-bg`}>
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 70% 30%, rgba(108,99,255,0.3), transparent)' }} />
        <div className="relative flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="w-32 h-32 rounded-2xl bg-wave-surface flex items-center justify-center shadow-lg flex-shrink-0 overflow-hidden">
            {songs.length > 0 ? (
              <div className="grid grid-cols-2 w-full h-full">
                {songs.slice(0, 4).map((s, i) => (
                  <img key={i} src={s.coverImage || `https://picsum.photos/seed/${s._id}/100`} className="w-full h-full object-cover" alt="" />
                ))}
              </div>
            ) : (
              <HiMusicNote size={48} className="text-wave-accent/40" />
            )}
          </div>
          <div>
            <p className="text-xs text-wave-muted uppercase tracking-widest mb-1">Playlist</p>
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-1">{playlist.name}</h1>
            {playlist.description && <p className="text-wave-muted mb-2">{playlist.description}</p>}
            <p className="text-wave-muted text-sm">{songs.length} songs</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      {songs.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => playSong(songs[0], songs)}
            className="flex items-center gap-3 px-8 py-3 bg-wave-accent hover:bg-wave-accent/80 rounded-full text-white font-medium transition-all accent-glow"
          >
            <HiPlay size={20} /> Play All
          </button>
        </div>
      )}

      {/* Songs */}
      {songs.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <p className="text-4xl mb-3">🎵</p>
          <p className="text-wave-text font-medium">This playlist is empty</p>
          <p className="text-wave-muted text-sm mt-1">Search for songs to add them here</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          {songs.map((song, i) => (
            <div key={song._id} className="group flex items-center">
              <div className="flex-1">
                <SongRow song={song} index={i} queue={songs} />
              </div>
              {user && playlist.owner?._id === user.id && (
                <button
                  onClick={() => removeSong(song._id)}
                  className="mr-4 opacity-0 group-hover:opacity-100 text-wave-muted hover:text-wave-pink transition-all p-2"
                  title="Remove from playlist"
                >
                  <HiTrash size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
