import { useEffect, useState } from 'react'
import { fetchAllTags } from '../api/taskService'
import type { Tag } from '../types'

export function useTagsList(accessToken: string | null) {
    const [tags, setTags] = useState<Tag[]>([])

    useEffect(() => {
        if (accessToken) {
            void fetchAllTags(accessToken)
                .then(setTags)
                .catch(() => setTags([]))
        }
    }, [accessToken])

    return tags
}