import type { Task } from '../types'

export type SortField = 'title' | 'priority' | 'status' | 'tag' | 'assignee' | 'creator' | 'createdAt'
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

const STATUS_ORDER: Record<Task['status'], number> = {
    TODO: 0,
    IN_PROGRESS: 1,
    DONE: 2,
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
            const comparison = a.title.localeCompare(b.title)
            return isAscending ? comparison : -comparison
        }

        if (sortField === 'priority') {
            const priorityA = PRIORITY_ORDER[a.priority]
            const priorityB = PRIORITY_ORDER[b.priority]
            const priorityComparison = isAscending ? priorityA - priorityB : priorityB - priorityA
            return priorityComparison !== 0 ? priorityComparison : a.title.localeCompare(b.title)
        }

        if (sortField === 'status') {
            const statusA = STATUS_ORDER[a.status]
            const statusB = STATUS_ORDER[b.status]
            const statusComparison = isAscending ? statusA - statusB : statusB - statusA
            return statusComparison !== 0 ? statusComparison : a.title.localeCompare(b.title)
        }

        if (sortField === 'tag') {
            const tagA = a.tags[0]?.name ?? ''
            const tagB = b.tags[0]?.name ?? ''
            const tagComparison = isAscending ? tagA.localeCompare(tagB) : tagB.localeCompare(tagA)
            return tagComparison !== 0 ? tagComparison : a.title.localeCompare(b.title)
        }

        if (sortField === 'assignee') {
            const assigneeA = a.assignee?.nickname ?? ''
            const assigneeB = b.assignee?.nickname ?? ''
            const assigneeComparison = isAscending
                ? assigneeA.localeCompare(assigneeB)
                : assigneeB.localeCompare(assigneeA)
            return assigneeComparison !== 0 ? assigneeComparison : a.title.localeCompare(b.title)
        }

        if (sortField === 'creator') {
            const comparison = a.creator.nickname.localeCompare(b.creator.nickname)
            return isAscending ? comparison : -comparison
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