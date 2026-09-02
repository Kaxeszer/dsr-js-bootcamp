import type { LoginResponse } from '../types'
import { extractErrorMessage } from './errorUtils'

const baseUrl = import.meta.env.VITE_API_BASE_URL

export async function login(nickname: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    })

    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Invalid credentials')
        throw new Error(message)
    }

    return response.json()
}

export async function register(
    nickname: string,
    password: string,
    email?: string
): Promise<LoginResponse> {
    const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password, email }),
    })

    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not register')
        throw new Error(message)
    }

    return response.json()
}