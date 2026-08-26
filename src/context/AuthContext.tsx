import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContextDefinition'
import { login as loginRequest } from '../api/client'

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        return localStorage.getItem('accessToken')
    })

    async function login(nickname: string, password: string) {
        const { accessToken: token } = await loginRequest(nickname, password)
        localStorage.setItem('accessToken', token)
        setAccessToken(token)
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