import type { Task, LoginResponse } from '../types'

const baseUrl = process.env.API_BASE_URL

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

export async function getTasks(accessToken: string): Promise<Task[]> {
    const response = await fetch(`${baseUrl}/tasks`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch tasks')
    }

    return response.json()
}