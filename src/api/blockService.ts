import type { AssignmentBlockWithUser, AssignmentBlockAdminRow } from '../types'
import { extractErrorMessage } from './errorUtils'

const baseUrl = import.meta.env.VITE_API_BASE_URL

function authHeaders(accessToken: string) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
}

export async function fetchMyBlocks(accessToken: string): Promise<AssignmentBlockWithUser[]> {
    const response = await fetch(`${baseUrl}/blocks/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not load blocks')
        throw new Error(message)
    }
    return response.json()
}

export async function createBlock(
    accessToken: string,
    blockedUserId: string,
    comment?: string
): Promise<void> {
    const response = await fetch(`${baseUrl}/blocks`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ blockedUserId, comment }),
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not create block')
        throw new Error(message)
    }
}

export async function removeMyBlock(accessToken: string, blockedUserId: string): Promise<void> {
    const response = await fetch(`${baseUrl}/blocks/me/${blockedUserId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not remove block')
        throw new Error(message)
    }
}

export async function fetchAllBlocksAdmin(accessToken: string): Promise<AssignmentBlockAdminRow[]> {
    const response = await fetch(`${baseUrl}/admin/blocks`, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not load blocks')
        throw new Error(message)
    }
    return response.json()
}

export async function removeBlockAdmin(
    accessToken: string,
    blockerId: string,
    blockedUserId: string
): Promise<void> {
    const params = new URLSearchParams({ blockerId, blockedUserId })
    const response = await fetch(`${baseUrl}/admin/blocks?${params.toString()}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
        const message = await extractErrorMessage(response, 'Could not remove block')
        throw new Error(message)
    }
}