import { orderTypesSchema } from "../dtos/orderTypes.js";
import { orderTypesService } from "../services/orderTypes.js";

export default async function (fastify) {
  fastify.get("/orderTypes", {
    async handler(_request, reply) {
      const orderTypes = await orderTypesService.getAllOrderTypes();
      reply.code(200).send(orderTypes);
    },
  });

  fastify.post("/orderTypes", {
    schema: {
      body: {
        $ref: orderTypesSchema.$id,
      },
    },
    async handler(request, reply) {
      const orderTypes = await orderTypesService.createOrderType(request.body);
      reply.code(200).send(orderTypes);
    },
  });

  fastify.patch("/orderTypes/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: {
        $ref: orderTypesSchema.$id,
      },
    },
    async handler(request, reply) {
      const { id } = request.params;
      const orderTypes = await orderTypesService.updateOrderType(
        id,
        request.body,
      );
      reply.code(200).send(orderTypes);
    },
  });

  fastify.delete("/orderTypes/:id", {
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
      await orderTypesService.deleteOrderType(id);
      reply.code(200).send({ message: "OrderType type successfully deleted!" });
    },
  });
}
