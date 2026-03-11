import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Compass, MapPin, Navigation2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { fetchQiblaDirection, getCurrentLocation } from '../services/aladhanApi'

/**
 * Qibla Compass Component
 * Shows the direction to Mecca using device orientation and Aladhan API
 */
export default function QiblaCompass() {
    const { user, setQiblaDirection, setUserLocation } = useStore()
    const [deviceHeading, setDeviceHeading] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [permissionDenied, setPermissionDenied] = useState(false)

    const qiblaDirection = user?.qiblaDirection

    // Calculate the arrow rotation
    // Arrow should point to qibla relative to device heading
    const arrowRotation = qiblaDirection ? qiblaDirection - deviceHeading : 0

    // Fetch Qibla direction on mount
    useEffect(() => {
        fetchQibla()
    }, [])

    // Listen for device orientation
    useEffect(() => {
        const handleOrientation = (event) => {
            // Handle both iOS and Android
            let heading = 0
            if (event.webkitCompassHeading !== undefined) {
                // iOS
                heading = event.webkitCompassHeading
            } else if (event.alpha !== null) {
                // Android (alpha is compass heading, but inverted)
                heading = 360 - event.alpha
            }
            setDeviceHeading(heading)
        }

        // Check if DeviceOrientationEvent needs permission (iOS 13+)
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            // We'll request permission when user taps the compass
        } else {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true)
            window.addEventListener('deviceorientation', handleOrientation, true)
        }

        return () => {
            window.removeEventListener('deviceorientationabsolute', handleOrientation)
            window.removeEventListener('deviceorientation', handleOrientation)
        }
    }, [])

    const fetchQibla = async () => {
        setIsLoading(true)
        setError(null)

        try {
            let coords = user?.userLocation

            if (!coords?.latitude || !coords?.longitude) {
                // Need to get location first
                try {
                    const location = await getCurrentLocation()
                    coords = location
                    setUserLocation({
                        ...user?.userLocation,
                        latitude: location.latitude,
                        longitude: location.longitude,
                    })
                } catch (geoError) {
                    setError('Location access required for Qibla direction')
                    setIsLoading(false)
                    return
                }
            }

            const result = await fetchQiblaDirection(coords.latitude, coords.longitude)

            if (result.success) {
                setQiblaDirection(result.direction)
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Request compass permission (iOS)
    const requestCompassPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission()
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', (event) => {
                        if (event.webkitCompassHeading !== undefined) {
                            setDeviceHeading(event.webkitCompassHeading)
                        }
                    }, true)
                } else {
                    setPermissionDenied(true)
                }
            } catch (err) {
                setPermissionDenied(true)
            }
        }
    }

    if (user?.religion !== 'islam') {
        return null
    }

    return (
        <div className="qibla-compass">
            <div className="qibla-header">
                <h3>
                    <Compass size={16} />
                    Qibla Direction
                </h3>
                {user?.userLocation?.city && (
                    <span className="qibla-location">
                        <MapPin size={10} />
                        {user.userLocation.city}
                    </span>
                )}
            </div>

            <div className="compass-container" onClick={requestCompassPermission}>
                {isLoading ? (
                    <div className="compass-loading">
                        <Compass size={32} className="spin" />
                        <span>Finding Qibla...</span>
                    </div>
                ) : error ? (
                    <div className="compass-error">
                        <span>{error}</span>
                        <button onClick={fetchQibla}>Retry</button>
                    </div>
                ) : (
                    <>
                        {/* Compass ring */}
                        <div className="compass-ring">
                            <div className="compass-marks">
                                <span className="mark n">N</span>
                                <span className="mark e">E</span>
                                <span className="mark s">S</span>
                                <span className="mark w">W</span>
                            </div>

                            {/* Rotating compass dial based on device heading */}
                            <motion.div
                                className="compass-dial"
                                animate={{ rotate: -deviceHeading }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            >
                                <div className="dial-tick n" />
                                <div className="dial-tick e" />
                                <div className="dial-tick s" />
                                <div className="dial-tick w" />
                            </motion.div>

                            {/* Qibla arrow - always points toward Mecca */}
                            <motion.div
                                className="qibla-arrow"
                                animate={{ rotate: arrowRotation }}
                                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                            >
                                <Navigation2 size={28} />
                            </motion.div>
                        </div>

                        <div className="qibla-degrees">
                            {Math.round(qiblaDirection)}°
                        </div>

                        {permissionDenied && (
                            <p className="compass-hint">Tap to enable compass</p>
                        )}
                    </>
                )}
            </div>

            <style>{`
                .qibla-compass {
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    padding: var(--space-lg);
                    border: 1px solid var(--border-subtle);
                }

                .qibla-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--space-md);
                }

                .qibla-header h3 {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    font-size: 1rem;
                    font-weight: 600;
                }

                .qibla-location {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                }

                .compass-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: var(--space-lg);
                }

                .compass-loading,
                .compass-error {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-sm);
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                }

                .compass-error button {
                    background: var(--accent-primary);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    margin-top: var(--space-sm);
                }

                .compass-ring {
                    position: relative;
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    border: 2px solid var(--border-subtle);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .compass-marks {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }

                .compass-marks .mark {
                    position: absolute;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-tertiary);
                }

                .mark.n { top: 8px; left: 50%; transform: translateX(-50%); color: var(--accent-primary); }
                .mark.e { right: 8px; top: 50%; transform: translateY(-50%); }
                .mark.s { bottom: 8px; left: 50%; transform: translateX(-50%); }
                .mark.w { left: 8px; top: 50%; transform: translateY(-50%); }

                .compass-dial {
                    position: absolute;
                    inset: 10px;
                    border-radius: 50%;
                    border: 1px dashed var(--border-subtle);
                }

                .dial-tick {
                    position: absolute;
                    width: 2px;
                    height: 8px;
                    background: var(--text-tertiary);
                }

                .dial-tick.n { top: 0; left: 50%; transform: translateX(-50%); background: var(--accent-primary); }
                .dial-tick.e { right: 0; top: 50%; transform: translateY(-50%) rotate(90deg); }
                .dial-tick.s { bottom: 0; left: 50%; transform: translateX(-50%); }
                .dial-tick.w { left: 0; top: 50%; transform: translateY(-50%) rotate(90deg); }

                .qibla-arrow {
                    position: absolute;
                    color: #22c55e;
                    filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.5));
                }

                .qibla-degrees {
                    margin-top: var(--space-md);
                    font-size: 1.5rem;
                    font-weight: 700;
                    font-family: var(--font-mono, monospace);
                    color: var(--text-primary);
                }

                .compass-hint {
                    font-size: 0.7rem;
                    color: var(--text-tertiary);
                    margin-top: var(--space-sm);
                }

                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
