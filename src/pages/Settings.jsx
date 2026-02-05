import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import {
    ArrowLeft, Palette, Moon, Sun, Zap, Volume2, Bell,
    Shield, Download, Trash2, Check
} from 'lucide-react'

// Available themes
const themes = [
    {
        key: 'cyber',
        name: 'Cyberpunk',
        accent: '#4a9eff',
        bg: '#0a1a1a',
        description: 'Sci-fi teal & cyan'
    },
    {
        key: 'neon',
        name: 'Neon Purple',
        accent: '#a855f7',
        bg: '#0a0a14',
        description: 'Vibrant purple glow'
    },
    {
        key: 'emerald',
        name: 'Emerald',
        accent: '#22c55e',
        bg: '#0a140a',
        description: 'Matrix green vibes'
    },
    {
        key: 'sakura',
        name: 'Sakura',
        accent: '#ec4899',
        bg: '#140a10',
        description: 'Soft pink aesthetic'
    },
    {
        key: 'amber',
        name: 'Amber',
        accent: '#f59e0b',
        bg: '#14100a',
        description: 'Warm golden tones'
    },
    {
        key: 'arctic',
        name: 'Arctic',
        accent: '#06b6d4',
        bg: '#0a1214',
        description: 'Cool ice blue'
    },
    {
        key: 'blood',
        name: 'Crimson',
        accent: '#ef4444',
        bg: '#140a0a',
        description: 'Dark red intensity'
    },
    {
        key: 'mono',
        name: 'Monochrome',
        accent: '#a1a1aa',
        bg: '#0a0a0a',
        description: 'Clean grayscale'
    },
]

export default function Settings() {
    const { user, updateUser, resetStore } = useStore()
    const [currentTheme, setCurrentTheme] = useState(user.theme || 'cyber')
    const [showResetConfirm, setShowResetConfirm] = useState(false)

    const applyTheme = (themeKey) => {
        const theme = themes.find(t => t.key === themeKey)
        if (theme) {
            setCurrentTheme(themeKey)
            updateUser({ theme: themeKey })

            // Apply CSS variables
            document.documentElement.style.setProperty('--accent-primary', theme.accent)
            document.documentElement.style.setProperty('--accent-glow', `${theme.accent}66`)
            document.documentElement.style.setProperty('--bg-primary', theme.bg)
        }
    }

    const handleReset = () => {
        if (showResetConfirm) {
            resetStore()
            window.location.reload()
        } else {
            setShowResetConfirm(true)
            setTimeout(() => setShowResetConfirm(false), 3000)
        }
    }

    return (
        <div className="settings-page">
            {/* Header */}
            <header className="settings-header">
                <Link to="/" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <h1>Settings</h1>
                <div style={{ width: 40 }} />
            </header>

            <main className="settings-content">
                {/* Theme Selection */}
                <section className="settings-section">
                    <div className="section-header">
                        <Palette size={20} />
                        <h2>Theme</h2>
                    </div>

                    <div className="theme-grid">
                        {themes.map((theme) => (
                            <motion.button
                                key={theme.key}
                                className={`theme-card ${currentTheme === theme.key ? 'active' : ''}`}
                                onClick={() => applyTheme(theme.key)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{ '--theme-accent': theme.accent, '--theme-bg': theme.bg }}
                            >
                                <div className="theme-preview">
                                    <div className="preview-circle" />
                                    <div className="preview-bars">
                                        <div className="preview-bar" />
                                        <div className="preview-bar short" />
                                    </div>
                                </div>
                                <div className="theme-info">
                                    <span className="theme-name">{theme.name}</span>
                                    <span className="theme-desc">{theme.description}</span>
                                </div>
                                {currentTheme === theme.key && (
                                    <div className="theme-check">
                                        <Check size={16} />
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </section>

                {/* Mode Selection */}
                <section className="settings-section">
                    <div className="section-header">
                        <Zap size={20} />
                        <h2>Mode</h2>
                    </div>

                    <div className="mode-grid">
                        <button
                            className={`mode-card ${user.mode === 'basic' ? 'active' : ''}`}
                            onClick={() => updateUser({ mode: 'basic' })}
                        >
                            <div className="mode-icon">📱</div>
                            <div className="mode-info">
                                <span className="mode-name">Basic</span>
                                <span className="mode-desc">Simple, clean interface with essential features</span>
                            </div>
                            {user.mode === 'basic' && <div className="mode-check"><Check size={16} /></div>}
                        </button>

                        <button
                            className={`mode-card ${user.mode === 'advanced' ? 'active' : ''}`}
                            onClick={() => updateUser({ mode: 'advanced' })}
                        >
                            <div className="mode-icon">🎮</div>
                            <div className="mode-info">
                                <span className="mode-name">Advanced</span>
                                <span className="mode-desc">Full game UI with stats, menus & animations</span>
                            </div>
                            {user.mode === 'advanced' && <div className="mode-check"><Check size={16} /></div>}
                        </button>
                    </div>
                </section>

                {/* Display Settings */}
                <section className="settings-section">
                    <div className="section-header">
                        <Sun size={20} />
                        <h2>Display</h2>
                    </div>

                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <Moon size={18} />
                                <span>Dark Mode</span>
                            </div>
                            <div className="toggle active">
                                <div className="toggle-knob" />
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <Zap size={18} />
                                <span>Animations</span>
                            </div>
                            <div className="toggle active">
                                <div className="toggle-knob" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="settings-section">
                    <div className="section-header">
                        <Bell size={20} />
                        <h2>Notifications</h2>
                    </div>

                    <div className="settings-list">
                        <div className="setting-item">
                            <div className="setting-info">
                                <Bell size={18} />
                                <span>Push Notifications</span>
                            </div>
                            <div className="toggle">
                                <div className="toggle-knob" />
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <Volume2 size={18} />
                                <span>Sound Effects</span>
                            </div>
                            <div className="toggle">
                                <div className="toggle-knob" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data */}
                <section className="settings-section">
                    <div className="section-header">
                        <Shield size={20} />
                        <h2>Data</h2>
                    </div>

                    <div className="settings-list">
                        <button className="setting-item clickable">
                            <div className="setting-info">
                                <Download size={18} />
                                <span>Export Data</span>
                            </div>
                        </button>

                        <button
                            className={`setting-item clickable danger ${showResetConfirm ? 'confirming' : ''}`}
                            onClick={handleReset}
                        >
                            <div className="setting-info">
                                <Trash2 size={18} />
                                <span>{showResetConfirm ? 'Click again to confirm' : 'Reset All Data'}</span>
                            </div>
                        </button>
                    </div>
                </section>

                {/* App Info */}
                <div className="app-info">
                    <span className="app-name">AFTERLIFE</span>
                    <span className="app-version">Version 1.0.0</span>
                </div>
            </main>

            <style>{`
        .settings-page {
          min-height: 100vh;
          background: var(--bg-primary);
          padding-bottom: var(--space-3xl);
        }

        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-lg);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.3);
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(12px);
        }

        .settings-header h1 {
          font-size: 1.25rem;
          font-family: var(--font-display);
        }

        .back-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: var(--text-primary);
        }

        .settings-content {
          padding: var(--space-lg);
          max-width: 600px;
          margin: 0 auto;
        }

        .settings-section {
          margin-bottom: var(--space-xl);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
          color: var(--accent-primary);
        }

        .section-header h2 {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Theme Grid */
        .theme-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-md);
        }

        .theme-card {
          display: flex;
          flex-direction: column;
          padding: var(--space-md);
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          text-align: left;
        }

        .theme-card:hover {
          border-color: rgba(255,255,255,0.2);
        }

        .theme-card.active {
          border-color: var(--theme-accent);
          background: rgba(255,255,255,0.05);
        }

        .theme-preview {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
        }

        .preview-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--theme-accent);
          box-shadow: 0 0 15px var(--theme-accent);
        }

        .preview-bars {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preview-bar {
          height: 6px;
          background: var(--theme-accent);
          border-radius: 3px;
          opacity: 0.7;
        }

        .preview-bar.short {
          width: 60%;
          opacity: 0.4;
        }

        .theme-info {
          display: flex;
          flex-direction: column;
        }

        .theme-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .theme-desc {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }

        .theme-check {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--theme-accent);
          border-radius: 50%;
          color: #000;
        }

        /* Mode Grid */
        .mode-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .mode-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg);
          background: rgba(255,255,255,0.03);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          text-align: left;
          width: 100%;
          color: inherit;
        }

        .mode-card:hover {
          border-color: rgba(255,255,255,0.2);
        }

        .mode-card.active {
          border-color: var(--accent-primary);
          background: rgba(255,255,255,0.05);
        }

        .mode-icon {
          font-size: 2rem;
        }

        .mode-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .mode-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .mode-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .mode-check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-primary);
          border-radius: 50%;
          color: #000;
        }

        /* Settings List */
        .settings-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
        }

        .setting-item.clickable {
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
          text-align: left;
          color: inherit;
        }

        .setting-item.clickable:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }

        .setting-item.danger {
          border-color: rgba(239, 68, 68, 0.2);
        }

        .setting-item.danger:hover,
        .setting-item.danger.confirming {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.4);
          color: #ef4444;
        }

        .setting-info {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .toggle {
          width: 44px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 2px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle.active {
          background: var(--accent-primary);
        }

        .toggle-knob {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .toggle.active .toggle-knob {
          transform: translateX(20px);
        }

        /* App Info */
        .app-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-top: var(--space-2xl);
          padding: var(--space-lg);
          opacity: 0.5;
        }

        .app-name {
          font-family: var(--font-display);
          font-size: 0.875rem;
          letter-spacing: 0.2em;
        }

        .app-version {
          font-size: 0.75rem;
        }

        @media (max-width: 400px) {
          .theme-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}
