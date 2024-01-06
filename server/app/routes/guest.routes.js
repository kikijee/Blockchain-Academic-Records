const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

// Route to fetch record for guest 
router.post('/fetch-record', guestController.fetchRecordForGuest);
// Route to construct record hash
router.post('/construct-record-hash',guestController.constructRecordHash);
// Route to return transaction address of a given ipfs hash
router.post('/get-transaction-address',guestController.getRecordTransactionAddress)

module.exports = router;