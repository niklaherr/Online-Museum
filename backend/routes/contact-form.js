// routes/activities.js
const express = require("express");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

// Submit contact form 
router.post("/contact-form", async (req, res) => {
    const { name, email, subject, message } = req.body;
    const pool = req.app.locals.pool;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Alle Felder müssen ausgefüllt werden." });
    }

    try {
        // Insert the form data into the database
        const result = await pool.query(
            `INSERT INTO contact_form (name, email, subject, message)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [name, email, subject, message]
        );
        
        res.status(201).json({ 
            success: true, 
            message: "Formular erfolgreich eingereicht",
            id: result.rows[0].id 
        });
    } catch (err) {
        console.error("Error submitting contact form:", err);
        res.status(500).json({ error: "Fehler beim Speichern des Formulars" });
    }
});

// Get all contact form submissions (for future admin functionality)
router.get("/contact-form", authenticateJWT, async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const result = await pool.query(
            `SELECT * FROM contact_form ORDER BY submitted_on DESC`
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error("Error retrieving contact forms:", err);
        res.status(500).json({ error: "Fehler beim Abrufen der Kontaktformulare" });
    }
});

module.exports = router;