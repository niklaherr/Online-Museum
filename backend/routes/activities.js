// routes/activities.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { isSQLInjection } = require("../services/injectionService");

const router = express.Router();

// Fetch activities for the authenticated user
router.get("/activities", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const pool = req.app.locals.pool;

    try {

        const query = 
        `SELECT * FROM activities 
        WHERE user_id = $1
        ORDER BY entered_on DESC 
        LIMIT 5`;

        if (isSQLInjection(query)) {
            res.status(401).send("Access denied");
            return;
        }

        const result = await pool.query(query, [userId]);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching activities");
    }
});

module.exports = router;