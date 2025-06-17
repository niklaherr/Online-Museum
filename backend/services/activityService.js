// services/activityService.js

//function used to create activities for a user, e.g when creating an item you will call this function after creating it
async function createActivity(pool, { category, element_id, type, user_id }) {
    if (!category || !element_id || !type || !user_id) {
        throw new Error("Fehlende Kategorien: category, element_id, type, and user_id");
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
        throw new Error("Fehler beim Erstellen der Aktivität: " + err.message);
    }
}

module.exports = {
    createActivity
};