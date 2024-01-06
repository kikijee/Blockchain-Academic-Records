const db = require("../models");
const Record = db.records;
const Users = db.users;
const ipfsAPI = require('ipfs-api');
const{convertRecordToHash} = require("../blockchainUtil/recordConverter")
const config = require("../config/server.config")

// Connect to the IPFS node
const ipfs = ipfsAPI(config.IPFS_LOCATION, config.IPFS_PORT, { protocol: 'http' });    // HERE

exports.fetchRecordForGuest = async (req, res) => {
    const { IPFS_Hash, FirstName, LastName, DateOfBirth } = req.body;
    console.log("Received request with:", { IPFS_Hash, FirstName, LastName, DateOfBirth });

    try {
        const record = await Record.findOne({ where: { IPFS_Hash: IPFS_Hash } });
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        const user = await Users.findByPk(record.UserID);
        if (!user || user.FirstName !== FirstName || user.LastName !== LastName || user.DateOfBirth !== DateOfBirth) {
            return res.status(400).json({ error: 'Invalid student data' });
        }

        res.contentType('application/pdf');

        const stream = ipfs.catReadableStream(IPFS_Hash);
        stream.on('error', err => {
            console.error("Error streaming file from IPFS: ", err);
            res.status(500).json({ error: 'Error fetching file from IPFS' });
        });

        stream.pipe(res);
    } catch (error) {
        console.error("Error processing request: ", error);
        res.status(500).json({ error: 'Error processing request' });
    }
};

exports.getRecordTransactionAddress =async(req,res)=>{
    const{IPFS_Hash} = req.body;
    try {
        const record = await Record.findOne({ where: { IPFS_Hash: IPFS_Hash },attributes:['TransactionAddress']});
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json({transactionAddress: record.TransactionAddress})
    } catch (error) {
        console.error("Error processing request: ", error);
        res.status(500).json({ error: 'Error processing request' });
    }
}

exports.constructRecordHash =(req,res)=>{
    try {
        const recordHash = convertRecordToHash(req.body);
        res.json({recordHash: recordHash, data: req.body});
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
