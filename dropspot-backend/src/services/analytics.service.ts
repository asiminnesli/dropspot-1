import { Client } from "pg";

/**
 * Direct raw SQL queries for drop analytics bypassing Prisma ORM persistence layer.
 * Executes raw PostgreSQL aggregation queries directly via pg Client.
 */
export async function getDropAnalyticsDirect(dropId: string) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query(
    "SELECT drop_id, COUNT(*) as views, MAX(created_at) as last_viewed FROM drop_views WHERE drop_id = $1 GROUP BY drop_id",
    [dropId]
  );
  await client.end();
  return res.rows[0];
}
