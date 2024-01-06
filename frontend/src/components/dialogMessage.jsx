import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { updatePendingRecord } from '../service/studentService';
import { Select, MenuItem, InputLabel, Avatar, Typography, FormControl, Stack, Snackbar, Alert, } from '@mui/material';
import { PendingTableDataDispatchContext } from "../context/PendingInstitutionTableContext";
import { PendingRecordsDispatchContext } from '../context/PendingRecordsContext';
import { decline, approve } from "../service/authService";
import { deletePendingRecord } from '../service/studentService';
import { addInstitutionWalletAddress } from '../service/contractService';

// import {walletConnection,connectAndAccessWallet} from "../blockchainUtil/BlockchainConnection"
// import { contractAddress,ABI } from '../blockchainUtil/ContractDetials';
//const ethers = require("ethers")

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertAction({action,message,data}) {
    const [open, setOpen] = React.useState(false);
    const pendingTableDataDispatch = React.useContext(PendingTableDataDispatchContext)
    const pendingRecordsDispatch = React.useContext(PendingRecordsDispatchContext)

    const [fileType, setFileType] = React.useState(data.RecordType);
    const [description, setDescription] = React.useState(data.Description);

    const [notificationStatus, setNotificationStatus] = React.useState(null);
    const [messageNotification, setMessageNotification] = React.useState(null);
    const [openNotification, setOpenNotification] = React.useState(false);
    

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const approveAction = async () => {
        const response = await addInstitutionWalletAddress(data.WalletAddress);
    
        if (response.success) {
            await approve({ pendinginstitutionid: data.PendingInstitutionID });
            pendingTableDataDispatch({ type: "delete", payload: { id: data.PendingInstitutionID } });
        } else {
            console.log('Institution could not be added:', response.error);
        }
    }

    const declineAction =async()=>{
        await decline({pendinginstitutionid:data.PendingInstitutionID})
        pendingTableDataDispatch({type:"delete",payload:{id:data.PendingInstitutionID}})
    }

    const revokeAction =async()=>{
        await deletePendingRecord({id:data.PendingRecordID})
        pendingRecordsDispatch({type:"delete",payload:{id:data.PendingRecordID}})
    }

    const updateAction =async()=>{
        try {
            await updatePendingRecord({
                PendingRecordID: data.PendingRecordID,
                Description: description,
                RecordType: fileType,
            })
            pendingRecordsDispatch({type:"update",payload:{id:data.PendingRecordID,Status:"Pending School"}}) 
            setMessageNotification('Record Request Update Successful')
            setOpenNotification(true)
            setNotificationStatus(true)
        } catch (error) {
            setMessageNotification('Record Request Update Failed')
            setOpenNotification(true)
            setNotificationStatus(false)
        }
       
    }

    return (
        <div>
        {
        action === "approve" &&
        <Button variant="contained" style={{
                marginTop: 10,
                borderRadius: 30,
                backgroundColor: "#466B48",
                fontSize: "14px"}}
                onClick={()=>{
                    if(data.PendingInstitutionID !== ""){
                        handleClickOpen()
                    }
                }}>
            Approve
        </Button>
        }
        {
        action === "decline" &&
        <Button variant="contained" style={{
                marginTop: 10,   
                borderRadius: 30,
                backgroundColor: "#ff0000",
                fontSize: "14px"}}
                onClick={()=>{
                    if(data.PendingInstitutionID !== ""){
                        handleClickOpen()
                    }
                }}>
            Decline
        </Button>
        }
        {
        action === "revoke record request" &&
        <Button variant="contained" style={{
            borderRadius: 30,
            backgroundColor: "#ff0000",
            fontSize: "14px"}}
            onClick={()=>{
                if(data.PendingRecordID !== ""){
                    handleClickOpen()
                }
            }}>
            Delete
        </Button>
        }
        { action === "student update pending record" &&
            <Button variant="contained" style={{
                borderRadius: 30,
                fontSize: "14px"}}
                onClick={()=>{
                    if(data.PendingRecordID !== ""){
                        handleClickOpen()
                    }
                }}>
                Resend
            </Button>
        }
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth = {data.maxWidth}
            fullWidth = {data.fullWidth}
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            { (action === "approve" || action === "decline" || action === "revoke record request") &&
            <DialogTitle>{"Are you sure you want to perform this action?"}</DialogTitle>
            }
            <DialogContent>
                { (action === "approve" || action === "decline" || action === "revoke record request") &&
                    <DialogContentText id="alert-dialog-slide-description">
                        {message}
                    </DialogContentText>
                }
                { action === "student update pending record" &&
                <>
                    <Avatar sx={{ m: 1, bgcolor: "#466b48" }}>
                        <FileOpenIcon />
                    </Avatar>
                    <Typography sx={{m:1}} component="h1" variant="h5">
                        Update & Resend
                    </Typography>
                    <FormControl variant="outlined" fullWidth>
                    <InputLabel id="type-select-label" >File Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            id="file-type"
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            label="File Type"  // This is needed for the outlined variant to create the notch
                            fullWidth
                        >
                            <MenuItem value="Transcript">Transcript</MenuItem>
                            <MenuItem value="Certification">Certification</MenuItem>
                            <MenuItem value="Degree">Degree</MenuItem>
                        </Select>
                    </FormControl>

                     <TextField
                     margin="normal"
                     required
                     fullWidth
                     name="description"
                     label="Description"
                     id="description"
                     multiline
                     rows={8}
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     />
                </>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Go Back</Button>
                { action === "approve" &&
                <Button onClick={()=>{
                    approveAction()
                    handleClose()
                }}>Proceed</Button>
                }
                { action === "decline" &&
                <Button onClick={()=>{
                    declineAction()
                    handleClose()
                }}>Proceed</Button>
                }
                { action === "revoke record request" &&
                <Button onClick={()=>{
                    revokeAction()
                    handleClose()
                }}>Proceed</Button>
                }
                { action === "student update pending record" &&
                <Button onClick={()=>{
                    updateAction()
                    handleClose()
                }}>Update and send</Button>
                }
            </DialogActions>
        </Dialog>

        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpenNotification(false)} severity={notificationStatus ? "success" : "error"}>
                    {messageNotification}
                </Alert>
            </Snackbar>
        </Stack>
        </div>
    );
}
