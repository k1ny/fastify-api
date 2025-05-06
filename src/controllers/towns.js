import { townsService } from "../services/towns.js";
import { townPatchSchema, townSchema } from "../dtos/town.js";

export default async function (fastify) {
  fastify.get("/towns", {
    async handler(_request, reply) {
      const towns = await townsService.getAllTowns();
      reply.code(200).send(towns);
    },
  });

  fastify.post("/towns", {
    schema: {
      body: {
        $ref: townSchema.$id,
      },
    },
    async handler(request, reply) {
      const town = await townsService.createTown(request.body);
      reply.code(201).send(town);
    },
  });

  fastify.patch("/towns", {
    schema: {
      query: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: {
        $ref: townPatchSchema.$id,
      },
    },
    async handler(request, reply) {
      const { id } = request.query;
      const town = await townsService.updateTown(id, request.body);
      reply.code(200).send(town);
    },
  });

  fastify.delete("/towns", {
    schema: {
      query: {
        type: "object",
        properties: {
          id: { type: "integer" },
        },
        required: ["id"],
      },
    },
    async handler(request, reply) {
      const { id } = request.query;
      await townsService.deleteTown(id);
      reply.code(200).send({ message: "Town successfully deleted!" });
    },
  });
}
