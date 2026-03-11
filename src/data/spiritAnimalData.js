/**
 * Spirit Animal Data
 * Associated with MBTI types, Enneagram, and Zodiac signs
 */

export const spiritAnimals = [
    {
        id: 'owl',
        name: 'Owl',
        symbol: '🦉',
        traits: ['Strategic', 'Wise', 'Independent'],
        description: 'The Architect\'s companion. You see through the dark and plan three steps ahead.',
        mbti: 'INTJ'
    },
    {
        id: 'raven',
        name: 'Raven',
        symbol: '🐦‍⬛',
        traits: ['Analytical', 'Curious', 'Mysterious'],
        description: 'The Logician\'s shadow. You solve puzzles others don\'t even see.',
        mbti: 'INTP'
    },
    {
        id: 'lion',
        name: 'Lion',
        symbol: '🦁',
        traits: ['Commanding', 'Bold', 'Protective'],
        description: 'The Commander\'s spirit. You lead with authority and protect your pride.',
        mbti: 'ENTJ'
    },
    {
        id: 'fox',
        name: 'Fox',
        symbol: '🦊',
        traits: ['Cunning', 'Adaptable', 'Quick-witted'],
        description: 'The Debater\'s ally. You find the path where others see only walls.',
        mbti: 'ENTP'
    },
    {
        id: 'wolf',
        name: 'Wolf',
        symbol: '�',
        traits: ['Intuitive', 'Loyal', 'Private'],
        description: 'The Advocate\'s guide. A lone soul with a deep connection to the pack.',
        mbti: 'INFJ'
    },
    {
        id: 'butterfly',
        name: 'Butterfly',
        symbol: '🦋',
        traits: ['Idealistic', 'Transformative', 'Gentle'],
        description: 'The Mediator\'s essence. You bring beauty and change through quiet grace.',
        mbti: 'INFP'
    },
    {
        id: 'elephant',
        name: 'Elephant',
        symbol: '🐘',
        traits: ['Compassionate', 'Wise', 'Reliable'],
        description: 'The Protagonist\'s heart. You remember every kindness and lead with empathy.',
        mbti: 'ENFJ'
    },
    {
        id: 'dolphin',
        name: 'Dolphin',
        symbol: '🐬',
        traits: ['Playful', 'Social', 'Intelligent'],
        description: 'The Campaigner\'s energy. You bridge worlds with joy and intelligence.',
        mbti: 'ENFP'
    },
    {
        id: 'stag',
        name: 'Stag',
        symbol: '🦌',
        traits: ['Noble', 'Responsible', 'Traditional'],
        description: 'The Logistician\'s strength. You stand tall in your duty and honor.',
        mbti: 'ISTJ'
    },
    {
        id: 'bear',
        name: 'Bear',
        symbol: '🐻',
        traits: ['Protective', 'Warm', 'Grounded'],
        description: 'The Defender\'s power. You are the rock that provides safety and warmth.',
        mbti: 'ISFJ'
    },
    {
        id: 'eagle',
        name: 'Eagle',
        symbol: '🦅',
        traits: ['Effecient', 'Direct', 'Vigilant'],
        description: 'The Executive\'s vision. You see the goal clearly and strike with precision.',
        mbti: 'ESTJ'
    },
    {
        id: 'swan',
        name: 'Swan',
        symbol: '🦢',
        traits: ['Graceful', 'Social', 'Harmonious'],
        description: 'The Consul\'s beauty. You create harmony in every lake you swim in.',
        mbti: 'ESFJ'
    },
    {
        id: 'tiger',
        name: 'Tiger',
        symbol: '🐅',
        traits: ['Tactical', 'Independent', 'Fearless'],
        description: 'The Virtuoso\'s edge. You master the tools of the world with silent power.',
        mbti: 'ISTP'
    },
    {
        id: 'hummingbird',
        name: 'Hummingbird',
        symbol: '🐦',
        traits: ['Artistic', 'Vibrant', 'Adaptable'],
        description: 'The Adventurer\'s soul. You find sweetness in every moment of exploration.',
        mbti: 'ISFP'
    },
    {
        id: 'stallion',
        name: 'Stallion',
        symbol: '🐎',
        traits: ['Bold', 'Energetic', 'Perceptive'],
        description: 'The Entrepreneur\'s fire. You run toward the edge where life is most alive.',
        mbti: 'ESTP'
    },
    {
        id: 'peacock',
        name: 'Peacock',
        symbol: '🦚',
        traits: ['Vibrant', 'Social', 'Spontaneous'],
        description: 'The Entertainer\'s flair. You turn every moment into a performance of joy.',
        mbti: 'ESFP'
    }
]

/**
 * Get spirit animal based on MBTI
 */
export const getSpiritAnimal = (mbti) => {
    return spiritAnimals.find(a => a.mbti === mbti) || spiritAnimals[0]
}
