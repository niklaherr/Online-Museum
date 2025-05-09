const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer"); // Import multer for file handling

const app = express();
const port = 3001;
const JWT_SECRET = "your_secret_key"; // Replace with a secure value in production!

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection Pool
const pool = new Pool({
    user: "user",
    host: process.env.DATABASE_HOST || "localhost",
    database: "mydatabase",
    password: "password",
    port: 5432,
});

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "Access denied, no token provided." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

// Setup multer to handle file uploads (store in memory)
const upload = multer(); // This will store files in memory as buffers

// ========== ROUTES ========== //

// Register new user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
            [username, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Delete the currently authenticated user
app.delete("/users/me", authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
      const result = await pool.query(
          "DELETE FROM users WHERE id = $1",
          [userId]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: "User not found" });
      }

      const deletedUser = result.rows[0];
      res.status(200).json({ message: "User deleted" });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "User deletion failed" });
  }
});


// Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, id: user.id, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Reset password (with PUT)
app.put("/reset-password-with-old-password", authenticateJWT, async (req, res) => {
    const { oldPassword, newPassword, reNewPassword } = req.body;
  
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
  

// Get all users (secured)
app.get("/users", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY username DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});

// Import des ItemAssistant-Service
const itemAssistantService = require('./services/ItemAssistantService');

// Middleware für den ItemAssistant-Service
app.use('/api/item-assistant', itemAssistantService);

// Get all items
app.get("/items", authenticateJWT, async (req, res) => {
    try {
        const query = `
        SELECT item.*, users.username 
        FROM item 
        JOIN users ON item.user_id = users.id
      `;

        // Execute query
        const result = await pool.query(query);

        // Map each item and convert the image to a base64 string if it exists
        const items = result.rows.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '' // Convert image to base64 here
        }));

        // Send the items (including base64 images) to the frontend
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// Get a single item by ID along with the user's data in a single query
app.get("/items/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
  
    try {
      // Use a JOIN to fetch both the item and the user's username
      const query = `
        SELECT item.*, users.username 
        FROM item 
        JOIN users ON item.user_id = users.id
        WHERE item.id = $1
      `;
  
      const result = await pool.query(query, [id]);
  
      // Check if the item was found
      if (result.rows.length === 0) {
        return res.status(404).send("Item not found");
      }
  
      const item = result.rows[0];
  
      // Return the item data along with the username
      const galleryItem = {
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        entered_on: item.entered_on,
        image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '', // Convert image to base64 if it exists
        description: item.description,
        category: item.category,
        username: item.username, // The username is fetched directly from the JOIN
      };
  
      res.json(galleryItem);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching item or user data");
    }
  });
  

// Add a new item with image upload
app.post("/items", authenticateJWT, upload.single("image"), async (req, res) => {
    const { title, description, category } = req.body;
    const image = req.file ? req.file.buffer : null; // Store the image as a buffer (BYTEA in PostgreSQL)

    // Validate required fields
    if (!title) {
        return res.status(400).send("Missing required fields: title, entered_on");
    }

    try {
        const result = await pool.query(
            `INSERT INTO item (user_id, title, image, description, category)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                req.user.id, 
                title,
                image, // image will be a buffer (BYTEA type in PostgreSQL)
                description || null, 
                category || null
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating item");
    }
});

// Get all item lists
app.get("/item-lists", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM item_list ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item lists");
    }
});

// Get a single item list by ID
app.get("/item-lists/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM item_list WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Item list not found");
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item list");
    }
});

// Get items by item_list_id
app.get("/item-lists/:item_list_id/items", authenticateJWT, async (req, res) => {
    const { item_list_id } = req.params; // Extract the item_list_id from the URL
    try {
        const result = await pool.query(
            `SELECT item.id, item.title, item.category, item.entered_on, item.description, item.user_id, item.image, users.username
             FROM item
             JOIN item_itemlist ON item.id = item_itemlist.item_id
             JOIN users ON item.user_id = users.id
             WHERE item_itemlist.item_list_id = $1
             ORDER BY item.entered_on DESC`,
            [item_list_id] // Pass the item_list_id as a parameter
        );

        // Map each item and convert the image to a base64 string if it exists
        const items = result.rows.map((item) => ({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '', // Convert image to base64 if it exists
            description: item.description,
            category: item.category,
            username: item.username, // The username is fetched directly from the JOIN
          }));

        // Send the items (including base64 images) to the frontend
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

app.post("/item-lists", authenticateJWT, async (req, res) => {
    const { title, description, item_ids } = req.body;

    try {
        // Get the user_id from the JWT token (req.user is set by authenticateJWT middleware)
        const userId = req.user.id;

        // Check if title and item_ids are provided
        if (!title || !item_ids || item_ids.length === 0) {
            return res.status(400).send("Title and at least one item ID are required.");
        }

        // Insert the new item list into the database
        const result = await pool.query(
            "INSERT INTO item_list (title, description, user_id) VALUES ($1, $2, $3) RETURNING id",
            [title, description || "", userId] // Use userId from JWT
        );

        const newItemListId = result.rows[0].id;

        // Now insert the selected items into the item_itemlist table to associate them with the new item list
        for (const itemId of item_ids) {
            await pool.query(
                "INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)",
                [newItemListId, itemId]
            );
        }

        // Send the created item list response
        res.status(201).json({
            id: newItemListId,
            title,
            description,
            user_id: userId,
            item_ids,
        });
    } catch (err) {
        console.error("Error creating item list:", err);
        res.status(500).send("Error creating item list.");
    }
});

async function fetchLatestActivities() {
    try {
      // Query to fetch last 5 items
      const itemsQuery = `
        SELECT 
          id,
          'item' AS type,
          entered_on,
          'created item' AS action,
          title AS target
        FROM 
          item
        ORDER BY 
          entered_on DESC
        LIMIT 5;
      `;
      const itemsResult = await pool.query(itemsQuery);
  
      // Query to fetch last 5 item lists
      const itemListsQuery = `
        SELECT 
          id,
          'item_list' AS type,
          entered_on,
          'created list' AS action,
          title AS target
        FROM 
          item_list
        ORDER BY 
          entered_on DESC
        LIMIT 5;
      `;
      // Map the results to the Activity format
        const mapToActivity = (rows) => {
            return rows.map(row => ({
            id: row.id,
            type: row.type,
            username: row.username,
            entered_on: row.entered_on,
            action: row.action,
            target: row.target
            }));
        };
        const itemListsResult = await pool.query(itemListsQuery)
  
      // Map each result set to the Activity interface
      const itemsActivities = mapToActivity(itemsResult.rows);
      const itemListsActivities = mapToActivity(itemListsResult.rows);
  
      // Combine the activities from both tables
      const allActivities = [...itemsActivities, ...itemListsActivities];
  
      // Sort the combined results by entered_on (most recent first)
      allActivities.sort((a, b) => new Date(b.entered_on) - new Date(a.entered_on));
  
      // Return the top 5 activities
      return allActivities.slice(0, 5);
    } catch (err) {
      console.error('Error fetching activities:', err);
      throw err;
    }
  }
  
// Express route to fetch all activities
app.get('/activities', authenticateJWT, async (req, res) => {
try {
    const activities = await fetchLatestActivities();
    res.json(activities);
} catch (err) {
    res.status(500).send('Error fetching activities');
}
});

// Start server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
});
