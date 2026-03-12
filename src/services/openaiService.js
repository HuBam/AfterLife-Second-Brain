/**
 * OpenAI Service for Echo AI
 * Provides smart contextual responses when API key is configured.
 * Falls back gracefully to local rule-based logic if no key is set.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

/**
 * Build the system prompt from the user's app context
 */
function buildSystemPrompt(ctx) {
    return `You are ECHO — a cybernetic AI second brain interface inside a personal self-optimization app called AfterLife.

You are speaking to ${ctx.name}. Here is their current data:
- MBTI: ${ctx.mbti || 'unknown'}
- Religion: ${ctx.religion || 'not set'}
- Echo Understanding: ${ctx.understanding}%
- Realm Balance: ${ctx.realmSummary}
- Overall balance: ${ctx.avgBalance}%
- Habits today: ${ctx.completedTodayHabits}/${ctx.totalHabits} completed
- Prayer logs: ${ctx.prayerCount}
- Health symptoms: ${ctx.totalSymptoms}
- Streak: ${ctx.streak} days
- Level: ${ctx.level}
- Weakest realm: ${ctx.weakest ? `${ctx.weakest.name} at ${ctx.weakest.balance}%` : 'none'}
- Strongest realm: ${ctx.strongest ? `${ctx.strongest.name} at ${ctx.strongest.balance}%` : 'none'}

Your role: Analyze their data, give sharp, intelligent, cyberpunk-style advice. Be concise (2–4 sentences max). Reference their actual data. Sound like a neural interface, not a chatbot. Respond in the same language the user writes in (English, Arabic, or Spanish).`
}

/**
 * Call Echo AI via OpenAI API with full context
 * Returns null if no API key or if request fails (triggers fallback)
 * @param {string} userMessage
 * @param {object} ctx - Built context from buildContext()
 * @returns {Promise<string|null>}
 */
export async function callEcho(userMessage, ctx) {
    if (!OPENAI_API_KEY) return null

    try {
        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 200,
                temperature: 0.75,
                messages: [
                    { role: 'system', content: buildSystemPrompt(ctx) },
                    { role: 'user', content: userMessage },
                ],
            }),
        })

        if (!response.ok) return null

        const data = await response.json()
        return data.choices?.[0]?.message?.content?.trim() || null
    } catch {
        return null
    }
}

/**
 * Analyze Empyra mood entries to detect a trend
 * Works fully locally — no API needed
 * @param {Array} moodEntries - Array of mood entries from Empyra realm
 * @returns {{ trend: 'positive'|'negative'|'declining'|'stable'|'insufficient', label: string, color: string }}
 */
export function analyzeMoodTrend(moodEntries) {
    if (!moodEntries || moodEntries.length < 3) {
        return { trend: 'insufficient', label: 'Not enough mood data', color: '#6b7280' }
    }

    // Score keywords in mood entry titles/descriptions
    const positiveWords = /\b(happy|great|good|amazing|productive|motivated|peaceful|grateful|joy|excited|calm|focused|strong|energized|content|cheerful|hopeful|positive|blessed|accomplished)\b/i
    const negativeWords = /\b(sad|angry|anxious|stressed|tired|exhausted|overwhelmed|depressed|lost|frustrated|hopeless|worthless|empty|lonely|scared|worried|down|bad|terrible|awful|numb)\b/i

    const last10 = moodEntries.slice(0, 10)
    const scores = last10.map(entry => {
        const text = `${entry.title || ''} ${entry.description || ''} ${entry.content || ''}`
        const pos = (text.match(positiveWords) || []).length
        const neg = (text.match(negativeWords) || []).length
        return pos - neg
    })

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length

    // Check for declining trend (recent entries worse than older ones)
    const recentHalf = scores.slice(0, Math.floor(scores.length / 2))
    const olderHalf = scores.slice(Math.floor(scores.length / 2))
    const recentAvg = recentHalf.reduce((a, b) => a + b, 0) / recentHalf.length
    const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length
    const isDeclining = olderAvg > 0.5 && recentAvg < olderAvg - 0.5

    if (isDeclining) return { trend: 'declining', label: 'Mood declining', color: '#f59e0b' }
    if (avgScore > 0.5) return { trend: 'positive', label: 'Mood positive', color: '#22c55e' }
    if (avgScore < -0.5) return { trend: 'negative', label: 'Mood low', color: '#ef4444' }
    return { trend: 'stable', label: 'Mood stable', color: '#6b7280' }
}
