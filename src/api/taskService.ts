import type { Task, TaskListResponse, TaskStatus, TaskPriority } from '../types'
import { extractErrorMessage } from './errorUtils'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tasks`

function authHeaders(accessToken: string) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
    }
}

export async function fetchTasks(accessToken: string): Promise<TaskListResponse> {
    const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to fetch tasks')
        throw new Error(message)
    }
    return res.json()
}

export async function createTask(
    accessToken: string,
    title: string,
    description: string,
    priority: TaskPriority
): Promise<Task> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({
            title,
            description,
            status: 'TODO',
            priority,
            visibility: 'ANYONE',
            viewerUserIds: [],
        }),
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to create task')
        throw new Error(message)
    }
    return res.json()
}

export async function deleteTaskById(accessToken: string, id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
        const message = await extractErrorMessage(
            res,
            'Failed to delete task',
            'You do not have permission to delete this task'
        )
        throw new Error(message)
    }
}

export async function replaceTaskStatus(
    accessToken: string,
    task: Task,
    status: TaskStatus
): Promise<Task> {
    const res = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: authHeaders(accessToken),
        body: JSON.stringify({
            title: task.title,
            description: task.description ?? '',
            status,
            priority: task.priority,
            visibility: task.visibility,
            viewerUserIds: task.viewerUserIds ?? [],
        }),
    })
    if (!res.ok) {
        const message = await extractErrorMessage(
            res,
            'Failed to update task',
            'You do not have permission to update this task'
        )
        throw new Error(message)
    }
    return res.json()
}