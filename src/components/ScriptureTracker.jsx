import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, Target, TrendingUp, Award, ChevronRight, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import { QURAN_TOTAL_PAGES, QURAN_TOTAL_JUZ, QURAN_TOTAL_SURAHS } from '../data/religionData'

/**
 * Scripture Tracker Component
 * Tracks reading progress for Quran, Bible, Torah
 * Supports goal setting with calculated daily amounts
 */
export default function ScriptureTracker() {
    const { user, updateScriptureProgress, setScriptureGoal, incrementKhatmCount } = useStore()
    const [showGoalModal, setShowGoalModal] = useState(false)
    const [goalSettings, setGoalSettings] = useState({
        type: 'days',
        value: 30,
    })

    const religion = user?.religion
    const progress = user?.scriptureProgress?.quran || {}

    // Get scripture info based on religion
    const getScriptureInfo = () => {
        switch (religion) {
            case 'islam':
                return {
                    name: 'Quran',
                    nameAr: 'القرآن',
                    modes: [
                        { id: 'juz', label: 'Juz', total: QURAN_TOTAL_JUZ },
                        { id: 'pages', label: 'Pages', total: QURAN_TOTAL_PAGES },
                        { id: 'surah', label: 'Surah', total: QURAN_TOTAL_SURAHS },
                    ],
                }
            case 'christianity':
                return {
                    name: 'Bible',
                    modes: [
                        { id: 'chapters', label: 'Chapters', total: 1189 },
                    ],
                }
            case 'judaism':
                return {
                    name: 'Torah',
                    modes: [
                        { id: 'parsha', label: 'Parsha', total: 54 },
                    ],
                }
            default:
                return null
        }
    }

    const scriptureInfo = getScriptureInfo()

    if (!scriptureInfo || !religion || religion === 'atheist') {
        return null
    }

    // Get current mode and progress
    const currentMode = progress.mode || scriptureInfo.modes[0].id
    const modeInfo = scriptureInfo.modes.find(m => m.id === currentMode) || scriptureInfo.modes[0]
    const currentProgress = currentMode === 'juz' ? progress.currentJuz :
        currentMode === 'pages' ? progress.currentPage :
            progress.completedSurahs?.length || 0
    const progressPercent = (currentProgress / modeInfo.total) * 100

    // Handle progress update
    const handleAddProgress = (amount = 1) => {
        const newValue = Math.min(currentProgress + amount, modeInfo.total)
        const updates = {}

        if (currentMode === 'juz') {
            updates.currentJuz = newValue
        } else if (currentMode === 'pages') {
            updates.currentPage = newValue
        }

        // Check for completion (Khatm)
        if (newValue >= modeInfo.total && currentProgress < modeInfo.total) {
            incrementKhatmCount('quran')
            // Reset progress for next round
            updates[currentMode === 'juz' ? 'currentJuz' : 'currentPage'] = 0
        }

        // Update streak
        const lastRead = progress.lastRead ? new Date(progress.lastRead).toDateString() : null
        const today = new Date().toDateString()
        const yesterday = new Date(Date.now() - 86400000).toDateString()

        if (lastRead === yesterday || lastRead === today) {
            updates.streak = (progress.streak || 0) + (lastRead !== today ? 1 : 0)
        } else if (lastRead !== today) {
            updates.streak = 1
        }

        updateScriptureProgress('quran', updates)
    }

    // Handle mode change
    const handleModeChange = (modeId) => {
        updateScriptureProgress('quran', { mode: modeId })
    }

    // Handle goal creation
    const handleSetGoal = () => {
        setScriptureGoal('quran', goalSettings.type, goalSettings.value)
        setShowGoalModal(false)
    }

    // Calculate days remaining in goal
    const getDaysRemaining = () => {
        if (!progress.goal) return null
        const startDate = new Date(progress.goal.startDate)
        const totalDays = progress.goal.type === 'days' ? progress.goal.value :
            progress.goal.type === 'months' ? progress.goal.value * 30 : 365
        const daysPassed = Math.floor((Date.now() - startDate) / 86400000)
        return Math.max(0, totalDays - daysPassed)
    }

    return (
        <div className="scripture-tracker">
            {/* Header */}
            <div className="scripture-header">
                <div className="scripture-title">
                    <Book size={20} />
                    <div>
                        <h3>{scriptureInfo.name}</h3>
                        {scriptureInfo.nameAr && (
                            <span className="scripture-name-ar">{scriptureInfo.nameAr}</span>
                        )}
                    </div>
                </div>

                {/* Khatm count */}
                {progress.khatmCount > 0 && (
                    <div className="khatm-badge" title={`${progress.khatmCount} complete reading${progress.khatmCount > 1 ? 's' : ''}`}>
                        <Award size={14} />
                        <span>{progress.khatmCount}</span>
                    </div>
                )}
            </div>

            {/* Mode selector */}
            {scriptureInfo.modes.length > 1 && (
                <div className="mode-selector">
                    {scriptureInfo.modes.map((mode) => (
                        <button
                            key={mode.id}
                            className={`mode-btn ${currentMode === mode.id ? 'active' : ''}`}
                            onClick={() => handleModeChange(mode.id)}
                        >
                            {mode.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Progress visualization */}
            <div className="scripture-progress">
                <div className="progress-stats">
                    <span className="progress-current">{currentProgress}</span>
                    <span className="progress-separator">/</span>
                    <span className="progress-total">{modeInfo.total}</span>
                    <span className="progress-label">{modeInfo.label}</span>
                </div>

                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                    />
                </div>

                {/* Streak */}
                {progress.streak > 0 && (
                    <div className="streak-indicator">
                        <TrendingUp size={14} />
                        <span>{progress.streak} day streak</span>
                    </div>
                )}
            </div>

            {/* Goal section */}
            {progress.goal ? (
                <div className="goal-status">
                    <Target size={14} />
                    <span>
                        {progress.goal.dailyAmount} {modeInfo.label.toLowerCase()}/day
                        {getDaysRemaining() && ` • ${getDaysRemaining()} days left`}
                    </span>
                </div>
            ) : (
                <button
                    className="set-goal-btn"
                    onClick={() => setShowGoalModal(true)}
                >
                    <Target size={14} />
                    <span>Set a reading goal</span>
                    <ChevronRight size={14} />
                </button>
            )}

            {/* Quick add buttons */}
            <div className="quick-add-buttons">
                <button className="quick-add-btn" onClick={() => handleAddProgress(1)}>
                    +1 {modeInfo.label.slice(0, -1)}
                </button>
                <button className="quick-add-btn" onClick={() => handleAddProgress(5)}>
                    +5
                </button>
                {currentMode === 'pages' && (
                    <button className="quick-add-btn" onClick={() => handleAddProgress(20)}>
                        +20 (1 Juz)
                    </button>
                )}
            </div>

            {/* Khatm recommendation */}
            {progress.khatmCount > 0 && progress.khatmCount <= 3 && (
                <div className="khatm-recommendation">
                    <Award size={14} />
                    <span>
                        {progress.khatmCount === 1 && "Mashallah! Consider improving your tajweed for your next reading."}
                        {progress.khatmCount === 2 && "Excellent progress! Try listening to recitations to improve your voice."}
                        {progress.khatmCount === 3 && "Amazing dedication! You could start teaching others or memorizing surahs."}
                    </span>
                </div>
            )}

            {/* Goal Modal */}
            <AnimatePresence>
                {showGoalModal && (
                    <motion.div
                        className="goal-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowGoalModal(false)}
                    >
                        <motion.div
                            className="goal-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={() => setShowGoalModal(false)}>
                                <X size={18} />
                            </button>

                            <h3>Set Your Reading Goal</h3>
                            <p className="text-secondary">
                                Complete the {scriptureInfo.name} in your chosen timeframe
                            </p>

                            <div className="goal-options">
                                <label className="goal-option">
                                    <input
                                        type="radio"
                                        name="goalType"
                                        checked={goalSettings.type === 'days'}
                                        onChange={() => setGoalSettings({ ...goalSettings, type: 'days' })}
                                    />
                                    <span>Days</span>
                                </label>
                                <label className="goal-option">
                                    <input
                                        type="radio"
                                        name="goalType"
                                        checked={goalSettings.type === 'months'}
                                        onChange={() => setGoalSettings({ ...goalSettings, type: 'months' })}
                                    />
                                    <span>Months</span>
                                </label>
                                <label className="goal-option">
                                    <input
                                        type="radio"
                                        name="goalType"
                                        checked={goalSettings.type === 'year'}
                                        onChange={() => setGoalSettings({ ...goalSettings, type: 'year' })}
                                    />
                                    <span>1 Year</span>
                                </label>
                            </div>

                            {goalSettings.type !== 'year' && (
                                <div className="goal-value-input">
                                    <label>
                                        Number of {goalSettings.type}:
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={goalSettings.type === 'days' ? 365 : 12}
                                        value={goalSettings.value}
                                        onChange={(e) => setGoalSettings({
                                            ...goalSettings,
                                            value: parseInt(e.target.value) || 1
                                        })}
                                    />
                                </div>
                            )}

                            <div className="goal-preview">
                                <span className="preview-label">Daily reading:</span>
                                <span className="preview-value">
                                    ~{Math.ceil(modeInfo.total / (
                                        goalSettings.type === 'days' ? goalSettings.value :
                                            goalSettings.type === 'months' ? goalSettings.value * 30 : 365
                                    ))} {modeInfo.label.toLowerCase()}/day
                                </span>
                            </div>

                            <button className="btn btn-primary" onClick={handleSetGoal}>
                                Start Goal
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .scripture-tracker {
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg);
                    border: 1px solid var(--border-subtle);
                }
                
                .scripture-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--space-md);
                }
                
                .scripture-title {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }
                
                .scripture-title h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .scripture-name-ar {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-family: var(--font-arabic, serif);
                }
                
                .khatm-badge {
                    display: flex;
                    align-items: center;
                    gap: var(--space-xs);
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                
                .mode-selector {
                    display: flex;
                    gap: var(--space-xs);
                    margin-bottom: var(--space-md);
                }
                
                .mode-btn {
                    flex: 1;
                    padding: var(--space-xs) var(--space-sm);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                
                .mode-btn.active {
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }
                
                .scripture-progress {
                    margin-bottom: var(--space-md);
                }
                
                .progress-stats {
                    display: flex;
                    align-items: baseline;
                    gap: var(--space-xs);
                    margin-bottom: var(--space-xs);
                }
                
                .progress-current {
                    font-size: 1.5rem;
                    font-weight: 700;
                    font-family: var(--font-mono, monospace);
                }
                
                .progress-separator,
                .progress-total {
                    color: var(--text-secondary);
                }
                
                .progress-label {
                    font-size: 0.75rem;
                    color: var(--text-tertiary);
                    margin-left: var(--space-xs);
                }
                
                .progress-bar {
                    height: 8px;
                    background: var(--bg-tertiary);
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
                    border-radius: 4px;
                    transition: width 0.5s ease-out;
                }
                
                .streak-indicator {
                    display: flex;
                    align-items: center;
                    gap: var(--space-xs);
                    margin-top: var(--space-xs);
                    font-size: 0.75rem;
                    color: var(--accent-success);
                }
                
                .goal-status {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    padding: var(--space-sm);
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    color: var(--accent-primary);
                    margin-bottom: var(--space-md);
                }
                
                .set-goal-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    width: 100%;
                    padding: var(--space-sm);
                    background: var(--bg-tertiary);
                    border: 1px dashed var(--border-accent);
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    margin-bottom: var(--space-md);
                }
                
                .set-goal-btn:hover {
                    background: var(--bg-secondary);
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                }
                
                .set-goal-btn span {
                    flex: 1;
                    text-align: left;
                }
                
                .quick-add-buttons {
                    display: flex;
                    gap: var(--space-xs);
                }
                
                .quick-add-btn {
                    flex: 1;
                    padding: var(--space-sm);
                    background: var(--accent-primary);
                    border: none;
                    border-radius: var(--radius-sm);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                
                .quick-add-btn:hover {
                    filter: brightness(1.1);
                }
                
                .khatm-recommendation {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-sm);
                    margin-top: var(--space-md);
                    padding: var(--space-sm);
                    background: rgba(245, 158, 11, 0.1);
                    border-radius: var(--radius-sm);
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }
                
                .khatm-recommendation svg {
                    color: #f59e0b;
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                
                /* Goal Modal */
                .goal-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: var(--space-lg);
                }
                
                .goal-modal {
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    padding: var(--space-xl);
                    max-width: 400px;
                    width: 100%;
                    position: relative;
                }
                
                .modal-close {
                    position: absolute;
                    top: var(--space-md);
                    right: var(--space-md);
                    background: transparent;
                    border: none;
                    color: var(--text-tertiary);
                    cursor: pointer;
                }
                
                .goal-modal h3 {
                    margin-bottom: var(--space-xs);
                }
                
                .goal-modal .text-secondary {
                    font-size: 0.875rem;
                    margin-bottom: var(--space-lg);
                }
                
                .goal-options {
                    display: flex;
                    gap: var(--space-sm);
                    margin-bottom: var(--space-lg);
                }
                
                .goal-option {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-xs);
                    padding: var(--space-sm);
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-size: 0.875rem;
                }
                
                .goal-option input {
                    accent-color: var(--accent-primary);
                }
                
                .goal-value-input {
                    margin-bottom: var(--space-lg);
                }
                
                .goal-value-input label {
                    display: block;
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-bottom: var(--space-xs);
                }
                
                .goal-value-input input {
                    width: 100%;
                    padding: var(--space-sm);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-subtle);
                    border-radius: var(--radius-sm);
                    color: var(--text-primary);
                    font-size: 1rem;
                }
                
                .goal-preview {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--space-md);
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                    margin-bottom: var(--space-lg);
                }
                
                .preview-label {
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }
                
                .preview-value {
                    color: var(--accent-primary);
                    font-weight: 600;
                }
                
                .goal-modal .btn-primary {
                    width: 100%;
                }
            `}</style>
        </div>
    )
}
