/**
 * MBTI Data - Comprehensive personality database
 * Based on 16personalities framework
 */

// 7-point Likert scale (same as real exam)
export const answerScale = [
    { value: -3, label: 'Strongly Disagree' },
    { value: -2, label: 'Disagree' },
    { value: -1, label: 'Slightly Disagree' },
    { value: 0, label: 'Neutral' },
    { value: 1, label: 'Slightly Agree' },
    { value: 2, label: 'Agree' },
    { value: 3, label: 'Strongly Agree' },
]

// MBTI Dimension Explanations
export const dimensionExplanations = {
    E: {
        letter: 'E',
        name: 'Extroversion',
        short: 'Energized by the outer world',
        description: 'Extroverts gain energy from interacting with others and the external world. They tend to be outgoing, talkative, and action-oriented. They often think out loud and prefer to work through problems with others.',
        traits: ['Outgoing', 'Sociable', 'Expressive', 'Action-oriented', 'Enthusiastic'],
        color: '#f59e0b'
    },
    I: {
        letter: 'I',
        name: 'Introversion',
        short: 'Energized by the inner world',
        description: 'Introverts gain energy from their inner world of ideas and reflection. They tend to be reserved, thoughtful, and prefer deep one-on-one conversations. They often need time alone to recharge.',
        traits: ['Reflective', 'Reserved', 'Independent', 'Deep thinker', 'Observant'],
        color: '#3b82f6'
    },
    S: {
        letter: 'S',
        name: 'Sensing',
        short: 'Focus on concrete facts',
        description: 'Sensors focus on concrete, tangible information gathered through their five senses. They prefer practical, real-world applications and pay attention to details and present realities.',
        traits: ['Practical', 'Detail-oriented', 'Realistic', 'Present-focused', 'Observant'],
        color: '#22c55e'
    },
    N: {
        letter: 'N',
        name: 'Intuition',
        short: 'Focus on patterns and possibilities',
        description: 'Intuitives focus on patterns, possibilities, and abstract concepts. They are drawn to the big picture, future possibilities, and theoretical frameworks. They often trust their hunches and imagination.',
        traits: ['Imaginative', 'Conceptual', 'Future-oriented', 'Innovative', 'Abstract thinker'],
        color: '#a855f7'
    },
    T: {
        letter: 'T',
        name: 'Thinking',
        short: 'Decide with logic',
        description: 'Thinkers make decisions based on objective logic and impersonal analysis. They value truth, fairness, and consistency. They tend to be analytical and may prioritize rationality over feelings.',
        traits: ['Logical', 'Analytical', 'Objective', 'Critical', 'Fair-minded'],
        color: '#ef4444'
    },
    F: {
        letter: 'F',
        name: 'Feeling',
        short: 'Decide with values',
        description: 'Feelers make decisions based on personal values and how choices affect others. They value harmony, compassion, and understanding. They tend to be empathetic and consider the human element.',
        traits: ['Empathetic', 'Compassionate', 'Harmonious', 'Warm', 'Values-driven'],
        color: '#ec4899'
    },
    J: {
        letter: 'J',
        name: 'Judging',
        short: 'Prefer structure and plans',
        description: 'Judgers prefer structure, organization, and decisive action. They like to plan ahead, meet deadlines, and have things settled. They feel most comfortable when life is orderly and predictable.',
        traits: ['Organized', 'Decisive', 'Structured', 'Punctual', 'Goal-oriented'],
        color: '#06b6d4'
    },
    P: {
        letter: 'P',
        name: 'Perceiving',
        short: 'Prefer flexibility and options',
        description: 'Perceivers prefer flexibility, spontaneity, and keeping options open. They adapt well to change and enjoy exploring possibilities. They feel most comfortable when life is open-ended.',
        traits: ['Flexible', 'Spontaneous', 'Adaptable', 'Open-minded', 'Curious'],
        color: '#f97316'
    },
    A: {
        letter: 'A',
        name: 'Assertive',
        short: 'Self-assured and resistant to stress',
        description: 'Assertive individuals are self-assured, even-tempered and resistant to stress. They refuse to worry too much and do not push themselves too hard when it comes to achieving goals.',
        traits: ['Confident', 'Relaxed', 'Resilient', 'Unfazed'],
        color: '#10b981'
    },
    T: {
        letter: 'T',
        name: 'Turbulent',
        short: 'Self-conscious and sensitive to stress',
        description: 'Turbulent individuals are self-conscious and sensitive to stress. They are likely to experience a wide range of emotions and to be success-driven, perfectionistic and eager to improve.',
        traits: ['Driven', 'Perfectionistic', 'Sensitive', 'Self-conscious'],
        color: '#f43f5e'
    }
}

// Enneagram Types
export const enneagramTypes = {
    1: { name: 'The Reformer', title: 'The Rational, Idealistic Type', traits: ['Principled', 'Purposeful', 'Self-Controlled', 'Perfectionistic'] },
    2: { name: 'The Helper', title: 'The Caring, Interpersonal Type', traits: ['Demonstrative', 'Generous', 'People-Pleasing', 'Possessive'] },
    3: { name: 'The Achiever', title: 'The Success-Oriented, Pragmatic Type', traits: ['Adaptive', 'Excelling', 'Driven', 'Image-Conscious'] },
    4: { name: 'The Individualist', title: 'The Sensitive, Introspective Type', traits: ['Expressive', 'Dramatic', 'Self-Absorbed', 'Temperamental'] },
    5: { name: 'The Investigator', title: 'The Intense, Cerebral Type', traits: ['Perceptive', 'Innovative', 'Secretive', 'Isolated'] },
    6: { name: 'The Loyalist', title: 'The Committed, Security-Oriented Type', traits: ['Engaging', 'Responsible', 'Anxious', 'Suspicious'] },
    7: { name: 'The Enthusiast', title: 'The Busy, Variety-Seeking Type', traits: ['Spontaneous', 'Versatile', 'Acquisitive', 'Scattered'] },
    8: { name: 'The Challenger', title: 'The Powerful, Dominating Type', traits: ['Self-Confident', 'Decisive', 'Willful', 'Confrontational'] },
    9: { name: 'The Peacemaker', title: 'The Easygoing, Self-Effacing Type', traits: ['Receptive', 'Reassuring', 'Agreeable', 'Complacent'] },
}

// Enneagram Assessment: 18 Questions (2 per type)
export const enneagramQuestions = [
    { id: 'en1', text: 'I prioritize being right and doing things correctly.', type: 1 },
    { id: 'en2', text: 'I tend to be self-critical and have high standards.', type: 1 },
    { id: 'en3', text: 'I find it easy to know what others need and feel.', type: 2 },
    { id: 'en4', text: 'I often put others\' needs before my own to feel loved.', type: 2 },
    { id: 'en5', text: 'I am very focused on achieving goals and being successful.', type: 3 },
    { id: 'en6', text: 'I care a lot about how others perceive my success.', type: 3 },
    { id: 'en7', text: 'I often feel that I am different from everyone else.', type: 4 },
    { id: 'en8', text: 'I am drawn to deep, complex emotions and authenticity.', type: 4 },
    { id: 'en9', text: 'I prefer to observe and analyze before getting involved.', type: 5 },
    { id: 'en10', text: 'I value my independence and private energy.', type: 5 },
    { id: 'en11', text: 'I am always thinking about potential risks and security.', type: 6 },
    { id: 'en12', text: 'I value loyalty and being part of a trusted group.', type: 6 },
    { id: 'en13', text: 'I am always looking for the next exciting experience.', type: 7 },
    { id: 'en14', text: 'I avoid pain and boredom at all costs.', type: 7 },
    { id: 'en15', text: 'I am not afraid of conflict and like to take charge.', type: 8 },
    { id: 'en16', text: 'I value strength and directness in myself and others.', type: 8 },
    { id: 'en17', text: 'I avoid conflict and try to keep things peaceful.', type: 9 },
    { id: 'en18', text: 'I find it easy to go along with what others want.', type: 9 },
]

// Calculate Enneagram from answers
export const calculateEnneagram = (answers) => {
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }

    enneagramQuestions.forEach(q => {
        const answer = answers[q.id] || 0
        scores[q.type] += answer
    })

    // Find the type with the highest score
    let topType = 1
    let maxScore = -Infinity

    Object.entries(scores).forEach(([type, score]) => {
        if (score > maxScore) {
            maxScore = score
            topType = Number(type)
        }
    })

    return topType
}

// Basic Assessment: 20 Questions (5 per dimension)
export const basicQuestions = {
    // E vs I (positive = E, negative = I)
    EI: [
        { id: 'ei1', text: 'I feel energized after spending time with a large group of people.', direction: 'E' },
        { id: 'ei2', text: 'I prefer to think through problems on my own before discussing them.', direction: 'I' },
        { id: 'ei3', text: 'I often initiate conversations with strangers.', direction: 'E' },
        { id: 'ei4', text: 'I need time alone to recharge after social events.', direction: 'I' },
        { id: 'ei5', text: 'I enjoy being the center of attention.', direction: 'E' },
    ],
    // S vs N (positive = N, negative = S)
    SN: [
        { id: 'sn1', text: 'I trust my gut feelings and hunches more than concrete facts.', direction: 'N' },
        { id: 'sn2', text: 'I focus on what is real and actual rather than what could be.', direction: 'S' },
        { id: 'sn3', text: 'I am drawn to abstract theories and concepts.', direction: 'N' },
        { id: 'sn4', text: 'I prefer practical, hands-on experience over theoretical knowledge.', direction: 'S' },
        { id: 'sn5', text: 'I often think about future possibilities and what might happen.', direction: 'N' },
    ],
    // T vs F (positive = F, negative = T)
    TF: [
        { id: 'tf1', text: 'I make decisions based on logic rather than feelings.', direction: 'T' },
        { id: 'tf2', text: 'I prioritize harmony and avoiding conflict in relationships.', direction: 'F' },
        { id: 'tf3', text: 'I value objective truth over personal feelings.', direction: 'T' },
        { id: 'tf4', text: 'I am deeply affected by others\' emotions.', direction: 'F' },
        { id: 'tf5', text: 'I believe fairness is more important than compassion.', direction: 'T' },
    ],
    // J vs P (positive = J, negative = P)
    JP: [
        { id: 'jp1', text: 'I prefer to have a detailed plan before starting a project.', direction: 'J' },
        { id: 'jp2', text: 'I enjoy spontaneity and keeping my options open.', direction: 'P' },
        { id: 'jp3', text: 'I like to complete tasks well before deadlines.', direction: 'J' },
        { id: 'jp4', text: 'I adapt easily to changing circumstances.', direction: 'P' },
        { id: 'jp5', text: 'I feel stressed when things are disorganized.', direction: 'J' },
    ],
}

// Extended Assessment: 100 Questions (for deep analysis + traits)
export const extendedQuestions = {
    EI: [
        ...basicQuestions.EI,
        { id: 'ei6', text: 'I speak up in group discussions without hesitation.', direction: 'E' },
        { id: 'ei7', text: 'I prefer written communication over phone calls.', direction: 'I' },
        { id: 'ei8', text: 'I find networking events exciting rather than draining.', direction: 'E' },
        { id: 'ei9', text: 'I need to process my thoughts internally before sharing.', direction: 'I' },
        { id: 'ei10', text: 'I have a wide circle of acquaintances.', direction: 'E' },
        { id: 'ei11', text: 'I prefer deep conversations with few people over small talk with many.', direction: 'I' },
        { id: 'ei12', text: 'I think out loud and often talk to process ideas.', direction: 'E' },
        { id: 'ei13', text: 'I feel drained after too much social interaction.', direction: 'I' },
        { id: 'ei14', text: 'I am comfortable being the first to introduce myself.', direction: 'E' },
        { id: 'ei15', text: 'I prefer working alone rather than in teams.', direction: 'I' },
        { id: 'ei16', text: 'I enjoy parties and social gatherings.', direction: 'E' },
        { id: 'ei17', text: 'I find it hard to share personal thoughts with others.', direction: 'I' },
        { id: 'ei18', text: 'I am energized by brainstorming sessions with others.', direction: 'E' },
        { id: 'ei19', text: 'I prefer observing before participating.', direction: 'I' },
        { id: 'ei20', text: 'I easily express my opinions in front of others.', direction: 'E' },
    ],
    SN: [
        ...basicQuestions.SN,
        { id: 'sn6', text: 'I pay attention to details that others miss.', direction: 'S' },
        { id: 'sn7', text: 'I often daydream about future scenarios.', direction: 'N' },
        { id: 'sn8', text: 'I trust experience over imagination.', direction: 'S' },
        { id: 'sn9', text: 'I see patterns and connections others don\'t notice.', direction: 'N' },
        { id: 'sn10', text: 'I prefer step-by-step instructions.', direction: 'S' },
        { id: 'sn11', text: 'I am fascinated by philosophical questions.', direction: 'N' },
        { id: 'sn12', text: 'I focus on the present moment.', direction: 'S' },
        { id: 'sn13', text: 'I enjoy exploring new ideas and concepts.', direction: 'N' },
        { id: 'sn14', text: 'I remember specific facts and details accurately.', direction: 'S' },
        { id: 'sn15', text: 'I get bored with routine and repetition.', direction: 'N' },
        { id: 'sn16', text: 'I am practical and down-to-earth.', direction: 'S' },
        { id: 'sn17', text: 'I am drawn to metaphors and symbolic meanings.', direction: 'N' },
        { id: 'sn18', text: 'I learn best through hands-on experience.', direction: 'S' },
        { id: 'sn19', text: 'I question established ways of doing things.', direction: 'N' },
        { id: 'sn20', text: 'I prefer proven methods over experimental ones.', direction: 'S' },
    ],
    TF: [
        ...basicQuestions.TF,
        { id: 'tf6', text: 'I can easily detach emotions from decision-making.', direction: 'T' },
        { id: 'tf7', text: 'I naturally sense how others are feeling.', direction: 'F' },
        { id: 'tf8', text: 'I value consistency and principles over exceptions.', direction: 'T' },
        { id: 'tf9', text: 'I go out of my way to make others feel included.', direction: 'F' },
        { id: 'tf10', text: 'I prefer honest feedback even if it\'s harsh.', direction: 'T' },
        { id: 'tf11', text: 'I find it hard to say no to people who need help.', direction: 'F' },
        { id: 'tf12', text: 'I analyze problems objectively without personal bias.', direction: 'T' },
        { id: 'tf13', text: 'I am moved by stories of human struggle and triumph.', direction: 'F' },
        { id: 'tf14', text: 'I believe debate leads to better solutions.', direction: 'T' },
        { id: 'tf15', text: 'I try to understand everyone\'s perspective in conflicts.', direction: 'F' },
        { id: 'tf16', text: 'I can critique ideas without criticizing people.', direction: 'T' },
        { id: 'tf17', text: 'I remember how situations made me feel.', direction: 'F' },
        { id: 'tf18', text: 'I focus on cause and effect when solving problems.', direction: 'T' },
        { id: 'tf19', text: 'I feel responsible for other people\'s happiness.', direction: 'F' },
        { id: 'tf20', text: 'I stay calm under pressure.', direction: 'T' },
    ],
    JP: [
        ...basicQuestions.JP,
        { id: 'jp6', text: 'I like to have things settled and decided.', direction: 'J' },
        { id: 'jp7', text: 'I prefer to go with the flow rather than stick to plans.', direction: 'P' },
        { id: 'jp8', text: 'I make lists and schedules to stay organized.', direction: 'J' },
        { id: 'jp9', text: 'I often change direction mid-project when I get new ideas.', direction: 'P' },
        { id: 'jp10', text: 'I feel accomplished when I check things off a list.', direction: 'J' },
        { id: 'jp11', text: 'I prefer to explore all options before deciding.', direction: 'P' },
        { id: 'jp12', text: 'I am punctual and expect others to be too.', direction: 'J' },
        { id: 'jp13', text: 'I work in bursts of energy rather than steadily.', direction: 'P' },
        { id: 'jp14', text: 'I prefer structure and clear expectations.', direction: 'J' },
        { id: 'jp15', text: 'I find strict deadlines limiting.', direction: 'P' },
        { id: 'jp16', text: 'I plan my weeks in advance.', direction: 'J' },
        { id: 'jp17', text: 'I enjoy the excitement of last-minute pressure.', direction: 'P' },
        { id: 'jp18', text: 'I prefer to finish one project before starting another.', direction: 'J' },
        { id: 'jp19', text: 'I am comfortable with ambiguity and uncertainty.', direction: 'P' },
        { id: 'jp20', text: 'I set clear goals and work systematically toward them.', direction: 'J' },
    ],
}

// 16 Personality Types Database
export const personalityTypes = {
    INTJ: {
        name: 'Architect',
        title: 'The Strategic Mastermind',
        description: 'Imaginative and strategic thinkers, with a plan for everything.',
        traits: ['Strategic', 'Independent', 'Analytical', 'Determined', 'Private'],
        strengths: ['Long-term planning', 'Systems thinking', 'Problem-solving', 'Research', 'Self-improvement'],
        weaknesses: ['Overly critical', 'Dismissive of emotions', 'Impatient'],
        skills: ['Strategic Planning', 'Systems Design', 'Research', 'Data Analysis', 'Critical Thinking', 'Writing', 'Project Management', 'Programming'],
        avatars: {
            male: '/avatars/male/INTJ.png',
            female: '/avatars/female/INTJ.png'
        }
    },
    INTP: {
        name: 'Logician',
        title: 'The Objective Analyst',
        description: 'Innovative inventors with an unquenchable thirst for knowledge.',
        traits: ['Analytical', 'Objective', 'Reserved', 'Flexible', 'Original'],
        strengths: ['Logical thinking', 'Pattern recognition', 'Problem-solving', 'Learning', 'Innovation'],
        weaknesses: ['Insensitive', 'Absent-minded', 'Condescending'],
        skills: ['Logic', 'Programming', 'Philosophy', 'Mathematics', 'Scientific Method', 'Analysis', 'Innovation', 'Abstract Thinking'],
        avatars: {
            male: '/avatars/male/INTP.png',
            female: '/avatars/female/INTP.png'
        }
    },
    ENTJ: {
        name: 'Commander',
        title: 'The Decisive Strategist',
        description: 'Bold, imaginative and strong-willed leaders.',
        traits: ['Strategic', 'Energetic', 'Self-confident', 'Strong-willed', 'Efficient'],
        strengths: ['Leadership', 'Strategic planning', 'Decision-making', 'Efficiency', 'Confidence'],
        weaknesses: ['Impatient', 'Arrogant', 'Cold'],
        skills: ['Leadership', 'Public Speaking', 'Decision Making', 'Project Management', 'Debate', 'Negotiation', 'Strategy', 'Business'],
        avatars: {
            male: '/avatars/male/ENTJ.png',
            female: '/avatars/female/ENTJ.png'
        }
    },
    ENTP: {
        name: 'Debater',
        title: 'The Enterprising Explorer',
        description: 'Smart and curious thinkers who cannot resist an intellectual challenge.',
        traits: ['Quick-witted', 'Clever', 'Charismatic', 'Energetic', 'Rebellious'],
        strengths: ['Brainstorming', 'Debate', 'Adapting', 'Innovation', 'Networking'],
        weaknesses: ['Argumentative', 'Insensitive', 'Unfocused'],
        skills: ['Debate', 'Innovation', 'Brainstorming', 'Entrepreneurship', 'Networking', 'Problem Solving', 'Communication', 'Improvisation'],
        avatars: {
            male: '/avatars/male/ENTP.png',
            female: '/avatars/female/ENTP.png'
        }
    },
    INFJ: {
        name: 'Advocate',
        title: 'The Insightful Visionary',
        description: 'Quiet and mystical, yet very inspiring and tireless idealists.',
        traits: ['Insightful', 'Principled', 'Compassionate', 'Private', 'Creative'],
        strengths: ['Understanding others', 'Counseling', 'Writing', 'Vision', 'Dedication'],
        weaknesses: ['Perfectionistic', 'Avoidant', 'Burnout-prone'],
        skills: ['Counseling', 'Writing', 'Psychology', 'Empathy', 'Vision', 'Creativity', 'Teaching', 'Healing'],
        avatars: {
            male: '/avatars/male/INFJ.png',
            female: '/avatars/female/INFJ.png'
        }
    },
    INFP: {
        name: 'Mediator',
        title: 'The Thoughtful Idealist',
        description: 'Poetic, kind and altruistic people, always eager to help a good cause.',
        traits: ['Idealistic', 'Empathetic', 'Creative', 'Passionate', 'Reserved'],
        strengths: ['Creativity', 'Empathy', 'Writing', 'Understanding values', 'Authenticity'],
        weaknesses: ['Impractical', 'Self-isolating', 'Overly idealistic'],
        skills: ['Creative Writing', 'Empathy', 'Art', 'Music', 'Poetry', 'Counseling', 'Imagination', 'Self-expression'],
        avatars: {
            male: '/avatars/male/INFP.png',
            female: '/avatars/female/INFP.png'
        }
    },
    ENFJ: {
        name: 'Protagonist',
        title: 'The Charismatic Leader',
        description: 'Charismatic and inspiring leaders, able to mesmerize their listeners.',
        traits: ['Charismatic', 'Empathetic', 'Organized', 'Diplomatic', 'Passionate'],
        strengths: ['Leadership', 'Teaching', 'Inspiring', 'Organizing', 'Communication'],
        weaknesses: ['Overly idealistic', 'Too selfless', 'Sensitive to criticism'],
        skills: ['Leadership', 'Teaching', 'Public Speaking', 'Coaching', 'Diplomacy', 'Team Building', 'Mentoring', 'Communication'],
        avatars: {
            male: '/avatars/male/ENFJ.png',
            female: '/avatars/female/ENFJ.png'
        }
    },
    ENFP: {
        name: 'Campaigner',
        title: 'The Enthusiastic Idealist',
        description: 'Enthusiastic, creative and sociable free spirits.',
        traits: ['Enthusiastic', 'Creative', 'Sociable', 'Optimistic', 'Curious'],
        strengths: ['Creativity', 'Connecting with others', 'Enthusiasm', 'Flexibility', 'Communication'],
        weaknesses: ['Unfocused', 'Disorganized', 'Overly accommodating'],
        skills: ['Creativity', 'Networking', 'Brainstorming', 'Communication', 'Inspiration', 'Storytelling', 'Improvisation', 'Art'],
        avatars: {
            male: '/avatars/male/ENFP.png',
            female: '/avatars/female/ENFP.png'
        }
    },
    ISTJ: {
        name: 'Logistician',
        title: 'The Responsible Realist',
        description: 'Practical and fact-minded individuals, whose reliability cannot be doubted.',
        traits: ['Responsible', 'Thorough', 'Dependable', 'Calm', 'Organized'],
        strengths: ['Organization', 'Reliability', 'Attention to detail', 'Dedication', 'Integrity'],
        weaknesses: ['Stubborn', 'Insensitive', 'Rigid'],
        skills: ['Organization', 'Administration', 'Data Management', 'Accounting', 'Quality Control', 'Documentation', 'Process Improvement', 'Logistics'],
        avatars: {
            male: '/avatars/male/ISTJ.png',
            female: '/avatars/female/ISTJ.png'
        }
    },
    ISFJ: {
        name: 'Defender',
        title: 'The Practical Helper',
        description: 'Very dedicated and warm protectors, always ready to defend their loved ones.',
        traits: ['Supportive', 'Reliable', 'Patient', 'Observant', 'Loyal'],
        strengths: ['Supporting others', 'Reliability', 'Patience', 'Memory for details', 'Practical help'],
        weaknesses: ['Reluctant to change', 'Overload themselves', 'Shy'],
        skills: ['Caregiving', 'Organization', 'Support', 'Healthcare', 'Teaching', 'Cooking', 'Hospitality', 'Administration'],
        avatars: {
            male: '/avatars/male/ISFJ.png',
            female: '/avatars/female/ISFJ.png'
        }
    },
    ESTJ: {
        name: 'Executive',
        title: 'The Efficient Organizer',
        description: 'Excellent administrators, unsurpassed at managing things or people.',
        traits: ['Organized', 'Logical', 'Assertive', 'Dedicated', 'Direct'],
        strengths: ['Managing', 'Organizing', 'Creating order', 'Leadership', 'Dedication'],
        weaknesses: ['Inflexible', 'Judgmental', 'Too focused on status'],
        skills: ['Management', 'Organization', 'Leadership', 'Administration', 'Decision Making', 'Delegation', 'Operations', 'Efficiency'],
        avatars: {
            male: '/avatars/male/ESTJ.png',
            female: '/avatars/female/ESTJ.png'
        }
    },
    ESFJ: {
        name: 'Consul',
        title: 'The Supportive Contributor',
        description: 'Extraordinarily caring, social and popular people.',
        traits: ['Caring', 'Sociable', 'Loyal', 'Sensitive', 'Warm'],
        strengths: ['Caring for others', 'Organizing events', 'Building community', 'Loyalty', 'Practical support'],
        weaknesses: ['Needy', 'Too selfless', 'Sensitive to criticism'],
        skills: ['Event Planning', 'Community Building', 'Hospitality', 'Customer Service', 'Teaching', 'Healthcare', 'Communication', 'Team Coordination'],
        avatars: {
            male: '/avatars/male/ESFJ.png',
            female: '/avatars/female/ESFJ.png'
        }
    },
    ISTP: {
        name: 'Virtuoso',
        title: 'The Logical Pragmatist',
        description: 'Bold and practical experimenters, masters of all kinds of tools.',
        traits: ['Practical', 'Observant', 'Analytical', 'Adaptable', 'Reserved'],
        strengths: ['Troubleshooting', 'Hands-on work', 'Staying calm', 'Logic', 'Efficiency'],
        weaknesses: ['Insensitive', 'Risky behavior', 'Private'],
        skills: ['Mechanics', 'Engineering', 'Troubleshooting', 'Craftsmanship', 'Sports', 'Driving', 'Problem Solving', 'Tool Mastery'],
        avatars: {
            male: '/avatars/male/ISTP.png',
            female: '/avatars/female/ISTP.png'
        }
    },
    ISFP: {
        name: 'Adventurer',
        title: 'The Versatile Supporter',
        description: 'Flexible and charming artists, always ready to explore and experience something new.',
        traits: ['Artistic', 'Sensitive', 'Warm', 'Curious', 'Adaptable'],
        strengths: ['Artistic expression', 'Sensitivity', 'Hands-on creativity', 'Adaptability', 'Living in the moment'],
        weaknesses: ['Fiercely independent', 'Unpredictable', 'Easily stressed'],
        skills: ['Art', 'Music', 'Design', 'Photography', 'Fashion', 'Nature', 'Cooking', 'Crafts'],
        avatars: {
            male: '/avatars/male/ISFP.png',
            female: '/avatars/female/ISFP.png'
        }
    },
    ESTP: {
        name: 'Entrepreneur',
        title: 'The Energetic Problem-Solver',
        description: 'Smart, energetic and very perceptive people who truly enjoy living on the edge.',
        traits: ['Energetic', 'Perceptive', 'Bold', 'Direct', 'Sociable'],
        strengths: ['Taking action', 'Reading people', 'Quick thinking', 'Risk-taking', 'Networking'],
        weaknesses: ['Impatient', 'Risk-prone', 'Unstructured'],
        skills: ['Sales', 'Negotiation', 'Sports', 'Crisis Management', 'Entrepreneurship', 'Performance', 'Marketing', 'Leadership'],
        avatars: {
            male: '/avatars/male/ESTP.png',
            female: '/avatars/female/ESTP.png'
        }
    },
    ESFP: {
        name: 'Entertainer',
        title: 'The Spontaneous Energizer',
        description: 'Spontaneous, energetic and enthusiastic people – life is never boring around them.',
        traits: ['Spontaneous', 'Energetic', 'Friendly', 'Fun-loving', 'Practical'],
        strengths: ['Entertaining', 'Enjoying life', 'Practical help', 'Social skills', 'Adapting'],
        weaknesses: ['Easily bored', 'Poor long-term planning', 'Unfocused'],
        skills: ['Performance', 'Entertainment', 'Social Skills', 'Event Hosting', 'Sales', 'Fashion', 'Sports', 'Hospitality'],
        avatars: {
            male: '/avatars/male/ESFP.png',
            female: '/avatars/female/ESFP.png'
        }
    },
}

// Age-based life categories for progress display
export const lifeCategories = [
    { key: 'health', name: 'Health', icon: '💪', color: '#22c55e' },
    { key: 'academy', name: 'Academy', icon: '📚', color: '#3b82f6' },
    { key: 'career', name: 'Career', icon: '💼', color: '#f59e0b' },
    { key: 'talent', name: 'Talent', icon: '🎯', color: '#ec4899' },
    { key: 'skills', name: 'Skills', icon: '⚡', color: '#8b5cf6' },
    { key: 'religion', name: 'Spirituality', icon: '🕯️', color: '#a855f7' },
    { key: 'imagination', name: 'Imagination', icon: '✨', color: '#f97316' },
    { key: 'social', name: 'Social', icon: '👥', color: '#06b6d4' },
]

// Generate random starter skills based on personality type
export const generateStarterSkills = (mbtiType, answers = {}) => {
    const personality = personalityTypes[mbtiType]
    if (!personality) return []

    // Get all possible skills for this type
    const possibleSkills = [...personality.skills]

    // Shuffle and pick 5
    const shuffled = possibleSkills.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5).map((skillName, index) => ({
        id: Date.now() + index,
        title: skillName,
        type: 'skill',
        content: `Innate ${mbtiType} trait`,
        hours: Math.floor(Math.random() * 50) + 10, // Random 10-60 hours
        source: 'personality',
        createdAt: new Date().toISOString(),
    }))
}

// Calculate MBTI from answers
export const calculateMBTI = (answers, questions) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

    // Process each dimension
    Object.entries(questions).forEach(([dimension, qs]) => {
        qs.forEach(q => {
            const answer = answers[q.id] || 0
            if (q.direction === dimension[0]) {
                scores[dimension[0]] += answer
            } else {
                scores[dimension[1]] += answer
            }
        })
    })

    // Calculate percentages and type
    const calcPercentage = (a, b) => {
        const total = Math.abs(scores[a]) + Math.abs(scores[b])
        if (total === 0) return { [a]: 50, [b]: 50 }
        const pctA = Math.round((Math.abs(scores[a]) / total) * 100)
        return { [a]: pctA, [b]: 100 - pctA }
    }

    const eiPct = calcPercentage('E', 'I')
    const snPct = calcPercentage('S', 'N')
    const tfPct = calcPercentage('T', 'F')
    const jpPct = calcPercentage('J', 'P')

    const type =
        (eiPct.E >= eiPct.I ? 'E' : 'I') +
        (snPct.S >= snPct.N ? 'S' : 'N') +
        (tfPct.T >= tfPct.F ? 'T' : 'F') +
        (jpPct.J >= jpPct.P ? 'J' : 'P')

    return {
        type,
        percentages: {
            E: eiPct.E, I: eiPct.I,
            S: snPct.S, N: snPct.N,
            T: tfPct.T, F: tfPct.F,
            J: jpPct.J, P: jpPct.P,
        }
    }
}
