// server.js - Main application file
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const itemRoutes = require("./routes/items");
const itemListRoutes = require("./routes/itemLists");
const editorialRoutes = require("./routes/editorials");
const activityRoutes = require("./routes/activities");
const contactFormRoutes = require("./routes/contact-form");
const adminRoutes = require("./routes/admin");

// Import middleware
const { authenticateJWT } = require("./middleware/auth");

// Initialize express app
const app = express();
const port = process.env.PORT || 3001;

console.log('Starting server...');
console.log('Port:', port);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json());

// PostgreSQL connection pool setup
const pool = new Pool({
    user: process.env.DB_USER || "user",
    host: process.env.DB_HOST || "localhost", 
    database: process.env.DB_NAME || "mydatabase",
    password: process.env.DB_PASSWORD || "password",
    port: parseInt(process.env.DB_PORT) || 5432,
    // Railway spezifische Konfiguration
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Successfully connected to database');
        release();
    }
});

// Make the pool available to all route modules
app.locals.pool = pool;

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        port: port,
        env: process.env.NODE_ENV || 'development'
    });
});

// Test route für DB-Verbindung
app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
        res.json({
            message: 'Database connection successful',
            timestamp: result.rows[0].current_time,
            version: result.rows[0].postgres_version,
            tables: 'Using existing tables'
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            error: 'Database connection failed',
            details: error.message
        });
    }
});

// Register routes
app.use("/", authRoutes);
app.use("/users", userRoutes);
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
    console.log(`Server running on http://0.0.0.0:${port}`);
    console.log(`Health check available at: http://0.0.0.0:${port}/health`);
});

module.exports = app;