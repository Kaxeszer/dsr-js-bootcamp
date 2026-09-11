import { useEffect, useState, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import type { TaskStatus, TaskPriority } from '../types'
import {
    STATUS_LABELS,
    STATUS_COLORS,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
} from '../constants/taskLabels'
import ConfirmIconButton from '../components/ConfirmIconButton'
import AssigneeField from '../components/AssigneeField'
import TagsEditor from '../components/TagsEditor'
import { useUsersList } from '../hooks/useUsersList'
import { useTagsList } from '../hooks/useTagsList'
import {
    Box,
    Stack,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Select,
    MenuItem,
    TextField,
    Chip,
    Divider,
    type SelectChangeEvent,
} from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import EditIcon from '@mui/icons-material/Edit'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import EventIcon from '@mui/icons-material/Event'

const ASSIGNABLE_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']
const EDITABLE_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH']

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

interface FieldRowProps {
    label: string
    canEdit: boolean
    isEditing: boolean
    onStartEdit: () => void
    children: ReactNode
    editor?: ReactNode
}

function FieldRow({ label, canEdit, isEditing, onStartEdit, children, editor }: FieldRowProps) {
    return (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: 'block',
                    mb: 0.5,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                }}
            >
                {label}
            </Typography>

            {isEditing && editor ? (
                <Box sx={{ mt: 0.5 }}>{editor}</Box>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 36 }}>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>{children}</Box>

                    {canEdit && (
                        <IconButton
                            size="small"
                            onClick={onStartEdit}
                            sx={{
                                color: 'text.secondary',
                                borderRadius: 1.5,
                                '&:hover': {
                                    color: 'primary.main',
                                    bgcolor: 'action.hover',
                                },
                            }}
                        >
                            <EditIcon fontSize="inherit" />
                        </IconButton>
                    )}
                </Box>
            )}
        </Box>
    )
}

function TaskDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const { accessToken, user } = useAuthStore()

    const {
        tasks,
        isLoading,
        error,
        loadTasks,
        assign,
        approve,
        reject,
        updateMyAssignedStatus,
        updateTask,
        addTag,
        removeTag,
    } = useTaskStore()

    const users = useUsersList(accessToken)
    const tagSuggestions = useTagsList(accessToken)

    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [titleDraft, setTitleDraft] = useState('')

    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [descriptionDraft, setDescriptionDraft] = useState('')

    const [isEditingPriority, setIsEditingPriority] = useState(false)
    const [isEditingStatus, setIsEditingStatus] = useState(false)

    useEffect(() => {
        if (accessToken && tasks.length === 0) {
            void loadTasks(accessToken)
        }
    }, [accessToken, tasks.length, loadTasks])

    const task = tasks.find((t) => t.id === id)

    const handleClose = () => navigate('/tasks')

    const handleConfirmTitle = () => {
        if (accessToken && task && titleDraft.trim()) {
            void updateTask(accessToken, task, {
                title: titleDraft.trim(),
            })
        }

        setIsEditingTitle(false)
    }

    const handleConfirmDescription = () => {
        if (accessToken && task) {
            void updateTask(accessToken, task, {
                description: descriptionDraft,
            })
        }

        setIsEditingDescription(false)
    }

    if (isLoading) {
        return (
            <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={28} />
                </DialogContent>
            </Dialog>
        )
    }

    if (error) {
        return (
            <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert severity="error">{error}</Alert>
                </DialogContent>
            </Dialog>
        )
    }

    if (!task) {
        return (
            <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent sx={{ pt: 3 }}>
                    <Alert severity="warning">Task not found.</Alert>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={handleClose} variant="contained">
                        Back to Tasks
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const isCreator = user?.id === task.creator.id
    const isAssignee = user?.id === task.assignee?.id

    const assignableUsers = users.filter((u) => u.id !== task.creator.id)

    const canReassign =
        isCreator && (task.assignmentStatus === 'NONE' || task.assignmentStatus === 'REJECTED')

    const canEditStatus = isAssignee && task.assignmentStatus === 'APPROVED'

    return (
        <Dialog
            open
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    overflow: 'hidden',
                },
            }}
        >
            <DialogTitle
                sx={{
                    px: { xs: 2.5, sm: 3 },
                    pt: 2.5,
                    pb: 2,
                }}
            >
                <Stack spacing={2}>
                    <FieldRow
                        label="Title"
                        canEdit={isCreator}
                        isEditing={isCreator && isEditingTitle}
                        onStartEdit={() => {
                            setTitleDraft(task.title)
                            setIsEditingTitle(true)
                        }}
                        editor={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    autoFocus
                                    value={titleDraft}
                                    onChange={(e) => setTitleDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleConfirmTitle()
                                        }
                                    }}
                                />

                                <ConfirmIconButton
                                    onClick={handleConfirmTitle}
                                    disabled={!titleDraft.trim()}
                                />
                            </Box>
                        }
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.25,
                                letterSpacing: '-0.015em',
                                wordBreak: 'break-word',
                            }}
                        >
                            {task.title}
                        </Typography>
                    </FieldRow>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1 }}>
                            <FieldRow
                                label="Status"
                                canEdit={canEditStatus}
                                isEditing={canEditStatus && isEditingStatus}
                                onStartEdit={() => setIsEditingStatus(true)}
                                editor={
                                    <Select
                                        value={task.status}
                                        onChange={(e: SelectChangeEvent) => {
                                            if (accessToken) {
                                                void updateMyAssignedStatus(
                                                    accessToken,
                                                    task.id,
                                                    e.target.value as TaskStatus
                                                )
                                            }

                                            setIsEditingStatus(false)
                                        }}
                                        onClose={() => setIsEditingStatus(false)}
                                        open
                                        size="small"
                                        fullWidth
                                    >
                                        {ASSIGNABLE_STATUSES.map((s) => (
                                            <MenuItem key={s} value={s}>
                                                {STATUS_LABELS[s]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                }
                            >
                                <Chip
                                    size="small"
                                    label={STATUS_LABELS[task.status]}
                                    color={STATUS_COLORS[task.status]}
                                />
                            </FieldRow>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <FieldRow
                                label="Priority"
                                canEdit={isCreator}
                                isEditing={isCreator && isEditingPriority}
                                onStartEdit={() => setIsEditingPriority(true)}
                                editor={
                                    <Select
                                        value={task.priority}
                                        onChange={(e: SelectChangeEvent) => {
                                            if (accessToken) {
                                                void updateTask(accessToken, task, {
                                                    priority: e.target.value as TaskPriority,
                                                })
                                            }

                                            setIsEditingPriority(false)
                                        }}
                                        onClose={() => setIsEditingPriority(false)}
                                        open
                                        size="small"
                                        fullWidth
                                    >
                                        {EDITABLE_PRIORITIES.map((p) => (
                                            <MenuItem key={p} value={p}>
                                                {PRIORITY_LABELS[p]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                }
                            >
                                <Chip
                                    size="small"
                                    label={PRIORITY_LABELS[task.priority]}
                                    color={PRIORITY_COLORS[task.priority]}
                                />
                            </FieldRow>
                        </Box>
                    </Stack>

                    <TagsEditor
                        tags={task.tags}
                        suggestions={tagSuggestions}
                        canEdit={isCreator}
                        onAddTag={(name) => {
                            if (accessToken) {
                                void addTag(accessToken, task.id, name)
                            }
                        }}
                        onRemoveTag={(tagId) => {
                            if (accessToken) {
                                void removeTag(accessToken, task.id, tagId)
                            }
                        }}
                    />
                </Stack>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    px: { xs: 2.5, sm: 3 },
                    py: 2.5,
                }}
            >
                <Stack spacing={2.5}>
                    <FieldRow
                        label="Description"
                        canEdit={isCreator}
                        isEditing={isCreator && isEditingDescription}
                        onStartEdit={() => {
                            setDescriptionDraft(task.description ?? '')
                            setIsEditingDescription(true)
                        }}
                        editor={
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    autoFocus
                                    value={descriptionDraft}
                                    onChange={(e) => setDescriptionDraft(e.target.value)}
                                />

                                <ConfirmIconButton onClick={handleConfirmDescription} />
                            </Box>
                        }
                    >
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'action.hover',
                            }}
                        >
                            <Typography
                                variant="body2"
                                color={task.description ? 'text.primary' : 'text.secondary'}
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: 1.7,
                                }}
                            >
                                {task.description || 'No description yet'}
                            </Typography>
                        </Box>
                    </FieldRow>

                    <Divider />

                    <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <PersonOutlineIcon fontSize="small" color="action" />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ width: 72, fontWeight: 500 }}
                            >
                                Creator
                            </Typography>

                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {task.creator.nickname}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <EventIcon fontSize="small" color="action" />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ width: 72, fontWeight: 500 }}
                            >
                                Created
                            </Typography>

                            <Typography variant="body2">{formatDate(task.createdAt)}</Typography>
                        </Box>

                        <AssigneeField
                            assignee={task.assignee}
                            assignmentStatus={task.assignmentStatus}
                            canReassign={canReassign}
                            assignableUsers={assignableUsers}
                            onAssign={(assigneeId) => {
                                if (accessToken) {
                                    void assign(accessToken, task.id, assigneeId)
                                }
                            }}
                        />
                    </Stack>

                    {isAssignee && task.assignmentStatus === 'PENDING' && (
                        <>
                            <Divider />

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'action.hover',
                                }}
                            >
                                <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                    You've been assigned this task.
                                </Typography>

                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            if (accessToken) {
                                                void approve(accessToken, task.id)
                                            }
                                        }}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                            if (accessToken) {
                                                void reject(accessToken, task.id)
                                            }
                                        }}
                                    >
                                        Reject
                                    </Button>
                                </Stack>
                            </Box>
                        </>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    px: { xs: 2.5, sm: 3 },
                    py: 2,
                    bgcolor: 'action.hover',
                }}
            >
                <Button onClick={handleClose} variant="contained" startIcon={<DoneIcon />}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default TaskDetailPage