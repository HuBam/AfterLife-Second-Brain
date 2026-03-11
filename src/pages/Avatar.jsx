
import { useState, useEffect, useRef, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useStore } from '../store/useStore'
import { ArrowLeft, Activity, Plus, AlertCircle, Crosshair, Zap, Cpu, Search, Eye } from 'lucide-react'
// Temporarily commented out - testing if Three.js is causing crash
// import Skeleton3D from '../components/Skeleton3D'
const Skeleton3D = () => <div style={{ color: '#4a9eff', textAlign: 'center', padding: '40px' }}>3D Skeleton Disabled for Testing</div>
import { personalityTypes } from '../data/mbtiData'
import { spiritAnimals } from '../data/spiritAnimalData'
import { talents, checkTalentUnlock } from '../data/achievementsData'



import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Skeleton Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Fallback to 2D SVG Skeleton
      return (
        <div className="skeleton-svg-fallback h-full w-full flex items-center justify-center relative">
          <div className="absolute top-2 right-2 text-xs text-orange-500 font-mono">⚠️ 3D_FAIL // 2D_BACKUP_ACTIVE</div>
          <svg viewBox="0 0 200 400" className="h-[90%] w-auto opacity-80" style={{ filter: 'drop-shadow(0 0 10px rgba(74, 158, 255, 0.3))' }}>
            <g fill="none" stroke="#4a9eff" strokeWidth="1.5">
              {/* Skull */}
              <path d="M100,30 L120,45 L125,80 L100,95 L75,80 L80,45 Z" />
              {/* Spine */}
              <path d="M100,95 L100,240" strokeDasharray="4 4" />
              {/* Ribs */}
              <path d="M70,120 Q100,110 130,120 M70,140 Q100,130 130,140 M75,160 Q100,150 125,160" />
              {/* Arms */}
              <path d="M100,105 L60,115 L40,180 L30,240" />
              <path d="M100,105 L140,115 L160,180 L170,240" />
              {/* Hips */}
              <path d="M75,240 L125,240 L115,280 L85,280 Z" />
              {/* Legs */}
              <path d="M85,280 L75,350 L70,420" />
              <path d="M115,280 L125,350 L130,420" />
            </g>
            <circle cx="100" cy="150" r="15" className="animate-pulse" stroke="var(--accent-primary)" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        </div>
      )
    }

    return this.props.children
  }
}

export default function Avatar() {
  const { health, addSymptom, user } = useStore()
  const [selectedOrgan, setSelectedOrgan] = useState('brain')
  const [showAddSymptom, setShowAddSymptom] = useState(false)
  const [newSymptom, setNewSymptom] = useState({ description: '', severity: 'mild' })
  const [rotation, setRotation] = useState(0)


  // Auto-rotate when idle
  useEffect(() => {
    let interval;
    if (!selectedOrgan) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360)
      }, 30)
    }
    return () => clearInterval(interval)
  }, [selectedOrgan])

  const organConfigs = {
    brain: { scale: 3.2, x: 0, y: 180, callout: "NEURAL_CORE // SECTOR_01", code: "NC-88-ALPHA", depth: 40 },
    heart: { scale: 2.8, x: -30, y: 50, callout: "CARDIAC_ENGINE // SECTOR_02", code: "CE-12-BETA", depth: 20 },
    lungs: { scale: 2.5, x: 30, y: 80, callout: "RESPIRATORY_ARRAY // SECTOR_03", code: "RA-45-GAMMA", depth: 15 },
    liver: { scale: 3.0, x: 15, y: -30, callout: "METABOLIC_NODE // SECTOR_04", code: "MN-09-DELTA", depth: 10 },
    stomach: { scale: 2.8, x: -20, y: -50, callout: "DIGESTIVE_CORE // SECTOR_05", code: "DC-22-EPSILON", depth: 10 },
    kidneys: { scale: 3.5, x: 30, y: -90, callout: "FILTRATION_UNIT // SECTOR_06", code: "FU-67-ZETA", depth: 5 },
    blood: { scale: 1.8, x: 0, y: 0, callout: "SYSTEM_FLUID // SECTOR_07", code: "SF-00-OMEGA", depth: 0 },
    bones: { scale: 1.3, x: 0, y: -80, callout: "STRUCTURAL_MESH // SECTOR_08", code: "SM-10-SIGMA", depth: -10 },
  }

  const handleAddSymptom = () => {
    if (newSymptom.description.trim() && selectedOrgan) {
      addSymptom(selectedOrgan, newSymptom)
      setNewSymptom({ description: '', severity: 'mild' })
      setShowAddSymptom(false)
    }
  }

  const currentOrgan = health?.[selectedOrgan]
  const focus = organConfigs[selectedOrgan]

  // Safety check: Prevent crash if store data needs hydration or is invalid
  if (!currentOrgan || !focus) {
    return (
      <div className="avatar-hud flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-500 mb-2">SYSTEM ERROR: DATA_SYNC_FAIL</h2>
          <p className="text-gray-500 text-sm">Target organ "{selectedOrgan}" not found in biometric database.</p>
          <button
            className="mt-4 px-4 py-2 border border-white/20 hover:bg-white/10"
            onClick={() => {
              const keys = Object.keys(health || {});
              if (keys.length > 0) setSelectedOrgan(keys[0]);
              else window.location.href = '/'; // Hard reset if no data
            }}
          >
            INITIATE_RESET
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="avatar-hud">
      <div className="hud-noise" />
      <div className="hud-scan-line" />

      {/* Background Layer: Tech Blueprint */}
      <div className="hud-blueprint">
        <div className="grid-sub" />
        <div className="radial-gradient" />
      </div>

      <header className="hud-top-bar">
        <div className="hud-container">
          <div className="hud-branding">
            <Link to="/" className="hud-back-icon"><ArrowLeft size={20} /></Link>
            {user.mbti && (
              <div className="hud-avatar-thumb">
                <img
                  src={personalityTypes[user.mbti]?.avatars?.[user.gender] || '/avatars/placeholder.png'}
                  alt={user.mbti}
                  style={{ width: '40px', height: '40px', objectFit: 'contain', border: '1px solid var(--accent)', padding: '2px' }}
                />
              </div>
            )}
            <div className="hud-title-wrap">
              <span className="hud-id-label">NEURAL_ID:</span>
              <span className="hud-id-value">{user.name.toUpperCase()} // {user.mbti}{user.mbtiVariant ? `-${user.mbtiVariant}` : ''}</span>
            </div>
          </div>
          <div className="hud-meta-stats">
            <div className="meta-item">
              <span className="l">SYSTEM:</span>
              <span className="v text-green">CONNECTED</span>
            </div>
            <div className="meta-item">
              <span className="l">UPTIME:</span>
              <span className="v">12:44:09</span>
            </div>
          </div>
        </div>
      </header>

      <main className="hud-content">
        {/* Left Column: Menu & Diagnostics */}
        <div className="hud-col-left">
          <div className="hud-section">
            <div className="hud-section-header">TARGET_ACQUISITION</div>
            <div className="hud-organ-list">
              {Object.keys(health).map((key, i) => (
                <button
                  key={key}
                  className={`hud-organ-item ${selectedOrgan === key ? 'active' : ''}`}
                  onClick={() => setSelectedOrgan(key)}
                >
                  <span className="idx">0{i + 1}</span>
                  <span className="name">{key.toUpperCase()}</span>
                  <div className="hud-progress-mini">
                    <div className="bar" style={{ width: `${health[key]?.symptoms?.length > 0 ? 40 : 100}%` }} />
                  </div>
                  {selectedOrgan === key && <motion.div layoutId="hud-cursor" className="hud-cursor" />}
                </button>
              ))}
            </div>
          </div>

          <div className="hud-section">
            <div className="hud-section-header">NEURAL_STREAM</div>
            <div className="hud-mini-metrics">
              <div className="metric-box">
                <span className="label">SYNC</span>
                <span className="value">99.9%</span>
              </div>
              <div className="metric-box">
                <span className="label">AQ</span>
                <span className="value">118</span>
              </div>
              <div className="metric-box">
                <span className="label">LOAD</span>
                <span className="value text-orange">34%</span>
              </div>
            </div>
          </div>

          <div className="hud-section">
            <div className="hud-section-header">PERSONALITY_MATRIX</div>
            <div className="glass-card p-md" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between items-center mb-sm">
                <span className="text-xs opacity-50 font-mono">ENNEAGRAM:</span>
                <span className="text-xs font-bold text-accent">{user.enneagram ? `TYPE ${user.enneagram}` : 'PENDING...'}</span>
              </div>
              <div className="flex items-center gap-md mb-sm">
                <div className="flex-1">
                  <span className="text-xs opacity-50 font-mono block">SPIRIT_ANIMAL:</span>
                  <span className="text-xs font-bold text-accent uppercase">{user.spiritAnimal || 'UNDISCOVERED'}</span>
                </div>
                <div className="text-2xl opacity-80">
                  {spiritAnimals.find(a => a.name === user.spiritAnimal)?.symbol || '🐾'}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-50 font-mono">VARIANT:</span>
                <span className="text-xs font-bold text-accent">{user.mbtiVariant === 'A' ? 'ASSERTIVE' : user.mbtiVariant === 'T' ? 'TURBULENT' : 'UNKNOWN'}</span>
              </div>
            </div>
          </div>

          <div className="hud-section">
            <div className="hud-section-header">COSMIC_ALIGNMENT</div>
            <div className="flex gap-md">
              <div className="glass-card flex-1 p-xs text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }} title="Western Sign">
                <span style={{ fontSize: '1.5rem', display: 'block' }}>{user.westernZodiac?.sign || '—'}</span>
                <span className="text-[10px] opacity-40 uppercase tracking-widest">{user.westernZodiac?.name || 'ZODIAC'}</span>
              </div>
              <div className="glass-card flex-1 p-xs text-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }} title="Chinese Sign">
                <span style={{ fontSize: '1.5rem', display: 'block' }}>{user.chineseZodiac?.sign || '—'}</span>
                <span className="text-[10px] opacity-40 uppercase tracking-widest">{user.chineseZodiac?.name || 'CHINESE'}</span>
              </div>
            </div>
          </div>

          <div className="hud-section">
            <div className="hud-section-header">TALENT_DISCOVERY</div>
            <div className="glass-card p-sm" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex flex-wrap gap-xs">
                {talents.map(talent => {
                  const isUnlocked = checkTalentUnlock(talent, { user, realms, skills: user.skills })
                  return (
                    <div
                      key={talent.id}
                      className={`px-xs py-[2px] rounded text-[10px] font-mono border transition-all ${isUnlocked ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/5 opacity-30 text-white'}`}
                      title={isUnlocked ? talent.description : 'Locked'}
                    >
                      {talent.icon} {talent.name.toUpperCase()}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Center: THE SKELETON (3D Hologram) */}
        <div className="hud-col-center">
          <div className="hologram-viewport">
            {/* Animated HUD Rings (3D Tilted) */}
            <div className="hologram-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>

            {/* Tracking Crosshair (follows selection) */}
            <motion.div
              className="hud-tracking-scope"
              animate={{
                x: focus.x * 2,
                y: focus.y * -0.5,
                opacity: selectedOrgan ? 1 : 0
              }}
            >
              <div className="scope-cross" />
              <div className="scope-data">
                <div className="d-line">D_FOCUS: LOCK</div>
                <div className="d-line">P_SCALE: {focus.scale}x</div>
              </div>
            </motion.div>

            {/* The 3D-feeling Skeleton Container */}
            <div className="skeleton-3d-wrap" style={{ height: '400px', position: 'relative' }}>
              <ErrorBoundary>
                <Suspense fallback={
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'var(--accent-primary)',
                    fontSize: '0.875rem'
                  }}>
                    Loading 3D Model...
                  </div>
                }>
                  <Skeleton3D
                    selectedOrgan={selectedOrgan}
                    onSelectOrgan={setSelectedOrgan}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* Floating Diagram Info (Following camera) */}
            <div className="hud-diagram-labels">
              <div className="callout callout-l">
                <div className="c-box">
                  <span className="c-t">{focus.callout}</span>
                  <span className="c-c">{focus.code}</span>
                </div>
                <div className="c-line" />
              </div>
              <div className="callout callout-r">
                <div className="c-line" />
                <div className="c-box">
                  <span className="c-t">BIO_SCAN: PASS</span>
                  <span className="c-c">COORD_Z_{Math.floor(rotation)}</span>
                </div>
              </div>
            </div>

            {/* Bottom HUD readout */}
            <div className="hud-footer-readout">
              <div className="f-title">{selectedOrgan.toUpperCase()}</div>
              <div className="f-scanner" />
              <div className="f-meta">REGION_LOCK: YES // STREAM: SECURE // PERSPECTIVE: AUTO</div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Intelligence */}
        <div className="hud-col-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedOrgan}
              className="hud-panel-detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="panel-inner">
                <div className="p-header">
                  <div className="p-title-wrap">
                    <span className="p-tag">ANOMALY_SCAN</span>
                    <h2>{currentOrgan.name.toUpperCase()}</h2>
                  </div>
                  <div className="p-status-icon" style={{ borderColor: currentOrgan.color }}>
                    <div className="p-status-fill" style={{ background: currentOrgan.color }} />
                  </div>
                </div>

                <div className="p-section">
                  <div className="p-label">DIAGNOSTIC_QUERIES</div>
                  <div className="p-queries">
                    {currentOrgan.prompts.map((p, i) => (
                      <div key={i} className="p-query-item">
                        <span className="q-num">Q.0{i + 1}</span>
                        <p>{p}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-section flex-1">
                  <div className="p-label flex justify-between items-center">
                    <span>SECTOR_LOGS</span>
                    <button className="p-add-btn" onClick={() => setShowAddSymptom(true)}>+</button>
                  </div>
                  <div className="p-logs">
                    {(currentOrgan?.symptoms?.length || 0) === 0 ? (
                      <div className="p-empty">WAITING FOR DATA INPUT...</div>
                    ) : (
                      currentOrgan.symptoms.map(s => (
                        <div key={s.id} className="p-log-item">
                          <Eye size={12} className="text-orange" />
                          <span>{s.description}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="p-footer">
                  <div className="p-ref">CRC: {Date.now().toString(16).toUpperCase()}</div>
                  <div className="p-bars" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Input Overlays */}
      <AnimatePresence>
        {showAddSymptom && (
          <motion.div className="hud-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddSymptom(false)}>
            <motion.div className="hud-modal-panel" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <div className="m-header">MANUAL_LOG_INJECTION</div>
              <textarea
                className="m-input"
                placeholder="SYNC_DATA_WITH_CORE..."
                value={newSymptom.description}
                onChange={e => setNewSymptom({ ...newSymptom, description: e.target.value })}
                autoFocus
              />
              <div className="m-actions">
                <button className="m-btn btn-ghost" onClick={() => setShowAddSymptom(false)}>ABORT</button>
                <button className="m-btn btn-primary" onClick={handleAddSymptom}>EXECUTE</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;500;700&family=Orbitron:wght@400;700&display=swap');

        :root {
          --accent: #ff6b00;
          --accent-rgb: 255, 107, 0;
          --bg-black: #050508;
          --font-display: 'Orbitron', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        .avatar-hud {
          background: var(--bg-black);
          color: #cfd8dc;
          min-height: 100vh;
          font-family: var(--font-mono);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Ambient Effects */
        .hud-noise {
          position: absolute;
          inset: 0;
          background-image: url("https://grainy-gradients.vercel.app/noise.svg");
          opacity: 0.1;
          pointer-events: none;
          z-index: 100;
        }

        .hud-scan-line {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 2px;
          background: rgba(var(--accent-rgb), 0.2);
          box-shadow: 0 0 10px var(--accent);
          animation: scan 8s linear infinite;
          z-index: 90;
          pointer-events: none;
        }

        .hud-blueprint {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .grid-sub {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .radial-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb), 0.05) 0%, transparent 70%);
        }

        /* Top Bar */
        .hud-top-bar {
          padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 50;
        }
        .hud-container { display: flex; justify-content: space-between; align-items: center; max-width: 1600px; margin: 0 auto; width: 100%; }
        .hud-branding { display: flex; align-items: center; gap: 1.5rem; }
        .hud-back-icon { color: #fff; opacity: 0.6; transition: 0.2s; }
        .hud-back-icon:hover { opacity: 1; transform: translateX(-2px); }
        .hud-title-wrap { font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 1px; }
        .hud-id-label { color: rgba(255,255,255,0.4); margin-right: 8px; }
        .hud-id-value { color: var(--accent); }

        .hud-meta-stats { display: flex; gap: 2rem; font-size: 0.7rem; font-family: var(--font-display); }
        .meta-item { display: flex; gap: 0.5rem; }
        .meta-item .l { opacity: 0.5; }
        .text-green { color: #00ff88; text-shadow: 0 0 5px #00ff8855; }

        /* Main Layout */
        .hud-content {
          display: grid;
          grid-template-columns: 320px 1fr 340px;
          flex: 1;
          position: relative;
          z-index: 10;
          height: calc(100vh - 65px);
        }

        .hud-col-left, .hud-col-right {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: rgba(0,0,0,0.4);
        }

        .hud-section-header {
          font-family: var(--font-display);
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .hud-section-header::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }

        .hud-organ-list { display: flex; flex-direction: column; gap: 4px; }
        .hud-organ-item {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 1.25rem 1rem;
          text-align: left;
          color: #a0a0a0;
          font-family: var(--font-display);
          font-size: 0.75rem;
          cursor: pointer;
          position: relative;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .hud-organ-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .hud-organ-item.active { border-color: var(--accent); color: var(--accent); background: rgba(var(--accent-rgb), 0.05); }
        .hud-organ-item .idx { font-size: 0.6rem; opacity: 0.4; font-family: var(--font-mono); }
        .hud-progress-mini { flex: 1; height: 1px; background: rgba(255,255,255,0.1); margin-left: 10px; }
        .hud-progress-mini .bar { height: 100%; background: currentColor; }
        .hud-cursor { position: absolute; left: 0; top: 20%; bottom: 20%; width: 2px; background: var(--accent); box-shadow: 0 0 10px var(--accent); }

        .hud-mini-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
        .metric-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1rem 0.5rem; text-align: center; }
        .metric-box .label { display: block; font-size: 0.6rem; opacity: 0.4; margin-bottom: 4px; }
        .metric-box .value { font-family: var(--font-display); font-size: 0.85rem; }

        /* Center Column: Viewport */
        .hud-col-center { position: relative; perspective: 1200px; display: flex; flex-direction: column; }
        .hologram-viewport { flex: 1; width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }

        /* 3D Rings */
        .hologram-rings { position: absolute; top: 50%; left: 50%; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .ring {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotateX(75deg);
          border: 1px solid rgba(var(--accent-rgb), 0.1); border-radius: 50%;
        }
        .ring-1 { width: 400px; height: 400px; border-style: dashed; animation: spin 30s linear infinite; }
        .ring-2 { width: 500px; height: 500px; opacity: 0.5; }
        .ring-3 { width: 650px; height: 650px; border-color: rgba(255,255,255,0.02); }

        /* Tracking scope */
        .hud-tracking-scope {
           position: absolute; width: 120px; height: 120px; z-index: 30; pointer-events: none;
        }
        .scope-cross {
           position: absolute; inset: 0; border: 1px solid rgba(var(--accent-rgb), 0.3); border-radius: 50%;
        }
        .scope-cross::before, .scope-cross::after {
           content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
           background: var(--accent);
        }
        .scope-cross::before { width: 20px; height: 1px; }
        .scope-cross::after { height: 20px; width: 1px; }
        .scope-data {
           position: absolute; top: 0; right: -80px; font-size: 0.55rem; color: var(--accent);
           white-space: nowrap; font-family: var(--font-display);
        }

        /* 3D Skeleton */
        .skeleton-3d-wrap { transform-style: preserve-3d; z-index: 20; position: relative; }
        .skeleton-hologram { transform-style: preserve-3d; width: 320px; height: 600px; }
        .skeleton-svg-primary { width: 100%; height: 100%; stroke-linecap: round; pointer-events: none; }
        .node.active { stroke: #fff !important; stroke-width: 2.5px !important; filter: drop-shadow(0 0 8px #fff); }

        /* Callouts */
        .hud-diagram-labels { position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 40; }
        .callout { position: absolute; display: flex; align-items: center; gap: 1rem; }
        .callout-l { left: 50px; top: 25%; }
        .callout-r { right: 50px; bottom: 25%; }
        .c-box { background: rgba(0,0,0,0.6); border: 1px solid rgba(var(--accent-rgb), 0.5); padding: 8px 12px; }
        .c-t { display: block; font-family: var(--font-display); font-size: 0.65rem; color: var(--accent); }
        .c-c { font-size: 0.55rem; opacity: 0.5; }
        .c-line { width: 80px; height: 1px; background: var(--accent); opacity: 0.4; }

        .hud-footer-readout { position: absolute; bottom: 2rem; width: 100%; text-align: center; }
        .f-title { font-family: var(--font-display); font-size: 4rem; color: rgba(255,255,255,0.03); letter-spacing: 5px; line-height: 1; }
        .f-scanner { width: 250px; height: 2px; background: var(--accent); margin: 10px auto; box-shadow: 0 0 15px var(--accent); opacity: 0.6; }
        .f-meta { font-size: 0.6rem; opacity: 0.3; letter-spacing: 1px; }

        /* Detail Panel */
        .hud-panel-detail { flex: 1; position: relative; }
        .panel-inner {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          height: 100%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
        }
        .p-tag { font-family: var(--font-display); font-size: 0.6rem; color: var(--accent); display: block; }
        .p-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .p-header h2 { font-family: var(--font-display); font-size: 1.4rem; color: #fff; margin-top: 5px; }
        .p-status-icon { width: 14px; height: 14px; border: 2px solid #fff; border-radius: 50%; padding: 2px; }
        .p-status-fill { width: 100%; height: 100%; border-radius: 50%; animation: pulse 1s infinite; }

        .p-label { font-size: 0.65rem; font-weight: bold; opacity: 0.4; color: #fff; margin-bottom: 0.75rem; border-left: 2px solid var(--accent); padding-left: 10px; }
        
        .p-query-item { background: rgba(255,255,255,0.03); padding: 1rem; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px; }
        .q-num { color: var(--accent); font-size: 0.6rem; display: block; margin-bottom: 2px; }
        .p-query-item p { font-size: 0.75rem; line-height: 1.4; color: #ccc; }

        .p-logs { overflow-y: auto; max-height: 300px; display: flex; flex-direction: column; gap: 4px; }
        .p-log-item { display: flex; align-items: center; gap: 0.75rem; padding: 12px; background: rgba(var(--accent-rgb), 0.08); font-size: 0.75rem; border: 1px solid rgba(var(--accent-rgb), 0.1); }
        .p-empty { text-align: center; padding: 2rem; opacity: 0.2; font-size: 0.7rem; border: 1px dashed rgba(255,255,255,0.1); }
        .p-add-btn { background: none; border: 1px solid var(--accent); color: var(--accent); width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .p-add-btn:hover { background: var(--accent); color: #000; }

        .p-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .p-ref { font-size: 0.6rem; opacity: 0.3; }
        .p-bars { width: 60px; height: 4px; background: repeating-linear-gradient(90deg, var(--accent), var(--accent) 4px, transparent 4px, transparent 8px); opacity: 0.3; }

        /* Modal */
        .hud-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .hud-modal-panel { width: 100%; max-width: 450px; background: #08080c; border: 1px solid var(--accent); padding: 2rem; }
        .m-header { font-family: var(--font-display); font-size: 0.8rem; color: var(--accent); margin-bottom: 1.5rem; }
        .m-input { width: 100%; height: 120px; background: #000; border: 1px solid rgba(255,255,255,0.1); color: var(--accent); padding: 1rem; font-family: var(--font-mono); outline: none; margin-bottom: 1.5rem; transition: 0.2s; }
        .m-input:focus { border-color: var(--accent); background: rgba(var(--accent-rgb), 0.05); }
        .m-actions { display: flex; gap: 1rem; justify-content: flex-end; }
        .m-btn { padding: 0.8rem 1.5rem; font-family: var(--font-display); font-size: 0.7rem; cursor: pointer; transition: 0.2s; border: 1px solid rgba(255,255,255,0.1); background: none; color: #fff; }
        .m-btn.btn-primary { background: var(--accent); color: #000; border: none; font-weight: bold; }
        .m-btn.btn-primary:hover { box-shadow: 0 0 15px var(--accent); }

        @keyframes scan { from { top: -10%; } to { top: 110%; } }
        @keyframes spin { from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg); } to { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        @media (max-width: 1280px) {
          .hud-content { grid-template-columns: 280px 1fr 300px; }
        }
        @media (max-width: 1024px) {
          .hud-content { grid-template-columns: 1fr; grid-template-rows: auto 500px auto; overflow-y: auto; }
          .hud-col-center { grid-row: 1; height: 500px; }
          .hud-col-left { grid-row: 2; padding: 2rem; }
          .hud-col-right { grid-row: 3; padding: 2rem; }
        }
      `}</style>
    </div>
  )
}
