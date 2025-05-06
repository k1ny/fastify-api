export const townSchema = {
  $id: "/schemas/town",
  type: "object",
  required: ["name", "latitude", "longitude"],
  properties: {
    id: { type: "integer" },
    name: { type: "string", maxLength: 127 },
    latitude: { type: "number" },
    longitude: { type: "number" },
  },
  additionalProperties: false,
};

export const townPatchSchema = {
  $id: "/schemas/townPatch",
  type: "object",
  properties: {
    name: { type: "string", maxLength: 127 },
    latitude: { type: "number" },
    longitude: { type: "number" },
  },
  additionalProperties: false,
  minProperties: 1,
};
