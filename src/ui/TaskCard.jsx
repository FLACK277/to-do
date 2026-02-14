/**
 * TaskCard — Individual draggable task card with actions
 */
import React, { useState, useRef, useEffect } from 'react';
import useStore from '../store/useStore';

export default function TaskCard({ task, onEdit }) {
  const toggleComplete = useStore((s) => s.toggleComplete);
  const deleteTask = useStore((s) => s.deleteTask);
  const [dragging, setDragging] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const prevStatusRef = useRef(task.status);

  useEffect(() => {
    // Show celebration when task is marked as complete
    if (prevStatusRef.current !== 'done' && task.status === 'done') {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
    prevStatusRef.current = task.status;
  }, [task.status]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true);
    // Slight delay so the drag preview renders properly
    setTimeout(() => setDragging(true), 0);
  };

  const handleDragEnd = () => setDragging(false);

  const statusClass =
    task.status === 'done' ? 'completed' :
    task.status === 'doing' ? 'doing' : '';

  return (
    <div
      className={`task-card ${statusClass} ${dragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-text">{task.text}</div>
      <div className="task-actions">
        <button
          className="task-btn check"
          onClick={() => toggleComplete(task.id)}
          title={task.status === 'done' ? 'Undo' : 'Complete'}
        >
          {task.status === 'done' ? '↩️' : '✅'}
        </button>
        <button
          className="task-btn"
          onClick={() => onEdit(task)}
          title="Edit"
        >
          ✏️
        </button>
        <button
          className="task-btn delete"
          onClick={() => deleteTask(task.id)}
          title="Delete"
        >
          🗑️
        </button>
      </div>
      {showCelebration && (
        <div className="task-celebration">
          <div className="confetti-container">
            <div className="confetti-particle"></div>
            <div className="confetti-particle"></div>
            <div className="confetti-particle"></div>
            <div className="confetti-particle"></div>
            <div className="confetti-particle"></div>
            <div className="confetti-particle"></div>
            <div className="confetti-particle"></div>
            <div className="confetti-particle"></div>
          </div>
          <div className="task-celebration-message">
            Nice work! Task completed 🎉
          </div>
        </div>
      )}
    </div>
  );
}