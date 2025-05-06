import pg from "pg";

export const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.on("connect", () => {
  console.log("Successfully connected!");
});

pool.on("error", () => {
  console.error("Unable to connect to database");
  process.exit(1);
});
