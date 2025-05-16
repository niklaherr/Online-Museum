// routes/activities.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// Fetch activities for the authenticated user
router.get("/activities", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT * FROM activities 
             WHERE user_id = $1
             ORDER BY entered_on DESC 
             LIMIT 5`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching activities");
    }
});

module.exports = router;