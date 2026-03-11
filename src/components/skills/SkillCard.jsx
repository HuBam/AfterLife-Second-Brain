import { motion } from 'framer-motion'
import { X, Clock, Users, Zap } from 'lucide-react'
import RankBadge from './RankBadge'

export default function SkillCard({ skill, onClose }) {
    if (!skill) return null

    const progressPercentage = Math.min(100, (skill.hours / 10000) * 100)

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="skill-card-overlay"
            onClick={onClose}
        >
            <div className="skill-card glass-card" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="card-header">
                    <RankBadge rank={skill.rank} size="lg" />
                    <div className="ml-md">
                        <h2 className="text-xl font-display">{skill.title}</h2>
                        <span className="text-secondary text-sm">Class: {skill.category || 'General'}</span>
                    </div>
                </div>

                <div className="card-body mt-lg">
                    <p className="text-secondary mb-lg">{skill.description || "No description provided for this skill node."}</p>

                    <div className="stat-row">
                        <div className="flex items-center gap-sm">
                            <Clock size={16} className="text-accent" />
                            <span>{skill.hours} Hours</span>
                        </div>
                        <div className="flex items-center gap-sm">
                            <Users size={16} className="text-accent" />
                            <span>{skill.rarity || 'Common'}</span>
                        </div>
                    </div>

                    <div className="mastery-progress mt-lg">
                        <div className="flex justify-between text-xs mb-xs">
                            <span>MASTERY PROGRESS</span>
                            <span>{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <span className="text-xs text-muted mt-xs block text-right">Target: 10,000 Hours</span>
                    </div>
                </div>

                <div className="card-footer mt-xl">
                    <button className="btn btn-primary w-full">
                        <Zap size={16} /> Log Practice Session
                    </button>
                </div>
            </div>

            <style>{`
                .skill-card-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                }
                .skill-card {
                    width: 90%;
                    max-width: 400px;
                    border: 1px solid var(--accent-primary);
                    box-shadow: 0 0 30px rgba(0,0,0,0.5);
                    position: relative;
                }
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                }
                .close-btn:hover { color: white; }
                .card-header {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid var(--border-subtle);
                    padding-bottom: 1rem;
                }
                .stat-row {
                    display: flex;
                    gap: 1.5rem;
                    font-family: var(--font-display);
                    font-size: 0.9rem;
                }
                .progress-bar {
                    height: 6px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--accent-primary);
                    box-shadow: 0 0 10px var(--accent-primary);
                }
                .text-accent { color: var(--accent-primary); }
            `}</style>
        </motion.div>
    )
}
