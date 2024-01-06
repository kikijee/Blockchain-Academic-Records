import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, Grid } from '@mui/material';
import { getInstitutionPendingRecords, completePendingRecord, returnInstitutionRecord, finalizeRecord, rollbackRecord } from '../service/institutionService';
import { addRecord } from '../service/contractService';


const renderNoRows = () => (
  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography>No pending records</Typography>
  </Box>
);

export default function InstitutionRecordRequestTable() {
  const [pendingRecords, setPendingRecords] = useState([]);
  const [error, setError] = useState('');
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [returnNote, setReturnNote] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [description, setDescription] = React.useState('');
  const [name, setName] = React.useState('');
  const [recordType, setRecordType] = React.useState('');
  const [date, setDate] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await getInstitutionPendingRecords();
      if (!response.isError) {
        setPendingRecords(response.data.map(record => ({
          ...record,
          id: record.PendingRecordID
        })));
      } else {
        setError(response.message || 'Failed to fetch pending records.');
      }
    };

    fetchData();
  }, []);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAcceptClick = async (recordId) => {
    setCurrentRecordId(recordId);
    setFileDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (selectedFile && currentRecordId) {
      const response = await completePendingRecord(currentRecordId, selectedFile);
      console.log('record', response);

      if (!response.isError) {
        // smart contract call to add record
        const blockchainResponse = await addRecord(response.data.recordHash);
        console.log('smart contract response', blockchainResponse);
        if (blockchainResponse.success) {
          await finalizeRecord(currentRecordId, blockchainResponse.receipt.hash);  // added transaction id to function params
          setPendingRecords(records => records.filter(record => record.id !== currentRecordId));
        }
        else {
          // this allows for record rollback if blockchain function fails
          await rollbackRecord(currentRecordId);
          console.log("Blockchain transaction failed");
        }
      } else {
        setError(response.message || 'Failed to complete the record.');
      }
      setFileDialogOpen(false);
      setSelectedFile(null);
      setCurrentRecordId(null);
    }
  };

  const handleConfirmReturn = async () => {
    if (currentRecordId) {
      const response = await returnInstitutionRecord(currentRecordId, returnNote);
      if (!response.isError) {
        setPendingRecords(records => records.filter(record => record.id !== currentRecordId));
      } else {
        setError(response.message || 'Failed to return the record.');
      }
      setReturnDialogOpen(false);
      setReturnNote('');
      setCurrentRecordId(null);
    }
  };

  const handleReturnDialogClick = (recordId) => {
    setCurrentRecordId(recordId);
    setReturnDialogOpen(true);
  };

  const columns = [
    { field: 'PendingRecordID', headerName: 'Request ID', width: 130 },
    { field: 'StudentName', headerName: 'Student Name', width: 200 },
    { field: 'Description', headerName: 'Description', width: 150 },
    { field: 'RecordType', headerName: 'Record Type', width: 150 },
    {
      field: 'Created_At',
      headerName: 'Created At',
      width: 150
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <Button variant="contained" color="primary" onClick={() => handleAcceptClick(params.id)}>
            Accept
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleReturnDialogClick(params.id)} style={{ marginLeft: 8 }}>
            Return
          </Button>
        </>
      ),
    },
  ];

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <DataGrid
            rows={pendingRecords}
            columns={columns}
            onRowClick={(e) => {
              setDescription(e.row.Description)
              setRecordType(e.row.RecordType)
              setName(e.row.StudentName)
              setDate(e.row.Created_At)
            }}
            onRowSelectionModelChange={(e) => {
              if (e.length === 0) {
                setDescription('')
                setRecordType('')
                setName('')
                setDate('')
              }
            }}
            sx={{ minHeight: '80vh' }} // Minimum height for the DataGrid
            renderNoRows={renderNoRows}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{
            mr: 2,
            fontFamily: 'monospace',
            fontWeight: 1000,
            fontSize: 18,
            color: 'inherit',
            textAlign: 'left'
          }}>
            Student Name:
          </Typography>
          <TextField
            margin="normal"
            value={name}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Typography sx={{
            mr: 2,
            fontFamily: 'monospace',
            fontWeight: 1000,
            fontSize: 18,
            color: 'inherit',
            textAlign: 'left'
          }}>
            Date:
          </Typography>
          <TextField
            margin="normal"
            value={date}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Typography sx={{
            mr: 2,
            fontFamily: 'monospace',
            fontWeight: 1000,
            fontSize: 18,
            color: 'inherit',
            textAlign: 'left'
          }}>
            Record Type:
          </Typography>
          <TextField
            margin="normal"
            value={recordType}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Typography sx={{
            mr: 2,
            fontFamily: 'monospace',
            fontWeight: 1000,
            fontSize: 18,
            color: 'inherit',
            textAlign: 'left'
          }}>
            Description:
          </Typography>
          <TextField
            margin="normal"
            value={description}
            fullWidth
            multiline
            InputProps={{ readOnly: true }}
            rows={10}
          />
        </Grid>
      </Grid>
      <Dialog fullWidth maxWidth="sm" open={fileDialogOpen} onClose={() => setFileDialogOpen(false)}>
        <DialogTitle>Upload File to Accept Record</DialogTitle>
        <DialogContent>
          <input type="file"
           accept=".pdf"
           onChange={handleFileSelect} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFileDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmAccept} color="primary">
            Upload and Accept
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth="sm" open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
        <DialogTitle>Return Record</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="return-note"
            label="Return Note"
            type="text"
            fullWidth
            variant="outlined"
            value={returnNote}
            onChange={(event) => setReturnNote(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmReturn}>Return to Student</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
