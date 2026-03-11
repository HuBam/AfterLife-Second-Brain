import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Plus, TrendingUp } from 'lucide-react'
import { useStore } from '../../store/useStore'

/**
 * SkillXPCard - RPG-style skill card with XP bar and hour logging
 * Shows skill rank, hours, and progress to next rank
 */
export default function SkillXPCard({ skill, realmColor }) {
    const { updateSkillHours, calculateRank } = useStore()
    const [showLogHours, setShowLogHours] = useState(false)
    const [hoursToAdd, setHoursToAdd] = useState('')

    const hours = skill.hours || 0
    const rank = skill.rank || 'F'

    // Rank thresholds for progress calculation
    const rankThresholds = {
        F: { min: 0, max: 20, next: 'D' },
        D: { min: 20, max: 100, next: 'C' },
        C: { min: 100, max: 500, next: 'B' },
        B: { min: 500, max: 1000, next: 'A' },
        A: { min: 1000, max: 2500, next: 'S' },
        S: { min: 2500, max: 5000, next: 'SS' },
        SS: { min: 5000, max: 10000, next: 'SSS' },
        SSS: { min: 10000, max: 20000, next: 'MAX' }
    }

    const threshold = rankThresholds[rank]
    const progressInTier = ((hours - threshold.min) / (threshold.max - threshold.min)) * 100
    const hoursToNext = threshold.max - hours

    const handleLogHours = () => {
        const addHours = parseFloat(hoursToAdd)
        if (addHours > 0) {
            updateSkillHours(skill.id, addHours)
            setHoursToAdd('')
            setShowLogHours(false)
        }
    }

    const rankColors = {
        F: '#666',
        D: '#888',
        C: '#4a9eff',
        B: '#22c55e',
        A: '#a855f7',
        S: '#f59e0b',
        SS: '#ef4444',
        SSS: '#ff6b00'
    }

    return (
        <motion.div
            className="skill-xp-card glass-card p-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className="flex justify-between items-start mb-sm">
                <div>
                    <h4 className="font-display text-lg">{skill.title}</h4>
                    <span className="text-xs text-secondary">{skill.content}</span>
                </div>
                <div
                    className="rank-badge px-sm py-xs rounded text-sm font-bold"
                    style={{
                        backgroundColor: `${rankColors[rank]}20`,
                        color: rankColors[rank],
                        border: `1px solid ${rankColors[rank]}40`
                    }}
                >
                    {rank}
                </div>
            </div>

            {/* XP Progress Bar */}
            <div className="xp-section mt-md">
                <div className="flex justify-between text-xs mb-xs">
                    <span className="text-secondary flex items-center gap-xs">
                        <Clock size={12} />
                        {hours.toLocaleString()} hrs
                    </span>
                    {rank !== 'SSS' && (
                        <span className="text-accent flex items-center gap-xs">
                            <TrendingUp size={12} />
                            {hoursToNext.toLocaleString()} hrs to {threshold.next}
                        </span>
                    )}
                </div>
                <div className="xp-bar h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: rankColors[rank] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, progressInTier)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Log Hours Button / Form */}
            <AnimatePresence mode="wait">
                {showLogHours ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="log-hours-form mt-md flex gap-sm"
                    >
                        <input
                            type="number"
                            value={hoursToAdd}
                            onChange={(e) => setHoursToAdd(e.target.value)}
                            placeholder="Hours"
                            className="flex-1 px-sm py-xs rounded bg-white/5 border border-white/10 text-white text-sm"
                            min="0.5"
                            step="0.5"
                            autoFocus
                        />
                        <button
                            onClick={handleLogHours}
                            className="px-md py-xs rounded bg-accent text-black text-sm font-medium"
                        >
                            Log
                        </button>
                        <button
                            onClick={() => setShowLogHours(false)}
                            className="px-sm py-xs rounded bg-white/10 text-secondary text-sm"
                        >
                            ✕
                        </button>
                    </motion.div>
                ) : (
                    <motion.button
                        key="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowLogHours(true)}
                        className="log-hours-btn mt-md w-full py-xs rounded border border-white/10 text-secondary text-xs flex items-center justify-center gap-xs hover:border-accent hover:text-accent transition-colors"
                    >
                        <Plus size={12} />
                        Log Hours
                    </motion.button>
                )}
            </AnimatePresence>

            <style>{`
                .skill-xp-card { border: 1px solid rgba(255,255,255,0.05); }
                .skill-xp-card:hover { border-color: rgba(255,255,255,0.1); }
            `}</style>
        </motion.div>
    )
}
