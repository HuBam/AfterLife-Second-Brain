import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * PulseGraph - Animated SVG visualization component
 * Displays activity data as an animated bar/pulse chart
 * 
 * @param {Object[]} data - Array of { label, value, color } objects
 * @param {number} maxValue - Maximum value for scaling (default: 100)
 * @param {string} height - CSS height (default: '120px')
 * @param {boolean} showLabels - Whether to show labels below bars
 * @param {string} variant - 'bars' | 'pulse' | 'heatmap'
 */
export default function PulseGraph({
    data = [],
    maxValue = 100,
    height = '120px',
    showLabels = true,
    variant = 'bars'
}) {
    const normalizedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            normalized: Math.min(1, (item.value || 0) / maxValue)
        }))
    }, [data, maxValue])

    if (variant === 'heatmap') {
        return (
            <div className="pulse-graph-heatmap" style={{ height }}>
                <div className="heatmap-grid">
                    {normalizedData.map((item, i) => (
                        <motion.div
                            key={i}
                            className="heatmap-cell"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                backgroundColor: item.color || '#ff6b00',
                                opacity: 0.2 + item.normalized * 0.8
                            }}
                            title={`${item.label}: ${item.value}`}
                        />
                    ))}
                </div>
                <style>{`
                    .pulse-graph-heatmap { width: 100%; }
                    .heatmap-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; height: 100%; }
                    .heatmap-cell { border-radius: 2px; min-height: 12px; cursor: pointer; transition: transform 0.2s; }
                    .heatmap-cell:hover { transform: scale(1.1); }
                `}</style>
            </div>
        )
    }

    return (
        <div className="pulse-graph" style={{ height }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${normalizedData.length * 40} 100`} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ff6b00" stopOpacity="0.2" />
                    </linearGradient>
                    <filter id="pulseGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feFlood floodColor="#ff6b00" floodOpacity="0.5" result="flood" />
                        <feComposite in="flood" in2="blur" operator="in" result="glow" />
                        <feMerge>
                            <feMergeNode in="glow" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {normalizedData.map((item, i) => {
                    const barHeight = item.normalized * 80
                    const x = i * 40 + 10
                    const y = 90 - barHeight

                    return (
                        <motion.g key={i}>
                            <motion.rect
                                x={x}
                                y={y}
                                width="20"
                                height={barHeight}
                                rx="2"
                                fill={item.color || 'url(#pulseGradient)'}
                                filter="url(#pulseGlow)"
                                initial={{ height: 0, y: 90 }}
                                animate={{ height: barHeight, y }}
                                transition={{
                                    duration: 0.6,
                                    delay: i * 0.1,
                                    type: 'spring',
                                    stiffness: 100
                                }}
                            />
                            {variant === 'pulse' && (
                                <motion.circle
                                    cx={x + 10}
                                    cy={y}
                                    r="4"
                                    fill="#fff"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 + 0.4 }}
                                />
                            )}
                        </motion.g>
                    )
                })}

                {/* Baseline */}
                <line x1="0" y1="90" x2="100%" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>

            {showLabels && (
                <div className="pulse-labels">
                    {normalizedData.map((item, i) => (
                        <span key={i} className="pulse-label" style={{ color: item.color }}>
                            {item.label}
                        </span>
                    ))}
                </div>
            )}

            <style>{`
                .pulse-graph { position: relative; width: 100%; }
                .pulse-graph svg { display: block; }
                .pulse-labels { display: flex; justify-content: space-around; margin-top: 8px; }
                .pulse-label { font-size: 0.65rem; opacity: 0.7; text-align: center; flex: 1; }
            `}</style>
        </div>
    )
}
