/**
 * Aladhan Prayer Times API Service
 * Free API for Islamic prayer times and Qibla direction
 * API Docs: https://aladhan.com/prayer-times-api
 */

const BASE_URL = 'https://api.aladhan.com/v1'

// Calculation methods supported by the API
export const CALCULATION_METHODS = {
    MWL: { id: 3, name: 'Muslim World League' },
    ISNA: { id: 2, name: 'Islamic Society of North America' },
    EGYPT: { id: 5, name: 'Egyptian General Authority' },
    MAKKAH: { id: 4, name: 'Umm Al-Qura, Makkah' },
    KARACHI: { id: 1, name: 'University of Islamic Sciences, Karachi' },
    TEHRAN: { id: 7, name: 'Institute of Geophysics, Tehran' },
    GULF: { id: 8, name: 'Gulf Region' },
    KUWAIT: { id: 9, name: 'Kuwait' },
    QATAR: { id: 10, name: 'Qatar' },
    SINGAPORE: { id: 11, name: 'Majlis Ugama Islam Singapura' },
    FRANCE: { id: 12, name: 'Union Organization Islamic de France' },
    TURKEY: { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
    RUSSIA: { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
    MOONSIGHTING: { id: 15, name: 'Moonsighting Committee Worldwide' },
    DUBAI: { id: 16, name: 'Dubai' },
    JAKIM: { id: 17, name: 'JAKIM, Malaysia' },
    TUNISIA: { id: 18, name: 'Tunisia' },
    ALGERIA: { id: 19, name: 'Algeria' },
    KEMENAG: { id: 20, name: 'KEMENAG, Indonesia' },
    MOROCCO: { id: 21, name: 'Morocco' },
    PORTUGAL: { id: 22, name: 'Comunidade Islamica de Lisboa' },
    JORDAN: { id: 23, name: 'Ministry of Awqaf, Jordan' },
}

/**
 * Fetch prayer times for a specific city and country
 * @param {string} city - City name
 * @param {string} country - Country name
 * @param {number} method - Calculation method ID (default: 4 for Umm Al-Qura)
 * @returns {Promise<object>} Prayer times data
 */
export async function fetchPrayerTimesByCity(city, country, method = 4) {
    try {
        const date = new Date()
        const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

        const url = `${BASE_URL}/timingsByCity/${dateString}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.code !== 200) {
            throw new Error(data.data || 'Failed to fetch prayer times')
        }

        const timings = data.data.timings
        const meta = data.data.meta

        return {
            success: true,
            timings: {
                fajr: timings.Fajr,
                sunrise: timings.Sunrise,
                dhuhr: timings.Dhuhr,
                asr: timings.Asr,
                sunset: timings.Sunset,
                maghrib: timings.Maghrib,
                isha: timings.Isha,
                imsak: timings.Imsak,
                midnight: timings.Midnight,
                firstthird: timings.Firstthird,
                lastthird: timings.Lastthird,
            },
            date: data.data.date,
            meta: {
                timezone: meta.timezone,
                method: meta.method,
                latitude: meta.latitude,
                longitude: meta.longitude,
            }
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Fetch prayer times using coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {number} method - Calculation method ID
 * @returns {Promise<object>} Prayer times data
 */
export async function fetchPrayerTimesByCoords(latitude, longitude, method = 4) {
    try {
        const date = new Date()
        const dateString = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

        const url = `${BASE_URL}/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=${method}`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.code !== 200) {
            throw new Error(data.data || 'Failed to fetch prayer times')
        }

        const timings = data.data.timings
        const meta = data.data.meta

        return {
            success: true,
            timings: {
                fajr: timings.Fajr,
                sunrise: timings.Sunrise,
                dhuhr: timings.Dhuhr,
                asr: timings.Asr,
                sunset: timings.Sunset,
                maghrib: timings.Maghrib,
                isha: timings.Isha,
                imsak: timings.Imsak,
                midnight: timings.Midnight,
            },
            date: data.data.date,
            meta: {
                timezone: meta.timezone,
                method: meta.method,
                latitude: meta.latitude,
                longitude: meta.longitude,
            }
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Fetch Qibla direction for given coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<object>} Qibla direction in degrees
 */
export async function fetchQiblaDirection(latitude, longitude) {
    try {
        const url = `${BASE_URL}/qibla/${latitude}/${longitude}`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        if (data.code !== 200) {
            throw new Error(data.data || 'Failed to fetch Qibla direction')
        }

        return {
            success: true,
            direction: data.data.direction, // Degrees from North
            latitude: data.data.latitude,
            longitude: data.data.longitude,
        }
    } catch (error) {
        console.error('Error fetching Qibla direction:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<object>} User's coordinates
 */
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                })
            },
            (error) => {
                reject(error)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000, // Cache for 10 minutes
            }
        )
    })
}

/**
 * Helper: Determine the next upcoming prayer
 * @param {object} timings - Prayer timings object
 * @returns {object} Next prayer info { name, time, isActive }
 */
export function getNextPrayer(timings) {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    const prayers = [
        { id: 'fajr', name: 'Fajr', time: timings.fajr },
        { id: 'dhuhr', name: 'Dhuhr', time: timings.dhuhr },
        { id: 'asr', name: 'Asr', time: timings.asr },
        { id: 'maghrib', name: 'Maghrib', time: timings.maghrib },
        { id: 'isha', name: 'Isha', time: timings.isha },
    ]

    for (const prayer of prayers) {
        const [hours, mins] = prayer.time.split(':').map(Number)
        const prayerMinutes = hours * 60 + mins

        if (prayerMinutes > currentMinutes) {
            return {
                ...prayer,
                isNext: true,
                minutesUntil: prayerMinutes - currentMinutes,
            }
        }
    }

    // If all prayers have passed, next is Fajr tomorrow
    return {
        ...prayers[0],
        isNext: true,
        isTomorrow: true,
    }
}
