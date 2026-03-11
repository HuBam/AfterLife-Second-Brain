import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Calendar, Book, Settings, Bell, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { religions, getReligionName } from '../data/religionData'
import { getUpcomingHolidays, getCountdownToNext, getTodayReminders, isFriday } from '../data/religiousCalendar'
import PrayerTracker from '../components/PrayerTracker'
import ScriptureTracker from '../components/ScriptureTracker'

/**
 * Religion Page
 * Main hub for spiritual tracking: prayers, scripture, calendar, reminders
 */
export default function Religion() {
    const { user, updateSpiritualSettings } = useStore()
    const [activeTab, setActiveTab] = useState('overview')

    const religion = user?.religion
    const religionData = religions.find(r => r.id === religion)
    const religionName = getReligionName(religion, user?.customReligion)

    // Get upcoming events and reminders
    const upcomingHolidays = religion ? getUpcomingHolidays(religion, 5) : []
    const countdown = religion ? getCountdownToNext(religion) : null
    const todayReminders = religion ? getTodayReminders(religion) : []

    // Other religions calendar settings
    const otherReligions = user?.spiritualSettings?.showOtherReligionsCalendar || {}

    if (!religion || religion === 'atheist') {
        return (
            <div className="page-container">
                <header className="page-header">
                    <Link to="/" className="back-btn">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1>Spirituality</h1>
                </header>

                <div className="no-religion-message">
                    <Heart size={48} />
                    <h2>No Religion Set</h2>
                    <p>You haven't selected a religion yet, or you've chosen a non-religious path.</p>
                    <Link to="/settings" className="btn btn-primary">
                        <Settings size={18} />
                        Go to Settings
                    </Link>
                </div>

                <style>{`
                    .no-religion-message {
                        text-align: center;
                        padding: var(--space-2xl);
                    }
                    .no-religion-message svg {
                        color: var(--text-tertiary);
                        margin-bottom: var(--space-lg);
                    }
                    .no-religion-message h2 {
                        margin-bottom: var(--space-sm);
                    }
                    .no-religion-message p {
                        color: var(--text-secondary);
                        margin-bottom: var(--space-xl);
                    }
                `}</style>
            </div>
        )
    }

    return (
        <div className="page-container">
            {/* Header */}
            <header className="page-header">
                <Link to="/" className="back-btn">
                    <ArrowLeft size={20} />
                </Link>
                <div className="header-content">
                    <span className="religion-icon">{religionData?.icon}</span>
                    <h1>{religionName}</h1>
                </div>
            </header>

            {/* Countdown Banner */}
            {countdown && (
                <motion.div
                    className="countdown-banner"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="countdown-info">
                        <span className="countdown-name">
                            {countdown.name}
                            {countdown.nameAr && <span className="name-ar"> {countdown.nameAr}</span>}
                        </span>
                        <span className="countdown-date">
                            {new Date(countdown.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="countdown-days">
                        <span className="days-number">{countdown.daysRemaining}</span>
                        <span className="days-label">days</span>
                    </div>
                </motion.div>
            )}

            {/* Friday Reminder for Muslims */}
            {religion === 'islam' && isFriday() && (
                <motion.div
                    className="friday-reminder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Bell size={18} />
                    <div>
                        <strong>Jumu'ah Mubarak!</strong>
                        <p>Don't forget to read Surah Al-Kahf today</p>
                    </div>
                </motion.div>
            )}

            {/* Today's Reminders */}
            {todayReminders.length > 0 && (
                <div className="today-reminders">
                    <h3>Today's Reminders</h3>
                    {todayReminders.map((reminder, i) => (
                        <div key={i} className="reminder-item">
                            <span className="reminder-name">{reminder.name}</span>
                            {reminder.nameAr && <span className="reminder-ar">{reminder.nameAr}</span>}
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="religion-tabs">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                >
                    <Calendar size={14} />
                    Calendar
                </button>
                <button
                    className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <Settings size={14} />
                    Settings
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-content">
                        {/* Prayer Tracker */}
                        <PrayerTracker />

                        {/* Scripture Tracker */}
                        <ScriptureTracker />
                    </div>
                )}

                {activeTab === 'calendar' && (
                    <div className="calendar-content">
                        <h3>Upcoming Events</h3>

                        {/* Main religion events */}
                        <div className="events-section">
                            <h4>{religionName}</h4>
                            {upcomingHolidays.length > 0 ? (
                                <div className="events-list">
                                    {upcomingHolidays.map((holiday, i) => (
                                        <div key={i} className={`event-item ${holiday.type}`}>
                                            <div className="event-date">
                                                <span className="event-month">
                                                    {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className="event-day">
                                                    {new Date(holiday.date).getDate()}
                                                </span>
                                            </div>
                                            <div className="event-info">
                                                <span className="event-name">{holiday.name}</span>
                                                {holiday.nameAr && <span className="event-name-alt">{holiday.nameAr}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-events">No upcoming events</p>
                            )}
                        </div>

                        {/* Other religions toggle */}
                        <div className="other-religions-section">
                            <h4>Other Religions' Events</h4>
                            <p className="text-secondary text-sm">Enable to see events from other faiths</p>

                            {religions
                                .filter(r => r.id !== religion && r.id !== 'atheist' && r.id !== 'other')
                                .slice(0, 5)
                                .map((r) => (
                                    <label key={r.id} className="religion-toggle">
                                        <span>
                                            {r.icon} {r.name}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={otherReligions[r.id] || false}
                                            onChange={(e) => updateSpiritualSettings({
                                                showOtherReligionsCalendar: {
                                                    ...otherReligions,
                                                    [r.id]: e.target.checked
                                                }
                                            })}
                                        />
                                    </label>
                                ))
                            }
                        </div>

                        {/* Show enabled other religions' events */}
                        {Object.entries(otherReligions)
                            .filter(([_, enabled]) => enabled)
                            .map(([relId]) => {
                                const relData = religions.find(r => r.id === relId)
                                const relHolidays = getUpcomingHolidays(relId, 3)
                                if (!relHolidays.length) return null

                                return (
                                    <div key={relId} className="events-section other">
                                        <h4>{relData?.icon} {relData?.name}</h4>
                                        <div className="events-list">
                                            {relHolidays.map((holiday, i) => (
                                                <div key={i} className="event-item minor">
                                                    <div className="event-date">
                                                        <span className="event-month">
                                                            {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}
                                                        </span>
                                                        <span className="event-day">
                                                            {new Date(holiday.date).getDate()}
                                                        </span>
                                                    </div>
                                                    <div className="event-info">
                                                        <span className="event-name">{holiday.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-content">
                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Show Religion Widget</h4>
                                <p>Display religion widget on Dashboard</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={user?.spiritualSettings?.showReligionWidget ?? true}
                                    onChange={(e) => updateSpiritualSettings({ showReligionWidget: e.target.checked })}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Community Statistics</h4>
                                <p>See how many users completed prayers today</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={user?.spiritualSettings?.showCommunityStats ?? false}
                                    onChange={(e) => updateSpiritualSettings({ showCommunityStats: e.target.checked })}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        {user?.spiritualSettings?.showCommunityStats && (
                            <div className="setting-item sub-setting">
                                <div className="setting-info">
                                    <h4>Anonymous Mode</h4>
                                    <p>Hide your name in community stats</p>
                                </div>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={user?.spiritualSettings?.anonymousCommunityStats ?? true}
                                        onChange={(e) => updateSpiritualSettings({ anonymousCommunityStats: e.target.checked })}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        )}

                        <div className="setting-item">
                            <div className="setting-info">
                                <h4>Change Religion</h4>
                                <p>Update your spiritual path</p>
                            </div>
                            <Link to="/settings" className="setting-action">
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .page-container {
                    min-height: 100vh;
                    padding: var(--space-lg);
                    padding-bottom: 100px;
                }
                
                .page-header {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    margin-bottom: var(--space-xl);
                }
                
                .back-btn {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-card);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                }
                
                .header-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }
                
                .religion-icon {
                    font-size: 1.5rem;
                }
                
                .countdown-banner {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg);
                    margin-bottom: var(--space-lg);
                }
                
                .countdown-info {
                    display: flex;
                    flex-direction: column;
                }
                
                .countdown-name {
                    font-weight: 600;
                    font-size: 1rem;
                }
                
                .name-ar {
                    font-family: var(--font-arabic, serif);
                    opacity: 0.9;
                }
                
                .countdown-date {
                    font-size: 0.75rem;
                    opacity: 0.8;
                }
                
                .countdown-days {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: rgba(255,255,255,0.2);
                    padding: var(--space-sm) var(--space-md);
                    border-radius: var(--radius-md);
                }
                
                .days-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    font-family: var(--font-mono, monospace);
                }
                
                .days-label {
                    font-size: 0.625rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                
                .friday-reminder {
                    display: flex;
                    align-items: flex-start;
                    gap: var(--space-md);
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    border-radius: var(--radius-lg);
                    padding: var(--space-md);
                    margin-bottom: var(--space-lg);
                }
                
                .friday-reminder svg {
                    color: var(--accent-success);
                    flex-shrink: 0;
                }
                
                .friday-reminder p {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin: 0;
                }
                
                .today-reminders {
                    margin-bottom: var(--space-lg);
                }
                
                .today-reminders h3 {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: var(--space-sm);
                }
                
                .reminder-item {
                    background: var(--bg-card);
                    padding: var(--space-sm) var(--space-md);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-xs);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .reminder-ar {
                    font-family: var(--font-arabic, serif);
                    color: var(--text-secondary);
                }
                
                .religion-tabs {
                    display: flex;
                    gap: var(--space-xs);
                    margin-bottom: var(--space-lg);
                    background: var(--bg-card);
                    padding: var(--space-xs);
                    border-radius: var(--radius-lg);
                }
                
                .tab-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-xs);
                    padding: var(--space-sm);
                    background: transparent;
                    border: none;
                    border-radius: var(--radius-md);
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                
                .tab-btn.active {
                    background: var(--accent-primary);
                    color: white;
                }
                
                .tab-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-lg);
                }
                
                .overview-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-lg);
                }
                
                .calendar-content h3 {
                    margin-bottom: var(--space-md);
                }
                
                .events-section {
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg);
                    margin-bottom: var(--space-md);
                }
                
                .events-section.other {
                    background: var(--bg-tertiary);
                }
                
                .events-section h4 {
                    font-size: 0.875rem;
                    margin-bottom: var(--space-md);
                }
                
                .events-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                }
                
                .event-item {
                    display: flex;
                    gap: var(--space-md);
                    padding: var(--space-sm);
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-md);
                    border-left: 3px solid var(--accent-primary);
                }
                
                .event-item.major {
                    border-left-color: var(--accent-success);
                }
                
                .event-item.minor {
                    opacity: 0.8;
                }
                
                .event-date {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: 45px;
                }
                
                .event-month {
                    font-size: 0.625rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                }
                
                .event-day {
                    font-size: 1.25rem;
                    font-weight: 700;
                }
                
                .event-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                
                .event-name {
                    font-size: 0.875rem;
                }
                
                .event-name-alt {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    font-family: var(--font-arabic, serif);
                }
                
                .no-events {
                    color: var(--text-tertiary);
                    font-style: italic;
                }
                
                .other-religions-section {
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg);
                    margin-bottom: var(--space-md);
                }
                
                .other-religions-section h4 {
                    margin-bottom: var(--space-xs);
                }
                
                .other-religions-section .text-secondary {
                    margin-bottom: var(--space-md);
                }
                
                .religion-toggle {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-sm) 0;
                    border-bottom: 1px solid var(--border-subtle);
                    cursor: pointer;
                }
                
                .religion-toggle:last-child {
                    border-bottom: none;
                }
                
                .religion-toggle input {
                    accent-color: var(--accent-primary);
                    width: 18px;
                    height: 18px;
                }
                
                .settings-content {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                }
                
                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-md);
                    background: var(--bg-card);
                    border-radius: var(--radius-md);
                }
                
                .setting-item.sub-setting {
                    margin-left: var(--space-lg);
                    background: var(--bg-tertiary);
                }
                
                .setting-info h4 {
                    font-size: 0.875rem;
                    margin-bottom: var(--space-xs);
                }
                
                .setting-info p {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin: 0;
                }
                
                .setting-action {
                    color: var(--text-tertiary);
                }
                
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 48px;
                    height: 26px;
                }
                
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    inset: 0;
                    background: var(--bg-tertiary);
                    border-radius: 26px;
                    transition: var(--transition-fast);
                }
                
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 20px;
                    width: 20px;
                    left: 3px;
                    bottom: 3px;
                    background: white;
                    border-radius: 50%;
                    transition: var(--transition-fast);
                }
                
                .toggle-switch input:checked + .toggle-slider {
                    background: var(--accent-primary);
                }
                
                .toggle-switch input:checked + .toggle-slider:before {
                    transform: translateX(22px);
                }
            `}</style>
        </div>
    )
}
