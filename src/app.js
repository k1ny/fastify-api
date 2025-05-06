import Fastify from "fastify";
import * as dtos from "./dtos/index.js";
import { pool } from "./db.js";

const fastify = Fastify({ logger: true });

Object.values(dtos).forEach((dto) => {
  fastify.addSchema(dto);
});

fastify.setErrorHandler((error, _request, reply) => {
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    error: error.name || "InternalServerError",
    message: error.message || "Something went wrong",
  });
});

await fastify.register(import("./controllers/users.js"));
await fastify.register(import("./controllers/towns.js"));
await fastify.register(import("./controllers/packageTypes.js"));
await fastify.register(import("./controllers/userAddresses.js"));
await fastify.register(import("./controllers/ParcelDeliveryPlaces.js"));
await fastify.register(import("./controllers/orderTypes.js"));
await fastify.register(import("./controllers/orders.js"));

try {
  await pool.connect();
  await fastify.listen({ port: 3001, host: "0.0.0.0" });
  console.log("🚀 Server started on http://localhost:3001");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
