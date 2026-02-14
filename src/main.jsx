import React, { useState, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Store
import useStore from './store/useStore';
import audio from './audio/AudioEngine';

// Scene components
import SceneCanvas from './scene/SceneCanvas';

// UI components
import TopBar from './ui/TopBar';
import FilterBar from './ui/FilterBar';
import TaskColumns from './ui/TaskColumns';
import InputArea from './ui/InputArea';
import EditModal from './ui/EditModal';
import CozyAssistant from './ui/CozyAssistant';

/**
 * Main App — Combines 3D Scene + UI Overlay
 */
function App() {
    const [editingTask, setEditingTask] = useState(null);
    const [assistantOpen, setAssistantOpen] = useState(false);
    const characterReaction = useStore((s) => s.characterReaction);
    const darkMode = useStore((s) => s.darkMode);
    const volume = useStore((s) => s.volume);
    const [speech, setSpeech] = useState(null);

    // Initialize audio volume from persisted state
    useEffect(() => {
        audio.setVolume(volume);
    }, []);

    // Character speech bubbles on reactions
    useEffect(() => {
        if (!characterReaction) return;
        const messages = {
            happy: ['Wonderful! ✨', 'Great job! 🌸', 'You did it! 🎉', 'Amazing! 💫', 'Keep going! 🌿'],
            wave: ['Hello there! 👋', 'A new task! 📋', 'Let\'s do this! 💪', 'Good luck! 🍀'],
        };
        const pool = messages[characterReaction.type] || messages.wave;
        const msg = pool[Math.floor(Math.random() * pool.length)];
        setSpeech(msg);
        const timer = setTimeout(() => setSpeech(null), 2500);
        return () => clearTimeout(timer);
    }, [characterReaction]);

    // Apply dark mode theme to document element
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    return (
        <>
            {/* 3D Background */}
            <Suspense fallback={null}>
                <SceneCanvas />
            </Suspense>

            {/* UI Overlay */}
            <div className="ui-overlay">
                <TopBar />
                <FilterBar />
                <div className="main-content">
                    <TaskColumns onEditTask={setEditingTask} />
                </div>
                <InputArea />
            </div>

            {/* Character speech bubble */}
            {speech && <div className="character-speech">{speech}</div>}

            {/* Cozy Assistant Toggle Button */}
            <button
                className="assistant-toggle-btn"
                onClick={() => setAssistantOpen(true)}
                title="Open Cozy Assistant"
            >
                🌿 Ask me!
            </button>

            {/* Cozy Assistant */}
            <CozyAssistant
                isOpen={assistantOpen}
                onClose={() => setAssistantOpen(false)}
            />

            {/* Edit modal */}
            {editingTask && (
                <EditModal task={editingTask} onClose={() => setEditingTask(null)} />
            )}
        </>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
