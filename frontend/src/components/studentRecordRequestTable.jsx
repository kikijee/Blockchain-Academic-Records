import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, TextField, Typography } from '@mui/material';
import { PendingRecordsContext } from '../context/PendingRecordsContext';
import AlertAction from './dialogMessage';
import { darken, lighten, styled } from '@mui/material/styles';

const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--Open': {
    backgroundColor: getBackgroundColor(theme.palette.info.main, theme.palette.mode),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode,
        ),
      },
    },
  },
  '& .super-app-theme--Rejected': {
    backgroundColor: getBackgroundColor(
      theme.palette.error.main,
      theme.palette.mode,
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
      },
    },
  },
}));

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'Status', headerName: 'Status', width: 130 },
  { field: 'SchoolName', headerName: 'School Name', width: 130 },
  { field: 'RecordType', headerName: 'Record Type', width: 150 },
  { field: 'Description', headerName: 'Description', width: 200 },
  { field: 'Created_At', headerName: 'Created At', width: 210 },
  { field: 'Note', headerName: 'Note', width: 200 },
];

export default function StudentRecordRequestTable() {

  const table = React.useContext(PendingRecordsContext)

  const [description, setDescription] = React.useState('');
  const [note, setNote] = React.useState('');
  const [recordID, setRecordID] = React.useState('');
  const [status, setStatus] = React.useState(false);
  const [recordType, setRecordType] = React.useState('')

  return (
    <Grid container spacing={2}>
      <Grid item xs={7}>
        <div style={{ overflow: 'auto', height: '80vh' }}>
          <StyledDataGrid
            autoHeight={false}
            rows={table.rows}
            onRowClick={(e) => {
              setDescription(e.row.Description)
              setNote(e.row.Note)
              setRecordID(e.row.id)
              setStatus(e.row.Status)
              setRecordType(e.row.RecordType)
            }}
            onRowSelectionModelChange={(e) => {
              if (e.length === 0) {
                setDescription('')
                setNote('')
                setRecordID('')
                setStatus('')
                setRecordType('')
              }
            }}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            getRowClassName={(params) => {
              if (params.row.Status === 'Pending School') {
                return 'super-app-theme--Open'
              }
              else {
                return 'super-app-theme--Rejected'
              }
            }}

          />
        </div>
      </Grid>
      <Grid item xs={5}>
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
        <Typography sx={{
          mr: 2,
          fontFamily: 'monospace',
          fontWeight: 1000,
          fontSize: 18,
          color: 'inherit',
          textAlign: 'left'
        }}>
          Institution Note:
        </Typography>
        <TextField
          margin="normal"
          value={note}
          fullWidth
          multiline
          InputProps={{ readOnly: true }}
          rows={10}
        />
        <Grid container spacing={2}>
          <Grid item xs={2}>
            {recordID !== '' &&
              <AlertAction margin="normal" action={'revoke record request'} message={'Revoke Record Request?'} data={{ PendingRecordID: recordID, maxWidth: "md", fullWidth: false }} />
            }
          </Grid>
          <Grid item xs={2}>
            {status === "Pending Student" &&
              <AlertAction sx={{ spacing: 10 }} action={'student update pending record'} message={''} data={{ PendingRecordID: recordID, Description: description, RecordType: recordType, maxWidth: "md", fullWidth: true }} />
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}