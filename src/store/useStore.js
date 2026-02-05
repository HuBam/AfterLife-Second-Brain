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

                return {
                    realms: {
                        ...state.realms,
                        [realmKey]: {
                            ...state.realms[realmKey],
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

                // Sort by Date (Newest First)
                return allEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
            version: 3, // Bumped version for religion feature migration
            migrate: (persistedState, version) => {
                console.log(`Zustand: Migrating storage from version ${version} to 3`)

                if (!persistedState) return persistedState

                // Migration for religion feature (version 2 -> 3)
                if (version < 3 && persistedState?.user) {
                    // Ensure religion fields exist
                    persistedState.user = {
                        ...persistedState.user,
                        religion: persistedState.user.religion ?? null,
                        customReligion: persistedState.user.customReligion ?? '',
                        prayerLog: persistedState.user.prayerLog ?? [],
                        scriptureProgress: persistedState.user.scriptureProgress ?? {
                            quran: {
                                mode: 'juz',
                                currentPage: 0,
                                currentJuz: 0,
                                completedSurahs: [],
                                khatmCount: 0,
                                lastRead: null,
                                goal: null,
                                streak: 0,
                            },
                            bible: {
                                completedChapters: [],
                                currentBook: null,
                                lastRead: null,
                                goal: null,
                                streak: 0,
                            },
                            torah: {
                                currentParsha: null,
                                completedParshas: [],
                                lastRead: null,
                                streak: 0,
                            }
                        },
                        spiritualSettings: persistedState.user.spiritualSettings ?? {
                            showReligionWidget: true,
                            showOtherReligionsCalendar: {},
                            showCommunityStats: false,
                            anonymousCommunityStats: true,
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
