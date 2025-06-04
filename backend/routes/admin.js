const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { isSQLInjection } = require("../services/injectionService"); // <-- make sure this path is correct

const router = express.Router();

// Middleware to ensure user is an admin
function requireAdmin(req, res, next) {
    if (!req.user || req.user.isadmin !== true) {
        return res.status(403).json({ error: "Admin privileges required." });
    }
    next();
}

// Search users by username (Admin only, partial match)
router.get("/admin/search", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;
    const { q } = req.query;

    const query = "SELECT * FROM users WHERE username ILIKE $1 OR id::TEXT ILIKE $1 ORDER BY username ASC";
    if (isSQLInjection(query)) {
        return res.status(401).send("Access denied");
    }

    try {
        const result = await pool.query(query, [`%${q}%`]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error searching users" });
    }
});

// Set isadmin for a user (Admin only)
router.put("/admin/:id", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const { isadmin } = req.body;

    if (typeof isadmin !== "boolean") {
        return res.status(400).json({ error: "Invalid 'isadmin' value. Must be true or false." });
    }

    const query = 'UPDATE users SET "isadmin" = $1 WHERE id = $2 RETURNING id, username, "isadmin"';
    if (isSQLInjection(query)) {
        return res.status(401).send("Access denied");
    }

    try {
        const result = await pool.query(query, [isadmin, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating admin status" });
    }
});

// Get all admins (Admin only)
router.get("/admin", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;

    const query = 'SELECT * FROM users WHERE "isadmin" = true ORDER BY username ASC';
    if (isSQLInjection(query)) {
        return res.status(401).send("Access denied");
    }

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching admins" });
    }
});

module.exports = router;
