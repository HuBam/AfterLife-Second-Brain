import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { basicQuestions, extendedQuestions, answerScale, calculateMBTI, personalityTypes } from '../data/mbtiData'

/**
 * MBTIAssessment - Full personality assessment component
 * 20 questions for basic, 100 for extended (deep analysis)
 */
export default function MBTIAssessment({ mode = 'basic', onComplete, onBack }) {
    const [answers, setAnswers] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)

    // Get questions based on mode
    const questions = useMemo(() => {
        const qs = mode === 'extended' ? extendedQuestions : basicQuestions
        // Flatten all dimensions into single array
        return Object.values(qs).flat().sort(() => Math.random() - 0.5)
    }, [mode])

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100
    const isLastQuestion = currentIndex === questions.length - 1
    const canProceed = answers[currentQuestion?.id] !== undefined

    const handleAnswer = (value) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
    }

    const handleNext = () => {
        if (isLastQuestion) {
            // Calculate results and complete
            const result = calculateMBTI(answers, mode === 'extended' ? extendedQuestions : basicQuestions)
            onComplete(result)
        } else {
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    return (
        <div className="mbti-assessment">
            {/* Progress Bar */}
            <div className="progress-container mb-xl">
                <div className="flex justify-between text-xs text-secondary mb-xs">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion?.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="question-container"
                >
                    <h2 className="question-text text-xl mb-xl text-center">
                        {currentQuestion?.text}
                    </h2>

                    {/* 7-Point Scale */}
                    <div className="answer-scale">
                        <div className="scale-labels flex justify-between text-xs text-secondary mb-sm px-sm">
                            <span>Disagree</span>
                            <span>Neutral</span>
                            <span>Agree</span>
                        </div>
                        <div className="scale-options flex justify-between gap-sm">
                            {answerScale.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className={`scale-btn ${answers[currentQuestion?.id] === option.value ? 'active' : ''}`}
                                    title={option.label}
                                >
                                    <span className="scale-dot" />
                                </button>
                            ))}
                        </div>
                        <div className="scale-markers flex justify-between text-xs mt-xs px-sm opacity-40">
                            <span>-3</span>
                            <span>-2</span>
                            <span>-1</span>
                            <span>0</span>
                            <span>+1</span>
                            <span>+2</span>
                            <span>+3</span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="navigation flex justify-between mt-xl">
                <button
                    className="btn btn-ghost flex items-center gap-xs"
                    onClick={currentIndex === 0 ? onBack : handlePrev}
                >
                    <ArrowLeft size={18} />
                    {currentIndex === 0 ? 'Back' : 'Previous'}
                </button>
                <button
                    className="btn btn-primary flex items-center gap-xs"
                    onClick={handleNext}
                    disabled={!canProceed}
                >
                    {isLastQuestion ? (
                        <>
                            See Results <Check size={18} />
                        </>
                    ) : (
                        <>
                            Next <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>

            <style>{`
                .mbti-assessment {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .progress-bar {
                    height: 4px;
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-full);
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--accent-primary);
                    border-radius: var(--radius-full);
                }

                .question-text {
                    min-height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .answer-scale {
                    max-width: 400px;
                    margin: 0 auto;
                }

                .scale-options {
                    padding: var(--space-md) 0;
                }

                .scale-btn {
                    flex: 1;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-tertiary);
                    border: 2px solid var(--border-subtle);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .scale-btn:hover {
                    border-color: var(--accent-primary);
                    transform: translateY(-2px);
                }

                .scale-btn.active {
                    background: var(--accent-primary);
                    border-color: var(--accent-primary);
                }

                .scale-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--text-secondary);
                    transition: all var(--transition-fast);
                }

                .scale-btn.active .scale-dot {
                    background: white;
                    transform: scale(1.2);
                }

                .scale-btn:nth-child(1) .scale-dot,
                .scale-btn:nth-child(7) .scale-dot {
                    width: 16px;
                    height: 16px;
                }

                .scale-btn:nth-child(2) .scale-dot,
                .scale-btn:nth-child(6) .scale-dot {
                    width: 14px;
                    height: 14px;
                }

                .scale-btn:nth-child(4) .scale-dot {
                    width: 8px;
                    height: 8px;
                }

                .btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    )
}
