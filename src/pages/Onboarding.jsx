import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Sparkles, ArrowRight, ArrowLeft, User, Calendar, Brain, HelpCircle, Check, Edit3, Heart } from 'lucide-react'
import MBTIAssessment from '../components/MBTIAssessment'
import { personalityTypes, generateStarterSkills, lifeCategories } from '../data/mbtiData'
import { religions } from '../data/religionData'

const mbtiTypes = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP',
]

export default function Onboarding() {
    const { completeOnboarding, addRealmEntry } = useStore()
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        birthTime: '', // Optional: HH:MM format
        mbti: '',
        mbtiScores: null,
        mbtiPath: null, // 'know', 'test', 'manual', 'skip'
        religion: null,
        customReligion: '',
    })

    const calculateAge = (birthDate) => {
        const today = new Date()
        const birth = new Date(birthDate)
        let age = today.getFullYear() - birth.getFullYear()
        const monthDiff = today.getMonth() - birth.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
        }
        return age
    }

    const handleComplete = () => {
        const age = formData.birthDate ? calculateAge(formData.birthDate) : null

        // Generate starter skills if MBTI is set
        let starterSkills = []
        if (formData.mbti && personalityTypes[formData.mbti]) {
            starterSkills = generateStarterSkills(formData.mbti)
        }

        // Complete onboarding
        completeOnboarding({
            name: formData.name,
            birthDate: formData.birthDate,
            birthTime: formData.birthTime || null,
            age,
            mbti: formData.mbti,
            mbtiScores: formData.mbtiScores,
            religion: formData.religion,
            customReligion: formData.customReligion,
        })

        // Add starter skills to Cerebra
        starterSkills.forEach(skill => {
            addRealmEntry('cerebra', skill)
        })
    }

    const handleAssessmentComplete = (result) => {
        setFormData(prev => ({
            ...prev,
            mbti: result.type,
            mbtiScores: result.percentages,
        }))
        setStep(5) // Go to results
    }

    const handleManualPercentages = (scores) => {
        // Calculate type from manual percentages
        const type =
            (scores.E >= scores.I ? 'E' : 'I') +
            (scores.S >= scores.N ? 'S' : 'N') +
            (scores.T >= scores.F ? 'T' : 'F') +
            (scores.J >= scores.P ? 'J' : 'P')

        setFormData(prev => ({
            ...prev,
            mbti: type,
            mbtiScores: scores,
        }))
        setStep(5)
    }

    // Step Components
    const WelcomeStep = () => (
        <div className="text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="mb-lg"
            >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌌</div>
            </motion.div>
            <h1 className="font-display mb-md" style={{ fontSize: '2.5rem' }}>
                AFTERLIFE
            </h1>
            <p className="text-secondary mb-lg" style={{ maxWidth: '400px', margin: '0 auto' }}>
                Your personal operating system that remembers, organizes, and evolves with you.
            </p>
            <button className="btn btn-primary" onClick={() => setStep(1)}>
                Begin Your Journey <ArrowRight size={18} />
            </button>
        </div>
    )

    const NameStep = () => (
        <div className="text-center">
            <div className="realm-icon mb-lg" style={{ margin: '0 auto', background: 'var(--accent-primary)' }}>
                <User size={24} />
            </div>
            <h2 className="mb-md">What should I call you?</h2>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="onboarding-input"
                autoFocus
            />
            <div className="flex gap-md justify-center mt-xl">
                <button className="btn btn-ghost" onClick={() => setStep(0)}>Back</button>
                <button
                    className="btn btn-primary"
                    onClick={() => setStep(2)}
                    disabled={!formData.name.trim()}
                >
                    Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )

    const BirthDateStep = () => {
        const currentYear = new Date().getFullYear()
        const currentYearShort = currentYear % 100 // e.g., 26 for 2026
        const months = [
            { value: '01', label: 'January' },
            { value: '02', label: 'February' },
            { value: '03', label: 'March' },
            { value: '04', label: 'April' },
            { value: '05', label: 'May' },
            { value: '06', label: 'June' },
            { value: '07', label: 'July' },
            { value: '08', label: 'August' },
            { value: '09', label: 'September' },
            { value: '10', label: 'October' },
            { value: '11', label: 'November' },
            { value: '12', label: 'December' },
        ]

        // Local state for the 2-digit year input
        const [yearInput, setYearInput] = useState('')
        const [fullYear, setFullYear] = useState('')

        // Parse existing date or use defaults
        const [storedYear, month, day] = formData.birthDate
            ? formData.birthDate.split('-')
            : ['', '', '']

        // Initialize yearInput from stored data
        useState(() => {
            if (storedYear) {
                setYearInput(storedYear.slice(-2))
                setFullYear(storedYear)
            }
        })

        // Auto-complete 2-digit year to 4-digit
        const handleYearChange = (value) => {
            // Only allow digits, max 2 characters
            const cleaned = value.replace(/\D/g, '').slice(0, 2)
            setYearInput(cleaned)

            if (cleaned.length === 2) {
                const num = parseInt(cleaned, 10)
                // If <= current year's last 2 digits, assume 2000s; otherwise 1900s
                const full = num <= currentYearShort ? 2000 + num : 1900 + num
                setFullYear(full.toString())

                // Auto-update the date if we have month and day
                if (month && day) {
                    setFormData({ ...formData, birthDate: `${full}-${month}-${day.padStart(2, '0')}` })
                }
            } else {
                setFullYear('')
            }
        }

        const updateDate = (newYear, newMonth, newDay) => {
            if (newYear && newMonth && newDay) {
                setFormData({ ...formData, birthDate: `${newYear}-${newMonth}-${newDay.padStart(2, '0')}` })
            }
        }

        // Get days in selected month
        const yearForCalc = fullYear || storedYear || currentYear.toString()
        const daysInMonth = month
            ? new Date(parseInt(yearForCalc), parseInt(month), 0).getDate()
            : 31
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

        const displayYear = fullYear || storedYear

        return (
            <div className="text-center">
                <div className="realm-icon mb-lg" style={{ margin: '0 auto', background: 'var(--realm-empyra)' }}>
                    <Calendar size={24} />
                </div>
                <h2 className="mb-md">When were you born?</h2>
                <p className="text-secondary text-sm mb-lg">This helps track your life timeline</p>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Year Input - 2 digits with auto-complete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <input
                            type="text"
                            value={yearInput || (storedYear ? storedYear.slice(-2) : '')}
                            onChange={(e) => handleYearChange(e.target.value)}
                            placeholder="YY"
                            className="onboarding-input"
                            style={{ width: '60px', textAlign: 'center' }}
                            maxLength={2}
                        />
                        {displayYear && (
                            <span style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', minWidth: '45px' }}>
                                → {displayYear}
                            </span>
                        )}
                    </div>

                    {/* Month Dropdown */}
                    <select
                        value={month}
                        onChange={(e) => updateDate(displayYear || currentYear.toString(), e.target.value, day || '01')}
                        className="onboarding-input"
                        style={{ width: 'auto', minWidth: '120px' }}
                    >
                        <option value="">Month</option>
                        {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>

                    {/* Day Dropdown */}
                    <select
                        value={day ? parseInt(day).toString() : ''}
                        onChange={(e) => updateDate(displayYear || currentYear.toString(), month || '01', e.target.value)}
                        className="onboarding-input"
                        style={{ width: 'auto', minWidth: '80px' }}
                    >
                        <option value="">Day</option>
                        {days.map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                {/* Optional Birth Time */}
                <div style={{ marginTop: '1.5rem' }}>
                    <p className="text-secondary text-xs mb-sm" style={{ marginBottom: '0.5rem' }}>
                        Optional: Time of birth (for precise age tracking)
                    </p>
                    <input
                        type="time"
                        value={formData.birthTime}
                        onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                        className="onboarding-input"
                        style={{ width: 'auto' }}
                    />
                </div>

                <div className="flex gap-md justify-center mt-xl">
                    <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(3)}
                        disabled={!displayYear || !month || !day}
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )
    }

    const MBTIChoiceStep = () => (
        <div className="text-center">
            <div className="realm-icon mb-lg" style={{ margin: '0 auto', background: 'var(--realm-cerebra)' }}>
                <Brain size={24} />
            </div>
            <h2 className="mb-md">Discover Your Personality</h2>
            <p className="text-secondary text-sm mb-xl">How would you like to proceed?</p>

            <div className="mbti-choice-grid">
                <button
                    className="choice-card glass-card"
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'know' }); setStep(4) }}
                >
                    <Check size={32} className="mb-sm" style={{ color: 'var(--accent-primary)' }} />
                    <h3>I Know My Type</h3>
                    <p className="text-secondary text-sm">Select from 16 personalities</p>
                </button>

                <button
                    className="choice-card glass-card"
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'test' }); setStep(4) }}
                >
                    <HelpCircle size={32} className="mb-sm" style={{ color: '#f59e0b' }} />
                    <h3>Take The Test</h3>
                    <p className="text-secondary text-sm">20 questions to find out</p>
                </button>

                <button
                    className="choice-card glass-card"
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'manual' }); setStep(4) }}
                >
                    <Edit3 size={32} className="mb-sm" style={{ color: '#8b5cf6' }} />
                    <h3>Enter My Percentages</h3>
                    <p className="text-secondary text-sm">I know my exact scores</p>
                </button>
            </div>

            <div className="flex gap-md justify-center mt-xl">
                <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                <button
                    className="btn btn-ghost text-secondary"
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'skip' }); setStep(5) }}
                >
                    Skip for now
                </button>
            </div>
        </div>
    )

    const MBTIPathStep = () => {
        if (formData.mbtiPath === 'know') {
            return <MBTISelectionGrid />
        } else if (formData.mbtiPath === 'test') {
            return (
                <MBTIAssessment
                    mode="basic"
                    onComplete={handleAssessmentComplete}
                    onBack={() => setStep(3)}
                />
            )
        } else if (formData.mbtiPath === 'manual') {
            return <ManualPercentagesEntry />
        }
        return null
    }

    const MBTISelectionGrid = () => (
        <div className="text-center">
            <h2 className="mb-md">Select Your Type</h2>
            <p className="text-secondary text-sm mb-lg">Choose your 16personalities type</p>
            <div className="mbti-grid">
                {mbtiTypes.map((type) => (
                    <button
                        key={type}
                        className={`mbti-btn ${formData.mbti === type ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, mbti: type })}
                    >
                        <span className="mbti-type">{type}</span>
                        <span className="mbti-name text-xs">{personalityTypes[type]?.name}</span>
                    </button>
                ))}
            </div>
            <div className="flex gap-md justify-center mt-xl">
                <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
                <button
                    className="btn btn-primary"
                    onClick={() => setStep(5)}
                    disabled={!formData.mbti}
                >
                    Continue <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )

    const ManualPercentagesEntry = () => {
        const [scores, setScores] = useState({
            E: 50, I: 50, S: 50, N: 50, T: 50, F: 50, J: 50, P: 50
        })

        const updateDimension = (dim1, dim2, value) => {
            setScores(prev => ({
                ...prev,
                [dim1]: value,
                [dim2]: 100 - value,
            }))
        }

        return (
            <div className="text-center">
                <h2 className="mb-md">Enter Your Percentages</h2>
                <p className="text-secondary text-sm mb-xl">Slide to set your dimension percentages</p>

                <div className="percentage-sliders">
                    {[
                        { d1: 'E', d2: 'I', label1: 'Extraverted', label2: 'Introverted' },
                        { d1: 'S', d2: 'N', label1: 'Observant', label2: 'Intuitive' },
                        { d1: 'T', d2: 'F', label1: 'Thinking', label2: 'Feeling' },
                        { d1: 'J', d2: 'P', label1: 'Judging', label2: 'Prospecting' },
                    ].map(({ d1, d2, label1, label2 }) => (
                        <div key={d1} className="slider-row mb-lg">
                            <div className="flex justify-between text-sm mb-xs">
                                <span style={{ color: scores[d1] > 50 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                                    {label1} ({scores[d1]}%)
                                </span>
                                <span style={{ color: scores[d2] > 50 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                                    {label2} ({scores[d2]}%)
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={scores[d1]}
                                onChange={(e) => updateDimension(d1, d2, parseInt(e.target.value))}
                                className="percentage-slider"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-md justify-center mt-xl">
                    <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleManualPercentages(scores)}
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )
    }

    // Religion Selection Step
    const ReligionStep = () => {
        const [showCustomInput, setShowCustomInput] = useState(false)

        const handleReligionSelect = (religionId) => {
            if (religionId === 'other') {
                setShowCustomInput(true)
                setFormData(prev => ({ ...prev, religion: 'other' }))
            } else {
                setShowCustomInput(false)
                setFormData(prev => ({ ...prev, religion: religionId, customReligion: '' }))
            }
        }

        return (
            <div className="text-center">
                <div className="realm-icon mb-lg" style={{ margin: '0 auto', background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
                    <Heart size={24} />
                </div>
                <h2 className="mb-md">What's your spiritual path?</h2>
                <p className="text-secondary text-sm mb-lg">This is optional and helps personalize your spiritual tracking</p>

                <div className="religion-grid">
                    {religions.map((religion) => (
                        <motion.button
                            key={religion.id}
                            className={`religion-btn ${formData.religion === religion.id ? 'active' : ''}`}
                            onClick={() => handleReligionSelect(religion.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                '--religion-color': religion.color,
                            }}
                        >
                            <span className="religion-icon">{religion.icon}</span>
                            <span className="religion-name">{religion.name}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Custom religion input */}
                {showCustomInput && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-lg"
                    >
                        <input
                            type="text"
                            value={formData.customReligion}
                            onChange={(e) => setFormData(prev => ({ ...prev, customReligion: e.target.value }))}
                            placeholder="Enter your religion or spiritual path..."
                            className="onboarding-input"
                            style={{ maxWidth: '300px' }}
                        />
                    </motion.div>
                )}

                <div className="flex gap-md justify-center mt-xl">
                    <button className="btn btn-ghost" onClick={() => setStep(4)}>Back</button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => {
                            setFormData(prev => ({ ...prev, religion: null, customReligion: '' }))
                            setStep(6)
                        }}
                    >
                        Skip for now
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(6)}
                        disabled={formData.religion === 'other' && !formData.customReligion}
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )
    }

    const ResultsStep = () => {
        const personality = personalityTypes[formData.mbti]
        const age = formData.birthDate ? calculateAge(formData.birthDate) : null

        return (
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="result-badge mb-lg"
                >
                    <span className="result-type">{formData.mbti}</span>
                    <span className="result-name">{personality?.name}</span>
                </motion.div>

                <h2 className="mb-sm">{personality?.title}</h2>
                <p className="text-secondary mb-xl" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    {personality?.description}
                </p>

                {/* Percentage Breakdown */}
                {formData.mbtiScores && (
                    <div className="percentage-breakdown glass-card p-lg mb-xl">
                        <h3 className="text-sm text-secondary mb-md uppercase tracking-wider">Your Dimensions</h3>
                        <div className="dimensions-grid">
                            {[
                                { d1: 'E', d2: 'I', label1: 'Extraverted', label2: 'Introverted', color: '#4a9eff' },
                                { d1: 'S', d2: 'N', label1: 'Observant', label2: 'Intuitive', color: '#f59e0b' },
                                { d1: 'T', d2: 'F', label1: 'Thinking', label2: 'Feeling', color: '#22c55e' },
                                { d1: 'J', d2: 'P', label1: 'Judging', label2: 'Prospecting', color: '#a855f7' },
                            ].map(({ d1, d2, label1, label2, color }) => (
                                <div key={d1} className="dimension-row">
                                    <div className="dimension-labels flex justify-between text-xs mb-xs">
                                        <span>{label1}</span>
                                        <span>{label2}</span>
                                    </div>
                                    <div className="dimension-bar">
                                        <motion.div
                                            className="dimension-fill"
                                            initial={{ width: '50%' }}
                                            animate={{ width: `${formData.mbtiScores[d1]}%` }}
                                            style={{ backgroundColor: color }}
                                        />
                                    </div>
                                    <div className="dimension-values flex justify-between text-sm font-mono mt-xs">
                                        <span style={{ color: formData.mbtiScores[d1] > 50 ? color : 'inherit' }}>
                                            {formData.mbtiScores[d1]}%
                                        </span>
                                        <span style={{ color: formData.mbtiScores[d2] > 50 ? color : 'inherit' }}>
                                            {formData.mbtiScores[d2]}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Age Progress Message */}
                {age && (
                    <div className="age-message glass-card p-md mb-xl">
                        <p className="text-sm">
                            At <strong>{age} years old</strong>, you've begun your journey.
                            <br />
                            <span className="text-secondary">5 starter skills based on your personality will be added to Cerebra.</span>
                        </p>
                    </div>
                )}

                <button className="btn btn-primary btn-lg" onClick={handleComplete}>
                    Enter AfterLife <Sparkles size={18} />
                </button>
            </div>
        )
    }

    const steps = [
        { component: <WelcomeStep /> },
        { component: <NameStep /> },
        { component: <BirthDateStep /> },
        { component: <MBTIChoiceStep /> },
        { component: <MBTIPathStep /> },
        { component: <ReligionStep /> },
        { component: <ResultsStep /> },
    ]

    return (
        <div className="onboarding-container">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="onboarding-content"
                >
                    {steps[step].component}
                </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="onboarding-progress">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className={`progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                    />
                ))}
            </div>

            <style>{`
        .onboarding-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
          background: radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 70%);
        }

        .onboarding-content {
          max-width: 600px;
          width: 100%;
        }

        .onboarding-input {
          width: 100%;
          max-width: 300px;
          padding: var(--space-md) var(--space-lg);
          font-size: 1rem;
          font-family: var(--font-primary);
          color: var(--text-primary);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          outline: none;
          transition: all var(--transition-fast);
        }

        .onboarding-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .mbti-choice-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
          max-width: 500px;
          margin: 0 auto;
        }

        .choice-card {
          padding: var(--space-lg);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 1px solid var(--border-subtle);
        }

        .choice-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
        }

        .choice-card h3 {
          font-size: 0.875rem;
          margin-bottom: var(--space-xs);
        }

        .religion-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-sm);
          max-width: 500px;
          margin: 0 auto;
        }

        .religion-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          padding: var(--space-md);
          background: var(--bg-tertiary);
          border: 2px solid var(--border-subtle);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .religion-btn:hover {
          background: var(--bg-card);
          border-color: var(--religion-color, var(--accent-primary));
          transform: translateY(-2px);
        }

        .religion-btn.active {
          background: var(--bg-card);
          border-color: var(--religion-color, var(--accent-primary));
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.2);
        }

        .religion-icon {
          font-size: 1.5rem;
        }

        .religion-name {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .religion-btn.active .religion-name {
          color: var(--text-primary);
        }

        @media (max-width: 500px) {
          .religion-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .mbti-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-sm);
          max-width: 400px;
          margin: 0 auto;
        }

        .mbti-btn {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: var(--font-primary);
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mbti-btn:hover {
          background: var(--bg-card);
          border-color: var(--border-accent);
        }

        .mbti-btn.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .mbti-type {
          font-weight: 600;
          font-size: 1rem;
        }

        .mbti-name {
          opacity: 0.7;
          margin-top: 2px;
        }

        .percentage-sliders {
          max-width: 400px;
          margin: 0 auto;
        }

        .percentage-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: var(--bg-tertiary);
          -webkit-appearance: none;
          cursor: pointer;
        }

        .percentage-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-primary);
          cursor: pointer;
        }

        .result-badge {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-xl) var(--space-2xl);
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          border-radius: var(--radius-lg);
        }

        .result-type {
          font-size: 2.5rem;
          font-weight: 700;
          font-family: var(--font-display);
          color: white;
        }

        .result-name {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .percentage-breakdown {
          max-width: 400px;
          margin: 0 auto var(--space-xl);
        }

        .dimensions-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .dimension-bar {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }

        .dimension-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease-out;
        }

        .onboarding-progress {
          display: flex;
          gap: var(--space-sm);
          margin-top: var(--space-2xl);
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          transition: all var(--transition-fast);
        }

        .progress-dot.active {
          background: var(--accent-primary);
          transform: scale(1.25);
        }

        .progress-dot.completed {
          background: var(--accent-secondary);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .mbti-choice-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}
