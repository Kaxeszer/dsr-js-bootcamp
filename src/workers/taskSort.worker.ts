import type { Task } from '../types'

export type SortField = 'title' | 'priority' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

interface WorkerRequest {
    tasks: Task[]
    searchText: string
    sortField: SortField
    sortDirection: SortDirection
}

const PRIORITY_ORDER: Record<Task['priority'], number> = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
}

function getDayTimestamp(isoDate: string): number {
    const date = new Date(isoDate)
    date.setHours(0, 0, 0, 0)
    return date.getTime()
}

function processTasks({ tasks, searchText, sortField, sortDirection }: WorkerRequest): Task[] {
    const search = searchText.toLowerCase()

    const filtered = tasks.filter((task) => {
        const title = task.title.toLowerCase()
        return title.includes(search)
    })

    return [...filtered].sort((a, b) => {
        const isAscending = sortDirection === 'asc'

        if (sortField === 'title') {
            const titleA = a.title
            const titleB = b.title
            const comparison = titleA.localeCompare(titleB)
            return isAscending ? comparison : -comparison
        }

        if (sortField === 'priority') {
            const priorityA = PRIORITY_ORDER[a.priority]
            const priorityB = PRIORITY_ORDER[b.priority]
            const priorityComparison = isAscending ? priorityA - priorityB : priorityB - priorityA
            return priorityComparison !== 0 ? priorityComparison : a.title.localeCompare(b.title)
        }

        const timeA = getDayTimestamp(a.createdAt)
        const timeB = getDayTimestamp(b.createdAt)
        const timeComparison = isAscending ? timeA - timeB : timeB - timeA
        return timeComparison !== 0 ? timeComparison : a.title.localeCompare(b.title)
    })
}

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
    const result = processTasks(event.data)
    self.postMessage(result)
}