import type { ReactNode } from 'react'
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material'
import { ThemeContext, type Theme } from './ThemeContextDefinition'

interface ThemeProviderProps {
    children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const theme = (import.meta.env.VITE_THEME as Theme) || 'light'

    const muiTheme = createTheme({
        palette: {
            mode: theme,
        },
    })

    return (
        <ThemeContext.Provider value={{ theme }}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                <div data-theme={theme}>{children}</div>
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}