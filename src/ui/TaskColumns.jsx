/**
 * TaskColumns — Three-column Kanban layout with drag & drop
 * Columns: To Do / Doing / Done
 */
import React, { useState } from 'react';
import useStore from '../store/useStore';
import TaskCard from './TaskCard';

const COLUMNS = [
  { key: 'todo',  label: '📋 To Do',  className: 'column-todo' },
  { key: 'doing', label: '🔨 Doing',  className: 'column-doing' },
  { key: 'done',  label: '✨ Done',   className: 'column-done' },
];

export default function TaskColumns({ onEditTask }) {
  const getFilteredTasks = useStore((s) => s.getFilteredTasks);
  const moveTask = useStore((s) => s.moveTask);
  const filteredTasks = getFilteredTasks();
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(colKey);
  };

  const handleDragLeave = () => setDragOverCol(null);

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) moveTask(taskId, newStatus);
    setDragOverCol(null);
  };

  return (
    <div className="columns">
      {COLUMNS.map((col) => {
        const colTasks = filteredTasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            className={`column ${col.className} ${dragOverCol === col.key ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            <div className="column-header">
              {col.label}
              <span className="badge">{colTasks.length}</span>
            </div>
            <div className="column-tasks">
              {colTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
              ))}
              {colTasks.length === 0 && (
                <div style={{
                  textAlign: 'center', padding: '24px 8px',
                  color: 'var(--color-text-light)', opacity: 0.5,
                  fontFamily: 'var(--font-display)', fontSize: '0.95rem',
                }}>
                  {col.key === 'todo' ? 'Drop tasks here ✨' :
                   col.key === 'doing' ? 'Drag tasks in progress 🔨' :
                   'Completed tasks appear here 🎉'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}