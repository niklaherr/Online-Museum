// routes/users.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { isSQLInjection } = require("../services/injectionService");

const router = express.Router();

// Delete the authenticated user
router.delete("/users", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const pool = req.app.locals.pool;
    
    try {
        const query = "DELETE FROM users WHERE id = $1"
        if (isSQLInjection(query)) return res.status(401).send("Zugriff verweigert");
        const result = await pool.query(query, [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Nutzer wurde nicht gefunden" });
        }

        res.status(200).json({ message: "Nutzer gelöscht" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Nutzer Löschvorgang ist fehlgeschlagen" });
    }
});

module.exports = router;