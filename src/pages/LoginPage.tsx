import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../store/authStore'
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas'
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material'

function LoginPage() {
    const { login, isLoading, error, clearError } = useAuthStore()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    })

    useEffect(() => {
        clearError()
    }, [clearError])

    const onSubmit = async (data: LoginFormValues) => {
        const success = await login(data.nickname, data.password)
        if (success) {
            navigate('/tasks')
        }
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5" component="h2">
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Nickname"
                        fullWidth
                        {...register('nickname')}
                        error={!!errors.nickname}
                        helperText={errors.nickname?.message}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
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