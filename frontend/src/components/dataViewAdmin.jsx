import {
  Typography,
  TextField,
  Stack
} from "@mui/material";
import * as React from "react";
import { PendingDataContext } from "../context/PendingInstitutionContext";
import AlertAction from "./dialogMessage";

export default function DataView() {

    const pendingData = React.useContext(PendingDataContext)

    return (
        <div className="App">
        <form>
            <Typography  sx={{
                    mr: 2,
                    fontFamily: 'monospace',
                    fontWeight: 1000,
                    color: 'inherit',
                    textAlign:'left'
                }}>
                    ID:
            </Typography>
            <TextField
                value={pendingData.id}
                InputProps={{readOnly: true}}
                style={{ width: "75%"}}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Typography sx={{
                   mr: 2,
                   fontFamily: 'monospace',
                   fontWeight: 1000,
                   color: 'inherit',
                   textAlign:'left'
                }}>
                    School Name:
            </Typography>
            <TextField
                value={pendingData.schoolname}
                InputProps={{readOnly: true,}}
                style={{ width: "75%"}}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Typography sx={{
                    mr: 2,
                    fontFamily: 'monospace',
                    fontWeight: 1000,
                    color: 'inherit',
                    textAlign:'left'
                }}>
                    Address:
            </Typography>
            <TextField
                value={pendingData.address}
                InputProps={{readOnly: true,}}
                style={{ width: "75%"}}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Typography sx={{
                    mr: 2,
                    fontFamily: 'monospace',
                    fontWeight: 1000,
                    color: 'inherit',
                    textAlign:'left'
                }}>
                    Full Name:
            </Typography>
            <TextField
                value={pendingData.firstname+' '+pendingData.lastname}
                InputProps={{readOnly: true,}}
                style={{ width: "75%"}}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Typography sx={{
                    mr: 2,
                    fontFamily: 'monospace',
                    fontWeight: 1000,
                    color: 'inherit',
                    textAlign:'left'
                }}>
                    Email:
            </Typography>
            <TextField
                value={pendingData.email}
                InputProps={{readOnly: true,}}
                style={{ width: "75%" }}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Typography sx={{
                    mr: 2,
                    fontFamily: 'monospace',
                    fontWeight: 1000,
                    color: 'inherit',
                    textAlign:'left'
                }}>
                    Wallet Address:
            </Typography>
            <TextField
                value={pendingData.walletaddress}
                InputProps={{readOnly: true,}}
                style={{ width: "75%" }}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Typography sx={{
                    mr: 2,
                    fontFamily: 'monospace',
                    fontWeight: 1000,
                    color: 'inherit',
                    textAlign:'left'
                }}>
                    Birth Date:
            </Typography>
            <TextField
                value={pendingData.dateofbirth}
                InputProps={{readOnly: true,}}
                style={{ width: "75%" }}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Typography sx={{
                   mr: 2,
                   fontFamily: 'monospace',
                   fontWeight: 1000,
                   color: 'inherit',
                   textAlign:'left'
                }}>
                    Created At:
            </Typography>
            <TextField
                value={pendingData.created_at}
                InputProps={{readOnly: true,}}
                style={{ width: "75%" }}
                type="text"
                variant="outlined"
                size="small"
            />
            <br />
            <Stack spacing={4} direction="row">
                <AlertAction action = {"approve"} message={`approve institution ${pendingData.schoolname}?`} data={{PendingInstitutionID: pendingData.id, WalletAddress: pendingData.walletaddress, maxWidth: "md", fullWidth: false}}/>
                <AlertAction action = {"decline"} message={`decline institution ${pendingData.schoolname}?`} data={{PendingInstitutionID: pendingData.id, maxWidth: "md", fullWidth: false}}/>
            </Stack>
        </form>
        </div>
    );
}
