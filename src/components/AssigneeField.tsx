import { useState } from 'react'
import {
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    type SelectChangeEvent,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import ConfirmIconButton from './ConfirmIconButton'
import type { UserPicker, UserRef, AssignmentStatus } from '../types'

interface AssigneeFieldProps {
    assignee: UserRef | null
    assignmentStatus: AssignmentStatus
    canReassign: boolean
    assignableUsers: UserPicker[]
    onAssign: (assigneeId: string) => void
}

function AssigneeField({
                           assignee,
                           assignmentStatus,
                           canReassign,
                           assignableUsers,
                           onAssign,
                       }: AssigneeFieldProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [selectedAssignee, setSelectedAssignee] = useState('')

    const handleConfirm = () => {
        if (selectedAssignee) {
            onAssign(selectedAssignee)
        }
        setIsEditing(false)
        setSelectedAssignee('')
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <AssignmentIndIcon fontSize="small" color="action" sx={{ mt: '2px' }} />

            <Typography variant="body2" color="text.secondary" sx={{ width: 72, mt: '2px', fontWeight: 500 }}>
                Assignee
            </Typography>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                {canReassign && isEditing ? (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Select
                            value={selectedAssignee}
                            onChange={(e: SelectChangeEvent) => setSelectedAssignee(e.target.value)}
                            size="small"
                            displayEmpty
                            sx={{ minWidth: 160 }}
                        >
                            <MenuItem value="">
                                <em>Select a user</em>
                            </MenuItem>

                            {assignableUsers.map((u) => (
                                <MenuItem key={u.id} value={u.id}>
                                    {u.nickname}
                                </MenuItem>
                            ))}
                        </Select>

                        <ConfirmIconButton onClick={handleConfirm} />
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                flexGrow: 1,
                                fontWeight: assignee ? 600 : 400,
                            }}
                        >
                            {assignee ? assignee.nickname : 'Unassigned'}

                            {assignee && (
                                <Typography component="span" variant="body2" color="text.secondary">
                                    {' '}
                                    · {assignmentStatus.toLowerCase()}
                                </Typography>
                            )}
                        </Typography>

                        {canReassign && (
                            <IconButton
                                size="small"
                                onClick={() => setIsEditing(true)}
                                sx={{
                                    color: 'text.secondary',
                                    borderRadius: 1.5,
                                    '&:hover': {
                                        color: 'primary.main',
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default AssigneeField