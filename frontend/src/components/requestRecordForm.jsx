import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider, Select, MenuItem, InputLabel, FormControl, Autocomplete, Snackbar, Alert} from '@mui/material';
import { getInstitutions, requestRecord } from '../service/studentService';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function RequestRecordForm() {
    const [fileType, setFileType] = React.useState('');
    const [institution, setInstitution] = React.useState(null);
    const [description, setDescription] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [notification, setNotification] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [severity, setSeverity] = React.useState('info');
    const [institutions,setInstitutions] = React.useState([]);

    React.useEffect(()=>{
        const init =async()=>{
            const data = await getInstitutions()
            if (data && Array.isArray(data) && data.length > 0) {
                const arr = data.map((row) => ({
                    label: row.SchoolName,
                    id: row.InstitutionID
                }));
                setInstitutions(arr)
            }
        }
        init()
    },[])

    const handleSubmit =async (event) => {
        event.preventDefault();
        setNotification(null);
        if(fileType === '' || description === '' || institution === null){
            setNotification("Please fill out the required fields.");
            setSeverity('error')
            setOpen(true);
        }
        else if(institution.label !== inputValue){
            setNotification("Please select a valid institution.");
            setSeverity('error')
            setOpen(true);
        }
        else{
            const response = await requestRecord({
                UserID: JSON.parse(sessionStorage.getItem('user')).ID,
                InstitutionID: institution.id,
                Description: description.replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g, " "),
                RecordType: fileType
            })
            if(response.status !== 201){
                setNotification(`Error: ${response.statusText}`);
                setSeverity('error')
                setOpen(true);
            }
            else{
                setNotification("Request sent");
                setSeverity('success')
                setOpen(true);
                setInstitution(null)
                setDescription('')
                setFileType('')
                setInputValue('')
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: "#466b48" }}>
                <FileOpenIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Request a Document
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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

                <Autocomplete
                    disablePortal
                    id="institution-combo-box"
                    options={institutions}
                    fullWidth
                    value={institution}
                    onChange={(event, newValue) => {
                        setInstitution(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    renderInput={(params) => <TextField margin='normal' required {...params} label="Institution" />}
                />

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
                
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Submit Request
                </Button>
                
            </Box>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity={severity}>
                    {notification}
                </Alert>
            </Snackbar>
        </Container>
        </ThemeProvider>
    );
}
