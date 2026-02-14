import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import audio from '../audio/AudioEngine';

const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

const useStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      filter: 'all',
      searchQuery: '',
      musicOn: false,
      darkMode: false,
      characterReaction: null,

      addTask: (text, options = {}) => {
        if (!text.trim()) return null;
        const newTask = {
          id: generateId(),
          text: text.trim(),
          status: 'todo',
          date: options.date || null,
          time: options.time || null,
          priority: options.priority || 'normal',
          createdAt: Date.now(),
          completedAt: null,
        };
        set((s) => ({ tasks: [newTask, ...s.tasks] }));
        audio.playSfxAdd();
        set({ characterReaction: { type: 'wave', timestamp: Date.now() } });
        return newTask;
      },

      editTask: (id, newText) => {
        set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, text: newText.trim() } : t) }));
        audio.playSfxPop();
      },

      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        audio.playSfxDelete();
      },

      toggleComplete: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        const newStatus = task?.status === 'done' ? 'todo' : 'done';
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: newStatus, completedAt: newStatus === 'done' ? Date.now() : null } : t
          ),
        }));
        if (newStatus === 'done') {
          audio.playSfxComplete();
          set({ characterReaction: { type: 'happy', timestamp: Date.now() } });
        } else { audio.playSfxPop(); }
      },

      moveTask: (id, newStatus) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: newStatus, completedAt: newStatus === 'done' ? Date.now() : t.completedAt } : t
          ),
        }));
        audio.playSfxPop();
        if (newStatus === 'done') set({ characterReaction: { type: 'happy', timestamp: Date.now() } });
      },

      setFilter: (f) => set({ filter: f }),
      setSearchQuery: (q) => set({ searchQuery: q }),
      setMusicOn: (on) => set({ musicOn: on }),
      toggleDarkMode: () => {
        const newMode = !get().darkMode;
        set({ darkMode: newMode });
        audio.setDark(newMode);
      },

      getFilteredTasks: () => {
        const { tasks, filter, searchQuery } = get();
        let filtered = tasks;
        if (filter === 'active') filtered = filtered.filter((t) => t.status !== 'done');
        else if (filter === 'completed') filtered = filtered.filter((t) => t.status === 'done');
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter((t) => t.text.toLowerCase().includes(q));
        }
        return filtered;
      },

      getTaskByTitle: (title) => {
        const { tasks } = get();
        const lower = title.toLowerCase();
        return tasks.find((t) => t.text.toLowerCase().includes(lower));
      },

      clearCompleted: () => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.status !== 'done') }));
        audio.playSfxDelete();
      },

      getAllTasks: () => get().tasks,
    }),
    { name: 'ghibli-todo-storage', partialize: (state) => ({ tasks: state.tasks, darkMode: state.darkMode }) }
  )
);

export default useStore;