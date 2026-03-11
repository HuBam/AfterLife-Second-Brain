import { useEffect, useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './store/useStore'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
// Lazy load Avatar to prevent Three.js from crashing the initial bundle
const Avatar = lazy(() => import('./pages/Avatar'))
import Constellation from './pages/Constellation'
import Timeline from './pages/Timeline'
import Echo from './pages/Echo'
import Recap from './pages/Recap'
import Cerebra from './pages/Cerebra'
import Elysia from './pages/Elysia'
import Empyra from './pages/Empyra'
import Oblivion from './pages/Oblivion'
import Sanctum from './pages/Sanctum'
import Settings from './pages/Settings'
import Achievements from './pages/Achievements'
import Habits from './pages/Habits'
import Religion from './pages/Religion'

// Loading fallback for lazy-loaded components
const PageLoader = () => (
    <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#4a9eff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace'
    }}>
        Loading module...
    </div>
)

// Theme definitions (must match Settings.jsx)
const themes = {
    cyber: { accent: '#4a9eff', bg: '#0a1a1a', name: 'Cyberpunk' },
    neon: { accent: '#a855f7', bg: '#0a0a14', name: 'Neon Purple' },
    emerald: { accent: '#22c55e', bg: '#0a140a', name: 'Emerald' },
    sakura: { accent: '#ec4899', bg: '#140a10', name: 'Sakura' },
    amber: { accent: '#f59e0b', bg: '#14100a', name: 'Amber' },
    arctic: { accent: '#06b6d4', bg: '#0a1214', name: 'Arctic' },
    blood: { accent: '#ef4444', bg: '#140a0a', name: 'Crimson' },
    mono: { accent: '#a1a1aa', bg: '#0a0a0a', name: 'Monochrome' },
    lyna: { accent: '#977DFF', bg: '#00033D', name: 'Lyna' },
    mindful: { accent: '#A77693', bg: '#0F2D4D', name: 'Mindful' },
    nature: { accent: '#E3EF26', bg: '#06231D', name: 'Nature' },
    vibrant: { accent: '#E02F75', bg: '#050C38', name: 'Vibrant' },
    forest: { accent: '#BDCDCF', bg: '#034C36', name: 'Forest' },
}

// Font definitions
const fontFamilies = {
    default: "'Inter', sans-serif",
    fantasy: "'MedievalSharp', cursive",
    pixel: "'Press Start 2P', system-ui",
    stray: "'Major Mono Display', monospace",
    minimal: "'Host Grotesk', sans-serif",
}

function App() {
    const { user } = useStore()
    const [hydrated, setHydrated] = useState(false)

    // Wait for Zustand persist hydration
    useEffect(() => {
        console.log('App Startup: Checking Neural Link (Storage)...')
        console.log('Current Origin:', window.location.origin)

        // Check if already hydrated
        if (useStore.persist.hasHydrated()) {
            console.log('App Startup: Storage already hydrated')
            setHydrated(true)
            return
        }

        // Subscribe to hydration completion
        const unsubscribe = useStore.persist.onFinishHydration(() => {
            console.log('App Startup: Storage hydration finished')
            setHydrated(true)
        })

        return unsubscribe
    }, [])

    // Apply saved theme and font on app startup
    useEffect(() => {
        if (!hydrated || !user) return

        // Apply Theme
        const themeName = user.theme || 'cyber'
        const theme = themes[themeName] || themes.cyber
        document.documentElement.style.setProperty('--accent-primary', theme.accent)
        document.documentElement.style.setProperty('--accent-glow', `${theme.accent}66`)
        document.documentElement.style.setProperty('--bg-primary', theme.bg)

        // Apply Font
        const fontName = user.font || 'default'
        const fontFamily = fontFamilies[fontName] || fontFamilies.default
        document.documentElement.style.setProperty('--font-primary', fontFamily)
        if (fontName === 'fantasy' || fontName === 'pixel' || fontName === 'stray') {
            document.documentElement.style.setProperty('--font-display', fontFamily)
        } else {
            document.documentElement.style.setProperty('--font-display', "'Orbitron', monospace")
        }
    }, [user, hydrated])

    // Show loading while hydrating from localStorage
    if (!hydrated) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0a0a0f',
                color: '#4a9eff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontSize: '1rem',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '3rem' }}>🌌</div>
                <div>INITIALIZING NEURAL LINK...</div>
                <div style={{
                    width: '200px',
                    height: '4px',
                    background: 'rgba(74, 158, 255, 0.2)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '50%',
                        height: '100%',
                        background: '#4a9eff',
                        animation: 'loading 1s ease-in-out infinite'
                    }} />
                </div>
                <style>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                `}</style>
            </div>
        )
    }

    // Safety check for user data after hydration
    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0a0a0f',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontSize: '1rem'
            }}>
                Initializing Neural Link...
            </div>
        )
    }

    return (
        <div data-mode={user.mode}>
            <BrowserRouter>
                <Routes>
                    {!user.onboarded ? (
                        <Route path="*" element={<Onboarding />} />
                    ) : (
                        <>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/avatar" element={<Suspense fallback={<PageLoader />}><Avatar /></Suspense>} />
                            <Route path="/constellation" element={<Constellation />} />
                            <Route path="/timeline" element={<Timeline />} />
                            <Route path="/echo" element={<Echo />} />
                            <Route path="/recap" element={<Recap />} />
                            <Route path="/cerebra" element={<Cerebra />} />
                            <Route path="/elysia" element={<Elysia />} />
                            <Route path="/empyra" element={<Empyra />} />
                            <Route path="/oblivion" element={<Oblivion />} />
                            <Route path="/sanctum" element={<Sanctum />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/achievements" element={<Achievements />} />
                            <Route path="/habits" element={<Habits />} />
                            <Route path="/religion" element={<Religion />} />
                        </>
                    )}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App

