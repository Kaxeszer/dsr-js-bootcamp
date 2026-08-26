import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContextDefinition'

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return localStorage.getItem('accessToken')
    })

    function login(username: string, _password: string) {
        const mockToken = `mock-token-${username}-${Date.now()}`
        localStorage.setItem('accessToken', mockToken)
        setAccessToken(mockToken)
    }

    function logout() {
        localStorage.removeItem('accessToken')
        setAccessToken(null)
    }

    return (
        <AuthContext.Provider value={{ accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}