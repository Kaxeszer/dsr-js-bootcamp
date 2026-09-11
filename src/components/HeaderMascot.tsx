import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import RobotFace from './RobotFace'

function HeaderMascot() {
    const targetPosition = useRef({ x: 0, y: 0 })
    const currentPosition = useRef({ x: 0, y: 0 })
    const animationFrame = useRef<number | null>(null)

    const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
    const [eyesClosed, setEyesClosed] = useState(false)

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const screenWidth = window.innerWidth
            const screenHeight = window.innerHeight

            targetPosition.current = {
                x: -12 + (event.clientX / screenWidth) * 24,
                y: -8 + (event.clientY / screenHeight) * 16,
            }
        }

        const animate = () => {
            const current = currentPosition.current
            const target = targetPosition.current

            current.x += (target.x - current.x) * 0.12
            current.y += (target.y - current.y) * 0.12

            setEyePosition({ x: current.x, y: current.y })

            animationFrame.current = requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', handleMouseMove)
        animationFrame.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            if (animationFrame.current !== null) {
                cancelAnimationFrame(animationFrame.current)
            }
        }
    }, [])

    useEffect(() => {
        let closeTimeoutId: ReturnType<typeof setTimeout>
        let blinkTimeoutId: ReturnType<typeof setTimeout>

        const scheduleBlink = () => {
            const delay = 2000 + Math.random() * 1500
            blinkTimeoutId = setTimeout(() => {
                setEyesClosed(true)

                closeTimeoutId = setTimeout(() => {
                    setEyesClosed(false)
                    scheduleBlink()
                }, 130)
            }, delay)
        }

        scheduleBlink()

        return () => {
            clearTimeout(blinkTimeoutId)
            clearTimeout(closeTimeoutId)
        }
    }, [])

    return (
        <Box sx={{ width: 56, height: 56, overflow: 'visible' }}>
            <RobotFace
                gradientIdPrefix="header"
                leftEyeOffsetX={eyePosition.x}
                leftEyeOffsetY={eyePosition.y}
                rightEyeOffsetX={eyePosition.x}
                rightEyeOffsetY={eyePosition.y}
                leftEyeOpen={!eyesClosed}
                rightEyeOpen={!eyesClosed}
            />
        </Box>
    )
}

export default HeaderMascot