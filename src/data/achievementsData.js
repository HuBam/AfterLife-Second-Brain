// Achievements & Talents Data
// Unlocked via questions, milestones, and personality assessment

export const rarityColors = {
    common: { bg: 'linear-gradient(180deg, #6b7280 0%, #4b5563 100%)', border: '#6b7280' },
    rare: { bg: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', border: '#3b82f6' },
    epic: { bg: 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)', border: '#a855f7' },
    legendary: { bg: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)', border: '#f59e0b' },
    mythic: { bg: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)', border: '#22c55e' },
}

// Questions to unlock achievements
export const achievementQuestions = {
    // Self-discovery questions
    selfDiscovery: [
        { id: 'sd1', text: "What's your biggest strength that others might not know about?", category: 'self' },
        { id: 'sd2', text: "If you could master any skill overnight, what would it be?", category: 'ambition' },
        { id: 'sd3', text: "What challenge have you overcome that you're proud of?", category: 'resilience' },
        { id: 'sd4', text: "What do you do when you're feeling overwhelmed?", category: 'coping' },
        { id: 'sd5', text: "What's something you've always wanted to try but haven't yet?", category: 'dreams' },
    ],

    // Lifestyle questions
    lifestyle: [
        { id: 'ls1', text: "How do you prefer to start your mornings?", category: 'routine' },
        { id: 'ls2', text: "What's your ideal way to spend free time?", category: 'leisure' },
        { id: 'ls3', text: "Do you prefer working alone or with others?", category: 'social' },
        { id: 'ls4', text: "How important is routine vs spontaneity to you?", category: 'structure' },
        { id: 'ls5', text: "What energizes you the most?", category: 'energy' },
    ],

    // Values questions
    values: [
        { id: 'vl1', text: "What do you value most in relationships?", category: 'relationships' },
        { id: 'vl2', text: "What would you do with all the money in the world?", category: 'purpose' },
        { id: 'vl3', text: "What legacy do you want to leave behind?", category: 'legacy' },
        { id: 'vl4', text: "What causes or issues do you care deeply about?", category: 'causes' },
        { id: 'vl5', text: "What's more important: success or happiness?", category: 'priorities' },
    ],
}

// Achievements - unlocked via actions and questions
export const achievements = [
    // Starter achievements
    { id: 'first_entry', name: 'First Steps', description: 'Create your first journal entry', icon: '🌱', rarity: 'common', category: 'milestone', unlockCondition: { type: 'entries', count: 1 } },
    { id: 'week_streak', name: 'Consistent', description: 'Log entries for 7 days in a row', icon: '📆', rarity: 'common', category: 'streak', unlockCondition: { type: 'streak', count: 7 } },
    { id: 'profile_complete', name: 'Identity Found', description: 'Complete your profile setup', icon: '✨', rarity: 'common', category: 'profile', unlockCondition: { type: 'profile' } },

    // Realm achievements
    { id: 'cerebra_explorer', name: 'Mind Explorer', description: 'Add 5 entries to Cerebra', icon: '🧠', rarity: 'rare', category: 'realm', unlockCondition: { type: 'realm_entries', realm: 'cerebra', count: 5 } },
    { id: 'elysia_creator', name: 'Creative Soul', description: 'Add 5 entries to Elysia', icon: '🎨', rarity: 'rare', category: 'realm', unlockCondition: { type: 'realm_entries', realm: 'elysia', count: 5 } },
    { id: 'empyra_feeler', name: 'Emotional Wisdom', description: 'Add 5 entries to Empyra', icon: '💗', rarity: 'rare', category: 'realm', unlockCondition: { type: 'realm_entries', realm: 'empyra', count: 5 } },
    { id: 'oblivion_warrior', name: 'Shadow Walker', description: 'Add 5 entries to Oblivion', icon: '⚔️', rarity: 'rare', category: 'realm', unlockCondition: { type: 'realm_entries', realm: 'oblivion', count: 5 } },
    { id: 'sanctum_seeker', name: 'Spirit Guide', description: 'Add 5 entries to Sanctum', icon: '🌙', rarity: 'rare', category: 'realm', unlockCondition: { type: 'realm_entries', realm: 'sanctum', count: 5 } },

    // Skill Progress Milestones (percentage-based)
    { id: 'skill_beginner', name: 'Apprentice', description: 'Reach 10% progress on any skill', icon: '📊', rarity: 'common', category: 'skill', unlockCondition: { type: 'skill_progress', percent: 10 } },
    { id: 'skill_novice', name: 'Novice', description: 'Reach 25% progress on any skill', icon: '📈', rarity: 'common', category: 'skill', unlockCondition: { type: 'skill_progress', percent: 25 } },
    { id: 'skill_intermediate', name: 'Intermediate', description: 'Reach 50% progress on any skill', icon: '🎯', rarity: 'rare', category: 'skill', unlockCondition: { type: 'skill_progress', percent: 50 } },
    { id: 'skill_advanced', name: 'Advanced', description: 'Reach 75% progress on any skill', icon: '⭐', rarity: 'epic', category: 'skill', unlockCondition: { type: 'skill_progress', percent: 75 } },
    { id: 'skill_expert', name: 'Expert', description: 'Master any skill to 100%', icon: '🏅', rarity: 'legendary', category: 'skill', unlockCondition: { type: 'skill_progress', percent: 100 } },

    // Multiple Skills
    { id: 'multi_skill_3', name: 'Jack of Trades', description: 'Track 3 different skills', icon: '🃏', rarity: 'common', category: 'skill', unlockCondition: { type: 'skill_count', count: 3 } },
    { id: 'multi_skill_5', name: 'Renaissance Soul', description: 'Track 5 different skills', icon: '🎭', rarity: 'rare', category: 'skill', unlockCondition: { type: 'skill_count', count: 5 } },
    { id: 'multi_skill_10', name: 'Polymath', description: 'Track 10 different skills', icon: '🌟', rarity: 'epic', category: 'skill', unlockCondition: { type: 'skill_count', count: 10 } },

    // Habit Streak Achievements
    { id: 'habit_starter', name: 'Habit Starter', description: 'Complete a habit 3 days in a row', icon: '🔥', rarity: 'common', category: 'habit', unlockCondition: { type: 'habit_streak', count: 3 } },
    { id: 'habit_week', name: 'Habit Builder', description: 'Complete a habit 7 days in a row', icon: '💪', rarity: 'rare', category: 'habit', unlockCondition: { type: 'habit_streak', count: 7 } },
    { id: 'habit_fortress', name: 'Habit Fortress', description: 'Complete a habit 14 days in a row', icon: '🏰', rarity: 'epic', category: 'habit', unlockCondition: { type: 'habit_streak', count: 14 } },
    { id: 'habit_legend', name: 'Habit Legend', description: 'Complete a habit 30 days in a row', icon: '👑', rarity: 'legendary', category: 'habit', unlockCondition: { type: 'habit_streak', count: 30 } },

    // Multiple Habits
    { id: 'habits_3', name: 'Routine Starter', description: 'Track 3 daily habits', icon: '📋', rarity: 'common', category: 'habit', unlockCondition: { type: 'habit_count', count: 3 } },
    { id: 'habits_5', name: 'Routine Master', description: 'Track 5 daily habits', icon: '📊', rarity: 'rare', category: 'habit', unlockCondition: { type: 'habit_count', count: 5 } },

    // Epic achievements
    { id: 'realm_master', name: 'Realm Master', description: 'Balance all realms above 70%', icon: '👑', rarity: 'epic', category: 'mastery', unlockCondition: { type: 'balance', min: 70 } },
    { id: 'month_streak', name: 'Dedication', description: 'Maintain a 30-day streak', icon: '🔥', rarity: 'epic', category: 'streak', unlockCondition: { type: 'streak', count: 30 } },
    { id: 'skill_master', name: 'Skill Artisan', description: 'Reach rank A in any skill', icon: '⭐', rarity: 'epic', category: 'skill', unlockCondition: { type: 'skill_rank', rank: 'A' } },

    // Legendary achievements
    { id: 'hundred_entries', name: 'Chronicler', description: 'Create 100 journal entries', icon: '📚', rarity: 'legendary', category: 'milestone', unlockCondition: { type: 'entries', count: 100 } },
    { id: 'year_streak', name: 'Eternal Flame', description: 'Maintain a 365-day streak', icon: '🌟', rarity: 'legendary', category: 'streak', unlockCondition: { type: 'streak', count: 365 } },
    { id: 'all_realms_max', name: 'Transcendence', description: 'Max out all realm balances', icon: '🏆', rarity: 'mythic', category: 'mastery', unlockCondition: { type: 'balance', min: 100 } },

    // Question-based achievements
    { id: 'self_aware', name: 'Self Aware', description: 'Answer 5 self-discovery questions', icon: '🪞', rarity: 'common', category: 'questions', unlockCondition: { type: 'questions', category: 'selfDiscovery', count: 5 } },
    { id: 'lifestyle_defined', name: 'Lifestyle Architect', description: 'Answer 5 lifestyle questions', icon: '🏠', rarity: 'common', category: 'questions', unlockCondition: { type: 'questions', category: 'lifestyle', count: 5 } },
    { id: 'values_clear', name: 'Value Driven', description: 'Answer 5 values questions', icon: '💎', rarity: 'rare', category: 'questions', unlockCondition: { type: 'questions', category: 'values', count: 5 } },
]

// Talents - based on personality and skills
export const talents = [
    // MBTI-based talents
    { id: 'strategist', name: 'Strategist', description: 'Natural long-term planner and systems thinker', icon: '♟️', rarity: 'rare', mbtiTypes: ['INTJ', 'ENTJ', 'INTP'] },
    { id: 'empath', name: 'Empath', description: 'Deeply attuned to others\' emotions', icon: '💫', rarity: 'rare', mbtiTypes: ['INFJ', 'ENFJ', 'INFP', 'ENFP'] },
    { id: 'innovator', name: 'Innovator', description: 'Creative problem-solver and idea generator', icon: '💡', rarity: 'epic', mbtiTypes: ['ENTP', 'INTP', 'INTJ'] },
    { id: 'guardian', name: 'Guardian', description: 'Reliable protector and caretaker', icon: '🛡️', rarity: 'rare', mbtiTypes: ['ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'] },
    { id: 'adventurer', name: 'Adventurer', description: 'Thrives on new experiences and spontaneity', icon: '🗺️', rarity: 'rare', mbtiTypes: ['ESTP', 'ISTP', 'ESFP', 'ISFP'] },
    { id: 'visionary', name: 'Visionary', description: 'Sees possibilities others miss', icon: '🔮', rarity: 'epic', mbtiTypes: ['INFJ', 'INTJ', 'ENFJ', 'ENFP'] },
    { id: 'performer', name: 'Performer', description: 'Natural entertainer and social butterfly', icon: '🎭', rarity: 'rare', mbtiTypes: ['ESFP', 'ENFP', 'ESTP'] },
    { id: 'analyst', name: 'Analyst', description: 'Logical thinker with keen attention to detail', icon: '🔬', rarity: 'rare', mbtiTypes: ['ISTJ', 'INTP', 'ISTP'] },
    { id: 'mediator', name: 'Mediator', description: 'Natural peacemaker and conflict resolver', icon: '🕊️', rarity: 'rare', mbtiTypes: ['INFP', 'ISFP', 'ENFP'] },

    // Enneagram-based talents
    { id: 'perfectionist', name: 'Perfectionist', description: 'Driven by high standards and order', icon: '✨', rarity: 'rare', enneagramTypes: [1] },
    { id: 'altruist', name: 'Altruist', description: 'Gains fulfillment by helping others', icon: '🎁', rarity: 'rare', enneagramTypes: [2] },
    { id: 'investigator', name: 'Investigator', description: 'Thirst for knowledge and understanding', icon: '🔍', rarity: 'rare', enneagramTypes: [5] },

    // Skill-based talents
    { id: 'polyglot', name: 'Polyglot', description: 'Master of multiple languages', icon: '🗣️', rarity: 'epic', skillRequired: { category: 'language', minHours: 100 } },
    { id: 'artist', name: 'Artist', description: 'Creative visual expression mastery', icon: '🎨', rarity: 'rare', skillRequired: { category: 'creative', minHours: 50 } },
    { id: 'athlete', name: 'Athlete', description: 'Physical prowess and endurance', icon: '🏃', rarity: 'rare', skillRequired: { category: 'fitness', minHours: 100 } },
    { id: 'scholar', name: 'Scholar', description: 'Deep knowledge seeker', icon: '📖', rarity: 'epic', skillRequired: { category: 'learning', minHours: 200 } },
    { id: 'coder', name: 'Neural Architect', description: 'Master of complex logical systems', icon: '💻', rarity: 'legendary', skillRequired: { category: 'programming', minHours: 250 } },

    // Special talents
    { id: 'night_owl', name: 'Night Owl', description: 'Most productive after midnight', icon: '🦉', rarity: 'common', special: 'night_entries' },
    { id: 'early_bird', name: 'Early Bird', description: 'Catches the worm at dawn', icon: '🐦', rarity: 'common', special: 'morning_entries' },
    { id: 'multitasker', name: 'Multitasker', description: 'Masters many skills simultaneously', icon: '🎪', rarity: 'legendary', special: 'multi_skills' },
]

// Function to check if achievement is unlocked
export const checkAchievementUnlock = (achievement, userData) => {
    const { unlockCondition } = achievement
    const { realms, user, skills = [], questionAnswers = {}, habits = [] } = userData

    switch (unlockCondition.type) {
        case 'entries':
            const totalEntries = Object.values(realms || {}).reduce((sum, r) => sum + (r?.entries?.length || 0), 0)
            return totalEntries >= unlockCondition.count

        case 'streak':
            return (user.currentStreak || 0) >= unlockCondition.count

        case 'profile':
            return user.onboarded && user.mbti

        case 'realm_entries':
            return realms[unlockCondition.realm]?.entries.length >= unlockCondition.count

        case 'balance':
            return Object.values(realms).every(r => r.balance >= unlockCondition.min)

        case 'skill_rank':
            return skills?.some(s => s.rank === unlockCondition.rank || ['S', 'SS', 'SSS'].includes(s.rank))

        case 'questions':
            const categoryAnswers = questionAnswers[unlockCondition.category] || []
            return categoryAnswers.length >= unlockCondition.count

        case 'skill_progress':
            // Check if any skill has reached the required percentage
            return skills?.some(s => (s.progress || 0) >= unlockCondition.percent)

        case 'skill_count':
            // Check if user has tracked at least N skills
            return skills?.length >= unlockCondition.count

        case 'habit_streak':
            // Check if any habit has a streak of at least N days
            if (!habits || habits.length === 0) return false
            return habits.some(h => {
                if (!h.completions || h.completions.length === 0) return false
                const sortedDates = [...h.completions].sort().reverse()
                let streak = 0
                let currentDate = new Date()

                for (const dateStr of sortedDates) {
                    const checkDate = currentDate.toISOString().split('T')[0]
                    if (dateStr === checkDate) {
                        streak++
                        currentDate.setDate(currentDate.getDate() - 1)
                    } else {
                        break
                    }
                }
                return streak >= unlockCondition.count
            })

        case 'habit_count':
            // Check if user has at least N habits
            return habits?.length >= unlockCondition.count

        default:
            return false
    }
}

// Function to check if talent is unlocked
export const checkTalentUnlock = (talent, userData) => {
    const { user, skills = [] } = userData

    // MBTI-based talent
    if (talent.mbtiTypes && user.mbti) {
        return talent.mbtiTypes.includes(user.mbti)
    }

    // Enneagram-based talent
    if (talent.enneagramTypes && user.enneagram) {
        return talent.enneagramTypes.includes(Number(user.enneagram))
    }

    // Skill-based talent
    if (talent.skillRequired) {
        const { category, minHours } = talent.skillRequired
        const categorySkills = skills.filter(s => s.category === category)
        const totalHours = categorySkills.reduce((sum, s) => sum + (s.totalHours || 0), 0)
        return totalHours >= minHours
    }

    // Special talents handled elsewhere
    return false
}
