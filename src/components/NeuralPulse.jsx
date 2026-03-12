import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, X, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Link } from 'react-router-dom'

/**
 * NeuralPulse — proactive Echo AI notification widget
 * Floats on the Dashboard, appears when Echo has a suggestion.
 * Dismissible per session.
 */
export default function NeuralPulse() {
    const { neuralPulse, setNeuralPulse } = useStore()

    const pulse = neuralPulse || {}
    const isVisible = !!pulse.message

    const priorityColors = {
        high: { border: '#ef4444', glow: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.08)', dot: '#ef4444' },
        warning: { border: '#f59e0b', glow: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.08)', dot: '#f59e0b' },
        low: { border: '#4a9eff', glow: 'rgba(74,158,255,0.35)', bg: 'rgba(74,158,255,0.07)', dot: '#4a9eff' },
    }
    const colors = priorityColors[pulse.priority] || priorityColors.low

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="neural-pulse-card"
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    style={{
                        borderColor: colors.border,
                        background: colors.bg,
                        boxShadow: `0 0 18px ${colors.glow}`,
                    }}
                >
                    {/* Header */}
                    <div className="pulse-header">
                        <div className="pulse-title-row">
                            <motion.div
                                className="pulse-dot"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.6, repeat: Infinity }}
                                style={{ background: colors.dot }}
                            />
                            <Cpu size={12} style={{ color: colors.dot }} />
                            <span className="pulse-label" style={{ color: colors.dot }}>ECHO PULSE</span>
                        </div>
                        <button
                            className="pulse-dismiss"
                            onClick={() => setNeuralPulse({ message: null })}
                            aria-label="Dismiss"
                        >
                            <X size={13} />
                        </button>
                    </div>

                    {/* Message */}
                    <p className="pulse-message">{pulse.message}</p>

                    {/* Action link */}
                    {pulse.linkTo && (
                        <Link
                            to={pulse.linkTo}
                            className="pulse-action"
                            style={{ color: colors.dot, borderColor: colors.border }}
                            onClick={() => setNeuralPulse({ message: null })}
                        >
                            <span>{pulse.linkLabel || 'View'}</span>
                            <ArrowRight size={12} />
                        </Link>
                    )}
                </motion.div>
            )}

            <style>{`
        .neural-pulse-card {
          position: fixed;
          bottom: 88px;
          left: 16px;
          right: 16px;
          max-width: 440px;
          margin: 0 auto;
          border: 1px solid;
          border-radius: 10px;
          padding: 12px 14px;
          z-index: 90;
          backdrop-filter: blur(12px);
        }

        .pulse-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .pulse-title-row {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .pulse-label {
          font-size: 0.6rem;
          letter-spacing: 2px;
          font-family: var(--font-mono, monospace);
          font-weight: 700;
        }

        .pulse-dismiss {
          background: none;
          border: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .pulse-dismiss:hover {
          color: rgba(255,255,255,0.8);
        }

        .pulse-message {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.85);
          line-height: 1.5;
          margin: 0 0 8px 0;
        }

        .pulse-action {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          border: 1px solid;
          border-radius: 5px;
          padding: 4px 10px;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: opacity 0.2s;
        }

        .pulse-action:hover {
          opacity: 0.75;
        }
      `}</style>
        </AnimatePresence>
    )
}
