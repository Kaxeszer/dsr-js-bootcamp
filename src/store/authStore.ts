import { create } from 'zustand'
import type { User } from '../types'
import { login as loginRequest, register as registerRequest } from '../api/authService'

interface AuthState {
    accessToken: string | null
    user: User | null
    isLoading: boolean
    error: string
    login: (nickname: string, password: string) => Promise<boolean>
    register: (nickname: string, password: string, email?: string) => Promise<boolean>
    logout: () => void
    clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: localStorage.getItem('accessToken'),
    user: null,
    isLoading: false,
    error: '',

    login: async (nickname, password) => {
        set({ isLoading: true, error: '' })
        try {
            const { accessToken, user } = await loginRequest(nickname, password)
            localStorage.setItem('accessToken', accessToken)
            set({ accessToken, user, isLoading: false })
            return true
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Invalid nickname or password'
            set({ error: message, isLoading: false })
            return false
        }
    },

    register: async (nickname, password, email) => {
        set({ isLoading: true, error: '' })
        try {
            const { accessToken, user } = await registerRequest(nickname, password, email)
            localStorage.setItem('accessToken', accessToken)
            set({ accessToken, user, isLoading: false })
            return true
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Could not register'
            set({ error: message, isLoading: false })
            return false
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken')
        set({ accessToken: null, user: null })
    },

    clearError: () => set({ error: '' }),
}))