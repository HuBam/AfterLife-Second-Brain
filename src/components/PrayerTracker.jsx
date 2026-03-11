import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Info, X, MapPin, Loader2, RefreshCw } from 'lucide-react'
import { useStore } from '../store/useStore'
import { getPrayerTypes, sunnahPractices } from '../data/religionData'
import { getRandomQuote } from '../data/religiousQuotes'
import {
    fetchPrayerTimesByCity,
    fetchPrayerTimesByCoords,
    getCurrentLocation,
    getNextPrayer
} from '../services/aladhanApi'

/**
 * Prayer Tracker Component
 * Tracks daily prayers based on user's religion
 * Now integrates with Aladhan API for live prayer times
 */
export default function PrayerTracker() {
    const {
        user,
        logPrayer,
        setPrayerTimesData,
        setUserLocation,
        setPrayerTimesLoading,
        setPrayerTimesError
    } = useStore()

    const [showQuote, setShowQuote] = useState(false)
    const [currentQuote, setCurrentQuote] = useState(null)
    const [todayPrayers, setTodayPrayers] = useState([])
    const [nextPrayer, setNextPrayer] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Get today's date string for filtering
    const today = new Date().toISOString().split('T')[0]

    // Get prayer types for user's religion (fallback if API fails)
    const staticPrayerTypes = getPrayerTypes(user?.religion)

    // Use API data if available, otherwise fall back to static types
    const prayerTimings = user?.prayerTimesData?.timings
    const prayerTypes = prayerTimings
        ? [
            { id: 'fajr', name: 'Fajr', nameAr: 'الفجر', time: prayerTimings.fajr },
            { id: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', time: prayerTimings.dhuhr },
            { id: 'asr', name: 'Asr', nameAr: 'العصر', time: prayerTimings.asr },
            { id: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', time: prayerTimings.maghrib },
            { id: 'isha', name: 'Isha', nameAr: 'العشاء', time: prayerTimings.isha },
        ]
        : staticPrayerTypes

    // Fetch prayer times on mount or when location changes
    useEffect(() => {
        if (user?.religion === 'islam' && !user?.prayerTimesData) {
            fetchPrayerTimesData()
        }
    }, [user?.religion, user?.userLocation])

    // Update next prayer indicator every minute
    useEffect(() => {
        if (prayerTimings) {
            const updateNext = () => setNextPrayer(getNextPrayer(prayerTimings))
            updateNext()
            const interval = setInterval(updateNext, 60000)
            return () => clearInterval(interval)
        }
    }, [prayerTimings])

    // Fetch prayer times from API
    const fetchPrayerTimesData = async () => {
        setPrayerTimesLoading(true)
        setIsRefreshing(true)

        try {
            let result

            // Try to use saved location first
            if (user?.userLocation?.city && user?.userLocation?.country) {
                result = await fetchPrayerTimesByCity(
                    user.userLocation.city,
                    user.userLocation.country,
                    user.userLocation.calculationMethod || 4
                )
            } else {
                // Fall back to geolocation
                try {
                    const coords = await getCurrentLocation()
                    result = await fetchPrayerTimesByCoords(
                        coords.latitude,
                        coords.longitude,
                        4 // Default: Umm Al-Qura
                    )
                    // Save coords for future use
                    setUserLocation({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        city: result.meta?.timezone?.split('/')[1] || 'Unknown',
                        country: result.meta?.timezone?.split('/')[0] || 'Unknown',
                    })
                } catch (geoError) {
                    // Default to Makkah if geolocation fails
                    result = await fetchPrayerTimesByCity('Makkah', 'Saudi Arabia', 4)
                    setUserLocation({ city: 'Makkah', country: 'Saudi Arabia' })
                }
            }

            if (result.success) {
                setPrayerTimesData(result)
            } else {
                setPrayerTimesError(result.error)
            }
        } catch (error) {
            setPrayerTimesError(error.message)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Calculate today's completed prayers
    useEffect(() => {
        if (user?.prayerLog) {
            const todayCompleted = user.prayerLog
                .filter(p => p.completedAt.startsWith(today))
                .map(p => p.type)
            setTodayPrayers(todayCompleted)
        }
    }, [user?.prayerLog, today])

    // Check if a prayer is completed today
    const isPrayerCompleted = (prayerId) => todayPrayers.includes(prayerId)

    // Handle prayer completion
    const handlePrayerComplete = (prayer) => {
        if (isPrayerCompleted(prayer.id)) return // Already completed

        // Log the prayer
        logPrayer(prayer.id)

        // Get and show quote
        const quote = getRandomQuote(user?.religion || 'generic', 'prayer')
        setCurrentQuote(quote)
        setShowQuote(true)

        // Auto-hide quote after 5 seconds
        setTimeout(() => setShowQuote(false), 5000)
    }

    // Calculate progress
    const completedCount = prayerTypes.filter(p => isPrayerCompleted(p.id)).length
    const totalCount = prayerTypes.length
    const progressPercent = (completedCount / totalCount) * 100

    if (!user?.religion || user.religion === 'atheist') {
        return null // Don't show for atheists or unset religion
    }

    return (
        <div className="prayer-tracker">
            {/* Header with location and progress */}
            <div className="prayer-header">
                <div className="prayer-title-row">
                    <h3>Daily Prayers</h3>
                    {user?.userLocation?.city && (
                        <div className="prayer-location">
                            <MapPin size={12} />
                            <span>{user.userLocation.city}</span>
                        </div>
                    )}
                </div>
                <div className="prayer-actions">
                    <button
                        className="prayer-refresh-btn"
                        onClick={fetchPrayerTimesData}
                        disabled={isRefreshing}
                        title="Refresh prayer times"
                    >
                        {isRefreshing ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
                    </button>
                    <div className="prayer-progress-mini">
                        <span>{completedCount}/{totalCount}</span>
                        <div className="progress-bar-mini">
                            <motion.div
                                className="progress-fill-mini"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Prayer Indicator */}
            {nextPrayer && !isPrayerCompleted(nextPrayer.id) && (
                <div className="next-prayer-banner">
                    <span className="next-label">NEXT</span>
                    <span className="next-name">{nextPrayer.name}</span>
                    <span className="next-time">
                        {nextPrayer.isTomorrow ? 'Tomorrow' : `in ${Math.floor(nextPrayer.minutesUntil / 60)}h ${nextPrayer.minutesUntil % 60}m`}
                    </span>
                </div>
            )}

            {/* Prayer list */}
            <div className="prayer-list">
                {prayerTypes.map((prayer) => {
                    const completed = isPrayerCompleted(prayer.id)
                    const isNext = nextPrayer?.id === prayer.id && !completed
                    return (
                        <motion.button
                            key={prayer.id}
                            className={`prayer-item ${completed ? 'completed' : ''} ${isNext ? 'is-next' : ''}`}
                            onClick={() => handlePrayerComplete(prayer)}
                            whileHover={{ scale: completed ? 1 : 1.02 }}
                            whileTap={{ scale: completed ? 1 : 0.98 }}
                            disabled={completed}
                        >
                            <div className="prayer-check">
                                {completed ? (
                                    <Check size={16} />
                                ) : (
                                    <div className="prayer-unchecked" />
                                )}
                            </div>
                            <div className="prayer-info">
                                <span className="prayer-name">{prayer.name}</span>
                                {prayer.nameAr && (
                                    <span className="prayer-name-alt">{prayer.nameAr}</span>
                                )}
                            </div>
                            <span className="prayer-time">{prayer.time}</span>
                        </motion.button>
                    )
                })}
            </div>

            {/* Sunnah practices for Islam */}
            {user?.religion === 'islam' && (
                <div className="sunnah-section">
                    <h4>Recommended Today</h4>
                    <div className="sunnah-list">
                        {sunnahPractices.daily.slice(0, 3).map((sunnah) => (
                            <div key={sunnah.id} className="sunnah-item">
                                <span className="sunnah-name">{sunnah.name}</span>
                                <span className="sunnah-name-ar">{sunnah.nameAr}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quote notification */}
            <AnimatePresence>
                {showQuote && currentQuote && (
                    <motion.div
                        className="quote-notification"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    >
                        <button
                            className="quote-close"
                            onClick={() => setShowQuote(false)}
                        >
                            <X size={16} />
                        </button>
                        <div className="quote-content">
                            {currentQuote.original && currentQuote.original !== currentQuote.english && (
                                <p className="quote-original">{currentQuote.original}</p>
                            )}
                            {currentQuote.transliteration && (
                                <p className="quote-transliteration">{currentQuote.transliteration}</p>
                            )}
                            <p className="quote-english">{currentQuote.english}</p>
                            <div className="quote-source">
                                <span className="quote-type">{currentQuote.type}</span>
                                <span>— {currentQuote.source}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .prayer-tracker {
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg);
                    border: 1px solid var(--border-subtle);
                }
                
                .prayer-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-md);
                }
                
                .prayer-header h3 {
                    font-size: 1rem;
                    font-weight: 600;
                }
                
                .prayer-title-row {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                }
                
                .prayer-location {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                    padding: 2px 8px;
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                }
                
                .prayer-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }
                
                .prayer-refresh-btn {
                    background: transparent;
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-sm);
                    padding: 6px;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .prayer-refresh-btn:hover {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                }
                
                .prayer-refresh-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .spin {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .next-prayer-banner {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    padding: var(--space-sm) var(--space-md);
                    background: linear-gradient(135deg, rgba(var(--accent-primary-rgb, 74, 158, 255), 0.15), rgba(var(--accent-primary-rgb, 74, 158, 255), 0.05));
                    border: 1px solid rgba(var(--accent-primary-rgb, 74, 158, 255), 0.3);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-md);
                }
                
                .next-label {
                    font-size: 0.6rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--accent-primary);
                    padding: 2px 6px;
                    background: rgba(var(--accent-primary-rgb, 74, 158, 255), 0.2);
                    border-radius: 4px;
                }
                
                .next-name {
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .next-time {
                    margin-left: auto;
                    font-size: 0.75rem;
                    color: var(--accent-primary);
                    font-family: var(--font-mono, monospace);
                }
                
                .prayer-item.is-next {
                    border-color: var(--accent-primary);
                    background: rgba(var(--accent-primary-rgb, 74, 158, 255), 0.08);
                }
                
                
                .progress-bar-mini {
                    width: 60px;
                    height: 4px;
                    background: var(--bg-tertiary);
                    border-radius: 2px;
                    overflow: hidden;
                }
                
                .progress-fill-mini {
                    height: 100%;
                    background: var(--accent-primary);
                    border-radius: 2px;
                }
                
                .prayer-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                }
                
                .prayer-item {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    padding: var(--space-sm) var(--space-md);
                    background: var(--bg-tertiary);
                    border: 1px solid transparent;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    text-align: left;
                    width: 100%;
                }
                
                .prayer-item:hover:not(.completed) {
                    background: var(--bg-secondary);
                    border-color: var(--accent-primary);
                }
                
                .prayer-item.completed {
                    background: rgba(34, 197, 94, 0.1);
                    border-color: rgba(34, 197, 94, 0.3);
                    cursor: default;
                }
                
                .prayer-check {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: var(--bg-secondary);
                    color: var(--accent-primary);
                }
                
                .prayer-item.completed .prayer-check {
                    background: var(--accent-success);
                    color: white;
                }
                
                .prayer-unchecked {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 2px solid var(--border-accent);
                }
                
                .prayer-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .prayer-name {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-primary);
                }
                
                .prayer-name-alt {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-family: var(--font-arabic, serif);
                }
                
                .prayer-time {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                }
                
                .sunnah-section {
                    margin-top: var(--space-lg);
                    padding-top: var(--space-md);
                    border-top: 1px solid var(--border-subtle);
                }
                
                .sunnah-section h4 {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: var(--space-sm);
                }
                
                .sunnah-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                }
                
                .sunnah-item {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--space-xs) var(--space-sm);
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                }
                
                .sunnah-name {
                    color: var(--text-secondary);
                }
                
                .sunnah-name-ar {
                    color: var(--text-tertiary);
                    font-family: var(--font-arabic, serif);
                }
                
                /* Quote Notification */
                .quote-notification {
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--bg-card);
                    border: 1px solid var(--accent-primary);
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg);
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                }
                
                .quote-close {
                    position: absolute;
                    top: var(--space-sm);
                    right: var(--space-sm);
                    background: transparent;
                    border: none;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    padding: var(--space-xs);
                }
                
                .quote-content {
                    text-align: center;
                }
                
                .quote-original {
                    font-size: 1.25rem;
                    font-family: var(--font-arabic, serif);
                    color: var(--accent-primary);
                    margin-bottom: var(--space-sm);
                    line-height: 1.6;
                }
                
                .quote-transliteration {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    font-style: italic;
                    margin-bottom: var(--space-sm);
                }
                
                .quote-english {
                    font-size: 0.875rem;
                    color: var(--text-primary);
                    margin-bottom: var(--space-md);
                }
                
                .quote-source {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-sm);
                }
                
                .quote-type {
                    background: var(--bg-tertiary);
                    padding: 2px 8px;
                    border-radius: var(--radius-sm);
                    text-transform: uppercase;
                    font-size: 0.625rem;
                    letter-spacing: 0.05em;
                }
            `}</style>
        </div>
    )
}
