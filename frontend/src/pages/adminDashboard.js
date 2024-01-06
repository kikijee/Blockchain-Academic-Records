import React from 'react'; 
import PendingInstitutions from '../components/pendingInstitutions';
import { Box ,Grid ,createTheme, ThemeProvider, CssBaseline, Container} from '@mui/material';
import DataView from '../components/dataViewAdmin';
import { PendingDataProvider } from '../context/PendingInstitutionContext';
import { PendingTableDataProvider } from '../context/PendingInstitutionTableContext';

import {walletConnection,connectAndAccessWallet} from "../blockchainUtil/BlockchainConnection"
import { contractAddress,ABI } from '../blockchainUtil/ContractDetials';
const ethers = require("ethers")

const defaultTheme = createTheme();

const AdminDashboard = () =>{
    React.useEffect(()=>{
        const init=async()=>{
            await walletConnection()    // this will prompt user to connect metamask wallet if not already connected
            
            // TESTING WILL NOT USE 
            // used this to check whether or not the below wallet address has been added to the blockchain
            // good example of how to call a "Public View/Pure" function on the smart contract (a function that does not cost ETH to execute)
            const wallet = await connectAndAccessWallet()   // connects metamask wallet and returns provider, signer, and address
            if(wallet != null){
                // creating a contract object
                const contract = new ethers.Contract(contractAddress, ABI, wallet.provider)
                // calling smart contract function (will return true if passed wallet address is valid in the intitution_addresses state map)
                //console.log(await contract.checkWalletAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8"))
                //const valid = await contract.validate_record("0xaec43604b1bab24e459de4d0c8f7d83171a76c7e9a77520c58c9ec9454dd5ad0")
                //console.log(valid[1])
            }
        }
        init()
    },[]);
    return (
    <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="l">
            <CssBaseline />
            <PendingTableDataProvider>
            <PendingDataProvider>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={7} height='90vh'>
                            <PendingInstitutions/>
                        </Grid>
                        <Grid item xs={5}>
                            <DataView/>
                        </Grid>
                    </Grid>
                </Box>
            </PendingDataProvider>
            </PendingTableDataProvider>
        </Container>
    </ThemeProvider>
        
    );
}; 

export default AdminDashboard;