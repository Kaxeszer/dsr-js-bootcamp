import type { Task } from '../types'
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import InitialsAvatar from './InitialsAvatar'
import {
    STATUS_LABELS,
    STATUS_COLORS,
    PRIORITY_LABELS,
    PRIORITY_COLORS,
    PRIORITY_BAR_COLORS,
} from '../constants/taskLabels'

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
    })
}

interface TaskCardProps {
    task: Task
    onOpen: () => void
    onDelete: (id: string) => void
}

function TaskCard({ task, onOpen, onDelete }: TaskCardProps) {
    const assigneeLabel =
        task.assignee && task.assignmentStatus === 'APPROVED' ? task.assignee.nickname : 'Unassigned'

    return (
        <Card
            variant="outlined"
            sx={{
                position: 'relative',
                height: '100%',
                borderTop: 3,
                borderTopColor: PRIORITY_BAR_COLORS[task.priority],
                transition: 'all 180ms ease',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    borderColor: 'divider',
                    borderTopColor: PRIORITY_BAR_COLORS[task.priority],
                },
            }}
        >
            <Box
                onClick={onOpen}
                sx={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 1 }}
            />

            <CardContent sx={{ p: 1.75, '&:last-child': { pb: 1.75 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 600, letterSpacing: '0.03em' }}
                        >
                            Title
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.25,
                                fontWeight: 650,
                                fontSize: '0.9rem',
                                textDecoration: task.status === 'DONE' ? 'line-through' : 'none',
                                color: task.status === 'DONE' ? 'text.secondary' : 'text.primary',
                                wordBreak: 'break-word',
                            }}
                        >
                            {task.title}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={() => onDelete(task.id)}
                        size="small"
                        sx={{
                            position: 'relative',
                            zIndex: 2,
                            flexShrink: 0,
                            mt: -0.5,
                            color: 'text.secondary',
                            '&:hover': {
                                color: 'error.main',
                                bgcolor: 'error.50',
                            },
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        gap: 1,
                        mt: 1.5,
                    }}
                >
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 600, letterSpacing: '0.03em' }}
                        >
                            Status &amp; Priority &amp; Tags
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 0.75, mt: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                                size="small"
                                label={STATUS_LABELS[task.status]}
                                color={STATUS_COLORS[task.status]}
                                sx={{
                                    height: 22,
                                    '& .MuiChip-label': {
                                        px: 1,
                                        fontSize: '0.7rem',
                                    },
                                }}
                            />

                            <Chip
                                size="small"
                                label={PRIORITY_LABELS[task.priority]}
                                color={PRIORITY_COLORS[task.priority]}
                                sx={{
                                    height: 22,
                                    '& .MuiChip-label': {
                                        px: 1,
                                        fontSize: '0.7rem',
                                    },
                                }}
                            />

                            {task.tags.map((tag) => (
                                <Chip
                                    key={tag.id}
                                    size="small"
                                    variant="outlined"
                                    label={tag.name}
                                    sx={{
                                        height: 22,
                                        '& .MuiChip-label': {
                                            px: 1,
                                            fontSize: '0.7rem',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', fontWeight: 600, letterSpacing: '0.03em' }}
                        >
                            Created
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                            {formatDate(task.createdAt)}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mt: 1.75,
                        pt: 1.25,
                        borderTop: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', fontWeight: 600 }}
                        >
                            Creator
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            <InitialsAvatar name={task.creator.nickname} size={22} variant="rounded" />

                            <Typography variant="caption" noWrap>
                                {task.creator.nickname}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ alignSelf: 'flex-end', mb: 0.25 }}
                    >
                        →
                    </Typography>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: 'block', fontWeight: 600 }}
                        >
                            Assignee
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                            {task.assignee && task.assignmentStatus === 'APPROVED' && (
                                <InitialsAvatar name={assigneeLabel} size={22} variant="rounded" />
                            )}

                            <Typography
                                variant="caption"
                                noWrap
                                color={assigneeLabel === 'Unassigned' ? 'text.secondary' : 'text.primary'}
                            >
                                {assigneeLabel}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}

export default TaskCard