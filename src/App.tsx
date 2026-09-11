import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { useAuthStore } from './store/authStore'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { CircularProgress, Box, Typography } from '@mui/material'

const TasksPage = lazy(() => import('./pages/TasksPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))

function PageLoadingFallback() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={28} />
        </Box>
    )
}

function AppRoutes() {
    const { accessToken } = useAuthStore()

    return (
        <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to={accessToken ? '/tasks' : '/login'} replace />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/tasks/*"
                    element={
                        <ProtectedRoute>
                            <TasksPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <AccountPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="*"
                    element={<Navigate to={accessToken ? '/tasks' : '/login'} replace />}
                />
            </Routes>
        </Suspense>
    )
}

function App() {
    return (
        <ThemeProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />

                <main style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                    <AppRoutes />
                </main>

                <Box component="footer" sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        © 2026 Luís Pereira. Made for the DSR JS Bootcamp 2026. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default App