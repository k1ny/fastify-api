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
