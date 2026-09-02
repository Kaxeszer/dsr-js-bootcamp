import { useState, type SubmitEventHandler } from 'react'
import type { TaskPriority } from '../types'
import { Box, TextField, Button, Select, MenuItem, type SelectChangeEvent } from '@mui/material'

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH']

const PRIORITY_LABELS: Record<TaskPriority, string> = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
}

interface NewTaskFormProps {
    onSubmit: (title: string, description: string, priority: TaskPriority) => void
}

function NewTaskForm({ onSubmit }: NewTaskFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('LOW')

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        if (!title) return
        onSubmit(title, description, priority)
        setTitle('')
        setDescription('')
        setPriority('LOW')
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    label="New task"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <Select
                    value={priority}
                    onChange={(e: SelectChangeEvent) => setPriority(e.target.value as TaskPriority)}
                    size="small"
                >
                    {PRIORITIES.map((p) => (
                        <MenuItem key={p} value={p}>
                            {PRIORITY_LABELS[p]}
                        </MenuItem>
                    ))}
                </Select>
                <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>
                    Add task
                </Button>
            </Box>
            <TextField
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                size="small"
                fullWidth
                multiline
                rows={2}
                slotProps={{ inputLabel: { shrink: true } }}
            />
        </Box>
    )
}

export default NewTaskForm