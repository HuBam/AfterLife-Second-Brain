import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RefreshCw } from 'lucide-react'

/**
 * BreathingExercise - Guided breathing timer with visual animation
 * Features box breathing pattern: inhale → hold → exhale → hold
 */
export default function BreathingExercise({ onComplete }) {
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState('inhale') // inhale, hold1, exhale, hold2
    const [seconds, setSeconds] = useState(4)
    const [cycles, setCycles] = useState(0)
    const [totalCycles] = useState(4) // Complete 4 full cycles

    const phases = {
        inhale: { duration: 4, next: 'hold1', label: 'BREATHE IN', color: '#4a9eff' },
        hold1: { duration: 4, next: 'exhale', label: 'HOLD', color: '#a855f7' },
        exhale: { duration: 4, next: 'hold2', label: 'BREATHE OUT', color: '#22c55e' },
        hold2: { duration: 4, next: 'inhale', label: 'HOLD', color: '#f59e0b' }
    }

    const currentPhase = phases[phase]

    const tick = useCallback(() => {
        if (seconds > 1) {
            setSeconds(s => s - 1)
        } else {
            // Move to next phase
            if (phase === 'hold2') {
                // Completed one full cycle
                if (cycles + 1 >= totalCycles) {
                    setIsActive(false)
                    setCycles(0)
                    setPhase('inhale')
                    setSeconds(4)
                    if (onComplete) onComplete()
                    return
                }
                setCycles(c => c + 1)
            }
            setPhase(currentPhase.next)
            setSeconds(phases[currentPhase.next].duration)
        }
    }, [seconds, phase, cycles, totalCycles, currentPhase, onComplete])

    useEffect(() => {
        let interval
        if (isActive) {
            interval = setInterval(tick, 1000)
        }
        return () => clearInterval(interval)
    }, [isActive, tick])

    const handleStart = () => {
        setIsActive(true)
    }

    const handlePause = () => {
        setIsActive(false)
    }

    const handleReset = () => {
        setIsActive(false)
        setPhase('inhale')
        setSeconds(4)
        setCycles(0)
    }

    // Calculate scale for breathing animation
    const getScale = () => {
        if (!isActive) return 1
        if (phase === 'inhale') return 1 + (1 - seconds / 4) * 0.3
        if (phase === 'exhale') return 1.3 - (1 - seconds / 4) * 0.3
        return phase === 'hold1' ? 1.3 : 1
    }

    return (
        <div className="breathing-exercise glass-card p-xl text-center">
            <h3 className="text-lg font-display mb-lg text-secondary uppercase tracking-wider">
                Box Breathing
            </h3>

            {/* Breathing Circle */}
            <div className="breathing-visual my-xl flex items-center justify-center">
                <motion.div
                    className="breathing-circle"
                    animate={{
                        scale: getScale(),
                        boxShadow: `0 0 ${isActive ? 40 : 20}px ${currentPhase.color}40`
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ backgroundColor: currentPhase.color + '30', borderColor: currentPhase.color }}
                />
            </div>

            {/* Phase Label & Timer */}
            <div className="phase-info mb-lg">
                <motion.div
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-display"
                    style={{ color: currentPhase.color }}
                >
                    {currentPhase.label}
                </motion.div>
                <div className="text-5xl font-mono font-bold mt-sm text-white">
                    {seconds}
                </div>
            </div>

            {/* Progress */}
            <div className="progress-info text-sm text-secondary mb-lg">
                Cycle {cycles + 1} of {totalCycles}
            </div>

            {/* Controls */}
            <div className="controls flex gap-md justify-center">
                {!isActive ? (
                    <button
                        onClick={handleStart}
                        className="control-btn bg-accent text-black px-xl py-md rounded-full flex items-center gap-sm"
                    >
                        <Play size={20} />
                        <span>Start</span>
                    </button>
                ) : (
                    <button
                        onClick={handlePause}
                        className="control-btn bg-white/10 text-white px-xl py-md rounded-full flex items-center gap-sm"
                    >
                        <Pause size={20} />
                        <span>Pause</span>
                    </button>
                )}
                <button
                    onClick={handleReset}
                    className="control-btn bg-white/5 text-secondary px-md py-md rounded-full border border-white/10"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <style>{`
                .breathing-circle {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    border: 2px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .control-btn { transition: all 0.2s; }
                .control-btn:hover { transform: scale(1.05); }
            `}</style>
        </div>
    )
}
