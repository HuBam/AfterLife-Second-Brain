import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
    ArrowLeft, Plus, Check, X, Flame, Calendar,
    Target, Trash2, Edit2, RotateCcw
} from 'lucide-react'

// Preset habit suggestions
const habitSuggestions = [
    { name: 'Morning Meditation', icon: '🧘', category: 'wellness', realm: 'sanctum' },
    { name: 'Read 30 minutes', icon: '📚', category: 'learning', realm: 'cerebra' },
    { name: 'Exercise', icon: '💪', category: 'fitness', realm: 'sanctum' },
    { name: 'Journal Writing', icon: '✍️', category: 'reflection', realm: 'empyra' },
    { name: 'Practice a skill', icon: '🎯', category: 'growth', realm: 'elysia' },
    { name: 'Drink 8 glasses of water', icon: '💧', category: 'health', realm: 'sanctum' },
    { name: 'No social media before noon', icon: '📵', category: 'focus', realm: 'cerebra' },
    { name: 'Gratitude practice', icon: '🙏', category: 'mindset', realm: 'empyra' },
]

export default function Habits() {
    const { user, updateUser } = useStore()
    const [showAddModal, setShowAddModal] = useState(false)
    const [newHabit, setNewHabit] = useState({ name: '', icon: '✨', frequency: 'daily' })
    const [editingHabit, setEditingHabit] = useState(null)

    // Get habits from user state
    const habits = user.habits || []

    // Get today's date string
    const today = new Date().toISOString().split('T')[0]

    // Calculate streak for a habit
    const calculateStreak = (habit) => {
        if (!habit.completions || habit.completions.length === 0) return 0

        const sortedDates = [...habit.completions].sort().reverse()
        let streak = 0
        let currentDate = new Date()

        for (const dateStr of sortedDates) {
            const checkDate = currentDate.toISOString().split('T')[0]
            if (dateStr === checkDate) {
                streak++
                currentDate.setDate(currentDate.getDate() - 1)
            } else if (dateStr === new Date(currentDate.getTime() - 86400000).toISOString().split('T')[0]) {
                // Allow for checking yesterday if today not yet completed
                streak++
                currentDate = new Date(dateStr)
                currentDate.setDate(currentDate.getDate() - 1)
            } else {
                break
            }
        }

        return streak
    }

    // Check if habit is completed today
    const isCompletedToday = (habit) => {
        return habit.completions?.includes(today)
    }

    // Toggle habit completion
    const toggleHabit = (habitId) => {
        const updatedHabits = habits.map(h => {
            if (h.id === habitId) {
                const completions = h.completions || []
                if (completions.includes(today)) {
                    return { ...h, completions: completions.filter(d => d !== today) }
                } else {
                    return { ...h, completions: [...completions, today] }
                }
            }
            return h
        })
        updateUser({ habits: updatedHabits })
    }

    // Add new habit
    const addHabit = () => {
        if (!newHabit.name.trim()) return

        const habit = {
            id: Date.now().toString(),
            name: newHabit.name,
            icon: newHabit.icon,
            frequency: newHabit.frequency,
            completions: [],
            createdAt: new Date().toISOString(),
        }

        updateUser({ habits: [...habits, habit] })
        setNewHabit({ name: '', icon: '✨', frequency: 'daily' })
        setShowAddModal(false)
    }

    // Delete habit
    const deleteHabit = (habitId) => {
        updateUser({ habits: habits.filter(h => h.id !== habitId) })
    }

    // Add from suggestion
    const addFromSuggestion = (suggestion) => {
        const habit = {
            id: Date.now().toString(),
            name: suggestion.name,
            icon: suggestion.icon,
            frequency: 'daily',
            completions: [],
            createdAt: new Date().toISOString(),
        }
        updateUser({ habits: [...habits, habit] })
    }

    // Calculate overall stats
    const completedToday = habits.filter(h => isCompletedToday(h)).length
    const totalHabits = habits.length
    const longestStreak = habits.reduce((max, h) => Math.max(max, calculateStreak(h)), 0)

    return (
        <div className="habits-page">
            {/* Header */}
            <header className="page-header">
                <Link to="/" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <h1>Habits</h1>
                <button className="add-btn" onClick={() => setShowAddModal(true)}>
                    <Plus size={20} />
                </button>
            </header>

            {/* Stats Summary */}
            <div className="stats-bar">
                <div className="stat-item">
                    <Check size={18} />
                    <span>{completedToday}/{totalHabits}</span>
                    <small>Today</small>
                </div>
                <div className="stat-item highlight">
                    <Flame size={18} />
                    <span>{longestStreak}</span>
                    <small>Best Streak</small>
                </div>
                <div className="stat-item">
                    <Target size={18} />
                    <span>{totalHabits}</span>
                    <small>Habits</small>
                </div>
            </div>

            {/* Habits List */}
            <main className="habits-content">
                {habits.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🎯</span>
                        <h3>No habits yet</h3>
                        <p>Start building your daily routine</p>

                        <div className="suggestions">
                            <h4>Quick add:</h4>
                            <div className="suggestion-grid">
                                {habitSuggestions.slice(0, 4).map((s, i) => (
                                    <button key={i} className="suggestion-chip" onClick={() => addFromSuggestion(s)}>
                                        <span>{s.icon}</span>
                                        <span>{s.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="habits-list">
                        {habits.map(habit => {
                            const completed = isCompletedToday(habit)
                            const streak = calculateStreak(habit)

                            return (
                                <motion.div
                                    key={habit.id}
                                    className={`habit-card ${completed ? 'completed' : ''}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <button
                                        className={`habit-check ${completed ? 'checked' : ''}`}
                                        onClick={() => toggleHabit(habit.id)}
                                    >
                                        {completed ? <Check size={20} /> : null}
                                    </button>

                                    <div className="habit-info">
                                        <span className="habit-icon">{habit.icon}</span>
                                        <div className="habit-text">
                                            <span className="habit-name">{habit.name}</span>
                                            <span className="habit-freq">{habit.frequency}</span>
                                        </div>
                                    </div>

                                    {streak > 0 && (
                                        <div className="streak-badge">
                                            <Flame size={14} />
                                            <span>{streak}</span>
                                        </div>
                                    )}

                                    <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* Suggestions when habits exist */}
                {habits.length > 0 && habits.length < 8 && (
                    <div className="more-suggestions">
                        <h4>Add more habits</h4>
                        <div className="suggestion-scroll">
                            {habitSuggestions
                                .filter(s => !habits.some(h => h.name === s.name))
                                .slice(0, 4)
                                .map((s, i) => (
                                    <button key={i} className="mini-suggestion" onClick={() => addFromSuggestion(s)}>
                                        <span>{s.icon}</span>
                                        <span>{s.name}</span>
                                        <Plus size={14} />
                                    </button>
                                ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            className="add-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h2>New Habit</h2>

                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Morning meditation"
                                    value={newHabit.name}
                                    onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Icon</label>
                                <div className="icon-picker">
                                    {['✨', '💪', '📚', '🧘', '💧', '🎯', '✍️', '🏃', '🎨', '💤', '🥗', '📱'].map(icon => (
                                        <button
                                            key={icon}
                                            className={`icon-btn ${newHabit.icon === icon ? 'selected' : ''}`}
                                            onClick={() => setNewHabit({ ...newHabit, icon })}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Frequency</label>
                                <div className="frequency-picker">
                                    {['daily', 'weekdays', 'weekly'].map(freq => (
                                        <button
                                            key={freq}
                                            className={`freq-btn ${newHabit.frequency === freq ? 'selected' : ''}`}
                                            onClick={() => setNewHabit({ ...newHabit, frequency: freq })}
                                        >
                                            {freq}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button className="save-btn" onClick={addHabit} disabled={!newHabit.name.trim()}>
                                    Add Habit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .habits-page {
          min-height: 100vh;
          background: var(--bg-primary);
          padding-bottom: var(--space-3xl);
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg);
          position: sticky;
          top: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(12px);
          z-index: 10;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .page-header h1 {
          font-family: var(--font-display);
          font-size: 1.25rem;
        }

        .back-btn, .add-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: var(--text-primary);
          cursor: pointer;
        }

        .add-btn {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        /* Stats Bar */
        .stats-bar {
          display: flex;
          justify-content: space-around;
          padding: var(--space-lg);
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-secondary);
        }

        .stat-item span {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-item small {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-item.highlight {
          color: #f59e0b;
        }

        .stat-item.highlight span {
          color: #f59e0b;
        }

        /* Content */
        .habits-content {
          padding: var(--space-lg);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: var(--space-2xl);
        }

        .empty-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: var(--space-lg);
        }

        .empty-state h3 {
          margin-bottom: var(--space-sm);
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: var(--space-xl);
        }

        .suggestions h4 {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
        }

        .suggestion-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-sm);
        }

        .suggestion-chip {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .suggestion-chip:hover {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        /* Habits List */
        .habits-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .habit-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          transition: all 0.2s;
        }

        .habit-card.completed {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .habit-check {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
        }

        .habit-check.checked {
          background: #22c55e;
          border-color: #22c55e;
        }

        .habit-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .habit-icon {
          font-size: 1.5rem;
        }

        .habit-text {
          display: flex;
          flex-direction: column;
        }

        .habit-name {
          font-weight: 500;
        }

        .habit-card.completed .habit-name {
          text-decoration: line-through;
          opacity: 0.7;
        }

        .habit-freq {
          font-size: 0.7rem;
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .streak-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(245, 158, 11, 0.2);
          border-radius: 12px;
          color: #f59e0b;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .delete-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s;
        }

        .habit-card:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          color: #ef4444;
        }

        /* More Suggestions */
        .more-suggestions {
          margin-top: var(--space-xl);
          padding-top: var(--space-lg);
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .more-suggestions h4 {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
        }

        .suggestion-scroll {
          display: flex;
          gap: var(--space-sm);
          overflow-x: auto;
          padding-bottom: var(--space-sm);
        }

        .mini-suggestion {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          color: var(--text-secondary);
          font-size: 0.7rem;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mini-suggestion:hover {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: var(--space-lg);
        }

        .add-modal {
          width: 100%;
          max-width: 400px;
          background: var(--bg-secondary);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: var(--space-xl);
        }

        .add-modal h2 {
          margin-bottom: var(--space-lg);
          text-align: center;
        }

        .form-group {
          margin-bottom: var(--space-lg);
        }

        .form-group label {
          display: block;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-sm);
        }

        .form-group input {
          width: 100%;
          padding: var(--space-md);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .icon-picker {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--space-sm);
        }

        .icon-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-btn.selected {
          border-color: var(--accent-primary);
          background: rgba(124, 58, 237, 0.2);
        }

        .frequency-picker {
          display: flex;
          gap: var(--space-sm);
        }

        .freq-btn {
          flex: 1;
          padding: var(--space-sm);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.75rem;
          text-transform: capitalize;
          cursor: pointer;
          transition: all 0.2s;
        }

        .freq-btn.selected {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .modal-actions {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-xl);
        }

        .cancel-btn, .save-btn {
          flex: 1;
          padding: var(--space-md);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: var(--text-primary);
        }

        .save-btn {
          background: var(--accent-primary);
          border: none;
          color: white;
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    )
}
