import { Link } from 'react-router-dom'

function Header() {
    return (
        <header>
            <h1>Task App</h1>
            <nav>
                <Link to="/login">Login</Link>
                {' | '}
                <Link to="/register">Register</Link>
                {' | '}
                <Link to="/tasks">Tasks</Link>
                {' | '}
                <Link to="/dashboard">Dashboard</Link>
            </nav>
        </header>
    )
}

export default Header