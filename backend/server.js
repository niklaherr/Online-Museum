// server.js - Main application file
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");
const itemListRoutes = require("./routes/itemLists");
const editorialRoutes = require("./routes/editorials");
const activityRoutes = require("./routes/activities");
const contactFormRoutes = require("./routes/contact-form");
const adminRoutes = require("./routes/admin");

// Initialize express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());


const pool = new Pool({
    user: process.env.DB_USER || "",
    host: process.env.DB_HOST || "",
    database: process.env.DB_NAME || "",
    password: process.env.DB_PASSWORD || "",
    port: process.env.DB_PORT || 5432,
});

// Make the pool available to all route modules
app.locals.pool = pool;

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Teste nur die grundlegende Funktionalität, nicht die DB
        res.status(200).json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({ 
            status: 'ERROR', 
            error: error.message
        });
    }
});

// Separater DB Health Check
app.get('/health/db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ 
            status: 'DB OK', 
            db_time: result.rows[0].now
        });
    } catch (error) {
        console.error('DB Health check failed:', error);
        res.status(503).json({ 
            status: 'DB ERROR', 
            error: error.message
        });
    }
});

// Register routes
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", itemRoutes);
app.use("/", itemListRoutes);
app.use("/", editorialRoutes);
app.use("/", activityRoutes);
app.use("/", contactFormRoutes);
app.use("/", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Health check available at http://localhost:${port}/health`);
    console.log(`DB Health check available at http://localhost:${port}/health/db`);
});

module.exports = app;