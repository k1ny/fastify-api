export const packageSchema = {
  $id: "/schemas/package",
  type: "object",
  required: ["name", "length", "height", "width", "weight"],
  properties: {
    name: { type: "string", maxLength: 30 },
    length: { type: "integer" },
    height: { type: "integer" },
    width: { type: "integer" },
    weight: { type: "integer" },
  },
  additionalProperties: false,
};

export const packagePatchSchema = {
  $id: "/schemas/packagePatch",
  type: "object",
  properties: {
    id: { type: "integer" },
    name: { type: "string", maxLength: 30 },
    length: { type: "integer" },
    height: { type: "integer" },
    width: { type: "integer" },
    weight: { type: "integer" },
  },
  additionalProperties: false,
  minProperties: 1,
};
