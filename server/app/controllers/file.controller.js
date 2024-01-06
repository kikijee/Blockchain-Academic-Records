const fs = require('fs');
const db = require("../models");
const{convertRecordToHash} = require("../blockchainUtil/recordConverter")
const Record = db.records;
const PendingRecord = db.pendingRecords;
const User = db.users;
const config = require("../config/server.config")

const ipfsAPI = require('ipfs-api');
//const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});  // prod // HERE
const ipfs = ipfsAPI(config.IPFS_LOCATION, config.IPFS_PORT, {protocol: 'http'});    // local
const { exec } = require('child_process');

exports.completePendingRecord = async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file' });
  }

  try {
      const fileBuffer = await fs.promises.readFile(req.file.path);
      const result = await ipfs.add(fileBuffer, { pin: true });
      const cid = result[0].hash;

      const pendingRecordID = req.body.pendingRecordID;
      const pendingRecord = await PendingRecord.findByPk(pendingRecordID);
      if (!pendingRecord) {
          throw new Error("Pending record not found");
      }

      // Update IPFS hash in the pending record
      await pendingRecord.update({ IPFS_Hash: cid });

      // Get student info for hash conversion
      const student = await User.findByPk(pendingRecord.UserID, {attributes: ['FirstName', 'LastName', 'DateOfBirth']});
      student.dataValues.IPFSHash = cid;
      const recordHash = convertRecordToHash(student.dataValues);

      // Clean up: delete file from server
      await fs.promises.unlink(req.file.path);

      res.json({ success: true, cid: cid, recordHash: recordHash });
  } catch (error) {
      console.error('Error in completePendingRecord:', error);
      // Clean up: delete file if there's an error
      if (req.file && req.file.path) {
          await fs.promises.unlink(req.file.path).catch(e => console.error("Error deleting the file:", e));
      }
      res.status(500).json({ error: 'Error processing the file upload' });
  }
};

exports.finalizeRecord = async (req, res) => {
  const { RecordID, TransactionAddress } = req.body;
  const transaction = await db.sequelize.transaction();

  try {
      const pendingRecord = await PendingRecord.findByPk(RecordID, { transaction });
      if (!pendingRecord) {
          throw new Error("Pending record not found");
      }

      await Record.create({
          UserID: pendingRecord.UserID,
          InstitutionID: pendingRecord.InstitutionID,
          RecordType: pendingRecord.RecordType,
          IPFS_Hash: pendingRecord.IPFS_Hash, 
          TransactionAddress: TransactionAddress,
          Created_At: new Date(),
      }, { transaction });

      await pendingRecord.destroy({ transaction });

      await transaction.commit();
      res.json({ success: true });
  } catch (error) {
      await transaction.rollback();
      console.error('Error finalizing record:', error);
      res.status(500).json({ error: 'Error finalizing the record', details: error.message });
  }
};

exports.rollbackRecord = async (req, res) => {
    const { PendingRecordID } = req.body;

    console.log("Received pendingRecordID:", PendingRecordID);
  
    try {
        // Update the db
        const pendingRecord = await PendingRecord.findByPk(PendingRecordID);
        if (!pendingRecord) {
            throw new Error("Pending record not found");
        }

        const cid = pendingRecord.IPFS_Hash;
        if (!cid) {
            throw new Error("IPFS Hash not found in the pending record");
        }

        await pendingRecord.update({ IPFS_Hash: null });

        // run script to unpin and run garbage collection
        exec(`${config.IPFS_SCRIPT_ROLLBACK} ${cid}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error executing rollback script:', error);
                return res.status(500).json({ error: `Error rolling back the record: ${error.message}` });
            }
            if (stderr) {
                console.error('Error in script execution:', stderr);
                return res.status(500).json({ error: `Error in script execution: ${stderr}` });
            }
            console.log('Rollback script output:', stdout);
            res.json({ success: true, message: 'File unpinned, garbage collection run, and DB updated.' });
        });
    } catch (error) {
        console.error('Error rolling back record:', error);
        res.status(500).json({ error: `Error rolling back the record: ${error.message}` });
    }
};
