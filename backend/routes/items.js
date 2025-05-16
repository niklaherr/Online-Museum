// routes/items.js
const express = require("express");
const multer = require("multer");
const { authenticateJWT } = require("../middleware/auth");
const { createActivity } = require("../services/activityService");

const router = express.Router();
const upload = multer(); // Files will be stored as Buffer in memory

// Get all items for landing-page (no auth required)
router.get("/items/no-auth", async (req, res) => {
    const pool = req.app.locals.pool;
    
    try {
        const query = `
            SELECT item.*, users.username 
            FROM item
            JOIN users ON item.user_id = users.id
            ORDER BY item.entered_on DESC
            LIMIT 5;
        `;
        const result = await pool.query(query);

        const items = result.rows.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            username: item.username
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// Get all items (requires auth)
router.get("/items", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;
    
    try {
        const query = `
            SELECT item.*, users.username 
            FROM item 
            JOIN users ON item.user_id = users.id
        `;
        const result = await pool.query(query);

        const items = result.rows.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            username: item.username
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// Get a specific item by ID
router.get("/items/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    try {
        const query = `
            SELECT item.*, users.username 
            FROM item 
            JOIN users ON item.user_id = users.id
            WHERE item.id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Item not found");

        const item = result.rows[0];
        res.json({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            description: item.description,
            category: item.category,
            username: item.username,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item or user data");
    }
});

// Create a new item with image upload
router.post("/items", authenticateJWT, upload.single("image"), async (req, res) => {
    const { title, description, category } = req.body;
    const image = req.file ? req.file.buffer : null;
    const pool = req.app.locals.pool;

    if (!title) return res.status(400).send("Missing required fields: title");

    try {
        const result = await pool.query(
            `INSERT INTO item (user_id, title, image, description, category)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, title, image, description || null, category || null]
        );
        
        const newItem = result.rows[0];
        const id = newItem.id;

        await createActivity(pool, {
            category: "ITEM", 
            element_id: id, 
            type: "CREATE", 
            user_id: req.user.id
        });
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating item");
    }
});

// Update an existing item, optionally replacing its image
router.put("/items/:id", authenticateJWT, upload.single("image"), async (req, res) => {
    const { title, description, category } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.buffer : null;
    const pool = req.app.locals.pool;

    if (!title) return res.status(400).send("Missing required field: title");

    try {
        const fields = ["title", "description", "category"];
        const values = [title, description || null, category || null];
        let query = `UPDATE item SET title = $1, description = $2, category = $3`;
        let paramIndex = 4;

        if (image) {
            query += `, image = $${paramIndex}`;
            values.push(image);
            paramIndex++;
        }

        query += ` WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;
        values.push(id, req.user.id);

        const result = await pool.query(query, values);

        if (result.rows.length === 0) return res.status(404).send("Item not found or not authorized");

        await createActivity(pool, {
            category: "ITEM", 
            element_id: id, 
            type: "UPDATE", 
            user_id: req.user.id
        });

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).send("Error updating item");
    }
});

// Delete an item
router.delete("/items/:id", authenticateJWT, async (req, res) => {
    const itemID = parseInt(req.params.id);
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    try {
        // Ensure the item exists and belongs to the current user
        const itemResult = await pool.query(
            "SELECT * FROM item WHERE id = $1 AND user_id = $2",
            [itemID, userId]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).send("Item not found or does not belong to you.");
        }

        // Delete the item (cascading will handle associations)
        await pool.query("DELETE FROM item WHERE id = $1", [itemID]);

        await createActivity(pool, {
            category: "ITEM", 
            element_id: itemID, 
            type: "DELETE", 
            user_id: userId
        });

        res.status(200).send("Item deleted successfully.");
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Error deleting item.");
    }
});

// Fetch current user's items
router.get("/me/items", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query("SELECT * FROM item WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// Search for items across all users
router.get("/items-search", authenticateJWT, async (req, res) => {
    const query = req.query.q;
    const pool = req.app.locals.pool;
    
    if (!query) {
        return res.status(400).json({ error: "Suchbegriff erforderlich." });
    }
    
    try {
        const sqlQuery = `
        SELECT 
            i.*, 
            u.username
        FROM item i
        JOIN users u ON i.user_id = u.id
        WHERE 
            i.title ILIKE $1 OR 
            i.description ILIKE $1 OR 
            i.category ILIKE $1 OR
            u.username ILIKE $1 OR
            i.id::TEXT ILIKE $1
        ORDER BY i.entered_on DESC
        `;
        
        const searchPattern = `%${query}%`;
        const result = await pool.query(sqlQuery, [searchPattern]);
        
        const items = result.rows.map(item => ({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            description: item.description,
            category: item.category,
            username: item.username,
        }));
        
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler bei der Suche nach Items." });
    }
});

module.exports = router;