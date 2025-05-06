import { pool } from "../db.js";

export const orderTypesService = {
  async getAllOrderTypes() {
    const result = await pool.query("SELECT * FROM order_types");
    return result.rows;
  },

  async createOrderType(data) {
    const { name } = data;

    const res = await pool.query(
      "INSERT INTO order_types (name) VALUES ($1) RETURNING *",
      [name],
    );
    return res.rows[0];
  },

  async updateOrderType(id, fieldsToUpdate) {
    if (!id) {
      throw new Error("Missing ParcelDeliveryPlace ID");
    }

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) {
      throw new Error("No fields provided for update");
    }

    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(fieldsToUpdate);

    const res = await pool.query(
      `UPDATE order_types SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );

    if (res.rowCount === 0) {
      const err = new Error("OrderType not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows[0];
  },

  async deleteOrderType(id) {
    const res = await pool.query(
      "DELETE FROM order_types WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) {
      const err = new Error("OrderType not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows;
  },
};
