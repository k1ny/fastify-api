import Fastify from "fastify";
import pg from "pg";
import dotenv from "dotenv";
import {
  packagePatchSchema,
  packageSchema,
  parcelDeliveryPlacePatchSchema,
  parcelDeliveryPlaceSchema,
  townPatchSchema,
  townSchema,
  userAdressSchema,
  userSchema,
} from "./schemas.js";
dotenv.config();

const fastify = Fastify({
  logger: true,
});

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

fastify.addSchema(userSchema);
fastify.addSchema(townSchema);
fastify.addSchema(townPatchSchema);
fastify.addSchema(packageSchema);
fastify.addSchema(packagePatchSchema);
fastify.addSchema(parcelDeliveryPlaceSchema);
fastify.addSchema(parcelDeliveryPlacePatchSchema);
fastify.addSchema(userAdressSchema);

fastify.get("/users", async (reply) => {
  try {
    const res = await pool.query("SELECT * FROM users");
    return res.rows;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.post("/users", {
  schema: {
    body: { $ref: "/schemas/user" },
  },
  handler: async (request, reply) => {
    const {
      last_name,
      first_name,
      middle_name,
      passport_serial,
      email,
      password_hash,
    } = request.body;

    try {
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
      return reply.status(201).send({ user: res.rows[0] });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
});

fastify.patch("/users", async (request, reply) => {
  const { id } = request.query;
  const { ...fieldsToUpdate } = request.body;

  if (!id) {
    return reply.status(400).send({ message: "Missing user ID" });
  }

  const keys = Object.keys(fieldsToUpdate);
  if (keys.length === 0) {
    return reply.status(400).send({ message: "No fields provided for update" });
  }

  const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
  const values = Object.values(fieldsToUpdate);

  try {
    const res = await pool.query(
      `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id],
    );

    if (res.rowCount === 0) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({ updatedUser: res.rows[0] });
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.delete("/users", async (request, reply) => {
  const { id } = request.query;

  if (!id) {
    return reply.status(400).send({ message: "Missing user ID" });
  }

  try {
    const res = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );

    if (res.rowCount === 0) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.status(201).send({ user: res.rows[0] });
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.get("/towns", async (reply) => {
  try {
    const res = await pool.query("SELECT * FROM towns");
    return res.rows;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.post("/towns", {
  shema: {
    body: { $ref: "/sсhemas/town" },
  },
  handler: async (request, reply) => {
    const { name, latitude, longitude } = request.body;

    try {
      const res = await pool.query(
        "INSERT INTO towns (name, latitude, longitude) VALUES ($1, $2, $3)",
        [name, latitude, longitude],
      );
      return reply.status(200).send({ town: res.rows[0] });
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
});

fastify.patch("/towns", {
  schema: { body: { $ref: "/schemas/townPatch" } },
  handler: async (request, reply) => {
    const { id } = request.query;
    const { ...fieldsToUpdate } = request.body;

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

    if (!id) {
      return reply.status(400).send({ message: "Missing town ID" });
    }

    if (keys.length === 0) {
      return reply
        .status(400)
        .send({ message: "No fields provided for update" });
    }

    try {
      const res = await pool.query(
        `UPDATE towns SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
        [...values, id],
      );

      if (res.rowCount === 0) {
        return reply.status(404).send({ message: "Town not found" });
      }

      return reply.status(201).send(res.rows[0]);
    } catch (error) {
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
});

fastify.delete("/towns", async (request, reply) => {
  const { id } = request.query;

  if (!id) {
    return reply.status(400).send({ message: "Missing town ID" });
  }

  try {
    const res = await pool.query("DELETE FROM towns WHERE id=$1 RETURNING *", [
      id,
    ]);

    if (res.rowCount === 0) {
      return reply.status(404).send({ message: "Town not found" });
    }

    return reply.status(201).send({ message: "Town was successfully deleted" });
  } catch (error) {
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.get("/packageTypes", async (reply) => {
  try {
    const res = await pool.query("SELECT * FROM package_types");
    return res.rows;
  } catch (error) {
    fastify.log.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.post("/packageTypes", {
  schema: { body: { $ref: "/schemas/package" } },
  handler: async (request, reply) => {
    const { name, length, height, width, weight } = request.body;

    try {
      const res = await pool.query(
        "INSERT INTO package_types (name, length, height, width, weight) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, length, height, width, weight],
      );
      return res.rows;
    } catch (error) {
      fastify.log.error(err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
});

fastify.patch("/packageTypes", {
  schema: { body: { $ref: "/schemas/packagePatch" } },
  handler: async (request, reply) => {
    const { id } = request.query;
    const { ...fieldsToUpdate } = request.body;

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

    if (!id) {
      return reply.status(400).send({ message: "Missing town ID" });
    }

    if (keys.length === 0) {
      return reply
        .status(400)
        .send({ message: "No fields provided for update" });
    }

    try {
      const res = await pool.query(
        `UPDATE package_types SET ${setClauses.join(", ")} WHERE id=$${keys.length + 1} RETURNING *`,
        [...values, id],
      );

      if (res.rowCount === 0) {
        return reply.status(404).send({ message: "PackageType not found" });
      }

      return res.rows;
    } catch (error) {
      fastify.log.error(err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
});

fastify.delete("/packageTypes", async (request, reply) => {
  const { id } = request.query;

  if (!id) {
    return reply.status(400).send({ message: "Missing packageType ID" });
  }

  try {
    const res = await pool.query(
      "DELETE from package_types WHERE id=$1 RETURNING *",
      [id],
    );

    if (res.rowCount === 0) {
      return reply.status(404).send({ message: "PackageType not found" });
    }

    return reply
      .status(201)
      .send({ message: "PackageType was successfully deleted" });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.get("/parcelDeliveryPlaces", async (reply) => {
  try {
    const res = await pool.query("SELECT * FROM parcel_delivery_places");
    return res.rows;
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.post("/parcelDeliveryPlaces", {
  schema: { body: { $ref: "/schemas/parcelDeliveryPlace" } },
  handler: async (request, reply) => {
    const { town_id, latitude, longitude } = request.body;

    const townExists = await pool.query("SELECT id FROM towns WHERE id = $1", [
      town_id,
    ]);

    if (townExists.rows.length === 0) {
      return reply.code(404).send({
        message: `Town with id ${town_id} not found`,
      });
    }

    try {
      const res = await pool.query(
        "INSERT INTO parcel_delivery_places (town_id, latitude, longitude) VALUES ($1, $2, $3) RETURNING *",
        [town_id, latitude, longitude],
      );
      return res.rows;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
});

fastify.patch("/parcelDeliveryPlaces", {
  schema: { body: { $ref: "/schemas/parcelDeliveryPlacePatch" } },
  handler: async (request, reply) => {
    const { id } = request.query;
    const { ...fieldsToUpdate } = request.body;

    const keys = Object.keys(fieldsToUpdate);
    const values = Object.values(fieldsToUpdate);
    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

    if (!id) {
      return reply.status(400).send({ message: "Missing DeliveryPlace ID" });
    }

    if (keys.length === 0) {
      return reply
        .status(400)
        .send({ message: "No fields provided for update" });
    }

    try {
      const res = await pool.query(
        `UPDATE parcel_delivery_places SET ${setClauses.join(", ")} WHERE id=$${keys.length + 1} RETURNING *`,
        [...values, id],
      );

      if (res.rowCount === 0) {
        return reply
          .status(404)
          .send({ message: "ParcelDeliveryPlace not found" });
      }

      return res.rows;
    } catch (error) {
      fastify.log.error(err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  },
});

fastify.delete("/parcelDeliveryPlaces", async (request, reply) => {
  const { id } = request.query;

  if (!id) {
    return reply.status(400).send({ message: "Missing DeliveryPlace ID" });
  }

  try {
    const res = await pool.query(
      "DELETE from parcel_delivery_places WHERE id=$1 RETURNING *",
      [id],
    );

    if (res.rowCount === 0) {
      return reply.status(404).send({ message: "DeliveryPlace not found" });
    }

    return reply
      .status(201)
      .send({ message: "DeliveryPlace was successfully deleted" });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

await fastify.listen({ port: 3001 });
