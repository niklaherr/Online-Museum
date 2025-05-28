// routes/users.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// Delete the authenticated user
router.delete("/users", authenticateJWT, async (req, res) => {
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

module.exports = router;