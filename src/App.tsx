import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TasksPage from './pages/TasksPage'
import TaskDetailPage from './pages/TaskDetailPage'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/tasks"
                element={
                    <ProtectedRoute>
                        <TasksPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/tasks/:id"
                element={
                    <ProtectedRoute>
                        <TaskDetailPage />
                    </ProtectedRoute>
                }
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