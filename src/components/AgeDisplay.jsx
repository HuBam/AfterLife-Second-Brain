import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Interactive Age Display Component
 * Shows live age counter with multiple display modes:
 * - Breakdown view: years, months, weeks, days, hours, minutes, seconds
 * - Single unit view: click any unit to see total in that unit only
 */
export default function AgeDisplay({ birthDate, birthTime, onEditBirth }) {
    const [now, setNow] = useState(new Date())
    const [selectedUnit, setSelectedUnit] = useState(null) // null = show all, or 'years', 'months', etc.
    const [showBirthInfo, setShowBirthInfo] = useState(false)

    // Update every second
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    // Calculate birth datetime
    const birthDateTime = useMemo(() => {
        if (!birthDate) return null

        const [year, month, day] = birthDate.split('-').map(Number)
        let hours = 0, minutes = 0

        if (birthTime) {
            const [h, m] = birthTime.split(':').map(Number)
            hours = h || 0
            minutes = m || 0
        }

        return new Date(year, month - 1, day, hours, minutes, 0, 0)
    }, [birthDate, birthTime])

    // Calculate all age units
    const ageData = useMemo(() => {
        if (!birthDateTime) return null

        const diffMs = now - birthDateTime
        if (diffMs < 0) return null // Born in the future?

        // Total units
        const totalSeconds = Math.floor(diffMs / 1000)
        const totalMinutes = Math.floor(diffMs / (1000 * 60))
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60))
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
        const totalWeeks = Math.floor(totalDays / 7)
        const totalMonths = Math.floor(totalDays / 30.44) // Average days per month
        const totalYears = Math.floor(totalDays / 365.25) // Account for leap years

        // Breakdown (for display)
        const years = totalYears
        const remainingAfterYears = diffMs - (years * 365.25 * 24 * 60 * 60 * 1000)
        const months = Math.floor(remainingAfterYears / (30.44 * 24 * 60 * 60 * 1000))
        const remainingAfterMonths = remainingAfterYears - (months * 30.44 * 24 * 60 * 60 * 1000)
        const weeks = Math.floor(remainingAfterMonths / (7 * 24 * 60 * 60 * 1000))
        const remainingAfterWeeks = remainingAfterMonths - (weeks * 7 * 24 * 60 * 60 * 1000)
        const days = Math.floor(remainingAfterWeeks / (24 * 60 * 60 * 1000))
        const remainingAfterDays = remainingAfterWeeks - (days * 24 * 60 * 60 * 1000)
        const hours = Math.floor(remainingAfterDays / (60 * 60 * 1000))
        const remainingAfterHours = remainingAfterDays - (hours * 60 * 60 * 1000)
        const minutes = Math.floor(remainingAfterHours / (60 * 1000))
        const seconds = Math.floor((remainingAfterHours - (minutes * 60 * 1000)) / 1000)

        return {
            breakdown: { years, months, weeks, days, hours, minutes, seconds },
            totals: {
                years: totalYears,
                months: totalMonths,
                weeks: totalWeeks,
                days: totalDays,
                hours: totalHours,
                minutes: totalMinutes,
                seconds: totalSeconds,
            }
        }
    }, [birthDateTime, now])

    if (!birthDate || !ageData) {
        return (
            <div
                className="age-display-empty"
                onClick={onEditBirth}
                style={{
                    cursor: 'pointer',
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}
            >
                Click to add birth date
            </div>
        )
    }

    const formatNumber = (num) => num.toLocaleString()

    const units = [
        { key: 'years', label: 'Y', fullLabel: 'Years' },
        { key: 'months', label: 'M', fullLabel: 'Months' },
        { key: 'weeks', label: 'W', fullLabel: 'Weeks' },
        { key: 'days', label: 'D', fullLabel: 'Days' },
        { key: 'hours', label: 'H', fullLabel: 'Hours' },
        { key: 'minutes', label: 'M', fullLabel: 'Minutes' },
        { key: 'seconds', label: 'S', fullLabel: 'Seconds' },
    ]

    const handleUnitClick = (unitKey) => {
        if (selectedUnit === unitKey) {
            setSelectedUnit(null) // Toggle back to breakdown view
        } else {
            setSelectedUnit(unitKey)
        }
    }

    const formatBirthDate = () => {
        if (!birthDate) return ''
        const [year, month, day] = birthDate.split('-')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthName = months[parseInt(month) - 1]
        const timeStr = birthTime ? ` at ${birthTime}` : ''
        return `${monthName} ${parseInt(day)}, ${year}${timeStr}`
    }

    return (
        <div className="age-display-container">
            {/* Birth date info (shown on click) */}
            <AnimatePresence>
                {showBirthInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="birth-info-popup"
                        style={{
                            position: 'absolute',
                            top: '-40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'var(--bg-card)',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: 'var(--accent-primary)',
                            whiteSpace: 'nowrap',
                            border: '1px solid var(--border-subtle)',
                            zIndex: 10
                        }}
                    >
                        Born: {formatBirthDate()}
                        {!birthTime && (
                            <span
                                style={{ marginLeft: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); onEditBirth?.() }}
                            >
                                + Add time
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main age display */}
            <div
                className="age-display"
                onClick={() => setShowBirthInfo(!showBirthInfo)}
                style={{
                    position: 'relative',
                    cursor: 'pointer',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                }}
            >
                <AnimatePresence mode="wait">
                    {selectedUnit ? (
                        // Single unit view
                        <motion.div
                            key={selectedUnit}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                            onClick={(e) => { e.stopPropagation(); setSelectedUnit(null) }}
                        >
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                fontFamily: 'var(--font-mono, monospace)',
                                color: 'var(--accent-primary)'
                            }}>
                                {formatNumber(ageData.totals[selectedUnit])}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                                {units.find(u => u.key === selectedUnit)?.fullLabel}
                            </div>
                            <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
                                tap to show all
                            </div>
                        </motion.div>
                    ) : (
                        // Breakdown view
                        <motion.div
                            key="breakdown"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}
                        >
                            {units.map(({ key, label, fullLabel }) => (
                                <motion.div
                                    key={key}
                                    onClick={(e) => { e.stopPropagation(); handleUnitClick(key) }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '0.25rem 0.5rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        minWidth: '40px',
                                        transition: 'background 0.2s'
                                    }}
                                    title={`Click to see total ${fullLabel.toLowerCase()}`}
                                >
                                    <span style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        fontFamily: 'var(--font-mono, monospace)',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {ageData.breakdown[key]}
                                    </span>
                                    <span style={{
                                        fontSize: '0.625rem',
                                        color: 'var(--text-secondary)',
                                        textTransform: 'uppercase'
                                    }}>
                                        {label}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .age-display-container {
                    position: relative;
                }
                .age-display:hover {
                    background: rgba(255,255,255,0.06) !important;
                }
                .age-display > div > div:hover {
                    background: rgba(255,255,255,0.1) !important;
                }
            `}</style>
        </div>
    )
}
