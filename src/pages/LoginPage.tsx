import { useState, useEffect, type SubmitEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material'

function LoginPage() {
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading, error, clearError } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        clearError()
    }, [clearError])

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (!nickname || !password) return

        const success = await login(nickname, password)
        if (success) {
            navigate('/dashboard')
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                    <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </Button>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ whiteSpace: 'pre-line' }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Container>
    )
}

export default LoginPage