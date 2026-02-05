import React, { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import RankBadge from '../components/skills/RankBadge'
import SkillCard from '../components/skills/SkillCard'

export default function Constellation() {
    const { user, realms, addRealmEntry } = useStore()
    const [selectedSkill, setSelectedSkill] = useState(null)
    const [constraints, setConstraints] = useState({ left: -2000, right: 2000, top: -2000, bottom: 2000 })
    const [synapseMode, setSynapseMode] = useState(false) // Phase 4: Cross-realm connections
    const containerRef = useRef(null)

    // Get all entries from multiple realms for the knowledge graph
    const allEntries = useMemo(() => {
        const entries = []

        // Cerebra skills
        realms.cerebra.entries
            .filter(e => e.type === 'skill')
            .forEach(s => entries.push({
                ...s,
                realm: 'cerebra',
                realmColor: realms.cerebra.color,
                realmIcon: realms.cerebra.icon,
                rank: useStore.getState().calculateRank(s.hours || 0)
            }))

        // Elysia projects (for cross-realm linking)
        if (synapseMode) {
            realms.elysia.entries
                .filter(e => e.type === 'project' || e.type === 'idea')
                .forEach(e => entries.push({
                    ...e,
                    realm: 'elysia',
                    realmColor: realms.elysia.color,
                    realmIcon: realms.elysia.icon,
                    rank: e.type === 'project' ? 'A' : 'B'
                }))

            // Sanctum purpose entries
            realms.sanctum.entries
                .filter(e => e.type === 'purpose')
                .forEach(e => entries.push({
                    ...e,
                    realm: 'sanctum',
                    realmColor: realms.sanctum.color,
                    realmIcon: realms.sanctum.icon,
                    rank: 'S'
                }))
        }

        return entries
    }, [realms, synapseMode])

    // Generate Layout: Concentric Circles based on Rank/Tier
    // Core Self -> SSS -> SS -> S -> A -> B -> C -> D -> F
    const nodes = useMemo(() => {
        const layout = []

        // Center Node: User Core
        layout.push({ id: 'core', type: 'core', x: 0, y: 0, title: 'SELF' })

        // Group by rank
        const rankGroups = { SSS: [], SS: [], S: [], A: [], B: [], C: [], D: [], F: [] }
        allEntries.forEach(entry => {
            const rank = entry.rank || 'F'
            if (rankGroups[rank]) rankGroups[rank].push(entry)
            else rankGroups['F'].push(entry)
        })

        // Placement Configuration
        const tiers = [
            { rank: 'SSS', radius: 150 },
            { rank: 'SS', radius: 300 },
            { rank: 'S', radius: 450 },
            { rank: 'A', radius: 600 },
            { rank: 'B', radius: 750 },
            { rank: 'C', radius: 900 },
            { rank: 'D', radius: 1050 },
            { rank: 'F', radius: 1200 },
        ]

        tiers.forEach((tier) => {
            const group = rankGroups[tier.rank]
            if (group.length === 0) return

            const angleStep = (2 * Math.PI) / group.length
            group.forEach((entry, index) => {
                const angle = index * angleStep + (Math.random() * 0.2 - 0.1) // Slight randomization for organic feel
                layout.push({
                    ...entry,
                    x: Math.cos(angle) * tier.radius,
                    y: Math.sin(angle) * tier.radius,
                    type: entry.realm === 'cerebra' ? 'skill' : 'cross-realm'
                })
            })
        })

        return layout
    }, [allEntries])

    return (
        <div className="constellation-wrapper">
            {/* Fixed UI Overlay */}
            <div className="ui-overlay" style={{ pointerEvents: 'none' }}>
                <div className="container flex items-center justify-between pointer-events-auto pt-md">
                    <Link to="/cerebra" className="flex items-center gap-sm text-secondary hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span>RETURN TO CEREBRA</span>
                    </Link>
                    <div className="flex items-center gap-md">
                        {/* Synapse Mode Toggle */}
                        <button
                            onClick={() => setSynapseMode(!synapseMode)}
                            className={`flex items-center gap-xs px-md py-xs rounded border transition-all ${synapseMode
                                    ? 'bg-accent text-black border-accent'
                                    : 'bg-transparent text-secondary border-white/20 hover:border-white/50'
                                }`}
                        >
                            <Zap size={14} />
                            <span className="text-xs uppercase tracking-wider">Synapse</span>
                        </button>
                        <div className="rank-legend flex gap-xs">
                            {['SSS', 'SS', 'S', 'A', 'B', 'C', 'D', 'F'].map(r => (
                                <span key={r} className={`legend-badge rank-${r}`}>{r}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Infinite Canvas */}
            <motion.div
                ref={containerRef}
                className="infinite-canvas"
                drag
                dragConstraints={constraints}
                dragElastic={0.1}
                whileTap={{ cursor: "grabbing" }}
            >
                <div className="center-marker" />

                <svg className="connections-layer">
                    {/* Draw connections from Core to first available tier */}
                    {nodes.filter(n => n.type === 'skill').map(node => (
                        <line
                            key={`con-core-${node.id}`}
                            x1={0} y1={0}
                            x2={node.x} y2={node.y}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    ))}
                    {/* Future: Draw specific node-to-node connections based on data */}
                </svg>

                {nodes.map(node => (
                    <motion.div
                        key={node.id}
                        className={`node ${node.type}-node`}
                        style={{ x: node.x, y: node.y }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: Math.random() * 0.5 }}
                        onClick={() => node.type === 'skill' && setSelectedSkill(node)}
                    >
                        {node.type === 'core' ? (
                            <div className="core-node-inner">
                                <div className="pulse-ring" />
                                <span>{user.name?.[0] || 'OP'}</span>
                            </div>
                        ) : (
                            <div className="skill-node-inner">
                                <RankBadge rank={node.rank} size="sm" showGlow={false} />
                                <span className="node-label">{node.title}</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Skill Detail Card Overlay */}
            <SkillCard skill={selectedSkill} onClose={() => setSelectedSkill(null)} />

            {/* Add New Skill Button (Fixed Bottom Right) */}
            <div className="fixed bottom-lg right-lg pointer-events-auto">
                <button
                    className="btn-circle btn-primary"
                    onClick={() => {
                        const title = prompt("Enter new skill name:")
                        if (title) {
                            addRealmEntry('cerebra', {
                                type: 'skill',
                                title,
                                description: 'New skill initialization...',
                                hours: 0
                            })
                        }
                    }}
                >
                    <Plus size={24} />
                </button>
            </div>


            <style>{`
                .constellation-wrapper { width: 100vw; height: 100vh; overflow: hidden; background: radial-gradient(circle at center, #1a1b26 0%, #000 100%); position: relative; }
                .ui-overlay { position: absolute; top: 0; left: 0; right: 0; z-index: 50; }
                .infinite-canvas { width: 100%; height: 100%; cursor: grab; display: flex; align-items: center; justify-content: center; position: absolute; top: 0; left: 0; transform-origin: center; }
                .center-marker { position: absolute; width: 2px; height: 2px; background: transparent; }
                .connections-layer { position: absolute; top: 50%; left: 50%; width: 0; height: 0; overflow: visible; pointer-events: none; }
                .node { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); cursor: pointer; z-index: 10; }
                .node:hover { z-index: 20; }

                .core-node-inner { width: 60px; height: 60px; border-radius: 50%; background: white; color: black; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; box-shadow: 0 0 30px white; position: relative; }
                .pulse-ring { position: absolute; inset: -20px; border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; animation: pulse 3s infinite; }
                
                .skill-node-inner { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; transition: transform 0.2s; }
                .skill-node-inner:hover { transform: scale(1.1); }

                .node-label { font-size: 0.75rem; color: rgba(255,255,255,0.7); text-shadow: 0 0 2px black; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; white-space: nowrap; }

                .legend-badge { font-family: var(--font-display); font-weight: bold; font-size: 0.75rem; padding: 2px 6px; background: rgba(255,255,255,0.1); border-radius: 4px; color: rgba(255,255,255,0.5); }
                .rank-SSS { color: #ec4899; border: 1px solid #ec4899; }
                .rank-SS { color: #a855f7; }
                .rank-S { color: #3b82f6; }

                .btn-circle { width: 56px; height: 56px; border-radius: 50%; border: none; background: var(--accent-primary); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 0 20px var(--accent-primary); transition: transform 0.2s; }
                .btn-circle:hover { transform: scale(1.1); }

                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    )
}
