export default function RankBadge({ rank, showGlow = true, size = 'md' }) {
    const getSize = () => {
        switch (size) {
            case 'lg': return { fontSize: '2rem', padding: '0.5rem 1rem' }
            case 'sm': return { fontSize: '0.8rem', padding: '0.1rem 0.3rem' }
            default: return { fontSize: '1.2rem', padding: '0.25rem 0.75rem' }
        }
    }

    const getColors = () => {
        switch (rank) {
            case 'SSS': return { text: '#ec4899', glow: '#ec4899', border: '#fce7f3' } // Pink/Rainbow
            case 'SS': return { text: '#a855f7', glow: '#a855f7', border: '#f3e8ff' } // Purple
            case 'S': return { text: '#3b82f6', glow: '#3b82f6', border: '#dbeafe' } // Blue
            case 'A': return { text: '#10b981', glow: '#10b981', border: '#d1fae5' } // Emerald
            case 'B': return { text: '#f59e0b', glow: '#f59e0b', border: '#fef3c7' } // Amber
            case 'C': return { text: '#ef4444', glow: '#ef4444', border: '#fee2e2' } // Red
            default: return { text: '#94a3b8', glow: 'rgba(255,255,255,0.1)', border: '#f1f5f9' } // Gray
        }
    }

    const colors = getColors()
    const dimensions = getSize()

    const isRainbow = rank === 'SSS';

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: '900',
            fontStyle: 'italic',
            color: colors.text,
            border: `2px solid ${colors.border}`,
            background: `rgba(0,0,0,0.4)`,
            boxShadow: showGlow ? `0 0 10px ${colors.glow}, inset 0 0 5px ${colors.glow}` : 'none',
            textShadow: showGlow ? `0 0 5px ${colors.glow}` : 'none',
            transform: 'skew(-10deg)',
            ...dimensions,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {isRainbow && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: 'shine 2s infinite',
                    pointerEvents: 'none'
                }} />
            )}
            {rank}
            <style>{`
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    )
}
