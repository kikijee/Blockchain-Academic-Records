import * as React from 'react';
import { Button, TextField, Container, Typography, Snackbar, Alert, Avatar, CssBaseline, Link, Grid, Box} from '@mui/material';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthDispatchContext } from "../context/AuthContext";
import { login } from '../service/authService';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.csusm.edu/index.html">
                CSUSM
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
      </Typography>
    );
}


const defaultTheme = createTheme();

export default function LoginPage() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const authDispatch = React.useContext(AuthDispatchContext)
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setError(null); // Reset error
        if(email === '' || password === ''){
            setError("Please fill out the required fields.");
            setOpen(true);
        }
        else{
            try {
                const response = await login({ Email: email, AuthenticationData: password });
                
                // Check if the response contains user data
                if (response && response.ID) {
                    sessionStorage.setItem('user',JSON.stringify(response))
                    authDispatch({type:'change',payload:response})
                }
                

            // Redirect based on role
            if (response && response.Role) {
                if (response.Role === 'Admin') {
                    navigate('/adminDashboard');
                } else if (response.Role === 'Institution') {
                    navigate('/institutionDashboard');
                } else {
                    // Default redirection or handle other roles
                    navigate('/userDashboard');
                }
            }
            } catch (err) {
                setError("Failed to log in. Please check your credentials.");
                setOpen(true);
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: "#466b48" }}>
                <WidgetsIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Sign In
                </Button>
                <Grid container>
                <Grid item xs>
                    <Link href="#" variant="body2">
                    Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="error">
                    {error}
                </Alert>
            </Snackbar>
        </Container>
        </ThemeProvider>
    );
}
