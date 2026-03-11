import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Bone segment component
function Bone({ start, end, radius = 0.03, color = '#e8e8e8' }) {
    const { midpoint, length, quaternion } = useMemo(() => {
        const startVec = new THREE.Vector3(...start)
        const endVec = new THREE.Vector3(...end)
        const direction = new THREE.Vector3().subVectors(endVec, startVec)
        const len = direction.length()

        if (len === 0) return { midpoint: startVec, length: 0, quaternion: new THREE.Quaternion() }

        const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
        const quat = new THREE.Quaternion()
        quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())

        return { midpoint: mid, length: len, quaternion: quat }
    }, [start, end])

    if (length === 0) return null

    return (
        <mesh position={midpoint} quaternion={quaternion}>
            <capsuleGeometry args={[radius, Math.max(0.01, length - radius * 2), 4, 8]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
        </mesh>
    )
}

// Joint sphere component
function Joint({ position, radius = 0.05, color = '#d4d4d4', onClick, isSelected }) {
    return (
        <mesh position={position} onClick={onClick}>
            <sphereGeometry args={[radius, 16, 16]} />
            <meshStandardMaterial
                color={isSelected ? '#4a9eff' : color}
                emissive={isSelected ? '#4a9eff' : '#000000'}
                emissiveIntensity={isSelected ? 0.5 : 0}
                roughness={0.2}
                metalness={0.7}
            />
        </mesh>
    )
}

// Full skeleton structure
function SkeletonModel({ selectedPart, onSelectPart, autoRotate }) {
    const groupRef = useRef()

    // Auto-rotate the skeleton
    useFrame((state) => {
        if (autoRotate && groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
        }
    })

    // Skeleton bone structure (simplified anatomical)
    const skeleton = {
        // Spine
        spine: [
            { start: [0, 0, 0], end: [0, 0.15, 0], name: 'pelvis' },
            { start: [0, 0.15, 0], end: [0, 0.35, 0], name: 'lumbar' },
            { start: [0, 0.35, 0], end: [0, 0.55, 0], name: 'thoracic' },
            { start: [0, 0.55, 0], end: [0, 0.7, 0], name: 'cervical' },
        ],
        // Head
        head: [
            { start: [0, 0.7, 0], end: [0, 0.85, 0], name: 'skull' },
        ],
        // Ribcage (simplified)
        ribs: [
            { start: [0, 0.4, 0], end: [-0.12, 0.42, 0.08], name: 'rib1L' },
            { start: [0, 0.4, 0], end: [0.12, 0.42, 0.08], name: 'rib1R' },
            { start: [0, 0.45, 0], end: [-0.14, 0.47, 0.1], name: 'rib2L' },
            { start: [0, 0.45, 0], end: [0.14, 0.47, 0.1], name: 'rib2R' },
            { start: [0, 0.5, 0], end: [-0.13, 0.52, 0.09], name: 'rib3L' },
            { start: [0, 0.5, 0], end: [0.13, 0.52, 0.09], name: 'rib3R' },
        ],
        // Left arm
        leftArm: [
            { start: [0, 0.55, 0], end: [-0.15, 0.55, 0], name: 'clavicleL' },
            { start: [-0.15, 0.55, 0], end: [-0.35, 0.35, 0], name: 'humerusL' },
            { start: [-0.35, 0.35, 0], end: [-0.35, 0.1, 0], name: 'forearmL' },
            { start: [-0.35, 0.1, 0], end: [-0.35, 0, 0], name: 'handL' },
        ],
        // Right arm
        rightArm: [
            { start: [0, 0.55, 0], end: [0.15, 0.55, 0], name: 'clavicleR' },
            { start: [0.15, 0.55, 0], end: [0.35, 0.35, 0], name: 'humerusR' },
            { start: [0.35, 0.35, 0], end: [0.35, 0.1, 0], name: 'forearmR' },
            { start: [0.35, 0.1, 0], end: [0.35, 0, 0], name: 'handR' },
        ],
        // Left leg
        leftLeg: [
            { start: [0, 0, 0], end: [-0.1, -0.05, 0], name: 'hipL' },
            { start: [-0.1, -0.05, 0], end: [-0.1, -0.4, 0], name: 'femurL' },
            { start: [-0.1, -0.4, 0], end: [-0.1, -0.75, 0], name: 'tibiaL' },
            { start: [-0.1, -0.75, 0], end: [-0.1, -0.82, 0.08], name: 'footL' },
        ],
        // Right leg
        rightLeg: [
            { start: [0, 0, 0], end: [0.1, -0.05, 0], name: 'hipR' },
            { start: [0.1, -0.05, 0], end: [0.1, -0.4, 0], name: 'femurR' },
            { start: [0.1, -0.4, 0], end: [0.1, -0.75, 0], name: 'tibiaR' },
            { start: [0.1, -0.75, 0], end: [0.1, -0.82, 0.08], name: 'footR' },
        ],
    }

    // Joint positions for clickable areas
    const joints = [
        { position: [0, 0.85, 0], name: 'brain', label: 'Brain/Skull' },
        { position: [0, 0.45, 0.05], name: 'heart', label: 'Heart' },
        { position: [0, 0.48, 0.08], name: 'lungs', label: 'Lungs' },
        { position: [0, 0.3, 0.03], name: 'liver', label: 'Liver' },
        { position: [0, 0.2, 0.05], name: 'stomach', label: 'Stomach' },
        { position: [0, 0.1, 0], name: 'kidneys', label: 'Kidneys' },
        { position: [0, 0, 0], name: 'blood', label: 'Blood System' },
        { position: [0, -0.4, 0], name: 'bones', label: 'Skeletal System' },
    ]

    return (
        <group ref={groupRef} position={[0, -0.1, 0]}>
            {/* Render all bones */}
            {Object.values(skeleton).flat().map((bone, i) => (
                <Bone
                    key={i}
                    start={bone.start}
                    end={bone.end}
                    color={selectedPart === 'bones' ? '#4a9eff' : '#e8e8e8'}
                />
            ))}

            {/* Render clickable joints/organs */}
            {joints.map((joint) => (
                <Joint
                    key={joint.name}
                    position={joint.position}
                    isSelected={selectedPart === joint.name}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelectPart(joint.name)
                    }}
                    radius={joint.name === 'brain' ? 0.12 : 0.06}
                />
            ))}

            {/* Skull - larger sphere for brain */}
            <mesh position={[0, 0.85, 0]}>
                <sphereGeometry args={[0.1, 24, 24]} />
                <meshStandardMaterial
                    color={selectedPart === 'brain' ? '#4a9eff' : '#f0f0f0'}
                    transparent
                    opacity={0.6}
                    roughness={0.2}
                />
            </mesh>
        </group>
    )
}

// Main Skeleton3D component
export default function Skeleton3D({ selectedOrgan, onSelectOrgan, className }) {
    const [autoRotate, setAutoRotate] = useState(true)

    return (
        <div className={`skeleton-3d-container ${className || ''}`} style={{ width: '100%', height: '100%' }}>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0.2, 1.5]} fov={50} />

                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#4a9eff" />
                <pointLight position={[0, 2, 0]} intensity={0.3} color="#ffffff" />

                {/* Skeleton */}
                <SkeletonModel
                    selectedPart={selectedOrgan}
                    onSelectPart={(part) => {
                        setAutoRotate(false)
                        onSelectOrgan(part)
                    }}
                    autoRotate={autoRotate}
                />

                {/* Controls */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={0.8}
                    maxDistance={3}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.5}
                    onStart={() => setAutoRotate(false)}
                />
            </Canvas>

            {/* Overlay instructions */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.65rem',
                color: 'rgba(255,255,255,0.5)',
                pointerEvents: 'none',
            }}>
                Drag to rotate • Click organ to select
            </div>
        </div>
    )
}
