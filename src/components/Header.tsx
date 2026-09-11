import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../hooks/useTheme'
import { AppBar, Toolbar, Button, Box, IconButton } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import HeaderMascot from '../components/HeaderMascot'

function Header() {
    const { accessToken, logout } = useAuthStore()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const hideMascot = location.pathname === '/login'

    return (
        <AppBar position="static">
            <Toolbar>
                {!hideMascot && <HeaderMascot />}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>

                    {accessToken ? (
                        <>
                            <Button color="inherit" component={Link} to="/tasks">
                                Tasks
                            </Button>
                            <Button color="inherit" component={Link} to="/account">
                                Account
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header