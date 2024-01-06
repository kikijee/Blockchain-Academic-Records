import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import InstitutionRecordRequestTable from '../components/institutionRecordRequestTable'; 
import AcceptedRequestTable from '../components/acceptedRequestTable'; 
import { walletConnection } from '../blockchainUtil/BlockchainConnection';

const InstitutionDashboard = () => {
  const [value, setValue] = useState('1');

  const defaultTheme = createTheme();

  useEffect(()=>{
    const init=async()=>{
      await walletConnection();
    }
    init();
  },[])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} mt={2}>
            <TabList onChange={handleChange} centered>
              <Tab label="Pending Records" value="1" />
              <Tab label="Accepted Records" value="2" />
            </TabList>
          </Box>
          
          <TabPanel value="1">
            <InstitutionRecordRequestTable />
          </TabPanel>
          <TabPanel value="2">
            <AcceptedRequestTable />
          </TabPanel>
        </TabContext>
      </Box>
    </ThemeProvider>
  );
};

export default InstitutionDashboard;