import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Initial user state
const initialUser = {
    name: '',
    age: null,
    birthDate: null,
    birthTime: null, // Optional: "HH:MM" format for exact age calculation
    mbti: '',
    mbtiScores: null, // { E: 70, I: 30, S: 40, N: 60, ... }
    mode: 'basic', // 'basic' or 'advanced'
    theme: 'cyber', // Theme color scheme
    font: 'default', // 'default', 'fantasy', 'pixel', 'stray', 'minimal'
    gender: null, // 'male', 'female', 'non-binary', 'skip'
    questionAnswers: {}, // Answers to achievement questions
    habits: [], // Habit tracking data
    createdAt: null,
    onboarded: false,
    lifeExpectancy: 80, // Default years

    // Religion & Spirituality
    religion: null, // 'islam', 'christianity', 'judaism', 'atheist', 'other', etc.
    customReligion: '', // If religion === 'other'
    prayerLog: [], // Array of { id, type, religion, completedAt, notes }
    scriptureProgress: {
        // Quran tracking
        quran: {
            mode: 'juz', // 'pages', 'juz', 'surah'
            currentPage: 0,
            currentJuz: 0,
            completedSurahs: [],
            khatmCount: 0, // Full completions
            lastRead: null,
            goal: null, // { type: 'days'|'months'|'year', value: 30, startDate, dailyAmount }
            streak: 0,
        },
        // Bible tracking
        bible: {
            completedChapters: [],
            currentBook: null,
            lastRead: null,
            goal: null,
            streak: 0,
        },
        // Torah tracking
        torah: {
            currentParsha: null,
            completedParshas: [],
            lastRead: null,
            streak: 0,
        }
    },
    spiritualSettings: {
        showReligionWidget: true,
        showOtherReligionsCalendar: {}, // { christianity: true, judaism: false, ... }
        showCommunityStats: false,
        anonymousCommunityStats: true,
    },

    // Identity & Personality Expansion
    mbtiVariant: null, // 'A' (Assertive) or 'T' (Turbulent)
    enneagram: null, // 1-9
    spiritAnimal: null,
    quotientsHistory: {
        iq: [], // Array of { value, timestamp }
        eq: [],
        aq: [],
        tq: [],
        sq: [],
    },
    westernZodiac: null,
    chineseZodiac: null,

    // Prayer Times API Data
    prayerTimesData: null, // { timings: {...}, date: {...}, meta: {...} }
    qiblaDirection: null, // Degrees from North
    userLocation: null, // { city, country, latitude, longitude, calculationMethod }
    prayerTimesLoading: false,
    prayerTimesError: null,
}

// Initial realm data
const initialRealms = {
    cerebra: {
        name: 'Cerebra',
        subtitle: 'Mind',
        description: 'Skills, Knowledge, IQ',
        color: '#3b82f6',
        icon: '🧠',
        balance: 0,
        entries: [],
        skills: [],
    },
    elysia: {
        name: 'Elysia',
        subtitle: 'Create',
        description: 'Creative Work, Brainstorming, TQ',
        color: '#f59e0b',
        icon: '✨',
        balance: 0,
        entries: [],
        projects: [],
    },
    empyra: {
        name: 'Empyra',
        subtitle: 'Emotion',
        description: 'Social History, EQ, Mood',
        color: '#ec4899',
        icon: '💗',
        balance: 0,
        entries: [],
        relationships: [],
        moods: [],
    },
    oblivion: {
        name: 'Oblivion',
        subtitle: 'Adversity',
        description: 'Stress Data, Discipline, AQ',
        color: '#6b7280',
        icon: '⚔️',
        balance: 0,
        entries: [],
        challenges: [],
    },
    sanctum: {
        name: 'Sanctum',
        subtitle: 'Spirit',
        description: 'Faith Logs, Meaning, SQ',
        color: '#8b5cf6',
        icon: '🌟',
        balance: 0,
        entries: [],
        reflections: [],
    },
}

// Initial health/organ data
const initialHealth = {
    brain: {
        name: 'Brain',
        icon: '🧠',
        doctor: 'Neurologist / Psychiatrist',
        color: '#a855f7',
        symptoms: [],
        records: [],
        prompts: ['Sleep quality?', 'Focus issues?', 'Anxiety patterns?', 'Memory concerns?'],
    },
    heart: {
        name: 'Heart',
        icon: '❤️',
        doctor: 'Cardiologist',
        color: '#ef4444',
        symptoms: [],
        records: [],
        prompts: ['Heart rate concerns?', 'Chest pain?', 'Blood pressure?', 'Exercise tolerance?'],
    },
    lungs: {
        name: 'Lungs',
        icon: '🫁',
        doctor: 'Pulmonologist',
        color: '#06b6d4',
        symptoms: [],
        records: [],
        prompts: ['Breathing issues?', 'Coughing?', 'Shortness of breath?', 'Allergies?'],
    },
    liver: {
        name: 'Liver',
        icon: '🫀',
        doctor: 'Hepatologist / Gastroenterologist',
        color: '#84cc16',
        symptoms: [],
        records: [],
        prompts: ['Digestion issues?', 'Fatigue?', 'Appetite changes?', 'Alcohol consumption?'],
    },
    kidneys: {
        name: 'Kidneys',
        icon: '🫘',
        doctor: 'Nephrologist',
        color: '#f97316',
        symptoms: [],
        records: [],
        prompts: ['Urination frequency?', 'Back pain?', 'Water intake?', 'Swelling?'],
    },
    stomach: {
        name: 'Stomach',
        icon: '🔴',
        doctor: 'Gastroenterologist',
        color: '#eab308',
        symptoms: [],
        records: [],
        prompts: ['Digestive issues?', 'Nausea?', 'Diet concerns?', 'Acid reflux?'],
    },
    bones: {
        name: 'Bones & Joints',
        icon: '🦴',
        doctor: 'Orthopedist / Rheumatologist',
        color: '#f5f5f4',
        symptoms: [],
        records: [],
        prompts: ['Joint pain?', 'Mobility issues?', 'Past injuries?', 'Bone density?'],
    },
    blood: {
        name: 'Blood',
        icon: '🩸',
        doctor: 'Hematologist',
        color: '#dc2626',
        symptoms: [],
        records: [],
        prompts: ['Fatigue?', 'Bruising easily?', 'Bleeding issues?', 'Iron levels?'],
    },
}

export const useStore = create(
    persist(
        (set, get) => ({
            // User State
            user: initialUser,

            // Realms State
            realms: initialRealms,

            // Health State
            health: initialHealth,

            // ECHO AI State
            echo: {
                history: [
                    { id: 'init-1', role: 'assistant', content: 'Neural Link established. I am ECHO, your second brain interface. How can I assist you today?', timestamp: new Date().toISOString() }
                ],
                isTyping: false,
            },

            // Actions - User
            setUser: (userData) => set((state) => ({
                user: { ...state.user, ...userData }
            })),

            completeOnboarding: (userData) => set((state) => ({
                user: {
                    ...state.user,
                    ...userData,
                    onboarded: true,
                    createdAt: new Date().toISOString(),
                }
            })),

            toggleMode: () => set((state) => ({
                user: {
                    ...state.user,
                    mode: state.user.mode === 'basic' ? 'advanced' : 'basic'
                }
            })),

            setFont: (font) => set((state) => ({
                user: { ...state.user, font }
            })),

            setGender: (gender) => set((state) => ({
                user: { ...state.user, gender }
            })),

            setMBTIVariant: (variant) => set((state) => ({
                user: { ...state.user, mbtiVariant: variant }
            })),

            setEnneagram: (type) => set((state) => ({
                user: { ...state.user, enneagram: type }
            })),

            setSpiritAnimal: (animal) => set((state) => ({
                user: { ...state.user, spiritAnimal: animal }
            })),

            logQuotient: (type, value) => set((state) => ({
                user: {
                    ...state.user,
                    quotientsHistory: {
                        ...state.user.quotientsHistory,
                        [type]: [
                            ...state.user.quotientsHistory[type],
                            { value, timestamp: new Date().toISOString() }
                        ]
                    }
                }
            })),

            // Actions - Religion & Spirituality
            setReligion: (religion, customReligion = '') => set((state) => ({
                user: {
                    ...state.user,
                    religion,
                    customReligion: religion === 'other' ? customReligion : '',
                }
            })),

            logPrayer: (prayerType, notes = '') => set((state) => ({
                user: {
                    ...state.user,
                    prayerLog: [
                        {
                            id: `prayer-${Date.now()}`,
                            type: prayerType,
                            religion: state.user.religion,
                            completedAt: new Date().toISOString(),
                            notes,
                        },
                        ...state.user.prayerLog,
                    ],
                }
            })),

            updateScriptureProgress: (scripture, updates) => set((state) => ({
                user: {
                    ...state.user,
                    scriptureProgress: {
                        ...state.user.scriptureProgress,
                        [scripture]: {
                            ...state.user.scriptureProgress[scripture],
                            ...updates,
                            lastRead: new Date().toISOString(),
                        },
                    },
                }
            })),

            setScriptureGoal: (scripture, goalType, goalValue) => set((state) => {
                const totalUnits = scripture === 'quran'
                    ? (state.user.scriptureProgress.quran.mode === 'pages' ? 604 : state.user.scriptureProgress.quran.mode === 'juz' ? 30 : 114)
                    : 100 // Default for other scriptures

                const days = goalType === 'days' ? goalValue : goalType === 'months' ? goalValue * 30 : 365
                const dailyAmount = Math.ceil(totalUnits / days)

                return {
                    user: {
                        ...state.user,
                        scriptureProgress: {
                            ...state.user.scriptureProgress,
                            [scripture]: {
                                ...state.user.scriptureProgress[scripture],
                                goal: {
                                    type: goalType,
                                    value: goalValue,
                                    startDate: new Date().toISOString(),
                                    dailyAmount,
                                    totalUnits,
                                },
                            },
                        },
                    }
                }
            }),

            incrementKhatmCount: (scripture) => set((state) => ({
                user: {
                    ...state.user,
                    scriptureProgress: {
                        ...state.user.scriptureProgress,
                        [scripture]: {
                            ...state.user.scriptureProgress[scripture],
                            khatmCount: (state.user.scriptureProgress[scripture]?.khatmCount || 0) + 1,
                        },
                    },
                }
            })),

            updateSpiritualSettings: (settings) => set((state) => ({
                user: {
                    ...state.user,
                    spiritualSettings: {
                        ...state.user.spiritualSettings,
                        ...settings,
                    },
                }
            })),

            // Actions - Prayer Times API
            setPrayerTimesData: (data) => set((state) => ({
                user: {
                    ...state.user,
                    prayerTimesData: data,
                    prayerTimesLoading: false,
                    prayerTimesError: null,
                }
            })),

            setQiblaDirection: (direction) => set((state) => ({
                user: {
                    ...state.user,
                    qiblaDirection: direction,
                }
            })),

            setUserLocation: (location) => set((state) => ({
                user: {
                    ...state.user,
                    userLocation: location,
                }
            })),

            setPrayerTimesLoading: (loading) => set((state) => ({
                user: {
                    ...state.user,
                    prayerTimesLoading: loading,
                }
            })),

            setPrayerTimesError: (error) => set((state) => ({
                user: {
                    ...state.user,
                    prayerTimesError: error,
                    prayerTimesLoading: false,
                }
            })),

            updateRealmBalance: (realmKey, balance) => set((state) => ({
                realms: {
                    ...state.realms,
                    [realmKey]: {
                        ...state.realms[realmKey],
                        balance: Math.min(100, Math.max(0, balance)),
                    }
                }
            })),

            // Helper: Calculate Rank
            calculateRank: (hours) => {
                if (hours >= 10000) return 'SSS'
                if (hours >= 5000) return 'SS'
                if (hours >= 2500) return 'S'
                if (hours >= 1000) return 'A'
                if (hours >= 500) return 'B'
                if (hours >= 100) return 'C'
                if (hours >= 20) return 'D'
                return 'F'
            },

            addRealmEntry: (realmKey, entry) => set((state) => {
                // If it's a skill, calculate initial rank
                const enhancedEntry = { ...entry }
                if (entry.type === 'skill') {
                    enhancedEntry.hours = entry.hours || 0
                    enhancedEntry.rank = get().calculateRank(entry.hours || 0)
                    enhancedEntry.connections = entry.connections || []
                    enhancedEntry.rarity = 'Common' // default
                }

                // Dynamic Balance Engine: auto-calculate balance boost
                const currentRealm = state.realms[realmKey]
                const entryCount = currentRealm.entries.length + 1 // +1 for the new one
                const weight = get().getEntryWeight(entry.type)
                // Logarithmic diminishing returns: big boost early, smaller later
                const boost = weight * (1 / Math.log2(entryCount + 2)) * 10
                const newBalance = Math.min(100, currentRealm.balance + boost)

                return {
                    realms: {
                        ...state.realms,
                        [realmKey]: {
                            ...state.realms[realmKey],
                            balance: Math.round(newBalance * 10) / 10,
                            entries: [
                                {
                                    id: Date.now(),
                                    createdAt: new Date().toISOString(),
                                    ...enhancedEntry,
                                },
                                ...state.realms[realmKey].entries,
                            ],
                        }
                    }
                }
            }),

            // Actions - Health
            addSymptom: (organKey, symptom) => set((state) => ({
                health: {
                    ...state.health,
                    [organKey]: {
                        ...state.health[organKey],
                        symptoms: [
                            {
                                id: Date.now(),
                                createdAt: new Date().toISOString(),
                                ...symptom,
                            },
                            ...state.health[organKey].symptoms,
                        ],
                    }
                }
            })),

            addMedicalRecord: (organKey, record) => set((state) => ({
                health: {
                    ...state.health,
                    [organKey]: {
                        ...state.health[organKey],
                        records: [
                            {
                                id: Date.now(),
                                createdAt: new Date().toISOString(),
                                ...record,
                            },
                            ...state.health[organKey].records,
                        ],
                    }
                }
            })),

            // Actions - ECHO
            addEchoMessage: (message) => set((state) => ({
                echo: {
                    ...state.echo,
                    history: [...state.echo.history, { ...message, id: Date.now(), timestamp: new Date().toISOString() }]
                }
            })),

            setEchoTyping: (isTyping) => set((state) => ({
                echo: {
                    ...state.echo,
                    isTyping
                }
            })),

            // Actions - Recap
            generateRecap: (period) => {
                const state = get()
                const timeline = state.getTimeline()
                const now = new Date()
                let startDate = new Date()

                if (period === 'weekly') startDate.setDate(now.getDate() - 7)
                else if (period === 'monthly') startDate.setMonth(now.getMonth() - 1)
                else startDate.setFullYear(now.getFullYear() - 1)

                const recentEntries = timeline.filter(e => new Date(e.createdAt) > startDate)

                // Group by realm for analysis
                const stats = recentEntries.reduce((acc, entry) => {
                    const realm = entry.realm || 'unknown'
                    acc[realm] = (acc[realm] || 0) + 1
                    return acc
                }, {})

                const topRealm = Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

                return {
                    id: Date.now(),
                    period,
                    date: now.toISOString(),
                    totalEntries: recentEntries.length,
                    topRealm,
                    stats,
                    highlights: recentEntries.slice(0, 3)
                }
            },

            // Computed - Overall Balance
            getOverallBalance: () => {
                const realms = get().realms
                const total = Object.values(realms).reduce((sum, r) => sum + r.balance, 0)
                return Math.round(total / 5)
            },

            // Computed - Master Timeline
            getTimeline: () => {
                const state = get()
                const realms = state.realms
                const health = state.health
                let allEntries = []

                // 1. Realm Entries
                Object.entries(realms).forEach(([key, realm]) => {
                    if (realm.entries) {
                        realm.entries.forEach(entry => {
                            allEntries.push({
                                ...entry,
                                source: 'realm',
                                realm: key, // cerebra, elysia, etc.
                                color: realm.color,
                                icon: realm.icon
                            })
                        })
                    }
                })

                // 2. Health Symptoms
                Object.entries(health).forEach(([key, organ]) => {
                    if (organ.symptoms) {
                        organ.symptoms.forEach(symptom => {
                            allEntries.push({
                                ...symptom,
                                source: 'health',
                                realm: 'avatar',
                                subType: 'symptom',
                                title: `Symptom: ${symptom.sensation} in ${organ.name}`,
                                color: organ.color,
                                icon: organ.icon
                            })
                        })
                    }
                })

                // 3. Habit Completions
                const state2 = get()
                const isAdvanced = state2.user?.mode === 'advanced'
                    ; (state2.user?.habits || []).forEach(habit => {
                        ; (habit.completions || []).forEach(dateStr => {
                            allEntries.push({
                                id: `habit-${habit.id}-${dateStr}`,
                                source: 'habit',
                                realm: 'habits',
                                title: isAdvanced
                                    ? `⚡ ${habit.name} — +XP`
                                    : habit.name,
                                description: isAdvanced
                                    ? `Habit completed · Discipline streak active`
                                    : 'Habit completed',
                                color: '#f59e0b',
                                icon: isAdvanced ? '🏆' : '🔥',
                                xp: isAdvanced ? 50 : null,
                                createdAt: new Date(dateStr).toISOString(),
                            })
                        })
                    })

                    // 4. Prayer Logs → Sanctum
                    ; (state2.user?.prayerLog || []).forEach(prayer => {
                        allEntries.push({
                            ...prayer,
                            id: prayer.id || `prayer-${prayer.completedAt}`,
                            source: 'prayer',
                            realm: 'sanctum',
                            title: `🌙 ${prayer.type || 'Prayer'} logged`,
                            description: prayer.notes || 'Spiritual practice recorded',
                            color: '#a855f7',
                            icon: '🌙',
                            createdAt: prayer.completedAt || prayer.createdAt,
                        })
                    })

                // Sort by Date (Newest First)
                return allEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            },

            // Phase 3: Dynamic Life Expectancy
            getLifeExpectancy: () => {
                const state = get()
                const user = state.user
                const health = state.health
                let base = 80

                // Health symptoms → reduce expectancy
                let symptomCount = 0
                Object.values(health || {}).forEach(organ => {
                    symptomCount += (organ.symptoms || []).length
                })
                base -= symptomCount * 0.5

                // Habit consistency → increase expectancy
                const habits = user?.habits || []
                const activeHabits = habits.filter(h => (h.completions || []).length > 0)
                base += activeHabits.length * 0.2

                // Mood entries (Empyra) → adjust based on volume (positive indicator)
                const empyraEntries = state.realms?.empyra?.entries || []
                const moodEntries = empyraEntries.filter(e => e.type === 'mood')
                if (moodEntries.length > 10) base += 0.5
                else if (moodEntries.length > 5) base += 0.25

                // Spiritual practice bonus
                const prayerCount = (user?.prayerLog || []).length
                if (prayerCount > 5) base += 0.5

                return Math.max(40, Math.min(120, Math.round(base * 10) / 10))
            },

            // Phase 2: Entry Weight System
            getEntryWeight: (entryType) => {
                const weights = {
                    // Cerebra
                    skill: 10,
                    knowledge: 6,
                    insight: 4,
                    // Elysia
                    project: 10,
                    idea: 5,
                    brainstorm: 3,
                    // Empyra
                    relationship: 8,
                    mood: 4,
                    memory: 5,
                    // Oblivion
                    challenge: 8,
                    struggle: 6,
                    victory: 10,
                    // Sanctum
                    reflection: 6,
                    gratitude: 5,
                    purpose: 8,
                }
                return weights[entryType] || 5
            },

            // Phase 2: Realm Insights for ECHO AI
            getRealmInsights: () => {
                const state = get()
                const realms = state.realms
                const insights = []

                // Calculate average balance
                const balances = Object.values(realms).map(r => r.balance)
                const avgBalance = balances.reduce((a, b) => a + b, 0) / balances.length

                // Find imbalances
                const realmData = Object.entries(realms).map(([key, realm]) => ({
                    key,
                    name: realm.name,
                    balance: realm.balance,
                    entries: realm.entries.length,
                    icon: realm.icon,
                    deviation: realm.balance - avgBalance
                }))

                // Sort by lowest balance first
                realmData.sort((a, b) => a.balance - b.balance)

                const weakest = realmData[0]
                const strongest = realmData[realmData.length - 1]

                if (weakest.balance < 20) {
                    insights.push({
                        type: 'warning',
                        realm: weakest.key,
                        message: `${weakest.icon} ${weakest.name} is critically low at ${weakest.balance}%. Immediate attention required.`
                    })
                }

                if (strongest.balance - weakest.balance > 40) {
                    insights.push({
                        type: 'imbalance',
                        message: `Neural imbalance detected: ${strongest.name} (${strongest.balance}%) vs ${weakest.name} (${weakest.balance}%). Consider redistributing focus.`
                    })
                }

                // Recent activity analysis
                const now = new Date()
                const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)

                Object.entries(realms).forEach(([key, realm]) => {
                    const recentEntries = realm.entries.filter(e => new Date(e.createdAt) > weekAgo)
                    if (recentEntries.length === 0 && realm.entries.length > 0) {
                        insights.push({
                            type: 'dormant',
                            realm: key,
                            message: `${realm.icon} ${realm.name} has been dormant for 7+ days. Consider reconnecting.`
                        })
                    }
                })

                return {
                    insights,
                    realmData,
                    avgBalance: Math.round(avgBalance),
                    weakest,
                    strongest
                }
            },

            // Phase 2: Suggested Actions for ECHO AI
            getSuggestedActions: () => {
                const state = get()
                const { insights, weakest, strongest } = state.getRealmInsights()
                const suggestions = []

                // Suggest based on weakest realm
                const suggestionMap = {
                    cerebra: [
                        "Learn something new today - read an article or watch a tutorial",
                        "Log a skill you've been practicing recently",
                        "Document an insight from your latest project"
                    ],
                    elysia: [
                        "Brainstorm 3 creative ideas, no matter how wild",
                        "Start a small side project you've been postponing",
                        "Sketch or prototype something visual"
                    ],
                    empyra: [
                        "Reach out to someone you haven't talked to in a while",
                        "Log your current mood and reflect on why",
                        "Write about a meaningful relationship in your life"
                    ],
                    oblivion: [
                        "Identify one challenge you're currently facing",
                        "Document a struggle you've overcome recently",
                        "Set a discipline goal for this week"
                    ],
                    sanctum: [
                        "Take 5 minutes for quiet reflection or meditation",
                        "Write down 3 things you're grateful for",
                        "Reflect on your life's purpose and direction"
                    ]
                }

                if (weakest && suggestionMap[weakest.key]) {
                    const realmSuggestions = suggestionMap[weakest.key]
                    suggestions.push({
                        priority: 'high',
                        realm: weakest.key,
                        action: realmSuggestions[Math.floor(Math.random() * realmSuggestions.length)],
                        reason: `Boosting ${weakest.name} will improve overall balance`
                    })
                }

                // Add general suggestions
                if (insights.length === 0) {
                    suggestions.push({
                        priority: 'normal',
                        action: "Your neural systems are balanced. Continue current patterns.",
                        reason: "Maintaining equilibrium"
                    })
                }

                return suggestions
            },

            // Phase 2: Echo Understanding % — scores all app data across 6 categories
            getEchoUnderstanding: () => {
                const state = get()
                const { user, realms, health } = state
                let score = 0
                const breakdown = {}

                // 1. Realm entries (25 pts max — 5pts per realm, 0.5pt per entry, cap 10 entries)
                let realmPts = 0
                Object.values(realms).forEach(realm => {
                    const entries = Math.min(realm.entries.length, 10)
                    realmPts += entries * 0.5
                })
                realmPts = Math.min(25, realmPts)
                breakdown.realms = { score: Math.round(realmPts * 10) / 10, max: 25 }
                score += realmPts

                // 2. Habits (15 pts max — 3pts per habit, cap 5)
                const habits = user.habits || []
                const habitPts = Math.min(15, habits.length * 3)
                breakdown.habits = { score: habitPts, max: 15 }
                score += habitPts

                // 3. Health records (15 pts max — 1pt per symptom or record across all organs, cap 15)
                let healthPts = 0
                Object.values(health).forEach(organ => {
                    healthPts += (organ.symptoms?.length || 0) + (organ.records?.length || 0)
                })
                healthPts = Math.min(15, healthPts)
                breakdown.health = { score: healthPts, max: 15 }
                score += healthPts

                // 4. Religion logs (15 pts max)
                let religionPts = 0
                if (user.religion) religionPts += 3 // has a religion set
                religionPts += Math.min(6, (user.prayerLog?.length || 0) * 0.5) // prayer logs
                const quran = user.scriptureProgress?.quran
                if (quran) {
                    if (quran.currentJuz > 0 || quran.currentPage > 0) religionPts += 3
                    if (quran.khatmCount > 0) religionPts += 3
                }
                religionPts = Math.min(15, religionPts)
                breakdown.religion = { score: Math.round(religionPts * 10) / 10, max: 15 }
                score += religionPts

                // 5. MBTI + Quotients (15 pts max)
                let mbtiPts = 0
                if (user.mbti) mbtiPts += 5
                if (user.mbtiScores) mbtiPts += 2
                const quotients = user.quotientsHistory || {}
                const quotientLogs = Object.values(quotients).reduce((sum, arr) => sum + (arr?.length || 0), 0)
                mbtiPts += Math.min(8, quotientLogs * 2)
                mbtiPts = Math.min(15, mbtiPts)
                breakdown.personality = { score: mbtiPts, max: 15 }
                score += mbtiPts

                // 6. Achievements (15 pts max — 1pt per answered question, cap 15)
                const answeredQuestions = Object.keys(user.questionAnswers || {}).length
                const achievementPts = Math.min(15, answeredQuestions)
                breakdown.achievements = { score: achievementPts, max: 15 }
                score += achievementPts

                return {
                    score: Math.min(100, Math.round(score)),
                    breakdown
                }
            },

            // Phase 5: Update skill hours (for XP logging)
            updateSkillHours: (skillId, additionalHours) => set((state) => ({
                realms: {
                    ...state.realms,
                    cerebra: {
                        ...state.realms.cerebra,
                        entries: state.realms.cerebra.entries.map(entry => {
                            if (entry.id === skillId && entry.type === 'skill') {
                                const newHours = (entry.hours || 0) + additionalHours
                                return {
                                    ...entry,
                                    hours: newHours,
                                    rank: get().calculateRank(newHours)
                                }
                            }
                            return entry
                        })
                    }
                }
            })),

            // Manual Save (Diagnostic)
            forceSave: () => {
                try {
                    const state = get()
                    localStorage.setItem('afterlife-storage', JSON.stringify({
                        state: {
                            user: state.user,
                            realms: state.realms,
                            health: state.health,
                            echo: state.echo
                        },
                        version: 3
                    }))
                    console.log('Diagnostic: Manual save successful')
                } catch (e) {
                    console.error('Diagnostic: Manual save failed', e)
                }
            },

            // Reset (for development)
            resetStore: () => set({ user: initialUser, realms: initialRealms, health: initialHealth }),
        }),
        {
            name: 'afterlife-storage',
            version: 4, // Bumped version for identity expansion migration
            migrate: (persistedState, version) => {
                console.log(`Zustand: Migrating storage from version ${version} to 4`)

                if (!persistedState) return persistedState

                // Migration for religion feature (version 2 -> 3)
                if (version < 3 && persistedState?.user) {
                    persistedState.user = {
                        ...persistedState.user,
                        religion: persistedState.user.religion ?? null,
                        customReligion: persistedState.user.customReligion ?? '',
                        prayerLog: persistedState.user.prayerLog ?? [],
                        scriptureProgress: persistedState.user.scriptureProgress ?? {
                            quran: { mode: 'juz', currentPage: 0, currentJuz: 0, completedSurahs: [], khatmCount: 0, lastRead: null, goal: null, streak: 0 },
                            bible: { completedChapters: [], currentBook: null, lastRead: null, goal: null, streak: 0 },
                            torah: { currentParsha: null, completedParshas: [], lastRead: null, streak: 0 }
                        },
                        spiritualSettings: persistedState.user.spiritualSettings ?? {
                            showReligionWidget: true,
                            showOtherReligionsCalendar: {},
                            showCommunityStats: false,
                            anonymousCommunityStats: true,
                        },
                    }
                }

                // Migration for identity expansion (version 3 -> 4)
                if (version < 4 && persistedState?.user) {
                    persistedState.user = {
                        ...persistedState.user,
                        mbtiVariant: persistedState.user.mbtiVariant ?? 'A',
                        enneagram: persistedState.user.enneagram ?? null,
                        spiritAnimal: persistedState.user.spiritAnimal ?? null,
                        westernZodiac: persistedState.user.westernZodiac ?? null,
                        chineseZodiac: persistedState.user.chineseZodiac ?? null,
                        quotientsHistory: persistedState.user.quotientsHistory ?? {
                            iq: [], eq: [], aq: [], tq: [], sq: [],
                        },
                    }
                }

                return persistedState
            },
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.error('Zustand hydration error:', error)
                } else {
                    console.log('Zustand hydration complete', state ? 'with state' : 'empty state')

                    // Verify storage origin
                    try {
                        const testKey = '__storage_test__'
                        localStorage.setItem(testKey, testKey)
                        localStorage.removeItem(testKey)
                        console.log('Storage Health: LocalStorage writes OK')
                    } catch (e) {
                        console.error('Storage Health: LocalStorage access BLOCKED', e)
                    }
                }
            }
        }
    )
)
