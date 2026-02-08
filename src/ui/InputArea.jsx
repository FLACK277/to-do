/**
 * InputArea — Task input field styled like a notebook at the bottom
 */
import React, { useState } from 'react';
import useStore from '../store/useStore';
import audio from '../audio/AudioEngine';

export default function InputArea() {
  const [text, setText] = useState('');
  const addTask = useStore((s) => s.addTask);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    audio.init(); // Ensure audio context is started on user interaction
    addTask(text);
    setText('');
  };

  return (
    <div className="input-area">
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a new task... ✍️"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
        />
        <button type="submit" className="btn btn-primary">
          ➕ Add
        </button>
      </form>
    </div>
  );
}