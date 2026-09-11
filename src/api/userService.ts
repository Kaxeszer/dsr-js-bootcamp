import type { UserPicker, AdminUserRow } from '../types'
import { extractErrorMessage } from './errorUtils'

const baseUrl = import.meta.env.VITE_API_BASE_URL

function authHeaders(accessToken: string) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
}

export async function fetchUsers(accessToken: string): Promise<UserPicker[]> {
    const response = await fetch(`${baseUrl}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not load users')
        throw new Error(message)
    }
    return response.json()
}

export async function fetchAllUsersAdmin(accessToken: string): Promise<AdminUserRow[]> {
    const response = await fetch(`${baseUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not load users')
        throw new Error(message)
    }
    return response.json()
}

export async function banUser(accessToken: string, userId: string): Promise<void> {
    const response = await fetch(`${baseUrl}/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: authHeaders(accessToken),
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not ban user')
        throw new Error(message)
    }
}

export async function unbanUser(accessToken: string, userId: string): Promise<void> {
    const response = await fetch(`${baseUrl}/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: authHeaders(accessToken),
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not unban user')
        throw new Error(message)
    }
}