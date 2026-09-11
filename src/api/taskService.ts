import type { Task, TaskListResponse, TaskPriority, TaskStatus, Tag } from '../types'
import { extractErrorMessage } from './errorUtils'

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/tasks`
const TAGS_URL = `${import.meta.env.VITE_API_BASE_URL}/tags`

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

interface TaskDetailsUpdate {
    title?: string
    description?: string
    priority?: TaskPriority
}

export async function updateTaskDetails(
    accessToken: string,
    task: Task,
    changes: TaskDetailsUpdate
): Promise<Task> {
    const res = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: authHeaders(accessToken),
        body: JSON.stringify({
            title: changes.title ?? task.title,
            description: changes.description ?? task.description ?? '',
            status: task.status,
            priority: changes.priority ?? task.priority,
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

export async function assignTask(
    accessToken: string,
    taskId: string,
    assigneeId: string
): Promise<Task> {
    const res = await fetch(`${API_URL}/${taskId}/assignment`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ assigneeId }),
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to assign task')
        throw new Error(message)
    }
    return res.json()
}

export async function approveAssignment(accessToken: string, taskId: string): Promise<Task> {
    const res = await fetch(`${API_URL}/${taskId}/assignment/approve`, {
        method: 'POST',
        headers: authHeaders(accessToken),
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to approve assignment')
        throw new Error(message)
    }
    return res.json()
}

export async function rejectAssignment(
    accessToken: string,
    taskId: string,
    blockAssigner?: boolean,
    comment?: string
): Promise<Task> {
    const res = await fetch(`${API_URL}/${taskId}/assignment/reject`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ blockAssigner, comment }),
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to reject assignment')
        throw new Error(message)
    }
    return res.json()
}

export async function updateAssigneeStatus(
    accessToken: string,
    taskId: string,
    status: TaskStatus
): Promise<Task> {
    const res = await fetch(`${API_URL}/${taskId}/assignee-status`, {
        method: 'PATCH',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ status }),
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to update task status')
        throw new Error(message)
    }
    return res.json()
}

export async function addTagToTask(
    accessToken: string,
    taskId: string,
    name: string
): Promise<Task> {
    const res = await fetch(`${API_URL}/${taskId}/tags`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ name }),
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to add tag')
        throw new Error(message)
    }
    return res.json()
}

export async function removeTagFromTask(
    accessToken: string,
    taskId: string,
    tagId: string
): Promise<Task> {
    const res = await fetch(`${API_URL}/${taskId}/tags/${tagId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to remove tag')
        throw new Error(message)
    }
    return res.json()
}

export async function fetchAllTags(accessToken: string): Promise<Tag[]> {
    const res = await fetch(TAGS_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) {
        const message = await extractErrorMessage(res, 'Failed to fetch tags')
        throw new Error(message)
    }
    return res.json()
}