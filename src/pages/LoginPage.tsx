import { useState, type SubmitEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material'

function LoginPage() {
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setError('')
        if (!nickname || !password) return

        try {
            await login(nickname, password)
            navigate('/dashboard')
        } catch {
            setError('Invalid nickname or password')
        }
    }

    return (
        <Container maxWidth="xs">
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
                    <Button type="submit" variant="contained" fullWidth>
                        Log in
                    </Button>
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        </Container>
    )
}

export default LoginPage