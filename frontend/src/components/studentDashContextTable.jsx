import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Grid, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { getRecords } from "../service/studentService.js";
import { getRecordAddress } from '../service/guestService';

const columns = [
    { field: 'id', headerName: "Record ID", align: 'center', width: 125 },
    { field: 'SchoolName', headerName: "School Name", width: 200 },
    { field: 'RecordType', headerName: "Record Type", align: "center", width: 200 },
    {
        field: 'Date',
        headerName: 'Date',
        width: 200,
        valueGetter: (params) => new Date(params.row.Date).toLocaleDateString(),
    },
    {
        field: 'IPFS_Hash',
        headerName: 'File',
        width: 200,
        renderCell: (params) => {
            const searchPageUrl = `${window.location.origin}/recordRequest?IPFS_Hash=${params.row.IPFS_Hash}&FirstName=${encodeURIComponent(params.row.FirstName)}&LastName=${encodeURIComponent(params.row.LastName)}&DateOfBirth=${params.row.DateOfBirth}`;

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

export default function StudentRecordTable() {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await getRecords();
                if (data && Array.isArray(data)) {
                    const formattedData = data.map(row => ({
                        id: row.RecordID,
                        SchoolName: row.SchoolName,
                        RecordType: row.RecordType,
                        Date: row.Created_At,
                        IPFS_Hash: row.IPFS_Hash,
                        FirstName: row.FirstName,
                        LastName: row.LastName,
                        DateOfBirth: row.DateOfBirth
                    }));
                    setRows(formattedData);
                } else {
                    setError("Data is undefined");
                }
            } catch (error) {
                setError(error.message);
                console.error('Error fetching student records: ', error.message);
            }
        };
        fetchRecords();
    }, []);

    // Error and No Data Handling
    if (error) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '75vh' }}>
                <Typography color="error">{error}</Typography>
            </Grid>
        );
    }
    if (rows.length === 0) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '75vh' }}>
                <Typography>No records found</Typography>
            </Grid>
        );
    }

    // DataGrid Rendering
    return (
        <Grid container>
            <Grid item xs={12}>
                <div style={{ height: '80vh', overflow: 'auto' }}>
                    <DataGrid
                        autoHeight={false}
                        rows={rows}
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
        </Grid>
    );
}
