import { Box, Typography } from '@mui/material'

interface EmptyStateProps {
    message: string
}

function EmptyState({ message }: EmptyStateProps) {
    return (
        <Box
            sx={{
                py: 3,
                textAlign: 'center',
                borderRadius: 2,
                bgcolor: 'action.hover',
            }}
        >
            <Typography variant="body2" color="text.secondary">
                {message}
            </Typography>
        </Box>
    )
}

export default EmptyState