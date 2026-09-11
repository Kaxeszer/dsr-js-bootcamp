import { Box, TextField, Select, MenuItem, type SelectChangeEvent } from '@mui/material'
import type { SortField, SortDirection } from '../workers/taskSort.worker'

const SORT_FIELD_LABELS: Record<SortField, string> = {
    title: 'Title',
    priority: 'Priority',
    status: 'Status',
    tag: 'Tag',
    assignee: 'Assignee',
    creator: 'Creator',
    createdAt: 'Created',
}

const SORT_DIRECTION_LABELS: Record<SortDirection, string> = {
    asc: 'Ascending',
    desc: 'Descending',
}

interface TaskFiltersProps {
    searchInput: string
    onSearchChange: (value: string) => void
    sortField: SortField
    onSortFieldChange: (value: SortField) => void
    sortDirection: SortDirection
    onSortDirectionChange: (value: SortDirection) => void
}

function TaskFilters({
                         searchInput,
                         onSearchChange,
                         sortField,
                         onSortFieldChange,
                         sortDirection,
                         onSortDirectionChange,
                     }: TaskFiltersProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                bgcolor: 'action.hover',
            }}
        >
            <TextField
                label="Search tasks..."
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                size="small"
                fullWidth
                slotProps={{
                    inputLabel: { shrink: true },
                }}
                sx={{
                    flex: '1 1 280px',
                    '& .MuiOutlinedInput-root': {
                        bgcolor: 'background.paper',
                    },
                }}
            />

            <Select
                value={sortField}
                onChange={(e: SelectChangeEvent) => onSortFieldChange(e.target.value as SortField)}
                size="small"
                sx={{
                    minWidth: 160,
                    bgcolor: 'background.paper',
                }}
            >
                {(Object.keys(SORT_FIELD_LABELS) as SortField[]).map((field) => (
                    <MenuItem key={field} value={field}>
                        Sort by {SORT_FIELD_LABELS[field]}
                    </MenuItem>
                ))}
            </Select>

            <Select
                value={sortDirection}
                onChange={(e: SelectChangeEvent) => onSortDirectionChange(e.target.value as SortDirection)}
                size="small"
                sx={{
                    minWidth: 140,
                    bgcolor: 'background.paper',
                }}
            >
                {(Object.keys(SORT_DIRECTION_LABELS) as SortDirection[]).map((direction) => (
                    <MenuItem key={direction} value={direction}>
                        {SORT_DIRECTION_LABELS[direction]}
                    </MenuItem>
                ))}
            </Select>
        </Box>
    )
}

export default TaskFilters