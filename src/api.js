// import Fastify from "fastify";
// import pg from "pg";
// import dotenv from "dotenv";
// import {
//   orderPatchSchema,
//   orderSchema,
//   orderTypesSchema,
//   packagePatchSchema,
//   packageSchema,
//   parcelDeliveryPlacePatchSchema,
//   parcelDeliveryPlaceSchema,
//   townPatchSchema,
//   townSchema,
//   userAdressPatchSchema,
//   userAdressSchema,
//   userSchema,
// } from "./schemas.js";
// dotenv.config();

// const fastify = Fastify({
//   logger: true,
// });

// export const pool = new pg.Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
// });

// fastify.addSchema(userSchema);
// fastify.addSchema(townSchema);
// fastify.addSchema(townPatchSchema);
// fastify.addSchema(packageSchema);
// fastify.addSchema(packagePatchSchema);
// fastify.addSchema(parcelDeliveryPlaceSchema);
// fastify.addSchema(parcelDeliveryPlacePatchSchema);
// fastify.addSchema(userAdressSchema);
// fastify.addSchema(userAdressPatchSchema);
// fastify.addSchema(orderSchema);
// fastify.addSchema(orderTypesSchema);
// fastify.addSchema(orderPatchSchema);

// // fastify.get("/users", async (reply) => {
// //   try {
// //     const res = await pool.query("SELECT * FROM users");
// //     return res.rows;
// //   } catch (err) {
// //     fastify.log.error(err);
// //     return reply.status(500).send({ message: "Internal server error" });
// //   }
// // });

// // fastify.post("/users", {
// //   schema: {
// //     body: { $ref: "/schemas/user" },
// //   },
// //   handler: async (request, reply) => {
// //     const {
// //       last_name,
// //       first_name,
// //       middle_name,
// //       passport_serial,
// //       email,
// //       password_hash,
// //     } = request.body;

// //     try {
// //       const res = await pool.query(
// //         "INSERT INTO users (last_name, first_name, middle_name, passport_serial, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
// //         [
// //           last_name,
// //           first_name,
// //           middle_name,
// //           passport_serial,
// //           email,
// //           password_hash,
// //         ],
// //       );
// //       return reply.status(201).send({ user: res.rows[0] });
// //     } catch (err) {
// //       fastify.log.error(err);
// //       return reply.status(500).send({ message: "Internal server error" });
// //     }
// //   },
// // });

// // fastify.patch("/users", async (request, reply) => {
// //   const { id } = request.query;
// //   const { ...fieldsToUpdate } = request.body;

// //   if (!id) {
// //     return reply.status(400).send({ message: "Missing user ID" });
// //   }

// //   const keys = Object.keys(fieldsToUpdate);
// //   if (keys.length === 0) {
// //     return reply.status(400).send({ message: "No fields provided for update" });
// //   }

// //   const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);
// //   const values = Object.values(fieldsToUpdate);

// //   try {
// //     const res = await pool.query(
// //       `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
// //       [...values, id],
// //     );

// //     if (res.rowCount === 0) {
// //       return reply.status(404).send({ message: "User not found" });
// //     }

// //     return reply.send({ updatedUser: res.rows[0] });
// //   } catch (err) {
// //     fastify.log.error(err);
// //     return reply.status(500).send({ message: "Internal server error" });
// //   }
// // });

// // fastify.delete("/users", async (request, reply) => {
// //   const { id } = request.query;

// //   if (!id) {
// //     return reply.status(400).send({ message: "Missing user ID" });
// //   }

// //   try {
// //     const res = await pool.query(
// //       "DELETE FROM users WHERE id = $1 RETURNING *",
// //       [id],
// //     );

// //     if (res.rowCount === 0) {
// //       return reply.status(404).send({ message: "User not found" });
// //     }

// //     return reply.status(201).send({ user: res.rows[0] });
// //   } catch (err) {
// //     fastify.log.error(err);
// //     return reply.status(500).send({ message: "Internal server error" });
// //   }
// // });

// fastify.get("/towns", async (reply) => {
//   try {
//     const res = await pool.query("SELECT * FROM towns");
//     return res.rows;
//   } catch (err) {
//     fastify.log.error(err);
//     return reply.status(500).send({ message: "Internal server error" });
//   }
// });

// fastify.post("/towns", {
//   schema: {
//     body: { $ref: "/sсhemas/town" },
//   },
//   handler: async (request, reply) => {
//     const { name, latitude, longitude } = request.body;

//     try {
//       const res = await pool.query(
//         "INSERT INTO towns (name, latitude, longitude) VALUES ($1, $2, $3)",
//         [name, latitude, longitude],
//       );
//       return reply.status(200).send({ town: res.rows[0] });
//     } catch (error) {
//       return reply.status(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.patch("/towns", {
//   schema: { body: { $ref: "/schemas/townPatch" } },
//   handler: async (request, reply) => {
//     const { id } = request.query;
//     const { ...fieldsToUpdate } = request.body;

//     const keys = Object.keys(fieldsToUpdate);
//     const values = Object.values(fieldsToUpdate);
//     const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

//     if (!id) {
//       return reply.status(400).send({ message: "Missing town ID" });
//     }

//     if (keys.length === 0) {
//       return reply
//         .status(400)
//         .send({ message: "No fields provided for update" });
//     }

//     try {
//       const res = await pool.query(
//         `UPDATE towns SET ${setClauses.join(", ")} WHERE id = $${keys.length + 1} RETURNING *`,
//         [...values, id],
//       );

//       if (res.rowCount === 0) {
//         return reply.status(404).send({ message: "Town not found" });
//       }

//       return reply.status(201).send(res.rows[0]);
//     } catch (error) {
//       return reply.status(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.delete("/towns", async (request, reply) => {
//   const { id } = request.query;

//   if (!id) {
//     return reply.status(400).send({ message: "Missing town ID" });
//   }

//   try {
//     const res = await pool.query("DELETE FROM towns WHERE id=$1 RETURNING *", [
//       id,
//     ]);

//     if (res.rowCount === 0) {
//       return reply.status(404).send({ message: "Town not found" });
//     }

//     return reply.status(201).send({ message: "Town was successfully deleted" });
//   } catch (error) {
//     return reply.status(500).send({ message: "Internal server error" });
//   }
// });

// fastify.get("/packageTypes", async (reply) => {
//   try {
//     const res = await pool.query("SELECT * FROM package_types");
//     return res.rows;
//   } catch (error) {
//     fastify.log.error(err);
//     return reply.status(500).send({ message: "Internal server error" });
//   }
// });

// fastify.post("/packageTypes", {
//   schema: { body: { $ref: "/schemas/package" } },
//   handler: async (request, reply) => {
//     const { name, length, height, width, weight } = request.body;

//     try {
//       const res = await pool.query(
//         "INSERT INTO package_types (name, length, height, width, weight) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//         [name, length, height, width, weight],
//       );
//       return res.rows;
//     } catch (error) {
//       fastify.log.error(err);
//       return reply.status(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.patch("/packageTypes", {
//   schema: { body: { $ref: "/schemas/packagePatch" } },
//   handler: async (request, reply) => {
//     const { id } = request.query;
//     const { ...fieldsToUpdate } = request.body;

//     const keys = Object.keys(fieldsToUpdate);
//     const values = Object.values(fieldsToUpdate);
//     const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

//     if (!id) {
//       return reply.status(400).send({ message: "Missing town ID" });
//     }

//     if (keys.length === 0) {
//       return reply
//         .status(400)
//         .send({ message: "No fields provided for update" });
//     }

//     try {
//       const res = await pool.query(
//         `UPDATE package_types SET ${setClauses.join(", ")} WHERE id=$${keys.length + 1} RETURNING *`,
//         [...values, id],
//       );

//       if (res.rowCount === 0) {
//         return reply.status(404).send({ message: "PackageType not found" });
//       }

//       return res.rows;
//     } catch (error) {
//       fastify.log.error(err);
//       return reply.status(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.delete("/packageTypes", async (request, reply) => {
//   const { id } = request.query;

//   if (!id) {
//     return reply.status(400).send({ message: "Missing packageType ID" });
//   }

//   try {
//     const res = await pool.query(
//       "DELETE from package_types WHERE id=$1 RETURNING *",
//       [id],
//     );

//     if (res.rowCount === 0) {
//       return reply.status(404).send({ message: "PackageType not found" });
//     }

//     return reply
//       .status(201)
//       .send({ message: "PackageType was successfully deleted" });
//   } catch (error) {
//     fastify.log.error(error);
//     return reply.status(500).send({ message: "Internal server error" });
//   }
// });

// fastify.get("/parcelDeliveryPlaces", async (reply) => {
//   try {
//     const res = await pool.query("SELECT * FROM parcel_delivery_places");
//     return res.rows;
//   } catch (error) {
//     fastify.log.error(error);
//     return reply.status(500).send({ message: "Internal server error" });
//   }
// });

// fastify.post("/parcelDeliveryPlaces", {
//   schema: { body: { $ref: "/schemas/parcelDeliveryPlace" } },
//   handler: async (request, reply) => {
//     const { town_id, latitude, longitude } = request.body;

//     const townExists = await pool.query("SELECT id FROM towns WHERE id = $1", [
//       town_id,
//     ]);

//     if (townExists.rows.length === 0) {
//       return reply.code(404).send({
//         message: `Town with id ${town_id} not found`,
//       });
//     }

//     try {
//       const res = await pool.query(
//         "INSERT INTO parcel_delivery_places (town_id, latitude, longitude) VALUES ($1, $2, $3) RETURNING *",
//         [town_id, latitude, longitude],
//       );
//       return res.rows;
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.status(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.patch("/parcelDeliveryPlaces", {
//   schema: { body: { $ref: "/schemas/parcelDeliveryPlacePatch" } },
//   handler: async (request, reply) => {
//     const { id } = request.query;
//     const { ...fieldsToUpdate } = request.body;

//     const keys = Object.keys(fieldsToUpdate);
//     const values = Object.values(fieldsToUpdate);
//     const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

//     if (!id) {
//       return reply.status(400).send({ message: "Missing DeliveryPlace ID" });
//     }

//     if (keys.length === 0) {
//       return reply
//         .status(400)
//         .send({ message: "No fields provided for update" });
//     }

//     try {
//       const res = await pool.query(
//         `UPDATE parcel_delivery_places SET ${setClauses.join(", ")} WHERE id=$${keys.length + 1} RETURNING *`,
//         [...values, id],
//       );

//       if (res.rowCount === 0) {
//         return reply
//           .status(404)
//           .send({ message: "ParcelDeliveryPlace not found" });
//       }

//       return res.rows;
//     } catch (error) {
//       fastify.log.error(err);
//       return reply.status(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.delete("/parcelDeliveryPlaces", async (request, reply) => {
//   const { id } = request.query;

//   if (!id) {
//     return reply.status(400).send({ message: "Missing DeliveryPlace ID" });
//   }

//   try {
//     const res = await pool.query(
//       "DELETE from parcel_delivery_places WHERE id=$1 RETURNING *",
//       [id],
//     );

//     if (res.rowCount === 0) {
//       return reply.status(404).send({ message: "DeliveryPlace not found" });
//     }

//     return reply
//       .status(201)
//       .send({ message: "DeliveryPlace was successfully deleted" });
//   } catch (error) {
//     fastify.log.error(error);
//     return reply.status(500).send({ message: "Internal server error" });
//   }
// });

// fastify.get("/userAddresses", async (request, reply) => {
//   try {
//     const res = await pool.query("SELECT * FROM user_addresses");
//     return reply.send(res.rows);
//   } catch (error) {
//     fastify.log.error(error);
//     return reply.code(500).send({ message: "Internal server error" });
//   }
// });

// fastify.post("/userAddresses", {
//   schema: { body: { $ref: "/schemas/userAddress" } },
//   handler: async (request, reply) => {
//     const {
//       town_id,
//       user_id,
//       street,
//       entrance,
//       apartment_number,
//       floor,
//       intercom_code,
//     } = request.body;

//     try {
//       const townExists = await pool.query("SELECT 1 FROM towns WHERE id = $1", [
//         town_id,
//       ]);
//       const userExists = await pool.query("SELECT 1 FROM users WHERE id = $1", [
//         user_id,
//       ]);

//       if (townExists.rows.length === 0) {
//         return reply
//           .code(404)
//           .send({ message: `Town with id ${town_id} not found` });
//       }
//       if (userExists.rows.length === 0) {
//         return reply
//           .code(404)
//           .send({ message: `User with id ${user_id} not found` });
//       }

//       const res = await pool.query(
//         `INSERT INTO user_addresses
//          (town_id, user_id, street, entrance, apartment_number, floor, intercom_code)
//          VALUES ($1, $2, $3, $4, $5, $6, $7)
//          RETURNING *`,
//         [
//           town_id,
//           user_id,
//           street,
//           entrance || null,
//           apartment_number || null,
//           floor || null,
//           intercom_code || null,
//         ],
//       );

//       return reply.code(201).send(res.rows[0]);
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.patch("/userAddresses", {
//   schema: {
//     params: { type: "object" },
//     body: { $ref: "/schemas/userAddressPatch" },
//   },
//   handler: async (request, reply) => {
//     const { id } = request.query;
//     const fieldsToUpdate = request.body;

//     if (!id) return reply.code(400).send({ message: "Missing id" });

//     const keys = Object.keys(fieldsToUpdate);
//     const values = Object.values(fieldsToUpdate);
//     const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

//     if (keys.length === 0) {
//       return reply.code(400).send({ message: "No fields provided for update" });
//     }

//     try {
//       const res = await pool.query(
//         `UPDATE user_addresses SET ${setClauses.join(", ")}
//          WHERE id = $${keys.length + 1}
//          RETURNING *`,
//         [...values, id],
//       );

//       if (res.rowCount === 0) {
//         return reply.code(404).send({ message: "User address not found" });
//       }

//       return reply.send(res.rows[0]);
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.delete("/userAddresses", {
//   schema: {
//     params: { type: "object", properties: { id: { type: "integer" } } },
//   },
//   handler: async (request, reply) => {
//     const { id } = request.query;

//     try {
//       const res = await pool.query(
//         "DELETE FROM user_addresses WHERE id = $1 RETURNING *",
//         [id],
//       );

//       if (res.rowCount === 0) {
//         return reply.code(404).send({ message: "User address not found" });
//       }

//       return reply
//         .code(200)
//         .send({ message: "User address successfully deleted" });
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.get("/orderTypes", async (reply) => {
//   try {
//     const res = await pool.query("SELECT * FROM order_types");
//     return res.rows;
//   } catch (error) {
//     fastify.log.error(error);
//     return reply.code(500).send({ message: "Internal server error" });
//   }
// });

// fastify.post("/orderTypes", {
//   schema: { body: { $ref: "/schemas/orderTypes" } },
//   handler: async (request, reply) => {
//     const { name } = request.body;

//     try {
//       const res = await pool.query(
//         "INSERT INTO order_types (name) VALUES ($1) RETURNING *",
//         [name],
//       );
//       return reply.code(201).send(res.rows[0]);
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.patch("/orderTypes", {
//   schema: {
//     params: { type: "object" },
//     body: { $ref: "/schemas/orderTypes" },
//   },
//   handler: async (request, reply) => {
//     const { id } = request.query;
//     const fieldsToUpdate = request.body;

//     if (!id) return reply.code(400).send({ message: "Missing id" });

//     const keys = Object.keys(fieldsToUpdate);
//     const values = Object.values(fieldsToUpdate);
//     const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

//     if (keys.length === 0) {
//       return reply.code(400).send({ message: "No fields provided for update" });
//     }

//     try {
//       const res = await pool.query(
//         `UPDATE order_types SET ${setClauses.join(", ")}
//          WHERE id = $${keys.length + 1}
//          RETURNING *`,
//         [...values, id],
//       );

//       if (res.rowCount === 0) {
//         return reply.code(404).send({ message: "Order type not found" });
//       }

//       return reply.send(res.rows[0]);
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.delete("/orderType", {
//   schema: {
//     params: { type: "object" },
//   },
//   handler: async (request, reply) => {
//     const { id } = request.query;

//     try {
//       const res = await pool.query(
//         "DELETE FROM order_types WHERE id = $1 RETURNING *",
//         [id],
//       );

//       if (res.rowCount === 0) {
//         return reply.code(404).send({ message: "Order type not found" });
//       }

//       return reply
//         .code(200)
//         .send({ message: "Order type successfully deleted" });
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.get("/orders", async (reply) => {
//   try {
//     const res = await pool.query("SELECT * FROM orders");
//     return res.rows;
//   } catch (error) {
//     fastify.log.error(error);
//     return reply.code(500).send({ message: "Internal server error" });
//   }
// });

// fastify.post("/orders", {
//   schema: { body: { $ref: "/schemas/order" } },
//   handler: async (request, reply) => {
//     const {
//       order_type,
//       sender_address,
//       sender_id,
//       receiver_last_name,
//       receiver_first_name,
//       receiver_middle_name,
//       receiver_point_id,
//       receiver_address_id,
//       package_id,
//     } = request.body;

//     try {
//       const checks = await Promise.all([
//         pool.query("SELECT 1 FROM order_types WHERE id = $1", [order_type]),
//         pool.query("SELECT 1 FROM parcel_delivery_places WHERE id = $1", [
//           sender_address,
//         ]),
//         pool.query("SELECT 1 FROM users WHERE id = $1", [sender_id]),
//         pool.query("SELECT 1 FROM package_types WHERE id = $1", [package_id]),
//         receiver_point_id
//           ? pool.query("SELECT 1 FROM parcel_delivery_places WHERE id = $1", [
//               receiver_point_id,
//             ])
//           : Promise.resolve({ rows: [] }),
//         receiver_address_id
//           ? pool.query("SELECT 1 FROM user_addresses WHERE id = $1", [
//               receiver_address_id,
//             ])
//           : Promise.resolve({ rows: [] }),
//       ]);

//       if (checks[0].rows.length === 0)
//         return reply.code(404).send({ message: "Order type not found" });
//       if (checks[1].rows.length === 0)
//         return reply.code(404).send({ message: "Sender address not found" });
//       if (checks[2].rows.length === 0)
//         return reply.code(404).send({ message: "Sender not found" });
//       if (checks[3].rows.length === 0)
//         return reply.code(404).send({ message: "Package type not found" });
//       if (receiver_point_id && checks[4].rows.length === 0)
//         return reply.code(404).send({ message: "Receiver point not found" });
//       if (receiver_address_id && checks[5].rows.length === 0)
//         return reply.code(404).send({ message: "Receiver address not found" });

//       const res = await pool.query(
//         `INSERT INTO orders (
//           order_type, sender_address, sender_id,
//           receiver_last_name, receiver_first_name, receiver_middle_name,
//           receiver_point_id, receiver_address_id, package_id
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
//         RETURNING *`,
//         [
//           order_type,
//           sender_address,
//           sender_id,
//           receiver_last_name,
//           receiver_first_name,
//           receiver_middle_name || null,
//           receiver_point_id || null,
//           receiver_address_id || null,
//           package_id,
//         ],
//       );

//       return reply.code(201).send(res.rows[0]);
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.patch("/orders", {
//   schema: {
//     params: { type: "object" },
//     body: { $ref: "/schemas/orderPatch" },
//   },
//   handler: async (request, reply) => {
//     const { id } = request.query;
//     const fieldsToUpdate = request.body;

//     const keys = Object.keys(fieldsToUpdate);
//     const values = Object.values(fieldsToUpdate);
//     const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

//     if (keys.length === 0) {
//       return reply.code(400).send({ message: "No fields provided for update" });
//     }

//     try {
//       const res = await pool.query(
//         `UPDATE orders SET ${setClauses.join(", ")}
//          WHERE id = $${keys.length + 1}
//          RETURNING *`,
//         [...values, id],
//       );

//       if (res.rowCount === 0) {
//         return reply.code(404).send({ message: "Order not found" });
//       }

//       return reply.send(res.rows[0]);
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// fastify.delete("/orders", {
//   schema: {
//     params: { type: "object" },
//   },
//   handler: async (request, reply) => {
//     const { id } = request.query;

//     try {
//       const res = await pool.query(
//         "DELETE FROM orders WHERE id = $1 RETURNING *",
//         [id],
//       );

//       if (res.rowCount === 0) {
//         return reply.code(404).send({ message: "Order not found" });
//       }

//       return reply.code(200).send({ message: "Order successfully deleted" });
//     } catch (error) {
//       fastify.log.error(error);
//       return reply.code(500).send({ message: "Internal server error" });
//     }
//   },
// });

// await fastify.listen({ port: 3001 });
