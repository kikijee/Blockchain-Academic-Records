import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ThemeProvider, createTheme} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import RequestRecordForm from '../components/requestRecordForm';
import StudentRecordRequestTable from '../components/studentRecordRequestTable';
import { PendingRecordProvider } from '../context/PendingRecordsContext';


const StudentRecordRequest =()=>{
    const [value, setValue] = React.useState('1');

    const defaultTheme = createTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline/>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider'}} mt={2}>
                        <TabList onChange={handleChange} centered>
                            <Tab label="Request Record" value="1" />
                            <Tab label="Pending Records" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1"><RequestRecordForm/></TabPanel>
                    <TabPanel value="2"><PendingRecordProvider><StudentRecordRequestTable/></PendingRecordProvider></TabPanel>
                </TabContext>
            </Box>
        </ThemeProvider>
    )
}

export default StudentRecordRequest