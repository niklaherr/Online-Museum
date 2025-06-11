// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateJWT, JWT_SECRET } = require("../middleware/auth");
const { isSQLInjection } = require("../services/injectionService");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    const pool = req.app.locals.pool;
    const { username, password, securityQuestion, securityAnswer } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10); // Hash the security answer too
        
        const query = "INSERT INTO users (username, password, security_question, security_answer) VALUES ($1, $2, $3, $4) RETURNING id, username"

        if (isSQLInjection(query)) {
            return res.status(401).send("Access denied");
        }

        const result = await pool.query(
            query, [username, hashedPassword, securityQuestion, hashedSecurityAnswer]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username, isadmin: false }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, id: user.id, username: user.username, isadmin: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

//Function used to log user in and load user data
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const pool = req.app.locals.pool;
    
    try {
        const query = "SELECT * FROM users WHERE username = $1"
        if (isSQLInjection(query)) {
            return res.status(401).send("Access denied");
        }

        const result = await pool.query(query, [username]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, username: user.username, isadmin: user.isadmin }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, id: user.id, username: user.username, isadmin: user.isadmin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});


//Endpoint to verify answer of security question
router.post("/verify-security-question", async (req, res) => {
    const pool = req.app.locals.pool;
    const { username, securityAnswer } = req.body;
    
    try {
        // Find the user
        const query = "SELECT * FROM users WHERE username = $1"
        if (isSQLInjection(query)) {
            return res.status(401).send("Access denied");
        }
        const result = await pool.query(
            query,
            [username]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const user = result.rows[0];
        
        // Verify the security answer with bcrypt.compare (secure way)
        const answerMatch = await bcrypt.compare(securityAnswer, user.security_answer);
        
        if (answerMatch) {
            // Generate a temporary token for password reset
            const resetToken = jwt.sign(
                { id: user.id, username: user.username, purpose: 'password-reset' }, 
                JWT_SECRET, 
                { expiresIn: "15m" }
            );
            
            return res.json({ 
                success: true, 
                message: "Security answer verified",
                resetToken: resetToken,
                userId: user.id
            });
        } else {
            return res.status(401).json({ error: "Invalid security answer" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error verifying security question" });
    }
});

// New endpoint for fetching security question
router.get("/security-question/:username", async (req, res) => {
    const pool = req.app.locals.pool;
    const { username } = req.params;
    
    try {
        const query = "SELECT security_question FROM users WHERE username = $1"
        if (isSQLInjection(query)) {
            return res.status(401).send("Access denied");
        }
        const result = await pool.query(
            query,
            [username]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ securityQuestion: result.rows[0].security_question });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error retrieving security question" });
    }
});

// New endpoint for resetting password with token
router.post("/reset-password", async (req, res) => {
    const pool = req.app.locals.pool;
    const { resetToken, newPassword } = req.body;
    
    try {
        // Verify the reset token
        const decoded = jwt.verify(resetToken, JWT_SECRET);
        
        // Check if token was issued for password reset
        if (decoded.purpose !== 'password-reset') {
            return res.status(401).json({ error: "Invalid token purpose" });
        }
        
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the user's password
        const query = "UPDATE users SET password = $1 WHERE id = $2"
        if (isSQLInjection(query)) {
            return res.status(401).send("Access denied");
        }
        await pool.query(
            query,
            [hashedPassword, decoded.id]
        );
        
        res.json({ success: true, message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        res.status(500).json({ error: "Error resetting password" });
    }
});

// Endpoint to reset password with old password
router.put("/reset-password-with-old-password", authenticateJWT, async (req, res) => {
    
    const { oldPassword, newPassword, reNewPassword } = req.body;

    if (!oldPassword || !newPassword || !reNewPassword) {
        return res.status(400).json({ error: "Alle Felder müssen ausgefüllt werden." });
    }

    if (newPassword !== reNewPassword) {
        return res.status(400).json({ error: "Die neuen Passwörter stimmen nicht überein." });
    }

    if (newPassword.length <= 5) {
        return res.status(400).json({ error: "Das Passwort muss mindestens 6 Zeichen lang sein" });
    }

    const pool = req.app.locals.pool;
    try {
        const query = "SELECT * FROM users WHERE id = $1"
        if (isSQLInjection(query)) {
            return res.status(401).send("Access denied");
        }
        const result = await pool.query(query, [req.user.id]);
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: "Benutzer nicht gefunden." });

        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Altes Passwort ist falsch." });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery= "UPDATE users SET password = $1 WHERE id = $2"
        if (isSQLInjection(updateQuery)) {
            return res.status(401).send("Access denied");
        }
        await pool.query(updateQuery, [hashedNewPassword, user.id]);

        res.status(200).json({ message: "Passwort erfolgreich aktualisiert." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fehler beim Zurücksetzen des Passworts." });
    }
});

module.exports = router;