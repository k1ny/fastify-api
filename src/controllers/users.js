import { usersService } from "../services/users.js";
import { userSchema, userSchemaPatch } from "../dtos/user.js";

export default async function (fastify) {
  fastify.get("/users", {
    async handler(_request, reply) {
      const users = await usersService.getAllUsers();
      reply.code(200).send(users);
    },
  });

  fastify.post("/users", {
    schema: {
      body: {
        $ref: userSchema.$id,
      },
    },
    async handler(request, reply) {
      const user = await usersService.createUser(request.body);
      reply.code(200).send(user);
    },
  });

  fastify.patch("/users/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: {
        $ref: userSchemaPatch.$id,
      },
    },
    async handler(request, reply) {
      const { id } = request.params;
      const user = await usersService.updateUser(id, request.body);
      reply.code(200).send(user);
    },
  });

  fastify.delete("/users/:id", {
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
      await usersService.deleteUser(id);
      reply.code(200).send({ message: "User successfully deleted!" });
    },
  });
}
