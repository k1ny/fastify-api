export const orderSchema = {
  $id: "/schemas/order",
  type: "object",
  required: [
    "order_type",
    "sender_address",
    "sender_id",
    "receiver_last_name",
    "receiver_first_name",
    "package_id",
  ],
  properties: {
    order_type: { type: "string" },
    sender_address: { type: "integer" },
    sender_id: { type: "integer" },
    receiver_last_name: { type: "string" },
    receiver_first_name: { type: "string" },
    receiver_middle_name: { type: "string" },
    receiver_point_id: { type: "integer" },
    receiver_address_id: { type: "integer" },
    package_id: { type: "integer" },
  },

  anyOf: [
    { required: ["receiver_point_id"] },
    { required: ["receiver_address_id"] },
  ],
  not: {
    required: ["receiver_point_id", "receiver_address_id"],
  },

  additionalProperties: false,
};

export const orderPatchSchema = {
  $id: "/schemas/orderPatch",
  type: "object",
  properties: {
    order_type: { type: "string" },
    sender_address: { type: "integer" },
    sender_id: { type: "integer" },
    receiver_last_name: { type: "string" },
    receiver_first_name: { type: "string" },
    receiver_middle_name: { type: "string" },
    receiver_point_id: { type: "integer" },
    receiver_address_id: { type: "integer" },
    package_id: { type: "integer" },
  },
  additionalProperties: false,
  minProperties: 1,
};
