import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Cpu, ChevronDown, ChevronUp, BookOpen, Heart, Activity, Star, Brain, Award } from 'lucide-react'
import { useStore } from '../store/useStore'

// ─── Language Detection ───────────────────────────────────────────────────────
function detectLanguage(text) {
  // Arabic: Unicode range \u0600-\u06FF
  if (/[\u0600-\u06FF]/.test(text)) return 'ar'
  // Spanish: common words and patterns
  const spanishWords = /\b(hola|qué|cómo|estoy|estás|bien|mal|mis|habitos|realms|ayuda|gracias|por favor|quiero|saber|tengo|cuál|cuánto|puedo|hacer|necesito|me|te|él|ella|nosotros|vamos|dime|eres|soy|mucho|poco|hoy|ayer|mañana|balance|salud|nivel|logros|logro)\b/i
  if (spanishWords.test(text)) return 'es'
  return 'en'
}

// ─── Context Builder ──────────────────────────────────────────────────────────
function buildContext(store) {
  const { user, realms, health, getEchoUnderstanding, getRealmInsights } = store
  const understanding = getEchoUnderstanding?.() || { score: 0, breakdown: {} }
  const insights = getRealmInsights?.() || { realmData: [], avgBalance: 0 }

  const totalHabits = user.habits?.length || 0
  const completedTodayHabits = user.habits?.filter(h => {
    const today = new Date().toISOString().split('T')[0]
    return h.completions?.includes(today)
  }).length || 0

  const totalEntries = Object.values(realms).reduce((sum, r) => sum + (r.entries?.length || 0), 0)
  const prayerCount = user.prayerLog?.length || 0
  const totalSymptoms = Object.values(health).reduce((sum, o) => sum + (o.symptoms?.length || 0), 0)
  const realmSummary = Object.entries(realms).map(([k, r]) => `${r.name}: ${r.balance}%`).join(', ')
  const weakest = insights.realmData?.[0]
  const strongest = insights.realmData?.[insights.realmData.length - 1]

  return {
    name: user.name || 'User',
    mbti: user.mbti || null,
    religion: user.religion || null,
    understanding: understanding.score,
    breakdown: understanding.breakdown,
    totalHabits,
    completedTodayHabits,
    totalEntries,
    prayerCount,
    totalSymptoms,
    realmSummary,
    weakest,
    strongest,
    avgBalance: insights.avgBalance || 0,
    streak: user.streak || 0,
    level: Math.floor(totalEntries / 5) + 1,
  }
}

// ─── Intent Detection ─────────────────────────────────────────────────────────
function detectIntent(text, lang) {
  const t = text.toLowerCase()

  const patterns = {
    greeting: /^(hi|hello|hey|yo|sup|hola|مرحبا|السلام|أهلا|salut|buenas|buenos|good morning|good evening|good night)/i,
    habits: /(habit|hábito|عادة|عادات|routine|daily|streak|hoy|discipline|consistency|my habits|my routine)/i,
    health: /(health|salud|صحة|body|cuerpo|جسم|symptom|síntoma|organ|médico|doctor|feeling|pain|sick|illness)/i,
    balance: /(balance|equilibrio|توازن|realm|realms|sync|status|estado|حالة|how am i|how i am|how are my|cómo estoy|كيف أنا|doing|overall|overview|summary|report)/i,
    mind: /(think|thinking|thought|mind|brain|cognitive|learn|study|focus|clarity|mental|cerebra|knowledge|skill|remember|memory|تفكير|عقل|ذاكرة)/i,
    religion: /(pray|prayer|صلاة|rezar|religion|faith|quran|bible|دين|إيمان|iman|salah|dua|spiritual|worship)/i,
    motivation: /(motivat|ánimo|تحفيز|inspire|help me|ayúdame|ساعدني|advice|consejo|نصيحة|improve|better|grow|stronger|push|challenge|goal|focus on|what should)/i,
    level: /(level|nivel|مستوى|xp|progress|progreso|تقدم|rank|logro|achievement|score|point|stat)/i,
    intro: /(who are you|qué eres|من أنت|what can you do|qué puedes|ماذا تستطيع|\/help|commands|capabilities)/i,
  }

  for (const [intent, regex] of Object.entries(patterns)) {
    if (regex.test(t)) return intent
  }
  return 'balance' // default to balance report — more useful than a generic echo
}

// ─── Response Generator ───────────────────────────────────────────────────────
function generateResponse(message, lang, ctx) {
  const intent = detectIntent(message, lang)

  const R = {
    en: {
      greeting: [
        `Neural Link active. Welcome back, ${ctx.name}. Your Echo Understanding is at ${ctx.understanding}%. How can I assist?`,
        `Systems online. ${ctx.name}, your realm balance is ${ctx.avgBalance}% — ${ctx.avgBalance > 60 ? 'looking strong' : 'room to grow'}. What do you need?`,
      ],
      habits: [
        `Habit scan: You have ${ctx.totalHabits} habits tracked. Today: ${ctx.completedTodayHabits}/${ctx.totalHabits} completed. ${ctx.completedTodayHabits === ctx.totalHabits ? '🔥 Perfect day!' : `${ctx.totalHabits - ctx.completedTodayHabits} remaining — push through.`}`,
        `Habit analysis: ${ctx.streak} day streak active. ${ctx.totalHabits} routines in system. ${ctx.completedTodayHabits} done today.`,
      ],
      health: [
        `Health scan: ${ctx.totalSymptoms} symptom(s) logged. ${ctx.totalSymptoms === 0 ? 'No active alerts — systems clear.' : 'Check your Avatar page for details.'} Remember to log any new symptoms.`,
      ],
      balance: [
        `Neural Balance Report:\n${ctx.realmSummary}\n\nOverall: ${ctx.avgBalance}%${ctx.weakest ? `\nWeakest link: ${ctx.weakest.name} (${ctx.weakest.balance}%) — focus here.` : ''}`,
        `Sync at ${ctx.avgBalance}%. ${ctx.strongest ? `${ctx.strongest.name} is your strongest realm at ${ctx.strongest.balance}%.` : ''} ${ctx.weakest ? `${ctx.weakest.name} needs attention.` : 'All realms balanced.'}`,
      ],
      religion: [
        `Spiritual data: ${ctx.prayerCount} prayer(s) logged. ${ctx.religion ? `Faith: ${ctx.religion.charAt(0).toUpperCase() + ctx.religion.slice(1)}.` : 'No religion set.'} Check the Religion page for detailed tracking.`,
      ],
      motivation: [
        `${ctx.name}, you're at Level ${ctx.level} with ${ctx.totalEntries} total entries logged. ${ctx.weakest ? `Your ${ctx.weakest.name} realm needs energy — one entry there would make a difference.` : 'Keep building on your momentum.'}`,
        `Focus on what matters: ${ctx.completedTodayHabits}/${ctx.totalHabits} habits done. ${ctx.weakest ? `${ctx.weakest.name} is your growth edge.` : 'Stay consistent.'} You're building something real.`,
      ],
      level: [
        `Status: Level ${ctx.level} | ${ctx.totalEntries} entries | Echo Understanding: ${ctx.understanding}% | Streak: ${ctx.streak} days.`,
      ],
      mind: [
        `Cerebra scan: ${ctx.totalEntries} total entries logged. Your mental growth lives in that realm — skills, knowledge, insights.\n\n${ctx.weakest?.name === 'Cerebra' ? '⚠️ Cerebra is your weakest realm. Add a skill or insight to strengthen it.' : 'Keep feeding your mind with new entries in Cerebra.'}\n\nTip: The Feynman Technique — teach what you learn to lock it in.`,
        `Brain optimisation: clarity comes from sleep, exercise, and deliberate learning. Log a skill or insight in Cerebra to make progress tangible. Echo Understanding: ${ctx.understanding}%.`,
      ],
      intro: [
        `I am ECHO — your neural interface and second brain.\n\nI can analyze your:\n• Realm balance & entries\n• Habits & streaks\n• Health symptoms\n• Religion & prayer logs\n• Progress & level\n\nJust talk naturally in English, Español, or العربية. Type /help for commands.`,
      ],
      general: [
        `Neural Balance Report:\n${ctx.realmSummary}\n\nOverall: ${ctx.avgBalance}% | Level ${ctx.level} | Echo Understanding: ${ctx.understanding}%${ctx.weakest ? `\n\n→ Focus zone: ${ctx.weakest.name} (${ctx.weakest.balance}%)` : ''}`,
        `Sync status: ${ctx.avgBalance}% | ${ctx.totalHabits} habits | ${ctx.totalEntries} entries\n\n${ctx.weakest ? `Your ${ctx.weakest.name} realm is at ${ctx.weakest.balance}% — log an entry there to grow it.` : 'All realms in balance. Keep building.'}`,
      ],
    },
    es: {
      greeting: [
        `Enlace Neural activo. Bienvenido de nuevo, ${ctx.name}. Tu comprensión de Echo está al ${ctx.understanding}%. ¿En qué puedo ayudarte?`,
        `Sistemas en línea. ${ctx.name}, tu balance es ${ctx.avgBalance}% — ${ctx.avgBalance > 60 ? 'bastante bien' : 'hay margen para crecer'}. ¿Qué necesitas?`,
      ],
      habits: [
        `Análisis de hábitos: Tienes ${ctx.totalHabits} hábitos. Hoy: ${ctx.completedTodayHabits}/${ctx.totalHabits} completados. ${ctx.completedTodayHabits === ctx.totalHabits ? '🔥 ¡Día perfecto!' : `${ctx.totalHabits - ctx.completedTodayHabits} restantes — sigue adelante.`}`,
      ],
      health: [
        `Análisis de salud: ${ctx.totalSymptoms} síntoma(s) registrado(s). ${ctx.totalSymptoms === 0 ? 'Sin alertas activas.' : 'Ve a tu Avatar para más detalles.'}`,
      ],
      balance: [
        `Informe de Balance Neural:\n${ctx.realmSummary}\n\nTotal: ${ctx.avgBalance}%${ctx.weakest ? `\nEstado más débil: ${ctx.weakest.name} (${ctx.weakest.balance}%) — concéntrate aquí.` : ''}`,
      ],
      religion: [
        `Datos espirituales: ${ctx.prayerCount} oración(es) registrada(s). ${ctx.religion ? `Religión: ${ctx.religion}.` : 'Sin religión configurada.'}`,
      ],
      motivation: [
        `${ctx.name}, eres Nivel ${ctx.level} con ${ctx.totalEntries} entradas totales. ${ctx.weakest ? `Tu realm ${ctx.weakest.name} necesita atención.` : 'Sigue construyendo.'}`,
      ],
      level: [
        `Estado: Nivel ${ctx.level} | ${ctx.totalEntries} entradas | Comprensión: ${ctx.understanding}% | Racha: ${ctx.streak} días.`,
      ],
      mind: [
        `Cerebra activo: ${ctx.totalEntries} entradas totales. El crecimiento mental se registra allí — habilidades, conocimiento, perspectivas.\n\nConsejo: la técnica Feynman — enseña lo que aprendes para consolidarlo.`,
      ],
      intro: [
        `Soy ECHO — tu interfaz neural y segundo cerebro.\n\nPuedo analizar:\n• Balance de reinos\n• Hábitos y rachas\n• Síntomas de salud\n• Oraciones y progreso espiritual\n\nHablame en inglés, español o árabe.`,
      ],
      general: [
        `Informe de Balance:\n${ctx.realmSummary}\n\nTotal: ${ctx.avgBalance}% | Nivel ${ctx.level} | Comprensión: ${ctx.understanding}%${ctx.weakest ? `\n\n→ Zona de enfoque: ${ctx.weakest.name} (${ctx.weakest.balance}%)` : ''}`,
      ],
    },
    ar: {
      greeting: [
        `الرابط العصبي نشط. مرحباً بك مجدداً، ${ctx.name}. فهم Echo لديك ${ctx.understanding}%. كيف يمكنني مساعدتك؟`,
      ],
      habits: [
        `تحليل العادات: لديك ${ctx.totalHabits} عادات مسجلة. اليوم: ${ctx.completedTodayHabits}/${ctx.totalHabits} مكتملة. ${ctx.completedTodayHabits === ctx.totalHabits ? '🔥 يوم مثالي!' : `${ctx.totalHabits - ctx.completedTodayHabits} لا تزال متبقية — استمر.`}`,
      ],
      health: [
        `تحليل الصحة: ${ctx.totalSymptoms} عرض(أعراض) مسجل. ${ctx.totalSymptoms === 0 ? 'لا تنبيهات نشطة — كل شيء واضح.' : 'راجع صفحة الأفاتار للتفاصيل.'}`,
      ],
      balance: [
        `تقرير التوازن العصبي:\n${ctx.realmSummary}\n\nالإجمالي: ${ctx.avgBalance}%${ctx.weakest ? `\nأضعف نقطة: ${ctx.weakest.name} (${ctx.weakest.balance}%) — ركز هنا.` : ''}`,
      ],
      religion: [
        `البيانات الروحية: ${ctx.prayerCount} صلاة مسجلة. ${ctx.religion ? `الدين: ${ctx.religion}.` : 'لم يتم تعيين دين.'} راجع صفحة الدين للتفاصيل.`,
      ],
      motivation: [
        `${ctx.name}، أنت في المستوى ${ctx.level} مع ${ctx.totalEntries} إدخال. ${ctx.weakest ? `عالم ${ctx.weakest.name} يحتاج انتباهك.` : 'استمر في البناء.'} أنت تبني شيئاً حقيقياً.`,
      ],
      level: [
        `الحالة: مستوى ${ctx.level} | ${ctx.totalEntries} إدخالات | فهم Echo: ${ctx.understanding}% | التتابع: ${ctx.streak} أيام.`,
      ],
      mind: [
        `تحليل الذهن: ${ctx.totalEntries} إدخالات مسجلة. النمو العقلي يعيش في عالم Cerebra — مهارات، معرفة، رؤى.\n\nنصيحة: علّم ما تتعلمه لتثبيته في الذاكرة.`,
      ],
      intro: [
        `أنا ECHO — واجهتك العصبية وعقلك الثاني.\n\nيمكنني تحليل:\n• توازن عوالمك\n• العادات والتتابعات\n• الأعراض الصحية\n• الصلوات والتقدم الروحي\n\nتحدث معي بالإنجليزية أو الإسبانية أو العربية.`,
      ],
      general: [
        `تقرير التوازن:\n${ctx.realmSummary}\n\nالإجمالي: ${ctx.avgBalance}% | المستوى ${ctx.level} | الفهم: ${ctx.understanding}%${ctx.weakest ? `\n\n→ منطقة التركيز: ${ctx.weakest.name} (${ctx.weakest.balance}%)` : ''}`,
      ],
    },
  }

  const langResponses = R[lang] || R.en
  const intentResponses = langResponses[intent] || langResponses.general
  return intentResponses[Math.floor(Math.random() * intentResponses.length)]
}

// ─── Breakdown Icon Map ───────────────────────────────────────────────────────
const breakdownMeta = {
  realms: { label: 'Realms', icon: Brain },
  habits: { label: 'Habits', icon: Activity },
  health: { label: 'Health', icon: Heart },
  religion: { label: 'Religion', icon: Star },
  personality: { label: 'Personality', icon: BookOpen },
  achievements: { label: 'Achievements', icon: Award },
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Echo() {
  const store = useStore()
  const { echo, addEchoMessage, setEchoTyping, getEchoUnderstanding } = store

  const [input, setInput] = useState('')
  const [isHorizontal, setIsHorizontal] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [understanding, setUnderstanding] = useState({ score: 0, breakdown: {} })
  const messagesEndRef = useRef(null)

  // Update understanding score whenever store changes
  useEffect(() => {
    try {
      const result = getEchoUnderstanding?.() || { score: 0, breakdown: {} }
      setUnderstanding(result)
    } catch (e) {
      setUnderstanding({ score: 0, breakdown: {} })
    }
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [echo.history, echo.isTyping])

  const processMessage = async (msg) => {
    setEchoTyping(true)
    await new Promise(r => setTimeout(r, 500 + Math.random() * 900))

    let response = ''

    // Keep slash commands working
    if (msg.startsWith('/')) {
      const cmd = msg.toLowerCase().trim()
      if (cmd === '/help') {
        response = 'COMMANDS:\n/status — System info\n/analyze — Health scan\n/insights — Balance view\n/suggest — AI recommendations\n\nOr just talk to me in English, Spanish, or Arabic 🌐'
      } else if (cmd === '/status') {
        const ctx = buildContext(store)
        response = `STATUS: ONLINE\nUSER: ${ctx.name.toUpperCase()}\nLEVEL: ${ctx.level}\nSYNC: ${ctx.understanding}%\nBALANCE: ${ctx.avgBalance}%`
      } else if (cmd === '/analyze') {
        const ctx = buildContext(store)
        response = `SCAN COMPLETE\nEntries: ${ctx.totalEntries} | Habits: ${ctx.totalHabits} | Health: ${ctx.totalSymptoms} symptoms\nEcho Understanding: ${ctx.understanding}%`
      } else if (cmd === '/insights') {
        const ctx = buildContext(store)
        response = `REALM BALANCE:\n${Object.entries(store.realms).map(([, r]) => `${r.icon} ${r.name}: ${r.balance}%`).join('\n')}\n\nAvg: ${ctx.avgBalance}%`
      } else if (cmd === '/suggest') {
        const suggestions = store.getSuggestedActions?.() || []
        response = suggestions.length === 0 ? 'Systems nominal. All realms balanced.' : suggestions.map(s => `→ ${s.action}`).join('\n')
      } else {
        response = `Unknown command: ${cmd}\nType /help for a list.`
      }
    } else {
      // Natural language — detect language and generate smart response
      const lang = detectLanguage(msg)
      const ctx = buildContext(store)
      response = generateResponse(msg, lang, ctx)
    }

    setEchoTyping(false)
    addEchoMessage({ role: 'assistant', content: response })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    addEchoMessage({ role: 'user', content: input })
    processMessage(input)
    setInput('')
  }

  const totalSegments = 8
  const filledSegments = Math.round((understanding.score / 100) * totalSegments)

  return (
    <div className="echo-page">
      <Link to="/" className="back-btn">
        <ArrowLeft size={20} />
      </Link>

      <div className="echo-layout">
        {/* AI Avatar */}
        <div className="ai-section">
          <motion.div
            className="ai-avatar"
            animate={echo.isTyping ? {
              scale: [1, 1.05, 1],
              boxShadow: ['0 0 20px rgba(255,107,0,0.3)', '0 0 40px rgba(255,107,0,0.7)', '0 0 20px rgba(255,107,0,0.3)']
            } : {}}
            transition={{ duration: 1.5, repeat: echo.isTyping ? Infinity : 0 }}
          >
            <Cpu size={36} />
          </motion.div>
          <span className="ai-label">ECHO</span>
          <span className="ai-status">{echo.isTyping ? 'Processing...' : 'Online'}</span>
          <span className="ai-lang">EN · ES · AR</span>
        </div>

        {/* Understanding Bar */}
        <div className={`bar-section ${isHorizontal ? 'horizontal' : 'vertical'}`}>
          <div className="bar-header">
            <span className="bar-title">UNDERSTANDING%</span>
            <button className="orientation-toggle" onClick={() => setIsHorizontal(!isHorizontal)}>
              {isHorizontal ? '⬍' : '⬌'}
            </button>
          </div>

          <div className="bar-with-markers">
            <div className="markers-left">
              {[80, 50, 25, 5].map(val => (
                <span key={val} className={`marker ${understanding.score >= val ? 'active' : ''}`}>{val}</span>
              ))}
            </div>

            <div className="bar-track">
              {[...Array(totalSegments)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`bar-segment ${i < filledSegments ? 'filled' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i < filledSegments ? 1 : 0.15 }}
                  transition={{ delay: (totalSegments - 1 - i) * 0.05 }}
                  style={{
                    background: i < filledSegments
                      ? `linear-gradient(${isHorizontal ? 'to right' : 'to top'}, hsl(${15 + i * 5}, 100%, 50%), hsl(${20 + i * 5}, 100%, 55%))`
                      : 'rgba(255,107,0,0.1)'
                  }}
                />
              ))}
            </div>

            <div className="markers-right">
              {[95, 65, 35, 15].map(val => (
                <span key={val} className={`marker ${understanding.score >= val ? 'active' : ''}`}>{val}</span>
              ))}
            </div>
          </div>

          <div className="percent-display">
            <span className="percent-value">{understanding.score}</span>
            <span className="percent-symbol">%</span>
          </div>

          {/* Breakdown toggle */}
          <button className="breakdown-toggle" onClick={() => setShowBreakdown(!showBreakdown)}>
            {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>breakdown</span>
          </button>

          <AnimatePresence>
            {showBreakdown && (
              <motion.div
                className="breakdown-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {Object.entries(understanding.breakdown || {}).map(([key, val]) => {
                  const meta = breakdownMeta[key]
                  if (!meta) return null
                  const IconComp = meta.icon
                  const pct = Math.round((val.score / val.max) * 100)
                  return (
                    <div key={key} className="breakdown-row">
                      <IconComp size={12} className="breakdown-icon" />
                      <span className="breakdown-label">{meta.label}</span>
                      <div className="breakdown-bar">
                        <div className="breakdown-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="breakdown-nums">{val.score}/{val.max}</span>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat */}
      <div className="chat-container">
        <div className="chat-messages">
          {echo.history.length === 0 && (
            <div className="welcome-msg">
              <Cpu size={14} />
              <span>Neural link established. Talk to me in English, Español, or العربية.</span>
            </div>
          )}
          {echo.history.map((msg) => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              {msg.role === 'assistant' && <Cpu size={12} className="msg-icon" />}
              <span className="msg-text">{msg.content}</span>
            </div>
          ))}
          {echo.isTyping && (
            <div className="chat-msg assistant typing">
              <Cpu size={12} className="msg-icon" />
              <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="How am I doing? / ¿Cómo estoy? / كيف أنا؟"
          autoFocus
        />
        <button type="submit" disabled={!input.trim() || echo.isTyping}>
          <Send size={18} />
        </button>
      </form>

      <style>{`
        .echo-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ff6b00;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          display: flex;
          flex-direction: column;
          padding: 16px;
          padding-top: 60px;
        }

        .back-btn {
          position: fixed;
          top: 16px;
          left: 16px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255,107,0,0.4);
          border-radius: 4px;
          color: #ff6b00;
          background: rgba(255,107,0,0.05);
          z-index: 10;
          text-decoration: none;
        }

        .back-btn:hover { background: rgba(255,107,0,0.15); }

        /* Layout */
        .echo-layout {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 12px 10px 20px;
          gap: 32px;
          flex-wrap: wrap;
        }

        /* AI Section */
        .ai-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .ai-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,107,0,0.2), rgba(255,107,0,0.05));
          border: 3px solid #ff6b00;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ai-label {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .ai-status {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
        }

        .ai-lang {
          font-size: 0.6rem;
          color: rgba(255,107,0,0.5);
          letter-spacing: 1px;
          margin-top: 2px;
        }

        /* Bar Section */
        .bar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: all 0.4s ease;
        }

        .bar-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar-title {
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: #ff6b00;
          text-transform: uppercase;
        }

        .orientation-toggle {
          background: rgba(255,107,0,0.1);
          border: 1px solid rgba(255,107,0,0.3);
          border-radius: 4px;
          color: #ff6b00;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.2s;
        }

        .orientation-toggle:hover { background: rgba(255,107,0,0.2); border-color: #ff6b00; }

        .bar-with-markers {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bar-section.horizontal .bar-with-markers { flex-direction: column; }

        .markers-left, .markers-right {
          display: flex;
          flex-direction: column-reverse;
          justify-content: space-between;
          height: 220px;
          width: 22px;
        }

        .bar-section.horizontal .markers-left,
        .bar-section.horizontal .markers-right {
          flex-direction: row;
          height: 22px;
          width: 280px;
        }

        .marker {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.2);
          text-align: center;
          transition: color 0.3s;
        }

        .marker.active { color: #ff6b00; text-shadow: 0 0 8px rgba(255,107,0,0.5); }

        .bar-track {
          display: flex;
          gap: 5px;
          padding: 8px;
          border: 2px solid rgba(255,107,0,0.4);
          background: rgba(255,107,0,0.03);
          transition: all 0.4s ease;
        }

        .bar-section.vertical .bar-track {
          flex-direction: column-reverse;
          width: 120px;
          height: 220px;
        }

        .bar-section.horizontal .bar-track {
          flex-direction: row;
          width: 280px;
          height: 80px;
        }

        .bar-segment {
          flex: 1;
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(255,107,0,0.3);
          transition: all 0.3s ease;
        }

        .bar-segment:not(.filled) { box-shadow: none; }

        .percent-display {
          display: flex;
          align-items: baseline;
          gap: 3px;
        }

        .percent-value {
          font-size: 3rem;
          font-weight: 900;
          color: #ff6b00;
          text-shadow: 0 0 20px rgba(255,107,0,0.6);
          line-height: 1;
        }

        .percent-symbol { font-size: 1.5rem; color: rgba(255,107,0,0.7); }

        /* Breakdown */
        .breakdown-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: rgba(255,107,0,0.5);
          font-size: 0.65rem;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 1px;
          transition: color 0.2s;
        }

        .breakdown-toggle:hover { color: #ff6b00; }

        .breakdown-panel {
          width: 100%;
          max-width: 240px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow: hidden;
          padding-top: 4px;
        }

        .breakdown-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
        }

        .breakdown-icon { color: rgba(255,107,0,0.6); flex-shrink: 0; }

        .breakdown-label {
          width: 72px;
          flex-shrink: 0;
          color: rgba(255,255,255,0.5);
        }

        .breakdown-bar {
          flex: 1;
          height: 4px;
          background: rgba(255,107,0,0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .breakdown-fill {
          height: 100%;
          background: linear-gradient(to right, #ff6b00, #ff9500);
          border-radius: 2px;
          transition: width 0.5s ease;
        }

        .breakdown-nums {
          color: rgba(255,107,0,0.7);
          font-size: 0.6rem;
          width: 28px;
          text-align: right;
          flex-shrink: 0;
        }

        /* Chat */
        .chat-container {
          flex: 1;
          overflow-y: auto;
          border: 1px solid rgba(255,107,0,0.2);
          border-radius: 4px;
          background: rgba(0,0,0,0.4);
          margin-bottom: 12px;
          min-height: 120px;
        }

        .chat-messages {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .welcome-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,107,0,0.5);
          font-size: 0.78rem;
        }

        .chat-msg {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.85rem;
          line-height: 1.6;
        }

        .chat-msg.user {
          justify-content: flex-end;
          color: rgba(255,255,255,0.85);
        }

        .chat-msg.user .msg-text {
          background: rgba(255,255,255,0.07);
          padding: 6px 12px;
          border-radius: 12px 12px 2px 12px;
        }

        .chat-msg.assistant { color: #ff6b00; }

        .msg-icon { flex-shrink: 0; margin-top: 3px; }
        .msg-text { white-space: pre-wrap; max-width: 88%; }

        .chat-msg.typing .dot { animation: blink 1.4s infinite both; }
        .chat-msg.typing .dot:nth-child(2) { animation-delay: 0.2s; }
        .chat-msg.typing .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }

        /* Input */
        .input-form {
          display: flex;
          gap: 8px;
        }

        .input-form input {
          flex: 1;
          background: rgba(255,107,0,0.07);
          border: 2px solid rgba(255,107,0,0.3);
          border-radius: 4px;
          padding: 12px 16px;
          color: #ff6b00;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
        }

        .input-form input::placeholder { color: rgba(255,107,0,0.35); }
        .input-form input:focus { border-color: #ff6b00; box-shadow: 0 0 10px rgba(255,107,0,0.2); }

        .input-form button {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff6b00, #ff9500);
          border: none;
          border-radius: 4px;
          color: #000;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .input-form button:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 0 15px rgba(255,107,0,0.5); }
        .input-form button:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
