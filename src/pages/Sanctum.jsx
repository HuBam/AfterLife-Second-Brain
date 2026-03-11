import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { ArrowLeft, Plus, Star, Sun, Moon, Compass } from 'lucide-react'

export default function Sanctum() {
    const { realms, addRealmEntry } = useStore()
    const realm = realms.sanctum
    const [showAddEntry, setShowAddEntry] = useState(false)
    const [newEntry, setNewEntry] = useState({ title: '', content: '', type: 'reflection' })

    const handleAddEntry = () => {
        if (newEntry.title.trim()) {
            addRealmEntry('sanctum', newEntry)
            setNewEntry({ title: '', content: '', type: 'reflection' })
            setShowAddEntry(false)
        }
    }

    const entryTypes = [
        { value: 'reflection', label: 'Reflection', icon: Moon },
        { value: 'gratitude', label: 'Gratitude', icon: Sun },
        { value: 'purpose', label: 'Purpose', icon: Compass },
    ]

    return (
        <div className="realm-page">
            <header className="realm-header" style={{ '--realm-color': realm.color }}>
                <div className="container">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <div className="realm-title">
                        <span className="realm-icon-large">{realm.icon}</span>
                        <div>
                            <h1>{realm.name}</h1>
                            <p className="text-secondary">{realm.subtitle} · {realm.description}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mt-xl">
                <div className="stats-row">
                    <div className="stat-card glass-card">
                        <Star size={24} style={{ color: realm.color }} />
                        <div>
                            <span className="stat-value">{realm.entries.length}</span>
                            <span className="stat-label">Reflections</span>
                        </div>
                    </div>
                    <div className="stat-card glass-card">
                        <Sun size={24} style={{ color: realm.color }} />
                        <div>
                            <span className="stat-value">{realm.balance}%</span>
                            <span className="stat-label">Alignment</span>
                        </div>
                    </div>
                </div>

                <motion.button className="add-entry-btn" onClick={() => setShowAddEntry(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ '--realm-color': realm.color }}>
                    <Plus size={20} /> Add Reflection
                </motion.button>

                {showAddEntry && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowAddEntry(false)}>
                        <motion.div className="modal glass-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()}>
                            <h3 className="mb-lg">New {realm.name} Entry</h3>
                            <div className="entry-types">
                                {entryTypes.map(({ value, label, icon: Icon }) => (
                                    <button key={value} className={`type-btn ${newEntry.type === value ? 'active' : ''}`} onClick={() => setNewEntry({ ...newEntry, type: value })} style={{ '--realm-color': realm.color }}>
                                        <Icon size={18} /> {label}
                                    </button>
                                ))}
                            </div>
                            <input type="text" placeholder="Title" value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} className="modal-input mt-lg" autoFocus />
                            <textarea placeholder="What's on your mind?" value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} className="modal-textarea mt-md" rows={4} />
                            <div className="flex gap-md mt-lg">
                                <button className="btn btn-ghost" onClick={() => setShowAddEntry(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddEntry} disabled={!newEntry.title.trim()}>Add Entry</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                <section className="entries-section mt-xl">
                    <h3 className="mb-lg">Spiritual Journey</h3>
                    {realm.entries.length === 0 ? (
                        <div className="empty-state glass-card">
                            <Star size={48} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                            <p className="text-muted mt-md">No reflections yet</p>
                            <p className="text-sm text-secondary">Track your gratitude, purpose, and spiritual growth</p>
                        </div>
                    ) : (
                        <div className="entries-list">
                            {realm.entries.map((entry, index) => (
                                <motion.div key={entry.id} className="entry-card glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                                    <div className="entry-header">
                                        <span className="entry-type" style={{ background: realm.color }}>{entry.type}</span>
                                        <span className="entry-date text-xs text-muted">{new Date(entry.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="mt-sm">{entry.title}</h4>
                                    {entry.content && <p className="text-secondary text-sm mt-sm">{entry.content}</p>}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <style>{`
        .realm-page { min-height: 100vh; padding-bottom: var(--space-3xl); }
        .realm-header { padding: var(--space-xl) 0; background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%); border-bottom: 1px solid var(--border-subtle); position: relative; }
        .realm-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--realm-color), transparent); }
        .back-link { display: inline-flex; align-items: center; gap: var(--space-sm); color: var(--text-secondary); text-decoration: none; margin-bottom: var(--space-lg); }
        .back-link:hover { color: var(--text-primary); }
        .realm-title { display: flex; align-items: center; gap: var(--space-lg); }
        .realm-icon-large { font-size: 3rem; }
        .stats-row { display: flex; gap: var(--space-lg); }
        .stat-card { display: flex; align-items: center; gap: var(--space-md); flex: 1; }
        .stat-value { display: block; font-family: var(--font-display); font-size: 1.5rem; color: var(--text-primary); }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); }
        .add-entry-btn { display: flex; align-items: center; justify-content: center; gap: var(--space-sm); width: 100%; padding: var(--space-md); margin-top: var(--space-lg); background: linear-gradient(135deg, var(--realm-color), transparent); border: 1px dashed var(--realm-color); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-primary); font-size: 0.875rem; cursor: pointer; }
        .add-entry-btn:hover { background: var(--realm-color); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; padding: var(--space-lg); z-index: 1000; }
        .modal { width: 100%; max-width: 500px; }
        .entry-types { display: flex; gap: var(--space-sm); }
        .type-btn { display: flex; align-items: center; gap: var(--space-xs); padding: var(--space-sm) var(--space-md); background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--text-secondary); font-family: var(--font-primary); font-size: 0.875rem; cursor: pointer; }
        .type-btn.active { background: var(--realm-color); border-color: var(--realm-color); color: white; }
        .modal-input, .modal-textarea { width: 100%; padding: var(--space-md); background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); color: var(--text-primary); font-family: var(--font-primary); font-size: 1rem; outline: none; }
        .modal-input:focus, .modal-textarea:focus { border-color: var(--accent-primary); }
        .modal-textarea { resize: vertical; min-height: 100px; }
        .empty-state { text-align: center; padding: var(--space-3xl); }
        .entries-list { display: flex; flex-direction: column; gap: var(--space-md); }
        .entry-header { display: flex; align-items: center; justify-content: space-between; }
        .entry-type { padding: 2px 8px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 500; color: white; text-transform: capitalize; }
      `}</style>
        </div>
    )
}
