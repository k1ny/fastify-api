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

try {
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
