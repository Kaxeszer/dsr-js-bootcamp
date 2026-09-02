import { z } from 'zod'

export const newTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
    description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

export type NewTaskFormValues = z.infer<typeof newTaskSchema>