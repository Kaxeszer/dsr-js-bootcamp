import { useEffect, useState } from 'react'
import { fetchUsers } from '../api/userService'
import type { UserPicker } from '../types'

export function useUsersList(accessToken: string | null) {
    const [users, setUsers] = useState<UserPicker[]>([])

    useEffect(() => {
        if (accessToken) {
            void fetchUsers(accessToken)
                .then(setUsers)
                .catch(() => setUsers([]))
        }
    }, [accessToken])

    return users
}