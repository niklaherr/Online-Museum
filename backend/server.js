// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg"); // PostgreSQL client
const bcrypt = require("bcrypt"); // Password hashing
const jwt = require("jsonwebtoken"); // JWT for authentication
const multer = require("multer"); // File upload handling

// Initialize express app
const app = express();
const port = 3001;
const JWT_SECRET = "your_secret_key"; // In production, store this securely!

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies

// PostgreSQL connection pool setup
const pool = new Pool({
    user: "user",
    host: process.env.DATABASE_HOST || "localhost",
    database: "mydatabase",
    password: "password",
    port: 5432,
});

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "Access denied, no token provided." });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next(); // Continue to the next middleware/route
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

// Setup Multer to store uploaded files in memory
const upload = multer(); // Files will be stored as Buffer in memory

// ======= USER AUTHENTICATION ROUTES ======= //

// Register a new user
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
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

// Delete the authenticated user
app.delete("/users/me", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
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

// Login a user and return a JWT
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

// Reset password with old password
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

// ======= USER DATA ROUTES ======= //

// Fetch all users (requires authentication)
app.get("/users", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY username DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching users");
    }
});

// ======= ITEM ROUTES ======= //

// Get all items with user data
app.get("/items", authenticateJWT, async (req, res) => {
    try {
        const query = `
            SELECT item.*, users.username 
            FROM item 
            JOIN users ON item.user_id = users.id
        `;
        const result = await pool.query(query);

        const items = result.rows.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            entered_on: item.entered_on,
            description: item.description,
            user_id: item.user_id,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            username: item.username
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// Get a specific item by ID
app.get("/items/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT item.*, users.username 
            FROM item 
            JOIN users ON item.user_id = users.id
            WHERE item.id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) return res.status(404).send("Item not found");

        const item = result.rows[0];
        res.json({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            description: item.description,
            category: item.category,
            username: item.username,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item or user data");
    }
});

// Create a new item with image upload
app.post("/items", authenticateJWT, upload.single("image"), async (req, res) => {
    const { title, description, category } = req.body;
    const image = req.file ? req.file.buffer : null;

    if (!title) return res.status(400).send("Missing required fields: title");

    try {
        const result = await pool.query(
            `INSERT INTO item (user_id, title, image, description, category)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [req.user.id, title, image, description || null, category || null]
        );
        
        const newItem = result.rows[0]; // This is the inserted item
        const id = newItem.id; // Extract the new item's ID

        createActivity({category: "ITEM", element_id: id, type: "CREATE", user_id: req.user.id})
        
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating item");
    }
});

// Update an existing item, optionally replacing its image
app.put("/items/:id", authenticateJWT, upload.single("image"), async (req, res) => {
    const { title, description, category } = req.body;
    const { id } = req.params;
    const image = req.file ? req.file.buffer : null;

    if (!title) return res.status(400).send("Missing required field: title");

    try {
        const fields = ["title", "description", "category"];
        const values = [title, description || null, category || null];
        let query = `UPDATE item SET title = $1, description = $2, category = $3`;
        let paramIndex = 4;

        if (image) {
            query += `, image = $${paramIndex}`;
            values.push(image);
            paramIndex++;
        }

        query += ` WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`;
        values.push(id, req.user.id);

        const result = await pool.query(query, values);

        if (result.rows.length === 0) return res.status(404).send("Item not found or not authorized");

        createActivity({category: "ITEM", element_id: id, type: "UPDATE", user_id: req.user.id})

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).send("Error updating item");
    }
});

// Delete an item list
app.delete("/items/:id", authenticateJWT, async (req, res) => {
  const itemID = parseInt(req.params.id);
  const userId = req.user.id;

  try {
      // Ensure the item list exists and belongs to the current user
      const itemResult = await pool.query(
          "SELECT * FROM item WHERE id = $1 AND user_id = $2",
          [itemID, userId]
      );

      if (itemResult.rows.length === 0) {
          return res.status(404).send("Item not found or does not belong to you.");
      }

      // Delete the item list itself (cascading will handle associated items)
      await pool.query("DELETE FROM item WHERE id = $1", [itemListId]);

      createActivity({category: "ITEM", element_id: itemID, type: "DELETE", user_id: userId})

      res.status(200).send("Item deleted successfully.");
  } catch (err) {
      console.error("Error deleting item:", err);
      res.status(500).send("Error deleting item.");
  }
});

// Fetch all items for the current user
app.get("/me/items", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query("SELECT * FROM item WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// ======= ITEM LIST ROUTES ======= //

// Fetch all item lists
app.get("/item-lists", authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM item_list ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item lists");
    }
});

// Get one item list by ID
app.get("/item-lists/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM item_list WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).send("Item list not found");
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item list");
    }
});

// Fetch the authenticated user's item lists
app.get("/me/item-lists", authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query("SELECT * FROM item_list WHERE user_id = $1", [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching item list");
    }
});

// Get items by item_list_id
app.get("/item-lists/:item_list_id/items", authenticateJWT, async (req, res) => {
    const { item_list_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT item.id, item.title, item.category, item.entered_on, item.description, item.user_id, item.image, users.username
             FROM item
             JOIN item_itemlist ON item.id = item_itemlist.item_id
             JOIN users ON item.user_id = users.id
             WHERE item_itemlist.item_list_id = $1
             ORDER BY item.entered_on DESC`,
            [item_list_id]
        );

        const items = result.rows.map(item => ({
            id: item.id,
            user_id: item.user_id,
            title: item.title,
            entered_on: item.entered_on,
            image: item.image ? `data:image/jpeg;base64,${item.image.toString('base64')}` : '',
            description: item.description,
            category: item.category,
            username: item.username,
        }));

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching items");
    }
});

// Update an item list and its associations
app.put("/item-lists/:id", authenticateJWT, async (req, res) => {
    const itemListId = parseInt(req.params.id, 10);
    const { title, description, item_ids } = req.body;
    const userId = req.user.id;

    if (!title || !Array.isArray(item_ids) || item_ids.length === 0) {
        return res.status(400).send("Title and at least one item ID are required.");
    }

    try {
        const existingList = await pool.query(
            "SELECT * FROM item_list WHERE id = $1 AND user_id = $2",
            [itemListId, userId]
        );
        if (existingList.rowCount === 0) return res.status(404).send("Item list not found or not authorized.");

        await pool.query("UPDATE item_list SET title = $1, description = $2 WHERE id = $3",
            [title, description || "", itemListId]);

        await pool.query("DELETE FROM item_itemlist WHERE item_list_id = $1", [itemListId]);

        for (const itemId of item_ids) {
            await pool.query("INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)", [itemListId, itemId]);
        }

        createActivity({category: "ITEM_LIST", element_id: itemListId, type: "UPDATE", user_id: userId})

        res.status(200).json({ id: itemListId, title, description, user_id: userId, item_ids });
    } catch (err) {
        console.error("Error updating item list:", err);
        res.status(500).send("Error updating item list.");
    }
});

// Delete an item list
app.delete("/item-lists/:id", authenticateJWT, async (req, res) => {
  const itemListId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
      // Ensure the item list exists and belongs to the current user
      const itemListResult = await pool.query(
          "SELECT * FROM item_list WHERE id = $1 AND user_id = $2",
          [itemListId, userId]
      );

      if (itemListResult.rows.length === 0) {
          return res.status(404).send("Item list not found or does not belong to you.");
      }

      // Delete the item list itself (cascading will handle associated items)
      await pool.query("DELETE FROM item_list WHERE id = $1", [itemListId]);

      createActivity({category: "ITEM_LIST", element_id: itemListId, type: "DELETE", user_id: userId})

      res.status(200).send("Item list deleted successfully.");
  } catch (err) {
      console.error("Error deleting item list:", err);
      res.status(500).send("Error deleting item list.");
  }
});


// Create a new item list and link items to it
app.post("/item-lists", authenticateJWT, async (req, res) => {
    const { title, description, item_ids } = req.body;
    try {
        const userId = req.user.id;

        if (!title || !item_ids || item_ids.length === 0) {
            return res.status(400).send("Title and at least one item ID are required.");
        }

        const result = await pool.query(
            "INSERT INTO item_list (title, description, user_id) VALUES ($1, $2, $3) RETURNING id",
            [title, description || "", userId]
        );

        const newItemListId = result.rows[0].id;

        for (const itemId of item_ids) {
            await pool.query("INSERT INTO item_itemlist (item_list_id, item_id) VALUES ($1, $2)", [newItemListId, itemId]);
        }

        createActivity({category: "ITEM_LIST", element_id: newItemListId, type: "CREATE", user_id: userId})

        res.status(201).json({ id: newItemListId, title, description, user_id: userId, item_ids });
    } catch (err) {
        console.error("Error creating item list:", err);
        res.status(500).send("Error creating item list.");
    }
});

// ======= ACTIVITY FEED ROUTES ======= //

// Fetch all item lists
app.get("/activities", authenticateJWT, async (req, res) => {
    const userId = req.user.id;  // Assuming req.user contains the authenticated user's info

    try {
        const result = await pool.query(
            `SELECT * FROM activities 
             WHERE user_id = $1
             ORDER BY entered_on DESC 
             LIMIT 10`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching activities");
    }
});

// Create a new activity
async function createActivity({ category, element_id, type, user_id }) {

    if (!category || !element_id || !type || !user_id) {
        throw new Error("Missing required fields: category, element_id, type, and user_id");
    }

    try {
        const result = await pool.query(
            `INSERT INTO activities (category, element_id, type, user_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [category, element_id, type, user_id]
        );
        return result.rows[0];
    } catch (err) {
        console.error("Error creating activity:", err);
        throw new Error("Database error");
    }
}

// ======= SERVER START ======= //

// Start the server and listen on defined port
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
});