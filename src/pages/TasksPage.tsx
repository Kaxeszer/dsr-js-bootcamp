import { useState, useEffect, useMemo, useCallback, type SubmitEventHandler, type ChangeEvent } from 'react'
import TaskCard from '../components/TaskCard'
import type { Task } from '../types'
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress, Stack } from '@mui/material'

function TasksPage() {
    const [title, setTitle] = useState('')
    const [deadline, setDeadline] = useState('')
    const [tasks, setTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    useEffect(() => {
        fetch('http://localhost:3001/tasks')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch tasks')
                return res.json()
            })
            .then((data: Task[]) => {
                setTasks(data)
                setIsLoading(false)
            })
            .catch(() => {
                setError('Could not load tasks from the mock API')
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(searchInput)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchInput])

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = useCallback((e) => {
        e.preventDefault()
        if (!title) return

        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            deadline,
            completed: false,
        }

        setTasks((prevTasks) => [newTask, ...prevTasks])
        setTitle('')
        setDeadline('')
    }, [title, deadline])

    const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }, [])

    const handleDeadlineChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDeadline(e.target.value)
    }, [])

    const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }, [])

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) =>
            task.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
    }, [tasks, debouncedSearch])

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h5" component="h2">
                    Tasks
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Task title"
                        value={title}
                        onChange={handleTitleChange}
                        sx={{ flex: 1, minWidth: 150 }}
                    />
                    <TextField
                        type="date"
                        value={deadline}
                        onChange={handleDeadlineChange}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <Button type="submit" variant="contained">
                        Add task
                    </Button>
                </Box>

                <TextField
                    label="Search tasks..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    fullWidth
                />

                {isLoading && <CircularProgress size={24} />}
                {error && <Alert severity="error">{error}</Alert>}

                <Typography variant="subtitle1">
                    Tasks ({filteredTasks.length})
                </Typography>

                <Stack spacing={1}>
                    {filteredTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Stack>
            </Box>
        </Container>
    )
}

export default TasksPage