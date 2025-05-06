import { pool } from "../db.js";

export const ordersService = {
  async getAllOrders() {
    const result = await pool.query("SELECT * FROM orders");
    return result.rows;
  },

  async createOrder(data) {
    const {
      order_type,
      sender_address,
      sender_id,
      receiver_last_name,
      receiver_first_name,
      receiver_middle_name,
      receiver_point_id,
      receiver_address_id,
      package_id,
    } = data;

    const checks = await Promise.all([
      pool.query("SELECT 1 FROM order_types WHERE id = $1", [order_type]),
      pool.query("SELECT 1 FROM parcel_delivery_places WHERE id = $1", [
        sender_address,
      ]),
      pool.query("SELECT 1 FROM users WHERE id = $1", [sender_id]),
      pool.query("SELECT 1 FROM package_types WHERE id = $1", [package_id]),
      receiver_point_id
        ? pool.query("SELECT 1 FROM parcel_delivery_places WHERE id = $1", [
            receiver_point_id,
          ])
        : Promise.resolve({ rows: [] }),
      receiver_address_id
        ? pool.query("SELECT 1 FROM user_addresses WHERE id = $1", [
            receiver_address_id,
          ])
        : Promise.resolve({ rows: [] }),
    ]);

    if (checks[0].rows.length === 0) throw new Error("Order type not found");
    if (checks[1].rows.length === 0)
      throw new Error("Sender address not found");
    if (checks[2].rows.length === 0) throw new Error("Sender not found");
    if (checks[3].rows.length === 0) throw new Error("Package type not found");
    if (receiver_point_id && checks[4].rows.length === 0)
      throw new Error("Receiver point not found");
    if (receiver_address_id && checks[5].rows.length === 0)
      throw new Error("Receiver address not found");

    const res = await pool.query(
      "INSERT INTO orders (order_type, sender_address, sender_id, receiver_last_name, receiver_first_name, receiver_middle_name, receiver_point_id, receiver_address_id, package_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        order_type,
        sender_address,
        sender_id,
        receiver_last_name,
        receiver_first_name,
        receiver_middle_name,
        receiver_point_id,
        receiver_address_id,
        package_id,
      ],
    );
    return res.rows[0];
  },

  async updateOrder(id, fieldsToUpdate) {
    if (!id) {
      throw new Error("Missing order ID");
    }

    const keys = Object.keys(fieldsToUpdate);
    if (keys.length === 0) {
      throw new Error("No fields provided for update");
    }

    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(fieldsToUpdate);

    const checks = await Promise.all([
      pool.query("SELECT 1 FROM order_types WHERE id = $1", [
        fieldsToUpdate?.order_type,
      ]),
      pool.query("SELECT 1 FROM parcel_delivery_places WHERE id = $1", [
        fieldsToUpdate?.sender_address,
      ]),
      pool.query("SELECT 1 FROM users WHERE id = $1", [
        fieldsToUpdate?.sender_id,
      ]),
      pool.query("SELECT 1 FROM package_types WHERE id = $1", [
        fieldsToUpdate?.package_id,
      ]),
      fieldsToUpdate?.receiver_point_id
        ? pool.query("SELECT 1 FROM parcel_delivery_places WHERE id = $1", [
            fieldsToUpdate?.receiver_point_id,
          ])
        : Promise.resolve({ rows: [] }),
      fieldsToUpdate?.receiver_address_id
        ? pool.query("SELECT 1 FROM user_addresses WHERE id = $1", [
            fieldsToUpdate?.receiver_address_id,
          ])
        : Promise.resolve({ rows: [] }),
    ]);

    if (fieldsToUpdate?.order_type && checks[0].rows.length === 0)
      throw new Error("Order type not found");
    if (fieldsToUpdate?.sender_address && checks[1].rows.length === 0)
      throw new Error("Sender address not found");
    if (fieldsToUpdate?.sender_id && checks[2].rows.length === 0)
      throw new Error("Sender not found");
    if (fieldsToUpdate?.package_id && checks[3].rows.length === 0)
      throw new Error("Package type not found");
    if (fieldsToUpdate?.receiver_point_id && checks[4].rows.length === 0)
      throw new Error("Receiver point not found");
    if (fieldsToUpdate?.receiver_address_id && checks[5].rows.length === 0)
      throw new Error("Receiver address not found");

    const res = await pool.query(
      `UPDATE orders SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );

    if (res.rowCount === 0) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows[0];
  },

  async deleteOrder(id) {
    const res = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) {
      const err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows;
  },
};
