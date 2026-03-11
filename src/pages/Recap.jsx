import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, TrendingUp, Activity, Brain, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import PulseGraph from '../components/PulseGraph'

export default function Recap() {
    const { generateRecap, realms } = useStore()

    const weeklyRecap = useMemo(() => generateRecap('weekly'), [generateRecap])
    const monthlyRecap = useMemo(() => generateRecap('monthly'), [generateRecap])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <div className="recap-page">
            <header className="recap-header">
                <div className="container py-md flex items-center justify-between">
                    <Link to="/" className="text-secondary hover:text-white flex items-center gap-sm">
                        <ArrowLeft size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <h1 className="font-display text-accent tracking-widest">LIFE RECAP</h1>
                </div>
            </header>

            <main className="container py-xl max-w-4xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-xl"
                >
                    {/* Hero Section */}
                    <motion.div variants={itemVariants} className="text-center py-xl">
                        <Sparkles size={48} className="mx-auto mb-md text-accent animate-pulse" />
                        <h2 className="text-4xl font-display mb-sm">Your Week in Synchrony</h2>
                        <p className="text-secondary">ECHO has analyzed your neural and creative cycles.</p>
                    </motion.div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        <motion.div variants={itemVariants} className="glass-card p-xl text-center">
                            <TrendingUp size={24} className="mx-auto mb-sm text-blue-400" />
                            <div className="text-3xl font-display">{weeklyRecap.totalEntries}</div>
                            <div className="text-xs text-secondary uppercase tracking-wider">Total Actions</div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="glass-card p-xl text-center">
                            <Brain size={24} className="mx-auto mb-sm text-purple-400" />
                            <div className="text-3xl font-display uppercase">{weeklyRecap.topRealm}</div>
                            <div className="text-xs text-secondary uppercase tracking-wider">Dominant Focus</div>
                        </motion.div>
                        <motion.div variants={itemVariants} className="glass-card p-xl text-center">
                            <Activity size={24} className="mx-auto mb-sm text-green-400" />
                            <div className="text-3xl font-display">{realms.cerebra.balance}%</div>
                            <div className="text-xs text-secondary uppercase tracking-wider">Mind Sync</div>
                        </motion.div>
                    </div>

                    {/* Detailed Analysis - Now with PulseGraph */}
                    <motion.div variants={itemVariants} className="glass-card p-xl">
                        <h3 className="text-xl font-display mb-lg border-b border-white/10 pb-sm flex items-center gap-sm">
                            <Zap size={20} className="text-accent" />
                            Neural Activity Pulse
                        </h3>

                        {/* Pulse Graph Visualization */}
                        <div className="pulse-visualization mb-xl">
                            <PulseGraph
                                data={Object.entries(realms).map(([key, realm]) => ({
                                    label: realm.icon,
                                    value: weeklyRecap.stats[key] || 0,
                                    color: realm.color
                                }))}
                                maxValue={Math.max(5, weeklyRecap.totalEntries)}
                                height="100px"
                                variant="pulse"
                            />
                        </div>

                        {/* Realm Breakdown List */}
                        <div className="space-y-md">
                            {Object.entries(realms).map(([key, realm]) => {
                                const count = weeklyRecap.stats[key] || 0
                                const percentage = weeklyRecap.totalEntries > 0 ? (count / weeklyRecap.totalEntries) * 100 : 0
                                return (
                                    <div key={key}>
                                        <div className="flex justify-between text-sm mb-xs">
                                            <span className="flex items-center gap-xs">
                                                <span>{realm.icon}</span>
                                                <span className="uppercase tracking-tighter">{realm.name}</span>
                                            </span>
                                            <span className="text-secondary">{count} events</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className="h-full"
                                                style={{ backgroundColor: realm.color }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Highlights */}
                    <motion.div variants={itemVariants}>
                        <h3 className="text-xl font-display mb-lg text-center">Weekly Echoes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                            {weeklyRecap.highlights.map((h, i) => (
                                <div key={i} className="glass-card p-md border-t-2" style={{ borderColor: h.color }}>
                                    <span className="text-xs text-secondary mb-xs block">{new Date(h.createdAt).toLocaleDateString()}</span>
                                    <p className="text-sm font-bold">{h.title || h.subType}</p>
                                    <p className="text-xs text-muted mt-xs line-clamp-2">{h.description || h.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            <style>{`
                .recap-page {
                    min-height: 100vh;
                    background: radial-gradient(circle at top, #0c0d16 0%, #000 100%);
                    color: #e0e0e0;
                }
                .recap-header {
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .text-accent { color: #ff6b00; }
                .glass-card {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 12px;
                }
            `}</style>
        </div>
    )
}
