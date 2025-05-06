export const orderTypesSchema = {
  $id: "/schemas/orderTypes",
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string" },
  },
  additionalProperties: false,
};
