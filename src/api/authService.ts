import type { LoginResponse } from '../types'

const baseUrl = import.meta.env.VITE_API_BASE_URL

interface BackendErrorBody {
    message: string | string[]
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
    try {
        const body: BackendErrorBody = await response.json()
        if (Array.isArray(body.message)) {
            return body.message.map(capitalize).join('\n')
        }
        if (typeof body.message === 'string') {
            return capitalize(body.message)
        }
    } catch {
        // response body wasn't valid JSON, fall through to fallback
    }
    return fallback
}

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