import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import axios from 'axios';

import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import LikedSongs from './pages/LikedSongs';
import Playlist from './pages/Playlist';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {

  useEffect(() => {
    axios.get('https://wavetune-i8hy.onrender.com/api/health')
      .catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a26',
                color: '#e8e8f0',
                border: '1px solid #252535',
                borderRadius: '12px',
                fontSize: '14px'
              }
            }}
          />

          <Routes>
            {/* Auth pages - no sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main app */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/search" element={<Layout><Search /></Layout>} />
            <Route path="/library" element={<Layout><Library /></Layout>} />
            <Route path="/liked" element={<Layout><LikedSongs /></Layout>} />
            <Route path="/playlist/:id" element={<Layout><Playlist /></Layout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;