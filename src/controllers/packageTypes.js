import { packagePatchSchema, packageSchema } from "../dtos/package.js";
import { packageTypesService } from "../services/packageTypes.js";

export default async function (fastify) {
  fastify.get("/packageTypes", {
    async handler(_request, reply) {
      const packages = await packageTypesService.getAllPackageTypes();
      reply.code(200).send(packages);
    },
  });

  fastify.post("/packageTypes", {
    schema: {
      body: {
        $ref: packageSchema.$id,
      },
    },
    async handler(request, reply) {
      const packages = await packageTypesService.createPackageType(
        request.body,
      );
      reply.code(200).send(packages);
    },
  });

  fastify.patch("/packageTypes", {
    schema: {
      query: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: {
        $ref: packagePatchSchema.$id,
      },
    },
    async handler(request, reply) {
      const { id } = request.query;
      const packages = await packageTypesService.updatePackageType(
        id,
        request.body,
      );
      reply.code(200).send(packages);
    },
  });

  fastify.delete("/packageTypes", {
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
      await packageTypesService.deletePackageType(id);
      reply.code(200).send({ message: "Package type successfully deleted!" });
    },
  });
}
