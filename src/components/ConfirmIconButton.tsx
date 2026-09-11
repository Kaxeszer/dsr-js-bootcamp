import { IconButton, type IconButtonProps } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'

function ConfirmIconButton(props: IconButtonProps) {
    return (
        <IconButton
            size="small"
            {...props}
            sx={{
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                    bgcolor: 'primary.dark',
                },
                '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                },
                ...props.sx,
            }}
        >
            {props.children ?? <DoneIcon fontSize="small" />}
        </IconButton>
    )
}

export default ConfirmIconButton