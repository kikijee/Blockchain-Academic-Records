import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Grid, TextField, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import AlertAction from './dialogMessage';
import { getCompletedInstitutionRecords } from '../service/institutionService';
import { getRecordAddress } from '../service/guestService';

const columns = [
    { field: 'id', headerName: 'Record ID', width: 100 },
    { field: 'StudentName', headerName: 'Student Name', width: 250 },
    { field: 'RecordType', headerName: 'Record Type', width: 250 },
    {
        field: 'date',
        headerName: 'Date',
        width: 250,
        valueGetter: (params) => new Date(params.row.Created_At).toLocaleDateString(),
    },
    {
        field: 'IPFS_Hash',
        headerName: 'File',
        width: 250,
        renderCell: (params) => {
            const searchPageUrl = `${window.location.origin}/recordRequest?IPFS_Hash=${params.row.IPFS_Hash}&FirstName=${encodeURIComponent(params.row.FirstName)}&LastName=${encodeURIComponent(params.row.LastName)}&DateOfBirth=${params.row.DateOfBirth}`;

            // Function to handle the blockchain link click
            const handleBlockchainLinkClick = async () => {
                const addressResponse = await getRecordAddress(params.row.IPFS_Hash);
                if (addressResponse && addressResponse.data && addressResponse.data.transactionAddress) {
                    const blockchainUrl = `https://sepolia.etherscan.io/tx/${addressResponse.data.transactionAddress}`;
                    window.open(blockchainUrl, '_blank');
                } else {
                    console.error("Error fetching blockchain address");
                }
            };

            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Button onClick={() => navigator.clipboard.writeText(searchPageUrl)}>
                        <img src='copy.svg' height="20" alt="Copy" />
                    </Button>
                    <Button onClick={handleBlockchainLinkClick}>
                        <LinkIcon style={{ color: '#466b48' }} />
                    </Button>
                </div>
            );
        },
    },
];

export default function AcceptedRequestTable() {
    const [rows, setRows] = React.useState([]);
    const [recordID, setRecordID] = React.useState('');

    React.useEffect(() => {
        const fetchRecords = async () => {
            const response = await getCompletedInstitutionRecords();

            if (!response.isError) {
                const modifiedRows = response.data.map(record => ({
                    ...record,
                    id: record.RecordID,
                    FirstName: record.Student.FirstName,
                    LastName: record.Student.LastName,
                    DateOfBirth: record.Student.DateOfBirth
                }));
                setRows(modifiedRows);
            } else {
                console.error('Failed to fetch records:', response.message);
            }
        };

        fetchRecords();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{ overflow: 'auto', height: '80vh' }}>
                    <DataGrid
                        autoHeight={false}
                        rows={rows}
                        onRowClick={(e) => setRecordID(e.row.id)}
                        onRowSelectionModelChange={(e) => {
                            if (e.length === 0) {
                                setRecordID('');
                            }
                        }}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                    />
                </div>
            </Grid>
            {recordID && (
                <AlertAction action={'revoke record request'} message={'Revoke Record Request?'} data={recordID} />
            )}
        </Grid>
    );
}
