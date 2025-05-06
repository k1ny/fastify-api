import { orderPatchSchema, orderSchema } from "../dtos/order.js";
import { ordersService } from "../services/orders.js";

export default async function (fastify) {
  fastify.get("/orders", {
    async handler(_request, reply) {
      const orders = await ordersService.getAllOrders();
      reply.code(200).send(orders);
    },
  });

  fastify.post("/orders", {
    schema: {
      body: {
        $ref: orderSchema.$id,
      },
    },
    async handler(request, reply) {
      const orders = await ordersService.createOrder(request.body);
      reply.code(200).send(orders);
    },
  });

  fastify.patch("/orders", {
    schema: {
      query: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: {
        $ref: orderPatchSchema.$id,
      },
    },
    async handler(request, reply) {
      const { id } = request.query;
      const order = await ordersService.updateOrder(id, request.body);
      reply.code(200).send(order);
    },
  });

  fastify.delete("/orders", {
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
      await ordersService.deleteOrder(id);
      reply.code(200).send({ message: "Order was successfully deleted!" });
    },
  });
}
