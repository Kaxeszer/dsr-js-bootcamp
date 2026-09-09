// src/components/LoginMascot.tsx
import { Box } from '@mui/material'

interface LoginMascotProps {
    nicknameLength: number
    passwordLength: number
    isNicknameFocused: boolean
    isPasswordFocused: boolean
    isPasswordVisible: boolean
}

function LoginMascot({
                         nicknameLength,
                         passwordLength,
                         isNicknameFocused,
                         isPasswordFocused,
                         isPasswordVisible,
                     }: LoginMascotProps) {
    const nicknameOffset = Math.min(nicknameLength * 1.4, 18) - 9
    const passwordOffset = Math.min(passwordLength * 0.9, 9) - 4.5

    const eyesClosed = isPasswordFocused && !isPasswordVisible
    const oneEyePeeking = isPasswordFocused && isPasswordVisible

    const leftEyeOpen = !eyesClosed && !oneEyePeeking
    const rightEyeOpen = !eyesClosed

    let leftEyeOffset = 0
    let rightEyeOffset = 0

    if (isNicknameFocused) {
        leftEyeOffset = nicknameOffset
        rightEyeOffset = nicknameOffset
    } else if (oneEyePeeking) {
        rightEyeOffset = passwordOffset
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
                <defs>
                    <linearGradient id="headGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#CFD8DC" />
                        <stop offset="100%" stopColor="#90A4AE" />
                    </linearGradient>
                    <linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1A2333" />
                        <stop offset="100%" stopColor="#0B1220" />
                    </linearGradient>
                </defs>

                {/* Antenna */}
                <line x1="70" y1="4" x2="70" y2="16" stroke="#78909C" strokeWidth="3" strokeLinecap="round" />
                <circle cx="70" cy="4" r="5" fill="#4DD0E1" />

                {/* Ears */}
                <circle cx="12" cy="70" r="8" fill="#78909C" />
                <circle cx="128" cy="70" r="8" fill="#78909C" />

                {/* Head, centered at (70, 70), 110x110 */}
                <rect x="15" y="15" width="110" height="110" rx="30" fill="url(#headGradient)" />
                <rect x="15" y="15" width="110" height="110" rx="30" fill="none" stroke="#78909C" strokeWidth="2" />

                {/* Screen, centered at (70, 70) */}
                <rect x="26" y="34" width="88" height="72" rx="18" fill="url(#screenGradient)" />

                {/* Left eye */}
                <ellipse
                    cx={50 + leftEyeOffset}
                    cy="70"
                    rx="10"
                    ry={leftEyeOpen ? 10 : 2}
                    fill="#4DD0E1"
                    style={{ transition: 'cx 200ms ease, ry 250ms ease' }}
                />
                {leftEyeOpen && (
                    <circle
                        cx={47 + leftEyeOffset}
                        cy="67"
                        r="3"
                        fill="#E0FFFF"
                        style={{ transition: 'cx 200ms ease, opacity 250ms ease' }}
                    />
                )}

                {/* Right eye */}
                <ellipse
                    cx={90 + rightEyeOffset}
                    cy="70"
                    rx="10"
                    ry={rightEyeOpen ? 10 : 2}
                    fill="#4DD0E1"
                    style={{ transition: 'cx 200ms ease, ry 250ms ease' }}
                />
                {rightEyeOpen && (
                    <circle
                        cx={87 + rightEyeOffset}
                        cy="67"
                        r="3"
                        fill="#E0FFFF"
                        style={{ transition: 'cx 200ms ease, opacity 250ms ease' }}
                    />
                )}
            </svg>
        </Box>
    )
}

export default LoginMascot