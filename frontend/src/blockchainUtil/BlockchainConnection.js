import { providerURL } from "./ContractDetials";
const ethers = require("ethers")

 function walletConnection(){
    const connectWallet = async ()=>{
    if (window.ethereum) { //check if Metamask is installed
            try {
                const address = await window.ethereum.enable(); //connect Metamask
                const contractObject = {
                        connectedStatus: true,
                        status: "",
                        address: address
                    }
                    return contractObject;
                
            } catch (error) {
                return {
                    connectedStatus: false,
                    status: "Connect to Metamask using the button on the top right."
                }
            }
            
    } else {
            return {
                connectedStatus: false,
                status: "You must install Metamask into your browser: https://metamask.io/download.html"
            }
        } 
    };
    return connectWallet();
}

async function connectAndAccessWallet() {
    try {
        const walletInfo = await walletConnection();

        if (walletInfo.connectedStatus) {
            const { address } = walletInfo;
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner();
            //console.log('Connected Address:', address);

            return { provider, signer, address };
        } else {
            console.log(walletInfo.status);
            return null;
        }
    } catch (error) {
        console.log('Error connecting wallet:', error);
        return null;
    }
}

// will create provider object to use for non-transaction smart contract function calls
function createProvider(){
    return new ethers.JsonRpcProvider(providerURL);
}



export {walletConnection, connectAndAccessWallet, createProvider}
