import { create } from 'zustand'
import type { User } from '../types'
import { getErrorMessage } from '../api/errorUtils'
import {
    login as loginRequest,
    register as registerRequest,
    changePassword as changePasswordRequest,
} from '../api/authService'

interface AuthState {
    accessToken: string | null
    user: User | null
    isLoading: boolean
    error: string
    login: (nickname: string, password: string) => Promise<boolean>
    register: (nickname: string, password: string, email?: string) => Promise<boolean>
    changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
    logout: () => void
    clearError: () => void
}

function getStoredUser(): User | null {
    const stored = localStorage.getItem('user')
    if (!stored) return null
    try {
        return JSON.parse(stored) as User
    } catch {
        return null
    }
}

function persistSession(accessToken: string, user: User) {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(user))
}

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: localStorage.getItem('accessToken'),
    user: getStoredUser(),
    isLoading: false,
    error: '',

    login: async (nickname, password) => {
        set({ isLoading: true, error: '' })
        try {
            const { accessToken, user } = await loginRequest(nickname, password)
            persistSession(accessToken, user)
            set({ accessToken, user, isLoading: false })
            return true
        } catch (err) {
            set({ error: getErrorMessage(err, 'Invalid nickname or password'), isLoading: false })
            return false
        }
    },

    register: async (nickname, password, email) => {
        set({ isLoading: true, error: '' })
        try {
            const { accessToken, user } = await registerRequest(nickname, password, email)
            persistSession(accessToken, user)
            set({ accessToken, user, isLoading: false })
            return true
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not register'), isLoading: false })
            return false
        }
    },

    changePassword: async (currentPassword, newPassword) => {
        const { accessToken } = get()
        if (!accessToken) return false

        set({ isLoading: true, error: '' })
        try {
            await changePasswordRequest(accessToken, currentPassword, newPassword)
            set({ isLoading: false })
            return true
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not change password'), isLoading: false })
            return false
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        set({ accessToken: null, user: null })
    },

    clearError: () => set({ error: '' }),
}))