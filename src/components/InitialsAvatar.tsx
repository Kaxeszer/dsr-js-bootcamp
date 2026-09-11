import { Avatar, type AvatarProps } from '@mui/material'

interface InitialsAvatarProps extends Omit<AvatarProps, 'children'> {
    name: string
    size?: number
}

function InitialsAvatar({ name, size = 36, sx, ...rest }: InitialsAvatarProps) {
    const initials = name.slice(0, 2).toUpperCase()

    return (
        <Avatar
            sx={{
                width: size,
                height: size,
                fontSize: size <= 24 ? '0.65rem' : '0.8rem',
                fontWeight: 600,
                bgcolor: 'primary.main',
                ...sx,
            }}
            {...rest}
        >
            {initials}
        </Avatar>
    )
}

export default InitialsAvatar