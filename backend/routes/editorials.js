// routes/itemLists.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { createActivity } = require("../services/activityService");
const { isSQLInjection } = require("../services/injectionService");

const router = express.Router();

// Get all editorial lists
router.get("/editorial-lists", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;
    const query = "SELECT * FROM editorial ORDER BY id DESC";

    if (isSQLInjection(query)) {
        return res.status(401).send("Access denied");
    }

    try {
        const result = await pool.query(query);
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

    const editorialQuery = "SELECT * FROM editorial WHERE id = $1";
    const itemsQuery = `
        SELECT i.*, u.username
        FROM item i
        JOIN item_editorial ie ON i.id = ie.item_id
        JOIN users u ON i.user_id = u.id
        WHERE ie.editorial_id = $1
        ORDER BY i.entered_on DESC
    `;

    if (isSQLInjection(editorialQuery) || isSQLInjection(itemsQuery)) {
        return res.status(401).send("Access denied");
    }

    try {
        const editorialResult = await pool.query(editorialQuery, [id]);

        if (editorialResult.rows.length === 0) {
            return res.status(404).json({ error: "Redaktionsliste nicht gefunden." });
        }

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

    if (!title || !Array.isArray(item_ids) || item_ids.length === 0) {
        return res.status(400).json({ error: "Titel und mindestens eine Item-ID sind erforderlich." });
    }

    if (!req.user.isadmin) {
        return res.status(403).json({ error: "Sie haben keine Berechtigung, redaktionelle Listen zu erstellen." });
    }

    const insertEditorialQuery = "INSERT INTO editorial (title, description) VALUES ($1, $2) RETURNING *";
    const insertItemEditorialQuery = "INSERT INTO item_editorial (editorial_id, item_id) VALUES ($1, $2)";
    const begin = "BEGIN";
    const commit = "COMMIT";

    if (
        isSQLInjection(insertEditorialQuery) || 
        isSQLInjection(insertItemEditorialQuery) || 
        isSQLInjection(begin) || 
        isSQLInjection(commit)
    ) {
        return res.status(401).send("Access denied");
    }

    try {
        await pool.query(begin);

        const result = await pool.query(insertEditorialQuery, [title, description || ""]);
        const newEditorialId = result.rows[0].id;

        for (const itemId of item_ids) {
            await pool.query(insertItemEditorialQuery, [newEditorialId, itemId]);
        }

        await createActivity(pool, {
            category: "EDITORIAL_LIST", 
            element_id: newEditorialId, 
            type: "CREATE", 
            user_id: userId
        });

        await pool.query(commit);

        res.status(201).json({ 
            id: newEditorialId, 
            title, 
            description, 
            entered_on: result.rows[0].entered_on, 
            item_ids 
        });
    } catch (err) {
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

    if (!title || !Array.isArray(item_ids) || item_ids.length === 0) {
        return res.status(400).json({ error: "Titel und mindestens eine Item-ID sind erforderlich." });
    }

    if (!req.user.isadmin) {
        return res.status(403).json({ error: "Sie haben keine Berechtigung, redaktionelle Listen zu bearbeiten." });
    }

    const checkQuery = "SELECT * FROM editorial WHERE id = $1";
    const updateQuery = "UPDATE editorial SET title = $1, description = $2 WHERE id = $3 RETURNING *";
    const deleteItemsQuery = "DELETE FROM item_editorial WHERE editorial_id = $1";
    const insertItemQuery = "INSERT INTO item_editorial (editorial_id, item_id) VALUES ($1, $2)";
    const begin = "BEGIN";
    const commit = "COMMIT";

    if (
        isSQLInjection(checkQuery) || 
        isSQLInjection(updateQuery) || 
        isSQLInjection(deleteItemsQuery) || 
        isSQLInjection(insertItemQuery) || 
        isSQLInjection(begin) || 
        isSQLInjection(commit)
    ) {
        return res.status(401).send("Access denied");
    }

    try {
        const existingList = await pool.query(checkQuery, [editorialId]);

        if (existingList.rowCount === 0) {
            return res.status(404).json({ error: "Redaktionsliste nicht gefunden." });
        }

        await pool.query(begin);

        const updateResult = await pool.query(updateQuery, [title, description || "", editorialId]);
        await pool.query(deleteItemsQuery, [editorialId]);

        for (const itemId of item_ids) {
            await pool.query(insertItemQuery, [editorialId, itemId]);
        }

        await createActivity(pool, {
            category: "EDITORIAL_LIST", 
            element_id: editorialId, 
            type: "UPDATE", 
            user_id: userId
        });

        await pool.query(commit);

        res.status(200).json({ 
            id: editorialId, 
            title, 
            description, 
            entered_on: updateResult.rows[0].entered_on,
            item_ids 
        });
    } catch (err) {
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

    if (!req.user.isadmin) {
        return res.status(403).json({ error: "Sie haben keine Berechtigung, redaktionelle Listen zu löschen." });
    }

    const selectQuery = "SELECT * FROM editorial WHERE id = $1";
    const deleteQuery = "DELETE FROM editorial WHERE id = $1";
    const begin = "BEGIN";
    const commit = "COMMIT";

    if (
        isSQLInjection(selectQuery) || 
        isSQLInjection(deleteQuery) || 
        isSQLInjection(begin) || 
        isSQLInjection(commit)
    ) {
        return res.status(401).send("Access denied");
    }

    try {
        const editorialResult = await pool.query(selectQuery, [editorialId]);

        if (editorialResult.rows.length === 0) {
            return res.status(404).json({ error: "Redaktionsliste nicht gefunden." });
        }

        await pool.query(begin);
        await pool.query(deleteQuery, [editorialId]);

        await createActivity(pool, {
            category: "EDITORIAL_LIST", 
            element_id: editorialId, 
            type: "DELETE", 
            user_id: userId
        });

        await pool.query(commit);

        res.status(200).json({ message: "Redaktionsliste erfolgreich gelöscht." });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error deleting editorial list:", err);
        res.status(500).json({ error: "Unbekannter Fehler beim Löschen der Redaktionsliste." });
    }
});

router.get("/editorial-lists/:editorial_id/items", authenticateJWT, async (req, res) => {
    const { editorial_id } = req.params;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    const query = `
        SELECT item.id, item.title, item.category, item.entered_on, item.description, item.user_id, item.image, item.isprivate, users.username
        FROM item
        JOIN item_editorial ON item.id = item_editorial.item_id
        JOIN users ON item.user_id = users.id
        WHERE item_editorial.editorial_id = $1
        AND (item.user_id = $2 OR item.isprivate = false)
        ORDER BY item.entered_on DESC
    `;

    if (isSQLInjection(query)) {
        return res.status(401).send("Access denied");
    }

    try {
        const result = await pool.query(query, [editorial_id, userId]);

        const items = result.rows.map(item => ({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            description: item.description,
            category: item.category,
            username: item.username,
            isprivate: item.isprivate
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

module.exports = router;
