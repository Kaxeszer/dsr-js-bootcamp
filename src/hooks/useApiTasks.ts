import { useState, useEffect } from 'react'
import type { Task } from '../types'

const API_URL = 'http://localhost:3001/tasks'

export function useApiTasks() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let ignore = false

        fetch(API_URL)
            .then((res) => {
                if (!res.ok) {
                    if (!ignore) setError('Could not load tasks from the mock API')
                    return null
                }
                return res.json()
            })
            .then((data: Task[] | null) => {
                if (!ignore && data) {
                    setTasks(data)
                    setError('')
                }
            })
            .catch(() => {
                if (!ignore) setError('Could not load tasks from the mock API')
            })
            .finally(() => {
                if (!ignore) setIsLoading(false)
            })

        return () => {
            ignore = true
        }
    }, [])

    async function addTask(title: string) {
        const newTask: Omit<Task, 'id'> = {
            title,
            deadline: '',
            completed: false,
        }

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        })

        const created: Task = await res.json()
        setTasks((prev) => [created, ...prev])
    }

    async function deleteTask(id: string) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        setTasks((prev) => prev.filter((task) => task.id !== id))
    }

    async function toggleTaskCompleted(id: string, completed: boolean) {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !completed }),
        })

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !completed } : task
            )
        )
    }

    return {
        tasks,
        isLoading,
        error,
        addTask,
        deleteTask,
        toggleTaskCompleted,
    }
}