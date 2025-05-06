import { pool } from "../db.js";

export const userAddressesService = {
  async getAllUserAddresses() {
    const result = await pool.query("SELECT * FROM user_addresses");
    return result.rows;
  },

  async createUserAddress(data) {
    const {
      town_id,
      user_id,
      street,
      entrance,
      apartment_number,
      floor,
      intercom_code,
    } = data;

    const townExists = await pool.query("SELECT 1 FROM towns WHERE id = $1", [
      town_id,
    ]);
    const userExists = await pool.query("SELECT 1 FROM users WHERE id = $1", [
      user_id,
    ]);

    if (townExists.rows.length === 0) {
      throw new Error(`Town with id ${town_id} not found`);
    }
    if (userExists.rows.length === 0) {
      throw new Error(`User with id ${user_id} not found`);
    }

    const res = await pool.query(
      "INSERT INTO user_addresses (town_id, user_id, street, entrance, apartment_number, floor, intercom_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        town_id,
        user_id,
        street,
        entrance,
        apartment_number,
        floor,
        intercom_code,
      ],
    );
    return res.rows[0];
  },

  async updateUserAddress(id, fieldsToUpdate) {
    if (!id) {
      throw new Error("Missing userAdress ID");
    }

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) {
      throw new Error("No fields provided for update");
    }

    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(fieldsToUpdate);

    const townExists = await pool.query("SELECT 1 FROM towns WHERE id = $1", [
      fieldsToUpdate?.town_id,
    ]);
    const userExists = await pool.query("SELECT 1 FROM users WHERE id = $1", [
      fieldsToUpdate?.user_id,
    ]);

    if (fieldsToUpdate?.town_id && townExists.rows.length === 0) {
      throw new Error(`Town with id ${fieldsToUpdate?.town_id} not found`);
    }

    if (fieldsToUpdate?.user_id && userExists.rows.length === 0) {
      throw new Error(`User with id ${fieldsToUpdate?.user_id} not found`);
    }

    const res = await pool.query(
      `UPDATE user_addresses SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );

    if (res.rowCount === 0) {
      const err = new Error("UserAddress not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows[0];
  },

  async deleteUserAddress(id) {
    const res = await pool.query(
      "DELETE FROM user_addresses WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) {
      const err = new Error("UserAddress not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows;
  },
};
