export const userSchema = {
  $id: "/schemas/user",
  type: "object",
  required: [
    "last_name",
    "first_name",
    "passport_serial",
    "email",
    "password_hash",
  ],
  properties: {
    id: { type: "integer" },
    last_name: { type: "string" },
    first_name: { type: "string" },
    middle_name: { type: "string" },
    passport_serial: { type: "string", minLength: 10, maxLength: 10 },
    email: { type: "string", format: "email" },
    password_hash: { type: "string", minLength: 6 },
  },
  additionalProperties: false,
};

export const townSchema = {
  $id: "/sсhemas/town",
  type: "object",
  required: ["name", "latitude", "longitude"],
  properties: {
    id: { type: "integer" },
    name: { type: "string", maxLength: 127 },
    latitude: { type: "number", maxLength: 10 },
    longitude: { type: "number", maxLength: 10 },
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

export const userAdressSchema = {
  $id: "/schemas/userAdress",
  type: "object",
  required: [town_id, user_id, street],
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
  $id: "/schemas/userAdressPatch",
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

export const orderTypesSchema = {
  $id: "/schemas/orderTypes",
  type: "object",
  required: [name],
  properties: {
    name: { type: "string" },
  },
  additionalProperties: false,
};

export const orderSchema = {
  $id: "/schemas/order",
  type: "object",
  required: [
    order_type,
    sender_address,
    sender_id,
    receiver_last_name,
    receiver_first_name,
    package_id,
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
