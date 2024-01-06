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

let serverInstance;

async function startServer() {
    try {
        await db.sequelize.sync({ force: true });
        console.log("Synced db.");

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
        const PORT = 5001;
        serverInstance = app.listen(PORT, () => {
            console.log(`Server has started on port ${PORT}`);
        });
    } catch (err) {
        console.log("Failed to sync db: " + err.message);
    }
}

function stopServer() {
    return new Promise((resolve, reject) => {
        if (serverInstance) {
            serverInstance.close((err) => {
                if (err) {
                    console.error('Error shutting down server:', err);
                    reject(err);
                } else {
                    console.log('Server has been closed');
                    resolve();
                }
            });
        } else {
            console.log('No server instance found');
            resolve(); // Resolve as there's no server instance to close
        }
    });
}

module.exports = { app, startServer , stopServer}; 

