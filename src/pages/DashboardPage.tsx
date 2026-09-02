import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useApiTasks } from '../hooks/useApiTasks'
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

function DashboardPage() {
    const { logout } = useAuth()
    const { tasks, isLoading, error, addTask, deleteTask, updateTaskStatus } = useApiTasks()

    const [searchInput, setSearchInput] = useState('')
    const debouncedSearch = useDebouncedValue(searchInput, 300)

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    )

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2">
                        Dashboard
                    </Typography>
                    <Button variant="outlined" onClick={logout}>
                        Log out
                    </Button>
                </Box>

                <NewTaskForm
                    onSubmit={(title, priority: TaskPriority) => void addTask(title, priority)}
                />

                <TextField
                    label="Search tasks..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    size="small"
                    fullWidth
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
                            onStatusChange={(t, status) => void updateTaskStatus(t, status)}
                            onDelete={(id) => void deleteTask(id)}
                        />
                    ))}
                </Stack>
            </Box>
        </Container>
    )
}

export default DashboardPage