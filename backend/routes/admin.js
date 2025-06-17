const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { isSQLInjection } = require("../services/injectionService");

const router = express.Router();

// Middleware to ensure user is an admin
function requireAdmin(req, res, next) {
    if (!req.user || req.user.isadmin !== true) {
        return res.status(403).json({ error: "Administratorrechte erforderlich." });
    }
    next();
}

// Search users by username (Admin only, partial match)
router.get("/admin/search", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;
    const { q } = req.query;
    const currentUserId = req.user.id;

    const query = `
        SELECT * 
        FROM users 
        WHERE (username ILIKE $1 OR id::TEXT ILIKE $1) 
        AND id != $2 
        ORDER BY username ASC
    `;

    const values = [`%${q}%`, currentUserId];

    if (isSQLInjection(query)) {
        return res.status(401).send("Zugriff verweigert");
    }
    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Suchen der Benutzer" });
    }
});

// Set isadmin for a user (Admin only)
router.put("/admin/:id", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const { isadmin } = req.body;

    if (typeof isadmin !== "boolean") {
        return res.status(400).json({ error: "Ungültiger Wert für 'isadmin'. Muss true oder false sein." });
    }

    const query = 'UPDATE users SET "isadmin" = $1 WHERE id = $2 RETURNING id, username, "isadmin"';
    if (isSQLInjection(query)) {
        return res.status(401).send("Zugriff verweigert");
    }

    try {
        const result = await pool.query(query, [isadmin, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Benutzer nicht gefunden" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Aktualisieren des Admin-Status" });
    }
});

// Get all admins (Admin only)
router.get("/admin", authenticateJWT, requireAdmin, async (req, res) => {
    const pool = req.app.locals.pool;

    const query = 'SELECT * FROM users WHERE "isadmin" = true ORDER BY username ASC';
    if (isSQLInjection(query)) {
        return res.status(401).send("Zugriff verweigert");
    }

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Abrufen der Administratoren" });
    }
});

module.exports = router;