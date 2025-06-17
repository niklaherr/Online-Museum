// routes/items.js
const express = require("express");
const multer = require("multer");
const { authenticateJWT } = require("../middleware/auth");
const { createActivity } = require("../services/activityService");
const { isSQLInjection } = require("../services/injectionService");

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
            WHERE item.isprivate = false
            ORDER BY item.entered_on DESC
            LIMIT 5;
        `;
        if (isSQLInjection(query)) return res.status(401).send("Zugriff verweigert");
        const result = await pool.query(query);

        const items = result.rows.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            username: item.username,
            isprivate: item.isprivate
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Abrufen der Items");
    }
});

// get items filtered
router.get("/items", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const {
        title,
        description,
        category,
        isprivate,
        username,
        id,
        user_id,
        entered_on,
        exclude_user_id
    } = req.query;

    try {
        const conditions = [];
        const values = [];

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`i.title ILIKE $${values.length}`);
        }

        if (description) {
            values.push(`%${description}%`);
            conditions.push(`i.description ILIKE $${values.length}`);
        }

        if (category) {
            values.push(`%${category}%`);
            conditions.push(`i.category ILIKE $${values.length}`);
        }

        if (isprivate !== undefined) {
            values.push(isprivate === "true");
            conditions.push(`i.isprivate = $${values.length}`);
        }

        if (username) {
            values.push(`%${username}%`);
            conditions.push(`u.username ILIKE $${values.length}`);
        }

        if (id) {
            values.push(id);
            conditions.push(`i.id = $${values.length}`);
        }

        if (user_id) {
            values.push(user_id);
            conditions.push(`i.user_id = $${values.length}`);
        }

        if (entered_on) {
            values.push(entered_on);
            conditions.push(`DATE(i.entered_on) = DATE($${values.length})`);
        }

        if (exclude_user_id) {
            values.push(exclude_user_id);
            conditions.push(`i.user_id != $${values.length}`);
        }

        values.push(userId);
        conditions.push(`(i.isPrivate = false OR i.user_id = $${values.length})`);

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const sqlQuery = `
            SELECT i.*, u.username
            FROM item i
            JOIN users u ON i.user_id = u.id
            ${whereClause}
            ORDER BY i.entered_on DESC;
        `;

        if (isSQLInjection(sqlQuery)) return res.status(401).send("Zugriff verweigert");

        const result = await pool.query(sqlQuery, values);

        const items = result.rows.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString("base64")}` : '',
            username: item.username,
            isprivate: item.isprivate
        }));

        res.json(items);
    } catch (err) {
        console.error("Error filtering items:", err);
        res.status(500).send("Fehler beim Filtern der Items");
    }
});

// Get a specific item by ID
router.get("/items/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const pool = req.app.locals.pool;
    const userId = req.user.id;
    
    try {
        const query = `
            SELECT item.*, users.username 
            FROM item 
            JOIN users ON item.user_id = users.id
            WHERE item.id = $1
            AND (item.isPrivate = false OR item.user_id = $2)
        `;
        if (isSQLInjection(query)) return res.status(401).send("Zugriff verweigert");
        const result = await pool.query(query, [id, userId]);

        if (result.rows.length === 0) return res.status(404).send("Item nicht gefunden");

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
            isprivate: item.isprivate
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Fehler beim Abrufen des Items oder der Benutzerdaten");
    }
});

// Create a new item with image upload
router.post("/items", authenticateJWT, upload.single("image"), async (req, res) => {
    const { title, description, category, isprivate } = req.body;
    const image = req.file ? req.file.buffer : null;
    const pool = req.app.locals.pool;

    if (!title) return res.status(400).send("Fehlende erforderliche Felder: Titel");

    try {

        const query = `INSERT INTO item (user_id, title, image, description, category, isprivate)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`;
        if (isSQLInjection(query)) return res.status(401).send("Zugriff verweigert");
        const result = await pool.query(
            query,
            [req.user.id, title, image, description || null, category || null, isprivate]
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
        res.status(500).send("Fehler beim Erstellen des Items");
    }
});

// Update an existing item, optionally replacing its image
router.put("/items/:id", authenticateJWT, upload.single("image"), async (req, res) => {
    const { title, description, category, isprivate } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.buffer : null;
    const pool = req.app.locals.pool;

    if (!title) return res.status(400).send("Fehlendes erforderliches Feld: Titel");

    try {
        const fields = ["title", "description", "category"];
        const values = [title, description || null, category || null, isprivate === 'true'];
        let query = `UPDATE item SET title = $1, description = $2, category = $3, isprivate = $4`;
        let paramIndex = 5;

        if (image) {
            query += `, image = $${paramIndex}`;
            values.push(image);
            paramIndex++;
        }

        query += ` WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;
        values.push(id, req.user.id);

        if (isSQLInjection(query)) return res.status(401).send("Zugriff verweigert");

        const result = await pool.query(query, values);

        if (result.rows.length === 0)
            return res.status(404).send("Item nicht gefunden oder nicht autorisiert");

        // Remove from editorial list if now private
        if (isprivate === 'true' || isprivate === true) {
            await pool.query(`DELETE FROM item_editorial WHERE item_id = $1`, [id]);
        }

        await createActivity(pool, {
            category: "ITEM",
            element_id: id,
            type: "UPDATE",
            user_id: req.user.id
        });

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).send("Fehler beim Aktualisieren des Items");
    }
});

// Delete an item
router.delete("/items/:id", authenticateJWT, async (req, res) => {
    const itemID = parseInt(req.params.id);
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    try {
        // Ensure the item exists and belongs to the current user
        const query = "SELECT * FROM item WHERE id = $1 AND user_id = $2"
        if (isSQLInjection(query)) return res.status(401).send("Zugriff verweigert");
        const itemResult = await pool.query(
            query,
            [itemID, userId]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).send("Item nicht gefunden oder gehört nicht Ihnen.");
        }

        const deleteQuery = "DELETE FROM item WHERE id = $1"
        if (isSQLInjection(deleteQuery)) return res.status(401).send("Zugriff verweigert");
        // Delete the item (cascading will handle associations)
        await pool.query(deleteQuery, [itemID]);

        await createActivity(pool, {
            category: "ITEM", 
            element_id: itemID, 
            type: "DELETE", 
            user_id: userId
        });

        res.status(200).send("Item erfolgreich gelöscht.");
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Fehler beim Löschen des Items.");
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
            (i.title ILIKE $1 OR 
            i.description ILIKE $1 OR 
            i.category ILIKE $1 OR
            u.username ILIKE $1 OR
            i.id::TEXT ILIKE $1) AND i.isprivate = false
        ORDER BY i.entered_on DESC
        `;

        if (isSQLInjection(sqlQuery)) return res.status(401).send("Zugriff verweigert");
        
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