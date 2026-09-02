import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'

function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
                    Task App
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/login">
                        Login
                    </Button>
                    <Button color="inherit" component={Link} to="/register">
                        Register
                    </Button>
                    <Button color="inherit" component={Link} to="/tasks">
                        Tasks
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header