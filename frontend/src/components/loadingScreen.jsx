import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingScreen() {
  return (
    <Box
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={{ minHeight: '90vh',display: 'flex' }}>
      <CircularProgress />
    </Box>
  );
}