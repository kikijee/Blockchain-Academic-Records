import {walletConnection,connectAndAccessWallet, createProvider} from "../blockchainUtil/BlockchainConnection"
import { contractAddress,ABI } from '../blockchainUtil/ContractDetials';
const ethers = require("ethers")

export async function addInstitutionWalletAddress(address){
    await walletConnection(); // connection to wallet
    const wallet = await connectAndAccessWallet(); // accessing wallet
    if (wallet != null && wallet.signer) {
        try {
            // creating contract object
            const contract = new ethers.Contract(contractAddress, ABI, wallet.signer);
            // utilizing contract object to call smart contract function
            const update = await contract.add_institution(address);

            const receipt = await update.wait(); // waiting for transaction to be posted
            
            //Added a catch for case status === 0 (failed transaction)
            if (receipt.status === 1) {
                console.log('Transaction confirmed:', receipt);
                return { success: true, receipt };
            } else {
                console.log('Transaction failed:', receipt);
                return { success: false, receipt };
            }
        } catch (error) { // Case is there is an error in contract object creation or invoking smart contract function
            console.error('Transaction rejected or failed:', error);
            return {
                success: false,
                receipt: null
            };
        }
    } else { // no wallet detected
        return {
            success: false,
            receipt: null
        };
    }
}

export async function addRecord(recordHash){
    await walletConnection(); // connection to wallet
    const wallet = await connectAndAccessWallet(); // accessing wallet
    if (wallet != null) {
        try {
            // creating contract object
            const contract = new ethers.Contract(contractAddress, ABI, wallet.signer);
            // utilizing contract object to call smart contract function
            const update = await contract.add_record(recordHash);
            const receipt = await update.wait(); // waiting for transaction to be posted
            
            if (receipt.status === 1) {
                console.log('Transaction confirmed:', receipt);
                return { success: true, receipt };
            } else {
                console.log('Transaction failed:', receipt);
                return { success: false, receipt };
            }
        } catch (error) { // Case is there is an error in contract object creation or invoking smart contract function
            console.error('Transaction rejected or failed:', error);
            return {
                success: false,
                receipt: null
            };
        }
    } else { // no wallet detected
        return {
            success: false,
            receipt: null
        };
    }
}

export async function validateRecord(recordHash){
    try{
        const provider = createProvider();    // creating provider without the need to connect wallet
        const contract = new ethers.Contract(contractAddress, ABI, provider);   // contract object creation
        const response = await contract.validate_record(recordHash);    // validating record hash
        return{
            success:true,
            valid:response[0],
            updated:response[1]
        }
    }catch(error){
        console.error('smart contract function rejected or failed:', error);
        return {
            success: false
        };
    }
}
