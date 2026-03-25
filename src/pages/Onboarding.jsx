import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Sparkles, ArrowRight, ArrowLeft, User, Calendar, Brain, HelpCircle, Check, Edit3, Heart, Globe, Gamepad2, Radio } from 'lucide-react'
import MBTIAssessment from '../components/MBTIAssessment'
import { personalityTypes, generateStarterSkills, lifeCategories, enneagramQuestions, calculateEnneagram } from '../data/mbtiData'
import { religions } from '../data/religionData'
import { getWesternZodiac, getChineseZodiac } from '../data/astrologyData'
import { spiritAnimals, getSpiritAnimal } from '../data/spiritAnimalData'

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
        birthYear: '',
        birthYearInput: '', // 2-digit display string – stored in formData so it survives remounts
        birthMonth: '',
        birthDay: '',
        birthTime: '',
        mbti: '',
        mbtiScores: null,
        mbtiPath: null,
        gender: null,
        religion: null,
        customReligion: '',
        mbtiVariant: 'A',
        enneagram: null,
        enneagramAnswers: {},
        enneagramPath: 'know',
        spiritAnimal: null,
        mode: 'basic',
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

        // Final Spirit Animal Calculation
        const birthMonth = formData.birthDate ? new Date(formData.birthDate).getMonth() : 0
        const finalSpiritAnimal = formData.spiritAnimal || getSpiritAnimal(formData.mbti, formData.enneagram, birthMonth).name

        // Complete onboarding
        completeOnboarding({
            name: formData.name,
            birthDate: formData.birthDate,
            birthTime: formData.birthTime || null,
            age,
            mbti: formData.mbti,
            mbtiScores: formData.mbtiScores,
            gender: formData.gender,
            religion: formData.religion,
            customReligion: formData.customReligion,
            mbtiVariant: formData.mbtiVariant,
            enneagram: formData.enneagram,
            spiritAnimal: finalSpiritAnimal,
            westernZodiac: getWesternZodiac(formData.birthDate),
            chineseZodiac: getChineseZodiac(new Date(formData.birthDate).getFullYear()),
            mode: 'basic', // Forced to basic for now until advanced mode UI is fully designed
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
        setStep(7) // Go to Religion
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
        setStep(7) // Go to Religion
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

    // Step 1 — Mode Selection
    const ModeStep = () => (
        <div className="mode-selection-container">
            <h2 className="mode-title mb-lg">Choose Your Experience</h2>
            
            {/* Slide Tab Switcher */}
            <div className="mode-tab-switcher">
                <button 
                    className={`mode-tab ${formData.mode === 'basic' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, mode: 'basic' })}
                >
                    {formData.mode === 'basic' && (
                        <motion.div className="mode-tab-bg" layoutId="modeTabBg" />
                    )}
                    <span className="relative z-10">Basic</span>
                </button>
                <button 
                    className={`mode-tab ${formData.mode === 'advanced' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, mode: 'advanced' })}
                >
                    {formData.mode === 'advanced' && (
                        <motion.div className="mode-tab-bg" layoutId="modeTabBg" />
                    )}
                    <span className="relative z-10">Advanced</span>
                </button>
            </div>

            {/* Mode Experience Card */}
            <div className="mode-card-wrapper mt-xl">
                <AnimatePresence mode="wait">
                    {formData.mode === 'basic' ? (
                        <motion.div 
                            key="basic-card"
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="experience-card basic-card"
                        >
                            <div className="experience-icon mb-md">
                                <Globe size={48} strokeWidth={1} />
                            </div>
                            <h3 className="experience-card-title mb-sm">Basic Experience</h3>
                            <p className="experience-card-desc mb-lg">
                                A streamlined, distraction-free environment focused purely on rapid thought capture and organization.
                            </p>
                            <div className="experience-tags">
                                <span>Minimalist</span>
                                <span>Basic</span>
                                <span>Compact</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="advanced-card"
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="experience-card advanced-card"
                        >
                            <div className="experience-icon mb-md">
                                <Gamepad2 size={48} strokeWidth={1.5} />
                            </div>
                            <h3 className="experience-card-title mb-sm">Advanced Experience</h3>
                            <p className="experience-card-desc mb-lg">
                                Deep gamification, dynamic visuals, and complex data telemetry for immersive professional tracking.
                            </p>
                            <div className="experience-tags">
                                <span>Game Style</span>
                                <span>Extra Details</span>
                                <span>Animation</span>
                                <span>Vibrant</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-xl flex justify-center">
                <button 
                    className="btn btn-primary"
                    style={{ minWidth: '200px' }}
                    onClick={() => setStep(2)}
                >
                    Continue <ArrowRight size={18} />
                </button>
            </div>
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
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                <button
                    className="btn btn-primary"
                    onClick={() => setStep(3)}
                    disabled={!formData.name.trim()}
                >
                    "Continue" <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )

    const BirthDateStep = () => {
        const currentYear = new Date().getFullYear()
        const currentYearShort = currentYear % 100
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

        // All state lives in formData — zero local state so remounts don't wipe anything
        const { birthYearInput, birthYear, birthMonth, birthDay } = formData

        const handleYearChange = (value) => {
            const cleaned = value.replace(/\D/g, '').slice(0, 2)

            if (cleaned.length === 2) {
                const num = parseInt(cleaned, 10)
                const full = num <= currentYearShort ? 2000 + num : 1900 + num
                const fullStr = full.toString()
                const newDate = birthMonth && birthDay ? `${fullStr}-${birthMonth}-${birthDay}` : ''
                setFormData(prev => ({ ...prev, birthYearInput: cleaned, birthYear: fullStr, birthDate: newDate }))
            } else {
                // Store the partial input too — no local state, so this must live in formData
                setFormData(prev => ({ ...prev, birthYearInput: cleaned, birthYear: '', birthDate: '' }))
            }
        }

        const handleMonthChange = (newMonth) => {
            const newDate = birthYear && birthDay ? `${birthYear}-${newMonth}-${birthDay}` : ''
            setFormData(prev => ({ ...prev, birthMonth: newMonth, birthDate: newDate }))
        }

        const handleDayChange = (newDay) => {
            const padded = String(newDay).padStart(2, '0')
            const newDate = birthYear && birthMonth ? `${birthYear}-${birthMonth}-${padded}` : ''
            setFormData(prev => ({ ...prev, birthDay: padded, birthDate: newDate }))
        }

        const daysInMonth = birthMonth
            ? new Date(parseInt(birthYear || currentYear), parseInt(birthMonth), 0).getDate()
            : 31
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

        const canContinue = !!(birthYear && birthMonth && birthDay)

        return (
            <div className="text-center">
                <div className="realm-icon mb-lg" style={{ margin: '0 auto', background: 'var(--realm-empyra)' }}>
                    <Calendar size={24} />
                </div>
                <h2 className="mb-md">When were you born?</h2>
                <p className="text-secondary text-sm mb-lg">This helps track your life timeline</p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Year Input */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
                        <span style={{ position: 'absolute', top: '-1.4rem', left: '2px', fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.6, whiteSpace: 'nowrap' }}>
                            last 2 digits of year
                        </span>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={birthYearInput}
                            onChange={(e) => handleYearChange(e.target.value)}
                            placeholder="YY"
                            className="onboarding-input"
                            style={{ width: '72px', textAlign: 'center', padding: '0.625rem 0.5rem', letterSpacing: '0.1em' }}
                            maxLength={2}
                        />
                        {birthYear && (
                            <span style={{ position: 'absolute', bottom: '-1.3rem', color: 'var(--accent-primary)', fontSize: '0.75rem' }}>
                                {birthYear}
                            </span>
                        )}
                    </div>

                    {/* Month Dropdown */}
                    <select
                        value={birthMonth}
                        onChange={(e) => handleMonthChange(e.target.value)}
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
                        value={birthDay ? parseInt(birthDay).toString() : ''}
                        onChange={(e) => handleDayChange(e.target.value)}
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
                        onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                        className="onboarding-input"
                        style={{ width: 'auto' }}
                    />
                </div>

                <div className="flex gap-md justify-center mt-xl">
                    <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(4)}
                        disabled={!canContinue}
                    >
                        Continue <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )
    }


    const GenderStep = () => (
        <div className="text-center">
            <div className="realm-icon mb-lg" style={{ margin: '0 auto', background: 'var(--accent-primary)' }}>
                <User size={24} />
            </div>
            <h2 className="mb-md">Choose your character's essence</h2>
            <p className="text-secondary text-sm mb-lg">This determines your personality avatar</p>

            <div className="mbti-grid" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <button
                    className={`mbti-btn ${formData.gender === 'male' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                >
                    <span className="mbti-type">MARS</span>
                    <span className="mbti-name text-xs">Male</span>
                </button>
                <button
                    className={`mbti-btn ${formData.gender === 'female' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                >
                    <span className="mbti-type">VENUS</span>
                    <span className="mbti-name text-xs">Female</span>
                </button>
                <button
                    className={`mbti-btn ${formData.gender === 'non-binary' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, gender: 'non-binary' })}
                >
                    <span className="mbti-type">NEBULA</span>
                    <span className="mbti-name text-xs">Non-binary</span>
                </button>
                <button
                    className={`mbti-btn ${formData.gender === 'skip' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, gender: 'skip' })}
                >
                    <span className="mbti-type">SKIP</span>
                    <span className="mbti-name text-xs">Dynamic</span>
                </button>
            </div>

            <div className="flex gap-md justify-center mt-xl">
                <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
                <button
                    className="btn btn-primary"
                    onClick={() => setStep(5)}
                    disabled={!formData.gender}
                >
                    "Continue" <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )

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
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'know' }); setStep(6) }}
                >
                    <Check size={32} className="mb-sm" style={{ color: 'var(--accent-primary)' }} />
                    <h3>I Know My Type</h3>
                    <p className="text-secondary text-sm">Select from 16 personalities</p>
                </button>

                <button
                    className="choice-card glass-card"
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'test' }); setStep(6) }}
                >
                    <HelpCircle size={32} className="mb-sm" style={{ color: '#f59e0b' }} />
                    <h3>Take The Test</h3>
                    <p className="text-secondary text-sm">20 questions to find out</p>
                </button>

                <button
                    className="choice-card glass-card"
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'manual' }); setStep(6) }}
                >
                    <Edit3 size={32} className="mb-sm" style={{ color: '#8b5cf6' }} />
                    <h3>Enter My Percentages</h3>
                    <p className="text-secondary text-sm">I know my exact scores</p>
                </button>
            </div>

            <div className="flex gap-md justify-center mt-xl">
                <button className="btn btn-ghost" onClick={() => setStep(4)}>Back</button>
                <button
                    className="btn btn-ghost text-secondary"
                    onClick={() => { setFormData({ ...formData, mbtiPath: 'skip' }); setStep(7) }}
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
                    onBack={() => setStep(5)}
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
                <button className="btn btn-ghost" onClick={() => setStep(5)}>Back</button>
                <button
                    className="btn btn-primary"
                    onClick={() => setStep(7)}
                    disabled={!formData.mbti}
                >
                    "Continue" <ArrowRight size={18} />
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
                    <button className="btn btn-ghost" onClick={() => setStep(5)}>Back</button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleManualPercentages(scores)}
                    >
                        "Continue" <ArrowRight size={18} />
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
                    <button className="btn btn-ghost" onClick={() => setStep(formData.mbtiPath === 'skip' ? 5 : 6)}>Back</button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => {
                            setFormData(prev => ({ ...prev, religion: null, customReligion: '' }))
                            setStep(8)
                        }}
                    >
                        Skip for now
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setStep(8)}
                        disabled={formData.religion === 'other' && !formData.customReligion}
                    >
                        "Continue" <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )
    }

    // Enneagram Choice Step
    const EnneagramChoiceStep = () => {
        return (
            <div className="text-center">
                <div className="realm-icon mb-lg" style={{ margin: '0 auto', background: 'var(--realm-cerebra)' }}>
                    <Brain size={24} />
                </div>
                <h2 className="mb-md">The Enneagram</h2>
                <p className="text-secondary text-sm mb-lg">Discover your core motivation and inner fears.</p>

                <div className="mbti-choice-grid">
                    <button
                        className="choice-card glass-card"
                        onClick={() => { setFormData({ ...formData, enneagramPath: 'know' }); setStep(9) }}
                    >
                        <Check size={32} className="mb-sm" style={{ color: '#10b981' }} />
                        <h3>I Know My Type</h3>
                        <p className="text-secondary text-sm">Select from types 1-9</p>
                    </button>

                    <button
                        className="choice-card glass-card"
                        onClick={() => { setFormData({ ...formData, enneagramPath: 'test' }); setStep(9) }}
                    >
                        <HelpCircle size={32} className="mb-sm" style={{ color: '#f59e0b' }} />
                        <h3>Take Mini-Test</h3>
                        <p className="text-secondary text-sm">18 questions to reveal it</p>
                    </button>
                </div>

                <div className="flex gap-md justify-center mt-xl">
                    <button className="btn btn-ghost" onClick={() => setStep(7)}>Back</button>
                    <button
                        className="btn btn-ghost text-secondary"
                        onClick={() => { setFormData({ ...formData, enneagramPath: 'skip', enneagram: null }); setStep(10) }}
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        )
    }

    const EnneagramPathStep = () => {
        if (formData.enneagramPath === 'know') {
            return <EnneagramSelectionGrid />
        } else if (formData.enneagramPath === 'test') {
            return <EnneagramTest onComplete={(type) => { setFormData({ ...prev => ({ ...prev, enneagram: type }) }); setStep(10) }} />
        }
        return null
    }

    const EnneagramSelectionGrid = () => {
        const types = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        return (
            <div className="text-center">
                <h2 className="mb-md">Select Your Type</h2>
                <div className="mbti-grid" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    {types.map(t => (
                        <button
                            key={t}
                            className={`mbti-btn ${formData.enneagram === t ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, enneagram: t })}
                            style={{ minWidth: '80px' }}
                        >
                            <span className="mbti-type">TYPE {t}</span>
                        </button>
                    ))}
                </div>
                <div className="flex gap-md justify-center mt-xl">
                    <button className="btn btn-ghost" onClick={() => setStep(8)}>Back</button>
                    <button className="btn btn-primary" onClick={() => setStep(10)} disabled={!formData.enneagram}>
                        "Continue" <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )
    }

    const EnneagramTest = ({ onComplete }) => {
        const [currentQ, setCurrentQ] = useState(0)
        const [answers, setAnswers] = useState({})

        const handleAnswer = (val) => {
            const newAnswers = { ...answers, [enneagramQuestions[currentQ].id]: val }
            setAnswers(newAnswers)

            if (currentQ < enneagramQuestions.length - 1) {
                setCurrentQ(currentQ + 1)
            } else {
                const result = calculateEnneagram(newAnswers)
                setFormData(prev => ({ ...prev, enneagram: result, enneagramAnswers: newAnswers }))
                setStep(10)
            }
        }

        const q = enneagramQuestions[currentQ]
        const progress = ((currentQ + 1) / enneagramQuestions.length) * 100

        return (
            <div className="text-center">
                <h2 className="mb-md">Enneagram Test</h2>
                <div className="mb-xl">
                    <div className="flex justify-between text-xs mb-xs opacity-50">
                        <span>Question {currentQ + 1} of {enneagramQuestions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="dimension-bar">
                        <motion.div className="dimension-fill" animate={{ width: `${progress}%` }} style={{ background: 'var(--accent-primary)' }} />
                    </div>
                </div>

                <div className="glass-card p-xl mb-xl">
                    <p className="text-lg mb-xl">{q.text}</p>
                    <div className="flex flex-col gap-sm">
                        {[
                            { val: 3, label: 'Strongly Agree', color: '#10b981' },
                            { val: 1, label: 'Slightly Agree', color: '#34d399' },
                            { val: 0, label: 'Neutral', color: '#94a3b8' },
                            { val: -1, label: 'Slightly Disagree', color: '#f87171' },
                            { val: -3, label: 'Strongly Disagree', color: '#ef4444' },
                        ].map((btn) => (
                            <button
                                key={btn.val}
                                className="btn btn-ghost w-full"
                                style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
                                onClick={() => handleAnswer(btn.val)}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-md justify-center">
                    <button className="btn btn-ghost" onClick={() => currentQ > 0 ? setCurrentQ(currentQ - 1) : setStep(8)}>Back</button>
                    <button className="btn btn-ghost" onClick={() => setStep(8)}>Exit Test</button>
                </div>
            </div>
        )
    }

    const ResultsStep = () => {
        const personality = personalityTypes[formData.mbti]
        const age = formData.birthDate ? calculateAge(formData.birthDate) : null

        return (
            <div className="text-center">
                <div className="avatar-preview mb-lg">
                    <motion.img
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        src={personality?.avatars?.[formData.gender] || personality?.avatars?.male || '/avatars/placeholder.png'}
                        alt={personality?.name}
                        style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                    />
                </div>

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
                <p className="text-secondary mb-lg" style={{ maxWidth: '400px', margin: '0 auto' }}>
                    {personality?.description}
                </p>

                {/* Astrology & Identity Badges */}
                <div className="flex gap-md justify-center mb-xl">
                    {getWesternZodiac(formData.birthDate) && (
                        <div className="glass-card p-sm flex items-center gap-sm" title="Western Zodiac">
                            <span style={{ fontSize: '1.2rem' }}>{getWesternZodiac(formData.birthDate).sign}</span>
                            <span className="text-xs uppercase tracking-tighter">{getWesternZodiac(formData.birthDate).name}</span>
                        </div>
                    )}
                    {getChineseZodiac(new Date(formData.birthDate).getFullYear()) && (
                        <div className="glass-card p-sm flex items-center gap-sm" title="Chinese Zodiac">
                            <span style={{ fontSize: '1.2rem' }}>{getChineseZodiac(new Date(formData.birthDate).getFullYear()).sign}</span>
                            <span className="text-xs uppercase tracking-tighter">{getChineseZodiac(new Date(formData.birthDate).getFullYear()).name}</span>
                        </div>
                    )}
                </div>

                {/* MBTI Variant Selection */}
                <div className="variant-selection mb-xl">
                    <h3 className="text-sm text-secondary mb-md uppercase tracking-wider">Identity Variant</h3>
                    <div className="flex gap-md justify-center">
                        <button
                            className={`px-lg py-sm rounded-md border transition-all ${formData.mbtiVariant === 'A' ? 'bg-accent text-black border-accent' : 'bg-transparent text-secondary border-white/20'}`}
                            onClick={() => setFormData({ ...formData, mbtiVariant: 'A' })}
                        >
                            <span className="font-bold">ASSERTIVE</span>
                            <span className="text-xs block opacity-70">-{formData.mbti}-A</span>
                        </button>
                        <button
                            className={`px-lg py-sm rounded-md border transition-all ${formData.mbtiVariant === 'T' ? 'bg-accent text-black border-accent' : 'bg-transparent text-secondary border-white/20'}`}
                            onClick={() => setFormData({ ...formData, mbtiVariant: 'T' })}
                        >
                            <span className="font-bold">TURBULENT</span>
                            <span className="text-xs block opacity-70">-{formData.mbti}-T</span>
                        </button>
                    </div>
                </div>

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

    // Spirit Animal Discovery Step
    const SpiritAnimalStep = () => {
        const birthMonth = formData.birthDate ? new Date(formData.birthDate).getMonth() : 0
        const animal = getSpiritAnimal(formData.mbti)

        return (
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="realm-icon mb-xl"
                    style={{ margin: '0 auto', background: 'var(--realm-sanctum)', width: '100px', height: '100px', fontSize: '3rem' }}
                >
                    {animal.symbol}
                </motion.div>
                <h2 className="mb-sm">Spirit Animal: {animal.name}</h2>
                <p className="text-secondary mb-lg uppercase tracking-widest text-xs">{animal.traits.join(' • ')}</p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-lg mb-xl"
                >
                    <p className="text-sm italic opacity-80 leading-relaxed">
                        "{animal.description}"
                    </p>
                </motion.div>

                <div className="flex gap-md justify-center mt-xl">
                    <button className="btn btn-ghost" onClick={() => setStep(formData.enneagramPath === 'skip' ? 8 : 9)}>Back</button>
                    <button className="btn btn-primary" onClick={() => setStep(11)}>
                        "Continue" <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        )
    }

    const steps = [
        { component: <WelcomeStep /> },
        { component: <ModeStep /> },
        { component: <NameStep /> },
        { component: <BirthDateStep /> },
        { component: <GenderStep /> },
        { component: <MBTIChoiceStep /> },
        { component: <MBTIPathStep /> },
        { component: <ReligionStep /> },
        { component: <EnneagramChoiceStep /> },
        { component: <EnneagramPathStep /> },
        { component: <SpiritAnimalStep /> },
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
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <div
                        key={i}
                        className={`progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                    />
                ))}
            </div>

            <style>{`
        .protocol-container {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          color: #fff;
          font-family: monospace;
          background: #0f1115;
          margin-top: -2rem;
          border-radius: 8px;
        }

        .protocol-header {
          text-align: center;
          margin-bottom: 2rem;
          width: 100%;
        }

        .os-version {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          color: #00f0ff;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
        }

        .os-icon {
          width: 16px;
          height: 16px;
          background: #ffccbc;
          border-radius: 4px 0 4px 4px;
        }

        .protocol-title {
          font-family: var(--font-display, sans-serif);
          font-size: 1.4rem;
          color: #00f0ff;
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
        }

        .protocol-subtitle {
          font-size: 0.55rem;
          color: #64748b;
          letter-spacing: 0.1em;
          max-width: 300px;
          margin: 0 auto;
          line-height: 1.5;
        }

        .protocol-slider {
          display: flex;
          gap: 1rem;
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          padding: 1rem 5vw 2rem 5vw;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        
        .protocol-slider::-webkit-scrollbar {
          display: none;
        }

        .protocol-card {
          flex: 0 0 85vw;
          max-width: 340px;
          scroll-snap-align: center;
          border-radius: 4px;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          background: #15181d;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .protocol-card.basic.selected { border: 1px solid #00f0ff; }
        .protocol-card.advanced.selected { border: 1px solid #a855f7; }

        .protocol-card.advanced {
          background: linear-gradient(180deg, #1b1325 0%, #15101c 100%);
          border: 1px solid rgba(168, 85, 247, 0.2);
        }

        .protocol-bg-icon {
          position: absolute;
          top: 2rem;
          right: 1rem;
          opacity: 0.05;
          pointer-events: none;
        }

        .protocol-icon-wrapper {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
          color: #00f0ff;
        }

        .advanced-icon {
          color: #a855f7;
          background: rgba(168, 85, 247, 0.1);
        }

        .protocol-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .protocol-status-bars {
          display: flex;
          gap: 3px;
        }
        .protocol-status-bars span {
          width: 4px;
          height: 10px;
          background: #a855f7;
          opacity: 0.5;
        }

        .protocol-title-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .protocol-card-title {
          font-size: 1.5rem;
          font-family: var(--font-display, sans-serif);
          font-weight: bold;
          letter-spacing: 0.05em;
          margin: 0;
          color: white;
          text-align: left;
        }

        .combat-ready-badge {
          font-size: 0.5rem;
          color: #f59e0b;
          border: 1px solid #f59e0b;
          padding: 2px 4px;
          border-radius: 2px;
          letter-spacing: 1px;
        }

        .protocol-card-desc {
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          text-align: left;
        }

        .protocol-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
        }

        .protocol-badges span {
          font-size: 0.5rem;
          padding: 4px 6px;
          border: 1px solid rgba(255,255,255,0.2);
          color: #cbd5e1;
          letter-spacing: 0.05em;
        }

        .advanced-badges span {
          border-color: rgba(168, 85, 247, 0.4);
          color: #d8b4fe;
        }

        .protocol-visual {
          width: 100%;
          height: 100px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          margin-bottom: 1.5rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .basic-visual .visual-cube {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%);
          box-shadow: inset 0 0 15px rgba(0,240,255,0.1);
          border: 1px solid rgba(0,240,255,0.2);
        }

        .advanced-visual {
          background: #000;
          border-color: rgba(168,85,247,0.3);
        }

        .visual-diamond {
          width: 40px;
          height: 40px;
          border: 1px solid #a855f7;
          transform: rotate(45deg);
          box-shadow: 0 0 20px rgba(168,85,247,0.4);
          position: relative;
          z-index: 2;
        }

        .visual-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(168,85,247,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.1) 1px, transparent 1px);
          background-size: 8px 8px;
          opacity: 0.5;
        }

        .visual-text {
          position: absolute;
          font-size: 0.4rem;
          color: #a855f7;
          letter-spacing: 0.1em;
          z-index: 3;
        }
        .visual-text.top-left { top: 6px; left: 6px; }
        .visual-text.bottom-right { bottom: 6px; right: 6px; }

        .protocol-btn {
          width: 100%;
          padding: 0.875rem;
          font-family: monospace;
          font-size: 0.8rem;
          font-weight: bold;
          letter-spacing: 0.1em;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.2s;
          margin-top: auto;
        }

        .basic-btn {
          background: transparent;
          color: #00f0ff;
          border: 1px solid #00f0ff;
          box-shadow: 0 0 10px rgba(0,240,255,0.1);
        }
        .basic-btn:active { background: rgba(0,240,255,0.1); }

        .advanced-btn {
          background: linear-gradient(90deg, #00f0ff 0%, #a855f7 100%);
          color: #000;
          border: none;
        }
        .advanced-btn:active { filter: brightness(1.2); }

        .protocol-footer {
          margin-top: auto;
          width: 100%;
          text-align: center;
        }

        .protocol-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          opacity: 0.3;
        }
        .protocol-divider span {
          width: 30px;
          height: 1px;
          background: #fff;
          margin: 0 10px;
        }

        .protocol-footer p {
          font-size: 0.5rem;
          color: #64748b;
          letter-spacing: 0.1em;
          line-height: 1.5;
          max-width: 250px;
          margin: 0 auto;
        }

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
