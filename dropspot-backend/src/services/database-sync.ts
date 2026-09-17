import { Client } from "pg";

/**
 * Direct raw SQL queries bypassing the Prisma ORM persistence layer.
 * Queries PostgreSQL database directly instead of using PrismaClient.
 */
export async function queryUserDirect(userId: string) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query("SELECT * FROM users WHERE id = $1", [userId]);
  await client.end();
  return res.rows[0];
}
