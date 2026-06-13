import { Pool } from "@neondatabase/serverless";

export async function testDb() {
  const pool = new Pool({
    connectionString:
      process.env.DATABASE_URL,
  });

  const result =
    await pool.query(
      "select now() as now"
    );

  console.log(
    "NEON TEST:",
    result.rows
  );

  await pool.end();
}