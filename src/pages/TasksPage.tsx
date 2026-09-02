import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import TaskCard from '../components/TaskCard'
import NewTaskForm from '../components/NewTaskForm'
import type { TaskPriority } from '../types'
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Stack,
} from '@mui/material'

function TasksPage() {
    const { accessToken, logout } = useAuthStore()
    const { tasks, isLoading, error, loadTasks, addTask, removeTask, changeTaskStatus } = useTaskStore()
    const navigate = useNavigate()

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearch = useDebouncedValue(searchInput, 300)

    useEffect(() => {
        if (accessToken) {
            void loadTasks(accessToken)
        }
    }, [accessToken, loadTasks])

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

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

                <TextField
                    label="Search tasks..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                {isLoading && <CircularProgress size={24} />}
                {error && <Alert severity="error">{error}</Alert>}

                <Typography variant="subtitle1">
                    Tasks ({filteredTasks.length})
                </Typography>

                <Stack spacing={2}>
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onOpen={() => navigate(`/tasks/${task.id}`)}
                            onStatusChange={(t, status) =>
                                accessToken && void changeTaskStatus(accessToken, t, status)
                            }
                            onDelete={(id) => accessToken && void removeTask(accessToken, id)}
                        />
                    ))}
                </Stack>
            </Box>
        </Container>
    )
}

export default TasksPage