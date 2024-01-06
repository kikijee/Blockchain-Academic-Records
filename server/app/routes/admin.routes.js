const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const pendingInstitutionController = require('../controllers/pendingInstitution.controller.js')

// This route is a good example of how to require user JWT and Role verification to access a backend endpoint
router.post('/approve-institution', authController.createInstitution);
router.post('/decline-institution', authController.declineInstitution);

router.get('/get-pending-institutions', pendingInstitutionController.findAllPendingInstitutions); 

module.exports = router;
