import { useState, useEffect } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useTaskWorker } from '../hooks/useTaskWorker'
import type { SortField, SortDirection } from '../workers/taskSort.worker'
import TaskCard from '../components/TaskCard'
import NewTaskForm from '../components/NewTaskForm'
import TaskFilters from '../components/TaskFilters'
import EmptyState from '../components/EmptyState'
import TaskDetailPage from './TaskDetailPage'
import type { TaskPriority } from '../types'
import { Container, Box, Typography, CircularProgress, Alert, Grow } from '@mui/material'
import { TransitionGroup } from 'react-transition-group'

function TasksPage() {
    const { accessToken } = useAuthStore()
    const { tasks, isLoading, error, loadTasks, addTask, removeTask } = useTaskStore()
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
            <Box
                sx={{
                    mt: { xs: 3, sm: 5 },
                    mb: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                }}
            >
                {/* Page Header */}
                <Box sx={{ mb: 1 }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Tasks
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Create, manage and keep track of your tasks.
                    </Typography>
                </Box>

                {/* New Task */}
                <Box
                    sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 3,
                        p: { xs: 2, sm: 2.5 },
                        bgcolor: 'background.paper',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                >
                    <NewTaskForm
                        onSubmit={(title, description, priority: TaskPriority) =>
                            accessToken && void addTask(accessToken, title, description, priority)
                        }
                    />
                </Box>

                <TaskFilters
                    searchInput={searchInput}
                    onSearchChange={setSearchInput}
                    sortField={sortField}
                    onSortFieldChange={setSortField}
                    sortDirection={sortDirection}
                    onSortDirectionChange={setSortDirection}
                />

                {/* Loading / Error */}
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                {error && <Alert severity="error">{error}</Alert>}

                {/* Tasks Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mt: 1,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Your Tasks
                    </Typography>

                    <Box
                        sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: 1.5,
                            bgcolor: 'action.hover',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                        </Typography>
                    </Box>
                </Box>

                {/* Tasks */}
                <TransitionGroup
                    component={Box}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    {filteredTasks.map((task) => (
                        <Grow key={task.id} timeout={{ enter: 800, exit: 600 }}>
                            <div>
                                <TaskCard
                                    task={task}
                                    onOpen={() => navigate(`/tasks/${task.id}`)}
                                    onDelete={(id) => {
                                        if (accessToken) {
                                            void removeTask(accessToken, id)
                                        }
                                    }}
                                />
                            </div>
                        </Grow>
                    ))}
                </TransitionGroup>

                {/* Empty State */}
                {!isLoading && filteredTasks.length === 0 && !error && (
                    <EmptyState message="No tasks found. Try changing your search or create a new task." />
                )}
            </Box>

            <Routes>
                <Route path=":id" element={<TaskDetailPage />} />
            </Routes>
        </Container>
    )
}

export default TasksPage