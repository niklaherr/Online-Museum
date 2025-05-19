const express = require("express");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// Middleware to ensure user is an admin
function requireAdmin(req, res, next) {
    if (!req.user || req.user.isAdmin !== true) {
        return res.status(403).json({ error: "Admin privileges required." });
    }
    next();
}

// Search users by username (Admin only, partial match)
router.get("/admin/search", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;
    const { q } = req.query;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE username ILIKE $1 OR id::TEXT ILIKE $1 ORDER BY username ASC",
            [`%${q}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error searching users" });
    }
});

// Set isAdmin for a user (Admin only)
router.put("/admin/:id", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (typeof isAdmin !== "boolean") {
        return res.status(400).json({ error: "Invalid 'isAdmin' value. Must be true or false." });
    }

    try {
        const result = await pool.query(
            'UPDATE users SET "isAdmin" = $1 WHERE id = $2 RETURNING id, username, "isAdmin"',
            [isAdmin, id]
        );

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

    try {
        const result = await pool.query('SELECT * FROM users WHERE "isAdmin" = true ORDER BY username ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching admins" });
    }
});

module.exports = router;
