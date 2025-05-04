const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3001;
const JWT_SECRET = "your_secret_key"; // Replace with a secure value in production!

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    user: "user",
    host: process.env.DATABASE_HOST || "localhost",
    database: "mydatabase",
    password: "password",
    port: 5432,
});

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "Access denied, no token provided." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

// ========== ROUTES ========== //

// Register new user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
            [username, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Get all users (secured)
app.get("/users", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY username DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});


app.get("/items", authenticateJWT, async (req, res) => {
    try {
        let query = "SELECT * FROM item ORDER BY entered_on DESC"; // Default query for all items
        let queryParams = [];

        // Check if user_id is provided in the request
        if (req.query.user_id) {
            query = "SELECT * FROM item WHERE user_id = $1 ORDER BY entered_on DESC";
            queryParams = [req.query.user_id]; // Use user_id from query
        }

        // Execute query
        const result = await pool.query(query, queryParams);

        // Map each item and convert the image to a base64 string if it exists
        const items = result.rows.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image
        }));

        // Send the items (including base64 images) to the frontend
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});


// Add a new item
app.post("/items", authenticateJWT, async (req, res) => {
    const { title, entered_on, image, description, category } = req.body;

    if (!title || !entered_on) {
        return res.status(400).send("Missing required fields: title, entered_on");
    }

    try {
        const result = await pool.query(
            `INSERT INTO item (user_id, title, entered_on, image, description, category)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [req.user.id, title, entered_on, image || null, description || null, category || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating item");
    }
});

// Get all item lists
app.get("/item-lists", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM item_list ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item lists");
    }
});

// Get a single item list by ID
app.get("/item-lists/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM item_list WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Item list not found");
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item list");
    }
});

// Get items by item_list_id
app.get("/item-lists/:item_list_id/items", authenticateJWT, async (req, res) => {
    const { item_list_id } = req.params; // Extract the item_list_id from the URL

    try {
        // Query to get the items related to a specific item_list_id
        const result = await pool.query(
            `SELECT item.id, item.title, item.category, item.entered_on, item.description, item.user_id, item.image
             FROM item
             JOIN item_itemlist ON item.id = item_itemlist.item_id
             WHERE item_itemlist.item_list_id = $1
             ORDER BY item.entered_on DESC`,
            [item_list_id] // Pass the item_list_id as a parameter
        );

        // Map each item and convert the image to a base64 string if it exists
        const items = result.rows.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '' // Convert image to base64 here
        }));

        // Send the items (including base64 images) to the frontend
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items for the specified item list");
    }
});

app.post("/item-lists", authenticateJWT, async (req, res) => {
    const { title, description, item_ids } = req.body;

    try {
        // Get the user_id from the JWT token (req.user is set by authenticateJWT middleware)
        const userId = req.user.id;

        // Check if title and item_ids are provided
        if (!title || !item_ids || item_ids.length === 0) {
            return res.status(400).send("Title and at least one item ID are required.");
        }

        // Insert the new item list into the database
        const result = await pool.query(
            "INSERT INTO item_list (title, description, user_id) VALUES ($1, $2, $3) RETURNING id",
            [title, description || "", userId] // Use userId from JWT
        );

        const newItemListId = result.rows[0].id;

        // Now insert the selected items into the item_itemlist table to associate them with the new item list
        for (const itemId of item_ids) {
            await pool.query(
                "INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)",
                [newItemListId, itemId]
            );
        }

        // Send the created item list response
        res.status(201).json({
            id: newItemListId,
            title,
            description,
            user_id: userId,
            item_ids,
        });
    } catch (err) {
        console.error("Error creating item list:", err);
        res.status(500).send("Error creating item list.");
    }
});

  


// Start server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
});
