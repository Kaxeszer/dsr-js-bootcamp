import { useState, type SubmitEventHandler } from 'react'
import TaskCard from '../components/TaskCard'
import type { Task } from '../types'

function TasksPage() {
    const [title, setTitle] = useState('')
    const [deadline, setDeadline] = useState('')
    const [drafts, setDrafts] = useState<Task[]>([])

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (!title) return

        const newDraft: Task = {
            id: crypto.randomUUID(),
            title,
            deadline,
            completed: false,
        }

        setDrafts([...drafts, newDraft])
        setTitle('')
        setDeadline('')
    }

    return (
        <div>
            <h2>Tasks</h2>

            <form onSubmit={handleSubmit}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                />
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
                <button type="submit">Add draft</button>
            </form>

            <div>
                {drafts.map((draft) => (
                    <TaskCard key={draft.id} task={draft} />
                ))}
            </div>
        </div>
    )
}

export default TasksPage