import React from 'react';
import useStore from '../store/useStore';
import audio from '../audio/AudioEngine';

export default function TopBar() {
  const musicOn = useStore((s) => s.musicOn);
  const setMusicOn = useStore((s) => s.setMusicOn);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);

  const handleMusicToggle = () => {
    const nowPlaying = audio.toggleMusic();
    setMusicOn(nowPlaying);
  };

  return (
    <div className="top-bar">
      <div className="app-title">
        <span>🌿</span> Cozy To-Do
      </div>
      <div className="top-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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