import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('wavetune_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get('/api/auth/me');
      setUser(data);
      setLikedSongs(data.likedSongs?.map(s => s._id || s) || []);
    } catch { logout(); }
    finally { setLoading(false); }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('wavetune_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    await fetchMe();
    return data;
  };

  const register = async (username, email, password) => {
    const { data } = await axios.post('/api/auth/register', { username, email, password });
    localStorage.setItem('wavetune_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('wavetune_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setLikedSongs([]);
  };

  const toggleLike = async (songId) => {
    if (!user) return false;
    try {
      const { data } = await axios.post(`/api/songs/${songId}/like`);
      setLikedSongs(prev => data.liked ? [...prev, songId] : prev.filter(id => id !== songId));
      return data.liked;
    } catch { return false; }
  };

  const isLiked = (songId) => likedSongs.includes(songId);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, likedSongs, toggleLike, isLiked }}>
      {children}
    </AuthContext.Provider>
  );
};
