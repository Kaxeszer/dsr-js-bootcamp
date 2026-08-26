import { createContext } from 'react'

export interface AuthContextType {
    accessToken: string | null
    login: (nickname: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)