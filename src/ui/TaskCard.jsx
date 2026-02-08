/**
 * TaskCard — Individual draggable task card with actions
 */
import React, { useState, useRef } from 'react';
import useStore from '../store/useStore';

export default function TaskCard({ task, onEdit }) {
  const toggleComplete = useStore((s) => s.toggleComplete);
  const deleteTask = useStore((s) => s.deleteTask);
  const [dragging, setDragging] = useState(false);

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
    </div>
  );
}