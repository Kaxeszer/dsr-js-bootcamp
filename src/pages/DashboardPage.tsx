import { useState, type SubmitEventHandler } from 'react'
import { useAuth } from '../context/useAuth'
import { useApiTasks } from '../hooks/useApiTasks'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    IconButton,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

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
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2">
                        Dashboard
                    </Typography>
                    <Button variant="outlined" onClick={logout}>
                        Log out
                    </Button>
                </Box>

                <Box component="form" onSubmit={handleAddTask} sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="New task"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        fullWidth
                    />
                    <Button type="submit" variant="contained">
                        Add task
                    </Button>
                </Box>

                <TextField
                    label="Search tasks..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    fullWidth
                />

                {isLoading && <CircularProgress size={24} />}
                {error && <Alert severity="error">{error}</Alert>}

                <Typography variant="subtitle1">
                    Tasks ({filteredTasks.length})
                </Typography>

                <List>
                    {filteredTasks.map((task) => (
                        <ListItem
                            key={task.id}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => void deleteTask(task.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <Checkbox
                                checked={task.completed}
                                onChange={() => void toggleTaskCompleted(task.id, task.completed)}
                            />
                            <ListItemText
                                primary={task.title}
                                sx={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    )
}

export default DashboardPage