// Religion options with icons and metadata
export const religions = [
    { id: 'islam', name: 'Islam', icon: '☪️', color: '#22c55e' },
    { id: 'christianity', name: 'Christianity', icon: '✝️', color: '#3b82f6' },
    { id: 'judaism', name: 'Judaism', icon: '✡️', color: '#f59e0b' },
    { id: 'hinduism', name: 'Hinduism', icon: '🕉️', color: '#f97316' },
    { id: 'buddhism', name: 'Buddhism', icon: '☸️', color: '#eab308' },
    { id: 'sikhism', name: 'Sikhism', icon: '🪯', color: '#06b6d4' },
    { id: 'bahai', name: "Bahá'í", icon: '✴️', color: '#8b5cf6' },
    { id: 'jainism', name: 'Jainism', icon: '🪷', color: '#ec4899' },
    { id: 'shinto', name: 'Shinto', icon: '⛩️', color: '#ef4444' },
    { id: 'zoroastrianism', name: 'Zoroastrianism', icon: '🔥', color: '#d97706' },
    { id: 'atheist', name: 'No Religion / Atheist', icon: '🔬', color: '#6b7280' },
    { id: 'other', name: 'Other', icon: '🌟', color: '#a855f7' },
]

// Prayer types by religion
export const prayerTypes = {
    islam: [
        { id: 'fajr', name: 'Fajr', nameAr: 'الفجر', time: 'Dawn' },
        { id: 'dhuhr', name: 'Dhuhr', nameAr: 'الظهر', time: 'Noon' },
        { id: 'asr', name: 'Asr', nameAr: 'العصر', time: 'Afternoon' },
        { id: 'maghrib', name: 'Maghrib', nameAr: 'المغرب', time: 'Sunset' },
        { id: 'isha', name: 'Isha', nameAr: 'العشاء', time: 'Night' },
    ],
    christianity: [
        { id: 'morning', name: 'Morning Prayer', time: 'Morning' },
        { id: 'noon', name: 'Midday Prayer', time: 'Noon' },
        { id: 'evening', name: 'Evening Prayer', time: 'Evening' },
        { id: 'night', name: 'Night Prayer', time: 'Night' },
    ],
    judaism: [
        { id: 'shacharit', name: 'Shacharit', nameHe: 'שַׁחֲרִית', time: 'Morning' },
        { id: 'mincha', name: 'Mincha', nameHe: 'מִנְחָה', time: 'Afternoon' },
        { id: 'maariv', name: "Ma'ariv", nameHe: 'מַעֲרִיב', time: 'Evening' },
    ],
    // Generic for other religions
    generic: [
        { id: 'morning', name: 'Morning Practice', time: 'Morning' },
        { id: 'evening', name: 'Evening Practice', time: 'Evening' },
        { id: 'meditation', name: 'Meditation', time: 'Any' },
    ],
}

// Sunnah practices for Islam (examples)
export const sunnahPractices = {
    daily: [
        { id: 'morning-adhkar', name: 'Morning Adhkar', nameAr: 'أذكار الصباح', time: 'After Fajr' },
        { id: 'evening-adhkar', name: 'Evening Adhkar', nameAr: 'أذكار المساء', time: 'After Asr' },
        { id: 'before-sleep', name: 'Before Sleep Adhkar', nameAr: 'أذكار النوم', time: 'Before Sleep' },
        { id: 'duha', name: 'Duha Prayer', nameAr: 'صلاة الضحى', time: 'Mid-morning' },
        { id: 'witr', name: 'Witr Prayer', nameAr: 'صلاة الوتر', time: 'After Isha' },
    ],
    friday: [
        { id: 'surah-kahf', name: 'Surah Al-Kahf', nameAr: 'سورة الكهف', description: 'Read Surah Al-Kahf on Friday' },
        { id: 'friday-salawat', name: 'Salawat on Prophet ﷺ', nameAr: 'الصلاة على النبي', description: 'Increase salawat on Friday' },
        { id: 'friday-dua', name: 'Dua before Maghrib', nameAr: 'الدعاء قبل المغرب', description: 'Special hour for dua acceptance' },
    ],
    weekly: [
        { id: 'monday-thursday-fast', name: 'Monday/Thursday Fast', nameAr: 'صيام الاثنين والخميس', description: 'Sunnah fasting' },
    ],
}

// Quran Surahs data
export const quranSurahs = [
    { number: 1, name: 'Al-Fatiha', nameAr: 'الفاتحة', verses: 7, juz: 1, pages: '1' },
    { number: 2, name: 'Al-Baqarah', nameAr: 'البقرة', verses: 286, juz: '1-3', pages: '2-49' },
    { number: 3, name: 'Ali Imran', nameAr: 'آل عمران', verses: 200, juz: '3-4', pages: '50-76' },
    { number: 4, name: 'An-Nisa', nameAr: 'النساء', verses: 176, juz: '4-6', pages: '77-106' },
    { number: 5, name: 'Al-Maidah', nameAr: 'المائدة', verses: 120, juz: '6-7', pages: '106-127' },
    // ... More surahs would be added (114 total)
    { number: 114, name: 'An-Nas', nameAr: 'الناس', verses: 6, juz: 30, pages: '604' },
]

// Quran Juz (Parts) - 30 total
export const quranJuz = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    name: `Juz ${i + 1}`,
    pages: `${Math.floor(i * 20.13) + 1}-${Math.floor((i + 1) * 20.13)}`,
}))

// Total pages in Quran
export const QURAN_TOTAL_PAGES = 604
export const QURAN_TOTAL_JUZ = 30
export const QURAN_TOTAL_SURAHS = 114

// Get religion display name
export const getReligionName = (religionId, customName = '') => {
    if (religionId === 'other' && customName) return customName
    const religion = religions.find(r => r.id === religionId)
    return religion?.name || religionId
}

// Get prayer types for a religion
export const getPrayerTypes = (religionId) => {
    return prayerTypes[religionId] || prayerTypes.generic
}
