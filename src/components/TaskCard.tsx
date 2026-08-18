import type { Task } from '../types'

interface TaskCardProps {
    task: Task
}

function TaskCard({ task }: TaskCardProps) {
    return (
        <div>
            <strong>{task.title}</strong>
            <p>{task.deadline}</p>
        </div>
    )
}

export default TaskCard