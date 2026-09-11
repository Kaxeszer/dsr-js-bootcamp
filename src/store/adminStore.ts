import { create } from 'zustand'
import type { AdminUserRow, AssignmentBlockAdminRow } from '../types'
import { getErrorMessage } from '../api/errorUtils'
import {
    fetchAllUsersAdmin,
    banUser as banUserRequest,
    unbanUser as unbanUserRequest,
} from '../api/userService'
import { fetchAllBlocksAdmin, removeBlockAdmin } from '../api/blockService'

interface AdminState {
    users: AdminUserRow[]
    blocks: AssignmentBlockAdminRow[]
    isLoading: boolean
    error: string
    loadUsers: (accessToken: string) => Promise<void>
    banUser: (accessToken: string, userId: string) => Promise<void>
    unbanUser: (accessToken: string, userId: string) => Promise<void>
    loadBlocks: (accessToken: string) => Promise<void>
    removeBlock: (accessToken: string, blockerId: string, blockedUserId: string) => Promise<void>
}

export const useAdminStore = create<AdminState>((set, get) => ({
    users: [],
    blocks: [],
    isLoading: false,
    error: '',

    loadUsers: async (accessToken) => {
        set({ isLoading: true, error: '' })
        try {
            const users = await fetchAllUsersAdmin(accessToken)
            set({ users, isLoading: false })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not load users'), isLoading: false })
        }
    },

    banUser: async (accessToken, userId) => {
        set({ error: '' })
        try {
            await banUserRequest(accessToken, userId)
            await get().loadUsers(accessToken)
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not ban user') })
        }
    },

    unbanUser: async (accessToken, userId) => {
        set({ error: '' })
        try {
            await unbanUserRequest(accessToken, userId)
            await get().loadUsers(accessToken)
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not unban user') })
        }
    },

    loadBlocks: async (accessToken) => {
        set({ isLoading: true, error: '' })
        try {
            const blocks = await fetchAllBlocksAdmin(accessToken)
            set({ blocks, isLoading: false })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not load blocks'), isLoading: false })
        }
    },

    removeBlock: async (accessToken, blockerId, blockedUserId) => {
        set({ error: '' })
        try {
            await removeBlockAdmin(accessToken, blockerId, blockedUserId)
            await get().loadBlocks(accessToken)
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not remove block') })
        }
    },
}))