import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Filter, Clock, Calendar, Activity } from 'lucide-react'
import { useStore } from '../store/useStore'
import PulseGraph from '../components/PulseGraph'

export default function Timeline() {
    const { user, getTimeline } = useStore()
    const timeline = getTimeline() // Get aggregated feed
    const [filter, setFilter] = useState('all') // all, cerebra, elysia, etc.
    const [timeScale, setTimeScale] = useState('week') // day, week, month, year

    // Age Calculation "Memento Mori"
    const [timeLived, setTimeLived] = useState({ years: 0, days: 0, hours: 0, progress: 0 })

    useEffect(() => {
        if (!user.birthDate) return

        const calculateTime = () => {
            const birth = new Date(user.birthDate)
            const now = new Date()
            const diff = now - birth

            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
            const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

            // Life Progress
            const totalLifeMs = user.lifeExpectancy * 365.25 * 24 * 60 * 60 * 1000
            const progress = Math.min(100, (diff / totalLifeMs) * 100)

            setTimeLived({ years, days, hours, progress })
        }

        calculateTime()
        const interval = setInterval(calculateTime, 60000) // Update every minute
        return () => clearInterval(interval)
    }, [user.birthDate, user.lifeExpectancy])

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

                    {/* Memento Mori Clock */}
                    <div className="memento-mori glass-card p-md mb-md flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-secondary uppercase tracking-wider">Time Lived</span>
                            <div className="text-2xl font-mono font-bold text-accent">
                                {timeLived.years}y {timeLived.days}d {timeLived.hours}h
                            </div>
                        </div>
                        <div className="flex-1 mx-xl">
                            <div className="flex justify-between text-xs text-secondary mb-xs">
                                <span>Birth</span>
                                <span>{timeLived.progress.toFixed(4)}%</span>
                                <span>{user.lifeExpectancy}y Est.</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-accent"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${timeLived.progress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
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
