const express = require("express");
const { authenticateJWT } = require("../middleware/auth");
const { isSQLInjection } = require("../services/injectionService"); // Update path if needed

const router = express.Router();

// Submit contact form (no auth required)
router.post("/contact-form", async (req, res) => {
    const { name, email, subject, message } = req.body;
    const pool = req.app.locals.pool;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Alle Felder müssen ausgefüllt werden." });
    }

    const query = `INSERT INTO contact_form (name, email, subject, message)
                   VALUES ($1, $2, $3, $4)
                   RETURNING id`;

    if (isSQLInjection(query)) {
        return res.status(401).send("Zugriff verweigert");
    }

    try {
        const result = await pool.query(query, [name, email, subject, message]);

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

// Get all contact form submissions (admin only)
router.get("/contact-form", authenticateJWT, async (req, res) => {
    const pool = req.app.locals.pool;

    if (!req.user.isadmin) {
        return res.status(403).json({ error: "Nur Administratoren haben Zugriff auf diese Ressource." });
    }

    const query = `SELECT * FROM contact_form ORDER BY submitted_on DESC`;

    if (isSQLInjection(query)) {
        return res.status(401).send("Zugriff verweigert");
    }

    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching contact forms:", err);
        res.status(500).json({ error: "Fehler beim Laden der Kontaktanfragen." });
    }
});

// Update contact form status (admin only)
router.put("/contact-form/:id/status", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const pool = req.app.locals.pool;

    if (!req.user.isadmin) {
        return res.status(403).json({ error: "Nur Administratoren haben Zugriff auf diese Ressource." });
    }

    const validStatuses = ['new', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Ungültiger Status. Erlaubte Werte: new, in_progress, completed" });
    }

    const query = `UPDATE contact_form SET status = $1 WHERE id = $2 RETURNING *`;

    if (isSQLInjection(query)) {
        return res.status(401).send("Zugriff verweigert");
    }

    try {
        const result = await pool.query(query, [status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Kontaktanfrage nicht gefunden." });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating contact form status:", err);
        res.status(500).json({ error: "Fehler beim Aktualisieren des Status." });
    }
});

module.exports = router;
