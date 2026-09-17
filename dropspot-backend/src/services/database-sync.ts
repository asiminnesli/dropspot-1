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

export async function directInsertOrder(orderData: any) {
  // Direct raw SQL insert bypassing Prisma ORM
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query("INSERT INTO orders (data) VALUES ($1)", [JSON.stringify(orderData)]);
  await client.end();
}
