import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {'Copyright © '}
      <Link color="inherit" href="https://www.csusm.edu/index.html">
        CSUSM
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function StickyFooter() {
  return (
    <ThemeProvider theme={defaultTheme}>
        
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '95vh',
        }}
      >
        <CssBaseline />
        <Container component="main" sx={{ mt: 8}} maxWidth="sm" >
            <Typography variant="h2" component="h1" gutterBottom>
                Blockchain For Educational Records
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom marginBottom={10}>
                {'A Blockchain solution for the storage and verification of educational records. '}
                {'Providing the security and flexibility that Web3 offers in an all in one package.'}
            </Typography>
            
        </Container>

        <Container component="main" sx={{
            justifyContent: 'flex-end',
            marginTop:'auto'
          }} maxWidth="sm">
            <Typography variant="h6">Development team:</Typography>
                <Link href="https://github.com/cj-ledet" underline="hover">
                    {'Chris Ledet, '}
                </Link>
                <Link href="https://github.com/kikijee" underline="hover">
                    {'Christian Manibusan, '}
                </Link>
                <Link href="https://github.com/ccchameleon" underline="hover">
                    {'Alex Nelson, '}
                </Link>
                <Link href="https://github.com/myd28" underline="hover">
                    {'My Dang, '}
                </Link>
                <Link href="https://github.com/ken258147" underline="hover">
                    {'Kenny Wang'}
                </Link>
        </Container>
        
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm">
            <Typography variant="body1">
              Blockchain edu
            </Typography>
            <Copyright />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
