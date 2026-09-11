import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { useAuthStore } from './store/authStore'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { CircularProgress, Box } from '@mui/material'

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
            <Header />
            <main style={{ display: 'flex', justifyContent: 'center' }}>
                <AppRoutes />
            </main>
        </ThemeProvider>
    )
}

export default App