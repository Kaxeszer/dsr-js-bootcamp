import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { TaskPriority } from '../types'
import { newTaskSchema, type NewTaskFormValues } from '../schemas/taskSchemas'
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
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<NewTaskFormValues>({
        resolver: zodResolver(newTaskSchema),
        defaultValues: { title: '', description: '', priority: 'LOW' },
    })

    const onValidSubmit = (data: NewTaskFormValues) => {
        onSubmit(data.title, data.description ?? '', data.priority)
        reset()
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onValidSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                    label="New task"
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('title')}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />
                <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                        <Select
                            value={field.value}
                            onChange={(e: SelectChangeEvent) => field.onChange(e.target.value)}
                            size="small"
                        >
                            {PRIORITIES.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {PRIORITY_LABELS[p]}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                <Button type="submit" variant="contained" sx={{ whiteSpace: 'nowrap' }}>
                    Add task
                </Button>
            </Box>
            <TextField
                label="Description (optional)"
                size="small"
                fullWidth
                multiline
                rows={2}
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
            />
        </Box>
    )
}

export default NewTaskForm