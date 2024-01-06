require('dotenv').config();
const { authenticateToken, requireRole } = require('./app/middleware/jwt-helpers.js');
const express = require('express');
const cors = require('cors');
const db = require('./app/models');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// Middleware
const corsOptions = { credentials: true, origin: true };
app.use(express.json());
app.use(cors(corsOptions));

// Database connection
//Use force sync instead of normal sync to build db tables from scratch

//db.sequelize.sync({ force: true })
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Routes
const AuthRoute = require('./app/routes/auth.routes');
const AdminRoute = require('./app/routes/admin.routes');
const InstitutionRoute = require('./app/routes/institution.routes');
const StudentRoute = require('./app/routes/student.routes');
const GuestRoute = require('./app/routes/guest.routes');

// JWT and role check middleware are here now
app.use('/auth', AuthRoute);
app.use('/admin', authenticateToken, requireRole("Admin"), AdminRoute);
app.use('/institution', authenticateToken, requireRole("Institution"), InstitutionRoute);
app.use('/student', authenticateToken, requireRole("Student"), StudentRoute);
app.use('/guest', GuestRoute);

// Error Handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    }
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

module.exports = {app, PORT}; 