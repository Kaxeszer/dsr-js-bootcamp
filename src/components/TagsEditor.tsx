import { useState } from 'react'
import { Box, Typography, IconButton, Chip, Autocomplete, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ConfirmIconButton from './ConfirmIconButton'
import type { Tag } from '../types'

interface TagsEditorProps {
    tags: Tag[]
    suggestions: Tag[]
    canEdit: boolean
    onAddTag: (name: string) => void
    onRemoveTag: (tagId: string) => void
}

function TagsEditor({ tags, suggestions, canEdit, onAddTag, onRemoveTag }: TagsEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [newTagName, setNewTagName] = useState('')

    const existingTagNames = new Set(tags.map((t) => t.name))
    const suggestionOptions = suggestions
        .map((t) => t.name)
        .filter((name) => !existingTagNames.has(name))

    const handleAddTag = () => {
        const trimmed = newTagName.trim()
        if (trimmed && !existingTagNames.has(trimmed)) {
            onAddTag(trimmed)
        }
        setNewTagName('')
        setIsEditing(false)
    }

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
                Tags
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minHeight: 32 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, flexGrow: 1 }}>
                    {tags.length === 0 && !isEditing && (
                        <Typography variant="body2" color="text.secondary">
                            No tags yet
                        </Typography>
                    )}

                    {tags.map((tag) => (
                        <Chip
                            key={tag.id}
                            label={tag.name}
                            size="small"
                            onDelete={canEdit ? () => onRemoveTag(tag.id) : undefined}
                        />
                    ))}
                </Box>

                {canEdit && !isEditing && (
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

            {isEditing && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                    <Autocomplete
                        freeSolo
                        size="small"
                        fullWidth
                        autoFocus
                        options={suggestionOptions}
                        inputValue={newTagName}
                        onInputChange={(_, value, reason) => {
                            if (reason === 'input') {
                                setNewTagName(value)
                            }
                        }}
                        onChange={(_, value) => {
                            if (value && !existingTagNames.has(value)) {
                                onAddTag(value)
                            }
                            setNewTagName('')
                            setIsEditing(false)
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Add a tag"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddTag()
                                    }
                                }}
                            />
                        )}
                    />

                    <ConfirmIconButton onClick={handleAddTag} />
                </Box>
            )}
        </Box>
    )
}

export default TagsEditor