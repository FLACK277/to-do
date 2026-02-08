/**
 * EditModal — Popup to edit a task's text
 */
import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';

export default function EditModal({ task, onClose }) {
    const editTask = useStore((s) => s.editTask);
    const [text, setText] = useState(task?.text || '');

    useEffect(() => {
        setText(task?.text || '');
    }, [task]);

    const handleSave = () => {
        if (text.trim() && task) {
            editTask(task.id, text);
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!task) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>✏️ Edit Task</h3>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    maxLength={200}
                    placeholder="Task description..."
                />
                <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        💾 Save
                    </button>
                </div>
            </div>
        </div>
    );
}
