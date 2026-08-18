import type { Task, User, AuthTokens } from '../types'

const baseUrl = import.meta.env.VITE_API_URL

export async function login(_email: string, _password: string): Promise<AuthTokens> {
    // TODO: replace with real fetch once the API is connected
    // return fetch(`${baseUrl}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: _email, password: _password }),
    // }).then((res) => res.json())

    console.log('API base URL will be used here:', baseUrl)
    return Promise.resolve({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
    })
}

export async function getTasks(): Promise<Task[]> {
    // TODO: replace with real fetch once the API is connected
    // return fetch(`${baseUrl}/tasks`).then((res) => res.json())

    return Promise.resolve([])
}

export async function getCurrentUser(): Promise<User> {
    // TODO: replace with real fetch once the API is connected
    // return fetch(`${baseUrl}/users/me`).then((res) => res.json())

    return Promise.resolve({
        id: '1',
        name: 'Mock User',
        email: 'mock@example.com',
    })
}