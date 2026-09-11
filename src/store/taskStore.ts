import { create } from 'zustand'
import type { Task, TaskStatus, TaskPriority } from '../types'
import { getErrorMessage } from '../api/errorUtils'
import {
    fetchTasks,
    createTask,
    deleteTaskById,
    updateTaskDetails,
    assignTask,
    approveAssignment,
    rejectAssignment,
    updateAssigneeStatus,
    addTagToTask,
    removeTagFromTask,
} from '../api/taskService'

interface TaskDetailsChanges {
    title?: string
    description?: string
    priority?: TaskPriority
}

interface TaskState {
    tasks: Task[]
    isLoading: boolean
    error: string
    loadTasks: (accessToken: string) => Promise<void>
    addTask: (accessToken: string, title: string, description: string, priority: TaskPriority) => Promise<void>
    removeTask: (accessToken: string, id: string) => Promise<void>
    updateTask: (accessToken: string, task: Task, changes: TaskDetailsChanges) => Promise<void>
    assign: (accessToken: string, taskId: string, assigneeId: string) => Promise<void>
    approve: (accessToken: string, taskId: string) => Promise<void>
    reject: (accessToken: string, taskId: string, blockAssigner?: boolean, comment?: string) => Promise<void>
    updateMyAssignedStatus: (accessToken: string, taskId: string, status: TaskStatus) => Promise<void>
    addTag: (accessToken: string, taskId: string, name: string) => Promise<void>
    removeTag: (accessToken: string, taskId: string, tagId: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    error: '',

    loadTasks: async (accessToken) => {
        set({ isLoading: true, error: '' })
        try {
            const data = await fetchTasks(accessToken)
            set({ tasks: data.items, isLoading: false })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not load tasks'), isLoading: false })
        }
    },

    addTask: async (accessToken, title, description, priority) => {
        set({ error: '' })
        try {
            const created = await createTask(accessToken, title, description, priority)
            set({ tasks: [created, ...get().tasks] })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not create task') })
        }
    },

    removeTask: async (accessToken, id) => {
        set({ error: '' })
        try {
            await deleteTaskById(accessToken, id)
            set({ tasks: get().tasks.filter((task) => task.id !== id) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not delete task') })
        }
    },

    updateTask: async (accessToken, task, changes) => {
        set({ error: '' })
        try {
            const updated = await updateTaskDetails(accessToken, task, changes)
            set({
                tasks: get().tasks.map((t) => (t.id === task.id ? updated : t)),
            })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not update task') })
        }
    },

    assign: async (accessToken, taskId, assigneeId) => {
        set({ error: '' })
        try {
            const updated = await assignTask(accessToken, taskId, assigneeId)
            set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not assign task') })
        }
    },

    approve: async (accessToken, taskId) => {
        set({ error: '' })
        try {
            const updated = await approveAssignment(accessToken, taskId)
            set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not approve assignment') })
        }
    },

    reject: async (accessToken, taskId, blockAssigner, comment) => {
        set({ error: '' })
        try {
            const updated = await rejectAssignment(accessToken, taskId, blockAssigner, comment)
            set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not reject assignment') })
        }
    },

    updateMyAssignedStatus: async (accessToken, taskId, status) => {
        set({ error: '' })
        try {
            const updated = await updateAssigneeStatus(accessToken, taskId, status)
            set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not update task status') })
        }
    },

    addTag: async (accessToken, taskId, name) => {
        set({ error: '' })
        try {
            const updated = await addTagToTask(accessToken, taskId, name)
            set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not add tag') })
        }
    },

    removeTag: async (accessToken, taskId, tagId) => {
        set({ error: '' })
        try {
            const updated = await removeTagFromTask(accessToken, taskId, tagId)
            set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) })
        } catch (err) {
            set({ error: getErrorMessage(err, 'Could not remove tag') })
        }
    },
}))