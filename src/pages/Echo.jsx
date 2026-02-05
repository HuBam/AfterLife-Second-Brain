import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Cpu, Terminal, Sparkles, Zap, Activity } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function Echo() {
    const { user, echo, addEchoMessage, setEchoTyping, health, realms, getRealmInsights, getSuggestedActions } = useStore()
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [echo.history, echo.isTyping])

    // Intelligent AI Engine - Phase 2 Upgrade
    const processCommand = async (cmd) => {
        const lowerCmd = cmd.toLowerCase().trim()
        let response = ""

        // Simulating processing time
        setEchoTyping(true)
        await new Promise(r => setTimeout(r, 600 + Math.random() * 1000))

        if (lowerCmd.startsWith('/')) {
            // Command Mode
            if (lowerCmd === '/help') {
                response = "AVAILABLE COMMANDS:\n- /status: System diagnostics\n- /analyze: Health & Mind scan\n- /insights: Neural balance analysis\n- /suggest: AI-powered action recommendations\n- /recap: Summary of recent activity\n- /clear: Wipe session memory"
            } else if (lowerCmd === '/status') {
                const { avgBalance } = getRealmInsights()
                response = `SYSTEM STATUS: ONLINE\nUSER: ${user.name.toUpperCase()}\nMODE: ${user.mode.toUpperCase()}\nNEURAL SYNC: ${avgBalance}%\nUPTIME: ${Math.floor((Date.now() - new Date(user.createdAt)) / 86400000)} days`
            } else if (lowerCmd === '/analyze') {
                const symptomCount = Object.values(health).reduce((acc, organ) => acc + organ.symptoms.length, 0)
                const skillCount = realms.cerebra.entries.filter(e => e.type === 'skill').length
                const { avgBalance, weakest, strongest } = getRealmInsights()
                response = `DIAGNOSTIC COMPLETE.\n\nBIOMETRICS:\n- Anomalies: ${symptomCount}\n- Overall Condition: ${symptomCount > 0 ? 'ATTENTION NEEDED' : 'OPTIMAL'}\n\nNEURAL:\n- Active Skills: ${skillCount}\n- Cognitive Load: ${avgBalance > 50 ? 'HIGH' : 'LOW'}\n- Weakest Node: ${weakest.name} (${weakest.balance}%)\n- Strongest Node: ${strongest.name} (${strongest.balance}%)`
            } else if (lowerCmd === '/insights') {
                const { insights, realmData, avgBalance } = getRealmInsights()
                let insightText = `NEURAL BALANCE ANALYSIS\n\nOverall Sync: ${avgBalance}%\n\n`

                // Realm breakdown
                insightText += "REALM STATUS:\n"
                realmData.forEach(r => {
                    const bar = '█'.repeat(Math.floor(r.balance / 10)) + '░'.repeat(10 - Math.floor(r.balance / 10))
                    insightText += `${r.icon} ${r.name}: [${bar}] ${r.balance}%\n`
                })

                if (insights.length > 0) {
                    insightText += "\nALERTS:\n"
                    insights.forEach(i => {
                        insightText += `⚠ ${i.message}\n`
                    })
                } else {
                    insightText += "\n✓ All systems nominal. No critical alerts."
                }

                response = insightText
            } else if (lowerCmd === '/suggest') {
                const suggestions = getSuggestedActions()
                let suggestText = "NEURAL LINK RECOMMENDATIONS\n\n"

                if (suggestions.length === 0) {
                    suggestText += "No suggestions available. Continue current operations."
                } else {
                    suggestions.forEach((s, i) => {
                        suggestText += `[${s.priority.toUpperCase()}] ${s.action}\n→ ${s.reason}\n\n`
                    })
                }

                response = suggestText
            } else if (lowerCmd === '/clear') {
                response = "Memory buffer cleared."
            } else {
                response = `Command '${lowerCmd}' not recognized. Try /help.`
            }
        } else {
            // "Chat" Mode - Intelligent Context-Aware Responses
            const { insights, weakest, avgBalance } = getRealmInsights()

            if (lowerCmd.includes('hello') || lowerCmd.includes('hi')) {
                response = `Greetings, ${user.name}. I am ECHO, your neural interface. Your current sync rate is ${avgBalance}%. How can I assist?`
            } else if (lowerCmd.includes('tired') || lowerCmd.includes('exhausted') || lowerCmd.includes('fatigue')) {
                response = "I detect potential fatigue patterns. Have you logged your biometrics in the Avatar system? Consider checking /insights for a full neural scan."
            } else if (lowerCmd.includes('help') || lowerCmd.includes('what') || lowerCmd.includes('how')) {
                response = `I can analyze your neural patterns and suggest actions. Try:\n- /insights for realm balance analysis\n- /suggest for personalized recommendations\n- /analyze for a full diagnostic`
            } else if (lowerCmd.includes('balance') || lowerCmd.includes('realm')) {
                response = `Current neural balance: ${avgBalance}%.\n${weakest.icon} ${weakest.name} needs the most attention at ${weakest.balance}%. Use /suggest for recommendations.`
            } else {
                // Contextual response based on current state
                if (insights.length > 0) {
                    response = `Data logged. Note: ${insights[0].message}\n\nUse /insights for full analysis.`
                } else {
                    const phrases = [
                        "Input processed. Neural pathways updating.",
                        "Acknowledged. Synchronizing with Second Brain.",
                        `Processing... Your ${weakest.name} could use attention.`,
                        "Data integrated. Maintaining neural coherence.",
                    ]
                    response = phrases[Math.floor(Math.random() * phrases.length)]
                }
            }
        }

        setEchoTyping(false)
        addEchoMessage({ role: 'assistant', content: response })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!input.trim()) return

        // Add User Message
        addEchoMessage({ role: 'user', content: input })

        // Process
        processCommand(input)
        setInput('')
    }

    return (
        <div className="echo-interface">
            <div className="scan-lines" />

            {/* Header */}
            <header className="echo-header">
                <div className="container flex items-center justify-between">
                    <Link to="/" className="text-secondary hover:text-white flex items-center gap-sm transition-colors">
                        <ArrowLeft size={18} />
                        <span className="font-mono text-sm">DISCONNECT</span>
                    </Link>
                    <div className="flex items-center gap-md">
                        <div className="flex items-center gap-xs text-accent">
                            <Cpu size={16} className="animate-pulse" />
                            <span className="font-display tracking-widest text-sm">ECHO v1.0</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="container flex-1 flex flex-col justify-end pb-xl h-[calc(100vh-80px)]">
                <div className="messages-area overflow-y-auto mb-md pr-md space-y-md hide-scrollbar">
                    {/* Welcome / Empty State */}
                    {echo.history.length === 0 && (
                        <div className="text-center opacity-30 py-xl">
                            <Terminal size={48} className="mx-auto mb-md" />
                            <p>INITIALIZING NEURAL LINK...</p>
                        </div>
                    )}

                    {echo.history.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`message-row ${msg.role}`}
                        >
                            <div className="message-bubble">
                                {msg.role === 'assistant' && <div className="message-icon"><Cpu size={14} /></div>}
                                <div className="message-content whitespace-pre-wrap">
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && <div className="message-icon user"><div className="w-2 h-2 bg-white rounded-full" /></div>}
                            </div>
                            <span className="timestamp">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </motion.div>
                    ))}

                    {echo.isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="message-row assistant"
                        >
                            <div className="message-bubble typing">
                                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="input-area glass-card">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter command or message..."
                        className="echo-input"
                        autoFocus
                    />
                    <button type="submit" className="send-btn" disabled={!input.trim() || echo.isTyping}>
                        <Send size={18} />
                    </button>
                </form>

                {/* Suggestions */}
                <div className="suggestions flex gap-sm mt-sm overflow-x-auto hide-scrollbar">
                    {['/insights', '/suggest', '/status', '/analyze', '/help'].map(s => (
                        <button key={s} onClick={() => setInput(s)} className="chip">
                            {s}
                        </button>
                    ))}
                </div>
            </main>

            <style>{`
                .echo-interface {
                    min-height: 100vh;
                    background-color: #050505;
                    color: #cfcfcf;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .scan-lines {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    background-size: 100% 2px, 3px 100%;
                    pointer-events: none;
                    z-index: 0;
                }

                .echo-header {
                    padding: var(--space-md) 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(5, 5, 5, 0.8);
                    z-index: 10;
                }

                .messages-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    z-index: 1;
                    padding-bottom: 1rem;
                }

                .message-row {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    max-width: 80%;
                }

                .message-row.user {
                    align-self: flex-end;
                    align-items: flex-end;
                }

                .message-row.assistant {
                    align-self: flex-start;
                    align-items: flex-start;
                }

                .message-bubble {
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                    font-size: 0.9rem;
                    line-height: 1.5;
                    position: relative;
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }

                .message-row.user .message-bubble {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                    color: white;
                }
                
                .message-row.assistant .message-bubble {
                    border-left: 2px solid var(--accent-primary);
                    color: var(--text-primary);
                }

                .message-icon {
                    margin-top: 4px;
                    color: var(--accent-primary);
                }

                .timestamp {
                    font-size: 0.65rem;
                    opacity: 0.4;
                    margin: 0 4px;
                }

                .input-area {
                    display: flex;
                    align-items: center;
                    padding: 8px;
                    border: 1px solid var(--accent-primary);
                    background: black;
                    z-index: 10;
                }

                .echo-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--accent-primary);
                    font-family: inherit;
                    padding: 8px 16px;
                    outline: none;
                    font-size: 1rem;
                }

                .send-btn {
                    background: var(--accent-primary);
                    color: black;
                    border: none;
                    padding: 8px;
                    border-radius: 2px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.2s;
                }

                .send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .chip {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: var(--text-secondary);
                    padding: 4px 12px;
                    font-size: 0.75rem;
                    border-radius: 100px;
                    cursor: pointer;
                    white-space: nowrap;
                    font-family: var(--font-primary);
                    transition: all 0.2s;
                }

                .chip:hover {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                    background: rgba(255, 255, 255, 0.1);
                }

                .typing .dot {
                    animation: blink 1.4s infinite both;
                }
                .typing .dot:nth-child(2) { animation-delay: 0.2s; }
                .typing .dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes blink {
                    0% { opacity: 0.2; }
                    20% { opacity: 1; }
                    100% { opacity: 0.2; }
                }

                /* Mobile Adjustment */
                @media(max-width: 640px) {
                    .message-row { max-width: 90%; }
                }
            `}</style>
        </div>
    )
}
