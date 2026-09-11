import { Box } from '@mui/material'
import RobotFace from './RobotFace'

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

    let leftEyeOffsetX = 0
    let rightEyeOffsetX = 0

    if (isNicknameFocused) {
        leftEyeOffsetX = nicknameOffset
        rightEyeOffsetX = nicknameOffset
    } else if (oneEyePeeking) {
        rightEyeOffsetX = passwordOffset
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, height: 170 }}>
            <Box sx={{ width: 140, height: 170 }}>
                <RobotFace
                    gradientIdPrefix="login"
                    leftEyeOffsetX={leftEyeOffsetX}
                    rightEyeOffsetX={rightEyeOffsetX}
                    leftEyeOpen={leftEyeOpen}
                    rightEyeOpen={rightEyeOpen}
                    eyeTransition="cx 200ms ease, ry 250ms ease"
                />
            </Box>
        </Box>
    )
}

export default LoginMascot