// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateJWT, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const pool = req.app.locals.pool;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, isAdmin",
            [username, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, id: user.id, username: user.username, isAdmin: user.isAdmin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Login a user and return a JWT
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const pool = req.app.locals.pool;
    
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, id: user.id, username: user.username, isAdmin: user.isAdmin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Reset password with old password
router.put("/reset-password-with-old-password", authenticateJWT, async (req, res) => {
    const { oldPassword, newPassword, reNewPassword } = req.body;
    const pool = req.app.locals.pool;

    if (!oldPassword || !newPassword || !reNewPassword) {
        return res.status(400).json({ error: "Alle Felder müssen ausgefüllt werden." });
    }

    if (newPassword !== reNewPassword) {
        return res.status(400).json({ error: "Die neuen Passwörter stimmen nicht überein." });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: "Benutzer nicht gefunden." });

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Altes Passwort ist falsch." });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedNewPassword, user.id]);

        res.status(200).json({ message: "Passwort erfolgreich aktualisiert." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Zurücksetzen des Passworts." });
    }
});

module.exports = router;