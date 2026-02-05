import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Moon, Zap } from 'lucide-react'

/**
 * BioSyncWidget - Simulated biometric data display
 * Shows mock heart rate, sleep, and energy data with animated visualizations
 */
export default function BioSyncWidget() {
    const [heartRate, setHeartRate] = useState(72)
    const [energy, setEnergy] = useState(75)
    const [sleep, setSleep] = useState(7.5)
    const [isConnected, setIsConnected] = useState(false)

    // Simulate heart rate fluctuation
    useEffect(() => {
        if (!isConnected) return

        const interval = setInterval(() => {
            setHeartRate(prev => {
                const change = Math.floor(Math.random() * 5) - 2
                return Math.max(60, Math.min(100, prev + change))
            })
        }, 1500)

        return () => clearInterval(interval)
    }, [isConnected])

    const getHeartRateStatus = () => {
        if (heartRate < 60) return { label: 'LOW', color: '#4a9eff' }
        if (heartRate > 85) return { label: 'ELEVATED', color: '#ef4444' }
        return { label: 'OPTIMAL', color: '#22c55e' }
    }

    const hrStatus = getHeartRateStatus()

    return (
        <div className="bio-sync-widget glass-card p-lg">
            <div className="flex items-center justify-between mb-md">
                <h3 className="text-sm font-display uppercase tracking-wider text-secondary">
                    Bio-Sync
                </h3>
                <button
                    onClick={() => setIsConnected(!isConnected)}
                    className={`px-sm py-xs rounded text-xs transition-all ${isConnected
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-white/5 text-secondary border border-white/10'
                        }`}
                >
                    {isConnected ? '● Connected' : 'Connect'}
                </button>
            </div>

            {isConnected ? (
                <div className="bio-metrics space-y-md">
                    {/* Heart Rate */}
                    <div className="metric flex items-center gap-md">
                        <motion.div
                            className="metric-icon p-sm rounded-lg"
                            style={{ backgroundColor: '#ef444420' }}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
                        >
                            <Heart size={20} className="text-red-400" fill="currentColor" />
                        </motion.div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-2xl font-mono font-bold">{heartRate}</span>
                                <span className="text-xs" style={{ color: hrStatus.color }}>{hrStatus.label}</span>
                            </div>
                            <span className="text-xs text-secondary">BPM</span>
                        </div>
                    </div>

                    {/* Energy */}
                    <div className="metric flex items-center gap-md">
                        <div className="metric-icon p-sm rounded-lg" style={{ backgroundColor: '#f59e0b20' }}>
                            <Zap size={20} className="text-amber-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline mb-xs">
                                <span className="text-lg font-mono">{energy}%</span>
                                <span className="text-xs text-secondary">Energy</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-amber-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${energy}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sleep */}
                    <div className="metric flex items-center gap-md">
                        <div className="metric-icon p-sm rounded-lg" style={{ backgroundColor: '#8b5cf620' }}>
                            <Moon size={20} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg font-mono">{sleep}h</span>
                                <span className="text-xs text-secondary">Last Night</span>
                            </div>
                            <span className="text-xs" style={{ color: sleep >= 7 ? '#22c55e' : '#f59e0b' }}>
                                {sleep >= 7 ? 'Well rested' : 'Sleep deficit'}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="disconnected text-center py-xl text-secondary">
                    <Activity size={32} className="mx-auto mb-sm opacity-30" />
                    <p className="text-sm">Connect to sync biometrics</p>
                    <p className="text-xs opacity-60 mt-xs">(Simulated data)</p>
                </div>
            )}
        </div>
    )
}
