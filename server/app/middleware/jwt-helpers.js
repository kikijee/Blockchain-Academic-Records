require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Null token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.error("JWT Verification Error:", error.message); 
            return res.status(403).json({ error: error.message });
        }

        req.User = user;
        next(); // move on from middleware
    });
}

const requireRole = (role) => {
    return (req, res, next) => {
      if(role !== req.User.Role){
        return res.status(403).json({ error: "Invalid Role Permissions" });
      }
      next();
    }
  }

module.exports = { authenticateToken,requireRole };
