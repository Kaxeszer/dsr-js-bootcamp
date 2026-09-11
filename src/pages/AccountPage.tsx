import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/authStore'
import { useBlockStore } from '../store/blockStore'
import { useAdminStore } from '../store/adminStore'
import { useUsersList } from '../hooks/useUsersList'
import ConfirmIconButton from '../components/ConfirmIconButton'
import EmptyState from '../components/EmptyState'
import InitialsAvatar from '../components/InitialsAvatar'
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    Collapse,
    Select,
    MenuItem,
    Card,
    CardContent,
    Avatar,
    Stack,
    type SelectChangeEvent,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import ShieldIcon from '@mui/icons-material/Shield'

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

function SectionCard({ children }: { children: ReactNode }) {
    return (
        <Card
            variant="outlined"
            sx={{
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                    borderColor: 'rgba(25, 118, 210, 0.25)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                },
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: { xs: 2.5, sm: 3 },
                    '&:last-child': {
                        pb: { xs: 2.5, sm: 3 },
                    },
                }}
            >
                {children}
            </CardContent>
        </Card>
    )
}

interface ManageableSectionProps {
    title: string
    count: number
    countLabel: string
    isOpen: boolean
    onToggle: () => void
    openIcon: ReactNode
    children: ReactNode
}

function ManageableSection({
                               title,
                               count,
                               countLabel,
                               isOpen,
                               onToggle,
                               openIcon,
                               children,
                           }: ManageableSectionProps) {
    return (
        <Stack spacing={1.5}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                }}
            >
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {count} {countLabel}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    startIcon={isOpen ? <CloseIcon /> : openIcon}
                    onClick={onToggle}
                >
                    {isOpen ? 'Hide' : 'Manage'}
                </Button>
            </Box>

            <Collapse in={isOpen}>{children}</Collapse>
        </Stack>
    )
}

function AccountPage() {
    const { user, accessToken, changePassword, isLoading, error, clearError } = useAuthStore()

    const {
        blocks,
        isLoading: blocksLoading,
        error: blocksError,
        loadBlocks,
        addBlock,
        removeBlock,
    } = useBlockStore()

    const {
        users: adminUsers,
        blocks: adminBlocks,
        error: adminError,
        loadUsers: loadAdminUsers,
        banUser,
        unbanUser,
        loadBlocks: loadAdminBlocks,
        removeBlock: removeAdminBlock,
    } = useAdminStore()

    const isAdmin = user?.role === 'ADMIN'

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
    const [isAddingBlock, setIsAddingBlock] = useState(false)
    const users = useUsersList(accessToken)
    const [selectedUserToBlock, setSelectedUserToBlock] = useState('')
    const [isManagingUsers, setIsManagingUsers] = useState(false)
    const [isManagingBlocks, setIsManagingBlocks] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    })

    useEffect(() => {
        clearError()
    }, [clearError])

    useEffect(() => {
        if (accessToken) {
            void loadBlocks(accessToken)
        }
    }, [accessToken, loadBlocks])

    useEffect(() => {
        if (accessToken && isAdmin) {
            void loadAdminUsers(accessToken)
            void loadAdminBlocks(accessToken)
        }
    }, [accessToken, isAdmin, loadAdminUsers, loadAdminBlocks])

    const onSubmit = async (data: ChangePasswordFormValues) => {
        const success = await changePassword(data.currentPassword, data.newPassword)

        if (success) {
            reset()
            setIsChangePasswordOpen(false)
        }
    }

    const blockedUserIds = new Set(blocks.map((b) => b.blockedUserId))

    const blockableUsers = users.filter((u) => u.id !== user?.id && !blockedUserIds.has(u.id))

    const handleConfirmBlock = async () => {
        if (accessToken && selectedUserToBlock) {
            await addBlock(accessToken, selectedUserToBlock)
            setSelectedUserToBlock('')
            setIsAddingBlock(false)
        }
    }

    return (
        <Container maxWidth="sm">
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
                        Account
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Manage your account, security and blocked users.
                    </Typography>
                </Box>

                {/* My Account */}
                <SectionCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <InitialsAvatar name={user?.nickname ?? '?'} size={52} />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {user?.nickname}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {user?.email || 'No email set'}
                            </Typography>
                        </Box>

                        <Chip
                            label={user?.role}
                            size="small"
                            color={isAdmin ? 'primary' : 'default'}
                            sx={{ ml: 'auto', fontWeight: 600 }}
                        />
                    </Box>
                </SectionCard>

                {/* Security */}
                <SectionCard>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Security
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                Keep your account secure.
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="small"
                            startIcon={isChangePasswordOpen ? <CloseIcon /> : <EditIcon />}
                            onClick={() => setIsChangePasswordOpen((v) => !v)}
                        >
                            {isChangePasswordOpen ? 'Cancel' : 'Change Password'}
                        </Button>
                    </Box>

                    <Collapse in={isChangePasswordOpen}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                                mt: 1,
                                pt: 2,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <TextField
                                label="Current Password"
                                type="password"
                                fullWidth
                                size="small"
                                {...register('currentPassword')}
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword?.message}
                            />

                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                size="small"
                                {...register('newPassword')}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={isLoading}
                                sx={{ alignSelf: 'flex-end' }}
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </Box>
                    </Collapse>

                    {error && <Alert severity="error">{error}</Alert>}
                </SectionCard>

                {/* Blocked Users */}
                <SectionCard>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Blocked Users
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                                They can no longer assign tasks to you.
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="small"
                            startIcon={isAddingBlock ? <CloseIcon /> : <BlockIcon />}
                            onClick={() => setIsAddingBlock((v) => !v)}
                        >
                            {isAddingBlock ? 'Cancel' : 'Block User'}
                        </Button>
                    </Box>

                    <Collapse in={isAddingBlock}>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                p: 1,
                                borderRadius: 2,
                                bgcolor: 'action.hover',
                            }}
                        >
                            <Select
                                value={selectedUserToBlock}
                                onChange={(e: SelectChangeEvent) => setSelectedUserToBlock(e.target.value)}
                                size="small"
                                displayEmpty
                                fullWidth
                                sx={{ bgcolor: 'background.paper' }}
                            >
                                <MenuItem value="">
                                    <em>Select a user</em>
                                </MenuItem>

                                {blockableUsers.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.nickname}
                                    </MenuItem>
                                ))}
                            </Select>

                            <ConfirmIconButton
                                onClick={() => void handleConfirmBlock()}
                                disabled={!selectedUserToBlock}
                            />
                        </Box>
                    </Collapse>

                    {blocksLoading && (
                        <Typography variant="body2" color="text.secondary">
                            Loading...
                        </Typography>
                    )}

                    {blocksError && <Alert severity="error">{blocksError}</Alert>}

                    {blocks.length === 0 && !blocksLoading ? (
                        <EmptyState message="You haven't blocked anyone." />
                    ) : (
                        <List disablePadding>
                            {blocks.map((block) => (
                                <ListItem
                                    key={block.id}
                                    disableGutters
                                    sx={{
                                        py: 1.25,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                        '&:last-child': {
                                            borderBottom: 0,
                                        },
                                    }}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            color="error"
                                            onClick={() =>
                                                accessToken && void removeBlock(accessToken, block.blockedUserId)
                                            }
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    }
                                >
                                    <InitialsAvatar
                                        name={block.blockedUser.nickname}
                                        sx={{
                                            mr: 1.5,
                                            bgcolor: 'action.hover',
                                            color: 'text.secondary',
                                        }}
                                    />

                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontWeight: 600 }}>
                                                {block.blockedUser.nickname}
                                            </Typography>
                                        }
                                        secondary={block.comment || undefined}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </SectionCard>

                {/* Administration */}
                {isAdmin && (
                    <SectionCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ShieldIcon color="primary" fontSize="small" />

                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Administration
                            </Typography>
                        </Box>

                        {adminError && <Alert severity="error">{adminError}</Alert>}

                        <ManageableSection
                            title="Users"
                            count={adminUsers.length}
                            countLabel="registered"
                            isOpen={isManagingUsers}
                            onToggle={() => setIsManagingUsers((v) => !v)}
                            openIcon={<PersonOutlineIcon />}
                        >
                            <List disablePadding>
                                {adminUsers.map((row) => (
                                    <ListItem
                                        key={row.id}
                                        disableGutters
                                        sx={{
                                            py: 1.25,
                                            borderBottom: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                        secondaryAction={
                                            row.id === user?.id ? null : row.bannedAt ? (
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    color="success"
                                                    onClick={() =>
                                                        accessToken && void unbanUser(accessToken, row.id)
                                                    }
                                                >
                                                    <CheckCircleIcon fontSize="small" />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    color="warning"
                                                    onClick={() =>
                                                        accessToken && void banUser(accessToken, row.id)
                                                    }
                                                >
                                                    <BlockIcon fontSize="small" />
                                                </IconButton>
                                            )
                                        }
                                    >
                                        <InitialsAvatar name={row.nickname} size={36} sx={{ mr: 1.5 }} />

                                        <ListItemText
                                            primary={
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                        alignItems: 'center',
                                                        flexWrap: 'wrap',
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: 600 }}>
                                                        {row.nickname}
                                                    </Typography>

                                                    <Chip
                                                        label={row.role}
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.65rem',
                                                            fontWeight: 600,
                                                        }}
                                                    />

                                                    {row.bannedAt && (
                                                        <Chip
                                                            label="Banned"
                                                            size="small"
                                                            color="error"
                                                            sx={{
                                                                height: 20,
                                                                fontSize: '0.65rem',
                                                                fontWeight: 600,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={row.email}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </ManageableSection>

                        <ManageableSection
                            title="All Blocks"
                            count={adminBlocks.length}
                            countLabel="active"
                            isOpen={isManagingBlocks}
                            onToggle={() => setIsManagingBlocks((v) => !v)}
                            openIcon={<BlockIcon />}
                        >
                            {adminBlocks.length === 0 ? (
                                <EmptyState message="No blocks in the system." />
                            ) : (
                                <List disablePadding>
                                    {adminBlocks.map((block) => (
                                        <ListItem
                                            key={block.id}
                                            disableGutters
                                            sx={{
                                                py: 1.25,
                                                borderBottom: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        accessToken &&
                                                        void removeAdminBlock(
                                                            accessToken,
                                                            block.blockerId,
                                                            block.blockedUserId
                                                        )
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            }
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    mr: 1.5,
                                                    bgcolor: 'action.hover',
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                <BlockIcon fontSize="small" />
                                            </Avatar>

                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ fontWeight: 600 }}>
                                                        {block.blocker.nickname}
                                                        {' → '}
                                                        {block.blockedUser.nickname}
                                                    </Typography>
                                                }
                                                secondary={block.comment || undefined}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </ManageableSection>
                    </SectionCard>
                )}
            </Box>
        </Container>
    )
}

export default AccountPage