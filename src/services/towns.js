import { pool } from "../db.js";

export const townsService = {
  async getAllTowns() {
    const result = await pool.query("SELECT * FROM towns");
    return result.rows;
  },

  async createTown(data) {
    const { name, latitude, longitude } = data;

    const res = await pool.query(
      "INSERT INTO towns (name, latitude, longitude) VALUES ($1, $2, $3) RETURNING *",
      [name, latitude, longitude],
    );
    return res.rows[0];
  },

  async updateTown(id, fieldsToUpdate) {
    if (!id) {
      throw new Error("Missing town ID");
    }

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) {
      throw new Error("No fields provided for update");
    }

    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(fieldsToUpdate);

    const res = await pool.query(
      `UPDATE towns SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );

    if (res.rowCount === 0) {
      const err = new Error("Town not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows[0];
  },

  async deleteTown(id) {
    const res = await pool.query(
      "DELETE FROM towns WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) {
      const err = new Error("Town not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows;
  },
};
