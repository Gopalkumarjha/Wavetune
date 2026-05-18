import { useState, useEffect } from 'react';
import { HiCollection, HiPlus, HiTrash } from 'react-icons/hi';
import { playlistAPI } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Library = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPlaylists();
    else setLoading(false);
  }, [user]);

  const fetchPlaylists = async () => {
    try { const { data } = await playlistAPI.getAll(); setPlaylists(data); }
    catch {} finally { setLoading(false); }
  };

  const createPlaylist = async () => {
    const name = prompt('Playlist name:');
    if (!name) return;
    try {
      const { data } = await playlistAPI.create({ name });
      setPlaylists(prev => [data, ...prev]);
      toast.success('Playlist created! 🎵');
    } catch { toast.error('Failed to create playlist'); }
  };

  const deletePlaylist = async (id) => {
    if (!confirm('Delete this playlist?')) return;
    try {
      await playlistAPI.delete(id);
      setPlaylists(prev => prev.filter(p => p._id !== id));
      toast.success('Playlist deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <HiCollection size={64} className="text-wave-accent/30" />
      <div className="text-center">
        <h2 className="font-display font-bold text-2xl mb-2">Your Library</h2>
        <p className="text-wave-muted mb-6">Login to create and manage playlists</p>
        <Link to="/login" className="px-6 py-3 bg-wave-accent text-white rounded-full font-medium hover:bg-wave-accent/80 transition-all">Log In</Link>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner text="Loading library..." />;

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl">Your Library</h1>
        <button
          onClick={createPlaylist}
          className="flex items-center gap-2 px-4 py-2.5 bg-wave-accent hover:bg-wave-accent/80 rounded-xl text-white text-sm font-medium transition-all"
        >
          <HiPlus size={18} /> New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🎵</p>
          <p className="text-wave-text font-medium">No playlists yet</p>
          <p className="text-wave-muted text-sm mt-1 mb-6">Create your first playlist</p>
          <button onClick={createPlaylist} className="px-6 py-3 bg-wave-surface border border-wave-border text-wave-text rounded-full hover:border-wave-accent transition-all">
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map(p => (
            <Link
              key={p._id}
              to={`/playlist/${p._id}`}
              className="group glass rounded-2xl p-4 hover:border-wave-accent/30 transition-all hover:scale-105"
            >
              <div className="aspect-square rounded-xl bg-wave-surface mb-3 flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1a1a3e, #0a1520)' }}>
                {p.songs?.length > 0 ? (
                  <div className="grid grid-cols-2 w-full h-full">
                    {p.songs.slice(0, 4).map((s, i) => (
                      <img key={i} src={s.coverImage || `https://picsum.photos/seed/${s._id}/100/100`}
                        className="w-full h-full object-cover" alt="" />
                    ))}
                  </div>
                ) : (
                  <HiCollection size={40} className="text-wave-accent/40" />
                )}
              </div>
              <p className="font-medium text-sm text-wave-text truncate mb-1">{p.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-wave-muted">{p.songs?.length || 0} songs</p>
                <button
                  onClick={e => { e.preventDefault(); deletePlaylist(p._id); }}
                  className="opacity-0 group-hover:opacity-100 text-wave-muted hover:text-wave-pink transition-all p-1"
                >
                  <HiTrash size={14} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
