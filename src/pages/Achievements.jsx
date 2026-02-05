import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { ArrowLeft, Lock, Check, X, ChevronRight, Sparkles } from 'lucide-react'
import {
    achievements, talents, rarityColors, achievementQuestions,
    checkAchievementUnlock, checkTalentUnlock
} from '../data/achievementsData'

export default function Achievements() {
    const { user, realms, updateUser } = useStore()
    const [activeTab, setActiveTab] = useState('achievements')
    const [showQuestion, setShowQuestion] = useState(null)
    const [questionAnswer, setQuestionAnswer] = useState('')
    const [selectedCard, setSelectedCard] = useState(null)

    // Get question answers from user state
    const questionAnswers = user.questionAnswers || {}

    // Calculate unlocked achievements
    const userData = { user, realms, skills: realms.cerebra?.entries?.filter(e => e.type === 'skill') || [], questionAnswers }

    const unlockedAchievements = achievements.filter(a => checkAchievementUnlock(a, userData))
    const lockedAchievements = achievements.filter(a => !checkAchievementUnlock(a, userData))

    // Calculate unlocked talents
    const unlockedTalents = talents.filter(t => checkTalentUnlock(t, userData))
    const lockedTalents = talents.filter(t => !checkTalentUnlock(t, userData))

    const totalEarned = unlockedAchievements.length + unlockedTalents.length
    const totalPossible = achievements.length + talents.length
    const progressPercent = Math.round((totalEarned / totalPossible) * 100)

    // Get available questions (not yet answered)
    const getAvailableQuestions = () => {
        const allQuestions = Object.entries(achievementQuestions).flatMap(([category, qs]) =>
            qs.map(q => ({ ...q, categoryKey: category }))
        )
        const answeredIds = Object.values(questionAnswers).flat().map(a => a.id)
        return allQuestions.filter(q => !answeredIds.includes(q.id))
    }

    const availableQuestions = getAvailableQuestions()

    // Handle answering a question
    const handleAnswerQuestion = () => {
        if (!showQuestion || !questionAnswer.trim()) return

        const newAnswers = {
            ...questionAnswers,
            [showQuestion.categoryKey]: [
                ...(questionAnswers[showQuestion.categoryKey] || []),
                { id: showQuestion.id, answer: questionAnswer, answeredAt: new Date().toISOString() }
            ]
        }

        updateUser({ questionAnswers: newAnswers })
        setQuestionAnswer('')
        setShowQuestion(null)
    }

    // Start random question
    const startRandomQuestion = () => {
        if (availableQuestions.length > 0) {
            const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
            setShowQuestion(randomQ)
        }
    }

    const renderCard = (item, unlocked, type) => {
        const rarity = rarityColors[item.rarity]

        return (
            <motion.div
                key={item.id}
                className={`achievement-card ${unlocked ? 'unlocked' : 'locked'} ${item.rarity}`}
                style={{ '--rarity-bg': rarity.bg, '--rarity-border': rarity.border }}
                whileHover={{ scale: unlocked ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => unlocked && setSelectedCard(item)}
            >
                <div className="card-frame">
                    <div className="card-glow" />
                    <div className="card-inner">
                        <span className="card-icon">{unlocked ? item.icon : '❓'}</span>
                        {!unlocked && <Lock size={16} className="lock-icon" />}
                    </div>
                    {unlocked && <div className="unlock-badge"><Check size={10} /></div>}
                </div>
                <span className="card-name">{unlocked ? item.name : '???'}</span>
                <span className="card-rarity">{item.rarity.toUpperCase()}</span>
            </motion.div>
        )
    }

    const renderRaritySection = (items, unlocked, rarity, label) => {
        const filteredItems = items.filter(i => i.rarity === rarity)
        if (filteredItems.length === 0) return null

        return (
            <div key={rarity} className="rarity-section">
                <div className="rarity-header">
                    <div className={`rarity-line ${rarity}`} />
                    <span className="rarity-label">{label}</span>
                    <div className={`rarity-line ${rarity}`} />
                </div>
                <div className="cards-grid">
                    {filteredItems.map(item => renderCard(item, unlocked.some(u => u.id === item.id), activeTab))}
                </div>
            </div>
        )
    }

    return (
        <div className="achievements-page">
            {/* Header */}
            <header className="page-header">
                <Link to="/" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <h1>Collection</h1>
                <div style={{ width: 40 }} />
            </header>

            {/* Progress */}
            <div className="progress-section">
                <div className="progress-stats">
                    <span className="progress-count">{totalEarned} / {totalPossible} earned</span>
                    <span className="progress-percent">{progressPercent}%</span>
                </div>
                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Unlock Question Button */}
            {availableQuestions.length > 0 && (
                <motion.button
                    className="question-trigger"
                    onClick={startRandomQuestion}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Sparkles size={20} />
                    <span>Answer a question to unlock achievements</span>
                    <ChevronRight size={20} />
                </motion.button>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('achievements')}
                >
                    Achievements ({unlockedAchievements.length}/{achievements.length})
                </button>
                <button
                    className={`tab ${activeTab === 'talents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('talents')}
                >
                    Talents ({unlockedTalents.length}/{talents.length})
                </button>
            </div>

            {/* Recently Earned */}
            {activeTab === 'achievements' && unlockedAchievements.length > 0 && (
                <section className="recent-section">
                    <h2 className="section-title">Recently Earned</h2>
                    <div className="recent-scroll">
                        {unlockedAchievements.slice(0, 5).map(a => renderCard(a, true, 'achievements'))}
                    </div>
                </section>
            )}

            {activeTab === 'talents' && unlockedTalents.length > 0 && (
                <section className="recent-section">
                    <h2 className="section-title">Your Talents</h2>
                    <div className="recent-scroll">
                        {unlockedTalents.map(t => renderCard(t, true, 'talents'))}
                    </div>
                </section>
            )}

            {/* All Cards by Rarity */}
            <main className="cards-container">
                {activeTab === 'achievements' ? (
                    <>
                        {renderRaritySection(achievements, unlockedAchievements, 'mythic', 'MYTHIC')}
                        {renderRaritySection(achievements, unlockedAchievements, 'legendary', 'LEGENDARY')}
                        {renderRaritySection(achievements, unlockedAchievements, 'epic', 'EPIC')}
                        {renderRaritySection(achievements, unlockedAchievements, 'rare', 'RARE')}
                        {renderRaritySection(achievements, unlockedAchievements, 'common', 'COMMON')}
                    </>
                ) : (
                    <>
                        {renderRaritySection(talents, unlockedTalents, 'legendary', 'LEGENDARY')}
                        {renderRaritySection(talents, unlockedTalents, 'epic', 'EPIC')}
                        {renderRaritySection(talents, unlockedTalents, 'rare', 'RARE')}
                        {renderRaritySection(talents, unlockedTalents, 'common', 'COMMON')}
                    </>
                )}
            </main>

            {/* Question Modal */}
            <AnimatePresence>
                {showQuestion && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowQuestion(null)}
                    >
                        <motion.div
                            className="question-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="close-btn" onClick={() => setShowQuestion(null)}>
                                <X size={20} />
                            </button>

                            <div className="question-header">
                                <Sparkles size={24} />
                                <span>Self Discovery</span>
                            </div>

                            <p className="question-text">{showQuestion.text}</p>

                            <textarea
                                className="answer-input"
                                placeholder="Share your thoughts..."
                                value={questionAnswer}
                                onChange={e => setQuestionAnswer(e.target.value)}
                                rows={4}
                            />

                            <button
                                className="submit-btn"
                                onClick={handleAnswerQuestion}
                                disabled={!questionAnswer.trim()}
                            >
                                Submit Answer
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card Detail Modal */}
            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCard(null)}
                    >
                        <motion.div
                            className={`card-detail-modal ${selectedCard.rarity}`}
                            style={{
                                '--rarity-bg': rarityColors[selectedCard.rarity].bg,
                                '--rarity-border': rarityColors[selectedCard.rarity].border
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="detail-frame">
                                <div className="detail-icon">{selectedCard.icon}</div>
                            </div>
                            <h3 className="detail-name">{selectedCard.name}</h3>
                            <span className="detail-rarity">{selectedCard.rarity.toUpperCase()}</span>
                            <p className="detail-desc">{selectedCard.description}</p>
                            <button className="close-detail" onClick={() => setSelectedCard(null)}>
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        .achievements-page {
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
          text-decoration: none;
        }

        /* Progress */
        .progress-section {
          padding: var(--space-lg);
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
        }

        .progress-count {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .progress-percent {
          font-size: 0.875rem;
          font-weight: 600;
          color: #22c55e;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 4px;
        }

        /* Question Trigger */
        .question-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          width: calc(100% - var(--space-lg) * 2);
          margin: 0 var(--space-lg) var(--space-lg);
          padding: var(--space-md);
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(124, 58, 237, 0.1));
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 12px;
          color: #a855f7;
          cursor: pointer;
        }

        .question-trigger span {
          flex: 1;
          text-align: left;
          font-size: 0.875rem;
        }

        /* Tabs */
        .tabs {
          display: flex;
          padding: 0 var(--space-lg);
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
        }

        .tab {
          flex: 1;
          padding: var(--space-sm) var(--space-md);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: rgba(255,255,255,0.1);
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }

        /* Recent Section */
        .recent-section {
          padding: 0 var(--space-lg);
          margin-bottom: var(--space-xl);
        }

        .section-title {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: var(--space-md);
        }

        .recent-scroll {
          display: flex;
          gap: var(--space-md);
          overflow-x: auto;
          padding-bottom: var(--space-sm);
        }

        /* Cards */
        .cards-container {
          padding: 0 var(--space-lg);
        }

        .rarity-section {
          margin-bottom: var(--space-xl);
        }

        .rarity-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .rarity-line {
          flex: 1;
          height: 2px;
          border-radius: 1px;
        }

        .rarity-line.common { background: linear-gradient(90deg, transparent, #6b7280, transparent); }
        .rarity-line.rare { background: linear-gradient(90deg, transparent, #3b82f6, transparent); }
        .rarity-line.epic { background: linear-gradient(90deg, transparent, #a855f7, transparent); }
        .rarity-line.legendary { background: linear-gradient(90deg, transparent, #f59e0b, transparent); }
        .rarity-line.mythic { background: linear-gradient(90deg, transparent, #22c55e, transparent); }

        .rarity-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-md);
        }

        .achievement-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .card-frame {
          position: relative;
          width: 70px;
          height: 90px;
          border-radius: 8px;
          background: var(--rarity-bg);
          border: 2px solid var(--rarity-border);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%);
        }

        .card-inner {
          position: relative;
          z-index: 1;
        }

        .card-icon {
          font-size: 2rem;
        }

        .locked .card-frame {
          background: linear-gradient(180deg, #2a2a35 0%, #1a1a25 100%);
          border-color: #3a3a45;
        }

        .locked .card-icon {
          opacity: 0.3;
        }

        .lock-icon {
          position: absolute;
          bottom: -20px;
          color: #666;
        }

        .unlock-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 18px;
          height: 18px;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .card-name {
          font-size: 0.65rem;
          font-weight: 500;
          text-align: center;
          color: var(--text-primary);
        }

        .locked .card-name {
          color: var(--text-muted);
        }

        .card-rarity {
          font-size: 0.55rem;
          color: var(--rarity-border);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Modals */
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

        .question-modal {
          width: 100%;
          max-width: 400px;
          background: var(--bg-secondary);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: var(--space-xl);
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .question-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: #a855f7;
          margin-bottom: var(--space-lg);
        }

        .question-text {
          font-size: 1.125rem;
          font-weight: 500;
          margin-bottom: var(--space-lg);
          line-height: 1.5;
        }

        .answer-input {
          width: 100%;
          padding: var(--space-md);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.875rem;
          resize: none;
          margin-bottom: var(--space-md);
        }

        .answer-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .submit-btn {
          width: 100%;
          padding: var(--space-md);
          background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Card Detail Modal */
        .card-detail-modal {
          width: 260px;
          background: var(--bg-secondary);
          border: 2px solid var(--rarity-border);
          border-radius: 16px;
          padding: var(--space-xl);
          text-align: center;
        }

        .detail-frame {
          width: 100px;
          height: 120px;
          margin: 0 auto var(--space-lg);
          background: var(--rarity-bg);
          border: 2px solid var(--rarity-border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .detail-icon {
          font-size: 3rem;
        }

        .detail-name {
          font-size: 1.25rem;
          margin-bottom: 4px;
        }

        .detail-rarity {
          font-size: 0.75rem;
          color: var(--rarity-border);
          letter-spacing: 0.1em;
        }

        .detail-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: var(--space-md) 0;
        }

        .close-detail {
          width: 100%;
          padding: var(--space-sm);
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
        }

        @media (max-width: 400px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
        </div>
    )
}
