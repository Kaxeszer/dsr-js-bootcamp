interface RobotFaceProps {
    leftEyeOffsetX?: number
    leftEyeOffsetY?: number
    rightEyeOffsetX?: number
    rightEyeOffsetY?: number
    leftEyeOpen: boolean
    rightEyeOpen: boolean
    gradientIdPrefix: string
    eyeTransition?: string
}

function RobotFace({
                       leftEyeOffsetX = 0,
                       leftEyeOffsetY = 0,
                       rightEyeOffsetX = 0,
                       rightEyeOffsetY = 0,
                       leftEyeOpen,
                       rightEyeOpen,
                       gradientIdPrefix,
                       eyeTransition,
                   }: RobotFaceProps) {
    const headGradientId = `${gradientIdPrefix}HeadGradient`
    const screenGradientId = `${gradientIdPrefix}ScreenGradient`
    const pulseAnimationName = `${gradientIdPrefix}HornLightPulse`

    return (
        <svg viewBox="-10 -50 160 180" width="100%" height="100%">
            <defs>
                <linearGradient id={headGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#CFD8DC" />
                    <stop offset="100%" stopColor="#90A4AE" />
                </linearGradient>
                <linearGradient id={screenGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1A2333" />
                    <stop offset="100%" stopColor="#0B1220" />
                </linearGradient>
            </defs>

            {/* Left horn */}
            <line x1="48" y1="20" x2="30" y2="-5" stroke="#78909C" strokeWidth="6" strokeLinecap="round" />
            <circle cx="30" cy="-5" r="10" fill="#4DD0E1" />

            {/* Right horn - longer, with pulsing light */}
            <line x1="92" y1="20" x2="116" y2="-30" stroke="#78909C" strokeWidth="6" strokeLinecap="round" />
            <circle cx="116" cy="-30" r="10" fill="#4DD0E1" />
            <circle
                cx="116"
                cy="-30"
                r="10"
                fill="#4DD0E1"
                style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    animation: `${pulseAnimationName} 1.6s ease-out infinite`,
                }}
            />

            {/* Ears */}
            <circle cx="12" cy="70" r="8" fill="#78909C" />
            <circle cx="128" cy="70" r="8" fill="#78909C" />

            {/* Head, centered at (70, 70), 110x110 */}
            <rect x="15" y="15" width="110" height="110" rx="30" fill={`url(#${headGradientId})`} />
            <rect x="15" y="15" width="110" height="110" rx="30" fill="none" stroke="#78909C" strokeWidth="2" />

            {/* Screen, centered at (70, 70) */}
            <rect x="26" y="34" width="88" height="72" rx="18" fill={`url(#${screenGradientId})`} />

            {/* Left eye */}
            <ellipse
                cx={50 + leftEyeOffsetX}
                cy={70 + leftEyeOffsetY}
                rx="10"
                ry={leftEyeOpen ? 10 : 2}
                fill="#4DD0E1"
                style={eyeTransition ? { transition: eyeTransition } : undefined}
            />
            {leftEyeOpen && (
                <circle
                    cx={47 + leftEyeOffsetX}
                    cy={67 + leftEyeOffsetY}
                    r="3"
                    fill="#E0FFFF"
                    style={eyeTransition ? { transition: eyeTransition } : undefined}
                />
            )}

            {/* Right eye */}
            <ellipse
                cx={90 + rightEyeOffsetX}
                cy={70 + rightEyeOffsetY}
                rx="10"
                ry={rightEyeOpen ? 10 : 2}
                fill="#4DD0E1"
                style={eyeTransition ? { transition: eyeTransition } : undefined}
            />
            {rightEyeOpen && (
                <circle
                    cx={87 + rightEyeOffsetX}
                    cy={67 + rightEyeOffsetY}
                    r="3"
                    fill="#E0FFFF"
                    style={eyeTransition ? { transition: eyeTransition } : undefined}
                />
            )}

            <style>
                {`
                    @keyframes ${pulseAnimationName} {
                        0% {
                            opacity: 0.9;
                            transform: scale(1);
                        }
                        70% {
                            opacity: 0;
                            transform: scale(2.2);
                        }
                        100% {
                            opacity: 0;
                            transform: scale(2.2);
                        }
                    }
                `}
            </style>
        </svg>
    )
}

export default RobotFace