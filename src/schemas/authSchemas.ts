import { z } from 'zod'

export const loginSchema = z.object({
    nickname: z
        .string()
        .min(3, 'Nickname must be at least 3 characters')
        .max(24, 'Nickname must be at most 24 characters')
        .regex(/^[a-z0-9_]+$/, 'Nickname must contain only lowercase letters, digits and underscore'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
    nickname: z
        .string()
        .min(3, 'Nickname must be at least 3 characters')
        .max(24, 'Nickname must be at most 24 characters')
        .regex(/^[a-z0-9_]+$/, 'Nickname must contain only lowercase letters, digits and underscore'),
    email: z.union([z.email('Must be a valid email'), z.literal('')]).optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>