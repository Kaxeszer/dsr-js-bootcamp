import { useState, useEffect } from 'react'
import type { Task, TaskStatus, TaskPriority } from '../types'
import { useAuth } from './useAuth'
import { fetchTasks, createTask, deleteTaskById, replaceTaskStatus } from '../api/taskService'

export function useApiTasks() {
    const { accessToken } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let ignore = false

        async function loadTasks() {
            if (!accessToken) {
                if (!ignore) setIsLoading(false)
                return
            }

            try {
                const data = await fetchTasks(accessToken)
                if (!ignore) {
                    setTasks(data.items)
                    setError('')
                }
            } catch {
                if (!ignore) setError('Could not load tasks from the API')
            } finally {
                if (!ignore) setIsLoading(false)
            }
        }

        void loadTasks()

        return () => {
            ignore = true
        }
    }, [accessToken])

    async function addTask(title: string, priority: TaskPriority) {
        if (!accessToken) return
        try {
            const created = await createTask(accessToken, title, priority)
            setTasks((prev) => [created, ...prev])
        } catch {
            setError('Could not create task')
        }
    }

    async function deleteTask(id: string) {
        if (!accessToken) return
        await deleteTaskById(accessToken, id)
        setTasks((prev) => prev.filter((task) => task.id !== id))
    }

    async function updateTaskStatus(task: Task, status: TaskStatus) {
        if (!accessToken) return
        try {
            const updated = await replaceTaskStatus(accessToken, task, status)
            setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)))
        } catch {
            setError('Could not update task')
        }
    }

    return {
        tasks,
        isLoading,
        error,
        addTask,
        deleteTask,
        updateTaskStatus,
    }
}