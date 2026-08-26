import { useState, useEffect } from 'react'
import type { Task } from '../types'

const STORAGE_KEY = 'localTasks'

function loadTasksFromStorage(): Task[] {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    try {
        return JSON.parse(stored) as Task[]
    } catch {
        return []
    }
}

export function useLocalTasks() {
    const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage())

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }, [tasks])

    function addTask(title: string) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            deadline: '',
            completed: false,
        }
        setTasks((prevTasks) => [newTask, ...prevTasks])
    }

    function deleteTask(id: string) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
    }

    function toggleTaskCompleted(id: string) {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        )
    }

    return {
        tasks,
        addTask,
        deleteTask,
        toggleTaskCompleted,
    }
}