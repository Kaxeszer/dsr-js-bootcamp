import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../store/authStore'
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas'
import { useLoginMascotState } from '../hooks/useLoginMascotState'
import LoginMascot from '../components/LoginMascot'
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    IconButton,
    InputAdornment,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

function LoginPage() {
    const { login, isLoading, error, clearError } = useAuthStore()
    const navigate = useNavigate()

    const mascot = useLoginMascotState()

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
                <LoginMascot
                    nicknameLength={mascot.nicknameLength}
                    passwordLength={mascot.passwordLength}
                    isNicknameFocused={mascot.isNicknameFocused}
                    isPasswordFocused={mascot.isPasswordFocused}
                    isPasswordVisible={mascot.isPasswordVisible}
                />

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
                        {...mascot.bindNicknameField(register('nickname'))}
                        error={!!errors.nickname}
                        helperText={errors.nickname?.message}
                    />
                    <TextField
                        label="Password"
                        type={mascot.isPasswordVisible ? 'text' : 'password'}
                        fullWidth
                        {...mascot.bindPasswordField(register('password'))}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={mascot.toggleVisibility}
                                            edge="end"
                                            size="small"
                                        >
                                            {mascot.isPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
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