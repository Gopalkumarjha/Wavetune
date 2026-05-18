import { NavLink, useNavigate } from 'react-router-dom';
import { HiHome, HiSearch, HiCollection, HiHeart, HiPlus, HiLogout, HiMusicNote } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { playlistAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (user) fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const { data } = await playlistAPI.getAll();
      setPlaylists(data);
    } catch {}
  };

  const createPlaylist = async () => {
    if (!user) { toast.error('Login to create playlists'); return; }
    const name = prompt('Playlist name:');
    if (!name) return;
    try {
      await playlistAPI.create({ name });
      toast.success('Playlist created! 🎵');
      fetchPlaylists();
    } catch { toast.error('Failed to create playlist'); }
  };

  const topNavItems = [
    { to: '/', icon: <HiHome size={26} />, label: 'Home' },
    { to: '/search', icon: <HiSearch size={26} />, label: 'Search' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-full glass-dark border-r border-white/5 fixed left-0 top-0 bottom-24 z-20">
      {/* Logo Area */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-wave-accent to-wave-pink flex items-center justify-center shadow-lg shadow-wave-accent/20">
            <HiMusicNote className="text-white" size={24} />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight text-wave-text drop-shadow-sm">WaveTune</span>
        </div>
      </div>
      
      {/* Top Nav */}
      <div className="px-3 py-2">
        <nav className="space-y-1">
          {topNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] font-bold transition-all duration-300
                ${isActive
                  ? 'bg-wave-accent/10 text-wave-accent shadow-[inset_3px_0_0_0_var(--accent)]'
                  : 'text-wave-muted hover:text-wave-text hover:bg-white/5'}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Box (Library) */}
      <div className="flex-1 flex flex-col overflow-hidden mt-4">
        <div className="px-4 py-3 flex items-center justify-between">
          <NavLink to="/library" className="flex items-center gap-3 text-wave-muted hover:text-white transition-colors font-medium">
            <HiCollection size={24} />
            <span>Your Library</span>
          </NavLink>
          <button
            onClick={createPlaylist}
            className="w-8 h-8 rounded-full hover:bg-wave-surface flex items-center justify-center text-wave-muted hover:text-white transition-all"
          >
            <HiPlus size={20} />
          </button>
        </div>

        {/* Playlists */}
        <div className="px-2 flex-1 overflow-y-auto mt-2">
          {/* Create first playlist CTA */}
          {playlists.length === 0 && (
            <div className="bg-wave-surface rounded-lg p-4 mx-2 my-2">
              <h4 className="font-bold text-white mb-2">Create your first playlist</h4>
              <p className="text-sm text-wave-text mb-4">It's easy, we'll help you</p>
              <button onClick={createPlaylist} className="bg-white text-black font-bold py-1.5 px-4 rounded-full text-sm hover:scale-105 transition-transform">
                Create playlist
              </button>
            </div>
          )}

          {playlists.length > 0 && playlists.map(p => (
            <NavLink
              key={p._id}
              to={`/playlist/${p._id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300
                ${isActive ? 'bg-wave-accent/10 text-wave-accent' : 'text-wave-muted hover:text-wave-text hover:bg-white/5'}`
              }
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-wave-accent/20' : 'bg-wave-surface/50'}`}>
                <HiMusicNote size={18} className={isActive ? 'text-wave-accent' : 'text-wave-muted'} />
              </div>
              <span className="truncate">{p.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <div className="px-4 py-4 border-t border-wave-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-wave-accent to-wave-pink flex items-center justify-center text-white text-sm font-bold">
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-wave-text truncate">{user.username}</p>
              <p className="text-xs text-wave-muted truncate">{user.email}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="p-1.5 rounded-lg text-wave-muted hover:text-wave-pink hover:bg-wave-pink/10 transition-all"
              title="Logout"
            >
              <HiLogout size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
