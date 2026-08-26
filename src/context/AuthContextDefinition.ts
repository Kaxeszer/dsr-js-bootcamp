import { createContext } from 'react'

export interface AuthContextType {
    accessToken: string | null
    login: (username: string, password: string) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)