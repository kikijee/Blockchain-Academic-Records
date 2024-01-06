const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken, requireRole } = require('../middleware/jwt-helpers');

router.post('/login', authController.login);
router.post('/signup-student', authController.register);
router.post('/signup-institution', authController.createPendingInstitution);

router.get('/verify', authenticateToken, (req, res) => {
    res.status(200).send({ Role: req.User.Role });
});

router.delete('/logout',(req,res)=>{   // this function is to delete the token in client side cookie
    try {
        res.clearCookie('token');
        return res.status(200).json({message:"logged out"})
    } catch (error) {
        res.status(401).json({error:error.message});
    }
});

module.exports = router;
