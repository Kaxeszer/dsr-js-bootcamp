import type { Task } from '../types'
import { Card, CardContent, Typography } from '@mui/material'

interface TaskCardProps {
    task: Task
}

function TaskCard({ task }: TaskCardProps) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" component="div">
                    {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {task.deadline || 'No deadline'}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default TaskCard