/**
 * FilterBar — Toggle between All / Active / Completed views
 */
import React from 'react';
import useStore from '../store/useStore';

const FILTERS = [
  { key: 'all', label: '🌸 All' },
  { key: 'active', label: '✏️ Active' },
  { key: 'completed', label: '✅ Completed' },
];

export default function FilterBar() {
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);

  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`btn btn-ghost ${filter === f.key ? 'active' : ''}`}
          onClick={() => setFilter(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}