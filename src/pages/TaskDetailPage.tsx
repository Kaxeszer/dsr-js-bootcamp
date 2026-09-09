import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

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

    const handleClose = () => navigate('/tasks')

    if (isLoading) {
        return (
            <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <CircularProgress size={24} />
                </DialogContent>
            </Dialog>
        )
    }

    if (error) {
        return (
            <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <Alert severity="error">{error}</Alert>
                </DialogContent>
            </Dialog>
        )
    }

    if (!task) {
        return (
            <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <Alert severity="warning">Task not found.</Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Back to Tasks</Button>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {task.title}
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
            </DialogContent>
        </Dialog>
    )
}

export default TaskDetailPage