import type { Task, TaskStatus } from '../types'
import {
    Card,
    CardContent,
    Typography,
    Box,
    Select,
    MenuItem,
    IconButton,
    type SelectChangeEvent,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
}

const PRIORITY_LABELS: Record<Task['priority'], string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
}

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString()
}

interface TaskCardProps {
    task: Task
    onOpen: () => void
    onStatusChange: (task: Task, status: TaskStatus) => void
    onDelete: (id: string) => void
}

function TaskCard({ task, onOpen, onStatusChange, onDelete }: TaskCardProps) {
    return (
        <Card variant="outlined" sx={{ position: 'relative' }}>
            <Box
                onClick={onOpen}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    cursor: 'pointer',
                    zIndex: 1,
                }}
            />
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Title
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                            }}
                        >
                            {task.title}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Priority
                        </Typography>
                        <Typography variant="subtitle1">
                            {PRIORITY_LABELS[task.priority]}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Created
                        </Typography>
                        <Typography variant="subtitle1">
                            {formatDate(task.createdAt)}
                        </Typography>
                    </Box>

                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Status
                        </Typography>
                        <Select
                            size="small"
                            variant="standard"
                            disableUnderline
                            value={task.status}
                            onChange={(e: SelectChangeEvent) =>
                                onStatusChange(task, e.target.value as TaskStatus)
                            }
                            sx={{
                                display: 'block',
                                fontSize: '1rem',
                                fontWeight: 500,
                                mt: '2px',
                            }}
                        >
                            {STATUSES.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {STATUS_LABELS[status]}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Delete
                        </Typography>
                        <Box sx={{ mt: '-2px' }}>
                            <IconButton onClick={() => onDelete(task.id)} size="small">
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TaskCard