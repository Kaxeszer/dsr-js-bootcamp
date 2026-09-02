import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { useAuthStore } from './store/authStore'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TaskDetailPage from './pages/TaskDetailPage'

function AppRoutes() {
    const { accessToken } = useAuthStore()
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/dashboard"
                element={accessToken ? <DashboardPage /> : <Navigate to="/login" />}
            />
            <Route
                path="/tasks/:id"
                element={accessToken ? <TaskDetailPage /> : <Navigate to="/login" />}
            />
        </Routes>
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