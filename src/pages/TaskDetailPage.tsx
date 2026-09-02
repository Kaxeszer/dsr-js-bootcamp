import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import {
    Container,
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material'

const PRIORITY_LABELS: Record<string, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
}

const STATUS_LABELS: Record<string, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
}

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleString()
}

function TaskDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { accessToken } = useAuthStore()
    const { tasks, isLoading, error, loadTasks } = useTaskStore()

    useEffect(() => {
        if (accessToken && tasks.length === 0) {
            void loadTasks(accessToken)
        }
    }, [accessToken, tasks.length, loadTasks])

    const task = tasks.find((t) => t.id === id)

    if (isLoading) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <CircularProgress size={24} />
                </Box>
            </Container>
        )
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </Container>
        )
    }

    if (!task) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Alert severity="warning">Task not found.</Alert>
                    <Button sx={{ mt: 2 }} onClick={() => navigate('/tasks')}>
                        Back to Tasks
                    </Button>
                </Box>
            </Container>
        )
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button onClick={() => navigate('/tasks')} sx={{ alignSelf: 'flex-start' }}>
                    ← Back to Tasks
                </Button>

                <Typography variant="h5">{task.title}</Typography>

                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Description
                    </Typography>
                    <Typography variant="body1">
                        {task.description || 'No description'}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Status
                    </Typography>
                    <Typography variant="body1">{STATUS_LABELS[task.status]}</Typography>
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Priority
                    </Typography>
                    <Typography variant="body1">{PRIORITY_LABELS[task.priority]}</Typography>
                </Box>

                <Box>
                    <Typography variant="caption" color="text.secondary">
                        Created
                    </Typography>
                    <Typography variant="body1">{formatDate(task.createdAt)}</Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default TaskDetailPage