import { pool } from "../db.js";

export const usersService = {
  async getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  },

  async createUser(data) {
    const {
      last_name,
      first_name,
      middle_name,
      passport_serial,
      email,
      password_hash,
    } = data;

    const res = await pool.query(
      "INSERT INTO users (last_name, first_name, middle_name, passport_serial, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        last_name,
        first_name,
        middle_name,
        passport_serial,
        email,
        password_hash,
      ],
    );
    return res.rows[0];
  },

  async updateUser(id, fieldsToUpdate) {
    if (!id) {
      throw new Error("Missing user ID");
    }

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(fieldsToUpdate);

    const query = `
      UPDATE users
      SET ${setClauses.join(", ")}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    const res = await pool.query(query, [...values, id]);

    if (res.rowCount === 0) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return res.rows[0];
  },

  async deleteUser(id) {
    const res = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) {
      throw new Error("User not found");
    }
    return res.rows[0];
  },
};
