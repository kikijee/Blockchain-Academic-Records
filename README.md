# Blockchain-Education-Records

## Introduction
In today's digital age, the manner in which we store, retrieve, and authenticate records has experienced a radical transformation. The need for a secure, transparent, and decentralized system for managing student records has never been more evident. Our “Blockchain Education Records” aims at reimaging how these records are maintained and accessed. 

At its core, our project seeks to leverage the power of blockchain technology and the InterPlanetary File System (IPFS) to create a prototype for an educational records management system. This prototype aims to be secure, transparent, and tamper-proof. The use of Ethereum's testnet provides us with a realistic yet safe environment to deploy and test our solution, while IPFS, hosted on an AWS Ubuntu instance, ensures the data remains accessible and persistent.

## Setup

### Requirements:
- VM Capable of hosting backend (AWS t.2 micro)
    - PostgreSQL Database
    - IPFS local offline node
    - Node JS / Express Routes
        - All backend APIs
    - Apache Web Server
        - Containing React frontend Build folder
- Ethereum Wallet on Sepolia Testnet x2 (Metamask)
    - Owner wallet for creating the Smart Contract
    - Institution wallet for approving records
    - Both need test funds that can be obtained from any Sepolia faucet:
        - https://sepolia-faucet.pk910.de/ 
- React for Frontend
- Hardhat for local smart contract testing & deployment
    - You will need an API key with Infura & Etherscans for block explorer verification and pure functions

### Steps:
1. **Setup AWS Ec2 or VM of your choice for hosting the backend**:
    - Clone the repository to the server
    - Install Node, Express JS & npm
    - Navigate to /server folder and run npm install to setup all needed dependencies from the package.json

2. **Setup PostgreSQL DB**:
   Note: You will need to update config.database.js to match your db and login parameters
    - Install PostgreSQL DB
    - Create db "blockteam"
    - Make note of your credentials
    - We don't need to populate the tables, Sequelize ORM handles this

3. **Setup Apache Web Server**:
    - Install apache web server for hosting frontend
    - Create a build directory in apache to host the react frontend (Store here /var/html/www/ in ubuntu) 
    - **Important:** Depending on your VM of choice for hosting the backend, you may need to leverage apache web servers ability to setup a proxy and redirect incoming requests from your site to your backend assets (IPFS, Node JS, etc)

4. **Setup IPFS Node**:
    - Install IPFS local offline node in your backend: https://docs.ipfs.tech/install/command-line/#system-requirements
    - Run this in low power mode per the documentation above for testing

5. **Smart Contract Deployment**:
   Note: This step can be done locally to avoid extra stress on your backend VM
    - Clone the repository locally and navigate to /contracts
    - Install dependencies using `npm install`
    - Configure `hardhat.config.js` with your Ethereum testnet account credentials, including your Infura & Etherscan API keys
    - Deploy contract using `npx hardhat run scripts/deploy.js` and take note of the new contract address
    - Navigate to /frontend/src/blockchainUtil/ContractDetails.js
        - Update the contract address and infura api keys here

6. **React Frontend Setup**:
   Note: This step can be done locally to avoid extra stress on your backend VM
    - Navigate to the /frontend folder and install dependencies using `npm install`
    - Run the `npm run build` command to package & build the frontend
    - Whether you did this locally or on the VM, make sure to transfer the folder to the build folder you made in apache web server on your backend server
  
7. **Run The Backend Node JS Server**:
    - Navigate to the /server folder 
    - Run the `node server.js` command to start the node
    - When this completes you will see a prompt that the DB was successfully synced (You may need to uncomment force sync inside server.js file)
    - Important: Make sure you navigate back to the PostgreSQL db and create an admin account. (This will require a hash for the password)

8. **Testing**:
    - Once the build folder for the react frontend is in the correct place in Apache web server and you have node js running with DB setup and synced, then we can begin testing the frontend
    - Use the Signup options to create a new user and institution account (include institution wallet address from metamask)
        - The student account will be instantly created but you must approve the institution by logging in as the admin account
        - This will require metamask connection with the Owner wallet that created the smart contract previously deployed
    - Once all accounts are made and approved, login with the student account to request a record from the approved institution
    - Login with the institution to review and approve the record and upload a copy of the requested record
        - Again this process will require metamask connection but with the Institution wallet that was approved by the admin to interact with our smart contract functions
    - Once the record is approved you can review the accepted records tab of the institution dashboard or the student accounts dashboard to see the approved record
        - You can now view the blockchain transaction of this record upload or copy the link to review and verify the file
        - You can also navigate to the guest search page to manually lookup the record for review
