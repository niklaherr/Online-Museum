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

// PostgreSQL connection pool setup mit SSL-Fix
const pool = new Pool({
    user: process.env.DB_USER || "user",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "mydatabase",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
    // SSL-Konfiguration für Railway
    ssl: process.env.NODE_ENV === 'production' ? false : false, // SSL deaktiviert
    // Alternative: SSL aktiviert aber ohne Zertifikatsprüfung
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Make the pool available to all route modules
app.locals.pool = pool;

// Health check endpoint mit verbessertem DB-Test
app.get('/health', async (req, res) => {
    try {
        // Teste Datenbank-Verbindung
        const result = await pool.query('SELECT NOW(), version()');
        
        res.status(200).json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: 'connected',
            db_time: result.rows[0].now,
            db_version: result.rows[0].version,
            db_config: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER
            }
        });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({ 
            status: 'ERROR', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: 'disconnected',
            error: error.message,
            db_config: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER
            }
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
    console.log(`DB Config: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

module.exports = app;