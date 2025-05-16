// routes/itemLists.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { createActivity } = require("../services/activityService");

const router = express.Router();

// Fetch all item lists
router.get("/item-lists", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query("SELECT * FROM item_list ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item lists");
    }
});

// Get one item list by ID
router.get("/item-lists/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query("SELECT * FROM item_list WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).send("Item list not found");
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item list");
    }
});

// Fetch the authenticated user's item lists
router.get("/me/item-lists", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query("SELECT * FROM item_list WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item list");
    }
});

// Get items by item_list_id
router.get("/item-lists/:item_list_id/items", authenticateJWT, async (req, res) => {
    const { item_list_id } = req.params;
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query(
            `SELECT item.id, item.title, item.category, item.entered_on, item.description, item.user_id, item.image, users.username
             FROM item
             JOIN item_itemlist ON item.id = item_itemlist.item_id
             JOIN users ON item.user_id = users.id
             WHERE item_itemlist.item_list_id = $1
             ORDER BY item.entered_on DESC`,
            [item_list_id]
        );

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
        res.status(500).send("Error fetching items");
    }
});

// Create a new item list and link items to it
router.post("/item-lists", authenticateJWT, async (req, res) => {
    const { title, description, item_ids } = req.body;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    if (!title || !item_ids || item_ids.length === 0) {
        return res.status(400).send("Title and at least one item ID are required.");
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');

        const result = await pool.query(
            "INSERT INTO item_list (title, description, user_id) VALUES ($1, $2, $3) RETURNING id",
            [title, description || "", userId]
        );

        const newItemListId = result.rows[0].id;

        for (const itemId of item_ids) {
            await pool.query("INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)", [newItemListId, itemId]);
        }

        await createActivity(pool, {
            category: "ITEM_LIST", 
            element_id: newItemListId, 
            type: "CREATE", 
            user_id: userId
        });

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(201).json({ id: newItemListId, title, description, user_id: userId, item_ids });
    } catch (err) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error("Error creating item list:", err);
        res.status(500).send("Error creating item list.");
    }
});

// Update an item list and its associations
router.put("/item-lists/:id", authenticateJWT, async (req, res) => {
    const itemListId = parseInt(req.params.id, 10);
    const { title, description, item_ids } = req.body;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    if (!title || !Array.isArray(item_ids) || item_ids.length === 0) {
        return res.status(400).send("Title and at least one item ID are required.");
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');

        const existingList = await pool.query(
            "SELECT * FROM item_list WHERE id = $1 AND user_id = $2",
            [itemListId, userId]
        );
        if (existingList.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send("Item list not found or not authorized.");
        }

        await pool.query("UPDATE item_list SET title = $1, description = $2 WHERE id = $3",
            [title, description || "", itemListId]);

        await pool.query("DELETE FROM item_itemlist WHERE item_list_id = $1", [itemListId]);

        for (const itemId of item_ids) {
            await pool.query("INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)", [itemListId, itemId]);
        }

        await createActivity(pool, {
            category: "ITEM_LIST", 
            element_id: itemListId, 
            type: "UPDATE", 
            user_id: userId
        });

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(200).json({ id: itemListId, title, description, user_id: userId, item_ids });
    } catch (err) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error("Error updating item list:", err);
        res.status(500).send("Error updating item list.");
    }
});

// Delete an item list
router.delete("/item-lists/:id", authenticateJWT, async (req, res) => {
    const itemListId = parseInt(req.params.id);
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Ensure the item list exists and belongs to the current user
        const itemListResult = await pool.query(
            "SELECT * FROM item_list WHERE id = $1 AND user_id = $2",
            [itemListId, userId]
        );

        if (itemListResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send("Item list not found or does not belong to you.");
        }

        // Delete the item list itself (cascading will handle associated items)
        await pool.query("DELETE FROM item_list WHERE id = $1", [itemListId]);

        await createActivity(pool, {
            category: "ITEM_LIST", 
            element_id: itemListId, 
            type: "DELETE", 
            user_id: userId
        });

        // Commit the transaction
        await pool.query('COMMIT');

        res.status(200).send("Item list deleted successfully.");
    } catch (err) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error("Error deleting item list:", err);
        res.status(500).send("Error deleting item list.");
    }
});

module.exports = router;