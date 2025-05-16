// services/activityService.js
async function createActivity(pool, { category, element_id, type, user_id }) {
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
        throw new Error("Error creating activity");
    }
}

module.exports = {
    createActivity
};