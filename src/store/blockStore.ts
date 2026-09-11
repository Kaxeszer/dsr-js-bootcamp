import { create } from 'zustand'
import type { AssignmentBlockWithUser } from '../types'
import { getErrorMessage } from '../api/errorUtils'
import { fetchMyBlocks, createBlock, removeMyBlock } from '../api/blockService'

interface BlockState {
    blocks: AssignmentBlockWithUser[]
    isLoading: boolean
    error: string
    loadBlocks: (accessToken: string) => Promise<void>
    addBlock: (accessToken: string, blockedUserId: string, comment?: string) => Promise<boolean>
    removeBlock: (accessToken: string, blockedUserId: string) => Promise<void>
}

export const useBlockStore = create<BlockState>((set, get) => ({
    blocks: [],
    isLoading: false,
    error: '',

    loadBlocks: async (accessToken) => {
        set({ isLoading: true, error: '' })
        try {
            const blocks = await fetchMyBlocks(accessToken)
            set({ blocks, isLoading: false })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not load blocks'), isLoading: false })
        }
    },

    addBlock: async (accessToken, blockedUserId, comment) => {
        set({ error: '' })
        try {
            await createBlock(accessToken, blockedUserId, comment)
            await get().loadBlocks(accessToken)
            return true
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not create block') })
            return false
        }
    },

    removeBlock: async (accessToken, blockedUserId) => {
        set({ error: '' })
        try {
            await removeMyBlock(accessToken, blockedUserId)
            set({ blocks: get().blocks.filter((b) => b.blockedUserId !== blockedUserId) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not remove block') })
        }
    },
}))