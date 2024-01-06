import * as React from "react";
import StudentRecordTable from "../components/studentDashContextTable";
import CssBaseline from '@mui/material/CssBaseline';
import { Typography , Avatar} from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';


export default function StudentRecords() {


  return (
    <>
      <CssBaseline />

      <Typography sx={{ fontFamily: 'Monospace' }} fontWeight="bold" align="center" variant="h5" padding={"10px"}>Student Dashboard</Typography>
      <Avatar sx={{ bgcolor: "#466b48" }} align = "center">
        <DashboardIcon />
      </Avatar>

      <StudentRecordTable />

    </>
  );
}
