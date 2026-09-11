import type { TaskStatus, TaskPriority } from '../types'

export const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
}

export const STATUS_COLORS: Record<TaskStatus, 'info' | 'primary' | 'success'> = {
    TODO: 'info',
    IN_PROGRESS: 'primary',
    DONE: 'success',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
}

export const PRIORITY_COLORS: Record<TaskPriority, 'success' | 'warning' | 'error'> = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'error',
}

export const PRIORITY_BAR_COLORS: Record<TaskPriority, string> = {
    LOW: '#66bb6a',
    MEDIUM: '#ffa726',
    HIGH: '#ef5350',
}