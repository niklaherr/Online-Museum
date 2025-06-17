// middleware/auth.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; 

//Middleware used to authenticate user with jwt token

const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "Zugriff verweigert, kein Token bereitgestellt." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next(); // Continue to the next middleware/route
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Ungültiges oder abgelaufenes Token." });
    }
};

module.exports = {
    authenticateJWT,
    JWT_SECRET
};