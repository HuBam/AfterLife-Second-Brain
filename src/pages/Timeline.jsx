import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Filter, Clock, Calendar, Activity } from 'lucide-react'
import { useStore } from '../store/useStore'
import PulseGraph from '../components/PulseGraph'

const AGE_UNITS = [
    { key: 's', label: 'SEC', factor: 1 / 1000 },
    { key: 'm', label: 'MIN', factor: 1 / 60000 },
    { key: 'h', label: 'HRS', factor: 1 / 3600000 },
    { key: 'd', label: 'DAYS', factor: 1 / 86400000 },
    { key: 'M', label: 'MONTHS', factor: 1 / (86400000 * 30.44) },
    { key: 'y', label: 'YEARS', factor: 1 / (86400000 * 365.25) },
    { key: 'c', label: 'CENTS', factor: 1 / (86400000 * 365.25 * 100) },
]

export default function Timeline() {
    const { user, getTimeline, getLifeExpectancy } = useStore()
    const timeline = getTimeline()
    const [filter, setFilter] = useState('all')
    const [timeScale, setTimeScale] = useState('week')
    const [ageUnit, setAgeUnit] = useState('y') // drillable unit

    const lifeExpectancy = getLifeExpectancy ? getLifeExpectancy() : (user.lifeExpectancy || 80)

    // Age & Life Path calculation
    const [timeLived, setTimeLived] = useState({
        years: 0, months: 0, days: 0, hours: 0,
        totalMs: 0, progress: 0, progressColor: '#4a9eff',
        remaining: { years: 0, months: 0, days: 0 },
        weeksRemaining: 0,
    })

    useEffect(() => {
        if (!user.birthDate) return

        const calculateTime = () => {
            const birth = new Date(user.birthDate)
            if (user.birthTime) {
                const [h, m] = user.birthTime.split(':').map(Number)
                birth.setHours(h, m, 0, 0)
            }
            const now = new Date()
            const diffMs = now - birth
            if (diffMs < 0) return

            const totalLifeMs = lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000
            const progress = Math.min(100, (diffMs / totalLifeMs) * 100)
            const remainingMs = Math.max(0, totalLifeMs - diffMs)
            const rYears = Math.floor(remainingMs / (86400000 * 365.25))
            const rDays = Math.floor((remainingMs % (86400000 * 365.25)) / 86400000)
            const rMonths = Math.floor(rDays / 30.44)
            const weeksRemaining = Math.floor(remainingMs / (86400000 * 7))

            const years = Math.floor(diffMs / (86400000 * 365.25))
            const rem = diffMs - years * 86400000 * 365.25
            const months = Math.floor(rem / (86400000 * 30.44))
            const days = Math.floor((rem % (86400000 * 30.44)) / 86400000)
            const hours = Math.floor((diffMs % 86400000) / 3600000)

            const pct = 100 - progress
            const progressColor = pct < 10 ? '#ef4444' : pct < 30 ? '#f59e0b' : 'var(--accent-primary, #4a9eff)'

            setTimeLived({
                years, months, days, hours, totalMs: diffMs,
                progress, progressColor,
                remaining: { years: rYears, months: rMonths, days: rDays },
                weeksRemaining,
            })
        }

        calculateTime()
        const interval = setInterval(calculateTime, 1000) // Update every second for live counter
        return () => clearInterval(interval)
    }, [user.birthDate, user.birthTime, lifeExpectancy])

    // Compute drillable age number
    const drillableAge = useMemo(() => {
        if (!timeLived.totalMs) return '—'
        const unit = AGE_UNITS.find(u => u.key === ageUnit)
        const val = timeLived.totalMs * unit.factor
        return val >= 1000 ? Math.floor(val).toLocaleString() : val.toFixed(2)
    }, [timeLived.totalMs, ageUnit])

    // Filter Logic
    const filteredEvents = timeline.filter(item => {
        if (filter === 'all') return true
        return item.realm === filter
    })

    // Generate activity data for heatmap based on time scale
    const activityData = useMemo(() => {
        const now = new Date()
        const data = []

        const periodConfig = {
            day: { count: 24, unit: 'hour', ms: 60 * 60 * 1000 },
            week: { count: 7, unit: 'day', ms: 24 * 60 * 60 * 1000 },
            month: { count: 30, unit: 'day', ms: 24 * 60 * 60 * 1000 },
            year: { count: 12, unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 }
        }

        const config = periodConfig[timeScale]

        for (let i = config.count - 1; i >= 0; i--) {
            const periodStart = new Date(now - (i + 1) * config.ms)
            const periodEnd = new Date(now - i * config.ms)

            const count = filteredEvents.filter(e => {
                const date = new Date(e.createdAt)
                return date >= periodStart && date < periodEnd
            }).length

            data.push({
                label: i === 0 ? 'Now' : `-${i}`,
                value: count,
                color: count > 0 ? '#ff6b00' : 'rgba(255,255,255,0.1)'
            })
        }

        return data
    }, [filteredEvents, timeScale])

    // Group by Month Year
    const groupedEvents = filteredEvents.reduce((groups, event) => {
        const date = new Date(event.createdAt)
        const key = date.toLocaleString('default', { month: 'long', year: 'numeric' })
        if (!groups[key]) groups[key] = []
        groups[key].push(event)
        return groups
    }, {})

    return (
        <div className="timeline-page">
            <header className="page-header sticky top-0 bg-opacity-90 backdrop-blur-md z-50 border-b border-white/10">
                <div className="container py-md">
                    <div className="flex items-center justify-between mb-md">
                        <Link to="/" className="flex items-center gap-sm text-secondary hover:text-white">
                            <ArrowLeft size={20} />
                            <span>Dashboard</span>
                        </Link>
                        <h1 className="text-xl font-display tracking-widest">CHRONOS</h1>
                    </div>

                    {/* CHRONOS HERO — Drillable Age Counter */}
                    <div className="chronos-hero glass-card p-lg mb-md">
                        {/* Unit selector pills */}
                        <div className="age-unit-row">
                            {AGE_UNITS.map(u => (
                                <button
                                    key={u.key}
                                    onClick={() => setAgeUnit(u.key)}
                                    className={`age-unit-pill ${ageUnit === u.key ? 'active' : ''}`}
                                >
                                    {u.label}
                                </button>
                            ))}
                        </div>

                        {/* Big animated number */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={ageUnit}
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="chronos-number"
                            >
                                {drillableAge}
                            </motion.div>
                        </AnimatePresence>
                        <div className="chronos-unit-label">
                            {AGE_UNITS.find(u => u.key === ageUnit)?.label} ALIVE
                        </div>

                        {/* Dual Life Path Panel */}
                        <div className="life-path-dual">
                            <div className="life-path-side lived">
                                <span className="life-path-label">TIME LIVED</span>
                                <span className="life-path-main">{timeLived.years}Y {timeLived.months}M {timeLived.days}D</span>
                                <span className="life-path-sub">{timeLived.years > 0 ? (timeLived.years * 365 + timeLived.days).toLocaleString() : '—'} days</span>
                            </div>
                            <div className="life-path-divider" />
                            <div className="life-path-side remaining">
                                <span className="life-path-label">TIME REMAINING</span>
                                <span className="life-path-main" style={{ color: timeLived.progressColor }}>
                                    ~{timeLived.remaining.years}Y {timeLived.remaining.months}M
                                </span>
                                <span className="life-path-sub">{timeLived.weeksRemaining.toLocaleString()} weeks</span>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="life-progress-wrap">
                            <div className="flex justify-between text-xs mb-xs" style={{ opacity: 0.5 }}>
                                <span>Birth</span>
                                <span style={{ color: timeLived.progressColor }}>{timeLived.progress.toFixed(2)}%</span>
                                <span>~{lifeExpectancy}y est. <span style={{ fontSize: '0.6rem', opacity: 0.6 }}>auto</span></span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: timeLived.progressColor }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${timeLived.progress}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Time Scale Zoom Controls */}
                    <div className="flex items-center justify-between mb-md">
                        <span className="text-xs text-secondary uppercase tracking-wider">Time Scale</span>
                        <div className="zoom-controls flex gap-xs">
                            {['day', 'week', 'month', 'year'].map(scale => (
                                <button
                                    key={scale}
                                    onClick={() => setTimeScale(scale)}
                                    className={`px-md py-xs rounded text-xs border transition-colors ${timeScale === scale
                                        ? 'bg-accent text-black border-accent'
                                        : 'bg-transparent text-secondary border-white/20 hover:border-white/50'
                                        }`}
                                >
                                    {scale.charAt(0).toUpperCase() + scale.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activity Heatmap */}
                    <div className="activity-heatmap glass-card p-md mb-md">
                        <div className="flex items-center justify-between mb-sm">
                            <span className="text-xs text-secondary uppercase tracking-wider">Activity Pulse ({timeScale})</span>
                            <span className="text-xs text-accent">{filteredEvents.length} events</span>
                        </div>
                        <PulseGraph
                            data={activityData}
                            maxValue={Math.max(5, ...activityData.map(d => d.value))}
                            height="60px"
                            variant="heatmap"
                            showLabels={false}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="filter-tabs flex gap-sm overflow-x-auto pb-xs hide-scrollbar">
                        {['all', 'cerebra', 'elysia', 'empyra', 'oblivion', 'sanctum', 'avatar'].map(realm => (
                            <button
                                key={realm}
                                onClick={() => setFilter(realm)}
                                className={`px-md py-xs rounded-full text-sm border transition-colors ${filter === realm
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-secondary border-white/20 hover:border-white/50'
                                    }`}
                            >
                                {realm.charAt(0).toUpperCase() + realm.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="container py-xl max-w-3xl mx-auto">
                {Object.keys(groupedEvents).length === 0 ? (
                    <div className="text-center py-2xl text-secondary">
                        <Clock size={48} className="mx-auto mb-md opacity-50" />
                        <p>No events recorded in this timeline yet.</p>
                    </div>
                ) : (
                    Object.entries(groupedEvents).map(([dateGroup, events]) => (
                        <div key={dateGroup} className="timeline-group mb-xl">
                            <div className="sticky top-24 z-10 py-sm bg-black/50 backdrop-blur mb-md border-b border-white/5">
                                <h3 className="text-lg font-display text-accent">{dateGroup}</h3>
                            </div>

                            <div className="events-list pl-lg border-l border-white/10 ml-sm space-y-lg">
                                {events.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="timeline-event relative pl-lg"
                                    >
                                        <div
                                            className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-black"
                                            style={{ backgroundColor: event.color || '#fff' }}
                                        />

                                        <div className="glass-card p-md hover:bg-white/5 transition-colors">
                                            <div className="flex justify-between items-start mb-xs">
                                                <div className="flex items-center gap-sm">
                                                    <span className="text-xl">{event.icon}</span>
                                                    <span className="font-bold text-white module-title">
                                                        {event.title || event.subType || 'Entry'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-secondary font-mono">
                                                    {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {event.description && (
                                                <p className="text-secondary text-sm line-clamp-2">{event.description}</p>
                                            )}

                                            {/* Context Tags based on Realm */}
                                            <div className="flex gap-xs mt-sm">
                                                {event.rank && <span className="text-xs px-xs py-0.5 rounded bg-white/10 text-accent">Rank {event.rank}</span>}
                                                {event.mood && <span className="text-xs px-xs py-0.5 rounded bg-white/10">Mood: {event.mood}</span>}
                                                <span className="text-xs px-xs py-0.5 rounded border border-white/10 text-muted uppercase">
                                                    {event.realm}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    )
}
