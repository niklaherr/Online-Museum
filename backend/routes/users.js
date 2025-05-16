// routes/users.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// Fetch all users (requires authentication)
router.get("/", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY username DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});

// Delete the authenticated user
router.delete("/me", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1", [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "User deletion failed" });
    }
});

// Check user permissions
router.get("/me/permissions", authenticateJWT, async (req, res) => {
    try {
        res.json({ 
            isAdmin: req.user.isAdmin === true 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Prüfen der Benutzerberechtigungen." });
    }
});

module.exports = router;