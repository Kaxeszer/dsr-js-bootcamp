import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/useAuth'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TasksPage from './pages/TasksPage'
import DashboardPage from './pages/DashboardPage'

function AppRoutes() {
    const { accessToken } = useAuth()

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route
                path="/dashboard"
                element={accessToken ? <DashboardPage /> : <Navigate to="/login" />}
            />
        </Routes>
    )
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Header />
                    <main>
                        <AppRoutes />
                    </main>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App