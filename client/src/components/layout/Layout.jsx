import Sidebar from './Sidebar';
import MusicPlayer from '../player/MusicPlayer';
import MobileNav from '../common/MobileNav';
import { HiChevronLeft, HiChevronRight, HiSearch, HiOutlineDownload } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  return (
  <div className="flex h-screen overflow-hidden bg-wave-bg">
    <Sidebar />
    <main className="flex-1 md:ml-64 bg-transparent overflow-y-auto pb-36 md:pb-24 flex flex-col relative">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-20 bg-wave-bg/70 backdrop-blur-xl flex items-center justify-between px-8 border-b border-white/5 transition-all">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <button onClick={() => navigate(-1)} className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-wave-muted hover:text-white transition-colors">
              <HiChevronLeft size={22} />
            </button>
            <button onClick={() => navigate(1)} className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-wave-muted hover:text-white transition-colors">
              <HiChevronRight size={22} />
            </button>
          </div>
          {/* Search Input in header */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="text-wave-muted" size={20} />
            </div>
            <input
              type="text"
              placeholder="What do you want to play?"
              className="bg-wave-surface text-white text-sm rounded-full w-80 lg:w-96 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-white border border-wave-border/50 hover:bg-wave-border/40 transition-colors placeholder-wave-muted font-medium"
              onClick={() => { if (location.pathname !== '/search') navigate('/search'); }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 font-bold text-sm text-wave-muted">
            <a href="#" className="hover:scale-105 hover:text-white transition-all">Premium</a>
            <a href="#" className="hover:scale-105 hover:text-white transition-all">Support</a>
            <a href="#" className="hover:scale-105 hover:text-white transition-all">Download</a>
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <a href="#" className="flex items-center gap-1 hover:scale-105 hover:text-white transition-all">
              <HiOutlineDownload size={18} /> Install App
            </a>
          </div>
          
          {!user ? (
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/register')} className="font-bold text-wave-muted hover:text-white hover:scale-105 transition-all text-base tracking-wide">
                Sign up
              </button>
              <button onClick={() => navigate('/login')} className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 hover:bg-gray-100 transition-all text-base tracking-wide">
                Log in
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-full bg-wave-accent flex items-center justify-center text-black font-bold">
                {user.username?.[0]?.toUpperCase()}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 w-full relative">
        <div className="max-w-[1400px] mx-auto p-6 pt-2">
          {children}
        </div>
      </div>
    </main>
    <MobileNav />
    <MusicPlayer />
  </div>
  );
};

export default Layout;
