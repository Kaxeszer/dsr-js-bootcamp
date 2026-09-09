import { useState, useEffect } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useTaskWorker } from '../hooks/useTaskWorker'
import type { SortField, SortDirection } from '../workers/taskSort.worker'
import TaskCard from '../components/TaskCard'
import NewTaskForm from '../components/NewTaskForm'
import TaskDetailPage from './TaskDetailPage'
import type { TaskPriority } from '../types'
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    Grow,
    type SelectChangeEvent,
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group'

const SORT_FIELD_LABELS: Record<SortField, string> = {
    title: 'Title',
    priority: 'Priority',
    createdAt: 'Created',
}

const SORT_DIRECTION_LABELS: Record<SortDirection, string> = {
    asc: 'Ascending',
    desc: 'Descending',
}

function TasksPage() {
    const { accessToken, logout } = useAuthStore()
    const { tasks, isLoading, error, loadTasks, addTask, removeTask, changeTaskStatus } = useTaskStore()
    const navigate = useNavigate()

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearch = useDebouncedValue(searchInput, 300)
    const [sortField, setSortField] = useState<SortField>('createdAt')
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

    useEffect(() => {
        if (accessToken) {
            void loadTasks(accessToken)
        }
    }, [accessToken, loadTasks])

    const filteredTasks = useTaskWorker(tasks, debouncedSearch, sortField, sortDirection)

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2">
                        Tasks
                    </Typography>
                    <Button variant="outlined" onClick={logout}>
                        Log out
                    </Button>
                </Box>

                <NewTaskForm
                    onSubmit={(title, description, priority: TaskPriority) =>
                        accessToken && void addTask(accessToken, title, description, priority)
                    }
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Search tasks..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        size="small"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <Select
                        value={sortField}
                        onChange={(e: SelectChangeEvent) => setSortField(e.target.value as SortField)}
                        size="small"
                    >
                        {(Object.keys(SORT_FIELD_LABELS) as SortField[]).map((field) => (
                            <MenuItem key={field} value={field}>
                                Sort by {SORT_FIELD_LABELS[field]}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        value={sortDirection}
                        onChange={(e: SelectChangeEvent) => setSortDirection(e.target.value as SortDirection)}
                        size="small"
                    >
                        {(Object.keys(SORT_DIRECTION_LABELS) as SortDirection[]).map((direction) => (
                            <MenuItem key={direction} value={direction}>
                                {SORT_DIRECTION_LABELS[direction]}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                {isLoading && <CircularProgress size={24} />}
                {error && <Alert severity="error">{error}</Alert>}

                <Typography variant="subtitle1">
                    Tasks ({filteredTasks.length})
                </Typography>

                <TransitionGroup component={Box} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredTasks.map((task) => (
                        <Grow key={task.id} timeout={{ enter: 800, exit: 600 }}>
                            <div>
                                <TaskCard
                                    task={task}
                                    onOpen={() => navigate(`/tasks/${task.id}`)}
                                    onStatusChange={(t, status) =>
                                        accessToken && void changeTaskStatus(accessToken, t, status)
                                    }
                                    onDelete={(id) => accessToken && void removeTask(accessToken, id)}
                                />
                            </div>
                        </Grow>
                    ))}
                </TransitionGroup>
            </Box>

            <Routes>
                <Route path=":id" element={<TaskDetailPage />} />
            </Routes>
        </Container>
    )
}

export default TasksPage