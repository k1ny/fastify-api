import Fastify from "fastify";
import pg from "pg";
import dotenv from "dotenv";
import { userSchema } from "./schemas.js";
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

try {
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
