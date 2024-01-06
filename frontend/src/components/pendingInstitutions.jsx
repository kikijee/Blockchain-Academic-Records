import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { PendingDataDispatchContext } from '../context/PendingInstitutionContext';
import { PendingTableDataContext } from '../context/PendingInstitutionTableContext';

const columns = [
  {field: 'id', headerName: 'ID', width: 70 },
  {field: 'schoolname', headerName:'School Name', width: 130},
  {field: 'address', headerName:'Address', width: 150},
  {field: 'firstname', headerName: 'First Name', width: 130},
  {field: 'lastname', headerName: 'Last Name', width: 130},
  {field: 'email',headerName: 'Email', width: 130},
  {field: 'walletaddress',headerName: 'Wallet Address', width: 130},
  {field: 'dateofbirth', headerName: 'Birth Date', width: 130},
  {field: 'created_at', headerName: 'Created at', width: 130}
];

// const rows = [
//   { id: 1, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Snow', firstname: 'Jon', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 2, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Lannister', firstname: 'Cersei', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 3, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Lannister', firstname: 'Jaime', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 4, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Stark', firstname: 'Arya', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 5, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Targaryen', firstname: 'Daenerys', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 6, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Melisandre', firstname: null, dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 7, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Clifford', firstname: 'Ferrara', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 8, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Frances', firstname: 'Rossini', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
//   { id: 9, schoolname:'CSUSM', address:"333 S Twin Oaks Valley Rd, San Marcos, CA 92096", email:"csusm@csusm.edu", lastname: 'Roxie', firstname: 'Harvey', dateofbirth: '10-02-2001', created_at: '2023-10-09 21:12:34.224181'},
// ];

export default function PendingInstitutions() {

const PendingDataDispatch = React.useContext(PendingDataDispatchContext)
const table = React.useContext(PendingTableDataContext)


  return (
    <div style={{ height: '100%', width: '100%', overflow:'auto'}}>
      <DataGrid
      
        autoHeight={false}
        rows={table.rows}
        onRowClick={(e)=>{
          PendingDataDispatch({type:"change",payload:{
            id:e.row.id,
            schoolname:e.row.schoolname,
            address:e.row.address,
            email:e.row.email,
            walletaddress:e.row.walletaddress,
            lastname:e.row.lastname,
            firstname:e.row.firstname,
            dateofbirth:e.row.dateofbirth,
            created_at:e.row.created_at
          }})
        }}
        onRowSelectionModelChange={(e)=>{
          if(e.length === 0){
            PendingDataDispatch({type:"reset"})
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
  );
}

