import { useState, useEffect, useRef } from 'react';
import { songAPI } from '../utils/api';
import SongCard from '../components/cards/SongCard';
import SongRow from '../components/cards/SongRow';
import SectionHeader from '../components/common/SectionHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { userAPI } from '../utils/api';
import { HiSparkles, HiFire, HiClock, HiPlay, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

// ─── Static Bollywood Trending Songs ─────────────────────────────────────────
const BOLLYWOOD_TRENDING = [
  {
    _id: 'yt_BddP6PYo2gs',
    videoId: 'BddP6PYo2gs',
    title: 'Kesariya',
    artist: 'Arijit Singh',
    album: 'Brahmastra',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2736a36e6a0ccd7a762a2a0bf82',
    duration: 262,
  },
  {
    _id: 'yt_lOQUrMAuX4s',
    videoId: 'lOQUrMAuX4s',
    title: 'Tum Kya Mile',
    artist: 'Arijit Singh, Shreya Ghoshal',
    album: 'Rocky Aur Rani',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2734ed9f1b95ae02f948ed0e7cc',
    duration: 248,
  },
  {
    _id: 'yt_huxhqphtzmA',
    videoId: 'huxhqphtzmA',
    title: 'Besharam Rang',
    artist: 'Shilpa Rao',
    album: 'Pathaan',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273be7fa9d4e3c3e2bde8fffec4',
    duration: 210,
  },
  {
    _id: 'yt_VAdGW7QDJiU',
    videoId: 'VAdGW7QDJiU',
    title: 'Chaleya',
    artist: 'Arijit Singh, Shilpa Rao',
    album: 'Jawan',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27319af8d58e6de7ab3024b4dda',
    duration: 252,
  },
  {
    _id: 'yt_gvyUuxdRdR4',
    videoId: 'gvyUuxdRdR4',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal, Asees Kaur',
    album: 'Shershaah',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a59a20540b57a9c9ab05c98b',
    duration: 228,
  },
  {
    _id: 'yt_hcMzwYbPrhs',
    videoId: 'hcMzwYbPrhs',
    title: 'Srivalli',
    artist: 'Sid Sriram',
    album: 'Pushpa',
    genre: 'Telugu',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27378a7c89d1f7a9b2ed5b0d3f2',
    duration: 219,
  },
  {
    _id: 'yt_mUcE1YvkOAw',
    videoId: 'mUcE1YvkOAw',
    title: 'Deva Deva',
    artist: 'Arijit Singh',
    album: 'Brahmastra',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a18c5f59a8e7e6b2c3d4e5f6',
    duration: 237,
  },
  {
    _id: 'yt_K35f79_I1jM',
    videoId: 'K35f79_I1jM',
    title: 'Kahani',
    artist: 'Payal Dev, Yasser Desai',
    album: 'Single',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2738e74af6cd68abe6fac2a2f1c',
    duration: 195,
  },
];

// ─── Popular Artists ──────────────────────────────────────────────────────────
const POPULAR_ARTISTS = [
  {
    id: 'a1',
    name: 'Pritam',
    image: '/artists/a1.jpg',
  },
  {
    id: 'a2',
    name: 'A.R. Rahman',
    image: '/artists/a2.jpg',
  },
  {
    id: 'a3',
    name: 'Arijit Singh',
    image: '/artists/a3.jpg',
  },
  {
    id: 'a4',
    name: 'Sachin-Jigar',
    image: '/artists/a4.jpg',
  },
  {
    id: 'a5',
    name: 'Vishal-Shekhar',
    image: '/artists/a5.jpg',
  },
  {
    id: 'a6',
    name: 'Atif Aslam',
    image: '/artists/a6.jpg',
  },
];

// ─── Featured Albums ──────────────────────────────────────────────────────────
const FEATURED_ALBUMS = [
  {
    _id: 'yt_8kOa1yQzZXY',
    videoId: '8kOa1yQzZXY',
    title: 'Brahmastra OST',
    artist: 'Pritam',
    album: 'Brahmastra',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2736a36e6a0ccd7a762a2a0bf82',
    duration: 300,
  },
  {
    _id: 'yt_8M_H4v_J_Fk',
    videoId: '8M_H4v_J_Fk',
    title: 'Pathaan',
    artist: 'Vishal-Shekhar',
    album: 'Pathaan',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273be7fa9d4e3c3e2bde8fffec4',
    duration: 280,
  },
  {
    _id: 'yt_0h4F1Zz8Vqk',
    videoId: '0h4F1Zz8Vqk',
    title: 'Jawan',
    artist: 'Anirudh Ravichander',
    album: 'Jawan',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27319af8d58e6de7ab3024b4dda',
    duration: 265,
  },
  {
    _id: 'yt_1z_T1uP3j5I',
    videoId: '1z_T1uP3j5I',
    title: 'Shershaah',
    artist: 'B Praak, Jubin Nautiyal',
    album: 'Shershaah',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b273a59a20540b57a9c9ab05c98b',
    duration: 245,
  },
  {
    _id: 'yt_h4s0llOpKrU',
    videoId: 'h4s0llOpKrU',
    title: 'Pushpa: The Rise',
    artist: 'Devi Sri Prasad',
    album: 'Pushpa',
    genre: 'Telugu',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b27378a7c89d1f7a9b2ed5b0d3f2',
    duration: 270,
  },
  {
    _id: 'yt_VpPTU7HtzEQ',
    videoId: 'VpPTU7HtzEQ',
    title: 'Rocky Aur Rani',
    artist: 'Pritam',
    album: 'Rocky Aur Rani',
    genre: 'Bollywood',
    coverImage: 'https://i.scdn.co/image/ab67616d0000b2734ed9f1b95ae02f948ed0e7cc',
    duration: 255,
  },
];

// ─── Bolly Song Card (with image fallback chain) ──────────────────────────────
const BollyCard = ({ song, queue, isActive, onPlay }) => {
  const [imgSrc, setImgSrc] = useState(song.coverImage);

  return (
    <div
      onClick={() => onPlay(song, queue)}
      className="group flex flex-col cursor-pointer transition-all duration-300 w-full bg-[#181818]/80 hover:bg-[#282828] p-4 rounded-xl border border-white/5 backdrop-blur-md"
    >
      <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden shadow-lg">
        <img
          src={imgSrc}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgSrc(`https://picsum.photos/seed/${song._id}/300/300`)}
        />
        <div className={`absolute right-2 bottom-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 ${isActive ? 'opacity-100 translate-y-0' : ''}`}>
          <button className="w-11 h-11 rounded-full bg-wave-accent hover:scale-105 hover:bg-wave-pink flex items-center justify-center text-white shadow-xl transition-all">
            {isActive ? (
              <div className="flex gap-1 items-end h-4">
                <div className="eq-bar w-1 h-2 bg-white rounded-full" />
                <div className="eq-bar w-1 h-4 bg-white rounded-full" />
                <div className="eq-bar w-1 h-3 bg-white rounded-full" />
                <div className="eq-bar w-1 h-4 bg-white rounded-full" />
              </div>
            ) : (
              <HiPlay size={22} className="ml-1" />
            )}
          </button>
        </div>
      </div>
      <p className={`font-bold text-[15px] leading-tight mb-1.5 line-clamp-1 transition-colors ${isActive ? 'text-wave-accent' : 'text-white'}`}>
        {song.title}
      </p>
      <div className="flex items-center gap-2">
        <p className="text-[13px] text-wave-muted truncate leading-snug font-medium">
          {song.artist}
        </p>
      </div>
    </div>
  );
};

// ─── Artist Card ──────────────────────────────────────────────────────────────
const ArtistCard = ({ artist }) => {
  const [imgSrc, setImgSrc] = useState(artist.image);

  return (
    <div className="group flex flex-col items-start cursor-pointer transition-all w-full">
      <div className="relative w-full aspect-square rounded-full overflow-hidden mb-4 shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_12px_24px_rgba(255,71,87,0.2)]">
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-110">
          <img
            src={imgSrc}
            alt={artist.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=ff4757&color=fff&size=200`)}
          />
        </div>
        <div className="absolute right-2 bottom-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button className="w-12 h-12 rounded-full bg-wave-accent hover:scale-105 hover:bg-wave-pink flex items-center justify-center text-white shadow-xl transition-all">
            <HiPlay size={24} className="ml-1" />
          </button>
        </div>
      </div>
      <p className="font-bold text-[16px] leading-tight text-white line-clamp-1 mb-1">{artist.name}</p>
      <p className="text-[14px] text-wave-muted font-medium">Artist</p>
    </div>
  );
};

const ScrollRow = ({ children }) => {
  const scrollRef = useRef(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};

// ─── Main Home Page ───────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const { playSong, currentSong } = usePlayer();
  const [dbTrending, setDbTrending] = useState([]);
  const [dbFeatured, setDbFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trendRes, featRes, allRes] = await Promise.all([
        songAPI.getTrending(),
        songAPI.getFeatured(),
        songAPI.getAll({ limit: 20 }),
      ]);
      setDbTrending(trendRes.data);
      setDbFeatured(featRes.data);
      setAllSongs(allRes.data);
      if (user) {
        const recRes = await userAPI.getRecentlyPlayed();
        setRecent(recRes.data.filter(r => r.song).slice(0, 6).map(r => r.song));
      }
    } catch (err) {
      console.error('Failed to load songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Always use the static Indian music lists for the homepage feel
  const trendingSongs = BOLLYWOOD_TRENDING;
  const featuredAlbums = FEATURED_ALBUMS;

  if (loading) return <LoadingSpinner size="lg" text="Loading your music..." />;

  return (
    <div className="animate-fade-in space-y-10 pb-8">

      {/* Top spacing to push content down a bit */}
      <div className="pt-2"></div>

      <h1 className="text-3xl md:text-4xl font-extrabold text-wave-text mb-8 tracking-tight drop-shadow-sm">
        {greeting()}
      </h1>

      {/* ── Popular artists ────────────────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-2xl text-wave-text hover:text-wave-accent transition-colors cursor-pointer tracking-tight">
            Popular artists
          </h2>
          <button className="text-sm text-[#b3b3b3] hover:underline font-bold">
            Show all
          </button>
        </div>
        <ScrollRow>
          {POPULAR_ARTISTS.map(artist => (
            <div key={artist.id} className="flex-shrink-0 w-48 md:w-56">
              <ArtistCard artist={artist} />
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* ── Trending Songs ────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-extrabold text-2xl text-wave-text hover:text-wave-accent transition-colors cursor-pointer tracking-tight">
            Trending in India
          </h2>
          <button className="text-sm text-[#b3b3b3] hover:underline font-bold">
            Show all
          </button>
        </div>
        <ScrollRow>
          {trendingSongs.map(song => (
            <div key={song._id} className="flex-shrink-0 w-48 md:w-56">
              <BollyCard
                song={song}
                queue={trendingSongs}
                isActive={currentSong?._id === song._id}
                onPlay={playSong}
              />
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* ── Recently Played ───────────────────────────────────────────── */}
      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-2xl text-wave-text hover:text-wave-accent transition-colors cursor-pointer tracking-tight">
              Recently Played
            </h2>
          </div>
          <ScrollRow>
            {recent.map(song => (
              <div key={song._id} className="flex-shrink-0 w-48 md:w-56">
                <BollyCard song={song} queue={recent} onPlay={playSong} isActive={currentSong?._id === song._id} />
              </div>
            ))}
          </ScrollRow>
        </section>
      )}

      {/* ── Featured Albums ───────────────────────────────────────────── */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-extrabold text-2xl text-wave-text hover:text-wave-accent transition-colors cursor-pointer tracking-tight">
            Featured Albums
          </h2>
          <button className="text-sm text-wave-muted hover:text-wave-text transition-colors font-bold tracking-wide uppercase">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {featuredAlbums.map(song => (
            <BollyCard
              key={song._id}
              song={song}
              queue={featuredAlbums}
              isActive={currentSong?._id === song._id}
              onPlay={playSong}
            />
          ))}
        </div>
      </section>

      {/* ── All Songs (DB) ────────────────────────────────────────────── */}
      {allSongs.length > 0 && (
        <section className="mt-10">
          <h2 className="font-extrabold text-2xl text-wave-text hover:text-wave-accent transition-colors cursor-pointer tracking-tight mb-5">
            All Songs
          </h2>
          <div className="glass rounded-2xl overflow-hidden shadow-lg border border-wave-border/30">
            <div className="flex items-center gap-4 px-4 py-3 border-b border-wave-border text-xs text-wave-muted uppercase tracking-wider">
              <span className="w-6 text-center">#</span>
              <span className="w-10" />
              <span className="flex-1">Title</span>
              <span className="hidden md:block w-32">Album</span>
              <span className="w-6" />
              <span className="w-10 text-right">Time</span>
            </div>
            {allSongs.map((song, i) => (
              <SongRow key={song._id} song={song} index={i} queue={allSongs} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
