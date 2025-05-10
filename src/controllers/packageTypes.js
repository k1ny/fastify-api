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

  fastify.patch("/packageTypes/:id", {
    schema: {
      params: {
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
      const { id } = request.params;
      const packages = await packageTypesService.updatePackageType(
        id,
        request.body,
      );
      reply.code(200).send(packages);
    },
  });

  fastify.delete("/packageTypes/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "integer" },
        },
        required: ["id"],
      },
    },
    async handler(request, reply) {
      const { id } = request.params;
      await packageTypesService.deletePackageType(id);
      reply.code(200).send({ message: "Package type successfully deleted!" });
    },
  });
}
