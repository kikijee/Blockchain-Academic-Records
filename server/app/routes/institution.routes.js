const express = require('express');
const router = express.Router();
const institutionController = require('../controllers/institution.controller')
const pendingRecordController = require('../controllers/pendingRecord.controller')
const recordController = require('../controllers/record.controller')
const fileController = require('../controllers/file.controller');

const multer = require('multer');
const path = require('path');
const { findRecordsByStudentID } = require('../controllers/record.controller');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save with the timestamp as the name
    }
});

const upload = multer({ storage: storage }).single('file');

// Returns all institutions
router.get('/get-institutions', institutionController.findAllInstitutions); 

// Returns all pending records by an institutions user ID

 router.get('/pending-records', pendingRecordController.findPendingRecordsByInstitutionID); 
 
 // Return pending record by student user ID
 router.post('/return-record', pendingRecordController.updatePendingRecord);

// Returns all completed records by inst ID
router.get('/records', recordController.findRecordsByInstitutionID); 


// Upload record to complete a pending record request
router.post('/upload-record', (req, res, next) => {
  console.log('Processing file upload...');
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error('MulterError:', err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error('Unknown upload error:', err);
      return res.status(500).json({ error: err.message });
    }
    // Everything went fine.
    console.log('File upload successful:', req.file);
    next();
  });
}, fileController.completePendingRecord);

router.post('/finalize-record', fileController.finalizeRecord);
router.post('/rollback-record', fileController.rollbackRecord);

module.exports = router;
