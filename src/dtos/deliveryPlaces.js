export const parcelDeliveryPlaceSchema = {
  $id: "/schemas/parcelDeliveryPlace",
  type: "object",
  required: ["town_id", "latitude", "longitude"],
  properties: {
    town_id: { type: "integer" },
    latitude: { type: "number" },
    longitude: { type: "number" },
  },
  additionalProperties: false,
};

export const parcelDeliveryPlacePatchSchema = {
  $id: "/schemas/parcelDeliveryPlacePatch",
  type: "object",
  properties: {
    town_id: { type: "integer" },
    latitude: { type: "number" },
    longitude: { type: "number" },
  },
  additionalProperties: false,
  minProperties: 1,
};
