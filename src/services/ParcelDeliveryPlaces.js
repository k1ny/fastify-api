import { pool } from "../db.js";

export const ParcelDeliveryPlacesService = {
  async getAllParcelDeliveryPlaces() {
    const result = await pool.query("SELECT * FROM parcel_delivery_places");
    return result.rows;
  },

  async createParcelDeliveryPlace(data) {
    const { town_id, latitude, longitude } = data;

    const townExists = await pool.query("SELECT 1 FROM towns WHERE id = $1", [
      town_id,
    ]);

    if (townExists.rows.length === 0) {
      throw new Error(`Town with id ${town_id} not found`);
    }

    const res = await pool.query(
      "INSERT INTO parcel_delivery_places (town_id, latitude, longitude) VALUES ($1, $2, $3) RETURNING *",
      [town_id, latitude, longitude],
    );
    return res.rows[0];
  },

  async updateParcelDeliveryPlace(id, fieldsToUpdate) {
    if (!id) {
      throw new Error("Missing ParcelDeliveryPlace ID");
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

    if (fieldsToUpdate?.town_id && townExists.rows.length === 0) {
      throw new Error(`Town with id ${fieldsToUpdate?.town_id} not found`);
    }

    const res = await pool.query(
      `UPDATE parcel_delivery_places SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );

    if (res.rowCount === 0) {
      const err = new Error("ParcelDeliveryPlace not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows[0];
  },

  async deleteParcelDeliveryPlace(id) {
    const res = await pool.query(
      "DELETE FROM parcel_delivery_places WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) {
      const err = new Error("ParcelDeliveryPlace not found");
      err.statusCode = 404;
      throw err;
    }
    return res.rows;
  },
};
