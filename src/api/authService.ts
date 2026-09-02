import type { LoginResponse } from '../types'

const baseUrl = import.meta.env.VITE_API_BASE_URL

export async function login(nickname: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    })

    if (!response.ok) {
        throw new Error('Invalid credentials')
    }

    return response.json()
}