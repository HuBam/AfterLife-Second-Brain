/**
 * Astrology Data & Calculations
 * Handles Western Zodiac and Chinese Zodiac based on birth date.
 */

export const westernZodiac = [
    { name: 'Capricorn', sign: '♑', start: '12-22', end: '01-19', element: 'Earth', traits: ['Responsible', 'Disciplined', 'Self-control'] },
    { name: 'Aquarius', sign: '♒', start: '01-20', end: '02-18', element: 'Air', traits: ['Progressive', 'Original', 'Independent'] },
    { name: 'Pisces', sign: '♓', start: '02-19', end: '03-20', element: 'Water', traits: ['Compassionate', 'Artistic', 'Intuitive'] },
    { name: 'Aries', sign: '♈', start: '03-21', end: '04-19', element: 'Fire', traits: ['Courageous', 'Determined', 'Confident'] },
    { name: 'Taurus', sign: '♉', start: '04-20', end: '05-20', element: 'Earth', traits: ['Reliable', 'Patient', 'Practical'] },
    { name: 'Gemini', sign: '♊', start: '05-21', end: '06-20', element: 'Air', traits: ['Gentle', 'Affectionate', 'Curious'] },
    { name: 'Cancer', sign: '♋', start: '06-21', end: '07-22', element: 'Water', traits: ['Tenacious', 'Highly imaginative', 'Loyal'] },
    { name: 'Leo', sign: '♌', start: '07-23', end: '08-22', element: 'Fire', traits: ['Creative', 'Passionate', 'Generous'] },
    { name: 'Virgo', sign: '♍', start: '08-23', end: '09-22', element: 'Earth', traits: ['Loyal', 'Analytical', 'Kind'] },
    { name: 'Libra', sign: '♎', start: '09-23', end: '10-22', element: 'Air', traits: ['Cooperative', 'Diplomatic', 'Gracious'] },
    { name: 'Scorpio', sign: '♏', start: '10-23', end: '11-21', element: 'Water', traits: ['Resourceful', 'Brave', 'Passionate'] },
    { name: 'Sagittarius', sign: '♐', start: '11-22', end: '12-21', element: 'Fire', traits: ['Generous', 'Idealistic', 'Great sense of humor'] },
]

export const chineseZodiac = [
    { name: 'Rat', sign: '🐀', traits: ['Quick-witted', 'Resourceful', 'Versatile'] },
    { name: 'Ox', sign: '🐂', traits: ['Diligent', 'Dependable', 'Strong'] },
    { name: 'Tiger', sign: '🐅', traits: ['Brave', 'Confident', 'Competitive'] },
    { name: 'Rabbit', sign: '🐇', traits: ['Quiet', 'Elegant', 'Kind'] },
    { name: 'Dragon', sign: '🐉', traits: ['Confident', 'Intelligent', 'Enthusiastic'] },
    { name: 'Snake', sign: '🐍', traits: ['Enigmatic', 'Intelligent', 'Wise'] },
    { name: 'Horse', sign: '🐎', traits: ['Animated', 'Active', 'Energetic'] },
    { name: 'Goat', sign: '🐐', traits: ['Calm', 'Gentle', 'Sympathetic'] },
    { name: 'Monkey', sign: '🐒', traits: ['Sharp', 'Smart', 'Curiosity'] },
    { name: 'Rooster', sign: '🐓', traits: ['Observant', 'Hardworking', 'Courageous'] },
    { name: 'Dog', sign: '🐕', traits: ['Lovely', 'Honest', 'Prudent'] },
    { name: 'Pig', sign: '🐖', traits: ['Compassionate', 'Generous', 'Diligent'] },
]

/**
 * Get Western Zodiac sign from date
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {object} Zodiac object
 */
export const getWesternZodiac = (dateStr) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const monthDay = (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day

    return westernZodiac.find(z => {
        if (z.name === 'Capricorn') {
            return monthDay >= '12-22' || monthDay <= '01-19'
        }
        return monthDay >= z.start && monthDay <= z.end
    })
}

/**
 * Get Chinese Zodiac sign from year
 * @param {number} year 
 * @returns {object} Zodiac object
 */
export const getChineseZodiac = (year) => {
    if (!year) return null
    // Rat is 1900, 1912, etc. (year - 1900) % 12
    const index = (year - 1900) % 12
    return chineseZodiac[index >= 0 ? index : index + 12]
}
