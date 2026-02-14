import React from 'react';
import useStore from '../store/useStore';
import audio from '../audio/AudioEngine';

export default function TopBar() {
  const musicOn = useStore((s) => s.musicOn);
  const setMusicOn = useStore((s) => s.setMusicOn);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const darkMode = useStore((s) => s.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);
  const volume = useStore((s) => s.volume);
  const setVolume = useStore((s) => s.setVolume);

  const handleMusicToggle = () => {
    const nowPlaying = audio.toggleMusic();
    setMusicOn(nowPlaying);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
  };

  const volumePercentage = Math.round(volume * 100);

  return (
    <div className="top-bar">
      <div className="app-title">
        <span>🌿</span> Cozy To-Do
      </div>
      <div className="top-controls">
        <button
          className="btn btn-ghost btn-icon"
          onClick={toggleDarkMode}
          title="Toggle Dark Mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {musicOn && (
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              title={`Volume: ${volumePercentage}%`}
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volumePercentage}%, ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} ${volumePercentage}%, ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} 100%)`
              }}
            />
          </div>
        )}
        <button className="btn btn-ghost btn-icon" onClick={handleMusicToggle} title="Toggle Music">
          {musicOn ? (
            <div className="music-indicator">
              <div className="bar" /><div className="bar" /><div className="bar" /><div className="bar" />
            </div>
          ) : (
            <span>🔇</span>
          )}
        </button>
      </div>
    </div>
  );
}