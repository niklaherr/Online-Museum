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

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection pool setup - exported so routes can use it
const pool = new Pool({
    user: process.env.DB_USER || "user",
    host: process.env.DB_HOST || "my-postgres",
    database: process.env.DB_NAME || "mydatabase",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
});

// Make the pool available to all route modules
app.locals.pool = pool;

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
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;