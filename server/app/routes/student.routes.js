const express = require('express');
const router = express.Router();
const pendingRecordController = require('../controllers/pendingRecord.controller');
const institutionController = require('../controllers/institution.controller')
const recordController= require('../controllers/record.controller')

//=======TESTED=======

// Creates a pending record
router.post('/request-record', pendingRecordController.createPendingRecord);
// Returns all pending records based off a user ID
router.get('/pending-records', pendingRecordController.findPendingRecordsByStudentID);
// Deletes pending record by pending record ID
router.delete('/delete-pending-record/:id', pendingRecordController.deletePendingRecord);
// Returns all institutions
router.get('/get-institutions', institutionController.findAllInstitutions); 

//Get record by StudentID
router.get('/find-record-by-studentid', recordController.findRecordsByStudentID); 

// will resend a rejected pending record (update pending record values and revert its Status to 'Pending School')
router.put('/resend-pending-record', pendingRecordController.updatePendingRecordStudent);

//====================

module.exports = router;