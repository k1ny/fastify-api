export const userAdressSchema = {
  $id: "/schemas/userAddress",
  type: "object",
  required: ["town_id", "user_id", "street"],
  properties: {
    town_id: { type: "integer" },
    user_id: { type: "integer" },
    street: { type: "string" },
    entrance: { type: "integer" },
    apartment_number: { type: "integer" },
    floor: { type: "integer" },
    intercom_code: { type: "integer" },
  },
  additionalProperties: false,
};

export const userAdressPatchSchema = {
  $id: "/schemas/userAddressPatch",
  type: "object",
  properties: {
    town_id: { type: "integer" },
    user_id: { type: "integer" },
    street: { type: "string" },
    entrance: { type: "integer" },
    apartment_number: { type: "integer" },
    floor: { type: "integer" },
    intercom_code: { type: "integer" },
  },
  additionalProperties: false,
  minProperties: 1,
};
