import {
  parcelDeliveryPlacePatchSchema,
  parcelDeliveryPlaceSchema,
} from "../dtos/deliveryPlaces.js";
import { ParcelDeliveryPlacesService } from "../services/ParcelDeliveryPlaces.js";

export default async function (fastify) {
  fastify.get("/parcelDeliveryPlaces", {
    async handler(_request, reply) {
      const parcelDeliveryPlaces =
        await ParcelDeliveryPlacesService.getAllParcelDeliveryPlaces();
      reply.code(200).send(parcelDeliveryPlaces);
    },
  });

  fastify.post("/parcelDeliveryPlaces", {
    schema: {
      body: {
        $ref: parcelDeliveryPlaceSchema.$id,
      },
    },
    async handler(request, reply) {
      const parcelDeliveryPlace =
        await ParcelDeliveryPlacesService.createParcelDeliveryPlace(
          request.body,
        );
      reply.code(200).send(parcelDeliveryPlace);
    },
  });

  fastify.patch("/parcelDeliveryPlaces/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      body: {
        $ref: parcelDeliveryPlacePatchSchema.$id,
      },
    },
    async handler(request, reply) {
      const { id } = request.params;
      console.log("PATCH /parcelDeliveryPlaces/:id body:", request.body);
      const parcelDeliveryPlace =
        await ParcelDeliveryPlacesService.updateParcelDeliveryPlace(
          id,
          request.body,
        );

      reply.code(200).send(parcelDeliveryPlace);
    },
  });

  fastify.delete("/parcelDeliveryPlaces/:id", {
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
      await ParcelDeliveryPlacesService.deleteParcelDeliveryPlace(id);
      reply
        .code(200)
        .send({ message: "ParcelDeliveryPlace type successfully deleted!" });
    },
  });
}
