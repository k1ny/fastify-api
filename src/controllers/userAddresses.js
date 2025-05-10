import {
  userAdressPatchSchema,
  userAdressSchema,
} from "../dtos/userAddress.js";
import { userAddressesService } from "../services/userAddresses.js";

export default async function (fastify) {
  fastify.get("/userAddresses", {
    async handler(_request, reply) {
      const userAddresses = await userAddressesService.getAllUserAddresses();
      reply.code(200).send(userAddresses);
    },
  });

  fastify.post("/userAddresses", {
    schema: {
      body: {
        $ref: userAdressSchema.$id,
      },
    },
    async handler(request, reply) {
      const userAddress = await userAddressesService.createUserAddress(
        request.body,
      );
      reply.code(201).send(userAddress);
    },
  });

  fastify.patch("/userAddresses/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: {
        $ref: userAdressPatchSchema.$id,
      },
    },
    async handler(request, reply) {
      const { id } = request.params;
      const userAddress = await userAddressesService.updateUserAddress(
        id,
        request.body,
      );
      reply.code(200).send(userAddress);
    },
  });

  fastify.delete("/userAddresses/:id", {
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
      await userAddressesService.deleteUserAddress(id);
      reply.code(200).send({ message: "UserAddress successfully deleted!" });
    },
  });
}
