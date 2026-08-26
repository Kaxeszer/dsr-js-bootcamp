import { useState, type SubmitEventHandler } from 'react'
import { useAuth } from '../context/useAuth'
import { useApiTasks } from '../hooks/useApiTasks'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

function DashboardPage() {
    const { logout } = useAuth()
    const { tasks, isLoading, error, addTask, deleteTask, toggleTaskCompleted } = useApiTasks()

    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const debouncedSearch = useDebouncedValue(searchInput, 300)

    const handleAddTask: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (!newTaskTitle) return
        void addTask(newTaskTitle)
        setNewTaskTitle('')
    }

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={logout}>Log out</button>

            <form onSubmit={handleAddTask}>
                <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="New task"
                />
                <button type="submit">Add task</button>
            </form>

            <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search tasks..."
            />

            {isLoading && <p>Loading tasks...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Tasks ({filteredTasks.length})</h3>
            <ul>
                {filteredTasks.map((task) => (
                    <li key={task.id}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => void toggleTaskCompleted(task.id, task.completed)}
                        />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
                        <button onClick={() => void deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DashboardPage