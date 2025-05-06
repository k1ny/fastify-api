import { pool } from "../db.js";

export const packageTypesService = {
  async getAllPackageTypes() {
    const result = await pool.query("SELECT * FROM package_types");
    return result.rows;
  },

  async createPackageType(data) {
    const { name, length, height, width, weight } = data;

    const res = await pool.query(
      "INSERT INTO package_types (name, length, height, width, weight) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, length, height, width, weight],
    );
    return res.rows[0];
  },

  async updatePackageType(id, fieldsToUpdate) {
    if (!id) {
      throw new Error("Missing packageType ID");
    }

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) {
      throw new Error("No fields provided for update");
    }

    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(fieldsToUpdate);

    const res = await pool.query(
      `UPDATE package_types SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );

    if (res.rowCount === 0) {
      const err = new Error("Package type not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows[0];
  },

  async deletePackageType(id) {
    const res = await pool.query(
      "DELETE FROM package_types WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) {
      const err = new Error("Package type not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows;
  },
};
