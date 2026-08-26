import type { ReactNode } from 'react'
import { ThemeContext, type Theme } from './ThemeContextDefinition'

interface ThemeProviderProps {
    children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const theme = (process.env.APP_THEME as Theme) || 'light'

    return (
        <ThemeContext.Provider value={{ theme }}>
            <div data-theme={theme}>{children}</div>
        </ThemeContext.Provider>
    )
}