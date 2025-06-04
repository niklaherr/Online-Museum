// routes/itemLists.js
const express = require("express");
const multer = require("multer");
const { authenticateJWT } = require("../middleware/auth");
const { createActivity } = require("../services/activityService");
const { isSQLInjection } = require("../services/injectionService");

const router = express.Router();
const upload = multer(); // Files will be stored as Buffer in memory
// Get one item list by ID

router.get("/item-lists/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    try {
        const query = "SELECT * FROM item_list WHERE id = $1 AND (isPrivate = false OR user_id = $2)";
        if (isSQLInjection(query)) return res.status(401).send("Access denied");

        const result = await pool.query(query, [id, userId]);
        if (result.rows.length === 0) return res.status(404).send("Item list not found");

        const itemList = result.rows[0];
        res.json({
            ...itemList,
            main_image: itemList.main_image ? `data:image/jpeg;base64,${itemList.main_image.toString('base64')}` : null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item list");
    }
});

// Get items by item_list_id with privacy check
router.get("/item-lists/:item_list_id/items", authenticateJWT, async (req, res) => {
    const { item_list_id } = req.params;
    const requestingUserId = req.user.id;
    const pool = req.app.locals.pool;

    try {
        const query = `
            SELECT 
              item.id, item.title, item.category, item.entered_on, item.description, 
              item.user_id, item.image, item.isprivate, users.username
            FROM item
            JOIN item_itemlist ON item.id = item_itemlist.item_id
            JOIN users ON item.user_id = users.id
            WHERE item_itemlist.item_list_id = $1
            AND (
              item.user_id = $2 OR
              item.isprivate = false
            )
            ORDER BY item.entered_on DESC
        `;
        if (isSQLInjection(query)) return res.status(401).send("Access denied");

        const result = await pool.query(query, [item_list_id, requestingUserId]);

        const items = result.rows.map(item => ({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            description: item.description,
            category: item.category,
            username: item.username,
            isprivate: item.isprivate,
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// Create a new item list
router.post("/item-lists", authenticateJWT, upload.single("main_image"), async (req, res) => {
    const { title, description, item_ids, is_private } = req.body;
    const main_image = req.file ? req.file.buffer : null;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    if (!title || !item_ids || item_ids.length === 0) {
        return res.status(400).send("Title and at least one item ID are required.");
    }

    let parsedItemIds;
    try {
        parsedItemIds = typeof item_ids === 'string' ? JSON.parse(item_ids) : item_ids;
    } catch (error) {
        return res.status(400).send("Invalid item_ids format.");
    }

    try {
        const insertQuery = "INSERT INTO item_list (title, description, user_id, isprivate, main_image) VALUES ($1, $2, $3, $4, $5) RETURNING id";
        if (isSQLInjection(insertQuery)) return res.status(401).send("Access denied");

        await pool.query('BEGIN');

        const result = await pool.query(insertQuery, [title, description || "", userId, is_private, main_image]);
        const newItemListId = result.rows[0].id;

        for (const itemId of parsedItemIds) {
            const itemQuery = "INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)";
            if (isSQLInjection(itemQuery)) return res.status(401).send("Access denied");

            await pool.query(itemQuery, [newItemListId, itemId]);
        }

        await createActivity(pool, {
            category: "ITEM_LIST",
            element_id: newItemListId,
            type: "CREATE",
            user_id: userId
        });

        await pool.query('COMMIT');
        res.status(201).json({ id: newItemListId, title, description, user_id: userId, item_ids: parsedItemIds });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error creating item list:", err);
        res.status(500).send("Error creating item list.");
    }
});

// Update item list
router.put("/item-lists/:id", authenticateJWT, upload.single("main_image"), async (req, res) => {
    const itemListId = parseInt(req.params.id, 10);
    const { title, description, item_ids, is_private } = req.body;
    const main_image = req.file ? req.file.buffer : null;
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    if (!title) return res.status(400).send("Title is required.");

    let parsedItemIds;
    try {
        parsedItemIds = typeof item_ids === 'string' ? JSON.parse(item_ids) : item_ids;
        if (!Array.isArray(parsedItemIds) || parsedItemIds.length === 0) {
            return res.status(400).send("At least one item ID is required.");
        }
    } catch (error) {
        return res.status(400).send("Invalid item_ids format.");
    }

    try {
        await pool.query('BEGIN');

        const checkQuery = "SELECT * FROM item_list WHERE id = $1 AND user_id = $2";
        if (isSQLInjection(checkQuery)) return res.status(401).send("Access denied");

        const existingList = await pool.query(checkQuery, [itemListId, userId]);
        if (existingList.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send("Item list not found or not authorized.");
        }

        let updateQuery = "UPDATE item_list SET title = $1, description = $2, isprivate = $3";
        let updateValues = [title, description || "", is_private];

        if (main_image) {
            updateQuery += ", main_image = $4 WHERE id = $5";
            updateValues.push(main_image, itemListId);
        } else {
            updateQuery += " WHERE id = $4";
            updateValues.push(itemListId);
        }

        if (isSQLInjection(updateQuery)) return res.status(401).send("Access denied");

        await pool.query(updateQuery, updateValues);

        const deleteQuery = "DELETE FROM item_itemlist WHERE item_list_id = $1";
        if (isSQLInjection(deleteQuery)) return res.status(401).send("Access denied");
        await pool.query(deleteQuery, [itemListId]);

        const insertItemQuery = "INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)";
        if (isSQLInjection(insertItemQuery)) return res.status(401).send("Access denied");
        for (const itemId of parsedItemIds) {
            await pool.query(insertItemQuery, [itemListId, itemId]);
        }

        await createActivity(pool, {
            category: "ITEM_LIST",
            element_id: itemListId,
            type: "UPDATE",
            user_id: userId
        });

        await pool.query('COMMIT');

        res.status(200).json({ id: itemListId, title, description, user_id: userId, item_ids: parsedItemIds });
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error updating item list:", err);
        res.status(500).send("Error updating item list.");
    }
});

// Delete item list
router.delete("/item-lists/:id", authenticateJWT, async (req, res) => {
    const itemListId = parseInt(req.params.id);
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    try {
        await pool.query('BEGIN');

        const checkQuery = "SELECT * FROM item_list WHERE id = $1 AND user_id = $2";
        if (isSQLInjection(checkQuery)) return res.status(401).send("Access denied");
        const itemListResult = await pool.query(checkQuery, [itemListId, userId]);

        if (itemListResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).send("Item list not found or does not belong to you.");
        }

        const deleteQuery = "DELETE FROM item_list WHERE id = $1";
        if (isSQLInjection(deleteQuery)) return res.status(401).send("Access denied");
        await pool.query(deleteQuery, [itemListId]);

        await createActivity(pool, {
            category: "ITEM_LIST",
            element_id: itemListId,
            type: "DELETE",
            user_id: userId
        });

        await pool.query('COMMIT');
        res.status(200).send("Item list deleted successfully.");
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error("Error deleting item list:", err);
        res.status(500).send("Error deleting item list.");
    }
});

// List all item lists (with optional filters)
router.get("/item-lists", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;
    const userId = req.user.id;

    const {
        title,
        description,
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
            conditions.push(`il.title ILIKE $${values.length}`);
        }
        if (description) {
            values.push(`%${description}%`);
            conditions.push(`il.description ILIKE $${values.length}`);
        }
        if (username) {
            values.push(`%${username}%`);
            conditions.push(`u.username ILIKE $${values.length}`);
        }
        if (id) {
            values.push(id);
            conditions.push(`il.id = $${values.length}`);
        }
        if (user_id) {
            values.push(user_id);
            conditions.push(`il.user_id = $${values.length}`);
        }
        if (entered_on) {
            values.push(entered_on);
            conditions.push(`DATE(il.entered_on) = DATE($${values.length})`);
        }
        if (exclude_user_id) {
            values.push(exclude_user_id);
            conditions.push(`il.user_id != $${values.length}`);
        }

        values.push(userId);
        conditions.push(`(il.isprivate = false OR il.user_id = $${values.length})`);

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const query = `
            SELECT il.*, u.username
            FROM item_list il
            JOIN users u ON il.user_id = u.id
            ${whereClause}
            ORDER BY il.entered_on DESC;
        `;
        if (isSQLInjection(query)) return res.status(401).send("Access denied");

        const result = await pool.query(query, values);

        const itemLists = result.rows.map(list => ({
            id: list.id,
            title: list.title,
            description: list.description,
            entered_on: list.entered_on,
            user_id: list.user_id,
            username: list.username,
            isprivate: list.isprivate,
            main_image: list.main_image ? `data:image/jpeg;base64,${list.main_image.toString('base64')}` : null
        }));

        res.json(itemLists);
    } catch (err) {
        console.error("Error filtering item lists:", err);
        res.status(500).send("Error filtering item lists");
    }
});

module.exports = router;
