// routes/itemLists.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { createActivity } = require("../services/activityService");

const router = express.Router();
// Get all editorial lists
router.get("/editorial-lists", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;
    try {
        // Only admin users can fetch all editorial lists
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: "Sie haben keine Berechtigung, redaktionelle Listen einzusehen." });
        }
        
        const result = await pool.query("SELECT * FROM editorial ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Laden der Redaktionslisten." });
    }
});

// Get a specific editorial list by ID
router.get("/editorial-lists/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    try {
        const editorialResult = await pool.query("SELECT * FROM editorial WHERE id = $1", [id]);
        
        if (editorialResult.rows.length === 0) {
            return res.status(404).json({ error: "Redaktionsliste nicht gefunden." });
        }
        
        // Get items in this editorial list
        const itemsQuery = `
            SELECT i.*, u.username
            FROM item i
            JOIN item_editorial ie ON i.id = ie.item_id
            JOIN users u ON i.user_id = u.id
            WHERE ie.editorial_id = $1
            ORDER BY i.entered_on DESC
        `;
        const itemsResult = await pool.query(itemsQuery, [id]);
        
        const items = itemsResult.rows.map(item => ({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            description: item.description,
            category: item.category,
            username: item.username,
        }));
        
        const editorialList = {
            ...editorialResult.rows[0],
            items: items
        };
        
        res.json(editorialList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Laden der Redaktionsliste." });
    }
});

// Create a new editorial list
router.post("/editorial-lists", authenticateJWT, async (req, res) => {
    const { title, description, item_ids } = req.body;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    // Validate input
    if (!title || !Array.isArray(item_ids) || item_ids.length === 0) {
        return res.status(400).json({ error: "Titel und mindestens eine Item-ID sind erforderlich." });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Sie haben keine Berechtigung, redaktionelle Listen zu erstellen." });
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');
        
        // Create the editorial list
        const result = await pool.query(
            "INSERT INTO editorial (title, description) VALUES ($1, $2) RETURNING *",
            [title, description || ""]
        );

        const newEditorialId = result.rows[0].id;

        // Associate items with the editorial list
        for (const itemId of item_ids) {
            await pool.query(
                "INSERT INTO item_editorial (editorial_id, item_id) VALUES ($1, $2)",
                [newEditorialId, itemId]
            );
        }

        // Create activity record
        await createActivity(pool, {
            category: "EDITORIAL_LIST", 
            element_id: newEditorialId, 
            type: "CREATE", 
            user_id: userId
        });
        
        // Commit the transaction
        await pool.query('COMMIT');

        res.status(201).json({ 
            id: newEditorialId, 
            title, 
            description, 
            entered_on: result.rows[0].entered_on, 
            item_ids 
        });
    } catch (err) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error("Error creating editorial list:", err);
        res.status(500).json({ error: "Unbekannter Fehler beim Erstellen der Redaktionsliste." });
    }
});

// Update an existing editorial list
router.put("/editorial-lists/:id", authenticateJWT, async (req, res) => {
    const editorialId = parseInt(req.params.id, 10);
    const { title, description, item_ids } = req.body;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    // Validate input
    if (!title || !Array.isArray(item_ids) || item_ids.length === 0) {
        return res.status(400).json({ error: "Titel und mindestens eine Item-ID sind erforderlich." });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Sie haben keine Berechtigung, redaktionelle Listen zu bearbeiten." });
    }

    try {
        // Check if the editorial list exists
        const existingList = await pool.query(
            "SELECT * FROM editorial WHERE id = $1",
            [editorialId]
        );
        
        if (existingList.rowCount === 0) {
            return res.status(404).json({ error: "Redaktionsliste nicht gefunden." });
        }

        // Start a transaction
        await pool.query('BEGIN');
        
        // Update the editorial list
        const updateResult = await pool.query(
            "UPDATE editorial SET title = $1, description = $2 WHERE id = $3 RETURNING *",
            [title, description || "", editorialId]
        );

        // Remove all existing item associations
        await pool.query(
            "DELETE FROM item_editorial WHERE editorial_id = $1", 
            [editorialId]
        );

        // Create new item associations
        for (const itemId of item_ids) {
            await pool.query(
                "INSERT INTO item_editorial (editorial_id, item_id) VALUES ($1, $2)",
                [editorialId, itemId]
            );
        }

        // Create activity record
        await createActivity(pool, {
            category: "EDITORIAL_LIST", 
            element_id: editorialId, 
            type: "UPDATE", 
            user_id: userId
        });
        
        // Commit the transaction
        await pool.query('COMMIT');

        res.status(200).json({ 
            id: editorialId, 
            title, 
            description, 
            entered_on: updateResult.rows[0].entered_on,
            item_ids 
        });
    } catch (err) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error("Error updating editorial list:", err);
        res.status(500).json({ error: "Unbekannter Fehler beim Bearbeiten der Redaktionsliste." });
    }
});

// Delete an editorial list
router.delete("/editorial-lists/:id", authenticateJWT, async (req, res) => {
    const editorialId = parseInt(req.params.id);
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    // Check if user is admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Sie haben keine Berechtigung, redaktionelle Listen zu löschen." });
    }

    try {
        // Check if the editorial list exists
        const editorialResult = await pool.query(
            "SELECT * FROM editorial WHERE id = $1",
            [editorialId]
        );

        if (editorialResult.rows.length === 0) {
            return res.status(404).json({ error: "Redaktionsliste nicht gefunden." });
        }

        // Start a transaction
        await pool.query('BEGIN');
        
        // Delete the editorial list (and its associations via database CASCADE constraint)
        await pool.query("DELETE FROM editorial WHERE id = $1", [editorialId]);

        // Create activity record
        await createActivity(pool, {
            category: "EDITORIAL_LIST", 
            element_id: editorialId, 
            type: "DELETE", 
            user_id: userId
        });
        
        // Commit the transaction
        await pool.query('COMMIT');

        res.status(200).json({ message: "Redaktionsliste erfolgreich gelöscht." });
    } catch (err) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error("Error deleting editorial list:", err);
        res.status(500).json({ error: "Unbekannter Fehler beim Löschen der Redaktionsliste." });
    }
});

// Get items by item_list_id
router.get("/editorial-lists/:editorial_id/items", authenticateJWT, async (req, res) => {
    const { editorial_id } = req.params;
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query(
            `SELECT item.id, item.title, item.category, item.entered_on, item.description, item.user_id, item.image, users.username
             FROM item
             JOIN item_editorial ON item.id = item_editorial.item_id
             JOIN users ON item.user_id = users.id
             WHERE item_editorial.editorial_id = $1
             ORDER BY item.entered_on DESC`,
            [editorial_id]
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

module.exports = router;