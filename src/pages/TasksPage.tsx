import { useState, useEffect, useMemo, useCallback, type SubmitEventHandler, type ChangeEvent } from 'react'
import TaskCard from '../components/TaskCard'
import type { Task } from '../types'
import { generateMockTasks } from '../api/mockTasks'

function TasksPage() {
    const [title, setTitle] = useState('')
    const [deadline, setDeadline] = useState('')
    const [tasks, setTasks] = useState<Task[]>(() => generateMockTasks(100))
    const [searchInput, setSearchInput] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(searchInput)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchInput])

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault()
        if (!title) return

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            deadline,
            completed: false,
        }

        setTasks((prevTasks) => [newTask, ...prevTasks])
        setTitle('')
        setDeadline('')
    }, [title, deadline])

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }, [])

    const handleDeadlineChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDeadline(e.target.value)
    }, [])

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }, [])

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) =>
            task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
    }, [tasks, debouncedSearch])

    return (
        <div>
            <h2>Tasks</h2>

            <form onSubmit={handleSubmit}>
                <input
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Task title"
                />
                <input
                    type="date"
                    value={deadline}
                    onChange={handleDeadlineChange}
                />
                <button type="submit">Add task</button>
            </form>

            <input
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search tasks..."
            />

            <h3>Tasks ({filteredTasks.length})</h3>
            <div>
                {filteredTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    )
}

export default TasksPage