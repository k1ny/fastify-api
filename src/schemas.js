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
