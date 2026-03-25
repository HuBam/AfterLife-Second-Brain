import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { useStore } from '../store/useStore'
import {
  Home, Brain, Palette, Heart, Skull, Moon,
  Cpu, Clock, TrendingUp, Activity, Settings,
  User, Sparkles, Grid3X3, X, Trophy, Flame
} from 'lucide-react'
import { personalityTypes } from '../data/mbtiData'
import ReligionWidget from '../components/ReligionWidget'
import NeuralPulse from '../components/NeuralPulse'

// Compact Age display for HUD
function AgeHudDisplay({ birthDate, birthTime }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const ageData = useMemo(() => {
    if (!birthDate) return null
    const [year, month, day] = birthDate.split('-').map(Number)
    let hours = 0, minutes = 0
    if (birthTime) {
      const [h, m] = birthTime.split(':').map(Number)
      hours = h || 0
      minutes = m || 0
    }
    const birth = new Date(year, month - 1, day, hours, minutes, 0, 0)
    const diffMs = now - birth
    if (diffMs < 0) return null

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const years = Math.floor(totalDays / 365.25)
    const remainingDays = totalDays - Math.floor(years * 365.25)
    const months = Math.floor(remainingDays / 30.44)
    const days = Math.floor(remainingDays - (months * 30.44))

    return { years, months, days }
  }, [birthDate, birthTime, now])

  if (!ageData) return <span className="age-value">--</span>

  return (
    <span className="age-value">
      {ageData.years}Y {ageData.months}M {ageData.days}D
    </span>
  )
}

// 2D Skeleton figure for Dashboard — links to Avatar
function SkeletonFigure2D() {
  return (
    <svg viewBox="0 0 60 110" width="46" height="84" style={{ display: 'block' }}>
      {/* Head */}
      <circle cx="30" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Neck */}
      <line x1="30" y1="18" x2="30" y2="23" stroke="currentColor" strokeWidth="2" />
      {/* Shoulders */}
      <line x1="12" y1="26" x2="48" y2="26" stroke="currentColor" strokeWidth="2" />
      {/* Spine */}
      <line x1="30" y1="23" x2="30" y2="58" stroke="currentColor" strokeWidth="2" />
      {/* Ribs */}
      <line x1="30" y1="30" x2="20" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="30" y1="30" x2="40" y2="38" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      <line x1="30" y1="36" x2="20" y2="42" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      <line x1="30" y1="36" x2="40" y2="42" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      {/* Upper arms */}
      <line x1="12" y1="26" x2="6" y2="44" stroke="currentColor" strokeWidth="2" />
      <line x1="48" y1="26" x2="54" y2="44" stroke="currentColor" strokeWidth="2" />
      {/* Lower arms */}
      <line x1="6" y1="44" x2="4" y2="60" stroke="currentColor" strokeWidth="1.8" />
      <line x1="54" y1="44" x2="56" y2="60" stroke="currentColor" strokeWidth="1.8" />
      {/* Pelvis */}
      <path d="M20 58 Q30 64 40 58" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Upper legs */}
      <line x1="22" y1="60" x2="18" y2="82" stroke="currentColor" strokeWidth="2" />
      <line x1="38" y1="60" x2="42" y2="82" stroke="currentColor" strokeWidth="2" />
      {/* Lower legs */}
      <line x1="18" y1="82" x2="16" y2="104" stroke="currentColor" strokeWidth="1.8" />
      <line x1="42" y1="82" x2="44" y2="104" stroke="currentColor" strokeWidth="1.8" />
      {/* Feet */}
      <line x1="16" y1="104" x2="10" y2="108" stroke="currentColor" strokeWidth="1.5" />
      <line x1="44" y1="104" x2="50" y2="108" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function Dashboard() {
  const { user, realms, getOverallBalance, setNeuralPulse, getRealmInsights, getMoodTrend } = useStore()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Generate proactive Neural Pulse on mount
  useEffect(() => {
    try {
      const insights = getRealmInsights()
      const moodTrend = getMoodTrend()

      // Priority 1: negative/declining mood
      if (moodTrend.trend === 'negative') {
        setNeuralPulse({
          message: 'Echo detects a low mood pattern in Empyra. Consider logging a reflection in Sanctum or talking to someone.',
          priority: 'high',
          linkTo: '/soul',
          linkLabel: 'Open Sanctum',
        })
        return
      }
      if (moodTrend.trend === 'declining') {
        setNeuralPulse({
          message: 'Echo notices your mood has been declining. A short reflection or habit completion could shift the trajectory.',
          priority: 'warning',
          linkTo: '/soul',
          linkLabel: 'Open Sanctum',
        })
        return
      }

      // Priority 2: critically low realm
      const critical = insights.realmData?.find(r => r.balance < 15 && r.entries > 0)
      if (critical) {
        setNeuralPulse({
          message: `${critical.name} is critically low at ${critical.balance}%. A single entry here would make a difference.`,
          priority: 'high',
          linkTo: null,
          linkLabel: null,
        })
        return
      }

      // Priority 3: dormant realm
      const dormantInsight = insights.insights?.find(i => i.type === 'dormant')
      if (dormantInsight) {
        setNeuralPulse({
          message: dormantInsight.message,
          priority: 'low',
          linkTo: null,
          linkLabel: null,
        })
      }
    } catch (e) {
      // silently fail — pulse is non-critical
    }
  }, []) // only on mount

  // Safety check
  if (!user?.name || !realms) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#4a9eff' }}>
        Loading...
      </div>
    )
  }

  // Calculate values
  const overallBalance = Math.round(getOverallBalance() || 0)
  const totalXp = useStore(state => state.getTotalXp ? state.getTotalXp() : 0)
  
  // Level is now purely driven by XP from habits & streaks
  const userLevel = Math.floor(totalXp / 500) + 1
  const personality = personalityTypes[user.mbti]

  // Menu items for hex menu
  const menuItems = [
    { key: 'mind', path: '/mind', icon: Brain, label: 'Mind', color: '#4a9eff' },
    { key: 'body', path: '/body', icon: Heart, label: 'Body', color: '#22c55e' },
    { key: 'soul', path: '/soul', icon: Sparkles, label: 'Soul', color: '#a855f7' },
    { key: 'echo', path: '/echo', icon: Cpu, label: 'Echo', color: '#f59e0b' },
    { key: 'religion', path: '/religion', icon: Moon, label: 'Religion', color: '#ec4899' },
    { key: 'avatar', path: '/avatar', icon: User, label: 'Avatar', color: '#06b6d4' },
    { key: 'settings', path: '/settings', icon: Settings, label: 'Settings', color: '#6b7280' },
  ]

  // Bottom nav
  const bottomNav = [
    { path: '/', icon: Home, label: 'Home' },
    { action: 'menu', icon: Grid3X3, label: 'Menu' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="dashboard">
      <main className="dashboard-main">

        {/* Header: Welcome + Name */}
        <div className="header-row">
          <span className="welcome-text">
            {user.mode === 'advanced' ? 'Welcome Player,' : 'Welcome User,'}
          </span>
          <span className="user-name">{user.name}</span>
        </div>

        {/* Stats Row: Age left, Level right */}
        <div className="stats-row">
          <Link to="/timeline" className="stat-block age-chronos-link" title="Open Chronos Timeline">
            <span className="stat-label">AGE <Clock size={9} style={{ display: 'inline', opacity: 0.5 }} /></span>
            {user.birthDate ? (
              <AgeHudDisplay birthDate={user.birthDate} birthTime={user.birthTime} />
            ) : (
              <span className="age-value">--</span>
            )}
          </Link>
          <div className="stat-block right">
            <span className="stat-label">LV</span>
            <span className="level-value">
              {userLevel}
              {user.mode === 'advanced' && (
                <span className="advanced-only" style={{ fontSize: '0.6em', marginLeft: '6px', color: '#f59e0b', textShadow: '0 0 10px #f59e0b' }}>
                  {totalXp} XP
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Gender */}
        <div className="gender-row">
          {user.gender && <span className="gender-text">{user.gender.toUpperCase()}</span>}
        </div>

        {/* MBTI + Skeleton + Avatar Row */}
        <div className="profile-row">
          {user.mbti ? (
            <div className="mbti-block">
              <span className="mbti-code">{user.mbti}</span>
              {personality && <span className="mbti-name">{personality.name}</span>}
            </div>
          ) : null}

          {/* 2D Skeleton — click to enter 3D Avatar */}
          <Link to="/avatar" className="skeleton-2d-btn" title="View your 3D Avatar">
            <SkeletonFigure2D />
            <span className="skeleton-hint">3D</span>
          </Link>

          <Link to="/avatar" className="avatar-block">
            {personality?.avatars?.[user.gender] ? (
              <img src={personality.avatars[user.gender]} alt={user.mbti} className="avatar-img" />
            ) : (
              <span className="avatar-letter">{user.name?.charAt(0).toUpperCase() || '?'}</span>
            )}
          </Link>

          {/* MBTI Score */}
          {user.mbtiScores && (
            <div className="mbti-score-block">
              {['E', 'S', 'T', 'J'].map(d => (
                <span key={d} className="score-chip">
                  {d}:{user.mbtiScores?.[d] || 50}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="streak-row">
          <Flame size={16} className="streak-icon" />
          <span className="streak-num">{user.streak || 0}</span>
          <span className="streak-label">days streak</span>
        </div>

        {/* Echo Button */}
        <Link to="/echo" className="echo-btn">
          <Cpu size={20} />
          <span>Echo</span>
        </Link>

        {/* Realm Totals */}
        <div className="realms-section">
          <span className="section-label">REALMS</span>
          <div className="realm-list">
            {Object.entries(realms).map(([key, realm]) => (
              <div key={key} className="realm-item">
                <span className="realm-icon" style={{ color: realm.color }}>{realm.icon}</span>
                <div className="realm-bar">
                  <div className="realm-fill" style={{ width: `${realm.balance}%`, background: realm.color }} />
                </div>
                <span className="realm-percent">{realm.balance}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Religion Widget */}
        <ReligionWidget />

      </main>

      {/* Neural Pulse — proactive Echo notification */}
      <NeuralPulse />

      {/* Hex Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="menu-container"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setMenuOpen(false)}>
                <X size={24} />
              </button>
              <div className="menu-grid">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={item.path} className="menu-item" onClick={() => setMenuOpen(false)}>
                      <div className="menu-icon" style={{ background: item.color }}>
                        <item.icon size={24} />
                      </div>
                      <span className="menu-label">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {bottomNav.map((item) => (
          item.action === 'menu' ? (
            <button
              key="menu"
              className={`nav-item ${menuOpen ? 'active' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <item.icon size={22} />}
              <span>{menuOpen ? 'Close' : item.label}</span>
            </button>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </Link>
          )
        ))}
      </nav>

      <style>{`
        .dashboard {
          min-height: 100vh;
          background: var(--bg-primary);
          padding-bottom: 80px;
        }

        .dashboard-main {
          padding: var(--space-lg);
          max-width: 480px;
          margin: 0 auto;
        }

        /* Header */
        .header-row {
          margin-bottom: var(--space-md);
        }

        .welcome-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          display: block;
        }

        .user-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        /* Stats Row */
        .stats-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-md);
          padding: var(--card-padding);
          background: var(--bg-card);
          border: var(--border-thickness) solid var(--border-subtle);
          border-radius: var(--radius-md);
          backdrop-filter: blur(var(--blur-amount));
        }

        .stat-block {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .stat-block.right {
          align-items: flex-end;
        }

        .age-chronos-link {
          text-decoration: none;
          cursor: pointer;
          border-bottom: var(--border-thickness) solid var(--border-subtle);
          transition: border-color var(--transition-fast);
        }
        .age-chronos-link:hover {
          border-color: var(--border-accent);
        }
        [data-mode="advanced"] .age-chronos-link:hover .age-value {
          text-shadow: 0 0 10px var(--accent-primary);
        }

        .stat-label {
          font-size: 0.65rem;
          letter-spacing: 1px;
          color: var(--text-muted);
        }

        .age-value, .level-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent-primary);
          font-family: var(--font-display);
        }

        /* Gender */
        .gender-row {
          text-align: center;
          margin-bottom: var(--space-sm);
        }

        .gender-text {
          font-size: 0.75rem;
          letter-spacing: 2px;
          color: var(--text-muted);
        }

        /* Profile Row */
        .profile-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .mbti-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .mbti-code {
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent-primary);
          padding: 4px 12px;
          background: var(--bg-glass);
          border: var(--border-thickness) solid var(--border-subtle);
          border-radius: var(--radius-full);
        }

        .mbti-name {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .avatar-block {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: calc(var(--border-thickness) + 1px) solid var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--bg-secondary);
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .avatar-letter {
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .mbti-score-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .score-chip {
          font-size: 0.65rem;
          padding: 2px 6px;
          background: var(--bg-glass);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
        }

        /* Skeleton 2D button */
        .skeleton-2d-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          color: var(--accent-primary);
          text-decoration: none;
          padding: 6px 10px;
          border: var(--border-thickness) solid var(--border-subtle);
          border-radius: var(--radius-md);
          background: var(--bg-glass);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        [data-mode="advanced"] .skeleton-2d-btn {
          animation: skeleton-breathe 3s ease-in-out infinite;
        }

        .skeleton-2d-btn:hover {
          border-color: var(--accent-primary);
          background: var(--bg-glass);
          transform: scale(var(--hover-scale));
          animation: none;
        }
        
        [data-mode="advanced"] .skeleton-2d-btn:hover {
          box-shadow: 0 0 18px var(--accent-glow);
        }

        .skeleton-hint {
          font-size: 0.55rem;
          letter-spacing: 1.5px;
          color: var(--text-secondary);
          font-family: var(--font-display);
        }

        @keyframes skeleton-breathe {
          0%, 100% { filter: drop-shadow(0 0 3px var(--border-accent)); }
          50% { filter: drop-shadow(0 0 9px var(--accent-glow)); }
        }

        /* Streak */
        .streak-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: var(--space-md);
        }

        .streak-icon {
          color: var(--realm-elysia);
        }

        .streak-num {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--realm-elysia);
        }

        .streak-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Echo Button */
        .echo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: var(--space-md);
          background: var(--bg-card);
          border: var(--border-thickness) solid var(--border-accent);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: var(--space-xl);
          transition: all var(--transition-base);
          backdrop-filter: blur(var(--blur-amount));
        }

        .echo-btn:hover {
          background: var(--bg-glass);
          box-shadow: 0 0 calc(20px * var(--glow-opacity)) var(--accent-glow);
          transform: scale(var(--hover-scale));
        }

        /* Realms */
        .realms-section {
          margin-bottom: var(--space-xl);
          padding: var(--card-padding);
          background: var(--bg-card);
          border: var(--border-thickness) solid var(--border-subtle);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(var(--blur-amount));
        }

        .section-label {
          font-size: 0.7rem;
          letter-spacing: 2px;
          color: var(--text-muted);
          display: block;
          margin-bottom: var(--space-md);
        }

        .realm-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .realm-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .realm-icon {
          font-size: 1rem;
          width: 24px;
          text-align: center;
        }

        .realm-bar {
          flex: 1;
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .realm-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width var(--transition-slow);
        }

        .realm-percent {
          font-size: 0.75rem;
          color: var(--text-secondary);
          width: 35px;
          text-align: right;
        }

        /* Menu Overlay */
        .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }

        .menu-container {
          background: var(--bg-card);
          border: var(--border-thickness) solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
        }

        .menu-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px;
        }

        .menu-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .menu-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* Bottom Nav */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          padding: 12px 0;
          background: var(--bg-card);
          border-top: var(--border-thickness) solid var(--border-subtle);
          backdrop-filter: blur(10px);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          font-size: 0.7rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .nav-item.active {
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  )
}

