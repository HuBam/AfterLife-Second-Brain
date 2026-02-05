import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
  Home, Brain, Palette, Heart, Skull, Moon,
  Cpu, Clock, TrendingUp, Activity, Settings,
  User, Sparkles, Grid3X3, X, Trophy, Flame
} from 'lucide-react'
import { personalityTypes } from '../data/mbtiData'
import AgeDisplay from '../components/AgeDisplay'
import ReligionWidget from '../components/ReligionWidget'

export default function Dashboard() {
  const { user, realms, getOverallBalance } = useStore()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Safety check for critical data - AFTER all hook calls
  if (!user || !realms || Object.keys(realms).length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a1a1a 0%, #0d1f1f 50%, #0a1515 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '8px', fontSize: '1.25rem' }}>NEURAL SYNC ERROR</h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>Realm data disconnected.</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{
              padding: '8px 16px',
              border: '1px solid #ef4444',
              background: 'transparent',
              color: '#ef4444',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            HARD RESET
          </button>
        </div>
      </div>
    )
  }

  // These computations are now safe because we verified realms exists
  const overallBalance = getOverallBalance()

  // Calculate user "level" safely
  const totalEntries = Object.values(realms).reduce((sum, r) => sum + (r?.entries?.length || 0), 0)
  const userLevel = Math.floor(totalEntries / 5) + 1
  const xpProgress = (totalEntries % 5) * 20

  const personality = user.mbti ? personalityTypes?.[user.mbti] : null

  // Quotient mapping to realms - Safely access properties
  const safeRealm = (key) => realms[key] || { color: '#888', balance: 0, entries: [] }

  const quotients = [
    { key: 'IQ', name: 'Intelligence', realm: 'cerebra', color: safeRealm('cerebra').color, value: safeRealm('cerebra').balance },
    { key: 'TQ', name: 'Technical/Creative', realm: 'elysia', color: safeRealm('elysia').color, value: safeRealm('elysia').balance },
    { key: 'EQ', name: 'Emotional', realm: 'empyra', color: safeRealm('empyra').color, value: safeRealm('empyra').balance },
    { key: 'AQ', name: 'Adversity', realm: 'oblivion', color: safeRealm('oblivion').color, value: safeRealm('oblivion').balance },
    { key: 'SQ', name: 'Spiritual', realm: 'sanctum', color: safeRealm('sanctum').color, value: safeRealm('sanctum').balance },
  ]

  // Menu items for hexagonal grid
  const menuItems = [
    { key: 'cerebra', path: '/cerebra', icon: Brain, label: 'Cerebra', color: realms.cerebra.color, count: realms.cerebra.entries.length },
    { key: 'elysia', path: '/elysia', icon: Palette, label: 'Elysia', color: realms.elysia.color, count: realms.elysia.entries.length },
    { key: 'empyra', path: '/empyra', icon: Heart, label: 'Empyra', color: realms.empyra.color, count: realms.empyra.entries.length },
    { key: 'oblivion', path: '/oblivion', icon: Skull, label: 'Oblivion', color: realms.oblivion.color, count: realms.oblivion.entries.length },
    { key: 'sanctum', path: '/sanctum', icon: Moon, label: 'Sanctum', color: realms.sanctum.color, count: realms.sanctum.entries.length },
    { key: 'echo', path: '/echo', icon: Cpu, label: 'ECHO', color: '#4a9eff' },
    { key: 'timeline', path: '/timeline', icon: Clock, label: 'Chronos', color: '#22c55e' },
    { key: 'recap', path: '/recap', icon: TrendingUp, label: 'Recap', color: '#f59e0b' },
    { key: 'avatar', path: '/avatar', icon: Activity, label: 'Health', color: '#ef4444' },
    { key: 'constellation', path: '/constellation', icon: Sparkles, label: 'Skills', color: '#a855f7' },
    { key: 'achievements', path: '/achievements', icon: Trophy, label: 'Collection', color: '#fbbf24' },
    { key: 'habits', path: '/habits', icon: Flame, label: 'Habits', color: '#f97316' },
  ]

  // Bottom nav items
  const bottomNav = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/avatar', icon: User, label: 'Avatar' },
    { action: 'menu', icon: Grid3X3, label: 'Menu' },
    { path: '/echo', icon: Cpu, label: 'ECHO' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="game-dashboard">
      {/* Main Content */}
      <main className="dashboard-content">
        {/* Profile Card */}
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Top Stats Bar */}
          <div className="top-stats">
            <div className="stat-chip">
              <span className="stat-icon">⚡</span>
              <span>{totalEntries}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-icon">🎯</span>
              <span>{overallBalance}%</span>
            </div>
            <div className="stat-chip">
              <span className="stat-icon">📊</span>
              <span>Lv.{userLevel}</span>
            </div>
          </div>

          {/* Character Display */}
          <div className="character-section">
            {/* HP/XP Bar */}
            <div className="hp-bar-container">
              <div className="hp-bar">
                <motion.div
                  className="hp-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallBalance}%` }}
                />
              </div>
              <span className="hp-text">{overallBalance}/100</span>
            </div>

            {/* Avatar Circle */}
            <Link to="/avatar" className="character-avatar">
              <div className="avatar-glow" />
              <div className="avatar-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="level-ring">
                <span>Lv{userLevel}</span>
              </div>
            </Link>

            {/* Name & Status */}
            <h1 className="character-name">{user.name}</h1>

            {/* MBTI Badge */}
            {user.mbti && (
              <div className="mbti-badge">
                <span className="mbti-type">{user.mbti}</span>
                {personality && <span className="mbti-title">{personality.name}</span>}
              </div>
            )}

            {/* Interactive Age Display */}
            {user.birthDate && (
              <AgeDisplay
                birthDate={user.birthDate}
                birthTime={user.birthTime}
                onEditBirth={() => {/* Could navigate to settings */ }}
              />
            )}
          </div>

          {/* MBTI Scores */}
          {user.mbtiScores && (
            <div className="mbti-bars">
              {[
                { d1: 'E', d2: 'I', c1: '#f59e0b', c2: '#3b82f6' },
                { d1: 'S', d2: 'N', c1: '#22c55e', c2: '#a855f7' },
                { d1: 'T', d2: 'F', c1: '#ef4444', c2: '#ec4899' },
                { d1: 'J', d2: 'P', c1: '#06b6d4', c2: '#f97316' },
              ].map(({ d1, d2, c1, c2 }) => (
                <div key={d1} className="mbti-row">
                  <span className="mbti-label" style={{ color: (user.mbtiScores?.[d1] ?? 0) > 50 ? c1 : 'inherit' }}>{d1}</span>
                  <div className="mbti-track">
                    <div className="mbti-fill" style={{ width: `${user.mbtiScores?.[d1] ?? 0}%`, background: c1 }} />
                  </div>
                  <span className="mbti-label" style={{ color: (user.mbtiScores?.[d2] ?? 0) > 50 ? c2 : 'inherit' }}>{d2}</span>
                </div>
              ))}
            </div>
          )}

          {/* Realm Stats */}
          <div className="realm-stats">
            {Object.entries(realms).map(([key, realm]) => (
              <Link to={`/${key}`} key={key} className="realm-stat">
                <div className="realm-icon-small" style={{ background: realm.color }}>
                  {realm.icon}
                </div>
                <div className="realm-bar">
                  <div
                    className="realm-fill"
                    style={{ width: `${realm.balance}%`, background: realm.color }}
                  />
                </div>
                <span className="realm-value">{realm.balance}</span>
              </Link>
            ))}
          </div>

          {/* Quotient Pentagon Diagram */}
          <div className="quotient-section">
            <h3 className="section-label">Quotient Analysis</h3>
            <div className="quotient-pentagon">
              <svg viewBox="0 0 200 200" className="pentagon-svg">
                {/* Background pentagon */}
                <polygon
                  points="100,10 190,75 155,175 45,175 10,75"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <polygon
                  points="100,40 160,85 140,155 60,155 40,85"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
                <polygon
                  points="100,70 130,95 120,135 80,135 70,95"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />

                {/* Value pentagon - scaled by quotient values */}
                <polygon
                  points={`
                    100,${10 + (100 - quotients[0].value) * 0.9}
                    ${190 - (100 - quotients[1].value) * 0.9},${75 + (100 - quotients[1].value) * 0.3}
                    ${155 - (100 - quotients[2].value) * 0.5},${175 - (100 - quotients[2].value) * 0.8}
                    ${45 + (100 - quotients[3].value) * 0.5},${175 - (100 - quotients[3].value) * 0.8}
                    ${10 + (100 - quotients[4].value) * 0.9},${75 + (100 - quotients[4].value) * 0.3}
                  `}
                  fill="rgba(74, 158, 255, 0.2)"
                  stroke="#4a9eff"
                  strokeWidth="2"
                />

                {/* Labels */}
                <text x="100" y="5" textAnchor="middle" fill="#4a9eff" fontSize="10" fontWeight="600">IQ</text>
                <text x="195" y="78" textAnchor="start" fill="#f59e0b" fontSize="10" fontWeight="600">TQ</text>
                <text x="165" y="185" textAnchor="middle" fill="#ec4899" fontSize="10" fontWeight="600">EQ</text>
                <text x="35" y="185" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="600">AQ</text>
                <text x="5" y="78" textAnchor="end" fill="#8b5cf6" fontSize="10" fontWeight="600">SQ</text>
              </svg>
            </div>

            {/* Quotient bars */}
            <div className="quotient-bars">
              {quotients.map(q => (
                <Link to={`/${q.realm}`} key={q.key} className="quotient-bar-row">
                  <span className="q-key" style={{ color: q.color }}>{q.key}</span>
                  <span className="q-name">{q.name}</span>
                  <div className="q-bar">
                    <div className="q-fill" style={{ width: `${q.value}%`, background: q.color }} />
                  </div>
                  <span className="q-value">{q.value}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Religion Widget */}
          <ReligionWidget />
        </motion.div>
      </main>

      {/* Hexagonal Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="hex-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="hex-menu-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-menu" onClick={() => setMenuOpen(false)}>
                <X size={24} />
              </button>

              <div className="hex-grid">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className="hex-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="hex-shape" style={{ '--hex-color': item.color }}>
                        <item.icon size={28} />
                      </div>
                      {item.count !== undefined && (
                        <span className="hex-badge">{item.count}</span>
                      )}
                      <span className="hex-label">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {bottomNav.map((item) => (
          item.action === 'menu' ? (
            <button
              key="menu"
              className={`nav-item menu-trigger ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="nav-icon-wrap">
                {menuOpen ? <X size={24} /> : <item.icon size={24} />}
              </div>
              <span className="nav-label">{menuOpen ? 'Close' : item.label}</span>
            </button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className="nav-icon-wrap">
                <item.icon size={20} />
              </div>
              <span className="nav-label">{item.label}</span>
            </Link>
          )
        ))}
      </nav>

      <style>{`
        .game-dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a1a1a 0%, #0d1f1f 50%, #0a1515 100%);
          padding-bottom: 80px;
        }

        .dashboard-content {
          padding: var(--space-lg);
          max-width: 500px;
          margin: 0 auto;
        }

        /* Profile Card */
        .profile-card {
          background: linear-gradient(135deg, rgba(20, 40, 40, 0.9), rgba(15, 30, 30, 0.9));
          border: 2px solid rgba(74, 158, 255, 0.3);
          border-radius: 16px;
          padding: var(--space-lg);
          box-shadow: 
            0 0 20px rgba(74, 158, 255, 0.1),
            inset 0 1px 0 rgba(255,255,255,0.05);
        }

        /* Top Stats */
        .top-stats {
          display: flex;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .stat-chip {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: rgba(74, 158, 255, 0.15);
          border: 1px solid rgba(74, 158, 255, 0.3);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .stat-icon { font-size: 0.875rem; }

        /* Character Section */
        .character-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: var(--space-lg);
        }

        .hp-bar-container {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
        }

        .hp-bar {
          flex: 1;
          height: 12px;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(74, 158, 255, 0.3);
          border-radius: 6px;
          overflow: hidden;
        }

        .hp-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 6px;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .hp-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #4ade80;
          min-width: 60px;
          text-align: right;
        }

        /* Avatar */
        .character-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: var(--space-md);
        }

        .avatar-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(74, 158, 255, 0.3), transparent 70%);
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a3a3a, #0d2020);
          border: 3px solid rgba(74, 158, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #4a9eff;
          position: relative;
          z-index: 1;
        }

        .level-ring {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #f59e0b, #d97706);
          padding: 2px 12px;
          border-radius: 10px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #000;
          z-index: 2;
        }

        .character-name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: #4a9eff;
          text-shadow: 0 0 10px rgba(74, 158, 255, 0.5);
          margin-bottom: var(--space-sm);
        }

        .mbti-badge {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-xs) var(--space-md);
          background: rgba(74, 158, 255, 0.1);
          border: 1px solid rgba(74, 158, 255, 0.3);
          border-radius: 8px;
          margin-bottom: var(--space-xs);
        }

        .mbti-type {
          font-weight: 700;
          font-size: 1rem;
          color: #4a9eff;
        }

        .mbti-title {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .age-display {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        /* MBTI Bars */
        .mbti-bars {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
          padding: var(--space-md);
          background: rgba(0,0,0,0.2);
          border-radius: 8px;
        }

        .mbti-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mbti-label {
          font-size: 0.7rem;
          font-weight: 700;
          width: 14px;
          text-align: center;
        }

        .mbti-track {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .mbti-fill {
          height: 100%;
          border-radius: 3px;
        }

        /* Realm Stats */
        .realm-stats {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .realm-stat {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm);
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }

        .realm-stat:hover {
          background: rgba(74, 158, 255, 0.1);
          border-color: rgba(74, 158, 255, 0.3);
        }

        .realm-icon-small {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }

        .realm-bar {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .realm-fill {
          height: 100%;
          border-radius: 4px;
        }

        .realm-value {
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 24px;
          text-align: right;
        }

        /* Quotient Section */
        .quotient-section {
          margin-top: var(--space-lg);
          padding-top: var(--space-lg);
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: var(--space-md);
        }

        .quotient-pentagon {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-lg);
        }

        .pentagon-svg {
          width: 200px;
          height: 200px;
        }

        .quotient-bars {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quotient-bar-row {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          text-decoration: none;
          color: inherit;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .quotient-bar-row:hover {
          background: rgba(255,255,255,0.05);
        }

        .q-key {
          font-size: 0.75rem;
          font-weight: 700;
          width: 24px;
        }

        .q-name {
          font-size: 0.65rem;
          color: var(--text-secondary);
          width: 80px;
        }

        .q-bar {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .q-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .q-value {
          font-size: 0.7rem;
          font-weight: 600;
          width: 24px;
          text-align: right;
        }

        /* Hexagonal Menu Overlay */
        .hex-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 15, 15, 0.95);
          backdrop-filter: blur(20px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hex-menu-container {
          width: 100%;
          max-width: 400px;
          padding: var(--space-xl);
          position: relative;
        }

        .close-menu {
          position: absolute;
          top: 0;
          right: var(--space-lg);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          color: white;
          cursor: pointer;
        }

        .hex-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
          justify-items: center;
        }

        .hex-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          text-decoration: none;
          color: inherit;
          position: relative;
        }

        .hex-shape {
          width: 70px;
          height: 80px;
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.15), rgba(74, 158, 255, 0.05));
          border: 2px solid rgba(74, 158, 255, 0.3);
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--hex-color, #4a9eff);
          transition: all 0.2s;
        }

        .hex-item:hover .hex-shape {
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.3), rgba(74, 158, 255, 0.15));
          border-color: var(--hex-color, #4a9eff);
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(74, 158, 255, 0.3);
        }

        .hex-badge {
          position: absolute;
          top: 0;
          right: 10px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .hex-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        /* Bottom Navigation */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: linear-gradient(180deg, rgba(10, 25, 25, 0.95), rgba(5, 15, 15, 0.98));
          border-top: 1px solid rgba(74, 158, 255, 0.2);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 var(--space-md);
          z-index: 100;
          backdrop-filter: blur(12px);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: var(--space-sm);
          background: none;
          border: none;
          color: var(--text-secondary);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-item.active {
          color: #4a9eff;
        }

        .nav-icon-wrap {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .nav-item.active .nav-icon-wrap {
          background: rgba(74, 158, 255, 0.2);
        }

        .menu-trigger .nav-icon-wrap {
          background: linear-gradient(135deg, rgba(74, 158, 255, 0.3), rgba(74, 158, 255, 0.1));
          border: 1px solid rgba(74, 158, 255, 0.3);
        }

        .menu-trigger.active .nav-icon-wrap {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .nav-label {
          font-size: 0.65rem;
          font-weight: 500;
        }

        @media (max-width: 400px) {
          .hex-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
