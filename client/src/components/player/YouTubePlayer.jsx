/**
 * YouTubePlayer
 * A hidden iframe that handles YouTube audio playback.
 * Communicates with PlayerContext via window.postMessage (YouTube IFrame API).
 * The iframe is always mounted so we can send commands without re-creating it.
 */
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';

const YouTubePlayer = () => {
  const { currentSong, isYouTubeSong, volume } = usePlayer();
  const iframeRef = useRef(null);
  const [videoId, setVideoId] = useState(null);

  // When song changes to a YouTube song, update the videoId
  useEffect(() => {
    if (currentSong && isYouTubeSong(currentSong)) {
      setVideoId(currentSong.videoId);
    }
  }, [currentSong]);

  if (!videoId) return null;

  // Build embed URL with all flags needed for JS API control
  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1` +
    `&enablejsapi=1` +
    `&origin=${encodeURIComponent(window.location.origin)}` +
    `&playsinline=1` +
    `&rel=0` +
    `&modestbranding=1` +
    `&controls=0` +
    `&volume=${Math.round((volume ?? 0.8) * 100)}`;

  return (
    <iframe
      id="yt-player-iframe"
      ref={iframeRef}
      src={embedUrl}
      title="YouTube Player"
      allow="autoplay; encrypted-media"
      // Visually hidden but still active — "display:none" stops audio
      style={{
        position: 'fixed',
        bottom: '-9999px',
        left: '-9999px',
        width: '1px',
        height: '1px',
        border: 'none',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default YouTubePlayer;
