/**
 * WaveTune PlayerContext
 * Handles both:
 *  - Regular MP3 audio (MongoDB songs) via HTMLAudio
 *  - YouTube songs via a hidden iframe + postMessage API
 */
import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PlayerContext = createContext();
export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const { user } = useAuth();

  // ── Audio (MP3) ──────────────────────────────────────────────────────────
  const audioRef = useRef(new Audio());

  // ── State ─────────────────────────────────────────────────────────────────
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue]             = useState([]);
  const [queueIndex, setQueueIndex]   = useState(0);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume]           = useState(0.8);
  const [isMuted, setIsMuted]         = useState(false);
  const [isShuffled, setIsShuffled]   = useState(false);
  const [repeatMode, setRepeatMode]   = useState('none'); // none | one | all
  const [isLoading, setIsLoading]     = useState(false);

  // YouTube iframe state
  const [ytPlayerReady, setYtPlayerReady] = useState(false);
  const ytIntervalRef = useRef(null);

  const audio = audioRef.current;
  const isYouTubeSong = (song) => song?.source === 'youtube' || song?._id?.startsWith('yt_');

  // ── MP3 event listeners ───────────────────────────────────────────────────
  useEffect(() => {
    audio.volume = volume;

    const onTime     = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onEnded    = () => handleNext();
    const onPlay     = () => { setIsPlaying(true);  setIsLoading(false); };
    const onPause    = () => setIsPlaying(false);
    const onWaiting  = () => setIsLoading(true);
    const onCanPlay  = () => setIsLoading(false);

    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('ended',          onEnded);
    audio.addEventListener('play',           onPlay);
    audio.addEventListener('pause',          onPause);
    audio.addEventListener('waiting',        onWaiting);
    audio.addEventListener('canplay',        onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('ended',          onEnded);
      audio.removeEventListener('play',           onPlay);
      audio.removeEventListener('pause',          onPause);
      audio.removeEventListener('waiting',        onWaiting);
      audio.removeEventListener('canplay',        onCanPlay);
    };
  }, []); // run once — handleNext captured via ref below

  // Keep handleNext stable ref so audio listener always sees latest
  const handleNextRef = useRef(null);

  // ── YouTube iframe messaging ──────────────────────────────────────────────
  useEffect(() => {
    const onMessage = (e) => {
      if (!e.data || typeof e.data !== 'string') return;
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === 'onReady') setYtPlayerReady(true);
        if (msg.event === 'onStateChange') {
          // 1 = playing, 2 = paused, 0 = ended
          if (msg.info === 1) { setIsPlaying(true);  setIsLoading(false); }
          if (msg.info === 2) setIsPlaying(false);
          if (msg.info === 3) setIsLoading(true);  // buffering
          if (msg.info === 0 && handleNextRef.current) handleNextRef.current();
        }
      } catch {}
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Poll YT current time via postMessage
  const startYtPolling = useCallback(() => {
    clearInterval(ytIntervalRef.current);
    ytIntervalRef.current = setInterval(() => {
      const iframe = document.getElementById('yt-player-iframe');
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'getCurrentTime', args: [] }), '*'
        );
      }
    }, 1000);
  }, []);

  const stopYtPolling = useCallback(() => {
    clearInterval(ytIntervalRef.current);
  }, []);

  // Listen for YT time responses
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'string') return;
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === 'infoDelivery' && msg.info?.currentTime != null) {
          setCurrentTime(msg.info.currentTime);
          if (msg.info.duration) setDuration(msg.info.duration);
        }
      } catch {}
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // ── playSong ──────────────────────────────────────────────────────────────
  const playSong = useCallback(async (song, songQueue = null) => {
    if (!song) return;

    // Update queue
    if (songQueue) {
      setQueue(songQueue);
      const idx = songQueue.findIndex(s => s._id === song._id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }

    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);

    if (isYouTubeSong(song)) {
      // Stop any playing MP3
      audio.pause();
      audio.src = '';
      setIsPlaying(true);
      startYtPolling();
      // Actual playback handled by the YTPlayer iframe component re-rendering with new videoId
    } else {
      // Stop YT polling
      stopYtPolling();
      // MP3 playback
      audio.src = song.audioUrl;
      audio.volume = volume;
      audio.load();
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Audio play blocked:', err.message);
        setIsLoading(false);
      }
      // Track play in DB
      if (user && !song._id?.startsWith('yt_')) {
        try { await axios.post(`/api/songs/${song._id}/play`); } catch {}
      }
    }
  }, [audio, user, volume, startYtPolling, stopYtPolling]);

  // Expose handleNext via ref so event listeners can always call latest version
  const handleNext = useCallback(() => {
    if (repeatMode === 'one') {
      if (currentSong && isYouTubeSong(currentSong)) {
        // YT seek to 0 via postMessage
        const iframe = document.getElementById('yt-player-iframe');
        iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
      } else {
        audio.currentTime = 0;
        audio.play();
      }
      return;
    }
    if (queue.length === 0) return;

    let nextIdx;
    if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeatMode === 'all') nextIdx = 0;
        else { setIsPlaying(false); stopYtPolling(); return; }
      }
    }
    setQueueIndex(nextIdx);
    playSong(queue[nextIdx]);
  }, [queue, queueIndex, isShuffled, repeatMode, playSong, audio, currentSong, stopYtPolling]);

  useEffect(() => { handleNextRef.current = handleNext; }, [handleNext]);

  // ── togglePlay ────────────────────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    if (!currentSong) return;
    if (isYouTubeSong(currentSong)) {
      const iframe = document.getElementById('yt-player-iframe');
      if (iframe?.contentWindow) {
        const func = isPlaying ? 'pauseVideo' : 'playVideo';
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
        setIsPlaying(!isPlaying);
      }
    } else {
      if (isPlaying) { audio.pause(); }
      else { try { await audio.play(); } catch {} }
    }
  }, [audio, currentSong, isPlaying]);

  // ── handlePrev ────────────────────────────────────────────────────────────
  const handlePrev = useCallback(() => {
    if (currentTime > 3) {
      if (isYouTubeSong(currentSong)) {
        const iframe = document.getElementById('yt-player-iframe');
        iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }), '*');
        setCurrentTime(0);
      } else {
        audio.currentTime = 0;
      }
      return;
    }
    if (queue.length === 0) return;
    const prevIdx = Math.max(0, queueIndex - 1);
    setQueueIndex(prevIdx);
    playSong(queue[prevIdx]);
  }, [currentTime, queue, queueIndex, playSong, audio, currentSong]);

  // ── seek ─────────────────────────────────────────────────────────────────
  const seek = useCallback((time) => {
    setCurrentTime(time);
    if (isYouTubeSong(currentSong)) {
      const iframe = document.getElementById('yt-player-iframe');
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'seekTo', args: [time, true] }), '*');
    } else {
      audio.currentTime = time;
    }
  }, [audio, currentSong]);

  // ── volume ────────────────────────────────────────────────────────────────
  const changeVolume = useCallback((val) => {
    const v = parseFloat(val);
    audio.volume = v;
    setVolume(v);
    setIsMuted(v === 0);
    // YT volume via postMessage (0-100)
    const iframe = document.getElementById('yt-player-iframe');
    iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [Math.round(v * 100)] }), '*');
  }, [audio]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
      const iframe = document.getElementById('yt-player-iframe');
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*');
    } else {
      audio.volume = 0;
      setIsMuted(true);
      const iframe = document.getElementById('yt-player-iframe');
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'mute', args: [] }), '*');
    }
  }, [audio, isMuted, volume]);

  // ── helpers ───────────────────────────────────────────────────────────────
  const toggleShuffle = () => setIsShuffled(p => !p);
  const cycleRepeat   = () => setRepeatMode(p => p === 'none' ? 'all' : p === 'all' ? 'one' : 'none');
  const addToQueue    = (song) => setQueue(prev => [...prev, song]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, queue, isPlaying, duration, currentTime, volume, isMuted,
      isShuffled, repeatMode, isLoading,
      playSong, togglePlay, handleNext, handlePrev,
      seek, changeVolume, toggleMute, toggleShuffle, cycleRepeat, addToQueue,
      formatTime, isYouTubeSong,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
