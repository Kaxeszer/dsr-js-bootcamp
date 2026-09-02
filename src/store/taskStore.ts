import { create } from 'zustand'
import type { Task, TaskStatus, TaskPriority } from '../types'
import { fetchTasks, createTask, deleteTaskById, replaceTaskStatus } from '../api/taskService'

interface TaskState {
    tasks: Task[]
    isLoading: boolean
    error: string
    loadTasks: (accessToken: string) => Promise<void>
    addTask: (accessToken: string, title: string, description: string, priority: TaskPriority) => Promise<void>
    removeTask: (accessToken: string, id: string) => Promise<void>
    changeTaskStatus: (accessToken: string, task: Task, status: TaskStatus) => Promise<void>
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
        } catch {
            set({ error: 'Could not load tasks from the API', isLoading: false })
        }
    },

    addTask: async (accessToken, title, description, priority) => {
        set({ error: '' })
        try {
            const created = await createTask(accessToken, title, description, priority)
            set({ tasks: [created, ...get().tasks] })
        } catch {
            set({ error: 'Could not create task' })
        }
    },

    removeTask: async (accessToken, id) => {
        set({ error: '' })
        try {
            await deleteTaskById(accessToken, id)
            set({ tasks: get().tasks.filter((task) => task.id !== id) })
        } catch {
            set({ error: 'Could not delete task' })
        }
    },

    changeTaskStatus: async (accessToken, task, status) => {
        set({ error: '' })
        try {
            const updated = await replaceTaskStatus(accessToken, task, status)
            set({
                tasks: get().tasks.map((t) => (t.id === task.id ? updated : t)),
            })
        } catch {
            set({ error: 'Could not update task' })
        }
    },
}))