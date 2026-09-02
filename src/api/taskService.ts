import type { Task, TaskListResponse, TaskStatus, TaskPriority } from '../types'

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
        throw new Error('Failed to fetch tasks')
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
        throw new Error('Failed to create task')
    }
    return res.json()
}

export async function deleteTaskById(accessToken: string, id: string): Promise<void> {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
    })
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
        throw new Error('Failed to update task')
    }
    return res.json()
}