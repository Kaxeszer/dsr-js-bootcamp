import { useState, type SubmitEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (!username || !password) return

        login(username, password)
        navigate('/dashboard')
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Login"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Log in</button>
            </form>
        </div>
    )
}

export default LoginPage