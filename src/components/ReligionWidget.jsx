import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Book, ChevronRight, Check, Target } from 'lucide-react'
import { useStore } from '../store/useStore'
import { religions, getPrayerTypes } from '../data/religionData'
import { getCountdownToNext } from '../data/religiousCalendar'

/**
 * Compact Religion Widget for Dashboard
 * Shows quick overview of prayer progress, scripture streak, and next event
 */
export default function ReligionWidget() {
    const { user } = useStore()

    const religion = user?.religion
    const religionData = religions.find(r => r.id === religion)

    if (!religion || religion === 'atheist' || !user?.spiritualSettings?.showReligionWidget) {
        return null
    }

    // Get today's date string
    const today = new Date().toISOString().split('T')[0]

    // Calculate today's prayer progress
    const prayerTypes = getPrayerTypes(religion)
    const todayPrayers = user?.prayerLog?.filter(p => p.completedAt.startsWith(today)) || []
    const completedPrayers = prayerTypes.filter(p => todayPrayers.some(tp => tp.type === p.id)).length
    const totalPrayers = prayerTypes.length
    const prayerPercent = Math.round((completedPrayers / totalPrayers) * 100)

    // Get scripture progress
    const scriptureProgress = user?.scriptureProgress?.quran || {}
    const streak = scriptureProgress.streak || 0
    const khatmCount = scriptureProgress.khatmCount || 0

    // Get countdown to next event
    const countdown = getCountdownToNext(religion)

    return (
        <Link to="/religion" className="religion-widget-link">
            <motion.div
                className="religion-widget"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                {/* Header */}
                <div className="widget-header">
                    <span className="religion-icon">{religionData?.icon}</span>
                    <span className="widget-title">Spirituality</span>
                    <ChevronRight size={16} className="widget-arrow" />
                </div>

                {/* Stats Row */}
                <div className="widget-stats">
                    {/* Prayer Progress */}
                    <div className="stat-item">
                        <div className="stat-circle" style={{ '--progress': `${prayerPercent}%` }}>
                            {completedPrayers === totalPrayers ? (
                                <Check size={16} />
                            ) : (
                                <span>{completedPrayers}/{totalPrayers}</span>
                            )}
                        </div>
                        <span className="stat-label">Prayers</span>
                    </div>

                    {/* Scripture Streak */}
                    <div className="stat-item">
                        <div className="stat-value">
                            <Book size={14} />
                            {streak > 0 ? `${streak}d` : '—'}
                        </div>
                        <span className="stat-label">Streak</span>
                    </div>

                    {/* Khatm Count (if any) */}
                    {khatmCount > 0 && (
                        <div className="stat-item">
                            <div className="stat-value khatm">
                                <Target size={14} />
                                {khatmCount}
                            </div>
                            <span className="stat-label">Khatm</span>
                        </div>
                    )}
                </div>

                {/* Countdown (if upcoming event) */}
                {countdown && countdown.daysRemaining <= 30 && (
                    <div className="widget-countdown">
                        <span className="countdown-event">{countdown.name}</span>
                        <span className="countdown-days">
                            {countdown.daysRemaining === 0 ? 'Today!' :
                                countdown.daysRemaining === 1 ? 'Tomorrow' :
                                    `${countdown.daysRemaining} days`}
                        </span>
                    </div>
                )}

                <style>{`
                    .religion-widget-link {
                        text-decoration: none;
                        color: inherit;
                        display: block;
                    }
                    
                    .religion-widget {
                        background: var(--bg-card);
                        border-radius: var(--radius-lg);
                        padding: var(--space-md);
                        border: 1px solid var(--border-subtle);
                        transition: all var(--transition-fast);
                    }
                    
                    .religion-widget:hover {
                        border-color: var(--border-accent);
                    }
                    
                    .widget-header {
                        display: flex;
                        align-items: center;
                        gap: var(--space-sm);
                        margin-bottom: var(--space-md);
                    }
                    
                    .religion-icon {
                        font-size: 1.25rem;
                    }
                    
                    .widget-title {
                        flex: 1;
                        font-weight: 500;
                        font-size: 0.875rem;
                    }
                    
                    .widget-arrow {
                        color: var(--text-tertiary);
                    }
                    
                    .widget-stats {
                        display: flex;
                        gap: var(--space-lg);
                        justify-content: center;
                    }
                    
                    .stat-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: var(--space-xs);
                    }
                    
                    .stat-circle {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: conic-gradient(
                            var(--accent-primary) var(--progress, 0%),
                            var(--bg-tertiary) var(--progress, 0%)
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                    }
                    
                    .stat-circle::before {
                        content: '';
                        position: absolute;
                        inset: 3px;
                        background: var(--bg-card);
                        border-radius: 50%;
                    }
                    
                    .stat-circle > * {
                        position: relative;
                        z-index: 1;
                        font-size: 0.625rem;
                        font-weight: 600;
                        color: var(--text-secondary);
                    }
                    
                    .stat-circle svg {
                        color: var(--accent-success);
                    }
                    
                    .stat-value {
                        display: flex;
                        align-items: center;
                        gap: var(--space-xs);
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: var(--text-primary);
                    }
                    
                    .stat-value.khatm {
                        color: #f59e0b;
                    }
                    
                    .stat-label {
                        font-size: 0.625rem;
                        color: var(--text-tertiary);
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    
                    .widget-countdown {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: var(--space-md);
                        padding-top: var(--space-sm);
                        border-top: 1px solid var(--border-subtle);
                        font-size: 0.75rem;
                    }
                    
                    .countdown-event {
                        color: var(--text-secondary);
                    }
                    
                    .countdown-days {
                        color: var(--accent-primary);
                        font-weight: 500;
                    }
                `}</style>
            </motion.div>
        </Link>
    )
}
