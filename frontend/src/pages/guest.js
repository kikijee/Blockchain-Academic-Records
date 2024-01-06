import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar, Button, CssBaseline, TextField, Grid, Alert, Box, Typography,
  Container, Snackbar, ThemeProvider, createTheme
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LinkIcon from '@mui/icons-material/Link';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { fetchRecord, getRecordHash, getRecordAddress } from '../service/guestService';
import { validateRecord } from '../service/contractService';

const defaultTheme = createTheme();

export default function Guest() {
  const [cid, setCID] = React.useState('');
  const [error, setError] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');
  const [blockchainVerification, setBlockchainVerification] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const IPFS_Hash = queryParams.get('IPFS_Hash');
    const FirstName = queryParams.get('FirstName');
    const LastName = queryParams.get('LastName');
    const DateOfBirth = queryParams.get('DateOfBirth');

    if (IPFS_Hash && FirstName && LastName && DateOfBirth) {
      setCID(IPFS_Hash);
      setFormData({ firstname: FirstName, lastname: LastName, date: DateOfBirth });
    }
  }, [location]);

  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    date: ""
  });

  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const recordData = {
        IPFS_Hash: cid,
        FirstName: formData.firstname,
        LastName: formData.lastname,
        DateOfBirth: formData.date
      };

      // rehashing all of the record information (this is the hash stored on the map state variable in the smart contract)
      const recordHash = await getRecordHash({
        IPFS_Hash: cid,
        FirstName: formData.firstname,
        LastName: formData.lastname,
        DateOfBirth: formData.date
      })
      const recordCheck = await validateRecord(recordHash.data.recordHash)
      console.log('validation:',recordCheck)
      if(recordCheck.success && recordCheck.valid && recordCheck.updated){
        const response = await fetchRecord(recordData);
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const addressResponse = await getRecordAddress(cid);  // blockchain transaction id
        setBlobUrl(URL.createObjectURL(pdfBlob));
        setBlockchainVerification(addressResponse.data.transactionAddress);
        setShowDialog(true);
      }
      else{
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("Error fetching record: ", error);
      setError(error.message || "Error fetching record.");
      setOpen(true);
    }
  }; 

  const handleCloseDialog = () => {
    setShowDialog(false);
    setShowErrorDialog(false);
  };

  const handleViewRecord = () => {
    window.open(blobUrl, '_blank');
  };

  const handleBlockchainLink = () => {
    window.open(`https://sepolia.etherscan.io/tx/${blockchainVerification}`, '_blank'); // Opens a new blank tab for now
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <form onSubmit={handleSearch}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ bgcolor: "#466b48" }}>
            <SearchIcon />
          </Avatar>
          <Typography component="h1" variant="h5" padding={"10px"}>
            Record Search
          </Typography>
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstname"
                required
                fullWidth
                id="firstname"
                label="First Name"
                autoFocus
                value={formData.firstname}
                onChange={handleDataChange}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="family-name"
                value={formData.lastname}
                onChange={handleDataChange}
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="date"
                label="Date of Birth"
                name="date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={handleDataChange}
              />
            </Grid>

            {/* CID Input */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="cid"
                label="Insert CID to Search"
                value={cid}
                onChange={(e) => setCID(e.target.value)}
              />
            </Grid>

            {/* Search Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          </Box>

          {/* Error Snackbar */}
          <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
            <Alert onClose={() => setOpen(false)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        
        </form>
      
        <Dialog open={showDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle style={{ textAlign: 'center' }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginRight: 8 }}>Record Found</Typography>
            <CheckCircleIcon style={{ color: 'green' }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography style={{ textAlign: 'center' }}>Blockchain Verified</Typography>
          <Typography style={{ textAlign: 'center', marginTop: '8px' }}>
            {blockchainVerification} {}
          </Typography>
          <Box display="flex" justifyContent="space-around" marginTop={2}>
            <Button onClick={handleBlockchainLink} startIcon={<LinkIcon />} variant="contained">
              Blockchain Link
            </Button>
            <Button onClick={handleViewRecord} startIcon={<FileCopyIcon />} color="primary" variant="contained">
              View Record
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={showErrorDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle style={{ textAlign: 'center' }}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" style={{ marginRight: 8 }}>Record Not Found</Typography>
            <ErrorIcon style={{ color: 'red' }} />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography style={{ textAlign: 'center' }}>This record has not been verified</Typography>
          <Typography style={{ textAlign: 'center', marginTop: '8px' }}>
            Please double check the entered information. If you believe this is an error please contact your institution representative.
          </Typography>
        </DialogContent>
      </Dialog>

      </Container>
    </ThemeProvider>
  );
}
