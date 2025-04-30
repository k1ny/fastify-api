import Fastify from "fastify";
import pg from "pg";

const fastify = Fastify({
  logger: true,
});

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "kursovaya",
  password: "510141",
  port: 5432,
});

fastify.get("/users", async function handler(request, reply) {
  try {
    const res = await pool.query("SELECT * FROM users");
    return res.rows;
  } catch (err) {
    fastify.log.error(err);
    return reply.status(500).send({ message: "Internal server error" });
  }
});

fastify.post("/users", async function handler(request, reply) {
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
      "INSERT INTO users (last_name, first_name, middle_name, passport_serial, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6)",
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
});

fastify.patch("/users", async function handler(request, reply) {
  const { id, ...fieldsToUpdate } = request.body;

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

fastify.delete("/users", async function handler(request, reply) {
  const { id } = request.body;
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
