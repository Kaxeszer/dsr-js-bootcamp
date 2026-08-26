import { createContext } from 'react'

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
    theme: Theme
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)